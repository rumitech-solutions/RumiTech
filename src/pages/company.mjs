import site from '../../site.config.mjs';
import { products } from '../data/products.mjs';
import { esc, cta, draftNote, contactEmail, warn, themeStyle } from '../lib/ui.mjs';
import { layout, breadcrumbLd } from '../lib/layout.mjs';
import { companyPrivacy } from './privacy-doc.mjs';

function about() {
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">About</p>
  <h1>We make software we would want to use.</h1>
  <p class="hero-lead">${esc(site.name)} is an independent studio building its own products — one careful, useful idea at a time.</p>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap split">
  <div class="reveal prose">
    <h2>Why we build</h2>
    <p>Much of everyday software is noisy, over-promised or hard to trust. We think useful software can be calmer: focused on one real need, honest about what it does, and pleasant to return to.</p>
    <p>So we build our own products rather than client work, and we give each one the time to be done properly.</p>
  </div>
  <div class="reveal prose">
    <h2>How we work</h2>
    <ul class="ticks">
      <li><b>Design that gets out of the way.</b> Clear structure and calm interfaces.</li>
      <li><b>Engineering for reliability.</b> Software that behaves as expected.</li>
      <li><b>Privacy as a design decision.</b> Careful handling of what people share.</li>
      <li><b>Continuous improvement.</b> Release, listen, refine — and repeat.</li>
    </ul>
  </div>
</div></section>

<section class="section section-alt"><div class="wrap">
  <header class="section-head reveal"><p class="eyebrow">The portfolio</p><h2>A family that keeps growing.</h2><p>Each product has its own identity; all share the same standards.</p></header>
  <ul class="related">
    ${products.map((p) => `<li class="reveal" style="${themeStyle(p.theme)}"><a href="/products/${p.slug}"><i aria-hidden="true"></i><span><b>${esc(p.name)}</b><small>${esc(p.tagline)}</small></span><span aria-hidden="true">→</span></a></li>`).join('')}
  </ul>
</div></section>

${cta({ title: 'Say hello.', text: 'Questions, feedback or ideas — we read everything.', primary: ['Contact us', '/contact'], secondary: ['See our products', '/products'] })}`;
  return {
    path: '/about',
    html: layout({
      path: '/about',
      title: 'About',
      description: `About ${site.name}: an independent studio building useful, thoughtfully engineered software.`,
      body,
      jsonLd: [breadcrumbLd([['Home', '/'], ['About', '/about']])],
    }),
  };
}

function contact() {
  const email = contactEmail('general');
  if (!email) warn('Contact page: contact.email is empty — contact form is hidden.');
  const topics = [
    ['General inquiries', 'Questions about RumiTech or our work.', 'General inquiry'],
    ['Product support', 'Help with one of our apps.', 'Product support'],
    ['Feedback & suggestions', 'Tell us what to improve or build.', 'Feedback'],
    ['Collaboration & business', 'Partnerships and other proposals.', 'Collaboration'],
  ];
  const form = email ? `
  <form class="cform reveal" id="form" data-contact-form data-email="${esc(email)}" novalidate aria-labelledby="form-h">
    <h2 id="form-h">Write to us</h2>
    <p class="muted">This opens your email app with your message ready to send to <b>${esc(email)}</b>. Nothing is sent from this page.</p>
    <div class="field"><label for="c-topic">Topic</label>
      <select id="c-topic" name="topic">${topics.map(([, , s]) => `<option>${s}</option>`).join('')}</select></div>
    <div class="field"><label for="c-name">Your name</label>
      <input id="c-name" name="name" autocomplete="name" required aria-describedby="c-name-e"><p class="field-error" id="c-name-e" hidden></p></div>
    <div class="field"><label for="c-email">Your email <span class="muted">(so we can reply)</span></label>
      <input id="c-email" name="email" type="email" autocomplete="email" required aria-describedby="c-email-e"><p class="field-error" id="c-email-e" hidden></p></div>
    <div class="field"><label for="c-msg">Message</label>
      <textarea id="c-msg" name="message" rows="6" required minlength="10" aria-describedby="c-msg-e"></textarea><p class="field-error" id="c-msg-e" hidden></p></div>
    <div class="btn-row">
      <button class="btn btn-primary btn-lg" type="submit">Open in my email app</button>
      <button class="btn btn-ghost btn-lg" type="button" data-copy-email>Copy email address</button>
    </div>
    <p class="form-status" role="status" aria-live="polite" data-form-status></p>
  </form>` : '';
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Contact</p>
  <h1>Let’s talk.</h1>
  <p class="hero-lead">Choose what fits best and we will take it from there.</p>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
  ${email ? '' : `<div class="reveal">${draftNote('No contact email is configured. Set contact.email in site.config.mjs to enable the options below.') || ''}<p class="muted">Contact details will be published here soon.</p></div>`}
  <ul class="topics">
    ${topics
      .map(([t, d, subj]) => `<li class="reveal"><h2>${t}</h2><p>${d}</p>${email ? `<a class="btn btn-ghost" href="#form" data-topic="${subj}">Write to us</a>` : '<span class="btn btn-static" role="note">Not available yet</span>'}</li>`)
      .join('')}
  </ul>
  <div class="contact-split">
    ${form}
    <aside class="contact-aside reveal" aria-labelledby="aside-h">
      <h2 id="aside-h">Helpful to include</h2>
      <ul>
        <li><b>Which product</b> you are writing about, if any.</li>
        <li><b>What happened</b> and what you expected instead.</li>
        <li><b>Your device and app version</b> for support questions.</li>
      </ul>
      <p class="muted">Please do not send passwords or sensitive personal details by email.</p>
      <p>Prefer to email directly?<br><a href="mailto:${esc(email)}">${esc(email)}</a></p>
      <p class="small">See our <a href="/privacy">website privacy policy</a>.</p>
    </aside>
  </div>
</div></section>`;
  return {
    path: '/contact',
    html: layout({
      path: '/contact',
      title: 'Contact',
      description: `Contact ${site.name} for general inquiries, product support, feedback or collaboration.`,
      body,
      jsonLd: [breadcrumbLd([['Home', '/'], ['Contact', '/contact']])],
    }),
  };
}

export function notFound() {
  const body = `
<section class="page-hero nf"><div class="wrap">
  <p class="eyebrow">404</p>
  <h1>This page wandered off.</h1>
  <p class="hero-lead">The page you are looking for doesn’t exist or has moved.</p>
  <div class="btn-row"><a class="btn btn-primary btn-lg" href="/">Back to home</a><a class="btn btn-ghost btn-lg" href="/products">Explore products</a></div>
</div></section>`;
  return { path: '/404', file: '404.html', html: layout({ path: '/404', title: 'Page not found', description: 'Page not found.', body, noindex: true }) };
}

export const companyPages = () => [about(), contact(), companyPrivacy(), notFound()];
