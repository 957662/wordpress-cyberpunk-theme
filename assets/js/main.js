/**
 * Cyberpunk Theme - Main JavaScript
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 * @description Core frontend interactions and UI enhancements
 */

(function() {
    'use strict';

    /**
     * ============================================
     * 1. UTILITY FUNCTIONS
     * ============================================
     */

    const Utils = {
        /**
         * Debounce function for performance optimization
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in milliseconds
         * @returns {Function} Debounced function
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function for scroll events
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function} Throttled function
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Check if element is in viewport
         * @param {HTMLElement} element - Element to check
         * @returns {boolean} True if element is in viewport
         */
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        /**
         * Smooth scroll to element
         * @param {HTMLElement} target - Target element
         * @param {number} offset - Offset from top (default: 80)
         */
        smoothScroll: function(target, offset = 80) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },

        /**
         * Add ARIA attributes for accessibility
         * @param {HTMLElement} element - Target element
         * @param {Object} attributes - ARIA attributes to add
         */
        setAria: function(element, attributes) {
            Object.keys(attributes).forEach(key => {
                element.setAttribute(`aria-${key}`, attributes[key]);
            });
        }
    };

    /**
     * ============================================
     * 2. MOBILE MENU TOGGLE
     * ============================================
     */

    const MobileMenu = {
        init: function() {
            this.toggleButton = document.querySelector('.menu-toggle');
            this.menu = document.querySelector('#primary-menu');
            this.menuItems = document.querySelectorAll('.menu-item a');
            this.body = document.body;
            this.isOpen = false;

            if (!this.toggleButton || !this.menu) return;

            this.bindEvents();
        },

        bindEvents: function() {
            // Toggle menu on button click
            this.toggleButton.addEventListener('click', () => this.toggle());

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen &&
                    !this.toggleButton.contains(e.target) &&
                    !this.menu.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu on link click
            this.menuItems.forEach(item => {
                item.addEventListener('click', () => this.close());
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle window resize
            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            }, 250));
        },

        toggle: function() {
            this.isOpen ? this.close() : this.open();
        },

        open: function() {
            this.isOpen = true;
            this.menu.classList.add('active');
            this.toggleButton.classList.add('active');
            this.toggleButton.setAttribute('aria-expanded', 'true');
            this.body.classList.add('menu-open');

            // Prevent body scroll
            this.body.style.overflow = 'hidden';
        },

        close: function() {
            this.isOpen = false;
            this.menu.classList.remove('active');
            this.toggleButton.classList.remove('active');
            this.toggleButton.setAttribute('aria-expanded', 'false');
            this.body.classList.remove('menu-open');

            // Restore body scroll
            this.body.style.overflow = '';
        }
    };

    /**
     * ============================================
     * 3. BACK TO TOP BUTTON
     * ============================================
     */

    const BackToTop = {
        init: function() {
            this.button = document.createElement('button');
            this.button.className = 'back-to-top-btn';
            this.button.innerHTML = '<span class="arrow">↑</span>';
            this.button.setAttribute('aria-label', 'Back to top');
            this.button.setAttribute('role', 'button');
            this.setVisible(false);

            document.body.appendChild(this.button);

            this.scrollThreshold = 300;
            this.bindEvents();
        },

        bindEvents: function() {
            // Show/hide button on scroll
            window.addEventListener('scroll', Utils.throttle(() => {
                this.toggleVisibility();
            }, 100));

            // Scroll to top on click
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Keyboard navigation
            this.button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        },

        toggleVisibility: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.setVisible(scrollTop > this.scrollThreshold);
        },

        setVisible: function(visible) {
            if (visible) {
                this.button.classList.add('visible');
                this.button.setAttribute('aria-hidden', 'false');
            } else {
                this.button.classList.remove('visible');
                this.button.setAttribute('aria-hidden', 'true');
            }
        }
    };

    /**
     * ============================================
     * 4. SEARCH FORM TOGGLE
     * ============================================
     */

    const SearchToggle = {
        init: function() {
            this.toggleButtons = document.querySelectorAll('.search-toggle');
            this.searchForm = document.querySelector('.search-form-overlay');
            this.searchInput = document.querySelector('.search-form-overlay .search-field');

            if (!this.searchForm) return;

            this.bindEvents();
        },

        bindEvents: function() {
            // Toggle search form
            this.toggleButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            });

            // Close on overlay click
            this.searchForm.addEventListener('click', (e) => {
                if (e.target === this.searchForm) {
                    this.close();
                }
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.searchForm.classList.contains('active')) {
                    this.close();
                }
            });
        },

        toggle: function() {
            const isActive = this.searchForm.classList.contains('active');
            isActive ? this.close() : this.open();
        },

        open: function() {
            this.searchForm.classList.add('active');
            document.body.classList.add('search-open');

            // Focus input after transition
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }, 100);
        },

        close: function() {
            this.searchForm.classList.remove('active');
            document.body.classList.remove('search-open');
        }
    };

    /**
     * ============================================
     * 5. SMOOTH SCROLL FOR ANCHOR LINKS
     * ============================================
     */

    const SmoothScroll = {
        init: function() {
            this.anchorLinks = document.querySelectorAll('a[href^="#"]');
            this.offset = 80; // Header height offset

            this.bindEvents();
        },

        bindEvents: function() {
            this.anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');

                    // Ignore empty or page-top links
                    if (href === '#' || href === '#top') {
                        e.preventDefault();
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        return;
                    }

                    const target = document.querySelector(href);

                    if (target) {
                        e.preventDefault();
                        Utils.smoothScroll(target, this.offset);

                        // Update focus for accessibility
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                });
            });
        }
    };

    /**
     * ============================================
     * 6. IMAGE LAZY LOADING
     * ============================================
     */

    const LazyLoad = {
        init: function() {
            // Use native lazy loading if supported
            if ('loading' in HTMLImageElement.prototype) {
                this.setupNativeLazyLoad();
            } else {
                this.setupIntersectionObserver();
            }
        },

        setupNativeLazyLoad: function() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
            });
        },

        setupIntersectionObserver: function() {
            if (!('IntersectionObserver' in window)) {
                // Fallback: load all images immediately
                const images = document.querySelectorAll('img[data-src]');
                images.forEach(img => this.loadImage(img));
                return;
            }

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => imageObserver.observe(img));
        },

        loadImage: function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.onload = () => {
                    img.classList.add('loaded');
                    img.classList.add('lazyloaded');
                };
            }
        }
    };

    /**
     * ============================================
     * 7. NEON EFFECTS ON SCROLL
     * ============================================
     */

    const NeonEffects = {
        init: function() {
            this.neonElements = document.querySelectorAll('.neon-text, .neon-box');
            this.hasAnimated = new Set();

            if (!('IntersectionObserver' in window)) {
                this.neonElements.forEach(el => this.activateEffect(el));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                        this.activateEffect(entry.target);
                        this.hasAnimated.add(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            this.neonElements.forEach(el => observer.observe(el));
        },

        activateEffect: function(element) {
            element.classList.add('neon-activated');

            // Add animation class
            if (element.classList.contains('glitch-effect')) {
                element.classList.add('glitch-active');
            }
        }
    };

    /**
     * ============================================
     * 8. STICKY HEADER
     * ============================================
     */

    const StickyHeader = {
        init: function() {
            this.header = document.querySelector('.site-header');
            this.scrollThreshold = 100;

            if (!this.header) return;

            this.bindEvents();
        },

        bindEvents: function() {
            window.addEventListener('scroll', Utils.throttle(() => {
                this.toggleSticky();
            }, 50));
        },

        toggleSticky: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > this.scrollThreshold) {
                this.header.classList.add('sticky');
                document.body.classList.add('sticky-header');
            } else {
                this.header.classList.remove('sticky');
                document.body.classList.remove('sticky-header');
            }
        }
    };

    /**
     * ============================================
     * 9. ACCESSIBILITY ENHANCEMENTS
     * ============================================
     */

    const Accessibility = {
        init: function() {
            this.setupSkipLinks();
            this.setupFocusVisible();
            this.enforceKeyboardFocus();
        },

        setupSkipLinks: function() {
            const skipLinks = document.querySelectorAll('.skip-link');

            skipLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const target = document.querySelector(link.getAttribute('href'));

                    if (target) {
                        e.preventDefault();
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                });
            });
        },

        setupFocusVisible: function() {
            // Add focus-visible class for keyboard navigation
            document.body.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-nav');
                }
            });

            document.body.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-nav');
            });
        },

        enforceKeyboardFocus: function() {
            // Ensure all interactive elements are focusable
            const interactiveElements = document.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );

            interactiveElements.forEach(el => {
                if (!el.hasAttribute('role')) {
                    const tagName = el.tagName.toLowerCase();

                    // Add implicit ARIA roles
                    if (tagName === 'a' && el.hasAttribute('href')) {
                        el.setAttribute('role', 'link');
                    } else if (tagName === 'button') {
                        el.setAttribute('role', 'button');
                    }
                }
            });
        }
    };

    /**
     * ============================================
     * 10. GLITCH EFFECT (OPTIONAL)
     * ============================================
     */

    const GlitchEffect = {
        init: function() {
            this.glitchElements = document.querySelectorAll('.glitch-effect');

            this.glitchElements.forEach(el => {
                this.setupGlitch(el);
            });
        },

        setupGlitch: function(element) {
            // Add random glitch animation
            setInterval(() => {
                if (Math.random() > 0.95) {
                    element.classList.add('glitching');

                    setTimeout(() => {
                        element.classList.remove('glitching');
                    }, 200);
                }
            }, 100);
        }
    };

    /**
     * ============================================
     * INITIALIZATION
     * ============================================
     */

    const CyberpunkTheme = {
        init: function() {
            // Initialize all modules when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initModules());
            } else {
                this.initModules();
            }
        },

        initModules: function() {
            // Core modules (always active)
            MobileMenu.init();
            SmoothScroll.init();
            Accessibility.init();
            StickyHeader.init();

            // Feature modules (conditional)
            const enableBackToTop = cyberpunkAjax?.features?.backToTop !== false;
            const enableLazyLoad = cyberpunkAjax?.features?.lazyLoad !== false;
            const enableNeonEffects = cyberpunkAjax?.features?.neonEffects !== false;
            const enableSearch = document.querySelector('.search-toggle');

            if (enableBackToTop) BackToTop.init();
            if (enableLazyLoad) LazyLoad.init();
            if (enableNeonEffects) NeonEffects.init();
            if (enableSearch) SearchToggle.init();

            // Optional effects
            const glitchElements = document.querySelectorAll('.glitch-effect');
            if (glitchElements.length > 0) {
                GlitchEffect.init();
            }

            // Log initialization
            if (window.console && window.console.log) {
                console.log('🌃 Cyberpunk Theme initialized successfully');
            }
        }
    };

    /**
     * ============================================
     * EXPORT FOR EXTERNAL USE
     * ============================================
     */

    // Expose utilities globally for custom scripts
    window.CyberpunkUtils = Utils;
    window.CyberpunkTheme = CyberpunkTheme;

    // Auto-initialize
    CyberpunkTheme.init();

})();
