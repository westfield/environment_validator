var util = require('util')

function InvalidEngineVersionError (engine, requiredVersion, installedVersion) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  this.message = [
    engine + ' does not have the correct version installed.',
    'Required version: ' + requiredVersion,
    'installed version: ' + installedVersion
  ].join(' ')
}

util.inherits(InvalidEngineVersionError, Error)

InvalidEngineVersionError.prototype.name = InvalidEngineVersionError.name

module.exports = InvalidEngineVersionError
