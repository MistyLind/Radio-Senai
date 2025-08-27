document.addEventListener('DOMContentLoaded', () => {
    console.log('[Radio Senai] 1. Página carregada. Iniciando script.');

    // === Seletores de Elementos do DOM ===
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const navLinks = { overview: document.getElementById('nav-overview'), search: document.getElementById('nav-search'), library: document.getElementById('nav-library'), podcasts: document.getElementById('nav-podcasts'), artists: document.getElementById('nav-artists'), playlists: document.getElementById('nav-playlists'), saved: document.getElementById('nav-saved'), };
    const mainViews = { overview: document.getElementById('overview-section'), search: document.getElementById('search-section'), artists: document.getElementById('artists-section'), playlists: document.getElementById('playlists-section'), saved: document.getElementById('saved-section'), };
    const searchInput = document.getElementById('search-input');
    const searchResultsListEl = document.getElementById('search-results-list');
    const artistsGridEl = document.getElementById('artists-grid');
    const savedSongsListEl = document.getElementById('saved-songs-list');
    const audio = document.getElementById('audio');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerPlayBtn = document.getElementById('player-play');
    const playerPrevBtn = playerPlayBtn.previousElementSibling;
    const playerNextBtn = playerPlayBtn.nextElementSibling;
    const playerProgressContainer = document.getElementById('player-progress-container');
    const playerProgress = document.getElementById('player-progress');
    const playerCurrentTimeEl = document.getElementById('player-current-time');
    const playerDurationEl = document.getElementById('player-duration');
    const playerVolumeSlider = document.getElementById('player-volume-slider');
    const songListEl = document.getElementById('song-list');

    // === DADOS DAS MÚSICAS ===
    const songs = [ { file: 'nirvana_smells_like_teen_spirit', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', cover: 'album_nevermind' }, { file: 'nirvana_come_as_you_are', title: 'Come As You Are', artist: 'Nirvana', album: 'Nevermind', cover: 'album_nevermind' }, { file: 'nirvana_lithium', title: 'Lithium', artist: 'Nirvana', album: 'Nevermind', cover: 'album_nevermind' }, { file: 'nirvana_in_bloom', title: 'In Bloom', artist: 'Nirvana', album: 'Nevermind', cover: 'album_nevermind' }, { file: 'nirvana_heart_shaped_box', title: 'Heart Shaped Box', artist: 'Nirvana', album: 'In Utero', cover: 'album_inutero' }, { file: 'nirvana_all_apologies', title: 'All Apologies', artist: 'Nirvana', album: 'In Utero', cover: 'album_inutero' }, { file: 'nirvana_rape_me', title: 'Rape Me', artist: 'Nirvana', album: 'In Utero', cover: 'album_inutero' }, { file: 'nirvana_about_a_girl', title: 'About a Girl', artist: 'Nirvana', album: 'Bleach', cover: 'album_bleach' }, { file: 'nirvana_love_buzz', title: 'Love Buzz', artist: 'Nirvana', album: 'Bleach', cover: 'album_bleach' }, { file: 'nirvana_the_man_who_sold_the_world', title: 'The Man Who Sold the World', artist: 'Nirvana', album: 'MTV Unplugged', cover: 'album_unplugged' } ];

    // === Variáveis de Estado ===
    let currentSongIndex = 0;
    let isPlaying = false;
    let savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];

    // === Definição de TODAS as Funções ===
    function formatTime(seconds) { if (isNaN(seconds) || seconds < 0) return '0:00'; const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; }
    function switchView(viewName) { console.log(`[Radio Senai] Trocando para a tela: ${viewName}`); for (const key in mainViews) { if (mainViews[key]) mainViews[key].classList.remove('active'); } for (const key in navLinks) { if (navLinks[key]) navLinks[key].classList.remove('active'); } if (mainViews[viewName] && navLinks[viewName]) { mainViews[viewName].classList.add('active'); navLinks[viewName].classList.add('active'); } }
    function performSearch() { const searchTerm = searchInput.value.toLowerCase(); if (searchTerm.trim() === '') { searchResultsListEl.innerHTML = '<p>Digite para buscar...</p>'; return; } const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm)); renderSongList(filteredSongs, searchResultsListEl); }
    function renderSongList(songArray, container) { container.innerHTML = ''; if (songArray.length === 0) { container.innerHTML = '<p>Nenhuma música encontrada.</p>'; return; } songArray.forEach(song => { const originalIndex = songs.findIndex(s => s.file === song.file); const li = document.createElement('li'); li.setAttribute('data-index', originalIndex); li.innerHTML = ` <span class="song-number">*</span> <div class="song-cover"><img src="images/${song.cover}.jpg" alt="${song.album}"></div> <div class="song-details"><span class="song-title">${song.title}</span><span class="song-artist">${song.artist}</span></div> <span class="song-album">${song.album}</span> <span class="song-duration">--:--</span> <span class="song-favorite"><i class="far fa-heart"></i></span> `; container.appendChild(li); }); updateHeartIcons(); }
    function renderArtists() { const artists = [...new Set(songs.map(song => song.artist))]; artistsGridEl.innerHTML = ''; artists.forEach(artistName => { const artistSong = songs.find(song => song.artist === artistName); const artistCard = document.createElement('div'); artistCard.className = 'artist-card'; artistCard.innerHTML = ` <img src="images/${artistSong.cover}.jpg" alt="${artistName}"> <p class="artist-name">${artistName}</p> `; artistCard.addEventListener('click', () => { searchInput.value = artistName; performSearch(); switchView('search'); }); artistsGridEl.appendChild(artistCard); }); }
    function renderSavedSongs() { const savedSongsData = songs.filter(song => savedSongs.includes(song.file)); renderSongList(savedSongsData, savedSongsListEl); }
    
    function loadSong(song) {
        console.log(`[Radio Senai] Carregando música: ${song.title}`);
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        audio.src = `music/${song.file}.mp3`;
        playerCover.src = `images/${song.cover}.jpg`;
        updateSongListUI();
    }

    function updateSongListUI() { const allListItems = document.querySelectorAll('.song-list li'); allListItems.forEach(item => { const index = parseInt(item.getAttribute('data-index')); if (index === currentSongIndex) { item.classList.add('playing'); } else { item.classList.remove('playing'); } }); updateHeartIcons(); }
    
    // --- LÓGICA DE PLAY/PAUSE SIMPLIFICADA E ROBUSTA ---
    function playSong() {
        console.log("[Radio Senai] Chamando playSong()");
        isPlaying = true;
        // Usando add/remove em vez de replace para mais clareza
        playerPlayBtn.querySelector('i.fas').classList.remove('fa-play');
        playerPlayBtn.querySelector('i.fas').classList.add('fa-pause');
        audio.play();
        console.log("[Radio Senai] Comando audio.play() executado.");
        updateSongListUI();
    }

    function pauseSong() {
        console.log("[Radio Senai] Chamando pauseSong()");
        isPlaying = false;
        playerPlayBtn.querySelector('i.fas').classList.remove('fa-pause');
        playerPlayBtn.querySelector('i.fas').classList.add('fa-play');
        audio.pause();
        console.log("[Radio Senai] Comando audio.pause() executado.");
    }
    
    function togglePlayPause() {
        console.log(`[Radio Senai] Alternando Play/Pause. Estado atual isPlaying: ${isPlaying}`);
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
    // ---------------------------------------------------------

    function playPrevSong() { currentSongIndex--; if (currentSongIndex < 0) currentSongIndex = songs.length - 1; loadSong(songs[currentSongIndex]); playSong(); }
    function playNextSong() { currentSongIndex++; if (currentSongIndex > songs.length - 1) currentSongIndex = 0; loadSong(songs[currentSongIndex]); playSong(); }
    function updateProgress(e) { const { duration, currentTime } = e.srcElement; const progressPercent = (currentTime / duration) * 100; playerProgress.style.width = `${progressPercent}%`; playerCurrentTimeEl.textContent = formatTime(currentTime); }
    function setProgress(e) { const width = this.clientWidth; const clickX = e.offsetX; const duration = audio.duration; if (!isNaN(duration)) { audio.currentTime = (clickX / width) * duration; } }
    function setVolume(e) { audio.volume = e.target.value; }
    
    function playSongByIndex(index) {
        console.log(`[Radio Senai] Tocando música pelo índice: ${index}`);
        currentSongIndex = index;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function toggleSaveSong(index) { const songFile = songs[index].file; const songIndexInSaved = savedSongs.indexOf(songFile); if (songIndexInSaved === -1) { savedSongs.push(songFile); } else { savedSongs.splice(songIndexInSaved, 1); } localStorage.setItem('savedSongs', JSON.stringify(savedSongs)); updateHeartIcons(); }
    function updateHeartIcons() { const allHeartIcons = document.querySelectorAll('.song-favorite i'); allHeartIcons.forEach(icon => { const li = icon.closest('li'); if (li) { const index = parseInt(li.getAttribute('data-index')); const songFile = songs[index].file; if (savedSongs.includes(songFile)) { icon.classList.remove('far'); icon.classList.add('fas'); } else { icon.classList.remove('fas'); icon.classList.add('far'); } } }); }
    function handleLogin(event) { event.preventDefault(); if (usernameInput.value.trim() !== '') { console.log('[Radio Senai] Login bem-sucedido.'); localStorage.setItem('isLoggedIn', 'true'); loginContainer.classList.add('hidden'); appContainer.classList.remove('hidden'); initializePlayer(); } else { alert('Por favor, digite um nome de usuário.'); } }
    function handleLogout(event) { event.preventDefault(); localStorage.removeItem('isLoggedIn'); location.reload(); }
    
    function initializePlayer() {
        console.log('[Radio Senai] 3. Inicializando o player...');
        navLinks.overview.addEventListener('click', (e) => { e.preventDefault(); switchView('overview'); });
        navLinks.search.addEventListener('click', (e) => { e.preventDefault(); switchView('search'); });
        navLinks.artists.addEventListener('click', (e) => { e.preventDefault(); switchView('artists'); });
        navLinks.playlists.addEventListener('click', (e) => { e.preventDefault(); switchView('playlists'); });
        navLinks.saved.addEventListener('click', (e) => { e.preventDefault(); renderSavedSongs(); switchView('saved'); });
        searchInput.addEventListener('input', performSearch);
        
        playerPlayBtn.addEventListener('click', togglePlayPause); // Usando a nova função toggle
        
        playerPrevBtn.addEventListener('click', playPrevSong);
        playerNextBtn.addEventListener('click', playNextSong);
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', playNextSong);
        audio.addEventListener('loadedmetadata', () => { playerDurationEl.textContent = formatTime(audio.duration); });
        playerProgressContainer.addEventListener('click', setProgress);
        playerVolumeSlider.addEventListener('input', setVolume);

        document.querySelector('.main-content').addEventListener('click', (e) => {
            console.log('[Radio Senai] Clique detectado no conteúdo principal.');
            const favoriteIcon = e.target.closest('.song-favorite i');
            const songLi = e.target.closest('.song-list li');
            const playButtonBanner = e.target.closest('.play-button');

            if (favoriteIcon) {
                console.log('[Radio Senai] Clique no ícone de favorito.');
                const index = parseInt(songLi.getAttribute('data-index'));
                toggleSaveSong(index);
            } else if (songLi) {
                console.log('[Radio Senai] Clique em uma música na lista.');
                const index = parseInt(songLi.getAttribute('data-index'));
                if (index !== currentSongIndex) {
                    playSongByIndex(index);
                } else {
                    togglePlayPause();
                }
            } else if (playButtonBanner) {
                console.log('[Radio Senai] Clique no botão de play do banner.');
                playSong();
            }
        });

        renderSongList(songs, songListEl);
        renderArtists();
        loadSong(songs[currentSongIndex]);
        audio.volume = playerVolumeSlider.value;
        switchView('overview');
        console.log('[Radio Senai] 4. Player inicializado com sucesso.');
    }

    function checkAuth() {
        console.log('[Radio Senai] 2. Verificando autenticação...');
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            initializePlayer();
        } else {
            loginContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    }

    // === EXECUÇÃO INICIAL ===
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    checkAuth();
});