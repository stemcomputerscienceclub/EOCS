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
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Handle both relative and absolute paths
        if (linkPath === currentPath || 
            (currentPath.endsWith(linkPath) && linkPath !== '/') ||
            (currentPath === '/' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set active nav link on page load and navigation
document.addEventListener('DOMContentLoaded', setActiveNavLink);
window.addEventListener('popstate', setActiveNavLink);

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mainNav.classList.toggle('mobile-menu-active');
        document.body.style.overflow = mainNav.classList.contains('mobile-menu-active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking outside or on a link
document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('mobile-menu-active') &&
        !mobileNav.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('mobile-menu-active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link
mobileNav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        mainNav.classList.remove('mobile-menu-active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('mobile-menu-active')) {
        mainNav.classList.remove('mobile-menu-active');
        document.body.style.overflow = '';
    }
});