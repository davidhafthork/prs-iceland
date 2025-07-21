/* Header Scroll Effect Module */

export function initHeader() {
    const header = document.getElementById('header-outer');
    
    if (!header) {
        console.error('Header element not found');
        return { destroy() {} };
    }
    
    function updateHeaderOnScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const threshold = 50;
        
        if (scrollY > threshold) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('transparent');
        }
    }
    
    // Set initial state
    header.classList.add('transparent');
    updateHeaderOnScroll();
    
    // Throttled scroll handler for performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', updateHeaderOnScroll);
    
    // Return cleanup function
    return {
        destroy() {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('load', updateHeaderOnScroll);
        }
    };
}