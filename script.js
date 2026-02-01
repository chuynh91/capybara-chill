/**
 * Capybara Chill - Summon chill capybaras
 * Inspired by calmingmanatee.xyz
 */

// Lunar New Year captions (Year of the Horse 2026)
const lunarNewYearCaptions = [
    "happy lunar new year, friend",
    "wishing you peace and prosperity",
    "may the year of the horse bring you strength",
    "gallop into the new year... at your own pace",
    "new year, same chill vibes",
    "red envelopes and good energy",
    "fortune favors the relaxed",
    "may your year be as calm as a capybara",
    "gong xi fa cai... now take a deep breath",
    "the horse runs fast. you don't have to.",
    "new beginnings, peaceful moments",
    "wishing you abundance and rest",
    "year of the horse energy: strong but steady",
    "lucky you. you found a chill capybara.",
    "spring is coming. so is your peace.",
    "may good fortune find you resting",
    "a fresh start calls for a calm heart",
    "the new year brings new calm",
    "horses charge ahead. capybaras float. both are valid.",
    "celebrate gently"
];

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

// Lunar New Year capybara images
const lunarNewYearImages = [
    "images/lunar-1.png",
    "images/lunar-2.png",
    "images/lunar-3.png",
    "images/lunar-4.png",
    "images/lunar-5.png",
    "images/lunar-6.png",
    "images/lunar-7.png",
    "images/lunar-8.png",
    "images/lunar-9.png",
    "images/lunar-10.png"
];

// Check if current date is within Lunar New Year period
// Lunar New Year 2026: February 17 (Year of the Horse)
// Extended celebration: Jan 31 - Feb 28
function isLunarNewYear() {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed (January = 0, February = 1)
    const day = now.getDate();

    // January 31 or any day in February up to the 28th
    if ((month === 0 && day === 31) || (month === 1 && day <= 28)) {
        return true;
    }
    return false;
}

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
// Splits when there's a natural break or when caption is long enough
function splitCaption(caption) {
    // Check for natural split points: ellipsis or period (these always split)
    const splitPatterns = [
        /^(.+?\.\.\.)\s*(.+)$/,    // Split at ellipsis
        /^(.+?\.)\s+(.+)$/,         // Split at period
    ];

    for (const pattern of splitPatterns) {
        const match = caption.match(pattern);
        if (match) {
            return { top: match[1], bottom: match[2] };
        }
    }

    // For shorter captions without natural breaks, keep on one line
    if (caption.length < 28) {
        return { top: '', bottom: caption };
    }

    // Longer captions - split at natural speech boundaries
    const words = caption.split(' ');
    if (words.length >= 4) {
        // Look for natural split points - before pronouns/words that start new clauses
        const clauseStarters = ['you', 'i', 'we', 'they', 'it', 'and', 'but', 'so', 'just', 'like', 'to'];

        // Search for a good split point in the middle third of the sentence
        const minIndex = Math.floor(words.length / 3);
        const maxIndex = Math.ceil(words.length * 2 / 3);

        for (let i = minIndex; i <= maxIndex; i++) {
            const word = words[i].toLowerCase().replace(/[^a-z]/g, '');
            if (clauseStarters.includes(word)) {
                return {
                    top: words.slice(0, i).join(' '),
                    bottom: words.slice(i).join(' ')
                };
            }
        }

        // No natural break found - split at middle
        const midpoint = Math.ceil(words.length / 2);
        return {
            top: words.slice(0, midpoint).join(' '),
            bottom: words.slice(midpoint).join(' ')
        };
    }

    // Default - keep on one line at bottom
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

// Track recently shown lunar new year content
const recentLunarImages = [];
const recentLunarCaptions = [];

// Check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create subtle firecracker sparks behind the lunar button
function createFirecrackerSparks() {
    // Skip sparks if user prefers reduced motion
    if (prefersReducedMotion()) return;

    const btn = document.getElementById('lunar-btn');
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 8-12 small sparks
    const sparkCount = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'firecracker-spark';

        // Random angle and distance
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const distance = 20 + Math.random() * 25;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        // Random gold/red color
        const colors = ['#ffd700', '#ff6b6b', '#ff4444', '#ffaa00', '#ff8c00'];
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Position at button center
        spark.style.left = centerX + 'px';
        spark.style.top = centerY + 'px';
        spark.style.setProperty('--end-x', endX + 'px');
        spark.style.setProperty('--end-y', endY + 'px');

        document.body.appendChild(spark);

        // Remove after animation
        setTimeout(() => spark.remove(), 600);
    }
}

