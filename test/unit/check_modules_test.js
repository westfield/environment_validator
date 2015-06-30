/* global describe, it, beforeEach */

var path = require('path')

var expect = require('chai').expect
var checkModules = require('../../lib/check_modules')

describe('Checking modules', function () {
  var fixturePath = path.resolve(__dirname, '..', 'fixtures')
  var fixtureName

  function basePath () {
    return path.join(fixturePath, fixtureName)
  }

  function packageInfo () {
    return require(path.join(basePath(), 'package.json'))
  }

  function dependencyPath () {
    return path.join(basePath(), 'node_modules')
  }

  function run () {
    return checkModules(packageInfo(), dependencyPath(), true)
  }

  beforeEach(function () {
    fixtureName = null
  })

  describe('when they are valid', function () {
    it('does not throw an exception', function () {
      fixtureName = 'valid_dependencies'
      run()
    })
  })

  describe('when dependencies are missing', function () {
    it('throws an exception', function () {
      fixtureName = 'missing_dependencies'
      var error
      try {
        run()
      } catch(e) {
        error = e
      }
      expect(error).not.to.be.null
      expect(error.name).to.eql('MissingDependenciesError')
      expect(error.message).to.eql(
        'Required dependencies missing: module_a, module_b at path: ' +
        basePath() +
        '/node_modules. Run `npm install`'
      )
    })
  })

  describe('when dependencies are unsaved', function () {
    it('throws an exception', function () {
      fixtureName = 'unsaved_dependencies'
      var error
      try {
        run()
      } catch(e) {
        error = e
      }
      expect(error).not.to.be.null
      expect(error.name).to.eql('UnsavedDependenciesError')
      expect(error.message).to.eql(
        'Unsaved dependencies installed: unsaved_module_a, ' +
        'unsaved_module_b. Run `npm prune` to remove them or add them to ' +
        'your package.json'
      )
    })
  })

  describe('circular dependencies', function () {
    describe('dependencies are valid', function () {
      it('does not throw an exception', function () {
        fixtureName = 'circular_dependencies'
        run()
      })
    })
  })

  describe('when modules have been deduped', function () {
    describe('dependencies are valid', function () {
      it('does not throw an exception', function () {
        fixtureName = 'valid_flattened_dependencies'
        run()
      })
    })

    describe('dependencies are invalid', function () {
      it('throws an exception', function () {
        fixtureName = 'invalid_flattened_dependencies'
        var error
        try {
          run()
        } catch(e) {
          error = e
        }
        expect(error).not.to.be.null
        expect(error.name).to.eql('MissingDependenciesError')
        expect(error.message).to.eql(
          'Required dependency missing: shared_module at path: ' +
          basePath() +
          '/node_modules/module_a/node_modules. Run `npm install`'
        )
      })
    })
  })
})
