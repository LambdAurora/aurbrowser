/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

let router;

export default {
	init: (router_instance) => {
		router = router_instance;
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

/*function td()
{
	let td = document.createElement('td');
	td.style['word-wrap'] = 'break-word';
	return td;
}

function div(classes)
{
	let div = document.createElement('div');
	div.className += classes;
	return div;
}

function span(classes)
{
	let span = document.createElement('span');
	span.className += classes;
	return span;
}

function create_collection_item(doc)
{
	return lambda_doc.build('li').classes('collection-item white-text grey darken-2').to_element();
}

const CORS_PROXY = "https://corsanywhere.gigalixirapp.com/";

function check_status(response)
{
	if (response.status >= 200 && response.status <= 400)
		return response;
	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

function fetch_rpc(url, lambda)
{
	let headers = new Headers({
		//'Access-Controll-Allow-Origin': '*',
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	});
	fetch(`${CORS_PROXY}${url}`, {method: 'GET', mode: 'cors', headers: headers})
		.then(res => check_status(res))
		.then(res => res.json())
		.then(res => lambda(res))
}

function fetch_raw(url, proxy, lambda)
{
	if (proxy)
		url = `${CORS_PROXY}${url}`
	fetch(`${url}`).then(res => {
		if (res.status === 200)
			res.text().then(content => {
				lambda(content);
			});
		else console.log(`Cannot retrieve page '${url}', got code ${res.status}.`);
	}).catch(error => {
		console.log(`Cannot retrieve page '${url}', error: ${error.message}.`);
	});
}

function fetch_html(url, proxy, lambda)
{
	let page_doc = document.implementation.createHTMLDocument("Some page");
	let html = page_doc.createElement('html');
	fetch_raw(url, proxy, content => {
		html.innerHTML = content;
		page_doc.body.appendChild(html);
		lambda(page_doc);
	});
}

function convert_timestamp(timestamp)
{
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

function to_array(obj)
{
	let array = [];
	// iterate backwards ensuring that length is an UInt32
	for (let i = obj.length >>> 0; i--;) {
		array[i] = obj[i];
	}
	return array;
}

/*
 * Disassembles the query in the URL into an Object.
 *
function get_query_details(url)
{
	let queries_str = url.search.replace('?', '').split('&');
	let queries = {};
	queries_str.forEach(query => {
		let query_splitted = query.split('=');
		if (query_splitted.length === 2)
			queries[query_splitted[0]] = query_splitted[1];
		else
			queries[query_splitted[0]] = '';
	});
	return queries;
}

function add_on_submit_event(element, callback, preventDefault)
{
	element.addEventListener('keyup', event => {
		if (preventDefault)
			event.preventDefault();
		if (event.keyCode === 13)
			callback();
	})
}

String.prototype.replaceAll = function (search, replacement) {
	let target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};*/
