var traverse = require('traverse');

/**
* modified
* compares left & right and returns the added and updated properties
* 
* @param {Object} left
* @param {Object} right
* @param {Object} options Optional properties to include in the result [added, updated]
* @returns {Object} added and updated object
*/
function modified (left, right, options) {
  options = options || {};
  options.added = options.added || true;
  options.updated = options.updated || true;
  
  var left = traverse(left);
  var result = traverse({});
  
  traverse(right).forEach(function (value) {
    if (this.isLeaf) {
      
      if (!left.has(this.path) && options.added) {
        // added
        if (Array.isArray(value) && value.length === 0) {
          // empty array
        } else if (value !== null && typeof value === "object" && typeof value.toISODate !== "function" && Object.keys(value).length === 0) {
          // empty object
        } else {
          result.set(this.path, value);
        }
      } else if (left.get(this.path) !== value && options.updated) {
        // updated
        if (Array.isArray(value) && value.length === 0) {
          // empty array
        } else if (value !== null && typeof value === "object" && typeof value.toISODate !== "function" && Object.keys(value).length === 0) {
          // empty object
        } else {
          result.set(this.path, value);
        }
      }
    }
  });
  
  return result.clone();
}

module.exports = modified;