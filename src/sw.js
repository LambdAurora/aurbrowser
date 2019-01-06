/*
 * AUR Browser - Service Worker.
 */

const AURBROWSER_CACHE = 'aurbrowser_pwa_v1';

const files_to_cache = [
	'/',
	'/index.html',
	'/style.css',
	'/lib/lambda_dom.js',
	'/src/app.js',
	'/src/render.js',
	'/src/scrapper.js',
	'/src/utils.js',
	'/views/about.part.html',
	'/views/error.part.html',
	'/views/main.part.html',
	'/views/packages.part.html',
	'/views/search.part.html'
];

self.addEventListener('install', e => {
	console.log('[AUR Browser][Service Worker] Installing...');
	e.waitUntil(caches.open(AURBROWSER_CACHE).then(cache => {
		console.log('[AUR Browser][Service Worker] Caching app...');
		return cache.addAll(files_to_cache);
	}));
});
