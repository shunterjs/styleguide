'use strict';

module.exports = initFilter;

function initFilter(dust) {
	// https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-srcdoc
	dust.filters.doubleamp = function(value) {
		return value.replace(/&amp;/g, '&amp;amp;');
	};
	dust.filters.iframe = function(value) {
		var escapes = {
			'<': '&#60;',
			'>': '&#62;',
			'"': '&quot;',
			'\'': '&#39;'
		};
		return dust.filters.doubleamp(value).replace(/[<>"']/g, function(match) {
			return escapes[match];
		});
	};
}
