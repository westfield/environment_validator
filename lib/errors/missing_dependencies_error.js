var util = require('util')

function MissingDependenciesError (dependencies) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  var term = dependencies.length > 1 ? 'dependencies' : 'dependency'

  this.message = [
    'Required ' + term + ' missing: ' + dependencies.join(', ') + '.',
    'Run \`npm install\`'
  ].join(' ')
}

util.inherits(MissingDependenciesError, Error)

MissingDependenciesError.prototype.name = MissingDependenciesError.name

module.exports = MissingDependenciesError
