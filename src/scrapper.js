const AUR_BASE_URL = 'https://aur.archlinux.org';
const AUR_RPC_URL = `${AUR_BASE_URL}/rpc/?v=5`;

function build_url(page, details)
{
	switch (page) {
		case 'main':
			return AUR_BASE_URL;
		case 'account':
			return `${AUR_BASE_URL}/account/${details.user}/`;
		case 'packages':
			return `${AUR_BASE_URL}/packages?SB=p&SO=d&O=${details.index}`;
		case 'package':
			return `${AUR_BASE_URL}/packages/${details.package}/`;
		case 'package_v2':
			return `${AUR_RPC_URL}&type=info&arg[]=${details.package}`;
		case 'package_base':
			return `${AUR_BASE_URL}/pkgbase/${details.package}/`;
		case 'package_pkgbuild':
			return `${AUR_BASE_URL}/cgit/aur.git/plain/PKGBUILD?h=${details.package}`;
		case 'search':
			return `${AUR_RPC_URL}&type=search&by=${details.field}&arg=${details.keywords}`;
		default:
			return AUR_BASE_URL;
	}
}

function has_package_property(pkginfo, property)
{
	let result = false;
	pkginfo.querySelectorAll('tr').forEach(line => {
		if (line.querySelector('th').innerText.split(':')[0] === property) {
			result = true;
		}
	});
	return result;
}

function get_package_property(pkginfo, property)
{
	let result;
	pkginfo.querySelectorAll('tr').forEach(line => {
		if (line.querySelector('th').innerText.split(':')[0] === property) {
			result = line.querySelector('td');
		}
	});
	return result;
}

/*
 * Creates a div section from a given package.
 */
function build_package_section(pkginfo)
{
	let section = lambda_doc.div().classes('section white-text').style('padding-left', '5px');
	let version_color = '';
	if (pkginfo.out_of_date)
		version_color = 'red-text';
	section.append(lambda_doc.h5().inner_html(`<a href="?page=package&package=${pkginfo.name}" class="orange-text text-accent-2">${pkginfo.name}</a> v<span class="${version_color}">${pkginfo.version}</span>`));
	section.append(lambda_doc.p_text(pkginfo.description).style('padding-left', '5px'));
	let details = div('row');
	details.style['margin-bottom'] = 'auto';
	let maintainer = div('col s6');
	if (pkginfo.maintainer && pkginfo.maintainer !== 'orphan') maintainer.innerHTML = `From: <a href="?page=account&account=${pkginfo.maintainer}" class="orange-text text-accent-2">${pkginfo.maintainer}</a>`;
	else maintainer.innerHTML = `<span class="red-text">Orphan</span>`;
	if (pkginfo.last_modified)
		maintainer.innerHTML += ` • ${convert_timestamp(pkginfo.last_modified)}`;
	details.append(maintainer);
	let votes_and_popularity = div('col s6');
	let span = document.createElement('span');
	span.className = 'right';
	span.innerText = `Votes: ${pkginfo.votes} • Popularity: ${pkginfo.popularity}`;
	votes_and_popularity.append(span);
	details.append(votes_and_popularity);
	section.append(details);
	return section.to_element();
}

function build_comment_section(pkg_page, container)
{
	let pkg_comments_section = pkg_page.querySelectorAll('.comments.package-comments');
	if (pkg_comments_section.length === 2) {
		let pinned_comments_title = document.createElement('h5');
		pinned_comments_title.className += 'white-text grey darken-2';
		pinned_comments_title.style.padding = '0.2em 0.35em';
		pinned_comments_title.innerHTML = `<i class="fas fa-thumbtack"></i> Pinned comments`;
		container.append(pinned_comments_title);

		let pkg_comments = pkg_comments_section[0].querySelectorAll('h4.comment-header');
		if (pkg_comments) {
			to_array(pkg_comments).forEach(comment_header => {
				let comment_content = pkg_comments_section[0].querySelector(`div#${comment_header.id}-content`);

				if (!comment_content) return;

				let card_comment = lambda_doc.div().classes('card grey darken-1 z-depth-1');
				let author = comment_header.innerText.split(' ')[0];
				card_comment.append(lambda_doc.div()
					.classes('row')
					.style('margin-bottom', '5px')
					.append(lambda_doc.div()
						.classes('col s12')
						.inner_html(`<a href="?page=account&account=${author}" class="orange-text text-accent-2">${author}</a> <span class="grey-text text-lighten-2">${comment_header.innerText.replace(author, '')}</span<`)
						.style('margin-left', '5px')
						.to_element()));
				let content = lambda_doc.build('blockquote').classes('col s12').style('margin-left', '20px').style('margin-right', '1em').to_element();
				let text = lambda_doc.p_text(comment_content.innerText).style('margin-right', '1.5em').to_element();
				text.innerHTML = text.innerHTML.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, (match, g1) => `<a href="${match}" class="orange-text text-accent-2">${match}</a>`);
				text.innerHTML = text.innerHTML.replace(/@([\w_\-\d]+)/, (match, g1) => `<a href="?page=account&account=${g1}" class="orange-text text-accent-2">${match}</a>`);
				content.append(text);
				content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
				card_comment.append(lambda_doc.div().classes('row').append(content));
				container.append(lambda_doc.div().classes('col s12 m8 offset-m2 l6 offset-l3 white-text').append(card_comment).to_element());
			});
		}
	}

	let comments_title = lambda_doc.build('h5').classes('white-text grey darken-2').inner_html(`<i class="fas fa-comment"></i> Comments`).to_element();
	comments_title.style.padding = '0.2em 0.35em';
	container.append(comments_title);

	if (pkg_comments_section.length !== 0) {
		let i;
		if (pkg_comments_section.length === 2) i = 1; else i = 0;
		let pkg_comments = pkg_comments_section[i].querySelectorAll('h4.comment-header');
		if (pkg_comments) {
			to_array(pkg_comments).forEach(comment_header => {
				let comment_content = pkg_comments_section[i].querySelector(`div#${comment_header.id}-content`);

				if (!comment_content) return;

				let card_comment = lambda_doc.div().classes('card grey darken-1 z-depth-1');
				let author = comment_header.innerText.split(' ')[0];
				card_comment.append(lambda_doc.div()
					.classes('row')
					.style('margin-bottom', '5px')
					.append(lambda_doc.div()
						.classes('col s12')
						.inner_html(`<a href="?page=account&account=${author}" class="orange-text text-accent-2">${author}</a> <span class="grey-text text-lighten-2">${comment_header.innerText.replace(author, '')}</span<`)
						.style('margin-left', '5px')
						.to_element()));
				let content = lambda_doc.build('blockquote').classes('col s12').style('margin-left', '20px').style('margin-right', '1em').to_element();
				let text = lambda_doc.p_text(comment_content.innerText).style('margin-right', '1.5em').to_element();
				text.innerHTML = text.innerHTML.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, (match, g1) => `<a href="${match}" class="orange-text text-accent-2">${match}</a>`);
				text.innerHTML = text.innerHTML.replace(/@([\w_\-\d]+)/, (match, g1) => `<a href="?page=account&account=${g1}" class="orange-text text-accent-2">${match}</a>`);
				content.append(text);
				content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
				card_comment.append(lambda_doc.div().classes('row').append(content));
				container.append(lambda_doc.div().classes('col s12 m8 offset-m2 l6 offset-l3 white-text').append(card_comment).to_element());
			});
		}
	}
}
