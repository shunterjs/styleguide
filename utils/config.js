'use strict';

module.exports = function(config, configFile) {

	config = config || {};

	var path = require('path');
	var fs = require('fs-extra');
	var extend = require('extend');
	var logger = require('./logger');
	var appRoot = process.cwd();

	var defaultConfig = {
		path: {
			templates: path.join(appRoot, 'view'),
			resources: path.join(appRoot, 'resources')
		},
		exclude: {
			all: false,
			folders: [],
			files: []
		},
		include: {
			folders: [],
			files: []
		},
		components: [],
		componentStart: '{! componentStart-placeholder !}',
		componentEnd: '{! componentEnd !}',
		placeholderText: 'placeholder',
		css: 'main'
	};

	config = extend(true, {}, defaultConfig, config);
	if (configFile) {
		var localConfig = path.join(appRoot, configFile);
		if (fs.existsSync(localConfig)) {
			logger.info('Configuration file found');
			extend(true, config, require(localConfig));
		}
	}
	return config;
};
