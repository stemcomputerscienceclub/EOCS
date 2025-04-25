document.addEventListener('DOMContentLoaded', function() {
    // Initialize Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'titleAppear 1s forwards';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all glowing titles
    document.querySelectorAll('.glowing-title').forEach(title => {
        observer.observe(title);
    });
});

// Add the animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes titleAppear {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 