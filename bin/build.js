// --------------------
// co-use module
// build script
// --------------------

// modules
var pathModule = require('path'),
    childProcess = require('child_process'),
    fs = require('fs-extra-promise'),
    _ = require('lodash'),
    Promise = require('bluebird'), // jshint ignore:line
    npmApi = require('npm-web-api');

// promisified functions
var npmLatest = Promise.promisify(npmApi.getLatest),
    childProcessExec = Promise.promisify(childProcess.exec);

//npmLatest = function() { return Promise.resolve({version:'4.6.0'}); }; //xxx remove this

var coVersion, coPath, srcPath, testPath;

// get latest release number of co
npmLatest('co').then(function(package) {
    coVersion = package.version;
    console.log('co version:', coVersion);

    // empty test directory
    testPath = pathModule.join(__dirname, '../test');
    return fs.emptyDirAsync(testPath);
}).then(function() {
    // download co
    var cmd = 'cd ./test; curl -L https://api.github.com/repos/tj/co/tarball/' + coVersion + ' | tar xzf -';
    return childProcessExec(cmd);
}).then(function() {
    // find folder just downloaded
    return fs.readdirAsync(testPath);
}).then(function(files) {
    var filename = _.find(files, function(filename) {return filename.slice(0, 1) != '.';});

    // rename co folder
    coPath = pathModule.join(testPath, 'native');
    return fs.renameAsync(pathModule.join(testPath, filename), coPath);
}).then(function() {
    // duplicate co folder
    return fs.copyAsync(coPath, pathModule.join(testPath, 'withUse'));
}).then(function() {
    // read co code + wrapper
    srcPath = pathModule.join(__dirname, '../src');
    return Promise.props({
        co: fs.readFileAsync(pathModule.join(coPath, 'index.js'), 'utf8'),
        wrapper: fs.readFileAsync(pathModule.join(srcPath, 'wrapper.js'), 'utf8')
    });
}).then(function(txts) {
    // wrap co code in wrapper
    var txt = txts.wrapper.replace('/* insert coVersion */', coVersion).replace('/* insert coTxt */', txts.co);

    // save wrapped file
    return fs.writeFileAsync(pathModule.join(__dirname, '../lib/index.js'), txt);
}).then(function() {
    // read README
    return fs.readFileAsync(pathModule.join(srcPath, 'README.md'), 'utf8');
}).then(function(txt) {
    // insert co version into README
    txt = txt.replace(' --insert coVersion--', coVersion);

    // write README
    return fs.writeFileAsync(pathModule.join(__dirname, '../README.md'), txt);
}).then(function() {
    // copy test files
    return Promise.all([
        fs.copyAsync(pathModule.join(srcPath, 'test/coUse.test.js'), pathModule.join(testPath, 'coUse.test.js')),
        fs.copyAsync(pathModule.join(srcPath, 'test/native/index.js'), pathModule.join(testPath, 'native/index.js')),
        fs.copyAsync(pathModule.join(srcPath, 'test/withUse/index.js'), pathModule.join(testPath, 'withUse/index.js'))
    ]);
}).then(function() {
    // read co's tests
    return fs.readdirAsync(pathModule.join(coPath, 'test'));
}).then(function(files) {
    var requireTxtNative = '', requireTxtWithUse = '';

    return Promise.all(files.map(function(filename) {
        if (filename.slice(-3) != '.js') return;

        // add to testTxt
        requireTxtNative += "require('./native/test/" + filename + "')\n";
        requireTxtWithUse += "require('./withUse/test/" + filename + "')\n";

        // read test file
        return fs.readFileAsync(pathModule.join(coPath, 'test', filename), 'utf8')
        .then(function(txt) {
            // add Bluebird reference to withUse tests
            txt = "var Promise = require('bluebird');\n" + txt;
            return fs.writeFileAsync(pathModule.join(testPath, 'withUse/test', filename), txt);
        });
    }))
    .then(function() {
        return Promise.all([
            fs.readFileAsync(pathModule.join(srcPath, 'test/native.test.js'), 'utf8').then(function(txt) {
                txt = txt.replace('/* insert requires */', requireTxtNative);
                return fs.writeFileAsync(pathModule.join(testPath, 'native.test.js'), txt);
            }),
            fs.readFileAsync(pathModule.join(srcPath, 'test/withUse.test.js'), 'utf8').then(function(txt) {
                txt = txt.replace('/* insert requires */', requireTxtWithUse);
                return fs.writeFileAsync(pathModule.join(testPath, 'withUse.test.js'), txt);
            })
        ]);
    });
}).then(function() {
    console.log('Build complete');
}).done();
