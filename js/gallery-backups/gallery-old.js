/* Gallery Carousel Module - Simplified Fix */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Initializing (simplified version)...');
    
    const carousel = document.querySelector('.gallery-carousel');
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const cells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!carousel || !viewport || !slider || cells.length === 0) {
        console.error('Gallery carousel: Missing required elements');
        return { destroy() {} };
    }
    
    let selectedIndex = 1;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;
    
    // Set viewport cursor style
    viewport.style.cursor = 'grab';
    
    // Calculate positions for each cell
    function getCellPositions() {
        const positions = [];
        const viewportWidth = viewport.offsetWidth;
        let totalWidth = 0;
        
        cells.forEach((cell, index) => {
            const cellWidth = cell.offsetWidth;
            const centerOffset = (viewportWidth - cellWidth) / 2;
            positions.push({
                index,
                position: -totalWidth + centerOffset,
                width: cellWidth
            });
            totalWidth += cellWidth + 10; // 10px gap
        });
        
        return positions;
    }
    
    // Get the closest cell index based on current position
    function getClosestIndex(positions) {
        let closest = 0;
        let minDistance = Infinity;
        
        positions.forEach((pos, index) => {
            const distance = Math.abs(currentTranslate - pos.position);
            if (distance < minDistance) {
                minDistance = distance;
                closest = index;
            }
        });
        
        return closest;
    }
    
    // Animate to selected cell
    function selectCell(index, animate = true) {
        const positions = getCellPositions();
        if (index < 0 || index >= positions.length) return;
        
        selectedIndex = index;
        const targetTranslate = positions[index].position;
        
        // Update classes
        cells.forEach((cell, i) => {
            cell.classList.toggle('is-selected', i === selectedIndex);
        });
        
        // Update progress bar
        if (progressBar) {
            const percentage = 100 / cells.length;
            progressBar.style.width = `${percentage}%`;
            progressBar.style.transform = `translateX(${selectedIndex * 100}%)`;
        }
        
        // Animate or snap to position
        if (animate) {
            slider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            slider.style.transform = `translateX(${targetTranslate}px)`;
            currentTranslate = targetTranslate;
            prevTranslate = targetTranslate;
        } else {
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${targetTranslate}px)`;
            currentTranslate = targetTranslate;
            prevTranslate = targetTranslate;
        }
    }
    
    // Touch/Mouse event handlers
    function handleStart(e) {
        e.preventDefault();
        isDragging = true;
        viewport.style.cursor = 'grabbing';
        
        // Get start position
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        
        // Stop any transitions
        slider.style.transition = 'none';
        
        // Cancel animation if running
        if (animationID) {
            cancelAnimationFrame(animationID);
        }
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
        
        // Apply transform
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        viewport.style.cursor = 'grab';
        
        // Find closest cell and snap to it
        const positions = getCellPositions();
        const closestIndex = getClosestIndex(positions);
        selectCell(closestIndex, true);
    }
    
    // Keyboard navigation
    function handleKeyboard(e) {
        if (e.key === 'ArrowLeft' && selectedIndex > 0) {
            selectCell(selectedIndex - 1);
        } else if (e.key === 'ArrowRight' && selectedIndex < cells.length - 1) {
            selectCell(selectedIndex + 1);
        }
    }
    
    // Add event listeners
    viewport.addEventListener('mousedown', handleStart);
    viewport.addEventListener('mousemove', handleMove);
    viewport.addEventListener('mouseup', handleEnd);
    viewport.addEventListener('mouseleave', handleEnd);
    
    viewport.addEventListener('touchstart', handleStart, { passive: false });
    viewport.addEventListener('touchmove', handleMove, { passive: false });
    viewport.addEventListener('touchend', handleEnd);
    
    document.addEventListener('keydown', handleKeyboard);
    
    // Initialize
    selectCell(selectedIndex, false);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            selectCell(selectedIndex, false);
        }, 100);
    });
    
    // Autoplay
    let autoplayInterval;
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (!isDragging) {
                const nextIndex = (selectedIndex + 1) % cells.length;
                selectCell(nextIndex);
            }
        }, 4000);
    };
    
    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };
    
    // Start autoplay
    startAutoplay();
    
    // Pause on hover
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', () => {
        if (!isDragging) startAutoplay();
    });
    
    console.log('Gallery carousel: Initialization complete');
    
    // Return cleanup function
    return {
        destroy() {
            stopAutoplay();
            viewport.removeEventListener('mousedown', handleStart);
            viewport.removeEventListener('mousemove', handleMove);
            viewport.removeEventListener('mouseup', handleEnd);
            viewport.removeEventListener('mouseleave', handleEnd);
            viewport.removeEventListener('touchstart', handleStart);
            viewport.removeEventListener('touchmove', handleMove);
            viewport.removeEventListener('touchend', handleEnd);
            viewport.removeEventListener('mouseenter', stopAutoplay);
            document.removeEventListener('keydown', handleKeyboard);
            window.removeEventListener('resize', selectCell);
        }
    };
}