// Summon a Lunar New Year capybara (easter egg)
function summonLunarNewYear() {
    // Prevent rapid clicking - ignore if already loading
    if (isLoading) return;
    isLoading = true;

    const imageEl = document.getElementById('capybara-image');
    const captionTop = document.getElementById('caption-top');
    const captionBottom = document.getElementById('caption-bottom');
    const container = document.querySelector('.image-container');
    const envelopeBtn = document.getElementById('lunar-btn');

    // Add bounce animation to the envelope
    envelopeBtn.classList.add('bounce');
    setTimeout(() => envelopeBtn.classList.remove('bounce'), 600);

    // Trigger firecracker sparks
    createFirecrackerSparks();

    // Start fade out after bounce begins
    setTimeout(() => {
        container.classList.remove('loaded');
    }, 300);

    // Get random lunar image and caption
    const imageIndex = getRandomIndex(lunarNewYearImages, recentLunarImages);
    const captionIndex = getRandomIndex(lunarNewYearCaptions, recentLunarCaptions);

    // Add to history
    addToHistory(imageIndex, recentLunarImages);
    addToHistory(captionIndex, recentLunarCaptions);

    // Helper to show the loaded content
    function showContent(imgSrc) {
        imageEl.src = imgSrc;

        // Split and set captions
        const { top, bottom } = splitCaption(lunarNewYearCaptions[captionIndex]);
        captionTop.textContent = top;
        captionBottom.textContent = bottom;

        // Force browser reflow
        void container.offsetHeight;

        // Fade in
        setTimeout(() => {
            container.classList.add('loaded');
            isLoading = false;
        }, 50);
    }

    // Wait for fade out before loading new image
    setTimeout(() => {
        const newImage = new Image();
        let loadTimedOut = false;

        const loadTimeout = setTimeout(() => {
            loadTimedOut = true;
            console.warn('Lunar image load timed out, using fallback');
            showContent(`https://placehold.co/800x600/c41e3a/ffd700?text=🧧+Happy+Lunar+New+Year`);
        }, 8000);

        newImage.onload = function() {
            if (loadTimedOut) return;
            clearTimeout(loadTimeout);
            showContent(this.src);
        };

        newImage.onerror = function() {
            if (loadTimedOut) return;
            clearTimeout(loadTimeout);
            console.warn('Lunar image failed to load, using fallback');
            showContent(`https://placehold.co/800x600/c41e3a/ffd700?text=🧧+Happy+Lunar+New+Year`);
        };

        newImage.src = lunarNewYearImages[imageIndex];
    }, 800); // Wait for bounce + fade out
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show/hide lunar new year button based on date
    const lunarBtn = document.getElementById('lunar-btn');
    if (lunarBtn && isLunarNewYear()) {
        lunarBtn.style.display = 'flex';
    }

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

        // Ensure lunar button visibility is correct
        const lunarBtn = document.getElementById('lunar-btn');
        if (lunarBtn && isLunarNewYear()) {
            lunarBtn.style.display = 'flex';
        }

        const imageEl = document.getElementById('capybara-image');
        if (imageEl && imageEl.src) {
            const src = imageEl.src;
            imageEl.src = '';
            imageEl.src = src;
        }
    }
});
