/**
 * Module dependencies
 */

var get = require('../utils').get;

module.exports = function(item, dom, opts, handle, resolve) {
  var last = item.length - 1;
  var activeId = get('activeId', opts);

  return (
    dom('div', {className: 'value array'},
      dom('span', {className: 'open bracket'}, '['),
      item.map(function(val, i) {
        var id = resolve(i);
        var active = activeId === id ? ' active' : '';
        return (
          dom('div', {id: id, key: id, className: 'item' + active},
            dom('a', {href: '#' + id, className: 'handle'}),
            handle(val, i),
            i === last ? '' : dom('span', {className: 'comma'}, ',')
          )
        );
      }),
      dom('span', {className: 'close bracket'}, ']')
    )
  );
};
