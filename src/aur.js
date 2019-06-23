/*
 * Copyright © 2019 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of aurbrowser.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

import {AUR_BASE_URL, AUR_RPC_URL, CORS_PROXY} from './constants';
import utils from './utils';

function build_url(page, details) {
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

function check_status(response) {
  if (response.status >= 200 && response.status <= 400)
    return response;
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function fetch_rpc(url, lambda) {
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

function get_package_property(pkginfo, property) {
  let result;
  pkginfo.querySelectorAll('tr').forEach(line => {
    if (line.querySelector('th').innerText.split(':')[0] === property) {
      result = line.querySelector('td');
    }
  });
  return result;
}

function get_package_link(url) {
  let icon = null;
  let foreground = null;
  if (url.startsWith('https://github.com/') || url.startsWith('https://www.github.com/')) {
    icon = 'github';
    foreground = 'rgb(0, 0, 0)';
  }
  return {
    icon: icon,
    foreground: foreground,
    url: url
  }
}

export default {
  build_url: build_url,
  get_statistics(callback) {
    let page_doc = document.implementation.createHTMLDocument("Some page");
    let html = page_doc.createElement('html');
    utils.fetch_raw(AUR_BASE_URL, true, content => {
      html.innerHTML = content;
      page_doc.body.appendChild(html);
      callback(html.querySelector('div#pkg-stats table'));
    });
  },
  get_packages(index, callback) {
    let page_doc = document.implementation.createHTMLDocument("Some page");
    let html = page_doc.createElement('html');
    utils.fetch_raw(build_url('packages', {index: index}), true, content => {
      html.innerHTML = content;
      page_doc.body.appendChild(html);
      let pkglist_stats = html.querySelector('div.pkglist-stats p').innerText.replaceAll('\n', '').split(' ');
      callback([...html.querySelector('table.results tbody').querySelectorAll('tr')]
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
  get_package(package_name, callback, error) {
    let page_doc = document.implementation.createHTMLDocument("Some page");
    let html = page_doc.createElement('html');

    let pkg_aur_url = build_url('package', {package: package_name});
    utils.fetch_raw(pkg_aur_url, true, res => {
      html.innerHTML = res;
      page_doc.body.appendChild(html);

      // Get some details about the package.
      let package_details = html.querySelector('div#pkgdetails');
      let package_info = package_details.querySelector('table#pkginfo');
      let pkg_submitter = get_package_property(package_info, 'Submitter').innerText;
      let pkg_maintainer = get_package_property(package_info, 'Maintainer').innerText;
      let pkg_last_packager = get_package_property(package_info, 'Last Packager').innerText;

      let pkgdeps = html.querySelector('div#pkgdeps');
      let pkg_deps_number = pkgdeps.querySelector('h3').innerText.replace('Dependencies (', '').replace(')', '');
      let pkgreqs = html.querySelector('div#pkgreqs');
      let pkg_reqs_number = pkgreqs.querySelector('h3').innerText.replace('Required by (', '').replace(')', '');
      let pkg_files_number = html.querySelector('div#pkgfiles').querySelector('h3').innerText.replace('Sources (', '').replace(')', '');

      let pkg_deps_list = pkgdeps.querySelector('#pkgdepslist');
      let pkg_reqs_list = pkgreqs.querySelector('#pkgreqslist');

      // Fetch the comments of the package.
      let comments = [];
      let pinned_comments = [];
      let pkg_comments_section = page_doc.querySelectorAll('.comments.package-comments');
      // Checks if there is a pinned comments section.
      if (pkg_comments_section.length === 2) {
        // Get all of the pinned comments.
        let pkg_comments = pkg_comments_section[0].querySelectorAll('h4.comment-header');
        if (pkg_comments) {
          pinned_comments = [...pkg_comments]
            .map(comment_header => {
              return {header: comment_header, content: pkg_comments_section[0].querySelector(`div#${comment_header.id}-content`)};
            })
            .filter(comment => comment.content)
            .map(comment => {
              let author = comment.header.innerText.split(' ')[0];
              return {
                header: comment.header.innerText.replace(author, '')
                  .replace(/(\t)|(\n)+/g, ''),
                author: author.replace(/(\t)|(\n)+/g, ''),
                content: comment.content.innerHTML
                  .replace(/@([\w_\-\d]+)/g, (match, g1) => `<a href="/user/${g1}" class="orange-text text-accent-2">${match}</a>`)
                  .replace(/(\t)+/g, () => '')
              };
            });
        }
      }

      if (pkg_comments_section.length !== 0) {
        let i;
        if (pkg_comments_section.length === 2) i = 1; else i = 0;
        let pkg_comments = pkg_comments_section[i].querySelectorAll('h4.comment-header');
        if (pkg_comments) {
          comments = [...pkg_comments]
            .map(comment_header => {
              return {header: comment_header, content: pkg_comments_section[i].querySelector(`div#${comment_header.id}-content`)};
            })
            .filter(comment => comment.content)
            .map(comment => {
              let author = comment.header.innerText.split(' ')[0];
              return {
                header: comment.header.innerText.replace(author, '')
                  .replace(/(\t)|(\n)+/g, ''),
                author: author.replace(/(\t)|(\n)+/g, ''),
                content: comment.content.innerHTML
                  .replace(/@([\w_\-\d]+)/g, (match, g1) => `<a href="/user/${g1}" class="orange-text text-accent-2">${match}</a>`)
                  .replace(/(\t)+/g, () => '')
              };
            })
            // No more spam comments.
            .filter(comment => !comment.content.includes('cardsgenerators.com') && !comment.content.includes('freegiftcardgenrator.com'));
        }
      }

      // We also use the API because it is much more reliable than the website: it doesn't depend on the HTML structure.
      fetch_rpc(build_url('package_v2', {package: package_name}), json => {
        let pkg = json.results[0];

        callback({
          name: pkg['Name'],
          version: pkg['Version'],
          out_of_date: pkg['OutOfDate'],
          description: pkg['Description'],
          license: pkg['License'],
          link: get_package_link(pkg['URL']),
          keywords: pkg['Keywords'],
          votes: pkg['NumVotes'],
          orphan: !pkg['Maintainer'],
          popularity: pkg['Popularity'],
          submitter: pkg_submitter,
          maintainer: pkg_maintainer.split(' ').map(person => person.replace('(', '').replace(',', '').replace(')', '')),
          last_packager: pkg_last_packager,
          first_submitted: get_package_property(package_info, 'First Submitted').innerText,
          last_modified: get_package_property(package_info, 'Last Updated').innerText,
          conflicts: pkg['Conflicts'],
          dependencies: {
            count: pkg_deps_number,
            items: pkg_deps_list ? [...pkg_deps_list.querySelectorAll('li')].map(li => {
              [...li.querySelectorAll('a')].forEach(a => {
                if (a.getAttribute('href').startsWith('/packages/')) {
                  a.href = `/package/${a.getAttribute('href').replace('/packages/', '').replace('/', '')}`;
                }
              });
              return li.innerHTML;
            }) : []
          },
          required_by: {
            count: pkg_reqs_number,
            items: pkg_reqs_list ? [...pkg_reqs_list.querySelectorAll('li')].map(li => {
              [...li.querySelectorAll('a')].forEach(a => {
                if (a.getAttribute('href').startsWith('/packages/')) {
                  a.href = `/package/${a.getAttribute('href').replace('/packages/', '').replace('/', '')}`;
                }
              });
              return li.innerHTML;
            }) : []
          },
          files: {
            count: pkg_files_number,
            items: [...html.querySelector('ul#pkgsrcslist').children].map(child => child.innerHTML)
          },
          comments: {
            pinned: pinned_comments,
            comments: comments
          }
        });
      });
    }, error);
  },
  search(keywords, by, callback) {
    fetch_rpc(build_url('search', {field: by, keywords: keywords}), json => {
      if (json.version !== 5 && json.type !== 'search') {
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
