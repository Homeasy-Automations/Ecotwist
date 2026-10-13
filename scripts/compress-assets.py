#!/usr/bin/env python3
"""
Lossless compression for every image and PDF in the project.

    npm run compress:assets                         # new or changed files only
    npm run compress:assets -- --dry-run            # report savings, write nothing
    npm run compress:assets -- public/catalogue     # limit to folders / files

  PNG   oxipng: re-filtered and re-deflated. Chunks that affect how the image
        renders (colour profile, gamma, transparency) are kept.
  JPEG  mozjpeg lossless transcode: optimised Huffman tables + progressive
        scans. The DCT data is untouched and all metadata is kept.
  PDF   embedded Flate images re-packed with PNG predictors via oxipng, unused
        and duplicate objects removed, uncompressed streams deflated.

Every result is decoded and compared with the original (pixels for images,
image data and rendered pages for PDFs) before it replaces the file, and a
file is only replaced when it gets smaller. WebP/AVIF are left alone: they
are already lossy-compressed and cannot shrink losslessly.

Processed files are recorded in scripts/compress-assets.cache.json, so a
re-run only looks at files added or changed since the last run.

Setup (once):  python -m pip install -r scripts/requirements-compress.txt
"""

import argparse
import hashlib
import io
import json
import os
import struct
import sys
import time
from pathlib import Path

try:
    import fitz  # PyMuPDF
    import mozjpeg_lossless_optimization as mozjpeg
    import oxipng
    from PIL import Image
except ImportError as e:
    sys.exit(f"Missing dependency ({e.name}). Run: python -m pip install -r scripts/requirements-compress.txt")

ROOT = Path(__file__).resolve().parent.parent
CACHE_FILE = ROOT / "scripts" / "compress-assets.cache.json"
SKIP_DIRS = {"node_modules", "dist", ".git", ".vercel", ".vite"}
PNG_EXT, JPEG_EXT, PDF_EXT = {".png"}, {".jpg", ".jpeg"}, {".pdf"}
OXIPNG_LEVEL = 4

Image.MAX_IMAGE_PIXELS = None  # large catalogue artwork is expected


class NotLossless(Exception):
    pass


# ── PNG ──────────────────────────────────────────────────────────────────────
def decode_pixels(data: bytes):
    im = Image.open(io.BytesIO(data))
    im.load()
    return im


def same_pixels(a: Image.Image, b: Image.Image) -> bool:
    if a.size != b.size:
        return False
    if a.mode == b.mode:
        return a.tobytes() == b.tobytes()
    # oxipng may store the same pixels in a smaller colour type (e.g. RGBA -> RGB)
    return a.convert("RGBA").tobytes() == b.convert("RGBA").tobytes()


def compress_png(data: bytes):
    original = decode_pixels(data)
    if getattr(original, "n_frames", 1) > 1:
        return None  # animated PNG: leave as is
    out = oxipng.optimize_from_memory(data, level=OXIPNG_LEVEL, strip=oxipng.StripChunks.safe())
    if len(out) >= len(data):
        return None
    if not same_pixels(original, decode_pixels(out)):
        raise NotLossless("decoded pixels differ")
    return out


# ── JPEG ─────────────────────────────────────────────────────────────────────
def compress_jpeg(data: bytes):
    out = mozjpeg.optimize(data, copy=mozjpeg.COPY_MARKERS.ALL)
    if len(out) >= len(data):
        return None
    a, b = decode_pixels(data), decode_pixels(out)
    if a.size != b.size or a.mode != b.mode or a.tobytes() != b.tobytes():
        raise NotLossless("decoded pixels differ")
    return out


# ── PDF ──────────────────────────────────────────────────────────────────────
def png_idat(png: bytes):
    """Return (IHDR fields, concatenated IDAT zlib stream) of a PNG."""
    pos, ihdr, idat = 8, None, bytearray()
    while pos < len(png):
        length, ctype = struct.unpack(">I4s", png[pos:pos + 8])
        body = png[pos + 8:pos + 8 + length]
        if ctype == b"IHDR":
            ihdr = struct.unpack(">IIBBBBB", body)
        elif ctype == b"IDAT":
            idat += body
        pos += 12 + length
    return ihdr, bytes(idat)


def repack_pdf_image(doc, xref: int) -> int:
    """Re-encode one Flate image with PNG predictors. Returns bytes saved (0 if skipped)."""
    key = lambda k: doc.xref_get_key(xref, k)[1]
    if (key("Subtype") != "/Image" or key("Filter") != "/FlateDecode"
            or key("DecodeParms") != "null" or key("BitsPerComponent") != "8"
            or key("ImageMask") == "true"):
        return 0
    width, height = int(key("Width")), int(key("Height"))
    stored = doc.xref_stream_raw(xref)
    pixels = doc.xref_stream(xref)
    if not width or not height or len(pixels) % (width * height):
        return 0
    colors = len(pixels) // (width * height)
    if colors not in (1, 3):
        return 0  # PNG predictors here only for gray / RGB (not CMYK)

    color_type = oxipng.ColorType.rgb() if colors == 3 else oxipng.ColorType.grayscale()
    png = oxipng.RawImage(pixels, width, height, color_type=color_type, bit_depth=8).create_optimized_png(
        level=OXIPNG_LEVEL, interlace=None, strip=oxipng.StripChunks.all(),
        # The PDF dictionary describes the pixel format, so oxipng must not change it
        bit_depth_reduction=False, color_type_reduction=False,
        palette_reduction=False, grayscale_reduction=False,
    )
    ihdr, idat = png_idat(png)
    if ihdr is None or ihdr[2:5] != (8, 2 if colors == 3 else 0, 0) or ihdr[6] != 0:
        return 0
    if len(idat) >= len(stored):
        return 0

    doc.update_stream(xref, idat, compress=False)
    doc.xref_set_key(xref, "Filter", "/FlateDecode")
    doc.xref_set_key(xref, "DecodeParms", f"<</Predictor 15/Colors {colors}/BitsPerComponent 8/Columns {width}>>")
    if doc.xref_stream(xref) != pixels:
        raise NotLossless(f"image xref {xref} decodes differently")
    return len(stored) - len(idat)


