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

(function( Backbone, _, window, undefined ) {

	//'use strict';

	// ECMAScript 5 shim, from MDN
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
	if ( ! Date.prototype.toISOString ) {
		var pad = function( number ) {
			var r = String( number );
			if ( r.length === 1 ) {
				r = '0' + r;
			}
			return r;
		};

		Date.prototype.toISOString = function() {
			return this.getUTCFullYear() +
				'-' + pad( this.getUTCMonth() + 1 ) +
				'-' + pad( this.getUTCDate() ) +
				'T' + pad( this.getUTCHours() ) +
				':' + pad( this.getUTCMinutes() ) +
				':' + pad( this.getUTCSeconds() ) +
				'.' + String( ( this.getUTCMilliseconds()/1000 ).toFixed( 3 ) ).slice( 2, 5 ) +
				'Z';
		};
	}

	function WP_API_Utils() {
		var origParse = Date.parse,
			numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];


		this.parseISO8601 = function( date ) {
			var timestamp, struct, i, k,
				minutesOffset = 0;

			// ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
			// before falling back to any implementation-specific date parsing, so that’s what we do, even if native
			// implementations could be faster
			//              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
			if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
				// avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
				for ( i = 0; ( k = numericKeys[i] ); ++i) {
					struct[k] = +struct[k] || 0;
				}

				// allow undefined days and months
				struct[2] = ( +struct[2] || 1 ) - 1;
				struct[3] = +struct[3] || 1;

				if ( struct[8] !== 'Z' && struct[9] !== undefined ) {
					minutesOffset = struct[10] * 60 + struct[11];

					if ( struct[9] === '+' ) {
						minutesOffset = 0 - minutesOffset;
					}
				}

				timestamp = Date.UTC( struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7] );
			}
			else {
				timestamp = origParse ? origParse( date ) : NaN;
			}

			return timestamp;
		};
	}

	window.wp = window.wp || {};
	wp.api = wp.api || {};
	wp.api.utils = wp.api.utils || new WP_API_Utils();

})( Backbone, _, window );
/**
 * wp.api.ui handles:
 *  - Positioning of: diamonds, navigation, single post
 */
