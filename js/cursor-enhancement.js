/* Enhanced Cursor Visibility for Dark Theme */

export function initCursorEnhancement() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Create cursor follower element
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    cursorFollower.style.cssText = `
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.15s ease-out, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
        backdrop-filter: invert(1);
    `;
    document.body.appendChild(cursorFollower);

    // Create inner dot for better visibility
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;
    cursorFollower.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let isMoving = false;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(updateCursor);
        }

        // Show cursor follower when mouse moves
        cursorFollower.style.opacity = '1';
    });

    // Smooth cursor follower animation
    function updateCursor() {
        const diffX = mouseX - followerX;
        const diffY = mouseY - followerY;
        
        // Easing
        followerX += diffX * 0.2;
        followerY += diffY * 0.2;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        // Continue animation if cursor is still moving
        if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
            requestAnimationFrame(updateCursor);
        } else {
            isMoving = false;
        }
    }

    // Handle hover states
    const interactiveElements = 'a, button, input, textarea, select, [role="button"], [onclick], .clickable';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches(interactiveElements)) {
            cursorFollower.style.width = '32px';
            cursorFollower.style.height = '32px';
            cursorFollower.style.borderColor = 'rgba(59, 130, 246, 0.8)';
            cursorFollower.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.matches(interactiveElements)) {
            cursorFollower.style.width = '24px';
            cursorFollower.style.height = '24px';
            cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            cursorFollower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // Hide cursor follower when mouse leaves window
    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget) {
            cursorFollower.style.opacity = '0';
        }
    });

    // Handle click animation
    document.addEventListener('mousedown', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hide on touch devices
    document.addEventListener('touchstart', () => {
        cursorFollower.style.display = 'none';
    });

    // Return cleanup function
    return {
        destroy() {
            cursorFollower.remove();
        }
    };
}

// Alternative: High contrast cursor for maximum visibility
export function initHighContrastCursor() {
    // Apply high contrast cursor styles
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="white" stroke="black" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="black"/></svg>') 16 16, auto !important;
        }
        
        a, button, input[type="button"], input[type="submit"], [role="button"], [onclick] {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 6 L26 16 L16 26 L16 20 L6 20 L6 12 L16 12 Z" fill="white" stroke="black" stroke-width="2"/></svg>') 16 16, pointer !important;
        }
        
        input[type="text"], textarea {
            cursor: text !important;
        }
    `;
    document.head.appendChild(style);
    
    return {
        destroy() {
            style.remove();
        }
    };
}