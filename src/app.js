/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

var vm = new Vue({
	el: '#app',
	data: {
		currentRouter: window.location.pathname
	},
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./src/sw.js').then(() => console.log('Service Worker registered.'));
}