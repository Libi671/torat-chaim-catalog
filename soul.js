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
      aria-label="כניסה לתוכנית ${p.title}"
      onkeydown="if(event.key==='Enter')openModal(${p.id})">
      <div class="program-card-clamp"></div>
      <div class="card-img-wrap">
        <img src="${p.file}" alt="${p.title}" class="card-img" loading="lazy" />
      </div>
      <div class="card-body">
        <span class="card-badge">
          <span class="color-dot" style="background: ${getColorForCategory(p.cats[0])}; width: 10px; height: 10px; box-shadow: none; margin-left: 4px; animation: none; vertical-align: middle;"></span>
          ${p.badge}
        </span>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <button class="card-cta" tabindex="-1" onclick="event.stopPropagation();openModal(${p.id})">לכניסה ←</button>
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
// Next to the flyer: a selector between the program's contents, summary and registration.
// It opens on the first tab the program has (contents, else summary, else registration).
// Deep links: #<slug>/<tab>, e.g. #tefila/materials, open the modal on that tab.
const backdrop = document.getElementById('modalBackdrop');
const modalBox = document.getElementById('modalBox');
const modalClose = document.getElementById('modalClose');
const modalFlyerImg = document.getElementById('modalFlyerImg');
const modalEnlargeBtn = document.getElementById('modalEnlargeBtn');
const modalTabs = document.getElementById('modalTabs');

const MODAL_TABS = {
  materials: 'תכנים',
  details: 'תקציר',
  syllabus: 'סילבוס',
  bot: 'בוט',
  register: 'הרשמה',
};
const TAB_HASH = /^#([\w-]+)\/(register|details|materials|syllabus|bot)$/;

// The educator bot Elad built (a Gemini gem), offered as its own tab in every program
const EDUCATOR_BOT = 'https://gemini.google.com/gem/0c754808d9b3';

let modalProgram = null;

function modalTabsFor(p) {
  const has = { materials: !!p.materials, details: !!p.details, syllabus: !!syllabi[p.slug], bot: true, register: true };
  return Object.keys(MODAL_TABS).filter(t => has[t]);
}

function openModal(id, tab) {
  const p = programs.find(x => x.id === id);
  if (!p) return;
  const tabs = modalTabsFor(p);
  if (!tabs.includes(tab)) tab = tabs[0];

  if (modalProgram !== p) {
    stopPodcasts();
    modalProgram = p;
    modalFlyerImg.src = p.file;
    modalFlyerImg.alt = p.title;
    modalTabs.hidden = tabs.length < 2;
    modalTabs.innerHTML = tabs.map(t =>
      `<button class="modal-tab" role="tab" id="modalTab-${t}" data-tab="${t}" aria-controls="modalPanel-${t}">${MODAL_TABS[t]}</button>`
    ).join('');
    document.getElementById('modalPanel-details').innerHTML = p.details ? renderDetails(p) : '';
    document.getElementById('modalPanel-materials').innerHTML = p.materials ? renderMaterials(p) : '';
    document.getElementById('modalPanel-syllabus').innerHTML = syllabi[p.slug] ? `<div class="syllabus-card">${syllabi[p.slug]}</div>` : '';
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
  stopPodcasts();
  document.body.style.overflow = '';
  // drop the deep link, so clicking the same link again reopens the modal
  if (TAB_HASH.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (docViewer.classList.contains('open')) return closeDocViewer();
  closeModal(); closeLightbox();
});
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

function renderBotPanel() {
  return `<article class="material-card bot-card">
      <div class="bot-card-icon" aria-hidden="true">🤖</div>
      <h3>בוט מסייע למחנך</h3>
      <p>בוט Gemini שבנה אלעד בר שלום. מעתיקים אליו שיעור או חלק ממנו, הבוט שואל אתכם על הכיתה שלכם ומציע מערך שמותאם לה.</p>
      <div class="material-link">
        <a class="material-link-btn" href="${EDUCATOR_BOT}" target="_blank" rel="noopener noreferrer">לשיחה עם הבוט ${EXTERNAL_ICON}</a>
        <button class="copy-link" type="button" data-copy="${EDUCATOR_BOT}">העתקת קישור</button>
      </div>
    </article>`;
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

const MATERIAL_LABELS = {
  pdf: 'PDF', doc: 'מסמך', pages: 'חוברת', videos: 'סרטונים', audio: 'פודקאסט',
  canva: 'מצגת', units: 'יחידות', image: 'להדפסה', link: 'קישור', order: 'הזמנה',
};
const DOWNLOAD_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
const PLAY_ICON = '<svg viewBox="0 0 68 48" aria-hidden="true"><path d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6C4 2.4 2.3 4.8 1.5 7.7.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c2.9-.8 4.6-3.2 5.4-6.2C67.9 35 68 24 68 24s-.1-11-1.5-16.3z" fill="#e00"/><path d="M45 24 27 14v20" fill="#fff"/></svg>';

const youtubeUrl = id => `https://youtu.be/${id}`;
const driveFileUrl = id => `https://drive.google.com/file/d/${id}/view`;
const openLink = (url, label, icon = EXTERNAL_ICON) =>
  `<a class="material-open" href="${url}" target="_blank" rel="noopener noreferrer">${label} ${icon}</a>`;

// content/<dir>/001.webp … ; the ratio only reserves space until each page loads
function pageImages({ dir, count, ratio = 1.414, title }) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(3, '0');
    return `<img src="content/${dir}/${n}.webp" alt="${title} – עמוד ${i + 1}" loading="lazy" style="aspect-ratio: auto 1 / ${ratio}" />`;
  }).join('');
}

