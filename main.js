document.addEventListener('DOMContentLoaded', function () {

    // AOS Kütüphanesini Başlat
    AOS.init({
        duration: 800, // Animasyon süresi
        once: true, // Animasyonlar sadece bir kez çalışsın
        offset: 50, // Tetikleme noktası (px)
    });

    // Navbar'ı Scroll'a Göre Küçült
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                mainNav.classList.add('shrink');
            } else {
                mainNav.classList.remove('shrink');
            }
        });
    }

    // Sayfa İçi Linklere Pürüzsüz Kaydırma
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const getNavOffset = () => {
        const nav = document.getElementById('mainNav');
        return (nav ? nav.offsetHeight : 0) + 8; // sabit navbar için küçük marj
    };
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            e.preventDefault();
            const offset = getNavOffset();
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // İletişim Formu Doğrulama (Bootstrap 5 ile)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            contactForm.classList.add('was-validated');
        }, false);
    }

    // Footer Yılını Dinamik Olarak Ayarla
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Hero Sayaç Animasyonu
    const counters = document.querySelectorAll('.stats .num');
    const speed = 200; // Animasyon hızı

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const increment = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });

    // Hero Arka Planına İnce Paralaks Efekti
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        });
    }

    // Hizmet Kartlarına Tilt Efekti
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 10;
            const y = (e.clientY - top - height / 2) / 10;
            card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Galeri: img klasöründeki IMG-20251105-WA0001..0019.jpg dosyalarından grid oluştur
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        // Kaldırılacak görseller için kara liste (dosya adını buraya ekleyebilirim)
        const blacklist = [
            'img/IMG-20251105-WA0015.jpg'
        ];
        const pad4 = (n) => String(n).padStart(4, '0');
        const files = Array.from({ length: 19 }, (_, i) => `img/IMG-20251105-WA${pad4(i + 1)}.jpg`);

        // Örnek başlıklar (ekrandaki gibi). Fazla görsel varsa döngüsel kullanılır
        const preferredCaptions = [
            'TEMİZLİK İÇİN VİNÇ',
            'KLİMA VE TAMİR İÇİN VİNÇ',
            'İNŞAAT SEKTÖRÜ İÇİN VİNÇ',
            'REKLAMCILIK İÇİN VİNÇ',
            'SANAYİ SEKTÖRÜ İÇİN VİNÇ',
            'ÖZEL HİZMET İÇİN VİNÇ',
            'TABELA ASMAK İÇİN VİNÇ',
            'BAHÇE İŞLERİ İÇİN VİNÇ',
            'YÜKSEK TAVAN İÇİN VİNÇ'
        ];

        const toCaption = (path, index) => {
            if (preferredCaptions.length) {
                return preferredCaptions[index % preferredCaptions.length];
            }
            const name = path.split('/').pop().replace(/\.[^.]+$/, '');
            return name.replace(/[-_]+/g, ' ').trim();
        };

        const createCol = (src) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
            const figure = document.createElement('figure');
            figure.className = 'gallery-item m-0';

            const anchor = document.createElement('a');
            anchor.href = '#';
            anchor.dataset.src = src;
            anchor.className = 'd-block rounded-3 overflow-hidden shadow-sm';

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Galeri görseli';
            img.className = 'w-100 h-100';
            img.style.objectFit = 'cover';
            img.loading = 'lazy';

            anchor.appendChild(img);

            const figcap = document.createElement('figcaption');
            figcap.className = 'gallery-caption mt-2 text-center';
            figcap.textContent = toCaption(src, files.indexOf(src));

            figure.appendChild(anchor);
            figure.appendChild(figcap);
            col.appendChild(figure);
            return col;
        };

        files.forEach((src) => {
            if (blacklist.includes(src)) return;
            const img = new Image();
            img.onload = () => galleryGrid.appendChild(createCol(src));
            img.onerror = () => {};
            img.src = src;
        });

        // Modal açma
        const modalEl = document.getElementById('galleryModal');
        const modalImg = document.getElementById('galleryModalImg');
        let bsModal;
        if (modalEl) {
            bsModal = new bootstrap.Modal(modalEl);
            galleryGrid.addEventListener('click', (e) => {
                const anchor = e.target.closest('a');
                if (!anchor || !galleryGrid.contains(anchor)) return;
                e.preventDefault();
                const src = anchor.dataset.src;
                if (src && modalImg) {
                    modalImg.src = src;
                    bsModal.show();
                }
            });
        }
    }

    // Telefon/WhatsApp numaralarını tek kaynaktan güncelle
    const primaryPhone = '905327730057';
    const waText = 'Merhaba%2C+web+sitenizden+ula%C5%9F%C4%B1yorum.+Vin%C3%A7+hizmetiniz+hakk%C4%B1nda+bilgi+almak+istiyorum.';
    document.querySelectorAll('[data-phone="primary-call"]').forEach(a => {
        a.setAttribute('href', `tel:+${primaryPhone}`);
    });
    document.querySelectorAll('[data-phone="primary-wa"]').forEach(a => {
        a.setAttribute('href', `https://wa.me/${primaryPhone}?text=${waText}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
    });

    // Tema Değiştirici
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeToggleSun = document.getElementById('theme-toggle-sun');
        const themeToggleMoon = document.getElementById('theme-toggle-moon');
        const body = document.body;
        const htmlEl = document.documentElement;
        const themeMeta = document.querySelector('meta[name="theme-color"]');

        const applyTheme = (theme) => {
            body.dataset.theme = theme;
            if (htmlEl) {
                htmlEl.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
            }
            if (themeMeta) {
                themeMeta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#ffffff');
            }
            if (theme === 'dark') {
                if (themeToggleSun) themeToggleSun.classList.add('d-none');
                if (themeToggleMoon) themeToggleMoon.classList.remove('d-none');
            } else {
                if (themeToggleSun) themeToggleSun.classList.remove('d-none');
                if (themeToggleMoon) themeToggleMoon.classList.add('d-none');
            }
        };

        const toggleTheme = () => {
            const currentTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        };

        themeToggle.addEventListener('click', toggleTheme);

        // Sayfa yüklendiğinde temayı ayarla
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);
    }

});


