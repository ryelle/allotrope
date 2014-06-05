/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, window, undefined ) {
	'use strict';

	wp.api.views.PostList = Backbone.View.extend({
		tagName: 'ul',
		events: {
			'click a': 'open'
		},

		// constructor that adds a reset event to collection and then does a fetch
		initialize: function() {
			this.listenTo( this.collection, 'reset', this.render );
			// this.listenTo( this.collection, 'change', this.render );
			this.listenTo( this.collection, 'add', this.renderOne );

			this.collection.fetch({ reset: true });
		},

		render: function() {
			var models = this.collection.models;

			// render each location model using a template
			for ( var i = 0; i < models.length; i++ ) {
				var template = wp.template( 'content' );

				this.$el.append( template( models[i].attributes ) );
			}

			return this;
		},

		renderOne: function( model ) {
			var template = wp.template( 'content' );

			this.$el.append( template( model.attributes ) );

			return this;
		},

		open: function( e ) {
			e.preventDefault();
			wp.api.app.navigate( e.target.getAttribute('href'), { trigger: true });
		}
	});

	wp.api.views.Index = Backbone.View.extend({
		tagName: 'section',

		template: wp.template( 'index' ),

		subview: null,
		page: 1,

		events: {
			'click .next-page': 'nextPage'
		},

		nextPage: function( e ){
			e.preventDefault();
			this.page++;
			this.subview.collection.fetch({ data: { page: this.page } });
		},

		render: function() {
			this.$el.html( this.template() );

			this.subview = new wp.api.views.PostList({
				collection: new wp.api.collections.Posts()
			});

			this.$el.append( this.subview.render().el );

			var paged = wp.template( 'pagination' );
			this.$el.append( paged() );

			return this;
		}
	});

	wp.api.views.Single = Backbone.View.extend({
		tagName: 'article',

		template: wp.template( 'single' ),

		// constructor that adds a change event to model and then does a fetch
		initialize: function() {
			this.listenTo( this.model, 'change', this.render );

			this.model.fetch({ reset: true });
		},

		render: function() {
			this.$el.html( this.template( this.model.attributes ) );

			return this;
		}
	});

})( wp, WP_API_Settings, Backbone, window );