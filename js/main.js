/* =====================================================
   main.js — Navigation, routing, rendering
   الأندية التربوية — دليل مرجعي CRMEF
   ===================================================== */

/* ── State ─────────────────────────────────────────── */
const state = {
  currentSection: 'home',
  facilitatorSlide: 0,
  modalFiche: null,
  showInstitutional: false,
};

/* ── Section ids ────────────────────────────────────── */
const SECTIONS = ['home', 'concept', 'parcours', 'fiches', 'legal'];

/* ── Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderConcept();
  renderParcours();
  renderFiches();
  renderLegal();
  bindNav();
  bindFacilitator();
  bindBackButton();

  // Restore section from URL hash on load, else default to home
  const initial = SECTIONS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
  navigateTo(initial, false);          // false = don't push another state
  history.replaceState({ section: initial, modal: null, facilitator: false }, '', '#' + initial);
});

/* ── History / back-button ──────────────────────────── */
function bindBackButton() {
  window.addEventListener('popstate', e => {
    const s = e.state || {};

    // Priority: close facilitator > close modal > go to section
    if (document.getElementById('facilitator-mode').classList.contains('open')) {
      closeFacilitatorUI();
      return;
    }
    if (document.getElementById('fiche-modal').classList.contains('open')) {
      closeFicheModalUI();
      return;
    }
    if (s.section && SECTIONS.includes(s.section)) {
      navigateTo(s.section, false);
    }
  });
}

/* ── Navigation ─────────────────────────────────────── */
function navigateTo(id, push = true) {
  if (!SECTIONS.includes(id)) return;
  state.currentSection = id;

  SECTIONS.forEach(s => {
    document.getElementById('section-' + s).classList.toggle('active', s === id);
  });
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === id);
  });

  const titles = {
    home:    'الأندية التربوية',
    concept: 'المفهوم والأهداف',
    parcours:'مسار الإحداث',
    fiches:  'البطاقات والنماذج',
    legal:   'المرجعية القانونية',
  };
  document.getElementById('top-bar-title').textContent = titles[id] || 'الأندية التربوية';
  window.scrollTo(0, 0);

  if (push) history.pushState({ section: id, modal: null, facilitator: false }, '', '#' + id);
}

function bindNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.section));
  });
}

/* ── Home ───────────────────────────────────────────── */
function renderHome() {
  const el = document.getElementById('section-home');
  el.innerHTML = `
    <div style="text-align:center; padding:1.5rem 0 1rem;">
      <div style="font-size:2.5rem; margin-bottom:.5rem;">🏫</div>
      <h1 style="color:var(--accent); font-size:1.3rem;">الأندية التربوية</h1>
      <p class="text-muted" style="font-size:.83rem; margin-top:.35rem;">دليل مرجعي — مديرية الحياة المدرسية 2019</p>
      <span style="display:inline-block; background:var(--accent-bg); color:var(--accent); font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:20px; margin-top:.4rem;">
        دليل مرجعي معتمد
      </span>
    </div>

    <div class="cards-grid" style="margin-top:.75rem;">
      <div class="nav-card" onclick="navigateTo('concept')">
        <span class="card-icon">📖</span>
        <div class="card-body">
          <div class="card-title">المفهوم</div>
          <div class="card-sub">التعريف والأهداف والهيكل</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('parcours')">
        <span class="card-icon">🗺️</span>
        <div class="card-body">
          <div class="card-title">المسار</div>
          <div class="card-sub">خطوات الإحداث الكاملة</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('fiches')">
        <span class="card-icon">📋</span>
        <div class="card-body">
          <div class="card-title">البطاقات</div>
          <div class="card-sub">11 نموذجاً رسمياً</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('legal')">
        <span class="card-icon">⚖️</span>
        <div class="card-body">
          <div class="card-title">القانون</div>
          <div class="card-sub">المرجعية القانونية</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card facilitator card-wide" onclick="openFacilitator()">
        <span class="card-icon">🎯</span>
        <div class="card-body">
          <div class="card-title">وضع المُيسِّر</div>
          <div class="card-sub">لتأطير نشاط صفي — محاكاة تأسيس نادٍ في القسم</div>
        </div>
        <span class="card-arrow" style="color:var(--gold);">‹</span>
      </div>
    </div>

    <div class="section-intro" style="margin-top:1rem;">
      <strong style="display:block; margin-bottom:.4rem; color:var(--txt);">كيف تستخدم هذا الدليل؟</strong>
      ابدأ بـ<strong>المفهوم</strong> لتتعرف على الأندية التربوية وأهدافها، ثم اطَّلع على <strong>المسار</strong> لمعرفة خطوات الإحداث كاملةً، وارجع إلى <strong>البطاقات</strong> لتحميل النماذج الرسمية واستخدامها.
      إذا كنت تُنظِّم نشاطاً صفياً لمحاكاة تأسيس نادٍ، استخدم <strong>وضع المُيسِّر</strong>.
    </div>`;
}

