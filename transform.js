const staticEval = require('static-eval')
const escodegen = require('escodegen')
const astw = require('astw-babylon')
const through = require('through2')
const babylon = require('babylon')
const sleuth = require('sleuth')
const sheetify = require('./')
const path = require('path')

module.exports = transform

function transform (filename, options) {
  const buffer = []

  return through(write, flush)

  function write (chunk, _, next) {
    buffer.push(chunk)
    next()
  }

  function flush () {
    const stream = this
    const src = buffer.join('')
    const ast = babylon.parse(src, {
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowHashBang: true,
      ecmaVersion: 6,
      strictMode: false,
      sourceType: 'module',
      features: {},
      plugins: {
        jsx: true,
        flow: true
      }
    })

    const requiredStyles = []
    const requires = sleuth(ast.program)
    const walk = astw(ast)
    const context = {
      __dirname: path.dirname(filename),
      __filename: filename
    }

    Object.keys(requires).filter(function (key) {
      return requires[key] === 'sheetify'
    }).forEach(function (varname) {
      walk(function (node) {
        if (node.name !== varname) return
        if (node.type !== 'Identifier') return
        if (node.parent.type !== 'CallExpression') return

        const args = node.parent.arguments.map(function (node) {
          return staticEval(node, context)
        })

        const sourceFile = args[0]
        const opts = typeof args[1] === 'object'
          ? args[1]
          : {}

        opts.basedir = opts.basedir || path.dirname(filename)

        sheetify(sourceFile, opts, function (err, style, uuid) {
          if (err) return stream.emit('error', err)

          const parent = node.parent

          parent.type = 'Literal'
          parent.value = uuid
          parent.raw = JSON.stringify(parent.value)
          delete parent.arguments
          delete parent.name

          console.error(escodegen.generate(ast.program))
        })
      })
    })
  }
}
