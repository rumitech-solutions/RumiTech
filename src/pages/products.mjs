import site from '../../site.config.mjs';
import { products, getProduct, STATUS } from '../data/products.mjs';
import { esc, statusBadge, themeStyle, mock, actions, visibleFeatures, faq, cta, draftNote, contactEmail, warn } from '../lib/ui.mjs';
import { layout, absUrl, breadcrumbLd } from '../lib/layout.mjs';
import { privacyPage } from './privacy-doc.mjs';

const notify = (p) => {
  const e = contactEmail('general');
  if (!e || p.links.googlePlay || p.links.appStore || p.links.web) return '';
  return `<a class="btn btn-ghost btn-lg" href="mailto:${esc(e)}?subject=${encodeURIComponent('Notify me about ' + p.name)}&body=${encodeURIComponent('Hi RumiTech, please let me know when ' + p.name + ' is available.')}">Email to be notified</a>`;
};
const platformsOf = (p) => (p.platforms || []).filter((x) => x.verified);

function productPage(p) {
  const path = `/products/${p.slug}`;
  const feats = visibleFeatures(p);
  const plats = platformsOf(p);
  if (!plats.length) warn(`${p.name}: supported platforms unverified (hidden).`);
  if (p.notice && !p.noticeVerified) warn(`${p.name}: disclaimer text should be reviewed.`);
  const supportEmail = contactEmail('support');
  const related = (p.related || []).map(getProduct).filter(Boolean);

  const body = `
<section class="p-hero v-${p.theme.variant}" data-name="${esc(p.name)}">
  <div class="wrap p-hero-grid">
    <div class="p-hero-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/products">Products</a> <span aria-hidden="true">/</span> <span>${esc(p.name)}</span></nav>
      <p class="eyebrow">${esc(p.category)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="hero-lead">${esc(p.tagline)}</p>
      <p>${esc(p.summary)}</p>
      <p class="status-line">${statusBadge(p.status)}</p>
      <div class="btn-row">${actions(p, { size: 'btn-lg' })}${notify(p)}</div>
      <p class="small p-links"><a href="${path}/privacy">${esc(p.name)} privacy policy</a> <span aria-hidden="true">·</span> <button type="button" class="linklike" data-share data-title="${esc(p.name)} — ${esc(p.tagline)}">Share ${esc(p.name)}</button></p>
    </div>
    <div class="p-hero-art">${mock(p)}</div>
  </div>
</section>

<section class="facts" aria-label="${esc(p.name)} at a glance"><div class="wrap"><dl>
  <div><dt>Category</dt><dd>${esc(p.category)}</dd></div>
  <div><dt>Status</dt><dd>${esc(STATUS[p.status]?.label || '')}</dd></div>
  <div><dt>Platforms</dt><dd>${plats.length ? plats.map((x) => esc(x.name)).join(', ') : 'To be announced'}</dd></div>
  <div><dt>Privacy</dt><dd><a href="${path}/privacy">Read the policy</a></dd></div>
</dl></div></section>

<nav class="subnav" aria-label="${esc(p.name)} sections" data-subnav>
  <div class="wrap subnav-in">
    <b class="subnav-name"><i aria-hidden="true"></i>${esc(p.name)}</b>
    <ul>
      <li><a href="#overview">Overview</a></li><li><a href="#features">Features</a></li><li><a href="#how">How it works</a></li><li><a href="#availability">Availability</a></li><li><a href="#faq">FAQ</a></li>
    </ul>
    <a class="subnav-privacy" href="${path}/privacy">Privacy</a>
  </div>
</nav>

<section class="section" id="overview" aria-labelledby="who-h">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">Who it is for</p>
      <h2 id="who-h">${esc(p.audience)}</h2>
    </div>
    <div class="reveal prose">
      <h3>The problem it solves</h3>
      <p>${esc(p.problem)}</p>
      ${p.notice ? `<p class="callout" role="note">${esc(p.notice)}</p>` : ''}
    </div>
  </div>
</section>

<section class="section section-alt${p.slug === 'imaanly' ? ' band-ivory' : ''}" id="features" aria-labelledby="feat-h">
  <div class="wrap">
    <header class="section-head reveal"><p class="eyebrow">Features</p><h2 id="feat-h">${feats.length ? 'What it does' : 'Feature details are on the way'}</h2></header>
    ${
      feats.length
        ? `<ul class="feat-grid">${feats.map((x) => `<li class="reveal"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ul>`
        : `<p class="reveal muted-block">We will list ${esc(p.name)}'s features here once they have been confirmed against the current release.</p>${draftNote(`Mark features as verified in src/data/products.mjs (${p.name}) to publish them.`)}`
    }
  </div>
</section>

<section class="section" id="how" aria-labelledby="how-h">
  <div class="wrap">
    <header class="section-head reveal"><p class="eyebrow">How it works</p><h2 id="how-h">Simple by design.</h2></header>
    <ol class="steps">
      ${p.how.map(([t, d], i) => `<li class="reveal"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section section-alt" id="availability" aria-labelledby="avail-h">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">Availability</p>
      <h2 id="avail-h">Get ${esc(p.name)}</h2>
      <p class="status-line">${statusBadge(p.status)}</p>
      <div class="btn-row">${actions(p)}</div>
      ${draftNote(`Add real store / web links for ${p.name} in src/data/products.mjs and set its status.`)}
    </div>
    <div class="reveal">
      <h3>Supported platforms</h3>
      ${plats.length ? `<ul class="chips">${plats.map((x) => `<li>${esc(x.name)}</li>`).join('')}</ul>` : '<p class="muted">Supported platforms will be listed once confirmed.</p>'}
      <h3>Privacy</h3>
      <p>Read how ${esc(p.name)} handles information in its <a href="${path}/privacy">dedicated privacy policy</a>.</p>
      <h3>Support</h3>
      ${p.links.support ? `<p><a href="${esc(p.links.support)}" rel="noopener">Product support</a></p>` : supportEmail ? `<p><a href="mailto:${esc(supportEmail)}?subject=${encodeURIComponent(p.name + ' support')}">${esc(supportEmail)}</a></p>` : `<p><a href="/contact">Contact RumiTech</a> and choose “Product support”.</p>`}
    </div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-h">
  <div class="wrap narrow">
    <header class="section-head reveal"><p class="eyebrow">FAQ</p><h2 id="faq-h">Questions, answered.</h2></header>
    <div class="reveal">${faq(p.faqs)}</div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="rel-h">
  <div class="wrap">
    <header class="section-head reveal"><p class="eyebrow">More from RumiTech</p><h2 id="rel-h">Related products</h2></header>
    <ul class="related">
      ${related.map((r) => `<li class="reveal" style="${themeStyle(r.theme)}"><a href="/products/${r.slug}"><i aria-hidden="true"></i><span><b>${esc(r.name)}</b><small>${esc(r.tagline)}</small></span><span aria-hidden="true">→</span></a></li>`).join('')}
    </ul>
  </div>
</section>

${cta({
  title: `Try ${esc(p.name)}.`,
  text: 'Questions or feedback? We would like to hear from you.',
  primary: ['Contact us', '/contact'],
  secondary: [`${p.name} privacy`, `${path}/privacy`],
})}`;

  const ld = [
    breadcrumbLd([['Home', '/'], ['Products', '/products'], [p.name, path]]),
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: p.name,
      description: p.summary,
      url: absUrl(path),
      applicationCategory: 'LifestyleApplication',
      publisher: { '@type': 'Organization', name: site.name, url: site.origin + '/' },
    },
  ];
  return {
    path,
    html: layout({
      path,
      title: `${p.name} — ${p.tagline}`,
      description: `${p.name}: ${p.summary}`,
      body,
      theme: p.theme,
      ogImage: `/og/${p.slug}.png`,
      jsonLd: ld,
      bodyClass: `product product-${p.slug}`,
    }),
  };
}

function productsIndex() {
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Products</p>
  <h1>Software with a point of view.</h1>
  <p class="hero-lead">Each product is built around a single everyday need, with its own identity and the same commitment to quality.</p>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
  <ul class="index-list">
    ${products
      .map(
        (p) => `<li class="reveal" style="${themeStyle(p.theme)}"><a class="index-card" href="/products/${p.slug}">
      <div class="index-art">${mock(p)}</div>
      <div class="index-copy"><p class="eyebrow">${esc(p.category)}</p><h2>${esc(p.name)}</h2><p>${esc(p.tagline)}</p><p class="status-line">${statusBadge(p.status)}</p><span class="link-arrow">View product <span aria-hidden="true">→</span></span></div></a></li>`
      )
      .join('')}
  </ul>
</div></section>
<section class="section section-alt" aria-labelledby="cmp-h"><div class="wrap">
  <header class="section-head reveal"><p class="eyebrow">Compare</p><h2 id="cmp-h">At a glance</h2></header>
  <div class="table-wrap reveal" role="region" aria-labelledby="cmp-h" tabindex="0">
    <table class="compare">
      <caption class="sr">Comparison of RumiTech products</caption>
      <thead><tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col">Best for</th><th scope="col">Status</th><th scope="col">Privacy</th></tr></thead>
      <tbody>${products
        .map(
          (p) => `<tr style="${themeStyle(p.theme)}"><th scope="row"><a href="/products/${p.slug}"><i aria-hidden="true"></i>${esc(p.name)}</a></th><td>${esc(p.category)}</td><td>${esc(p.audience.replace(/^For /, '').replace(/^./, (c) => c.toUpperCase()))}</td><td>${statusBadge(p.status)}</td><td><a href="/products/${p.slug}/privacy">Policy</a></td></tr>`
        )
        .join('')}</tbody>
    </table>
  </div>
</div></section>`;
  return {
    path: '/products',
    html: layout({
      path: '/products',
      title: 'Products',
      description: `Explore the ${site.shortName} product family: ${products.map((p) => p.name).join(', ')}.`,
      body,
      jsonLd: [breadcrumbLd([['Home', '/'], ['Products', '/products']])],
    }),
  };
}

export function productPages() {
  return [productsIndex(), ...products.map(productPage), ...products.map((p) => privacyPage(p))];
}
