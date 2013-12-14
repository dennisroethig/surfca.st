'use strict';

var _gauges  = _gauges || [];

// tracking function
var gauges = function(trackingEvent) {

	// don't track on local
	if (window.location.hostname === 'localhost') {
		return;
	}

	// if gaug.es is not loaded, get the tracking code
	if (typeof _gauges.resource === 'undefined') {

		// insert tracking script into DOM
		var t   = document.createElement('script');
		t.type  = 'text/javascript';
		t.async = true;
		t.id    = 'gauges-tracker';
		t.setAttribute('data-site-id', '5108f206613f5d709f000023');
		t.src = '//secure.gaug.es/track.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(t, s);

	}

	// if gaug.es is already loaded, track
	else {
		_gauges.push(['track']);
	}

};

window.addEventListener('load', function() {

	new FastClick(document.body);

}, false);