// ============================================================
//  MAIN.JS — Interactive Birthday Website for Rara
//  Clean, matched to current HTML + style.css
// ============================================================

var CFG = window.CONFIG;

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
//  1. POPULATE CONFIG VALUES
// ============================================================
function populateText() {
  $$('[data-name]').forEach(el => { el.textContent = CFG.recipientName; });
  $$('[data-nick]').forEach(el => { el.textContent = CFG.recipientNickname; });
  $$('[data-sender]').forEach(el => { el.textContent = CFG.senderName; });
  $$('[data-msg]').forEach(el => { el.textContent = CFG.personalMessage; });

  const easterMsg = $('#easterMsg');
  if (easterMsg && CFG.easterEggMessage) {
    easterMsg.textContent = CFG.easterEggMessage;
  }
}

// ============================================================
//  2. CONFETTI
// ============================================================
let confettiLib = null;

async function loadConfetti() {
  if (confettiLib) return confettiLib;
  return new Promise(resolve => {
    if (window.confetti) {
      confettiLib = window.confetti;
      resolve(confettiLib);
      return;
    }
    let tries = 0;
    const id = setInterval(() => {
      if (window.confetti || tries++ > 25) {
        confettiLib = window.confetti || null;
        clearInterval(id);
        resolve(confettiLib);
      }
    }, 80);
  });
}

async function fireConfetti(opts = {}) {
  const c = await loadConfetti();
  if (!c) return;
  c({
    particleCount: opts.count ?? 100,
    spread: opts.spread ?? 80,
    origin: { y: opts.originY ?? 0.55, x: opts.originX ?? 0.5 },
    colors: opts.colors ?? ['#D4603A', '#C8923A', '#E0D8CE', '#F2EBE0', '#A84828', '#FAF7F2'],
    scalar: opts.scalar ?? 1,
    ...opts,
  });
}

async function fireBigConfetti() {
  const c = await loadConfetti();
  if (!c) return;
  const colors = ['#D4603A', '#C8923A', '#E0D8CE', '#F2EBE0', '#A84828'];
  const shoot = (angle, x) => c({
    particleCount: 70,
    angle,
    spread: 55,
    origin: { x, y: 0.65 },
    colors,
    scalar: 1.05,
  });
  shoot(60, 0.15);
  setTimeout(() => shoot(120, 0.85), 180);
  setTimeout(() => fireConfetti({ count: 90, originY: 0.35, colors }), 420);
}

// ============================================================
//  3. MUSIC
// ============================================================
let audio = null;
let musicStarted = false;
let musicReady = false;

function initMusic() {
  const btn = $('#musicBtn');
  if (!btn) return;

  // Always show button so user can tap; hide only if explicitly disabled
  btn.style.display = 'flex';

  const file = (CFG.musicFile || '').trim();
  if (!file) {
    btn.classList.add('is-off');
    btn.title = 'Tidak ada file musik';
    btn.addEventListener('click', () => showToast('Belum ada file musik di folder'));
    return;
  }

  audio = new Audio(file);
  audio.loop = true;
  audio.volume = 0.32;
  audio.preload = 'auto';

  audio.addEventListener('canplaythrough', () => {
    musicReady = true;
    btn.classList.remove('is-off');
  }, { once: true });

  audio.addEventListener('error', () => {
    musicReady = false;
    audio = null;
    btn.classList.add('is-off');
    btn.title = 'File musik tidak ditemukan';
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMusic();
  });
}

function startMusicOnInteraction() {
  if (musicStarted || !audio) return;
  musicStarted = true;
  const playPromise = audio.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(() => {
      // Autoplay blocked — user can tap the button
      updateMusicBtn();
    });
  }
  updateMusicBtn();
}

function toggleMusic() {
  if (!audio) {
    showToast('Taruh birthday-music.mp3 di folder yang sama');
    return;
  }
  if (audio.paused) {
    audio.play().then(() => {
      musicStarted = true;
      updateMusicBtn();
    }).catch(() => {
      showToast('Browser memblokir audio — coba tap lagi');
    });
  } else {
    audio.pause();
    updateMusicBtn();
  }
}

function updateMusicBtn() {
  const btn = $('#musicBtn');
  if (!btn) return;
  if (!audio) {
    btn.textContent = '🔇';
    btn.classList.add('is-off');
    return;
  }
  const paused = audio.paused;
  btn.textContent = paused ? '🔇' : '🎵';
  btn.classList.toggle('is-off', paused);
  btn.setAttribute('aria-label', paused ? 'Putar musik' : 'Hentikan musik');
}

