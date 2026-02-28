<?php
/**
 * Cyberpunk Theme Customizer
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * ============================================
 * 1. REGISTER CUSTOMIZER SETTINGS
 * ============================================
 */

/**
 * Register Customizer Options
 */
function cyberpunk_customize_register($wp_customize) {

    /**
     * ============================================
     * PANEL: Cyberpunk Theme Options
     * ============================================
     */
    $wp_customize->add_panel('cyberpunk_theme_options', array(
        'title' => __('🌃 Cyberpunk Theme Options', 'cyberpunk'),
        'description' => __('Customize the Cyberpunk theme appearance, colors, effects, and behavior.', 'cyberpunk'),
        'priority' => 10,
        'capability' => 'edit_theme_options',
    ));

    /**
     * ============================================
     * SECTION: Color Scheme
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_color_scheme', array(
        'title' => __('🎨 Color Scheme', 'cyberpunk'),
        'description' => __('Customize the neon color palette for your cyberpunk theme.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 10,
    ));

    // Primary Neon Color
    $wp_customize->add_setting('cyberpunk_primary_color', array(
        'default' => '#00f0ff',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
        'capability' => 'edit_theme_options',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_primary_color',
        array(
            'label' => __('Primary Neon Color', 'cyberpunk'),
            'description' => __('Main accent color (default: Cyan)', 'cyberpunk'),
            'section' => 'cyberpunk_color_scheme',
            'settings' => 'cyberpunk_primary_color',
            'priority' => 10,
        )
    ));

    // Secondary Neon Color
    $wp_customize->add_setting('cyberpunk_secondary_color', array(
        'default' => '#ff00ff',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_secondary_color',
        array(
            'label' => __('Secondary Neon Color', 'cyberpunk'),
            'description' => __('Secondary accent color (default: Magenta)', 'cyberpunk'),
            'section' => 'cyberpunk_color_scheme',
            'settings' => 'cyberpunk_secondary_color',
            'priority' => 20,
        )
    ));

    // Accent Neon Color
    $wp_customize->add_setting('cyberpunk_accent_color', array(
        'default' => '#f0ff00',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_accent_color',
        array(
            'label' => __('Accent Neon Color', 'cyberpunk'),
            'description' => __('Accent color for warnings and highlights (default: Yellow)', 'cyberpunk'),
            'section' => 'cyberpunk_color_scheme',
            'settings' => 'cyberpunk_accent_color',
            'priority' => 30,
        )
    ));

    // Background Color
    $wp_customize->add_setting('cyberpunk_bg_color', array(
        'default' => '#0a0a0f',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_bg_color',
        array(
            'label' => __('Background Color', 'cyberpunk'),
            'description' => __('Main background color (default: Dark)', 'cyberpunk'),
            'section' => 'cyberpunk_color_scheme',
            'settings' => 'cyberpunk_bg_color',
            'priority' => 40,
        )
    ));

    // Text Color
    $wp_customize->add_setting('cyberpunk_text_color', array(
        'default' => '#e0e0e0',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'cyberpunk_text_color',
        array(
            'label' => __('Text Color', 'cyberpunk'),
            'description' => __('Main text color', 'cyberpunk'),
            'section' => 'cyberpunk_color_scheme',
            'settings' => 'cyberpunk_text_color',
            'priority' => 50,
        )
    ));

    /**
     * ============================================
     * SECTION: Typography
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_typography', array(
        'title' => __('📝 Typography', 'cyberpunk'),
        'description' => __('Customize fonts and text settings.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 20,
    ));

    // Base Font Size
    $wp_customize->add_setting('cyberpunk_base_font_size', array(
        'default' => '16',
        'type' => 'theme_mod',
        'sanitize_callback' => 'absint',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_base_font_size', array(
        'label' => __('Base Font Size (px)', 'cyberpunk'),
        'description' => __('Root font size for the theme', 'cyberpunk'),
        'section' => 'cyberpunk_typography',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 12,
            'max' => 24,
            'step' => 1,
        ),
        'priority' => 10,
    ));

    // Heading Font Size Multiplier
    $wp_customize->add_setting('cyberpunk_heading_scale', array(
        'default' => '1.5',
        'type' => 'theme_mod',
        'sanitize_callback' => 'floatval',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_heading_scale', array(
        'label' => __('Heading Scale', 'cyberpunk'),
        'description' => __('Multiplier for heading sizes (1.0 - 2.0)', 'cyberpunk'),
        'section' => 'cyberpunk_typography',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 1.0,
            'max' => 2.0,
            'step' => 0.1,
        ),
        'priority' => 20,
    ));

    // Line Height
    $wp_customize->add_setting('cyberpunk_line_height', array(
        'default' => '1.7',
        'type' => 'theme_mod',
        'sanitize_callback' => 'floatval',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_line_height', array(
        'label' => __('Line Height', 'cyberpunk'),
        'description' => __('Base line height for body text', 'cyberpunk'),
        'section' => 'cyberpunk_typography',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 1.2,
            'max' => 2.5,
            'step' => 0.1,
        ),
        'priority' => 30,
    ));

    /**
     * ============================================
     * SECTION: Visual Effects
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_effects', array(
        'title' => __('✨ Visual Effects', 'cyberpunk'),
        'description' => __('Enable or disable visual cyberpunk effects.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 30,
    ));

    // Enable Scanlines
    $wp_customize->add_setting('cyberpunk_enable_scanlines', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_scanlines', array(
        'label' => __('Enable CRT Scanline Effect', 'cyberpunk'),
        'description' => __('Show retro CRT scanlines overlay', 'cyberpunk'),
        'section' => 'cyberpunk_effects',
        'type' => 'checkbox',
        'priority' => 10,
    ));

    // Enable Glitch Effect
    $wp_customize->add_setting('cyberpunk_enable_glitch', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_glitch', array(
        'label' => __('Enable Glitch Animation', 'cyberpunk'),
        'description' => __('Apply glitch effect to headings', 'cyberpunk'),
        'section' => 'cyberpunk_effects',
        'type' => 'checkbox',
        'priority' => 20,
    ));

    // Enable Neon Flicker
    $wp_customize->add_setting('cyberpunk_enable_flicker', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_flicker', array(
        'label' => __('Enable Neon Flicker', 'cyberpunk'),
        'description' => __('Add realistic neon light flickering', 'cyberpunk'),
        'section' => 'cyberpunk_effects',
        'type' => 'checkbox',
        'priority' => 30,
    ));

    // Animation Speed
    $wp_customize->add_setting('cyberpunk_animation_speed', array(
        'default' => 'normal',
        'type' => 'theme_mod',
        'sanitize_callback' => 'cyberpunk_sanitize_choice',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_animation_speed', array(
        'label' => __('Animation Speed', 'cyberpunk'),
        'description' => ('Control overall animation speed'),
        'section' => 'cyberpunk_effects',
        'type' => 'select',
        'choices' => array(
            'slow' => __('Slow', 'cyberpunk'),
            'normal' => __('Normal', 'cyberpunk'),
            'fast' => __('Fast', 'cyberpunk'),
        ),
        'priority' => 40,
    ));

    /**
     * ============================================
     * SECTION: Layout Options
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_layout', array(
        'title' => __('📐 Layout', 'cyberpunk'),
        'description' => __('Configure layout and spacing options.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 40,
    ));

    // Container Width
    $wp_customize->add_setting('cyberpunk_container_width', array(
        'default' => '1200',
        'type' => 'theme_mod',
        'sanitize_callback' => 'absint',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_container_width', array(
        'label' => __('Container Width (px)', 'cyberpunk'),
        'description' => __('Maximum width of the content container', 'cyberpunk'),
        'section' => 'cyberpunk_layout',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 800,
            'max' => 1600,
            'step' => 50,
        ),
        'priority' => 10,
    ));

    // Posts Per Page
    $wp_customize->add_setting('cyberpunk_posts_per_page', array(
        'default' => '6',
        'type' => 'theme_mod',
        'sanitize_callback' => 'absint',
        'transport' => 'refresh',
        'capability' => 'manage_options',
    ));

    $wp_customize->add_control('cyberpunk_posts_per_page', array(
        'label' => __('Posts Per Page', 'cyberpunk'),
        'description' => __('Number of posts to display on archive pages', 'cyberpunk'),
        'section' => 'cyberpunk_layout',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 3,
            'max' => 20,
            'step' => 1,
        ),
        'priority' => 20,
    ));

    // Enable Sidebar
    $wp_customize->add_setting('cyberpunk_enable_sidebar', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_sidebar', array(
        'label' => __('Enable Sidebar', 'cyberpunk'),
        'description' => __('Show sidebar on single posts and pages', 'cyberpunk'),
        'section' => 'cyberpunk_layout',
        'type' => 'checkbox',
        'priority' => 30,
    ));

    /**
     * ============================================
     * SECTION: Performance Options
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_performance', array(
        'title' => __('⚡ Performance', 'cyberpunk'),
        'description' => __('Optimize theme performance and loading speed.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 50,
    ));

    // Enable Lazy Loading
    $wp_customize->add_setting('cyberpunk_enable_lazyload', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_lazyload', array(
        'label' => __('Enable Lazy Loading', 'cyberpunk'),
        'description' => __('Load images as they enter the viewport', 'cyberpunk'),
        'section' => 'cyberpunk_performance',
        'type' => 'checkbox',
        'priority' => 10,
    ));

    // Enable Caching
    $wp_customize->add_setting('cyberpunk_enable_caching', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_enable_caching', array(
        'label' => __('Enable Fragment Caching', 'cyberpunk'),
        'description' => __('Cache expensive operations for better performance', 'cyberpunk'),
        'section' => 'cyberpunk_performance',
        'type' => 'checkbox',
        'priority' => 20,
    ));

    // Defer JavaScript
    $wp_customize->add_setting('cyberpunk_defer_js', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_defer_js', array(
        'label' => __('Defer JavaScript Loading', 'cyberpunk'),
        'description' => __('Load non-critical JavaScript after page load', 'cyberpunk'),
        'section' => 'cyberpunk_performance',
        'type' => 'checkbox',
        'priority' => 30,
    ));

    /**
     * ============================================
     * SECTION: Header Options
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_header', array(
        'title' => __('🔝 Header', 'cyberpunk'),
        'description' => __('Customize header and navigation settings.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 60,
    ));

    // Sticky Header
    $wp_customize->add_setting('cyberpunk_sticky_header', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_sticky_header', array(
        'label' => __('Sticky Header', 'cyberpunk'),
        'description' => __('Keep header visible at the top when scrolling', 'cyberpunk'),
        'section' => 'cyberpunk_header',
        'type' => 'checkbox',
        'priority' => 10,
    ));

    // Header Background Blur
    $wp_customize->add_setting('cyberpunk_header_blur', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_header_blur', array(
        'label' => __('Header Blur Effect', 'cyberpunk'),
        'description' => __('Apply backdrop blur to sticky header', 'cyberpunk'),
        'section' => 'cyberpunk_header',
        'type' => 'checkbox',
        'priority' => 20,
    ));

    /**
     * ============================================
     * SECTION: Footer Options
     * ============================================
     */
    $wp_customize->add_section('cyberpunk_footer', array(
        'title' => __('🔽 Footer', 'cyberpunk'),
        'description' => __('Customize footer settings.', 'cyberpunk'),
        'panel' => 'cyberpunk_theme_options',
        'priority' => 70,
    ));

    // Footer Widget Columns
    $wp_customize->add_setting('cyberpunk_footer_columns', array(
        'default' => '3',
        'type' => 'theme_mod',
        'sanitize_callback' => 'absint',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_footer_columns', array(
        'label' => __('Footer Widget Columns', 'cyberpunk'),
        'description' => __('Number of footer widget areas', 'cyberpunk'),
        'section' => 'cyberpunk_footer',
        'type' => 'select',
        'choices' => array(
            '1' => __('1 Column', 'cyberpunk'),
            '2' => __('2 Columns', 'cyberpunk'),
            '3' => __('3 Columns', 'cyberpunk'),
            '4' => __('4 Columns', 'cyberpunk'),
        ),
        'priority' => 10,
    ));

    // Copyright Text
    $wp_customize->add_setting('cyberpunk_copyright_text', array(
        'default' => '',
        'type' => 'theme_mod',
        'sanitize_callback' => 'wp_kses_post',
        'transport' => 'refresh',
    ));

    $wp_customize->add_control('cyberpunk_copyright_text', array(
        'label' => __('Copyright Text', 'cyberpunk'),
        'description' => __('Custom copyright text in footer', 'cyberpunk'),
        'section' => 'cyberpunk_footer',
        'type' => 'text',
        'priority' => 20,
    ));
}
add_action('customize_register', 'cyberpunk_customize_register');

