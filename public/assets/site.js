(() => {
  const d = document;
  const header = d.querySelector('[data-header]');
  const btn = d.querySelector('[data-menu-btn]');
  const menu = d.querySelector('[data-menu]');

  // Header adapts on scroll
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    d.documentElement.classList.toggle('menu-open', open);
  };
  if (btn && menu) {
    btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (m) => m.matches && setMenu(false));
  }

  // Scroll reveal
  const els = d.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  // Print button on legal pages
  d.querySelectorAll('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));

  // Year
  d.querySelectorAll('[data-year]').forEach((y) => (y.textContent = new Date().getFullYear()));
})();

/* Enhancements: progress, spotlight, tilt, scrollspy, contact form */
(() => {
  const d = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Reading progress
  const bar = d.querySelector('[data-progress]');
  if (bar) {
    let tick = false;
    const upd = () => { const h = d.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; tick = false; };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // Spotlight + tilt (fine pointers, motion allowed)
  if (fine && !reduce) {
    const spots = d.querySelectorAll('.showcase,.discover a,.feat-grid li,.related a,.index-card,.project-list a,.topics li,.evo-col,.node');
    spots.forEach((s) => {
      s.classList.add('spot');
      s.addEventListener('pointermove', (e) => { const r = s.getBoundingClientRect(); s.style.setProperty('--mx', e.clientX - r.left + 'px'); s.style.setProperty('--my', e.clientY - r.top + 'px'); });
    });
    d.querySelectorAll('.showcase-art,.p-hero-art,.index-art').forEach((zone) => {
      const dev = zone.querySelector('.device'); if (!dev) return;
      zone.addEventListener('pointermove', (e) => { const r = zone.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; dev.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg'); dev.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg'); });
      zone.addEventListener('pointerleave', () => { dev.style.setProperty('--ry', '0deg'); dev.style.setProperty('--rx', '0deg'); });
    });
    const c = d.querySelector('.constellation');
    if (c) {
      const hero = c.closest('.hero');
      hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); c.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); c.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
    }
  }

  // Product sub-nav scrollspy
  const sub = d.querySelector('[data-subnav]');
  if (sub && 'IntersectionObserver' in window) {
    const links = [...sub.querySelectorAll('a[href^="#"]')];
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); map.get(en.target.id)?.setAttribute('aria-current', 'true'); }
    }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = d.getElementById(id); s && io.observe(s); });
  }

  // Contact form (mailto-based; nothing is sent from the page)
  const form = d.querySelector('[data-contact-form]');
  if (form) {
    const to = form.dataset.email;
    const status = form.querySelector('[data-form-status]');
    const setErr = (input, msg) => {
      const e = d.getElementById(input.getAttribute('aria-describedby'));
      if (msg) { e.textContent = msg; e.hidden = false; input.setAttribute('aria-invalid', 'true'); } else { e.hidden = true; input.removeAttribute('aria-invalid'); }
      return !msg;
    };
    const rules = {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address so we can reply.'),
      message: (v) => (v.trim().length < 10 ? 'Please write at least a few words (10 characters).' : ''),
    };
    Object.keys(rules).forEach((k) => { const i = form.elements[k]; i.addEventListener('blur', () => i.value.trim() && setErr(i, rules[k](i.value))); i.addEventListener('input', () => i.hasAttribute('aria-invalid') && setErr(i, rules[k](i.value))); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).map((k) => ({ i: form.elements[k], m: rules[k](form.elements[k].value) })).filter((x) => { setErr(x.i, x.m); return x.m; });
      if (bad.length) { status.textContent = 'Please fix the highlighted fields.'; bad[0].i.focus(); return; }
      const f = form.elements;
      const body = `${f.message.value.trim()}\n\n— ${f.name.value.trim()} (${f.email.value.trim()})`;
      location.href = `mailto:${to}?subject=${encodeURIComponent('[' + f.topic.value + '] from ' + f.name.value.trim())}&body=${encodeURIComponent(body)}`;
      status.textContent = `Your email app should now open with the message ready. If nothing happened, email us at ${to} — or use “Copy email address”.`;
    });
    form.querySelector('[data-copy-email]').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(to); status.textContent = `Copied ${to} to your clipboard.`; }
      catch { status.textContent = `Our email address is ${to}.`; }
    });
    d.querySelectorAll('[data-topic]').forEach((a) => a.addEventListener('click', () => { form.elements.topic.value = a.dataset.topic; setTimeout(() => form.elements.name.focus({ preventScroll: true }), 400); }));
  }
})();

