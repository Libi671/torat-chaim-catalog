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
    <a class="card-link" href="#${p.slug}/${section}"
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
// Next to the flyer: a selector between registration (default), details and accompanying content.
// Deep links: #<slug>/<tab>, e.g. #tefila/materials, open the modal on that tab.
const backdrop = document.getElementById('modalBackdrop');
const modalBox = document.getElementById('modalBox');
const modalClose = document.getElementById('modalClose');
const modalFlyerImg = document.getElementById('modalFlyerImg');
const modalEnlargeBtn = document.getElementById('modalEnlargeBtn');
const modalTabs = document.getElementById('modalTabs');

const MODAL_TABS = {
  register: 'הרשמה',
  details: 'פירוט',
  materials: 'חומר נלווה',
};
const TAB_HASH = /^#([\w-]+)\/(register|details|materials)$/;

let modalProgram = null;

function modalTabsFor(p) {
  return Object.keys(MODAL_TABS).filter(t => t === 'register' || p[t]);
}

function openModal(id, tab = 'register') {
  const p = programs.find(x => x.id === id);
  if (!p) return;
  const tabs = modalTabsFor(p);
  if (!tabs.includes(tab)) tab = 'register';

  if (modalProgram !== p) {
    modalProgram = p;
    modalFlyerImg.src = p.file;
    modalFlyerImg.alt = p.title;
    modalTabs.hidden = tabs.length < 2;
    modalTabs.innerHTML = tabs.map(t =>
      `<button class="modal-tab" role="tab" id="modalTab-${t}" data-tab="${t}" aria-controls="modalPanel-${t}">${MODAL_TABS[t]}</button>`
    ).join('');
    document.getElementById('modalPanel-details').innerHTML = p.details ? renderDetails(p) : '';
    document.getElementById('modalPanel-materials').innerHTML = p.materials ? renderMaterials(p) : '';
  }

  showModalTab(tab);
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  backdrop.dataset.program = p.title;
  // on narrow screens the flyer sits above the selector: bring the chosen tab into view
  modalBox.scrollTop = tab === 'register' ? 0 : modalTabs.offsetTop - 12;
}

function showModalTab(tab) {
  modalTabs.querySelectorAll('.modal-tab').forEach(b => {
    const active = b.dataset.tab === tab;
    b.setAttribute('aria-selected', active);
    b.tabIndex = active ? 0 : -1;
  });
  Object.keys(MODAL_TABS).forEach(t => { document.getElementById(`modalPanel-${t}`).hidden = t !== tab; });
  modalBox.classList.toggle('modal-long', tab !== 'register');
  // Drive previews load only when their tab is opened
  document.querySelectorAll(`#modalPanel-${tab} iframe[data-src]`).forEach(f => {
    f.src = f.dataset.src;
    f.removeAttribute('data-src');
  });
}

modalTabs.addEventListener('click', e => {
  const btn = e.target.closest('.modal-tab');
  if (!btn) return;
  showModalTab(btn.dataset.tab);
  if (modalProgram.slug) history.replaceState(null, '', `#${modalProgram.slug}/${btn.dataset.tab}`);
});

function openModalFromHash() {
  const m = location.hash.match(TAB_HASH);
  const p = m && programs.find(x => x.slug === m[1]);
  if (p) openModal(p.id, m[2]);
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  // drop the deep link, so clicking the same link again reopens the modal
  if (TAB_HASH.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });
window.addEventListener('hashchange', openModalFromHash);

// ═══ DETAILS & MATERIALS ═══
// Content stays in Drive: files are embedded with Drive's preview, images with Drive's thumbnail service.
const EXTERNAL_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

function driveViewUrl(m) {
  return m.type === 'doc'
    ? `https://docs.google.com/document/d/${m.driveId}/edit`
    : `https://drive.google.com/file/d/${m.driveId}/view`;
}

function drivePreviewUrl(m) {
  return m.type === 'doc'
    ? `https://docs.google.com/document/d/${m.driveId}/preview`
    : `https://drive.google.com/file/d/${m.driveId}/preview`;
}

function renderDetails(p) {
  return `<div class="details-card">${p.details.map(block => {
    if (block.p) return `<p>${block.p}</p>`;
    if (block.list) return `
      <div class="details-list">
        <h3>${block.listTitle}</h3>
        <ul>${block.list.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>`;
    if (block.image) return `
      <figure class="details-figure">
        <img src="https://drive.google.com/thumbnail?id=${block.image}&sz=w1600" alt="${block.alt}" loading="lazy" />
      </figure>`;
    return '';
  }).join('')}</div>`;
}

function renderMaterials(p) {
  return `<div class="materials-list">${p.materials.map(m => `
    <article class="material-card">
      <header class="material-head">
        <span class="material-type ${m.type}">${m.type === 'doc' ? 'מסמך' : 'PDF'}</span>
        <div class="material-title">
          <h3>${m.title}</h3>
          ${m.note ? `<p class="material-note">${m.note}</p>` : ''}
        </div>
        <a class="material-open" href="${driveViewUrl(m)}" target="_blank" rel="noopener noreferrer">פתיחה במסך מלא ${EXTERNAL_ICON}</a>
      </header>
      <div class="material-frame ${m.type}">
        <iframe data-src="${drivePreviewUrl(m)}" title="${m.title}" allow="autoplay" allowfullscreen></iframe>
      </div>
    </article>`).join('')}</div>`;
}

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
  openModalFromHash();
});
