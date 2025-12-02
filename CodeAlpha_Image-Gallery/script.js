const gallery = document.getElementById('gallery');
const cards = Array.from(document.querySelectorAll('.card'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentIndex = -1;

// ========== Visible Cards ==========
function visibleCards() {
    return Array
        .from(document.querySelectorAll('.card'))
        .filter(c => !c.classList.contains('hidden'));
}

// ========== Open Lightbox ==========
function openLightboxByVisibleIndex(i) {
    const visible = visibleCards();
    if (!visible.length) return;

    currentIndex = Math.max(0, Math.min(i, visible.length - 1));

    const card = visible[currentIndex];

    lbImg.src = card.dataset.full;
    lbImg.alt = card.dataset.title || '';
    lbTitle.textContent = card.dataset.title || '';
    lbDesc.textContent = card.dataset.desc || '';

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// ========== Close Lightbox ==========
function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
}

// ========== Navigation ==========
function showNext() {
    openLightboxByVisibleIndex(currentIndex + 1);
}

function showPrev() {
    openLightboxByVisibleIndex(currentIndex - 1);
}

// ========== Card Click Events ==========
cards.forEach(card => {
    card.addEventListener('click', () => {
        const visible = visibleCards();
        openLightboxByVisibleIndex(visible.indexOf(card));
    });

    card.addEventListener('keydown', e => {
        if (e.key === 'Enter') card.click();
    });
});

// ========== Lightbox Buttons ==========
closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});

nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    showNext();
});

prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    showPrev();
});

// ========== Keyboard Control ==========
window.addEventListener('keydown', e => {
    if (lightbox.classList.contains('open')) {
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeLightbox();
    }
});

// ========== Download Button ==========
downloadBtn.addEventListener('click', () => {
    if (!lbImg.src) return;

    const a = document.createElement('a');
    a.href = lbImg.src;
    a.download = 'image.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
});

// ========== Filter Buttons ==========
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const showAllBtn = document.getElementById('show-all');

function setActiveButton(btn) {
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const f = btn.dataset.filter;

        cards.forEach(c => {
            c.dataset.category === f
                ? c.classList.remove('hidden')
                : c.classList.add('hidden');
        });

        setActiveButton(btn);
    });
});

showAllBtn.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('hidden'));
    setActiveButton(showAllBtn);
});

// ========== Grayscale Toggle ==========
const toggleGrayscale = document.getElementById('toggle-grayscale');

toggleGrayscale.addEventListener('click', () => {
    gallery.classList.toggle('filter-grayscale');
    toggleGrayscale.classList.toggle('active');
});

// ========== Mutation Observer ==========
const observer = new MutationObserver(() => {
    if (lightbox.classList.contains('open')) {
        const visible = visibleCards();
        if (currentIndex >= visible.length) {
            currentIndex = visible.length - 1;
            if (currentIndex < 0) closeLightbox();
        }
    }
});

observer.observe(gallery, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
});

// Set default active button
showAllBtn.classList.add('active');
