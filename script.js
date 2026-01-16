/**
 * Capybara Chill - Summon chill capybaras
 * Inspired by calmingmanatee.xyz
 */

// Calming capybara messages (custom written for this project)
const captions = [
    "you're doing great, friend",
    "take it easy today",
    "everything will work out",
    "breathe in... breathe out...",
    "you deserve a peaceful moment",
    "no rush. no worries.",
    "just vibing, like you should",
    "stress is temporary. capybaras are forever.",
    "you've got this",
    "remember to rest",
    "it's okay to slow down",
    "be kind to yourself today",
    "one step at a time",
    "you're exactly where you need to be",
    "let go of what you can't control",
    "this too shall pass",
    "you're stronger than you think",
    "peace is always an option",
    "good things are coming",
    "just float through it",
    "relax. reset. repeat.",
    "you matter",
    "take a moment for yourself",
    "embrace the calm",
    "it's okay to do nothing sometimes"
];

// Capybara image sources from Unsplash
// You can also add local images to the images/ folder and update this array
const capybaraImages = [
    "https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?w=800&q=80",
    "https://images.unsplash.com/photo-1714622343884-7494d44b30fa?w=800&q=80",
    "https://images.unsplash.com/photo-1701772164869-dfb2cac483dc?w=800&q=80",
    "https://images.unsplash.com/photo-1716064554838-f9ae49db992b?w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1667873584104-52e236d9da47?w=800&q=80",
    "https://images.unsplash.com/photo-1633123784883-9cc9ba6d8c9e?w=800&q=80",
    "https://images.unsplash.com/photo-1595017013941-cab3d4c8d02f?w=800&q=80",
    "https://images.unsplash.com/photo-1557431177-36141475c676?w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1667873767487-8f4a5a6230dc?w=800&q=80",
    "https://images.unsplash.com/photo-1700553792546-3fbfc6b6613e?w=800&q=80"
];

// Track recently shown to avoid repeats (last 10)
const recentImages = [];
const recentCaptions = [];
const HISTORY_LENGTH = 10;

// Prevent rapid clicking issues
let isLoading = false;

// Get random index, avoiding recent ones
function getRandomIndex(array, recentIndices) {
    if (array.length <= 1) return 0;

    // If we've shown most items, allow some repeats
    const availableIndices = [];
    for (let i = 0; i < array.length; i++) {
        if (!recentIndices.includes(i)) {
            availableIndices.push(i);
        }
    }

    // If all indices are in recent history, pick from least recent half
    if (availableIndices.length === 0) {
        const olderIndices = recentIndices.slice(0, Math.floor(recentIndices.length / 2));
        return olderIndices[Math.floor(Math.random() * olderIndices.length)];
    }

    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
}

// Add index to history, keeping only last N
function addToHistory(index, historyArray) {
    historyArray.push(index);
    if (historyArray.length > HISTORY_LENGTH) {
        historyArray.shift();
    }
}

// Split caption into top and bottom parts for meme format
// Splits at natural clause breaks (period, ellipsis, comma), otherwise keeps on one line
function splitCaption(caption) {
    // Check for natural split points: period, ellipsis, or comma (multiple clauses)
    const splitPatterns = [
        /^(.+?\.\.\.)\s*(.+)$/,    // Split at ellipsis (e.g., "breathe in... breathe out...")
        /^(.+?\.)\s+(.+)$/,         // Split at period (e.g., "no rush. no worries.")
    ];

    for (const pattern of splitPatterns) {
        const match = caption.match(pattern);
        if (match) {
            return { top: match[1], bottom: match[2] };
        }
    }

    // Single clause - keep on one line at bottom
    return { top: '', bottom: caption };
}

// Summon a new chill capybara
function summonCapybara() {
    // Prevent rapid clicking - ignore if already loading
    if (isLoading) return;
    isLoading = true;

    const imageEl = document.getElementById('capybara-image');
    const captionTop = document.getElementById('caption-top');
    const captionBottom = document.getElementById('caption-bottom');
    const container = document.querySelector('.image-container');
    const button = document.getElementById('chill-btn');

    // Add button wiggle
    button.classList.add('wiggle');
    setTimeout(() => button.classList.remove('wiggle'), 300);

    // Start fade out - the whole container fades together
    container.classList.remove('loaded');

    // Get random image and caption (avoiding recent ones)
    const imageIndex = getRandomIndex(capybaraImages, recentImages);
    const captionIndex = getRandomIndex(captions, recentCaptions);

    // Add to history
    addToHistory(imageIndex, recentImages);
    addToHistory(captionIndex, recentCaptions);

    // Helper to show the loaded content
    function showContent(imgSrc) {
        imageEl.src = imgSrc;

        // Split and set captions
        const { top, bottom } = splitCaption(captions[captionIndex]);
        captionTop.textContent = top;
        captionBottom.textContent = bottom;

        // Force browser reflow to ensure it sees the opacity: 0 state
        void container.offsetHeight;

        // Small delay then fade in the whole container
        setTimeout(() => {
            container.classList.add('loaded');
            isLoading = false;
        }, 50);
    }

    // Wait for fade out before loading new image
    setTimeout(() => {
        // Preload the image with timeout
        const newImage = new Image();
        let loadTimedOut = false;

        // Timeout after 8 seconds - use fallback if image takes too long
        const loadTimeout = setTimeout(() => {
            loadTimedOut = true;
            console.warn('Image load timed out, using fallback');
            showContent(`https://placehold.co/800x600/d4c4a8/5d4e37?text=chill+capybara`);
        }, 8000);

        newImage.onload = function() {
            if (loadTimedOut) return; // Already handled by timeout
            clearTimeout(loadTimeout);
            showContent(this.src);
        };

        newImage.onerror = function() {
            if (loadTimedOut) return; // Already handled by timeout
            clearTimeout(loadTimeout);
            console.warn('Image failed to load, using fallback');
            showContent(`https://placehold.co/800x600/d4c4a8/5d4e37?text=chill+capybara`);
        };

        newImage.src = capybaraImages[imageIndex];
    }, 500); // Wait 500ms for current content to fade out
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    summonCapybara();
});

// Keyboard support - press space or enter to summon
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        if (e.target === document.body || e.target.tagName === 'BUTTON') {
            e.preventDefault();
            summonCapybara();
        }
    }
});

// Handle page visibility change (when returning from background on mobile)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Reset loading state in case it got stuck
        isLoading = false;

        // Ensure image is still loaded (mobile browsers may unload resources)
        const imageEl = document.getElementById('capybara-image');
        if (imageEl && imageEl.src && (imageEl.naturalWidth === 0 || !imageEl.complete)) {
            // Image was unloaded, reload it
            const src = imageEl.src;
            imageEl.src = '';
            imageEl.src = src;
        }
    }
});

// Handle pageshow event (fired when page is restored from bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from bfcache, reset state
        isLoading = false;

        const imageEl = document.getElementById('capybara-image');
        if (imageEl && imageEl.src) {
            const src = imageEl.src;
            imageEl.src = '';
            imageEl.src = src;
        }
    }
});
