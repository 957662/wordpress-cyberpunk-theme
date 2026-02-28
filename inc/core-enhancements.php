<?php
/**
 * Core Enhancements for Cyberpunk Theme
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

// Security check
if (!defined('ABSPATH')) {
    exit;
}

/**
 * ============================================
 * 1. ENQUEUE SCRIPTS & STYLES
 * ============================================
 */

function cyberpunk_enqueue_assets() {
    // Main Stylesheet
    wp_enqueue_style(
        'cyberpunk-style',
        get_stylesheet_uri(),
        array(),
        '2.0.0'
    );

    // Admin Styles
    if (is_admin()) {
        wp_enqueue_style(
            'cyberpunk-admin',
            get_template_directory_uri() . '/assets/css/admin.css',
            array(),
            '2.0.0'
        );
    }

    // Main JavaScript
    wp_enqueue_script(
        'cyberpunk-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array('jquery'),
        '2.0.0',
        true
    );

    // AJAX Script
    wp_enqueue_script(
        'cyberpunk-ajax',
        get_template_directory_uri() . '/assets/js/ajax.js',
        array('jquery'),
        '2.0.0',
        true
    );

    // Localize Script for AJAX
    wp_localize_script('cyberpunk-ajax', 'cyberpunkAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('cyberpunk_nonce'),
        'rest_url' => rest_url('cyberpunk/v1/'),
    ));

    // Comment Reply
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'cyberpunk_enqueue_assets');

/**
 * ============================================
 * 2. THEME CUSTOMIZER
 * ============================================
 */

