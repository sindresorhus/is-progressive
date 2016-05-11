'use strict';
const fs = require('fs');
const readChunk = require('read-chunk');

// http://en.wikipedia.org/wiki/JPEG
// SOF2 [0xFF, 0xC2] = Start Of Frame (Progressive DCT)
const SOF2 = 0xc2;

const search = buf => {
	let prevByte;

	for (const currByte of buf) {
		if (prevByte !== 0xff) {
			prevByte = currByte;
			continue;
		}

		if (currByte === SOF2) {
			return true;
		}

		prevByte = currByte;
	}

	return false;
};

exports.buffer = search;

exports.stream = stream => new Promise((resolve, reject) => {
	let prevLastByte = new Buffer(1);

	const end = () => {
		resolve(false);
	};

	stream.on('data', data => {
		prevLastByte = new Buffer(data[data.length - 1]);

		if (search(Buffer.concat([prevLastByte, data]))) {
			resolve(true);
			stream.removeListener('end', end);
		}
	});

	stream.on('error', reject);
	stream.on('end', end);
});

// the metadata section has a maximum size of 65535 bytes
exports.file = filepath => readChunk(filepath, 0, 65535).then(search);

exports.fileSync = filepath => {
	// we read one byte at the time here as it usually appears
	// early in the file and reading 65535 would be wasteful
	const BUF_LENGTH = 1;
	const buf = new Buffer(BUF_LENGTH);
	const read = fs.openSync(filepath, 'r');
	let bytesRead = BUF_LENGTH;
	let currByte;
	let prevByte;
	let isProgressive = false;

	while (bytesRead === BUF_LENGTH) {
		bytesRead = fs.readSync(read, buf, 0, 1);
		currByte = buf[0];

		if (prevByte === 0xff && currByte === SOF2) {
			isProgressive = true;
			break;
		}

		prevByte = currByte;
	}

	fs.closeSync(read);

	return isProgressive;
};
