const trackTitleDisplay = document.getElementById('track-title');
const navButtons = document.querySelectorAll('.nav-btn');
const mainBackground = document.getElementById('main-background');
const yearDropdown = document.getElementById('year-dropdown');
const moodTextContainer = document.getElementById('mood-text-container');
const moodTitle = document.getElementById('mood-title');
const moodSubtitle = document.getElementById('mood-subtitle');

if (yearDropdown) {
    for (let y = 1940; y <= 2026; y++) {
        let opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearDropdown.appendChild(opt);
    }
}
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

// STATE
let isPlaying = false;
let currentCategory = "";
let ytPlayer;

// BACKGROUNDS
const backgrounds = {
    "morning": "morning.png",
    "morning-coffee": "coffee.png",
    "morning-tea": "tea.png",
    "afternoon": "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=2673&auto=format&fit=crop", // minimal gray architecture
    "evening": "evening.png",
    "night": "night.png",
    "1940s": "https://images.unsplash.com/photo-1543783318-72e70c67531e?q=80&w=2670&auto=format&fit=crop", // Elegant night mood
    "1950s": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2670&auto=format&fit=crop", // Classic Jazz vibe
    "1990s": "https://images.unsplash.com/photo-1544161515-4af6ce1dbbe3?q=80&w=2673&auto=format&fit=crop", // Cozy lofi mood
    "1940-2026": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2670&auto=format&fit=crop" // Modern Jazz setup
};

// MOOD TEXTS
const moodTexts = {
    "morning": { title: "Good Morning", subtitle: "Enjoy your morning with soft jazz" },
    "morning-coffee": { title: "Coffee Time Jazz", subtitle: "Rich blends and smooth tunes" },
    "morning-tea": { title: "Tea Jazz", subtitle: "Delicate sips and mellow vibes" },
    "afternoon": { title: "Afternoon Focus", subtitle: "Stay focused. Stay calm." },
    "evening": { title: "Evening Relaxation", subtitle: "Unwind. Let the music carry you." },
    "night": { title: "Good Night", subtitle: "Good night. Slow down." }
};

// PLAYLISTS
const playlists = {
    "morning": ["nv_2rz5BFDA", "pHwRrE14cjE", "S-dRotOi01Q", "4OItGUhpNWM", "iWuNnm-VUzY", "gxwv9CbkeCY", "u5UEJvX46rE", "zl1U9_jciOk", "0oHboHuI5ME", "Dx5qFachd3A"],
    "morning-coffee": ["PoPL7BExSQU", "qQNV6WNQXDc", "3zrSoHgAAWo", "9YH175fH2jo", "CX-Y-6kw8HU"],
    "morning-tea": ["cb2w2m1JmCY", "TtYFnN_G0GE", "x8zBwbB6A3Q", "nv_2rz5BFDA", "S-dRotOi01Q"],
    "afternoon": ["CX-Y-6kw8HU", "PoPL7BExSQU", "lP26UCnoH9s", "3zrSoHgAAWo", "x8zBwbB6A3Q"],
    "evening": ["lP26UCnoH9s", "Nv2GgV34qIg", "CX-Y-6kw8HU", "9YH175fH2jo", "qQNV6WNQXDc"],
    "night": ["cb2w2m1JmCY", "TtYFnN_G0GE", "qQNV6WNQXDc", "9YH175fH2jo", "CX-Y-6kw8HU"],
    "1940s": ["cb2w2m1JmCY", "TtYFnN_G0GE", "qQNV6WNQXDc", "9YH175fH2jo", "CX-Y-6kw8HU"],
    "1950s": ["PoPL7BExSQU", "qQNV6WNQXDc", "3zrSoHgAAWo", "CX-Y-6kw8HU", "9YH175fH2jo", "cb2w2m1JmCY"],
    "1990s": ["lP26UCnoH9s", "Nv2GgV34qIg", "CX-Y-6kw8HU", "9YH175fH2jo", "qQNV6WNQXDc"],
    "1940-2026": ["cb2w2m1JmCY", "TtYFnN_G0GE", "qQNV6WNQXDc", "9YH175fH2jo", "CX-Y-6kw8HU", "PoPL7BExSQU", "3zrSoHgAAWo", "lP26UCnoH9s", "Nv2GgV34qIg", "x8zBwbB6A3Q", "Fw9fXkXlsT8", "a2LFVWBmoic", "K2QpG72_hG4"] 
};

