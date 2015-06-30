var path = require('path')

var checkEngine = require('./lib/check_engine')
var checkModules = require('./lib/check_modules')

module.exports = {
  validate: function validate (packageJsonPath) {
    var packageInfo = require(packageJsonPath)
    var dependencyPath = path.join(path.dirname(packageJsonPath), 'node_modules')
    var includeDevDependencies = ['development', 'test'].indexOf(
      process.env.NODE_ENV
    ) >= 0
    checkEngine(packageInfo)
    checkModules(
      packageInfo,
      dependencyPath,
      includeDevDependencies
    )
  }
}
