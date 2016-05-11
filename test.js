import fs from 'fs';
import path from 'path';
import test from 'ava';
import readChunk from 'read-chunk';
import m from './';

const getPath = name => path.join(__dirname, `fixture/${name}.jpg`);

test('.buffer()', t => {
	t.true(m.buffer(readChunk.sync(getPath('progressive'), 0, 65535)));
	t.true(m.buffer(readChunk.sync(getPath('curious-exif'), 0, 65535)));
	t.false(m.buffer(readChunk.sync(getPath('baseline'), 0, 65535)));
});

test('.stream()', async t => {
	t.true(await m.stream(fs.createReadStream(getPath('progressive'))));
	t.true(await m.stream(fs.createReadStream(getPath('curious-exif'))));
	t.false(await m.stream(fs.createReadStream(getPath('baseline'))));
});

test('.file()', async t => {
	t.true(await m.file(getPath('progressive')));
	t.true(await m.file(getPath('curious-exif')));
	t.false(await m.file(getPath('baseline')));
});

test('.fileSync()', t => {
	t.true(m.fileSync(getPath('progressive')));
	t.true(m.fileSync(getPath('curious-exif')));
	t.false(m.fileSync(getPath('baseline')));
});
