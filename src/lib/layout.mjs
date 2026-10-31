import site from '../../site.config.mjs';
import { esc, header, footer, themeStyle } from './ui.mjs';

export const absUrl = (path) => site.origin + (path === '/' ? '/' : path.replace(/\/$/, ''));

export const draftOrigin = site.origin.includes('rumitech.example');

export function layout({ path, title, description, body, theme, ogImage, jsonLd = [], noindex = false, bodyClass = '', ogType = 'website' }) {
  // Until a real origin is configured, keep the whole site out of search indexes (canonicals would point at a placeholder).
  noindex = noindex || draftOrigin;
  const fullTitle = path === '/' ? `${site.name} — Useful apps for everyday life` : /rumitech/i.test(title) ? title : `${title} · ${site.shortName || 'RumiTech'}`;
  const url = absUrl(path);
  const og = site.origin + (ogImage || '/og/default.png');
  const ld = jsonLd.length ? `<script type="application/ld+json">${JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd)}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#080B10" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F7F6F1" media="(prefers-color-scheme: light)">
<meta name="color-scheme" content="dark light">
${noindex ? '<meta name="robots" content="noindex">' : `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">`}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:alt" content="${esc(site.name)} — ${esc(title === site.name ? site.tagline : title)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<script>(function(){var d=document.documentElement,t;d.classList.add('js');try{t=localStorage.getItem('rt-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.setAttribute('data-theme',t);var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#F7F6F1':'#080B10'})()</script>
<link rel="preload" href="/assets/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-semibold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
${ld}
</head>
<body class="${bodyClass}"${theme ? ` style="${themeStyle(theme)}"` : ''}>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<script src="/assets/site.js" defer></script>
<script src="/assets/assistant.js" defer></script>
</body>
</html>`;
}

export const orgLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.origin + '/',
  '@id': site.origin + '/#org',
  logo: site.origin + '/icon-512.png',
  ...(site.contact.email ? { email: site.contact.email, contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: site.contact.email, availableLanguage: 'English' }] } : {}),
  description: site.description,
  ...(Object.values(site.social).some(Boolean) ? { sameAs: Object.values(site.social).filter(Boolean) } : {}),
});

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absUrl(p) })),
});
