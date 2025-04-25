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
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    if (mobileMenuBtn && mainNav) {
        // Add click event to mobile menu button
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('mobile-menu-active');
            // Prevent body scrolling when menu is open
            document.body.style.overflow = mainNav.classList.contains('mobile-menu-active') ? 'hidden' : '';
            
            // Log for debugging
            console.log('Mobile menu button clicked');
            console.log('mobile-menu-active class:', mainNav.classList.contains('mobile-menu-active'));
        });

        // Close menu when clicking links
        if (mobileNavLinks) {
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('mobile-menu-active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('mobile-menu-active') &&
                mobileNav && !mobileNav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                mainNav.classList.remove('mobile-menu-active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNav.classList.contains('mobile-menu-active')) {
                mainNav.classList.remove('mobile-menu-active');
                document.body.style.overflow = '';
            }
        });
    }
});