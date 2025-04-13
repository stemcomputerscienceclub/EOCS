// Main JavaScript for EOCS Website

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

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.nav-links');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-menu-active');
        mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
        
        if (mobileNav.style.display === 'flex') {
            mobileNav.style.flexDirection = 'column';
            mobileNav.style.position = 'absolute';
            mobileNav.style.top = '100%';
            mobileNav.style.left = '0';
            mobileNav.style.right = '0';
            mobileNav.style.background = 'var(--egyptian-dark)';
            mobileNav.style.padding = 'var(--spacing-md)';
            mobileNav.style.boxShadow = '0 4px 15px rgba(173, 130, 49, 0.2)';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav.style.display === 'flex' &&
        !mobileNav.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('mobile-menu-active');
        mobileNav.style.display = 'none';
    }
});