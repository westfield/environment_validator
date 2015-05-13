var path = require('path')

var expect = require('chai').expect
var checkModules = require('../../lib/check_modules')

describe('Checking modules', function () {
  describe('when they are valid', function () {
    it('does not throw an exception', function () {
      var packageInfo = require('../fixtures/valid_dependencies/package.json')
      // console.log()
      checkModules(
        packageInfo,
        path.resolve(__dirname, '..', 'fixtures', 'valid_dependencies', 'node_modules')
      )
    })
  })
})
