import fs from 'node:fs';
import {Readable} from 'node:stream';
import test from 'ava';
import {readChunkSync} from 'read-chunk';
import isProgressive from './index.js';

const getPath = name => `fixture/${name}.jpg`;

test.serial('.buffer()', t => {
	t.true(isProgressive.buffer(readChunkSync(getPath('progressive'), {length: 65_535})));
	t.true(isProgressive.buffer(readChunkSync(getPath('curious-exif'), {length: 65_535})));
	t.false(isProgressive.buffer(readChunkSync(getPath('baseline'), {length: 65_535})));
	t.false(isProgressive.buffer(readChunkSync(getPath('kitten'), {length: 65_535})));
	t.true(isProgressive.buffer(readChunkSync(getPath('kitten-progressive'), {length: 65_535})));
});

test('.stream()', async t => {
	t.true(await isProgressive.stream(fs.createReadStream(getPath('progressive'))));
	t.true(await isProgressive.stream(fs.createReadStream(getPath('curious-exif'))));
	t.false(await isProgressive.stream(fs.createReadStream(getPath('baseline'))));
	t.false(await isProgressive.stream(fs.createReadStream(getPath('kitten'))));
	t.true(await isProgressive.stream(fs.createReadStream(getPath('kitten-progressive'))));
});

// Discovered in the tests for is-progressive-cli
test('.stream() - the whole file', async t => {
	t.true(await isProgressive.stream(Readable.from(fs.readFileSync(getPath('progressive')))));
	t.true(await isProgressive.stream(Readable.from(fs.readFileSync(getPath('curious-exif')))));
	t.false(await isProgressive.stream(Readable.from(fs.readFileSync(getPath('baseline')))));
	t.false(await isProgressive.stream(Readable.from(fs.readFileSync(getPath('kitten')))));
	t.true(await isProgressive.stream(Readable.from(fs.readFileSync(getPath('kitten-progressive')))));
});

test('.file()', async t => {
	t.true(await isProgressive.file(getPath('progressive')));
	t.true(await isProgressive.file(getPath('curious-exif')));
	t.false(await isProgressive.file(getPath('baseline')));
	t.false(await isProgressive.file(getPath('kitten')));
	t.true(await isProgressive.file(getPath('kitten-progressive')));
});

test.serial('.fileSync()', t => {
	t.true(isProgressive.fileSync(getPath('progressive')));
	t.true(isProgressive.fileSync(getPath('curious-exif')));
	t.false(isProgressive.fileSync(getPath('baseline')));
	t.false(isProgressive.fileSync(getPath('kitten')));
	t.true(isProgressive.fileSync(getPath('kitten-progressive')));
});
