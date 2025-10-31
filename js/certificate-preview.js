/**
 * Certificate Preview System
 * 
 * This module provides an interactive certificate preview system with:
 * - Blank space detection and highlighting
 * - Zoom and pan functionality
 * - Template switching
 * - Content validation
 */

class CertificatePreview {
    constructor() {
        this.certificates = [
            'assets/images/Sertifikat /IMG_3940.PNG',
            'assets/images/Sertifikat /IMG_3941.PNG',
            'assets/images/Sertifikat /IMG_3943.PNG',
            'assets/images/Sertifikat /IMG_3947.JPG',
            'assets/images/Sertifikat /IMG_3950.PNG',
            'assets/images/Sertifikat /IMG_3951.PNG'
        ];
        
        this.currentCertIndex = 0;
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.blankAreas = [];
        
        this.init();
    }
    
    init() {
        // Create modal if it doesn't exist
        if (!document.getElementById('certificate-preview-modal')) {
            this.createModal();
        }
        this.attachEventListeners();
        this.loadCertificate(this.currentCertIndex);
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'certificate-preview-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 opacity-0 pointer-events-none transition-opacity duration-300';
        modal.innerHTML = `
            <div class="relative bg-white dark:bg-dark-secondary rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Certificate Preview</h3>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <button id="toggle-blank-spaces" class="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors">
                                <i class="fas fa-eye"></i> Blank Spaces
                            </button>
                            <button id="toggle-debug-info" class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                <i class="fas fa-bug"></i> Debug Info
                            </button>
                            <button id="prev-certificate" class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <span id="certificate-counter" class="text-sm text-gray-600 dark:text-gray-300">1/6</span>
                            <button id="next-certificate" class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <button id="close-preview" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="relative flex-1 overflow-hidden bg-gray-100 dark:bg-dark-tertiary">
                    <div id="certificate-container" class="absolute inset-0 flex items-center justify-center">
                        <div id="certificate-wrapper" class="relative cursor-move transition-transform duration-100">
                            <img id="certificate-image" class="max-w-full max-h-full" src="" alt="Certificate Preview">
                            <div id="blank-spaces-overlay" class="absolute inset-0 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Debug Panel -->
                <div id="debug-panel" class="hidden p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Detection Stats</h4>
                            <div id="debug-stats" class="space-y-1 text-gray-600 dark:text-gray-300">
                                <div>Blank Areas: <span id="blank-count">0</span></div>
                                <div>Total Coverage: <span id="blank-coverage">0%</span></div>
                                <div>Image Size: <span id="image-dimensions">0×0</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Algorithm Parameters</h4>
                            <div id="debug-params" class="space-y-1 text-gray-600 dark:text-gray-300">
                                <div>Grid Size: <span id="grid-size">25×25</span></div>
                                <div>Edge Threshold: <span id="edge-threshold">30</span></div>
                                <div>Min Area Size: <span id="min-area">2%</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button id="zoom-out" class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <i class="fas fa-search-minus"></i>
                            </button>
                            <input type="range" id="zoom-slider" min="50" max="200" value="100" class="w-32">
                            <button id="zoom-in" class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button id="reset-view" class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button id="toggle-debug-info" class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                <i class="fas fa-bug"></i>
                            </button>
                        </div>
                        <div>
                            <span id="validation-status" class="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-sm">
                                <i class="fas fa-check-circle"></i> Layout Valid
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    attachEventListeners() {
        // Modal controls
        document.getElementById('close-preview').addEventListener('click', () => this.closeModal());
        document.getElementById('prev-certificate').addEventListener('click', () => this.prevCertificate());
        document.getElementById('next-certificate').addEventListener('click', () => this.nextCertificate());
        document.getElementById('toggle-blank-spaces').addEventListener('click', () => this.toggleBlankSpaces());
        

        
        // Zoom controls
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const zoomSlider = document.getElementById('zoom-slider');
        const resetView = document.getElementById('reset-view');
        
        if (zoomIn) zoomIn.addEventListener('click', () => this.zoomIn());
        if (zoomOut) zoomOut.addEventListener('click', () => this.zoomOut());
        if (zoomSlider) zoomSlider.addEventListener('input', (e) => this.setZoom(parseInt(e.target.value) / 100));
        if (resetView) resetView.addEventListener('click', () => this.resetView());
        
        // Pan controls
        const certificateWrapper = document.getElementById('certificate-wrapper');
        certificateWrapper.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch events for mobile
        certificateWrapper.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
        document.addEventListener('touchend', () => this.endDrag());
        
        // Attach click events to certificate thumbnails
        document.querySelectorAll('.certificate-thumbnail').forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.openPreview(index));
        });
    }
    
    openPreview(index = 0) {
        this.currentCertIndex = index;
        this.loadCertificate(index);
        const modal = document.getElementById('certificate-preview-modal');
        const modalContent = modal.querySelector('.relative');
        
        // Reset modal content transform
        modalContent.style.transform = 'scale(0.9) translateY(20px)';
        modalContent.style.opacity = '0';
        
        // Show modal
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
        
        // Animate modal content
        requestAnimationFrame(() => {
            modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            modalContent.style.transform = 'scale(1) translateY(0)';
            modalContent.style.opacity = '1';
        });
        
        // Reset view
        this.resetView();
    }
    
    closeModal() {
        const modal = document.getElementById('certificate-preview-modal');
        const modalContent = modal.querySelector('.relative');
        
        // Animate modal content out
        modalContent.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.6, 1)';
        modalContent.style.transform = 'scale(0.95) translateY(10px)';
        modalContent.style.opacity = '0';
        
        // Hide modal after animation
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.classList.remove('opacity-100');
            document.body.style.overflow = '';
        }, 250);
    }
    
    loadCertificate(index) {
        const certificateImage = document.getElementById('certificate-image');
        const errorMessage = document.createElement('div');
        errorMessage.id = 'certificate-error';
        errorMessage.className = 'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-red-500 text-center p-4';
        errorMessage.style.display = 'none';
        
        // Remove any existing error message
        const existingError = document.getElementById('certificate-error');
        if (existingError) existingError.remove();
        
        // Add error message container
        const container = document.getElementById('certificate-container');
        if (container) container.appendChild(errorMessage);
        
        // Update counter
        document.getElementById('certificate-counter').textContent = `${index + 1}/${this.certificates.length}`;
        
        // Reset view
        this.resetView();
        
        // Set image source
        certificateImage.src = this.certificates[index];
        
        // Handle image load success
        certificateImage.onload = () => {
            if (errorMessage) errorMessage.style.display = 'none';
            this.detectBlankSpaces(certificateImage);
            this.validateLayout();
        };
        
        // Handle image load error
        certificateImage.onerror = () => {
            if (errorMessage) {
                errorMessage.style.display = 'flex';
                errorMessage.innerHTML = `
                    <div>
                        <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                        <p class="text-lg font-semibold">Failed to load certificate image</p>
                        <p class="text-sm mt-2">Please check that the file exists at: ${this.certificates[index]}</p>
                    </div>
                `;
            }
            console.error(`Failed to load certificate image: ${this.certificates[index]}`);
        };
    }
    
    nextCertificate() {
        this.currentCertIndex = (this.currentCertIndex + 1) % this.certificates.length;
        this.loadCertificate(this.currentCertIndex);
    }
    
    prevCertificate() {
        this.currentCertIndex = (this.currentCertIndex - 1 + this.certificates.length) % this.certificates.length;
        this.loadCertificate(this.currentCertIndex);
    }
    
    zoomIn() {
        this.setZoom(this.scale + 0.1);
    }
    
    zoomOut() {
        this.setZoom(Math.max(0.5, this.scale - 0.1));
    }
    
    setZoom(scale) {
        this.scale = Math.min(Math.max(0.5, scale), 2);
        document.getElementById('zoom-slider').value = this.scale * 100;
        this.updateTransform();
    }
    
    resetView() {
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        document.getElementById('zoom-slider').value = 100;
        this.updateTransform();
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.posX;
        this.startY = e.clientY - this.posY;
        document.getElementById('certificate-wrapper').style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.posX = e.clientX - this.startX;
        this.posY = e.clientY - this.startY;
        this.updateTransform();
        
        // Prevent default to avoid text selection during drag
        e.preventDefault();
    }
    
    endDrag() {
        this.isDragging = false;
        document.getElementById('certificate-wrapper').style.cursor = 'move';
    }
    
    updateTransform() {
        const wrapper = document.getElementById('certificate-wrapper');
        wrapper.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
    }
    
    /**
     * Detects blank spaces in the certificate image using canvas analysis
     */
    detectBlankSpaces(imageElement) {
        // Create a canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        
        // Draw image on canvas
        ctx.drawImage(imageElement, 0, 0);
        
        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Reset blank areas
        this.blankAreas = [];
        
        // Perform edge detection to identify content boundaries
        const edges = this.detectEdges(data, canvas.width, canvas.height);
        
        // Grid size for analysis (divides image into sections)
        const gridSize = 25; // Increased for better performance with edge detection
        const cellWidth = Math.floor(canvas.width / gridSize);
        const cellHeight = Math.floor(canvas.height / gridSize);
        
        // Analyze each grid cell
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const startX = x * cellWidth;
                const startY = y * cellHeight;
                const endX = Math.min(startX + cellWidth, canvas.width);
                const endY = Math.min(startY + cellHeight, canvas.height);
                
                // Check if this cell is mostly blank (considering edge information)
                if (this.isCellBlank(data, startX, startY, endX, endY, canvas.width, edges)) {
                    this.blankAreas.push({
                        x: startX,
                        y: startY,
                        width: endX - startX,
                        height: endY - startY
                    });
                }
            }
        }
        
        // Merge adjacent blank areas
        this.blankAreas = this.mergeBlankAreas(this.blankAreas);
        
        // Filter out very small blank areas (noise)
        this.blankAreas = this.blankAreas.filter(area => 
            area.width > canvas.width * 0.02 && area.height > canvas.height * 0.02
        );
        
        // Render blank areas
        this.renderBlankAreas();
        
        // Update debug info if panel is visible
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel && !debugPanel.classList.contains('hidden')) {
            this.updateDebugInfo();
        }
    }
    
    /**
     * Performs edge detection using Sobel operator
     */
    detectEdges(data, width, height) {
        const edges = new Array(width * height).fill(0);
        
        // Sobel kernels
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                // Apply Sobel kernels
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4;
                        const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                        
                        gx += gray * sobelX[ky + 1][kx + 1];
                        gy += gray * sobelY[ky + 1][kx + 1];
                    }
                }
                
                // Calculate edge magnitude
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[y * width + x] = magnitude;
            }
        }
        
        return edges;
    }

    /**
     * Checks if a cell is mostly blank using improved detection algorithm
     */
    isCellBlank(data, startX, startY, endX, endY, width, edges = null) {
        let totalPixels = 0;
        let blankPixels = 0;
        let colorValues = [];
        
        // First pass: collect all pixel data
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                colorValues.push({ r, g, b });
                totalPixels++;
            }
        }
        
        // Calculate average color and variance for adaptive thresholding
        const avgR = colorValues.reduce((sum, c) => sum + c.r, 0) / totalPixels;
        const avgG = colorValues.reduce((sum, c) => sum + c.g, 0) / totalPixels;
        const avgB = colorValues.reduce((sum, c) => sum + c.b, 0) / totalPixels;
        
        // Calculate color variance to detect uniformity
        const variance = colorValues.reduce((sum, c) => {
            return sum + Math.pow(c.r - avgR, 2) + Math.pow(c.g - avgG, 2) + Math.pow(c.b - avgB, 2);
        }, 0) / totalPixels;
        
        // Adaptive threshold based on average brightness
        const avgBrightness = (avgR + avgG + avgB) / 3;
        
        // Calculate edge density in this cell if edge data is available
        let edgeDensity = 0;
        if (edges) {
            let edgeCount = 0;
            for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                    const edgeValue = edges[y * width + x];
                    if (edgeValue > 30) { // Edge threshold
                        edgeCount++;
                    }
                }
            }
            edgeDensity = edgeCount / totalPixels;
        }
        
        // Second pass: count blank pixels with adaptive criteria
        let pixelIndex = 0;
        for (const color of colorValues) {
            const brightness = (color.r + color.g + color.b) / 3;
            const contrast = Math.max(Math.abs(color.r - color.g), Math.abs(color.r - color.b), Math.abs(color.g - color.b));
            
            // Multiple criteria for blank detection
            const isHighBrightness = brightness > 240 && contrast < 15; // Traditional white/light areas
            const isLowVariance = variance < 100 && Math.abs(brightness - avgBrightness) < 20; // Uniform color areas
            const isNearBackground = Math.abs(brightness - avgBrightness) < 10 && contrast < 20; // Similar to background
            
            // Consider pixel blank if it meets any criteria
            if (isHighBrightness || isLowVariance || isNearBackground) {
                blankPixels++;
            }
            pixelIndex++;
        }
        
        // Dynamic threshold based on variance and edge density
        let threshold = variance < 50 ? 0.85 : 0.9;
        
        // If there are many edges, be more conservative about marking as blank
        if (edgeDensity > 0.1) {
            threshold = Math.min(threshold + 0.05, 0.95);
        }
        
        // If very low edge density, be more aggressive about detecting blank areas
        if (edgeDensity < 0.02) {
            threshold = Math.max(threshold - 0.05, 0.8);
        }
        
        return (blankPixels / totalPixels) > threshold;
    }
    
    /**
     * Merges adjacent blank areas to reduce fragmentation
     */
    mergeBlankAreas(areas) {
        if (areas.length <= 1) return areas;
        
        let merged = true;
        
        while (merged) {
            merged = false;
            
            for (let i = 0; i < areas.length; i++) {
                for (let j = i + 1; j < areas.length; j++) {
                    const a = areas[i];
                    const b = areas[j];
                    
                    // Check if areas overlap or are adjacent
                    if (this.areasOverlap(a, b) || this.areasAdjacent(a, b)) {
                        // Merge areas
                        const mergedArea = {
                            x: Math.min(a.x, b.x),
                            y: Math.min(a.y, b.y),
                            width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x),
                            height: Math.max(a.y + a.height, b.y + b.height) - Math.min(a.y, b.y)
                        };
                        
                        // Replace area a with merged area
                        areas[i] = mergedArea;
                        
                        // Remove area b
                        areas.splice(j, 1);
                        
                        merged = true;
                        break;
                    }
                }
                
                if (merged) break;
            }
        }
        
        return areas;
    }
    
    /**
     * Checks if two areas overlap
     */
    areasOverlap(a, b) {
        return !(
            a.x + a.width < b.x ||
            b.x + b.width < a.x ||
            a.y + a.height < b.y ||
            b.y + b.height < a.y
        );
    }
    
    /**
     * Checks if two areas are adjacent (within 5 pixels)
     */
    areasAdjacent(a, b) {
        const threshold = 5;
        
        // Check horizontal adjacency
        const horizontalAdjacent = (
            (Math.abs(a.x - (b.x + b.width)) < threshold) ||
            (Math.abs(b.x - (a.x + a.width)) < threshold)
        ) && (
            (a.y < b.y + b.height && a.y + a.height > b.y)
        );
        
        // Check vertical adjacency
        const verticalAdjacent = (
            (Math.abs(a.y - (b.y + b.height)) < threshold) ||
            (Math.abs(b.y - (a.y + a.height)) < threshold)
        ) && (
            (a.x < b.x + b.width && a.x + a.width > b.x)
        );
        
        return horizontalAdjacent || verticalAdjacent;
    }
    
    /**
     * Renders blank areas on the overlay
     */
    renderBlankAreas() {
        const overlay = document.getElementById('blank-spaces-overlay');
        const img = document.getElementById('certificate-image');
        
        // Clear previous highlights
        overlay.innerHTML = '';
        
        // Get image dimensions
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        
        // Set overlay dimensions to match image
        overlay.style.width = `${imgWidth}px`;
        overlay.style.height = `${imgHeight}px`;
        
        // Add highlights for each blank area
        this.blankAreas.forEach((area, index) => {
            const highlight = document.createElement('div');
            highlight.className = 'absolute border-2 border-yellow-500 bg-yellow-200/30 dark:bg-yellow-500/20 cursor-pointer';
            highlight.style.left = `${area.x}px`;
            highlight.style.top = `${area.y}px`;
            highlight.style.width = `${area.width}px`;
            highlight.style.height = `${area.height}px`;
            
            // Add label with size information
            const label = document.createElement('div');
            label.className = 'absolute top-0 left-0 bg-yellow-500 text-xs text-white px-1 py-0.5 rounded-br';
            const areaSize = Math.round((area.width * area.height) / 1000);
            label.textContent = `${index + 1} (${areaSize}k px)`;
            highlight.appendChild(label);
            
            // Add tooltip with detailed information
            const img = document.getElementById('certificate-image');
            const totalArea = img.naturalWidth * img.naturalHeight;
            const percentage = ((area.width * area.height) / totalArea * 100).toFixed(1);
            
            highlight.title = `Blank Area ${index + 1}\nSize: ${area.width}×${area.height} pixels\nPercentage: ${percentage}% of total image\nPosition: (${area.x}, ${area.y})`;
            
            overlay.appendChild(highlight);
        });
    }
    
    /**
     * Toggles visibility of blank space highlights
     */
    toggleBlankSpaces() {
        const overlay = document.getElementById('blank-spaces-overlay');
        const button = document.getElementById('toggle-blank-spaces');
        
        if (overlay.style.display === 'none') {
            overlay.style.display = 'block';
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Blanks';
            button.classList.remove('bg-purple-500', 'hover:bg-purple-600');
            button.classList.add('bg-purple-700', 'hover:bg-purple-800');
        } else {
            overlay.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Show Blanks';
            button.classList.remove('bg-purple-700', 'hover:bg-purple-800');
            button.classList.add('bg-purple-500', 'hover:bg-purple-600');
        }
    }
    
    /**
     * Toggles visibility of debug panel
     */
    toggleDebugInfo() {
        const debugPanel = document.getElementById('debug-panel');
        const buttons = document.querySelectorAll('#toggle-debug-info');
        
        if (debugPanel.classList.contains('hidden')) {
            debugPanel.classList.remove('hidden');
            buttons.forEach(button => {
                button.innerHTML = '<i class="fas fa-bug"></i> Hide Debug';
                button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                button.classList.add('bg-blue-700', 'hover:bg-blue-800');
            });
            this.updateDebugInfo();
        } else {
            debugPanel.classList.add('hidden');
            buttons.forEach(button => {
                button.innerHTML = '<i class="fas fa-bug"></i> Debug Info';
                button.classList.remove('bg-blue-700', 'hover:bg-blue-800');
                button.classList.add('bg-blue-500', 'hover:bg-blue-600');
            });
        }
    }
    
    /**
     * Updates debug information panel
     */
    updateDebugInfo() {
        const img = document.getElementById('certificate-image');
        
        // Update detection stats
        document.getElementById('blank-count').textContent = this.blankAreas.length;
        
        // Calculate total coverage
        const totalImageArea = img.naturalWidth * img.naturalHeight;
        const totalBlankArea = this.blankAreas.reduce((sum, area) => sum + (area.width * area.height), 0);
        const coverage = ((totalBlankArea / totalImageArea) * 100).toFixed(1);
        document.getElementById('blank-coverage').textContent = `${coverage}%`;
        
        // Update image dimensions
        document.getElementById('image-dimensions').textContent = `${img.naturalWidth}×${img.naturalHeight}`;
        
        // Update algorithm parameters (these could be made configurable)
        document.getElementById('grid-size').textContent = '25×25';
        document.getElementById('edge-threshold').textContent = '30';
        document.getElementById('min-area').textContent = '2%';
    }
    
    /**
     * Validates certificate layout based on blank spaces
     */
    validateLayout() {
        const validationStatus = document.getElementById('validation-status');
        
        // Advanced validation: check if there are large blank areas in important regions
        const img = document.getElementById('certificate-image');
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        
        // Define important regions with names (center and bottom areas where content should be)
        const importantRegions = [
            // Title region
            {
                name: "Title",
                x: imgWidth * 0.2,
                y: imgHeight * 0.2,
                width: imgWidth * 0.6,
                height: imgHeight * 0.15,
                required: true
            },
            // Name/recipient region
            {
                name: "Recipient Name",
                x: imgWidth * 0.25,
                y: imgHeight * 0.4,
                width: imgWidth * 0.5,
                height: imgHeight * 0.1,
                required: true
            },
            // Date region
            {
                name: "Date",
                x: imgWidth * 0.35,
                y: imgHeight * 0.55,
                width: imgWidth * 0.3,
                height: imgHeight * 0.05,
                required: false
            },
            // Signature region
            {
                name: "Signature",
                x: imgWidth * 0.1,
                y: imgHeight * 0.7,
                width: imgWidth * 0.35,
                height: imgHeight * 0.15,
                required: false
            },
            // Logo/seal region
            {
                name: "Logo/Seal",
                x: imgWidth * 0.55,
                y: imgHeight * 0.7,
                width: imgWidth * 0.35,
                height: imgHeight * 0.15,
                required: false
            }
        ];
        
        // Check if any large blank areas overlap with important regions
        let issues = [];
        const largeBlankAreas = this.blankAreas.filter(area => 
            area.width > imgWidth * 0.05 && area.height > imgHeight * 0.05
        );
        
        // Check each important region
        for (const region of importantRegions) {
            let regionHasContent = false;
            let blankAreaOverlaps = [];
            
            // Check if region has any blank areas
            for (const blankArea of largeBlankAreas) {
                if (this.areasOverlap(region, blankArea)) {
                    // Calculate overlap percentage
                    const overlapArea = this.calculateOverlapArea(region, blankArea);
                    const regionArea = region.width * region.height;
                    const overlapPercentage = (overlapArea / regionArea) * 100;
                    
                    if (overlapPercentage > 70) {
                        blankAreaOverlaps.push({
                            area: blankArea,
                            percentage: overlapPercentage
                        });
                    }
                }
            }
            
            // If more than 70% of the region is blank and it's required, add to issues
            if (blankAreaOverlaps.length > 0 && region.required) {
                issues.push({
                    region: region.name,
                    blankAreas: blankAreaOverlaps,
                    severity: 'high'
                });
            } else if (blankAreaOverlaps.length > 0) {
                issues.push({
                    region: region.name,
                    blankAreas: blankAreaOverlaps,
                    severity: 'medium'
                });
            }
        }
        
        // Highlight problematic regions
        this.highlightProblematicRegions(importantRegions, issues);
        
        // Update validation status
        if (issues.length > 0) {
            // Count high severity issues
            const highSeverityCount = issues.filter(issue => issue.severity === 'high').length;
            
            if (highSeverityCount > 0) {
                validationStatus.className = 'px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg text-sm';
                validationStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${highSeverityCount} Critical Layout Issues`;
                
                // Add tooltip with details
                validationStatus.title = `Critical issues in: ${issues.filter(i => i.severity === 'high').map(i => i.region).join(', ')}`;
            } else {
                validationStatus.className = 'px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-lg text-sm';
                validationStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${issues.length} Minor Layout Issues`;
                
                // Add tooltip with details
                validationStatus.title = `Minor issues in: ${issues.map(i => i.region).join(', ')}`;
            }
        } else {
            validationStatus.className = 'px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-sm';
            validationStatus.innerHTML = '<i class="fas fa-check-circle"></i> Layout Valid';
            validationStatus.title = 'All certificate content areas are properly positioned';
        }
    }
    
    /**
     * Calculate the area of overlap between two rectangles
     */
    calculateOverlapArea(a, b) {
        const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
        const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        return xOverlap * yOverlap;
    }
    
    /**
     * Highlight problematic regions on the certificate
     */
    highlightProblematicRegions(regions, issues) {
        const overlay = document.getElementById('blank-spaces-overlay');
        
        // Add region outlines
        regions.forEach(region => {
            const regionElement = document.createElement('div');
            
            // Check if this region has issues
            const regionIssue = issues.find(issue => issue.region === region.name);
            
            if (regionIssue) {
                // Red outline for regions with issues
                regionElement.className = regionIssue.severity === 'high' 
                    ? 'absolute border-2 border-red-500 bg-red-200/10 dark:bg-red-500/10'
                    : 'absolute border-2 border-yellow-500 bg-yellow-200/10 dark:bg-yellow-500/10';
                
                // Add warning icon
                const warningIcon = document.createElement('div');
                warningIcon.className = regionIssue.severity === 'high'
                    ? 'absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs'
                    : 'absolute -top-3 -right-3 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs';
                warningIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
                regionElement.appendChild(warningIcon);
                
                // Add tooltip
                regionElement.title = `${region.name}: ${regionIssue.severity === 'high' ? 'Critical' : 'Minor'} issue - Blank space detected`;
            } else {
                // Green outline for valid regions
                regionElement.className = 'absolute border-2 border-green-500 bg-green-200/10 dark:bg-green-500/10';
                regionElement.title = `${region.name}: Content properly positioned`;
            }
            
            regionElement.style.left = `${region.x}px`;
            regionElement.style.top = `${region.y}px`;
            regionElement.style.width = `${region.width}px`;
            regionElement.style.height = `${region.height}px`;
            
            // Add label
            const label = document.createElement('div');
            label.className = 'absolute -top-6 left-0 text-xs bg-white dark:bg-gray-800 px-1 py-0.5 rounded';
            label.textContent = region.name;
            regionElement.appendChild(label);
            
            overlay.appendChild(regionElement);
        });
    }
}

// Initialize certificate preview when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create certificate preview instance
    window.certificatePreview = new CertificatePreview();
    
    // Add click handlers to certificate preview buttons
    document.querySelectorAll('.view-certificate-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const certificateItem = e.target.closest('.certificate-item');
            const index = parseInt(certificateItem.dataset.index);
            window.certificatePreview.openPreview(index);
        });
    });
    
    // Also add click handlers to certificate thumbnails
    document.querySelectorAll('.certificate-thumbnail').forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
            e.preventDefault();
            const certificateItem = e.target.closest('.certificate-item');
            const index = parseInt(certificateItem.dataset.index);
            window.certificatePreview.openPreview(index);
        });
    });
});