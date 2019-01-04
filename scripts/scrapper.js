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
