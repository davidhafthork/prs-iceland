/* Gallery Carousel Module - Progressive Loading with Memory Management */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Initializing with progressive loading...');
    
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const originalCells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!viewport || !slider || originalCells.length === 0) {
        console.error('Gallery carousel: Missing required elements');
        return { destroy() {} };
    }
    
    // Progressive loading configuration
    const PRELOAD_RADIUS = 1; // Load 1 image ahead/behind
    const CACHE_RADIUS = 2; // Keep 2 images cached ahead/behind
    const imageCache = new Map();
    const loadingImages = new Set();
    
    // Create low-quality placeholders for all images
    function createPlaceholder(img) {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        
        // Create a blurred placeholder
        ctx.filter = 'blur(5px)';
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, 20, 20);
        
        return canvas.toDataURL();
    }
    
    // Apply placeholder to all images initially
    originalCells.forEach(cell => {
        const img = cell.querySelector('img');
        if (img) {
            img.dataset.src = img.src; // Store original src
            img.dataset.placeholder = createPlaceholder(img);
            img.src = img.dataset.placeholder; // Start with placeholder
            img.style.filter = 'blur(10px)';
            img.style.transform = 'scale(1.1)'; // Slightly scale to hide blur edges
        }
    });
    
    // Smart image loader with cancellation support
    function loadImage(src, priority = false) {
        if (imageCache.has(src)) {
            return Promise.resolve(imageCache.get(src));
        }
        
        if (loadingImages.has(src)) {
            // Already loading, return existing promise
            return imageCache.get(src + '_promise');
        }
        
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            // Set loading priority
            if (priority) {
                img.loading = 'eager';
                img.fetchpriority = 'high';
            } else {
                img.loading = 'lazy';
                img.fetchpriority = 'low';
            }
            
            const cleanup = () => {
                loadingImages.delete(src);
                imageCache.delete(src + '_promise');
            };
            
            img.onload = () => {
                imageCache.set(src, img);
                cleanup();
                console.log(`Loaded: ${src} (Cache size: ${imageCache.size})`);
                resolve(img);
            };
            
            img.onerror = () => {
                cleanup();
                console.error(`Failed to load: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            
            loadingImages.add(src);
            img.src = src;
        });
        
        imageCache.set(src + '_promise', loadPromise);
        return loadPromise;
    }
    
    // Apply loaded image with smooth transition
    function applyLoadedImage(imgElement, loadedImg) {
        return new Promise(resolve => {
            // Create a smooth transition
            imgElement.style.transition = 'filter 0.4s ease, transform 0.4s ease';
            
            // Wait for next frame to ensure transition is set
            requestAnimationFrame(() => {
                imgElement.src = loadedImg.src;
                imgElement.style.filter = 'blur(0px)';
                imgElement.style.transform = 'scale(1)';
                
                // Clean up after transition
                setTimeout(() => {
                    imgElement.style.transition = '';
                    resolve();
                }, 400);
            });
        });
    }
    
    // Memory cleanup - unload distant images
    function cleanupMemory(currentIndex) {
        const imagesToKeep = new Set();
        
        // Determine which images to keep
        for (let i = -CACHE_RADIUS; i <= CACHE_RADIUS; i++) {
            const index = currentIndex + i;
            if (index >= 0 && index < originalCells.length) {
                const img = originalCells[index].querySelector('img');
                if (img && img.dataset.src) {
                    imagesToKeep.add(img.dataset.src);
                }
            }
        }
        
        // Also keep clone images if near edges
        if (currentIndex <= CACHE_RADIUS || currentIndex >= originalCells.length - CACHE_RADIUS - 1) {
            // Keep first and last image for clones
            const firstImg = originalCells[0].querySelector('img');
            const lastImg = originalCells[originalCells.length - 1].querySelector('img');
            if (firstImg) imagesToKeep.add(firstImg.dataset.src);
            if (lastImg) imagesToKeep.add(lastImg.dataset.src);
        }
        
        // Clean up images not in keep set
        let cleaned = 0;
        imageCache.forEach((value, key) => {
            if (!key.endsWith('_promise') && !imagesToKeep.has(key)) {
                imageCache.delete(key);
                cleaned++;
                
                // Find and reset the image element
                originalCells.forEach(cell => {
                    const img = cell.querySelector('img');
                    if (img && img.dataset.src === key && img.src !== img.dataset.placeholder) {
                        img.src = img.dataset.placeholder;
                        img.style.filter = 'blur(10px)';
                        img.style.transform = 'scale(1.1)';
                    }
                });
            }
        });
        
        if (cleaned > 0) {
            console.log(`Cleaned up ${cleaned} images. Cache size: ${imageCache.size}`);
        }
    }
    
    // Progressive loader for current view
    async function loadVisibleImages(centerIndex) {
        const loadPromises = [];
        
        // Priority load: current image
        const currentCell = originalCells[centerIndex];
        if (currentCell) {
            const img = currentCell.querySelector('img');
            if (img && img.dataset.src && img.src !== img.dataset.src) {
                const promise = loadImage(img.dataset.src, true)
                    .then(loadedImg => applyLoadedImage(img, loadedImg))
                    .catch(err => console.error('Failed to load current image:', err));
                loadPromises.push(promise);
            }
        }
        
        // Preload nearby images with lower priority
        for (let i = 1; i <= PRELOAD_RADIUS; i++) {
            for (const offset of [i, -i]) {
                const index = centerIndex + offset;
                if (index >= 0 && index < originalCells.length) {
                    const cell = originalCells[index];
                    const img = cell.querySelector('img');
                    if (img && img.dataset.src && img.src !== img.dataset.src) {
                        const promise = loadImage(img.dataset.src, false)
                            .then(loadedImg => applyLoadedImage(img, loadedImg))
                            .catch(err => console.error(`Failed to preload image at ${index}:`, err));
                        loadPromises.push(promise);
                    }
                }
            }
        }
        
        // Load clones if near edges
        if (centerIndex === 0 || centerIndex === originalCells.length - 1) {
            // Handle edge cases for infinite scroll
            const cloneIndex = centerIndex === 0 ? originalCells.length - 1 : 0;
            const cloneCell = originalCells[cloneIndex];
            if (cloneCell) {
                const img = cloneCell.querySelector('img');
                if (img && img.dataset.src) {
                    loadImage(img.dataset.src, false).catch(() => {});
                }
            }
        }
        
        await Promise.allSettled(loadPromises);
        
        // Clean up memory after loading
        setTimeout(() => cleanupMemory(centerIndex), 1000);
    }
    
    // Setup carousel structure (same as before but without initial loading)
    function setupCarousel() {
        // Clone first and last slides for seamless looping
        const firstClone = originalCells[0].cloneNode(true);
        const lastClone = originalCells[originalCells.length - 1].cloneNode(true);
        firstClone.classList.add('clone');
        lastClone.classList.add('clone');
        
        // Ensure clones start with placeholders
        [firstClone, lastClone].forEach(clone => {
            const img = clone.querySelector('img');
            if (img && img.dataset.placeholder) {
                img.src = img.dataset.placeholder;
                img.style.filter = 'blur(10px)';
                img.style.transform = 'scale(1.1)';
            }
        });
        
        // Add clones to DOM
        slider.insertBefore(lastClone, originalCells[0]);
        slider.appendChild(firstClone);
        
        // Get all cells including clones
        const cells = document.querySelectorAll('.gallery-cell');
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            /* Hide default cursors */
            .gallery-viewport {
                cursor: none !important;
            }
            
            .gallery-viewport * {
                cursor: none !important;
            }
            
            /* Hardware acceleration */
            .gallery-slider {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            /* Optimize image rendering */
            .gallery-cell {
                will-change: auto;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .gallery-cell img {
                will-change: auto;
                transform: translateZ(0);
                backface-visibility: hidden;
                transition: filter 0.4s ease, transform 0.4s ease;
            }
            
            /* Cursor styles */
            .gallery-cursor {
                position: fixed;
                width: 40px;
                height: 40px;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                transform: translate(-50%, -50%);
            }
            
            .gallery-cursor.active {
                opacity: 1;
            }
            
            .gallery-cursor-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid #ff6716;
                border-radius: 50%;
                opacity: 0.8;
                transition: all 0.3s ease;
            }
            
            .gallery-cursor-dot {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #ff6716;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.2s ease;
            }
            
            .gallery-viewport.is-dragging .gallery-cursor-ring {
                opacity: 1;
                border-width: 3px;
                box-shadow: 0 0 20px rgba(255, 103, 22, 0.6);
            }
            
            .gallery-viewport.is-dragging .gallery-cursor-dot {
                background: white;
                transform: translate(-50%, -50%) scale(1.5);
            }
            
            .gallery-cursor-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid #ff6716;
                border-radius: 50%;
                opacity: 0;
                animation: cursorPulse 1.5s ease-out infinite;
            }
            
            @keyframes cursorPulse {
                0% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Create cursor
        const cursor = document.createElement('div');
        cursor.className = 'gallery-cursor';
        cursor.innerHTML = `
            <div class="gallery-cursor-ring"></div>
            <div class="gallery-cursor-pulse"></div>
            <div class="gallery-cursor-dot"></div>
        `;
        document.body.appendChild(cursor);
        
        // State
        let currentIndex = 1; // Start at 1 because of clone at position 0
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let slidePositions = [];
        let isTransitioning = false;
        
        // Calculate slide positions
        function calculatePositions() {
            slidePositions = [];
            const viewportWidth = viewport.offsetWidth;
            let totalWidth = 0;
            
            cells.forEach((cell, index) => {
                const cellWidth = cell.offsetWidth;
                const centerOffset = (viewportWidth - cellWidth) / 2;
                slidePositions.push(-totalWidth + centerOffset);
                totalWidth += cellWidth + 10;
            });
        }
        
        // Set slider position
        function setSliderPosition(instant = false) {
            if (instant) {
                slider.style.transition = 'none';
                slider.style.transform = `translateX(${currentTranslate}px)`;
                void slider.offsetHeight;
            } else {
                slider.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                slider.style.transform = `translateX(${currentTranslate}px)`;
            }
        }
        
        // Animation loop
        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }
        
        // Handle infinite scroll
        function checkInfiniteScroll() {
            if (isTransitioning) return;
            
            if (currentIndex === 0) {
                isTransitioning = true;
                setTimeout(() => {
                    // Copy clone's loaded state to real slide
                    const cloneImg = cells[0].querySelector('img');
                    const realImg = cells[cells.length - 2].querySelector('img');
                    if (cloneImg && realImg && cloneImg.src !== cloneImg.dataset.placeholder) {
                        realImg.src = cloneImg.src;
                        realImg.style.filter = cloneImg.style.filter;
                        realImg.style.transform = cloneImg.style.transform;
                    }
                    
                    currentIndex = originalCells.length;
                    currentTranslate = slidePositions[currentIndex];
                    prevTranslate = currentTranslate;
                    setSliderPosition(true);
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 50);
                }, 400);
            } else if (currentIndex === cells.length - 1) {
                isTransitioning = true;
                setTimeout(() => {
                    // Copy clone's loaded state to real slide
                    const cloneImg = cells[cells.length - 1].querySelector('img');
                    const realImg = cells[1].querySelector('img');
                    if (cloneImg && realImg && cloneImg.src !== cloneImg.dataset.placeholder) {
                        realImg.src = cloneImg.src;
                        realImg.style.filter = cloneImg.style.filter;
                        realImg.style.transform = cloneImg.style.transform;
                    }
                    
                    currentIndex = 1;
                    currentTranslate = slidePositions[currentIndex];
                    prevTranslate = currentTranslate;
                    setSliderPosition(true);
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 50);
                }, 400);
            }
        }
        
        // Go to slide
        function goToSlide(index, animate = true) {
            if (isTransitioning) return;
            
            currentIndex = index;
            currentTranslate = slidePositions[currentIndex] || 0;
            prevTranslate = currentTranslate;
            
            setSliderPosition(!animate);
            
            // Update selected class and progress
            if (currentIndex > 0 && currentIndex < cells.length - 1) {
                const realIndex = currentIndex - 1;
                originalCells.forEach((cell, i) => {
                    cell.classList.toggle('is-selected', i === realIndex);
                });
                
                if (progressBar) {
                    const percent = 100 / originalCells.length;
                    progressBar.style.width = `${percent}%`;
                    progressBar.style.transform = `translateX(${realIndex * 100}%)`;
                }
                
                // Load images for new position
                loadVisibleImages(realIndex);
            }
            
            checkInfiniteScroll();
        }
        
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
        
        // Get position from event
        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }
        
        // Drag handlers
        function dragStart(event) {
            if (isTransitioning) return;
            event.preventDefault();
            
            isDragging = true;
            startX = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            viewport.classList.add('is-dragging');
            slider.style.transition = 'none';
        }
        
        function dragMove(event) {
            if (!isDragging || isTransitioning) return;
            
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startX;
        }
        
        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            cancelAnimationFrame(animationID);
            viewport.classList.remove('is-dragging');
            
            const movedBy = currentTranslate - prevTranslate;
            
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
            if (isTransitioning) return;
            
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
        
        console.log('Gallery carousel: Ready with progressive loading!');
        
        // Return API
        return {
            next: () => goToSlide(currentIndex + 1),
            prev: () => goToSlide(currentIndex - 1),
            goTo: (index) => goToSlide(index + 1),
            getCurrentIndex: () => currentIndex - 1,
            destroy() {
                // Clean up everything
                imageCache.clear();
                loadingImages.clear();
                viewport.removeEventListener('mousedown', dragStart);
                viewport.removeEventListener('mousemove', dragMove);
                viewport.removeEventListener('mouseup', dragEnd);
                viewport.removeEventListener('mouseleave', dragEnd);
                viewport.removeEventListener('touchstart', dragStart);
                viewport.removeEventListener('touchmove', dragMove);
                viewport.removeEventListener('touchend', dragEnd);
                document.removeEventListener('keydown', handleKeyboard);
                cursor.remove();
                style.remove();
            }
        };
    }
    
    // Start immediately
    setupCarousel();
    
    // Return API
    return {
        next: () => {},
        prev: () => {},
        goTo: () => {},
        getCurrentIndex: () => 0,
        destroy: () => {}
    };
}