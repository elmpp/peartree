/**
 * This pulls together the plop generators
 *
 *  - plop docs - https://tinyurl.com/y2phrzsg
 */

const {directoryIndex} = require('./dist/directory-index')
const {initPackage} = require('./dist/init-package')
const {initSubpackage} = require('./dist/init-subpackage')
const {initOrg} = require('./dist/init-org')
const {initUpstreamable} = require('./dist/init-upstreamable')
const {equalHelper} = require('./dist/hbs-helpers/equal-helper')
const {matchHelper} = require('./dist/hbs-helpers/match-helper')
const ternaryHelper = require('handlebars-helper-ternary')
const _ = require('lodash')

module.exports = plop => {
  plop.setGenerator('directory-index', directoryIndex())
  plop.setGenerator('init-org', initOrg())
  plop.setGenerator('init-package', initPackage())
  plop.setGenerator('init-subpackage', initSubpackage())
  plop.setGenerator('init-upstreamable', initUpstreamable())

  plop.setHelper('ternary', ternaryHelper)
  plop.setHelper('equal', equalHelper)
  plop.setHelper('match', matchHelper)
  plop.setHelper('camelCaseBasename', str => _.camelCase((str.match(/^([^.]+)\..+$/) || str)[1]))
  plop.setHelper('basename', str => (str.match(/^([^.]+)\..+$/) || str)[1])
}
