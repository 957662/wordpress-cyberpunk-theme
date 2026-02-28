<?php
/**
 * The template for displaying archive pages
 *
 * @package Cyberpunk_Theme
 */

get_header();
?>

<main id="primary" class="site-main">

    <?php if (have_posts()) : ?>

        <header class="page-header">
            <?php
            the_archive_title('<h1 class="page-title">', '</h1>');
            the_archive_description('<div class="archive-description">', '</div>');
            ?>
        </header><!-- .page-header -->

        <div class="archive-info">
            <span class="archive-count">
                <?php
                $post_count = $wp_query->post_count;
                printf(_n('%s post', '%s posts', $post_count, 'cyberpunk'), $post_count);
                ?>
            </span>
        </div>

        <div class="posts-grid">
            <?php
            while (have_posts()) :
                the_post();
            ?>

                <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('cyberpunk-card'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="post-content-wrapper">
                        <header class="entry-header">
                            <?php
                            the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                            ?>
                        </header>

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
                        </div>

                        <div class="entry-content">
                            <?php the_excerpt(); ?>
                        </div>

                        <div class="post-footer">
                            <a href="<?php the_permalink(); ?>" class="read-more-link cyber-button">
                                <?php _e('Read More', 'cyberpunk'); ?>
                            </a>
                        </div>
                    </div>
                </article>

            <?php endwhile; ?>
        </div>

        <?php
        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => __('&larr; Previous', 'cyberpunk'),
            'next_text' => __('Next &rarr; 'cyberpunk'),
        ));
        ?>

    <?php else : ?>

        <section class="no-results not-found">
            <header class="page-header">
                <h1 class="page-title"><?php _e('Nothing Found', 'cyberpunk'); ?></h1>
            </header>

            <div class="page-content">
                <p><?php _e('It looks like nothing was found at this location.', 'cyberpunk'); ?></p>
            </div>
        </section>

    <?php endif; ?>

</main>

<?php
get_sidebar();
get_footer();
