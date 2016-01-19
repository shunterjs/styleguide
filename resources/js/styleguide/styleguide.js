
(function($) {
	'use strict';

	var resizeInterval = 42;
	var resizeLimit = 1000 / 41 * 5;

	var $window = $(window);
	var $body = $('body')[0];
	var $nav = $('.navigation > div:first-child');

	var initialize = function () {
		$('iframe').each(function () {
			var $this = $(this);
			var code = $this.attr('srcdoc');

			// forces the load event to fire
			$this.attr('srcdoc', code);

			$this.on('load', normalizeIframe);
		});
	};

	var normalizeIframe = function (e) {
		var iframe = e.target;
		var iframeBody = $(iframe).contents().find('body');
		var resizer = new Resizer(iframe, iframeBody, resizeInterval, resizeLimit);
		resizer.interval = window.setInterval(function() { resizer.resize(); }, resizeInterval);
	};

	var Resizer = function (iframe, iframeBody, interval, limit) {
		this.iframe = $(iframe);
		this.iframeBody = iframeBody;
		this.interval = interval;
		this.limit = limit;
		this.resizeCount = 0;
	};

	var fixedSidebar = function (mq) {
		if (mq() === 'full') {
			var pos = $window.height() < $nav.outerHeight(true)? 'absolute': 'fixed';
			$nav.css({position: pos});
		}
		else {
			$nav.removeAttr('style');
		}
	};

	var mediaQuery = function () {
		return window.getComputedStyle($body, ':before').content.replace(/"|'/g, '');
	}

	Resizer.prototype = {
		resize: function () {
			this.resizeCount++;
			if (this.resizeCount > resizeLimit) {
				window.clearInterval(this.interval);
			}
			this.resizeImpl();
		},
		resizeImpl: function () {
			var height = this.iframeBody.height();
			this.iframe.css('height', height);
		}
	};

	// normalize the height of the iframes
	$('document').ready(initialize);

	// add body class
	$('body').addClass('js');

	// fix sidebar if shorter than window
	$window.resize(function () {
		fixedSidebar(mediaQuery);
	});
	fixedSidebar(mediaQuery);

	// select box navigation
	$('nav select').change(function() {
		window.location = $(this).find("option:selected").val();
	});
})(jQuery);
