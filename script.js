/**
 * MOBIMOBI - Modern Kurumsal Mobilya Dönüşüm & Yenileme Platformu
 * Vanilla JavaScript Core & Advanced Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBeforeAfterSlider();
    initFabricStudio();
    initAnimatedCounters();
    initFaqAccordion();
    initDiscoveryForm();
});

/* ==========================================================================
   1. Header & Mobile Navigation
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/* ==========================================================================
   2. Interactive Before / After Slider
   ========================================================================== */
function initBeforeAfterSlider() {
    const sliderContainer = document.querySelector('.ba-slider-container');
    const rangeInput = document.getElementById('baRange');
    const afterContainer = document.querySelector('.ba-after-container');
    const handle = document.querySelector('.ba-handle');

    if (!sliderContainer || !rangeInput || !afterContainer || !handle) return;

    function updateSlider(val) {
        afterContainer.style.width = `${val}%`;
        handle.style.left = `${val}%`;
    }

    rangeInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });

    let isDragging = false;

    function setPosition(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        let posX = clientX - rect.left;
        let percentage = (posX / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        rangeInput.value = percentage;
        updateSlider(percentage);
    }

    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    sliderContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            setPosition(e.touches[0].clientX);
        }
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            setPosition(e.touches[0].clientX);
        }
    });
}

/* ==========================================================================
   3. Interactive Fabric & Color Studio (Mini Configurator)
   ========================================================================== */
function initFabricStudio() {
    const swatches = document.querySelectorAll('.swatch-btn');
    const previewImg = document.getElementById('studioPreviewImg');
    const colorBadge = document.getElementById('studioColorBadge');
    const fabricNameEl = document.getElementById('specFabricName');
    const fabricTypeEl = document.getElementById('specFabricType');
    const martindaleEl = document.getElementById('specMartindale');
    const warrantyEl = document.getElementById('specWarranty');

    if (!swatches.length || !previewImg) return;

    const fabricData = {
        'antrasit': {
            name: 'Kurumsal Antrasit Dokuma',
            type: 'Yoğun Trafik / Leke Tutmaz',
            martindale: '75.000 Devir',
            warranty: '2 Yıl Garantili',
            badge: 'Antrasit Gri - Şık & Kurumsal',
            img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'
        },
        'mavi': {
            name: 'Okyanus Mavisi Nefes Alan File',
            type: 'Ergonomik Nefes Alan Kumaş',
            martindale: '65.000 Devir',
            warranty: '2 Yıl Garantili',
            badge: 'Okyanus Mavisi - Modern Dinamik',
            img: 'https://images.unsplash.com/photo-1580481077195-c3ef6731996d?auto=format&fit=crop&w=1000&q=80'
        },
        'taba': {
            name: 'Premium Taba Taba Vegan Deri',
            type: 'Silinebilir Antibakteriyel Deri',
            martindale: '90.000 Devir',
            warranty: '2 Yıl Garantili',
            badge: 'Taba Deri - Prestijli Yönetici',
            img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
        },
        'yesil': {
            name: 'Zümrüt Yeşil Döngüsel Seri',
            type: '%100 Geri Dönüştürülmüş İplik',
            martindale: '60.000 Devir',
            warranty: '2 Yıl Garantili',
            badge: 'Zümrüt Yeşil - Eko Seri',
            img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80'
        },
        'turuncu': {
            name: 'Mobimobi İmza Enerjik Turuncu',
            type: 'Alev Almaz Güçlendirilmiş Dokuma',
            martindale: '80.000 Devir',
            warranty: '2 Yıl Garantili',
            badge: 'Mobimobi Turuncusu - İkonik',
            img: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1000&q=80'
        }
    };

    swatches.forEach(btn => {
        btn.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');

            const colorKey = btn.dataset.color;
            const data = fabricData[colorKey];
            if (!data) return;

            // Smooth fade transition
            previewImg.style.opacity = '0.3';
            setTimeout(() => {
                previewImg.src = data.img;
                previewImg.style.opacity = '1';
                if (colorBadge) colorBadge.textContent = data.badge;
                if (fabricNameEl) fabricNameEl.textContent = data.name;
                if (fabricTypeEl) fabricTypeEl.textContent = data.type;
                if (martindaleEl) martindaleEl.textContent = data.martindale;
                if (warrantyEl) warrantyEl.textContent = data.warranty;
            }, 180);
        });
    });
}

/* ==========================================================================
   4. Animated Stat Counters (IntersectionObserver)
   ========================================================================== */
function initAnimatedCounters() {
    const trustNumbers = document.querySelectorAll('.trust-number');
    if (!trustNumbers.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const trustSection = document.querySelector('.hero-trust');
    if (trustSection) observer.observe(trustSection);

    function animateStats() {
        trustNumbers.forEach(el => {
            const raw = el.textContent.trim();
            if (raw.includes('%')) {
                // Percentage counter
                let current = 0;
                const target = parseInt(raw.replace('%', ''), 10);
                const timer = setInterval(() => {
                    current += 2;
                    if (current >= target) {
                        el.textContent = `%${target}`;
                        clearInterval(timer);
                    } else {
                        el.textContent = `%${current}`;
                    }
                }, 25);
            } else if (raw.includes('10.000+')) {
                let current = 0;
                const timer = setInterval(() => {
                    current += 400;
                    if (current >= 10000) {
                        el.textContent = '10.000+';
                        clearInterval(timer);
                    } else {
                        el.textContent = `${current.toLocaleString('tr-TR')}+`;
                    }
                }, 30);
            }
        });
    }
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   8. Discovery Form Submission
   ========================================================================== */
function initDiscoveryForm() {
    const form = document.getElementById('discoveryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = 'Talebiniz Alınıyor...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Teşekkürler! Ücretsiz keşif talebiniz başarıyla alındı. Uzman ekibimiz 24 saat içinde sizinle iletişime geçecektir.');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}
