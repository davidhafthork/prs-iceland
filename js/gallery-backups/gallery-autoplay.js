/* Gallery Carousel Module - Complete Rewrite */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Starting complete rewrite initialization...');
    
    // Get elements
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const cells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!viewport || !slider || cells.length === 0) {
        console.error('Gallery carousel: Missing required elements');
        return { destroy() {} };
    }
    
    // Remove any problematic CSS that might interfere
    cells.forEach(cell => {
        const style = cell.style;
        style.pointerEvents = 'auto';
        const beforeElement = window.getComputedStyle(cell, '::before');
        if (beforeElement) {
            // Override ::before if it exists
            const styleSheet = document.createElement('style');
            styleSheet.textContent = '.gallery-cell::before { pointer-events: none !important; z-index: -1 !important; }';
            document.head.appendChild(styleSheet);
        }
    });
    
    // Force cursor styles
    viewport.style.cursor = 'grab';
    viewport.style.userSelect = 'none';
    viewport.style.webkitUserSelect = 'none';
    
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
        
        console.log('Calculated positions:', slidePositions);
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
    
    // Update slide
    function setPositionByIndex() {
        currentTranslate = slidePositions[currentIndex] || 0;
        prevTranslate = currentTranslate;
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
        console.log('Drag start');
        event.preventDefault();
        
        isDragging = true;
        startX = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        viewport.style.cursor = 'grabbing';
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
        console.log('Drag end');
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        viewport.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Update index based on drag distance
        if (movedBy < -100 && currentIndex < cells.length - 1) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }
        
        // Smooth transition to final position
        slider.style.transition = 'transform 0.3s ease-out';
        setPositionByIndex();
    }
    
    // Keyboard navigation
    function handleKeyboard(event) {
        if (event.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex -= 1;
            slider.style.transition = 'transform 0.3s ease-out';
            setPositionByIndex();
        } else if (event.key === 'ArrowRight' && currentIndex < cells.length - 1) {
            currentIndex += 1;
            slider.style.transition = 'transform 0.3s ease-out';
            setPositionByIndex();
        }
    }
    
    // Next/Previous functions for external use
    function next() {
        if (currentIndex < cells.length - 1) {
            currentIndex += 1;
            slider.style.transition = 'transform 0.3s ease-out';
            setPositionByIndex();
        }
    }
    
    function prev() {
        if (currentIndex > 0) {
            currentIndex -= 1;
            slider.style.transition = 'transform 0.3s ease-out';
            setPositionByIndex();
        }
    }
    
    // Initialize
    calculatePositions();
    setPositionByIndex();
    
    // Event listeners - both mouse and touch
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
        setPositionByIndex();
    });
    
    // Auto-play
    let autoplayInterval = setInterval(() => {
        if (!isDragging) {
            if (currentIndex === cells.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex += 1;
            }
            slider.style.transition = 'transform 0.5s ease-out';
            setPositionByIndex();
        }
    }, 4000);
    
    console.log('Gallery carousel: Initialization complete!');
    
    // Return API
    return {
        next,
        prev,
        destroy() {
            clearInterval(autoplayInterval);
            viewport.removeEventListener('mousedown', dragStart);
            viewport.removeEventListener('mousemove', dragMove);
            viewport.removeEventListener('mouseup', dragEnd);
            viewport.removeEventListener('mouseleave', dragEnd);
            viewport.removeEventListener('touchstart', dragStart);
            viewport.removeEventListener('touchmove', dragMove);
            viewport.removeEventListener('touchend', dragEnd);
            document.removeEventListener('keydown', handleKeyboard);
        }
    };
}