/**
 * ============================================
 * 2. SANITIZATION CALLBACKS
 * ============================================
 */

/**
 * Sanitize Choice
 */
function cyberpunk_sanitize_choice($value, $setting) {
    $choices = $setting->manager->get_control($setting->id)->choices;
    return array_key_exists($value, $choices) ? $value : $setting->default;
}

/**
 * ============================================
 * 3. OUTPUT CUSTOMIZER CSS
 * ============================================
 */

/**
 * Generate Customizer CSS
 */
function cyberpunk_customizer_css() {
    ?>
    <style type="text/css" id="cyberpunk-customizer-css">
        :root {
            /* Colors */
            --neon-cyan: <?php echo esc_attr(get_theme_mod('cyberpunk_primary_color', '#00f0ff')); ?>;
            --neon-magenta: <?php echo esc_attr(get_theme_mod('cyberpunk_secondary_color', '#ff00ff')); ?>;
            --neon-yellow: <?php echo esc_attr(get_theme_mod('cyberpunk_accent_color', '#f0ff00')); ?>;
            --bg-dark: <?php echo esc_attr(get_theme_mod('cyberpunk_bg_color', '#0a0a0f')); ?>;
            --text-main: <?php echo esc_attr(get_theme_mod('cyberpunk_text_color', '#e0e0e0')); ?>;

            /* Typography */
            --font-size-base: <?php echo esc_attr(get_theme_mod('cyberpunk_base_font_size', 16)); ?>px;
            --heading-scale: <?php echo esc_attr(get_theme_mod('cyberpunk_heading_scale', 1.5)); ?>;
            --line-height-base: <?php echo esc_attr(get_theme_mod('cyberpunk_line_height', 1.7)); ?>;

            /* Layout */
            --container-width: <?php echo esc_attr(get_theme_mod('cyberpunk_container_width', 1200)); ?>px;

            /* Animation Speed */
            --animation-speed-multiplier: <?php
                $speed = get_theme_mod('cyberpunk_animation_speed', 'normal');
                $multipliers = array('slow' => 1.5, 'normal' => 1, 'fast' => 0.7);
                echo esc_attr($multipliers[$speed] ?? 1);
            ?>;
        }

        /* Apply base font size */
        html {
            font-size: var(--font-size-base);
        }

        /* Apply line height */
        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            line-height: var(--line-height-base);
        }

        /* Container width */
        .container {
            max-width: var(--container-width);
        }

        /* Effects toggles */
        <?php if (!get_theme_mod('cyberpunk_enable_scanlines', true)) : ?>
        body::before {
            display: none !important;
        }
        <?php endif; ?>

        <?php if (!get_theme_mod('cyberpunk_enable_flicker', true)) : ?>
        .neon-text,
        .site-title {
            animation: none !important;
        }
        <?php endif; ?>

        <?php if (!get_theme_mod('cyberpunk_enable_glitch', true)) : ?>
        .glitch {
            animation: none !important;
        }
        <?php endif; ?>

        /* Header options */
        <?php if (get_theme_mod('cyberpunk_header_blur', true)) : ?>
        .site-header {
            backdrop-filter: blur(10px);
        }
        <?php endif; ?>

        /* Animation speed adjustments */
        @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(10px); }
        }

        body::before {
            animation-duration: calc(8s * var(--animation-speed-multiplier));
        }
    </style>
    <?php
}
add_action('wp_head', 'cyberpunk_customizer_css', 100);

