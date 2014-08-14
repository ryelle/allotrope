/*global Backbone */
(function( wp, $, window, undefined ) {

	'use strict';

	wp.api.app.addRegions({
		header: '#header',
		main: '#content',
		single: '#single',
		pagination: '#pagination',
		footer: '#footer'
	});

	// Router
	// ---------------
	//
	// Handle routes to show the active vs complete todo items
	wp.api.app.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'':                   'default',
			'post/:id':           'single',
			'post/:id/*slug':     'single'
		}
	});

	// Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	wp.api.app.Controller = function () {
		this.posts = new wp.api.collections.Posts();
	};

	_.extend(wp.api.app.Controller.prototype, {
		// Start the app by showing the appropriate views
		// and fetching the list of todo items, if there are any
		start: function () {
			// this.posts.fetch();
		},

		showPagination: function(){
			wp.api.app.pagination.show( new wp.api.views.Pagination() );
		},

		showDecoration: function(){
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:250, class: 'small' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:350, class: 'medium' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:600, class: 'large' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:950, class: 'very-large' }) );
		},

		showPosts: function (posts) {
			wp.api.app.main.show(new wp.api.views.Index({
				collection: posts
			}));
		},

		showPost: function( id ) {
			wp.api.app.single.show(new wp.api.views.Single({
				model: new wp.api.models.Post({ ID: id })
			}));
		},

		// Set the filter to show complete or all items
		default: function () {
			this.showPosts( this.posts );
			this.showPagination();
			this.showDecoration();
		},

		single: function( id ){
			this.showPost( id );
			this.showDecoration();
		}
	});

	// Initializer
	// --------------------
	//
	// Get the App up and running by initializing the mediator
	// when the the application is started, pulling in all of the
	// existing Todo items and displaying them.
	wp.api.app.addInitializer(function () {
		var controller = new wp.api.app.Controller();
		controller.router = new wp.api.app.Router({
			controller: controller
		});

		controller.start();
	});

	wp.api.app.on( 'start', function( options ) {
		Backbone.history.start();
	});

	wp.api.app.navigate = function( fragment, options ){
		Backbone.history.navigate( fragment, options );
	}

	wp.api.app.start();

})( wp, jQuery, window );
