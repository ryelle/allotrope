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
			'category/:id':       'category',
			'category/:id/*slug': 'category',
			'tag/:slug':          'tag',
			'search/:query':      'search',
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
		// Start the app by showing the global views
		start: function () {
			this.showDecoration();
		},

		/**
		 * Default route handler, show all posts.
		 */
		default: function () {
			this.showPosts( this.posts, {} );
			this.showPagination();
		},

		/**
		 * Load posts from a specific category
		 *
		 * @param {integer|string}  category  ID or slug of category to display
		 */
		category: function ( category ) {
			if ( typeof category === 'string' ) {
				this.showPosts( this.posts, { 'filter[category_name]': category } );
			} else {
				this.showPosts( this.posts, { 'filter[cat]': category } );
			}
			this.showPagination();
		},

		/**
		 * Load posts from a specific tag
		 *
		 * @param {string}  tag  slug of tag to display
		 */
		tag: function ( tag ) {
			this.showPosts( this.posts, { 'filter[tag]': tag } );
			this.showPagination();
		},

		/**
		 * Load posts that match a search term
		 *
		 * @param {string}  query  search query string
		 */
		search: function ( query ) {
			this.showPosts( this.posts, { 'filter[s]': query } );
			this.showPagination();
		},

		/**
		 * Load a single post
		 *
		 * @param {integer}  id  post ID of post to display
		 */
		single: function( id ){
			this.showPost( id );
		},

		/**
		 * Load the pagination into the pagination region
		 */
		showPagination: function(){
			wp.api.app.pagination.show( new wp.api.views.Pagination() );
		},

		/**
		 * Attach decorative diamonds to the main region
		 */
		showDecoration: function(){
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:250, class: 'small' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:350, class: 'medium' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:600, class: 'large' }) );
			wp.api.app.main.$el.append( wp.template( 'background' )({ size:950, class: 'very-large' }) );
		},

		/**
		 * Load the posts requested into the main region
		 *
		 * @param {object}  posts  Collection of Posts to be passed into the Index view
		 * @param {object}  data   Map of queries for this page, so we can filter further in the view
		 */
		showPosts: function ( posts, data ) {
			wp.api.app.main.show(new wp.api.views.Index({
				collection: posts,
				query: data
			}));
		},

		/**
		 * Load a single post into the single region
		 *
		 * @param {integer}  id  Post ID of the post to display
		 */
		showPost: function( id ) {
			wp.api.app.single.show(new wp.api.views.Single({
				model: new wp.api.models.Post({ ID: id })
			}));
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

	/**
	 * Add in support for Backbone's navigation functionality
	 */
	wp.api.app.navigate = function( fragment, options ){
		Backbone.history.navigate( fragment, options );
	}

	wp.api.app.start();

})( wp, jQuery, window );
