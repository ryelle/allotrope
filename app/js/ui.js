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
		offset: 50,
		duration: 600,

		diamonds: function( diamond, count ){
			var level = count % 7; // [0-6]

			switch (level) {
				case 0:
				case 4:
					diamond.animate({ marginTop: UI.animate.offset + 'px' }, UI.animate.duration, 'easeOutBack');
					break;
				case 1:
				case 3:
				case 6:
					diamond.animate({ marginLeft: UI.animate.offset + 'px' }, UI.animate.duration, 'easeOutBack');
					break;
				case 2:
				case 5:
					diamond.animate({ marginLeft: '-' + UI.animate.offset + 'px' }, UI.animate.duration, 'easeOutBack');
					break;
			}
		}

	}

	window.wp = window.wp || {};
	wp.api = wp.api || {};
	wp.api.ui = wp.api.ui || UI;

})( Backbone, _, jQuery, window );