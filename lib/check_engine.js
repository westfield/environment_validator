var execSync = require('child_process').execSync

var semver = require('semver')

var errors = require('./errors')
var UnknownEngineError = errors.UnknownEngineError
var InvalidEngineError = errors.InvalidEngineError
var InvalidEngineVersionError = errors.InvalidEngineVersionError

var NODE = 'node'
var IOJS = 'iojs'

function getNodeHelpText () {
  return execSync('"' + process.execPath + '" -h', { encoding: 'ascii' })
}

function getEngine () {
  if (!execSync) {
    return NODE
  } else if (/iojs\.org/.test(getNodeHelpText())) {
    return IOJS
  } else {
    throw new UnknownEngineError()
  }
}

module.exports = function checkEngine (packageInfo) {
  var engine = getEngine()
  var requiredEngineVersion = packageInfo.engines[engine]
  var currentEngineVersion = process.versions.node
  if (!requiredEngineVersion) {
    throw new InvalidEngineError(engine, packageInfo.engines)
  }

  if (!semver.satisfies(currentEngineVersion, requiredEngineVersion)) {
    throw new InvalidEngineVersionError(
      engine, requiredEngineVersion, currentEngineVersion
    )
  }
}
