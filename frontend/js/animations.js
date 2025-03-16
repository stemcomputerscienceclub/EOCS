// Matrix Rain Animation
function createMatrixRain() {
    const matrixRain = document.querySelector('.matrix-rain');
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDelay = `${Math.random() * 20}s`;
        
        let text = '';
        for (let j = 0; j < 50; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '\n';
        }
        column.textContent = text;
        
        matrixRain.appendChild(column);
    }
}

// Floating Symbols Animation
function createFloatingSymbols() {
    const container = document.querySelector('.floating-symbols');
    const symbolTypes = [
        'code', 'bracket', 'array', 'binary', 'function', 'matrix', 'algorithm',
        'sum', 'integral', 'pi', 'root', 'delta', 'atom', 'infinity',
        'ankh', 'eye', 'sun', 'pyramid'
    ];

    // Create 30 random symbols
    for (let i = 0; i < 30; i++) {
        const symbol = document.createElement('div');
        symbol.className = `symbol ${symbolTypes[Math.floor(Math.random() * symbolTypes.length)]}`;
        
        // Random position
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        symbol.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(symbol);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createMatrixRain();
    createFloatingSymbols();
});

// Responsive handling
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const matrixRain = document.querySelector('.matrix-rain');
        matrixRain.innerHTML = '';
        createMatrixRain();
    }, 250);
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
}

// Add hover glow effect to navigation links
const navLinksElements = document.querySelectorAll('.nav-link');
navLinksElements.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.textShadow = `0 0 10px ${getComputedStyle(document.documentElement).getPropertyValue('--accent-gold')}`;
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.textShadow = 'none';
    });
});