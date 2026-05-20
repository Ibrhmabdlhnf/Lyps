/* ============================================
   SMACO — Tax Advisory Services
   Cinematic Interactions
   ============================================ */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(max-width: 1024px)').matches || 'ontouchstart' in window;

    // ============================================
    // 01. PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('loadCounter');
    let loadProgress = 0;
    const loadStart = performance.now();
    const loadDuration = 1800;

    function animateCounter() {
        const elapsed = performance.now() - loadStart;
        loadProgress = Math.min(elapsed / loadDuration, 1);
        const eased = 1 - Math.pow(1 - loadProgress, 3);
        if (counter) counter.textContent = Math.floor(eased * 100);

        if (loadProgress < 1) {
            requestAnimationFrame(animateCounter);
        } else {
            setTimeout(() => {
                preloader.classList.add('is-loaded');
                document.body.classList.add('is-ready');
                triggerHeroAnimation();
            }, 400);
        }
    }

    if (preloader) {
        window.addEventListener('load', () => {
            requestAnimationFrame(animateCounter);
        });
        // Fallback if load already fired
        if (document.readyState === 'complete') {
            requestAnimationFrame(animateCounter);
        }
    }

    // ============================================
    // 02. WRAP REVEAL TEXT
    // ============================================
    document.querySelectorAll('.reveal-text').forEach((el) => {
        if (!el.querySelector('.reveal-inner')) {
            const text = el.innerHTML;
            el.innerHTML = `<span class="reveal-inner">${text}</span>`;
        }
    });

    function triggerHeroAnimation() {
        document.querySelectorAll('.hero .reveal-text').forEach((el, i) => {
            setTimeout(() => el.classList.add('is-in'), 100 + i * 80);
        });
    }

    // ============================================
    // 03. CUSTOM CURSOR
    // ============================================
    if (!isTouch) {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx, ry = my;
        let dx = mx, dy = my;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        });

        function loopCursor() {
            // Dot follows quickly
            dx += (mx - dx) * 0.55;
            dy += (my - dy) * 0.55;
            // Ring trails smoothly
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;

            if (dot) dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
            if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

            requestAnimationFrame(loopCursor);
        }
        requestAnimationFrame(loopCursor);

        // Hover state
        document.querySelectorAll('[data-cursor="hover"], a, button, input, textarea, select').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                if (ring) ring.classList.add('is-hover');
                if (dot) dot.classList.add('is-hover');
            });
            el.addEventListener('mouseleave', () => {
                if (ring) ring.classList.remove('is-hover');
                if (dot) dot.classList.remove('is-hover');
            });
        });
    }

    // ============================================
    // 04. NAVBAR
    // ============================================
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nav-link');

    let lastScroll = 0;
    function handleNavScroll() {
        const y = window.scrollY;
        if (y > 30) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
        lastScroll = y;
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            navLinks.classList.toggle('is-open');
        });
    }

    allLinks.forEach((link) => {
        link.addEventListener('click', () => {
            burger?.classList.remove('is-active');
            navLinks?.classList.remove('is-open');
        });
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    function updateActive() {
        const y = window.scrollY + 140;
        let current = '';
        sections.forEach((sec) => {
            if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
                current = sec.id;
            }
        });
        allLinks.forEach((l) => {
            l.classList.toggle('is-active', l.getAttribute('href') === `#${current}`);
        });
    }
    window.addEventListener('scroll', updateActive, { passive: true });

    // ============================================
    // 05. INTERSECTION OBSERVER — Reveal
    // ============================================
    if ('IntersectionObserver' in window) {
        // Reveal text (line-by-line mask)
        const revealEls = document.querySelectorAll('.reveal-text');
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
        revealEls.forEach((el) => {
            // Skip hero (handled by preloader)
            if (!el.closest('.hero')) revealObs.observe(el);
        });

        // Word reveal stagger
        document.querySelectorAll('.philosophy-headline').forEach((headline) => {
            const words = headline.querySelectorAll('.word-reveal');
            words.forEach((w, i) => w.style.setProperty('--d', `${i * 0.06}s`));
        });

        const wordObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    wordObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.word-reveal').forEach((w) => wordObs.observe(w));

        // Generic fade-up
        const fadeEls = document.querySelectorAll('.philo-card, .bento-card, .process-step, .team-card, .quote, .contact-item, .showcase-card, .feature-item');
        fadeEls.forEach((el) => el.classList.add('fade-up'));

        const fadeObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const idx = siblings.indexOf(entry.target);
                    setTimeout(() => entry.target.classList.add('is-in'), Math.min(idx * 80, 400));
                    fadeObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        fadeEls.forEach((el) => fadeObs.observe(el));
    }

    // ============================================
    // 06. COUNTERS
    // ============================================
    const counters = document.querySelectorAll('[data-count]');
    let countersFired = false;

    function animateCounters() {
        if (countersFired) return;
        countersFired = true;
        counters.forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const t = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - t, 4);
                el.textContent = Math.floor(target * eased).toLocaleString('id-ID');
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target.toLocaleString('id-ID');
            }
            requestAnimationFrame(tick);
        });
    }

    if ('IntersectionObserver' in window && counters.length) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObs.disconnect();
                }
            });
        }, { threshold: 0.4 });
        counters.forEach((c) => counterObs.observe(c));
    }

    // ============================================
    // 07. PARALLAX HERO DEVICE
    // ============================================
    const heroDevice = document.querySelector('.hero-device');
    if (heroDevice && !reduceMotion) {
        let parallaxRaf = null;
        function updateParallax() {
            const rect = heroDevice.getBoundingClientRect();
            const offset = window.scrollY * 0.08;
            const scale = Math.max(0.85, 1 - window.scrollY / 3000);
            heroDevice.style.transform = `translateY(${offset}px) scale(${scale})`;
            parallaxRaf = null;
        }
        window.addEventListener('scroll', () => {
            if (!parallaxRaf) parallaxRaf = requestAnimationFrame(updateParallax);
        }, { passive: true });
    }

    // ============================================
    // 08. BENTO GLOW (mouse position)
    // ============================================
    if (!isTouch) {
        document.querySelectorAll('.bento-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
            });
        });
    }

    // ============================================
    // 09. PHILO CARD TILT
    // ============================================
    if (!isTouch && !reduceMotion) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // 10. PROCESS HORIZONTAL SCROLL
    // ============================================
    const processSection = document.querySelector('.process');
    const processTrack = document.getElementById('processTrack');

    if (processSection && processTrack && !reduceMotion && !isTouch) {
        function setProcessHeight() {
            const trackWidth = processTrack.scrollWidth;
            const viewport = window.innerWidth;
            const overflow = Math.max(0, trackWidth - viewport + 80);
            processSection.style.minHeight = `calc(100vh + ${overflow}px)`;
        }

        function updateProcessScroll() {
            const rect = processSection.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const trackWidth = processTrack.scrollWidth;
            const viewport = window.innerWidth;
            const overflow = Math.max(0, trackWidth - viewport + 80);

            const start = sectionTop - 100;
            const end = sectionTop + overflow;
            const scrollY = window.scrollY;

            if (scrollY >= start && scrollY <= end) {
                const progress = (scrollY - start) / (end - start);
                processTrack.style.transform = `translateX(${-progress * overflow}px)`;
            } else if (scrollY < start) {
                processTrack.style.transform = `translateX(0)`;
            } else {
                processTrack.style.transform = `translateX(${-overflow}px)`;
            }
        }

        // Disabled horizontal pin (causes layout issues) — use simple sticky scroll feel
        // Instead let's add subtle parallax on track
        let processRaf = null;
        function processParallax() {
            const rect = processSection.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;
            if (visible) {
                const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
                const overflow = Math.max(0, processTrack.scrollWidth - window.innerWidth + 80);
                processTrack.style.transform = `translateX(${-progress * overflow * 0.85}px)`;
            }
            processRaf = null;
        }

        window.addEventListener('scroll', () => {
            if (!processRaf) processRaf = requestAnimationFrame(processParallax);
        }, { passive: true });
        window.addEventListener('resize', () => {
            processRaf = requestAnimationFrame(processParallax);
        });
        processParallax();
    }

    // ============================================
    // 11. SHOWCASE CARDS PARALLAX
    // ============================================
    const showcaseCards = document.querySelectorAll('.showcase-card');
    if (showcaseCards.length && !reduceMotion) {
        let showRaf = null;
        function showcaseParallax() {
            const showcase = document.querySelector('.showcase');
            if (!showcase) return;
            const rect = showcase.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;
            if (visible) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                showcaseCards.forEach((card, i) => {
                    const speed = (i + 1) * 18;
                    const baseRotate = [-4, 3, -2][i] || 0;
                    const offset = (progress - 0.5) * speed;
                    card.style.transform = `translateY(${offset}px) rotate(${baseRotate}deg)`;
                });
            }
            showRaf = null;
        }
        window.addEventListener('scroll', () => {
            if (!showRaf) showRaf = requestAnimationFrame(showcaseParallax);
        }, { passive: true });
        showcaseParallax();
    }

    // ============================================
    // 12. SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // 13. CONTACT FORM
    // ============================================
    const form = document.getElementById('contactForm');
    if (form) {
        // Floating labels: ensure placeholder exists
        form.querySelectorAll('input, textarea, select').forEach((el) => {
            if (el.tagName !== 'SELECT') {
                el.setAttribute('placeholder', ' ');
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submit = form.querySelector('.form-submit');
            const original = submit.innerHTML;

            const data = {
                name: form.querySelector('#name').value.trim(),
                email: form.querySelector('#email').value.trim(),
                phone: form.querySelector('#phone').value.trim(),
                service: form.querySelector('#service').value,
                message: form.querySelector('#message').value.trim(),
            };

            if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
                showToast('Mohon lengkapi semua field.', 'error');
                return;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(data.email)) {
                showToast('Format email tidak valid.', 'error');
                return;
            }

            submit.disabled = true;
            submit.innerHTML = '<span class="btn-label">Mengirim...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';

            setTimeout(() => {
                showToast('Pesan terkirim. Tim kami akan menghubungi Anda dalam 24 jam.', 'success');
                form.reset();
                submit.disabled = false;
                submit.innerHTML = original;
            }, 1400);
        });
    }

    // ============================================
    // 14. TOAST
    // ============================================
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-show'));
        setTimeout(() => {
            toast.classList.remove('is-show');
            setTimeout(() => toast.remove(), 400);
        }, 4500);
    }

    // Inject toast styles
    const toastCSS = document.createElement('style');
    toastCSS.textContent = `
        .toast {
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(120%);
            background: rgba(10, 13, 11, 0.95);
            backdrop-filter: blur(20px);
            color: #fafaf9;
            padding: 14px 24px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            z-index: 9998;
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            max-width: calc(100vw - 32px);
        }
        .toast.is-show {
            transform: translateX(-50%) translateY(0);
        }
        .toast i {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #22c55e;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        .toast-error i { background: #ef4444; }
    `;
    document.head.appendChild(toastCSS);

    // ============================================
    // 15. CONSOLE BRAND
    // ============================================
    console.log(
        '%c SMACO ',
        'font-family: Georgia, serif; font-size: 32px; font-style: italic; color: #14532d; padding: 12px 0;'
    );
    console.log(
        '%cTax Advisory Services · Engineered for clarity.',
        'color: #16a34a; font-size: 12px; font-weight: 500; letter-spacing: 0.1em;'
    );

})();
