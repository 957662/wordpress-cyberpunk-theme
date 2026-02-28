<?php
/**
 * Portfolio Archive Template
 *
 * Displays all portfolio items in a grid layout
 * Supports filtering by project category
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

get_header(); ?>

<main id="primary" class="site-main portfolio-archive">
    <div class="container">
        <header class="page-header">
            <h1 class="page-title neon-text glitch-effect" data-text="<?php echo esc_attr(post_type_archive_title('', false)); ?>">
                <?php post_type_archive_title(); ?>
            </h1>

            <?php if ($description = get_the_post_type_description('portfolio')) : ?>
                <div class="archive-description"><?php echo wp_kses_post($description); ?></div>
            <?php endif; ?>

            <?php
            // Display category filter if categories exist
            $categories = get_terms(array(
                'taxonomy' => 'project_category',
                'hide_empty' => true,
            ));

            if ($categories && !is_wp_error($categories)) :
            ?>
                <div class="portfolio-filter">
                    <button class="filter-btn active" data-category="all">
                        <?php _e('[ALL]', 'cyberpunk'); ?>
                    </button>
                    <?php foreach ($categories as $category) : ?>
                        <button class="filter-btn" data-category="<?php echo esc_attr($category->slug); ?>">
                            <?php echo esc_html($category->name); ?>
                        </button>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </header>

        <?php if (have_posts()) : ?>
            <div class="portfolio-grid">
                <?php
                while (have_posts()) :
                    the_post();
                    get_template_part('template-parts/content', 'portfolio');
                endwhile;
                ?>
            </div>

            <?php
            // AJAX Load More Button
            if ($wp_query->max_num_pages > 1) :
            ?>
                <div class="load-more-container">
                    <button class="load-more-btn cyber-button neon-box"
                            data-page="1"
                            data-max-pages="<?php echo esc_attr($wp_query->max_num_pages); ?>"
                            data-post-type="portfolio">
                        <span class="cyber-button-text">[LOAD_MORE_PROJECTS]</span>
                    </button>
                    <div class="loading-spinner" style="display:none;">
                        <div class="cyber-loader"></div>
                    </div>
                </div>
            <?php else : ?>
                <div class="pagination">
                    <?php
                    the_posts_pagination(array(
                        'mid_size' => 2,
                        'prev_text' => __('&larr;', 'cyberpunk'),
                        'next_text' => __('&rarr;', 'cyberpunk'),
                    ));
                    ?>
                </div>
            <?php endif; ?>

        <?php else : ?>

            <div class="no-portfolio">
                <?php get_template_part('template-parts/content', 'none'); ?>
            </div>

        <?php endif; ?>
    </div>
</main>

<?php
get_sidebar();
get_footer();
