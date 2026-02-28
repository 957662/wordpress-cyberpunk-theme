<?php
/**
 * The template for displaying single posts
 *
 * @package Cyberpunk_Theme
 */

get_header();
?>

<main id="primary" class="site-main single-post">

    <?php
    // Start the Loop
    while (have_posts()) :
        the_post();
    ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <?php if (has_post_thumbnail()) : ?>
                <div class="featured-image-container">
                    <?php the_post_thumbnail('cyberpunk-featured', array('class' => 'featured-image-full')); ?>
                </div>
            <?php endif; ?>

            <div class="post-inner">
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'; ?>
                    
                    <div class="entry-meta">
                        <span class="posted-on">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                        </span>
                        
                        <span class="byline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></svg>
                            </circle>
                            <span class="author"><?php the_author_link(); ?></span>
                        </span>
                        
                        <?php if (has_category()) : ?>
                            <span class="cat-links">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <?php the_category(', '); ?>
                            </span>
                        <?php endif; ?>
                        
                        <?php if (has_tag()) : ?>
                            <span class="tags-links">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                <?php the_tags('', ', '); ?>
                            </span>
                        <?php endif; ?>
                        
                        <span class="comments-count">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <?php 
                            $comments_number = get_comments_number();
                            if ($comments_number > 0) {
                                printf(_n('%1$s comment', '%1$s comments', $comments_number, 'cyberpunk'), number_format_i18n($comments_number));
                            } else {
                                _e('No comments', 'cyberpunk');
                            }
                            ?>
                        </span>
                    </div><!-- .entry-meta -->
                </header><!-- .entry-header -->

                <div class="entry-content scanline-bg">
                    <?php
                    the_content();

                    wp_link_pages(array(
                        'before' => '<div class="page-links">' . __('Pages:', 'cyberpunk'),
                        'after'  => '</div>',
                    ));
                    ?>
                </div><!-- .entry-content -->

                <footer class="entry-footer">
                    <?php edit_post_link(
                        sprintf(
                            wp_kses(
                                /* translators: %s: Name of current post. Only visible to screen readers */
                                __('Edit <span class="screen-reader-text">%s</span>', 'cyberpunk'),
                                array(
                                    'span' => array(
                                        'class' => array(),
                                    ),
                                )
                            ),
                            get_the_title()
                        ),
                        '<span class="edit-link">',
                        '</span>'
                    ); ?>
                </footer><!-- .entry-footer -->
            </div><!-- .post-inner -->
        </article><!-- #post-<?php the_ID(); ?> -->

        <?php
        // Post Navigation
        the_post_navigation(array(
            'prev_text' => '<span class="meta-nav">' . __('&larr; Previous Post', 'cyberpunk') . '</span><span class="post-title">%title</span>',
            'next_text' => '<span class="meta-nav">' . __('Next Post &rarr;', 'cyberpunk') . '</span><span class="post-title">%title</span>',
            'in_same_term' => false,
            'taxonomy' => 'category',
            'screen_reader_text' => __('Post navigation', 'cyberpunk'),
        ));
        ?>

        <?php
        // Comments
        if (comments_open() || get_comments_number()) :
            comments_template();
        endif;
        ?>

    <?php endwhile; // End of the loop. ?>

</main><!-- #primary -->

<?php
get_sidebar();
get_footer();