/* ── Concept ─────────────────────────────────────────── */
function renderConcept() {
  const el = document.getElementById('section-concept');
  el.innerHTML = `
    <p class="section-intro">
      مستخرَج من الفصل الخامس من <strong>دليل الحياة المدرسية</strong> — مديرية الحياة المدرسية، وزارة التربية الوطنية، دجنبر 2019 (ص 84-106).
    </p>

    ${makeCollapsible('c-def', '📌 التعريف الرسمي للنادي التربوي', `
      <p>النادي التربوي هو <strong>تجمُّع تطوعي</strong> يضم مجموعة من التلاميذ ذوي الاهتمامات المشتركة، تحت إشراف مؤطِّر تربوي، يعمل داخل المؤسسة التعليمية في إطار مؤسسي واضح.</p>
      <br>
      <p>يتميز النادي عن النشاط العرضي بكونه:</p>
      <ul style="padding-right:1.2rem; list-style:disc; margin-top:.4rem; line-height:2; font-size:.9rem;">
        <li>مستمراً طوال السنة الدراسية.</li>
        <li>مبنياً على مشروع تربوي واضح الأهداف.</li>
        <li>قائماً على التطوع والديمقراطية الداخلية.</li>
        <li>منفتحاً على جميع تلاميذ المؤسسة.</li>
        <li>مندرجاً في الهيكل المؤسسي ومعتمَداً من مجلس التدبير.</li>
      </ul>
    `)}

    ${makeCollapsible('c-obj', '🎯 الأهداف التربوية (8 أهداف)', `
      <ol style="padding-right:1.4rem; line-height:2.1; font-size:.9rem;">
        <li>تعزيز ممارسة الديمقراطية وتدبير الاختلاف.</li>
        <li>تنمية مهارات الإدارة والتنظيم والتخطيط.</li>
        <li>تطوير مهارات التواصل والتعبير والحوار.</li>
        <li>صقل الكفايات الحياتية في سياقات حقيقية.</li>
        <li>تعزيز الانتماء المؤسسي وروح الفريق.</li>
        <li>اكتشاف المواهب وتطوير الإبداع.</li>
        <li>ترسيخ قيم المواطنة والمسؤولية الاجتماعية.</li>
        <li>فتح المؤسسة على محيطها الثقافي والاجتماعي.</li>
      </ol>
    `)}

    ${makeCollapsible('c-dom', '🗂️ المجالات والأنواع', `
      <strong style="display:block; margin-bottom:.5rem; font-size:.9rem; color:var(--accent);">المجالان الرئيسيان:</strong>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:.6rem; margin-bottom:.9rem;">
        <div style="background:var(--blue-bg); border-radius:8px; padding:.65rem; font-size:.83rem; border:1px solid #b8d4f0;">
          <strong>العلمي والتقني</strong>
          <p style="margin-top:.25rem; color:var(--txt-muted);">العلوم، التكنولوجيا، البيئة، الصحة، الرياضة...</p>
        </div>
        <div style="background:var(--gold-bg); border-radius:8px; padding:.65rem; font-size:.83rem; border:1px solid #e5c98a;">
          <strong>الفني والاجتماعي والتراثي</strong>
          <p style="margin-top:.25rem; color:var(--txt-muted);">الموسيقى، المسرح، الفنون، التراث، التضامن...</p>
        </div>
      </div>
      <strong style="display:block; margin-bottom:.5rem; font-size:.9rem; color:var(--accent);">نوعان من الأندية:</strong>
      <ul style="padding-right:1.2rem; list-style:disc; font-size:.88rem; line-height:2;">
        <li><strong>الأندية الموضوعاتية:</strong> تتمحور حول موضوع واحد (نادي المسرح، نادي البيئة...).</li>
        <li><strong>أندية الأساليب:</strong> تستخدم مقاربة واحدة عبر مواضيع متعددة (نادي الصحافة المدرسية، نادي الأبحاث...).</li>
      </ul>
    `)}

    ${makeCollapsible('c-formats', '🔢 صيغ الإحداث الثلاث', `
      ${[
        ['نادٍ واحد', 'مؤسسات صغيرة أو حديثة العهد بالأندية. جهد مُركَّز وموارد محدودة. الأثر أعمق.', 'var(--accent)'],
        ['ناديان', 'مؤسسات متوسطة. توازن بين التركيز والتنوع. غالباً مجال علمي + فني.', 'var(--blue)'],
        ['أندية متعددة', 'مؤسسات كبيرة بموارد وفيرة. تنوع كبير لكنه يستلزم تنسيقاً قوياً.', 'var(--gold)'],
      ].map(([title, desc, color]) => `
        <div style="border:1px solid var(--border); border-radius:8px; padding:.75rem; margin-bottom:.5rem; border-right:3px solid ${color};">
          <strong style="color:${color};">${title}</strong>
          <p style="font-size:.85rem; margin-top:.3rem; line-height:1.65; color:var(--txt-muted);">${desc}</p>
        </div>`).join('')}
      <p style="font-size:.82rem; color:var(--txt-muted); margin-top:.5rem;">
        ⚠️ الاختيار يُبنى على تقييم الموارد البشرية والمادية المتاحة، لا على الطموح وحده.
      </p>
    `)}

    ${makeCollapsible('c-org', '🏗️ الهيكل التنظيمي للنادي', `
      <div style="overflow-x:auto;">
        <svg viewBox="0 0 340 220" width="100%" style="max-width:380px; display:block; margin:0 auto;">
          <!-- Niveau 1 : Directeur -->
          <rect x="110" y="8" width="120" height="36" rx="8" fill="#2c6fad" opacity=".9"/>
          <text x="170" y="31" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">مدير المؤسسة</text>

          <!-- Ligne -->
          <line x1="170" y1="44" x2="170" y2="64" stroke="#aaa" stroke-width="1.5"/>

          <!-- Niveau 2 : Coordinateur -->
          <rect x="105" y="64" width="130" height="34" rx="8" fill="#40916c" opacity=".9"/>
          <text x="170" y="86" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">منسِّق الأندية</text>

          <!-- Ligne -->
          <line x1="170" y1="98" x2="170" y2="114" stroke="#aaa" stroke-width="1.5"/>

          <!-- Niveau 3 : deux branches -->
          <line x1="80" y1="114" x2="260" y2="114" stroke="#aaa" stroke-width="1.5"/>
          <line x1="80" y1="114" x2="80" y2="130" stroke="#aaa" stroke-width="1.5"/>
          <line x1="260" y1="114" x2="260" y2="130" stroke="#aaa" stroke-width="1.5"/>

          <!-- Moutir -->
          <rect x="16" y="130" width="128" height="34" rx="8" fill="#b07d3a" opacity=".9"/>
          <text x="80" y="152" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">المؤطِّر التربوي</text>

          <!-- Bureau -->
          <rect x="196" y="130" width="128" height="34" rx="8" fill="#2d6a4f" opacity=".9"/>
          <text x="260" y="152" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">مكتب النادي</text>

          <!-- Ligne bureau → membres -->
          <line x1="260" y1="164" x2="260" y2="180" stroke="#aaa" stroke-width="1.5"/>

          <!-- Membres -->
          <rect x="196" y="180" width="128" height="32" rx="8" fill="#52b788" opacity=".85"/>
          <text x="260" y="200" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">أعضاء النادي</text>
        </svg>
      </div>
      <p style="font-size:.82rem; color:var(--txt-muted); margin-top:.6rem; line-height:1.65;">
        <strong>المكتب</strong> يتكون من: الرئيس، نائب الرئيس، الكاتب، نائب الكاتب، الخازن — يُنتخبون في الجمع التأسيسي.
      </p>
    `)}

    ${makeCollapsible('c-success', '✅ متطلبات نجاح الأندية', `
      ${[
        ['الإرادة المؤسسية', 'دعم المدير وتوفير الزمان والمكان والموارد — بدونه لا نادي يدوم.'],
        ['المؤطِّر الملتزم', 'المعلم المؤطِّر هو عمود النادي. حضوره وتحفيزه يُحدِّدان نجاح النادي.'],
        ['التمويل المنظَّم', 'جمعية دعم مدرسة النجاح هي الإطار القانوني للتمويل — لا يجوز العمل خارجه.'],
        ['المشاركة التطوعية', 'لا إكراه في الانخراط — الالتزام الحقيقي يُبنى على الرغبة لا على الإلزام.'],
        ['التوثيق والتتبع', 'بدون محاضر وبطاقات وتقارير، لا يمكن تقييم الأثر ولا طلب الدعم.'],
      ].map(([t, d]) => `
        <div style="display:flex; gap:.7rem; align-items:flex-start; padding:.6rem 0; border-bottom:1px solid var(--border);">
          <span style="color:var(--accent); font-size:1.1rem; flex-shrink:0; margin-top:2px;">✓</span>
          <div>
            <strong style="font-size:.9rem;">${t}</strong>
            <p style="font-size:.83rem; color:var(--txt-muted); margin-top:2px; line-height:1.6;">${d}</p>
          </div>
        </div>`).join('')}
    `)}
  `;
}

