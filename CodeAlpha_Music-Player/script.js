let audio = document.getElementById("audio");
let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let progress = document.getElementById("progress");
let volume = document.getElementById("volume");
let playlist = document.getElementById("playlist");

let title = document.getElementById("song-title");
let artist = document.getElementById("song-artist");
let currentTimeEl = document.getElementById("current-time");
let durationEl = document.getElementById("duration");
 

let currentIndex = 0;

playlist.querySelectorAll("li").forEach((item, index) => {
    item.addEventListener("click", () => {
        currentIndex = index;
        loadSong(item);
        playSong();
    });
});
function updateProgressColor() {
    let percent = (progress.value / progress.max) * 100;
    progress.style.background = `linear-gradient(to right, #e70782 ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
}

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.max = audio.duration;
        progress.value = audio.currentTime;

        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);

        updateProgressColor();
    }
});

progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
    updateProgressColor();
});

function loadSong(item) {
    audio.src = item.getAttribute("data-src");
    title.textContent = item.getAttribute("data-title");
    artist.textContent = item.getAttribute("data-artist");
}


function playSong() {
    audio.play();
    playBtn.textContent = "⏸️";
}


function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶️";
}


playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % playlist.children.length;
    let item = playlist.children[currentIndex];
    loadSong(item);
    playSong();
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + playlist.children.length) % playlist.children.length;
    let item = playlist.children[currentIndex];
    loadSong(item);
    playSong();
});


volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.max = audio.duration;
        progress.value = audio.currentTime;
 
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
});

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
