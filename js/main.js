/* Main JavaScript File - Initialize all modules */

// import { initHeader } from './header.js'; // OLD ANIMATED HEADER
import { initHeader } from './header-clean.js'; // NEW CLEAN HEADER
import { initHeroParallax } from './hero.js';
import { initGalleryCarousel } from './gallery.js';
import { initSmoothScrolling } from './smooth-scroll.js';
import { initAnimations } from './animations.js';
import { initPageTransitions } from './page-transitions.js';
import { initEnhancements } from './enhancements.js';
// import { initCursorEnhancement } from './cursor-enhancement.js'; // Removed - custom cursor not working
import './tournament-data.js'; // Tournament data integration

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    const modules = {
        header: initHeader(),
        heroParallax: initHeroParallax(),
        gallery: initGalleryCarousel(),
        smoothScroll: initSmoothScrolling(),
        animations: initAnimations(),
        pageTransitions: initPageTransitions(),
        enhancements: initEnhancements()
        // cursor: initCursorEnhancement() // Removed - using CSS hover effects instead
    };
    
    // Store modules globally for potential debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.prsModules = modules;
    }
});

// Export init function if needed for external use
export function initApp() {
    return {
        header: initHeader(),
        heroParallax: initHeroParallax(),
        gallery: initGalleryCarousel(),
        smoothScroll: initSmoothScrolling(),
        animations: initAnimations(),
        pageTransitions: initPageTransitions()
    };
}