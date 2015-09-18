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

describe('Without use()', function() {
    require('./native/test/arguments.js')
require('./native/test/arrays.js')
require('./native/test/context.js')
require('./native/test/generator-functions.js')
require('./native/test/generators.js')
require('./native/test/invalid.js')
require('./native/test/objects.js')
require('./native/test/promises.js')
require('./native/test/recursion.js')
require('./native/test/thunks.js')
require('./native/test/wrap.js')

});
