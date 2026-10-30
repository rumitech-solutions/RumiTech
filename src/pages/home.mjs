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
  const ICON = {
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
  const body = `
<section class="hero">
  <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="cursor-glow" aria-hidden="true"></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow"><span class="pulse" aria-hidden="true"></span>Independent product studio</p>
      <h1><span class="kw" style="--i:0">Good</span> <span class="kw" style="--i:1">ideas</span> <span class="kw" style="--i:2">deserve</span> <em class="kw" style="--i:3">great software.</em></h1>
      <p class="hero-lead">RumiTech builds useful, intuitive digital products for everyday life — each one starting small, and built with care.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="/products">Explore our products</a>
        <a class="btn btn-ghost btn-lg" href="/about">Discover RumiTech</a>
      </div>
    </div>
    ${constellation()}
  </div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    ${[0, 1].map(() => `<span>${MARQUEE.map((w) => `<span class="mw">${esc(w)}</span>`).join('')}</span>`).join('')}
  </div>
</div>

<section class="strip" aria-label="How we work">
  <div class="wrap"><ul class="strip-list">
    <li><b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/></svg> Our own products</b><span>An independent studio building its own software, not client work.</span></li>
    <li><b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg> Honest availability</b><span>Every product shows its real status. No fake download buttons.</span></li>
    <li><b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.500 7-4.500 7-9V6l-7-3Z"/></svg> A policy for every app</b><span>Each product has its own dedicated privacy page.</span></li>
    <li><b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><path d="M5 9h14M12 9v12M8 21l4-6 4 6"/></svg> Built to be accessible</b><span>Keyboard-friendly, readable, and respectful of reduced motion.</span></li>
  </ul></div>
</section>

<section class="section story" aria-labelledby="featured-h" data-story>
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">The product family</p>
      <h2 id="featured-h">Four products. One standard of care.</h2>
      <p>Each product solves a different problem and has its own personality — they share the same commitment to quality.</p>
    </header>
    <div class="story-grid">
      <div class="story-stage" aria-hidden="true">
        ${products.map((p, i) => `<div class="stage-dev${i === 0 ? ' on' : ''}" style="${themeStyle(p.theme)}">${mock(p)}</div>`).join('')}
      </div>
      <ol class="story-steps">
        ${products
          .map(
            (p, i) => `<li class="step-card${i === 0 ? ' active' : ''}" style="${themeStyle(p.theme)}">
          <div class="mobile-mock">${mock(p)}</div>
          <p class="eyebrow">${esc(p.category)}</p>
          <h3>${esc(p.name)}</h3>
          <p class="lead">${esc(p.tagline)}</p>
          <p class="step-sum">${esc(p.summary)}</p>
          <p class="status-line">${statusBadge(p.status)}</p>
          <a class="link-arrow" href="/products/${p.slug}">Explore ${esc(p.name)} <span aria-hidden="true">→</span></a>
        </li>`
          )
          .join('')}
      </ol>
    </div>
  </div>
</section>

<section class="stats" aria-label="RumiTech in numbers">
  <div class="wrap"><ul class="stats-list">
    ${STATS.map(([n, t, s]) => `<li class="reveal"><b data-count="${n}">${n}</b><span class="st-t">${esc(t)}</span><span class="st-s">${esc(s)}</span></li>`).join('')}
  </ul></div>
</section>

<section class="section section-alt" aria-labelledby="discover-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Find your fit</p>
      <h2 id="discover-h">Which product is for you?</h2>
      <p>Start with what you want to get done.</p>
    </header>
    <div class="explorer reveal" data-explorer>
      <div class="xtabs" role="tablist" aria-label="Choose what you need" aria-orientation="vertical">
        ${NEEDS.map(([p, line], i) => `<button class="xtab" role="tab" id="xt-${p.slug}" aria-controls="xp-${p.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="${themeStyle(p.theme)}" type="button"><small><i aria-hidden="true"></i>${esc(p.name)}</small><strong>${esc(line)}</strong></button>`).join('')}
      </div>
      <div class="xpanels">
        ${NEEDS.map(([p], i) => `<div class="xpanel" role="tabpanel" id="xp-${p.slug}" aria-labelledby="xt-${p.slug}" tabindex="0" style="${themeStyle(p.theme)}"${i ? '' : ''}>
          <div><p class="eyebrow">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><p class="status-line">${statusBadge(p.status)}</p><a class="link-arrow" href="/products/${p.slug}">Explore ${esc(p.name)} <span aria-hidden="true">→</span></a></div>
          <div>${mock(p)}</div></div>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="phil-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Studio philosophy</p>
      <h2 id="phil-h">Small ideas, carefully grown into useful products.</h2>
      <p>We would rather build fewer things that work well than many things that merely exist.</p>
    </header>
    <ul class="bento">
      ${BENTO.map(([ic, t, d, cls], i) => `<li class="${cls} reveal"><span class="b-ic" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[ic]}</svg></span><span class="b-n" aria-hidden="true">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section-alt" aria-labelledby="evo-h">
  <div class="wrap">
    <header class="section-head reveal">
      <p class="eyebrow">Project evolution</p>
      <h2 id="evo-h">From first sketch to shipped product.</h2>
      <p>Products and early-stage projects are kept apart, so it is always clear what is available today.</p>
    </header>
    <div class="evo">
      <div class="evo-col reveal">
        <h3>Products</h3>
        <ul>${products.map((p) => `<li style="${themeStyle(p.theme)}"><a href="/products/${p.slug}"><i aria-hidden="true"></i><span>${esc(p.name)}</span>${statusBadge(p.status)}</a></li>`).join('')}</ul>
      </div>
      <div class="evo-col reveal">
        <h3>Projects &amp; experiments</h3>
        <ul>${enabledProjects().map((p) => `<li style="${themeStyle(p.theme)}"><a href="/projects/${p.slug}"><i aria-hidden="true"></i><span>${esc(p.name)}</span>${statusBadge(p.status)}</a></li>`).join('')}</ul>
        <a class="link-arrow" href="/projects">All projects <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

${cta({
  title: 'Build less. <em>Build better.</em>',
  text: 'See what we are making — and tell us what you would like to see next.',
  primary: ['Explore our products', '/products'],
  secondary: ['Get in touch', '/contact'],
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
