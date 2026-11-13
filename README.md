# Bear Estudio

Website for Bear Estudio, a creative studio in Buenos Aires. It has a one-page landing and a project portfolio with one page per project. It is built with Astro, TypeScript, Tailwind CSS and GSAP, and deployed on Vercel.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check (astro check) + static build to dist/
npm run preview   # serve the production build
```

Requires Node.js 22.23.4 or newer (Astro's minimum).

## Add a project

Each project is one Markdown file in `src/content/projects/`. The filename becomes the URL: `polar.md` → `/proyectos/polar`.

1. Put the images in `src/assets/projects/<slug>/`.
2. Create `src/content/projects/<slug>.md`:

```markdown
---
title: Polar
order: 4                      # position in the home list
tag: Branding                 # short label in the list row
category: Branding & Web      # shown on the detail page
year: 2026                    # optional
description: Branding a partir de una base que tenía que convivir con otra marca.
url: https://example.com      # optional, adds "Link a la web"
cover: ../../assets/projects/polar/01-cover.jpg   # optional, hover preview + OG image
coverAlt: Logo de Polar sobre una cama
gallery:                      # optional, stacked on the detail page
  - src: ../../assets/projects/polar/01-cover.jpg
    alt: Logo de Polar sobre una cama
draft: false                  # true hides it from production builds
---
```

3. Run `npm run build`. The schema in `src/content.config.ts` rejects invalid fields when the site builds.

## Project structure

| Path | Contents |
|------|----------|
| `src/pages/` | Routes: `/`, `/proyectos`, `/proyectos/[slug]`, `robots.txt` |
| `src/components/sections/` | Page sections (Hero, Services, ProjectList, Team, header, footer) |
| `src/components/ui/` | Reusable pieces (ContactButton, PawBadge) |
| `src/scripts/` | GSAP animations, one module per section |
| `src/content/projects/` | Project entries (Content Collection) |
| `src/config/site.ts` | Studio name, email, Instagram, default description |
| `src/styles/global.css` | Design tokens (`@theme`): colors, fonts, fluid sizes |

## Design notes

- **Source of truth:** the Figma file "BEAR ESTUDIO <3", page *Web*. Sizes scale fluidly from the 1920px frames using `clamp()` tokens.
- **Fonts:** Inter and Work Sans come from `@fontsource`. Coolvetica must be added manually at `public/fonts/coolvetica.woff2`; until then, headings fall back to Helvetica/Arial.
- **Motion:** every animation respects `prefers-reduced-motion`, and content stays visible if JavaScript is disabled.

## Deployment

Vercel detects Astro automatically, so the defaults work as-is. Pushing to `main` deploys to production. Other branches and PRs get preview URLs.

The canonical URL, the sitemap and `robots.txt` all use the site URL, which is set at build time:

| Variable | When |
|----------|------|
| `SITE_URL` | Optional manual override |
| `VERCEL_PROJECT_PRODUCTION_URL` | Set automatically by Vercel: the custom domain once one is assigned, otherwise `*.vercel.app` |
| *(none)* | Local builds use `http://localhost:4321` |

To switch to a custom domain, add it in Vercel → Settings → Domains, make it the primary domain, and redeploy. No code changes are needed.
