import site from '../../site.config.mjs';
import { products, enabledProjects } from '../data/products.mjs';
import { contactEmail } from '../lib/ui.mjs';
import { esc, emblem, statusBadge, themeStyle, mock, cta } from '../lib/ui.mjs';
import { layout, orgLd } from '../lib/layout.mjs';

const constellation = () => {
  const by = (slug) => products.find((p) => p.slug === slug);
  const fan = [['d-l', by('imaanly')], ['d-c', by('finmate')], ['d-r', by('circlo')]];
  return `
<div class="constellation" aria-label="The RumiTech product family">
  <svg viewBox="0 0 600 600" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#C8F560" stop-opacity=".16"/><stop offset="1" stop-color="#C8F560" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="300" cy="300" r="250" fill="url(#glow)"/>
    <g class="ring r1"><circle cx="300" cy="300" r="190" fill="none" stroke="rgba(255,255,255,.12)"/><circle cx="490" cy="300" r="5" fill="#C8F560"/></g>
    <g class="ring r2"><circle cx="300" cy="300" r="250" fill="none" stroke="rgba(255,255,255,.10)" stroke-dasharray="2 7"/><circle cx="50" cy="300" r="4" fill="#5CE1E6"/></g>
    <g class="ring r3"><circle cx="300" cy="300" r="290" fill="none" stroke="rgba(255,255,255,.07)"/><circle cx="300" cy="10" r="3.5" fill="#F3EFE8"/></g>
  </svg>
  <div class="fan" aria-hidden="true">
    ${fan.map(([c, p]) => `<div class="fan-d ${c}">${mock(p)}</div>`).join('')}
  </div>
  ${products
    .map(
      (p, i) => `<a class="node n${i + 1}" href="/products/${p.slug}" style="${themeStyle(p.theme)}">
    <span class="node-dot"></span><span class="node-name">${esc(p.name)}</span><span class="node-cat">${esc(p.category)}</span></a>`
    )
    .join('')}
  <p class="fan-cap">Illustrative interfaces — not screenshots</p>
</div>`;
};

