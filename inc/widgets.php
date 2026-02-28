<?php
/**
 * Widget System
 *
 * @package Cyberpunk_Theme
 * @since 2.2.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Load all widgets
 */
function cyberpunk_load_widgets() {
    // Get widget directory
    $widget_dir = get_template_directory() . '/inc/widgets/';

    // Load individual widget files
    $widget_files = array(
        'class-about-me-widget.php',
        'class-recent-posts-widget.php',
        'class-social-links-widget.php',
        'class-popular-posts-widget.php',
    );

    foreach ($widget_files as $file) {
        $file_path = $widget_dir . $file;
        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }

    // Register widgets
    register_widget('Cyberpunk_About_Me_Widget');
    register_widget('Cyberpunk_Recent_Posts_Widget');
    register_widget('Cyberpunk_Social_Links_Widget');
    register_widget('Cyberpunk_Popular_Posts_Widget');
}

/**
 * Register Widget Sidebars
 */
function cyberpunk_widgets_init() {
    // Main Sidebar
    register_sidebar(array(
        'name'          => __('Main Sidebar', 'cyberpunk'),
        'id'            => 'sidebar-1',
        'description'   => __('Main sidebar area', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s cyberpunk-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title cyberpunk-widget-title">',
        'after_title'   => '</h3>',
    ));

    // Footer Widget Area 1
    register_sidebar(array(
        'name'          => __('Footer Column 1', 'cyberpunk'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s cyberpunk-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title cyberpunk-widget-title">',
        'after_title'   => '</h4>',
    ));

    // Footer Widget Area 2
    register_sidebar(array(
        'name'          => __('Footer Column 2', 'cyberpunk'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s cyberpunk-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title cyberpunk-widget-title">',
        'after_title'   => '</h4>',
    ));

    // Footer Widget Area 3
    register_sidebar(array(
        'name'          => __('Footer Column 3', 'cyberpunk'),
        'id'            => 'footer-3',
        'description'   => __('Footer widget area 3', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s cyberpunk-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title cyberpunk-widget-title">',
        'after_title'   => '</h4>',
    ));

    // Footer Widget Area 4
    register_sidebar(array(
        'name'          => __('Footer Column 4', 'cyberpunk'),
        'id'            => 'footer-4',
        'description'   => __('Footer widget area 4', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s cyberpunk-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title cyberpunk-widget-title">',
        'after_title'   => '</h4>',
    ));
}

// Initialize widgets
add_action('widgets_init', 'cyberpunk_widgets_init');
add_action('after_setup_theme', 'cyberpunk_load_widgets');

/**
 * Enqueue Widget Styles and Scripts
 */
function cyberpunk_widget_assets() {
    // Widget Styles
    wp_enqueue_style(
        'cyberpunk-widget-styles',
        get_template_directory_uri() . '/assets/css/widget-styles.css',
        array(),
        '2.2.0'
    );

    // Widget Scripts
    wp_enqueue_script(
        'cyberpunk-widget-scripts',
        get_template_directory_uri() . '/assets/js/widgets.js',
        array('jquery'),
        '2.2.0',
        true
    );

    // Localize script
    wp_localize_script('cyberpunk-widget-scripts', 'cyberpunkWidget', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('cyberpunk_widget_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'cyberpunk_widget_assets');
