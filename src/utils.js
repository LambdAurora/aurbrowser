/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import CONSTANTS from './constants';

let router;

export default {
	init: (router_instance) => {
		router = router_instance;
	},
	fetch_raw: (url, proxy, lambda, error) => {
		if (proxy)
			url = `${CONSTANTS.CORS_PROXY}${url}`;
		fetch(`${url}`).then(res => {
			if (res.status === 200)
				res.text().then(content => {
					lambda(content);
				});
			else {
				console.log(`-- Cannot retrieve page '${url}', got code ${res.status}.`);
				if (error)
					error(res.status);
			}
		}).catch(error => {
			console.log(`-- Cannot retrieve page '${url}', error: ${error.message}.`);
		});
	},
	search: (keywords, by) => {
		router.push(`/search?q=${keywords}&by=${by}`);
	},
	to_array: (obj) => {
		let array = [];
		// iterate backwards ensuring that length is an UInt32
		for (let i = obj.length >>> 0; i--;) {
			array[i] = obj[i];
		}
		return array;
	},
	convert_timestamp: (timestamp) => {
		let date_obj = new Date(timestamp * 1000);
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		let year = date_obj.getFullYear();
		let month = months[date_obj.getMonth()];
		let date = date_obj.getDate();
		let hour = date_obj.getHours();
		let min = date_obj.getMinutes();
		let sec = date_obj.getSeconds();
		return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
	}
}
