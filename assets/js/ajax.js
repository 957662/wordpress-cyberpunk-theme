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
            this.likeButtons = '.cyberpunk-like-button, .like-button';
            this.bookmarkButtons = '.cyberpunk-bookmark-button';

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            // Handle likes
            $(document).on('click', this.likeButtons, function(e) {
                e.preventDefault();
                const button = $(this);
                const postId = button.data('post-id');

                self.toggleLike(postId, button);
            });

            // Handle bookmarks
            $(document).on('click', this.bookmarkButtons, function(e) {
                e.preventDefault();
                const button = $(this);
                const postId = button.data('post-id');

                self.toggleBookmark(postId, button);
            });
        },

        toggleLike: function(postId, button) {
            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_like_post',
                    nonce: cyberpunkAjax.nonce,
                    post_id: postId
                },
                beforeSend: function() {
                    button.addClass('loading');
                    button.find('.like-icon').removeClass('fa-heart fa-heart-o').addClass('fa-spinner fa-spin');
                },
                success: function(response) {
                    if (response.success) {
                        const count = button.find('.like-count');
                        const icon = button.find('.like-icon');

                        count.text(response.data.like_count);

                        if (response.data.action === 'liked') {
                            button.addClass('liked');
                            icon.removeClass('fa-spinner fa-spin').addClass('fa-heart');
                            CyberpunkNotifications.show('success', response.message);
                        } else {
                            button.removeClass('liked');
                            icon.removeClass('fa-spinner fa-spin').addClass('fa-heart-o');
                            CyberpunkNotifications.show('info', response.message);
                        }
                    } else {
                        CyberpunkNotifications.show('error', response.message);
                    }
                },
                error: function() {
                    CyberpunkNotifications.show('error', cyberpunkAjax.strings.error);
                },
                complete: function() {
                    button.removeClass('loading');
                }
            });
        },

        toggleBookmark: function(postId, button) {
            // Check if user is logged in
            if (!cyberpunkAjax.is_user_logged_in) {
                CyberpunkNotifications.show('warning', 'You must be logged in to bookmark posts.');
                return;
            }

            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_bookmark_post',
                    nonce: cyberpunkAjax.nonce,
                    post_id: postId
                },
                beforeSend: function() {
                    button.addClass('loading');
                },
                success: function(response) {
                    if (response.success) {
                        const icon = button.find('.bookmark-icon');

                        if (response.data.action === 'added') {
                            button.addClass('bookmarked');
                            icon.removeClass('fa-bookmark-o').addClass('fa-bookmark');
                            CyberpunkNotifications.show('success', response.message);
                        } else {
                            button.removeClass('bookmarked');
                            icon.removeClass('fa-bookmark').addClass('fa-bookmark-o');
                            CyberpunkNotifications.show('info', response.message);
                        }

                        // Update bookmarks count
                        $('.bookmarks-count').text(response.data.bookmarks_count);
                    } else {
                        CyberpunkNotifications.show('error', response.message);
                    }
                },
                error: function() {
                    CyberpunkNotifications.show('error', cyberpunkAjax.strings.error);
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
     * 11. READING PROGRESS TRACKING
     * ============================================
     */
    const CyberpunkReadingProgress = {
        init: function() {
            if (!document.body.classList.contains('single-post')) return;

            this.$progressBar = $('.reading-progress-bar');
            this.postId = $('article.post').data('post-id');
            this.saveTimeout = null;

            this.trackProgress();
            this.restoreProgress();
        },

        trackProgress: function() {
            const self = this;

            $(window).on('scroll', function() {
                const windowHeight = $(this).height();
                const documentHeight = $(document).height();
                const scrollTop = $(this).scrollTop();
                const progress = ((scrollTop + windowHeight / 2) / documentHeight) * 100;

                // Update progress bar
                if (self.$progressBar.length) {
                    self.$progressBar.css('width', progress + '%');
                }

                // Debounced save
                clearTimeout(self.saveTimeout);
                self.saveTimeout = setTimeout(function() {
                    self.saveProgress(progress);
                }, 1000);
            });
        },

        saveProgress: function(progress) {
            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_save_reading_progress',
                    post_id: this.postId,
                    progress: progress,
                    nonce: cyberpunkAjax.nonce,
                },
                success: function(response) {
                    // Also save to localStorage as backup
                    localStorage.setItem('cyberpunk_reading_progress_' + CyberpunkReadingProgress.postId, progress);
                }
            });
        },

        restoreProgress: function() {
            const savedProgress = localStorage.getItem('cyberpunk_reading_progress_' + this.postId);

            if (savedProgress) {
                const progress = parseFloat(savedProgress);
                const documentHeight = $(document).height();
                const scrollPosition = (progress / 100) * documentHeight;

                setTimeout(function() {
                    $(window).scrollTop(scrollPosition);
                }, 500);
            }
        }
    };

    /**
     * ============================================
     * 12. NOTIFICATION SYSTEM
     * ============================================
     */
    const CyberpunkNotifications = {
        show: function(type, message) {
            // Remove existing notifications
            $('.cyberpunk-notification').remove();

            // Create notification element
            const iconMap = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            const $notification = $(`
                <div class="cyberpunk-notification notification-${type}">
                    <i class="fas ${iconMap[type]} notification-icon"></i>
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `);

            // Append to body
            $('body').append($notification);

            // Animate in
            $notification.hide().fadeIn(300);

            // Auto remove after 3 seconds
            setTimeout(function() {
                $notification.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 3000);

            // Close button handler
            $notification.find('.notification-close').on('click', function() {
                $notification.fadeOut(300, function() {
                    $(this).remove();
                });
            });
        }
    };

    /**
     * ============================================
     * 13. AJAX COMMENT SUBMIT
     * ============================================
     */
    const CyberpunkComments = {
        init: function() {
            this.$commentForm = $('#commentform');
            if (!this.$commentForm.length) return;

            this.bindEvents();
        },

        bindEvents: function() {
            const self = this;

            this.$commentForm.on('submit', function(e) {
                e.preventDefault();
                self.submitComment();
            });
        },

        submitComment: function() {
            const self = this;
            const $submitBtn = this.$commentForm.find('#submit');
            const originalBtnText = $submitBtn.val();

            // Validate form
            const comment = this.$commentForm.find('#comment').val();
            const author = this.$commentForm.find('#author').val();
            const email = this.$commentForm.find('#email').val();
            const postId = this.$commentForm.find('#comment_post_ID').val();
            const parentId = this.$commentForm.find('#comment_parent').val();

            if (!comment || (!author && !cyberpunkAjax.is_user_logged_in) || (!email && !cyberpunkAjax.is_user_logged_in)) {
                CyberpunkNotifications.show('error', 'Please fill in all required fields.');
                return;
            }

            // Add loading state
            $submitBtn.val('Posting...').prop('disabled', true);
            this.$commentForm.addClass('loading');

            $.ajax({
                url: cyberpunkAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'cyberpunk_submit_comment',
                    post_id: postId,
                    comment: comment,
                    author: author,
                    email: email,
                    url: self.$commentForm.find('#url').val(),
                    parent_id: parentId,
                    nonce: cyberpunkAjax.nonce,
                },
                success: function(response) {
                    if (response.success) {
                        // Append new comment
                        const $newComment = $(response.data.comment_html);
                        $('.comment-list').append($newComment);
                        $newComment.hide().fadeIn(500);

                        // Update comment count
                        $('.comments-count').text(response.data.comment_count);

                        // Reset form
                        self.$commentForm[0].reset();
                        CyberpunkNotifications.show('success', response.message);
                    } else {
                        CyberpunkNotifications.show('error', response.message);
                    }
                },
                error: function() {
                    CyberpunkNotifications.show('error', cyberpunkAjax.strings.error);
                },
                complete: function() {
                    $submitBtn.val(originalBtnText).prop('disabled', false);
                    self.$commentForm.removeClass('loading');
                }
            });
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
        CyberpunkReadingProgress.init();
        CyberpunkComments.init();

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
