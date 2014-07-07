<?php
/**
 * Force posts per page for the visuals
 */
function allotrope_posts_per_page( $query ) {
	if ( $query->is_main_query() ) {
		$query->set( 'pre_get_posts', 7 );
	}
}
add_action( 'pre_get_posts', 'allotrope_posts_per_page' );
