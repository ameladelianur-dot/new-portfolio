// fixes.js - Direct image size fix
document.addEventListener('DOMContentLoaded', function() {
    // Force dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    
    // Fix oversized logos in case studies
    const fixImages = function() {
        // Target case study images specifically
        const caseStudyImages = document.querySelectorAll('.case-study-image img, #case-studies img');
        
        caseStudyImages.forEach(img => {
            // Force size constraints
            img.style.maxWidth = '100%';
            img.style.maxHeight = '120px'; // Very strict height limit
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.margin = '0 auto';
            img.style.display = 'block';
            
            // Fix parent container
            const imageContainer = img.closest('.case-study-image');
            if (imageContainer) {
                imageContainer.style.height = '150px';
                imageContainer.style.display = 'flex';
                imageContainer.style.alignItems = 'center';
                imageContainer.style.justifyContent = 'center';
                imageContainer.style.overflow = 'hidden';
                imageContainer.style.backgroundColor = '#1a1a1a';
            }
        });
    };
    
    // Run immediately
    fixImages();
    
    // Run again after a short delay to ensure images are loaded
    setTimeout(fixImages, 500);
});