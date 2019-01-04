const AUR_BASE_URL = 'https://aur.archlinux.org';
const AUR_RPC_URL = `${AUR_BASE_URL}/rpc/?v=5`

function build_url(page, details)
{
  switch (page) {
    case 'main':
      return AUR_BASE_URL;
    case 'package':
      return `${AUR_BASE_URL}/packages/${details.package}/`;
    case 'package_v2':
      return `${AUR_RPC_URL}&type=info&arg[]=${details.package}`;
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
  if (pkginfo.maintainer) maintainer.innerText = `From: ${pkginfo.maintainer}`;
  else maintainer.innerHTML = `<span class="red-text">Orphan</span>`;
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
