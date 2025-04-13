// Pyramid Loader Animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-container');
    const pyramid = document.querySelector('.pyramid');
    const circles = document.querySelectorAll('.rotating-circles .circle');
    const hieroglyphics = document.querySelectorAll('.rotating-circles .hieroglyphic');
    const progress = document.querySelector('.progress');

    // Show loader immediately
    if (loader) {
        loader.style.display = 'flex';
        loader.classList.remove('fade-out');
    }

    // Animate pyramid
    if (pyramid) {
        pyramid.style.animation = 'rotatePyramid 4s infinite linear';
    }

    // Animate circles
    circles.forEach((circle, index) => {
        circle.style.animation = `rotateCircle 4s infinite linear ${index * 0.5}s`;
    });

    // Animate hieroglyphics
    hieroglyphics.forEach((hieroglyphic, index) => {
        hieroglyphic.style.animation = `fadeInOut 2s infinite ${index * 0.5}s`;
    });

    // Progress bar animation
    if (progress) {
        progress.style.animation = 'loadProgress 3s linear forwards';
    }

    // Hide loader after animations
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 3000);
});

// Add these CSS animations if they're not already in your CSS
if (!document.querySelector('#loader-animations')) {
    const style = document.createElement('style');
    style.id = 'loader-animations';
    style.textContent = `
        @keyframes rotatePyramid {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }

        @keyframes rotateCircle {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
        }

        @keyframes loadProgress {
            0% { width: 0; }
            100% { width: 100%; }
        }

        .fade-out {
            opacity: 0 !important;
            transition: opacity 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}