function cyberpunk_customize_register($wp_customize) {

    // Panel
    $wp_customize->add_panel('cyberpunk_panel', array(
        'title' => __('Cyberpunk Options', 'cyberpunk'),
        'description' => __('Customize your Cyberpunk theme', 'cyberpunk'),
        'priority' => 10,
    ));

    // Colors Section
    $wp_customize->add_section('cyberpunk_colors', array(
        'title' => __('Color Scheme', 'cyberpunk'),
        'panel' => 'cyberpunk_panel',
        'priority' => 10,
    ));

    // Primary Color
    $wp_customize->add_setting('cyberpunk_primary_color', array(
        'default' => '#00f0ff',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_primary_color',
        array(
            'label' => __('Primary Neon Color (Cyan)', 'cyberpunk'),
            'section' => 'cyberpunk_colors',
            'settings' => 'cyberpunk_primary_color',
        )
    ));

    // Secondary Color
    $wp_customize->add_setting('cyberpunk_secondary_color', array(
        'default' => '#ff00ff',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_secondary_color',
        array(
            'label' => __('Secondary Neon Color (Magenta)', 'cyberpunk'),
            'section' => 'cyberpunk_colors',
            'settings' => 'cyberpunk_secondary_color',
        )
    ));

    // Effects Section
    $wp_customize->add_section('cyberpunk_effects', array(
        'title' => __('Visual Effects', 'cyberpunk'),
        'panel' => 'cyberpunk_panel',
        'priority' => 20,
    ));

    // Enable Scanlines
    $wp_customize->add_setting('cyberpunk_scanlines', array(
        'default' => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
    ));

    $wp_customize->add_control('cyberpunk_scanlines', array(
        'label' => __('Enable CRT Scanline Effect', 'cyberpunk'),
        'section' => 'cyberpunk_effects',
        'type' => 'checkbox',
    ));

    // Enable Glitch
    $wp_customize->add_setting('cyberpunk_glitch', array(
        'default' => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
    ));

    $wp_customize->add_control('cyberpunk_glitch', array(
        'label' => __('Enable Glitch Animation', 'cyberpunk'),
        'section' => 'cyberpunk_effects',
        'type' => 'checkbox',
    ));

    // Performance Section
    $wp_customize->add_section('cyberpunk_performance', array(
        'title' => __('Performance', 'cyberpunk'),
        'panel' => 'cyberpunk_panel',
        'priority' => 30,
    ));

    // Enable Lazy Loading
    $wp_customize->add_setting('cyberpunk_lazyload', array(
        'default' => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
    ));

    $wp_customize->add_control('cyberpunk_lazyload', array(
        'label' => __('Enable Lazy Loading', 'cyberpunk'),
        'description' => __('Load images as they enter the viewport', 'cyberpunk'),
        'section' => 'cyberpunk_performance',
        'type' => 'checkbox',
    ));

    // Posts Per Page
    $wp_customize->add_setting('cyberpunk_posts_per_page', array(
        'default' => 6,
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('cyberpunk_posts_per_page', array(
        'label' => __('Posts Per Page', 'cyberpunk'),
        'section' => 'cyberpunk_performance',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 3,
            'max' => 20,
            'step' => 1,
        ),
    ));
}
add_action('customize_register', 'cyberpunk_customize_register');

/**
 * Output Customizer CSS
 */
function cyberpunk_customizer_css() {
    ?>
    <style type="text/css">
        :root {
            --neon-cyan: <?php echo esc_attr(get_theme_mod('cyberpunk_primary_color', '#00f0ff')); ?>;
            --neon-magenta: <?php echo esc_attr(get_theme_mod('cyberpunk_secondary_color', '#ff00ff')); ?>;
        }

        <?php if (!get_theme_mod('cyberpunk_scanlines', true)) : ?>
        body::before {
            display: none !important;
        }
        <?php endif; ?>

        <?php if (!get_theme_mod('cyberpunk_glitch', true)) : ?>
        .glitch {
            animation: none !important;
        }
        <?php endif; ?>
    </style>
    <?php
}
add_action('wp_head', 'cyberpunk_customizer_css');

/**
 * ============================================
 * 3. CUSTOM POST TYPES
 * ============================================
 */

function cyberpunk_register_post_types() {

    // Portfolio CPT
    register_post_type('portfolio', array(
        'labels' => array(
            'name' => __('Portfolio Items', 'cyberpunk'),
            'singular_name' => __('Portfolio Item', 'cyberpunk'),
            'add_new' => __('Add New', 'cyberpunk'),
            'add_new_item' => __('Add New Portfolio Item', 'cyberpunk'),
            'edit_item' => __('Edit Portfolio Item', 'cyberpunk'),
            'new_item' => __('New Portfolio Item', 'cyberpunk'),
            'view_item' => __('View Portfolio Item', 'cyberpunk'),
            'search_items' => __('Search Portfolio', 'cyberpunk'),
            'not_found' => __('No portfolio items found', 'cyberpunk'),
            'not_found_in_trash' => __('No portfolio items in Trash', 'cyberpunk'),
        ),
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'portfolio'),
        'capability_type' => 'post',
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-art',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest' => true,
        'taxonomies' => array('category', 'post_tag'),
    ));

    // Flush rewrite rules on activation
    flush_rewrite_rules();
}
add_action('init', 'cyberpunk_register_post_types');

/**
 * ============================================
 * 4. AJAX HANDLERS
 * ============================================
 */

/**
 * Load More Posts
 */
function cyberpunk_ajax_load_more() {
    check_ajax_referer('cyberpunk_nonce', 'nonce');

    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : get_option('posts_per_page');

    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'paged' => $paged,
        'posts_per_page' => $posts_per_page,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        ob_start();
        while ($query->have_posts()) {
            $query->the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
                <?php if (has_post_thumbnail()) : ?>
                    <div class="post-thumbnail">
                        <a href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium'); ?>
                        </a>
                    </div>
                <?php endif; ?>

                <div class="post-content">
                    <h2 class="entry-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>

                    <div class="entry-meta">
                        <span class="posted-on"><?php echo get_the_date(); ?></span>
                        <span class="byline"><?php the_author(); ?></span>
                    </div>

                    <div class="entry-excerpt">
                        <?php the_excerpt(); ?>
                    </div>

                    <a href="<?php the_permalink(); ?>" class="read-more">
                        <?php _e('Read More', 'cyberpunk'); ?>
                    </a>
                </div>
            </article>
            <?php
        }
        $html = ob_get_clean();

        wp_send_json_success(array(
            'html' => $html,
            'max_pages' => $query->max_num_pages,
            'current_page' => $paged,
        ));
    } else {
        wp_send_json_error(__('No more posts to load', 'cyberpunk'));
    }

    wp_die();
}
add_action('wp_ajax_cyberpunk_load_more', 'cyberpunk_ajax_load_more');
add_action('wp_ajax_nopriv_cyberpunk_load_more', 'cyberpunk_ajax_load_more');

