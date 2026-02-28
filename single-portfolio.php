<?php
/**
 * Single Portfolio Item Template
 *
 * Displays a single portfolio project
 * Includes project details, gallery, and related projects
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

get_header();

while (have_posts()) :
    the_post();

    // Get custom project details
    $project_year = get_post_meta(get_the_ID(), '_portfolio_year', true);
    $project_client = get_post_meta(get_the_ID(), '_portfolio_client', true);
    $project_url = get_post_meta(get_the_ID(), '_portfolio_url', true);
    $project_github = get_post_meta(get_the_ID(), '_portfolio_github', true);

    // Get project categories
    $categories = get_the_terms(get_the_ID(), 'project_category');
    ?>

    <main id="primary" class="site-main single-portfolio">
        <div class="container">
            <article id="post-<?php the_ID(); ?>" <?php post_class('portfolio-single'); ?>>

                <!-- Portfolio Header -->
                <header class="portfolio-header">
                    <?php if ($categories && !is_wp_error($categories)) : ?>
                        <div class="portfolio-categories">
                            <?php foreach ($categories as $category) : ?>
                                <a href="<?php echo esc_url(get_term_link($category)); ?>" class="category-tag neon-box">
                                    <?php echo esc_html($category->name); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <h1 class="portfolio-title neon-text"><?php the_title(); ?></h1>

                    <div class="portfolio-meta">
                        <?php if ($project_client) : ?>
                            <div class="meta-item">
                                <span class="meta-label"><?php _e('Client:', 'cyberpunk'); ?></span>
                                <span class="meta-value"><?php echo esc_html($project_client); ?></span>
                            </div>
                        <?php endif; ?>

                        <?php if ($project_year) : ?>
                            <div class="meta-item">
                                <span class="meta-label"><?php _e('Year:', 'cyberpunk'); ?></span>
                                <span class="meta-value"><?php echo esc_html($project_year); ?></span>
                            </div>
                        <?php endif; ?>

                        <div class="meta-item">
                            <span class="meta-label"><?php _e('Date:', 'cyberpunk'); ?></span>
                            <span class="meta-value"><?php echo get_the_date(); ?></span>
                        </div>
                    </div>
                </header>

                <!-- Portfolio Gallery -->
                <?php if (has_post_thumbnail()) : ?>
                    <div class="portfolio-gallery">
                        <div class="featured-image">
                            <?php the_post_thumbnail('cyberpunk-featured'); ?>
                        </div>

                        <?php
                        // Check for gallery images
                        $gallery = get_post_gallery(get_the_ID(), false);
                        if ($gallery) :
                        ?>
                            <div class="gallery-grid">
                                <?php
                                foreach ($gallery['src'] as $image_url) :
                                    ?>
                                    <div class="gallery-item">
                                        <a href="<?php echo esc_url($image_url); ?>" class="gallery-link" data-lightbox="portfolio">
                                            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" loading="lazy">
                                        </a>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <!-- Portfolio Content -->
                <div class="portfolio-content">
                    <div class="content-wrapper">
                        <?php
                        the_content();

                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('Pages:', 'cyberpunk'),
                            'after'  => '</div>',
                        ));
                        ?>
                    </div>
                </div>

                <!-- Project Links -->
                <?php if ($project_url || $project_github) : ?>
                    <div class="portfolio-links">
                        <h3 class="links-title neon-text"><?php _e('Project Links', 'cyberpunk'); ?></h3>
                        <div class="links-wrapper">
                            <?php if ($project_url) : ?>
                                <a href="<?php echo esc_url($project_url); ?>" class="project-link-btn cyber-button" target="_blank" rel="noopener">
                                    <?php _e('[LIVE_DEMO]', 'cyberpunk'); ?>
                                </a>
                            <?php endif; ?>

                            <?php if ($project_github) : ?>
                                <a href="<?php echo esc_url($project_github); ?>" class="github-link-btn cyber-button" target="_blank" rel="noopener">
                                    <?php _e('[SOURCE_CODE]', 'cyberpunk'); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- Project Technologies/Skills -->
                <?php
                $technologies = get_post_meta(get_the_ID(), '_portfolio_technologies', true);
                if ($technologies) :
                    $tech_list = explode(',', $technologies);
                ?>
                    <div class="portfolio-technologies">
                        <h3 class="tech-title neon-text"><?php _e('Technologies', 'cyberpunk'); ?></h3>
                        <div class="tech-tags">
                            <?php foreach ($tech_list as $tech) : ?>
                                <span class="tech-tag neon-box"><?php echo esc_html(trim($tech)); ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- Portfolio Footer -->
                <footer class="portfolio-footer">
                    <div class="portfolio-actions">
                        <button class="like-button <?php echo cyberpunk_is_post_liked(get_the_ID()) ? 'liked' : ''; ?>"
                                data-post-id="<?php the_ID(); ?>">
                            <span class="like-icon"><?php echo cyberpunk_is_post_liked(get_the_ID()) ? '♥' : '♡'; ?></span>
                            <span class="like-count"><?php echo cyberpunk_get_like_count(get_the_ID()); ?></span>
                        </button>

                        <?php if (is_user_logged_in()) : ?>
                            <button class="bookmark-button <?php echo in_array(get_the_ID(), cyberpunk_get_user_bookmarks()) ? 'bookmarked' : ''; ?>"
                                    data-post-id="<?php the_ID(); ?>">
                                <span class="bookmark-icon"><?php echo in_array(get_the_ID(), cyberpunk_get_user_bookmarks()) ? '★' : '☆'; ?></span>
                                <span class="bookmark-text"><?php _e('Bookmark', 'cyberpunk'); ?></span>
                            </button>
                        <?php endif; ?>
                    </div>

                    <div class="share-buttons">
                        <span class="share-label"><?php _e('Share:', 'cyberpunk'); ?></span>
                        <a href="<?php echo esc_url(get_share_url('twitter')); ?>" class="share-btn twitter" target="_blank" rel="noopener">
                            Twitter
                        </a>
                        <a href="<?php echo esc_url(get_share_url('facebook')); ?>" class="share-btn facebook" target="_blank" rel="noopener">
                            Facebook
                        </a>
                        <a href="<?php echo esc_url(get_share_url('linkedin')); ?>" class="share-btn linkedin" target="_blank" rel="noopener">
                            LinkedIn
                        </a>
                    </div>
                </footer>

            </article><!-- #post-<?php the_ID(); ?> -->

            <!-- Related Projects -->
            <?php
            $related_args = array(
                'post_type' => 'portfolio',
                'posts_per_page' => 3,
                'post__not_in' => array(get_the_ID()),
                'orderby' => 'rand',
            );

            if ($categories && !is_wp_error($categories)) {
                $category_ids = wp_list_pluck($categories, 'term_id');
                $related_args['tax_query'] = array(
                    array(
                        'taxonomy' => 'project_category',
                        'field' => 'term_id',
                        'terms' => $category_ids,
                    ),
                );
            }

            $related_query = new WP_Query($related_args);

            if ($related_query->have_posts()) :
            ?>
                <section class="related-projects">
                    <h2 class="section-title neon-text"><?php _e('Related Projects', 'cyberpunk'); ?></h2>
                    <div class="related-grid">
                        <?php
                        while ($related_query->have_posts()) :
                            $related_query->the_post();
                            get_template_part('template-parts/content', 'portfolio');
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                </section>
            <?php endif; ?>

            <!-- Navigation -->
            <nav class="portfolio-navigation">
                <div class="nav-previous">
                    <?php
                    previous_post_link(
                        '%link',
                        '<span class="nav-label">' . __('&larr; Previous Project', 'cyberpunk') . '</span> <span class="nav-title">%title</span>',
                        true,
                        '',
                        'category'
                    );
                    ?>
                </div>
                <a href="<?php echo esc_url(get_post_type_archive_link('portfolio')); ?>" class="nav-archive">
                    <?php _e('[ALL_PROJECTS]', 'cyberpunk'); ?>
                </a>
                <div class="nav-next">
                    <?php
                    next_post_link(
                        '%link',
                        '<span class="nav-label">' . __('Next Project &rarr;', 'cyberpunk') . '</span> <span class="nav-title">%title</span>',
                        true,
                        '',
                        'category'
                    );
                    ?>
                </div>
            </nav>

        </div><!-- .container -->
    </main><!-- #primary -->

<?php endwhile; ?>

<?php
get_footer();

/**
 * Helper function to get share URL
 */
function get_share_url($platform) {
    $url = get_permalink();
    $title = get_the_title();
    $encoded_url = urlencode($url);
    $encoded_title = urlencode($title);

    switch ($platform) {
        case 'twitter':
            return "https://twitter.com/intent/tweet?url={$encoded_url}&text={$encoded_title}";
        case 'facebook':
            return "https://www.facebook.com/sharer/sharer.php?u={$encoded_url}";
        case 'linkedin':
            return "https://www.linkedin.com/sharing/share-offsite/?url={$encoded_url}";
        default:
            return '';
    }
}
?>
