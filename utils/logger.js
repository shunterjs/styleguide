'use strict';

var winston = require('winston');

var log = {
	logger : {
		levels: {
			directory: 0,
			ignored: 1,
			file: 2,
			info: 3,
			warning: 4,
			error: 5
		},
		colors: {
			directory: 'blue',
			ignored: 'magenta',
			file: 'cyan',
			info: 'green',
			warning: 'yellow',
			error: 'red'
		},
	}
};

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(
		{
			level: 'error',
			colorize: true,
			timestamp: true
		})
	]
});

logger.setLevels(log.logger.levels);
winston.addColors(log.logger.colors);

module.exports = logger; 