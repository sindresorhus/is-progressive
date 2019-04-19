# is-progressive [![Build Status](https://travis-ci.org/sindresorhus/is-progressive.svg?branch=master)](https://travis-ci.org/sindresorhus/is-progressive)

> Check if JPEG images are [progressive](http://www.faqs.org/faqs/jpeg-faq/part1/section-11.html)

Can be useful to make sure your images are progressive, which is important for performance:

> Progressive JPEGs are better because they are faster. Appearing faster is being faster, and perceived speed is more important that actual speed. - [Progressive JPEGs: a new best practice](http://calendar.perfplanet.com/2012/progressive-jpegs-a-new-best-practice/)

The check is fast as it only reads a small part of the file.


## Install

```
$ npm install is-progressive
```


## Usage

```js
const isProgressive = require('is-progressive');

(async () => {
	console.log(await isProgressive.file('baseline.jpg'));
	//=> false
})();

isProgressive.fileSync('progressive.jpg');
//=> true
```

```js
// check if a remote JPEG image is progressive
// without downloading the whole file
const https = require('https');
const isProgressive = require('is-progressive');

const url = 'https://raw.githubusercontent.com/sindresorhus/is-progressive/master/fixture/progressive.jpg';

https.get(url, async response => {
	console.log(await isProgressive.stream(response));
	//=> true
});
```


### API

Prefer the file methods if you're dealing directly with files. Those methods are optimized to read in the least amount of bytes necessary to determine whether it's a progressive JPEG image.

#### .buffer(buffer)

Returns whether the `buffer` is a progressive JPEG image.

##### buffer

Type: `Buffer`

Buffer of a JPEG image.

Must be at least `65535` bytes when the file is larger than that.

#### .stream(stream)

Returns a Promise for a boolean indicating whether the file stream is a progressive JPEG image.

##### stream

Type: `ReadableStrem`

Data stream.

#### .file(filePath)

Returns a Promise for a boolean indicating whether the file at the `filePath` is a progressive JPEG image.

##### filePath

Type: `string`

File path to the image.

#### .fileSync(filePath)

Whether the the file at the `filePath` is a progressive JPEG.

##### filePath

Type: `string`

File path to the image.


## Build-system integration

Don't use this with a build-system like gulp/grunt as you can easily make the images progressive with the [`imagemin`](https://github.com/imagemin/imagemin) *([gulp](https://github.com/sindresorhus/gulp-imagemin)/[grunt](https://github.com/gruntjs/grunt-contrib-imagemin)-task)* `progressive` option instead of just warning about it.


## Related

- [is-progressive-cli](https://github.com/sindresorhus/is-progressive-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
