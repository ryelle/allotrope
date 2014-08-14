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
			this.listenTo( this.collection, "sync", wp.api.ui.position.navigation );

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
			wp.api.ui.position.diamonds( childView.$el, childView._index );
		}

	});

	wp.api.views.Single = Backbone.Marionette.ItemView.extend({
		template: "single",
		tagName: 'div',
		className: 'single-post',

		events: {
			'click .close': 'close',
			'click .next' : 'next',
			'click .prev' : 'previous'
		},

		close: function( e ) {
			e.preventDefault();
			this.destroy();
			if ( $("#main-content").length ) {
				wp.api.app.navigate( '/' );
			} else {
				wp.api.app.navigate( '/', { trigger: true });
			}
		},

		next: function( e ) {
			e.preventDefault();
			$.when(
				$.get( this.model.url() + '/next' )
			).then( function( ID ) {
				if ( '' != ID ) {
					wp.api.app.navigate( 'post/' + ID, { trigger: true });
				}
			});
		},

		previous: function( e ) {
			e.preventDefault();
			$.when(
				$.get( this.model.url() + '/previous' )
			).then( function( ID ) {
				if ( '' != ID ) {
					wp.api.app.navigate( 'post/' + ID, { trigger: true });
				}
			});
		},

		onKeydown: function( e ) {
			if ( 39 === e.keyCode ){ // Next
				this.next( e );
			} else if ( 37 === e.keyCode ) { // Previous
				this.previous( e );
			} else if ( 27 === e.keyCode ) { // Close (esc)
				this.close( e );
			}
		},

		initialize: function(){
			this.model.fetch({ reset: true });
			this.listenTo( this.model, "change", this.render );

			_.bindAll(this, 'onKeydown');
			$(document).bind( 'keydown', this.onKeydown);
		},

		destroy: function(){
			Backbone.Marionette.ItemView.prototype.destroy.apply(this, arguments);
			$(document).unbind( 'keydown', this.onKeydown);
		},

		onRender: function( view ){
			wp.api.ui.position.single( this.$el );
		}
	});

})( wp, WP_API_Settings, Backbone, jQuery, window );
