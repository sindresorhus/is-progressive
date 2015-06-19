#!/usr/bin/env node
'use strict';
var meow = require('meow');
var logSymbols = require('log-symbols');
var isProgressive = require('./');

var cli = meow({
	help: [
		'Usage',
		'  is-progressive <filename>',
		'  is-progressive < <filename>',
		'',
		'Example',
		'  is-progressive < unicorn.png',
		'  ✔ Progressive'
	]
});

function init(p) {
	console.log(p ? logSymbols.success + ' Progressive' : logSymbols.error + ' Baseline');
	process.exit(p ? 0 : 1);
}

if (process.stdin.isTTY) {
	if (cli.input.length === 0) {
		console.error('Specify a filename');
		process.exit(2);
	}

	init(isProgressive.fileSync(cli.input[0]));
} else {
	process.stdin.pipe(isProgressive.stream(init));
}
