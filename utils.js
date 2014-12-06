exports.get = function(key, obj, fallback) {
  if (obj.hasOwnProperty && obj.hasOwnProperty(key)) return obj[key];
  return fallback;
};
