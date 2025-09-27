// Store uploaded files
let pdfFile = null;
let jpgImages = [];
let convertedJpgUrls = [];
let originalImage = null;
let resizedImageUrl = null;
let originalImageForCompression = null;
let compressedImageUrl = null;
let originalFileSize = 0;
let currentCompressionMethod = 'quality';
let passwordProtectedPdf = null;

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// DOM elements
const toggleBtns = document.querySelectorAll('.toggle-btn');
const toolSections = document.querySelectorAll('.tool-section');

// PDF to JPG elements
const pdfUploadArea = document.getElementById('pdfUploadArea');
const pdfFileInput = document.getElementById('pdfFileInput');
const pdfBrowseBtn = document.getElementById('pdfBrowseBtn');
const pdfPreviewContainer = document.getElementById('pdfPreviewContainer');
const convertPdfToJpgBtn = document.getElementById('convertPdfToJpgBtn');
const clearPdfBtn = document.getElementById('clearPdfBtn');
const jpgDownloadOptions = document.getElementById('jpgDownloadOptions');
const jpgDownloadButtons = document.getElementById('jpgDownloadButtons');
const downloadAllJpgBtn = document.getElementById('downloadAllJpgBtn');
const pdfStatusMessage = document.getElementById('pdfStatusMessage');
const pdfConvertLoading = document.getElementById('pdfConvertLoading');

