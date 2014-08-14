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
	$content_width = 500; /* pixels */
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

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'allotrope' ),
	) );

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

	wp_register_script( 'marionette', get_template_directory_uri() . '/app/vendor/backbone.marionette.js', array( 'jquery', 'underscore', 'backbone', 'jquery-effects-core' ), ALLOTROPE_VERSION, true );

	wp_enqueue_script( 'wp-api-js', get_template_directory_uri() . '/app/build/js/wp-api.js', array( 'jquery', 'underscore', 'backbone', 'marionette', 'wp-util' ), ALLOTROPE_VERSION, true );
	wp_enqueue_script( 'app-init', get_template_directory_uri() . '/app/js/init.js', array( 'wp-api-js' ), ALLOTROPE_VERSION, true );

	$settings = array(
		'root' => home_url( 'wp-json' ),
	);
	wp_localize_script( 'wp-api-js', 'WP_API_Settings', $settings );

	// wp_enqueue_script( 'allotrope-scripts', get_template_directory_uri() . '/assets/js/allotrope.js', array( 'jquery' ), ALLOTROPE_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'allotrope_scripts' );

/**
 * Returns the Google font stylesheet URL, if available.
 *
 * The use of Lato and Playfair Display by default is localized.
 * For languages that use characters not supported by either
 * font, the font can be disabled.
 *
 * @since Allotrope 1.0
 *
 * @return string Font stylesheet or empty string if disabled.
 */
function allotrope_fonts_url() {
	$fonts_url = '';

	/* Translators: If there are characters in your language that are not
	 * supported by Lato, translate this to 'off'. Do not translate into
	 * your own language.
	 */
	$lato = _x( 'on', 'Lato font: on or off', 'allotrope' );

	/* Translators: If there are characters in your language that are not
	 * supported by Playfair Display, translate this to 'off'. Do not
	 * translate into your own language.
	 */
	$playfair_display = _x( 'on', 'Playfair Display font: on or off', 'allotrope' );

	if ( 'off' !== $lato || 'off' !== $playfair_display ) {
		$font_families = array();

		if ( 'off' !== $lato )
			$font_families[] = 'Lato:400,400italic,700';

		if ( 'off' !== $playfair_display )
			$font_families[] = 'Playfair+Display:400,400italic,700italic';

		$protocol = is_ssl() ? 'https' : 'http';
		$query_args = array(
			'family' => implode( '|', $font_families ),
			'subset' => 'latin,latin-ext',
		);
		$fonts_url = add_query_arg( $query_args, "$protocol://fonts.googleapis.com/css" );
	}

	return $fonts_url;
}

/**
 * Loads our special font CSS file.
 *
 * To disable in a child theme, use wp_dequeue_style()
 * function mytheme_dequeue_fonts() {
 *     wp_dequeue_style( 'allotrope-fonts' );
 * }
 * add_action( 'wp_enqueue_scripts', 'mytheme_dequeue_fonts', 11 );
 *
 * @since Allotrope 1.0
 *
 * @return void
 */
function allotrope_fonts() {
	$fonts_url = allotrope_fonts_url();
	if ( ! empty( $fonts_url ) )
		wp_enqueue_style( 'allotrope-fonts', esc_url_raw( $fonts_url ), array(), null );
}
add_action( 'wp_enqueue_scripts', 'allotrope_fonts' );

/**
 * Adds additional stylesheets to the TinyMCE editor if needed.
 *
 * @uses allotrope_fonts_url() to get the Google Font stylesheet URL.
 *
 * @since Allotrope 1.0
 *
 * @param string $mce_css CSS path to load in TinyMCE.
 * @return string
 */
function allotrope_mce_css( $mce_css ) {
	$fonts_url = allotrope_fonts_url();

	if ( empty( $fonts_url ) )
		return $mce_css;

	if ( ! empty( $mce_css ) )
		$mce_css .= ',';

	$mce_css .= esc_url_raw( str_replace( ',', '%2C', $fonts_url ) );

	return $mce_css;
}
add_filter( 'mce_css', 'allotrope_mce_css' );

/**
 * Include our JS templates in the site footer
 */
function allotrope_js_templates() {
	get_template_part( 'js-templates' );
}
add_action( 'wp_footer', 'allotrope_js_templates' );

require_once get_template_directory() . '/includes/overrides.php';
