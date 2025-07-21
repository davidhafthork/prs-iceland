/* Smooth Scrolling Module */

export function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    function handleAnchorClick(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
    
    // Return cleanup function
    return {
        destroy() {
            anchors.forEach(anchor => {
                anchor.removeEventListener('click', handleAnchorClick);
            });
        }
    };
}