/**
 * Live Search
 */
function cyberpunk_ajax_search() {
    check_ajax_referer('cyberpunk_nonce', 'nonce');

    $search_query = isset($_POST['query']) ? sanitize_text_field($_POST['query']) : '';

    if (empty($search_query) || strlen($search_query) < 3) {
        wp_send_json_error(__('Invalid search query', 'cyberpunk'));
    }

    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        's' => $search_query,
        'posts_per_page' => 5,
    );

    $query = new WP_Query($args);
    $results = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $results[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'excerpt' => get_the_excerpt(),
                'permalink' => get_permalink(),
                'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
            );
        }
    }

    wp_send_json_success(array(
        'results' => $results,
        'count' => count($results),
    ));
}
add_action('wp_ajax_cyberpunk_search', 'cyberpunk_ajax_search');
add_action('wp_ajax_nopriv_cyberpunk_search', 'cyberpunk_ajax_search');

/**
 * ============================================
 * 5. REST API ENDPOINTS
 * ============================================
 */

function cyberpunk_register_rest_routes() {
    register_rest_route('cyberpunk/v1', '/stats', array(
        'methods' => 'GET',
        'callback' => 'cyberpunk_rest_get_stats',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('cyberpunk/v1', '/config', array(
        'methods' => 'GET',
        'callback' => 'cyberpunk_rest_get_config',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'cyberpunk_register_rest_routes');

/**
 * Get Site Stats
 */
function cyberpunk_rest_get_stats($request) {
    $stats = array(
        'posts' => wp_count_posts()->publish,
        'pages' => wp_count_posts('page')->publish,
        'comments' => wp_count_comments()->approved,
        'categories' => wp_count_terms('category'),
        'tags' => wp_count_terms('post_tag'),
    );

    return rest_ensure_response($stats);
}

/**
 * Get Theme Config
 */
function cyberpunk_rest_get_config($request) {
    $config = array(
        'colors' => array(
            'primary' => get_theme_mod('cyberpunk_primary_color', '#00f0ff'),
            'secondary' => get_theme_mod('cyberpunk_secondary_color', '#ff00ff'),
        ),
        'effects' => array(
            'scanlines' => get_theme_mod('cyberpunk_scanlines', true),
            'glitch' => get_theme_mod('cyberpunk_glitch', true),
        ),
        'performance' => array(
            'lazyload' => get_theme_mod('cyberpunk_lazyload', true),
        ),
    );

    return rest_ensure_response($config);
}

/**
 * ============================================
 * 6. PERFORMANCE OPTIMIZATIONS
 * ============================================
 */

/**
 * Disable Emojis (already in functions.php, keeping for completeness)
 */
function cyberpunk_disable_emojis_tinymce($plugins) {
    if (is_array($plugins)) {
        return array_diff($plugins, array('wpemoji'));
    }
    return array();
}

/**
 * Clean up wp_head
 */
function cyberpunk_clean_head() {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
}
add_action('init', 'cyberpunk_clean_head');

/**
 * Defer Non-Critical Scripts
 */
function cyberpunk_defer_scripts($tag, $handle) {
    $defer_scripts = array('cyberpunk-main', 'wp-embed');

    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'cyberpunk_defer_scripts', 10, 2);

/**
 * Add Lazy Loading to Images
 */
function cyberpunk_add_lazy_loading($attr) {
    if (get_theme_mod('cyberpunk_lazyload', true)) {
        $attr['loading'] = 'lazy';
    }
    return $attr;
}
add_filter('wp_get_attachment_image_attributes', 'cyberpunk_add_lazy_loading');

/**
 * ============================================
 * 7. UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Get Post Views
 */
function cyberpunk_get_post_views($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    $views = get_post_meta($post_id, 'cyberpunk_views', true);
    return $views ? intval($views) : 0;
}

/**
 * Increment Post Views
 */
function cyberpunk_set_post_views($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    $views = cyberpunk_get_post_views($post_id);
    update_post_meta($post_id, 'cyberpunk_views', $views + 1);
}

/**
 * Reading Time
 */
function cyberpunk_reading_time() {
    $content = get_post_field('post_content', get_the_ID());
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200); // 200 words per minute

    return $reading_time . ' ' . __('min read', 'cyberpunk');
}

/**
 * Get Excerpt by Length
 */
function cyberpunk_get_excerpt($length = 30) {
    $excerpt = get_the_excerpt();
    $excerpt = explode(' ', $excerpt, $length + 1);

    if (count($excerpt) >= $length) {
        array_pop($excerpt);
        $excerpt = implode(' ', $excerpt);
        $excerpt .= '...';
    } else {
        $excerpt = implode(' ', $excerpt);
    }

    return $excerpt;
}

/**
 * ============================================
 * 8. WIDGET AREAS (Enhanced)
 * ============================================
 */

function cyberpunk_widgets_init() {

    // Primary Sidebar
    register_sidebar(array(
        'name' => __('Primary Sidebar', 'cyberpunk'),
        'id' => 'sidebar-1',
        'description' => __('Main sidebar widget area', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget cyberpunk-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title neon-text">',
        'after_title' => '</h3>',
    ));

    // Footer Widget 1
    register_sidebar(array(
        'name' => __('Footer Column 1', 'cyberpunk'),
        'id' => 'footer-1',
        'description' => __('Footer widget column 1', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="widget-title">',
        'after_title' => '</h4>',
    ));

    // Footer Widget 2
    register_sidebar(array(
        'name' => __('Footer Column 2', 'cyberpunk'),
        'id' => 'footer-2',
        'description' => __('Footer widget column 2', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="widget-title">',
        'after_title' => '</h4>',
    ));

    // Footer Widget 3
    register_sidebar(array(
        'name' => __('Footer Column 3', 'cyberpunk'),
        'id' => 'footer-3',
        'description' => __('Footer widget column 3', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="widget-title">',
        'after_title' => '</h4>',
    ));
}
// Note: This is already in functions.php, but included here for completeness
// add_action('widgets_init', 'cyberpunk_widgets_init');

/**
 * ============================================
 * 9. MISC ENHANCEMENTS
 * ============================================
 */

/**
 * Add Schema.org Markup
 */
function cyberpunk_schema_markup() {
    $schema = array(
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        'name' => get_bloginfo('name'),
        'url' => home_url('/'),
        'potentialAction' => array(
            '@type' => 'SearchAction',
            'target' => home_url('/?s={search_term_string}'),
            'query-input' => 'required name=search_term_string',
        ),
    );

    echo '<script type="application/ld+json">' . wp_json_encode($schema) . '</script>';
}
add_action('wp_head', 'cyberpunk_schema_markup');

/**
 * Custom Excerpt Length
 */
function cyberpunk_excerpt_length($length) {
    return get_theme_mod('cyberpunk_excerpt_length', 30);
}
add_filter('excerpt_length', 'cyberpunk_excerpt_length');

/**
 * Custom Excerpt More
 */
function cyberpunk_excerpt_more($more) {
    return ' ... <a class="read-more" href="' . get_permalink() . '">' . __('[READ_MORE]', 'cyberpunk') . '</a>';
}
add_filter('excerpt_more', 'cyberpunk_excerpt_more');

/**
 * ============================================
 * END OF FILE
 * ============================================
 */
