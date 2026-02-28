<?php
/**
 * Cyberpunk Theme - Integration File
 *
 * Loads all theme modules and sets up the framework
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * ============================================
 * 1. LOAD THEME MODULES
 * ============================================
 */

/**
 * Load Core Theme Files
 */
function cyberpunk_load_modules() {

    $theme_dir = get_template_directory();

    /**
     * Required Files
     */
    $required_files = array(
        // Customizer
        $theme_dir . '/inc/customizer.php',

        // AJAX Handlers
        $theme_dir . '/inc/ajax-handlers.php',

        // REST API
        $theme_dir . '/inc/rest-api.php',

        // Core Enhancements
        $theme_dir . '/inc/core-enhancements.php',

        // Future modules:
        // $theme_dir . '/inc/custom-post-types.php',
        // $theme_dir . '/inc/widgets.php',
        // $theme_dir . '/inc/performance.php',
    );

    /**
     * Load files if they exist
     */
    foreach ($required_files as $file) {
        if (file_exists($file)) {
            require_once $file;
        }
    }

    /**
     * Load optional modules
     */
    // AJAX Handlers
    if (file_exists($theme_dir . '/inc/ajax-handlers.php')) {
        require_once $theme_dir . '/inc/ajax-handlers.php';
    }

    // Custom Post Types
    if (file_exists($theme_dir . '/inc/custom-post-types.php')) {
        require_once $theme_dir . '/inc/custom-post-types.php';
    }

    // REST API
    if (file_exists($theme_dir . '/inc/rest-api.php')) {
        require_once $theme_dir . '/inc/rest-api.php';
    }

    // Widgets
    if (file_exists($theme_dir . '/inc/widgets.php')) {
        require_once $theme_dir . '/inc/widgets.php';
    }

    // Performance
    if (file_exists($theme_dir . '/inc/performance.php')) {
        require_once $theme_dir . '/inc/performance.php';
    }
}
add_action('after_setup_theme', 'cyberpunk_load_modules', 5);

/**
 * ============================================
 * 2. ENQUEUE SCRIPTS AND STYLES
 * ============================================
 */

/**
 * Enqueue Frontend Assets
 */
function cyberpunk_enqueue_assets() {

    $theme_dir = get_template_directory_uri();
    $theme_version = wp_get_theme()->get('Version');

    /**
     * Stylesheets
     */
    // Main stylesheet
    wp_enqueue_style(
        'cyberpunk-style',
        get_stylesheet_uri(),
        array(),
        $theme_version
    );

    // Admin styles (only if needed)
    if (file_exists(get_template_directory() . '/assets/css/admin.css')) {
        wp_enqueue_style(
            'cyberpunk-admin',
            $theme_dir . '/assets/css/admin.css',
            array(),
            $theme_version
        );
    }

    // Main JavaScript styles
    if (file_exists(get_template_directory() . '/assets/css/main-styles.css')) {
        wp_enqueue_style(
            'cyberpunk-main-styles',
            $theme_dir . '/assets/css/main-styles.css',
            array('cyberpunk-style'),
            $theme_version
        );
    }

    /**
     * Scripts
     */
    // Main Theme JavaScript
    if (file_exists(get_template_directory() . '/assets/js/main.js')) {
        wp_enqueue_script(
            'cyberpunk-main',
            $theme_dir . '/assets/js/main.js',
            array(),
            $theme_version,
            true
        );

        // Localize script for main.js
        wp_localize_script('cyberpunk-main', 'cyberpunkAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('cyberpunk_nonce'),
            'rest_url' => rest_url('cyberpunk/v1/'),
            'features' => array(
                'backToTop' => true,
                'lazyLoad' => true,
                'neonEffects' => true,
            ),
            'strings' => array(
                'loading' => __('Loading...', 'cyberpunk'),
                'error' => __('Error. Try again.', 'cyberpunk'),
                'no_results' => __('No results found', 'cyberpunk'),
            ),
        ));
    }

    // AJAX Functions (requires jQuery)
    if (file_exists(get_template_directory() . '/assets/js/ajax.js')) {
        wp_enqueue_script(
            'cyberpunk-ajax',
            $theme_dir . '/assets/js/ajax.js',
            array('jquery', 'cyberpunk-main'),
            $theme_version,
            true
        );
    }

    // Comment reply
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }

    /**
     * Defer non-critical scripts
     */
    add_filter('script_loader_tag', 'cyberpunk_defer_scripts', 10, 2);
}
add_action('wp_enqueue_scripts', 'cyberpunk_enqueue_assets');

/**
 * ============================================
 * 3. PERFORMANCE OPTIMIZATIONS
 * ============================================

/**
 * Defer JavaScript Loading
 */
function cyberpunk_defer_scripts($tag, $handle) {
    $defer_scripts = array('cyberpunk-main', 'cyberpunk-ajax');

    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}

/**
 * ============================================
 * 4. TEMPLATE TAGS
 * ============================================
 */

/**
 * Get Theme Option
 */
function cyberpunk_get_option($key, $default = '') {
    return get_theme_mod($key, $default);
}

/**
 * Echo Theme Option
 */
function cyberpunk_option($key, $default = '') {
    echo esc_attr(cyberpunk_get_option($key, $default));
}

/**
 * Check if Feature is Enabled
 */
function cyberpunk_is_enabled($feature) {
    return (bool) get_theme_mod($feature, true);
}

/**
 * ============================================
 * 5. BODY CLASSES
 * ============================================

/**
 * Add Custom Body Classes
 */
