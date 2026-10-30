import { enabledProjects } from '../data/products.mjs';
import { esc, statusBadge, themeStyle, actions, cta, draftNote, warn } from '../lib/ui.mjs';
import { layout, breadcrumbLd } from '../lib/layout.mjs';

function projectPage(p) {
  const path = `/projects/${p.slug}`;
  warn(`${p.name} (project): status and details are unconfirmed — neutral copy shown.`);
  const body = `
<section class="p-hero v-${p.theme.variant} project-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/projects">Projects</a> <span aria-hidden="true">/</span> <span>${esc(p.name)}</span></nav>
    <p class="eyebrow">Project</p>
    <h1>${esc(p.name)}</h1>
    <p class="hero-lead">${esc(p.tagline)}</p>
    <p class="status-line">${statusBadge(p.status)}</p>
  </div>
</section>
<section class="section"><div class="wrap narrow prose">
  <h2>About this project</h2>
  <p>${esc(p.summary)}</p>
  ${p.details.length ? p.details.map((d) => `<p>${esc(d)}</p>`).join('') : ''}
  ${draftNote(`Confirm ${p.name}'s status and add details in src/data/products.mjs → projects.`)}
  <div class="btn-row">${actions(p)}</div>
  <p><a class="link-arrow" href="/projects">All projects <span aria-hidden="true">→</span></a></p>
</div></section>
${cta({ title: 'Follow what we build.', text: 'Projects appear here as they are confirmed.', primary: ['Explore products', '/products'], secondary: ['Contact', '/contact'] })}`;
  return {
    path,
    html: layout({
      path,
      title: `${p.name} — project`,
      description: `${p.name}: a RumiTech Solutions project. ${p.summary}`,
      body,
      theme: p.theme,
      jsonLd: [breadcrumbLd([['Home', '/'], ['Projects', '/projects'], [p.name, path]])],
      bodyClass: 'project',
    }),
  };
}

export function projectPages() {
  const list = enabledProjects();
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="eyebrow">Projects &amp; experiments</p>
  <h1>Where new ideas take shape.</h1>
  <p class="hero-lead">Products are what is ready for you. Projects are what we are exploring — kept separate, and clearly labelled.</p>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
  <ul class="project-list">
    ${list
      .map(
        (p) => `<li class="reveal" style="${themeStyle(p.theme)}"><a href="/projects/${p.slug}">
      <span class="pl-top">${statusBadge(p.status)}</span>
      <h2>${esc(p.name)}</h2><p>${esc(p.summary)}</p>
      <span class="link-arrow">View project <span aria-hidden="true">→</span></span></a></li>`
      )
      .join('')}
  </ul>
  <p class="muted reveal">Looking for released software? See our <a href="/products">products</a>.</p>
</div></section>`;
  return [
    {
      path: '/projects',
      html: layout({
        path: '/projects',
        title: 'Projects',
        description: 'Projects and experiments from RumiTech Solutions, clearly labelled by status.',
        body,
        jsonLd: [breadcrumbLd([['Home', '/'], ['Projects', '/projects']])],
      }),
    },
    ...list.map(projectPage),
  ];
}
