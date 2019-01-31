/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import CONSTANTS from './constants';
import utils from './utils';

const CORS_PROXY = "https://corsanywhere.gigalixirapp.com/";

function build_url(page, details)
{
	switch (page) {
		case 'main':
			return CONSTANTS.AUR_BASE_URL;
		case 'account':
			return `${CONSTANTS.AUR_BASE_URL}/account/${details.user}/`;
		case 'packages':
			return `${CONSTANTS.AUR_BASE_URL}/packages?SB=p&SO=d&O=${details.index}`;
		case 'package':
			return `${CONSTANTS.AUR_BASE_URL}/packages/${details.package}/`;
		case 'package_v2':
			return `${CONSTANTS.AUR_RPC_URL}&type=info&arg[]=${details.package}`;
		case 'package_base':
			return `${CONSTANTS.AUR_BASE_URL}/pkgbase/${details.package}/`;
		case 'package_pkgbuild':
			return `${CONSTANTS.AUR_BASE_URL}/cgit/aur.git/plain/PKGBUILD?h=${details.package}`;
		case 'search':
			return `${CONSTANTS.AUR_RPC_URL}&type=search&by=${details.field}&arg=${details.keywords}`;
		default:
			return CONSTANTS.AUR_BASE_URL;
	}
}

function fetch_raw(url, proxy, lambda)
{
	if (proxy)
		url = `${CORS_PROXY}${url}`;
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

String.prototype.replaceAll = function (search, replacement) {
	let target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

export default {
	build_url: build_url,
	get_statistics: (callback) => {
		let page_doc = document.implementation.createHTMLDocument("Some page");
		let html = page_doc.createElement('html');
		fetch_raw(CONSTANTS.AUR_BASE_URL, true, content => {
			html.innerHTML = content;
			page_doc.body.appendChild(html);
			callback(html.querySelector('div#pkg-stats table'));
		});
	},
	get_packages: (index, callback) => {
		let page_doc = document.implementation.createHTMLDocument("Some page");
		let html = page_doc.createElement('html');
		fetch_raw(build_url('packages', {index: index}), true, content => {
			html.innerHTML = content;
			page_doc.body.appendChild(html);
			let pkglist_stats = html.querySelector('div.pkglist-stats p').innerText.replaceAll('\n', '').split(' ');
			callback(utils.to_array(html.querySelector('table.results tbody').querySelectorAll('tr'))
				.map(line => {
					let td = line.querySelectorAll('td');
					return {
						name: td[0].innerText,
						version: td[1].innerText,
						description: td[4].innerText,
						out_of_date: Boolean(td[1].className === 'flagged'),
						votes: Number(td[2].innerText),
						popularity: Number(td[3].innerText),
						maintainer: td[5].innerText.replaceAll('\n', '')
					};
				}), parseInt(pkglist_stats[0].replace('.', '')));
		});
	},
	get_package: (package_name, callback) => {
		let page_doc = document.implementation.createHTMLDocument("Some page");
		let html = page_doc.createElement('html');

		let pkg_aur_url = build_url('package', {package: package_name});
		fetch_raw(pkg_aur_url, true, res => {
			html.innerHTML = res;
			page_doc.body.appendChild(html);

		/*	let package_details = html.querySelector('div#pkgdetails');
			let package_info = package_details.querySelector('table#pkginfo');
			let pkg_submitter = get_package_property(package_info, 'Submitter').innerText;
			let pkg_maintainer = get_package_property(package_info, 'Maintainer').innerText;
			let pkg_last_packager = get_package_property(package_info, 'Last Packager').innerText;

			let pkgdeps = html.querySelector('div#pkgdeps');
			let pkg_deps_number = pkgdeps.querySelector('h3').innerText.replace('Dependencies (', '').replace(')', '');
			let pkgreqs = html.querySelector('div#pkgreqs');
			let pkg_reqs_number = pkgreqs.querySelector('h3').innerText.replace('Required by (', '').replace(')', '');
			let pkgfiles = html.querySelector('div#pkgfiles');
			let pkg_files_number = pkgfiles.querySelector('h3').innerText.replace('Sources (', '').replace(')', '');*/

			fetch_rpc(build_url('package_v2', {package: package_name}), json => {
				let pkg = json.results[0];

				callback({
					name: pkg['Name'],
					version: pkg['Version'],
					out_of_date: pkg['OutOfDate'],
					description: pkg['Description']
				});
			});
		});
	},
	search: (keywords, by, callback) => {
		fetch_rpc(build_url('search', {field: by, keywords: keywords}), json => {
			if (json.version !== 5 && json.type !== 'search') {
				//render_error_page(main, "Got a wrong response from the AUR API.");
				return;
			}

			callback(json.results.map(result => {
				return {
					name: result['Name'],
					version: result['Version'],
					description: result['Description'],
					out_of_date: result['OutOfDate'] != null,
					last_modified: utils.convert_timestamp(result['LastModified']),
					votes: result['NumVotes'],
					popularity: result['Popularity'],
					maintainer: result['Maintainer']
				};
			}))
		})
	}
}