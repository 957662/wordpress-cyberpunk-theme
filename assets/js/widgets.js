/**
 * Widget Scripts
 *
 * @package Cyberpunk_Theme
 * @since 2.2.0
 */

(function($) {
    'use strict';

    /**
     * Widget initialization
     */
    const CyberpunkWidgets = {
        /**
         * Initialize all widgets
         */
        init: function() {
            this.initAboutMeWidget();
            this.initRecentPostsWidget();
            this.initSocialLinksWidget();
            this.initPopularPostsWidget();
            this.initWidgetAnimations();
        },

        /**
         * About Me Widget
         */
        initAboutMeWidget: function() {
            const $widgets = $('.cyberpunk-widget-about-me');

            if ($widgets.length === 0) return;

            $widgets.each(function() {
                const $widget = $(this);
                const $avatar = $widget.find('.about-me-avatar');

                // Avatar hover effect
                $avatar.on('mouseenter', function() {
                    $(this).css('transform', 'scale(1.05) rotate(5deg)');
                }).on('mouseleave', function() {
                    $(this).css('transform', 'scale(1) rotate(0deg)');
                });

                // Social links tooltip
                $widget.find('.social-link').each(function() {
                    const $link = $(this);
                    const platform = $link.attr('class').match(/social-(\w+)/);
                    const platformName = platform ? platform[1] : '';

                    if (platformName) {
                        $link.attr('title', `Visit us on ${platformName.charAt(0).toUpperCase() + platformName.slice(1)}`);
                    }
                });
            });
        },

        /**
         * Recent Posts Widget
         */
        initRecentPostsWidget: function() {
            const $widgets = $('.cyberpunk-widget-recent-posts');

            if ($widgets.length === 0) return;

            $widgets.each(function() {
                const $widget = $(this);
                const $list = $widget.find('.recent-posts-list');
                const $items = $list.find('.recent-post-item');

                // Add staggered animation
                $items.each(function(index) {
                    $(this).css('animation-delay', `${index * 0.1}s`);
                    $(this).addClass('fade-in-up');
                });

                // Lazy load images
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                const src = img.getAttribute('data-src');
                                if (src) {
                                    img.setAttribute('src', src);
                                    img.removeAttribute('data-src');
                                    observer.unobserve(img);
                                }
                            }
                        });
                    });

                    $widget.find('img[data-src]').each(function() {
                        imageObserver.observe(this);
                    });
                }
            });
        },

        /**
         * Social Links Widget
         */
        initSocialLinksWidget: function() {
            const $widgets = $('.cyberpunk-widget-social-links');

            if ($widgets.length === 0) return;

            $widgets.each(function() {
                const $widget = $(this);
                const $links = $widget.find('.social-link');

                // Add ripple effect on click
                $links.on('click', function(e) {
                    const $link = $(this);
                    const ripple = $('<span class="ripple"></span>');
                    const size = Math.max($link.outerWidth(), $link.outerHeight());
                    const offset = $link.offset();
                    const x = e.pageX - offset.left - size / 2;
                    const y = e.pageY - offset.top - size / 2;

                    ripple.css({
                        width: size,
                        height: size,
                        left: x,
                        top: y
                    });

                    $link.append(ripple);

                    setTimeout(() => ripple.remove(), 600);
                });

                // Track social link clicks
                $links.on('click', function() {
                    const platform = $(this).attr('class').match(/social-(\w+)/);
                    const platformName = platform ? platform[1] : '';

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click', {
                            'event_category': 'Social Link',
                            'event_label': platformName
                        });
                    }
                });
            });
        },

        /**
         * Popular Posts Widget
         */
        initPopularPostsWidget: function() {
            const $widgets = $('.cyberpunk-widget-popular-posts');

            if ($widgets.length === 0) return;

            $widgets.each(function() {
                const $widget = $(this);
                const $items = $widget.find('.popular-post-item');

                // Add rank badges with different colors
                $items.each(function(index) {
                    const $item = $(this);
                    const $rank = $item.find('.popular-post-rank');
                    const rank = index + 1;

                    // Special styling for top 3
                    if (rank === 1) {
                        $rank.css('background', '#ffd700'); // Gold
                    } else if (rank === 2) {
                        $rank.css('background', '#c0c0c0'); // Silver
                    } else if (rank === 3) {
                        $rank.css('background', '#cd7f32'); // Bronze
                    }
                });

                // Animate view counts
                $widget.find('.popular-post-views').each(function() {
                    const $views = $(this);
                    const text = $views.text();
                    const match = text.match(/(\d+)/);

                    if (match) {
                        const targetValue = parseInt(match[0]);
                        const duration = 2000;
                        const steps = 60;
                        const increment = targetValue / steps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetValue) {
                                current = targetValue;
                                clearInterval(timer);
                            }

                            // Format number with commas
                            const formatted = Math.floor(current).toLocaleString();
                            $views.text(text.replace(/\d+/, formatted));
                        }, duration / steps);
                    }
                });
            });
        },

        /**
         * Widget animations
         */
        initWidgetAnimations: function() {
            // Animate widgets on scroll
            if ('IntersectionObserver' in window) {
                const widgetObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const $widget = $(entry.target);
                            $widget.addClass('animate-in');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                $('.cyberpunk-widget').each(function() {
                    widgetObserver.observe(this);
                });
            }

            // Add particle effect on hover
            $('.cyberpunk-widget').on('mouseenter', function() {
                const $widget = $(this);
                this.createParticles($widget);
            }.bind(this));
        },

        /**
         * Create particle effect
         */
        createParticles: function($element) {
            const colors = ['#00f0ff', '#ff00ff', '#f0ff00'];
            const particleCount = 20;

            for (let i = 0; i < particleCount; i++) {
                const particle = $('<div class="widget-particle"></div>');
                const size = Math.random() * 4 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const startX = Math.random() * $element.outerWidth();
                const startY = Math.random() * $element.outerHeight();
                const duration = Math.random() * 1000 + 500;

                particle.css({
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    background: color,
                    borderRadius: '50%',
                    left: startX + 'px',
                    top: startY + 'px',
                    pointerEvents: 'none',
                    opacity: 0,
                    zIndex: -1
                });

                $element.css('position', 'relative').append(particle);

                // Animate particle
                particle.animate({
                    opacity: 1,
                    transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`,
                    opacity: 0
                }, {
                    duration: duration,
                    easing: 'easeOutQuad',
                    complete: function() {
                        particle.remove();
                    }
                });
            }
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        CyberpunkWidgets.init();
    });

    /**
     * AJAX: Track widget interactions
     */
    $(document).on('click', '.cyberpunk-widget a', function() {
        const $widget = $(this).closest('.cyberpunk-widget');
        const widgetType = $widget.attr('class').match(/cyberpunk-widget-([\w-]+)/);
        const widgetName = widgetType ? widgetType[1] : 'unknown';

        // Send AJAX request
        $.ajax({
            url: cyberpunkWidget.ajax_url,
            type: 'POST',
            data: {
                action: 'cyberpunk_track_widget_click',
                nonce: cyberpunkWidget.nonce,
                widget_type: widgetName,
                post_id: $(this).data('post-id') || 0
            },
            success: function(response) {
                if (response.success) {
                    console.log('Widget click tracked:', response.data);
                }
            },
            error: function(xhr, status, error) {
                console.error('Widget tracking error:', error);
            }
        });
    });

    /**
     * AJAX: Load more posts (for Recent Posts Widget)
     */
    $(document).on('click', '.cyberpunk-widget-recent-posts .load-more-posts', function() {
        const $button = $(this);
        const $widget = $button.closest('.cyberpunk-widget-recent-posts');
        const offset = $widget.find('.recent-posts-list .recent-post-item').length;
        const number = 5;

        $button.prop('disabled', true).text('Loading...');

        $.ajax({
            url: cyberpunkWidget.ajax_url,
            type: 'POST',
            data: {
                action: 'cyberpunk_load_recent_posts',
                nonce: cyberpunkWidget.nonce,
                offset: offset,
                number: number
            },
            success: function(response) {
                if (response.success) {
                    const $newItems = $(response.data.html);
                    $widget.find('.recent-posts-list').append($newItems);

                    if (!response.data.has_more) {
                        $button.remove();
                    } else {
                        $button.prop('disabled', false).text('Load More');
                    }
                } else {
                    $button.prop('disabled', false).text('Load More');
                    console.error('Load posts error:', response.data);
                }
            },
            error: function(xhr, status, error) {
                $button.prop('disabled', false).text('Load More');
                console.error('AJAX error:', error);
            }
        });
    });

    /**
     * Export for global access
     */
    window.CyberpunkWidgets = CyberpunkWidgets;

})(jQuery);

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    .cyberpunk-widget {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .cyberpunk-widget.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .fade-in-up {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
        transform: translateY(10px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
