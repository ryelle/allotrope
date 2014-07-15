
(function( wp, $, window, undefined ) {

	var App = Backbone.Router.extend({

		routes: {
			'':             'default',
			'post/:id':     'single'
		},

		default: function() {
			var index = new wp.api.views.Index();
			$('#content').html( index.render().el );
		},

		single: function( id ) {
			var single = new wp.api.views.Single({
				model: new wp.api.models.Post({ ID: id })
			});
			if ( ! $('#content .single-post').length ){
				$('#content').prepend( '<div class="single-post"></div>' );
			}
			$('#content .single-post').hide();
			$('#content .single-post').html( single.render().el );
			$( window ).scrollTop(0);
		}
	});

	wp.api.app = new App();
	Backbone.history.start();

})( wp, jQuery, window );
