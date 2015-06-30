var fs = require('fs')
var path = require('path')

var semver = require('semver')
var merge = require('merge')

var errors = require('./errors')
var InvalidDependencyError = errors.InvalidDependencyError
var MissingDependenciesError = errors.MissingDependenciesError
var UnsavedDependenciesError = errors.UnsavedDependenciesError

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
  if (fs.existsSync(baseDirectory)) {
    fs.readdirSync(baseDirectory).forEach(function (directory) {
      if (isScopedDirectory(directory)) {
        dirs = dirs.concat(getScopedModuleDirectories(baseDirectory, directory))
      } else if (directory[0] !== '.') {
        dirs.push(directory)
      }
    })
  }
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
    installedDependencies[directory] = {
      version: getModuleVersion(nodeModulesPath, directory),
      required: false
    }
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

function markDependenciesPresent (required, installed, parentDependencies) {
  Object.keys(required).forEach(function (dependency) {
    var installedDependency = installed[dependency] || parentDependencies[dependency]
    var requiredDependency = required[dependency]
    if (installedDependency) {
      var requiredVersion = requiredDependency.version
      var installedVersion = installedDependency.version
      if (versionsMatch(installedVersion, requiredVersion)) {
        requiredDependency.present = true
        installedDependency.required = true
      } else {
        throw new InvalidDependencyError(
          dependency, requiredVersion, installedVersion
        )
      }
    }
  })
}

function getRequiredDependencies (packageInfo, includeDev) {
  var dependencies = packageInfo.dependencies
  var devDependencies = {}
  if (includeDev) {
    devDependencies = packageInfo.devDependencies
  }
  var combinedDependencies = merge(
    {}, dependencies, devDependencies
  )
  return Object.keys(combinedDependencies).reduce(function (result, dependencyName) {
    result[dependencyName] = {
      version: combinedDependencies[dependencyName],
      present: false
    }
    return result
  }, {})
}

module.exports = function checkModules (packageInfo, nodeModulesPath, includeDev, parentDependencies) {
  parentDependencies = parentDependencies || {}
  var installedDependencies = getInstalledDependencies(nodeModulesPath)
  var requiredDependencies = getRequiredDependencies(packageInfo, includeDev)

  markDependenciesPresent(requiredDependencies, installedDependencies, parentDependencies)

  var missingDependencies = Object.keys(requiredDependencies).filter(function (dependency) {
    return !requiredDependencies[dependency].present
  })
  if (missingDependencies.length > 0) {
    throw new MissingDependenciesError(missingDependencies, nodeModulesPath)
  }

  Object.keys(installedDependencies).forEach(function (dependency) {
    var dependencyPath = path.join(nodeModulesPath, dependency)
    var dependenciesPath = path.join(dependencyPath, 'node_modules')
    var currentModule = {}
    currentModule[packageInfo.name] = {
      version: packageInfo.version,
      present: true,
      required: false
    }
    checkModules(
      require(path.join(dependencyPath, 'package.json')),
      dependenciesPath,
      false,
      merge({}, parentDependencies, installedDependencies, currentModule)
    )
  })

  var unsavedDependencies = Object.keys(installedDependencies).filter(function (dependency) {
    return !installedDependencies[dependency].required
  })
  if (unsavedDependencies.length > 0) {
    throw new UnsavedDependenciesError(unsavedDependencies)
  }
}
