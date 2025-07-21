/* Gallery Carousel Module - Basic Working Version */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Starting basic initialization...');
    
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const cells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!viewport || !slider || cells.length === 0) {
        console.error('Gallery carousel: Missing elements', {
            viewport: !!viewport,
            slider: !!slider,
            cells: cells.length
        });
        return { destroy() {} };
    }
    
    // Basic state
    let currentIndex = 1;
    let isMouseDown = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Force cursor style directly
    viewport.style.cursor = 'grab';
    viewport.style.userSelect = 'none';
    viewport.style.touchAction = 'pan-y pinch-zoom';
    
    // Calculate cell positions
    function updatePositions() {
        const viewportWidth = viewport.offsetWidth;
        const positions = [];
        let offset = 0;
        
        cells.forEach((cell, i) => {
            const rect = cell.getBoundingClientRect();
            const cellWidth = rect.width || cell.offsetWidth || 400;
            positions.push({
                x: -offset + (viewportWidth - cellWidth) / 2,
                width: cellWidth
            });
            offset += cellWidth + 10; // 10px gap
        });
        
        return positions;
    }
    
    // Move to specific index
    function goToSlide(index) {
        const positions = updatePositions();
        if (!positions[index]) return;
        
        currentIndex = index;
        const targetX = positions[index].x;
        
        // Update transform
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(${targetX}px)`;
        
        // Update progress
        if (progressBar) {
            const percent = 100 / cells.length;
            progressBar.style.width = `${percent}%`;
            progressBar.style.transform = `translateX(${index * 100}%)`;
        }
        
        // Update classes
        cells.forEach((cell, i) => {
            cell.classList.toggle('is-selected', i === index);
        });
        
        currentTranslate = targetX;
        prevTranslate = targetX;
    }
    
    // Mouse events
    function onMouseDown(e) {
        isMouseDown = true;
        startPos = e.clientX;
        viewport.style.cursor = 'grabbing';
        slider.style.transition = 'none';
        
        // Prevent text selection
        e.preventDefault();
    }
    
    function onMouseMove(e) {
        if (!isMouseDown) return;
        
        const currentPosition = e.clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function onMouseUp() {
        if (!isMouseDown) return;
        
        isMouseDown = false;
        viewport.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Determine direction
        if (movedBy < -50 && currentIndex < cells.length - 1) {
            goToSlide(currentIndex + 1);
        } else if (movedBy > 50 && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(currentIndex);
        }
    }
    
    // Touch events
    function onTouchStart(e) {
        isMouseDown = true;
        startPos = e.touches[0].clientX;
        slider.style.transition = 'none';
    }
    
    function onTouchMove(e) {
        if (!isMouseDown) return;
        
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // Attach events
    viewport.addEventListener('mousedown', onMouseDown);
    viewport.addEventListener('mousemove', onMouseMove);
    viewport.addEventListener('mouseup', onMouseUp);
    viewport.addEventListener('mouseleave', onMouseUp);
    
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });
    viewport.addEventListener('touchend', onMouseUp);
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < cells.length - 1) {
            goToSlide(currentIndex + 1);
        }
    });
    
    // Initialize
    goToSlide(currentIndex);
    
    // Window resize
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
    
    console.log('Gallery carousel: Basic initialization complete');
    
    // Simple autoplay
    let autoplayTimer = setInterval(() => {
        if (!isMouseDown) {
            const next = (currentIndex + 1) % cells.length;
            goToSlide(next);
        }
    }, 4000);
    
    // Cleanup
    return {
        destroy() {
            clearInterval(autoplayTimer);
            viewport.removeEventListener('mousedown', onMouseDown);
            viewport.removeEventListener('mousemove', onMouseMove);
            viewport.removeEventListener('mouseup', onMouseUp);
            viewport.removeEventListener('mouseleave', onMouseUp);
            viewport.removeEventListener('touchstart', onTouchStart);
            viewport.removeEventListener('touchmove', onTouchMove);
            viewport.removeEventListener('touchend', onMouseUp);
        }
    };
}