/* Theme switch, explorer tabs, back-to-top */
(() => {
  const d = document, root = d.documentElement;
  const meta = d.querySelector('meta[name=theme-color]');
  const current = () => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  const sync = () => {
    const light = current() === 'light';
    d.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(light));
      b.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
    if (meta) meta.content = light ? '#F7F6F1' : '#080B10';
  };
  const apply = (t, save) => {
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', t);
    if (save) { try { localStorage.setItem('rt-theme', t); } catch (e) {} }
    sync();
    setTimeout(() => root.classList.remove('theme-anim'), 450);
  };
  sync();
  d.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => apply(current() === 'light' ? 'dark' : 'light', true)));
  // follow the OS only while the visitor has not chosen explicitly
  const mq = matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener?.('change', (e) => { let saved = null; try { saved = localStorage.getItem('rt-theme'); } catch (x) {} if (!saved) apply(e.matches ? 'light' : 'dark', false); });

  // Explorer tabs (WAI-ARIA tabs pattern; all panels visible without JS)
  d.querySelectorAll('[data-explorer]').forEach((ex) => {
    const tabs = [...ex.querySelectorAll('[role=tab]')];
    const panels = tabs.map((t) => d.getElementById(t.getAttribute('aria-controls')));
    const show = (i, focus) => {
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; panels[k].hidden = !on; });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(i));
      t.addEventListener('keydown', (e) => {
        const n = tabs.length; let k = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') k = (i + 1) % n;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') k = (i - 1 + n) % n;
        else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = n - 1;
        if (k !== null) { e.preventDefault(); show(k, true); }
      });
    });
    show(0);
  });

  d.querySelectorAll('[data-top]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    const m = d.getElementById('main'); m && m.focus({ preventScroll: true });
  }));
})();

/* v4 effects & tools */
(() => {
  const d = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Toasts
  let wrap;
  window.rtToast = (msg) => {
    if (!wrap) { wrap = d.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); d.body.append(wrap); }
    const t = d.createElement('div'); t.className = 'toast'; t.textContent = msg; wrap.append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2400);
  };
  const copy = async (text, okMsg) => {
    try { await navigator.clipboard.writeText(text); rtToast(okMsg); } catch { rtToast(text); }
  };
  d.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copy(b.dataset.copy, `Copied ${b.dataset.copy}`)));
  d.querySelectorAll('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const data = { title: b.dataset.title || d.title, url: location.href.split('#')[0] };
    if (navigator.share) { try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    copy(data.url, 'Link copied');
  }));

  // Staggered reveal
  d.querySelectorAll('.reveal').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el); if (i > 0) el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
  });

  // Count-up
  const counters = d.querySelectorAll('[data-count]');
  const run = (el) => {
    const to = +el.dataset.count; if (reduce || to === 0) return;
    const t0 = performance.now(), dur = 1100;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  // Cursor glow (hero) + magnetic buttons
  const hero = d.querySelector('.hero');
  if (hero && fine && !reduce) hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--gx', e.clientX - r.left + 'px'); hero.style.setProperty('--gy', e.clientY - r.top + 'px'); });
  if (fine && !reduce) d.querySelectorAll('.btn-lg,.closing .btn').forEach((b) => {
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * 8 + 'px'); b.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5) * 6 + 'px'); });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
  });

  // FAQ search + filter
  const faq = d.querySelector('[data-faq]');
  if (faq) {
    const input = faq.querySelector('[data-faq-input]'), items = [...faq.querySelectorAll('details')], chips = [...faq.querySelectorAll('[data-g]')].filter((c) => c.tagName === 'BUTTON');
    const count = faq.querySelector('[data-faq-count]'), empty = faq.querySelector('[data-faq-empty]');
    let g = 'all';
    const apply = () => {
      const q = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
      items.forEach((it) => { const ok = (g === 'all' || it.dataset.g === g) && q.every((w) => it.dataset.t.includes(w)); it.hidden = !ok; if (ok) n++; });
      count.textContent = n === 1 ? '1 question' : n + ' questions'; empty.hidden = n !== 0;
    };
    input.addEventListener('input', apply);
    chips.forEach((c) => c.addEventListener('click', () => { g = c.dataset.g; chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c))); apply(); }));
    const h = decodeURIComponent(location.hash.slice(1)); if (h && input) { input.value = h; apply(); }
  }
})();

