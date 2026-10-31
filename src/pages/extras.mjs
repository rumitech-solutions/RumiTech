import site from '../../site.config.mjs';
import { products } from '../data/products.mjs';
import { esc, emblem, themeStyle, contactEmail, cta } from '../lib/ui.mjs';
import { layout, breadcrumbLd, absUrl } from '../lib/layout.mjs';

/* ───────────── FAQ (searchable) ───────────── */
const general = () => {
  const mail = contactEmail('general');
  return [
    ['What is RumiTech Solutions?', `${site.name} is an independent digital product studio. This website focuses on our own products: ${products.map((p) => p.name).join(', ')}.`],
    ['Does this website use cookies or trackers?', 'No analytics, advertising scripts or cookies. If you switch between light and dark theme, that choice is saved only in your own browser’s local storage.'],
    ['How do I find out when a product is available?', 'Each product page shows its real status and shows store buttons only once official listings exist. There is no mailing list yet — you can email us and ask to be told when a product is ready.'],
    ['Is the chat assistant an AI?', 'No. It is an automated guide that answers from the information published on this site and will say when it does not know something. For a person, email the team.'],
    ['Where are the privacy policies?', 'The website has its own policy at /privacy, and every product has a dedicated one, linked from its page and from the footer.'],
    ['How can I contact the team?', mail ? `Email ${mail}, or use the contact page, which opens your email app with your message ready.` : 'Use the contact page.'],
  ];
};