// ============================================================
//  4. INTRO — envelope open
// ============================================================
function initIntro() {
  const intro    = $('#intro');
  const envelope = $('#envelope');
  const btnOpen  = $('#btnOpen');

  if (!intro) return;

  let opening = false;

  async function openEnvelope(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (opening || intro.classList.contains('hidden')) return;
    opening = true;

    // Immediately block further clicks on intro
    intro.classList.add('is-closing');
    envelope?.classList.add('opening');

    // Confetti (non-blocking if CDN slow)
    fireConfetti({ count: 70, originY: 0.55 });

    // Start music + hero right away
    startMusicOnInteraction();
    triggerHeroAnimation();
    document.body.style.overflow = '';

    // Finish hide after short fade
    setTimeout(() => {
      intro.classList.add('hidden');
      // Ensure content near top is visible (no blank sections)
      document.querySelectorAll('.reveal, .wish-card, .photo-item').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.3) el.classList.add('visible');
      });
    }, 500);
  }

  btnOpen?.addEventListener('click', openEnvelope);
  envelope?.addEventListener('click', openEnvelope);
  envelope?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope(e);
    }
  });

  document.body.style.overflow = 'hidden';
}

// ============================================================
//  5. HERO REVEAL
// ============================================================
let heroAnimated = false;

function triggerHeroAnimation() {
  if (heroAnimated) return;
  heroAnimated = true;

  const meta   = $('#hero-meta');
  const title  = $('#hero-title');
  const sub    = $('#hero-sub');
  const scroll = $('#hero-scroll');

  setTimeout(() => meta?.classList.add('visible'), 80);
  setTimeout(() => title?.classList.add('visible'), 280);
  setTimeout(() => sub?.classList.add('visible'), 520);
  setTimeout(() => scroll?.classList.add('visible'), 780);
}

// ============================================================
//  6. CAKE + CANDLES + MIC
// ============================================================
function initCake() {
  const wraps = $$('.candle-wrap');
  let lit = wraps.length;
  let wishShown = false;

  function blowOut(wrap) {
    const flame = $('.flame', wrap);
    const smoke = $('.smoke', wrap);
    if (!flame || flame.classList.contains('out')) return;
    flame.classList.add('out');
    smoke?.classList.add('show');
    lit--;
    if (lit === 0 && !wishShown) showWish();
  }

  wraps.forEach(w => {
    w.addEventListener('click', () => blowOut(w));
    w.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        blowOut(w);
      }
    });
  });

  let micOn = false;
  const btnMic = $('#btnMic');
  const hint   = $('#blowHint');

  btnMic?.addEventListener('click', async () => {
    if (micOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micOn = true;
      btnMic.style.display = 'none';
      if (hint) hint.textContent = '🎤 tiup sekarang…';
      startBlowDetection(stream, blowOut, wraps);
    } catch {
      if (btnMic) btnMic.textContent = 'klik lilinnya saja';
    }
  });

  function startBlowDetection(stream, blowFn, candleWraps) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let last = 0;

    function tick() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      if (avg > 26 && Date.now() - last > 380) {
        last = Date.now();
        const stillLit = candleWraps.filter(w => !$('.flame.out', w));
        if (stillLit.length) blowFn(stillLit[Math.floor(Math.random() * stillLit.length)]);
      }
      if (candleWraps.some(w => !$('.flame.out', w))) {
        requestAnimationFrame(tick);
      } else {
        stream.getTracks().forEach(t => t.stop());
        ctx.close();
      }
    }
    requestAnimationFrame(tick);
  }

  async function showWish() {
    wishShown = true;
    await fireBigConfetti();
    $('#cakeWish')?.classList.add('show');
  }
}

