// ============================================
// 1. NAVIGATION — fond qui apparaît au scroll
// ============================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('is-scrolled');
  } else {
    nav.classList.remove('is-scrolled');
  }
});

// Menu mobile (hamburger)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Ferme le menu mobile quand on clique un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// 2. APPARITION PROGRESSIVE AU SCROLL
// IntersectionObserver regarde quels éléments
// entrent dans l'écran, et leur ajoute la classe
// .is-visible (qui déclenche l'animation CSS)
// ============================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target); // n'anime qu'une fois
    }
  });
}, {
  threshold: 0.15
});

revealEls.forEach(el => revealObserver.observe(el));

// ============================================
// 3. LECTEUR AUDIO PERSONNALISÉ (voix off)
// ============================================
const audio = document.getElementById('voiceAudio');
const voiceBtn = document.getElementById('voiceBtn');
const iconPlay = voiceBtn.querySelector('.icon-play');
const iconPause = voiceBtn.querySelector('.icon-pause');
const progressFill = document.getElementById('voiceProgressFill');
const progressTrack = document.querySelector('.voice-progress-track');
const currentTimeEl = document.getElementById('voiceCurrent');
const durationEl = document.getElementById('voiceDuration');

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Affiche la durée totale une fois le fichier chargé
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

// Bouton play / pause
voiceBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    iconPlay.hidden = true;
    iconPause.hidden = false;
  } else {
    audio.pause();
    iconPlay.hidden = false;
    iconPause.hidden = true;
  }
});

// Met à jour la barre de progression pendant la lecture
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Remet le bouton en position "play" à la fin
audio.addEventListener('ended', () => {
  iconPlay.hidden = false;
  iconPause.hidden = true;
  progressFill.style.width = '0%';
});

// Clic sur la barre = avancer/reculer dans l'audio
progressTrack.addEventListener('click', (e) => {
  const rect = progressTrack.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  audio.currentTime = percent * audio.duration;
});
