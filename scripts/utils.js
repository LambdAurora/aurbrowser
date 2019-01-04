function create_row_div()
{
  return div('row');
}

function td()
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

function p(text)
{
  let p = document.createElement('p');
  p.innerText = text;
  return p;
}

function create_div_circle()
{
  let div_circle = document.createElement('div');
  div_circle.className += 'circle';
  return div_circle;
}

function create_collection_item(doc)
{
  let li = doc.createElement('li');
  li.className += 'collection-item white-text grey darken-2';
  return li;
}

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

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
  fetch(`${CORS_PROXY}${url}`, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    .then(res => check_status(res))
    .then(res => res.json())
    .then(res => lambda(res))
}

function fetch_raw(url, proxy, lambda)
{
  if (proxy)
    url = `${CORS_PROXY}${url}`
  fetch(`${url}`).then(res => {
    if (res.status == 200)
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

function to_array(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
}

/*
 * Disassembles the query in the URL into an Object.
 */
function get_query_details(url)
{
  let queries_str = url.search.replace('?', '').split('&');
  let queries = {};
  queries_str.forEach(query => {
    let query_splitted = query.split('=');
    if (query_splitted.length == 2)
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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
