// --------------------
// co-use module
// current build based on co version /* insert coVersion */
// --------------------

module.exports = coUse(Promise);

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
