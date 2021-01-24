/// <reference types="node"/>
import {Readable as ReadableStream} from 'stream';

/**
Checks if a `Buffer` contains a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

@param buffer - Buffer of a JPEG image. Must be at least `65535` bytes when the file is larger than that.
@returns Whether the `buffer` is a progressive JPEG image.

@example
```
import {promisify} from 'util';
import {readFile} from 'fs';
import isProgressive = require('is-progressive');

const readFileP = promisify(readFile);

(async () => {
	const buffer = await readFileP('baseline.jpg');
	console.log(await isProgressive.buffer(buffer));
	//=> false
})();
```
*/
export function buffer(buffer: Buffer): boolean;

/**
Checks if a `stream.Readable` produces a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

@param stream - Data stream with a JPEG image.
@returns Whether the `stream` is a progressive JPEG image.

@example
```
// Check if a remote JPEG image is progressive without downloading the whole file
import * as https from 'https';
import isProgressive = require('is-progressive');

const url = 'https://raw.githubusercontent.com/sindresorhus/is-progressive/main/fixture/progressive.jpg';

https.get(url, async response => {
	console.log(await isProgressive.stream(response));
	//=> true
});
```
*/
export function stream(stream: ReadableStream): Promise<boolean>;

/**
Checks if a file is a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

@param filePath - File path to the image.
@returns Whether the file at the `filePath` is a progressive JPEG image.

@example
```
import isProgressive = require('is-progressive');

(async () => {
	console.log(await isProgressive.file('baseline.jpg'));
	//=> false
})();
```
*/
export function file(filePath: string): Promise<boolean>;

/**
Synchronously checks if a file is a JPEG image that is [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html).

@param filePath - File path to the image.
@returns Whether the the file at the `filePath` is a progressive JPEG.

@example
```
import isProgressive = require('is-progressive');

isProgressive.fileSync('progressive.jpg');
//=> true
```
*/
export function fileSync(filePath: string): boolean;
