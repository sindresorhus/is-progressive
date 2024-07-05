import fs from 'node:fs';
import {readChunk} from 'read-chunk';
import {indexOf} from 'uint8array-extras';

// https://en.wikipedia.org/wiki/JPEG
// SOF2 [0xFF, 0xC2] = Start Of Frame (Progressive DCT)
const SOF2 = new Uint8Array([0xFF, 0xC2]);
const MAX_BUFFER = 65_536;

const fromBuffer = buffer => indexOf(buffer, SOF2) !== -1;

const isProgressive = {};

isProgressive.buffer = fromBuffer;

isProgressive.stream = readableStream => new Promise((resolve, reject) => {
	// The first byte is for the previous last byte if we have multiple data events.
	const buffer = new Uint8Array(1 + MAX_BUFFER);
	let bytesRead = 0;

	function end() {
		resolve(false);
	}

	function cleanup(value) {
		resolve(value);
		readableStream.removeListener('data', onData);
		readableStream.removeListener('end', end);
		readableStream.removeListener('error', reject);
	}

	function onData(data) {
		if (bytesRead >= MAX_BUFFER) {
			return cleanup(false);
		}

		buffer.set(data.subarray(0, MAX_BUFFER), 1);

		if (fromBuffer(buffer)) {
			return cleanup(true);
		}

		bytesRead += data.byteLength;
		buffer.set(data.at(-1));
	}

	readableStream.on('data', onData);
	readableStream.on('end', end);
	readableStream.on('error', reject);
});

// The metadata section has a maximum size of 65536 bytes
isProgressive.file = async filePath => fromBuffer(await readChunk(filePath, {length: MAX_BUFFER}));

isProgressive.fileSync = filepath => {
	// We read two bytes at a time here as it usually appears early in the file and reading 65536 would be wasteful
	const BUFFER_LENGTH = 2;
	const buffer = new Uint8Array(1 + BUFFER_LENGTH);
	const read = fs.openSync(filepath, 'r');
	let bytesRead = BUFFER_LENGTH;
	let isProgressive = false;
	let position = 0;

	while (bytesRead !== 0 && position < MAX_BUFFER) {
		bytesRead = fs.readSync(read, buffer, 1, BUFFER_LENGTH, position);

		isProgressive = fromBuffer(buffer);

		if (isProgressive) {
			break;
		}

		position += bytesRead;
		buffer.set(buffer.at(-1), 0);
	}

	fs.closeSync(read);

	return isProgressive;
};

export default isProgressive;