// ============================================================
//  7. CARDS — build + nav
// ============================================================
function buildCards() {
  const track = $('#cardsTrack');
  const dots  = $('#cardsDots');
  if (!track) return;

  CFG.cards.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.setAttribute('role', 'article');
    card.innerHTML = `
      <span class="card-num">0${i + 1}</span>
      <div class="card-emoji">${c.emoji}</div>
      <p class="card-text">${c.text}</p>
    `;
    track.appendChild(card);

    if (dots) {
      const dot = document.createElement('button');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Kartu ${i + 1}`);
      dots.appendChild(dot);
    }
  });
}

function initCards() {
  const track = $('#cardsTrack');
  const dots  = $$('.nav-dot');
  if (!track || !dots.length) return;

  function updateDots() {
    const cards = $$('.wish-card', track);
    if (!cards.length) return;
    const cardW = cards[0].offsetWidth || 280;
    const idx = Math.round(track.scrollLeft / (cardW + 1));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  track.addEventListener('scroll', updateDots, { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = $$('.wish-card', track);
      cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
}

// ============================================================
//  8. GIFT BOXES
// ============================================================
function buildGiftBoxes() {
  const container = $('#giftBoxesContainer');
  if (!container) return;

  CFG.giftBoxes.forEach((g, i) => {
    const btn = document.createElement('button');
    btn.className = 'gift-box-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Buka kado ${i + 1}`);
    btn.dataset.index = i;
    btn.innerHTML = `
      <span class="box-emoji">${g.emoji}</span>
      <span class="box-label">Kado ${i + 1}</span>
    `;
    container.appendChild(btn);
  });
}

function initGiftBoxes() {
  const boxes   = $$('.gift-box-btn');
  const reveal  = $('#giftReveal');
  const emojiEl = $('#revealEmoji');
  const titleEl = $('#revealTitle');
  const textEl  = $('#revealText');

  boxes.forEach((box, i) => {
    box.addEventListener('click', () => {
      if (box.classList.contains('opened')) return;
      boxes.forEach(b => b.classList.remove('opened'));
      box.classList.add('opened');

      const gift = CFG.giftBoxes[i];
      if (!gift || !reveal) return;

      reveal.classList.remove('show');
      setTimeout(() => {
        if (emojiEl) emojiEl.textContent = gift.emoji;
        if (titleEl) titleEl.textContent = gift.title;
        if (textEl)  textEl.textContent  = gift.text;
        reveal.classList.add('show');
        fireConfetti({ count: 45, originY: 0.72, spread: 65 });
      }, 40);
    });
  });
}

// ============================================================
//  9. SHARE + WHATSAPP
// ============================================================
function initSharing() {
  const btnShare = $('#btnShare');
  const btnWa    = $('#btnWA');

  btnShare?.addEventListener('click', async () => {
    const shareData = {
      title: CFG.ogTitle,
      text:  CFG.ogDescription,
      url:   CFG.siteUrl && !CFG.siteUrl.includes('your-site')
               ? CFG.siteUrl
               : location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link disalin 🔗');
    } catch {
      showToast('Salin link dari address bar');
    }
  });

  btnWa?.addEventListener('click', () => {
    const msg = encodeURIComponent('Makasih ya buat websitenya! 😊');
    const num = CFG.whatsappNumber || '';
    if (!num || num.includes('xxxx')) {
      showToast('Nomor WA belum diisi di config.js');
      return;
    }
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  });
}

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============================================================
//  10. EASTER EGG — tap name 5×
// ============================================================
function initEasterEgg() {
  const nameEl   = $('#heroName');
  const banner   = $('#easterBanner');
  const closeBtn = $('#easterClose');
  if (!nameEl || !banner) return;

  let taps = 0;
  let timer = null;

  nameEl.addEventListener('click', async () => {
    taps++;
    clearTimeout(timer);
    timer = setTimeout(() => { taps = 0; }, 1600);

    if (taps >= 5) {
      taps = 0;
      banner.classList.add('show');
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          fireConfetti({
            count: 70,
            spread: 110,
            originY: 0.25 + Math.random() * 0.4,
            originX: Math.random(),
          });
        }, i * 260);
      }
    }
  });

  closeBtn?.addEventListener('click', () => banner.classList.remove('show'));
  banner?.addEventListener('click', e => {
    if (e.target === banner) banner.classList.remove('show');
  });
}

// ============================================================
//  11. SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        $$('.wish-card, .photo-item', e.target).forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 70);
        });
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
  );

  $$('.reveal, .wish-card, .personal-card, .photo-item').forEach(el => io.observe(el));

  // Safety: after intro, force-show anything already in/near viewport
  setTimeout(() => {
    $$('.reveal, .wish-card, .photo-item').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.15) el.classList.add('visible');
    });
  }, 900);
}

