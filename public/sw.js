/*
 * AUR Browser - Service Worker.
 */

const AURBROWSER_CACHE = 'aurbrowser_pwa_v1';

const files_to_cache = [
	'/',
	'index.html',
	'app.js',
	'script.js',
	'style.css',
	'_headers',
	'lambdastyle/lambdastyle.css',
	'lambdastyle/lambdastyle.js',
	'aurbrowser_white_64.png'
];

self.addEventListener('install', function(e) {
	console.log('[AUR Browser][Service Worker] Installing...');
	e.waitUntil(caches.open(AURBROWSER_CACHE).then(function(cache) {
		console.log('[AUR Browser][Service Worker] Caching app...');
		return cache.addAll(files_to_cache);
	}));
});

self.addEventListener('activate', e => {
	e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
	e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => {
		return r || fetch(e.request);
	}))
});
