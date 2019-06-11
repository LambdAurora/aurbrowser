/*
 * AUR Browser - Service Worker.
 */

const AURBROWSER_CACHE = 'aurbrowser_pwa_v1';

const files_to_cache = [
];

self.addEventListener('install', e => {
	console.log('[AUR Browser][Service Worker] Installing...');
	e.waitUntil(caches.open(AURBROWSER_CACHE).then(cache => {
		console.log('[AUR Browser][Service Worker] Caching app...');
		return cache.addAll(files_to_cache);
	}));
});
