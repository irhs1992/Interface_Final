//Used Jquery to make it more functional//

$(function () {
    let playPauseButton = $("#play-pause-button"), 
    player_track = document.getElementById('player-track'),
    music_name = document.getElementById('music-name'), music_artist_name = document.getElementById('artist-name'),
    music_status = document.getElementById('music-status'),
    icon = playPauseButton.find('i'), 
    playPreviousTrackButton = $('#play-previous'), 
    playNextTrackButton = $('#play-next'), 
    currIndex = -1;

    //song list//
    let songs = [
        { artist: "Joel Cummins", name: "Billy Goat Stomp", url: "./Audio/S1.mp3", picture: "./Background/01.jpg" },
        { artist: "Reed Mathis", name: "Denver Avenue", url: "./Audio/s2.mp3", picture: "./Background/02.jpg" },
        { artist: "Delicate Steve", name: "Sunshine", url: "./Audio/s3.mp3", picture: "./Background/03.jpg" }];

        // play pause function//
    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                player_track.classList.add('active');
                music_status.classList.add('active');
                icon.attr('class', 'fas fa-pause');
                audio.play();
            }
            else {
                player_track.classList.remove('active');
                music_status.classList.remove('active');
                icon.attr('class', 'fas fa-play');
                audio.pause();
            }
        }, 300);
    }
    //select track//
    function selectTrack(flag) {
        if (flag == 0 || flag == 1)
            ++currIndex;
        else
            --currIndex;

        if ((currIndex > -1) && (currIndex < songs.length)) {
            if (flag == 0)
                icon.attr('class', 'fa fa-play');
            else {
                icon.attr('class', 'fa fa-pause');
            }
            currAlbum = songs[currIndex].name;
            currmusic_artist_name = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;
            audio.src = songs[currIndex].url;

            if (flag != 0) {
                audio.play();
                music_status.classList.add('active');
                player_track.classList.add('active');
            }
            music_name.textContent = currAlbum
            music_artist_name.textContent = currmusic_artist_name;
            $('#music-status img').prop('src', currArtwork);
        }
        else {
            if (flag == 0 || flag == 1)
                --currIndex;
            else
                ++currIndex;
        }
    }
    //click init//
    function initPlayer() {
        audio = new Audio();
        selectTrack(0);
        audio.loop = false;
        playPauseButton.on('click', playPause);
        playPreviousTrackButton.on('click', function () { selectTrack(-1); });
        playNextTrackButton.on('click', function () { selectTrack(1); });
    }
    initPlayer();

    //canvas, wave//
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const context = new AudioContext();
    let src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const Height = canvas.height;
    const Width = canvas.width;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (Width / bufferLength) * 10;

    let barHeight;
    let x = 0;

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 16384;
    function renderFrame() {
        if (context.state !== 'running') {
            context.resume();
        }
        requestAnimationFrame(renderFrame);
        x = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, Width, Height);
        let r, g, b;
        let bars = 118
        for (let i = 0; i < bars; i++) {
            barHeight = (dataArray[i] * 2.5);
            if (dataArray[i]) {
                r = 500
                g = 500
                b = 500
            }
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, (Height - barHeight), barWidth, barHeight);
            x += barWidth + 10
        }
    }
    renderFrame();
})