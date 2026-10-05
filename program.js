// ═══ PROGRAM INNER PAGE ═══
// program.html?p=<slug>#details | #materials
// Content stays in Drive: files are embedded with Drive's preview, images with Drive's thumbnail service.

const SECTIONS = {
  details: 'פירוט',
  materials: 'תוכן נלווה',
};

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

function driveImageUrl(id) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

// ═══ DETAILS (פירוט) ═══
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
        <img src="${driveImageUrl(block.image)}" alt="${block.alt}" loading="lazy" />
      </figure>`;
    return '';
  }).join('')}</div>`;
}

// ═══ MATERIALS (תוכן נלווה) ═══
function renderMaterial(m) {
  const typeLabel = m.type === 'doc' ? 'מסמך' : 'PDF';
  const body = m.tooLarge
    ? `<div class="material-large">
        <p>הקובץ גדול מדי לתצוגה בתוך הדף, אפשר לצפות בו ולהוריד אותו מהדרייב.</p>
        <a class="card-cta" href="${driveViewUrl(m)}" target="_blank" rel="noopener noreferrer">פתיחת הקובץ ${EXTERNAL_ICON}</a>
      </div>`
    : `<div class="material-frame ${m.type}">
        <iframe src="${drivePreviewUrl(m)}" title="${m.title}" loading="lazy" allow="autoplay" allowfullscreen></iframe>
      </div>`;
  return `
    <article class="material-card">
      <header class="material-head">
        <span class="material-type ${m.type}">${typeLabel}</span>
        <div class="material-title">
          <h3>${m.title}</h3>
          ${m.note ? `<p class="material-note">${m.note}</p>` : ''}
        </div>
        ${m.tooLarge ? '' : `<a class="material-open" href="${driveViewUrl(m)}" target="_blank" rel="noopener noreferrer">פתיחה במסך מלא ${EXTERNAL_ICON}</a>`}
      </header>
      ${body}
    </article>`;
}

function renderMaterials(p) {
  return `<div class="materials-list">${p.materials.map(renderMaterial).join('')}</div>`;
}

// ═══ PAGE ═══
function renderProgram() {
  const main = document.getElementById('programMain');
  const slug = new URLSearchParams(location.search).get('p');
  const p = programs.find(x => x.slug && x.slug === slug);
  const sections = p ? Object.keys(SECTIONS).filter(s => p[s]) : [];

  if (!p || !sections.length) {
    main.innerHTML = `
      <div class="program-missing">
        <h1 class="program-title">התוכנית לא נמצאה</h1>
        <a class="card-cta" href="index.html#catalog">חזרה לקטלוג התוכניות</a>
      </div>`;
    return;
  }

  document.title = `${p.title} – תורת חיים באמית`;

  const header = sections.length > 1
    ? `<div class="program-tabs" role="tablist" aria-label="תוכן התוכנית">
        ${sections.map(s => `<button class="program-tab" role="tab" id="tab-${s}" data-section="${s}" aria-controls="panel-${s}">${SECTIONS[s]}</button>`).join('')}
      </div>`
    : `<h2 class="program-section-title">${SECTIONS[sections[0]]}</h2>`;

  main.innerHTML = `
    <nav class="program-crumbs" aria-label="מיקום בעמוד">
      <a href="index.html#catalog">קטלוג התוכניות</a>
      <span aria-hidden="true">/</span>
      <span>${p.title}</span>
    </nav>

    <section class="program-hero">
      <div class="program-hero-text">
        <span class="card-badge">${p.badge}</span>
        <h1 class="program-title">${p.title}</h1>
        <p class="program-desc">${p.desc}</p>
        <a class="card-cta" href="index.html#register">לפרטים והרשמה 🖌️</a>
      </div>
      <a class="program-flyer" href="${p.file}" target="_blank" rel="noopener" aria-label="הפלייר של ${p.title} בגודל מלא">
        <img src="${p.file}" alt="פלייר ${p.title}" />
      </a>
    </section>

    ${header}

    ${sections.map(s => `
      <section class="program-panel" id="panel-${s}" ${sections.length > 1 ? `role="tabpanel" aria-labelledby="tab-${s}"` : ''}>
        ${s === 'details' ? renderDetails(p) : renderMaterials(p)}
      </section>`).join('')}
  `;

  if (sections.length > 1) initTabs(sections);
}

function initTabs(sections) {
  const tabs = document.querySelectorAll('.program-tab');

  function show(section) {
    tabs.forEach(t => {
      const active = t.dataset.section === section;
      t.setAttribute('aria-selected', active);
      t.tabIndex = active ? 0 : -1;
    });
    sections.forEach(s => { document.getElementById(`panel-${s}`).hidden = s !== section; });
  }

  tabs.forEach(t => t.addEventListener('click', () => {
    show(t.dataset.section);
    history.replaceState(null, '', `#${t.dataset.section}`);
  }));

  const fromHash = location.hash.slice(1);
  show(sections.includes(fromHash) ? fromHash : sections[0]);
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderProgram();
  initAccessibility();
  initA11yStatement();
  initBackToTop();
  initPrivacyModal();
});
