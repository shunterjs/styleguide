'use strict';

module.exports = function (configObj, file) {

	var fs = require('fs-extra');
	var path = require('path');
	var filewalker = require('filewalker');
	var dust = require('dustjs-helpers');
	var formattor = require('formattor');
	var formattorOptions = {method: 'xml'};

	var config = require('./utils/config')(configObj, file);
	var stats = require('./utils/cssstats')(config);
	var helpers = require('./utils/helpers')(config);
	var logger = require('./utils/logger');

	var dataTemplate = {
		layout: {
			template: 'styleguide__layout'
		}
	};
	var styleguideData = {
		components: config.components
	};

	// save some json data to file
	function writeData(folder, data) {
		fs.mkdirs(folder, function (err) {
			if (err) {
				return logger.error('Failed to locate or create directory for writing JSON data - ' + err);
			}
			else {
				fs.writeFile(folder + '/styleguide.json', JSON.stringify(data), function (err) {
					if (err) {
						return logger.error('Failed to save JSON data - ' + err);
					}
					else {
						logger.info('JSON data successfully written - ' + folder + '/styleguide.json');
					}
				});
			}
		});
	}

	// combine all the data together
	function createData(components) {
		// css data
		if (stats && Object.keys(stats).length) {
			styleguideData.stats = stats;
		}
		else {
			logger.warning('Did not find any data about the CSS');
		}

		// component data
		Object.keys(components).forEach(function (key) {
			var index;
			styleguideData.components.some(function(entry, i) {
				if (entry.id == key) {
					index = i;
					return true;
				}
			});

			if (typeof index === 'undefined') {
				logger.warning('Could not find data for `' + key + '` component');
			}
			else {
				var compiled = dust.compile(components[key], 'snippet');
				dust.loadSource(compiled);
				dust.render('snippet', styleguideData.components[index].data, function(err, html_out) {
					if (err) {
						logger.error('Could not compile template - ' + err);
					}
					else {
						styleguideData.components[index].code = html_out;
						styleguideData.components[index].prettyCode = formattor(html_out, formattorOptions);
					}
				});
			}
		});

		// sections data
		if (styleguideData.sections) {
			Object.keys(styleguideData.sections).forEach(function (key) {
				Object.keys(styleguideData.sections[key].items).forEach(function (index) {
					var item = styleguideData.sections[key].items[index];
					var code = (item.snippetCode) ? item.snippetCode : item.html;

					if (item.sandboxed) {
						item.prettyCode = formattor(code, formattorOptions);
					}
				});
			});
		}

		// last updated
		var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var currentdate = new Date();
		styleguideData.styleguideUpdated = currentdate.getDate() + ' '
			+ (monthNames[currentdate.getMonth()]) + ' '
			+ currentdate.getFullYear() + ', '
			+ currentdate.getHours() + ':'
			+ currentdate.getMinutes();

		// write the styleguide info to data file
		writeData(__dirname + '/data', styleguideData);

		// optionally write data for local use
		if (config.localData) {
			var folder = path.join(process.cwd(), config.localData);

			fs.stat(folder + '/styleguide.json', function(err, stat) {
				if (err == null) {
					logger.info('Local data already exists. Do nothing');
				}
				else if (err.code == 'ENOENT') {
					writeData(folder, dataTemplate);
				}
				else {
					logger.error('Failed checking for local data existence - ', err.code);
				}
			});
		}
	}

	// walk over the directory structure looking for files
	function getFiles() {
		filewalker(config.path.templates)
			.on('dir', function (p) {
				var valid = helpers.valid(config.include, config.exclude, p);
				if (valid) {
					logger.directory('%s', p);
				}
				else {
					if (config.verbose) {
						logger.ignored('%s', p);
					}
				}
			})
			.on('stream', function (rs, p, s, fullPath) {
				var valid = helpers.valid(config.include, config.exclude, p);
				if (valid) {
					var input = fs.createReadStream(fullPath);
				}
				rs.on('data', function(data) {
					if (valid) {
						helpers.fileToArray(input, config.componentStart, config.placeholderText, config.componentEnd);
					}
				});
				rs.on('end', function (data) {
					if (valid) {
						logger.file('%s, %d bytes', p, s.size);
					}
					else {
						if (config.verbose) {
							logger.ignored('%s', p);
						}
					}
				});
			})
			.on('error', function (err) {
				logger.error(err);
			})
			.on('done', function () {
				logger.info('Finished parsing templates. %d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
				createData(helpers.getComponents());
			})
		.walk();
	}

	if (config.exclude.all && (config.include.files && config.include.files.length === 0) && (config.include.folders && config.include.folders.length === 0)) {
		logger.warning('You have not included any files or folders');
		return;
	}

	if (typeof config.path.resources === 'string' && typeof config.path.templates === 'string') {
		logger.info('Starting parsing of templates...');
		getFiles();

		// merge custom options
		var options = helpers.customise();
		for (var attr in options) {
			styleguideData[attr] = options[attr];
		}
	}
	else {
		if (typeof config.path.resources !== 'string') {
			throw new TypeError('Styleguide expects `resources` directory to be passed as a string');
		}
		if (typeof config.path.templates !== 'string') {
			throw new TypeError('Styleguide expects `templates` directory to be passed as a string');
		}
	}
};
