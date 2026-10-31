import site from '../../site.config.mjs';
import { privacyFacts, sectionsFor, SECTION_COPY } from '../data/privacy.mjs';
import { esc, draftNote, contactEmail, warn, themeStyle } from '../lib/ui.mjs';
import { layout, breadcrumbLd } from '../lib/layout.mjs';

const effective = () => {
  if (!site.legalEffectiveDate) warn('Legal effective date is not set (site.config.mjs → legalEffectiveDate).');
  return site.legalEffectiveDate
    ? `<time datetime="${esc(site.legalEffectiveDate)}">${esc(site.legalEffectiveDate)}</time>`
    : '<span class="pending">Not yet set</span>';
};

const contactBlock = () => {
  const e = contactEmail('general');
  if (!e) warn('Privacy contact email is not set (site.config.mjs → contact.email).');
  return e
    ? `<p>Email: <a href="mailto:${esc(e)}">${esc(e)}</a></p>`
    : `<p>Please use our <a href="/contact">Contact page</a>.</p>${draftNote('Add a monitored privacy contact email in site.config.mjs.')}`;
};

function docLayout({ path, title, intro, sections, crumbs, theme, description, label }) {
  const body = `
<article class="legal">
  <div class="wrap legal-grid">
    <header class="legal-head">
      <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
      <p class="eyebrow">${esc(label)}</p>
      <h1>${esc(title)}</h1>
      <p class="meta">Effective date: ${effective()}</p>
      <p class="lead">${intro}</p>
      <button class="btn btn-ghost btn-sm print-btn" type="button" data-print>Print this page</button>
    </header>
    <nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>
      ${sections.map((s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('')}
    </ol></nav>
    <div class="legal-body">
      ${sections.map((s) => `<section id="${s.id}"><h2>${esc(s.title)}</h2>${s.html}</section>`).join('\n')}
    </div>
  </div>
</article>`;
  return layout({
    path,
    title,
    description,
    body,
    theme,
    jsonLd: [breadcrumbLd([['Home', '/'], ...crumbsData(path, title)])],
    bodyClass: 'legal-page',
  });
}

const crumbsData = (path, title) => {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 1) return [[title, path]];
  return [['Products', '/products'], [parts[1], `/products/${parts[1]}`], [title, path]];
};

export function privacyPage(p) {
  const path = `/products/${p.slug}/privacy`;
  const facts = privacyFacts[p.slug] || {};
  const sections = sectionsFor(p).map((id) => {
    const [title, desc] = SECTION_COPY[id];
    let html;
    if (id === 'contact') {
      html = contactBlock();
    } else if (id === 'updates') {
      html = `<p>If this policy changes, the updated version will be published on this page with a new effective date.</p>`;
    } else if (facts[id]?.length) {
      html = facts[id].map((t) => `<p>${esc(t)}</p>`).join('');
    } else {
      warn(`${p.name} privacy → “${title}” has no confirmed content yet.`);
      html = `<p class="muted">${esc(desc)} The details for ${esc(p.name)} are being finalised and will be published here.</p>${draftNote(`Add verified statements for “${title}” in src/data/privacy.mjs (${p.slug}.${id}).`)}`;
    }
    return { id, title, html };
  });
  return {
    path,
    html: docLayout({
      path,
      title: `${p.name} Privacy Policy`,
      label: p.name,
      intro: `This policy explains how ${esc(p.name)}, a product of ${esc(site.name)}, handles information.`,
      sections,
      theme: p.theme,
      crumbs: `<a href="/products">Products</a> <span aria-hidden="true">/</span> <a href="/products/${p.slug}">${esc(p.name)}</a> <span aria-hidden="true">/</span> <span>Privacy</span>`,
      description: `Read the ${p.name} privacy policy: how ${p.name}, a product of ${site.name}, handles information, plus how to contact us about your data.`,
    }),
  };
}

// Company website privacy — describes how THIS static website works.
export function companyPrivacy() {
  const e = contactEmail('general');
  const sections = [
    { id: 'scope', title: 'Scope', html: `<p>This policy covers the ${esc(site.name)} website. Each app has its own privacy policy, linked from its product page.</p>` },
    { id: 'collect', title: 'What this website collects', html: `<p>This website does not use accounts, contact forms, advertising trackers or analytics scripts, and does not set cookies of its own.</p><p>Like any website, the hosting provider may process technical request data (such as IP address and browser type) to deliver pages and keep the service secure.</p>${draftNote('If you add analytics, forms or embeds later, update this section first.')}` },
    { id: 'hosting', title: 'Hosting', html: `<p>The site is a static website intended to be served from Cloudflare Pages. Hosting providers process request data under their own policies.</p>${draftNote('Confirm the production hosting provider.')}` },
    { id: 'contacting', title: 'When you contact us', html: `<p>If you email us, we use the details you send only to respond to you and to keep a record of the conversation.</p>${draftNote('Confirm how long correspondence is retained.')}` },
    { id: 'external', title: 'External links', html: `<p>Links to app stores and other sites are governed by those sites’ own policies.</p>` },
    { id: 'rights', title: 'Your choices', html: `<p>You can ask us what we hold about you, or ask us to delete it, using the contact details below.</p>` },
    { id: 'updates', title: 'Changes to this policy', html: `<p>Updates will be published on this page with a new effective date.</p>` },
    { id: 'contact', title: 'Contact', html: contactBlock() },
  ];
  if (!e) warn('Company privacy: contact email missing.');
  return {
    path: '/privacy',
    html: docLayout({
      path: '/privacy',
      title: 'Website Privacy Policy',
      label: 'Company',
      intro: `How the ${esc(site.name)} website handles information.`,
      sections,
      crumbs: `<a href="/">Home</a> <span aria-hidden="true">/</span> <span>Privacy</span>`,
      description: `The ${site.name} website privacy policy: no accounts, advertising trackers or analytics scripts, and how to contact us about your information.`,
    }),
  };
}
