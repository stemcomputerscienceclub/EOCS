// Scroll Animation Handler
const handleScrollAnimations = () => {
    const elements = document.querySelectorAll('.card-hover, .stat-item, section h2, .footer-section');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
};

// Add floating elements to sections
const addFloatingElements = () => {
    const sections = document.querySelectorAll('section');
    const symbols = ['☥', '𓂀', '𓆣', '𓃛', '☀', '∞', 'π', '∑'];
    
    sections.forEach(section => {
        const wisdom = document.createElement('div');
        wisdom.className = 'wisdom-symbols';
        
        // Add 4 random symbols to each section
        for (let i = 0; i < 4; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'wisdom-symbol floating-element';
            symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            symbol.style.left = `${Math.random() * 80 + 10}%`;
            symbol.style.top = `${Math.random() * 80 + 10}%`;
            symbol.style.animationDelay = `${Math.random() * 2}s`;
            wisdom.appendChild(symbol);
        }
        
        section.insertBefore(wisdom, section.firstChild);
    });
};

// Add scroll-reveal class to elements
const initScrollAnimations = () => {
    // Add card hover effect to all cards
    document.querySelectorAll('.about-card, .eligibility-card, .partner-card, .timeline-item, .contact-card, .channel-card').forEach(card => {
        card.classList.add('card-hover');
    });

    // Add hover effects to links
    document.querySelectorAll('.nav-links a:not(.auth-btn), .footer-section a').forEach(link => {
        link.classList.add('link-hover');
    });

    // Add hover effects to buttons
    document.querySelectorAll('.hero-button, .auth-btn, .submit-btn, .chat-btn, .whatsapp-btn, .email-btn').forEach(button => {
        button.classList.add('button-hover');
    });

    // Add floating effect to specific elements
    document.querySelectorAll('.hero-logo, .stat-item, .prize-icon').forEach(element => {
        element.classList.add('floating-element');
    });
};

// Add background decorative elements
const addBackgroundElements = () => {
    const background = document.querySelector('.background-symbols');
    if (background) {
        const elements = ['dna', 'math', 'chemistry', 'hieroglyph'];
        elements.forEach(type => {
            const element = document.createElement('div');
            element.className = `element ${type} floating-element`;
            background.appendChild(element);
        });
    }
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    addBackgroundElements();
    handleScrollAnimations(); // Initial check for visible elements
    
    // Add scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollAnimations();
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add active class to navigation links based on scroll position
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scroll = window.scrollY;

        if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(section.id)) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Mobile menu toggle with enhanced animation
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Add stagger effect to footer sections
document.querySelectorAll('.footer-section').forEach((section, index) => {
    section.style.transitionDelay = `${index * 0.1}s`;
});