/**
 * ============================================
 * 4. CUSTOMIZER PREVIEW (Live Preview)
 * ============================================
 */

/**
 * Enqueue Customizer Preview Scripts
 */
function cyberpunk_customize_preview_js() {
    wp_enqueue_script(
        'cyberpunk-customizer-preview',
        get_template_directory_uri() . '/assets/js/customizer-preview.js',
        array('jquery', 'customize-preview'),
        '1.0.0',
        true
    );
}
add_action('customize_preview_init', 'cyberpunk_customize_preview_js');

/**
 * ============================================
 * 5. HELPER FUNCTIONS
 * ============================================
 */

/**
 * Get Theme Mod with Default
 */
function cyberpunk_get_mod($name, $default = '') {
    return get_theme_mod($name, $default);
}

/**
 * Get Customizer Options Array
 */
function cyberpunk_get_options() {
    return array(
        'primary_color' => cyberpunk_get_mod('cyberpunk_primary_color', '#00f0ff'),
        'secondary_color' => cyberpunk_get_mod('cyberpunk_secondary_color', '#ff00ff'),
        'accent_color' => cyberpunk_get_mod('cyberpunk_accent_color', '#f0ff00'),
        'bg_color' => cyberpunk_get_mod('cyberpunk_bg_color', '#0a0a0f'),
        'text_color' => cyberpunk_get_mod('cyberpunk_text_color', '#e0e0e0'),
        'enable_scanlines' => cyberpunk_get_mod('cyberpunk_enable_scanlines', true),
        'enable_glitch' => cyberpunk_get_mod('cyberpunk_enable_glitch', true),
        'enable_flicker' => cyberpunk_get_mod('cyberpunk_enable_flicker', true),
        'enable_lazyload' => cyberpunk_get_mod('cyberpunk_enable_lazyload', true),
        'enable_caching' => cyberpunk_get_mod('cyberpunk_enable_caching', true),
        'animation_speed' => cyberpunk_get_mod('cyberpunk_animation_speed', 'normal'),
    );
}
