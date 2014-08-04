/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, $, window, undefined ) {
	'use strict';

	wp.api.views.Placeholder = Backbone.Marionette.ItemView.extend({
		template: "placeholders",
		className: 'placeholder'
	});

	wp.api.views.Pagination = Backbone.Marionette.ItemView.extend({
		template: "pagination",
		className: 'navigation',

		events: {
			'click .load-more': 'loadMore'
		},

		loadMore: function( e ){
			e.preventDefault();
			if ( -1 === e.target.className.indexOf('loading') ) {
				wp.api.app.vent.trigger( "posts:more" );
			}
		}
	});

	wp.api.views.Post = Backbone.Marionette.ItemView.extend({
		template: "post",
		tagName: 'article',
		className: 'post',

		events: {
			'click a': 'open'
		},

		open: function( e ){
			e.preventDefault();
			wp.api.app.navigate(e.target.getAttribute('href'), { trigger: true });
		}
	});

	wp.api.views.Index = Backbone.Marionette.CompositeView.extend({
		tagName: 'div',
		id: "main-content",
		template: "index",
		childView: wp.api.views.Post,
		emptyView: wp.api.views.Placeholder,
		page: 1,

		initialize: function(){
			this.collection.fetch({ reset: true });
			this.listenTo( this.collection, "reset", this.render );
			this.listenTo( this.collection, "sync", wp.api.ui.positionNav );

			_.bindAll( this, 'loadMore' );
			wp.api.app.vent.on( "posts:more", this.loadMore );
		},

		loadMore: function(){
			this.page++;
			$( '.navigation a' ).addClass('loading');
			this.collection.fetch({ remove: false, data: { page: this.page } });
		},

		/**
		 * Reposition the children as they're added to the Composite View
		 */
		onAddChild: function( childView ){
			wp.api.ui.position( childView.$el, childView._index );
		}

	});

	wp.api.views.Single = Backbone.Marionette.ItemView.extend({
		template: "single",
		tagName: 'div',
		className: 'single-post',

		events: {
			'click .close': 'close',
			'click .next' : 'next',
			'click .prev' : 'prev'
		},

		close: function( e ) {
			e.preventDefault();
			this.destroy();
			wp.api.app.navigate( '/' );
		},

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
