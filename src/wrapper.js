// --------------------
// co-use module
// current build based on co version /* insert coVersion */
// --------------------

var P;
try {
    P = Promise;
} catch (err) {}

module.exports = coUse(P);

// wrapper for co
function coUse(Promise) { // jshint ignore:line
    var module = {};

    // --------------------
    // code from co starts
    // --------------------

/* insert coTxt */

    // --------------------
    // code from co ends
    // --------------------

    // add .use() method
    module.exports.use = coUse;

    // return co
    return module.exports;
}
