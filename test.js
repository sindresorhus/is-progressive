import fs from 'fs';
import path from 'path';
import test from 'ava';
import readChunk from 'read-chunk';
import fn from './';

function getPath(name) {
	return path.join(__dirname, 'fixture', `${name}.jpg`);
}

test('.buffer()', t => {
	t.assert(fn.buffer(readChunk.sync(getPath('progressive'), 0, 65535)));
	t.assert(fn.buffer(readChunk.sync(getPath('curious-exif'), 0, 65535)));
	t.assert(!fn.buffer(readChunk.sync(getPath('baseline'), 0, 65535)));
});

test.cb('.stream() - progressive', t => {
	fs.createReadStream(getPath('progressive')).pipe(fn.stream(progressive => {
		t.true(progressive);
		t.end();
	}));
});

test.cb('.stream() - curious-exif', t => {
	fs.createReadStream(getPath('curious-exif')).pipe(fn.stream(progressive => {
		t.true(progressive);
		t.end();
	}));
});

test.cb('.stream() - baseline', t => {
	fs.createReadStream(getPath('baseline')).pipe(fn.stream(progressive => {
		t.false(progressive);
		t.end();
	}));
});

test.cb('.file() - progressive', t => {
	fn.file(getPath('progressive'), (err, progressive) => {
		t.ifError(err);
		t.true(progressive);
		t.end();
	});
});

test.cb('.file() - curious-exif', t => {
	fn.file(getPath('curious-exif'), (err, progressive) => {
		t.ifError(err);
		t.true(progressive);
		t.end();
	});
});

test.cb('.file() - baseline', t => {
	fn.file(getPath('baseline'), (err, progressive) => {
		t.ifError(err);
		t.false(progressive);
		t.end();
	});
});

test('.fileSync()', t => {
	t.true(fn.fileSync(getPath('progressive')));
	t.true(fn.fileSync(getPath('curious-exif')));
	t.true(!fn.fileSync(getPath('baseline')));
});
