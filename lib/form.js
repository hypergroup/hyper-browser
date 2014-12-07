/**
 * Module dependencies
 */

var merge = require('utils-merge');
function noop() {}

module.exports = exports = function(render, item, dom, opts, handle, resolve, objKeys) {
  var last = objKeys.length - 1;
  return objKeys.map(function(key, i) {
    if (key !== 'input') return render(item, dom, opts, handle, resolve, last, key, i);
    var inputs = formHandle.bind(null, dom, opts, handle, resolve, item);
    return render(item, dom, opts, inputs, resolve, last, key, i);
  });
};

/**
 * Render a hyper form
 */

function formHandle(dom, opts, handle, resolve, form, obj, key) {
  var hiddenField = opts.hiddenField;
  if (hiddenField === true) hiddenField = {name: '___HYPER_BROWSER___', value: '1'};

  function onSubmit(evt) {
    var data = Object.keys(obj).reduce(function(acc, name) {
      acc[name] = getValue(opts, resolve, obj[name], name);
      return acc;
    }, {});
    opts.onSubmit(evt, data);
  }

  return (
    dom('form', {action: form.action, method: form.method, className: 'hyper-form', onSubmit: opts.onSubmit && onSubmit},
      hiddenField && dom('input', merge({type: 'hidden'}, hiddenField)),
      handle(obj, key, inputObjHandle.bind(null, dom, opts, handle, resolve)),
      dom('div', null,
        dom('input', {type: 'submit', value: 'Submit', className: 'hyper-submit'})
      )
    )
  );
}

/**
 * Handle the single input object
 */

function inputObjHandle(dom, opts, handle, resolve, obj, key) {
  obj = clone(obj);
  if (typeof obj.value === 'undefined') obj.value = '';
  obj.value = getValue(opts, resolve, obj, key);
  return handle(obj, key, inputHandle.bind(null, dom, opts, handle, resolve, obj, key));
}

/**
 * Get the stored value for the input
 */

function getValue(opts, resolve, obj, key) {
  var get = opts.getValue;
  if (!get) return obj.value;
  var path = resolve('input/' + key);
  var val = get(path);
  if (typeof val === 'undefined' || typeof val === 'null') return obj.value;
  return val;
}

/**
 * Handle a hyper input
 */

function inputHandle(dom, opts, handle, resolve, conf, inputName, obj, key) {
  if (key !== 'value') return handle(obj, key);

  if (conf.type === 'hidden') return (
    dom('span', null,
      handle(obj, key),
      dom('input', {type: 'hidden', value: obj})
    )
  );

  return renderInput.apply(null, arguments);
}

/**
 * Render a hyper input
 */

function renderInput(dom, opts, handle, resolve, conf, inputName) {
  var fn = chooseType(conf);

  var onChange = opts.onChange && function(evt) {
    opts.onChange(evt, resolve('input/' + inputName));
  };

  return fn(dom, opts, handle, resolve, conf, inputName, onChange);
}

/**
 * Choose an input type
 */

function chooseType(conf) {
  var type = conf.type;
  if (type === 'select') return select;
  if (type === 'textarea') return textarea;
  // TODO support "json"
  return input;
}

/**
 * Render a 'select'
 */

function select(dom, opts, handle, resolve, conf, inputName, onChange) {
  var fetch = opts.fetchHref || noop;

  var options = (conf.options || []).map(function(option) {
    if (!option) return dom('option', {key: 'blank', value: ''}, '');
    var value = option.value;
    var text = option.text || option.name || value;
    if (text && text.href) text = fetch(text);
    return dom('option', {value: value, key: value}, text);
  });

  return dom('select', merge({
    onChange: onChange,
    name: inputName,
    ref: resolve('input/' + inputName)
  }, conf), options)
}

/**
 * Render a 'textarea'
 */

function textarea(dom, opts, handle, resolve, conf, inputName, onChange) {
  return dom('textarea', merge({
    onChange: onChange,
    name: inputName,
    ref: resolve('input/' + inputName)
  }, conf));
}

/**
 * Render an 'input'
 */

function input(dom, opts, handle, resolve, conf, inputName, onChange) {
  return dom('input', merge({
    onChange: onChange,
    name: inputName,
    ref: resolve('input/' + inputName)
  }, conf));
}

/**
 * Deep clone an object
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Inspect an object for a form
 */

exports.isForm = function(item, opts) {
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
};
