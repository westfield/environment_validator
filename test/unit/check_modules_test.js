/* global describe, it */

var path = require('path')

var expect = require('chai').expect
var checkModules = require('../../lib/check_modules')

describe('Checking modules', function () {
  var fixture_path = path.resolve(__dirname, '..', 'fixtures')

  describe('when they are valid', function () {
    it('does not throw an exception', function () {
      var packageInfo = require('../fixtures/valid_dependencies/package.json')
      checkModules(
        packageInfo,
        path.resolve(fixture_path, 'valid_dependencies', 'node_modules')
      )
    })
  })

  describe('when dependencies are missing', function () {
    it('throws an exception', function () {
      var packageInfo = require('../fixtures/missing_dependencies/package.json')
      var error
      try {
        checkModules(
          packageInfo,
          path.resolve(fixture_path, 'valid_dependencies', 'node_modules')
        )
      } catch(e) {
        error = e
      }
      expect(error).not.to.be.null
      expect(error.name).to.eql('MissingDependenciesError')
      expect(error.message).to.eql(
        'Required dependencies missing: module_a, module_b. Run `npm install`'
      )
    })
  })

  describe('when dependencies are unsaved', function () {
    it('throws an exception', function () {
      var packageInfo = require('../fixtures/unsaved_dependencies/package.json')
      var error
      try {
        checkModules(
          packageInfo,
          path.resolve(fixture_path, 'unsaved_dependencies', 'node_modules')
        )
      } catch(e) {
        error = e
      }
      expect(error).not.to.be.null
      expect(error.name).to.eql('UnsavedDependenciesError')
      expect(error.message).to.eql(
        'Unsaved dependencies installed: unsaved_module_a, unsaved_module_b. Run `npm prune` to remove them or add them to your package.json'
      )
    })
  })

  describe('when modules have been deduped', function () {
    describe('dependencies are valid', function () {
      it('does not throw an exception', function () {
        var packageInfo = require('../fixtures/valid_flattened_dependencies/package.json')
        checkModules(
          packageInfo,
          path.resolve(fixture_path, 'valid_flattened_dependencies', 'node_modules')
        )
      })
    })
  })
})
