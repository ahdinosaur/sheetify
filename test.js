const sheetify = require('./')
const test = require('tape')
const path = require('path')
const fs = require('fs')

test('basic prefixing', compare('./index.css', 'index-out.css'))

function compare (inputFile, expectedFile) {
  return function compareTest (t) {
    const expected = fs.readFileSync(
      path.join(__dirname, 'fixtures', expectedFile)
    , 'utf8')

    t.plan(1)

    const prefix = sheetify(inputFile, {
      basedir: path.join(__dirname, 'fixtures')
    }, function (err, actual) {
      if (err) return t.error(err, 'no error')

      t.equal(actual, expected, 'output is as expected')
    })
  }
}
