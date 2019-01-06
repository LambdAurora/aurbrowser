/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

const COLLECTION_ITEM_CLASSES = 'collection-item white-text grey darken-2';

function clear_main(main)
{
	main.className = '';
	main.style = '';
	while (main.firstChild)
		main.removeChild(main.firstChild);
}

function render_loading_page(main)
{
	clear_main(main);
	main.append(lambda_doc.div()
		.classes(['preloader-wrapper', 'big', 'active'])
		.style('position', 'absolute')
		.style('top', 0)
		.style('left', 0)
		.style('right', 0)
		.style('bottom', 0)
		.style('margin', 'auto')
		.append(lambda_doc.div()
			.classes(['spinner-layer', 'spinner-blue-only'])
			.append(lambda_doc.div().classes(['circle-clipper', 'left']).append(lambda_doc.div().classes('circle')))
			.append(lambda_doc.div().classes('gap-patch').append(lambda_doc.div().classes('circle')))
			.append(lambda_doc.div().classes(['circle-clipper', 'right']).append(lambda_doc.div().classes('circle')))
		).to_element());
}

function render_error_page(main, details)
{
	fetch_html('./views/error.part.html', false, page => {
		clear_main(main);
		main.append(page.querySelector('div#index-banner'));
		if (details) {
			main.querySelector('#error_details').innerText = details;
		}
	});
}

function render_main_page(main)
{
	fetch_html('./views/main.part.html', false, page => {
		clear_main(main);
		main.append(page.querySelector('div#index-banner'));
		main.append(page.querySelector('div#main_container'));
		let main_stats_card = main.querySelector('div#main_stats_card');
		fetch_html(AUR_BASE_URL, true, aur => {
			main_stats_card.append(aur.querySelector('div#pkg-stats table'));
			main_stats_card.removeChild(main_stats_card.querySelector('#main_main_progress'));
		});
	});
}