export function faqPage() {
  const groups = [{ id: 'general', name: 'General', items: general() }, ...products.map((p) => ({ id: p.slug, name: p.name, items: p.faqs, theme: p.theme }))];
  const flat = groups.flatMap((g) => g.items.map(([q, a]) => ({ g, q, a })));
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">FAQ</p>
  <h1>Questions, answered.</h1>
  <p class="hero-lead">Search every question about RumiTech and our products in one place.</p>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap narrow" data-faq>
  <div class="faq-tools reveal">
    <div class="field"><label for="faq-q">Search questions</label><input id="faq-q" type="search" placeholder="Try “privacy”, “cookies” or a product name" autocomplete="off" data-faq-input></div>
    <div class="chip-filter" role="group" aria-label="Filter by topic">
      <button type="button" class="chip" aria-pressed="true" data-g="all">All</button>
      ${groups.map((g) => `<button type="button" class="chip" aria-pressed="false" data-g="${g.id}">${esc(g.name)}</button>`).join('')}
    </div>
    <p class="faq-count" role="status" aria-live="polite" data-faq-count>${flat.length} questions</p>
  </div>
  <div class="faq reveal" data-faq-list>
    ${flat.map(({ g, q, a }) => `<details data-g="${g.id}" data-t="${esc((q + ' ' + a + ' ' + g.name).toLowerCase())}"><summary><span class="faq-tag" style="${g.theme ? themeStyle(g.theme) : ''}">${esc(g.name)}</span>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
  </div>
  <p class="muted faq-empty" data-faq-empty hidden>No questions match. <a href="/contact">Ask us directly</a>.</p>
</div></section>
${cta({ title: 'Still curious?', text: 'Ask us anything — we read every message.', primary: ['Contact us', '/contact'], secondary: ['Browse products', '/products'] })}`;
  const ld = [
    breadcrumbLd([['Home', '/'], ['FAQ', '/faq']]),
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: flat.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  return { path: '/faq', html: layout({ path: '/faq', title: 'FAQ — questions about RumiTech and its apps', description: `Answers to common questions about ${site.name} and its products: availability, privacy, platforms and how to get in touch.`, body, jsonLd: ld }) };
}

/* ───────────── Brand kit ───────────── */
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const swatch = (name, hex) => `<li><button type="button" class="swatch" data-copy="${hex}" style="--sw:${hex};--sw-ink:${lum(hex) > 0.4 ? '#0a0d12' : '#F3EFE8'}" aria-label="Copy ${esc(name)} ${hex}"><span class="sw-n">${esc(name)}</span><span class="sw-h">${hex}</span></button></li>`;

export function brandPage() {
  const core = [['Ink', '#080B10'], ['Surface', '#111822'], ['Warm white', '#F3EFE8'], ['Lime', '#C8F560'], ['Cyan', '#5CE1E6']];
  const prod = products.map((p) => [p.name, p.theme.accent]);
  const dl = (href, label) => `<a class="btn btn-ghost btn-sm" href="${href}" download>${label}</a>`;
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Brand kit</p>
  <h1>The RumiTech identity.</h1>
  <p class="hero-lead">Our emblem, wordmark, colours and type — free to use when you’re writing about our products.</p>
</div></section>

<section class="section" style="padding-top:0" aria-labelledby="logo-h"><div class="wrap">
  <h2 id="logo-h" class="h-sm">Logo</h2>
  <div class="brand-tiles">
    <figure class="tile tile-dark reveal"><div class="tile-art">${emblem(104)}</div><figcaption>Emblem<span>${dl('/brand/rumitech-emblem.svg', 'SVG')} ${dl('/icon-512.png', 'PNG')}</span></figcaption></figure>
    <figure class="tile tile-dark reveal"><div class="tile-art"><img src="/brand/rumitech-wordmark-dark-bg.svg" alt="RumiTech wordmark for dark backgrounds" width="320" height="64" loading="lazy"></div><figcaption>Wordmark · dark backgrounds<span>${dl('/brand/rumitech-wordmark-dark-bg.svg', 'SVG')}</span></figcaption></figure>
    <figure class="tile tile-light reveal"><div class="tile-art"><img src="/brand/rumitech-wordmark-light-bg.svg" alt="RumiTech wordmark for light backgrounds" width="320" height="64" loading="lazy"></div><figcaption>Wordmark · light backgrounds<span>${dl('/brand/rumitech-wordmark-light-bg.svg', 'SVG')}</span></figcaption></figure>
  </div>
  <p class="muted reveal">The emblem shows a small seed path growing into a larger connected form — our idea of small ideas becoming useful products.</p>
</div></section>

<section class="section section-alt" aria-labelledby="col-h"><div class="wrap">
  <h2 id="col-h" class="h-sm">Colour</h2>
  <p class="muted">Select a swatch to copy its hex value.</p>
  <h3 class="h-xs">Core</h3>
  <ul class="swatches reveal">${core.map(([n, h]) => swatch(n, h)).join('')}</ul>
  <h3 class="h-xs">Product accents</h3>
  <ul class="swatches reveal">${prod.map(([n, h]) => swatch(n, h)).join('')}</ul>
</div></section>

<section class="section" aria-labelledby="type-h"><div class="wrap split">
  <div class="reveal"><h2 id="type-h" class="h-sm">Typography</h2>
    <p class="muted">Inter, used in Regular, Medium, Semibold and Bold. It is open source under the SIL Open Font License.</p>
    <p class="type-sample">Aa Bb Cc 123</p>
    <p class="type-line">Thoughtfully built software for everyday life.</p></div>
  <div class="reveal prose"><h2 class="h-sm">Using the logo</h2>
    <ul class="ticks">
      <li><b>Give it room.</b> Keep clear space around the emblem at least equal to its width ÷ 4.</li>
      <li><b>Keep it legible.</b> Don’t use the emblem smaller than 24 px.</li>
      <li><b>Don’t alter it.</b> No stretching, recolouring, outlines or effects.</li>
      <li><b>Match the background.</b> Use the dark-background wordmark on dark, the light one on light.</li>
    </ul></div>
</div></section>
${cta({ title: 'Writing about us?', text: 'Tell us what you’re working on and we’ll help where we can.', primary: ['Contact us', '/contact'], secondary: ['About RumiTech', '/about'] })}`;
  return { path: '/brand', html: layout({ path: '/brand', title: 'RumiTech brand kit — logo, colours & typography', description: `Download the ${site.name} emblem and wordmark, copy brand colours and see typography and usage guidance for press and partners.`, body, jsonLd: [breadcrumbLd([['Home', '/'], ['Brand kit', '/brand']])] }) };
}

function offlinePage() {
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Offline</p>
  <h1>You’re offline.</h1>
  <p class="hero-lead">This page isn’t saved on your device yet. Pages you have already visited still open — reconnect to see the rest.</p>
  <div class="btn-row"><a class="btn btn-primary btn-lg" href="/">Go to the home page</a><button class="btn btn-ghost btn-lg" type="button" data-reload>Try again</button></div>
</div></section>`;
  return { path: '/offline', html: layout({ path: '/offline', title: 'Offline', description: 'You are offline.', body, noindex: true }) };
}

export const extraPages = () => [faqPage(), brandPage(), offlinePage()];
