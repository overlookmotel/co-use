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
    /* insert requires */
});
