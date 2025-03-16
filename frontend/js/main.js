// Main JavaScript File

// Countdown Timer Functionality
function updateCountdown() {
    const now = new Date().getTime();
    const competitionDate = new Date('2025-06-01T00:00:00').getTime();
    const timeLeft = competitionDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update countdown numbers with leading zeros
    document.querySelector('.countdown-item:nth-child(1) .countdown-number').textContent = String(days).padStart(2, '0');
    document.querySelector('.countdown-item:nth-child(2) .countdown-number').textContent = String(hours).padStart(2, '0');
    document.querySelector('.countdown-item:nth-child(3) .countdown-number').textContent = String(minutes).padStart(2, '0');
    document.querySelector('.countdown-item:nth-child(4) .countdown-number').textContent = String(seconds).padStart(2, '0');
}

// Initialize countdown
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Add active state to current navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize active nav link
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Smooth scroll for anchor links
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

// Add intersection observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// Handle form submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Add your form submission logic here
            
            submitButton.textContent = 'Success!';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Form submission error:', error);
            submitButton.textContent = 'Error! Try Again';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    });
});