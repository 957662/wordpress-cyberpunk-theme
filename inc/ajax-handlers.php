<?php
/**
 * Cyberpunk Theme - AJAX Handlers
 *
 * Handles all AJAX requests for the theme
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
 * Register AJAX Actions
 * Both for logged-in users and guests
 */
function cyberpunk_register_ajax_handlers() {

    // Logged-in users
    add_action('wp_ajax_cyberpunk_like_post', 'cyberpunk_ajax_like_post');
    add_action('wp_ajax_cyberpunk_save_reading_progress', 'cyberpunk_ajax_save_reading_progress');
    add_action('wp_ajax_cyberpunk_load_more_posts', 'cyberpunk_ajax_load_more_posts');
    add_action('wp_ajax_cyberpunk_live_search', 'cyberpunk_ajax_live_search');
    add_action('wp_ajax_cyberpunk_bookmark_post', 'cyberpunk_ajax_bookmark_post');
    add_action('wp_ajax_cyberpunk_submit_comment', 'cyberpunk_ajax_submit_comment');

    // Guest users (without specific capabilities)
    add_action('wp_ajax_nopriv_cyberpunk_like_post', 'cyberpunk_ajax_like_post');
    add_action('wp_ajax_nopriv_cyberpunk_load_more_posts', 'cyberpunk_ajax_load_more_posts');
    add_action('wp_ajax_nopriv_cyberpunk_live_search', 'cyberpunk_ajax_live_search');
}
add_action('init', 'cyberpunk_register_ajax_handlers');

/**
 * ============================================
 * 2. UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Send AJAX Response
 *
 * @param bool   $success    Whether the request was successful
 * @param string $message    Response message
 * @param mixed  $data       Additional data
 * @param int    $status_code HTTP status code
 */
function cyberpunk_ajax_response($success, $message, $data = array(), $status_code = 200) {
    status_header($status_code);

    wp_send_json(array(
        'success' => $success,
        'message' => $message,
        'data'    => $data,
    ));
}

/**
 * Verify AJAX Nonce
 *
 * @param string $nonce  Nonce value
 * @param string $action Nonce action
 * @return bool
 */
function cyberpunk_verify_ajax_nonce($nonce = '', $action = 'cyberpunk_nonce') {
    if (empty($nonce)) {
        $nonce = isset($_POST['nonce']) ? $_POST['nonce'] : '';
    }

    if (!wp_verify_nonce($nonce, $action)) {
        cyberpunk_ajax_response(false, __('Security check failed.', 'cyberpunk'), array(), 403);
        return false;
    }

    return true;
}

/**
 * ============================================
 * 3. POST LIKE SYSTEM
 * ============================================ */

/**
 * Handle Post Like/Unlike
 *
 * Stores likes in post_meta for count
 * Stores user likes in user_meta for tracking
 */
