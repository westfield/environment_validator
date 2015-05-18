var util = require('util')

function InvalidEngineError (currentEngine, specifiedEngines) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  if (specifiedEngines && Object.keys(specifiedEngines).length > 0) {
    this.message = [
      'Current engine: ' + currentEngine + ' is not specified in',
      'package.json. Specified engines are:',
      Object.keys(specifiedEngines).join(', ')
    ].join(' ')
  } else {
    this.message = [
      'No engines specified. Please add an engine to your package.json'
    ].join(' ')
  }
}

util.inherits(InvalidEngineError, Error)

InvalidEngineError.prototype.name = InvalidEngineError.name

module.exports = InvalidEngineError
