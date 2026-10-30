// ─────────────────────────────────────────────────────────────
//  Product & project catalogue — the single source of truth.
//
//  To add a product: append an entry to `products`. Its page, privacy page,
//  homepage card, footer link, sitemap entry and structured data are generated.
//
//  IMPORTANT: Nothing below has been verified against the real apps.
//  Every feature/platform carries `verified: false`. Flip it to `true` (and
//  adjust the copy) once you have confirmed it in the current build.
//  Store links are intentionally empty — paste real URLs to enable buttons.
// ─────────────────────────────────────────────────────────────

/** status: 'available' | 'in-development' | 'experimental' | 'planned' | 'tbc' */
export const STATUS = {
  available: { label: 'Available', tone: 'ok' },
  'in-development': { label: 'In development', tone: 'dev' },
  experimental: { label: 'Experimental', tone: 'exp' },
  planned: { label: 'Planned', tone: 'plan' },
  tbc: { label: 'Details coming soon', tone: 'plan' },
};

const f = (title, text, verified = false) => ({ title, text, verified });

export const products = [
  {
    slug: 'imaanly',
    name: 'Imaanly',
    tagline: 'A calm companion for daily faith.',
    category: 'Islamic lifestyle',
    status: 'tbc',
    theme: {
      accent: '#3FC79A',
      accent2: '#D9B66F',
      tint: 'rgba(63,199,154,.14)',
      variant: 'sanctuary',
    },
    summary:
      'An Islamic lifestyle application designed around calm reading, clarity and everyday practice.',
    audience:
      'For people who want a respectful, distraction-free place for their daily Islamic practice.',
    problem:
      'Daily religious practice is spread across many separate tools, often cluttered with noise. Imaanly aims to bring what matters into one quiet, well-considered place.',
    how: [
      ['Open', 'Start with a calm home screen focused on what you need today.'],
      ['Read & practise', 'Move between reading and daily practice without friction.'],
      ['Return', 'Pick up exactly where you left off.'],
    ],
    features: [
      f('Quran reading', 'A focused reading experience with comfortable typography.'),
      f('Mushaf view', 'View pages in a traditional Mushaf layout.'),
      f('Prayer times & Qibla', 'Prayer times and Qibla direction for your location.'),
      f('Duas & hadith', 'Collections you can browse and return to.'),
      f('Translations & tafsir', 'Study alongside the text.'),
      f('Bookmarks', 'Save your place and return to it.'),
    ],
    platforms: [
      { name: 'Android', verified: false },
      { name: 'iOS', verified: false },
    ],
    links: { googlePlay: '', appStore: '', web: '', repo: '', support: '' },
    faqs: [
      ['Is Imaanly available to download?', 'Availability is announced on this page. Store buttons appear here as soon as official listings are added.'],
      ['Where is the privacy policy?', 'Imaanly has its own privacy page, linked from this page and from the site footer.'],
      ['How can I send feedback?', 'Use the Contact page and choose “Feedback and suggestions”.'],
    ],
    related: ['stockly', 'circlo'],
  },
  {
    slug: 'stockly',
    name: 'Stockly',
    tagline: 'Know what you have, at a glance.',
    category: 'Lists & inventory',
    status: 'tbc',
    theme: {
      accent: '#FFA94D',
      accent2: '#FFD8A8',
      tint: 'rgba(255,169,77,.13)',
      variant: 'grid',
    },
    summary:
      'A practical way to keep track of personal items, lists and inventory.',
    audience:
      'For anyone who wants a clear, organised record of the things they own, use or need to restock.',
    problem:
      'Items get forgotten, bought twice or run out unnoticed. Stockly gives everyday inventory a tidy, dependable home.',
    how: [
      ['Add', 'Record the items that matter to you.'],
      ['Organise', 'Group and review them in a clear structure.'],
      ['Stay on top', 'See what you have and what needs attention.'],
    ],
    features: [
      f('Item tracking', 'Keep a clear list of the items you manage.'),
      f('Organised lists', 'Group items in a way that suits you.'),
      f('Quick overview', 'See the state of your inventory at a glance.'),
    ],
    platforms: [
      { name: 'Android', verified: false },
      { name: 'iOS', verified: false },
    ],
    links: { googlePlay: '', appStore: '', web: '', repo: '', support: '' },
    faqs: [
      ['Is Stockly available to download?', 'Availability is announced on this page. Store buttons appear here once official listings are added.'],
      ['Where is the privacy policy?', 'Stockly has its own privacy page, linked from this page and from the site footer.'],
    ],
    related: ['finmate', 'imaanly'],
  },
  {
    slug: 'finmate',
    name: 'FinMate',
    tagline: 'Your money, clearly organised.',
    category: 'Personal finance',
    status: 'tbc',
    theme: {
      accent: '#6C9BFF',
      accent2: '#9BE7D2',
      tint: 'rgba(108,155,255,.14)',
      variant: 'ledger',
    },
    summary:
      'A personal finance application for keeping your own money records in order.',
    audience:
      'For people who want a simple, structured view of their own income, spending and balances.',
    problem:
      'Money records scattered across notes, messages and memory make it hard to see where things stand. FinMate is built to give personal finances one clear place.',
    how: [
      ['Record', 'Add the money movements you want to keep track of.'],
      ['Review', 'See income, expenses and balances in a readable layout.'],
      ['Decide', 'Make your own decisions with a clearer picture.'],
    ],
    features: [
      f('Money tracking', 'Record income and expenses.'),
      f('Accounts & balances', 'Keep track of your own accounts and balances.'),
      f('Transfers', 'Record movements between your own accounts.'),
    ],
    platforms: [
      { name: 'Android', verified: false },
      { name: 'iOS', verified: false },
    ],
    links: { googlePlay: '', appStore: '', web: '', repo: '', support: '' },
    notice:
      'FinMate is a personal record-keeping tool. It is not a bank, does not provide financial advice, and does not move real money.',
    noticeVerified: false,
    faqs: [
      ['Is FinMate a bank?', 'No. FinMate is a personal finance application for organising your own records. It is not a bank or a regulated financial service.'],
      ['Is FinMate available to download?', 'Availability is announced on this page. Store buttons appear here once official listings are added.'],
      ['Where is the privacy policy?', 'FinMate has its own privacy page, linked from this page and from the site footer.'],
    ],
    related: ['stockly', 'circlo'],
  },
  {
    slug: 'circlo',
    name: 'Circlo',
    tagline: 'Stay close to the people who matter.',
    category: 'Circles & location',
    status: 'tbc',
    theme: {
      accent: '#FF8272',
      accent2: '#FFC6B8',
      tint: 'rgba(255,130,114,.13)',
      variant: 'orbit',
    },
    summary:
      'A location-aware product for coordinating with the circles of family and friends you choose.',
    audience:
      'For families and friends who want to stay coordinated, on terms everyone understands.',
    problem:
      '“Where are you?” messages interrupt everyone. Circlo is designed to make coordination easier while keeping people in control of what they share.',
    how: [
      ['Create a circle', 'Bring together the people you choose.'],
      ['Share on your terms', 'Decide what is shared and with whom.'],
      ['Coordinate', 'See what you need to meet up and stay in sync.'],
    ],
    features: [
      f('Circles', 'Create groups of the people you choose.'),
      f('Location sharing', 'Share location within a circle.'),
      f('Map view', 'See circle members on a map.'),
    ],
    platforms: [
      { name: 'Android', verified: false },
      { name: 'iOS', verified: false },
    ],
    links: { googlePlay: '', appStore: '', web: '', repo: '', support: '' },
    faqs: [
      ['Does Circlo track me all the time?', 'The exact location behaviour of the app will be described precisely on the Circlo privacy page once confirmed. This site makes no claim about background tracking.'],
      ['Is Circlo available to download?', 'Availability is announced on this page. Store buttons appear here once official listings are added.'],
      ['Where is the privacy policy?', 'Circlo has its own privacy page, linked from this page and from the site footer.'],
    ],
    related: ['finmate', 'imaanly'],
    locationProduct: true,
  },
];

// Projects & experiments. Set enabled:false to hide a project everywhere.
export const projects = [
  {
    slug: 'stashtrail',
    name: 'StashTrail',
    tagline: 'A RumiTech project.',
    status: 'tbc',
    enabled: true,
    theme: { accent: '#C8F560', accent2: '#5CE1E6', tint: 'rgba(200,245,96,.10)', variant: 'grid' },
    summary: 'A RumiTech project. Details will be published here once they are confirmed.',
    details: [],
    links: { repo: '', web: '' },
  },
  {
    slug: 'ridecare',
    name: 'RideCare',
    tagline: 'A RumiTech project.',
    status: 'tbc',
    enabled: true,
    theme: { accent: '#5CE1E6', accent2: '#C8F560', tint: 'rgba(92,225,230,.10)', variant: 'orbit' },
    summary: 'A RumiTech project. Details will be published here once they are confirmed.',
    details: [],
    links: { repo: '', web: '' },
  },
];

export const enabledProjects = () => projects.filter((p) => p.enabled);
export const getProduct = (slug) => products.find((p) => p.slug === slug);