function cyberpunk_ajax_like_post() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    // Get post ID
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

    if (!$post_id || !post_exists($post_id)) {
        cyberpunk_ajax_response(false, __('Invalid post ID.', 'cyberpunk'));
        return;
    }

    // Get current user ID
    $user_id = get_current_user_id();
    $ip_address = cyberpunk_get_user_ip();

    // Check if already liked (by user or IP for guests)
    $liked = false;
    $like_count = (int) get_post_meta($post_id, '_cyberpunk_like_count', true);

    if ($user_id > 0) {
        // Logged-in user
        $user_likes = get_user_meta($user_id, '_cyberpunk_liked_posts', true);
        $user_likes = $user_likes ? explode(',', $user_likes) : array();
        $liked = in_array($post_id, $user_likes);
    } else {
        // Guest user - check by IP
        $ip_likes = get_post_meta($post_id, '_cyberpunk_liked_ips', true);
        $ip_likes = $ip_likes ? explode(',', $ip_likes) : array();
        $liked = in_array($ip_address, $ip_likes);
    }

    // Toggle like status
    if ($liked) {
        // Unlike
        $like_count = max(0, $like_count - 1);
        update_post_meta($post_id, '_cyberpunk_like_count', $like_count);

        // Remove from user's liked posts
        if ($user_id > 0) {
            $user_likes = array_diff($user_likes, array($post_id));
            update_user_meta($user_id, '_cyberpunk_liked_posts', implode(',', $user_likes));
        } else {
            $ip_likes = array_diff($ip_likes, array($ip_address));
            update_post_meta($post_id, '_cyberpunk_liked_ips', implode(',', $ip_likes));
        }

        $message = __('Post unliked', 'cyberpunk');
        $action = 'unliked';
    } else {
        // Like
        $like_count++;
        update_post_meta($post_id, '_cyberpunk_like_count', $like_count);

        // Add to user's liked posts
        if ($user_id > 0) {
            $user_likes[] = $post_id;
            update_user_meta($user_id, '_cyberpunk_liked_posts', implode(',', $user_likes));
        } else {
            $ip_likes[] = $ip_address;
            update_post_meta($post_id, '_cyberpunk_liked_ips', implode(',', $ip_likes));
        }

        $message = __('Post liked', 'cyberpunk');
        $action = 'liked';
    }

    // Send response
    cyberpunk_ajax_response(true, $message, array(
        'post_id'     => $post_id,
        'like_count'  => $like_count,
        'action'      => $action,
        'like_text'   => $like_count === 1 ? __('1 Like', 'cyberpunk') : sprintf(__('%d Likes', 'cyberpunk'), $like_count),
    ));
}

/**
 * ============================================
 * 4. READING PROGRESS SYSTEM
 * ============================================
 */

/**
 * Save Reading Progress
 *
 * Saves how far a user has read in a post
 */
function cyberpunk_ajax_save_reading_progress() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $progress = isset($_POST['progress']) ? floatval($_POST['progress']) : 0;

    if (!$post_id || !post_exists($post_id)) {
        cyberpunk_ajax_response(false, __('Invalid post ID.', 'cyberpunk'));
        return;
    }

    // Clamp progress between 0 and 100
    $progress = max(0, min(100, $progress));

    $user_id = get_current_user_id();

    if ($user_id > 0) {
        // Save to user meta for logged-in users
        update_user_meta($user_id, '_cyberpunk_reading_progress_' . $post_id, $progress);
    } else {
        // Save to transient for guests (expires in 30 days)
        $ip_address = cyberpunk_get_user_ip();
        set_transient('_cyberpunk_reading_progress_' . $ip_address . '_' . $post_id, $progress, 30 * DAY_IN_SECONDS);
    }

    cyberpunk_ajax_response(true, __('Reading progress saved.', 'cyberpunk'), array(
        'post_id'  => $post_id,
        'progress' => $progress,
    ));
}

/**
 * Get Reading Progress
 *
 * @param int $post_id Post ID
 * @param int $user_id User ID (optional)
 * @return float Progress percentage
 */
function cyberpunk_get_reading_progress($post_id, $user_id = 0) {
    if (empty($user_id)) {
        $user_id = get_current_user_id();
    }

    if ($user_id > 0) {
        return (float) get_user_meta($user_id, '_cyberpunk_reading_progress_' . $post_id, true);
    } else {
        $ip_address = cyberpunk_get_user_ip();
        return (float) get_transient('_cyberpunk_reading_progress_' . $ip_address . '_' . $post_id);
    }
}

/**
 * ============================================
 * 5. INFINITE SCROLL / LOAD MORE
 * ============================================
 */

/**
 * Load More Posts
 *
 * Returns HTML for next page of posts
 */
