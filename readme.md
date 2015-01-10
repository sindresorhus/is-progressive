# is-progressive [![Build Status](https://travis-ci.org/sindresorhus/is-progressive.svg?branch=master)](https://travis-ci.org/sindresorhus/is-progressive)

> Check if a JPEG image is [progressive](http://calendar.perfplanet.com/2012/progressive-jpegs-a-new-best-practice/)


## Install

```
$ npm install --save is-progressive
```


## Usage

```js
var isProgressive = require('is-progressive');

isProgressive.fileSync('baseline.jpg');
//=> false

isProgressive.fileSync('progressive.jpg');
//=> true
```

```js
// check if a remote JPEG image is progressive
// without downloading the whole file
var https = require('https');
var isProgressive = require('is-progressive');
var url = 'https://raw.githubusercontent.com/sindresorhus/is-progressive/master/fixture/progressive.jpg';

var req = https.get(url, function (res) {
	res.pipe(isProgressive.stream(function (progressive) {
		req.end();
		console.log(progressive);
		//=> true
	}));
});
```


## API

Prefer the file methods if you're dealing directly files as those methods are optimized to read in the least amount of bytes nessecary to determine whether it's a progressive JPEG image.

### .buffer(buffer)

Returns whether the buffer is a progressive JPEG image.

#### buffer

*Required*  
Type: `buffer`

Buffer of a JPEG image.

Must be at least `65535` bytes when the file is larger than that.

### .stream(callback)

#### callback(progressive)

*Required*  
Type: `function`

##### progressive

Type: `boolean`

Whether the buffer is a progressive JPEG image.

### .file(filepath, callback)

#### filepath

*Required*  
Type: `string`

Filepath to the image.

#### callback(error, progressive)

##### progressive

Type: `boolean`

Whether the buffer is a progressive JPEG.

### .fileSync(filepath)

Returns whether the buffer is a progressive JPEG.

#### filepath

*Required*  
Type: `string`

Filepath to the image.


## CLI

<img src="screenshot.png" width="330">

```sh
$ npm install --global is-progressive
```

```
$ is-progressive --help

  Usage
    is-progressive <filename>
    is-progressive < <filename>

  Example
    is-progressive < unicorn.png
    ✔ Progressive
```

### Multiple files

Just use some simple shell scripting:

```sh
$ for f in *.jpg; do echo "$f"; is-progressive $f; echo; done

baseline.jpg
✖ Baseline

progressive.jpg
✔ Progressive
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
