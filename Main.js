/**
 * KARUNEX CO. PVT. LTD. - MAIN JAVASCRIPT
 * Core functionality, navigation, animations, and interactions
 * Version: 1.0.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== GLOBAL VARIABLES ==========
    const currentYear = new Date().getFullYear();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // ========== INITIALIZATION ==========
    console.log('Karunex Co. Pvt. Ltd. - Website initialized');
    console.log('Touch device:', isTouchDevice);
    
    // ========== UTILITY FUNCTIONS ==========
    
    /**
     * Debounce function to limit the rate at which a function can fire
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle function to limit the rate at which a function can fire
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Check if element is in viewport
     */
    function isInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset
        );
    }
    
    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(target, duration = 500) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // ========== ACCESSIBILITY FEATURES ==========
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.setAttribute('tabindex', '-1');
                target.focus();
                setTimeout(() => target.removeAttribute('tabindex'), 1000);
            }
        });
    }
    
    // Add focus styles for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ========== NAVIGATION ==========
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            mobileNav.setAttribute('aria-hidden', isExpanded);
            
            // Toggle body scroll
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                mobileNav.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header') && mobileNav.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                mobileNav.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Skip if it's an external link
            if (href.includes('://')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });
    
    // ========== ANIMATIONS ==========
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right');
        
        elements.forEach(element => {
            if (isInViewport(element, 100)) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Throttle scroll event for performance
    window.addEventListener('scroll', throttle(animateOnScroll, 100));
    
    // Animate counter numbers
    const animateCounter = function() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (isInViewport(counter, 200) && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        counter.textContent = Math.floor(current);
                        setTimeout(updateCounter, 20);
                    }
                };
                
                updateCounter();
            }
        });
    };
    
    // Initial check for counters
    animateCounter();
    
    // Throttle scroll for counters
    window.addEventListener('scroll', throttle(animateCounter, 100));
    
    // ========== BACK TO TOP BUTTON ==========
    
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, 100));
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========== DROPDOWN MENUS ==========
    
    // Handle dropdown menus for touch devices
    if (isTouchDevice) {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    // ========== SERVICE CARDS ANIMATION ==========
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========== TESTIMONIALS SLIDER ==========
    
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialsSlider && testimonialsSlider.children.length > 1) {
        let currentIndex = 0;
        const testimonials = Array.from(testimonialsSlider.children);
        const totalTestimonials = testimonials.length;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.opacity = i === index ? '1' : '0';
                testimonial.style.transform = i === index ? 'translateX(0)' : 'translateX(100%)';
                testimonial.style.position = i === index ? 'relative' : 'absolute';
                testimonial.style.top = '0';
                testimonial.style.left = '0';
                testimonial.style.width = '100%';
                testimonial.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            showTestimonial(currentIndex);
        }, 5000);
        
        // Initial show
        showTestimonial(0);
    }
    
    // ========== PRODUCT IMAGE HOVER EFFECT ==========
    
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // ========== TRUST BADGES ANIMATION ==========
    
    const badges = document.querySelectorAll('.badge');
    
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
    });
    
    // ========== INTEGRATION SECTION ANIMATION ==========
    
    const integrationVisual = document.querySelector('.integration-visual img');
    
    if (integrationVisual) {
        window.addEventListener('scroll', throttle(function() {
            if (isInViewport(integrationVisual, 200)) {
                integrationVisual.classList.add('animate-float');
            }
        }, 100));
    }
    
    // ========== FORM HANDLING ==========
    
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (emailInput && emailInput.value) {
                // Simulate form submission
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
    
    // ========== LAZY LOADING IMAGES ==========
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========== PERFORMANCE MONITORING ==========
    
    // Log performance metrics
    window.addEventListener('load', function() {
        // Check if page is loaded completely
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Check for any console errors
        const originalConsoleError = console.error;
        console.error = function(...args) {
            originalConsoleError.apply(console, args);
            // You could send these errors to your analytics service
            console.log('Error detected:', args);
        };
    });
    
    // ========== SOCIAL SHARE ==========
    
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label')?.toLowerCase();
            const currentUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${pageTitle}`;
                    break;
                default:
                    return; // Allow default behavior for other links
            }
            
            e.preventDefault();
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
    
    // ========== PRICE CALCULATOR (Placeholder for future enhancement) ==========
    
    const priceCalculator = {
        init: function() {
            console.log('Price calculator ready for implementation');
            // This will be expanded in the Printify integration phase
        }
    };
    
    // Initialize price calculator
    priceCalculator.init();
    
    // ========== PRINTIFY INTEGRATION READINESS ==========
    
    const printifyIntegration = {
        status: 'ready',
        apiEndpoint: 'https://api.printify.com/v1',
        
        checkReadiness: function() {
            console.log('Printify Integration: System ready for implementation');
            console.log('API Endpoint:', this.apiEndpoint);
            
            // This will be replaced with actual API calls in Phase 2
            return {
                status: 'ready',
                message: 'Printify integration can be implemented when needed',
                requirements: [
                    'Printify API Key',
                    'Shop ID',
                    'Backend server setup',
                    'Database integration'
                ]
            };
        }
    };
    
    // Log Printify readiness
    console.log('Printify Integration Status:', printifyIntegration.checkReadiness());
    
    // ========== ERROR HANDLING ==========
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        // In production, you might want to send this to an error tracking service
    });
    
    // ========== BROWSER COMPATIBILITY CHECK ==========
    
    function checkBrowserCompatibility() {
        const isIE = /*@cc_on!@*/false || !!document.documentMode;
        const isEdge = !isIE && !!window.StyleMedia;
        
        if (isIE || isEdge) {
            console.warn('Browser compatibility: Consider using a modern browser for best experience');
            // You could show a gentle warning to users
        }
    }
    
    checkBrowserCompatibility();
    
    // ========== SERVICE WORKER REGISTRATION (PWA Ready) ==========
    
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            }).catch(function(err) {
                console.log('ServiceWorker registration failed:', err);
            });
        });
    }
    
    // ========== ANALYTICS (Placeholder for Google Analytics) ==========
    
    function trackEvent(category, action, label) {
        console.log('Analytics Event:', { category, action, label });
        // Replace with actual analytics code
        // Example: gtag('event', action, { event_category: category, event_label: label });
    }
    
    // Track page view
    trackEvent('page', 'view', document.title);
    
    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('button', 'click', buttonText);
        });
    });
    
    // ========== FINAL INITIALIZATION ==========
    
    console.log('Karunex website fully initialized and ready');
    
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('karunex:loaded'));
});

// ========== WINDOW RESIZE HANDLER ==========

window.addEventListener('resize', debounce(function() {
    // Recalculate any layout-dependent values
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250));

// Set initial viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// ========== OFFLINE DETECTION ==========

window.addEventListener('online', function() {
    document.body.classList.remove('offline');
    console.log('Network: Back online');
});

window.addEventListener('offline', function() {
    document.body.classList.add('offline');
    console.warn('Network: Offline mode');
});

// ========== PRINT STYLES ==========

window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// ========== EXPORT FOR MODULE USAGE ==========

// If using ES6 modules, you could export functions like this:
// export { smoothScrollTo, isInViewport, trackEvent };
