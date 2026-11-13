// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Canonical site URL, resolved at build time:
 * 1. SITE_URL, an explicit override;
 * 2. VERCEL_PROJECT_PRODUCTION_URL, set by Vercel (the custom domain once assigned, otherwise *.vercel.app);
 * 3. localhost for local builds.
 */
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
