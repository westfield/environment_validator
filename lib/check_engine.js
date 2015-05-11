var execSync = require('child_process').execSync

var semver = require('semver')

var UnknownEngineError = require('./unknown_engine_error')
var InvalidEngineError = require('./invalid_engine_error')
var InvalidEngineVersionError = require('./invalid_engine_version_error')

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
