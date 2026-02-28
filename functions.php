<?php
/**
 * Cyberpunk Theme functions and definitions
 *
 * @package Cyberpunk_Theme
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Theme Setup
 */
function cyberpunk_theme_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // Set default thumbnail size
    set_post_thumbnail_size(1200, 675, true);

    // Add custom image sizes
    add_image_size('cyberpunk-featured', 1200, 600, true);
    add_image_size('cyberpunk-card', 600, 400, true);
    add_image_size('cyberpunk-thumbnail', 300, 200, true);

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'cyberpunk'),
        'footer' => __('Footer Menu', 'cyberpunk'),
        'social' => __('Social Menu', 'cyberpunk'),
    ));

    // Switch default core markup to output valid HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add theme support for selective refresh for widgets
    add_theme_support('customize-selective-refresh-widgets');

    // Add support for core custom logo
    add_theme_support('custom-logo', array(
        'height' => 100,
        'width' => 400,
        'flex-width' => true,
        'flex-height' => true,
    ));

    // Add support for wide and full alignment
    add_theme_support('align-wide');

    // Add support for responsive embedded content
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'cyberpunk_theme_setup');

/**
 * Set the content width in pixels
 */
function cyberpunk_content_width() {
    $GLOBALS['content_width'] = apply_filters('cyberpunk_content_width', 1200);
}
add_action('after_setup_theme', 'cyberpunk_content_width', 0);

/**
 * Register widget areas
 */
function cyberpunk_widgets_init() {
    register_sidebar(array(
        'name' => __('Primary Sidebar', 'cyberpunk'),
        'id' => 'sidebar-1',
        'description' => __('Add widgets here to appear in your sidebar.', 'cyberpunk'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h2 class="widget-title">',
        'after_title' => '</h2>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget Area 1', 'cyberpunk'),
        'id' => 'footer-1',
        'description' => __('Add widgets here to appear in the first footer column.', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget Area 2', 'cyberpunk'),
        'id' => 'footer-2',
        'description' => __('Add widgets here to appear in the second footer column.', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));

    register_sidebar(array(
        'name' => __('Footer Widget Area 3', 'cyberpunk'),
        'id' => 'footer-3',
        'description' => __('Add widgets here to appear in the third footer column.', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'cyberpunk_widgets_init');

/**
 * Enqueue scripts and styles
 */
function cyberpunk_scripts() {
    // Main stylesheet
    wp_enqueue_style('cyberpunk-style', get_stylesheet_uri(), array(), '1.0.0');

    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'cyberpunk_scripts');

/**
 * Add custom body classes
 */
function cyberpunk_body_classes($classes) {
    // Adds a class of hfeed to non-singular pages
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }

    // Add cyberpunk-specific body classes
    $classes[] = 'cyberpunk-theme';

    // Add page-specific class
    if (is_front_page()) {
        $classes[] = 'cyberpunk-home';
    } elseif (is_single()) {
        $classes[] = 'cyberpunk-single';
    } elseif (is_archive()) {
        $classes[] = 'cyberpunk-archive';
    } elseif (is_404()) {
        $classes[] = 'cyberpunk-404';
    }

    return $classes;
}
add_filter('body_class', 'cyberpunk_body_classes');

/**
 * Add a pingback url auto-discovery header for single posts
 */
function cyberpunk_pingback_header() {
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'cyberpunk_pingback_header');

/**
 * Excerpt length
 */
function cyberpunk_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'cyberpunk_excerpt_length');

/**
 * Excerpt more string
 */
function cyberpunk_excerpt_more($more) {
    return '... <span class="read-more-link"><a href="' . esc_url(get_permalink()) . '">' . __('[READ_MORE]', 'cyberpunk') . '</a></span>';
}
add_filter('excerpt_more', 'cyberpunk_excerpt_more');

/**
 * Get the copyright year range
 */
function cyberpunk_copyright_years() {
    $first_year = get_option('cyberpunk_start_year', date('Y'));
    $current_year = date('Y');

    if ($first_year == $current_year) {
        return $current_year;
    }

    return $first_year . '–' . $current_year;
}

/**
 * Remove emoji support
 */
function cyberpunk_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('tiny_mce_plugins', 'cyberpunk_disable_emojis_tinymce');
}
add_action('init', 'cyberpunk_disable_emojis');

/**
 * Filter out the tinymce emoji plugin
 */
function cyberpunk_disable_emojis_tinymce($plugins) {
    if (is_array($plugins)) {
        return array_diff($plugins, array('wpemoji'));
    }
    return array();
}

/**
 * Add async/defer attributes to scripts
 */
function cyberpunk_script_loader_tag($tag, $handle, $src) {
    $defer_scripts = array('cyberpunk-script');

    if (in_array($handle, $defer_scripts)) {
        return '<script src="' . $src . '" defer></script>' . "\n";
    }

    return $tag;
}
add_filter('script_loader_tag', 'cyberpunk_script_loader_tag', 10, 3);

/**
 * Add lazy loading to featured images
 */
function cyberpunk_post_thumbnail_attr($attr) {
    $attr['loading'] = 'lazy';
    return $attr;
}
add_filter('wp_get_attachment_image_attributes', 'cyberpunk_post_thumbnail_attr');

/**
 * ============================================
 * LOAD THEME MODULES
 * ============================================
 */

/**
 * Load Enhanced Theme Features
 * This loads all theme modules including:
 * - Customizer
 * - AJAX handlers
 * - Custom post types
 * - REST API
 * - Performance optimizations
 */
function cyberpunk_load_enhanced_features() {
    $integration_file = get_template_directory() . '/inc/theme-integration.php';

    if (file_exists($integration_file)) {
        require_once $integration_file;
    }

    // Load Widget System
    $widgets_file = get_template_directory() . '/inc/widgets.php';

    if (file_exists($widgets_file)) {
        require_once $widgets_file;
    }
}
add_action('after_setup_theme', 'cyberpunk_load_enhanced_features', 10);