/* ── Parcours ────────────────────────────────────────── */
function renderParcours() {
  const el = document.getElementById('section-parcours');
  const steps = window.PARCOURS;

  const legend = `
    <div style="display:flex; gap:.6rem; flex-wrap:wrap; margin-bottom:.85rem; font-size:.78rem;">
      <span style="display:inline-flex; align-items:center; gap:.35rem;">
        <span style="width:12px;height:12px;border-radius:50%;background:var(--blue);display:inline-block;"></span>
        المستوى المؤسسي (الإدارة)
      </span>
      <span style="display:inline-flex; align-items:center; gap:.35rem;">
        <span style="width:12px;height:12px;border-radius:50%;background:var(--accent);display:inline-block;"></span>
        مستوى النادي الفردي
      </span>
    </div>`;

  const toggle = `
    <div class="level-toggle">
      <input type="checkbox" id="show-institutional" onchange="toggleInstitutional(this.checked)">
      <label for="show-institutional">إظهار المستوى المؤسسي (الخطوات 1-4)</label>
    </div>`;

  const timeline = steps.map(step => {
    const isInstitutional = step.level === 'institutional';
    const chips = step.fiches.map(f =>
      `<span class="fiche-chip" onclick="openFiche('${f}');event.stopPropagation();">${f}</span>`
    ).join('');

    const actorBadge = step.actor === 'admin'
      ? `<span class="step-badge badge-admin">${step.actorLabel}</span>`
      : step.actor === 'club'
        ? `<span class="step-badge badge-club">${step.actorLabel}</span>`
        : `<span class="step-badge badge-both">${step.actorLabel}</span>`;

    return `
      <div class="timeline-step ${step.level}${isInstitutional ? ' institutional-step' : ''}"
           style="${isInstitutional && !state.showInstitutional ? 'display:none;' : ''}">
        <div class="step-indicator">
          <div class="step-circle">${step.num}</div>
        </div>
        <div class="step-content">
          <div class="step-header" onclick="toggleStep('${step.id}')">
            <span class="step-title">${step.title}</span>
            ${actorBadge}
            <span class="step-chevron" id="chev-${step.id}">▾</span>
          </div>
          <div class="step-body" id="body-${step.id}">
            <p style="font-size:.85rem; color:var(--txt-muted); margin-bottom:.6rem;">${step.goal}</p>
            <ul style="padding-right:1.1rem; list-style:disc; font-size:.85rem; line-height:1.9;">
              ${step.actions.map(a => `<li>${a}</li>`).join('')}
            </ul>
            ${step.fiches.length ? `
              <div class="fiche-chips" style="margin-top:.7rem;">
                <span style="font-size:.75rem; color:var(--txt-muted); align-self:center;">النماذج:</span>
                ${chips}
              </div>` : ''}
            ${makeStepSub('legal-' + step.id, '⚖️ السند القانوني', step.legal)}
            ${makeStepSub('why-' + step.id, '💡 لماذا هذه المرحلة؟', step.why)}
          </div>
        </div>
      </div>`;
  }).join('');

  const facilitatorLink = `
    <div style="text-align:center; margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border);">
      <button onclick="openFacilitator()" style="background:var(--gold); color:white; border:none; border-radius:10px; padding:.65rem 1.4rem; font-size:.88rem; font-weight:700; cursor:pointer;">
        🎯 فتح وضع المُيسِّر — محاكاة صفية
      </button>
      <p class="text-muted" style="font-size:.75rem; margin-top:.4rem;">يُغطي الخطوات 5-11 (مستوى النادي) بشكل تفاعلي للقسم</p>
    </div>`;

  el.innerHTML = `
    <p class="section-intro">
      مسار الإحداث الكامل مُستخرَج من دليل الحياة المدرسية 2019 والمذكرات الوزارية. يتضمن مستويين: مؤسسياً تضطلع به الإدارة، وفردياً يضطلع به كل نادٍ.
    </p>
    ${legend}
    ${toggle}
    <div class="timeline">${timeline}</div>
    ${facilitatorLink}
  `;
}

