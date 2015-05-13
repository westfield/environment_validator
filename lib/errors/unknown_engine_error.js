var util = require('util')

function UnknownEngineError () {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  this.message = 'Unable to determine nodejs engine. Please report this bug'
}

util.inherits(UnknownEngineError, Error)

UnknownEngineError.prototype.name = UnknownEngineError.name

module.exports = UnknownEngineError
