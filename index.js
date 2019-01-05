/*
 * Main file of AUR Browser.
 */

const VERSION = '1.1.0';

function clear_main(main)
{
  main.className = '';
  main.style = ''
  while (main.firstChild)
    main.removeChild(main.firstChild);
}

function render_loading(main)
{
  clear_main(main);
  let div_preloader_wrapper = document.createElement('div');
  div_preloader_wrapper.className += 'preloader-wrapper big active';
  div_preloader_wrapper.style['position'] = 'absolute';
  div_preloader_wrapper.style['top'] = 0;
  div_preloader_wrapper.style['left'] = 0;
  div_preloader_wrapper.style['right'] = 0;
  div_preloader_wrapper.style['bottom'] = 0;
  div_preloader_wrapper.style['margin'] = 'auto';
  let div_spinner_layer = document.createElement('div');
  div_spinner_layer.className += 'spinner-layer spinner-blue-only';
  let div_circle_clipper_left = document.createElement('div');
  div_circle_clipper_left.className += 'circle-clipper left';
  let div_gap_patch = document.createElement('div');
  div_gap_patch.className += 'gap-patch';
  let div_circle_clipper_right = document.createElement('div');
  div_circle_clipper_right.className += 'circle-clipper right';
  div_circle_clipper_left.append(create_div_circle());
  div_gap_patch.append(create_div_circle());
  div_circle_clipper_right.append(create_div_circle());
  div_spinner_layer.append(div_circle_clipper_left);
  div_spinner_layer.append(div_gap_patch);
  div_spinner_layer.append(div_circle_clipper_right);
  div_preloader_wrapper.append(div_spinner_layer);
  main.append(div_preloader_wrapper);
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

function render_search_page(doc, main, details)
{
  fetch_html('./views/search.part.html', false, page => {
    fetch_rpc(build_url('search', { field: details.by, keywords: details.search }), json => {
      if (json.version != 5 && json.type !== 'search') {
        render_error_page(main, "Got a wrong response from the AUR API.");
        return;
      }

      // Build results.
      let container = div('container');
      let card = div('card grey darken-1');
      let card_content = div('card-content white-text');

      // Building title
      let card_title = doc.createElement('span');
      card_title.className += 'card-title';
      card_title.innerText = `Results of search "${details.search}" (${json.resultcount}):`;
      card_content.append(card_title);

      card.append(card_content);
      card.append(div('divider'));
      json.results.map(result => {
        return {
          name: result['Name'],
          version: result['Version'],
          description: result['Description'],
          out_of_date: result['OutOfDate'],
          last_modified: result['LastModified'],
          votes: result['NumVotes'],
          popularity: result['Popularity'],
          maintainer: result['Maintainer']
         };
       }).forEach(pkg => {
         card.append(build_package_section(pkg));
         card.append(div('divider'));
      });

      container.append(card);

      clear_main(main);
      to_array(page.querySelector('main').children).forEach(child => main.append(child));
      main.append(container);
      main.querySelector('#search_by').value = details.by;
      main.querySelector('#search').value = details.search;
    });
  });
}

function render_packages(doc, main, index)
{
  fetch_html('./views/packages.part.html', false, page => {
    fetch_html(build_url('packages', { index: index }), true, aur_page => {
      let page_index = index / 50;
      let cursor_pos = 'center';

      let pkglist_stats = aur_page.querySelector('div.pkglist-stats p').innerText.replaceAll('\n', '').split(' ');
      let page_length = parseInt(pkglist_stats[pkglist_stats.length - 1].replace('.', ''));

      if (page_index < 2) cursor_pos = 'left';
      else if (page_index > page_length - 3) cursor_pos = 'right';

      to_array(page.querySelectorAll('ul.pagination')).forEach(pagination => {
        let first = pagination.querySelector('.id_search_first');
        let last = pagination.querySelector('.id_search_last');
        let previous = pagination.querySelector('.id_search_previous');
        let next = pagination.querySelector('.id_search_next');
        let i_0 = pagination.querySelector('.id_search_0');
        let i_1 = pagination.querySelector('.id_search_1');
        let i_2 = pagination.querySelector('.id_search_2');
        let i_3 = pagination.querySelector('.id_search_3');
        let i_4 = pagination.querySelector('.id_search_4');

        switch (cursor_pos) {
          case 'left':
            if (page_index == 0) {
              first.href = '#!';
              first.parentNode.className = 'disabled';
              previous.parentNode.className = 'disabled';
              i_0.parentNode.className = 'active';
              i_0.href = '#!'
            } else if (page_index == 1) {
              previous.href = `?page=packages&i=${index - 50}`;
              i_1.parentNode.className = 'active';
              i_1.href = '#!'
            }
            next.href = `?page=packages&i=${index + 50}`;
            last.href = `?page=packages&i=${(page_length - 1) * 50}`;
            break;
          case 'right':
            i_0.href = `?page=packages&i=${(page_length - 5) * 50}`;
            i_1.href = `?page=packages&i=${(page_length - 4) * 50}`;
            i_2.href = `?page=packages&i=${(page_length - 3) * 50}`;
            i_3.href = `?page=packages&i=${(page_length - 2) * 50}`;
            i_4.href = `?page=packages&i=${(page_length - 1) * 50}`;

            if (page_index == page_length - 1) {
              last.parentNode.className = 'disabled';
              next.parentNode.className = 'disabled';
              i_4.parentNode.className = 'active';
              i_4.href = '#!'

              i_4.innerText = page_length;
              i_3.innerText = page_length - 1;
              i_2.innerText = page_length - 2;
              i_1.innerText = page_length - 3;
              i_0.innerText = page_length - 4;
            } else if (page_index == page_length - 2) {
              last.href = `?page=packages&i=${(page_length - 1) * 50}`;
              next.href = `?page=packages&i=${index + 50}`;
              i_3.parentNode.className = 'active';
              i_3.href = '#!'

              i_4.innerText = page_length;
              i_3.innerText = page_length - 1;
              i_2.innerText = page_length - 2;
              i_1.innerText = page_length - 3;
              i_0.innerText = page_length - 4;
            }
            previous.href = `?page=packages&i=${index - 50}`;
            break;
          default:
            i_2.parentNode.className = 'active';
            i_2.href = '#!'

            i_0.href = `?page=packages&i=${index - 100}`;
            i_1.href = `?page=packages&i=${index - 50}`;
            i_3.href = `?page=packages&i=${index + 50}`;
            i_4.href = `?page=packages&i=${index - 100}`;

            i_0.innerText = page_index - 1;
            i_1.innerText = page_index;
            i_2.innerText = page_index + 1;
            i_3.innerText = page_index + 2;
            i_4.innerText = page_index + 3;

            previous.href = `?page=packages&i=${index - 50}`;
            next.href = `?page=packages&i=${index + 50}`;
        }
      });

      let card = page.querySelector('div#main_card');

      card.querySelector('span.card-title').innerText = `Packages (${pkglist_stats[0].replaceAll('			', '')}):`;

      to_array(aur_page.querySelector('table.results tbody').querySelectorAll('tr'))
        .map(line => {
          let td = line.querySelectorAll('td');
          return {
            name: td[0].innerText,
            version: td[1].innerText,
            out_of_date: td[1].className === 'flagged',
            votes: td[2].innerText,
            popularity: td[3].innerText,
            description: td[4].innerText,
            maintainer: td[5].innerText.replaceAll('\n', '')
          };
        }).forEach(pkg => {
          card.append(build_package_section(pkg));
          card.append(div('divider'));
        });

      clear_main(main);
      to_array(page.querySelector('main').children).forEach(child => main.append(child));
    });
  });
}

function render_package_details(doc, main, package)
{
  let pkg_aur_url = build_url('package', { package: package });
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

    fetch_rpc(build_url('package_v2', { package: package }), json => {
      if (json.version != 5 && json.type !== 'multiinfo') {
        render_error_page(main, "Got a wrong response from the AUR API.");
        return;
      }

      let pkg = json.results[0];

      let container = div('container');

      let card = div('card grey darken-1');

      let card_content = div('card-content white-text');

      // Building title
      let card_title = doc.createElement('span');
      card_title.className += 'card-title';
      if (pkg['OutOfDate']) card_title.innerHTML = `<a href="${pkg_aur_url}" class="orange-text text-accent-2">${pkg['Name']}</a> v<span class="red-text">${pkg['Version']}</span>`
      else card_title.innerHTML = `<a href="${pkg_aur_url}" class="orange-text text-accent-2">${pkg['Name']}</a> v` + pkg['Version'];
      card_content.append(card_title);

      // Building content
      let content = doc.createElement('ul');
      content.className += 'collection';

      let clone_url = create_collection_item(doc);
      clone_url.innerHTML = `Clone URL (Git): <a href="${AUR_BASE_URL}/${pkg['Name']}.git" class="orange-text text-accent-2">${AUR_BASE_URL}/${pkg['Name']}.git</a> (Read only)`;
      content.append(clone_url);

      let pkg_base = create_collection_item(doc);
      let pkg_base_url = `?page=package&package=${pkg['PackageBase']}`;
      if (pkg['Name'] !== pkg['PackageBase'])
        pkg_base_url = `?page=package_base&package=${pkg['PackageBase']}`
      pkg_base.innerHTML = `Package base: <a href="${pkg_base_url}" class="orange-text text-accent-2">${pkg['PackageBase']}</a> (<a href="${AUR_BASE_URL}/cgit/aur.git/plain/PKGBUILD?h=${pkg['PackageBase']}" class="orange-text text-accent-2">raw</a>)`;
      content.append(pkg_base);

      if (pkg['OutOfDate']) {
        let out_of_date = create_collection_item(doc);
        out_of_date.className = out_of_date.className.replace('white-text ', '') + ' red-text';
        out_of_date.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Flagged out-of-date (${convert_timestamp(pkg['OutOfDate'])})`;
        content.append(out_of_date);
      }

      let description = create_collection_item(doc);
      description.innerText = `Description: ${pkg['Description']}`;
      content.append(description);

      let link = create_collection_item(doc);
      if (pkg['URL'].startsWith('https://github.com/') || pkg['URL'].startsWith('https://www.github.com/')) {
        link.innerHTML = `Link: <a href="${pkg['URL']}" class="orange-text text-accent-2"><i class="fab fa-github aperlambda-foreground-github"></i> ${pkg['URL']}</a>`
      } else link.innerHTML = `Link: <a href="${pkg['URL']}" class="orange-text text-accent-2">${pkg['URL']}</a>`;
      content.append(link);

      if (pkg['Keywords'].length != 0) {
        let keywords = create_collection_item(doc);
        keywords.innerHTML += `Keywords: `
        pkg['Keywords'].forEach(keyword => {
          keywords.innerHTML += `<a href="${AUR_BASE_URL}/packages/?K=${keyword}&SB=p" class="keyword_badge">${keyword}</a>`;
        });
        content.append(keywords);
      }

      if (pkg['License']) {
        let licenses = create_collection_item(doc);
        licenses.innerText = `Licenses: ${pkg['License'].join(', ')}`;
        licenses.innerHTML = licenses.innerHTML.replaceAll('<br>', '');
        content.append(licenses);
      }

      if (pkg['Conflicts']) {
        let conflicts = create_collection_item(doc);
        conflicts.innerHTML = `Conflicts: ${pkg['Conflicts'].map(conflict => `<a href="?page=package&package=${conflict}" class="orange-text text-accent-2">${conflict}</a>`).join(', ')}`;
        content.append(conflicts);
      }

      let submitter = create_collection_item(doc);
      submitter.innerHTML = `Submitter: <a href="?page=account&account=${pkg_submitter}" class="orange-text text-accent-2">${pkg_submitter}</a>`;
      content.append(submitter);

      let maintainer = create_collection_item(doc);
      if (!pkg['Maintainer']) maintainer.innerHTML = `Maintainer: <span class="red-text">None</span>`;
      else {
        let pkg_maintainers = pkg_maintainer.split(' ');
        if (pkg_maintainers[0] === 'None') maintainer.innerHTML = `Maintainer: None`;
        else {
          maintainer.innerHTML = `Maintainer: <a href="?page=account&account=${pkg_maintainers[0]}" class="orange-text text-accent-2">${pkg_maintainers[0]}</a>`;
          if (pkg_maintainers.length > 1) {
            maintainer.innerHTML += ' (';
            pkg_maintainers.splice(0, 1);
            pkg_maintainers.map(person => person.replace('(', '').replace(',', '').replace(')', '')).forEach(person => maintainer.innerHTML += `<a href="?page=account&account=${person}" class="orange-text text-accent-2">${person}</a>, `);
            maintainer.innerHTML = maintainer.innerHTML.substring(0, maintainer.innerHTML.length - 2) + ')';
          }
        }
      }
      content.append(maintainer);

      let last_packager = create_collection_item(doc);
      last_packager.innerHTML = `Last packager: <a href="?page=account&account=${pkg_last_packager}" class="orange-text text-accent-2">${pkg_last_packager}</a>`;
      content.append(last_packager);

      let votes = create_collection_item(doc);
      votes.innerText = `Votes: ${pkg['NumVotes']}`;
      content.append(votes);

      let popularity = create_collection_item(doc);
      popularity.innerText = `Popularity: ${pkg['Popularity']}`;
      content.append(popularity);

      let first_submitted = create_collection_item(doc);
      first_submitted.innerText = `First submitted: ${get_package_property(package_info, 'First Submitted').innerText}`;
      content.append(first_submitted);

      let last_updated = create_collection_item(doc);
      last_updated.innerText = `Last updated: ${get_package_property(package_info, 'Last Updated').innerText}`;
      content.append(last_updated);

      card_content.append(content);

      let deps_row = create_row_div();

      let dependencies_div = div('col s12 m6');
      let dependencies_title = doc.createElement('h6');
      dependencies_title.className += 'white-text grey darken-2';
      dependencies_title.style.padding = '0.2em 0.35em';
      dependencies_title.innerText = `Dependencies (${pkg_deps_number})`;
      dependencies_div.append(dependencies_title);
      if (pkg['MakeDepends'] || pkg['Depends']) {
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
        dependencies_div.append(pkgdepslist);
      }

      let required_by_div = div('col s12 m6');
      let required_by_title = doc.createElement('h6');
      required_by_title.className += 'white-text grey darken-2';
      required_by_title.style.padding = '0.2em 0.35em';
      required_by_title.innerText = `Required by (${pkg_reqs_number})`;
      required_by_div.append(required_by_title);
      let pkgreqslist = pkgreqs.querySelector('#pkgreqslist');
      if (pkgreqslist) {
        to_array(pkgreqslist.querySelectorAll('li')).forEach(li => {
          li.className += 'white-text';
          to_array(li.querySelectorAll('a')).forEach(a => {
            a.className += "orange-text text-accent-2";
            if (a.getAttribute('href').startsWith('/packages/')) {
              a.href = `?page=package&package=${a.getAttribute('href').replace('/packages/', '').replace('/', '')}`;
            }
          });
        });
        required_by_div.append(pkgreqslist);
      }

      deps_row.append(dependencies_div);
      deps_row.append(required_by_div);

      let files_row = create_row_div();
      let files_div = div('col s12');
      let files_title = doc.createElement('h6');
      files_title.className += 'white-text grey darken-2';
      files_title.style.padding = '0.2em 0.35em';
      files_title.innerText = `Sources (${pkg_files_number})`;
      let files_ul = doc.createElement('ul');
      to_array(page.querySelector('ul#pkgsrcslist').children).forEach(child => {
        child.querySelector('a').className += 'orange-text text-accent-2';
        files_ul.append(child);
      });
      files_div.append(files_title);
      files_div.append(files_ul);
      files_row.append(files_div);

      // Building actions
      let card_action = div('card-action');

      let view_pkgbuild = doc.createElement('a');
      view_pkgbuild.className += 'modal-trigger';
      view_pkgbuild.href = "#pkgbuild_viewer";
      view_pkgbuild.innerText = 'View PKGBUILD';
      card_action.append(view_pkgbuild);

      let download_snapshot = doc.createElement('a');
      download_snapshot.href = `${AUR_BASE_URL}/cgit/aur.git/snapshot/${pkg['Name']}.tar.gz`;
      download_snapshot.innerText = 'Download a snapshot';
      card_action.append(download_snapshot);

      let search_wiki = doc.createElement('a');
      search_wiki.href = `https://wiki.archlinux.org/index.php/Special:Search?search=${pkg['Name']}`;
      search_wiki.innerText = 'Search wiki';
      card_action.append(search_wiki);

      card.append(card_content);
      card.append(deps_row);
      card.append(files_row);
      card.append(card_action);
      container.append(card);

      /*
       * Building comments section
       */
      build_comment_section(page, container);

      fetch_raw(build_url('package_pkgbuild', { package: package }), true, pkgbuild_doc => {
        doc.getElementById('pkgbuild_viewer_title').innerText = `PKGBUILD of ${pkg['Name']}:`
        let pkgbuild_code = doc.getElementById('pkgbuild_code');
        pkgbuild_code.innerHTML = Prism.highlight(pkgbuild_doc, Prism.languages.bash);
      });

      clear_main(main);
      main.append(container);
    });
  });
}