function cyberpunk_ajax_load_more_posts() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    $page = isset($_POST['page']) ? intval($_POST['page']) : 2;
    $posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : 6;
    $post_type = isset($_POST['post_type']) ? sanitize_text_field($_POST['post_type']) : 'post';
    $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';

    // Build query args
    $args = array(
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'paged'          => $page,
        'posts_per_page' => $posts_per_page,
        'post__not_in'   => get_option('sticky_posts'),
    );

    // Add category filter if specified
    if (!empty($category)) {
        $args['category_name'] = $category;
    }

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        ob_start();

        while ($query->have_posts()) {
            $query->the_post();
            get_template_part('template-parts/content', get_post_format());
        }

        $html = ob_get_clean();

        wp_reset_postdata();

        cyberpunk_ajax_response(true, __('Posts loaded successfully.', 'cyberpunk'), array(
            'html'       => $html,
            'page'       => $page,
            'max_pages'  => $query->max_num_pages,
            'found_posts' => $query->found_posts,
            'has_more'   => $page < $query->max_num_pages,
        ));
    } else {
        cyberpunk_ajax_response(false, __('No more posts to load.', 'cyberpunk'), array(
            'has_more' => false,
        ));
    }
}

/**
 * ============================================
 * 6. LIVE SEARCH
 * ============================================
 */

/**
 * Live Search Suggestions
 *
 * Returns matching posts as user types
 */
function cyberpunk_ajax_live_search() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    $search_query = isset($_POST['search_query']) ? sanitize_text_field($_POST['search_query']) : '';
    $posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : 5;

    if (strlen($search_query) < 2) {
        cyberpunk_ajax_response(false, __('Search query too short.', 'cyberpunk'), array(
            'results' => array(),
        ));
        return;
    }

    $args = array(
        'post_type'      => array('post', 'page'),
        'post_status'    => 'publish',
        's'              => $search_query,
        'posts_per_page' => $posts_per_page,
    );

    $query = new WP_Query($args);
    $results = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            $results[] = array(
                'id'        => get_the_ID(),
                'title'     => get_the_title(),
                'excerpt'   => wp_trim_words(get_the_excerpt(), 15),
                'url'       => get_permalink(),
                'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
                'type'      => get_post_type(),
                'date'      => get_the_date(),
            );
        }

        wp_reset_postdata();
    }

    cyberpunk_ajax_response(true, __('Search results retrieved.', 'cyberpunk'), array(
        'results'     => $results,
        'count'       => count($results),
        'total_found' => $query->found_posts,
    ));
}

/**
 * ============================================
 * 7. BOOKMARK SYSTEM (Logged-in Users Only)
 * ============================================
 */

/**
 * Bookmark/Unbookmark Post
 *
 * Allows logged-in users to bookmark posts
 */
function cyberpunk_ajax_bookmark_post() {

    // Check if user is logged in
    if (!is_user_logged_in()) {
        cyberpunk_ajax_response(false, __('You must be logged in to bookmark posts.', 'cyberpunk'), array(), 401);
        return;
    }

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

    if (!$post_id || !post_exists($post_id)) {
        cyberpunk_ajax_response(false, __('Invalid post ID.', 'cyberpunk'));
        return;
    }

    $user_id = get_current_user_id();
    $bookmarks = get_user_meta($user_id, '_cyberpunk_bookmarks', true);
    $bookmarks = $bookmarks ? explode(',', $bookmarks) : array();

    if (in_array($post_id, $bookmarks)) {
        // Remove bookmark
        $bookmarks = array_diff($bookmarks, array($post_id));
        update_user_meta($user_id, '_cyberpunk_bookmarks', implode(',', $bookmarks));

        cyberpunk_ajax_response(true, __('Post removed from bookmarks.', 'cyberpunk'), array(
            'action' => 'removed',
            'bookmarks_count' => count($bookmarks),
        ));
    } else {
        // Add bookmark
        $bookmarks[] = $post_id;
        update_user_meta($user_id, '_cyberpunk_bookmarks', implode(',', $bookmarks));

        cyberpunk_ajax_response(true, __('Post bookmarked.', 'cyberpunk'), array(
            'action' => 'added',
            'bookmarks_count' => count($bookmarks),
        ));
    }
}

/**
 * ============================================
 * 8. AJAX COMMENT SUBMIT
 * ============================================
 */

/**
 * Submit Comment via AJAX
 *
 * Allows submitting comments without page refresh
 */
