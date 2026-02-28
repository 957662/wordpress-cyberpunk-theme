<?php
/**
 * Content Card Component
 *
 * Used in post grids, archives, and blog listings
 * Displays a card-style layout with thumbnail, title, excerpt, and metadata
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

global $post;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('post-card cyber-card'); ?> data-post-id="<?php the_ID(); ?>">
    <?php if (has_post_thumbnail()) : ?>
        <div class="post-thumbnail">
            <a href="<?php the_permalink(); ?>" class="thumbnail-link" aria-label="<?php printf(esc_attr__('Read more about %s', 'cyberpunk'), get_the_title()); ?>">
                <?php
                the_post_thumbnail('cyberpunk-card', array(
                    'class' => 'cyber-img lazyload',
                    'alt' => get_the_title(),
                    'loading' => 'lazy',
                ));
                ?>
                <div class="thumbnail-overlay">
                    <span class="view-text"><?php _e('[VIEW_ENTRY]', 'cyberpunk'); ?></span>
                </div>
            </a>
        </div>
    <?php else : ?>
        <div class="post-thumbnail placeholder">
            <div class="placeholder-image">
                <span class="placeholder-text"><?php _e('NO_IMAGE', 'cyberpunk'); ?></span>
            </div>
        </div>
    <?php endif; ?>

    <div class="post-content-wrapper">
        <header class="entry-header">
            <?php
            the_title('<h2 class="entry-title neon-text"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
            ?>
        </header>

        <div class="entry-meta">
            <span class="posted-on">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <time class="entry-date" datetime="<?php echo get_the_date(DATE_W3C); ?>">
                    <?php echo get_the_date(); ?>
                </time>
            </span>
            <span class="byline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="author vcard">
                    <a class="url fn n" href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>">
                        <?php the_author(); ?>
                    </a>
                </span>
            </span>
            <?php if (get_the_category()) : ?>
                <span class="cat-links">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <?php the_category(' '); ?>
                </span>
            <?php endif; ?>
        </div><!-- .entry-meta -->

        <div class="entry-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <footer class="entry-footer">
            <div class="entry-actions">
                <a href="<?php the_permalink(); ?>" class="read-more-link cyber-button">
                    <?php _e('[READ_MORE]', 'cyberpunk'); ?>
                </a>
                <button class="like-button <?php echo cyberpunk_is_post_liked(get_the_ID()) ? 'liked' : ''; ?>"
                        data-post-id="<?php the_ID(); ?>"
                        aria-label="<?php echo cyberpunk_is_post_liked(get_the_ID()) ? esc_attr__('Unlike this post', 'cyberpunk') : esc_attr__('Like this post', 'cyberpunk'); ?>">
                    <span class="like-icon"><?php echo cyberpunk_is_post_liked(get_the_ID()) ? '♥' : '♡'; ?></span>
                    <span class="like-count"><?php echo cyberpunk_get_like_count(get_the_ID()); ?></span>
                </button>
            </div>
        </footer>
    </div><!-- .post-content-wrapper -->
</article><!-- #post-<?php the_ID(); ?> -->
