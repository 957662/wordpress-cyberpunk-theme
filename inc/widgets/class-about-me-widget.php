<?php
/**
 * About Me Widget
 *
 * @package Cyberpunk_Theme
 * @since 2.2.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Cyberpunk_About_Me_Widget extends WP_Widget {

    /**
     * Widget constructor
     */
    public function __construct() {
        parent::__construct(
            'cyberpunk_about_me',
            __('About Me', 'cyberpunk'),
            array(
                'description' => __('Display author information with cyberpunk style', 'cyberpunk'),
                'classname'   => 'cyberpunk-widget-about-me',
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
        echo $args['before_widget'];

        // Display avatar
        if (!empty($instance['avatar_url'])) {
            printf(
                '<img src="%s" alt="%s" class="about-me-avatar">',
                esc_url($instance['avatar_url']),
                esc_attr($instance['title'])
            );
        }

        // Display title
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        // Display bio
        if (!empty($instance['bio'])) {
            echo '<div class="about-me-bio">' . wp_kses_post($instance['bio']) . '</div>';
        }

        // Display social links
        if (!empty($instance['social_links'])) {
            $this->display_social_links($instance['social_links']);
        }

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
            'title'       => __('About Me', 'cyberpunk'),
            'avatar_url'  => '',
            'bio'         => '',
            'social_links' => '',
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
        <?php

        // Avatar URL field
        $avatar_url = !empty($instance['avatar_url']) ? $instance['avatar_url'] : '';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('avatar_url'); ?>">
                <?php _e('Avatar URL:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('avatar_url'); ?>"
                   name="<?php echo $this->get_field_name('avatar_url'); ?>"
                   type="text"
                   value="<?php echo esc_url($avatar_url); ?>">
            <small class="description">
                <?php _e('Enter image URL or leave empty to use Gravatar', 'cyberpunk'); ?>
            </small>
        </p>
        <?php

        // Bio field
        $bio = !empty($instance['bio']) ? $instance['bio'] : '';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('bio'); ?>">
                <?php _e('Bio:', 'cyberpunk'); ?>
            </label>
            <textarea class="widefat"
                      id="<?php echo $this->get_field_id('bio'); ?>"
                      name="<?php echo $this->get_field_name('bio'); ?>"
                      rows="5"><?php echo esc_textarea($bio); ?></textarea>
        </p>
        <?php

        // Social media fields
        $social_platforms = array(
            'twitter'   => __('Twitter', 'cyberpunk'),
            'facebook'  => __('Facebook', 'cyberpunk'),
            'instagram' => __('Instagram', 'cyberpunk'),
            'github'    => __('GitHub', 'cyberpunk'),
            'linkedin'  => __('LinkedIn', 'cyberpunk'),
            'youtube'   => __('YouTube', 'cyberpunk'),
        );

        foreach ($social_platforms as $platform => $label) {
            $field_name = 'social_' . $platform;
            $field_value = !empty($instance[$field_name]) ? $instance[$field_name] : '';
            ?>
            <p>
                <label for="<?php echo $this->get_field_id($field_name); ?>">
                    <?php echo esc_html($label); ?> URL:
                </label>
                <input class="widefat"
                       id="<?php echo $this->get_field_id($field_name); ?>"
                       name="<?php echo $this->get_field_name($field_name); ?>"
                       type="url"
                       value="<?php echo esc_url($field_value); ?>">
            </p>
            <?php
        }
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

        // Save title
        $instance['title'] = sanitize_text_field($new_instance['title']);

        // Save avatar URL
        $instance['avatar_url'] = esc_url_raw($new_instance['avatar_url']);

        // Save bio
        $instance['bio'] = sanitize_textarea_field($new_instance['bio']);

        // Save social links
        $social_platforms = array('twitter', 'facebook', 'instagram', 'github', 'linkedin', 'youtube');
        foreach ($social_platforms as $platform) {
            $field_name = 'social_' . $platform;
            $instance[$field_name] = esc_url_raw($new_instance[$field_name]);
        }

        return $instance;
    }

    /**
     * Display social links
     *
     * @param array $links Social links array
     */
    private function display_social_links($instance) {
        $social_platforms = array('twitter', 'facebook', 'instagram', 'github', 'linkedin', 'youtube');
        $has_links = false;

        foreach ($social_platforms as $platform) {
            if (!empty($instance['social_' . $platform])) {
                $has_links = true;
                break;
            }
        }

        if ($has_links) {
            echo '<div class="about-me-social-links">';

            foreach ($social_platforms as $platform) {
                if (!empty($instance['social_' . $platform])) {
                    printf(
                        '<a href="%s" class="social-link social-%s" target="_blank" rel="noopener noreferrer" aria-label="%s">',
                        esc_url($instance['social_' . $platform]),
                        esc_attr($platform),
                        esc_attr(ucfirst($platform))
                    );
                    echo $this->get_social_icon($platform);
                    echo '</a>';
                }
            }

            echo '</div>';
        }
    }

    /**
     * Get social icon SVG
     *
     * @param string $platform Social platform name
     * @return string SVG icon
     */
    private function get_social_icon($platform) {
        $icons = array(
            'twitter' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
            'facebook' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            'instagram' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
            'github' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>',
            'linkedin' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
            'youtube' => '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        );

        return isset($icons[$platform]) ? $icons[$platform] : '';
    }
}
