<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Scanline overlay -->
<div class="scanline-overlay"></div>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php _e('Skip to content', 'cyberpunk'); ?></a>

    <header id="masthead" class="site-header">
        <div class="container">
            <div class="site-branding">
                <?php if (has_custom_logo()) : ?>
                    <div class="custom-logo-wrapper">
                        <?php the_custom_logo(); ?>
                    </div>
                <?php else : ?>
                    <h1 class="site-title">
                        <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                            <?php bloginfo('name'); ?>
                        </a>
                    </h1>
                    <?php
                    $cyberpunk_description = get_bloginfo('description', 'display');
                    if ($cyberpunk_description || is_customize_preview()) :
                    ?>
                        <p class="site-description"><?php echo $cyberpunk_description; ?></p>
                    <?php endif; ?>
                <?php endif; ?>
            </div><!-- .site-branding -->

            <nav id="site-navigation" class="main-navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span class="menu-text"><?php _e('MENU', 'cyberpunk'); ?></span>
                    <span class="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_id' => 'primary-menu',
                    'menu_class' => 'nav-menu',
                    'container' => false,
                    'fallback_cb' => false,
                ));
                ?>

                <!-- Search Toggle Button -->
                <button class="search-toggle" aria-label="<?php _e('Toggle search', 'cyberpunk'); ?>" aria-expanded="false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </nav><!-- #site-navigation -->

            <!-- Search Form Overlay -->
            <div class="search-form-overlay" aria-hidden="true">
                <div class="search-form-wrapper">
                    <?php get_search_form(); ?>
                    <button class="search-close" aria-label="<?php _e('Close search', 'cyberpunk'); ?>">
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div><!-- .search-form-overlay -->
        </div><!-- .container -->
    </header><!-- #masthead -->

    <div id="content" class="site-content">
