'use strict';
var fs = require('fs');
var readChunk = require('read-chunk');
var through = require('through2');

// http://en.wikipedia.org/wiki/JPEG
// SOI  [0xFF, 0xD8] = Start Of Image
// SOF0 [0xFF, 0xC0] = Start Of Frame (Baseline DCT)
// SOF2 [0xFF, 0xC2] = Start Of Frame (Progressive DCT)
// SOS  [0xFF, 0xDA] = Start Of Scan
var SOF0 = 0xc0;
var SOF2 = 0xc2;
var SOS = 0xda;

function search(buf, reportEnd) {
	var currByte;
	var prevByte;

	for (var i = 0; i < buf.length; i++) {
		currByte = buf[i];
		prevByte = buf[i - 1];

		if (prevByte !== 0xff) {
			continue;
		}

		if (currByte === SOF0 || currByte === SOS) {
			// special case for the stream use-case of needing to know when it's done
			if (reportEnd) {
				return 2;
			}

			return false;
		}

		if (currByte === SOF2) {
			return true;
		}
	}

	return false;
}

exports.buffer = function (buf) {
	return search(buf);
};

exports.stream = function (cb) {
	var prevLastByte = new Buffer(1);
	var searchDone = false;

	return through(function (data, enc, cb2) {
		if (searchDone) {
			cb(null, data);
			return;
		}

		prevLastByte = new Buffer(data[data.length - 1]);

		var res = exports.buffer(Buffer.concat([prevLastByte, data]), true);

		if (res === 2) {
			searchDone = true;
			cb(false);
		}

		if (res === true) {
			searchDone = true;
			cb(true);
		}

		cb2(null, data);
	}, function (cb2) {
		if (!searchDone) {
			cb(false);
		}

		cb2();
	});
};

exports.file = function (filepath, cb) {
	// the metadata section has a maximum size of 65535 bytes
	readChunk(filepath, 0, 65535, function (err, buf) {
		if (err) {
			cb(err);
			return;
		}

		cb(null, exports.buffer(buf));
	});
};

exports.fileSync = function (filepath) {
	// we read one byte at the time here as it usually appears
	// early in the file and reading 65535 would be wasteful
	var currByte;
	var prevByte;
	var BUF_LENGTH = 1;
	var buf = new Buffer(BUF_LENGTH);
	var bytesRead = BUF_LENGTH;
	var read = fs.openSync(filepath, 'r');
	var isProgressive = false;

	while (bytesRead === BUF_LENGTH) {
		bytesRead = fs.readSync(read, buf, 0, 1);
		currByte = buf[0];

		if (prevByte === 0xff) {
			if (currByte === SOF0 || currByte === SOS) {
				break;
			}

			if (currByte === SOF2) {
				isProgressive = true;
				break;
			}
		}

		prevByte = currByte;
	}

	fs.closeSync(read);

	return isProgressive;
};
