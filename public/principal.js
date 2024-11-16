// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop({
            behavior: 'smooth'
        });
    });
});

// Carousel functionality
const carousel = {
    currentSlide: 0,
    items: document.querySelectorAll('.carousel-item'),
    total: document.querySelectorAll('.carousel-item').length,
    
    init() {
        // Create dots
        const dotsContainer = document.querySelector('.carousel-dots');
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        // Add event listeners for buttons
        document.querySelector('.carousel-prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.carousel-next').addEventListener('click', () => this.nextSlide());

        // Auto advance slides
        setInterval(() => this.nextSlide(), 5000);
    },

    showSlide(index) {
        this.items.forEach(item => item.style.display = 'none');
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        
        this.items[index].style.display = 'block';
        document.querySelectorAll('.dot')[index].classList.add('active');
        
        this.currentSlide = index;
    },

    nextSlide() {
        const next = (this.currentSlide + 1) % this.total;
        this.showSlide(next);
    },

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.total) % this.total;
        this.showSlide(prev);
    },

    goToSlide(index) {
        this.showSlide(index);
    }
};

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    carousel.init();
    initializeStatCounters();
});

// Animate statistics when they come into view
function initializeStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

