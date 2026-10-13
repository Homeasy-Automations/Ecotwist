import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "../assests/logo2.png";
import catalogue from "../assests/depawali/Ecotwist Diwali Catalogue-2026.pdf";
import { Diya, Fireworks, Jaali, Kandil, Rangoli, SeriesLights } from "./DiwaliDecor";

/* ============================
   Festive footer, shown instead of Footer.tsx while the Diwali switch in
   src/config/homepage.ts is on. Same links and newsletter as the regular
   footer, which is left untouched.
============================ */

const DEVANAGARI = '"Tiro Devanagari Hindi", "Nirmala UI", "Mangal", serif';
const goldText = "bg-gradient-to-r from-[#F6D27A] via-[#F59E0B] to-[#E9C46A] bg-clip-text text-transparent";

const SOCIALS = [
  { name: "Instagram", href: "https://www.instagram.com/ecotwiststores" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/ecotwiststores/" },
  { name: "Facebook", href: "https://www.facebook.com/ecotwiststore" },
  { name: "Youtube", href: "https://www.youtube.com/@ecotwiststores" },
];

const linkClass = "transition-colors hover:text-[#F6D27A]";

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E9C46A]">
      <span className="h-1.5 w-1.5 rotate-45 bg-[#F59E0B]" />
      {children}
    </h5>
  );
}

export const DiwaliFooter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Same newsletter sign-up as the regular footer
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscribedAt: new Date().toISOString() }),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#12050d] text-white">
      {/* Festive night backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(190,50,90,.28), transparent 70%)," +
            "linear-gradient(180deg, #24091a 0%, #12050d 60%, #0c0409 100%)",
        }}
      />
      <Jaali opacity={0.045} />
      <div className="pointer-events-none absolute -bottom-40 -right-40 hidden md:block">
        <Rangoli className="w-[560px] opacity-[0.07]" />
      </div>
      <div className="pointer-events-none absolute -left-32 top-1/2 hidden md:block">
        <Rangoli className="w-[360px] opacity-[0.05]" />
      </div>

      <SeriesLights variant="warm" />
      {/* short strings keep the lanterns above the greeting */}
      <Kandil className="absolute hidden md:block" style={{ left: "6%", top: 0 }} string={30} width={44} palette="marigold" />
      <Kandil className="absolute hidden md:block" style={{ right: "6%", top: 0 }} string={12} width={44} delay={2} />

      {/* Greeting band */}
      <div className="relative">
        <Fireworks className="absolute inset-0 h-full w-full" onDark />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 pb-12 pt-24 text-center md:pt-36 lg:flex-row lg:justify-between lg:text-left">
          <div>
            {/* padding keeps the vowel marks inside the clipped gold gradient */}
            <p style={{ fontFamily: DEVANAGARI }} className={`py-2 text-4xl leading-normal sm:text-5xl ${goldText}`}>
              शुभ दीपावली
            </p>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Wishing you and your teams a bright, prosperous Diwali, from all of us at Ecotwist.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/occasions/depawali-gifting"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#E9C46A] px-7 py-3.5 text-sm font-semibold text-[#2a0a1c] shadow-[0_12px_36px_-14px_rgba(245,158,11,.8)]"
            >
              Explore Diwali Collection
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center rounded-full border border-[#E9C46A]/60 px-7 py-3.5 text-sm font-medium text-[#F6D27A] transition-colors hover:bg-white/5"
            >
              Get Proposal
            </Link>
          </div>
        </div>

        {/* Diyas on a rangoli-dotted ledge */}
        <div aria-hidden className="relative mx-auto flex max-w-7xl items-end gap-3 px-6 sm:gap-5">
          <span className="mb-3 h-px flex-1 border-t-2 border-dotted border-[#E9C46A]/40" />
          {Array.from({ length: 5 }, (_, i) => (
            <Diya key={i} delay={(i * 0.37) % 1.1} className={`w-9 sm:w-11 ${i === 0 || i === 4 ? "hidden sm:block" : ""}`} />
          ))}
          <span className="mb-3 h-px flex-1 border-t-2 border-dotted border-[#E9C46A]/40" />
        </div>
      </div>

      {/* Links */}
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand & social */}
          <div className="lg:col-span-3">
            <Link to="/" className="group mb-8 flex w-fit flex-col items-start">
              <img src={logo} alt="Ecotwist Logo" className="h-16 w-auto object-contain transition group-hover:scale-105 sm:h-20" />
              <span className="mt-2 font-serif text-xl font-bold uppercase tracking-widest text-white sm:text-2xl">ECOTWIST</span>
            </Link>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/55">
              Pioneering the future of corporate gifting through sustainable design, ethical sourcing, and circular economy principles.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-widest text-white/55 transition-colors hover:text-[#F6D27A]"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <ColumnHeading>Diwali 2026</ColumnHeading>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link to="/occasions/depawali-gifting" className={linkClass}>Diwali Collection</Link></li>
                <li><a href={catalogue} target="_blank" rel="noopener noreferrer" className={linkClass}>Diwali Catalogue</a></li>
                <li><Link to="/products?category=Gift%20Boxes" className={linkClass}>Gift Boxes</Link></li>
                <li><Link to="/configurator" className={linkClass}>Get Proposal</Link></li>
              </ul>
            </div>
            <div>
              <ColumnHeading>Solutions</ColumnHeading>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link to="/solutions" className={linkClass}>Custom Bundles</Link></li>
                <li><Link to="/contact" className={linkClass}>Eco-Consultancy</Link></li>
                <li><a href="#" className={linkClass}>White-Label</a></li>
                <li><Link to="/impact" className={linkClass}>Impact Reports</Link></li>
              </ul>
            </div>
            <div>
              <ColumnHeading>Company</ColumnHeading>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link to="/impact" className={linkClass}>Our Artisans</Link></li>
                <li><Link to="/impact" className={linkClass}>Impact 2026</Link></li>
                <li><a href="#" className={linkClass}>Careers</a></li>
                <li><a href="#" className={linkClass}>Press Kit</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <ColumnHeading>Newsletter</ColumnHeading>
            <p className="mb-6 text-xs leading-relaxed text-white/55">
              Receive sustainable gifting insights and new collection previews.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={`rounded-full border bg-white/5 px-5 py-3 text-sm text-white transition-colors placeholder:text-white/35 focus:outline-none ${
                  error ? "border-red-500" : "border-[#E9C46A]/25 focus:border-[#E9C46A]"
                }`}
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              {message && <p className="text-xs text-green-400">{message}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-[#F59E0B] to-[#E9C46A] py-3 text-sm font-bold uppercase tracking-widest text-[#2a0a1c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-[#E9C46A]/15 px-6 pb-10 pt-8 md:flex-row">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>© 2024 ECOTWIST.</span>
          <Link to="/privacy-policy" className={linkClass}>Privacy Policy</Link>
          <Link to="/terms-of-service" className={linkClass}>Terms of Service</Link>
          <Link to="/refund-policy" className={linkClass}>Refund Policy</Link>
          <Link to="/shipping-policy" className={linkClass}>Shipping Policy</Link>
        </div>
        <div className="flex items-center gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/40">
          Designed with purpose for a better planet.
          <span className="text-[#E9C46A]">✦</span>
          <span style={{ fontFamily: DEVANAGARI }} className="text-xs normal-case tracking-normal text-[#F6D27A]/80">शुभ दीपावली</span>
        </div>
      </div>
    </footer>
  );
};