function toggleStep(id) {
  const body = document.getElementById('body-' + id);
  const chev = document.getElementById('chev-' + id);
  const isOpen = body.classList.toggle('open');
  chev.style.transform = isOpen ? 'rotate(180deg)' : '';
}

function toggleInstitutional(show) {
  state.showInstitutional = show;
  document.querySelectorAll('.institutional-step').forEach(el => {
    el.style.display = show ? '' : 'none';
  });
}

function makeStepSub(id, label, content) {
  return `
    <div class="step-sub" id="ss-${id}">
      <div class="step-sub-header" onclick="toggleStepSub('${id}')">
        <span>${label}</span>
        <span class="step-sub-chevron" id="ssc-${id}">▾</span>
      </div>
      <div class="step-sub-body">${content}</div>
    </div>`;
}

function toggleStepSub(id) {
  const sub = document.getElementById('ss-' + id);
  const chev = document.getElementById('ssc-' + id);
  const isOpen = sub.classList.toggle('open');
  chev.style.transform = isOpen ? 'rotate(180deg)' : '';
}

/* ── Fiches ──────────────────────────────────────────── */
function renderFiches() {
  const el = document.getElementById('section-fiches');
  const fiches = window.FICHES;

  const groups = [
    { key: 'green',  label: 'إحداث النادي',  ids: ['F-01','F-02','F-03'] },
    { key: 'gold',   label: 'التخطيط',        ids: ['F-04','F-05','F-06','F-07'] },
    { key: 'blue',   label: 'التنفيذ',        ids: ['F-08','F-09'] },
    { key: 'violet', label: 'التقويم',        ids: ['F-10','F-11'] },
  ];

  const groupColors = { green: 'var(--accent)', gold: 'var(--gold)', blue: 'var(--blue)', violet: 'var(--violet)' };

  const grid = groups.map(g => {
    const cards = g.ids.map(id => {
      const f = fiches.find(x => x.id === id);
      if (!f) return '';
      return `
        <div class="fiche-card group-${f.group}" onclick="openFiche('${f.id}')">
          <span class="fiche-card-num">${f.num}</span>
          <div class="fiche-card-title">${f.title}</div>
          <div class="fiche-card-desc">${f.desc}</div>
        </div>`;
    }).join('');

    return `
      <div class="fiches-group-label" style="color:${groupColors[g.key]}; border-right:3px solid ${groupColors[g.key]}; padding-right:.5rem;">
        ${g.label}
      </div>
      <div class="fiches-grid">${cards}</div>`;
  }).join('');

  el.innerHTML = `
    <p class="section-intro">
      11 نموذجاً رسمياً مُستخرَجة من ملاحق دليل الحياة المدرسية 2019. اضغط على أي بطاقة لعرضها أو طباعتها.
    </p>
    ${grid}
  `;
}