/* v5: scroll story + back-to-top ring */
(() => {
  const d = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const story = d.querySelector('[data-story]');
  if (story && 'IntersectionObserver' in window) {
    const steps = [...story.querySelectorAll('.step-card')], devs = [...story.querySelectorAll('.stage-dev')];
    const set = (i) => { steps.forEach((s, k) => s.classList.toggle('active', k === i)); devs.forEach((v, k) => v.classList.toggle('on', k === i)); };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(steps.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => io.observe(s)); set(0);
  }

  const tt = d.createElement('button');
  tt.type = 'button'; tt.className = 'to-top'; tt.setAttribute('aria-label', 'Back to top');
  tt.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  d.body.append(tt);
  let tick = false;
  const upd = () => { const h = d.documentElement.scrollHeight - innerHeight; tt.style.setProperty('--p', (h > 0 ? (scrollY / h) * 100 : 0).toFixed(1)); tt.classList.toggle('show', scrollY > 700); tick = false; };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
  tt.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); d.getElementById('main')?.focus({ preventScroll: true }); });
})();

/* v6: service worker, hover prefetch, shortcuts, hero parallax */
(() => {
  const d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  // instant-feel navigation: prefetch internal pages on hover/focus/touch (once each, skipped on Save-Data)
  const conn = navigator.connection;
  if (!(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')))) {
    const seen = new Set();
    const pf = (a) => {
      if (!a || !a.href || a.origin !== location.origin || a.hash && a.pathname === location.pathname || seen.has(a.pathname) || a.hasAttribute('download')) return;
      seen.add(a.pathname);
      const l = d.createElement('link'); l.rel = 'prefetch'; l.href = a.pathname; d.head.append(l);
    };
    let t;
    d.addEventListener('mouseover', (e) => { const a = e.target.closest && e.target.closest('a'); if (!a) return; clearTimeout(t); t = setTimeout(() => pf(a), 65); });
    d.addEventListener('focusin', (e) => pf(e.target.closest && e.target.closest('a')));
    d.addEventListener('touchstart', (e) => pf(e.target.closest && e.target.closest('a')), { passive: true });
  }

  // keyboard shortcuts: "?" help, "g" then key to jump
  const routes = { h: '/', p: '/products', j: '/projects', a: '/about', c: '/contact', f: '/faq', b: '/brand' };
  const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  let g = 0, dlg;
  const help = () => {
    if (!dlg) {
      dlg = d.createElement('dialog'); dlg.className = 'kbd-help'; dlg.setAttribute('aria-labelledby', 'kbd-h');
      dlg.innerHTML = '<h2 id="kbd-h">Keyboard shortcuts</h2><dl>' +
        [['Ctrl K', 'Search & commands (⌘ K on Mac)'], ['/', 'Search'], ['?', 'This help'], ['g h', 'Home'], ['g p', 'Products'], ['g j', 'Projects'], ['g a', 'About'], ['g c', 'Contact'], ['g f', 'FAQ'], ['g b', 'Brand kit'], ['t', 'Switch theme']]
          .map(([k, v]) => `<div><dt>${k.split(' ').map((x) => x.length > 4 ? x : `<kbd>${x}</kbd>`).join(' ')}</dt><dd>${v}</dd></div>`).join('') +
        '</dl><form method="dialog"><button class="btn btn-primary">Close</button></form>';
      d.body.append(dlg);
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    }
    dlg.showModal();
  };
  d.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e) || d.querySelector('dialog[open]') && e.key !== 'Escape' && e.key !== '?') return;
    if (e.key === '?') { e.preventDefault(); dlg && dlg.open ? dlg.close() : help(); return; }
    if (g && routes[e.key]) { e.preventDefault(); g = 0; location.href = routes[e.key]; return; }
    if (e.key === 'g') { g = 1; setTimeout(() => (g = 0), 900); return; }
    if (e.key === 't') d.querySelector('[data-theme-toggle]')?.click();
  });

  // gentle mouse parallax on the hero phones
  const con = d.querySelector('.constellation');
  if (con && !reduce && matchMedia('(hover:hover)').matches) {
    const hero = con.closest('.hero') || con;
    let raf = 0;
    hero.addEventListener('mousemove', (e) => {
      const r = con.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { con.style.setProperty('--px', x.toFixed(3)); con.style.setProperty('--py', y.toFixed(3)); });
    });
    hero.addEventListener('mouseleave', () => { con.style.setProperty('--px', 0); con.style.setProperty('--py', 0); });
  }
})();
