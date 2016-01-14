'use strict';

var json = require('../../data/styleguide.json');
var helpers = require('../../utils/helpers')(null);

module.exports = addData;

function addData(config, data, next) {
	data = data || {};

	if (json) {
		if (json.components) {
			data.components = json.components;
		}
		if (json.stats) {
			data.stats = json.stats;
		}
		if (json.styleguideUpdated) {
			data.styleguideUpdated = json.styleguideUpdated;
		}

		// add the custom options
		var options = helpers.getCustomOptions();
		options.forEach(function (item) {
			if (json[item]) {
				data[item] = json[item];
			}
		});
	}

	next(data);
}
