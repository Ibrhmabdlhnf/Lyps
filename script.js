/* ============================================
   SMACO Tax Advisory Services - JavaScript
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target) &&
            navMenu.classList.contains('active')
        ) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ============================================
    // Active Nav Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================================
    // Back to Top
    // ============================================
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // Animated Counter for Statistics
    // ============================================
    const counters = document.querySelectorAll('.stat-item h3[data-count]');
    let countersAnimated = false;

    function animateCounter(el, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    function checkCounters() {
        if (countersAnimated || counters.length === 0) return;

        const firstCounter = counters[0];
        const rect = firstCounter.getBoundingClientRect();
        const inView =
            rect.top < window.innerHeight && rect.bottom > 0;

        if (inView) {
            countersAnimated = true;
            counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute('data-count'), 10);
                animateCounter(counter, target);
            });
        }
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    window.addEventListener('load', checkCounters);

    // ============================================
    // Intersection Observer - Fade In Animation
    // ============================================
    const animateTargets = document.querySelectorAll(
        '.service-card, .why-card, .team-card, .testimonial-card, .feature-item, .contact-item, .section-header, .about-content, .about-image, .hero-content'
    );

    animateTargets.forEach((el) => el.classList.add('fade-in'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger animation for children of same parent
                        const delay =
                            Array.from(entry.target.parentElement.children).indexOf(
                                entry.target
                            ) * 80;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, Math.min(delay, 400));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        animateTargets.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show all
        animateTargets.forEach((el) => el.classList.add('visible'));
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPos =
                    target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth',
                });
            }
        });
    });

    // ============================================
    // Contact Form Handler
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                company: document.getElementById('company').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim(),
            };

            // Simple validation
            if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
                showNotification('Mohon lengkapi semua field yang wajib diisi.', 'error');
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Format email tidak valid.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

            // Simulate sending (replace with real API call)
            setTimeout(() => {
                showNotification(
                    'Pesan Anda berhasil dikirim! Tim kami akan menghubungi Anda dalam 24 jam.',
                    'success'
                );
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    // ============================================
    // Notification System
    // ============================================
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Close button
        notification
            .querySelector('.notification-close')
            .addEventListener('click', () => removeNotification(notification));

        // Auto remove
        setTimeout(() => removeNotification(notification), 5000);
    }

    function removeNotification(el) {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }

    // ============================================
    // Inject Notification Styles
    // ============================================
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 90px;
            right: 24px;
            background: #fff;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 16px 48px rgba(15, 81, 50, 0.18);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 420px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
            border-left: 4px solid #198754;
            font-size: 14px;
            line-height: 1.5;
            color: #1a2e22;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-success {
            border-left-color: #198754;
        }
        .notification-success i:first-child {
            color: #198754;
            font-size: 20px;
        }
        .notification-error {
            border-left-color: #dc3545;
        }
        .notification-error i:first-child {
            color: #dc3545;
            font-size: 20px;
        }
        .notification span {
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            color: #7a8a82;
            cursor: pointer;
            padding: 4px;
            font-size: 14px;
            transition: color 0.2s;
        }
        .notification-close:hover {
            color: #1a2e22;
        }
        @media (max-width: 480px) {
            .notification {
                top: 80px;
                right: 12px;
                left: 12px;
                min-width: 0;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(notificationStyles);

    // ============================================
    // Service Card Tilt Effect (subtle)
    // ============================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================
    // Console Branding
    // ============================================
    console.log(
        '%c SMACO Tax Advisory Services ',
        'background: linear-gradient(135deg, #0f5132 0%, #198754 100%); color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
    );
    console.log(
        '%c Konsultan Pajak Profesional & Terpercaya ',
        'color: #198754; font-size: 13px; font-weight: 500; padding: 4px 0;'
    );

})();
