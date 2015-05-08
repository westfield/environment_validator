var fs = require('fs')

var semver = require('semver')
var merge = require('merge')

var InvalidDependencyError = require('./invalid_dependency_error')
var MissingDependenciesError = require('./missing_dependencies_error')
var UnsavedDependenciesError = require('./unsaved_dependencies_error')

function getInstalledDependencies (nodeModulesPath) {
  var installedDependencies = {}
  fs.readdirSync(nodeModulesPath).forEach(function (directory) {
    if (directory[0] !== '.') {
      installedDependencies[directory] = JSON.parse(
        fs.readFileSync(`./node_modules/${directory}/package.json`)
      ).version
    }
  })
  return installedDependencies
}

function checkRequiredDependencies (required, installed) {
  Object.keys(required).forEach(function (dependency) {
    if (installed[dependency]) {
      var requiredVersion = required[dependency]
      var installedVersion = installed[dependency]
      var isValidVersion = semver.satisfies(
        installedVersion, requiredVersion
      )
      if (isValidVersion || requiredVersion.indexOf('git') >= 0) {
        delete required[dependency]
        delete installed[dependency]
      } else {
        throw new InvalidDependencyError(
          dependency, requiredVersion, installedVersion
        )
      }
    }
  })
}

function getRequiredDependencies (packageInfo) {
  var dependencies = packageInfo.dependencies
  var devDependencies = {}
  if (['development', 'test'].indexOf(process.env.NODE_ENV) >= 0) {
    devDependencies = packageInfo.devDependencies
  }
  return merge(
    {}, dependencies, devDependencies
  )
}

module.exports = function checkModules (packageInfo, nodeModulesPath) {
  var installedDependencies = getInstalledDependencies(nodeModulesPath)
  var requiredDependencies = getRequiredDependencies(packageInfo)

  checkRequiredDependencies(requiredDependencies, installedDependencies)
  var missingDependencies = Object.keys(requiredDependencies)
  if (missingDependencies.length > 0) {
    throw new MissingDependenciesError(missingDependencies)
  }
  var unsavedDependencies = Object.keys(installedDependencies)
  if (unsavedDependencies.length > 0) {
    throw new UnsavedDependenciesError(unsavedDependencies)
  }
}
