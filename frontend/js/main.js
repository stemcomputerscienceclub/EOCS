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

// Countdown Timer
function updateCountdown() {
    // Set the date we're counting down to (3 months from now)
    const countDownDate = new Date();
    countDownDate.setMonth(countDownDate.getMonth() + 3);

    // Update the countdown every 1 second
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Calculate days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the HTML
        document.querySelector('.days').textContent = String(days).padStart(2, '0');
        document.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        document.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');

        // If the countdown is finished, clear the interval
        if (distance < 0) {
            clearInterval(timer);
            document.querySelector('.countdown').innerHTML = "Registration Closed";
        }
    }, 1000);
}

// Start the countdown
updateCountdown();

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