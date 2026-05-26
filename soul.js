// ═══ PROGRAM DATA ═══
const programs = [
  { id: 1, title: 'אירועי תורת חיים תשפ"ו', desc: 'אירועים קהילתיים ורוחניים לכלל תלמידי הרשת – חוויות שמחברות ומחזקות זהות יהודית.', badge: 'אירועים', file: 'P/WhatsApp Image 2026-05-19 at 05.48.01.jpeg',
    cats: ['ימי שיא'] },
  { id: 2, title: 'השתלמויות תשפ"ו', desc: 'רישום ועדכון ההכשרות לתשפז - יפורסם בקרוב...', badge: 'לוח שנה', file: 'P/אירועים שנתיים תשפו פלייר.jpg',
    cats: ['הכשרת צוותים'] },
  { id: 3, title: 'אמון ואמונה', desc: 'תוכנית חווייתית לפיתוח חוסן אמוני לתלמידים – דרך העמקה ב-8 עקרונות רוחניים.', badge: 'חוסן אמוני', file: 'P/אמון ואמונה פלייר תשפו.jpg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 4, title: 'תוכנית בר/בת מצווה', desc: 'מסלול מקיף ומרתק לקראת בר ובת מצווה – חוויות, ספר לימוד, ליווי אישי ואירועי שיא.', badge: 'בר/בת מצווה', file: 'P/בר מצווה פלייר.jpg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 5, title: 'הישיבה הקהילתית – בנים', desc: 'חוויית לימוד ישיבתית אותנטית בתוך בית הספר – לימוד עמוק, מפגש בין-גילאי וקהילה.', badge: 'לימוד מעמיק', file: 'P/הישיבה הקהילתית בנים פלייר.jpg',
    cats: ['בית מדרש'] },
  { id: 6, title: 'מסע זהות יהודית – הרב זקס', desc: 'מסלול דיגיטלי עשיר על פי משנתו של הרב יונתן זקס – מסע לזהות היהודית הייחודית ביותר.', badge: 'זהות יהודית', file: 'P/הרב זקס פלייר תשפו.jpg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 7, title: 'מושגי יסוד ביהדות', desc: 'יחידות ללימוד חווייתי ומעמיק של מושגי יסוד – שמע ישראל, מצוות, קידוש ועוד.', badge: 'יחידות לימוד', file: 'P/מושגי יסוד יהדות פלייר.jpg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 8, title: 'מסורת בית אבא', desc: 'תוכנית ייחודית שמחברת בין מסורת לחיים המודרניים – דרך עולם הגסטרונומיה היהודית.', badge: 'תרבות יהודית', file: 'P/פלייר בבאסאלי.jpg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 9, title: 'תפילה – תשפ"ו', desc: 'תוכנית לפיתוח קשר אותנטי לתפילה – כלים מעשיים למורים ולתלמידים לתפילה חיה ומשמעותית.', badge: 'תפילה', file: 'P/WhatsApp Image 2026-05-26 at 20.48.18 (1).jpeg',
    cats: ['מסעות זהות לתלמידים'] },
  { id: 10, title: 'בית מדרש מורים', desc: 'תוכנית בית מדרש לצוותים חינוכיים ומורים – לימוד משותף וצמיחה רוחנית.', badge: 'בית מדרש', file: 'P/BMD_M.jpeg',
    cats: ['בית מדרש'] },
  { id: 11, title: 'בית מדרש- קהילת הבנות', desc: 'מדרשת נוטעות שמים לתלמידות קהילת הבנות', badge: 'שואפות גבוהה', file: 'P/WhatsApp Image 2026-05-25 at 23.56.44.jpeg',
    cats: ['בית מדרש'] },
];

// Active filter categories (default to first)
let activeFilters = new Set(['מסעות זהות לתלמידים']);

// ═══ RENDER CARDS ═══
function getColorForCategory(cat) {
  if (cat.includes('שיא')) return 'var(--blue-light)';
  if (cat.includes('תלמידים')) return 'var(--lime)';
  if (cat.includes('צוותים')) return 'var(--green)';
  return 'var(--blue-mid)';
}

