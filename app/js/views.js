/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, $, window, undefined ) {
	'use strict';

	wp.api.views.Pagination = Backbone.Marionette.ItemView.extend({
		template: "pagination",
		className: 'navigation',

		events: {
			'click': 'loadMore'
		},

		loadMore: function(){
			wp.api.app.vent.trigger( "posts:more" );
		}
	});

	wp.api.views.Post = Backbone.Marionette.ItemView.extend({
		template: "post",
		tagName: 'article',
		className: 'post',

		onRender: function(){
			wp.api.ui.position( this.$el, this._index );
		}
	});

	wp.api.views.Index = Backbone.Marionette.CompositeView.extend({
		tagName: 'div',
		id: "main-content",
		template: "index",
		childView: wp.api.views.Post,
		page: 1,

		initialize: function(){
			this.collection.fetch({ reset: true });
			this.listenTo( this.collection, "reset", this.render );

			_.bindAll( this, 'loadMore' );
			wp.api.app.vent.on( "posts:more", this.loadMore );
		},

		loadMore: function(){
			this.page++;
			this.collection.fetch({ reset: false, data: { page: this.page } });
		},

		onRender: function(){},

		onRemoveChild: function(){
			debugger;
		}

	});

	wp.api.views.Single = Backbone.Marionette.ItemView.extend({
		template: "single",
		tagName: 'div',
		className: 'single-post',

		initialize: function(){
			this.model.fetch({ reset: true });
			this.listenTo( this.model, "change", this.render );
		},

		onRender: function( view ){
			var offset = 0;

			offset = $( window ).scrollTop() + 10;
			this.$el.css({ position: 'absolute' });

			this.$el.css({ top: offset + 'px' });
			this.$el.slideDown();
		}
	});

})( wp, WP_API_Settings, Backbone, jQuery, window );
