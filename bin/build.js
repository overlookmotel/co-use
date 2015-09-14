// --------------------
// co-use module
// build script
// --------------------

// modules
var pathModule = require('path'),
    fs = require('fs');

// read co
var coPath = require.resolve('co'),
    coTxt = fs.readFileSync(coPath, 'utf8');

// read co version
var coPackagePath = pathModule.join(coPath, '../package.json'),
    coVersion = require(coPackagePath).version;

// read wrapper
var wrapperPath = pathModule.join(__dirname, '../src/wrapper.js'),
    wrapperTxt = fs.readFileSync(wrapperPath, 'utf8');

// insert coVersion and coTxt into wrapper
wrapperTxt = wrapperTxt.replace('/* insert coVersion */', coVersion).replace('/* insert coTxt */', coTxt);

// save built file
var buildFilePath = pathModule.join(__dirname, '../lib/index.js');
fs.writeFileSync(buildFilePath, wrapperTxt);

// done
console.log('Build complete');

//console.log('wrapperPath:', wrapperPath);
//console.log('coPath:', coPath);
//console.log('coTxt:', coTxt);