// YOUTUBE API
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady() {
    // Start with morning jazz automatically
    setPlaylist('morning', 'Morning Jazz');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.body.classList.add('is-playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'inline-block';
    } else {
        isPlaying = false;
        document.body.classList.remove('is-playing');
        if (playIcon) playIcon.style.display = 'inline-block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    }

    // Try to update track title from YT player if playing
    if (event.data == YT.PlayerState.PLAYING) {
        const videoData = ytPlayer.getVideoData();
        if (videoData && videoData.title) {
            trackTitleDisplay.innerHTML = videoData.title;
        }
    }
}

// NAVIGATION LOGIC
function setPlaylist(category, displayTitle) {
    if (!ytPlayer || !ytPlayer.loadPlaylist) return;

    currentCategory = category;
    trackTitleDisplay.innerHTML = `Loading ${displayTitle}...`;

    // Manage Theme Category
    let themeCategory = category;
    if (category.startsWith('morning')) {
        themeCategory = 'morning';
    }

    // Manage Sub-Navigation Visibility
    const subNavMorning = document.getElementById('sub-nav-morning');
    if (subNavMorning) {
        if (themeCategory === 'morning') {
            subNavMorning.classList.add('visible');
        } else {
            subNavMorning.classList.remove('visible');
        }
    }

    // Change Background
    const bgCategory = backgrounds[category] ? category : themeCategory;
    if (backgrounds[bgCategory]) {
        mainBackground.style.backgroundImage = `url('${backgrounds[bgCategory]}')`;
    }

    // Set Theme Class
    document.body.classList.remove('theme-morning', 'theme-afternoon', 'theme-evening', 'theme-night');
    if (["morning", "afternoon", "evening", "night"].includes(themeCategory)) {
        document.body.classList.add(`theme-${themeCategory}`);
    }

    // Set Mood Text Overlay
    if (moodTexts[category]) {
        moodTitle.innerText = moodTexts[category].title;
        moodSubtitle.innerText = moodTexts[category].subtitle;
        moodTextContainer.classList.add('visible');
        
        // Auto-hide text after 5 seconds
        setTimeout(() => {
            if(currentCategory === category) {
                moodTextContainer.classList.remove('visible');
            }
        }, 5000);
    } else {
        moodTextContainer.classList.remove('visible');
    }

    // Load the playlist
    ytPlayer.loadPlaylist(playlists[category]);
    
    // Update active class on buttons
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else if (btn.getAttribute('data-category') === themeCategory && category !== themeCategory) {
            // Keep main Morning button active if a morning sub-category is selected
            btn.classList.add('active');
        } else if (btn.classList.contains('sub-nav-btn') && btn.getAttribute('data-category') !== category) {
            btn.classList.remove('active');
        } else if (!btn.classList.contains('sub-nav-btn')) {
            btn.classList.remove('active');
        }
    });
}

// EVENT LISTENERS
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (!ytPlayer) return;
        if (isPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    });
}

navButtons.forEach(btn => {
    if (btn.tagName.toLowerCase() === 'select') return;
    btn.addEventListener('click', function() {
        if (yearDropdown) yearDropdown.value = "";
        const cat = this.getAttribute('data-category');
        const display = this.getAttribute('data-display');
        setPlaylist(cat, display);
    });
});

if (yearDropdown) {
    yearDropdown.addEventListener('change', function() {
        const selectedYear = this.value;
        if (!selectedYear) return;
        
        let display = selectedYear + " Mix";
        
        // Find matching decade or fallback
        let categoryToPlay = selectedYear;
        const decade = Math.floor(selectedYear / 10) * 10 + "s";
        
        if (!playlists[categoryToPlay]) {
            categoryToPlay = playlists[decade] ? decade : "1940-2026";
        }
        
        setPlaylist(categoryToPlay, display);
        
        setTimeout(() => {
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        }, 10);
    });
}
