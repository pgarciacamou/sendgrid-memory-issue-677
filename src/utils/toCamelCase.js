const _ = require("lodash");

/**
 * Recursive helper
 */
function toCamelCase(obj) {
  if(!_.isPlainObject(obj)) {
    return obj;
  }
  return _.reduce(obj, (accum, val, key) => (
    _.set(accum, _.camelCase(key), toCamelCase(val))
  ), {});
}

module.exports = toCamelCase;
