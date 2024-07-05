import fs from 'node:fs';
import {readChunk} from 'read-chunk';
import {indexOf} from 'uint8array-extras';

// https://en.wikipedia.org/wiki/JPEG
// SOF2 [0xFF, 0xC2] = Start Of Frame (Progressive DCT)
const SOF2 = new Uint8Array([0xFF, 0xC2]);

const fromBuffer = buffer => indexOf(buffer, SOF2) !== -1;

const isProgressive = {};

isProgressive.buffer = fromBuffer;

isProgressive.stream = readableStream => new Promise((resolve, reject) => {
	// The first byte is for the previous last byte if we have multiple data events.
	const buffer = new Uint8Array(1 + readableStream.readableHighWaterMark);

	const end = () => {
		resolve(false);
	};

	readableStream.on('data', data => {
		buffer.set(data, 1);

		if (fromBuffer(buffer)) {
			resolve(true);
			readableStream.removeListener('end', end);
		}

		buffer.set(data.at(-1));
	});

	readableStream.on('error', reject);
	readableStream.on('end', end);
});

// The metadata section has a maximum size of 65535 bytes
isProgressive.file = async filePath => fromBuffer(await readChunk(filePath, {length: 65_535}));

isProgressive.fileSync = filepath => {
	// We read two bytes at a time here as it usually appears early in the file and reading 65535 would be wasteful
	const BUFFER_LENGTH = 2;
	const buffer = new Uint8Array(1 + BUFFER_LENGTH);
	const read = fs.openSync(filepath, 'r');
	let bytesRead = BUFFER_LENGTH;
	let isProgressive = false;

	while (bytesRead !== 0) {
		bytesRead = fs.readSync(read, buffer, 1, BUFFER_LENGTH);

		isProgressive = fromBuffer(buffer);

		if (isProgressive) {
			break;
		}

		buffer.set(buffer.at(-1), 0);
	}

	fs.closeSync(read);

	return isProgressive;
};

export default isProgressive;
