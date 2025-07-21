/* Gallery Module - Simple Fix for Blank Images */

export function initGalleryCarousel() {
    // Fix lazy loading that causes blank images
    const fixImages = () => {
        // Force all gallery images to load eagerly
        document.querySelectorAll('.gallery-cell img').forEach(img => {
            if (img.loading === 'lazy') {
                img.loading = 'eager';
                // Force reload
                const src = img.src;
                img.src = '';
                img.src = src;
            }
        });
    };
    
    // Run immediately and after DOM changes
    fixImages();
    
    const observer = new MutationObserver(fixImages);
    const gallery = document.querySelector('.gallery-slider');
    if (gallery) {
        observer.observe(gallery, { childList: true, subtree: true });
    }
    
    // Also fix after transitions
    setTimeout(fixImages, 1000);
    setTimeout(fixImages, 2000);
    
    return { destroy: () => observer.disconnect() };
}