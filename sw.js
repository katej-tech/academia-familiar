/* Service worker: la app funciona sin internet y se actualiza sola al abrir con conexión. */
const VERSION = "af-v9.3.0";
const CORE = [
  ".",
  "index.html",
  "css/styles.css",
  "js/core.js",
  "js/content.js",
  "js/content-extra.js",
  "js/content-exam.js",
  "js/kid.js",
  "js/teen.js",
  "js/avatar-shop.js",
  "js/games2.js",
  "js/games3.js",
  "js/english-academy.js",
  "js/english-stories.js",
  "js/english-levels.js",
  "js/videos.js",
  "js/parent.js",
  "js/invites.js",
  "js/firebase-sync.js",
  "js/gate.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Red primero para los archivos de la app (siempre la última versión si hay internet),
   caché como respaldo offline. Las fuentes y la API de Gemini van directo a la red. */
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin) return; // fuentes de Google y Gemini: red directa
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
