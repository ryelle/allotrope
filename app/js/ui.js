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

	window.wp = window.wp || {};
	wp.api = wp.api || {};
	wp.api.ui = wp.api.ui || UI;

})( Backbone, _, jQuery, window );