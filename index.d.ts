import {Buffer} from 'node:buffer';
import {Readable as ReadableStream} from 'node:stream';

declare const isProgressive: {
	/**
	Checks if a `Buffer` contains a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

	@param buffer - The buffer of a JPEG image. Must be at least `65535` bytes when the file is larger than that.
	@returns Whether the `buffer` is a progressive JPEG image.

	@example
	```
	import {promisify} from 'node:util';
	import {readFile} from 'node:fs/promises';
	import isProgressive from 'is-progressive';

	const buffer = await readFile('baseline.jpg');
	console.log(await isProgressive.buffer(buffer));
	//=> false
	```
	*/
	buffer(buffer: Buffer): boolean;

	/**
	Checks if a `stream.Readable` produces a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

	@param stream - A data stream with a JPEG image.
	@returns Whether the `stream` is a progressive JPEG image.

	@example
	```
	// Check if a remote JPEG image is progressive without downloading the whole file
	import https from 'https';
	import isProgressive from 'is-progressive';

	const url = 'https://raw.githubusercontent.com/sindresorhus/is-progressive/main/fixture/progressive.jpg';

	https.get(url, async response => {
		console.log(await isProgressive.stream(response));
		//=> true
	});
	```
	*/
	stream(stream: ReadableStream): Promise<boolean>;

	/**
	Checks if a file is a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

	@param filePath - The file path to the image.
	@returns Whether the file at the `filePath` is a progressive JPEG image.

	@example
	```
	import isProgressive from 'is-progressive';

	console.log(await isProgressive.file('baseline.jpg'));
	//=> false
	```
	*/
	file(filePath: string): Promise<boolean>;

	/**
	Synchronously checks if a file is a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

	@param filePath - The file path to the image.
	@returns Whether the the file at the `filePath` is a progressive JPEG.

	@example
	```
	import isProgressive from 'is-progressive';

	isProgressive.fileSync('progressive.jpg');
	//=> true
	```
	*/
	fileSync(filePath: string): boolean;
};

export default isProgressive;
