var should = require('should');
var render = require('..');

function dom(tag, props) {
  return flatten(Array.prototype.slice.call(arguments, 2)).join('');
}

function flatten(arr, init) {
  return arr.reduce(function(acc, item) {
    if (Array.isArray(item)) return flatten(item, acc);
    acc.push(item);
    return acc;
  }, init || []);
}

describe('hyper-browser', function() {
  describe('render', function() {
    it('should handle all of the types', function() {
      var data = {
        foo: {
          bar: {
            baz: [
              true,
              false,
              1,
              2,
              'foo-string',
              'https://example.com',
              null,
              undefined,
              {
                it: 'works!'
              }
            ]
          },
          test: {
            hello: 'World!'
          }
        }
      };
      render(data, dom, {postColonSpace: false}).should.eql(JSON.stringify(data));
    });
  })
});
