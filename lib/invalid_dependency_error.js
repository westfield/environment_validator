var util = require('util')

function InvalidDependencyError (dependency, requiredVersion, installedVersion) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  this.message = [
    `${dependency} does not have the correct version installed.`,
    `Required version: ${requiredVersion}`,
    `installed version: ${installedVersion}`
  ].join(' ')
}

util.inherits(InvalidDependencyError, Error)

InvalidDependencyError.prototype.name = InvalidDependencyError.name

module.exports = InvalidDependencyError
