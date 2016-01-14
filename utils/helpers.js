'use strict';

module.exports = function (config) {
	var logger = require('./logger');

	var helpers = {};

	var components = {};
	var customOptions = [
		'styleguideCSS',
		'styleguideJS',
		'styleguideTitle',
		'styleguideDescription',
		'sandboxCSS',
		'sections'
	];

	// customise the styleguide
	helpers.customise = function () {
		var data = {};
		customOptions.forEach(function (item) {
			if (config[item]) {
				data[item] = config[item];
			}
		});
		return data;
	}

	// list of custom options to check for
	helpers.getCustomOptions = function () {
		return customOptions;
	}

	// return the list of components
	helpers.getComponents = function () {
		return components;
	}

	// should we check this file/folder for component code?
	helpers.valid = function (include, exclude, file) {
		return (exclude.all && includeItem(include.files, include.folders, file)) || (!exclude.all && excludeItem(exclude.files, exclude.folders, file));
	}

	// convert each line of the file to an array item
	helpers.fileToArray = function (input, componentStart, placeholderText, componentEnd) {
		var remaining = '';
		var fileArray = new Array();

		input.on('data', function (data) {
			remaining += data;
			var index = remaining.indexOf('\n');
			var last  = 0;
			while (index > -1) {
				var line = remaining.substring(last, index);
				last = index + 1;
				if (line !== '') {
					fileArray.push(line.trim());
				}
				index = remaining.indexOf('\n', last);
			}

			remaining = remaining.substring(last);
		});

		input.on('end', function () {
			if (remaining.length > 0) {
				if (remaining !== '') {
					var remainingString = JSON.stringify(remaining);
					fileArray.push(remainingString.replace(/\\t/g,''));
				}
			}
			extractComponents(fileArray, componentStart, placeholderText, componentEnd);
		});
	}

	// match file name
	function matchFile(file, item) {
		if (file.substr(file.length - item.length).toUpperCase() === item.toUpperCase()) {
			return true;
		}
		else {
			return false;
		}
	}

	// match folder name
	function matchFolder(file, item) {
		if (file.substr(0, item.length).toUpperCase() === item.toUpperCase()) {
			return true;
		}
		else {
			return false;
		}
	}

	// include files and folders to crawl
	function includeItem(includeFiles, includeFolders, file) {
		var valid = false;

		includeFiles.forEach(function (item) {
			if (matchFile(file, item)) {
				valid = true;
			}
		});
		includeFolders.forEach(function (item) {
			if (matchFolder(file, item)) {
				valid = true;
			}
		});
		return valid;
	}

	// exclude files and folders to crawl
	function excludeItem(excludeFiles, excludeFolders, file) {
		var valid = true;

		excludeFiles.forEach(function (item) {
			if (matchFile(file, item)) {
				valid = false;
			}
		});
		excludeFolders.forEach(function (item) {
			if (matchFolder(file, item)) {
				valid = false;
			}
		});
		return valid;
	}

	// process the array representation of the file, extract components
	function extractComponents(data, componentStart, placeholderText, componentEnd) {
		var startString = componentStart.substring(0, componentStart.indexOf(placeholderText));
		var endString = componentStart.substring(componentStart.indexOf(placeholderText) + placeholderText.length, componentStart.length);
		var component = [];
		var collect = false;
		var componentName;

		for (var i=0; i<data.length; i++) {
			var line = data[i];
			if (line.substr(0, componentEnd.length).toUpperCase() === componentEnd.toUpperCase()) {
				if (componentName in components) {
					logger.warning('Component `' + componentName + '` already exists, nothing has been added');
				}
				else {
					components[componentName] = component.join('');
				}
				collect = false;
				component = [];
			}
			if (collect) {
				component.push(line);
			}
			if (line.indexOf(startString) === 0 && line.match(endString + '$') == endString) {
				componentName = line.replace(startString, '').replace(endString, '');
				collect = true;
			}
		}
	}

	return helpers;
};
