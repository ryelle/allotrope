(function( window, undefined ) {

	'use strict';

	function WP_API() {
		this.models = {};
		this.collections = {};
		this.views = {};
	}

	window.wp = window.wp || {};
	wp.api = wp.api || new WP_API();

	wp.api.app = new Backbone.Marionette.Application();

	Backbone.Marionette.Renderer.render = function(template, data){
		var tmpl = wp.template( template );
		return tmpl( data );
	};

})( window );
