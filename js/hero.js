/* Hero Parallax Effect Module */

export function initHeroParallax() {
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content > div');
    const hero = document.querySelector('.hero');
    
    if (!heroBg || !heroContent) return;
    
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    
    // Check if device supports touch (rough mobile detection)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 999;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const speed = 0.5; // Parallax speed for scroll
        const yPos = -(scrolled * speed);
        
        // Only apply parallax on larger screens and non-touch devices
        if (!isTouchDevice && !isSmallScreen) {
            // Smooth mouse parallax interpolation
            currentMouseX += (mouseX - currentMouseX) * 0.1;
            currentMouseY += (mouseY - currentMouseY) * 0.1;
            
            // Apply both scroll and mouse parallax
            const transformValue = `translate3d(${currentMouseX * 20}px, ${yPos + (currentMouseY * 20)}px, 0px) scale(1.1)`;
            heroBg.style.transform = transformValue;
            
            // Subtle content parallax based on mouse
            if (heroContent) {
                const contentTransform = `perspective(1000px) rotateY(${currentMouseX * 0.5}deg) rotateX(${-currentMouseY * 0.5}deg)`;
                heroContent.style.transform = contentTransform;
            }
        } else {
            // Simple scroll parallax only for mobile/touch devices
            const transformValue = `translate3d(0px, ${yPos}px, 0px)`;
            heroBg.style.transform = transformValue;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Track mouse movement for parallax
    function handleMouseMove(e) {
        // Only track mouse on larger screens
        if (isTouchDevice || window.innerWidth <= 999) return;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Convert to values between -1 and 1
        mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
        mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
        
        requestTick();
    }
    
    // Update parallax on window resize
    function handleResize() {
        // Reset transforms on resize to prevent issues
        if (window.innerWidth <= 999) {
            heroBg.style.transform = '';
            if (heroContent) {
                heroContent.style.transform = '';
            }
        }
    }
    
    // Add loaded class after animations complete
    function addLoadedClass() {
        setTimeout(() => {
            hero.classList.add('hero-loaded');
        }, 2000);
    }
    
    // Set up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', addLoadedClass);
    
    // Initial parallax update
    requestTick();
    
    // Return cleanup function
    return {
        destroy() {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', requestTick);
            window.removeEventListener('resize', handleResize);
        }
    };
}