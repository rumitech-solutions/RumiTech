// ─────────────────────────────────────────────────────────────
//  Product privacy content — fill in ONLY what you have verified in the app.
//
//  For each product slug, add facts under the matching section id.
//  Each fact is a plain sentence (HTML escaped automatically).
//  Sections left empty render a neutral "being finalised" message.
//
//  Section ids: collected, provided, account, location, content, use,
//  processors, retention, sharing, security, rights, deletion, children,
//  international, updates, contact
//
//  Do NOT write definitive claims (e.g. "we collect no personal data")
//  unless you have confirmed them in the current implementation.
// ─────────────────────────────────────────────────────────────

export const privacyFacts = {
  imaanly: {},
  stockly: {},
  finmate: {},
  circlo: {},
};

// Sections that apply to each product. Location is only relevant to Circlo
// by default; add 'location' to other products if they use location.
export const sectionsFor = (product) => {
  const base = ['collected', 'provided', 'account', 'content', 'use', 'processors', 'retention', 'sharing', 'security', 'rights', 'deletion', 'children', 'international', 'updates', 'contact'];
  if (product.locationProduct || product.slug === 'imaanly') base.splice(3, 0, 'location');
  return base;
};

export const SECTION_COPY = {
  collected: ['Information we collect', 'What the app collects or generates when you use it.'],
  provided: ['Information you provide', 'Anything you enter into the app yourself.'],
  account: ['Account and authentication', 'How sign-in works, if the app uses accounts.'],
  location: ['Location information', 'Whether the app uses your location, when, and how that is controlled.'],
  content: ['User-generated content', 'What you create or store in the app.'],
  use: ['How information is used', 'The purposes for which information is used.'],
  processors: ['Cloud services and third parties', 'Services that process information on our behalf.'],
  retention: ['Data storage and retention', 'Where information is kept and for how long.'],
  sharing: ['Data sharing', 'Who, if anyone, information is shared with.'],
  security: ['Security', 'The protections in place, described accurately.'],
  rights: ['Your rights and choices', 'Controls and choices available to you.'],
  deletion: ['Account and data deletion', 'How you can have your information removed.'],
  children: ['Children’s privacy', 'How the app treats users who are children.'],
  international: ['International users', 'Where information may be processed and the legal framework that applies.'],
  updates: ['Changes to this policy', 'How updates are communicated.'],
  contact: ['Contact', 'How to reach us about privacy.'],
};
