const { response } = require("express");

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
        console.log('All content has been cached successfully.');
        return caches.addAll(cachedFiles);
    })
    );
});

self.addEventListener('activate', (e) =>{
    e.waitUntil(cache.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
            if (key !== cacheName && key !== cachedFiles) {
                console.log("Destroying old cached files", key);
                return caches.delete(key);
            }
        })
        );
    })
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('/routes/api.js')) {
        e.respondWith(caches.open(cacheName).then(cache => {
            return fetch(e.request).then(res => {
                if(res.status === 200) {
                    cache.put(e.request.url, res.clone());
                }

                return res;
              })
              .catch(err => {
            
                return cache.match(e.request);
              });
          }).catch(err => console.log(err))
        );
    
        return;
        }

        e.respondWith(caches.match(e.req).then(function(res) {
            return res || fetch(e.req);
        })
        );
});