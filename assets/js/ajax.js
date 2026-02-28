/**
 * Cyberpunk Theme - AJAX Functions
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 */

(function($) {
    'use strict';

    /**
     * ============================================
     * 1. LOAD MORE POSTS
     * ============================================
     */
    const CyberpunkLoadMore = {
        init: function() {
            this.button = $('.load-more-btn');
            if (!this.button.length) return;

            this.container = $('.posts-grid');
            this.currentPage = 1;
            this.maxPages = parseInt(this.button.data('max-pages'));

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            this.button.on('click', function(e) {
                e.preventDefault();
                self.loadPosts();
            });
        },

        loadPosts: function() {
            const self = this;

            if (this.currentPage >= this.maxPages) {
                this.button.text('No More Posts').prop('disabled', true);
                return;
            }

            this.button
                .text('Loading...')
                .addClass('loading');

            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_load_more',
                    nonce: cyberpunkAjax.nonce,
                    page: this.currentPage + 1,
                    posts_per_page: 6
                },
                success: function(response) {
                    if (response.success) {
                        self.container.append(response.data.html);
                        self.currentPage = response.data.current_page;
                        self.maxPages = response.data.max_pages;

                        if (self.currentPage >= self.maxPages) {
                            self.button
                                .text('All Posts Loaded')
                                .prop('disabled', true);
                        } else {
                            self.button.text('Load More');
                        }

                        // Add neon effect to new posts
                        self.applyNeonEffect();
                    } else {
                        self.button.text('Error. Try Again.');
                    }
                },
                error: function() {
                    self.button.text('Error. Try Again.');
                },
                complete: function() {
                    self.button.removeClass('loading');
                }
            });
        },

        applyNeonEffect: function() {
            // Re-initialize neon effects on new posts
            $('.post-card:not(.neon-applied)').addClass('neon-applied');
        }
    };

    /**
     * ============================================
     * 2. LIVE SEARCH
     * ============================================
     */
    const CyberpunkSearch = {
        init: function() {
            this.input = $('#search-input');
            this.resultsContainer = $('.search-results');
            this.searchTimeout = null;

            if (!this.input.length) return;

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            this.input.on('keyup', function() {
                const query = $(this).val();

                clearTimeout(self.searchTimeout);

                if (query.length < 3) {
                    self.resultsContainer.empty().hide();
                    return;
                }

                // Debounce search
                self.searchTimeout = setTimeout(function() {
                    self.search(query);
                }, 300);
            });

            // Hide results when clicking outside
            $(document).on('click', function(e) {
                if (!self.input.is(e.target) && !self.resultsContainer.is(e.target)) {
                    self.resultsContainer.hide();
                }
            });
        },

        search: function(query) {
            const self = this;

            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_search',
                    nonce: cyberpunkAjax.nonce,
                    query: query
                },
                beforeSend: function() {
                    self.resultsContainer.html('<div class="search-loading">Searching...</div>').show();
                },
                success: function(response) {
                    if (response.success) {
                        self.displayResults(response.data.results);
                    } else {
                        self.resultsContainer.html('<div class="search-error">No results found</div>');
                    }
                },
                error: function() {
                    self.resultsContainer.html('<div class="search-error">Search error</div>');
                }
            });
        },

        displayResults: function(results) {
            let html = '';

            if (results.length === 0) {
                html = '<div class="search-no-results">No results found</div>';
            } else {
                html = '<div class="search-results-list">';
                results.forEach(function(post) {
                    html += `
                        <div class="search-result-item">
                            ${post.thumbnail ? `<img src="${post.thumbnail}" alt="" class="search-thumbnail">` : ''}
                            <div class="search-result-content">
                                <h3><a href="${post.permalink}">${post.title}</a></h3>
                                <p>${post.excerpt}</p>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }

            this.resultsContainer.html(html).show();
        }
    };

    /**
     * ============================================
     * 3. BACK TO TOP BUTTON
     * ============================================
     */
    const CyberpunkBackToTop = {
        init: function() {
            this.button = $('.back-to-top');
            if (!this.button.length) return;

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            // Show/hide on scroll
            $(window).on('scroll', function() {
                if ($(this).scrollTop() > 300) {
                    self.button.addClass('visible');
                } else {
                    self.button.removeClass('visible');
                }
            });

            // Scroll to top
            this.button.on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 600);
            });
        }
    };

    /**
     * ============================================
     * 4. POST LIKES/BOOKMARKS
     * ============================================
     */
    const CyberpunkLikes = {
        init: function() {
            this.likeButtons = '.like-button';

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            $(document).on('click', this.likeButtons, function(e) {
                e.preventDefault();
                const button = $(this);
                const postId = button.data('post-id');

                self.toggleLike(postId, button);
            });
        },

        toggleLike: function(postId, button) {
            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_post_like',
                    nonce: cyberpunkAjax.nonce,
                    post_id: postId
                },
                beforeSend: function() {
                    button.addClass('loading');
                },
                success: function(response) {
                    if (response.success) {
                        const count = button.find('.like-count');
                        count.text(response.data.likes);

                        if (response.data.action === 'liked') {
                            button.addClass('liked');
                        } else {
                            button.removeClass('liked');
                        }
                    }
                },
                complete: function() {
                    button.removeClass('loading');
                }
            });
        }
    };

    /**
     * ============================================
     * 5. GLITCH EFFECT ENHANCEMENT
     * ============================================
     */
    const CyberpunkGlitch = {
        init: function() {
            this.glitchElements = $('.glitch');
            if (!this.glitchElements.length) return;

            this.applyGlitch();
        },

        applyGlitch: function() {
            const self = this;

            this.glitchElements.each(function() {
                const element = $(this);
                const text = element.text();

                element.on('mouseover', function() {
                    self.randomGlitch(element);
                });
            });
        },

        randomGlitch: function(element) {
            const originalText = element.data('text') || element.text();
            element.data('text', originalText);

            let iterations = 0;
            const interval = setInterval(() => {
                element.text(
                    originalText
                        .split('')
                        .map((letter, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'[Math.floor(Math.random() * 36)];
                        })
                        .join('')
                );

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);
        }
    };

    /**
     * ============================================
     * 6. NEON GLOW EFFECT
     * ============================================
     */
    const CyberpunkNeon = {
        init: function() {
            this.neonElements = $('.neon-text, .neon-box');
            if (!this.neonElements.length) return;

            this.animateNeon();
        },

        animateNeon: function() {
            // Pulsing glow effect
            this.neonElements.each(function() {
                const element = $(this);
                let glowIntensity = 0;

                setInterval(() => {
                    glowIntensity = (glowIntensity + 0.1) % (Math.PI * 2);
                    const opacity = 0.5 + Math.sin(glowIntensity) * 0.5;
                    element.css('--glow-opacity', opacity);
                }, 50);
            });
        }
    };

    /**
     * ============================================
     * 7. MOBILE MENU
     * ============================================
     */
    const CyberpunkMobileMenu = {
        init: function() {
            this.toggle = $('.menu-toggle');
            this.menu = $('.main-navigation ul');

            if (!this.toggle.length) return;

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            this.toggle.on('click', function(e) {
                e.preventDefault();
                self.menu.slideToggle(300);
            });

            // Reset on window resize
            $(window).on('resize', function() {
                if ($(window).width() > 768) {
                    self.menu.show();
                } else {
                    self.menu.hide();
                }
            });
        }
    };

    /**
     * ============================================
     * 8. THEME CONFIG FROM REST API
     * ============================================
     */
    const CyberpunkConfig = {
        init: function() {
            this.fetchConfig();
        },

        fetchConfig: function() {
            $.ajax({
                url: cyberpunkAjax.rest_url + 'config',
                type: 'GET',
                success: function(response) {
                    CyberpunkConfig.applyConfig(response);
                }
            });
        },

        applyConfig: function(config) {
            // Apply colors dynamically
            if (config.colors) {
                document.documentElement.style.setProperty(
                    '--neon-cyan',
                    config.colors.primary
                );
                document.documentElement.style.setProperty(
                    '--neon-magenta',
                    config.colors.secondary
                );
            }

            // Apply effects settings
            if (config.effects) {
                if (!config.effects.scanlines) {
                    $('body').addClass('no-scanlines');
                }
                if (!config.effects.glitch) {
                    $('.glitch').removeClass('glitch');
                }
            }
        }
    };

    /**
     * ============================================
     * 9. FORM VALIDATION
     * ============================================
     */
    const CyberpunkForms = {
        init: function() {
            this.forms = $('form');
            if (!this.forms.length) return;

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            this.forms.on('submit', function(e) {
                const form = $(this);
                const required = form.find('[required]');

                let valid = true;
                required.each(function() {
                    if (!$(this).val()) {
                        valid = false;
                        $(this).addClass('error');
                    }
                });

                if (!valid) {
                    e.preventDefault();
                    self.showError('Please fill in all required fields');
                }
            });

            // Clear errors on input
            $('input, textarea').on('input', function() {
                $(this).removeClass('error');
            });
        },

        showError: function(message) {
            const error = $('<div class="form-error neon-box">' + message + '</div>');
            $('form').before(error);

            setTimeout(function() {
                error.fadeOut(function() {
                    $(this).remove();
                });
            }, 3000);
        }
    };

    /**
     * ============================================
     * 10. SCANLINE EFFECT
     * ============================================
     */
    const CyberpunkScanlines = {
        init: function() {
            // Check if scanlines are enabled
            if ($('body').hasClass('no-scanlines')) return;

            this.createScanlines();
        },

        createScanlines: function() {
            // Scanlines are already handled by CSS
            // This function is for future JS-based enhancements
            console.log('Scanlines enabled');
        }
    };

    /**
     * ============================================
     * INITIALIZE ALL MODULES
     * ============================================
     */
    $(document).ready(function() {
        CyberpunkLoadMore.init();
        CyberpunkSearch.init();
        CyberpunkBackToTop.init();
        CyberpunkLikes.init();
        CyberpunkGlitch.init();
        CyberpunkNeon.init();
        CyberpunkMobileMenu.init();
        CyberpunkConfig.init();
        CyberpunkForms.init();
        CyberpunkScanlines.init();

        console.log('🌃 Cyberpunk Theme initialized');
    });

})(jQuery);

/**
 * ============================================
 * EXPORTS (for potential module usage)
 * ============================================
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CyberpunkLoadMore,
        CyberpunkSearch,
        CyberpunkGlitch,
        CyberpunkNeon
    };
}
