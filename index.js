'use strict';
const fs = require('fs');
const readChunk = require('read-chunk');

// http://en.wikipedia.org/wiki/JPEG
// SOF2 [0xFF, 0xC2] = Start Of Frame (Progressive DCT)
const SOF2 = 0xC2;

const search = buffer => {
	let previousByte;

	for (const currentByte of buffer) {
		if (previousByte !== 0xFF) {
			previousByte = currentByte;
			continue;
		}

		if (currentByte === SOF2) {
			return true;
		}

		previousByte = currentByte;
	}

	return false;
};

exports.buffer = search;

exports.stream = stream => new Promise((resolve, reject) => {
	let previousLastByte = Buffer.alloc(1);

	const end = () => {
		resolve(false);
	};

	stream.on('data', data => {
		previousLastByte = Buffer.of(data[data.length - 1]);

		if (search(Buffer.concat([previousLastByte, data]))) {
			resolve(true);
			stream.removeListener('end', end);
		}
	});

	stream.on('error', reject);
	stream.on('end', end);
});

// The metadata section has a maximum size of 65535 bytes
exports.file = async filePath => search(await readChunk(filePath, 0, 65535));

exports.fileSync = filepath => {
	// We read one byte at the time here as it usually appears early in the file and reading 65535 would be wasteful
	const BUFFER_LENGTH = 1;
	const buffer = Buffer.alloc(BUFFER_LENGTH);
	const read = fs.openSync(filepath, 'r');
	let bytesRead = BUFFER_LENGTH;
	let currentByte;
	let previousByte;
	let isProgressive = false;

	while (bytesRead === BUFFER_LENGTH) {
		bytesRead = fs.readSync(read, buffer, 0, 1);
		currentByte = buffer[0];

		if (previousByte === 0xFF && currentByte === SOF2) {
			isProgressive = true;
			break;
		}

		previousByte = currentByte;
	}

	fs.closeSync(read);

	return isProgressive;
};
