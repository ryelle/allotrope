/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, $, window, undefined ) {
	'use strict';

	var positionNav = function( nav, page ) {
		if ( ! page ){
			page = nav.data( 'page' );
		}

		var size = 280 / 2 + 15,
			pageOffset = (page - 1) * size * 4;

		nav.css({
			top: pageOffset + 'px',
			left: 'calc( 50% - 105px )' // Eh
		});

		nav.data( 'page', page + 1 );

		return nav;
	};

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

			this.collection.fetch({ reset: true, success: this.animate });
		},

		open: function( e ) {
			e.preventDefault();
			wp.api.app.navigate( e.target.getAttribute('href'), { trigger: true });

			// Set the post background based on the clicked diamond.
			var color = $( e.target ).closest( 'article' ).css( 'background-color' );
			$(".single-post").css( 'background-color', color );
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

		// Don't do anything right now?
		animate: function(){
			positionNav( $('.navigation') );
			return;
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
			this.subview.collection.fetch({ data: { page: this.page }, success: this.subview.animate });
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
				nav = positionNav( $( pageNav() ), this.page );

			this.$el.append( nav );

			this.$el.find('.placeholders').remove();

			return this;
		}

	});

	wp.api.views.Single = Backbone.View.extend({
		tagName: 'article',

		template: wp.template( 'single' ),

		events: {
			'click .close': 'close',
			'click .next' : 'next',
			'click .prev' : 'prev'
		},

		close: function( e ) {
			e.preventDefault();
			if ( true ) {
				$('#content .single-post').html('').hide();
			} else {
				wp.api.app.navigate( '/', { trigger: true });
			}
		},

		next: function( e ) {
			e.preventDefault();
			//wp.api.app.navigate( '/', { trigger: true });
		},

		prev: function( e ) {
			e.preventDefault();
			//wp.api.app.navigate( '/', { trigger: true });
		},

		// constructor that adds a change event to model and then does a fetch
		initialize: function() {
			this.listenTo( this.model, 'change', this.render );

			this.model.fetch({ reset: true, success: this.animate });
		},

		render: function() {
			this.$el.html( this.template( this.model.attributes ) );

			return this;
		},

		animate: function(){
			var offset = 0,
				maxHeight = $( window ).height(),
				height = $('#content .single-post').height();

			if ( height < maxHeight ) {
				offset = ( ( maxHeight - height ) / 2 ) - 40;
				$('#content .single-post').css({ position: 'fixed' });
			} else {
				offset = $( window ).scrollTop() + 10;
			}

			$('#content .single-post').css({ top: offset + 'px' });
			$('#content .single-post').slideDown();
		}
	});

})( wp, WP_API_Settings, Backbone, jQuery, window );