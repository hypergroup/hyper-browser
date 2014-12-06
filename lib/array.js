module.exports = function(item, dom, opts, handle, resolve) {
  var last = item.length - 1;
  return (
    dom('div', {className: 'value array'},
      dom('span', {className: 'open bracket'}, '['),
      item.map(function(val, i) {
        var id = resolve(i);
        return (
          dom('div', {id: id, key: id, className: 'item'},
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