function materialHead(m, actions = '') {
  return `
      <header class="material-head">
        <span class="material-type ${m.type}">${MATERIAL_LABELS[m.type]}</span>
        <div class="material-title">
          <h3>${m.title}</h3>
          ${m.note ? `<p class="material-note">${m.note}</p>` : ''}
          ${m.jump ? `<button class="jump-link" type="button" data-jump="${m.jump.to}">${m.jump.label} ↓</button>` : ''}
        </div>
        ${actions}
      </header>`;
}

const MATERIAL_RENDERERS = {
  pdf: m => materialHead(m, openLink(driveViewUrl(m), 'פתיחה במסך מלא')) + `
      <div class="material-frame ${m.type}">
        <iframe data-src="${drivePreviewUrl(m)}" title="${m.title}" allow="autoplay" allowfullscreen></iframe>
      </div>`,

  canva: m => materialHead(m, openLink(m.url, 'פתיחה בקנבה')) + `
      <div class="material-frame canva">
        <iframe data-src="${m.url}?embed" title="${m.title}" allow="fullscreen" allowfullscreen loading="lazy"></iframe>
      </div>`,

  // Booklet page images; the scroll box keeps a long booklet from taking over the panel
  pages: m => {
    const actions = m.pdf
      ? `<a class="material-open" href="content/${m.pdf}" download>הורדת PDF להדפסה ${DOWNLOAD_ICON}</a>`
      : m.driveId ? openLink(driveFileUrl(m.driveId), m.fullLabel || 'פתיחה בדרייב') : '';
    const more = m.excerpt ? `<div class="pages-more">${openLink(driveFileUrl(m.driveId), 'להמשך הספר בקובץ המלא')}</div>` : '';
    return materialHead(m, actions) + `<div class="material-pages" tabindex="0" aria-label="${m.title}">${pageImages(m)}${more}</div>`;
  },

  // Lite YouTube embed: a thumbnail that turns into the player when clicked
  videos: m => materialHead(m) + `
      <div class="video-grid${m.items.length === 1 ? ' single' : ''}">${m.items.map(v => `
        <figure class="video-item">
          <button class="video-thumb" type="button" data-video="${v.id}" aria-label="ניגון: ${v.title}">
            <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" />
            <span class="video-play">${PLAY_ICON}</span>
          </button>
          <figcaption>
            <span class="video-title">${v.title}</span>
            <button class="copy-link" type="button" data-copy="${youtubeUrl(v.id)}">העתקת קישור</button>
          </figcaption>
        </figure>`).join('')}
      </div>`,

  // Podcast: one row per episode with its own play button; a single <audio> plays the hosted file
  audio: m => materialHead(m) + `
      <div class="podcast">
        <ol class="episodes">${m.items.map((a, i) => `
          <li class="episode" data-src="${a.src}" data-episode="${a.driveId}">
            <button class="ep-play" type="button" aria-label="ניגון: ${a.title}">
              <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
              <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>
            </button>
            <div class="ep-body">
              <span class="ep-num">פרק ${i + 1}</span>
              <span class="ep-title">${a.title}</span>
              <div class="ep-progress">
                <input class="ep-seek" type="range" min="0" max="1000" value="0" aria-label="מיקום בפרק" />
                <span class="ep-time">0:00</span>
              </div>
            </div>
          </li>`).join('')}
        </ol>
        <audio preload="none"></audio>
      </div>`,

  // Unit buttons; a click opens the unit right away in the document popup
  units: m => materialHead(m) + `
      <div class="unit-grid">${m.items.map(u => `
        <button class="unit-btn" type="button" data-doc="${u.driveId}" data-doc-dir="${u.dir}" data-doc-count="${u.count}" data-doc-title="${u.title}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>
          <span>${u.title}</span>
        </button>`).join('')}
      </div>`,

  image: m => materialHead(m, openLink(driveFileUrl(m.driveId), 'קובץ להדפסה', DOWNLOAD_ICON)) + `
      <div class="material-image"><img src="${m.src}" alt="${m.title}" loading="lazy" style="aspect-ratio: 1 / ${m.ratio}" /></div>`,

  link: m => materialHead(m) + `
      <div class="material-link">
        <a class="material-link-btn" href="${m.url}" target="_blank" rel="noopener noreferrer">${m.label} ${EXTERNAL_ICON}</a>
        <button class="copy-link" type="button" data-copy="${m.url}">העתקת קישור</button>
      </div>`,

  order: m => materialHead(m) + `
      <form class="order-form" data-item="${m.item}" data-email="${m.email}">
        <label>שם מלא<input name="name" required autocomplete="name" /></label>
        <label>בית ספר<input name="school" required /></label>
        <label>תפקיד<input name="role" /></label>
        <label>טלפון<input name="phone" type="tel" required autocomplete="tel" /></label>
        <label>מספר ספרים<input name="qty" type="number" min="1" required /></label>
        <label class="wide">הערות<textarea name="notes" rows="2"></textarea></label>
        <div class="order-actions wide">
          <button type="submit" class="order-submit">שליחת ההזמנה במייל</button>
          <span class="order-fallback">תוכנת המייל תיפתח עם ההזמנה מוכנה. אפשר גם לכתוב ישירות ל-<a href="mailto:${m.email}">${m.email}</a></span>
        </div>
      </form>`,
};
MATERIAL_RENDERERS.doc = MATERIAL_RENDERERS.pdf;

