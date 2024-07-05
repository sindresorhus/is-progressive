import fs from 'node:fs';
import test from 'ava';
import {readChunkSync} from 'read-chunk';
import isProgressive from './index.js';

const getPath = name => `fixture/${name}.jpg`;

test.serial('.buffer()', t => {
	t.true(isProgressive.buffer(readChunkSync(getPath('progressive'), {length: 65_535})));
	t.true(isProgressive.buffer(readChunkSync(getPath('curious-exif'), {length: 65_535})));
	t.false(isProgressive.buffer(readChunkSync(getPath('baseline'), {length: 65_535})));
	t.false(isProgressive.buffer(readChunkSync(getPath('catmodel'), {length: 65_535})));
	t.true(isProgressive.buffer(readChunkSync(getPath('catmodel-progressive'), {length: 65_535})));
});

test('.stream()', async t => {
	t.true(await isProgressive.stream(fs.createReadStream(getPath('progressive'))));
	t.true(await isProgressive.stream(fs.createReadStream(getPath('curious-exif'))));
	t.false(await isProgressive.stream(fs.createReadStream(getPath('baseline'))));
	t.false(await isProgressive.stream(fs.createReadStream(getPath('catmodel'))));
	t.true(await isProgressive.stream(fs.createReadStream(getPath('catmodel-progressive'))));
});

test('.file()', async t => {
	t.true(await isProgressive.file(getPath('progressive')));
	t.true(await isProgressive.file(getPath('curious-exif')));
	t.false(await isProgressive.file(getPath('baseline')));
	t.false(await isProgressive.file(getPath('catmodel')));
	t.true(await isProgressive.file(getPath('catmodel-progressive')));
});

test.serial('.fileSync()', t => {
	t.true(isProgressive.fileSync(getPath('progressive')));
	t.true(isProgressive.fileSync(getPath('curious-exif')));
	t.false(isProgressive.fileSync(getPath('baseline')));
	t.false(isProgressive.fileSync(getPath('catmodel')));
	t.true(isProgressive.fileSync(getPath('catmodel-progressive')));
});
