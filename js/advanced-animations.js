// Create particle effects
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    // Random values for movement
    const destinationX = (Math.random() - 0.5) * 200;
    const destinationY = (Math.random() - 0.5) * 200;
    
    particle.style.setProperty('--x', `${destinationX}px`);
    particle.style.setProperty('--y', `${destinationY}px`);
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    setTimeout(() => particle.remove(), 1000);
}

// Add particles on click
document.addEventListener('click', (e) => {
    for(let i = 0; i < 10; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

// Floating Elements Manager
class FloatingElementManager {
    constructor(element) {
        this.element = element;
        this.startPosition = {
            x: parseFloat(getComputedStyle(element).left) || 0,
            y: parseFloat(getComputedStyle(element).top) || 0
        };
        this.speed = Math.random() * 0.5 + 0.5;
        this.offset = Math.random() * Math.PI * 2;
        this.animate();
    }

    animate() {
        const time = Date.now() * 0.001 * this.speed + this.offset;
        const dx = Math.sin(time) * 15;
        const dy = Math.cos(time * 0.8) * 15;

        this.element.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize floating elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating icons
    document.querySelectorAll('.timeline-icon, .prize-icon, .floating-element').forEach(element => {
        new FloatingElementManager(element);
    });

    // Initialize background symbols with floating effect
    const symbolChars = ['∑', 'π', '∞', 'Δ', 'Ω', '∫', '√'];
    const container = document.querySelector('.background-symbols') || document.createElement('div');
    container.className = 'background-symbols';
    
    if (!container.hasChildNodes()) {
        for(let i = 0; i < 20; i++) {
            const symbol = document.createElement('span');
            symbol.className = 'bg-symbol floating-element';
            symbol.textContent = symbolChars[Math.floor(Math.random() * symbolChars.length)];
            symbol.style.position = 'absolute';
            symbol.style.left = `${Math.random() * 90 + 5}%`;
            symbol.style.top = `${Math.random() * 90 + 5}%`;
            symbol.style.color = 'var(--egyptian-gold)';
            symbol.style.opacity = '0.1';
            symbol.style.fontSize = `${Math.random() * 2 + 1}rem`;
            container.appendChild(symbol);
            new FloatingElementManager(symbol);
        }
        
        if (!document.body.contains(container)) {
            document.body.appendChild(container);
        }
    }
});

// Text reveal on scroll
const textRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'textReveal 1s forwards';
            entry.target.style.opacity = '1';
        }
    });
}, { threshold: 0.1 });

// Only select specific elements that should have the reveal animation
document.querySelectorAll('.timeline-card p, .prize-card li, .animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    textRevealObserver.observe(el);
});

// Add glowing text effect to headings without affecting opacity
document.querySelectorAll('h1, h2').forEach(heading => {
    heading.style.animation = 'textGlow 3s ease-in-out infinite';
});

// Add hover effect to cards
document.querySelectorAll('.timeline-card, .prize-card, .partner-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});