/* Enhanced Interactions Module */

export function initEnhancements() {
    // Simple custom cursor for desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        initSimpleCursor();
    }
    
    // Loading optimizations
    initLoadingSequence();
    
    return {
        cursor: cursor
    };
}

let cursor = null;

function initSimpleCursor() {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Create custom cursor
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 12px;
        height: 12px;
        background: #ff6716;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: transform 0.15s cubic-bezier(0.19, 1, 0.22, 1);
        opacity: 0.8;
    `;
    document.body.appendChild(cursor);
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.8';
    });
    
    // Scale on hover
    const hoverElements = 'a, button, .cta-button';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursor.style.background = '#ff6716';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverElements)) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
}

function initLoadingSequence() {
    // Add loaded class for animations
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Preload hero image
    const heroImage = document.querySelector('.hero-bg');
    if (heroImage) {
        const bgImage = window.getComputedStyle(heroImage).backgroundImage;
        const imageUrl = bgImage.match(/url\(["']?([^"']*)["']?\)/)?.[1];
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
        }
    }
}