// ============================================================
//  12. BUILD CANDLES
// ============================================================
function buildCandles() {
  const container = $('#candlesContainer');
  if (!container) return;

  const colors = [
    ['#E07A5F', '#D4603A'],
    ['#C8923A', '#B07A2A'],
    ['#A84828', '#8C3A20'],
  ];

  colors.forEach(([base, top], i) => {
    const wrap = document.createElement('div');
    wrap.className = 'candle-wrap';
    wrap.setAttribute('role', 'button');
    wrap.tabIndex = 0;
    wrap.setAttribute('aria-label', `Lilin ${i + 1}`);
    wrap.innerHTML = `
      <div class="flame" aria-hidden="true">
        <div class="flame-outer"></div>
        <div class="flame-inner"></div>
      </div>
      <div class="candle" style="background: linear-gradient(180deg, ${top} 0%, ${base} 100%);">
        <div class="candle-wick"></div>
      </div>
      <div class="smoke" aria-hidden="true"></div>
    `;
    container.appendChild(wrap);
  });
}

// ============================================================
//  INIT
// ============================================================
function boot() {
  try {
    populateText();
    buildCandles();
    buildCards();
    buildGiftBoxes();
    initMusic();
    initIntro();
    initCake();
    initCards();
    initGiftBoxes();
    initSharing();
    initEasterEgg();
    initScrollReveal();
    initGenerator();
    initCapsule();
  } catch (err) {
    console.error('boot error', err);
    // Emergency: still allow opening intro
    var intro = document.getElementById('intro');
    var btn = document.getElementById('btnOpen');
    if (btn && intro) {
      btn.onclick = function () {
        intro.classList.add('is-closing', 'hidden');
        document.body.style.overflow = '';
      };
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// ============================================================
//  13. GENERATOR PESAN ACAK
// ============================================================
function initGenerator() {
  const btn = $('#btnGen');
  const textEl = $('#genText');
  const iconEl = $('#genIcon');
  if (!btn || !textEl) return;

  const messages = CFG.wishes || [
    "🌈 Tahun ini bakal ada satu momen yang bikin kamu bilang 'oh, ini toh maksudnya'.",
    "☕ Besok pagi kopinya enak, harinya oke, dan semuanya berjalan lebih ringan.",
    "🌸 Orang yang kamu butuhin bakal ada di saat yang tepat — nggak terlambat.",
    "🎵 Ada satu lagu yang bakal jadi soundtrack momen terbaik kamu tahun ini.",
    "🦋 Kamu udah berkembang lebih dari yang kamu sadarin sendiri."
  ];

  let lastIdx = -1;

  btn.addEventListener('click', () => {
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * messages.length);
    } while (randIdx === lastIdx && messages.length > 1);

    lastIdx = randIdx;
    const raw = messages[randIdx];
    const parts = raw.split(' ');
    const maybeEmoji = parts[0];
    const hasEmoji = /\p{Emoji}/u.test(maybeEmoji) && maybeEmoji.length <= 4;

    textEl.style.opacity = '0';
    setTimeout(() => {
      if (hasEmoji && iconEl) {
        iconEl.textContent = maybeEmoji;
        textEl.textContent = parts.slice(1).join(' ');
      } else {
        textEl.textContent = raw;
      }
      textEl.style.opacity = '1';
      fireConfetti({ count: 25, originY: 0.65, spread: 45 });
    }, 150);
  });
}

// ============================================================
//  14. KAPSUL HARAPAN (LOCALSTORAGE)
// ============================================================
function initCapsule() {
  const input = $('#capsuleInput');
  const btnSave = $('#btnSaveCapsule');
  const btnClear = $('#btnClearCapsule');
  const msgEl = $('#capsuleSavedMsg');
  if (!input || !btnSave) return;

  const STORAGE_KEY = 'rara_birthday_wish_2026';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    input.value = saved;
    if (msgEl) msgEl.textContent = '✓ harapan tersimpan di perangkat ini';
    if (btnClear) btnClear.style.display = 'inline-flex';
  }

  btnSave.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      showToast('Tulis harapannya dulu ya ✍️');
      return;
    }
    localStorage.setItem(STORAGE_KEY, val);
    if (msgEl) msgEl.textContent = '✓ harapan tersimpan — semoga segera terwujud ✨';
    if (btnClear) btnClear.style.display = 'inline-flex';
    fireConfetti({ count: 35, originY: 0.7, spread: 55 });
    showToast('Harapan disimpan 🔒');
  });

  btnClear?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    input.value = '';
    if (msgEl) msgEl.textContent = '';
    btnClear.style.display = 'none';
    showToast('Harapan dihapus');
  });
}