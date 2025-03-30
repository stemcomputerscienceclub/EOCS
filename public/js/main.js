// Main JavaScript for EOCS Website

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('show');
});

// Intersection Observer for Timeline Animations
const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Observe all timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Dynamic Floating Elements
class FloatingElement {
    constructor(element) {
        this.element = element;
        this.originalPosition = {
            x: parseFloat(getComputedStyle(element).left),
            y: parseFloat(getComputedStyle(element).top)
        };
        this.speed = Math.random() * 0.5 + 0.5;
        this.offset = Math.random() * Math.PI * 2;
        this.animate();
    }

    animate() {
        const time = Date.now() * 0.001 * this.speed + this.offset;
        const dx = Math.sin(time) * 20;
        const dy = Math.cos(time) * 20;

        this.element.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize floating elements
document.querySelectorAll('.element').forEach(element => {
    new FloatingElement(element);
});

// Create floating wisdom symbols
function createWisdomSymbols() {
    const symbols = [
        { class: 'ankh', probability: 0.2 },
        { class: 'eye-of-horus', probability: 0.15 },
        { class: 'scarab', probability: 0.15 },
        { class: 'feather', probability: 0.1 },
        { class: 'sun-disk', probability: 0.1 },
        { class: 'infinity', probability: 0.1 },
        { class: 'pi', probability: 0.1 },
        { class: 'sigma', probability: 0.1 }
    ];

    const container = document.createElement('div');
    container.className = 'wisdom-symbols';
    document.body.appendChild(container);

    // Create initial symbols
    for (let i = 0; i < 20; i++) {
        createSymbol(container, symbols);
    }

    // Continuously create new symbols
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to create a new symbol
            createSymbol(container, symbols);
        }
    }, 2000);
}

function createSymbol(container, symbols) {
    const symbol = document.createElement('div');
    symbol.className = 'wisdom-symbol';
    
    // Randomly select a symbol based on probability
    const random = Math.random();
    let cumulative = 0;
    const selectedSymbol = symbols.find(s => {
        cumulative += s.probability;
        return random < cumulative;
    }) || symbols[0];
    
    symbol.classList.add(selectedSymbol.class);
    
    // Random position and animation duration
    symbol.style.left = Math.random() * 100 + 'vw';
    symbol.style.animationDuration = (10 + Math.random() * 10) + 's';
    
    container.appendChild(symbol);
    
    // Remove symbol after animation
    symbol.addEventListener('animationend', () => {
        container.removeChild(symbol);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createWisdomSymbols();
    
    // Add other initialization code here
});

// Update countdown timer
function updateCountdown() {
    const now = new Date();
    const target = new Date('2025-01-01T00:00:00'); // Set your target date here
    const diff = target - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.querySelector('.days').textContent = String(days).padStart(2, '0');
        document.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        document.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial update

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Scrolling for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add show class to nav links for mobile menu animation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('show');
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('show');
    }
});

// Add active class to current navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);