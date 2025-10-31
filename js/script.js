// ===== APPLE-INSPIRED DARK MODE PORTFOLIO JAVASCRIPT =====

// Theme Management System
class ThemeManager {
    constructor() {
        // Enforce dark mode site-wide
        this.currentTheme = 'dark';
        this.setStoredTheme('dark');
        this.init();
    }

    init() {
        // Force dark theme and disable toggles/system listeners
        this.applyTheme('dark');
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        const html = document.documentElement;
        html.classList.add('dark');
        this.currentTheme = 'dark';
        this.setStoredTheme('dark');
    }

    updateThemeButtons() {
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            // Remove active styles
            btn.classList.remove('bg-primary-500', 'text-white');
            btn.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
            
            if (btn.dataset.theme === this.currentTheme) {
                // Add active styles
                btn.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
                btn.classList.add('bg-primary-500', 'text-white');
            }
        });
    }

    setupThemeToggle() {
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.applyTheme(theme);
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }
}

// Portfolio Application
class PortfolioApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        // Initialize AOS if available so elements with data-aos are not stuck hidden
        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 80
            });
        } else {
            // Fallback: ensure content remains visible if AOS fails to load
            document.body.classList.add('no-aos');
        }
        this.setupAnimations();
        this.setupTestimonials();
        this.setupCharts();
        this.setupCounters();
        this.setupContactForm();
        this.setupDownloadHandlers();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }

    // Navigation System
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        hamburger?.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                hamburger.classList.add('active');
                this.animateHamburger(hamburger, true);
            } else {
                mobileMenu.classList.add('hidden');
                hamburger.classList.remove('active');
                this.animateHamburger(hamburger, false);
            }
        });

        // Close mobile menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu?.classList.add('hidden');
                hamburger?.classList.remove('active');
                this.animateHamburger(hamburger, false);
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            // Update active navigation
            this.updateActiveNavigation();
            
            lastScrollY = currentScrollY;
        });
    }

    animateHamburger(hamburger, isActive) {
        if (!hamburger) return;
        
        const bars = hamburger.querySelectorAll('.bar');
        if (isActive) {
            bars[0].style.transform = 'translateY(8px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Scroll Effects and Animations
    setupScrollEffects() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate skill bars if this is a skills section
                    if (entry.target.classList.contains('skills-section') || entry.target.closest('.skills-section')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.metric-card, .chart-container, .card, .skills-section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const percentage = bar.getAttribute('data-percentage');
            
            setTimeout(() => {
                bar.style.width = percentage + '%';
            }, index * 100); // Stagger the animations
        });
    }

    // ================= Testimonials Slider =================
    setupTestimonials() {
        const slider = document.querySelector('.testimonials-slider');
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        const navContainer = document.querySelector('.testimonial-navigation');

        if (!slider) return;

        // Accessibility attributes
        slider.setAttribute('role', 'region');
        slider.setAttribute('aria-label', 'Client testimonials');
        slider.setAttribute('aria-live', 'polite');

        // Attempt to fetch data dynamically; fallback to existing DOM
        this.tryFetchTestimonials(slider).finally(() => {
            this.initializeTestimonials(slider, prevBtn, nextBtn, navContainer);
        });
    }

    async tryFetchTestimonials(slider) {
        const source = slider.dataset.source || 'assets/testimonials.json';
        try {
            const res = await fetch(source, { cache: 'no-store' });
            if (!res.ok) return; // silently fallback
            const testimonials = await res.json();
            if (!Array.isArray(testimonials) || testimonials.length === 0) return;

            // Render testimonials using Tailwind utility classes
            slider.innerHTML = '';
            testimonials.forEach((t) => {
                const item = document.createElement('div');
                item.className = 'testimonial-item';

                const card = document.createElement('div');
                card.className = 'testimonial-content bg-white/70 dark:bg-dark-tertiary/70 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm';

                const p = document.createElement('p');
                p.className = 'text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed';
                p.textContent = t.quote || '';

                const author = document.createElement('div');
                author.className = 'testimonial-author mt-6 flex items-center gap-4';

                const img = document.createElement('img');
                img.className = 'w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700';
                img.src = t.photo || 'assets/images/placeholder.svg';
                img.alt = t.name ? `Photo of ${t.name}` : 'Client testimonial';
                img.loading = 'lazy';

                const info = document.createElement('div');
                info.className = 'author-info';

                const nameEl = document.createElement('h4');
                nameEl.className = 'font-semibold text-gray-900 dark:text-white';
                nameEl.textContent = t.name || 'Client';

                const roleEl = document.createElement('span');
                roleEl.className = 'text-sm text-gray-600 dark:text-gray-400';
                roleEl.textContent = t.role || '';

                info.appendChild(nameEl);
                info.appendChild(roleEl);
                author.appendChild(img);
                author.appendChild(info);
                card.appendChild(p);
                card.appendChild(author);
                item.appendChild(card);
                slider.appendChild(item);
            });
        } catch (e) {
            // Ignore fetch errors and use existing DOM
        }
    }

    initializeTestimonials(slider, prevBtn, nextBtn, navContainer) {
        const items = Array.from(slider.querySelectorAll('.testimonial-item'));
        if (!items.length) return;

        // Tailwind-based initial state
        items.forEach((el, idx) => {
            el.classList.add('transition-opacity', 'duration-500');
            if (idx === 0) {
                el.classList.remove('hidden');
                el.classList.add('block');
                el.style.opacity = '1';
            } else {
                el.classList.remove('block');
                el.classList.add('hidden');
                el.style.opacity = '0';
            }
        });

        this.testimonialItems = items;
        this.testimonialIndex = 0;

        const show = (index) => {
            this.testimonialItems.forEach((el, i) => {
                const isActive = i === index;
                el.style.opacity = isActive ? '1' : '0';
                el.classList.toggle('hidden', !isActive);
                el.classList.toggle('block', isActive);
            });
            this.testimonialIndex = index;
            this.updateTestimonialPagination(navContainer, index);
        };

        const next = () => show((this.testimonialIndex + 1) % this.testimonialItems.length);
        const prev = () => show((this.testimonialIndex - 1 + this.testimonialItems.length) % this.testimonialItems.length);

        nextBtn?.addEventListener('click', next);
        prevBtn?.addEventListener('click', prev);

        // Keyboard support
        slider.setAttribute('tabindex', '0');
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });

        // Touch support (simple swipe)
        let startX = null;
        slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (dx > 40) prev();
            if (dx < -40) next();
            startX = null;
        });

        // Pagination dots
        this.createTestimonialPagination(navContainer, items.length, show);
        this.updateTestimonialPagination(navContainer, 0);

        // Auto-rotate
        const startAuto = () => {
            this.testimonialIntervalId = window.setInterval(next, 7000);
        };
        const stopAuto = () => {
            if (this.testimonialIntervalId) {
                window.clearInterval(this.testimonialIntervalId);
                this.testimonialIntervalId = null;
            }
        };
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        startAuto();
    }

    createTestimonialPagination(container, count, showCb) {
        if (!container) return;
        // Remove existing dots
        const old = container.querySelector('.testimonial-dots');
        old?.remove();

        const dots = document.createElement('div');
        dots.className = 'testimonial-dots flex items-center gap-2 justify-center mt-4';

        for (let i = 0; i < count; i++) {
            const btn = document.createElement('button');
            btn.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-primary-500 dark:hover:bg-primary-500 transition-colors duration-200';
            btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            btn.addEventListener('click', () => showCb(i));
            dots.appendChild(btn);
        }

        container.appendChild(dots);
    }

    updateTestimonialPagination(container, activeIndex) {
        if (!container) return;
        const dots = Array.from(container.querySelectorAll('.testimonial-dots button'));
        dots.forEach((d, i) => {
            d.classList.toggle('bg-primary-500', i === activeIndex);
            d.classList.toggle('bg-gray-300', i !== activeIndex);
            d.classList.toggle('dark:bg-primary-500', i === activeIndex);
            d.classList.toggle('dark:bg-gray-600', i !== activeIndex);
        });
    }

    // Charts Implementation
    setupCharts() {
        this.initializeSalesChart();
        this.initializeROIChart();
    }

    initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Revenue Growth (%)',
                    data: [100, 125, 160, 195, 240, 285],
                    borderColor: '#007aff',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#007aff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#0a84ff',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#007aff',
                        borderWidth: 1,
                        cornerRadius: 12,
                        displayColors: false,
                        titleFont: {
                            family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                            size: 13
                        },
                        callbacks: {
                            title: function(context) {
                                return 'Year ' + context[0].label;
                            },
                            label: function(context) {
                                return 'Revenue Growth: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                            drawBorder: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                                size: 12,
                                weight: '500'
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initializeROIChart() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Digital Marketing', 'Social Media', 'Email Marketing', 'Content Marketing', 'SEO'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#007aff',
                        '#ff9f0a',
                        '#30d158',
                        '#bf5af2',
                        '#ff453a'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                                size: 12,
                                weight: '500'
                            },
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#007aff',
                        borderWidth: 1,
                        cornerRadius: 12,
                        displayColors: true,
                        titleFont: {
                            family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Counter Animation
    setupCounters() {
        const counters = document.querySelectorAll('.metric-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                    
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                form.reset();
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Download Handlers
    setupDownloadHandlers() {
        // CV download links now point directly to the PDF file
        // No additional JavaScript handling needed
        console.log('CV download links are properly configured');
    }

    // Accessibility Features
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobile-menu');
                const hamburger = document.getElementById('hamburger');
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    hamburger?.classList.remove('active');
                    this.animateHamburger(hamburger, false);
                }
            }
        });

        // Focus management
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-blue)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Scroll handling code here
            }, 16);
        });
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#30d158',
            error: '#ff453a',
            info: '#007aff',
            warning: '#ff9f0a'
        };

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                font-size: 14px;
                font-weight: 500;
            ">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: 12px;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.firstElementChild.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ThemeManager };
}