def render_pages(doc):
    pages = []
    for page in doc:
        # Empty MuPDF's decoded-image cache first: once duplicate images are merged,
        # a cached copy decoded at another scale would otherwise change the output.
        fitz.TOOLS.store_shrink(100)
        pages.append(page.get_pixmap(dpi=36).samples)
    return pages


def compress_pdf(data: bytes):
    doc = fitz.open(stream=data, filetype="pdf")
    if doc.needs_pass or doc.is_encrypted:
        return None
    before = render_pages(doc)
    for xref in range(1, doc.xref_length()):
        try:
            repack_pdf_image(doc, xref)
        except NotLossless:
            raise
        except Exception:
            continue  # unusual object: leave it untouched
    out = doc.tobytes(garbage=4, deflate=True, use_objstms=1)
    if len(out) >= len(data):
        return None
    check = fitz.open(stream=out, filetype="pdf")
    if check.page_count != doc.page_count or render_pages(check) != before:
        raise NotLossless("rendered pages differ")
    return out


# ── Runner ───────────────────────────────────────────────────────────────────
HANDLERS = [(PNG_EXT, compress_png), (JPEG_EXT, compress_jpeg), (PDF_EXT, compress_pdf)]


def handler_for(path: Path):
    ext = path.suffix.lower()
    return next((fn for exts, fn in HANDLERS if ext in exts), None)


def find_files(targets):
    for target in targets:
        target = target.resolve()
        if target.is_file():
            if handler_for(target):
                yield target
            continue
        for dirpath, dirnames, filenames in os.walk(target):
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS and not d.startswith("."))
            for name in sorted(filenames):
                path = Path(dirpath) / name
                if handler_for(path):
                    yield path


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def mb(n: int) -> str:
    return f"{n / 1048576:6.2f} MB"


def main():
    parser = argparse.ArgumentParser(description="Losslessly compress project images and PDFs.")
    parser.add_argument("paths", nargs="*", help="files or folders (default: whole project)")
    parser.add_argument("--dry-run", action="store_true", help="report savings without writing files")
    parser.add_argument("--force", action="store_true", help="ignore the cache and re-check every file")
    args = parser.parse_args()

    cache = {} if args.force or not CACHE_FILE.exists() else json.loads(CACHE_FILE.read_text())
    targets = [Path(p) for p in args.paths] or [ROOT]
    total_before = total_after = changed = skipped = 0
    failures = []
    started = time.time()

    for path in find_files(targets):
        rel = path.relative_to(ROOT).as_posix()
        data = path.read_bytes()
        digest = sha256(data)
        if cache.get(rel) == digest:
            skipped += 1
            continue
        t = time.time()
        try:
            out = handler_for(path)(data)
        except Exception as e:  # NotLossless or a decoder error: never touch the file
            failures.append(f"{rel}: {e}")
            print(f"  !  {rel}  skipped ({e})", flush=True)
            continue
        total_before += len(data)
        if out is None:
            total_after += len(data)
            cache[rel] = digest
            print(f"  =  {rel}  {mb(len(data))}  already optimal  ({time.time() - t:.1f}s)", flush=True)
            continue
        total_after += len(out)
        changed += 1
        print(f"  -  {rel}  {mb(len(data))} -> {mb(len(out))}  "
              f"(-{100 - 100 * len(out) / len(data):.1f}%, {time.time() - t:.1f}s)", flush=True)
        if not args.dry_run:
            tmp = path.with_name(path.name + ".tmp")
            tmp.write_bytes(out)
            os.replace(tmp, path)
            cache[rel] = sha256(out)

    if not args.dry_run:
        CACHE_FILE.write_text(json.dumps(dict(sorted(cache.items())), indent=2) + "\n")

    saved = total_before - total_after
    print(f"\n{'Would compress' if args.dry_run else 'Compressed'} {changed} file(s), "
          f"saved {mb(saved).strip()}"
          + (f" ({100 * saved / total_before:.1f}% of {mb(total_before).strip()} checked)" if total_before else "")
          + f"; {skipped} unchanged since last run; {time.time() - started:.0f}s")
    if failures:
        print(f"{len(failures)} file(s) left untouched because they could not be verified:")
        for f in failures:
            print(f"   {f}")


if __name__ == "__main__":
    main()
