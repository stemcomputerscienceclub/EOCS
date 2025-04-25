document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNav.classList.toggle('mobile-menu-active');
            document.body.style.overflow = mainNav.classList.contains('mobile-menu-active') ? 'hidden' : '';
            console.log('Mobile menu clicked', mainNav.classList.contains('mobile-menu-active'));
        });
    }
}); 