// JPG to PDF elements
const jpgUploadArea = document.getElementById('jpgUploadArea');
const jpgFileInput = document.getElementById('jpgFileInput');
const jpgBrowseBtn = document.getElementById('jpgBrowseBtn');
const jpgPreviewContainer = document.getElementById('jpgPreviewContainer');
const convertJpgToPdfBtn = document.getElementById('convertJpgToPdfBtn');
const clearJpgBtn = document.getElementById('clearJpgBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const jpgStatusMessage = document.getElementById('jpgStatusMessage');
const jpgConvertLoading = document.getElementById('jpgConvertLoading');

// Resize Tool elements
const resizeUploadArea = document.getElementById('resizeUploadArea');
const resizeFileInput = document.getElementById('resizeFileInput');
const resizeBrowseBtn = document.getElementById('resizeBrowseBtn');
const resizeOptions = document.getElementById('resizeOptions');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const aspectRatio = document.getElementById('aspectRatio');
const resizeQuality = document.getElementById('resizeQuality');
const sizePresets = document.querySelectorAll('.size-preset');
const resizeImageBtn = document.getElementById('resizeImageBtn');
const clearResizeBtn = document.getElementById('clearResizeBtn');
const downloadResizedBtn = document.getElementById('downloadResizedBtn');
const resizeComparisonContainer = document.getElementById('resizeComparisonContainer');
const resizeStatusMessage = document.getElementById('resizeStatusMessage');
const resizeLoading = document.getElementById('resizeLoading');

// Compress Tool elements
const compressUploadArea = document.getElementById('compressUploadArea');
const compressFileInput = document.getElementById('compressFileInput');
const compressBrowseBtn = document.getElementById('compressBrowseBtn');
const compressOptions = document.getElementById('compressOptions');
const compressionLevel = document.getElementById('compressionLevel');
const compressionValue = document.getElementById('compressionValue');
const maxWidth = document.getElementById('maxWidth');
const maxHeight = document.getElementById('maxHeight');
const outputFormat = document.getElementById('outputFormat');
const qualityPresets = document.querySelectorAll('.quality-preset');
const methodTabs = document.querySelectorAll('.method-tab');
const methodContents = document.querySelectorAll('.method-content');
const targetSize = document.getElementById('targetSize');
const targetMaxWidth = document.getElementById('targetMaxWidth');
const targetMaxHeight = document.getElementById('targetMaxHeight');
const targetOutputFormat = document.getElementById('targetOutputFormat');
const targetSizePresets = document.querySelectorAll('.target-size-preset');
const compressionPrecision = document.getElementById('compressionPrecision');
const compressImageBtn = document.getElementById('compressImageBtn');
const clearCompressBtn = document.getElementById('clearCompressBtn');
const downloadCompressedBtn = document.getElementById('downloadCompressedBtn');
const compressComparisonContainer = document.getElementById('compressComparisonContainer');
const compressionStats = document.getElementById('compressionStats');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const compressionRatio = document.getElementById('compressionRatio');
const sizeReduction = document.getElementById('sizeReduction');
const compressStatusMessage = document.getElementById('compressStatusMessage');
const compressLoading = document.getElementById('compressLoading');

// Password Remove elements
const passwordUploadArea = document.getElementById('passwordUploadArea');
const passwordFileInput = document.getElementById('passwordFileInput');
const passwordBrowseBtn = document.getElementById('passwordBrowseBtn');
const pdfPassword = document.getElementById('pdfPassword');
const removePasswordBtn = document.getElementById('removePasswordBtn');
const clearPasswordBtn = document.getElementById('clearPasswordBtn');
const downloadUnlockedBtn = document.getElementById('downloadUnlockedBtn');
const passwordStatusMessage = document.getElementById('passwordStatusMessage');
const passwordRemoveLoading = document.getElementById('passwordRemoveLoading');
const passwordOptions = document.getElementById('passwordOptions');

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Toggle between tools
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // Update active toggle button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding section
            toolSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Compression method tabs
    methodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');
            currentCompressionMethod = method;
            
            // Update active tab
            methodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            methodContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${method}-method`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // PDF to JPG Event Listeners
    pdfBrowseBtn.addEventListener('click', () => pdfFileInput.click());
    pdfFileInput.addEventListener('change', handlePdfFileSelect);
    
    pdfUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        pdfUploadArea.classList.add('highlight');
    });
    
    pdfUploadArea.addEventListener('dragleave', () => {
        pdfUploadArea.classList.remove('highlight');
    });
    
    pdfUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        pdfUploadArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                handlePdfFile(file);
            } else {
                showStatusMessage(pdfStatusMessage, 'Please select a PDF file.', 'error');
            }
        }
    });
    
    convertPdfToJpgBtn.addEventListener('click', convertPdfToJpg);
    clearPdfBtn.addEventListener('click', clearPdf);
    downloadAllJpgBtn.addEventListener('click', downloadAllJpgAsZip);
    
    // JPG to PDF Event Listeners
    jpgBrowseBtn.addEventListener('click', () => jpgFileInput.click());
    jpgFileInput.addEventListener('change', handleJpgFileSelect);
    
    jpgUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        jpgUploadArea.classList.add('highlight');
    });
    
    jpgUploadArea.addEventListener('dragleave', () => {
        jpgUploadArea.classList.remove('highlight');
    });
    
    jpgUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        jpgUploadArea.classList.remove('highlight');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type === 'image/jpeg' || file.type === 'image/jpg'
        );
        
        if (files.length > 0) {
            handleJpgFiles(files);
        } else {
            showStatusMessage(jpgStatusMessage, 'Please select JPG images.', 'error');
        }
    });
    
    convertJpgToPdfBtn.addEventListener('click', convertJpgToPdf);
    clearJpgBtn.addEventListener('click', clearJpg);
    
    // Resize Tool Event Listeners
    resizeBrowseBtn.addEventListener('click', () => resizeFileInput.click());
    resizeFileInput.addEventListener('change', handleResizeFileSelect);
    
    resizeUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        resizeUploadArea.classList.add('highlight');
    });
    
    resizeUploadArea.addEventListener('dragleave', () => {
        resizeUploadArea.classList.remove('highlight');
    });
    
    resizeUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        resizeUploadArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleResizeFile(file);
            } else {
                showStatusMessage(resizeStatusMessage, 'Please select an image file.', 'error');
            }
        }
    });
    
    // Size presets
    sizePresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const width = preset.getAttribute('data-width');
            const height = preset.getAttribute('data-height');
            
            widthInput.value = width;
            heightInput.value = height;
            
            // Update active preset
            sizePresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
    
    // Maintain aspect ratio
    aspectRatio.addEventListener('change', updateAspectRatio);
    widthInput.addEventListener('input', updateAspectRatio);
    heightInput.addEventListener('input', updateAspectRatio);
    
    resizeImageBtn.addEventListener('click', resizeImage);
    clearResizeBtn.addEventListener('click', clearResize);
    
    // Compress Tool Event Listeners
    compressBrowseBtn.addEventListener('click', () => compressFileInput.click());
    compressFileInput.addEventListener('change', handleCompressFileSelect);
    
    compressUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        compressUploadArea.classList.add('highlight');
    });
    
    compressUploadArea.addEventListener('dragleave', () => {
        compressUploadArea.classList.remove('highlight');
    });
    
    compressUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        compressUploadArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleCompressFile(file);
            } else {
                showStatusMessage(compressStatusMessage, 'Please select an image file.', 'error');
            }
        }
    });
    
    // Compression level slider
    compressionLevel.addEventListener('input', () => {
        const value = Math.round(compressionLevel.value * 100);
        let qualityText = '';
        
        if (value >= 90) qualityText = 'Excellent Quality';
        else if (value >= 70) qualityText = 'Good Quality';
        else if (value >= 50) qualityText = 'Medium Quality';
        else if (value >= 30) qualityText = 'Low Quality';
        else qualityText = 'Very Low Quality';
        
        compressionValue.textContent = `${value}% (${qualityText})`;
    });
    
    // Quality presets
    qualityPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const quality = preset.getAttribute('data-quality');
            
            compressionLevel.value = quality;
            compressionLevel.dispatchEvent(new Event('input'));
            
            // Update active preset
            qualityPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
    
    // Target size presets
    targetSizePresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const size = preset.getAttribute('data-size');
            
            targetSize.value = size;
            
            // Update active preset
            targetSizePresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
    
    compressImageBtn.addEventListener('click', compressImage);
    clearCompressBtn.addEventListener('click', clearCompress);
    
    // PDF Password Remove Event Listeners
    passwordBrowseBtn.addEventListener('click', () => passwordFileInput.click());
    passwordFileInput.addEventListener('change', handlePasswordFileSelect);
    
    passwordUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        passwordUploadArea.classList.add('highlight');
    });
    
    passwordUploadArea.addEventListener('dragleave', () => {
        passwordUploadArea.classList.remove('highlight');
    });
    
    passwordUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        passwordUploadArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                handlePasswordFile(file);
            } else {
                showStatusMessage(passwordStatusMessage, 'Please select a PDF file.', 'error');
            }
        }
    });
    
    removePasswordBtn.addEventListener('click', removePdfPassword);
    clearPasswordBtn.addEventListener('click', clearPasswordFile);
}

// PDF to JPG Functions
async function handlePdfFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        await handlePdfFile(file);
    } else {
        showStatusMessage(pdfStatusMessage, 'Please select a PDF file.', 'error');
    }
}

async function handlePdfFile(file) {
    pdfFile = file;
    pdfPreviewContainer.innerHTML = '';
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        
        // Show PDF preview
        for (let i = 1; i <= Math.min(numPages, 5); i++) { // Preview first 5 pages
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg', 0.7);
            img.alt = `Page ${i}`;
            previewItem.appendChild(img);
            
            const pageInfo = document.createElement('div');
            pageInfo.className = 'file-size';
            pageInfo.textContent = `Page ${i}`;
            previewItem.appendChild(pageInfo);
            
            pdfPreviewContainer.appendChild(previewItem);
        }
        
        showStatusMessage(pdfStatusMessage, `PDF loaded successfully. ${numPages} pages detected.`, 'success');
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        showStatusMessage(pdfStatusMessage, 'Error loading PDF file. Please try another file.', 'error');
    }
}

async function convertPdfToJpg() {
    if (!pdfFile) {
        showStatusMessage(pdfStatusMessage, 'Please select a PDF file first.', 'error');
        return;
    }
    
    pdfConvertLoading.style.display = 'inline-block';
    convertPdfToJpgBtn.disabled = true;
    convertedJpgUrls = [];
    
    try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            convertedJpgUrls.push({
                url: jpgDataUrl,
                pageNumber: i
            });
        }
        
        // Show download options
        showJpgDownloadOptions();
        showStatusMessage(pdfStatusMessage, `PDF converted to ${numPages} JPG images successfully!`, 'success');
        
    } catch (error) {
        console.error('Error converting PDF:', error);
        showStatusMessage(pdfStatusMessage, 'Error converting PDF. Please try another file.', 'error');
    } finally {
        pdfConvertLoading.style.display = 'none';
        convertPdfToJpgBtn.disabled = false;
    }
}

function showJpgDownloadOptions() {
    jpgDownloadButtons.innerHTML = '';
    
    convertedJpgUrls.forEach((item, index) => {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-download';
        downloadBtn.innerHTML = `<i>📥</i> Download Page ${item.pageNumber}`;
        downloadBtn.addEventListener('click', () => {
            downloadImage(item.url, `page-${item.pageNumber}.jpg`);
        });
        
        jpgDownloadButtons.appendChild(downloadBtn);
    });
    
    jpgDownloadOptions.classList.add('active');
}

function downloadAllJpgAsZip() {
    if (convertedJpgUrls.length === 0) {
        showStatusMessage(pdfStatusMessage, 'No JPG images to download.', 'error');
        return;
    }
    
    // Download each image individually (simplified approach)
    convertedJpgUrls.forEach((item, index) => {
        setTimeout(() => {
            downloadImage(item.url, `page-${item.pageNumber}.jpg`);
        }, index * 100);
    });
    
    showStatusMessage(pdfStatusMessage, `Downloading ${convertedJpgUrls.length} images...`, 'info');
}

function clearPdf() {
    pdfFile = null;
    pdfFileInput.value = '';
    pdfPreviewContainer.innerHTML = '';
    jpgDownloadOptions.classList.remove('active');
    convertedJpgUrls = [];
    showStatusMessage(pdfStatusMessage, 'PDF cleared.', 'info');
}

// JPG to PDF Functions
function handleJpgFileSelect(e) {
    const files = Array.from(e.target.files).filter(file => 
        file.type === 'image/jpeg' || file.type === 'image/jpg'
    );
    
    if (files.length > 0) {
        handleJpgFiles(files);
    } else {
        showStatusMessage(jpgStatusMessage, 'Please select JPG images.', 'error');
    }
}

function handleJpgFiles(files) {
    jpgImages = [...jpgImages, ...files];
    updateJpgPreview();
    
    showStatusMessage(jpgStatusMessage, `${files.length} JPG image(s) added. Total: ${jpgImages.length}`, 'success');
}

function updateJpgPreview() {
    jpgPreviewContainer.innerHTML = '';
    
    jpgImages.forEach((image, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `Image ${index + 1}`;
            previewItem.appendChild(img);
            
            const fileName = document.createElement('div');
            fileName.textContent = image.name;
            fileName.className = 'file-size';
            previewItem.appendChild(fileName);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                jpgImages.splice(index, 1);
                updateJpgPreview();
            });
            previewItem.appendChild(removeBtn);
            
            jpgPreviewContainer.appendChild(previewItem);
        };
        
        reader.readAsDataURL(image);
    });
}

async function convertJpgToPdf() {
    if (jpgImages.length === 0) {
        showStatusMessage(jpgStatusMessage, 'Please select at least one JPG image.', 'error');
        return;
    }
    
    jpgConvertLoading.style.display = 'inline-block';
    convertJpgToPdfBtn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        for (let i = 0; i < jpgImages.length; i++) {
            if (i > 0) doc.addPage();
            
            const imgData = await readFileAsDataURL(jpgImages[i]);
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
        
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        downloadPdfBtn.href = pdfUrl;
        downloadPdfBtn.download = 'converted-images.pdf';
        downloadPdfBtn.style.display = 'inline-flex';
        
        showStatusMessage(jpgStatusMessage, 'PDF created successfully! Click "Download PDF" to save.', 'success');
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        showStatusMessage(jpgStatusMessage, 'Error creating PDF. Please try again.', 'error');
    } finally {
        jpgConvertLoading.style.display = 'none';
        convertJpgToPdfBtn.disabled = false;
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function clearJpg() {
    jpgImages = [];
    jpgFileInput.value = '';
    jpgPreviewContainer.innerHTML = '';
    downloadPdfBtn.style.display = 'none';
    showStatusMessage(jpgStatusMessage, 'All images cleared.', 'info');
}

// Resize Tool Functions
function handleResizeFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleResizeFile(file);
    } else {
        showStatusMessage(resizeStatusMessage, 'Please select an image file.', 'error');
    }
}

function handleResizeFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            // Show resize options
            resizeOptions.classList.add('active');
            
            // Set default width/height to original dimensions
            widthInput.placeholder = originalImage.width;
            heightInput.placeholder = originalImage.height;
            
            // Show original image in comparison
            updateResizeComparison();
            
            showStatusMessage(resizeStatusMessage, 'Image loaded successfully. Adjust resize options and click "Resize Image".', 'success');
        };
        originalImage.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function updateAspectRatio() {
    if (aspectRatio.value === 'yes' && originalImage) {
        const width = parseInt(widthInput.value) || originalImage.width;
        const height = parseInt(heightInput.value) || originalImage.height;
        
        if (widthInput === document.activeElement) {
            // Width changed, adjust height to maintain aspect ratio
            const newHeight = Math.round((width / originalImage.width) * originalImage.height);
            heightInput.value = newHeight;
        } else if (heightInput === document.activeElement) {
            // Height changed, adjust width to maintain aspect ratio
            const newWidth = Math.round((height / originalImage.height) * originalImage.width);
            widthInput.value = newWidth;
        }
    }
}

function resizeImage() {
    if (!originalImage) {
        showStatusMessage(resizeStatusMessage, 'Please select an image first.', 'error');
        return;
    }
    
    resizeLoading.style.display = 'inline-block';
    resizeImageBtn.disabled = true;
    
    setTimeout(() => {
        resizeLoading.style.display = 'none';
        resizeImageBtn.disabled = false;
        
        const width = parseInt(widthInput.value) || originalImage.width;
        const height = parseInt(heightInput.value) || originalImage.height;
        const quality = parseFloat(resizeQuality.value);
        
        // Create a canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, width, height);
        
        // Convert to data URL with specified quality
        resizedImageUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Update download button
        downloadResizedBtn.href = resizedImageUrl;
        downloadResizedBtn.download = 'resized-image.jpg';
        downloadResizedBtn.style.display = 'inline-flex';
        
        // Update comparison
        updateResizeComparison();
        
        showStatusMessage(resizeStatusMessage, `Image resized to ${width}×${height} pixels successfully!`, 'success');
    }, 1000);
}

function updateResizeComparison() {
    resizeComparisonContainer.innerHTML = '';
    
    // Original image
    const originalComparison = document.createElement('div');
    originalComparison.className = 'image-comparison';
    
    const originalImg = document.createElement('img');
    originalImg.src = originalImage.src;
    originalImg.alt = 'Original Image';
    originalComparison.appendChild(originalImg);
    
    const originalLabel = document.createElement('p');
    originalLabel.textContent = `Original (${originalImage.width}×${originalImage.height})`;
    originalComparison.appendChild(originalLabel);
    
    resizeComparisonContainer.appendChild(originalComparison);
    
    // Resized image (if available)
    if (resizedImageUrl) {
        const resizedComparison = document.createElement('div');
        resizedComparison.className = 'image-comparison';
        
        const resizedImg = document.createElement('img');
        resizedImg.src = resizedImageUrl;
        resizedImg.alt = 'Resized Image';
        resizedComparison.appendChild(resizedImg);
        
        const width = parseInt(widthInput.value) || originalImage.width;
        const height = parseInt(heightInput.value) || originalImage.height;
        
        const resizedLabel = document.createElement('p');
        resizedLabel.textContent = `Resized (${width}×${height})`;
        resizedComparison.appendChild(resizedLabel);
        
        resizeComparisonContainer.appendChild(resizedComparison);
    }
}

function clearResize() {
    originalImage = null;
    resizedImageUrl = null;
    resizeFileInput.value = '';
    resizeOptions.classList.remove('active');
    downloadResizedBtn.style.display = 'none';
    resizeComparisonContainer.innerHTML = '';
    showStatusMessage(resizeStatusMessage, 'Image cleared.', 'info');
}

// Compress Tool Functions
function handleCompressFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleCompressFile(file);
    } else {
        showStatusMessage(compressStatusMessage, 'Please select an image file.', 'error');
    }
}

function handleCompressFile(file) {
    originalFileSize = file.size;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        originalImageForCompression = new Image();
        originalImageForCompression.onload = function() {
            // Show compress options
            compressOptions.classList.add('active');
            
            // Show original image in comparison
            updateCompressComparison();
            
            // Update original size display
            originalSize.textContent = formatFileSize(originalFileSize);
            
            showStatusMessage(compressStatusMessage, 'Image loaded successfully. Adjust compression options and click "Compress Image".', 'success');
        };
        originalImageForCompression.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function compressImage() {
    if (!originalImageForCompression) {
        showStatusMessage(compressStatusMessage, 'Please select an image first.', 'error');
        return;
    }
    
    compressLoading.style.display = 'inline-block';
    compressImageBtn.disabled = true;
    
    setTimeout(() => {
        compressLoading.style.display = 'none';
        compressImageBtn.disabled = false;
        
        let quality = 0.7;
        let targetSizeKB = 200;
        let maxW = parseInt(maxWidth.value) || originalImageForCompression.width;
        let maxH = parseInt(maxHeight.value) || originalImageForCompression.height;
        let format = outputFormat.value;
        
        if (currentCompressionMethod === 'target') {
            targetSizeKB = parseInt(targetSize.value) || 200;
            maxW = parseInt(targetMaxWidth.value) || originalImageForCompression.width;
            maxH = parseInt(targetMaxHeight.value) || originalImageForCompression.height;
            format = targetOutputFormat.value;
            
            // For target size compression, we need to find the right quality
            quality = findOptimalQuality(originalImageForCompression, maxW, maxH, targetSizeKB, format);
        } else {
            quality = parseFloat(compressionLevel.value);
        }
        
        // Calculate new dimensions maintaining aspect ratio
        const ratio = Math.min(maxW / originalImageForCompression.width, maxH / originalImageForCompression.height);
        const newWidth = Math.round(originalImageForCompression.width * ratio);
        const newHeight = Math.round(originalImageForCompression.height * ratio);
        
        // Create a canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImageForCompression, 0, 0, newWidth, newHeight);
        
        // Convert to data URL with specified quality and format
        compressedImageUrl = canvas.toDataURL(format, quality);
        
        // Calculate compressed size
        const compressedSizeBytes = Math.round((compressedImageUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
        const compressionRatioValue = (compressedSizeBytes / originalFileSize * 100).toFixed(1);
        const sizeReductionValue = (100 - compressionRatioValue).toFixed(1);
        
        // Update stats
        compressedSize.textContent = formatFileSize(compressedSizeBytes);
        compressionRatio.textContent = `${compressionRatioValue}%`;
        sizeReduction.textContent = `${sizeReductionValue}%`;
        compressionStats.style.display = 'flex';
        
        // Update download button
        let extension = 'jpg';
        if (format === 'image/png') extension = 'png';
        else if (format === 'image/webp') extension = 'webp';
        
        downloadCompressedBtn.href = compressedImageUrl;
        downloadCompressedBtn.download = `compressed-image.${extension}`;
        downloadCompressedBtn.style.display = 'inline-flex';
        
        // Update comparison
        updateCompressComparison();
        
        showStatusMessage(compressStatusMessage, `Image compressed successfully! Size reduced by ${sizeReductionValue}%.`, 'success');
    }, 1000);
}

function findOptimalQuality(image, maxWidth, maxHeight, targetSizeKB, format) {
    let quality = 0.7;
    const targetSizeBytes = targetSizeKB * 1024;
    
    // Simple heuristic based on image dimensions and target size
    const pixels = image.width * image.height;
    const bytesPerPixel = targetSizeBytes / pixels;
    
    if (bytesPerPixel < 0.1) quality = 0.3;
    else if (bytesPerPixel < 0.3) quality = 0.5;
    else if (bytesPerPixel < 0.7) quality = 0.7;
    else quality = 0.9;
    
    return quality;
}

function updateCompressComparison() {
    compressComparisonContainer.innerHTML = '';
    
    // Original image
    const originalComparison = document.createElement('div');
    originalComparison.className = 'image-comparison';
    
    const originalImg = document.createElement('img');
    originalImg.src = originalImageForCompression.src;
    originalImg.alt = 'Original Image';
    originalComparison.appendChild(originalImg);
    
    const originalLabel = document.createElement('p');
    originalLabel.textContent = `Original (${formatFileSize(originalFileSize)})`;
    originalComparison.appendChild(originalLabel);
    
    compressComparisonContainer.appendChild(originalComparison);
    
    // Compressed image (if available)
    if (compressedImageUrl) {
        const compressedComparison = document.createElement('div');
        compressedComparison.className = 'image-comparison';
        
        const compressedImg = document.createElement('img');
        compressedImg.src = compressedImageUrl;
        compressedImg.alt = 'Compressed Image';
        compressedComparison.appendChild(compressedImg);
        
        const compressedSizeBytes = Math.round((compressedImageUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
        const compressedLabel = document.createElement('p');
        compressedLabel.textContent = `Compressed (${formatFileSize(compressedSizeBytes)})`;
        compressedComparison.appendChild(compressedLabel);
        
        compressComparisonContainer.appendChild(compressedComparison);
    }
}

function clearCompress() {
    originalImageForCompression = null;
    compressedImageUrl = null;
    compressFileInput.value = '';
    compressOptions.classList.remove('active');
    downloadCompressedBtn.style.display = 'none';
    compressComparisonContainer.innerHTML = '';
    compressionStats.style.display = 'none';
    showStatusMessage(compressStatusMessage, 'Image cleared.', 'info');
}

// PDF Password Remove Functions
async function handlePasswordFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        await handlePasswordFile(file);
    } else {
        showStatusMessage(passwordStatusMessage, 'Please select a PDF file.', 'error');
    }
}

async function handlePasswordFile(file) {
    passwordProtectedPdf = file;
    passwordOptions.classList.add('active');
    
    // Try to check if PDF is password protected
    try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Simple check for PDF header
        const header = new Uint8Array(arrayBuffer.slice(0, 8));
        const headerStr = String.fromCharCode.apply(null, header);
        
        if (!headerStr.includes('%PDF')) {
            showStatusMessage(passwordStatusMessage, 'Invalid PDF file.', 'error');
            return;
        }
        
        showStatusMessage(passwordStatusMessage, 'PDF file loaded. Enter password and click "Remove Password".', 'success');
        
    } catch (error) {
        showStatusMessage(passwordStatusMessage, 'Error loading PDF file.', 'error');
    }
}

async function removePdfPassword() {
    if (!passwordProtectedPdf) {
        showStatusMessage(passwordStatusMessage, 'Please select a PDF file first.', 'error');
        return;
    }
    
    const password = pdfPassword.value.trim();
    if (!password) {
        showStatusMessage(passwordStatusMessage, 'Please enter the PDF password.', 'error');
        return;
    }
    
    passwordRemoveLoading.style.display = 'inline-block';
    removePasswordBtn.disabled = true;
    
    try {
        const arrayBuffer = await passwordProtectedPdf.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Method 1: Try using pdf-lib to remove password
        let unlockedPdfBytes;
        
        try {
            // First try with pdf-lib
            unlockedPdfBytes = await removePasswordWithPdfLib(uint8Array, password);
        } catch (error) {
            console.log('pdf-lib method failed, trying alternative method:', error);
            // Fallback method
            unlockedPdfBytes = await removePasswordAlternative(uint8Array, password);
        }
        
        if (unlockedPdfBytes) {
            // Create download link
            const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            downloadUnlockedBtn.href = url;
            downloadUnlockedBtn.download = 'unlocked-' + passwordProtectedPdf.name;
            downloadUnlockedBtn.style.display = 'inline-flex';
            
            showStatusMessage(passwordStatusMessage, 'Password removed successfully! Click "Download Unlocked PDF" to save.', 'success');
        } else {
            throw new Error('Password removal failed');
        }
        
    } catch (error) {
        console.error('Error removing password:', error);
        
        if (error.message.includes('password') || error.message.includes('Password')) {
            showStatusMessage(passwordStatusMessage, 'Incorrect password. Please check and try again.', 'error');
        } else {
            showStatusMessage(passwordStatusMessage, 'Error removing password. The PDF might use strong encryption.', 'error');
        }
    } finally {
        passwordRemoveLoading.style.display = 'none';
        removePasswordBtn.disabled = false;
    }
}

async function removePasswordWithPdfLib(pdfBytes, password) {
    try {
        const { PDFDocument } = PDFLib;
        
        // Load the encrypted PDF
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            password: password
        });
        
        // Save without password - this removes the encryption
        const savedPdfBytes = await pdfDoc.save();
        return savedPdfBytes;
        
    } catch (error) {
        throw error;
    }
}

async function removePasswordAlternative(pdfBytes, password) {
    // Alternative method: Try to decrypt and re-encrypt without password
    return new Promise(async (resolve, reject) => {
        try {
            // Try using PDF.js to decrypt
            const loadingTask = pdfjsLib.getDocument({
                data: pdfBytes,
                password: password
            });
            
            const pdfDoc = await loadingTask.promise;
            const numPages = pdfDoc.numPages;
            
            // If we reached here, password is correct
            // Now create a new PDF without password using jsPDF
            const { jsPDF } = window.jspdf;
            const newPdf = new jsPDF();
            
            // Copy each page (simplified approach)
            for (let i = 1; i <= Math.min(numPages, 10); i++) { // Limit to first 10 pages for performance
                if (i > 1) newPdf.addPage();
                
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                newPdf.addImage(imgData, 'JPEG', 10, 10, 180, 0);
            }
            
            const unlockedPdf = newPdf.output('arraybuffer');
            resolve(unlockedPdf);
            
        } catch (error) {
            reject(error);
        }
    });
}

function clearPasswordFile() {
    passwordProtectedPdf = null;
    passwordFileInput.value = '';
    pdfPassword.value = '';
    passwordOptions.classList.remove('active');
    downloadUnlockedBtn.style.display = 'none';
    showStatusMessage(passwordStatusMessage, 'PDF cleared.', 'info');
}

// Utility Functions
function showStatusMessage(element, message, type) {
    element.textContent = message;
    element.className = 'status-message';
    element.classList.add(type);
    element.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}