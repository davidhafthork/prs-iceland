/* Header Scroll Effect Module - Fixed Version */

export function initHeader() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHeader);
    } else {
        setupHeader();
    }
    
    function setupHeader() {
        const header = document.getElementById('header-outer');
        
        if (!header) {
            console.error('Header element not found!');
            return;
        }
        
        console.log('Header found, initializing scroll effect...');
        
        function updateHeaderOnScroll() {
            const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            console.log('Scroll position:', scrollY);
            
            if (scrollY > 50) {
                if (!header.classList.contains('scrolled')) {
                    console.log('Adding scrolled class');
                    header.classList.add('scrolled');
                    header.classList.remove('transparent');
                }
            } else {
                if (!header.classList.contains('transparent')) {
                    console.log('Adding transparent class');
                    header.classList.remove('scrolled');
                    header.classList.add('transparent');
                }
            }
        }
        
        // Ensure header starts in correct state
        if (window.scrollY <= 50) {
            header.classList.add('transparent');
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        }
        
        // Simple scroll listener without throttling for debugging
        window.addEventListener('scroll', updateHeaderOnScroll);
        
        // Also update on various events to ensure it works
        window.addEventListener('load', updateHeaderOnScroll);
        window.addEventListener('resize', updateHeaderOnScroll);
        
        // Force update after a delay
        setTimeout(updateHeaderOnScroll, 100);
        setTimeout(updateHeaderOnScroll, 500);
        
        return {
            destroy() {
                window.removeEventListener('scroll', updateHeaderOnScroll);
                window.removeEventListener('load', updateHeaderOnScroll);
                window.removeEventListener('resize', updateHeaderOnScroll);
            }
        };
    }
    
    // Return the setup result if immediate, or empty object if deferred
    if (document.readyState !== 'loading') {
        return setupHeader();
    }
    
    return { destroy() {} };
}