function cyberpunk_body_classes($classes) {

    // Effects classes
    if (!cyberpunk_is_enabled('cyberpunk_enable_scanlines')) {
        $classes[] = 'no-scanlines';
    }

    if (!cyberpunk_is_enabled('cyberpunk_enable_glitch')) {
        $classes[] = 'no-glitch';
    }

    // Layout classes
    if (!cyberpunk_is_enabled('cyberpunk_enable_sidebar')) {
        $classes[] = 'no-sidebar';
    }

    // Animation speed
    $animation_speed = cyberpunk_get_option('cyberpunk_animation_speed', 'normal');
    $classes[] = 'animation-speed-' . $animation_speed;

    return $classes;
}
add_filter('body_class', 'cyberpunk_body_classes');

/**
 * ============================================
 * 6. EXCERPT CUSTOMIZATION
 * ============================================

/**
 * Custom Excerpt Length
 */
function cyberpunk_excerpt_length($length) {
    $posts_per_page = cyberpunk_get_option('cyberpunk_posts_per_page', 6);

    // Adjust excerpt length based on posts per page
    if ($posts_per_page > 6) {
        return 20;
    } elseif ($posts_per_page < 6) {
        return 40;
    }

    return 30;
}
add_filter('excerpt_length', 'cyberpunk_excerpt_length');

/**
 * Custom Excerpt More
 */
function cyberpunk_excerpt_more($more) {
    return ' <span class="read-more-link"><a href="' . esc_url(get_permalink()) . '">' .
           __('[READ_MORE]', 'cyberpunk') . '</a></span>';
}
add_filter('excerpt_more', 'cyberpunk_excerpt_more');

/**
 * ============================================
 * 7. PRELOAD RESOURCES
 * ============================================

/**
 * Preconnect to External Resources
 */
function cyberpunk_resource_hints($urls, $relation_type) {
    if ('preconnect' === $relation_type) {
        // Add preconnect hints for Google Fonts (if used)
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
            'crossorigin',
        );
    }
    return $urls;
}
add_filter('wp_resource_hints', 'cyberpunk_resource_hints', 10, 2);

/**
 * ============================================
 * 8. MODIFY POSTS PER PAGE
 * ============================================

/**
 * Custom Posts Per Page
 */
function cyberpunk_posts_per_page($query) {

    if (!is_admin() && $query->is_main_query()) {
        $posts_per_page = cyberpunk_get_option('cyberpunk_posts_per_page', 6);

        if ($posts_per_page && is_numeric($posts_per_page)) {
            $query->set('posts_per_page', intval($posts_per_page));
        }
    }

    return $query;
}
add_action('pre_get_posts', 'cyberpunk_posts_per_page');

/**
 * ============================================
 * 9. CLEANUP HEAD
 * ============================================

/**
 * Clean WordPress Head
 */
function cyberpunk_clean_head() {

    // Remove WordPress version
    remove_action('wp_head', 'wp_generator');

    // Remove RSD link
    remove_action('wp_head', 'rsd_link');

    // Remove Windows Live Writer
    remove_action('wp_head', 'wlwmanifest_link');

    // Remove shortlink
    remove_action('wp_head', 'wp_shortlink_wp_head');

    // Remove emoji detection script
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'cyberpunk_clean_head');

/**
 * ============================================
 * 10. LAZY LOADING
 * ============================================

/**
 * Add Lazy Loading to Images
 */
function cyberpunk_lazy_loading_attr($attr, $attachment, $size) {

    if (cyberpunk_is_enabled('cyberpunk_enable_lazyload')) {
        $attr['loading'] = 'lazy';
    }

    return $attr;
}
add_filter('wp_get_attachment_image_attributes', 'cyberpunk_lazy_loading_attr', 10, 3);

/**
 * ============================================
 * 11. CUSTOMIZER SETTINGS FOR ADMIN
 * ============================================

/**
 * Add Customizer Contextual Help
 */
function cyberpunk_customizer_help() {
    $screen = get_current_screen();

    if ($screen && 'customize' === $screen->base) {
        $help_content = '
            <h3>' . __('Cyberpunk Theme Help', 'cyberpunk') . '</h3>
            <p>' . __('Welcome to the Cyberpunk Theme Customizer!', 'cyberpunk') . '</p>
            <p><strong>' . __('Quick Tips:', 'cyberpunk') . '</strong></p>
            <ul>
                <li>' . __('Use the Color Scheme section to customize neon colors', 'cyberpunk') . '</li>
                <li>' . __('Toggle visual effects on or off in Visual Effects', 'cyberpunk') . '</li>
                <li>' . __('Adjust layout settings in the Layout section', 'cyberpunk') . '</li>
                <li>' . __('Enable performance optimizations in Performance', 'cyberpunk') . '</li>
            </ul>
        ';

        get_current_screen()->add_help_tab(array(
            'id' => 'cyberpunk-theme-help',
            'title' => __('Cyberpunk Theme', 'cyberpunk'),
            'content' => $help_content,
        ));
    }
}
add_action('admin_head', 'cyberpunk_customizer_help');

/**
 * ============================================
 * 12. SECURITY ENHANCEMENTS
 * ============================================

/**
 * Add Security Headers
 */
function cyberpunk_security_headers() {

    if (!is_admin()) {
        // X-Frame-Options
        header('X-Frame-Options: SAMEORIGIN');

        // X-Content-Type-Options
        header('X-Content-Type-Options: nosniff');

        // X-XSS-Protection
        header('X-XSS-Protection: 1; mode=block');

        // Referrer-Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
}
add_action('send_headers', 'cyberpunk_security_headers');
