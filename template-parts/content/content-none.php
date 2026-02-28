<?php
/**
 * Content None Component
 *
 * Displayed when no content is found
 * Used for 404, empty search results, empty archives
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<section class="no-results not-found">
    <div class="no-results-content cyber-box">
        <div class="error-icon glitch-effect" data-text="404">404</div>

        <header class="page-header">
            <h1 class="page-title neon-text">
                <?php
                if (is_404()) {
                    _e('Page Not Found', 'cyberpunk');
                } elseif (is_search()) {
                    printf(
                        __('Search Results for: "%s"', 'cyberpunk'),
                        '<span class="search-term">' . get_search_query() . '</span>'
                    );
                } else {
                    _e('Nothing Found', 'cyberpunk');
                }
                ?>
            </h1>
        </header><!-- .page-header -->

        <div class="page-content">
            <?php if (is_home() && current_user_can('publish_posts')) : ?>

                <p>
                    <?php
                    printf(
                        __('Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'cyberpunk'),
                        esc_url(admin_url('post-new.php'))
                    );
                    ?>
                </p>

            <?php elseif (is_search()) : ?>

                <p><?php _e('Sorry, but nothing matched your search terms. Please try again with different keywords.', 'cyberpunk'); ?></p>
                <div class="search-form-wrapper">
                    <?php get_search_form(); ?>
                </div>

            <?php elseif (is_404()) : ?>

                <p><?php _e('The page you are looking for doesn\'t exist or has been moved. Let\'s get you back on track.', 'cyberpunk'); ?></p>

                <div class="error-actions">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="cyber-button">
                        <?php _e('[GO_HOME]', 'cyberpunk'); ?>
                    </a>
                    <?php get_search_form(); ?>
                </div>

            <?php else : ?>

                <p><?php _e('It seems we can\'t find what you\'re looking for. Perhaps searching can help.', 'cyberpunk'); ?></p>
                <?php get_search_form(); ?>

            <?php endif; ?>
        </div><!-- .page-content -->

        <div class="system-message">
            <span class="blink-text">SYSTEM_MESSAGE:</span>
            <span class="message-text"><?php _e('NO_DATA_FOUND_IN_DATABASE', 'cyberpunk'); ?></span>
        </div>
    </div>
</section><!-- .no-results -->
