// ═══ PROGRAM DATA ═══
const programs = [
  { id: 1, title: 'אירועי תורת חיים תשפ"ו', desc: 'אירועים קהילתיים ורוחניים לכלל תלמידי הרשת – חוויות שמחברות ומחזקות זהות יהודית.', badge: 'אירועים', file: 'P/אירועי תורת חיים תשפו (1).jpeg' },
  { id: 2, title: 'אירועים שנתיים תשפ"ו', desc: 'לוח האירועים השנתי של תורת חיים – מפגשים, ימי עיון ואירועי שיא לאורך כל השנה.', badge: 'לוח שנה', file: 'P/אירועים שנתיים תשפו פלייר.jpg' },
  { id: 3, title: 'אמון ואמונה', desc: 'תוכנית חווייתית לפיתוח חוסן אמוני לתלמידים – דרך העמקה ב-8 עקרונות רוחניים.', badge: 'חוסן אמוני', file: 'P/אמון ואמונה פלייר תשפו.jpg' },
  { id: 4, title: 'תוכנית בר/בת מצווה', desc: 'מסלול מקיף ומרתק לקראת בר ובת מצווה – חוויות, ספר לימוד, ליווי אישי ואירועי שיא.', badge: 'בר/בת מצווה', file: 'P/בר מצווה פלייר.jpg' },
  { id: 5, title: 'הישיבה הקהילתית – בנים', desc: 'חוויית לימוד ישיבתית אותנטית בתוך בית הספר – לימוד עמוק, מפגש בין-גילאי וקהילה.', badge: 'לימוד מעמיק', file: 'P/הישיבה הקהילתית בנים פלייר.jpg' },
  { id: 6, title: 'מסע זהות יהודית – הרב זקס', desc: 'מסלול דיגיטלי עשיר על פי משנתו של הרב יונתן זקס – מסע לזהות היהודית הייחודית ביותר.', badge: 'זהות יהודית', file: 'P/הרב זקס פלייר תשפו.jpg' },
  { id: 7, title: 'מושגי יסוד ביהדות', desc: 'יחידות ללימוד חווייתי ומעמיק של מושגי יסוד – שמע ישראל, מצוות, קידוש ועוד.', badge: 'יחידות לימוד', file: 'P/מושגי יסוד יהדות פלייר.jpg' },
  { id: 8, title: 'בבאסאלי', desc: 'תוכנית ייחודית שמחברת בין מסורת לחיים המודרניים – דרך עולם הגסטרונומיה היהודית.', badge: 'תרבות יהודית', file: 'P/פלייר בבאסאלי.jpg' },
  { id: 9, title: 'תפילה – תשפ"ו', desc: 'תוכנית לפיתוח קשר אותנטי לתפילה – כלים מעשיים למורים ולתלמידים לתפילה חיה ומשמעותית.', badge: 'תפילה', file: 'P/פלייר תפילה תשפו.jpg' }
];

// ═══ RENDER CARDS ═══
function renderCards() {
  const grid = document.getElementById('programGrid');
  grid.innerHTML = programs.map((p, i) => `
    <article class="program-card reveal" style="transition-delay:${i * 0.07}s"
      onclick="openModal(${p.id})" role="button" tabindex="0"
      aria-label="פרטים על ${p.title}"
      onkeydown="if(event.key==='Enter')openModal(${p.id})">
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
        <span class="card-badge">${p.badge}</span>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <button class="card-cta" tabindex="-1" onclick="event.stopPropagation();openModal(${p.id})">הרשמה לתוכנית</button>
          <span class="card-arrow">←</span>
        </div>
      </div>
    </article>
  `).join('');
  observeReveal();
}

// ═══ MODAL ═══
const backdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalFlyerImg = document.getElementById('modalFlyerImg');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalEnlargeBtn = document.getElementById('modalEnlargeBtn');

function openModal(id) {
  const p = programs.find(x => x.id === id);
  if (!p) return;
  modalFlyerImg.src = p.file;
  modalFlyerImg.alt = p.title;
  modalTitle.textContent = p.title;
  modalForm.reset();
  modalSuccess.style.display = 'none';
  modalForm.style.display = 'block';
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

// ═══ MODAL FORM ═══
modalForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm(modalForm)) return;
  modalForm.style.display = 'none';
  modalSuccess.style.display = 'block';
});

// ═══ MAIN FORM ═══
const mainRegForm = document.getElementById('mainRegForm');
const mainSuccess = document.getElementById('mainSuccess');

mainRegForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm(mainRegForm)) return;
  mainRegForm.querySelectorAll('input,select,textarea,button').forEach(el => el.disabled = true);
  mainSuccess.style.display = 'block';
  mainSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ═══ VALIDATION ═══
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(el => {
    el.style.borderColor = '';
    if (!el.value.trim()) {
      el.style.borderColor = '#e74c3c';
      el.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.15)';
      if (valid) el.focus();
      valid = false;
    } else {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }
  });
  return valid;
}

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

// ═══ PARALLAX HERO ═══
function initParallax() {
  const heroWrap = document.querySelector('.hero-parallax-wrap');
  if (!heroWrap) return;
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const scrolled = -rect.top;
    const parallaxOffset = scrolled * 0.35;
    heroWrap.style.transform = `translateY(${parallaxOffset}px)`;
  }, { passive: true });
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

// ═══ A11Y STATEMENT TOGGLE ═══
function initA11yStatement() {
  const btn = document.getElementById('a11yStatementToggle');
  const content = document.getElementById('a11yStatementContent');
  if (!btn || !content) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    if (expanded) {
      content.setAttribute('hidden', '');
    } else {
      content.removeAttribute('hidden');
    }
  });
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  observeReveal();
  initParallax();
  initAccessibility();
  initA11yStatement();
});
