/* RumiTech guided assistant + command palette.
   Runs entirely in the browser using /assets/site-data.json (verified site facts only).
   It is a rules-based guide, not an AI model — and it says so. */
(() => {
  const d = document;
  let DATA = null, loading = null;
  const load = () => loading || (loading = fetch('/assets/site-data.json').then((r) => r.json()).then((j) => (DATA = j)).catch(() => null));
  const el = (tag, attrs = {}, ...kids) => {
    const n = tag === 'svg' ? d.createElementNS('http://www.w3.org/2000/svg', 'svg') : d.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'innerHTML') n.innerHTML = v; else if (k === 'class') n.className = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => c != null && n.append(c.nodeType ? c : d.createTextNode(c)));
    return n;
  };
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const focusables = (root) => [...root.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hidden && x.offsetParent !== null);
  const trap = (root, e) => {
    if (e.key !== 'Tab') return;
    const f = focusables(root); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ───────────── Command palette ───────────── */
  let pal = null;
  const ACTIONS = [
    { title: 'Switch theme', kw: 'dark light mode appearance colour', run: () => d.querySelector('[data-theme-toggle]')?.click() },
    { title: 'Copy contact email', kw: 'email address mail contact', run: () => { const m = DATA && DATA.email; if (!m) return (location.href = '/contact'); (navigator.clipboard?.writeText(m) || Promise.reject()).then(() => window.rtToast?.('Email address copied'), () => window.rtToast?.(m)); } },
    { title: 'Keyboard shortcuts', kw: 'keys help hotkeys shortcuts', run: () => d.dispatchEvent(new KeyboardEvent('keydown', { key: '?', bubbles: true })) },
    { title: 'Open the assistant', kw: 'chat help ask bot guide', run: () => d.querySelector('.chat-launch')?.click() },
  ];
  const go = (it, close) => { if (it.run) { close(); setTimeout(it.run, 20); } else location.href = it.url; };
  const buildPalette = () => {
    const input = el('input', { type: 'text', id: 'pal-input', placeholder: 'Search pages and products…', 'aria-label': 'Search the site', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'pal-list', autocomplete: 'off', spellcheck: 'false' });
    const list = el('ul', { id: 'pal-list', role: 'listbox', 'aria-label': 'Results' });
    const box = el('div', { class: 'pal-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Search the site' },
      el('div', { class: 'pal-top' }, input, el('kbd', { 'aria-hidden': 'true' }, 'Esc')), list,
      el('p', { class: 'pal-hint', 'aria-hidden': 'true' }, '↑ ↓ to move · Enter to open'));
    const wrap = el('div', { class: 'pal', hidden: true }, el('div', { class: 'pal-scrim', 'data-close': '' }), box);
    d.body.append(wrap);
    let items = [], idx = 0, opener = null;
    const render = () => {
      const q = norm(input.value);
      const all = (DATA ? DATA.pages : []).concat(ACTIONS);
      items = (q ? all.filter((p) => norm(p.title + ' ' + p.kw).split(' ').some((w) => w.startsWith(q.split(' ')[0])) && q.split(' ').every((t) => norm(p.title + ' ' + p.kw).includes(t))) : all).slice(0, 9);
      idx = 0;
      list.replaceChildren(...(items.length ? items.map((p, i) => el('li', { role: 'option', id: 'pal-' + i, 'aria-selected': String(i === 0), 'data-i': i },
        el('a', { href: p.url || '#', tabindex: '-1', onclick: (ev) => { if (p.run) { ev.preventDefault(); go(p, close); } } }, el('span', {}, p.title), el('small', {}, p.url || 'Action'))))
        : [el('li', { class: 'pal-empty', role: 'presentation' }, 'No matches. Try “privacy”, a product name, or ask the assistant.')]));
      input.setAttribute('aria-activedescendant', items.length ? 'pal-0' : '');
    };
    const mark = (n) => {
      if (!items.length) return;
      idx = (n + items.length) % items.length;
      [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === idx)));
      input.setAttribute('aria-activedescendant', 'pal-' + idx);
      list.children[idx].scrollIntoView({ block: 'nearest' });
    };
    const close = () => { wrap.hidden = true; d.documentElement.classList.remove('modal-open'); (opener || d.body).focus?.(); };
    input.addEventListener('input', render);
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); mark(idx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(idx - 1); }
      else if (e.key === 'Enter' && items[idx]) { e.preventDefault(); go(items[idx], close); }
      else trap(box, e);
    });
    wrap.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    return {
      open(from) { opener = from || d.activeElement; wrap.hidden = false; d.documentElement.classList.add('modal-open'); input.value = ''; load().then(render); render(); input.focus(); },
    };
  };
  const openPalette = (from) => { pal = pal || buildPalette(); pal.open(from); };
  d.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', () => openPalette(b)));
  d.addEventListener('keydown', (e) => {
    const t = e.target, typing = t.matches?.('input,textarea,select,[contenteditable]');
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openPalette(); }
  });

  /* ───────────── Assistant ───────────── */
  const SUGGEST = ['What products do you have?', 'Which product is right for me?', 'How do I contact you?', 'Where are the privacy policies?'];
  let panel, log, form, field, launcher, transcript = [], started = false;

  const say = (who, text, links = [], chips = []) => {
    const msg = el('div', { class: 'msg msg-' + who });
    text.split('\n').forEach((line) => msg.append(el('p', {}, line)));
    if (links.length) msg.append(el('p', { class: 'msg-links' }, links.map((l) => el('a', { href: l[1], class: 'msg-link' }, l[0] + ' →'))));
    log.append(msg);
    if (chips.length) {
      const row = el('div', { class: 'chips-row' }, chips.map((c) => el('button', { type: 'button', class: 'chip', onclick: () => { row.remove(); ask(c); } }, c)));
      log.append(row);
    }
    log.scrollTop = log.scrollHeight;
    transcript.push((who === 'bot' ? 'Assistant: ' : 'Me: ') + text);
  };

  const prod = (q) => DATA.products.find((p) => new RegExp('\\b' + p.slug + '\\b').test(q));
  const proj = (q) => DATA.projects.find((p) => new RegExp('\\b' + p.slug + '\\b').test(q));
  const has = (q, ...ws) => ws.some((w) => (w.includes(' ') ? q.includes(w) : new RegExp('\\b' + w + '\\b').test(q)));
  const mail = (subject) => DATA.email ? `mailto:${DATA.email}?subject=${encodeURIComponent(subject)}` : '/contact';

  const productCard = (p) => {
    let t = `${p.name} — ${p.tagline}\n${p.summary}\nStatus: ${p.statusLabel}.`;
    if (p.features.length) t += '\nFeatures: ' + p.features.map((f) => f.title).join(', ') + '.';
    else t += '\nFeature details have not been published yet.';
    return t;
  };

  const answer = (raw) => {
    const q = norm(raw), D = DATA;
    if (!q) return null;
    const P = prod(q);
    const more = ['Products', 'Contact', 'Privacy'];

    if (has(q, 'hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good evening')) return ['Hello! I can help you find the right product, check its status, or point you to a privacy policy or contact option. What would you like to know?', [], SUGGEST];

    if (P && has(q, 'privacy', 'data', 'policy', 'delete', 'personal information')) return [`${P.name} has its own privacy policy. I can’t summarise details that haven’t been confirmed, so please read it directly.`, [[`${P.name} privacy policy`, P.privacy]], []];
    if (P && P.location && has(q, 'track', 'tracking', 'location', 'background', 'spy', 'surveillance')) return ['I don’t make claims about how Circlo uses location beyond what is confirmed on its privacy page. Please read the policy, or email us a specific question.', [['Circlo privacy policy', P.privacy], ['Email us', mail('Circlo location question')]], []];
    if (P && has(q, 'download', 'install', 'play store', 'google play', 'app store', 'ios', 'android', 'get', 'available', 'release', 'launch', 'when')) {
      const links = []; if (P.links.googlePlay) links.push(['Google Play', P.links.googlePlay]); if (P.links.appStore) links.push(['App Store', P.links.appStore]); if (P.links.web) links.push(['Launch web app', P.links.web]);
      return [links.length ? `${P.name} status: ${P.statusLabel}. Here are the official links:` : `${P.name} status: ${P.statusLabel}. There is no official download link published yet. Store buttons will appear on its page once listings exist.`, links.length ? links : [[`${P.name} page`, P.url]], []];
    }
    if (P && has(q, 'feature', 'features', 'what does', 'do', 'does', 'can it', 'include')) return [P.features.length ? `${P.name} features:\n` + P.features.map((f) => `• ${f.title}: ${f.text}`).join('\n') : `${P.name}’s feature list hasn’t been published yet — I’d rather not guess. ${P.summary}`, [[`${P.name} page`, P.url]], []];
    if (P) return [productCard(P), [[`Open ${P.name}`, P.url], [`${P.name} privacy`, P.privacy]], []];

    const J = proj(q); if (J) return [`${J.name}: ${J.summary} Status: ${J.statusLabel}.`, [[`Open ${J.name}`, J.url]], []];

    if (has(q, 'quran', 'prayer', 'islam', 'islamic', 'muslim', 'faith', 'dua', 'hadith', 'qibla', 'namaz', 'salah')) { const p = D.products.find((x) => x.slug === 'imaanly'); return [`That sounds like ${p.name}, our Islamic lifestyle app. ${p.summary} Status: ${p.statusLabel}.`, [[`Open ${p.name}`, p.url]], []]; }
    if (has(q, 'inventory', 'stock', 'items', 'list', 'lists', 'organize', 'organise', 'groceries', 'restock')) { const p = D.products.find((x) => x.slug === 'stockly'); return [`${p.name} may suit you: ${p.summary} Status: ${p.statusLabel}.`, [[`Open ${p.name}`, p.url]], []]; }
    if (has(q, 'money', 'finance', 'financial', 'budget', 'expense', 'expenses', 'income', 'spending', 'balance', 'bank')) { const p = D.products.find((x) => x.slug === 'finmate'); return [`${p.name} is our personal finance app: ${p.summary} It is a record-keeping tool — not a bank and not financial advice. Status: ${p.statusLabel}.`, [[`Open ${p.name}`, p.url]], []]; }
    if (has(q, 'family', 'friends', 'circle', 'circles', 'map', 'coordinate', 'share location', 'meet')) { const p = D.products.find((x) => x.slug === 'circlo'); return [`${p.name} is built for this: ${p.summary} Status: ${p.statusLabel}.`, [[`Open ${p.name}`, p.url], [`${p.name} privacy`, p.privacy]], []]; }

    if (has(q, 'which product', 'recommend', 'right for me', 'suggest', 'best for', 'help me choose', 'fit')) return ['Tell me what you’d like to do and I’ll point you to the right product — or pick a need:', [], ['Daily faith & Quran', 'Track items & inventory', 'Organise my money', 'Stay close to family']];
    if (has(q, 'privacy', 'policy', 'policies', 'cookies', 'analytics', 'tracking', 'data')) return ['Each product has its own privacy policy, plus one for this website. Which one do you need?', [['Website privacy', '/privacy'], ...D.products.map((p) => [`${p.name} privacy`, p.privacy])], []];
    if (has(q, 'contact', 'email', 'mail', 'reach', 'talk', 'human', 'person', 'support', 'help', 'feedback', 'suggestion', 'collaborate', 'collaboration', 'business', 'partner', 'partnership', 'bug', 'report')) return [D.email ? `You can reach the team at ${D.email}, or use the contact form which opens your email app with your message ready.` : 'Please use the contact page.', [['Contact page', '/contact'], ...(D.email ? [['Email us', mail('Question from the website')]] : [])], []];
    if (has(q, 'price', 'pricing', 'cost', 'free', 'paid', 'subscription', 'how much')) return ['No pricing has been published for any product yet, so I can’t say. Check each product page, which will show store listings once they exist, or email us.', [['Products', '/products'], ['Email us', mail('Pricing question')]], []];
    if (has(q, 'products', 'apps', 'app', 'what do you make', 'what do you have', 'portfolio', 'offer')) return ['We build our own products. Here is the family:\n' + D.products.map((p) => `• ${p.name} — ${p.tagline} (${p.statusLabel})`).join('\n'), [['All products', '/products']], []];
    if (has(q, 'projects', 'project', 'experiments', 'roadmap', 'upcoming', 'future', 'next')) return ['Projects and experiments are kept apart from products:\n' + D.projects.map((p) => `• ${p.name} (${p.statusLabel})`).join('\n'), [['All projects', '/projects']], []];
    if (has(q, 'about', 'who are you', 'company', 'studio', 'rumitech', 'team', 'founder', 'where are you', 'office', 'address')) return ['RumiTech Solutions is an independent product studio building its own useful, thoughtfully engineered software. I don’t have details about team size or office locations, so I won’t guess.', [['About RumiTech', '/about']], []];
    if (has(q, 'ai', 'bot', 'robot', 'chatgpt', 'human')) return ['I’m an automated guide built into this website. I answer from the site’s published information and can’t access your data. For a person, email us.', [['Email us', mail('Question from the website')]], []];
    if (has(q, 'thanks', 'thank', 'shukriya', 'great', 'ok', 'okay')) return ['You’re welcome! Anything else I can help with?', [], SUGGEST];
    return ['I’m not sure I understood that — and I’d rather not guess. Try asking about a product, privacy, availability or contact, or email the team directly.', [['Email us', mail('Question from the website')]], SUGGEST];
  };

  const ask = (text) => {
    say('me', text);
    log.setAttribute('aria-busy', 'true');
    const typing = el('div', { class: 'msg msg-bot typing', 'aria-hidden': 'true' }, el('i'), el('i'), el('i'));
    log.append(typing); log.scrollTop = log.scrollHeight;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      typing.remove(); log.removeAttribute('aria-busy');
      if (!DATA) return say('bot', 'Sorry, I couldn’t load the site information. Please use the contact page.', [['Contact', '/contact']]);
      const r = answer(text) || ['Ask me anything about RumiTech.', [], SUGGEST];
      say('bot', r[0], r[1], r[2]);
    }, reduce ? 0 : 380);
  };

  const build = () => {
    log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversation' });
    field = el('input', { type: 'text', id: 'chat-input', placeholder: 'Ask about products, privacy, contact…', 'aria-label': 'Your message', autocomplete: 'off', maxlength: '300' });
    form = el('form', { class: 'chat-form', onsubmit: (e) => { e.preventDefault(); const v = field.value.trim(); if (!v) return; field.value = ''; if (v === 'Search the site') return openPalette(); ask(v); } },
      field, el('button', { type: 'submit', class: 'chat-send', 'aria-label': 'Send' }, el('svg', { viewBox: '0 0 24 24', width: '20', height: '20', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<path d="M5 12h14M13 6l6 6-6 6"/>' })));
    const close = el('button', { type: 'button', class: 'icon-btn chat-close', 'aria-label': 'Close assistant', onclick: () => toggle(false) }, '✕');
    const email = el('button', { type: 'button', class: 'chat-human', onclick: () => { if (!DATA?.email) return (location.href = '/contact'); const body = transcript.slice(-12).join('\n\n').slice(0, 1500); location.href = `mailto:${DATA.email}?subject=${encodeURIComponent('Question from the website')}&body=${encodeURIComponent(body)}`; } }, 'Email this conversation to the team');
    panel = el('section', { class: 'chat', id: 'chat-panel', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'chat-title', hidden: true },
      el('header', { class: 'chat-head' }, el('div', {}, el('h2', { id: 'chat-title' }, 'RumiTech Assistant'), el('p', {}, 'Automated guide · answers from site info')), close),
      log, el('div', { class: 'chat-foot' }, form, email));
    d.body.append(panel);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); toggle(false); } else trap(panel, e); });
  };

  const toggle = (open) => {
    if (!panel) build();
    const show = open ?? panel.hidden;
    panel.hidden = !show;
    launcher.setAttribute('aria-expanded', String(show));
    launcher.classList.toggle('open', show);
    if (show) {
      load();
      if (!started) { started = true; say('bot', 'Hi! I’m the RumiTech guide — an automated assistant, not a person. I can help you explore products, check availability, find privacy policies, or get in touch.', [], SUGGEST); }
      setTimeout(() => field.focus(), 30);
    } else launcher.focus();
  };

  launcher = el('button', { type: 'button', class: 'chat-launch', 'aria-expanded': 'false', 'aria-controls': 'chat-panel', onclick: () => toggle() },
    el('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>' }),
    el('span', {}, 'Ask RumiTech'));
  d.body.append(launcher);
})();
