'use strict';
var fs = require('fs');
var path = require('path');
var test = require('ava');
var readChunk = require('read-chunk');
var isProgressive = require('./');

function getPath(name) {
	return path.join(__dirname, 'fixture', name + '.jpg');
}

test('.buffer()', function (t) {
	t.assert(isProgressive.buffer(readChunk.sync(getPath('progressive'), 0, 65535)));
	t.assert(!isProgressive.buffer(readChunk.sync(getPath('baseline'), 0, 65535)));
	t.end();
});

test('.stream()', function (t) {
	t.plan(2);

	fs.createReadStream(getPath('progressive')).pipe(isProgressive.stream(function (progressive) {
		t.assert(progressive);
	}));

	fs.createReadStream(getPath('baseline')).pipe(isProgressive.stream(function (progressive) {
		t.assert(!progressive);
	}));
});

test('.file()', function (t) {
	t.plan(2);

	isProgressive.file(getPath('progressive'), function (err, progressive) {
		t.assert(!err, err);
		t.assert(progressive);
	});

	isProgressive.file(getPath('baseline'), function (err, progressive) {
		t.assert(!err, err);
		t.assert(!progressive);
	});
});

test('.fileSync', function (t) {
	t.assert(isProgressive.fileSync(getPath('progressive')));
	t.assert(!isProgressive.fileSync(getPath('baseline')));
	t.end();
});
