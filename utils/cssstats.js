'use strict';

module.exports = function(config) {

	var fs = require('fs-extra');
	var path = require('path');
	var cssstats = require('cssstats');
	var filewalker = require('filewalker');

	var logger = require('./logger');

	var regex = new RegExp('^' + config.css + '-[a-f0-9]{32}(\.css)$');
	var	fullPath = [];

	// returns true if color is equivelent to white
	function whiteText (value) {
		value = value.toLowerCase();
		if (value.match(/^#fff/) || value.match(/^#ffffff/)) {
			return true;
		}
		else if ( value.match(/^rgb.*\(255,\s*255,\s*255/) ) {
			return true;
		}
		return false;
	}

	// filter the data we are interested in
	function parseData(allData) {
		if (!allData) {
			return false;
		}

		var stats = {};

		stats.size = allData.size
		stats.gzipSize = allData.gzipSize
		stats.rules = allData.rules.length
		stats.selectors = allData.aggregates.selectors
		stats.declarations = allData.aggregates.declarations
		stats.properties = allData.aggregates.properties.length
		stats.fontSize = allData.declarations.unique.fontSize;
		stats.fontFamily = allData.declarations.unique.fontFamily;
		stats.color = allData.declarations.unique.color;
		stats.backgroundColor = allData.declarations.unique.backgroundColor;
		stats.fontSize = allData.declarations.unique.fontSize;

		// check for white text color
		for (var index in stats.color) {
			if (whiteText(stats.color[index].value)) {
				stats.color[index].white = true;
			}
			else {
				stats.color[index].white = false;
			}
		}

		// remove font-size: 0
		for (var index in stats.fontSize) {
			if (stats.fontSize[index].value.toLowerCase().match(/^0([a-z])*$/)) {
				stats.fontSize.splice(index, 1);
			}
		}

		// remove inherit from font-families
		for (var index in stats.fontFamily) {
			if (stats.fontFamily[index].value.toLowerCase() === 'inherit') {
				stats.fontFamily.splice(index, 1);
			}
		}

		return stats;
	}

	// find the latest version of your CSS file
	function latest() {
		var latestFile = {};

		fullPath.forEach(function (file) {
			try {
				var stats = fs.statSync(file);
				if (!latestFile.timestamp || stats.mtime.getTime() > latestFile.timestamp) {
					latestFile.path = file;
					latestFile.timestamp = stats.mtime.getTime();
				}
			}
			catch (err) {
				logger.error('Reading CSS file - ' + err);
			}
		});

		return latestFile;
	}

	// get css stats data from css file
	function processCSS() {
		var data = {};
		if (fullPath.length) {
			var file = latest().path;
			var css;
			try {
				css = fs.readFileSync(file, 'utf8');
				logger.info('CSS file successfully parsed');
				var allData = cssstats(css);
				data = parseData(allData);
			}
			catch (err) {
				logger.error('Parsing CSS file - ' + err);
			}
		}
		else {
			logger.warning('Could not find a matching CSS file');
		}
		return data;
	}

	// find css
	var files
	try {
		files = fs.readdirSync(config.path.resources);
		files.some(function(file) {
			if (regex.test(file)) {
				fullPath.push(path.join(config.path.resources, file));
			}
		});
	}
	catch (err) {
		logger.error('Reading resources directory - ' + err);
	}

	return processCSS();

};