export function homePages() {
  const [imaanly, stockly, finmate, circlo] = ['imaanly', 'stockly', 'finmate', 'circlo'].map((s) => products.find((p) => p.slug === s));
  const feature = (p, cls) => `
  <article class="showcase ${cls} reveal" style="${themeStyle(p.theme)}">
    <div class="showcase-copy">
      <p class="eyebrow">${esc(p.category)}</p>
      <h3>${esc(p.name)}</h3>
      <p class="lead">${esc(p.tagline)}</p>
      <p>${esc(p.summary)}</p>
      <p class="status-line">${statusBadge(p.status)}</p>
      <a class="link-arrow" href="/products/${p.slug}">Explore ${esc(p.name)} <span aria-hidden="true">→</span></a>
    </div>
    <div class="showcase-art">${mock(p)}</div>
  </article>`;

  const NEEDS = [
    [imaanly, 'I want a calm place for my daily faith.'],
    [stockly, 'I want to know what I have and what I need.'],
    [finmate, 'I want my money records clear and in order.'],
    [circlo, 'I want to stay coordinated with family and friends.'],
  ];
  const MARQUEE = [...products.map((p) => p.category), 'Calm interfaces', 'Honest status', 'Privacy-conscious', 'Independent'];
  const ICONS = {
    design: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/><path d="M12 21c-1.5 0-2-1.5-1-3s0-3 2-3h3"/>',
    use: '<path d="M14.5 5.5 18.5 9.5 8 20H4v-4L14.5 5.5Z"/><path d="m13 7 4 4"/>',
    rel: '<path d="M4 13l5 5L20 6"/>',
    priv: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    grow: '<path d="M4 18l6-6 4 4 6-8"/><path d="M15 8h5v5"/>',
  };
  const BENTO = [
    ['design', 'Thoughtful design', 'Interfaces that feel obvious, calm and respectful of your attention.', 'b-wide'],
    ['use', 'Practical usefulness', 'Every product starts from a real, everyday problem.', 'b-wide'],
    ['rel', 'Reliability', 'Software should behave the way you expect, every time.', ''],
    ['priv', 'Privacy-conscious', 'We treat what people share with us as something to handle carefully.', ''],
    ['grow', 'Continuous improvement', 'Products are never finished — we keep refining them.', ''],
  ];
  const STATS = [
    [products.length, 'Products', 'in the family'],
    [enabledProjects().length, 'Projects', 'being explored'],
    [products.length + 1, 'Privacy policies', 'one per app, plus this website'],
    [0, 'Ad trackers', 'on this website'],
  ];
  const ICON = (k) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const body = `
<section class="hero hero-corp">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(site.name)}</p>
      <h1>Thoughtfully built software for everyday life.</h1>
      <p class="hero-lead">${esc(site.name)} is an independent product studio. We design and build useful, easy-to-use apps — each one focused on a real, everyday need.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="/products">Explore our products</a>
        <a class="btn btn-ghost btn-lg" href="/contact">Contact us</a>
      </div>
    </div>
    <aside class="hero-panel" aria-label="Our products">
      <h2>Our products</h2>
      <ul>
        ${products.map((p) => `<li style="${themeStyle(p.theme)}"><a href="/products/${p.slug}"><i aria-hidden="true"></i><span><b>${esc(p.name)}</b><small>${esc(p.category)}</small></span><span class="arr" aria-hidden="true">→</span></a></li>`).join('')}
      </ul>
    </aside>
  </div>
</section>

<section class="strip" aria-label="How we work">
  <div class="wrap"><ul class="strip-list">
    <li><b>Our own products</b><span>An independent studio building its own software, not client work.</span></li>
    <li><b>Honest availability</b><span>Every product shows its real status. No fake download buttons.</span></li>
    <li><b>A policy for every app</b><span>Each product has its own dedicated privacy page.</span></li>
    <li><b>Built to be accessible</b><span>Keyboard-friendly, readable, and respectful of reduced motion.</span></li>
  </ul></div>
</section>

<section class="section" id="products" aria-labelledby="products-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Products</p>
      <h2 id="products-h">Four products, one standard of care</h2>
      <p>Each product solves a different problem and has its own personality. They share the same commitment to quality.</p>
    </header>
    <ul class="pcards">
      ${products.map((p) => `<li class="reveal" style="${themeStyle(p.theme)}"><a class="pcard" href="/products/${p.slug}">
        <span class="pc-top"><i aria-hidden="true"></i><span class="pc-cat">${esc(p.category)}</span></span>
        <h3>${esc(p.name)}</h3>
        <p class="pc-tag">${esc(p.tagline)}</p>
        <p class="pc-sum">${esc(p.summary)}</p>
        <span class="pc-foot">${statusBadge(p.status)}<span class="link-arrow">Learn more <span aria-hidden="true">→</span></span></span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section-alt" aria-labelledby="phil-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">How we work</p>
      <h2 id="phil-h">Small ideas, carefully grown into useful products</h2>
      <p>We would rather build fewer things that work well than many things that merely exist.</p>
    </header>
    <ul class="values">
      ${BENTO.map(([ic, t, d]) => `<li class="reveal"><span class="v-ic">${ICON(ic)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="evo-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Projects</p>
      <h2 id="evo-h">Early-stage projects</h2>
      <p>Projects are kept separate from released products, so it is always clear what is available today.</p>
    </header>
    <ul class="pcards pcards-2">
      ${enabledProjects().map((p) => `<li class="reveal" style="${themeStyle(p.theme)}"><a class="pcard" href="/projects/${p.slug}">
        <span class="pc-top"><i aria-hidden="true"></i><span class="pc-cat">Project</span></span>
        <h3>${esc(p.name)}</h3>
        <p class="pc-sum">${esc(p.summary)}</p>
        <span class="pc-foot">${statusBadge(p.status)}<span class="link-arrow">View project <span aria-hidden="true">→</span></span></span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>

${cta({
  title: 'Have a question or an idea?',
  text: 'We read every message. Tell us what you would like to see next.',
  primary: ['Contact us', '/contact'],
  secondary: ['About RumiTech', '/about'],
})}`;

  return [
    {
      path: '/',
      html: layout({
        path: '/',
        title: site.name,
        description: site.description,
        body,
        jsonLd: [orgLd(), { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.origin + '/' }],
        bodyClass: 'home',
      }),
    },
  ];
}
