// --------------------
// co-use module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Bluebird = require('bluebird'),
	co = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

describe('co-use', function() {
	it('has `.use()` method', function() {
		expect(co).to.be.ok;
		expect(co.use).to.be.ok;
	});

	it('without calling `.use()` returns native Promise', function() {
		var promise = co(function() {});
		expect(promise).to.be.instanceof(Promise);
	});

	it('when calling `.use()` returns provided Promise', function() {
		var thisCo = co.use(Bluebird);

		var promise = thisCo(function() {});
		expect(promise).to.be.instanceof(Bluebird);
	});
});
