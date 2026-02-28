<?php
/**
 * Popular Posts Widget
 *
 * @package Cyberpunk_Theme
 * @since 2.2.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Cyberpunk_Popular_Posts_Widget extends WP_Widget {

    /**
     * Widget constructor
     */
    public function __construct() {
        parent::__construct(
            'cyberpunk_popular_posts',
            __('Popular Posts', 'cyberpunk'),
            array(
                'description' => __('Display popular posts based on views or comments with cyberpunk style', 'cyberpunk'),
                'classname'   => 'cyberpunk-widget-popular-posts',
            )
        );
    }

    /**
     * Frontend display
     *
     * @param array $args Widget arguments
     * @param array $instance Widget instance
     */
    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        $number = !empty($instance['number']) ? absint($instance['number']) : 5;
        $show_thumbnail = !empty($instance['show_thumbnail']) ? true : false;
        $show_date = !empty($instance['show_date']) ? true : false;
        $show_views = !empty($instance['show_views']) ? true : false;
        $time_range = !empty($instance['time_range']) ? $instance['time_range'] : 'all';
        $orderby = !empty($instance['orderby']) ? $instance['orderby'] : 'views';

        // Build query arguments
        $query_args = array(
            'post_type'           => 'post',
            'post_status'         => 'publish',
            'posts_per_page'      => $number,
            'ignore_sticky_posts' => 1,
            'no_found_rows'       => true,
        );

        // Set order by
        if ($orderby === 'comments') {
            $query_args['orderby'] = 'comment_count';
            $query_args['order'] = 'DESC';
        } elseif ($orderby === 'views') {
            // Order by post meta views
            $query_args['meta_key'] = 'cyberpunk_post_views';
            $query_args['orderby'] = 'meta_value_num';
            $query_args['order'] = 'DESC';
        }

        // Filter by time range
        if ($time_range !== 'all') {
            $date_query = array();

            switch ($time_range) {
                case 'week':
                    $date_query = array(
                        'after' => '1 week ago',
                    );
                    break;
                case 'month':
                    $date_query = array(
                        'after' => '1 month ago',
                    );
                    break;
                case 'year':
                    $date_query = array(
                        'after' => '1 year ago',
                    );
                    break;
            }

            if (!empty($date_query)) {
                $query_args['date_query'] = $date_query;
            }
        }

        $popular_posts = new WP_Query($query_args);

        echo $args['before_widget'];

        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        if ($popular_posts->have_posts()) {
            echo '<div class="popular-posts-wrapper">';

            $rank = 1;
            while ($popular_posts->have_posts()) {
                $popular_posts->the_post();

                // Get view count
                $views = get_post_meta(get_the_ID(), 'cyberpunk_post_views', true);
                $views = $views ? absint($views) : 0;

                ?>
                <div class="popular-post-item">
                    <?php if ($show_thumbnail && has_post_thumbnail()) : ?>
                        <div class="popular-post-thumbnail">
                            <a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                                <?php the_post_thumbnail('thumbnail'); ?>
                            </a>
                            <span class="popular-post-rank"><?php echo $rank; ?></span>
                        </div>
                    <?php else : ?>
                        <div class="popular-post-rank no-thumbnail"><?php echo $rank; ?></div>
                    <?php endif; ?>

                    <div class="popular-post-content">
                        <h4 class="popular-post-title">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_title(); ?>
                            </a>
                        </h4>

                        <div class="popular-post-meta">
                            <?php if ($show_date) : ?>
                                <time class="popular-post-date" datetime="<?php echo get_the_date('c'); ?>">
                                    <?php echo get_the_date(); ?>
                                </time>
                            <?php endif; ?>

                            <?php if ($show_views && $views > 0) : ?>
                                <span class="popular-post-views">
                                    <?php
                                    printf(
                                        _n('%s view', '%s views', $views, 'cyberpunk'),
                                        number_format_i18n($views)
                                    );
                                    ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php

                $rank++;
            }

            echo '</div>';
        } else {
            echo '<p class="no-posts">' . __('No popular posts found.', 'cyberpunk') . '</p>';
        }

        wp_reset_postdata();

        echo $args['after_widget'];
    }

    /**
     * Backend form
     *
     * @param array $instance Widget instance
     */
    public function form($instance) {
        // Default values
        $defaults = array(
            'title'          => __('Popular Posts', 'cyberpunk'),
            'number'         => 5,
            'show_thumbnail' => 1,
            'show_date'      => 1,
            'show_views'     => 1,
            'time_range'     => 'all',
            'orderby'        => 'views',
        );

        $instance = wp_parse_args((array) $instance, $defaults);

        // Title field
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php _e('Title:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['title']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('number'); ?>">
                <?php _e('Number of posts to show:', 'cyberpunk'); ?>
            </label>
            <input class="tiny-text"
                   id="<?php echo $this->get_field_id('number'); ?>"
                   name="<?php echo $this->get_field_name('number'); ?>"
                   type="number"
                   min="1"
                   max="20"
                   value="<?php echo absint($instance['number']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('orderby'); ?>">
                <?php _e('Order by:', 'cyberpunk'); ?>
            </label>
            <select class="widefat"
                    id="<?php echo $this->get_field_id('orderby'); ?>"
                    name="<?php echo $this->get_field_name('orderby'); ?>">
                <option value="views" <?php selected($instance['orderby'], 'views'); ?>>
                    <?php _e('Post Views', 'cyberpunk'); ?>
                </option>
                <option value="comments" <?php selected($instance['orderby'], 'comments'); ?>>
                    <?php _e('Comment Count', 'cyberpunk'); ?>
                </option>
            </select>
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('time_range'); ?>">
                <?php _e('Time Range:', 'cyberpunk'); ?>
            </label>
            <select class="widefat"
                    id="<?php echo $this->get_field_id('time_range'); ?>"
                    name="<?php echo $this->get_field_name('time_range'); ?>">
                <option value="all" <?php selected($instance['time_range'], 'all'); ?>>
                    <?php _e('All Time', 'cyberpunk'); ?>
                </option>
                <option value="year" <?php selected($instance['time_range'], 'year'); ?>>
                    <?php _e('Past Year', 'cyberpunk'); ?>
                </option>
                <option value="month" <?php selected($instance['time_range'], 'month'); ?>>
                    <?php _e('Past Month', 'cyberpunk'); ?>
                </option>
                <option value="week" <?php selected($instance['time_range'], 'week'); ?>>
                    <?php _e('Past Week', 'cyberpunk'); ?>
                </option>
            </select>
        </p>

        <p>
            <input class="checkbox"
                   id="<?php echo $this->get_field_id('show_thumbnail'); ?>"
                   name="<?php echo $this->get_field_name('show_thumbnail'); ?>"
                   type="checkbox"
                   <?php checked($instance['show_thumbnail'], 1); ?>>
            <label for="<?php echo $this->get_field_id('show_thumbnail'); ?>">
                <?php _e('Show post thumbnail', 'cyberpunk'); ?>
            </label>
        </p>

        <p>
            <input class="checkbox"
                   id="<?php echo $this->get_field_id('show_date'); ?>"
                   name="<?php echo $this->get_field_name('show_date'); ?>"
                   type="checkbox"
                   <?php checked($instance['show_date'], 1); ?>>
            <label for="<?php echo $this->get_field_id('show_date'); ?>">
                <?php _e('Show post date', 'cyberpunk'); ?>
            </label>
        </p>

        <p>
            <input class="checkbox"
                   id="<?php echo $this->get_field_id('show_views'); ?>"
                   name="<?php echo $this->get_field_name('show_views'); ?>"
                   type="checkbox"
                   <?php checked($instance['show_views'], 1); ?>>
            <label for="<?php echo $this->get_field_id('show_views'); ?>">
                <?php _e('Show view count', 'cyberpunk'); ?>
            </label>
        </p>
        <?php
    }

    /**
     * Save widget settings
     *
     * @param array $new_instance New widget instance
     * @param array $old_instance Old widget instance
     * @return array Saved instance
     */
    public function update($new_instance, $old_instance) {
        $instance = array();

        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['number'] = absint($new_instance['number']);

        // Limit number between 1 and 20
        if ($instance['number'] < 1) {
            $instance['number'] = 1;
        } elseif ($instance['number'] > 20) {
            $instance['number'] = 20;
        }

        // Validate orderby
        $instance['orderby'] = sanitize_text_field($new_instance['orderby']);
        if (!in_array($instance['orderby'], array('views', 'comments'))) {
            $instance['orderby'] = 'views';
        }

        // Validate time_range
        $instance['time_range'] = sanitize_text_field($new_instance['time_range']);
        if (!in_array($instance['time_range'], array('all', 'week', 'month', 'year'))) {
            $instance['time_range'] = 'all';
        }

        $instance['show_thumbnail'] = !empty($new_instance['show_thumbnail']) ? 1 : 0;
        $instance['show_date'] = !empty($new_instance['show_date']) ? 1 : 0;
        $instance['show_views'] = !empty($new_instance['show_views']) ? 1 : 0;

        return $instance;
    }
}
