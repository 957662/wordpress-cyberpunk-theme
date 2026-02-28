    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <?php if (is_active_sidebar('footer-1') || is_active_sidebar('footer-2') || is_active_sidebar('footer-3')) : ?>
                <div class="footer-widgets">
                    <?php if (is_active_sidebar('footer-1')) : ?>
                        <div class="footer-widget-area">
                            <?php dynamic_sidebar('footer-1'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (is_active_sidebar('footer-2')) : ?>
                        <div class="footer-widget-area">
                            <?php dynamic_sidebar('footer-2'); ?>
                        </div>
                    <?php endif; ?>

                    <?php if (is_active_sidebar('footer-3')) : ?>
                        <div class="footer-widget-area">
                            <?php dynamic_sidebar('footer-3'); ?>
                        </div>
                    <?php endif; ?>
                </div><!-- .footer-widgets -->
            <?php endif; ?>

            <div class="site-info">
                <p class="copyright">
                    <span class="glitch-effect">&copy; <?php echo cyberpunk_copyright_years(); ?> 
                    <a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>. 
                    <?php _e('All systems operational.', 'cyberpunk'); ?></span>
                </p>
                <p class="theme-credit">
                    <?php 
                    printf(
                        __('Powered by %1$s | Theme: %2$s', 'cyberpunk'),
                        '<a href="https://wordpress.org/" target="_blank" rel="noopener">WordPress</a>',
                        '<a href="#" class="neon-text">Cyberpunk</a>'
                    );
                    ?>
                </p>
            </div><!-- .site-info -->
        </div><!-- .container -->
    </footer><!-- #colophon -->
</div><!-- #page -->

<!-- Back to Top Button -->
<a href="#" id="back-to-top" class="back-to-top">
    <span class="arrow">↑</span>
    <span class="text">TOP</span>
</a>

<script>
(function() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
})();
</script>

<?php wp_footer(); ?>

</body>
</html>
