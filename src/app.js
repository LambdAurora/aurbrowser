/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

var vm = new Vue();

function main()
{
	let main = document.querySelector("main");
	let queries = get_query_details(window.location);
	render_loading_page(main);
	if (queries.hasOwnProperty("page")) {
		switch (queries.page) {
			case 'main':
				render_main_page(main);
				break;
			case 'packages':
				if (!queries.hasOwnProperty('i')) render_error_page(main);
				else render_packages(document, main, parseInt(queries.i));
				break;
			case 'package':
				if (!queries.hasOwnProperty('package')) render_error_page(main);
				else render_package_details_page(document, main, queries.package);
				break;
			case 'package_base':
				if (!queries.hasOwnProperty('package')) render_error_page(main);
				else render_package_base_details(document, main, queries.package);
				break;
			case 'account':
				if (!queries.hasOwnProperty('account')) render_error_page(main);
				else render_user_details(document, main, queries.account);
				break;
			case 'about':
				render_simple_html(main, 'about');
				break;
			default:
				render_error_page(main, "Unknown page.");
				break;
		}
	} else {
		if (queries.hasOwnProperty('search')) {
			let by = 'name-desc';
			if (queries.hasOwnProperty('by'))
				by = queries['by'];
			render_search_page(document, main, { by: by, search: queries.search });
		}
		else render_main_page(main);
	}
}

main();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./src/sw.js').then(() => console.log('Service Worker registered.'));
}