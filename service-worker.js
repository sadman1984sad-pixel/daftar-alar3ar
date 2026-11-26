const CACHE = "daftar-asaar-sharaf-v18";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-sharaf-192.png", "./icon-sharaf-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (["liraty.com", "aladhan.com", "api.gold-api.com", "api.rss2json.com", "news.google.com", "api.allorigins.win", "corsproxy.io", "site.api.espn.com"].includes(new URL(event.request.url).hostname)) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./index.html"))));
});