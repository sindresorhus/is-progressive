#!/usr/bin/env node
'use strict';
var path = require('path');
var meow = require('meow');
var logSymbols = require('log-symbols');
var arrify = require('arrify');
var isProgressive = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ is-progressive <file> ...',
		'  $ is-progressive < <file>',
		'',
		'Example',
		'  $ is-progressive baseline.jpg progressive.jpg',
		'  ✖ baseline.jpg',
		'  ✔ progressive.jpg'
	]
});

function init(input) {
	var exitCode = 0;

	arrify(input).forEach(function (x) {
		var p = isProgressive.fileSync(x);

		if (!p) {
			exitCode = 1;
		}

		console.log(p ? logSymbols.success : logSymbols.error, path.relative(process.cwd(), x));
	});

	process.exit(exitCode);
}

if (process.stdin.isTTY) {
	if (cli.input.length === 0) {
		console.error('Specify at least one filename');
		process.exit(2);
	}

	init(cli.input);
} else {
	process.stdin.pipe(isProgressive.stream(init));
}
