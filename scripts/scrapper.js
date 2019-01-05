const AUR_BASE_URL = 'https://aur.archlinux.org';
const AUR_RPC_URL = `${AUR_BASE_URL}/rpc/?v=5`

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
  let section = div('section white-text');
  section.style['padding-left'] = '5px';
  let h5 = document.createElement('h5');
  let version_color = '';
  if (pkginfo.out_of_date)
    version_color = 'red-text';
  h5.innerHTML = `<a href="?page=package&package=${pkginfo.name}" class="orange-text text-accent-2">${pkginfo.name}</a> v<span class="${version_color}">${pkginfo.version}</span>`
  section.append(h5);
  let description = p(pkginfo.description);
  description.style['padding-left'] = '5px';
  section.append(description);
  let details = div('row');
  details.style['margin-bottom'] = 'auto';
  let maintainer = div('col s6');
  if (pkginfo.maintainer && pkginfo.maintainer !== 'orphan') maintainer.innerHTML = `From: <a href="?page=account&account=${pkginfo.maintainer}" class="orange-text text-accent-2">${pkginfo.maintainer}</a>`;
  else maintainer.innerHTML = `<span class="red-text">Orphan</span>`;
  if (pkginfo.last_modified)
    maintainer.innerHTML += ` • ${convert_timestamp(pkginfo.last_modified)}`;
  details.append(maintainer);
  let votes_and_populairty = div('col s6');
  let span = document.createElement('span');
  span.className = 'right';
  span.innerText = `Votes: ${pkginfo.votes} • Popularity: ${pkginfo.popularity}`
  votes_and_populairty.append(span);
  details.append(votes_and_populairty);
  section.append(details);
  return section;
}

function build_comment_section(pkg_page, container)
{
  let pkg_comments_section = pkg_page.querySelectorAll('.comments.package-comments');
  if (pkg_comments_section.length == 2) {
    let pinned_comments_title = document.createElement('h5');
    pinned_comments_title.className += 'white-text grey darken-2';
    pinned_comments_title.style.padding = '0.2em 0.35em';
    pinned_comments_title.innerHTML = `<i class="fas fa-thumbtack"></i> Pinned comments`;
    container.append(pinned_comments_title);

    let pkg_comments = pkg_comments_section[0].querySelectorAll('h4.comment-header')
    if (pkg_comments) {
      to_array(pkg_comments).forEach(comment_header => {
        let comment_content = pkg_comments_section[0].querySelector(`div#${comment_header.id}-content`);

        if (!comment_content) return;

        let comment_div = div('col s12 m8 offset-m2 l6 offset-l3 white-text');
        let card_comment = div('card grey darken-1 z-depth-1');
        comment_div.append(card_comment);
        let row_title = create_row_div();
        row_title.style['margin-bottom'] = '5px';
        let title = div('col s12');
        title.style['margin-left'] = '5px';
        let author = comment_header.innerText.split(' ')[0];
        title.innerHTML = `<a href="?page=account&account=${author}" class="orange-text text-accent-2">${author}</a> <span class="grey-text text-lighten-2">${comment_header.innerText.replace(author, '')}</span<`;
        row_title.append(title);
        card_comment.append(row_title);
        let row = create_row_div();
        let content = document.createElement('blockquote');
        content.className += 'col s12';
        content.style['margin-left'] = '20px';
        content.style['margin-right'] = '1em';
        let text = p(comment_content.innerText);
        text.style['margin-right'] = '1.5em';
        content.append(text);
        content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
        row.append(content);
        card_comment.append(row);
        container.append(comment_div);
      });
    }
  }

  let comments_title = document.createElement('h5');
  comments_title.className += 'white-text grey darken-2';
  comments_title.style.padding = '0.2em 0.35em';
  comments_title.innerHTML = `<i class="fas fa-comment"></i> Comments`;
  container.append(comments_title);

  if (pkg_comments_section.length != 0) {
    let i;
    if (pkg_comments_section.length == 2) i = 1; else i = 0;
    let pkg_comments = pkg_comments_section[i].querySelectorAll('h4.comment-header')
    if (pkg_comments) {
      to_array(pkg_comments).forEach(comment_header => {
        let comment_content = pkg_comments_section[i].querySelector(`div#${comment_header.id}-content`);

        if (!comment_content) return;

        let comment_div = div('col s12 m8 offset-m2 l6 offset-l3 white-text');
        let card_comment = div('card grey darken-1 z-depth-1');
        comment_div.append(card_comment);
        let row_title = create_row_div();
        row_title.style['margin-bottom'] = '5px';
        let title = div('col s12');
        title.style['margin-left'] = '5px';
        let author = comment_header.innerText.split(' ')[0];
        title.innerHTML = `<a href="?page=account&account=${author}" class="orange-text text-accent-2">${author}</a> <span class="grey-text text-lighten-2">${comment_header.innerText.replace(author, '')}</span<`;
        row_title.append(title);
        card_comment.append(row_title);
        let row = create_row_div();
        let content = document.createElement('blockquote');
        content.className += 'col s12';
        content.style['margin-left'] = '20px';
        content.style['margin-right'] = '1em';
        let text = p(comment_content.innerText);
        text.style['margin-right'] = '1.5em';
        content.append(text);
        content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
        row.append(content);
        card_comment.append(row);
        container.append(comment_div);
      });
    }
  }
}
