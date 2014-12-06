module.exports = function(item, dom, opts, handle) {
  return dom('div', {className: 'value number'}, '' + item);
};
