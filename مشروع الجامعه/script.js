let currentSlide = 0;
const container = document.getElementById('personalitiesContainer');
const cards = document.querySelectorAll('.card');
const gridBtn = document.getElementById('gridViewBtn');
const slideBtn = document.getElementById('slideViewBtn');
const controls = document.getElementById('slideshowControls');

function switchView(view) {
    if (view === 'grid') {
        container.classList.remove('personalities-slide');
        container.classList.add('personalities-grid');
        controls.style.display = 'none';
        gridBtn.classList.add('active');
        slideBtn.classList.remove('active');

        // رجع الستايلات زي ما كانت للجريد
        cards.forEach(card => {
            card.style.display = 'flex'; // أو بلوك/فليكس على حسب الـ CSS
            card.classList.remove('active-slide');
        });
    } else {
        container.classList.remove('personalities-grid');
        container.classList.add('personalities-slide');
        controls.style.display = 'flex';
        slideBtn.classList.add('active');
        gridBtn.classList.remove('active');

        showSlide(currentSlide);
    }
}

function showSlide(n) {
    if (n >= cards.length) currentSlide = 0;
    if (n < 0) currentSlide = cards.length - 1;

    cards.forEach((card, index) => {
        if (index === currentSlide) {
            card.style.display = 'flex';
            card.classList.add('active-slide');
        } else {
            card.style.display = 'none';
            card.classList.remove('active-slide');
        }
    });
}

function moveSlide(n) {
    showSlide(currentSlide += n);
}
