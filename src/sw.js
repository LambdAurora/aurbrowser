/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

workbox.setConfig({
  modulePathPrefix: '/lib/workbox/'
});

workbox.clientsClaim();
workbox.skipWaiting();

workbox.routing.registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days.
      })
    ]
  }));

workbox.routing.registerRoute(new RegExp('https://cors.aurbrowser.tk/'),
  workbox.strategies.networkFirst({
    cacheName: 'api'
  }));

workbox.routing.registerNavigationRoute('/index.html', {
  blacklist: [/[\S]+.png/, /style\.css/]
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => {
    return r || fetch(e.request);
  }));
});