function renderCards() {
  const grid = document.getElementById('programGrid');
  const filtered = programs.filter(p => p.cats.some(c => activeFilters.has(c)));
  grid.innerHTML = filtered.map((p, i) => `
    <article class="program-card reveal" style="transition-delay:${i * 0.07}s"
      onclick="openModal(${p.id})" role="button" tabindex="0"
      aria-label="פרטים על ${p.title}"
      onkeydown="if(event.key==='Enter')openModal(${p.id})">
      <div class="program-card-clamp"></div>
      <div class="card-img-wrap">
        <img src="${p.file}" alt="${p.title}" class="card-img" loading="lazy" />
        <div class="card-overlay">
          <button class="card-overlay-btn" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            פרטים נוספים
          </button>
        </div>
      </div>
      <div class="card-body">
        <span class="card-badge">
          <span class="color-dot" style="background: ${getColorForCategory(p.cats[0])}; width: 10px; height: 10px; box-shadow: none; margin-left: 4px; animation: none; vertical-align: middle;"></span>
          ${p.badge}
        </span>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <button class="card-cta" tabindex="-1" onclick="event.stopPropagation();openModal(${p.id})">לפרטים נוספים והרשמה 🖌️</button>
        </div>
      </div>
    </article>
  `).join('');
  observeReveal();
}

// ═══ FILTER BAR ═══
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const ALL_CATS = ['ימי שיא', 'מסעות זהות לתלמידים', 'הכשרת צוותים'];

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const isActive = activeFilters.has(cat);

      if (isActive) return; // Single select: ignore if already active

      // Clear all
      activeFilters.clear();
      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });

      // Set clicked
      activeFilters.add(cat);
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      renderCards();
    });
  });
}


// ═══ MODAL ═══
const backdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalFlyerImg = document.getElementById('modalFlyerImg');
const modalEnlargeBtn = document.getElementById('modalEnlargeBtn');

function openModal(id) {
  const p = programs.find(x => x.id === id);
  if (!p) return;
  modalFlyerImg.src = p.file;
  modalFlyerImg.alt = p.title;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  backdrop.dataset.program = p.title;
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });

// ═══ ENLARGE BUTTON → LIGHTBOX ═══
modalEnlargeBtn.addEventListener('click', () => {
  openLightbox(modalFlyerImg.src);
});

// ═══ LIGHTBOX ═══
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src) {
  lightboxImg.src = src;
  lightboxBackdrop.classList.add('open');
}

