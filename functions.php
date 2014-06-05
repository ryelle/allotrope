<?php
/**
 * Allotrope functions and definitions
 *
 * @package Allotrope
 */

// @todo Set a real version, time() used for cachebusting.
define( 'ALLOTROPE_VERSION', time() );

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function allotrope_setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 */
	load_theme_textdomain( 'allotrope', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside', 'image', 'gallery', 'video', 'quote', 'link', 'chat', 'audio', 'status'
	) );

}
add_action( 'after_setup_theme', 'allotrope_setup' );


/**
 * Enqueue scripts and styles.
 *  'wp-api-js' handles the Backbone models, views, etc.
 *  'app-init' initializes the app, handles data display.
 *  'allotrope-scripts' handles any interactions/visual JS
 */
function allotrope_scripts() {
	global $wp_scripts;

	wp_enqueue_style( 'allotrope-style', get_stylesheet_uri() );

	wp_enqueue_script( 'wp-api-js', get_template_directory_uri() . '/app/build/js/wp-api.js', array( 'jquery', 'underscore', 'backbone', 'wp-util' ), ALLOTROPE_VERSION, true );
	wp_enqueue_script( 'app-init', get_template_directory_uri() . '/app/js/init.js', array( 'wp-api-js' ), ALLOTROPE_VERSION, true );

	$settings = array(
		'root' => home_url( 'wp-json' ),
	);
	wp_localize_script( 'wp-api-js', 'WP_API_Settings', $settings );

	wp_enqueue_script( 'allotrope-scripts', get_template_directory_uri() . '/assets/js/allotrope.js', array( 'jquery' ), ALLOTROPE_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'allotrope_scripts' );

/**
 * Include our JS templates in the site footer
 */
function allotrope_js_templates() {
	get_template_part( 'js-templates' );
}
add_action( 'wp_footer', 'allotrope_js_templates' );
