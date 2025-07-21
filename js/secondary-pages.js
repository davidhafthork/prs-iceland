/* Secondary Pages JavaScript Module */

// Set update time
export function initUpdateTime() {
    const updateTimeEl = document.getElementById('updateTime');
    if (!updateTimeEl) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('is-IS', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    updateTimeEl.textContent = `í dag kl. ${timeString}`;
}

// Print function
export function initPrintFunction() {
    window.printSchedule = function() {
        window.print();
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.printSchedule();
        }
    });
}

// Initialize secondary page specific features
export function initSecondaryPage() {
    // Add page-specific class to body
    document.body.classList.add('secondary-page', 'page-load');
    
    // Initialize modules
    initUpdateTime();
    initPrintFunction();
}