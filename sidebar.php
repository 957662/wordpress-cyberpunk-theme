<?php
/**
 * The sidebar containing the main widget area
 *
 * @package Cyberpunk_Theme
 */

if (!is_active_sidebar('sidebar-1')) {
    return;
}
?>

<aside id="secondary" class="widget-area">
    <div class="sidebar-inner">
        
        <?php dynamic_sidebar('sidebar-1'); ?>

        <!-- 默认小工具 -->
        <div class="widget widget-search">
            <h2 class="widget-title"><?php _e('Search', 'cyberpunk'); ?></h2>
            <?php get_search_form(); ?>
        </div>

        <div class="widget widget-categories">
            <h2 class="widget-title"><?php _e('Categories', 'cyberpunk'); ?></h2>
            <ul>
                <?php
                wp_list_categories(array(
                    'title_li' => '',
                    'show_count' => true,
                ));
                ?>
            </ul>
        </div>

        <div class="widget widget-recent-posts">
            <h2 class="widget-title"><?php _e('Recent Posts', 'cyberpunk'); ?></h2>
            <ul>
                <?php
                $recent_posts = wp_get_recent_posts(array(
                    'numberposts' => 5,
                    'post_status' => 'publish',
                ));
                foreach ($recent_posts as $post) :
                ?>
                    <li>
                        <a href="<?php echo get_permalink($post['ID']); ?>">
                            <?php echo $post['post_title']; ?>
                        </a>
                        <span class="post-date">
                            <?php echo get_the_date('', $post['ID']); ?>
                        </span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="widget widget-archives">
            <h2 class="widget-title"><?php _e('Archives', 'cyberpunk'); ?></h2>
            <ul>
                <?php
                wp_get_archives(array(
                    'type' => 'monthly',
                    'show_post_count' => true,
                ));
                ?>
            </ul>
        </div>

        <div class="widget widget-tags">
            <h2 class="widget-title"><?php _e('Tags', 'cyberpunk'); ?></h2>
            <div class="tag-cloud">
                <?php
                $tags = get_tags(array(
                    'number' => 20,
                    'orderby' => 'count',
                    'order' => 'DESC',
                ));
                if ($tags) :
                    foreach ($tags as $tag) :
                        echo '<a href="' . get_tag_link($tag->term_id) . '" class="tag-link">' . $tag->name . '</a>';
                    endforeach;
                endif;
                ?>
            </div>
        </div>

    </div>
</aside>