function render_package_base_details(doc, main, package_base)
{
  let pkg_aur_url = build_url('package_base', { package: package_base });
  fetch_html(pkg_aur_url, true, pkg_page => {
    let package_details = pkg_page.querySelector('div#pkgdetails');
    let package_info = package_details.querySelector('table#pkginfo');
    let pkg_submitter = get_package_property(package_info, 'Submitter').innerText;
    let pkg_maintainer = get_package_property(package_info, 'Maintainer').innerText;
    let pkg_last_packager = get_package_property(package_info, 'Last Packager').innerText;

    let pkg_pkgs = pkg_page.querySelector('div#pkgs');
    let pkg_pkgs_number = pkg_pkgs.querySelector('h3').innerText.replace('Packages (', '').replace(')', '');

    let container = div('container');
    let card = div('card grey darken-1');
    container.append(card);

    let card_content = div('card-content white-text');

    // Building title
    let card_title = doc.createElement('span');
    card_title.className += 'card-title';
    card_title.innerHTML = `Package Base <a href="${pkg_aur_url}" class="orange-text text-accent-2">${package_base}</a>`;
    card_content.append(card_title);

    // Building content
    let content = doc.createElement('ul');
    content.className += 'collection';

    let clone_url = create_collection_item(doc);
    clone_url.innerHTML = `Clone URL (Git): <a href="${AUR_BASE_URL}/${package_base}.git" class="orange-text text-accent-2">${AUR_BASE_URL}/${package_base}.git</a> (Read only)`;
    content.append(clone_url);

    let submitter = create_collection_item(doc);
    submitter.innerHTML = `Submitter: <a href="?page=account&account=${pkg_submitter}" class="orange-text text-accent-2">${pkg_submitter}</a>`;
    content.append(submitter);

    let maintainer = create_collection_item(doc);
    if (!pkg_maintainer.innerText === 'None') maintainer.innerHTML = `Maintainer: <span class="red-text">None</span>`;
    else {
      let pkg_maintainers = pkg_maintainer.split(' ');
      if (pkg_maintainers[0] === 'None') maintainer.innerHTML = `Maintainer: None`;
      else {
        maintainer.innerHTML = `Maintainer: <a href="?page=account&account=${pkg_maintainers[0]}" class="orange-text text-accent-2">${pkg_maintainers[0]}</a>`;
        if (pkg_maintainers.length > 1) {
          maintainer.innerHTML += ' (';
          pkg_maintainers.splice(0, 1);
          pkg_maintainers.map(person => person.replace('(', '').replace(',', '').replace(')', '')).forEach(person => maintainer.innerHTML += `<a href="?page=account&account=${person}" class="orange-text text-accent-2">${person}</a>, `);
          maintainer.innerHTML = maintainer.innerHTML.substring(0, maintainer.innerHTML.length - 2) + ')';
        }
      }
    }
    content.append(maintainer);

    let last_packager = create_collection_item(doc);
    last_packager.innerHTML = `Last packager: <a href="?page=account&account=${pkg_last_packager}" class="orange-text text-accent-2">${pkg_last_packager}</a>`;
    content.append(last_packager);

    let votes = create_collection_item(doc);
    votes.innerText = `Votes: ${get_package_property(package_details, 'Votes').innerText}`;
    content.append(votes);

    let popularity = create_collection_item(doc);
    popularity.innerText = `Popularity: ${get_package_property(package_details, 'Popularity').innerText}`;
    content.append(popularity);

    let first_submitted = create_collection_item(doc);
    first_submitted.innerText = `First submitted: ${get_package_property(package_details, 'First Submitted').innerText}`;
    content.append(first_submitted);

    let last_updated = create_collection_item(doc);
    last_updated.innerText = `Last updated: ${get_package_property(package_details, 'Last Updated').innerText}`;
    content.append(last_updated);

    card_content.append(content);

    // Building actions
    let card_action = div('card-action');

    let view_pkgbuild = doc.createElement('a');
    view_pkgbuild.className += 'modal-trigger';
    view_pkgbuild.href = "#pkgbuild_viewer";
    view_pkgbuild.innerText = 'View PKGBUILD';
    card_action.append(view_pkgbuild);

    let download_snapshot = doc.createElement('a');
    download_snapshot.href = `${AUR_BASE_URL}/cgit/aur.git/snapshot/${package_base}.tar.gz`;
    download_snapshot.innerText = 'Download a snapshot';
    card_action.append(download_snapshot);

    let search_wiki = doc.createElement('a');
    search_wiki.href = `https://wiki.archlinux.org/index.php/Special:Search?search=${package_base}`;
    search_wiki.innerText = 'Search wiki';
    card_action.append(search_wiki);

    let packages_row = create_row_div();
    let packages_div = div('col s12');
    let packages_title = doc.createElement('h6');
    packages_title.className += 'white-text grey darken-2';
    packages_title.style.padding = '0.2em 0.35em';
    packages_title.innerText = `Packages (${pkg_pkgs_number})`;
    let packages_ul = doc.createElement('ul');
    to_array(pkg_page.querySelector('div#pkgs ul').children).forEach(child => {
      let anchor = child.querySelector('a');
      anchor.className += 'orange-text text-accent-2';
      anchor.href = anchor.getAttribute('href').replace('/packages/', '?page=package&package=').replace('/', '');
      packages_ul.append(child);
    });
    packages_div.append(packages_title);
    packages_div.append(packages_ul);
    packages_row.append(packages_div);

    card.append(card_content);
    card.append(packages_row);
    card.append(card_action);

    /*
     * Building comments section
     */
    build_comment_section(pkg_page, container);

    let pkg_pkgbuild_url = build_url('package_pkgbuild', { package: package_base });
    fetch_raw(pkg_pkgbuild_url, true, pkgbuild_doc => {
      doc.getElementById('pkgbuild_viewer_title').innerHTML = `<a href="${pkg_pkgbuild_url}" class="orange-text text-accent-2">PKGBUILD</a> of ${package_base}:`
      let pkgbuild_code = doc.getElementById('pkgbuild_code');
      pkgbuild_code.innerHTML = Prism.highlight(pkgbuild_doc, Prism.languages.bash);
    });

    clear_main(main);
    main.append(container);
  });
}

