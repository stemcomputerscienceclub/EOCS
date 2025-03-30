// Animations for EOCS Website

class AnimationController {
    constructor() {
        this.floatingElements = [];
        this.init();
    }

    init() {
        this.initFloatingElements();
        this.initParallaxEffect();
        this.initScrollAnimations();
    }

    // Floating Elements Animation
    initFloatingElements() {
        const elements = document.querySelectorAll('.element');
        elements.forEach(element => {
            this.floatingElements.push(new FloatingElement(element));
        });
    }

    // Parallax Scrolling Effect
    initParallaxEffect() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            // Apply parallax effect with requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            });
        });
    }

    // Scroll-triggered Animations
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Only animate once
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
}

class FloatingElement {
    constructor(element) {
        this.element = element;
        this.initialPosition = {
            x: parseFloat(getComputedStyle(element).left),
            y: parseFloat(getComputedStyle(element).top)
        };
        this.amplitude = {
            x: Math.random() * 20 + 10,
            y: Math.random() * 20 + 10
        };
        this.speed = Math.random() * 0.5 + 0.5;
        this.offset = Math.random() * Math.PI * 2;
        this.animate();
    }

    animate() {
        const time = Date.now() * 0.001 * this.speed + this.offset;
        
        // Calculate smooth sinusoidal movement
        const dx = Math.sin(time) * this.amplitude.x;
        const dy = Math.cos(time * 1.2) * this.amplitude.y;

        // Apply transform with hardware acceleration
        this.element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Glowing Text Effect
class GlowingText {
    constructor(element) {
        this.element = element;
        this.baseIntensity = 5;
        this.maxIntensity = 15;
        this.animate();
    }

    animate() {
        const time = Date.now() * 0.001;
        const intensity = this.baseIntensity + 
            Math.sin(time) * (this.maxIntensity - this.baseIntensity);

        this.element.style.filter = `drop-shadow(0 0 ${intensity}px var(--primary-light))`;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation controller
    const animationController = new AnimationController();

    // Initialize glowing text effects
    document.querySelectorAll('.glowing-text').forEach(element => {
        new GlowingText(element);
    });

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            // Disable animations for users who prefer reduced motion
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    // Check initial preference and listen for changes
    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
});