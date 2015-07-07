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
	t.assert(isProgressive.buffer(readChunk.sync(getPath('curious-exif'), 0, 65535)));
	t.assert(!isProgressive.buffer(readChunk.sync(getPath('baseline'), 0, 65535)));
	t.end();
});

test('.stream()', function (t) {
	t.plan(3);

	fs.createReadStream(getPath('progressive')).pipe(isProgressive.stream(function (progressive) {
		t.assert(progressive);
	}));

	fs.createReadStream(getPath('curious-exif')).pipe(isProgressive.stream(function (progressive) {
		t.assert(progressive);
	}));

	fs.createReadStream(getPath('baseline')).pipe(isProgressive.stream(function (progressive) {
		t.assert(!progressive);
	}));
});

test('.file()', function (t) {
	t.plan(6);

	isProgressive.file(getPath('progressive'), function (err, progressive) {
		t.assert(!err, err);
		t.assert(progressive);
	});

	isProgressive.file(getPath('curious-exif'), function (err, progressive) {
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
	t.assert(isProgressive.fileSync(getPath('curious-exif')));
	t.assert(!isProgressive.fileSync(getPath('baseline')));
	t.end();
});
