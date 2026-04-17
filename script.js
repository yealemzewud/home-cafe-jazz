const platter = document.getElementById('platter');
const toneArm = document.getElementById('tone-arm');
const moodText = document.querySelector('.mood-text');
const activeLabel = document.getElementById('vinyl-label');
const sleeves = document.querySelectorAll('.record-sleeve');

let isPlaying = false;
let currentCategory = "";

// The Playlists containing all the best music
const playlists = {
    "1940s": ["cb2w2m1JmCY", "TtYFnN_G0GE", "qQNV6WNQXDc", "9YH175fH2jo", "CX-Y-6kw8HU"],
    "1950s": ["PoPL7BExSQU", "qQNV6WNQXDc", "3zrSoHgAAWo", "CX-Y-6kw8HU", "9YH175fH2jo", "cb2w2m1JmCY"],
    "1990s": ["lP26UCnoH9s", "Nv2GgV34qIg", "CX-Y-6kw8HU", "9YH175fH2jo", "qQNV6WNQXDc"]
};

// 1. This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// 2. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        toneArm.classList.add('playing');
        platter.classList.add('spinning');
        moodText.style.opacity = 0;
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        toneArm.classList.remove('playing');
        platter.classList.remove('spinning');
    }
}

// 3. User interaction logic for Featured CDs
function playRecord(element) {
    if (!ytPlayer || !ytPlayer.loadPlaylist) return; // Wait for API to load

    let category = element.getAttribute('data-category');
    let title = element.getAttribute('data-title');
    let color = element.style.backgroundColor || '#0a0a0a';

    // Visual Logic: "Put the record on"
    platter.classList.add('has-record');
    activeLabel.style.backgroundColor = color;
    activeLabel.innerHTML = title;

    // Play Audio Logic
    if (currentCategory !== category) {
        // Load the entire array of music!
        ytPlayer.loadPlaylist(playlists[category]);
        currentCategory = category;
    } else {
        // Clicking the same record toggles play/pause
        if (isPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    }
}

sleeves.forEach(sleeve => {
    sleeve.addEventListener('click', function() { playRecord(this); });
});

