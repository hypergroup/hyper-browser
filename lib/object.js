/**
 * Module dependencies
 */

var get = require('../utils').get;

module.exports = function(item, dom, opts, handle, resolve) {
  var isForm = get('isForm', opts, isFormFn)(item, opts);
  var objKeys = get('keysFn', opts, keysFn)(item);

  return (
    dom('div', {className: 'value object'},
      dom('span', {className: 'open bracket'}, '{'),

      isForm ?
        renderForm(item, dom, opts, handle, resolve, objKeys) :
        objKeys.map(renderItem.bind(null, item, dom, opts, handle, resolve, objKeys.length - 1)),

      // item.src && renderImage(dom, opts, item),

      dom('span', {className: 'close bracket'}, '}')
    )
  );
};

function renderItem(parent, dom, opts, handle, resolve, last, key, i) {
  var id = resolve(key);
  var value = get(key, parent);

  return (
    dom('div', {className: 'item', key: id, id: id},
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

function renderForm(item, dom, opts, handle, resolve, objKeys) {
  var last = objKeys.length - 1;
  return (
    dom('form', {action: item.action || '', method: item.method || ''},
      objKeys.map(function(key, i) {
        if (key !== 'input') return renderItem(item, dom, opts, handle, resolve, last, key, i);
        return 'TODO: INPUT';
      })
    )
  );

}

function renderHydrate() {

}

function isFormFn(item, opts) {
  var hasAction = item.hasOwnProperty('action');
  var hasInput = item.hasOwnProperty('input');
  var hasMethod = item.hasOwnProperty('method');
  var hasEnctype = item.hasOwnProperty('enctype');
  return hasAction && hasInput ||
    hasAction && hasMethod ||
    hasAction && hasEnctype ||
    hasInput && hasMethod ||
    hasInput && hasEnctype ||
    hasMethod && hasEnctype;
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
