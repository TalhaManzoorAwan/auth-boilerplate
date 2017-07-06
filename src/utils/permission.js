var pathToRegexp = require('path-to-regexp');

exports = module.exports = function permission (options) {
  options = options || {};
  options.allow = options.allow || [];
  
  var allow = options.allow.map(function(i) {
    return {method: i.method, path: i.path, regex: pathToRegexp(i.path)};
  });
  
  return function permission (req, res, next) {
    var port = req.headers.host.indexOf(':') > -1?parseInt(req.headers.host.split(":")[1]):null;
    if (options.publicPort == port) {
      var result = allow.filter(function (i) {
        return i.method === req.method && i.regex.exec(req.path);
      });
      
      if (result.length < 1) {
        res.send(403);
      } else {
        next();
      }
    } else {
      next();
    }
  }
}





