/* Gallery Carousel Module - With Infinite Scroll & Custom Cursor */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Starting initialization with infinite scroll...');
    
    // Get elements
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const cells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!viewport || !slider || cells.length === 0) {
        console.error('Gallery carousel: Missing required elements');
        return { destroy() {} };
    }
    
    // Create custom cursor styles
    const style = document.createElement('style');
    style.textContent = `
        .gallery-cell::before { pointer-events: none !important; }
        
        /* Flickity-style cursor */
        .gallery-viewport {
            cursor: move !important;
            cursor: -webkit-grab !important;
            cursor: grab !important;
        }
        
        .gallery-viewport.is-dragging {
            cursor: -webkit-grabbing !important;
            cursor: grabbing !important;
        }
        
        /* Custom cursor crosshair */
        .gallery-cursor {
            position: fixed;
            width: 50px;
            height: 50px;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.2s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        }
        
        .gallery-cursor.active {
            opacity: 1;
        }
        
        .gallery-cursor::before,
        .gallery-cursor::after {
            content: '';
            position: absolute;
            background: white;
        }
        
        .gallery-cursor::before {
            width: 50px;
            height: 1px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .gallery-cursor::after {
            width: 1px;
            height: 50px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .gallery-viewport.is-dragging .gallery-cursor::before,
        .gallery-viewport.is-dragging .gallery-cursor::after {
            background: rgba(255, 103, 22, 0.8);
            width: 30px;
            height: 30px;
        }
        
        .gallery-viewport.is-dragging .gallery-cursor::before {
            height: 2px;
        }
        
        .gallery-viewport.is-dragging .gallery-cursor::after {
            width: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'gallery-cursor';
    document.body.appendChild(cursor);
    
    // Cursor tracking
    let cursorVisible = false;
    viewport.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        if (!cursorVisible) {
            cursor.classList.add('active');
            cursorVisible = true;
        }
    });
    
    viewport.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorVisible = true;
    });
    
    viewport.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorVisible = false;
    });
    
    // State
    let currentIndex = 1;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let slidePositions = [];
    
    // Calculate slide positions
    function calculatePositions() {
        slidePositions = [];
        const viewportWidth = viewport.offsetWidth;
        let totalWidth = 0;
        
        cells.forEach((cell, index) => {
            const cellWidth = cell.offsetWidth;
            const centerOffset = (viewportWidth - cellWidth) / 2;
            slidePositions.push(-totalWidth + centerOffset);
            totalWidth += cellWidth + 10; // 10px gap
        });
    }
    
    // Set slider position
    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // Animation
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    // Go to slide with infinite scroll
    function goToSlide(index, animate = true) {
        // Wrap around for infinite scroll
        if (index < 0) {
            currentIndex = cells.length - 1;
        } else if (index >= cells.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        currentTranslate = slidePositions[currentIndex] || 0;
        prevTranslate = currentTranslate;
        
        // Smooth transition
        slider.style.transition = animate ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        setSliderPosition();
        
        // Update selected class
        cells.forEach((cell, i) => {
            cell.classList.toggle('is-selected', i === currentIndex);
        });
        
        // Update progress bar
        if (progressBar) {
            const percent = 100 / cells.length;
            progressBar.style.width = `${percent}%`;
            progressBar.style.transform = `translateX(${currentIndex * 100}%)`;
        }
    }
    
    // Get position from event
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    // Touch/Mouse start
    function dragStart(event) {
        event.preventDefault();
        
        isDragging = true;
        startX = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        viewport.classList.add('is-dragging');
        slider.style.transition = 'none';
    }
    
    // Touch/Mouse move
    function dragMove(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startX;
    }
    
    // Touch/Mouse end
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        viewport.classList.remove('is-dragging');
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Determine swipe direction and go to next/prev with wrap
        if (movedBy < -100) {
            goToSlide(currentIndex + 1);
        } else if (movedBy > 100) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(currentIndex);
        }
    }
    
    // Keyboard navigation
    function handleKeyboard(event) {
        if (event.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    }
    
    // Initialize
    calculatePositions();
    goToSlide(currentIndex, false);
    
    // Event listeners
    viewport.addEventListener('mousedown', dragStart);
    viewport.addEventListener('mousemove', dragMove);
    viewport.addEventListener('mouseup', dragEnd);
    viewport.addEventListener('mouseleave', dragEnd);
    
    viewport.addEventListener('touchstart', dragStart, { passive: false });
    viewport.addEventListener('touchmove', dragMove, { passive: false });
    viewport.addEventListener('touchend', dragEnd);
    
    document.addEventListener('keydown', handleKeyboard);
    
    // Window resize
    window.addEventListener('resize', () => {
        calculatePositions();
        goToSlide(currentIndex, false);
    });
    
    console.log('Gallery carousel: Initialization complete with infinite scroll!');
    
    // Return API
    return {
        next: () => goToSlide(currentIndex + 1),
        prev: () => goToSlide(currentIndex - 1),
        goTo: (index) => goToSlide(index),
        getCurrentIndex: () => currentIndex,
        destroy() {
            viewport.removeEventListener('mousedown', dragStart);
            viewport.removeEventListener('mousemove', dragMove);
            viewport.removeEventListener('mouseup', dragEnd);
            viewport.removeEventListener('mouseleave', dragEnd);
            viewport.removeEventListener('touchstart', dragStart);
            viewport.removeEventListener('touchmove', dragMove);
            viewport.removeEventListener('touchend', dragEnd);
            viewport.removeEventListener('mouseenter', () => {});
            viewport.removeEventListener('mouseleave', () => {});
            document.removeEventListener('keydown', handleKeyboard);
            cursor.remove();
        }
    };
}