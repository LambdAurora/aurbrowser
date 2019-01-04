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
  //main.className += 'valign-wrapper';
  //main.style['min-height'] = 'calc(100vh - 64px)';
  //let div_wrapper = document.createElement('div');
  //div_wrapper.className += 'center-align';
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
  //div_wrapper.append(div_preloader_wrapper);
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
    main.parentNode.append(page.querySelector('footer'));
    let main_stats_card = main.querySelector('div#main_stats_card');
    fetch_html('https://aur.archlinux.org/', true, aur => {
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

      let table = doc.createElement('table');
      table.className += 'highlight white-text';
      let thead = doc.createElement('thead');
      thead.innerHTML = `<tr><th>Name</th><th>Version</th><th>Votes</th><th>Popularity</th><th>Description</th><th>Maintainer</th></tr>`
      table.append(thead);
      let tbody = doc.createElement('tbody');
      table.append(tbody);
      json.results.forEach(result => {
        let tr = doc.createElement('tr');

        let td_name = td();
        td_name.innerHTML = `<a href="/?page=package&package=${result['Name']}" class="orange-text text-accent-2">${result['Name']}</a>`;

        let td_version = td();
        td_version.innerText = result['Version'];
        if (result['OutOfDate'])
          td_version.className += 'red-text';

        let td_votes = td();
        td_votes.innerText = result['NumVotes'];

        let td_popularity = td();
        td_popularity.innerText = result['Popularity'];

        let td_description = td();
        td_description.innerText = result['Description'];

        let td_maintainer = td();
        if (!result['Maintainer']) {
          td_maintainer.className = 'red-text';
          td_maintainer.innerText = 'Orphan';
        } else td_maintainer.innerText = result['Maintainer'];

        tr.append(td_name);
        tr.append(td_version);
        tr.append(td_votes);
        tr.append(td_popularity);
        tr.append(td_description);
        tr.append(td_maintainer);
        tbody.append(tr);
      });

      card.append(card_content);
      card.append(table);
      container.append(card);

      clear_main(main);
      to_array(page.querySelector('main').children).forEach(child => main.append(child));
      main.append(container);
      main.querySelector('#search_by').value = details.by;
      main.querySelector('#search').value = details.search;
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
      clone_url.innerHTML = `Clone URL (Git): <a href="https://aur.archlinux.org/${pkg['Name']}.git" class="orange-text text-accent-2">https://aur.archlinux.org/${pkg['Name']}.git</a> (Read only)`;
      content.append(clone_url);

      let pkg_base = create_collection_item(doc);
      pkg_base.innerHTML = `Package base: <a href="?page=package&package=${pkg['PackageBase']}" class="orange-text text-accent-2">${pkg['PackageBase']}</a> (<a href="${AUR_BASE_URL}pkgbase/${pkg['PackageBase']}" class="orange-text text-accent-2">raw</a>)`;
      content.append(pkg_base);

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
          keywords.innerHTML += `<a href="https://aur.archlinux.org/packages/?K=${keyword}&SB=p" class="keyword_badge">${keyword}</a>`;
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
        conflicts.innerHTML = `Conflicts: ${pkg['Conflicts'].map(conflict => `<a href="/?page=package&package=${conflict}" class="orange-text text-accent-2">${conflict}</a>`).join(', ')}`;
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
      //view_pkgbuild.href = `https://aur.archlinux.org/cgit/aur.git/tree/PKGBUILD?h=${package_name}`;
      view_pkgbuild.innerText = 'View PKGBUILD';
      card_action.append(view_pkgbuild);

      let download_snapshot = doc.createElement('a');
      download_snapshot.href = `https://aur.archlinux.org/cgit/aur.git/snapshot/${pkg['Name']}.tar.gz`;
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
      let pkg_comments_section = page.querySelectorAll('.comments.package-comments');
      if (pkg_comments_section.length == 2) {
        let pinned_comments_title = doc.createElement('h5');
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
            row.className += ' valign-wrapper';
            let content = div('col s12');
            content.style['margin-left'] = '15px';
            content.append(p(comment_content.innerText));
            content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
            row.append(content);
            card_comment.append(row);
            container.append(comment_div);
          });
        }
      }

      let comments_title = doc.createElement('h5');
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
            row.className += ' valign-wrapper';
            let content = div('col s12');
            content.style['margin-left'] = '15px';
            content.append(p(comment_content.innerText));
            content.innerHTML = content.innerHTML.replace('<br>', '').replace('<br>', '');
            row.append(content);
            card_comment.append(row);
            container.append(comment_div);
          });
        }
      }

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
      case 'package':
        if (!queries.hasOwnProperty('package')) render_error_page(main);
        else render_package_details(document, main, queries.package);
        break;
      default:
        render_error_page(main, "Unknown page.");
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

  document.addEventListener('DOMContentLoaded', () => {
    let search = document.querySelector('#search');
    if (search)
      add_on_submit_event(search, () => window.location = `/?page=search&by=name-desc&search=${search.value}`)
  });
}

main();
