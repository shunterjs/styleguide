#!/usr/bin/env node

var yargs = require('yargs');
var fs = require('fs-extra');
var logger = require('../utils/logger');
var styleguide = require('..');

// Parse command-line arguments
var args = yargs
	.options('c', {
		alias: 'config',
		type: 'string',
		describe: 'Config location'
	})
	.options('v', {
		alias: 'verbose',
		default: false,
		describe: 'Verbose output'
	})
	.options('d', {
		alias: 'data',
		type: 'string',
		describe: 'Local data location'
	})
	.options('s', {
		alias: 'stylesheet',
		type: 'string',
		describe: 'Location of stylesheet for styleguide'
	})
	.options('j', {
		alias: 'javascript',
		type: 'string',
		describe: 'Location of javascript for styleguide'
	})
	.alias('h', 'help')
	.help('help')
	.argv;

styleguide({
	verbose: args.verbose,
	localData: args.data,
	styleguideCSS: args.stylesheet,
	styleguideJS: args.javascript
}, args.config);

