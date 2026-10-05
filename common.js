// Shared by index.html and program.html: accessibility panel, footer modals, back-to-top.

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
