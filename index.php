<?php
/**
 * The main template file
 *
 * @package Cyberpunk_Theme
 */

get_header();
?>

<main id="primary" class="site-main">

    <?php if (have_posts()) : ?>

        <?php if (is_home() && !is_front_page()) : ?>
            <header>
                <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
            </header>
        <?php endif; ?>

        <div class="posts-grid">
            <?php
            // Start the Loop
            while (have_posts()) :
                the_post();
            ?>

                <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php 
                                if (is_front_page()) {
                                    the_post_thumbnail('cyberpunk-card');
                                } else {
                                    the_post_thumbnail('cyberpunk-featured');
                                }
                                ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="post-content-wrapper">
                        <header class="entry-header">
                            <?php
                            if (is_singular()) :
                                the_title('<h1 class="entry-title">', '</h1>');
                            else :
                                the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                            endif;
                            ?>
                        </header><!-- .entry-header -->

                        <div class="entry-meta">
                            <span class="posted-on">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <?php echo get_the_date(); ?>
                            </span>
                            <span class="byline">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <?php the_author(); ?>
                            </span>
                            <?php if (has_category()) : ?>
                                <span class="cat-links">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <?php the_category(', '); ?>
                                </span>
                            <?php endif; ?>
                        </div><!-- .entry-meta -->

                        <div class="entry-content">
                            <?php
                            if (is_singular()) {
                                the_content();
                            } else {
                                the_excerpt();
                            }

                            wp_link_pages(array(
                                'before' => '<div class="page-links">' . __('Pages:', 'cyberpunk'),
                                'after'  => '</div>',
                            ));
                            ?>
                        </div><!-- .entry-content -->

                        <?php if (!is_singular()) : ?>
                            <div class="post-footer">
                                <a href="<?php the_permalink(); ?>" class="read-more-link cyber-button">
                                    <?php _e('Read More', 'cyberpunk'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                    </div><!-- .post-content-wrapper -->
                </article><!-- #post-<?php the_ID(); ?> -->

            <?php endwhile; ?>
        </div><!-- .posts-grid -->

        <?php
        // Pagination
        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => __('&larr; Previous', 'cyberpunk'),
            'next_text' => __('Next &rarr;', 'cyberpunk'),
        ));
        ?>

    <?php else : ?>

        <section class="no-results not-found">
            <header class="page-header">
                <h1 class="page-title"><?php _e('Nothing Found', 'cyberpunk'); ?></h1>
            </header><!-- .page-header -->

            <div class="page-content">
                <p><?php _e('It looks like nothing was found at this location. Maybe try a search?', 'cyberpunk'); ?></p>
                <?php get_search_form(); ?>
            </div><!-- .page-content -->
        </section><!-- .no-results -->

    <?php endif; ?>

</main><!-- #primary -->

<?php
get_sidebar();
get_footer();
