<?php
/**
 * Portfolio Item Card Component
 *
 * Displays portfolio items in a grid layout
 * Includes project categories, thumbnail, and metadata
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get project categories
$categories = get_the_terms(get_the_ID(), 'project_category');

// Get custom project details
$project_year = get_post_meta(get_the_ID(), '_portfolio_year', true);
$project_client = get_post_meta(get_the_ID(), '_portfolio_client', true);
$project_url = get_post_meta(get_the_ID(), '_portfolio_url', true);
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('portfolio-item'); ?> data-post-id="<?php the_ID(); ?>">
    <div class="portfolio-thumbnail">
        <a href="<?php the_permalink(); ?>" class="portfolio-link" aria-label="<?php printf(esc_attr__('View project: %s', 'cyberpunk'), get_the_title()); ?>">
            <?php
            if (has_post_thumbnail()) {
                the_post_thumbnail('cyberpunk-card', array(
                    'class' => 'portfolio-image lazyload',
                    'alt' => get_the_title(),
                    'loading' => 'lazy',
                ));
            } else {
                echo '<div class="placeholder-thumbnail">' . __('NO_IMAGE', 'cyberpunk') . '</div>';
            }
            ?>
            <div class="portfolio-overlay">
                <span class="view-project"><?php _e('[VIEW_PROJECT]', 'cyberpunk'); ?></span>
                <div class="project-info-overlay">
                    <?php if ($project_year) : ?>
                        <span class="project-year-badge"><?php echo esc_html($project_year); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        </a>
    </div>

    <div class="portfolio-content">
        <?php if ($categories && !is_wp_error($categories)) : ?>
            <div class="portfolio-categories">
                <?php foreach ($categories as $category) : ?>
                    <a href="<?php echo esc_url(get_term_link($category)); ?>" class="category-tag neon-box">
                        <?php echo esc_html($category->name); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <h2 class="portfolio-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>

        <div class="portfolio-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <div class="portfolio-meta">
            <?php if ($project_client) : ?>
                <span class="project-client">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <?php echo esc_html($project_client); ?>
                </span>
            <?php endif; ?>

            <span class="project-year">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <?php echo $project_year ? esc_html($project_year) : get_the_date('Y'); ?>
            </span>
        </div>

        <div class="portfolio-actions">
            <a href="<?php the_permalink(); ?>" class="project-link cyber-button">
                <?php _e('[DETAILS]', 'cyberpunk'); ?>
            </a>
            <?php if ($project_url) : ?>
                <a href="<?php echo esc_url($project_url); ?>" class="project-url cyber-button" target="_blank" rel="noopener">
                    <?php _e('[LIVE_DEMO]', 'cyberpunk'); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</article>
