<?php

/**
 * Hide any posts with password
 */
function allotrope_hide_password( $query ){
	$query->set( 'has_password', false );
}
add_action( 'pre_get_posts', 'allotrope_hide_password' );
