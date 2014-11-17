/**
 * Module dependencies.
 */

var resolve = require('style-resolve')
var styledeps = require('style-deps')
var xtend = require('xtend')

/**
 * Expose `Sheetify`.
 */

module.exports = Sheetify

/**
 * Core modules. Sheetify has none for the moment.
 */

var core = {}

/**
 * Prototype.
 */

var sheetify = Sheetify.prototype;

/**
 * Sheetify.
 *
 * @param {String[]} entry
 * @return {Self}
 * @api public
 */

function Sheetify(entry) {
  if (!(this instanceof Sheetify)) return new Sheetify(entry)
  if (Array.isArray(entry) && entry.length > 1) throw new Error(
    'Support for more than one entry css file ' +
    'is not currently available.'
  )

  this.transforms = []

  this.entry = Array.isArray(entry)
    ? entry[0]
    : entry

  return this
}

/**
 * Transform.
 *
 * @param {Function} transform
 * @return {Self}
 * @api public
 */

sheetify.transform = function(transform) {
  this.transforms.push(transform)
  return this
}

/**
 * Bundle.
 *
 * @param {Object} opts
 * @param {Function} done
 * @api public
 */

sheetify.bundle = function(opts, done) {
  if (typeof opts === 'function') {
    done = opts
    opts = {}
  }

  return styledeps(this.entry, xtend(opts || {}, {
      transforms: this.transforms
    , modifiers: this.modifiers
  }), done)
}
