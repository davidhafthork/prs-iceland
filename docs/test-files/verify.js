// Browser Console Verification Script
// Copy and paste this into the browser console on index.html

console.log('🔍 Starting PRS Iceland Header Verification...\n');

// Check 1: Header Element
const header = document.getElementById('header-outer');
if (header) {
    console.log('✅ Header element found');
    console.log('   Classes:', header.className);
    console.log('   Background:', window.getComputedStyle(header).backgroundColor);
} else {
    console.error('❌ Header element NOT found!');
}

// Check 2: Logo Element
const logo = document.getElementById('logo');
if (logo) {
    console.log('✅ Logo element found');
    console.log('   Height:', logo.offsetHeight + 'px');
} else {
    console.error('❌ Logo element NOT found!');
}

// Check 3: CSS Files
const cssFiles = document.querySelectorAll('link[rel="stylesheet"]');
console.log(`✅ CSS files loaded: ${cssFiles.length}`);
cssFiles.forEach((css, i) => {
    console.log(`   ${i + 1}. ${css.href.split('/').pop()}`);
});

// Check 4: About Section
const aboutSection = document.querySelector('.about-section');
const aboutH2 = document.querySelector('.about-content h2');
const aboutP = document.querySelector('.about-content p');

if (aboutSection) {
    console.log('✅ About section found');
    console.log('   Background:', window.getComputedStyle(aboutSection).backgroundColor);
    
    if (aboutH2) {
        console.log('   H2 color:', window.getComputedStyle(aboutH2).color);
    }
    
    if (aboutP) {
        console.log('   P color:', window.getComputedStyle(aboutP).color);
    }
} else {
    console.error('❌ About section NOT found!');
}

// Check 5: Scroll Test
console.log('\n📜 Scroll Test:');
console.log('Current scroll position:', window.scrollY + 'px');
console.log('Header should be:', window.scrollY > 50 ? 'WHITE (scrolled)' : 'TRANSPARENT');

// Check 6: Module Status
if (window.prsModules) {
    console.log('\n✅ JavaScript modules loaded:', Object.keys(window.prsModules));
} else {
    console.warn('⚠️  JavaScript modules not found in window.prsModules');
}

// Check 7: Force scroll test
console.log('\n🧪 Running scroll test...');
const originalScroll = window.scrollY;

// Test scroll down
window.scrollTo(0, 100);
setTimeout(() => {
    console.log('Scrolled to 100px:');
    console.log('  Header classes:', header.className);
    console.log('  Should contain "scrolled":', header.classList.contains('scrolled'));
    
    // Test scroll up
    window.scrollTo(0, 0);
    setTimeout(() => {
        console.log('Scrolled to 0px:');
        console.log('  Header classes:', header.className);
        console.log('  Should contain "transparent":', header.classList.contains('transparent'));
        
        // Restore original scroll
        window.scrollTo(0, originalScroll);
        
        console.log('\n✨ Verification complete!');
    }, 100);
}, 100);

// Fix function
window.fixHeader = function() {
    console.log('🔧 Applying manual fix...');
    
    function updateHeader() {
        const header = document.getElementById('header-outer');
        if (!header) return;
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('transparent');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader();
    
    console.log('✅ Manual fix applied! Try scrolling now.');
};

console.log('\n💡 If header is not working, type: fixHeader()');
