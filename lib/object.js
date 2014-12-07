/**
 * Module dependencies
 */

var get = require('../utils').get;
var form = require('./form');

module.exports = function(item, dom, opts, handle, resolve) {
  var isForm = get('isForm', opts, form.isForm)(item, opts);
  var objKeys = get('keysFn', opts, keysFn)(item);

  return (
    dom('div', {className: 'value object'},
      dom('span', {className: 'open bracket'}, '{'),

      isForm ?
        form(renderItem, item, dom, opts, handle, resolve, objKeys) :
        objKeys.map(renderItem.bind(null, item, dom, opts, handle, resolve, objKeys.length - 1)),

      // item.src && renderImage(dom, opts, item),

      dom('span', {className: 'close bracket'}, '}')
    )
  );
};

function renderItem(parent, dom, opts, handle, resolve, last, key, i) {
  var id = resolve(key);
  var value = get(key, parent);
  var active = get('activeId', opts) === id ? ' active' : '';

  return (
    dom('div', {className: 'item' + active, key: id, id: id},
      // TODO support "data" (including docs)

      renderKey(dom, opts, id, key),
      renderSeparator(dom, opts),

      handle(value, key),

      i === last ? '' : dom('span', {className: 'comma'}, ',')

      // TODO support a "hydrate"
    )
  );
}

function renderKey(dom, opts, id, key) {
  return (
    dom('span', {className: 'key'},
      dom('span', {className: 'quote'}, '"'),
      dom('a', {className: 'handle', href: '#' + id}, key),
      dom('span', {className: 'quote'}, '"')
    )
  );
}

function renderSeparator(dom, opts) {
  return (
    dom('span', {className: 'separator'},
      get('preColonSpace', opts, false) ? ' ' : '',
      dom('span', {className: 'colon'}, ':'),
      get('postColonSpace', opts, true) ? ' ' : ''
    )
  );
}

function renderImage(dom, opts, value) {
  return (
    dom('div', {className: 'item'},
      dom('img', {src: value.src, className: 'image'})
    )
  );
}

function renderHydrate() {

}

var weights = {
  href: 100,
  src: 99,
  action: 98,
  method: 97,
  title: 96,
  name: 95,
  input: -98,
  data: -99,
  collection: -99
};

function keysFn(item) {
  return Object.keys(item).sort(function(a, b) {
    var scoreA = weights[a] || 0;
    var scoreB = weights[b] || 0;

    if (scoreA === scoreB) return a < b ? -1 : 1;
    return scoreA < scoreB ? 1 : -1;
  });
}
