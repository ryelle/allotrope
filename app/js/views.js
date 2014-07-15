/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, $, window, undefined ) {
	'use strict';

	wp.api.views.PostList = Backbone.View.extend({
		tagName: 'section',
		className: 'post-list',
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
				var diamond, template = wp.template( 'content' );

				diamond = this.position( $( template( models[i].attributes ) ), this.$el.find('.post').length );
				this.$el.append( diamond );

				this.$el.find('.post').eq(i).fadeIn( 'slow' );

			}

			jQuery('.navigation').fadeIn( 'slow' );

			return this;
		},

		renderOne: function( model ) {
			var diamond, template = wp.template( 'content' );

			diamond = this.position( $( template( model.attributes ) ), this.$el.find('.post').length );
			this.$el.append( diamond );

			this.$el.find('.post').fadeIn( 'slow' );

			return this;
		},

		position: function( diamond, count ) {
			var level = count % 7, // [0-6]
				size = 280 / 2 + 15,
				pageOffset = Math.floor( count / 7 ) * size * 4;

			switch (level) {
				case 0:
					diamond.css({
						top: pageOffset + 'px',
						left: 'calc( 50% - ' + size * 0.5 + 'px )'
					});
					break;
				case 1:
					diamond.css({
						top: size + pageOffset + 'px',
						left: 'calc( 50% - ' + size * 1.5 + 'px )'
					});
					break;
				case 2:
					diamond.css({
						top: size + pageOffset + 'px',
						left: 'calc( 50% + ' + size * 0.5 + 'px )'
					});
					break;
				case 3:
					diamond.css({
						top: 2*size + pageOffset + 'px',
						left: 'calc( 50% - ' + size * 2.5 + 'px )'
					});
					break;
				case 4:
					diamond.css({
						top: 2*size + pageOffset + 'px',
						left: 'calc( 50% - ' + size * 0.5 + 'px )'
					});
					break;
				case 5:
					// Not right!
					diamond.css({
						top: 2*size + pageOffset + 'px',
						left: 'calc( 50% + 162.5px )' // 140 + gutter * 1.5
					});
					break;
				case 6:
					diamond.css({
						top: 3*size + pageOffset + 'px',
						left: 'calc( 50% - ' + size * 1.5 + 'px )'
					});
					break;
			}

			return diamond;
		},

		open: function( e ) {
			e.preventDefault();
			wp.api.app.navigate( e.target.getAttribute('href'), { trigger: true });
		}
	});

	wp.api.views.Index = Backbone.View.extend({
		tagName: 'div',
		className: 'content-area',

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
			this.positionNav( this.$el.find('.navigation') );
		},

		render: function() {
			this.$el.html( this.template() );

			this.$el.append( wp.template( 'background' )({ size:250, class: 'small' }) );
			this.$el.append( wp.template( 'background' )({ size:350, class: 'medium' }) );
			this.$el.append( wp.template( 'background' )({ size:600, class: 'large' }) );
			this.$el.append( wp.template( 'background' )({ size:950, class: 'very-large' }) );

			this.subview = new wp.api.views.PostList({
				collection: new wp.api.collections.Posts()
			});

			this.$el.append( this.subview.render().el );

			var pageNav = wp.template( 'pagination' ),
				nav = this.positionNav( $( pageNav() ) );

			this.$el.append( nav );

			this.$el.find('.placeholders').remove();

			return this;
		},

		positionNav: function( nav ) {
			var size = 280 / 2 + 15,
				pageOffset = this.page * size * 4;

			nav.css({
				top: pageOffset + 'px',
				left: 'calc( 50% - 105px )' // Eh
			});

			return nav;
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

})( wp, WP_API_Settings, Backbone, jQuery, window );