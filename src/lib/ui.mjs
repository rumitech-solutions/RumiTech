import site from '../../site.config.mjs';
import { products, enabledProjects, STATUS } from '../data/products.mjs';

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const warnings = [];
export const warn = (msg) => { if (!warnings.includes(msg)) warnings.push(msg); };

export const contactEmail = (kind = 'general') =>
  (kind === 'support' && site.contact.supportEmail) || site.contact.email || '';

// ── Brand emblem: a small seed becoming a connected, larger form ──
export const emblem = (size = 36) => `
<svg class="emblem" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <rect x="1" y="1" width="46" height="46" rx="13" fill="#0D1219" stroke="rgba(255,255,255,.14)"/>
  <path d="M13 34 C13 22 20 16 28 16 L35 16" fill="none" stroke="#C8F560" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 34 C20 28 24 25 29 25 L35 25" fill="none" stroke="#5CE1E6" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  <circle cx="13" cy="34" r="3.2" fill="#C8F560"/>
  <circle cx="35" cy="16" r="3.2" fill="#F3EFE8"/>
  <circle cx="35" cy="25" r="2.4" fill="#F3EFE8" opacity=".75"/>
</svg>`;

export const wordmark = () => `
<a class="brand" href="/" aria-label="${esc(site.name)} — home">
  ${emblem(34)}
  <span class="wordmark"><b>Rumi</b>Tech<small>Solutions</small></span>
</a>`;

export const statusBadge = (status) => {
  const s = STATUS[status] || STATUS.tbc;
  return `<span class="badge badge-${s.tone}"><i aria-hidden="true"></i>${esc(s.label)}</span>`;
};

export const themeStyle = (t) =>
  `--a:${t.accent};--a2:${t.accent2 || t.accent};--tint:${t.tint || 'transparent'}`;

// Store / launch actions based on verified links only.
export const actions = (item, { size = '' } = {}) => {
  const L = item.links || {};
  const out = [];
  if (L.googlePlay) out.push(`<a class="btn btn-primary ${size}" href="${esc(L.googlePlay)}" rel="noopener">Get it on Google Play</a>`);
  if (L.appStore) out.push(`<a class="btn btn-primary ${size}" href="${esc(L.appStore)}" rel="noopener">Download on the App Store</a>`);
  if (L.web) out.push(`<a class="btn btn-primary ${size}" href="${esc(L.web)}" rel="noopener">Launch web app</a>`);
  if (L.repo) out.push(`<a class="btn btn-ghost ${size}" href="${esc(L.repo)}" rel="noopener">View repository</a>`);
  if (!out.length) {
    const label = STATUS[item.status]?.label || 'Details coming soon';
    out.push(`<span class="btn btn-static ${size}" role="note">${esc(label)} — not yet available to download</span>`);
    warn(`${item.name}: no store/web links set (shows “not yet available”).`);
  }
  return out.join('');
};

export const visibleFeatures = (p) => {
  const all = p.features || [];
  const shown = site.publishUnverified ? all : all.filter((x) => x.verified);
  all.filter((x) => !x.verified).forEach((x) => warn(`${p.name}: feature “${x.title}” is unverified (${site.publishUnverified ? 'shown in preview build' : 'hidden'}).`));
  return shown;
};

export const faq = (items) => `
<div class="faq">
${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
</div>`;

export const draftNote = (text) =>
  site.showDraftNotices ? `<p class="draft-note" role="note"><strong>Owner to confirm:</strong> ${esc(text)}</p>` : '';

export const cta = ({ title, text, primary, secondary }) => `
<section class="closing" aria-labelledby="closing-h">
  <div class="wrap closing-inner reveal">
    <h2 id="closing-h">${title}</h2>
    <p>${esc(text)}</p>
    <div class="btn-row">
      <a class="btn btn-primary btn-lg" href="${primary[1]}">${esc(primary[0])}</a>
      ${secondary ? `<a class="btn btn-ghost btn-lg" href="${secondary[1]}">${esc(secondary[0])}</a>` : ''}
    </div>
  </div>
</section>`;

// ── Illustrative interface mockups (abstract; no invented data or features) ──
const bars = (n, w = [80, 60, 70, 45]) =>
  Array.from({ length: n }, (_, i) => `<span class="sk" style="width:${w[i % w.length]}%"></span>`).join('');