function render_user_details(doc, main, username)
{
  let user_url = build_url('account', { user: username });
  let container = div('container');
  let card = div('card grey darken-1');
  container.append(card);

  let card_content = div('card-content white-text');

  // Building title
  let card_title = doc.createElement('span');
  card_title.className += 'card-title';
  card_title.innerHTML = `User <a href="${user_url}" class="orange-text text-accent-2">${username}</a>`;
  card_content.append(card_title);

  card_content.append(p('Please see the AUR page for more information.'));

  card.append(card_content);

  clear_main(main);
  main.append(container);
}

function render_simple_html(main, view)
{
  fetch_html(`./views/${view}.part.html`, false, page => {
    let page_main = page.querySelector('main');
    page_main.innerHTML = page_main.innerHTML.replace('${version}', VERSION);
    clear_main(main);
    to_array(page_main.children).forEach(child => main.append(child));
  });
}

function main()
{
  let main = document.querySelector("main");
  let queries = get_query_details(window.location);
  render_loading(main);
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
        else render_package_details(document, main, queries.package);
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

document.addEventListener('DOMContentLoaded', () => {
  let footer = document.querySelector('footer');
  footer.innerHTML = footer.innerHTML.replace('${version}', VERSION);
  let search = document.querySelector('#search');
  if (search)
    add_on_submit_event(search, () => window.location = `?page=search&by=name-desc&search=${search.value}`)
});

main();
