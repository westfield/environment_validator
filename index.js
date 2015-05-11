var path = require('path')

var checkEngine = require('./lib/check_engine')
var checkModules = require('./lib/check_modules')

module.exports = {
  validate: function validate (packageJsonPath) {
    var packageInfo = require(packageJsonPath)
    checkEngine(packageInfo)
    checkModules(packageInfo, path.dirname(packageJsonPath) + '/node_modules')
  }
}
