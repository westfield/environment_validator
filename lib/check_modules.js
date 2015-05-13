var fs = require('fs')
var path = require('path')

var semver = require('semver')
var merge = require('merge')

var InvalidDependencyError = require('./invalid_dependency_error')
var MissingDependenciesError = require('./missing_dependencies_error')
var UnsavedDependenciesError = require('./unsaved_dependencies_error')

function isScopedDirectory (directory) {
  return directory[0] === '@'
}

function getScopedModuleDirectories (baseDirectory, scope) {
  return getModuleDirectories(path.join(baseDirectory, scope))
    .map(function (directory) {
      return path.join(scope, directory)
    })
}

function getModuleDirectories (baseDirectory) {
  var dirs = []
  fs.readdirSync(baseDirectory).forEach(function (directory) {
    if (isScopedDirectory(directory)) {
      dirs = dirs.concat(getScopedModuleDirectories(baseDirectory, directory))
    } else if (directory[0] !== '.') {
      dirs.push(directory)
    }
  })
  return dirs
}

function getModuleVersion (basePath, module) {
  return JSON.parse(
      fs.readFileSync(path.join(basePath, module, 'package.json'))
  ).version
}

function getInstalledDependencies (nodeModulesPath) {
  var installedDependencies = {}
  getModuleDirectories(nodeModulesPath).forEach(function (directory) {
    installedDependencies[directory] = getModuleVersion(
      nodeModulesPath, directory
    )
  })
  return installedDependencies
}

function isGitDependency (version) {
  return version.indexOf('git') >= 0
}

function isLocalDependency (version) {
  return version.trim()[0] === '.'
}

function versionsMatch (installedVersion, requiredVersion) {
  var isValidVersion = semver.satisfies(
    installedVersion, requiredVersion
  )
  return isValidVersion || isGitDependency(requiredVersion) ||
    isLocalDependency(requiredVersion)
}

function removeDependenciesPresent (required, installed) {
  Object.keys(required).forEach(function (dependency) {
    if (installed[dependency]) {
      var requiredVersion = required[dependency]
      var installedVersion = installed[dependency]
      if (versionsMatch(installedVersion, requiredVersion)) {
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

  removeDependenciesPresent(requiredDependencies, installedDependencies)

  var missingDependencies = Object.keys(requiredDependencies)
  if (missingDependencies.length > 0) {
    throw new MissingDependenciesError(missingDependencies)
  }

  var unsavedDependencies = Object.keys(installedDependencies)
  if (unsavedDependencies.length > 0) {
    throw new UnsavedDependenciesError(unsavedDependencies)
  }
}
