<?php
/**
 * The template for displaying comments
 *
 * @package Cyberpunk_Theme
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password,
 * return early without loading the comments.
 */
if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php if (have_comments()) : ?>
        <h2 class="comments-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <?php
            $comments_number = get_comments_number();
            if ($comments_number === 1) {
                _e('1 Comment', 'cyberpunk');
            } else {
                printf(_n('%s Comment', '%s Comments', $comments_number, 'cyberpunk'), $comments_number);
            }
            ?>
        </h2>

        <?php the_comments_navigation(); ?>

        <ul class="comment-list">
            <?php
            wp_list_comments(array(
                'style' => 'ul',
                'short_ping' => true,
                'avatar_size' => 50,
                'callback' => 'cyberpunk_comment',
            ));
            ?>
        </ul>

        <?php
        the_comments_navigation();

        // If comments are closed and there are comments, let's leave a little note.
        if (!comments_open()) :
            ?>
            <p class="no-comments"><?php _e('Comments are closed.', 'cyberpunk'); ?></p>
            <?php
        endif;

    endif; // Check for have_comments().

    // Comment Form
    comment_form(array(
        'title_reply' => '<span class="cyber-heading">' . __('Leave a Comment', 'cyberpunk') . '</span>',
        'class_form' => 'comment-form cyber-form',
        'label_submit' => __('Submit', 'cyberpunk'),
        'class_submit' => 'submit cyber-button',
    ));
    ?>

</div>

<?php
/**
 * Custom comment callback
 */
function cyberpunk_comment($comment, $args, $depth) {
    $tag = ('div' === $args['style']) ? 'div' : 'li';
    ?>
    <<?php echo $tag; ?> id="comment-<?php comment_ID(); ?>" <?php comment_class(empty($args['has_children']) ? '' : 'parent', $comment); ?>>
        <article id="div-comment-<?php comment_ID(); ?>" class="comment-body">
            
            <footer class="comment-meta">
                <div class="comment-author vcard">
                    <?php if (0 != $args['avatar_size']) echo get_avatar($comment, $args['avatar_size']); ?>
                    <span class="fn"><?php comment_author_link($comment); ?></span>
                </div>
                
                <div class="comment-metadata">
                    <a href="<?php echo esc_url(get_comment_link($comment, $args)); ?>">
                        <time datetime="<?php comment_time('c'); ?>">
                            <?php comment_date(); ?> at <?php comment_time(); ?>
                        </time>
                    </a>
                    
                    <?php edit_comment_link(__('Edit', 'cyberpunk'), '<span class="edit-link">', '</span>'); ?>
                </div>
                
                <?php if ('0' == $comment->comment_approved) : ?>
                    <p class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.', 'cyberpunk'); ?></p>
                <?php endif; ?>
            </footer>

            <div class="comment-content">
                <?php comment_text(); ?>
            </div>

            <div class="reply">
                <?php comment_reply_link(array_merge($args, array('depth' => $depth, 'max_depth' => $args['max_depth']))); ?>
            </div>

        </article>
    <?php
}
