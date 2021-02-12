const cacheName = 'offline-cache';
const cachedFiles = [
'/',
'/manifest.json',
'/public/index.js',
'/models/transaction.js',
'/routes/api.js',
'/public/serviceWorker.js',
'/public/styles.css',
'/public/index.html'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
    e.waitUntil(caches.open(cacheName).then((cache) => {
        console.log('[Service Worker] Caching All: app shell and content!');
        return cache.addAll(cachedFiles);
    })
    );
});