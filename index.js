/**
 * Module dependencies
 */

var type = require('component-type');

var types = {
  'array': require('./lib/array'),
  'boolean': require('./lib/boolean'),
  'null': require('./lib/null'),
  'number': require('./lib/number'),
  'object': require('./lib/object'),
  'string': require('./lib/string'),
  'undefined': require('./lib/null')
};

exports = module.exports = function(value, dom, opts) {
  return handle(dom, opts || {}, [], value);
};

function handle(dom, opts, path, item, key) {
  var itemType = type(item);
  var mod = types[itemType];
  if (!mod) throw new Error('Unsupported type "' + itemType + '"');

  if (typeof key !== 'undefined' &&
      key !== null &&
      key !== '' &&
      key !== 'collection' &&
      key !== 'data') path = append(path, key);

  return mod(item, dom, opts, handle.bind(null, dom, opts, path), resolve.bind(null, path));
};

function resolve(path, id) {
  return '/' + append(path, id).join('/');
}

function append(arr, item) {
  arr = (arr || []).slice();
  Array.isArray(item) ? arr.push.apply(arr, item) : arr.push(item);
  return arr;
}
