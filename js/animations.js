/* Intersection Observer Animations Module */

export function initAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.about-content, .gallery-header, .fade-in-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Return cleanup function
    return {
        destroy() {
            elementsToAnimate.forEach(el => {
                observer.unobserve(el);
            });
            observer.disconnect();
        }
    };
}