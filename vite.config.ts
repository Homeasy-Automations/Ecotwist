import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';
import { writeSitemap } from './scripts/generate-sitemap.js';

function autoSitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-auto-sitemap',
    buildStart() {
      try {
        writeSitemap();
      } catch (err) {
        console.error('[sitemap] Error generating sitemap on build:', err);
      }
    },
    configureServer(server) {
      try {
        writeSitemap();
      } catch (err) {
        console.error('[sitemap] Error generating sitemap on server start:', err);
      }

      server.watcher.on('add', (filePath) => {
        if (filePath.includes('App.tsx') || filePath.includes('pages') || filePath.includes('public')) {
          writeSitemap();
        }
      });
      server.watcher.on('unlink', (filePath) => {
        if (filePath.includes('App.tsx') || filePath.includes('pages') || filePath.includes('public')) {
          writeSitemap();
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), autoSitemapPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
