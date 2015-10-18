const sheetify = require('./')
const test = require('tape')
const path = require('path')
const fs = require('fs')

test('basic prefixing', function (t) {
  const expected = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'index-out.css')
  , 'utf8')

  t.plan(1)

  const prefix = sheetify('./index.css', {
    basedir: path.join(__dirname, 'fixtures')
  }, function (err, actual) {
    if (err) return t.error(err, 'no error')

    t.equal(actual, expected, 'output is as expected')
  })
})

test('transform source', function (t) {
  const expected = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'transform-out.css')
  , 'utf8')

  t.plan(1)

  const prefix = sheetify('./transform.css', {
    basedir: path.join(__dirname, 'fixtures'),
    use: [
      'sheetify-cssnext'
    ]
  }, function (err, actual) {
    if (err) return t.error(err, 'no error')

    t.equal(actual, expected, 'output is as expected')
  })
})