function renderMaterials(p) {
  return `<div class="materials-list">${p.materials.map(m =>
    `<article class="material-card material-${m.type}" data-anchor="${m.type}">${MATERIAL_RENDERERS[m.type](m)}</article>`
  ).join('')}</div>`;
}

// ═══ MATERIALS: players, copy buttons, order form ═══
const materialsPanel = document.getElementById('modalPanel-materials');

function copyLink(btn) {
  navigator.clipboard.writeText(btn.dataset.copy).then(() => {
    btn.textContent = 'הקישור הועתק ✓';
    setTimeout(() => { btn.textContent = 'העתקת קישור'; }, 2000);
  });
}

// the bot tab is the same for every program
const botPanel = document.getElementById('modalPanel-bot');
botPanel.innerHTML = renderBotPanel();
botPanel.addEventListener('click', e => {
  const copy = e.target.closest('.copy-link');
  if (copy) copyLink(copy);
});

materialsPanel.addEventListener('click', e => {
  const thumb = e.target.closest('.video-thumb');
  if (thumb) {
    thumb.outerHTML = `<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/${thumb.dataset.video}?autoplay=1&rel=0" title="${thumb.getAttribute('aria-label')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    return;
  }
  const copy = e.target.closest('.copy-link');
  if (copy) return copyLink(copy);
  const jump = e.target.closest('[data-jump]');
  if (jump) {
    materialsPanel.querySelector(`[data-anchor="${jump.dataset.jump}"]`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const play = e.target.closest('.ep-play');
  if (play) {
    togglePodcast(play.closest('.episode'));
    return;
  }
  const doc = e.target.closest('[data-doc]');
  if (doc) openDocViewer({ driveId: doc.dataset.doc, dir: doc.dataset.docDir, count: +doc.dataset.docCount, title: doc.dataset.docTitle });
});

// ═══ DOCUMENT POPUP ═══
// A unit's page images shown over the modal, with a link to the original in Drive.
const docViewer = document.getElementById('docViewer');
const docPages = document.getElementById('docViewerPages');

function openDocViewer(doc) {
  document.getElementById('docViewerTitle').textContent = doc.title;
  document.getElementById('docViewerOpen').href = driveFileUrl(doc.driveId);
  docPages.innerHTML = pageImages(doc);
  docPages.scrollTop = 0;
  docViewer.classList.add('open');
  document.getElementById('docViewerClose').focus();
}

function closeDocViewer() {
  docViewer.classList.remove('open');
  docPages.innerHTML = '';
}

document.getElementById('docViewerClose').addEventListener('click', closeDocViewer);
docViewer.addEventListener('click', e => { if (e.target === docViewer) closeDocViewer(); });

// ═══ PODCAST PLAYER ═══
function stopPodcasts() {
  document.querySelectorAll('#modalPanel-materials audio').forEach(a => a.pause());
}

const mmss = t => isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '0:00';

function togglePodcast(ep) {
  const podcast = ep.closest('.podcast');
  const audio = podcast.querySelector('audio');
  if (!audio.dataset.wired) wirePodcast(podcast, audio);
  if (ep.classList.contains('is-current') && !ep.classList.contains('has-error')) {
    audio.paused ? playEpisode(ep, audio) : audio.pause();
    return;
  }
  podcast.querySelectorAll('.episode').forEach(li => li.classList.toggle('is-current', li === ep));
  if (ep.classList.contains('has-error')) {
    ep.classList.remove('has-error');
    ep.querySelector('.ep-progress').innerHTML = EP_PROGRESS;
  }
  audio.src = ep.dataset.src;
  audio.load();
  playEpisode(ep, audio);
}

const EP_PROGRESS = '<input class="ep-seek" type="range" min="0" max="1000" value="0" aria-label="מיקום בפרק" /><span class="ep-time">0:00</span>';

// Plays, and if nothing starts within 10 seconds (or the browser refuses), offers the file directly
function playEpisode(ep, audio) {
  ep.classList.add('is-loading');
  clearTimeout(audio._stallTimer);
  audio._stallTimer = setTimeout(() => { if (audio.currentTime === 0) episodeFallback(ep); }, 10000);
  audio.play().catch(err => { if (err.name !== 'AbortError') episodeFallback(ep); });
}

function episodeFallback(ep) {
  if (!ep.classList.contains('is-current')) return;
  ep.classList.remove('is-loading');
  ep.classList.add('has-error');
  ep.querySelector('.ep-progress').innerHTML =
    `<a class="ep-fallback" href="${ep.dataset.src}" target="_blank" rel="noopener">להאזנה ישירה לקובץ ${EXTERNAL_ICON}</a>`;
}

function wirePodcast(podcast, audio) {
  audio.dataset.wired = '1';
  const current = () => podcast.querySelector('.episode.is-current');
  const sync = () => {
    const ep = current();
    if (!ep || ep.classList.contains('has-error')) return;
    ep.querySelector('.ep-seek').value = audio.duration ? Math.round(audio.currentTime / audio.duration * 1000) : 0;
    ep.querySelector('.ep-time').textContent = `${mmss(audio.currentTime)} / ${mmss(audio.duration)}`;
  };
  audio.addEventListener('timeupdate', sync);
  audio.addEventListener('loadedmetadata', sync);
  audio.addEventListener('playing', () => {
    clearTimeout(audio._stallTimer);
    current()?.classList.remove('is-loading');
    podcast.classList.add('is-playing');
  });
  audio.addEventListener('pause', () => podcast.classList.remove('is-playing'));
  audio.addEventListener('error', () => { const ep = current(); if (ep) episodeFallback(ep); });
  audio.addEventListener('ended', () => {
    const next = current()?.nextElementSibling;
    if (next) togglePodcast(next);
  });
  podcast.addEventListener('input', e => {
    if (e.target.matches('.ep-seek') && audio.duration) audio.currentTime = e.target.value / 1000 * audio.duration;
  });
}

materialsPanel.addEventListener('submit', e => {
  const form = e.target.closest('.order-form');
  if (!form) return;
  e.preventDefault();
  location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('הזמנת ' + form.dataset.item)}&body=${encodeURIComponent(orderText(form))}`;
});

function orderText(form) {
  const f = new FormData(form);
  return [
    `שלום אלעד, אני רוצה להזמין את ${form.dataset.item}.`,
    `שם: ${f.get('name')}`,
    `בית ספר: ${f.get('school')}`,
    f.get('role') && `תפקיד: ${f.get('role')}`,
    `טלפון: ${f.get('phone')}`,
    `מספר ספרים: ${f.get('qty')}`,
    f.get('notes') && `הערות: ${f.get('notes')}`,
  ].filter(Boolean).join('\n');
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

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  initFilter();
  observeReveal();
  initAccessibility();
  initA11yStatement();
  initBackToTop();
  initPrivacyModal();
  openModalFromHash();
});
