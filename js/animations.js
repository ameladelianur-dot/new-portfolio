/**
 * Enhanced Animation System
 * Handles scroll-triggered animations, page load animations, and interactive effects
 */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Initialize on DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Skip animations if user prefers reduced motion
        if (this.isReducedMotion) {
            console.log('Reduced motion preference detected - animations disabled');
            return;
        }

        this.setupPageLoadAnimations();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupModalAnimations();
    }

    setupPageLoadAnimations() {
        // Add staggered animations to hero section elements
        const heroElements = document.querySelectorAll('.hero-animate');
        heroElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 100}ms`;
            element.classList.add('animate-fade-in-up');
        });

        // Add animations to navigation
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
            item.classList.add('animate-fade-in-down');
        });

        // Add animation to logo
        const logo = document.querySelector('.logo-animate');
        if (logo) {
            logo.classList.add('animate-scale-in');
        }
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Unobserve after animation to improve performance
                        scrollObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe elements with scroll animation classes
        const scrollElements = document.querySelectorAll(
            '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
        );
        
        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });

        this.observers.set('scroll', scrollObserver);
    }

    setupHoverEffects() {
        // Add enhanced hover effects to buttons
        const buttons = document.querySelectorAll('button, .btn, a[class*="bg-primary"]');
        buttons.forEach(button => {
            if (!button.classList.contains('btn-hover-lift')) {
                button.classList.add('btn-hover-lift');
            }
        });

        // Add hover effects to cards
        const cards = document.querySelectorAll('.card, [class*="bg-white"], [class*="bg-gray"]');
        cards.forEach(card => {
            if (card.closest('section') && !card.classList.contains('card-hover-lift')) {
                card.classList.add('hover-lift-sm');
            }
        });

        // Add hover effects to certificates
        const certificates = document.querySelectorAll('.certificate-thumbnail');
        certificates.forEach(cert => {
            cert.classList.add('hover-scale', 'hover-glow');
        });
    }

    setupModalAnimations() {
        // Enhance certificate modal animations
        const modal = document.getElementById('certificate-preview-modal');
        if (modal) {
            // Override the existing modal show/hide with animations
            const originalShow = modal.style.display;
            
            // Create custom show method
            modal.showAnimated = () => {
                modal.style.display = 'flex';
                modal.classList.add('modal-fade-in');
                
                const modalContent = modal.querySelector('#certificate-wrapper');
                if (modalContent) {
                    modalContent.classList.add('modal-scale-in');
                }
            };

            // Create custom hide method
            modal.hideAnimated = () => {
                modal.classList.add('modal-fade-out');
                
                const modalContent = modal.querySelector('#certificate-wrapper');
                if (modalContent) {
                    modalContent.classList.add('modal-scale-out');
                }

                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('modal-fade-in', 'modal-fade-out');
                    if (modalContent) {
                        modalContent.classList.remove('modal-scale-in', 'modal-scale-out');
                    }
                }, 300);
            };
        }
    }

    // Utility method to add staggered animations
    addStaggeredAnimation(elements, animationClass, delay = 100) {
        if (this.isReducedMotion) return;

        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add(animationClass);
        });
    }

    // Method to trigger animations on specific elements
    animateElement(element, animationType = 'fadeInUp', duration = 600) {
        if (this.isReducedMotion) return;

        element.style.animation = `${animationType} ${duration}ms ease-out forwards`;
    }

    // Method to add scroll-triggered animation to new elements
    addScrollAnimation(element, animationType = 'scroll-animate') {
        if (this.isReducedMotion) return;

        element.classList.add(animationType);
        
        if (this.observers.has('scroll')) {
            this.observers.get('scroll').observe(element);
        }
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Performance optimization: Use requestAnimationFrame for smooth animations
class PerformanceOptimizer {
    constructor() {
        this.rafId = null;
        this.callbacks = [];
    }

    schedule(callback) {
        this.callbacks.push(callback);
        
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this.callbacks.forEach(cb => cb());
                this.callbacks = [];
                this.rafId = null;
            });
        }
    }
}

// Initialize animation system
const animationController = new AnimationController();
const performanceOptimizer = new PerformanceOptimizer();

// Export for use in other scripts
window.AnimationController = AnimationController;
window.animationController = animationController;
window.performanceOptimizer = performanceOptimizer;

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Handle reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        // Disable animations
        document.body.classList.add('reduce-motion');
    } else {
        // Re-enable animations
        document.body.classList.remove('reduce-motion');
    }
});