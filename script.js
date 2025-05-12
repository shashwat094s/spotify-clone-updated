
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let timeDisplay = document.getElementById('timeDisplay');
let songItemContainer = document.querySelector(".songItemContainer");
let isShuffle = false;
let isRepeat = false;

let songs = [
    { songName: "On & On - Cartoon ft. Daniel Levi", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Invincible - DEAF KEV", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "Mortals - Warriyo ft. Laura Brehm", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Shine - Spektrem", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Why We Lose - Cartoon ft. Coleman Trapp", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Sky High - Elektronomia", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Symbolism - Electro-Light", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Heroes Tonight - Janji ft. Johnning", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Feel Good - Syn Cole", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "My Heart - Different Heaven & EH!DE", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" }
];

songs.forEach((song, i) => {
    songItemContainer.innerHTML += `
    <div class="songItem">
      <img src="${song.coverPath}" alt="Cover ${i+1}" />
      <span class="songName">${song.songName}</span>
      <span class="timestamp">
        <span class="duration">00:00</span>
        <i id="${i}" class="far songItemPlay fa-play-circle"></i>
      </span>
    </div>`;
});

const updateDurations = () => {
    document.querySelectorAll('.songItem').forEach((item, i) => {
        let audio = new Audio(songs[i].filePath);
        audio.addEventListener("loadedmetadata", () => {
            let mins = Math.floor(audio.duration / 60);
            let secs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
            item.querySelector('.duration').textContent = `${mins}:${secs}`;
        });
    });
};

updateDurations();

const makeAllPlays = () => {
    document.querySelectorAll('.songItemPlay').forEach(el => {
        el.classList.remove('fa-pause-circle');
        el.classList.add('fa-play-circle');
    });
};

masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
});

audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100) || 0;
    myProgressBar.value = progress;

    let curMins = Math.floor(audioElement.currentTime / 60);
    let curSecs = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
    let durMins = Math.floor(audioElement.duration / 60);
    let durSecs = Math.floor(audioElement.duration % 60).toString().padStart(2, '0');

    timeDisplay.innerText = `${curMins}:${curSecs} / ${durMins}:${durSecs}`;
});

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

document.querySelectorAll('.songItemPlay').forEach(el => {
    el.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.replace('fa-play-circle', 'fa-pause-circle');
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    });
});

document.getElementById('next').addEventListener('click', () => {
    songIndex = isShuffle ? Math.floor(Math.random() * songs.length) : (songIndex + 1) % songs.length;
    playSong();
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSong();
});

audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        playSong();
    } else {
        document.getElementById('next').click();
    }
});

function playSong() {
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
}

// Add Shuffle and Repeat Toggles
document.addEventListener("DOMContentLoaded", () => {
    let ctrlBar = document.querySelector(".icons");
    let shuffleBtn = document.createElement("i");
    shuffleBtn.className = "fas fa-random";
    shuffleBtn.title = "Shuffle";
    shuffleBtn.style.marginLeft = "20px";
    shuffleBtn.style.cursor = "pointer";
    ctrlBar.appendChild(shuffleBtn);

    let repeatBtn = document.createElement("i");
    repeatBtn.className = "fas fa-redo";
    repeatBtn.title = "Repeat";
    repeatBtn.style.marginLeft = "20px";
    repeatBtn.style.cursor = "pointer";
    ctrlBar.appendChild(repeatBtn);

    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.style.color = isShuffle ? "#1DB954" : "white";
    });

    repeatBtn.addEventListener("click", () => {
        isRepeat = !isRepeat;
        repeatBtn.style.color = isRepeat ? "#1DB954" : "white";
    });

    // Volume slider
    let volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = 1;
    volumeSlider.style.marginLeft = "20px";
    volumeSlider.title = "Volume";
    ctrlBar.appendChild(volumeSlider);

    volumeSlider.addEventListener("input", () => {
        audioElement.volume = volumeSlider.value;
    });
});
// Add touch event listeners for mobile devices
document.querySelectorAll('.songItemPlay').forEach(el => {
    el.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.replace('fa-play-circle', 'fa-pause-circle');
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    });
});

// Ensure the play button works on touch devices
masterPlay.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
});
