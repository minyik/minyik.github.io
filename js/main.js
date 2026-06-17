let lenis, shown = 6;
let originalOrder = [];

document.addEventListener('DOMContentLoaded', () => {
    initLenis(); 
    initNavigation(); 
    initPortfolio(); 
    initModal(); 

    initHeroAnimation(); 
    initTaglineAnimation();
    initProfileInfoAnimation();
    initContactAnimation();
});

function initLenis() {
    lenis = new Lenis({ duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4), smooth: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
}

function initNavigation() {
    document.querySelectorAll("nav button").forEach((btn, i) => {
        btn.addEventListener("click", () => gsap.to(window, { duration: 1, scrollTo: { y: `#section${i + 1}`, offsetY: 120 } }));
    });
}

// main
function initHeroAnimation() {
    gsap.timeline()
        .from("#section1 .sub_title li", { y: 30, opacity: 0, filter: "blur(8px)", duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 })
        .from("#section1 h1", { y: 50, opacity: 0, filter: "blur(12px)", duration: 1.5, ease: "power4.out" }, "-=0.8");

    gsap.matchMedia()
        .add("(min-width: 769px)", () => gsap.to("#section1 .main_title", { scrollTrigger: { trigger: "#section1", start: "top top", end: "bottom top", scrub: true }, y: 150, opacity: 0, scale: 0.9, ease: "none" }))
        .add("(max-width: 768px)", () => gsap.to("#section1 .main_title", { scrollTrigger: { trigger: "#section1", start: "top top", end: "center top", scrub: true }, y: 80, opacity: 0, scale: 0.95, ease: "none" }));
}

// sec2 - sub title
function initTaglineAnimation() {
    document.querySelectorAll('.tagline_container span').forEach(span => {
        span.style.display = 'block';
        span.innerHTML = [...span.textContent].map(c => `<span style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    });

    gsap.fromTo('.tagline_container span span', { opacity: 0, y: 10 }, {
        scrollTrigger: { trigger: '.tagline_container', start: 'top 80%' },
        opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out'
    });
}

// sec2 - profile desc
function initProfileInfoAnimation() {
    const animProps = { y: 50, opacity: 0, filter: "blur(10px)", duration: 1.2, ease: "power3.out" };

    gsap.from([".profile_intro_desc", ".introduce1", ".introduce2"], {
        ...animProps,
        stagger: 0.4,
        scrollTrigger: { trigger: ".profile_info", start: "top 45%" }
    });
}

// sec4 - email desc
function initContactAnimation() {
    gsap.set("#section4 p, #section4 .btn_email, #section4 .btn_messenger", { opacity: 0, y: 30 });

    gsap.timeline({ scrollTrigger: { trigger: "#section4", start: "top 75%" } })
        .to("#section4 p", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to("#section4 .btn_email, #section4 .btn_messenger", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.7");
}


// sec3 - modal
function getVisible() {
    const activeBtn = document.querySelector('.filter_tabs button.active');
    if (!activeBtn) return [...document.querySelectorAll('.portfolio_card')];
    
    const active = activeBtn.dataset.category;
    return [...document.querySelectorAll('.portfolio_card')].filter(c =>
        active === 'all' || c.dataset.category === active
    );
}

function render() {
    const allCards = [...document.querySelectorAll('.portfolio_card')];
    const visibleCards = getVisible();
    const btnMore = document.querySelector('.btn_more');

    allCards.forEach(c => {
        if (!visibleCards.includes(c)) {
            c.style.display = 'none';
            c.style.opacity = '';
            c.style.transform = '';
            c.style.transition = '';
            c.style.transitionDelay = '';
        }
    });

    visibleCards.forEach((c, i) => {
        if (i < shown) {
            c.style.display = '';
            c.style.opacity = '0';
            c.style.transform = 'translateY(20px)';
            c.style.transition = 'none';
            c.style.transitionDelay = '0s';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    c.style.transitionDelay = `${i * 0.07}s`;
                    c.style.opacity = '1';
                    c.style.transform = 'translateY(0)';
                });
            });
        } else {
            c.style.display = 'none';
        }
    });

    if (btnMore) {
        btnMore.style.display = shown >= visibleCards.length ? 'none' : 'block';
    }
}

// 전체 - 랜덤
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function captureOriginalOrder() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    originalOrder = [...grid.querySelectorAll('.portfolio_card')];
}

function shuffleAllCards() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid || !originalOrder.length) return;
    const shuffled = shuffleArray([...originalOrder]);
    shuffled.forEach(card => grid.appendChild(card));
}

function restoreOriginalOrder() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid || !originalOrder.length) return;
    originalOrder.forEach(card => grid.appendChild(card));
}
// 랜덩 end


function filterCards(category, btn) {
    document.querySelectorAll('.filter_tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    btn.dataset.category = category;
    shown = 6;

    if (category === 'all') {
        shuffleAllCards();
    } else {
        restoreOriginalOrder();
    }

    render();
}

function preloadDescImages() {
    document.querySelectorAll('.portfolio_card').forEach(card => {
        const src = card.dataset.descImg;
        if (src) {
            const img = new Image();
            img.src = src;
        }
    });
}

function initPortfolio() {
    captureOriginalOrder();
    shuffleAllCards();

    document.querySelectorAll('.filter_tabs button').forEach(btn => {
        const match = btn.getAttribute('onclick')?.match(/'([^']+)'/);
        if (match) btn.dataset.category = match[1];
    });

    render();

    const btnMore = document.querySelector('.btn_more');
    if (btnMore) {
        btnMore.addEventListener('click', () => {
            const visibleCards = getVisible();
            const next = visibleCards.slice(shown, shown + 6);
            shown += 6;

            next.forEach((c, i) => {
                c.style.display = '';
                c.style.opacity = '0';
                c.style.transform = 'translateY(20px)';
                c.style.transition = 'none';
                c.style.transitionDelay = '0s';

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        c.style.transitionDelay = `${i * 0.07}s`;
                        c.style.opacity = '1';
                        c.style.transform = 'translateY(0)';
                    });
                });
            });

            btnMore.style.display = shown >= visibleCards.length ? 'none' : 'block';
        });
    }
}

function initModal() {
    const modal = document.getElementById('portfolioModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalLink = document.getElementById('modalLink');
    const modalClose = document.querySelector('.modal_close');
    const modalBody = document.querySelector('.modal_body');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (!modal || !modalBody || !portfolioGrid) return;

    let targetScrollTop = 0;
    let currentScrollTop = 0;

    modalBody.addEventListener('wheel', (e) => {
        e.stopPropagation();
        targetScrollTop += e.deltaY;
        targetScrollTop = Math.max(0, Math.min(targetScrollTop, modalBody.scrollHeight - modalBody.clientHeight));
    }, { passive: true });

    function smoothModalScroll() {
        currentScrollTop += (targetScrollTop - currentScrollTop) * 0.08;
        modalBody.scrollTop = currentScrollTop;
        requestAnimationFrame(smoothModalScroll);
    }
    smoothModalScroll();


    portfolioGrid.addEventListener('click', e => {
        const card = e.target.closest('.portfolio_card');
        if (!card) return;

        const newSrc = card.dataset.descImg || '';

        modalImg.style.transition = 'none';
        modalImg.style.opacity = '0';

        if (modalImg.src !== newSrc) {
            modalImg.onload = () => {
                modalImg.style.transition = 'opacity 0.3s ease';
                modalImg.style.opacity = '1';
            };
            modalImg.src = newSrc;
        } else {
            requestAnimationFrame(() => {
                modalImg.style.transition = 'opacity 0.3s ease';
                modalImg.style.opacity = '1';
            });
        }

        modalTitle.textContent = card.querySelector('h3')?.textContent || '';
        modalLink.href = card.dataset.link || '#';

        modalTags.innerHTML = '';
        card.querySelectorAll('.card_tags li').forEach(tag => {
            const li = document.createElement('li');
            li.textContent = tag.textContent;
            modalTags.appendChild(li);
        });

        modalLink.style.display = card.dataset.link ? '' : 'none';

        targetScrollTop = 0;
        currentScrollTop = 0;
        modalBody.scrollTop = 0;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        const header = document.querySelector('#header');
        if (header) header.style.paddingRight = scrollbarWidth + 'px';

        if (lenis) lenis.stop();

        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    });


    function closeModal() {
        modal.classList.remove('active');
        document.body.style.paddingRight = '';
        const header = document.querySelector('#header');
        if (header) header.style.paddingRight = '';
        if (lenis) lenis.start(); 
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// btn top
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("back-top");
    window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 200));

    btn.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        const start = window.scrollY;
        let time;
        const step = now => {
            if (!time) time = now; 
            let p = Math.min((now - time) / 800, 1);
            window.scrollTo(0, start * (1 - p) ** 3);
            
            if (p < 1) requestAnimationFrame(step);
            else window.scrollTo(0, 0);
        };
        requestAnimationFrame(step);
    });
});