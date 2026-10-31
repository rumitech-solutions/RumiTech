# RumiTech Solutions — official website

A fast, accessible, dependency-free static website (Node 18+ only; no `npm install` needed).
Generated pages live in `dist/` and deploy as-is to **Cloudflare Pages**.

## Commands
```
npm run build      # generates dist/, sitemap.xml, robots.txt, OWNER-TODO.md; validates links & headings
npm run preview    # serves dist/ at http://localhost:4173 with clean URLs
npm run images     # (optional, needs Python + Pillow) regenerates OG images and icons in public/
```

## Deploy to Cloudflare Pages
- Build command: `npm run build`  ·  Output directory: `dist`
- Environment variable: `SITE_ORIGIN=https://your-real-domain.com` (used for canonical URLs, sitemap, OG tags)
- Routes work on direct load/refresh because every page is generated as `/route/index.html`; unknown URLs serve `404.html`.

## Where to edit things
| What | File |
|---|---|
| Domain, contact email, social links, legal date, draft-notice switch | `site.config.mjs` |
| Products & projects (copy, features, status, store links, theme colours) | `src/data/products.mjs` |
| Product privacy policy content | `src/data/privacy.mjs` |
| Styling / design tokens | `src/styles/site.css` |
| Page templates | `src/pages/*.mjs`, shared UI in `src/lib/ui.mjs` |

**Add a product:** append one entry in `products.mjs` (and a privacy entry). Its page, privacy page, homepage showcase list,
footer links, sitemap and structured data appear automatically. Add `public/og/<slug>.png` for its social image.

**Enable store buttons:** fill `links.googlePlay` / `links.appStore` / `links.web` and set `status: 'available'`.

## Honesty rules built in
- Features and platforms are hidden until marked `verified: true`.
- Unconfirmed products show “Details coming soon”, never a fake download button.
- Interface previews are labelled “Illustrative interface — not a screenshot”.
- No analytics, cookies, fake ratings, metrics or testimonials. See `OWNER-TODO.md` for what still needs your input.

## Interactive features
- **Chat assistant** (`public/assets/assistant.js`): a rules-based guide that answers only from `/assets/site-data.json`, which the build generates from `products.mjs` (verified facts only). It is labelled as automated, never invents availability or pricing, and can email the conversation to the team. It is **not** an AI model; connecting a real LLM would need a backend (e.g. a Cloudflare Worker) and an API key kept server-side.
- **Search palette**: press `Ctrl/Cmd + K` or `/`.
- **Contact form**: validated, opens the visitor's email app addressed to `contact.email`; nothing is posted to a server.

## Theme & design system
- **Light/dark switch**: header button (also in the mobile bar). Defaults to the visitor's OS setting, remembers their choice in `localStorage`, and is applied before first paint to avoid a flash. All colours are tokens in `src/styles/site.css` (`:root` = dark, `:root[data-theme=light]` = light).
- **Fonts**: Inter is self-hosted as subsetted WOFF2 in `public/assets/fonts/` (SIL Open Font License, see `LICENSE-Inter.txt`). No third-party font requests.
- **Patterns**: product-led hero, commitments strip, interactive "find your fit" explorer (ARIA tabs), product fact sheet and sticky section nav — informed by common patterns on well-regarded product sites (clear one-line value proposition, show the product rather than describe it, self-segmenting paths, restrained purposeful motion).

## v4 additions
- **Home**: animated aurora hero with cursor glow, product marquee, "in numbers" band (true site facts only), bento philosophy cards, magnetic buttons.
- **Phone previews**: animated, still clearly labelled as illustrative (not screenshots).
- **/faq**: live search + topic filters across all product FAQs, with FAQPage structured data (built from `products.mjs`, so new products appear automatically).
- **/brand**: logo/wordmark SVG downloads (text outlined, no font needed), click-to-copy colour swatches, usage notes. Files live in `public/brand/`.
- **Products**: "At a glance" comparison table, share button (Web Share API with copy-link fallback), "Email to be notified" for products without a launch link.
- **Command palette** (`Ctrl/Cmd+K`): now includes actions — switch theme, copy contact email, open the assistant.
- Everything respects `prefers-reduced-motion`.

## v6 — advanced
- Offline-capable service worker (`public/sw.js`, HTTPS only), hover/touch prefetch (skipped on Save-Data), keyboard shortcuts (`?`, `g` then `h/p/j/a/c/f/b`, `t` theme), mouse parallax on hero phones.

## v5 — premium look & feel
- Floating glass pill navigation (desktop), scroll progress bar, back-to-top progress ring.
- Kinetic hero headline, aurora/cursor glow, layered phone fan with orbiting product nodes (illustrative, not screenshots).
- Scroll-driven sticky "story" section that switches between products as you scroll.
- Glossy primary buttons, subtle grain overlay, outlined product-name watermark on product heroes, giant footer wordmark.
- All motion respects `prefers-reduced-motion`; both themes were contrast- and overflow-tested.

## v7 — polish
- Contact page: two-column layout with a "Helpful to include" side panel; consistent spacing under the projects list.

## v8 — finishing touches
- Balanced headings, themed text selection, aligned status badges, accent-ruled stats, high-contrast and forced-colors support.

## v9 — security & resilience
- Build writes a strict Content-Security-Policy into dist/_headers (inline script hashes computed automatically; no inline event handlers allowed).
- /.well-known/security.txt, sitemap lastmod, light/dark theme-color, styled /offline fallback used by the service worker.

## v10 — SEO
- **Indexing is OFF until you set `SITE_ORIGIN`** (e.g. `https://yourdomain.com` as a Cloudflare Pages env var). While the origin is the placeholder, every page is `noindex` and `robots.txt` disallows all; once set, pages get canonical + hreflang + `index,follow,max-image-preview:large`, and `robots.txt`/`sitemap.xml` use the real domain.
- Keyword-aware titles (≤ 65 chars) and 70–160 char descriptions; the build warns on long/short/duplicate ones.
- JSON-LD: Organization (with contact email), WebSite, BreadcrumbList, AboutPage, ContactPage, CollectionPage/ItemList, FAQPage, SoftwareApplication (category per product), og:locale/og:image:alt.
