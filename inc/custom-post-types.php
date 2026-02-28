<?php
/**
 * Custom Post Types & Taxonomies
 *
 * Registers Portfolio CPT and related taxonomies
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * ============================================
 * 1. PORTFOLIO CPT
 * ============================================
 */

/**
 * Register Portfolio Custom Post Type
 */
function cyberpunk_register_portfolio_cpt() {
    $labels = array(
        'name'                  => __('Portfolio Items', 'cyberpunk'),
        'singular_name'         => __('Portfolio Item', 'cyberpunk'),
        'menu_name'             => __('Portfolio', 'cyberpunk'),
        'name_admin_bar'        => __('Portfolio', 'cyberpunk'),
        'add_new'               => __('Add New', 'cyberpunk'),
        'add_new_item'          => __('Add New Portfolio Item', 'cyberpunk'),
        'new_item'              => __('New Portfolio Item', 'cyberpunk'),
        'edit_item'             => __('Edit Portfolio Item', 'cyberpunk'),
        'view_item'             => __('View Portfolio Item', 'cyberpunk'),
        'view_items'            => __('View Portfolio Items', 'cyberpunk'),
        'all_items'             => __('All Portfolio Items', 'cyberpunk'),
        'search_items'          => __('Search Portfolio', 'cyberpunk'),
        'parent_item_colon'     => __('Parent Portfolio Items:', 'cyberpunk'),
        'not_found'             => __('No portfolio items found.', 'cyberpunk'),
        'not_found_in_trash'    => __('No portfolio items found in Trash.', 'cyberpunk'),
        'featured_image'        => __('Project Thumbnail', 'cyberpunk'),
        'set_featured_image'    => __('Set project thumbnail', 'cyberpunk'),
        'remove_featured_image' => __('Remove project thumbnail', 'cyberpunk'),
        'use_featured_image'    => __('Use as project thumbnail', 'cyberpunk'),
        'archives'              => __('Portfolio archives', 'cyberpunk'),
        'insert_into_item'      => __('Insert into portfolio item', 'cyberpunk'),
        'uploaded_to_this_item' => __('Uploaded to this portfolio item', 'cyberpunk'),
        'filter_items_list'     => __('Filter portfolio items list', 'cyberpunk'),
        'items_list_navigation' => __('Portfolio items list navigation', 'cyberpunk'),
        'items_list'            => __('Portfolio items list', 'cyberpunk'),
    );

    $args = array(
        'labels'             => $labels,
        'description'        => __('Portfolio project items', 'cyberpunk'),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_nav_menus'  => true,
        'show_in_admin_bar'  => true,
        'show_in_rest'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'portfolio'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-art',
        'supports'           => array(
            'title',
            'editor',
            'thumbnail',
            'excerpt',
            'custom-fields',
            'revisions',
            'author',
            'page-attributes',
        ),
        'template'           => array(
            array(
                'core/paragraph',
                array(
                    'placeholder' => __('Add project description...', 'cyberpunk'),
                ),
            ),
        ),
        'template_lock'      => false,
    );

    register_post_type('portfolio', $args);
}
add_action('init', 'cyberpunk_register_portfolio_cpt');

/**
 * Register Project Category Taxonomy
 */
function cyberpunk_register_project_taxonomy() {
    $labels = array(
        'name'                       => __('Project Categories', 'cyberpunk'),
        'singular_name'              => __('Project Category', 'cyberpunk'),
        'menu_name'                  => __('Categories', 'cyberpunk'),
        'all_items'                  => __('All Categories', 'cyberpunk'),
        'edit_item'                  => __('Edit Category', 'cyberpunk'),
        'view_item'                  => __('View Category', 'cyberpunk'),
        'update_item'                => __('Update Category', 'cyberpunk'),
        'add_new_item'               => __('Add New Category', 'cyberpunk'),
        'new_item_name'              => __('New Category Name', 'cyberpunk'),
        'parent_item'                => __('Parent Category', 'cyberpunk'),
        'parent_item_colon'          => __('Parent Category:', 'cyberpunk'),
        'search_items'               => __('Search Categories', 'cyberpunk'),
        'popular_items'              => __('Popular Categories', 'cyberpunk'),
        'separate_items_with_commas' => __('Separate categories with commas', 'cyberpunk'),
        'add_or_remove_items'        => __('Add or remove categories', 'cyberpunk'),
        'choose_from_most_used'      => __('Choose from the most used', 'cyberpunk'),
        'not_found'                  => __('No categories found.', 'cyberpunk'),
        'no_terms'                   => __('No categories', 'cyberpunk'),
        'items_list_navigation'      => __('Categories list navigation', 'cyberpunk'),
        'items_list'                 => __('Categories list', 'cyberpunk'),
        'most_used'                  => __('Most Used', 'cyberpunk'),
        'back_to_items'              => __('&larr; Back to Categories', 'cyberpunk'),
    );

    $args = array(
        'labels'            => $labels,
        'description'       => __('Project categories', 'cyberpunk'),
        'public'            => true,
        'publicly_queryable' => true,
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_in_nav_menus' => true,
        'show_in_rest'      => true,
        'show_tagcloud'     => true,
        'show_in_quick_edit' => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'project-category', 'hierarchical' => true),
    );

    register_taxonomy('project_category', array('portfolio'), $args);
}
add_action('init', 'cyberpunk_register_project_taxonomy');

