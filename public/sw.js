/* RumiTech service worker: offline-friendly. Pages + data: network-first. Other files: cache-first (CSS/JS URLs carry a content hash, so they can never go stale). */
const V = 'rt-v9';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.add('/offline').catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const fresh = r.mode === 'navigate' || u.pathname.endsWith('.json') || u.pathname === '/sw.js';
  if (fresh) {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then((m) => m || (r.mode === 'navigate' ? caches.match('/offline') : Response.error()))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })));
});
