document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. SCROLL REVEAL ANIMATIONS ───
    const revealElements = document.querySelectorAll(
        '.activity-card, .domaine-item, .team-card, .memoire-item, .projet-card, .histo-card, .form-container, .section-badge, .social-embed-grid, .hero-card, .hero-image, .wz-intro-left, .wz-intro-right, .wz-bullet-list, .wz-quote, .wz-edito-wrapper, .wz-hommage-card, .wz-card, .wz-reflexion-text, .wz-defi-box, .video-card-premium, .audio-track-premium, .kiosque-hero, .kiosque-filters'
    );

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 80) {
                el.classList.add('revealed');
            }
        });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    // ─── 2. NAVBAR ACTIVE LINK ON SCROLL ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    const updateActiveNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── 3. NAVBAR SHRINK ON SCROLL ───
    const header = document.querySelector('.main-header');
    const shrinkNav = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', shrinkNav, { passive: true });
    shrinkNav();

    // ─── 4. SMOOTH SCROLLING ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── 5. PARALLAX EFFECT ON HERO IMAGE ───
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < 800) {
                heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ─── 6. ACTIVITY & DOMAIN CARD TILT EFFECT ───
    const tiltCards = document.querySelectorAll('.activity-card, .domaine-item, .wz-card, .kiosque-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ─── 7. MOBILE MENU TOGGLE ───
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // ─── 8. TYPING EFFECT ON HERO TEXT ───
    const heroText = document.querySelector('.hero-card p:first-child');
    if (heroText) {
        const originalText = heroText.textContent;
        heroText.textContent = '';
        heroText.style.opacity = '1';
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 12);
            }
        };
        setTimeout(typeWriter, 600);
    }

    // ─── 9. FORM SUBMIT HANDLER (AJAX to PHP) ───
    const regForm = document.getElementById('regForm');
    const formMessage = document.getElementById('formMessage');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = regForm.querySelector('.btn-submit');
            const originalText = btn.textContent;
            btn.textContent = 'ENVOI EN COURS...';
            btn.disabled = true;

            if (formMessage) {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }

            try {
                const formData = new FormData(regForm);
                const response = await fetch('inscription.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (formMessage) {
                    formMessage.textContent = data.message;
                    formMessage.className = 'form-message ' + (data.success ? 'success' : 'error');
                }

                if (data.success) {
                    btn.textContent = '✓ INSCRIT !';
                    btn.style.background = '#27ae60';
                    btn.style.borderColor = '#27ae60';
                    regForm.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                if (formMessage) {
                    formMessage.textContent = 'Erreur de connexion. Vérifiez que le serveur XAMPP est actif.';
                    formMessage.className = 'form-message error';
                }
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // ─── 10. BACK TO TOP BUTTON ───
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // ─── 11. KIOSQUE FILTERING (Multi-Category) ───
    const filterBtns = document.querySelectorAll('.filter-btn');
    const kiosqueCards = document.querySelectorAll('.kiosque-card');
    
    if(filterBtns.length > 0 && kiosqueCards.length > 0) {
        const applyFilters = () => {
            const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
                                      .map(btn => btn.getAttribute('data-filter'))
                                      .filter(val => val !== 'all');
            
            kiosqueCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').toLowerCase();
                if (activeFilters.length === 0) {
                    card.style.display = 'flex';
                    card.classList.remove('hide');
                    return;
                }
                const matchesAll = activeFilters.every(filter => categories.includes(filter.toLowerCase()));
                if (matchesAll) {
                    card.style.display = 'flex';
                    card.classList.remove('hide');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hide');
                }
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterVal = btn.getAttribute('data-filter');
                if (filterVal === 'all') {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                } else {
                    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                    if (allBtn) allBtn.classList.remove('active');
                    const group = btn.closest('.filter-group');
                    if (group) {
                        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    }
                    btn.classList.add('active');
                }
                applyFilters();
            });
        });
    }

    // ─── 12. PARALLAX FOR HERO SECTIONS ───
    const parallaxHeroes = document.querySelectorAll('.wz-hero, .kiosque-hero');
    if (parallaxHeroes.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxHeroes.forEach(hero => {
                hero.style.backgroundPositionY = `calc(0% + ${scrolled * 0.4}px)`;
            });
        }, { passive: true });
    }

});
