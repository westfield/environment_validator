var util = require('util')

function UnsavedDependenciesError (dependencies) {
  // Super constructor
  Error.call(this)

  // Super helper method to include stack trace in error object
  Error.captureStackTrace(this, this.constructor)

  var term = dependencies.length > 1 ? 'dependencies' : 'dependency'

  this.message = [
    'Unsaved ' + term + ' installed: ' + dependencies.join(', ') + '.',
    'Run \`npm prune\` to remove them or add them to your package.json'
  ].join(' ')
}

util.inherits(UnsavedDependenciesError, Error)

UnsavedDependenciesError.prototype.name = UnsavedDependenciesError.name

module.exports = UnsavedDependenciesError
