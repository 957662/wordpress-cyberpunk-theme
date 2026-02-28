<?php
/**
 * Recent Posts Widget
 *
 * @package Cyberpunk_Theme
 * @since 2.2.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Cyberpunk_Recent_Posts_Widget extends WP_Widget {

    /**
     * Widget constructor
     */
    public function __construct() {
        parent::__construct(
            'cyberpunk_recent_posts',
            __('Recent Posts', 'cyberpunk'),
            array(
                'description' => __('Display recent posts with cyberpunk style', 'cyberpunk'),
                'classname'   => 'cyberpunk-widget-recent-posts',
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
        $show_excerpt = !empty($instance['show_excerpt']) ? true : false;
        $excerpt_length = !empty($instance['excerpt_length']) ? absint($instance['excerpt_length']) : 15;

        // Query recent posts
        $query_args = array(
            'post_type'           => 'post',
            'post_status'         => 'publish',
            'posts_per_page'      => $number,
            'ignore_sticky_posts' => 1,
            'no_found_rows'       => true,
        );

        $recent_posts = new WP_Query($query_args);

        echo $args['before_widget'];

        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        if ($recent_posts->have_posts()) {
            echo '<ul class="recent-posts-list">';

            while ($recent_posts->have_posts()) {
                $recent_posts->the_post();
                ?>
                <li class="recent-post-item">
                    <?php if ($show_thumbnail && has_post_thumbnail()) : ?>
                        <div class="recent-post-thumbnail">
                            <a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                                <?php the_post_thumbnail('thumbnail'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="recent-post-content">
                        <h4 class="recent-post-title">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_title(); ?>
                            </a>
                        </h4>

                        <?php if ($show_date) : ?>
                            <time class="recent-post-date" datetime="<?php echo get_the_date('c'); ?>">
                                <?php echo get_the_date(); ?>
                            </time>
                        <?php endif; ?>

                        <?php if ($show_excerpt) : ?>
                            <div class="recent-post-excerpt">
                                <?php echo wp_trim_words(get_the_excerpt(), $excerpt_length, '&hellip;'); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </li>
                <?php
            }

            echo '</ul>';
        } else {
            echo '<p class="no-posts">' . __('No posts found.', 'cyberpunk') . '</p>';
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
            'title'          => __('Recent Posts', 'cyberpunk'),
            'number'         => 5,
            'show_thumbnail' => 1,
            'show_date'      => 1,
            'show_excerpt'   => 0,
            'excerpt_length' => 15,
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
                   id="<?php echo $this->get_field_id('show_excerpt'); ?>"
                   name="<?php echo $this->get_field_name('show_excerpt'); ?>"
                   type="checkbox"
                   <?php checked($instance['show_excerpt'], 1); ?>>
            <label for="<?php echo $this->get_field_id('show_excerpt'); ?>">
                <?php _e('Show post excerpt', 'cyberpunk'); ?>
            </label>
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('excerpt_length'); ?>">
                <?php _e('Excerpt length (words):', 'cyberpunk'); ?>
            </label>
            <input class="tiny-text"
                   id="<?php echo $this->get_field_id('excerpt_length'); ?>"
                   name="<?php echo $this->get_field_name('excerpt_length'); ?>"
                   type="number"
                   min="5"
                   max="50"
                   value="<?php echo absint($instance['excerpt_length']); ?>">
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

        $instance['show_thumbnail'] = !empty($new_instance['show_thumbnail']) ? 1 : 0;
        $instance['show_date'] = !empty($new_instance['show_date']) ? 1 : 0;
        $instance['show_excerpt'] = !empty($new_instance['show_excerpt']) ? 1 : 0;
        $instance['excerpt_length'] = absint($new_instance['excerpt_length']);

        // Limit excerpt length
        if ($instance['excerpt_length'] < 5) {
            $instance['excerpt_length'] = 5;
        } elseif ($instance['excerpt_length'] > 50) {
            $instance['excerpt_length'] = 50;
        }

        return $instance;
    }
}
