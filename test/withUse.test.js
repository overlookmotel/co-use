/* jshint expr: true */
/* global describe */

// shim mz/fs.readFile()
var pathModule = require('path'),
    mz = require('mz/fs'),
    readFile = mz.readFile;

if (!readFile.shimmed) {
    mz.readFile = function(filename, encoding) {
        return readFile(pathModule.join(__dirname, 'native', filename), encoding);
    };
    mz.readFile.shimmed = true;
}

// run co tests

describe('With use(bluebird)', function() {
    require('./withUse/test/arguments.js')
require('./withUse/test/arrays.js')
require('./withUse/test/context.js')
require('./withUse/test/generator-functions.js')
require('./withUse/test/generators.js')
require('./withUse/test/invalid.js')
require('./withUse/test/objects.js')
require('./withUse/test/promises.js')
require('./withUse/test/recursion.js')
require('./withUse/test/thunks.js')
require('./withUse/test/wrap.js')

});