export const mock = (p) => {
  const v = p.theme.variant;
  let body = '';
  if (v === 'sanctuary') {
    body = `
<div class="m-pattern"></div>
<div class="m-line-title"></div>
<div class="m-page">${bars(7, [100, 92, 96, 70, 88, 100, 54])}</div>
<div class="m-tabs"><i></i><i class="on"></i><i></i><i></i></div>`;
  } else if (v === 'grid') {
    body = `
<div class="m-search"></div>
<div class="m-rows">${Array.from({ length: 5 }, (_, i) => `<div class="m-row"><i class="m-check${i < 2 ? ' on' : ''}"></i><div>${bars(2, [70, 40])}</div><b></b></div>`).join('')}</div>`;
  } else if (v === 'ledger') {
    body = `
<div class="m-hero-card"><span class="sk" style="width:38%"></span><span class="sk big" style="width:62%"></span></div>
<svg class="m-chart" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 52 C20 48 30 24 55 30 S95 58 120 34 S170 10 200 18" fill="none" stroke="var(--a)" stroke-width="2.5"/><path d="M0 52 C20 48 30 24 55 30 S95 58 120 34 S170 10 200 18 L200 70 L0 70Z" fill="var(--a)" opacity=".12"/></svg>
<div class="m-rows">${Array.from({ length: 3 }, () => `<div class="m-row"><i class="m-dot"></i><div>${bars(2, [60, 34])}</div><b></b></div>`).join('')}</div>`;
  } else {
    body = `
<div class="m-map"><svg viewBox="0 0 200 150" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.12)"><path d="M0 40 H200 M0 90 H200 M50 0 V150 M120 0 V150"/><path d="M0 120 C60 100 110 130 200 70"/></g><circle cx="100" cy="72" r="34" fill="var(--a)" opacity=".10"/><circle cx="100" cy="72" r="18" fill="var(--a)" opacity=".16"/><circle cx="100" cy="72" r="6" fill="var(--a)"/><circle cx="52" cy="46" r="5" fill="var(--a2)"/><circle cx="150" cy="104" r="5" fill="var(--a2)"/></svg></div>
<div class="m-people"><i></i><i></i><i></i><i class="more"></i></div>`;
  }
  return `
<figure class="device" style="${themeStyle(p.theme)}" aria-label="Illustrative interface preview for ${esc(p.name)}">
  <div class="device-top"><span></span></div>
  <div class="device-screen v-${v}">${body}</div>
  <figcaption>Illustrative interface — not a screenshot</figcaption>
</figure>`;
};

// ── Header / footer ──
const nav = [
  ['/', 'Home'],
  ['/products', 'Products'],
  ['/projects', 'Projects'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export const header = (path) => `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="wrap bar">
    ${wordmark()}
    <nav class="nav" aria-label="Primary">
      <ul>
        ${nav.map(([h, l]) => `<li><a href="${h}"${isCurrent(path, h) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}
      </ul>
    </nav>
    <button class="icon-btn search-btn" type="button" data-palette-open aria-haspopup="dialog" aria-label="Search the site (Ctrl K)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <kbd aria-hidden="true">Ctrl K</kbd>
    </button>
    <button class="icon-btn theme-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light theme">
      <svg class="i-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      <svg class="i-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
    <a class="btn btn-primary btn-sm nav-cta" href="/products">Explore our products</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-btn>
      <span class="sr">Menu</span><i aria-hidden="true"></i><i aria-hidden="true"></i>
    </button>
  </div>
  <div class="progress" aria-hidden="true"><i data-progress></i></div>
  <div class="mobile-menu" id="mobile-menu" data-menu hidden>
    <nav aria-label="Mobile">
      <ul>
        ${nav.map(([h, l]) => `<li><a href="${h}"${isCurrent(path, h) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}
      </ul>
      <a class="btn btn-primary btn-lg" href="/products">Explore our products</a>
    </nav>
  </div>
</header>`;

const isCurrent = (path, href) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

export const footer = () => {
  const social = Object.entries(site.social).filter(([, v]) => v);
  const labels = { github: 'GitHub', x: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', instagram: 'Instagram', playStoreDeveloper: 'Google Play' };
  return `
<footer class="site-footer">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      ${wordmark()}
      <p>${esc(site.tagline)}</p>
      ${site.contact.email ? `<p class="foot-contact"><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></p>` : ''}
      ${social.length ? `<ul class="social">${social.map(([k, v]) => `<li><a href="${esc(v)}" rel="noopener me">${labels[k] || k}</a></li>`).join('')}</ul>` : ''}
    </div>
    <nav aria-label="Products"><h2>Products</h2><ul>
      ${products.map((p) => `<li><a href="/products/${p.slug}">${esc(p.name)}</a></li>`).join('')}
    </ul></nav>
    <nav aria-label="Projects"><h2>Projects</h2><ul>
      <li><a href="/projects">All projects</a></li>
      ${enabledProjects().map((p) => `<li><a href="/projects/${p.slug}">${esc(p.name)}</a></li>`).join('')}
    </ul></nav>
    <nav aria-label="Company"><h2>Company</h2><ul>
      <li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="/faq">FAQ</a></li><li><a href="/brand">Brand kit</a></li>
    </ul></nav>
    <nav aria-label="Privacy"><h2>Privacy</h2><ul>
      <li><a href="/privacy">Website privacy</a></li>
      ${products.map((p) => `<li><a href="/products/${p.slug}/privacy">${esc(p.name)} privacy</a></li>`).join('')}
    </ul></nav>
  </div>
  <div class="wrap foot-base">
    <p>© <span data-year>${new Date().getFullYear()}</span> ${esc(site.name)}. All rights reserved.</p>
    <p class="foot-bar"><span>Independent software, made with care.</span><a class="foot-top" href="#main" data-top>Back to top <span aria-hidden="true">↑</span></a></p>
  </div>
  <div class="foot-giant" aria-hidden="true">RumiTech</div>
</footer>`;
};