function render_package_details_page(doc, main, package)
{
	let pkg_aur_url = build_url('package', {package: package});
	fetch_html(pkg_aur_url, true, page => {
		let package_details = page.querySelector('div#pkgdetails');
		let package_info = package_details.querySelector('table#pkginfo');
		let pkg_submitter = get_package_property(package_info, 'Submitter').innerText;
		let pkg_maintainer = get_package_property(package_info, 'Maintainer').innerText;
		let pkg_last_packager = get_package_property(package_info, 'Last Packager').innerText;

		let pkgdeps = page.querySelector('div#pkgdeps');
		let pkg_deps_number = pkgdeps.querySelector('h3').innerText.replace('Dependencies (', '').replace(')', '');
		let pkgreqs = page.querySelector('div#pkgreqs');
		let pkg_reqs_number = pkgreqs.querySelector('h3').innerText.replace('Required by (', '').replace(')', '');
		let pkgfiles = page.querySelector('div#pkgfiles');
		let pkg_files_number = pkgfiles.querySelector('h3').innerText.replace('Sources (', '').replace(')', '');

		fetch_rpc(build_url('package_v2', {package: package}), json => {
			if (json.version !== 5 && json.type !== 'multiinfo') {
				render_error_page(main, "Got a wrong response from the AUR API.");
				return;
			}

			let pkg = json.results[0];

			let pkg_base_url = `?page=package&package=${pkg['PackageBase']}`;
			if (pkg['Name'] !== pkg['PackageBase'])
				pkg_base_url = `?page=package_base&package=${pkg['PackageBase']}`;
			let pkgreqslist = pkgreqs.querySelector('#pkgreqslist');

			let files_ul = doc.createElement('ul');
			to_array(page.querySelector('ul#pkgsrcslist').children).forEach(child => {
				child.querySelector('a').className += 'orange-text text-accent-2';
				files_ul.append(child);
			});

			let container = lambda_doc.div().classes('container')
				.append(lambda_doc.div().classes('card grey darken-1') // Card.
					.append(lambda_doc.div().classes('card-content white-text')
						.append(lambda_doc.span() // Title
							.classes('card-title')
							.do_if_else(pkg['OutOfDate'],
								e => e.inner_html(`<a href="${pkg_aur_url}" class="orange-text text-accent-2">${pkg['Name']}</a> v<span class="red-text">${pkg['Version']}</span>`),
								e => e.inner_html(`<a href="${pkg_aur_url}" class="orange-text text-accent-2">${pkg['Name']}</a> v` + pkg['Version'])))
						.append(lambda_doc.ul().classes('collection')
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_html(`Clone URL (Git): <a href="${AUR_BASE_URL}/${pkg['Name']}.git" class="orange-text text-accent-2">${AUR_BASE_URL}/${pkg['Name']}.git</a> (Read only)`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_html(`Package base: <a href="${pkg_base_url}" class="orange-text text-accent-2">${pkg['PackageBase']}</a> (<a href="${AUR_BASE_URL}/cgit/aur.git/plain/PKGBUILD?h=${pkg['PackageBase']}" class="orange-text text-accent-2">raw</a>)`))
							.do_if(pkg['OutOfDate'], e => e.append(lambda_doc.li()
								.classes('collection-item red-text grey darken-2')
								.inner_html(`<i class="fas fa-exclamation-triangle"></i> Flagged out-of-date (${convert_timestamp(pkg['OutOfDate'])})`)))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_text(`Description: ${pkg['Description']}`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.do_if_else(pkg['URL'].startsWith('https://github.com/') || pkg['URL'].startsWith('https://www.github.com/'),
									e => e.inner_html(`Link: <a href="${pkg['URL']}" class="orange-text text-accent-2"><i class="fab fa-github aperlambda-foreground-github"></i> ${pkg['URL']}</a>`),
									e => e.inner_html(`Link: <a href="${pkg['URL']}" class="orange-text text-accent-2">${pkg['URL']}</a>`)))
							.do_if(pkg['Keywords'].length !== 0, e => e.append(lambda_doc.li().classes(COLLECTION_ITEM_CLASSES)
								.inner_text('Keywords: ')
								.do_on(keywords => {
									pkg['Keywords'].forEach(keyword => keywords.to_element().innerHTML += `<a href="${AUR_BASE_URL}/packages/?K=${keyword}&SB=p" class="keyword_badge">${keyword}</a>`)
								})))
							.do_if(pkg['License'], e => {
								let licenses = lambda_doc.li().classes(COLLECTION_ITEM_CLASSES).inner_text(`Licenses: ${pkg['License'].join(', ')}`).to_element();
								licenses.innerHTML = licenses.innerHTML.replaceAll('<br>', '');
								e.append(licenses);
							})
							.do_if(pkg['Conflicts'], e => {
								e.append(lambda_doc.li().classes(COLLECTION_ITEM_CLASSES).inner_html(`Conflicts: ${pkg['Conflicts'].map(conflict => `<a href="?page=package&package=${conflict}" class="orange-text text-accent-2">${conflict}</a>`).join(', ')}`));
							})
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_html(`Submitter: <a href="?page=account&account=${pkg_submitter}" class="orange-text text-accent-2">${pkg_submitter}</a>`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.do_if_else(!pkg['Maintainer'], e => e.inner_html(`Maintainer: <span class="red-text">None</span>`), e => {
									let pkg_maintainers = pkg_maintainer.split(' ');
									if (pkg_maintainers[0] === 'None') e.inner_html(`Maintainer: <span class="red-text">None</span>`);
									else {
										e.inner_html(`Maintainer: <a href="?page=account&account=${pkg_maintainers[0]}" class="orange-text text-accent-2">${pkg_maintainers[0]}</a>`);
										if (pkg_maintainers.length > 1) {
											e.to_element().innerHTML += ' (';
											pkg_maintainers.splice(0, 1);
											pkg_maintainers.map(person => person.replace('(', '').replace(',', '').replace(')', '')).forEach(person => e.to_element().innerHTML += `<a href="?page=account&account=${person}" class="orange-text text-accent-2">${person}</a>, `);
											e.to_element().innerHTML = e.to_element().innerHTML.substring(0, e.to_element().innerHTML.length - 2) + ')';
										}
									}
								}))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_html(`Last packager: <a href="?page=account&account=${pkg_last_packager}" class="orange-text text-accent-2">${pkg_last_packager}</a>`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_text(`Votes: ${pkg['NumVotes']}`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_text(`Popularity: ${pkg['Popularity']}`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_text(`First submitted: ${get_package_property(package_info, 'First Submitted').innerText}`))
							.append(lambda_doc.li()
								.classes(COLLECTION_ITEM_CLASSES)
								.inner_text(`Last updated: ${get_package_property(package_info, 'Last Updated').innerText}`))))
					.append(lambda_doc.div().classes('row')
						.append(lambda_doc.div().classes('col s12 m6')
							.append(lambda_doc.h6_text(`Dependencies (${pkg_deps_number})`)
								.classes('white-text grey darken-2')
								.style('padding', '0.2em 0.35em'))
							.do_if(pkg['MakeDepends'] || pkg['Depends'], e => {
								let pkgdepslist = pkgdeps.querySelector('#pkgdepslist');
								to_array(pkgdepslist.querySelectorAll('li')).forEach(li => {
									li.className += 'white-text';
									to_array(li.querySelectorAll('a')).forEach(a => {
										a.className += "orange-text text-accent-2";
										if (a.getAttribute('href').startsWith('/packages/')) {
											a.href = `?page=package&package=${a.getAttribute('href').replace('/packages/', '').replace('/', '')}`;
										}
									});
								});
								e.append(pkgdepslist);
							}))
						.append(lambda_doc.div().classes('col s12 m6')
							.append(lambda_doc.h6_text(`Required by (${pkg_reqs_number})`)
								.classes('white-text grey darken-2')
								.style('padding', '0.2em 0.35em'))
							.do_if(pkgreqslist, e => {
								to_array(pkgreqslist.querySelectorAll('li')).forEach(li => {
									li.className += 'white-text';
									to_array(li.querySelectorAll('a')).forEach(a => {
										a.className += "orange-text text-accent-2";
										if (a.getAttribute('href').startsWith('/packages/')) {
											a.href = `?page=package&package=${a.getAttribute('href').replace('/packages/', '').replace('/', '')}`;
										}
									});
								});
								e.append(pkgreqslist);
							})))
					.append(lambda_doc.div().classes('row')
						.append(lambda_doc.div().classes('col s12')
							.append(lambda_doc.h6_text(`Sources (${pkg_files_number})`).classes('white-text grey darken-2').style('padding', '0.2em 0.35em'))
							.append(files_ul)))
					.append(lambda_doc.div().classes('card-action') // Build actions
						.append(lambda_doc.build('a')
							.classes('modal-trigger')
							.href('#pkgbuild_viewer')
							.inner_text('View PKGBuild'))
						.append(lambda_doc.build('a')
							.href(`${AUR_BASE_URL}/cgit/aur.git/snapshot/${pkg['Name']}.tar.gz`)
							.inner_text('Download a snapshot'))
						.append(lambda_doc.build('a')
							.href(`https://wiki.archlinux.org/index.php/Special:Search?search=${pkg['Name']}`)
							.inner_text('Search wiki'))))
				.to_element();

			/*
			 * Building comments section
			 */
			build_comment_section(page, container);

			fetch_raw(build_url('package_pkgbuild', {package: package}), true, pkgbuild_doc => {
				doc.getElementById('pkgbuild_viewer_title').innerText = `PKGBUILD of ${pkg['Name']}:`;
				let pkgbuild_code = doc.getElementById('pkgbuild_code');
				pkgbuild_code.innerHTML = Prism.highlight(pkgbuild_doc, Prism.languages.bash);
			});

			clear_main(main);
			main.append(container);
		});
	});
}