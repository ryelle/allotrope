<?php

/**
 * Hide any posts with password
 */
function allotrope_hide_password( $query ){
	if ( ! is_admin() ) {
		$query->set( 'has_password', false );
	}
}
add_action( 'pre_get_posts', 'allotrope_hide_password' );

/**
 * Rewrite the URL for nav menus
 */
function allotrope_nav_links( $atts, $item, $args ){
	if ( ! isset( $atts['href'] ) || ! isset( $item->object_id ) ) {
		return $atts;
	}

	$url = home_url();
	$atts['href'] = str_replace( $url, "{$url}/#post/{$item->object_id}", $atts['href'] );

	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'allotrope_nav_links', 10, 3 );