/* Service Worker: hace que la app funcione sin internet (offline) */
const CACHE = 'baguette-v1';
const ARCHIVOS = [
    'index.html',
    'manifest.webmanifest',
    'icon-192.png',
    'icon-512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then((resp) => {
                const copia = resp.clone();
                caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
                return resp;
            })
            .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
    );
});