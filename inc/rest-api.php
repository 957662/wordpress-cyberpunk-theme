<?php
/**
 * Cyberpunk Theme - REST API Endpoints
 *
 * Registers custom REST API endpoints for the theme
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 * @since 2.0.0
 */

defined('ABSPATH') || exit;

/**
 * ============================================
 * 1. INITIALIZATION
 * ============================================
 */

/**
 * Register REST API Routes
 */
function cyberpunk_register_rest_routes() {
    $controller = new Cyberpunk_REST_Controller();
    $controller->register_routes();
}
add_action('rest_api_init', 'cyberpunk_register_rest_routes');

/**
 * ============================================
 * 2. REST API CONTROLLER CLASS
 * ============================================
 */

/**
 * Cyberpunk REST API Controller
 *
 * Provides custom endpoints for theme functionality
 */
class Cyberpunk_REST_Controller extends WP_REST_Controller {

    /**
     * Namespace
     *
     * @var string
     */
    protected $namespace = 'cyberpunk/v1';

    /**
     * Register all routes
     */
    public function register_routes() {

        // Posts endpoints
        register_rest_route($this->namespace, '/posts', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_posts'),
                'permission_callback' => '__return_true',
                'args'                => $this->get_posts_args(),
            ),
        ));

        register_rest_route($this->namespace, '/posts/(?P<id>\d+)', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_post'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'id' => array(
                        'required'          => true,
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        },
                    ),
                ),
            ),
        ));

        // Like endpoint
        register_rest_route($this->namespace, '/posts/(?P<id>\d+)/like', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'like_post'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'id' => array(
                        'required'          => true,
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        },
                    ),
                ),
            ),
        ));

        // Reading progress endpoint
        register_rest_route($this->namespace, '/posts/(?P<id>\d+)/progress', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'save_reading_progress'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'id'       => array(
                        'required'          => true,
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        },
                    ),
                    'progress' => array(
                        'required'          => true,
                        'validate_callback' => function($param) {
                            return is_numeric($param) && $param >= 0 && $param <= 100;
                        },
                    ),
                ),
            ),
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_reading_progress'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'id' => array(
                        'required'          => true,
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        },
                    ),
                ),
            ),
        ));

        // Search endpoint
        register_rest_route($this->namespace, '/search', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'search'),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'query' => array(
                        'required' => true,
                    ),
                    'per_page' => array(
                        'default'           => 10,
                        'sanitize_callback' => 'absint',
                    ),
                'page' => array(
                    'default'           => 1,
                    'sanitize_callback' => 'absint',
                ),
                ),
            ),
        ));

        // Stats endpoint
        register_rest_route($this->namespace, '/stats', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_stats'),
                'permission_callback' => '__return_true',
            ),
        ));

        // Settings endpoint (public settings)
        register_rest_route($this->namespace, '/settings', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_settings'),
                'permission_callback' => '__return_true',
            ),
        ));
    }

    /**
     * Get posts arguments schema
     *
     * @return array
     */
    protected function get_posts_args() {
        return array(
            'page'        => array(
                'default'           => 1,
                'sanitize_callback' => 'absint',
            ),
            'per_page'    => array(
                'default'           => 10,
                'sanitize_callback' => 'absint',
                'maximum'           => 100,
            ),
            'orderby'     => array(
                'default'           => 'date',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'order'       => array(
                'default'           => 'DESC',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'category'    => array(
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'search'      => array(
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'exclude'     => array(
                'sanitize_callback' => 'absint',
            ),
        );
    }

    /**
     * ============================================
     * 3. CALLBACK METHODS
     * ============================================
     */

    /**
     * Get Posts
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response
     */
    public function get_posts($request) {
        $args = array(
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'paged'          => $request->get_param('page'),
            'posts_per_page' => $request->get_param('per_page'),
            'orderby'        => $request->get_param('orderby'),
            'order'          => $request->get_param('order'),
            'post__not_in'   => $request->get_param('exclude') ? array($request->get_param('exclude')) : array(),
        );

        if ($request->get_param('category')) {
            $args['category_name'] = $request->get_param('category');
        }

        if ($request->get_param('search')) {
            $args['s'] = $request->get_param('search');
        }

        $query = new WP_Query($args);
        $posts = array();

        foreach ($query->posts as $post) {
            $posts[] = $this->prepare_post_data($post);
        }

        $response = rest_ensure_response(array(
            'posts'      => $posts,
            'page'       => $request->get_param('page'),
            'per_page'   => $request->get_param('per_page'),
            'total'      => $query->found_posts,
            'total_pages' => $query->max_num_pages,
        ));

        return $response;
    }

    /**
     * Get Single Post
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response|WP_Error
     */
    public function get_post($request) {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);

        if (!$post || 'publish' !== $post->post_status) {
            return new WP_Error('post_not_found', __('Post not found', 'cyberpunk'), array('status' => 404));
        }

        $response = rest_ensure_response($this->prepare_post_data($post, true));
        return $response;
    }

    /**
     * Like/Unlike Post
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response
     */
    public function like_post($request) {
        $post_id = $request->get_param('id');

        if (!post_exists($post_id)) {
            return new WP_Error('invalid_post', __('Invalid post ID', 'cyberpunk'), array('status' => 400));
        }

        $user_id = get_current_user_id();
        $ip_address = $this->get_user_ip();

        // Check if already liked
        $liked = false;
        $like_count = (int) get_post_meta($post_id, '_cyberpunk_like_count', true);

        if ($user_id > 0) {
            $user_likes = get_user_meta($user_id, '_cyberpunk_liked_posts', true);
            $user_likes = $user_likes ? explode(',', $user_likes) : array();
            $liked = in_array($post_id, $user_likes);
        } else {
            $ip_likes = get_post_meta($post_id, '_cyberpunk_liked_ips', true);
            $ip_likes = $ip_likes ? explode(',', $ip_likes) : array();
            $liked = in_array($ip_address, $ip_likes);
        }

        // Toggle like
        if ($liked) {
            $like_count = max(0, $like_count - 1);
            update_post_meta($post_id, '_cyberpunk_like_count', $like_count);

            if ($user_id > 0) {
                $user_likes = array_diff($user_likes, array($post_id));
                update_user_meta($user_id, '_cyberpunk_liked_posts', implode(',', $user_likes));
            } else {
                $ip_likes = array_diff($ip_likes, array($ip_address));
                update_post_meta($post_id, '_cyberpunk_liked_ips', implode(',', $ip_likes));
            }

            $action = 'unliked';
        } else {
            $like_count++;
            update_post_meta($post_id, '_cyberpunk_like_count', $like_count);

            if ($user_id > 0) {
                $user_likes[] = $post_id;
                update_user_meta($user_id, '_cyberpunk_liked_posts', implode(',', $user_likes));
            } else {
                $ip_likes[] = $ip_address;
                update_post_meta($post_id, '_cyberpunk_liked_ips', implode(',', $ip_likes));
            }

            $action = 'liked';
        }

        return rest_ensure_response(array(
            'success'    => true,
            'action'     => $action,
            'like_count' => $like_count,
        ));
    }

    /**
     * Save Reading Progress
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response
     */
    public function save_reading_progress($request) {
        $post_id = $request->get_param('id');
        $progress = $request->get_param('progress');

        $user_id = get_current_user_id();

        if ($user_id > 0) {
            update_user_meta($user_id, '_cyberpunk_rest_reading_progress_' . $post_id, $progress);
        } else {
            $ip_address = $this->get_user_ip();
            set_transient('_cyberpunk_rest_reading_progress_' . $ip_address . '_' . $post_id, $progress, 30 * DAY_IN_SECONDS);
        }

        return rest_ensure_response(array(
            'success'  => true,
            'progress' => $progress,
        ));
    }

    /**
     * Get Reading Progress
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response
     */
    public function get_reading_progress($request) {
        $post_id = $request->get_param('id');
        $user_id = get_current_user_id();

        if ($user_id > 0) {
            $progress = get_user_meta($user_id, '_cyberpunk_rest_reading_progress_' . $post_id, true);
        } else {
            $ip_address = $this->get_user_ip();
            $progress = get_transient('_cyberpunk_rest_reading_progress_' . $ip_address . '_' . $post_id);
        }

        return rest_ensure_response(array(
            'progress' => $progress ? floatval($progress) : 0,
        ));
    }

    /**
     * Search Posts
     *
     * @param WP_REST_Request $request Full request object
     * @return WP_REST_Response
     */
    public function search($request) {
        $query = $request->get_param('query');
        $per_page = $request->get_param('per_page');
        $page = $request->get_param('page');

        $args = array(
            'post_type'      => array('post', 'page'),
            'post_status'    => 'publish',
            's'              => $query,
            'paged'          => $page,
            'posts_per_page' => $per_page,
        );

        $query_obj = new WP_Query($args);
        $posts = array();

        foreach ($query_obj->posts as $post) {
            $posts[] = $this->prepare_post_data($post);
        }

        return rest_ensure_response(array(
            'posts'       => $posts,
            'total'       => $query_obj->found_posts,
            'total_pages' => $query_obj->max_num_pages,
        ));
    }

    /**
     * Get Site Stats
     *
     * @return WP_REST_Response
     */
    public function get_stats() {
        $stats = array(
            'posts_count'      => wp_count_posts()->publish,
            'pages_count'      => wp_count_posts('page')->publish,
            'comments_count'   => wp_count_comments()->approved,
            'categories_count' => wp_count_terms('category'),
            'tags_count'       => wp_count_terms('post_tag'),
        );

        return rest_ensure_response($stats);
    }

    /**
     * Get Public Theme Settings
     *
     * @return WP_REST_Response
     */
    public function get_settings() {
        $settings = array(
            'site_title'       => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'logo_url'         => get_theme_mod('custom_logo') ? wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full') : null,
            'colors'           => array(
                'primary'   => get_theme_mod('cyberpunk_primary_color', '#00f0ff'),
                'secondary' => get_theme_mod('cyberpunk_secondary_color', '#ff00ff'),
            ),
            'features'         => array(
                'scanlines'  => (bool) get_theme_mod('cyberpunk_enable_scanlines', true),
                'glitch'     => (bool) get_theme_mod('cyberpunk_enable_glitch', true),
                'lazyload'   => (bool) get_theme_mod('cyberpunk_enable_lazyload', true),
            ),
        );

        return rest_ensure_response($settings);
    }

    /**
     * ============================================
     * 4. HELPER METHODS
     * ============================================
     */

    /**
     * Prepare Post Data for API Response
     *
     * @param WP_Post $post Post object
     * @param bool    $full  Include full content
     * @return array
     */
    protected function prepare_post_data($post, $full = false) {
        $data = array(
            'id'           => $post->ID,
            'title'        => array(
                'rendered' => get_the_title($post),
            ),
            'excerpt'      => array(
                'rendered' => get_the_excerpt($post),
            ),
            'link'         => get_permalink($post),
            'date'         => get_the_date('c', $post),
            'date_formatted' => get_the_date('', $post),
            'author'       => array(
                'id'     => $post->post_author,
                'name'   => get_the_author_meta('display_name', $post->post_author),
                'link'   => get_author_posts_url($post->post_author),
            ),
            'categories'   => wp_get_post_categories($post->ID, array('fields' => 'names')),
            'tags'         => wp_get_post_tags($post->ID, array('fields' => 'names')),
            'thumbnail'    => get_the_post_thumbnail_url($post->ID, 'full'),
            'thumbnail_medium' => get_the_post_thumbnail_url($post->ID, 'medium'),
            'thumbnail_small'  => get_the_post_thumbnail_url($post->ID, 'thumbnail'),
            'like_count'   => (int) get_post_meta($post->ID, '_cyberpunk_like_count', true),
            'is_liked'     => cyberpunk_is_post_liked($post->ID),
        );

        if ($full) {
            $data['content'] = array(
                'rendered' => apply_filters('the_content', $post->post_content),
            );
        }

        return $data;
    }

    /**
     * Get User IP Address
     *
     * @return string
     */
    protected function get_user_ip() {
        $ip = '';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return sanitize_text_field($ip);
    }
}