/**
 * Register Project Skills Taxonomy (Flat, like tags)
 */
function cyberpunk_register_project_skills_taxonomy() {
    $labels = array(
        'name'                       => __('Project Skills', 'cyberpunk'),
        'singular_name'              => __('Project Skill', 'cyberpunk'),
        'menu_name'                  => __('Skills', 'cyberpunk'),
        'all_items'                  => __('All Skills', 'cyberpunk'),
        'edit_item'                  => __('Edit Skill', 'cyberpunk'),
        'view_item'                  => __('View Skill', 'cyberpunk'),
        'update_item'                => __('Update Skill', 'cyberpunk'),
        'add_new_item'               => __('Add New Skill', 'cyberpunk'),
        'new_item_name'              => __('New Skill Name', 'cyberpunk'),
        'parent_item'                => null,
        'parent_item_colon'          => null,
        'search_items'               => __('Search Skills', 'cyberpunk'),
        'popular_items'              => __('Popular Skills', 'cyberpunk'),
        'separate_items_with_commas' => __('Separate skills with commas', 'cyberpunk'),
        'add_or_remove_items'        => __('Add or remove skills', 'cyberpunk'),
        'choose_from_most_used'      => __('Choose from the most used', 'cyberpunk'),
        'not_found'                  => __('No skills found.', 'cyberpunk'),
        'no_terms'                   => __('No skills', 'cyberpunk'),
        'items_list_navigation'      => __('Skills list navigation', 'cyberpunk'),
        'items_list'                 => __('Skills list', 'cyberpunk'),
        'most_used'                  => __('Most Used', 'cyberpunk'),
        'back_to_items'              => __('&larr; Back to Skills', 'cyberpunk'),
    );

    $args = array(
        'labels'            => $labels,
        'description'       => __('Project skills and technologies', 'cyberpunk'),
        'public'            => true,
        'publicly_queryable' => true,
        'hierarchical'      => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_in_nav_menus' => true,
        'show_in_rest'      => true,
        'show_tagcloud'     => true,
        'show_in_quick_edit' => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'project-skill'),
    );

    register_taxonomy('project_skill', array('portfolio'), $args);
}
add_action('init', 'cyberpunk_register_project_skills_taxonomy');

/**
 * Change "Enter title here" text for Portfolio CPT
 */
function cyberpunk_change_portfolio_title_text($title) {
    $screen = get_current_screen();

    if ('portfolio' === $screen->post_type) {
        $title = __('Enter project name...', 'cyberpunk');
    }

    return $title;
}
add_filter('enter_title_here', 'cyberpunk_change_portfolio_title_text');

/**
 * ============================================
 * 2. CUSTOM META BOXES
 * ============================================
 */

/**
 * Register Portfolio Meta Boxes
 */
