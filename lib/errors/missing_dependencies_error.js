var util = require('util')

function MissingDependenciesError (dependencies) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  this.message = [
    'Required dependencies missing: ' + dependencies.join(', ') + '.',
    'Run \`npm install\`'
  ].join(' ')
}

util.inherits(MissingDependenciesError, Error)

MissingDependenciesError.prototype.name = MissingDependenciesError.name

module.exports = MissingDependenciesError