(function( Backbone, _, $, window, undefined ) {

	var UI = {};

	UI.position = {

		diamonds: function( diamond, count ) {
			var level = count % 7, // [0-6]
				size = 280 / 2 + 15,
				pageOffset = Math.floor( count / 7 ) * size * 4,
				left = 0;

			switch (level) {
				case 0:
					diamond.css({
						top: pageOffset - UI.animate.offset + 'px',
						left: 'calc( 50% - ' + size * 0.5 + 'px )'
					});
					break;
				case 1:
					left = size * 1.5 + UI.animate.offset;
					diamond.css({
						top: size + pageOffset + 'px',
						left: 'calc( 50% - ' + left + 'px )'
					});
					break;
				case 2:
					left = size * 0.5 + UI.animate.offset;
					diamond.css({
						top: size + pageOffset + 'px',
						left: 'calc( 50% + ' + left + 'px )'
					});
					break;
				case 3:
					left = size * 2.5 + UI.animate.offset;
					diamond.css({
						top: 2*size + pageOffset + 'px',
						left: 'calc( 50% - ' + left + 'px )'
					});
					break;
				case 4:
					diamond.css({
						top: 2*size + pageOffset - UI.animate.offset + 'px',
						left: 'calc( 50% - ' + size * 0.5 + 'px )'
					});
					break;
				case 5:
					// Not right!
					left = 162.5 + UI.animate.offset;
					diamond.css({
						top: 2*size + pageOffset + 'px',
						left: 'calc( 50% + ' + left + 'px )' // 140 + gutter * 1.5
					});
					break;
				case 6:
					left = size * 1.5 + UI.animate.offset;
					diamond.css({
						top: 3*size + pageOffset + 'px',
						left: 'calc( 50% - ' + left + 'px )'
					});
					break;
			}

			return diamond;
		},

		navigation: function() {
			var page = Math.floor( $("#main-content .post").length / 7 ),
				size = 280 / 2 + 15,
				pageOffset = page * size * 4;

			$( '.navigation a' ).removeClass('loading');

			$( '.navigation' ).css({
				top: pageOffset + 'px',
				left: 'calc( 50% - 42px )' // Eh
			});
		},

		single: function( $el ){
			var offset = $( window ).scrollTop() + 10;
			if ( -1 !== document.body.className.indexOf('admin-bar') ) {
				offset += 32;
			}
			$el.css({ position: 'absolute' });

			$el.css({ top: offset + 'px' });
			$el.slideDown();
		}

	};

	UI.animate = {
		offset: 0,
		duration: 750,

		diamonds: function( diamond, count ){
			diamond.animate({ opacity: 1 }, UI.animate.duration );
		}

	}

	window.wp = window.wp || {};
	wp.api = wp.api || {};
	wp.api.ui = wp.api.ui || UI;

})( Backbone, _, jQuery, window );
/* global WP_API_Settings:false */
// Suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function( wp, WP_API_Settings, Backbone, _, window, undefined ) {

	'use strict';

	/**
	 * Array of parseable dates
	 *
	 * @type {string[]}
	 */
	var parseable_dates = [ 'date', 'modified', 'date_gmt', 'modified_gmt' ];

	/**
	 * Mixin for all content that is time stamped
	 *
	 * @type {{toJSON: toJSON, parse: parse}}
	 */
	var TimeStampedMixin = {
		/**
		 * Serialize the entity pre-sync
		 *
		 * @returns {*}
		 */
		toJSON: function() {
			var attributes = _.clone( this.attributes );

			// Serialize Date objects back into 8601 strings
			_.each( parseable_dates, function ( key ) {
				if ( key in attributes ) {
					attributes[key] = attributes[key].toISOString();
				}
			});

			return attributes;
		},

		/**
		 * Unserialize the fetched response
		 *
		 * @param {*} response
		 * @returns {*}
		 */
		parse: function( response ) {
			// Parse dates into native Date objects
			_.each( parseable_dates, function ( key ) {
				if ( ! ( key in response ) ) {
					return;
				}

				var timestamp = wp.api.utils.parseISO8601( response[key] );
				response[key] = new Date( timestamp );
			});

			// Parse the author into a User object
			if ( response.author !== 'undefined' ) {
				response.author = new wp.api.models.User( response.author );
			}

			return response;
		}
	};

	/**
	 * Mixin for all hierarchical content types such as posts
	 *
	 * @type {{parent: parent}}
	 */
	var HierarchicalMixin = {
		/**
		 * Get parent object
		 *
		 * @returns {Backbone.Model}
		 */
		parent: function() {

			var object, parent = this.get( 'parent' );

			// Return null if we don't have a parent
			if ( parent === 0 ) {
				return null;
			}

			var parentModel = this;

			if ( typeof this.parentModel !== 'undefined' ) {
				/**
				 * Probably a better way to do this. Perhaps grab a cached version of the
				 * instantiated model?
				 */
				parentModel = new this.parentModel();
			}

			// Can we get this from its collection?
			if ( parentModel.collection ) {
				return parentModel.collection.get( parent );
			} else {
				// Otherwise, get the object directly
				object = new parentModel.constructor( {
					ID: parent
				});

				// Note that this acts asynchronously
				object.fetch();
				return object;
			}
		}
	};

	/**
	 * Private Backbone base model for all models
	 */
	var BaseModel = Backbone.Model.extend(
		/** @lends BaseModel.prototype  */
		{
			/**
			 * Set nonce header before every Backbone sync
			 *
			 * @param {string} method
			 * @param {Backbone.Model} model
			 * @param {{beforeSend}, *} options
			 * @returns {*}
			 */
			sync: function( method, model, options ) {
				options = options || {};

				var beforeSend = options.beforeSend;
				options.beforeSend = function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );

					if ( beforeSend ) {
						return beforeSend.apply( this, arguments );
					}
				};

				return Backbone.sync( method, model, options );
			}
		}
	);

	/**
	 * Backbone model for single users
	 */
	wp.api.models.User = BaseModel.extend(
		/** @lends User.prototype  */
		{
			idAttribute: 'ID',

			urlRoot: WP_API_Settings.root + '/users',

			defaults: {
				ID: null,
				username: '',
				email: '',
				password: '',
				name: '',
				first_name: '',
				last_name: '',
				nickname: '',
				slug: '',
				URL: '',
				avatar: '',
				meta: {
					links: {}
				}
			},

			/**
			 * Return avatar URL
			 *
			 * @param {number} size
			 * @returns {string}
			 */
			avatar: function( size ) {
				return this.get( 'avatar' ) + '&s=' + size;
			}
		}
	);

	/**
	 * Model for Taxonomy
	 */
	wp.api.models.Taxonomy = BaseModel.extend(
		/** @lends Taxonomy.prototype  */
		{
			idAttribute: 'slug',

			urlRoot: WP_API_Settings.root + '/taxonomies',

			defaults: {
				name: '',
				slug: null,
				labels: {},
				types: {},
				show_cloud: false,
				hierarchical: false,
				meta: {
					links: {}
				}
			}
		}
	);

	/**
	 * Backbone model for term
	 */
	wp.api.models.Term = BaseModel.extend( _.extend(
		/** @lends Term.prototype */
		{
			idAttribute: 'ID',

			taxonomy: 'category',

			/**
			 * @class Represent a term
			 * @augments Backbone.Model
			 * @constructs
			 */
			initialize: function( attributes, options ) {
				if ( typeof options !== 'undefined' ) {
					if ( options.taxonomy ) {
						this.taxonomy = options.taxonomy;
					}
				}
			},

			/**
			 * Return URL for the model
			 *
			 * @returns {string}
			 */
			url: function() {
				var id = this.get( 'ID' );
				id = id || '';

				return WP_API_Settings.root + '/taxonomies/' + this.taxonomy + '/terms/' + id;
			},

			defaults: {
				ID: null,
				name: '',
				slug: '',
				description: '',
				parent: null,
				count: 0,
				link: '',
				meta: {
					links: {}
				}
			}

		}, TimeStampedMixin, HierarchicalMixin )
	);

	/**
	 * Backbone model for single posts
	 */
	wp.api.models.Post = BaseModel.extend( _.extend(
		/** @lends Post.prototype  */
		{
			idAttribute: 'ID',

			urlRoot: WP_API_Settings.root + '/posts',

			defaults: {
				ID: null,
				title: '',
				status: 'draft',
				type: 'post',
				author: new wp.api.models.User(),
				content: '',
				link: '',
				'parent': 0,
				date: new Date(),
				date_gmt: new Date(),
				modified: new Date(),
				modified_gmt: new Date(),
				format: 'standard',
				slug: '',
				guid: '',
				excerpt: '',
				menu_order: 0,
				comment_status: 'open',
				ping_status: 'open',
				sticky: false,
				date_tz: 'Etc/UTC',
				modified_tz: 'Etc/UTC',
				featured_image: null,
				terms: {},
				post_meta: {},
				meta: {
					links: {}
				}
			}
		}, TimeStampedMixin, HierarchicalMixin )
	);

	/**
	 * Backbone model for pages
	 */
	wp.api.models.Page = BaseModel.extend( _.extend(
		/** @lends Page.prototype  */
		{
			idAttribute: 'ID',

			urlRoot: WP_API_Settings.root + '/pages',

			defaults: {
				ID: null,
				title: '',
				status: 'draft',
				type: 'page',
				author: new wp.api.models.User(),
				content: '',
				parent: 0,
				link: '',
				date: new Date(),
				modified: new Date(),
				date_gmt: new Date(),
				modified_gmt: new Date(),
				date_tz: 'Etc/UTC',
				modified_tz: 'Etc/UTC',
				format: 'standard',
				slug: '',
				guid: '',
				excerpt: '',
				menu_order: 0,
				comment_status: 'closed',
				ping_status: 'open',
				sticky: false,
				password: '',
				meta: {
					links: {}
				},
				featured_image: null,
				terms: []
			}
		}, TimeStampedMixin, HierarchicalMixin )
	);

	/**
	 * Backbone model for revisions
	 */
	wp.api.models.Revision = wp.api.models.Post.extend(
		/** @lends Revision.prototype */
		{
			/**
			 * Return URL for model
			 *
			 * @returns {string}
			 */
			url: function() {
				var parent_id = this.get( 'parent' );
				parent_id = parent_id || '';

				var id = this.get( 'ID' );
				id = id || '';

				return WP_API_Settings.root + '/posts/' + parent_id + '/revisions/' + id;
			},

			/**
			 * @class Represent a revision
			 * @augments Backbone.Model
			 * @constructs
			 */
			initialize: function() {
				// Todo: what of the parent model is a page?
				this.parentModel = wp.api.models.Post;
			}
		}
	);

	/**
	 * Backbone model for media items
	 */
	wp.api.models.Media = BaseModel.extend( _.extend(
		/** @lends Media.prototype */
		{
			idAttribute: 'ID',

			urlRoot: WP_API_Settings.root + '/media',

			defaults: {
				ID: null,
				title: '',
				status: 'inherit',
				type: 'attachment',
				author: new wp.api.models.User(),
				content: '',
				parent: 0,
				link: '',
				date: new Date(),
				modified: new Date(),
				format: 'standard',
				slug: '',
				guid: '',
				excerpt: '',
				menu_order: 0,
				comment_status: 'open',
				ping_status: 'open',
				sticky: false,
				date_tz: 'Etc/UTC',
				modified_tz: 'Etc/UTC',
				date_gmt: new Date(),
				modified_gmt: new Date(),
				meta: {
					links: {}
				},
				terms: [],
				source: '',
				is_image: true,
				attachment_meta: {},
				image_meta: {}
			},

			/**
			 * @class Represent a media item
			 * @augments Backbone.Model
			 * @constructs
			 */
			initialize: function() {
				// Todo: what of the parent model is a page?
				this.parentModel = wp.api.models.Post;
			}
		}, TimeStampedMixin, HierarchicalMixin )
	);

	/**
	 * Backbone model for comments
	 */
	wp.api.models.Comment = BaseModel.extend( _.extend(
		/** @lends Comment.prototype */
		{
			idAttribute: 'ID',

			defaults: {
				ID: null,
				post: null,
				content: '',
				status: 'hold',
				type: '',
				parent: 0,
				author: new wp.api.models.User(),
				date: new Date(),
				date_gmt: new Date(),
				date_tz: 'Etc/UTC',
				meta: {
					links: {}
				}
			},

			/**
			 * Return URL for model
			 *
			 * @returns {string}
			 */
			url: function() {
				var post_id = this.get( 'post' );
				post_id = post_id || '';

				var id = this.get( 'ID' );
				id = id || '';

				return WP_API_Settings.root + '/posts/' + post_id + '/comments/' + id;
			}
		}, TimeStampedMixin, HierarchicalMixin )
	);

	/**
	 * Backbone model for single post types
	 */
	wp.api.models.PostType = BaseModel.extend(
		/** @lends PostType.prototype */
		{
			idAttribute: 'slug',

			urlRoot: WP_API_Settings.root + '/posts/types',

			defaults: {
				slug: null,
				name: '',
				description: '',
				labels: {},
				queryable: false,
				searchable: false,
				hierarchical: false,
				meta: {
					links: {}
				},
				taxonomies: []
			},

			/**
			 * Prevent model from being saved
			 *
			 * @returns {boolean}
			 */
			save: function () {
				return false;
			},

			/**
			 * Prevent model from being deleted
			 *
			 * @returns {boolean}
			 */
			'delete': function () {
				return false;
			}
		}
	);

	/**
	 * Backbone model for a post status
	 */
	wp.api.models.PostStatus = BaseModel.extend(
		/** @lends PostStatus.prototype */
		{
			idAttribute: 'slug',

			urlRoot: WP_API_Settings.root + '/posts/statuses',

			defaults: {
				slug: null,
				name: '',
				'public': true,
				'protected': false,
				'private': false,
				queryable: true,
				show_in_list: true,
				meta: {
					links: {}
				}
			},

			/**
			 * Prevent model from being saved
			 *
			 * @returns {boolean}
			 */
			save: function() {
				return false;
			},

			/**
			 * Prevent model from being deleted
			 *
			 * @returns {boolean}
			 */
			'delete': function() {
				return false;
			}
		}
	);

})( wp, WP_API_Settings, Backbone, _, window );
/* global WP_API_Settings:false */
(function( wp, WP_API_Settings, Backbone, _, window, undefined ) {

	'use strict';

	/**
	 * Backbone collection for posts
	 */
	wp.api.collections.Posts = Backbone.Collection.extend(
		/** @lends Posts.prototype */
		{
			url: WP_API_Settings.root + '/posts',

			model: wp.api.models.Post
		}
	);

	/**
	 * Backbone collection for pages
	 */
	wp.api.collections.Pages = Backbone.Collection.extend(
		/** @lends Pages.prototype */
		{
			url: WP_API_Settings.root + '/pages',

			model: wp.api.models.Page
		}
	);

	/**
	 * Backbone users collection
	 */
	wp.api.collections.Users = Backbone.Collection.extend(
		/** @lends Users.prototype */
		{
			url: WP_API_Settings.root + '/users',

			model: wp.api.models.User
		}
	);

	/**
	 * Backbone post statuses collection
	 */
	wp.api.collections.PostStatuses = Backbone.Collection.extend(
		/** @lends PostStatuses.prototype */
		{
			url: WP_API_Settings.root + '/posts/statuses',

			model: wp.api.models.PostStatus

		}
	);

	/**
	 * Backbone media library collection
	 */
	wp.api.collections.MediaLibrary = Backbone.Collection.extend(
		/** @lends MediaLibrary.prototype */
		{
			url: WP_API_Settings.root + '/media',

			model: wp.api.models.Media
		}
	);

	/**
	 * Backbone taxonomy collection
	 */
	wp.api.collections.Taxonomies = Backbone.Collection.extend(
		/** @lends Taxonomies.prototype */
		{
			model: wp.api.models.Taxonomy,

			url: WP_API_Settings.root + '/taxonomies'
		}
	);

	/**
	 * Backbone comment collection
	 */
	wp.api.collections.Comments = Backbone.Collection.extend(
		/** @lends Comments.prototype */
		{
			model: wp.api.models.Comment,

			post: null,

			/**
			 * @class Represent an array of comments
			 * @augments Backbone.Collection
			 * @constructs
			 */
			initialize: function( models, options ) {
				if ( options && options.post ) {
					this.post = options.post;
				}
			},

			/**
			 * Return URL for collection
			 *
			 * @returns {string}
			 */
			url: function() {
				return WP_API_Settings.root + '/posts/' + this.post + '/comments';
			}
		}
	);

	/**
	 * Backbone post type collection
	 */
	wp.api.collections.PostTypes = Backbone.Collection.extend(
		/** @lends PostTypes.prototype */
		{
			model: wp.api.models.PostType,

			url: WP_API_Settings.root + '/posts/types'
		}
	);

	/**
	 * Backbone terms collection
	 */
	wp.api.collections.Terms = Backbone.Collection.extend(
		/** @lends Terms.prototype */
		{
			model: wp.api.models.Term,

			type: 'post',

			taxonomy: 'category',

			/**
			 * @class Represent an array of terms
			 * @augments Backbone.Collection
			 * @constructs
			 */
			initialize: function( models, options ) {
				if ( typeof options !== 'undefined' ) {
					if ( options.type ) {
						this.type = options.type;
					}

					if ( options.taxonomy ) {
						this.taxonomy = options.taxonomy;
					}
				}

				this.on( 'add', _.bind( this.addModel, this ) );
			},

			/**
			 * We need to set the type and taxonomy for each model
			 *
			 * @param {Backbone.model} model
			 */
			addModel: function( model ) {
				model.type = this.type;
				model.taxonomy = this.taxonomy;
			},

			/**
			 * Return URL for collection
			 *
			 * @returns {string}
			 */
			url: function() {
				return WP_API_Settings.root + '/posts/types/' + this.type + '/taxonomies/' + this.taxonomy + '/terms/';
			}
		}
	);

	/**
	 * Backbone revisions collection
	 */
	wp.api.collections.Revisions = Backbone.Collection.extend(
		/** @lends Revisions.prototype */
		{
			model: wp.api.models.Revision,

			parent: null,

			/**
			 * @class Represent an array of revisions
			 * @augments Backbone.Collection
			 * @constructs
			 */
			initialize: function( models, options ) {
				if ( options && options.parent ) {
					this.parent = options.parent;
				}
			},

			/**
			 * return URL for collection
			 *
			 * @returns {string}
			 */
			url: function() {
				return WP_API_Settings.root + '/posts/' + this.parent + '/revisions';
			}
		}
	);

})( wp, WP_API_Settings, Backbone, _, window );
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
			'click .load-more':   'loadMore'
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
		query: {},

		initialize: function( options ){
			this.query = options.query;
			this.collection.fetch({ reset: true, data: this.query });
			this.listenTo( this.collection, "reset", this.render );
			this.listenTo( this.collection, "sync", wp.api.ui.position.navigation );

			_.bindAll( this, 'loadMore' );
			wp.api.app.vent.on( "posts:more", this.loadMore );
		},

		loadMore: function(){
			this.page++;
			$( '.navigation a' ).addClass('loading');
			this.query.page = this.page;
			this.collection.fetch({ remove: false, data: this.query });
		},

		/**
		 * Reposition the children as they're added to the Composite View
		 */
		attachHtml: function(collectionView, childView, index){
			wp.api.ui.position.diamonds( childView.$el, index );
			collectionView.$el.append( childView.el );
			wp.api.ui.animate.diamonds( childView.$el, index );
		},

		onRender: function(){
			wp.api.app.single.empty();
		}

	});

	wp.api.views.Single = Backbone.Marionette.ItemView.extend({
		template: "single",
		tagName: 'div',
		className: 'single-post',

		events: {
			'click .close': 'close',
			'click .next' : 'next',
			'click .prev' : 'previous',
			'click a[href^="/"]': 'openArchive'
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

		openArchive: function( e ){
			e.preventDefault();
			wp.api.app.navigate(e.target.getAttribute('href'), { trigger: true });
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
