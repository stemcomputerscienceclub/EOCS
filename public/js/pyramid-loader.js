// Pyramid Loader Animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress animation
    function initProgress() {
        const progress = document.querySelector('.progress');
        if (progress) {
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.width = '100%';
            }, 100);
        }
    }

    // Initialize rotating circles
    function initRotatingCircles() {
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            circle.style.animation = `pulseCircle 2s ${index * 0.5}s infinite`;
        });
    }

    // Initialize hieroglyphics
    function initHieroglyphics() {
        const hieroglyphics = document.querySelectorAll('.hieroglyphic');
        hieroglyphics.forEach((hieroglyphic, index) => {
            hieroglyphic.style.animation = `glowHieroglyphic 2s ${index * 0.3}s infinite`;
        });
    }

    // Initialize pyramid animation
    function initPyramid() {
        const pyramid = document.querySelector('.pyramid');
        if (pyramid) {
            pyramid.style.animation = 'rotatePyramid 4s infinite linear';
        }
    }

    // Update loading text
    function updateLoadingText() {
        const loadingText = document.querySelector('.loading-text');
        const texts = ['Loading Resources', 'Preparing Environment', 'Almost Ready'];
        let currentIndex = 0;

        if (loadingText) {
            setInterval(() => {
                loadingText.textContent = texts[currentIndex];
                currentIndex = (currentIndex + 1) % texts.length;
            }, 1000);
        }
    }

    // Initialize all animations
    function initializeLoader() {
        initProgress();
        initRotatingCircles();
        initHieroglyphics();
        initPyramid();
        updateLoadingText();
    }

    // Show loader with animations
    function showLoader() {
        const loader = document.querySelector('.loader-container');
        if (loader) {
            loader.style.display = 'flex';
            loader.classList.remove('fade-out');
            initializeLoader();
        }
    }

    // Hide loader with fade effect
    function hideLoader() {
        const loader = document.querySelector('.loader-container');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }

    // Handle page load
    window.addEventListener('load', function() {
        // Show loader immediately on DOMContentLoaded
        showLoader();

        // Hide loader after resources are loaded
        setTimeout(() => {
            hideLoader();
        }, 3000); // Adjust time as needed
    });

    // Handle navigation transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                showLoader();
                setTimeout(() => {
                    window.location.href = this.href;
                }, 500);
            }
        });
    });

    // Initialize loader on page load
    initializeLoader();
});