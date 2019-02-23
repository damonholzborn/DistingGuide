var cacheName = 'distingmk4quickguide-0.58';
var contentToCache = [
    '/algorithms_charts.json',
    '/algorithms.json',
    '/android-chrome-192x192.png',
    '/android-chrome-256x256.png',
    '/apple-touch-icon.png',
    '/browserconfig.xml',
    '/distingguide.js',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/favicon.ico',
    '/heart_filled.png',
    '/heart_outline.png',
    '/',
    '/index.html',
    '/manifest.json',
    '/mstile-150x150.png',
    '/safari-pinned-tab.svg',
    '/style.css',
    '/sw.js',
    '/waveform.png',
    '/youtube_icon.png'
];

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// self.addEventListener('activate', function(e) {
//     e.waitUntil(
//       caches.keys().then(function(keyList) {
//             return Promise.all(keyList.map(function(key) {
//           if(cacheName.indexOf(key) === -1) {
//             return caches.delete(key);
//           }
//         }));
//       })
//     );
//   });

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});