// ─────────────────────────────────────────────────────────────
//  RumiTech Solutions — site-wide configuration (single source of truth)
//  Edit values here; no component changes are needed.
// ─────────────────────────────────────────────────────────────

export default {
  name: 'RumiTech Solutions',
  shortName: 'RumiTech',
  tagline: 'Thoughtfully built software for everyday life.',
  description:
    'RumiTech Solutions is an independent digital product studio building useful, intuitive and thoughtfully engineered software for everyday life.',

  // Canonical site origin (no trailing slash). Override at build time:
  //   SITE_ORIGIN=https://www.yourdomain.com npm run build
  // OWNER TODO: replace the fallback with your real production domain.
  origin: (process.env.SITE_ORIGIN || 'https://rumitech.example').replace(/\/$/, ''),

  // Public contact address used for the Contact page, privacy pages and the chat assistant.
  contact: {
    email: 'rumitech.solutions00@gmail.com',
    supportEmail: '', // optional; falls back to `email`
  },

  // Only add genuine profile URLs. Empty values are never rendered.
  social: {
    github: '',
    x: '',
    linkedin: '',
    youtube: '',
    instagram: '',
    playStoreDeveloper: '',
  },

  // Date shown on legal pages, e.g. '2026-11-01'. Leave '' until confirmed.
  legalEffectiveDate: '',

  // Shows highlighted "owner to confirm" notes on pages that depend on
  // information that has not been supplied yet. Set to false for production
  // ONLY after every item reported by the build has been resolved.
  showDraftNotices: true,

  // Product features carry a `verified` flag. Unverified features are hidden
  // unless this is true (useful for internal preview builds only).
  publishUnverified: false,
};
