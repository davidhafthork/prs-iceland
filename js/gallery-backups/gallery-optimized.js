/* Gallery Carousel Module - Optimized Seamless Infinite Scroll */

export function initGalleryCarousel() {
    console.log('Gallery carousel: Initializing with optimized image loading...');
    
    const viewport = document.querySelector('.gallery-viewport');
    const slider = document.querySelector('.gallery-slider');
    const originalCells = document.querySelectorAll('.gallery-cell');
    const progressBar = document.querySelector('.gallery-progress-bar');
    
    if (!viewport || !slider || originalCells.length === 0) {
        console.error('Gallery carousel: Missing required elements');
        return { destroy() {} };
    }
    
    // Preload all images first
    let imagesLoaded = 0;
    const totalImages = originalCells.length;
    const imagePromises = [];
    
    // Function to preload an image
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                console.log(`Image loaded: ${imagesLoaded}/${totalImages}`);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Collect all image sources
    originalCells.forEach(cell => {
        const img = cell.querySelector('img');
        if (img && img.src) {
            imagePromises.push(preloadImage(img.src));
        }
    });
    
    // Wait for all images to load before setting up carousel
    Promise.all(imagePromises).then(() => {
        console.log('All images preloaded, setting up carousel...');
        setupCarousel();
    }).catch(err => {
        console.warn('Some images failed to load, continuing anyway:', err);
        setupCarousel();
    });
    
    function setupCarousel() {
        // Clone first and last slides for seamless looping
        const firstClone = originalCells[0].cloneNode(true);
        const lastClone = originalCells[originalCells.length - 1].cloneNode(true);
        firstClone.classList.add('clone');
        lastClone.classList.add('clone');
        
        // Add clones to DOM
        slider.insertBefore(lastClone, originalCells[0]);
        slider.appendChild(firstClone);
        
        // Get all cells including clones
        const cells = document.querySelectorAll('.gallery-cell');
        
        // Create cool animated cursor
        const style = document.createElement('style');
        style.textContent = `
            /* Hide default cursors completely */
            .gallery-viewport {
                cursor: none !important;
            }
            
            .gallery-viewport * {
                cursor: none !important;
            }
            
            /* Force hardware acceleration on slider */
            .gallery-slider {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            /* Optimize image rendering */
            .gallery-cell img {
                will-change: auto;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }
            
            /* Cool animated cursor */
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
            
            /* Static ring */
            .gallery-cursor-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid #ff6716;
                border-radius: 50%;
                opacity: 0.8;
                transition: all 0.3s ease;
            }
            
            /* Inner dot */
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
            
            /* Simple clean design - no weird effects */
            
            /* When dragging - just enhance the glow */
            .gallery-viewport.is-dragging .gallery-cursor-ring {
                opacity: 1;
                border-width: 3px;
                box-shadow: 0 0 20px rgba(255, 103, 22, 0.6);
            }
            
            .gallery-viewport.is-dragging .gallery-cursor-dot {
                background: white;
                transform: translate(-50%, -50%) scale(1.5);
            }
            
            /* Pulsing effect on hover */
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
        
        // Create cursor element with cool design
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
        
        // Calculate slide positions including clones
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
        function setSliderPosition(instant = false) {
            if (instant) {
                slider.style.transition = 'none';
                slider.style.transform = `translateX(${currentTranslate}px)`;
                // Force a reflow to ensure the style change is applied
                slider.offsetHeight;
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
        
        // Handle infinite scroll transitions
        function checkInfiniteScroll() {
            if (isTransitioning) return;
            
            if (currentIndex === 0) {
                // We're at the last clone, jump to real last
                isTransitioning = true;
                setTimeout(() => {
                    currentIndex = originalCells.length;
                    currentTranslate = slidePositions[currentIndex];
                    prevTranslate = currentTranslate;
                    setSliderPosition(true);
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 50); // Small delay to prevent immediate re-triggering
                }, 400);
            } else if (currentIndex === cells.length - 1) {
                // We're at the first clone, jump to real first
                isTransitioning = true;
                setTimeout(() => {
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
        
        // Go to slide with seamless infinite scroll
        function goToSlide(index, animate = true) {
            if (isTransitioning) return;
            
            currentIndex = index;
            currentTranslate = slidePositions[currentIndex] || 0;
            prevTranslate = currentTranslate;
            
            // Smooth transition
            setSliderPosition(!animate);
            
            // Update selected class (only for real slides, not clones)
            if (currentIndex > 0 && currentIndex < cells.length - 1) {
                originalCells.forEach((cell, i) => {
                    cell.classList.toggle('is-selected', i === currentIndex - 1);
                });
                
                // Update progress bar
                if (progressBar) {
                    const realIndex = currentIndex - 1;
                    const percent = 100 / originalCells.length;
                    progressBar.style.width = `${percent}%`;
                    progressBar.style.transform = `translateX(${realIndex * 100}%)`;
                }
            }
            
            // Check for infinite scroll
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
        
        // Touch/Mouse start
        function dragStart(event) {
            if (isTransitioning) return;
            event.preventDefault();
            
            isDragging = true;
            startX = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            viewport.classList.add('is-dragging');
            slider.style.transition = 'none';
        }
        
        // Touch/Mouse move
        function dragMove(event) {
            if (!isDragging || isTransitioning) return;
            
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
            
            // Determine swipe direction
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
        
        console.log('Gallery carousel: Setup complete with optimized performance!');
        
        // Return API
        return {
            next: () => goToSlide(currentIndex + 1),
            prev: () => goToSlide(currentIndex - 1),
            goTo: (index) => goToSlide(index + 1), // +1 for clone offset
            getCurrentIndex: () => currentIndex - 1, // -1 for real index
            destroy() {
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
    
    // Return temporary API while images load
    return {
        next: () => {},
        prev: () => {},
        goTo: () => {},
        getCurrentIndex: () => 0,
        destroy: () => {}
    };
}