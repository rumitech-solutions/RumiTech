/* RumiTech service worker: offline-friendly shell. Network-first for pages, cache-first for static assets. */
const V = 'rt-v8';
const CORE = ['/', '/products', '/projects', '/about', '/contact', '/faq', '/offline', '/assets/site.css', '/assets/site.js', '/assets/assistant.js', '/assets/site-data.json', '/favicon.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => Promise.allSettled(CORE.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then((m) => m || caches.match('/offline'))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => {
    const net = fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; }).catch(() => m);
    return m || net;
  }));
});