function closeLightbox() {
  lightboxBackdrop.classList.remove('open');
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', e => { if (e.target === lightboxBackdrop) closeLightbox(); });


// ═══ SCROLL REVEAL ═══
function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ═══ MULTI-LAYER 3D PARALLAX ═══
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const layers = hero.querySelectorAll('.hero-parallax-layer[data-depth]');
  if (!layers.length) return;

  // ── Robust iOS / iPhone Detection ──
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Apply fallback immediately on iOS to prevent any zoom/shift and display original image
  if (isIOS) {
    hero.classList.add('hero-use-fallback');
  }

  // ── State ──
  let scrollY = 0;
  let mouseX = 0, mouseY = 0;       // normalized -1..1
  let gyroX = 0, gyroY = 0;         // normalized -1..1
  let currentScroll = 0;
  let currentMouseX = 0, currentMouseY = 0;
  let currentGyroX = 0, currentGyroY = 0;
  let ticking = false;

  const LERP = 0.08;  // smoothing factor (lower = smoother / slower)
  const SCROLL_MULTIPLIER = 80;    // max px shift for scroll
  const MOUSE_MULTIPLIER  = 25;    // max px shift for mouse
  const GYRO_MULTIPLIER   = 20;    // max px shift for gyroscope

  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Check accessibility ──
  function isReduced() {
    return document.body.classList.contains('a11y-no-animations') ||
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Scroll tracking ──
  window.addEventListener('scroll', () => {
    if (isIOS) return; // Disable scroll tracking on iOS
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    scrollY = -rect.top / heroH;
    scheduleUpdate();
  }, { passive: true });

  // ── Mouse tracking (desktop only) ──
  hero.addEventListener('mousemove', (e) => {
    if (isIOS) return;
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;  // -1..1
    mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;  // -1..1
    scheduleUpdate();
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (isIOS) return;
    mouseX = 0; mouseY = 0;
    scheduleUpdate();
  }, { passive: true });

  // ── Gyroscope tracking (mobile/tablet) ──
  function handleOrientation(e) {
    if (isIOS) return;
    const beta  = Math.max(-30, Math.min(30, e.beta  || 0));
    const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
    gyroX = gamma / 30;  // -1..1
    gyroY = beta  / 30;  // -1..1
    scheduleUpdate();
  }

  function initGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires user gesture to grant permission (we skip on iOS anyway but keep as fallback)
      hero.addEventListener('click', function reqGyro() {
        DeviceOrientationEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          })
          .catch(() => {});
        hero.removeEventListener('click', reqGyro);
      }, { once: true });
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  // Only init gyroscope on touch devices that are not iOS (no permission dialog needed)
  if (!isIOS && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    initGyroscope();
  }

  // ── Render loop ──
  function scheduleUpdate() {
    if (isIOS) return; // Do not schedule updates on iOS
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateLayers);
    }
  }

  function updateLayers() {
    const reduced = isReduced();
    if (reduced) {
      hero.classList.add('hero-use-fallback');
      layers.forEach(layer => { layer.style.transform = 'translate3d(0,0,0)'; });
      ticking = false;
      return;
    } else if (!isIOS) {
      hero.classList.remove('hero-use-fallback');
    }

    // Smooth interpolation
    currentScroll = lerp(currentScroll, scrollY, LERP * 2);
    currentMouseX = lerp(currentMouseX, mouseX, LERP);
    currentMouseY = lerp(currentMouseY, mouseY, LERP);
    currentGyroX  = lerp(currentGyroX,  gyroX,  LERP);
    currentGyroY  = lerp(currentGyroY,  gyroY,  LERP);

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0;

      const sY = currentScroll * SCROLL_MULTIPLIER * depth;
      const mX = currentMouseX * MOUSE_MULTIPLIER * depth;
      const mY = currentMouseY * MOUSE_MULTIPLIER * depth * 0.6;
      const gX = currentGyroX  * GYRO_MULTIPLIER  * depth;
      const gY = currentGyroY  * GYRO_MULTIPLIER  * depth * 0.6;

      const totalX = mX + gX;
      const totalY = sY + mY + gY;

      layer.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)`;
    });

    // Keep animating while values are interpolating (not settled)
    const scrollDiff = Math.abs(scrollY - currentScroll);
    const mouseDiffX = Math.abs(mouseX - currentMouseX);
    const mouseDiffY = Math.abs(mouseY - currentMouseY);
    const gyroDiffX  = Math.abs(gyroX - currentGyroX);
    const gyroDiffY  = Math.abs(gyroY - currentGyroY);

    if (scrollDiff > 0.001 || mouseDiffX > 0.001 || mouseDiffY > 0.001 ||
        gyroDiffX > 0.001 || gyroDiffY > 0.001) {
      requestAnimationFrame(updateLayers);
    } else {
      ticking = false;
    }
  }

  // Initial render
  if (!isIOS) {
    scheduleUpdate();
  } else {
    // Reset transforms for iOS just in case
    layers.forEach(layer => { layer.style.transform = 'translate3d(0,0,0)'; });
  }
}

// ═══ HERO IMAGE FALLBACK ═══
(function() {
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', function() {
      this.style.display = 'none';
      document.querySelector('.hero').style.background =
        'linear-gradient(135deg, #002d56 0%, #1a6fab 50%, #00aeef 100%)';
    });
  }
})();

// ═══ ACCESSIBILITY ═══
function initAccessibility() {
  const toggle = document.getElementById('a11yToggle');
  const panel = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yPanelClose');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', !isOpen);
  });
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  });

  let fontScale = 0;
  document.getElementById('a11yFontInc').addEventListener('click', () => {
    fontScale = Math.min(fontScale + 1, 4);
    document.documentElement.style.fontSize = (100 + fontScale * 10) + '%';
  });
  document.getElementById('a11yFontDec').addEventListener('click', () => {
    fontScale = Math.max(fontScale - 1, -2);
    document.documentElement.style.fontSize = (100 + fontScale * 10) + '%';
  });

  const toggleClass = (btnId, cls) => {
    document.getElementById(btnId).addEventListener('click', function() {
      document.body.classList.toggle(cls);
      this.classList.toggle('active');
    });
  };
  toggleClass('a11yContrast', 'a11y-high-contrast');
  toggleClass('a11yLinks', 'a11y-highlight-links');
  toggleClass('a11yReadable', 'a11y-readable-font');
  toggleClass('a11yAnimations', 'a11y-no-animations');

  document.getElementById('a11yReset').addEventListener('click', () => {
    fontScale = 0;
    document.documentElement.style.fontSize = '';
    document.body.classList.remove('a11y-high-contrast', 'a11y-highlight-links', 'a11y-readable-font', 'a11y-no-animations');
    panel.querySelectorAll('.a11y-option').forEach(b => b.classList.remove('active'));
  });
}

// ═══ A11Y STATEMENT MODAL ═══
function initA11yStatement() {
  const backdrop = document.getElementById('a11yStatementBackdrop');
  const openBtn = document.getElementById('a11yStatementBtn');
  const closeBtn = document.getElementById('a11yStatementClose');
  if (!backdrop || !openBtn) return;
  const open = () => { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { backdrop.classList.remove('open'); document.body.style.overflow = ''; };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
}

// ═══ BACK TO TOP (feature 5) ═══
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ═══ PRIVACY MODAL (feature 15) ═══
function initPrivacyModal() {
  const backdrop = document.getElementById('privacyBackdrop');
  const openBtn = document.getElementById('privacyBtn');
  const closeBtn = document.getElementById('privacyClose');
  if (!backdrop || !openBtn) return;
  openBtn.addEventListener('click', () => {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closePrivacy = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', closePrivacy);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closePrivacy(); });
}

// ═══ HERO BLUR-UP (feature 7) ═══
function initHeroBlurUp() {
  const img = document.getElementById('heroImg');
  const placeholder = document.getElementById('heroBluePlaceholder');
  if (!img || !placeholder) return;
  const hide = () => placeholder.classList.add('loaded');
  if (img.complete && img.naturalWidth > 0) { hide(); }
  else { img.addEventListener('load', hide); }
}

// ═══ HANDWRITING ANIMATION ═══
function initHandwriting() {
  const quoteText = document.querySelector('.soul-quote-text');
  if (!quoteText) return;
  
  const text = quoteText.innerText;
  quoteText.innerHTML = '';
  quoteText.style.position = 'relative';
  
  const hand = document.createElement('span');
  hand.innerText = '✍️';
  hand.style.position = 'absolute';
  hand.style.fontSize = '1.8rem';
  hand.style.opacity = '0';
  hand.style.transition = 'top 0.1s linear, left 0.1s linear, opacity 0.3s';
  hand.style.pointerEvents = 'none';
  hand.style.zIndex = '10';
  hand.style.transform = 'translate(-40%, -60%)'; 
  
  const words = text.split(' ');
  const charsList = [];
  
  words.forEach((word, wIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    
    for(let i=0; i<word.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.textContent = word[i];
      charSpan.style.opacity = '0';
      wordSpan.appendChild(charSpan);
      charsList.push(charSpan);
    }
    quoteText.appendChild(wordSpan);
    
    if (wIdx < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.innerHTML = '&nbsp;';
      quoteText.appendChild(spaceSpan);
    }
  });

  quoteText.appendChild(hand);

  let isAnimated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isAnimated) {
      isAnimated = true;
      hand.style.opacity = '1';
      
      let i = 0;
      function typeChar() {
        if (i < charsList.length) {
          const charSpan = charsList[i];
          charSpan.style.opacity = '1';
          
          const rect = charSpan.getBoundingClientRect();
          const parentRect = quoteText.getBoundingClientRect();
          
          hand.style.top = (rect.top - parentRect.top) + 'px';
          hand.style.left = (rect.left - parentRect.left - 5) + 'px';
          
          i++;
          const speed = 25 + Math.random() * 30;
          setTimeout(typeChar, speed);
        } else {
          hand.style.opacity = '0';
        }
      }
      setTimeout(typeChar, 500); 
      obs.disconnect();
    }
  }, { threshold: 0.6 });
  
  obs.observe(quoteText);
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  initFilter();
  observeReveal();
  initParallax();
  initAccessibility();
  initA11yStatement();
  initBackToTop();
  initPrivacyModal();
  initHeroBlurUp();
  initHandwriting();
});
