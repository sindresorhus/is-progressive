import fs from 'fs';
import path from 'path';
import test from 'ava';
import readChunk from 'read-chunk';
import isProgressive from '.';

const getPath = name => path.join(__dirname, `fixture/${name}.jpg`);

test('.buffer()', t => {
	t.true(isProgressive.buffer(readChunk.sync(getPath('progressive'), 0, 65535)));
	t.true(isProgressive.buffer(readChunk.sync(getPath('curious-exif'), 0, 65535)));
	t.false(isProgressive.buffer(readChunk.sync(getPath('baseline'), 0, 65535)));
});

test('.stream()', async t => {
	t.true(await isProgressive.stream(fs.createReadStream(getPath('progressive'))));
	t.true(await isProgressive.stream(fs.createReadStream(getPath('curious-exif'))));
	t.false(await isProgressive.stream(fs.createReadStream(getPath('baseline'))));
});

test('.file()', async t => {
	t.true(await isProgressive.file(getPath('progressive')));
	t.true(await isProgressive.file(getPath('curious-exif')));
	t.false(await isProgressive.file(getPath('baseline')));
});

test('.fileSync()', t => {
	t.true(isProgressive.fileSync(getPath('progressive')));
	t.true(isProgressive.fileSync(getPath('curious-exif')));
	t.false(isProgressive.fileSync(getPath('baseline')));
});
