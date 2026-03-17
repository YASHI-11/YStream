// DOM Elements
const playButton = document.querySelector('.play');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.previous');
const playlist = document.getElementById('searchResults');
const progressBar = document.querySelector('.progress');
const progressFilled = document.querySelector('.progress-filled');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const mainImage = document.querySelector('.album-art');
const mainTitle = document.querySelector('.song-title');
const mainArtist = document.querySelector('.artist');
const searchInput = document.querySelector('.search-bar input');
const mainPlayer = document.querySelector('.current-song');

// State management
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Initialize audio event listeners
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => nextButton.click());
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// Function to populate songs
function populateSongs() {
    console.log('Populating songs...'); // Debug log
    
    // Get the playlist container
    const playlist = document.getElementById('searchResults');
    console.log('Playlist element:', playlist); // Debug log
    
    if (!playlist) {
        console.error('Playlist container not found');
        return;
    }
    
    try {
        console.log('Total songs to populate:', songs.length); // Debug log
        
        playlist.innerHTML = ''; // Clear existing songs
        songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            if (index === currentSongIndex) {
                songItem.classList.add('playing');
            }
            
            songItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <div class="song-controls">
                    <span class="duration">${song.duration}</span>
                    <button class="favorite-btn" data-index="${index}">
                        <i class="fa${favorites.includes(song.title) ? 's' : 'r'} fa-heart"></i>
                    </button>
                </div>
            `;
            
            songItem.addEventListener('click', () => loadSong(index));
            playlist.appendChild(songItem);
            console.log('Added song:', song.title); // Debug log
        });

        // Add favorite button event listeners
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                toggleFavorite(index);
            });
        });
        
        console.log('Songs population complete'); // Debug log
    } catch (error) {
        console.error('Error populating songs:', error);
        console.error(error.stack); // Print full error stack
    }
}

// Load and play song function
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    // Update audio source
    audio.src = song.audio;
    
    // Update main player display with high-resolution image
    mainImage.src = song.cover.replace('w=100', 'w=400');
    mainTitle.textContent = song.title;
    mainArtist.textContent = song.artist;
    
    // Add fade-in animation
    mainPlayer.style.animation = 'fadeIn 0.5s ease';
    
    // Update UI states
    updatePlayingState();
    updatePlaylistHighlight();
    
    // If already playing, start the new song
    if (isPlaying) {
        audio.play();
    }
}

// Play/Pause toggle with animations
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// Update progress bar
function updateProgress() {
    if (!isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update playlist highlighting
function updatePlaylistHighlight() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Update play button state
function updatePlayingState() {
    playButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}

// Event listeners
playButton.addEventListener('click', togglePlay);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);

progressBar.addEventListener('click', (e) => {
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * audio.duration;
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const songItems = document.querySelectorAll('.song-item');
    
    songItems.forEach((item, index) => {
        const title = songs[index].title.toLowerCase();
        const artist = songs[index].artist.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Handle favorites
function toggleFavorite(index) {
    const songId = songs[index].title; // Using title as a unique identifier
    const favoriteIndex = favorites.indexOf(songId);
    
    if (favoriteIndex === -1) {
        favorites.push(songId);
    } else {
        favorites.splice(favoriteIndex, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// Update favorite buttons
function updateFavoriteButtons() {
    const buttons = document.querySelectorAll('.favorite-btn');
    buttons.forEach((btn, index) => {
        const isFavorite = favorites.includes(songs[index].title);
        btn.innerHTML = `<i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>`;
    });
}

// Initialize
loadSong(0);
populateSongs();
updateFavoriteButtons();