function cyberpunk_register_portfolio_meta_boxes() {
    add_meta_box(
        'portfolio_details',
        __('Project Details', 'cyberpunk'),
        'cyberpunk_portfolio_details_callback',
        'portfolio',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'cyberpunk_register_portfolio_meta_boxes');

/**
 * Portfolio Details Meta Box Callback
 */
function cyberpunk_portfolio_details_callback($post) {
    wp_nonce_field('cyberpunk_portfolio_meta', 'cyberpunk_portfolio_nonce');

    $year = get_post_meta($post->ID, '_portfolio_year', true);
    $client = get_post_meta($post->ID, '_portfolio_client', true);
    $url = get_post_meta($post->ID, '_portfolio_url', true);
    $github = get_post_meta($post->ID, '_portfolio_github', true);
    $technologies = get_post_meta($post->ID, '_portfolio_technologies', true);
    ?>

    <div class="cyberpunk-meta-box">
        <div class="meta-field">
            <label for="portfolio_year"><?php _e('Project Year', 'cyberpunk'); ?></label>
            <input type="number" id="portfolio_year" name="portfolio_year" value="<?php echo esc_attr($year); ?>" class="widefat">
        </div>

        <div class="meta-field">
            <label for="portfolio_client"><?php _e('Client Name', 'cyberpunk'); ?></label>
            <input type="text" id="portfolio_client" name="portfolio_client" value="<?php echo esc_attr($client); ?>" class="widefat">
        </div>

        <div class="meta-field">
            <label for="portfolio_url"><?php _e('Live Demo URL', 'cyberpunk'); ?></label>
            <input type="url" id="portfolio_url" name="portfolio_url" value="<?php echo esc_attr($url); ?>" class="widefat" placeholder="https://">
        </div>

        <div class="meta-field">
            <label for="portfolio_github"><?php _e('GitHub Repository URL', 'cyberpunk'); ?></label>
            <input type="url" id="portfolio_github" name="portfolio_github" value="<?php echo esc_attr($github); ?>" class="widefat" placeholder="https://github.com/">
        </div>

        <div class="meta-field">
            <label for="portfolio_technologies"><?php _e('Technologies (comma-separated)', 'cyberpunk'); ?></label>
            <input type="text" id="portfolio_technologies" name="portfolio_technologies" value="<?php echo esc_attr($technologies); ?>" class="widefat" placeholder="e.g., React, WordPress, PHP, JavaScript">
            <small><?php _e('Enter technologies separated by commas', 'cyberpunk'); ?></small>
        </div>
    </div>

    <style>
        .cyberpunk-meta-box {
            background: #0a0a0f;
            padding: 15px;
            border: 1px solid #00f0ff;
        }
        .cyberpunk-meta-box .meta-field {
            margin-bottom: 15px;
        }
        .cyberpunk-meta-box label {
            display: block;
            color: #00f0ff;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .cyberpunk-meta-box input {
            background: #1a1a2e;
            border: 1px solid #333;
            color: #e0e0e0;
            padding: 8px;
            width: 100%;
        }
        .cyberpunk-meta-box input:focus {
            border-color: #00f0ff;
            outline: none;
        }
    </style>
    <?php
}

/**
 * Save Portfolio Meta Data
 */
function cyberpunk_save_portfolio_meta($post_id) {
    // Check nonce
    if (!isset($_POST['cyberpunk_portfolio_nonce']) || !wp_verify_nonce($_POST['cyberpunk_portfolio_nonce'], 'cyberpunk_portfolio_meta')) {
        return;
    }

    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save fields
    $fields = array('portfolio_year', 'portfolio_client', 'portfolio_url', 'portfolio_github', 'portfolio_technologies');

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_portfolio', 'cyberpunk_save_portfolio_meta');

/**
 * ============================================
 * 3. PORTFOLIO COLUMNS
 * ============================================
 */

/**
 * Add custom columns to Portfolio list
 */
function cyberpunk_portfolio_custom_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['thumbnail'] = __('Thumbnail', 'cyberpunk');
    $new_columns['title'] = $columns['title'];
    $new_columns['taxonomy-project_category'] = __('Categories', 'cyberpunk');
    $new_columns['taxonomy-project_skill'] = __('Skills', 'cyberpunk');
    $new_columns['year'] = __('Year', 'cyberpunk');
    $new_columns['date'] = $columns['date'];

    return $new_columns;
}
add_filter('manage_portfolio_posts_columns', 'cyberpunk_portfolio_custom_columns');

/**
 * Populate custom columns
 */
function cyberpunk_portfolio_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'thumbnail':
            the_post_thumbnail('thumbnail');
            break;

        case 'year':
            $year = get_post_meta($post_id, '_portfolio_year', true);
            echo $year ? esc_html($year) : '&mdash;';
            break;
    }
}
add_action('manage_portfolio_posts_custom_column', 'cyberpunk_portfolio_custom_column_content', 10, 2);

/**
 * Make columns sortable
 */
function cyberpunk_portfolio_sortable_columns($columns) {
    $columns['year'] = 'portfolio_year';
    return $columns;
}
add_filter('manage_edit-portfolio_sortable_columns', 'cyberpunk_portfolio_sortable_columns');

/**
 * Sort by year
 */
function cyberpunk_portfolio_orderby($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    if ($query->get('post_type') === 'portfolio' && $query->get('orderby') === 'portfolio_year') {
        $query->set('meta_key', '_portfolio_year');
        $query->set('orderby', 'meta_value_num');
    }
}
add_action('pre_get_posts', 'cyberpunk_portfolio_orderby');

/**
 * ============================================
 * 4. FLUSH REWRITE RULES
 * ============================================
 */

/**
 * Flush rewrite rules on activation
 */
function cyberpunk_activate_portfolio() {
    cyberpunk_register_portfolio_cpt();
    cyberpunk_register_project_taxonomy();
    cyberpunk_register_project_skills_taxonomy();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'cyberpunk_activate_portfolio');

/**
 * Flush rewrite rules on deactivation
 */
function cyberpunk_deactivate_portfolio() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'cyberpunk_deactivate_portfolio');
