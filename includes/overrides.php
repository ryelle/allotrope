<?php

/**
 * Hide any posts with password
 */
function allotrope_hide_password( $query ){
	if ( ! is_admin() ) {
		$query->set( 'has_password', false );
		// @todo remove this and handle the long title
		$query->set( 'post__not_in', array( 1175 ) );
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

/**
 * Extension to WP JSON API to create endpoint links to next/previous posts.
 */
class WP_JSON_Posts_Adjacent extends WP_JSON_Posts {
	/**
	 * Register the post-related routes
	 *
	 * @param array $routes Existing routes
	 * @return array Modified routes
	 */
	public function register_routes( $routes ) {
		$post_routes = array(
			'/posts/(?P<id>\d+)/previous' => array(
				array( $this, 'get_previous_post' ), WP_JSON_Server::READABLE
			),

			'/posts/(?P<id>\d+)/next' => array(
				array( $this, 'get_next_post' ), WP_JSON_Server::READABLE
			),
		);
		return array_merge( $routes, $post_routes );
	}

	/**
	 * Get the ID of the post before a given post
	 *
	 * @see WP_JSON_Posts_Adjacent::get_adjacent_post
	 * @param  int  $id  ID of starting post
	 * @return
	 */
	public function get_previous_post( $id ){
		$adj_id = $this->get_adjacent_post( $id );
		return $adj_id;
	}

	/**
	 * Get the ID of the post after a given post
	 *
	 * @see WP_JSON_Posts_Adjacent::get_adjacent_post
	 * @param  int  $id  ID of starting post
	 * @return
	 */
	public function get_next_post( $id ){
		$adj_id = $this->get_adjacent_post( $id, false );
		return $adj_id;
	}

	/**
	 * Get the ID of the post after a given post
	 *
	 * @see get_adjacent_post (in core)
	 * @param  int   $id        ID of starting post
	 * @param  bool  $previous  Optional. Whether to retrieve previous post.
	 * @return mixed  Post ID if successful. Null if the starting post doesn't exist.
	 *                Empty string if no corresponding post exists.
	 */
	public function get_adjacent_post( $id, $previous = true ) {
		global $wpdb;

		if ( ! $post = get_post( $id ) )
			return null;

		$current_post_date = $post->post_date;

		$adjacent = $previous ? 'previous' : 'next';
		$op = $previous ? '<' : '>';
		$order = $previous ? 'DESC' : 'ASC';

		/** This action is documented in wp-includes/link-template.php */
		$where = apply_filters( "get_{$adjacent}_post_where", $wpdb->prepare( "WHERE p.post_date $op %s AND p.post_type = %s AND p.post_status = 'publish'", $current_post_date, $post->post_type) );

		/** This action is documented in wp-includes/link-template.php */
		$sort  = apply_filters( "get_{$adjacent}_post_sort", "ORDER BY p.post_date $order LIMIT 1" );

		$query = "SELECT p.ID FROM $wpdb->posts AS p $where $sort";
		$query_key = 'adjacent_post_' . md5( $query );
		$result = wp_cache_get( $query_key, 'counts' );
		if ( false !== $result ) {
			return $result;
		}

		$result = $wpdb->get_var( $query );
		if ( null === $result ) {
			$result = '';
		}

		wp_cache_set( $query_key, $result, 'counts' );

		return $result;
	}
}

/**
 * Add the Adjacent Posts endpoints to the JSON API
 */
function allotrope_setup_wpapi( $server ){
	$wp_json_posts_adjacent = new WP_JSON_Posts_Adjacent( $server );
	add_filter( 'json_endpoints', array( $wp_json_posts_adjacent, 'register_routes' ), 0 );
}
add_action( 'wp_json_server_before_serve', 'allotrope_setup_wpapi', 10, 1 );