function openFiche(id) {
  const f = window.FICHES.find(x => x.id === id);
  if (!f) return;
  state.modalFiche = id;

  document.getElementById('modal-title').textContent = f.num + ' — ' + f.title;
  document.getElementById('modal-body').innerHTML = f.html;

  // DOCX button
  const docxBtn = document.getElementById('modal-docx-btn');
  docxBtn.href = 'fiches-docx/' + f.id + '.docx';
  docxBtn.setAttribute('download', f.num + ' — ' + f.title + '.docx');

  // PDF button
  const pdfBtn = document.getElementById('modal-pdf-btn');
  pdfBtn.href = 'fiches-pdf/' + f.id + '.pdf';
  pdfBtn.setAttribute('download', f.num + ' — ' + f.title + '.pdf');

  document.getElementById('fiche-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  history.pushState({ section: state.currentSection, modal: id, facilitator: false }, '', '#modal-' + id);
}

/* UI-only close — called by back button (no history.back()) */
function closeFicheModalUI() {
  document.getElementById('fiche-modal').classList.remove('open');
  document.body.style.overflow = '';
  state.modalFiche = null;
}

/* Called from onclick (✕ button or overlay tap) — goes back in history */
function closeFicheModal(e) {
  if (e && e.target !== document.getElementById('fiche-modal')) return;
  history.back();
}

function printFiche() {
  // Copy fiche content into the dedicated print area, print, then clear
  const content = document.getElementById('modal-body').innerHTML;
  const title   = document.getElementById('modal-title').textContent;
  const area    = document.getElementById('print-area');

  area.innerHTML = `
    <div style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif; direction:rtl; padding:1cm;">
      ${content}
    </div>`;

  document.body.classList.add('printing-fiche');
  window.print();
  document.body.classList.remove('printing-fiche');
  area.innerHTML = '';
}

/* ── Legal ───────────────────────────────────────────── */
function renderLegal() {
  const el = document.getElementById('section-legal');
  const texts = window.LEGAL;

  const cards = texts.map(t => `
    <div class="legal-card">
      <div class="legal-card-header">
        <div class="legal-num">${t.num}</div>
        <div class="legal-info">
          <div class="legal-title">${t.title}</div>
          <div class="legal-date">${t.subtitle} &nbsp;·&nbsp; ${t.date}</div>
        </div>
      </div>
      <div class="legal-body">
        <p style="font-size:.85rem; line-height:1.75; color:var(--txt-muted);">${t.context}</p>
        <div class="legal-key-articles">
          <strong>الأحكام ذات الصلة بالأندية:</strong>
          <ul style="padding-right:1.1rem; list-style:disc; line-height:1.9;">
            ${t.keyArticles.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
        <p style="font-size:.8rem; color:var(--txt-muted); margin-top:.6rem; font-style:italic; line-height:1.6;">
          ${t.relevance}
        </p>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <p class="section-intro">
      المرجعية القانونية المُهيكِلة للأندية التربوية، مرتَّبة من النص التأسيسي إلى الإجرائي.
    </p>
    ${cards}
  `;
}

/* ── Facilitator mode ────────────────────────────────── */
const FACILITATOR_SLIDES = [
  {
    title: 'وضع المُيسِّر — الأندية التربوية',
    content: `
      <div style="text-align:center; color:white; padding:1.5rem 0;">
        <div style="font-size:3rem; margin-bottom:.75rem;">🎯</div>
        <h2 style="color:var(--gold); font-size:1.3rem;">محاكاة تأسيس نادٍ تربوي</h2>
        <p style="color:rgba(255,255,255,.7); margin-top:.5rem; font-size:.9rem;">
          سيمُرُّ الفصل بالتجربة الكاملة لتأسيس نادٍ من الإعلان حتى التقويم.
        </p>
        <div style="margin-top:1.5rem; text-align:right; background:rgba(255,255,255,.06); border-radius:10px; padding:1rem; font-size:.85rem; line-height:2; color:rgba(255,255,255,.8);">
          <strong style="color:var(--gold); display:block; margin-bottom:.4rem;">📋 ما سنتناوله:</strong>
          الإعلان عن النادي ← الجمع التأسيسي ← بناء المشروع ← التخطيط ← التنفيذ ← التقويم
        </div>
      </div>
    `,
    timer: null,
    tip: null,
  },
  {
    title: 'الخطوة 5 — إعلان العزم على التأسيس',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف من هذه الخطوة</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            الإعلان الرسمي عن نية إحداث النادي واستقطاب الأعضاء قبل الجمع التأسيسي.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>قسِّم الطلبة إلى مجموعات — كل مجموعة تُمثِّل نادياً.</li>
          <li>كل مجموعة تُحدِّد: اسم النادي + مجاله + هدفه.</li>
          <li>يكتب ممثل كل مجموعة الإعلان (نموذج ن-01).</li>
          <li>تقديم الإعلان أمام الفصل.</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النموذج المستخدم: <strong style="color:var(--gold);">ن-01 — إعلان العزم على التأسيس</strong>
        </div>
      </div>
    `,
    timer: 10,
    tip: 'ذكِّر الطلبة أن الإعلان يجب أن يتضمن: اسم النادي، مجاله، الهدف، تاريخ الجمع التأسيسي.',
  },
  {
    title: 'الخطوة 6 — الجمع العام التأسيسي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            تأسيس النادي رسمياً عبر انتخاب المكتب وتدوين المحضر.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تعقد جمعها التأسيسي (محاكاة).</li>
          <li>تنتخب بالتصويت: رئيساً، كاتباً، خازناً.</li>
          <li>يملأ الكاتب محضر التأسيس (نموذج ن-02).</li>
          <li>يُعدُّ إعلان ما بعد التأسيس (نموذج ن-03).</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النماذج: <strong style="color:var(--gold);">ن-02 المحضر التأسيسي + ن-03 إعلان التأسيس</strong>
        </div>
      </div>
    `,
    timer: 12,
    tip: 'لفت الانتباه: التصويت يكون بالأغلبية المطلقة — عند التعادل يُرجَّح صوت الرئيس المُؤقَّت.',
  },
  {
    title: 'الخطوة 7 — بناء مشروع النادي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            صياغة الوثيقة التأسيسية التي تُحدِّد هوية النادي وطريقة اشتغاله.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تملأ بطاقة مشروع النادي (ن-07).</li>
          <li>التركيز على المحاور: الأهداف + الأنشطة + الفئات + الموارد + التمويل.</li>
          <li>عرض المشروع أمام الفصل وتلقي الملاحظات.</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النموذج: <strong style="color:var(--gold);">ن-07 — بطاقة عناصر مشروع النادي (8 محاور)</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'محور التمويل غالباً ما يُهمل — ذكِّر بأن جمعية دعم مدرسة النجاح هي الإطار القانوني الوحيد.',
  },
  {
    title: 'الخطوة 8 — التخطيط السنوي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            ترجمة المشروع إلى برامج وخطط قابلة للتنفيذ والمتابعة.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>إعداد برنامج العمل السنوي (ن-04): الأنشطة + الفترات + المتدخلون.</li>
          <li>وضع خطة العمل (ن-05): الأهداف ↔ النتائج المنتظرة ↔ الأنشطة.</li>
          <li>رسم البرمجة الزمنية (ن-06): Gantt نونبر→يونيو.</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النماذج: <strong style="color:var(--gold);">ن-04 برنامج + ن-05 خطة + ن-06 Gantt</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'نادٍ بدون خطة زمنية (Gantt) لا يتابَع ولا يُقيَّم — إنه من أكثر النماذج التي تُهمل.',
  },
  {
    title: 'الخطوة 9 — تنفيذ الأنشطة',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            إنجاز الأنشطة وتوثيقها بالنماذج المناسبة.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تختار نشاطاً من برنامجها وتملأ بطاقة النشاط (ن-08).</li>
          <li>تعقد اجتماعاً مُحاكاةً وتملأ المحضر (ن-09).</li>
          <li>مناقشة جماعية: ما الفرق بين نشاط موثَّق وآخر غير موثَّق؟</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النماذج: <strong style="color:var(--gold);">ن-08 بطاقة النشاط + ن-09 محضر الاجتماع</strong>
        </div>
      </div>
    `,
    timer: 12,
    tip: 'اطرح السؤال: لماذا نحتاج محضراً لكل اجتماع؟ من يستفيد منه؟ (الإدارة، الشركاء، التقييم...).',
  },
  {
    title: 'الخطوات 10-11 — التقويم',
    content: `
      <div style="color:white;">
        <div style="background:rgba(107,70,193,.3); border:1px solid var(--violet); border-radius:10px; padding:1rem; margin-bottom:1rem;">
          <strong style="color:#c4b5fd; font-size:.85rem;">الهدف</strong>
          <p style="font-size:.88rem; margin-top:.35rem; line-height:1.7; color:rgba(255,255,255,.85);">
            تقييم ما أنجزه النادي واستخلاص الدروس للمستقبل.
          </p>
        </div>
        <strong style="color:var(--gold); font-size:.9rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.5rem; line-height:2; font-size:.88rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تملأ بطاقة تقويم حصيلة ناديها (ن-10).</li>
          <li>عرض نتائج التقويم أمام الفصل.</li>
          <li>المُيسِّر يُوحِّد الحصيلة على مستوى "المؤسسة" (ن-11).</li>
          <li>نقاش ختامي: ما الذي يجعل النادي ناجحاً؟</li>
        </ol>
        <div style="background:rgba(176,125,58,.2); border:1px solid var(--gold); border-radius:8px; padding:.7rem; margin-top:.75rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 النماذج: <strong style="color:var(--gold);">ن-10 تقويم النادي + ن-11 تقويم الأندية (مستوى المؤسسة)</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'الختام المهم: اطلب من كل مجموعة أن تُسمِّي شيئاً واحداً تعلَّمته لن تنساه — يُعزِّز الأثر التربوي.',
  },
  {
    title: 'خلاصة المسار',
    content: `
      <div style="color:white; text-align:center; padding:1rem 0;">
        <div style="font-size:2.5rem; margin-bottom:.75rem;">🎉</div>
        <h3 style="color:var(--gold); margin-bottom:1rem;">مسار الإحداث كاملاً</h3>
        <div style="text-align:right; background:rgba(255,255,255,.06); border-radius:10px; padding:1rem; font-size:.85rem; line-height:2.2;">
          ${[
            ['ن-01', 'إعلان العزم على التأسيس'],
            ['ن-02', 'محضر الجمع التأسيسي'],
            ['ن-03', 'إعلان ما بعد التأسيس'],
            ['ن-07', 'بطاقة مشروع النادي'],
            ['ن-04+05+06', 'التخطيط السنوي (برنامج + خطة + Gantt)'],
            ['ن-08+09', 'التنفيذ (بطاقة النشاط + المحضر)'],
            ['ن-10+11', 'التقويم (النادي + المؤسسة)'],
          ].map(([n, t]) => `
            <div style="display:flex; align-items:center; gap:.6rem; padding:.25rem 0; border-bottom:1px solid rgba(255,255,255,.08);">
              <span style="background:var(--accent); color:white; font-size:.68rem; padding:2px 6px; border-radius:4px; flex-shrink:0;">${n}</span>
              <span style="font-size:.85rem;">${t}</span>
            </div>`).join('')}
        </div>
      </div>
    `,
    timer: null,
    tip: 'للحفظ: الذاكرة "أسست النادي ↔ خطَّط ↔ نفَّذ ↔ قيَّم" — كل حلقة لها بطاقة.',
  },
];

function bindFacilitator() {
  // Close button
  document.getElementById('btn-exit-facilitator').addEventListener('click', closeFacilitator);

  // Navigation
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (state.facilitatorSlide > 0) {
      state.facilitatorSlide--;
      showSlide(state.facilitatorSlide);
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    if (state.facilitatorSlide < FACILITATOR_SLIDES.length - 1) {
      state.facilitatorSlide++;
      showSlide(state.facilitatorSlide);
    }
  });
}

function openFacilitator() {
  state.facilitatorSlide = 0;
  const fm = document.getElementById('facilitator-mode');
  fm.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderFacilitatorSlides();
  showSlide(0);
  history.pushState({ section: state.currentSection, modal: null, facilitator: true }, '', '#facilitateur');
}

/* UI-only close — called by back button */
function closeFacilitatorUI() {
  document.getElementById('facilitator-mode').classList.remove('open');
  document.body.style.overflow = '';
}

/* Called from ✕ button — goes back in history */
function closeFacilitator() {
  history.back();
}

function renderFacilitatorSlides() {
  const container = document.getElementById('facilitator-slides');
  container.innerHTML = FACILITATOR_SLIDES.map((s, i) => `
    <div class="slide" id="slide-${i}">
      <h2 style="color:var(--gold); font-size:1rem; margin-bottom:1rem; line-height:1.4;">${s.title}</h2>
      ${s.content}
      ${s.tip ? `
        <div style="background:rgba(192,57,43,.18); border:1px solid var(--red); border-radius:8px; padding:.65rem .85rem; margin-top:1rem; font-size:.8rem; color:rgba(255,255,255,.8); line-height:1.65;">
          💡 <strong style="color:#ff9a9a;">تلميح للمُيسِّر:</strong> ${s.tip}
        </div>` : ''}
      ${s.timer ? `
        <div style="margin-top:.85rem; display:flex; align-items:center; gap:.6rem; font-size:.82rem; color:rgba(255,255,255,.5);">
          ⏱️ الوقت المقترح: <strong style="color:rgba(255,255,255,.75);">${s.timer} دقيقة</strong>
        </div>` : ''}
    </div>`).join('');
}

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((s, i) => s.classList.toggle('active', i === index));

  document.getElementById('slide-counter').textContent =
    `${index + 1} / ${FACILITATOR_SLIDES.length}`;

  document.getElementById('btn-prev').disabled = index === 0;
  document.getElementById('btn-next').disabled = index === FACILITATOR_SLIDES.length - 1;

  // Scroll to top
  document.getElementById('facilitator-content').scrollTop = 0;
}

/* ── Helpers ─────────────────────────────────────────── */
function makeCollapsible(id, title, bodyHtml, startOpen = false) {
  return `
    <div class="collapsible${startOpen ? ' open' : ''}" id="col-${id}">
      <div class="collapsible-header" onclick="toggleCollapsible('${id}')">
        <span class="collapsible-title">${title}</span>
        <span class="collapsible-chevron">▾</span>
      </div>
      <div class="collapsible-body">${bodyHtml}</div>
    </div>`;
}

function toggleCollapsible(id) {
  const el = document.getElementById('col-' + id);
  el.classList.toggle('open');
}
