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

// Floating elements animation
const floatingElements = document.querySelectorAll('.timeline-icon, .prize-icon');
floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
});

// Rotating background symbols
const symbols = document.querySelectorAll('.bg-symbol');
symbols.forEach((symbol, index) => {
    symbol.style.animation = `rotate ${10 + index}s linear infinite`;
});

// Text reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'textReveal 1s forwards';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('h2, h3, .timeline-card p, .prize-card li').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add glowing text effect to headings
document.querySelectorAll('h1, h2').forEach(heading => {
    heading.style.animation = 'textGlow 3s ease-in-out infinite';
});

// Create background symbols
function createBackgroundSymbols() {
    const symbols = ['∑', 'π', '∞', 'Δ', 'Ω', '∫', '√'];
    const container = document.createElement('div');
    container.className = 'background-symbols';
    
    for(let i = 0; i < 20; i++) {
        const symbol = document.createElement('span');
        symbol.className = 'bg-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}vw`;
        symbol.style.top = `${Math.random() * 100}vh`;
        symbol.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(symbol);
    }
    
    document.body.appendChild(container);
}

// Initialize background symbols
createBackgroundSymbols();

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