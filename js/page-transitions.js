/* Page Transitions Module */

export function initPageTransitions() {
    // Add smooth transition when clicking links
    const links = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
    
    function handleLinkClick(e) {
        // Check if it's an internal link
        if (this.hostname === window.location.hostname) {
            e.preventDefault();
            const href = this.href;
            
            // Fade out
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(-10px)';
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    }
    
    links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
    
    // Return cleanup function
    return {
        destroy() {
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
            });
        }
    };
}