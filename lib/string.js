var link = /^http[s]?:\/\/|^\/|^#\//;

module.exports = function(item, dom, opts, handle) {
  var pre = JSON.stringify(item).slice(1, -1);
  return (
    dom('div', {className: 'value string'},
      dom('span', {className: 'quote'}, '"'),
      link.test(item) ? dom('a', {href: item}, pre) : pre,
      dom('span', {className: 'quote'}, '"')
    )
  );
};
