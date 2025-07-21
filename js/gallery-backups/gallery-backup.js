/* Gallery Carousel Module - Fixed Version */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Initializing...');
    
    const carousel = document.querySelector('.gallery-carousel');
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const cells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!carousel || !viewport || !slider || cells.length === 0) {
        console.error('Gallery carousel: Missing required elements', {
            carousel: !!carousel,
            viewport: !!viewport,
            slider: !!slider,
            cells: cells.length
        });
        return { destroy() {} };
    }
    
    console.log('Gallery carousel: Found all elements, cells:', cells.length);
    
    let selectedIndex = 1; // Start with second image
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;
    let cellWidths = [];
    let cellPositions = [];
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let initialized = false;
    
    // Autoplay variables
    let autoplayInterval;
    const autoplayDelay = 4000; // 4 seconds between slides
    let isAutoplayPaused = false;
    
    // Calculate cell dimensions and positions
    function updateCellDimensions() {
        console.log('Gallery carousel: Updating cell dimensions');
        cellWidths = [];
        cellPositions = [0];
        let totalWidth = 0;
        
        cells.forEach((cell, index) => {
            const img = cell.querySelector('img');
            if (!img) {
                console.error('Gallery carousel: No image in cell', index);
                return;
            }
            
            // Get dimensions from attributes first, then natural dimensions
            let width = parseInt(img.getAttribute('width')) || img.naturalWidth || 600;
            let height = parseInt(img.getAttribute('height')) || img.naturalHeight || 600;
            
            // If dimensions are still 0, use defaults
            if (width === 0 || height === 0) {
                width = 600;
                height = 400;
                console.warn('Gallery carousel: Using default dimensions for image', index);
            }
            
            const aspectRatio = width / height;
            const cellWidth = viewport.offsetHeight * aspectRatio;
            cell.style.width = cellWidth + 'px';
            cellWidths.push(cellWidth);
            
            if (index > 0) {
                totalWidth += cellWidths[index - 1] + 10; // 10px gap
                cellPositions.push(totalWidth);
            }
        });
        
        console.log('Gallery carousel: Cell widths calculated', cellWidths);
        initialized = true;
    }
    
    // Select a cell
    function selectCell(index, animate = true) {
        if (!initialized || cellWidths.length === 0) {
            console.warn('Gallery carousel: Not initialized yet');
            return;
        }
        
        selectedIndex = Math.max(0, Math.min(index, cells.length - 1));
        
        // Update selected class
        cells.forEach((cell, i) => {
            cell.classList.toggle('is-selected', i === selectedIndex);
        });
        
        // Calculate centering offset
        const viewportWidth = viewport.offsetWidth;
        const cellWidth = cellWidths[selectedIndex];
        const cellPosition = cellPositions[selectedIndex];
        const centerOffset = (viewportWidth - cellWidth) / 2;
        
        // Update transform to center the selected cell
        const targetX = -cellPosition + centerOffset;
        slider.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        slider.style.transform = `translateX(${targetX}px)`;
        
        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${100 / cells.length}%`;
            progressBar.style.transform = `translateX(${selectedIndex * 100}%)`;
        }
    }
    
    // Autoplay functions
    function startAutoplay() {
        if (!isAutoplayPaused && initialized) {
            stopAutoplay(); // Clear any existing interval
            
            // Add visual indicator
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.classList.add('autoplay-active');
            }
            
            autoplayInterval = setInterval(() => {
                if (!isDragging && !isAutoplayPaused) {
                    // Move to next slide, loop back to start if at end
                    const nextIndex = (selectedIndex + 1) % cells.length;
                    selectCell(nextIndex);
                }
            }, autoplayDelay);
        }
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            
            // Remove visual indicator
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.classList.remove('autoplay-active');
            }
        }
    }
    
    function pauseAutoplay() {
        isAutoplayPaused = true;
        stopAutoplay();
    }
    
    function resumeAutoplay() {
        isAutoplayPaused = false;
        // Resume after a delay to give user time to interact
        setTimeout(() => {
            if (!isAutoplayPaused) {
                startAutoplay();
            }
        }, 2000); // 2 second delay before resuming
    }
    
    function preventContextMenu(e) {
        e.preventDefault();
    }
    
    // Drag functionality
    function startDrag(e) {
        if (!initialized) return;
        
        e.preventDefault(); // Prevent default drag behavior
        
        pauseAutoplay(); // Pause autoplay when user interacts
        
        isDragging = true;
        viewport.classList.add('dragging');
        slider.classList.add('dragging');
        
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        lastX = startX;
        lastTime = Date.now();
        velocity = 0;
        
        // Get current transform value
        const transform = window.getComputedStyle(slider).transform;
        const matrix = new DOMMatrix(transform);
        dragOffset = matrix.m41; // Current X translation
        
        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        // Prevent context menu on long press
        e.target.addEventListener('contextmenu', preventContextMenu);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        
        // Calculate velocity for momentum
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;
        if (timeDiff > 0) {
            velocity = (currentX - lastX) / timeDiff;
        }
        lastX = currentX;
        lastTime = currentTime;
        
        slider.style.transform = `translateX(${dragOffset + diff}px)`;
    }
    
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        viewport.classList.remove('dragging');
        slider.classList.remove('dragging');
        
        // Restore text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        // Calculate which cell to snap to based on position and velocity
        const diff = currentX - startX;
        const threshold = 50; // Lower threshold for better responsiveness
        const velocityThreshold = 0.3;
        
        if (Math.abs(velocity) > velocityThreshold) {
            // Use velocity to determine direction
            if (velocity > 0 && selectedIndex > 0) {
                selectCell(selectedIndex - 1);
            } else if (velocity < 0 && selectedIndex < cells.length - 1) {
                selectCell(selectedIndex + 1);
            } else {
                selectCell(selectedIndex);
            }
        } else if (Math.abs(diff) > threshold) {
            // Fall back to distance-based selection
            if (diff > 0 && selectedIndex > 0) {
                selectCell(selectedIndex - 1);
            } else if (diff < 0 && selectedIndex < cells.length - 1) {
                selectCell(selectedIndex + 1);
            } else {
                selectCell(selectedIndex);
            }
        } else {
            selectCell(selectedIndex);
        }
        
        // Reset velocity
        velocity = 0;
        
        // Resume autoplay after interaction
        resumeAutoplay();
        
        // Clean up event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        viewport.removeEventListener('contextmenu', preventContextMenu);
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        if (!initialized) return;
        
        if (e.key === 'ArrowLeft' && selectedIndex > 0) {
            pauseAutoplay();
            selectCell(selectedIndex - 1);
            resumeAutoplay();
        } else if (e.key === 'ArrowRight' && selectedIndex < cells.length - 1) {
            pauseAutoplay();
            selectCell(selectedIndex + 1);
            resumeAutoplay();
        }
    }
    
    // Initialize carousel
    function initializeCarousel() {
        console.log('Gallery carousel: Starting initialization');
        updateCellDimensions();
        
        if (cellWidths.length > 0) {
            selectCell(selectedIndex, false);
            startAutoplay();
            console.log('Gallery carousel: Initialization complete');
        } else {
            console.error('Gallery carousel: Failed to calculate cell dimensions');
        }
    }
    
    // Set up event listeners
    viewport.addEventListener('mousedown', startDrag);
    viewport.addEventListener('touchstart', startDrag, { passive: true });
    viewport.addEventListener('mouseenter', pauseAutoplay);
    viewport.addEventListener('mouseleave', () => {
        if (!isDragging) {
            resumeAutoplay();
        }
    });
    document.addEventListener('keydown', handleKeyDown);
    
    // Initialize with a delay to ensure DOM is ready
    setTimeout(() => {
        initializeCarousel();
    }, 100);
    
    // Also initialize on window load as backup
    window.addEventListener('load', () => {
        if (!initialized) {
            initializeCarousel();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCellDimensions();
        if (initialized) {
            selectCell(selectedIndex, false);
        }
    });
    
    // Return cleanup function
    return {
        destroy() {
            console.log('Gallery carousel: Destroying');
            stopAutoplay();
            viewport.removeEventListener('mousedown', startDrag);
            viewport.removeEventListener('touchstart', startDrag);
            viewport.removeEventListener('mouseenter', pauseAutoplay);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateCellDimensions);
        }
    };
}