function cyberpunk_ajax_submit_comment() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $comment_content = isset($_POST['comment']) ? trim($_POST['comment']) : '';
    $parent_id = isset($_POST['parent_id']) ? intval($_POST['parent_id']) : 0;

    if (!$post_id || !post_exists($post_id)) {
        cyberpunk_ajax_response(false, __('Invalid post ID.', 'cyberpunk'));
        return;
    }

    if (empty($comment_content)) {
        cyberpunk_ajax_response(false, __('Comment cannot be empty.', 'cyberpunk'));
        return;
    }

    $user = wp_get_current_user();

    $comment_data = array(
        'comment_post_ID'      => $post_id,
        'comment_content'      => $comment_content,
        'comment_parent'       => $parent_id,
        'user_id'              => $user->exists() ? $user->ID : 0,
        'comment_author'       => $user->exists() ? $user->display_name : '',
        'comment_author_email' => $user->exists() ? $user->user_email : '',
        'comment_author_url'   => $user->exists() ? $user->user_url : '',
    );

    // Add guest user details
    if (!$user->exists()) {
        $comment_author = isset($_POST['author']) ? sanitize_text_field($_POST['author']) : '';
        $comment_email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
        $comment_url = isset($_POST['url']) ? esc_url($_POST['url']) : '';

        if (empty($comment_author) || empty($comment_email)) {
            cyberpunk_ajax_response(false, __('Please fill in all required fields.', 'cyberpunk'));
            return;
        }

        $comment_data['comment_author'] = $comment_author;
        $comment_data['comment_author_email'] = $comment_email;
        $comment_data['comment_author_url'] = $comment_url;
    }

    $comment_id = wp_new_comment($comment_data, true);

    if (is_wp_error($comment_id)) {
        cyberpunk_ajax_response(false, $comment_id->get_error_message());
        return;
    }

    $comment = get_comment($comment_id);

    // Get comment HTML
    ob_start();
    wp_list_comments(array(
        'style'      => 'ul',
        'short_ping' => true,
        'avatar_size' => 50,
    ), array($comment));
    $comment_html = ob_get_clean();

    cyberpunk_ajax_response(true, __('Comment submitted successfully.', 'cyberpunk'), array(
        'comment_id'     => $comment_id,
        'comment_html'   => $comment_html,
        'comment_count'  => get_comments_number($post_id),
    ));
}

/**
 * ============================================
 * 9. UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Get User IP Address
 *
 * @return string IP address
 */
function cyberpunk_get_user_ip() {
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

/**
 * Get Like Count for Post
 *
 * @param int $post_id Post ID
 * @return int Like count
 */
function cyberpunk_get_like_count($post_id) {
    return (int) get_post_meta($post_id, '_cyberpunk_like_count', true);
}

/**
 * Check if Post is Liked by User
 *
 * @param int $post_id Post ID
 * @param int $user_id User ID (optional)
 * @return bool
 */
function cyberpunk_is_post_liked($post_id, $user_id = 0) {
    if (empty($user_id)) {
        $user_id = get_current_user_id();
    }

    if ($user_id > 0) {
        $user_likes = get_user_meta($user_id, '_cyberpunk_liked_posts', true);
        $user_likes = $user_likes ? explode(',', $user_likes) : array();
        return in_array($post_id, $user_likes);
    } else {
        $ip_address = cyberpunk_get_user_ip();
        $ip_likes = get_post_meta($post_id, '_cyberpunk_liked_ips', true);
        $ip_likes = $ip_likes ? explode(',', $ip_likes) : array();
        return in_array($ip_address, $ip_likes);
    }
}

/**
 * Get User Bookmarks
 *
 * @param int $user_id User ID
 * @return array Array of bookmarked post IDs
 */
function cyberpunk_get_user_bookmarks($user_id = 0) {
    if (empty($user_id)) {
        $user_id = get_current_user_id();
    }

    $bookmarks = get_user_meta($user_id, '_cyberpunk_bookmarks', true);
    return $bookmarks ? explode(',', $bookmarks) : array();
}
