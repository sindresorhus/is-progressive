#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');
const logSymbols = require('log-symbols');
const arrify = require('arrify');
const isProgressive = require('./');

const cli = meow(`
	Usage
	  $ is-progressive <file> ...
	  $ is-progressive < <file>

	Example
	  $ is-progressive baseline.jpg progressive.jpg
	  ✖ baseline.jpg
	  ✔ progressive.jpg
`);

const log = (p, x) => {
	console.log(p ? logSymbols.success : logSymbols.error, path.relative(process.cwd(), x));
};

const init = input => {
	let exitCode = 0;

	arrify(input).forEach(x => {
		const p = isProgressive.fileSync(x);

		if (!p) {
			exitCode = 1;
		}

		log(p, x);
	});

	process.exit(exitCode);
};

if (process.stdin.isTTY) {
	if (cli.input.length === 0) {
		console.error('Specify at least one filename');
		process.exit(2);
	}

	init(cli.input);
} else {
	isProgressive.stream(process.stdin).then(p => {
		log(p, 'stdin');
	});
}
