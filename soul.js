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
        ${renderCardLinks(p)}
      </div>
    </article>
  `).join('');
  observeReveal();
}

// "לפירוט" / "לתוכן הנלווה" links under a flyer, only for what exists in the Drive folder
function renderCardLinks(p) {
  const links = [];
  if (p.details) links.push(['details', 'לפירוט']);
  if (p.materials) links.push(['materials', 'לתוכן הנלווה']);
  if (!links.length) return '';
  return `<div class="card-links">${links.map(([section, label]) => `
    <a class="card-link" href="${programUrl(p, section)}"
      onclick="event.stopPropagation()" onkeydown="event.stopPropagation()">
      ${label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    </a>`).join('')}
  </div>`;
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

  // ── Mobile / Touch Detection ──
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = isTouchDevice || window.innerWidth <= 768;

  // ── State ──
  let scrollY = 0;
  let mouseX = 0, mouseY = 0;       // normalized -1..1
  let gyroX = 0, gyroY = 0;         // normalized -1..1
  let currentScroll = 0;
  let currentMouseX = 0, currentMouseY = 0;
  let currentGyroX = 0, currentGyroY = 0;
  let ticking = false;

  const LERP = 0.08;  // smoothing factor (lower = smoother / slower)
  const SCROLL_MULTIPLIER = isMobile ? 120 : 80;    // max px shift for scroll
  const MOUSE_MULTIPLIER  = 25;    // max px shift for mouse
  const GYRO_MULTIPLIER   = isMobile ? 140 : 20;    // max px shift for gyroscope

  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Check accessibility ──
  function isReduced() {
    return document.body.classList.contains('a11y-no-animations') ||
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Scroll tracking ──
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    scrollY = -rect.top / heroH;
    scheduleUpdate();
  }, { passive: true });

  // ── Mouse tracking (desktop only) ──
  if (!isTouchDevice) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;  // -1..1
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;  // -1..1
      scheduleUpdate();
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      mouseX = 0; mouseY = 0;
      scheduleUpdate();
    }, { passive: true });
  }

  // ── Gyroscope tracking (mobile/tablet) ──
  function handleOrientation(e) {
    const beta  = Math.max(-30, Math.min(30, e.beta  || 0));
    const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
    gyroX = gamma / 30;  // -1..1
    gyroY = beta  / 30;  // -1..1
    scheduleUpdate();
  }

  function initGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires user permission popup.
      // To prevent showing an annoying permission popup to the user, we do not request gyroscope access on iOS.
      // iOS users will still enjoy the scroll-based parallax effect which requires no permission.
    } else if ('DeviceOrientationEvent' in window) {
      // Android does not require permission popups.
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  // Only init gyroscope on touch devices
  if (isTouchDevice) {
    initGyroscope();
  }

  // ── Render loop ──
  function scheduleUpdate() {
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
    } else {
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
  scheduleUpdate();
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

// ═══ HERO BLUR-UP (feature 7) ═══
function initHeroBlurUp() {
  const img = document.getElementById('heroImg');
  const placeholder = document.getElementById('heroBluePlaceholder');
  if (!img || !placeholder) return;
  const hide = () => placeholder.classList.add('loaded');
  if (img.complete && img.naturalWidth > 0) { hide(); }
  else { img.addEventListener('load', hide); }
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
});
