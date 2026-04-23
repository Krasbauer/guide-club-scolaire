/* =====================================================
   main.js — Navigation, routing, rendering
   Guide Club Scolaire — الأندية التربوية
   ===================================================== */

/* ── State ─────────────────────────────────────────── */
const state = {
  currentSection: 'home',
  facilitatorSlide: 0,
  modalFiche: null,
  showInstitutional: true,
  fillMode: false,
  legalView: 'list',
};

/* ── Section ids ────────────────────────────────────── */
const SECTIONS = ['home', 'concept', 'parcours', 'fiches', 'legal'];

/* ── Analytics ──────────────────────────────────────── */
const UPSTASH_URL = 'https://nearby-leech-70999.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAARVXAAIgcDIwNjc0Y2UyY2RkZmE0MTQwYjY0YzM1ODUwOWJiY2Q2ZA';
const STATS_KEY = 'clubs-scolaires:stats';
const STATS_KEYS = ['visits', 'pdf-downloads', 'docx-downloads', 'installs'];

function upstash(cmd) {
  return fetch(UPSTASH_URL + '/' + cmd, {
    headers: { Authorization: 'Bearer ' + UPSTASH_TOKEN }
  }).then(r => r.json());
}

function parseCounts(result) {
  const counts = {};
  for (let i = 0; i < result.length; i += 2) counts[result[i]] = parseInt(result[i + 1]) || 0;
  return counts;
}

function updateStatEls(counts) {
  STATS_KEYS.forEach(k => {
    const el = document.getElementById('stat-' + k);
    if (el && counts[k] !== undefined) el.textContent = counts[k].toLocaleString('en');
  });
}

function trackEvent(key) {
  const cached = JSON.parse(localStorage.getItem('stats') || '{}');
  cached[key] = (cached[key] || 0) + 1;
  localStorage.setItem('stats', JSON.stringify(cached));
  upstash('hincrby/' + STATS_KEY + '/' + key + '/1')
    .then(() => upstash('hgetall/' + STATS_KEY))
    .then(d => {
      const counts = parseCounts(d.result);
      Object.assign(cached, counts);
      localStorage.setItem('stats', JSON.stringify(cached));
      updateStatEls(counts);
    }).catch(() => {});
}

function fetchStats() {
  const cached = JSON.parse(localStorage.getItem('stats') || '{}');
  updateStatEls(cached);
  upstash('hgetall/' + STATS_KEY).then(d => {
    const counts = parseCounts(d.result);
    Object.assign(cached, counts);
    localStorage.setItem('stats', JSON.stringify(cached));
    updateStatEls(counts);
  }).catch(() => {});
}

window.addEventListener('appinstalled', () => trackEvent('installs'));

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
  bindSearch();
  trackEvent('visits');
  fetchStats();

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
    home:    'Guide Club Scolaire',
    concept: 'المفهوم والأهداف',
    parcours:'مسار الإحداث',
    fiches:  'البطاقات والنماذج',
    legal:   'المرجعية القانونية',
  };
  document.getElementById('top-bar-title').textContent = titles[id] || 'Guide Club Scolaire';
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

    <!-- Hero -->
    <div class="home-hero">
      <div class="home-hero-icon">🏫</div>
      <h1>Guide Club Scolaire</h1>
      <p>أداة مرجعية شاملة لإحداث الأندية التربوية وتسييرها<br>وفق الإجراءات الرسمية لوزارة التربية الوطنية المغربية</p>
      <div class="home-chips">
        <span class="home-chip">11 خطوة إحداث</span>
        <span class="home-chip">11 نموذجاً رسمياً</span>
        <span class="home-chip">${Object.keys(window.LEGAL_DOCS).length} مرجعاً قانونياً</span>
        <span class="home-chip">🎯 وضع المُيسِّر</span>
      </div>
    </div>

    <!-- Stats card -->
    <div class="stats-card">
      <div class="stats-title">إحصاءات الاستخدام</div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-num" id="stat-visits">---</span>
          <span class="stat-label">زيارة</span>
        </div>
        <div class="stat-item">
          <span class="stat-num" id="stat-pdf-downloads">---</span>
          <span class="stat-label">تحميل PDF</span>
        </div>
        <div class="stat-item">
          <span class="stat-num" id="stat-docx-downloads">---</span>
          <span class="stat-label">تحميل DOCX</span>
        </div>
        <div class="stat-item">
          <span class="stat-num" id="stat-installs">---</span>
          <span class="stat-label">تثبيت</span>
        </div>
      </div>
    </div>

    <!-- Info cards -->
    <div class="home-info-card">
      <h2 class="home-card-title">📋 ما هذا الدليل؟</h2>
      <p>مرجع عملي يُرافقك عبر كل مراحل إحداث نادٍ تربوي — من الإخطار المؤسسي حتى التقويم النهائي. كل خطوة مرتبطة بنماذجها الرسمية القابلة للتحميل والطباعة.</p>
    </div>

    <div class="home-info-card">
      <h2 class="home-card-title">👤 لمن؟</h2>
      <p>الأساتذة المتدربون بالمراكز الجهوية لمهن التربية والتكوين (CRMEF) · الأساتذة الجدد في الميدان · منسقو الأندية التربوية</p>
    </div>

    <div class="home-info-card">
      <h2 class="home-card-title">📚 المصدر الرسمي</h2>
      <p>دليل الحياة المدرسية 2019 وملاحقه — مديرية الحياة المدرسية، وزارة التربية الوطنية المغربية</p>
    </div>

    <!-- Navigation -->
    <div class="home-section-title">الأقسام</div>
    <div class="cards-grid">
      <div class="nav-card" onclick="navigateTo('concept')">
        <span class="card-icon">📖</span>
        <div class="card-body">
          <div class="card-title">المفهوم</div>
          <div class="card-sub">التعريف، الأهداف، الأنواع</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('parcours')">
        <span class="card-icon">🗺️</span>
        <div class="card-body">
          <div class="card-title">المسار</div>
          <div class="card-sub">11 خطوة من الإخطار إلى التقويم</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('fiches')">
        <span class="card-icon">📋</span>
        <div class="card-body">
          <div class="card-title">البطاقات</div>
          <div class="card-sub">11 نموذجاً رسمياً — PDF + DOCX</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>

      <div class="nav-card" onclick="navigateTo('legal')">
        <span class="card-icon">⚖️</span>
        <div class="card-body">
          <div class="card-title">القانون</div>
          <div class="card-sub">3 أصناف · ${Object.keys(window.LEGAL_DOCS).length} مرجعاً قانونياً</div>
        </div>
        <span class="card-arrow">‹</span>
      </div>
    </div>

    <!-- Facilitator mode -->
    <div class="nav-card facilitator card-wide" onclick="openFacilitator()" style="margin-top:.5rem;">
      <span class="card-icon">🎯</span>
      <div class="card-body">
        <div class="card-title">وضع المُيسِّر</div>
        <div class="card-sub">محاكاة تفاعلية لتأسيس نادٍ — مُصمَّم للأنشطة الصفية</div>
      </div>
      <span class="card-arrow" style="color:var(--gold);">‹</span>
    </div>

    <!-- Activities bank — subtle -->
    <div class="home-activities-link" onclick="openActivitiesBank()">
      💡 بنك الأنشطة — 8 مجالات × 4 مقترحات
    </div>`;
}

/* ── Activities Bank ─────────────────────────────────── */
const ACTIVITIES_BANK = [
  { icon: '🤝', cat: 'التعاون والتضامن', color: '#2d6a4f', activities: [
    'تنظيم يوم تضامن مع تلاميذ محتاجين أو ذوي احتياجات خاصة',
    'حملة تبرع بالكتب والأدوات المدرسية',
    'نشاط "مرشد الصف الأول" — تلاميذ كبار يرافقون الصغار',
    'مشروع "مقهى التواصل" — نشاطات جماعية بين أفواج مختلفة',
  ]},
  { icon: '❤️', cat: 'الصحة والسلامة', color: '#c0392b', activities: [
    'ورشة إسعاف أولي وتعريف بمخاطر الإصابات الشائعة',
    'حملة توعية بالتغذية السليمة وأضرار المأكولات المصنَّعة',
    'نشاط رياضي صباحي دوري (تمدد، مشي، ألعاب جماعية)',
    'حملة ضد التدخين والمخدرات بمشاركة جمعيات خارجية',
  ]},
  { icon: '🌱', cat: 'البيئة والتنمية المستدامة', color: '#40916c', activities: [
    'إنشاء ركن أخضر في فناء المدرسة أو حديقة مدرسية',
    'حملة تنظيف المحيط المدرسي والحي',
    'ورشة إعادة تدوير النفايات وصنع أشياء نافعة',
    'مشاركة في اليوم العالمي للبيئة بعروض وأنشطة توعوية',
  ]},
  { icon: '🎨', cat: 'الفن والإبداع', color: '#b07d3a', activities: [
    'عرض مسرحي قصير حول قيمة تربوية',
    'ورشة خط عربي أو زليج مغربي أو زخرفة',
    'تصوير فيلم قصير (جوال) حول حياة المؤسسة',
    'معرض لوحات فنية من صنع التلاميذ في نهاية السنة',
  ]},
  { icon: '📚', cat: 'القراءة والكتابة', color: '#6b46c1', activities: [
    'نادي قراءة — كل أسبوعين كتاب ومناقشة',
    'إصدار جريدة حائط أو مجلة مدرسية',
    'مسابقة قصة قصيرة أو شعر أو خطابة',
    'زيارة مكتبة جهوية أو استضافة كاتب',
  ]},
  { icon: '💻', cat: 'الإعلاميات والرقميات', color: '#2c6fad', activities: [
    'ورشة إنشاء مدوَّنة أو صفحة للنادي',
    'تصميم إنفوغرافيك حول موضوع تربوي بالأدوات المجانية',
    'تعلُّم برمجة بسيطة (Scratch) أو إنشاء عروض رقمية',
    'مسابقة تصوير فوتوغرافي بالهاتف + معرض رقمي',
  ]},
  { icon: '🔬', cat: 'العلوم والاكتشاف', color: '#0e7490', activities: [
    'تجارب علمية بسيطة مع شرح المبادئ (كيمياء، فيزياء)',
    'مشروع زراعة نباتات ومتابعة نموها',
    'زيارة مؤسسة علمية أو مختبر',
    'مسابقة اختراعات بسيطة لحل مشكلة في المدرسة',
  ]},
  { icon: '⚽', cat: 'الرياضة والحركة', color: '#1a5c38', activities: [
    'دوري كرة قدم أو كرة اليد بين أفواج المؤسسة',
    'تعلُّم رياضة جديدة (بينغ بونغ، شطرنج، فنون دفاعية)',
    'يوم رياضي مفتوح مع دعوة أولياء الأمور',
    'تمارين تنمية الإدراك الحركي وتنسيق الحركة',
  ]},
];

function openActivitiesBank() {
  const html = ACTIVITIES_BANK.map(cat => `
    <div style="margin-bottom:1.1rem;">
      <div style="display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem;">
        <span style="font-size:1.3rem;">${cat.icon}</span>
        <strong style="font-size:.92rem; color:${cat.color};">${cat.cat}</strong>
      </div>
      <ul style="padding-right:1.2rem; list-style:disc; font-size:.85rem; line-height:1.9; color:var(--txt);">
        ${cat.activities.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>`).join('<hr style="border:none;border-top:1px solid var(--border);margin:.5rem 0;">');

  document.getElementById('modal-title').textContent = 'بنك الأنشطة — مقترحات لبرامج الأندية';
  document.getElementById('modal-body').innerHTML = `
    <p style="font-size:.83rem; color:var(--txt-muted); margin-bottom:1rem; line-height:1.65;">
      8 مجالات × 4 أنشطة مقترحة — مصدر إلهام لبرامج العمل. هذه الأنشطة قابلة للتكييف حسب المستوى والموارد المتاحة.
    </p>
    ${html}`;

  document.getElementById('modal-docx-btn').style.display = 'none';
  document.getElementById('modal-pdf-btn').style.display = 'none';
  document.getElementById('fiche-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  history.pushState({ section: state.currentSection, modal: 'activities-bank', facilitator: false }, '', '#activities-bank');
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

    ${makeCollapsible('c-obj', '🎯 الأهداف التربوية (9 أهداف)', `
      <ol style="padding-right:1.4rem; line-height:2.1; font-size:.9rem;">
        <li>تعزيز ممارسة الديمقراطية وتدبير الاختلاف.</li>
        <li>تنمية مهارات الإدارة والتنظيم والتخطيط.</li>
        <li>تطوير مهارات التواصل والتعبير والحوار.</li>
        <li>صقل الكفايات الحياتية في سياقات حقيقية.</li>
        <li>تقوية الانتماء إلى الجماعة والمجتمع والمؤسسة.</li>
        <li>تعزيز روح الفريق والتعاون والعمل المشترك.</li>
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
        <li><strong>أندية الاشتراك:</strong> تستخدم مقاربة واحدة عبر مواضيع متعددة (نادي الصحافة المدرسية، نادي الأبحاث، نادي الإعلاميات...).</li>
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
        <svg viewBox="0 0 360 165" width="100%" style="max-width:400px; display:block; margin:0 auto;">

          <!-- ═══ Labels de section ═══ -->
          <text x="80" y="11" text-anchor="middle" fill="#2c6fad" font-size="8.5" font-family="IBM Plex Sans Arabic,Arial" font-weight="700">الإشراف المؤسسي</text>
          <text x="280" y="11" text-anchor="middle" fill="#2d6a4f" font-size="8.5" font-family="IBM Plex Sans Arabic,Arial" font-weight="700">الهيكل الداخلي للنادي</text>

          <!-- ═══ Côté institutionnel (gauche) ═══ -->
          <rect x="16" y="16" width="128" height="32" rx="7" fill="#2c6fad" opacity=".9"/>
          <text x="80" y="36" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">مدير المؤسسة</text>

          <line x1="80" y1="48" x2="80" y2="62" stroke="#aaa" stroke-width="1.5"/>

          <rect x="16" y="62" width="128" height="30" rx="7" fill="#40916c" opacity=".9"/>
          <text x="80" y="82" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">منسِّق الأندية</text>

          <line x1="80" y1="92" x2="80" y2="106" stroke="#aaa" stroke-width="1.5"/>

          <rect x="16" y="106" width="128" height="30" rx="7" fill="#b07d3a" opacity=".9"/>
          <text x="80" y="126" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">المؤطِّر التربوي</text>

          <!-- Lien de supervision (pointillé) vers مكتب -->
          <line x1="144" y1="121" x2="206" y2="87" stroke="#888" stroke-width="1.2" stroke-dasharray="4,3"/>

          <!-- ═══ Côté club interne (droite) ═══ -->
          <!-- الجمع العام — autorité suprême -->
          <rect x="206" y="16" width="148" height="32" rx="7" fill="#b07d3a" opacity=".9"/>
          <text x="280" y="36" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">الجمع العام للنادي</text>

          <line x1="280" y1="48" x2="280" y2="62" stroke="#aaa" stroke-width="1.5"/>

          <!-- المكتب التنفيذي -->
          <rect x="206" y="62" width="148" height="32" rx="7" fill="#2d6a4f" opacity=".9"/>
          <text x="280" y="79" text-anchor="middle" fill="white" font-size="10" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">المكتب التنفيذي</text>
          <text x="280" y="90" text-anchor="middle" fill="rgba(255,255,255,.75)" font-size="8.5" font-family="IBM Plex Sans Arabic,Arial">رئيس · نائب الرئيس · كاتب</text>

          <line x1="280" y1="94" x2="280" y2="108" stroke="#aaa" stroke-width="1.5"/>

          <!-- أعضاء -->
          <rect x="206" y="108" width="148" height="30" rx="7" fill="#52b788" opacity=".85"/>
          <text x="280" y="128" text-anchor="middle" fill="white" font-size="11" font-family="IBM Plex Sans Arabic,Arial" font-weight="600">أعضاء النادي</text>

        </svg>
      </div>
      <p style="font-size:.82rem; color:var(--txt-muted); margin-top:.6rem; line-height:1.65;">
        <strong>المكتب التنفيذي</strong> يُنتخَب من طرف <strong>الجمع العام</strong> — يتكون من: الرئيس، نائب الرئيس، الكاتب. الخط المنقَّط = إشراف وتأطير مؤسسي.
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

    ${makeCollapsible('c-admin-resp', '🏛️ مسؤوليات الإدارة (شروط النجاح — ص91-92)', `
      <p style="font-size:.83rem; color:var(--txt-muted); margin-bottom:.65rem; line-height:1.65;">
        يُحدِّد الدليل الرسمي مسؤوليات الإدارة بشكل صريح — هي شرط لا خيار:
      </p>
      ${[
        ['توفير الزمان والمكان', 'تخصيص حصص ثابتة في الجدول الزمني وفضاء ملائم لاشتغال النادي.'],
        ['توفير الوسائل المادية والبشرية', 'تأمين الأدوات والتجهيزات اللازمة وتسهيل مهمة المؤطرين.'],
        ['إرساء الشراكات الخارجية', 'ربط علاقات مع مؤسسات وجمعيات تُعزِّز برامج الأندية.'],
        ['إعداد تقارير التقويم', 'رفع تقارير منتظمة إلى المديريات الإقليمية حول أداء الأندية.'],
        ['ضمان التنسيق المؤسسي', 'التنسيق بين المجلس التربوي ومجلس التدبير وجمعية الآباء ومختلف الفاعلين.'],
      ].map(([t, d]) => `
        <div style="display:flex; gap:.7rem; align-items:flex-start; padding:.55rem 0; border-bottom:1px solid var(--border);">
          <span style="color:var(--blue); font-size:1rem; flex-shrink:0; margin-top:2px;">◈</span>
          <div>
            <strong style="font-size:.88rem; color:var(--blue);">${t}</strong>
            <p style="font-size:.82rem; color:var(--txt-muted); margin-top:2px; line-height:1.6;">${d}</p>
          </div>
        </div>`).join('')}
    `)}

    ${makeCollapsible('c-eval-parties', '👥 أطراف التقويم (12 طرفاً رسمياً)', `
      <p style="font-size:.83rem; color:var(--txt-muted); margin-bottom:.65rem; line-height:1.65;">
        يُشارك في تقويم النادي التربوي 12 طرفاً رسمياً — كل طرف يُقدِّم منظوره الخاص (بطاقة ن-10):
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:.45rem;">
        ${[
          ['مجلس التدبير','⚙️'],
          ['المجلس التربوي','📚'],
          ['هيئة الإدارة','🏛️'],
          ['هيئة التدريس','👨‍🏫'],
          ['المتعلمون','🎓'],
          ['هيئة التفتيش','🔍'],
          ['جمعية الآباء','👪'],
          ['الجماعة المحلية','🏘️'],
          ['قطاعات حكومية','🏢'],
          ['جمعيات تنموية','🤝'],
          ['شركاء','🔗'],
          ['أشخاص مصادر','💡'],
        ].map(([label, icon]) => `
          <div style="display:flex; align-items:center; gap:.5rem; background:var(--violet-bg); border:1px solid #d8d0f5; border-radius:7px; padding:.45rem .6rem; font-size:.82rem;">
            <span style="font-size:1rem;">${icon}</span>
            <span>${label}</span>
          </div>`).join('')}
      </div>
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
      <input type="checkbox" id="show-institutional" checked onchange="toggleInstitutional(this.checked)">
      <label for="show-institutional">إخفاء المستوى المؤسسي (الخطوات 1-4)</label>
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
           style="${isInstitutional && !state.showInstitutional ? 'display:none' : ''}">
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
              </div>
              <div class="step-fiche-downloads">
                ${step.fiches.map(id => {
                  const f = window.FICHES.find(x => x.id === id);
                  if (!f) return '';
                  return `
                    <a class="step-dl-btn step-dl-pdf" href="fiches-pdf/${f.id}.pdf" download="${f.num} — ${f.title}.pdf">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                      ${f.num} PDF
                    </a>
                    <a class="step-dl-btn step-dl-docx" href="fiches-docx/${f.id}.docx" download="${f.num} — ${f.title}.docx">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                      ${f.num} DOCX
                    </a>`;
                }).join('')}
              </div>` : ''}
            ${makeStepSub('legal-' + step.id, '⚖️ السند القانوني', step.legal)}
            ${makeStepSub('why-' + step.id, '💡 لماذا هذه المرحلة؟', step.why)}
          </div>
        </div>
      </div>`;
  }).join('');

  const facilitatorLink = `
    <div style="text-align:center; margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border);">
      <button type="button" onclick="openFacilitator()" class="btn-open-facilitator">
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
  const lbl = document.querySelector('label[for="show-institutional"]');
  if (lbl) lbl.textContent = show ? 'إخفاء المستوى المؤسسي (الخطوات 1-4)' : 'إظهار المستوى المؤسسي (الخطوات 1-4)';
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

  // Step context banner
  const step = window.PARCOURS.find(s => s.id === f.step);
  const ctxHtml = step ? `
    <div class="fiche-step-ctx">
      <span class="fiche-step-ctx-label">تُستخدم في: <strong>الخطوة ${step.num} — ${step.title}</strong></span>
      <button class="fiche-step-ctx-btn" onclick="closeFicheModal(); navigateTo('parcours'); setTimeout(()=>{ toggleStep('${step.id}'); document.getElementById('body-${step.id}').scrollIntoView({behavior:'smooth',block:'center'}); }, 300);">عرض الخطوة</button>
    </div>` : '';

  state.fillMode = false;
  document.getElementById('modal-body').innerHTML = ctxHtml + f.html;

  // Fill button
  const fillBtn = document.getElementById('modal-fill-btn');
  if (f.fillable) {
    fillBtn.hidden = false;
    fillBtn.textContent = '✏️ ملء النموذج';
  } else {
    fillBtn.hidden = true;
  }

  // DOCX button
  const docxBtn = document.getElementById('modal-docx-btn');
  docxBtn.href = 'fiches-docx/' + f.id + '.docx';
  docxBtn.setAttribute('download', f.num + ' — ' + f.title + '.docx');
  docxBtn.style.display = '';
  docxBtn.onclick = () => trackEvent('docx-downloads');

  // PDF button
  const pdfBtn = document.getElementById('modal-pdf-btn');
  pdfBtn.href = 'fiches-pdf/' + f.id + '.pdf';
  pdfBtn.setAttribute('download', f.num + ' — ' + f.title + '.pdf');
  pdfBtn.style.display = '';
  pdfBtn.onclick = () => trackEvent('pdf-downloads');

  document.getElementById('fiche-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  history.pushState({ section: state.currentSection, modal: id, facilitator: false }, '', '#modal-' + id);
}

/* UI-only close — called by back button (no history.back()) */
function closeFicheModalUI() {
  document.getElementById('fiche-modal').classList.remove('open');
  document.body.style.overflow = '';
  state.modalFiche = null;
  state.fillMode = false;
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
  showLegalView('list');
}

function legalDocCount(cat) {
  const n = cat.docs
    ? cat.docs.length
    : (cat.subcats || []).reduce((t, s) => t + s.docs.length, 0);
  return n >= 11 ? n + ' مرجعاً' : n >= 3 ? n + ' مراجع' : n + ' مرجع';
}

function legalFindCat(docId) {
  for (const cat of window.LEGAL_TREE) {
    if (cat.docs && cat.docs.includes(docId)) return cat.id;
    if (cat.subcats) {
      for (const sub of cat.subcats) {
        if (sub.docs.includes(docId)) return cat.id;
      }
    }
  }
  return '1';
}

function legalDocRow(id) {
  const d = window.LEGAL_DOCS[id];
  if (!d) return '';
  return `
    <div class="legal-doc-row" onclick="showLegalView('doc:${id}')">
      <div class="legal-doc-row-body">
        <div class="legal-doc-row-title">${d.title}</div>
        <div class="legal-doc-row-sub">${d.date}</div>
      </div>
      ${d.download ? '<span class="legal-dl-badge">PDF</span>' : ''}
      <span class="legal-doc-row-arrow">‹</span>
    </div>`;
}

function showLegalView(view) {
  state.legalView = view;
  const el = document.getElementById('section-legal');
  if (!el) return;

  if (view === 'list') {
    const cats = window.LEGAL_TREE;
    const allDlDocs = Object.entries(window.LEGAL_DOCS).filter(([, d]) => d.download);
    const dlBlock = allDlDocs.length ? `
      <div class="legal-dl-block">
        <div class="legal-dl-block-title" onclick="this.parentElement.classList.toggle('open')">
          <span>التنزيلات المتاحة (${allDlDocs.length})</span>
          <span class="legal-dl-chev">▾</span>
        </div>
        <div class="legal-dl-list">
          ${allDlDocs.map(([, d]) => `
            <a class="legal-dl-item" href="${d.download}" download>
              <span>📥</span>
              <span>${d.title}</span>
            </a>`).join('')}
        </div>
      </div>` : '';

    el.innerHTML = `
      <div class="legal-section-header">
        <h1 class="legal-section-title">المرجعيات المؤطرة للأندية التربوية</h1>
        <p class="legal-section-sub">3 أصناف · ${Object.keys(window.LEGAL_DOCS).length} مرجعاً</p>
      </div>
      <div class="legal-cats-list">
        ${cats.map((cat, i) => `
          <div class="legal-cat-card" onclick="showLegalView('cat:${cat.id}')">
            <div class="legal-cat-card-num">${i + 1}</div>
            <div class="legal-cat-card-body">
              <div class="legal-cat-card-title">${cat.title}</div>
              <div class="legal-cat-card-count">${legalDocCount(cat)}</div>
            </div>
            <span class="legal-cat-card-arrow">‹</span>
          </div>`).join('')}
      </div>
      ${dlBlock}
    `;
    return;
  }

  if (view.startsWith('cat:')) {
    const catId = view.slice(4);
    const cat = window.LEGAL_TREE.find(c => c.id === catId);
    if (!cat) { showLegalView('list'); return; }

    let content = '';
    if (cat.subcats) {
      content = cat.subcats.map(sub => `
        <div class="legal-subcat-label">${sub.id} — ${sub.title}</div>
        ${sub.docs.map(legalDocRow).join('')}
      `).join('');
    } else {
      content = (cat.docs || []).map(legalDocRow).join('');
    }

    el.innerHTML = `
      <button class="legal-back-btn" onclick="showLegalView('list')">رجوع →</button>
      <div class="legal-cat-page-title">${cat.title}</div>
      ${content}
    `;
    el.scrollTop = 0;
    window.scrollTo(0, 0);
    return;
  }

  if (view.startsWith('doc:')) {
    const docId = view.slice(4);
    const d = window.LEGAL_DOCS[docId];
    if (!d) { showLegalView('list'); return; }
    const catId = legalFindCat(docId);

    const extractsHtml = d.extracts.map(e => `<li>${e}</li>`).join('');

    const downloadHtml = d.download ? `
      <a class="legal-download-btn" href="${d.download}" download>
        📥 تحميل الوثيقة (PDF)
      </a>` : '';

    let specialHtml = '';
    if (d.special === 'kharitat-obj3') {
      specialHtml = `
        <div class="legal-special-box">
          <div class="legal-special-box-label">الهدف الاستراتيجي 3 — تحقيق إلزامية التعليم</div>
          <p>يُركِّز هذا الهدف على ثلاثة محاور: التعلمات الأساسية، <strong>الأنشطة الموازية</strong>، والحد من الهدر المدرسي.</p>
          <p style="margin-top:.5rem; font-size:.82rem; color:var(--accent);">الهدف الكمي بحلول 2026: <strong>مضاعفة نسبة التلاميذ المستفيدين من الأنشطة الموازية</strong></p>
        </div>`;
    }
    if (d.special === 'itaar-grid') {
      const programs = [
        'التعليم الأولي','التعليم الابتدائي','التعليم الثانوي الإعدادي والتأهيلي',
        'الأنشطة الموازية','ظروف الاستقبال بالمؤسسات التعليمية','مشروع المؤسسة المندمج',
        'الأنشطة الاعتيادية بالسلك الابتدائي','مناهج التعليم الثانوي','ترشيد المسالك الدراسية',
        'مسارات متنوعة','الدعم الاجتماعي','الصحة المدرسية',
        'المدارس الدامجة','نظام أساسي موحد','الارتقاء المهني للمدرسين',
        'التكوين الأساس بمراكز التكوين','التنظيم — الحوض المدرسي','القيادة ولوحة التتبع',
        'إدماج التخطيط والميزنة والتنفيذ','الالتزام والتواصل',
      ];
      const highlight = [3, 5]; // 0-indexed: P4 = index 3, P6 = index 5
      const cells = programs.map((p, i) => {
        const isHL = highlight.includes(i);
        return `<div class="itaar-cell${isHL ? ' itaar-cell-highlight' : ''}">
          <span class="itaar-cell-num">${i + 1}</span>
          <span class="itaar-cell-name">${p}</span>
          ${isHL ? `<span class="itaar-cell-star">★</span>` : ''}
        </div>`;
      }).join('');
      specialHtml = `
        <div class="legal-special-box itaar-box">
          <div class="legal-special-box-label">الإطار الإجرائي — 20 برنامجاً</div>
          <div class="itaar-grid">${cells}</div>
          <p class="itaar-caption">
            ★ <strong>البرنامج 4 — الأنشطة الموازية:</strong> الإطار المباشر للأندية التربوية<br>
            ★ <strong>البرنامج 6 — مشروع المؤسسة المندمج:</strong> الأندية جزء من المشروع المؤسسي
          </p>
        </div>`;
    }

    el.innerHTML = `
      <button class="legal-back-btn" onclick="showLegalView('cat:${catId}')">رجوع →</button>
      <div class="legal-doc-page">
        <h2 class="legal-doc-title">${d.title}</h2>
        <div class="legal-doc-meta">
          <span class="legal-doc-date">${d.date}</span>
          <span class="legal-doc-issuer">${d.issuer}</span>
        </div>
        <p class="legal-doc-context">${d.context}</p>
        ${specialHtml}
        <div class="legal-extracts">
          <div class="legal-extracts-label">الصلة بالأندية التربوية</div>
          <ul class="legal-extracts-list">${extractsHtml}</ul>
        </div>
        ${downloadHtml}
      </div>
    `;
    el.scrollTop = 0;
    window.scrollTo(0, 0);
    return;
  }
}

/* ── Facilitator mode ────────────────────────────────── */
// Helper: .say box (script for facilitator)
function say(text) {
  return `<div style="background:rgba(176,125,58,.22); border:1px solid var(--gold); border-radius:9px; padding:.75rem 1rem; margin:.9rem 0 .5rem; font-size:.85rem; color:rgba(255,255,255,.9); line-height:1.75;">
    <strong style="color:var(--gold); display:block; margin-bottom:.3rem; font-size:.8rem;">💬 ماذا تقول:</strong>
    <em>"${text}"</em>
  </div>`;
}

// Helper: collapsible inside facilitator slide
function fpCollapsible(id, label, body) {
  return `
    <div style="border:1px solid rgba(255,255,255,.12); border-radius:8px; margin-top:.75rem; overflow:hidden;">
      <div onclick="const b=this.nextElementSibling; b.style.display=b.style.display==='none'?'block':'none'; this.querySelector('.fc-chev').style.transform=b.style.display==='block'?'rotate(180deg)':''"
           style="display:flex; justify-content:space-between; align-items:center; padding:.6rem .85rem; background:rgba(255,255,255,.07); cursor:pointer; font-size:.85rem; color:var(--gold); font-weight:600;">
        <span>${label}</span>
        <span class="fc-chev" style="transition:transform .2s; font-size:.75rem;">▾</span>
      </div>
      <div class="fp-body" style="display:none; padding:.75rem .85rem; font-size:.83rem; color:rgba(255,255,255,.85); line-height:1.75;">
        ${body}
      </div>
    </div>
  `;
}

const FACILITATOR_SLIDES = [
  /* ── 0. Intro ─────────────────────────────────────────── */
  {
    title: 'وضع المُيسِّر — Guide Club Scolaire',
    content: `
      <div style="text-align:center; color:white; padding:1rem 0 .5rem;">
        <div style="font-size:3rem; margin-bottom:.5rem;">🎯</div>
        <h2 style="color:var(--gold); font-size:1.2rem;">محاكاة تأسيس نادٍ تربوي</h2>
        <p style="color:rgba(255,255,255,.65); margin-top:.4rem; font-size:.87rem;">
          سيمُرُّ الفصل بالتجربة الكاملة لتأسيس نادٍ — من الإعلان حتى التقويم.
        </p>
      </div>
      <div style="background:rgba(255,255,255,.06); border-radius:10px; padding:.85rem 1rem; font-size:.83rem; line-height:2; color:rgba(255,255,255,.85);">
        <strong style="color:var(--gold); display:block; margin-bottom:.35rem;">📋 مراحل الجلسة:</strong>
        <span style="color:rgba(255,255,255,.5);">←</span> إعلان العزم
        <span style="color:rgba(255,255,255,.5);"> ← </span> هوية النادي
        <span style="color:rgba(255,255,255,.5);"> ← </span> الجمع التأسيسي
        <span style="color:rgba(255,255,255,.5);"> ← </span> هيكلة المكتب
        <span style="color:rgba(255,255,255,.5);"> ← </span> بناء المشروع
        <span style="color:rgba(255,255,255,.5);"> ← </span> التخطيط
        <span style="color:rgba(255,255,255,.5);"> ← </span> التنفيذ
        <span style="color:rgba(255,255,255,.5);"> ← </span> التقويم
      </div>
      ${say('قبل أن نبدأ، لنأخذ دقيقة لنرى الصورة الكاملة. سنُحاكي اليوم كيف يُؤسَّس نادٍ تربوي حقيقي — كل مجموعة ستكون نادياً، وكل خطوة ستملؤون فيها نموذجاً رسمياً. هذه ليست ورقة عمل، هذا ما سيفعله التلاميذ فعلاً في مؤسستكم.')}
    `,
    timer: null,
    tip: 'قسِّم الفصل إلى 3-4 مجموعات قبل البدء. كل مجموعة = نادٍ مستقل. سجِّل الأسماء المقترحة على السبورة.',
  },

  /* ── 1. إعلان العزم ──────────────────────────────────── */
  {
    title: 'الخطوة 5 — إعلان العزم على التأسيس',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            إعلان رسمي عن نية إحداث النادي لاستقطاب الأعضاء قبل الجمع التأسيسي.
          </p>
        </div>
        ${say('الآن كل مجموعة تُفكِّر: ما هو ناديها؟ ما مجاله؟ لمن موجَّه؟ لديكم 5 دقائق، ثم ممثل كل مجموعة يُعلن عن نادييه أمام الفصل.')}
        <strong style="color:var(--gold); font-size:.88rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.45rem; line-height:2; font-size:.87rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تُحدِّد: <strong>اسم النادي + مجاله + هدفه الرئيسي</strong>.</li>
          <li>يكتب ممثل كل مجموعة الإعلان (نموذج ن-01).</li>
          <li>تقديم الإعلان شفهياً أمام الفصل (دقيقة واحدة لكل مجموعة).</li>
        </ol>
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-01 — إعلان العزم على التأسيس</strong>
        </div>
      </div>
    `,
    timer: 10,
    tip: 'ضاق الوقت؟ 3 مجموعات تُعلن شفهياً فقط (بدون نموذج) — الإعلان المكتوب اختياري في هذه المرحلة.',
  },

  /* ── 2. هوية النادي (جديد) ───────────────────────────── */
  {
    title: 'هوية النادي — الاسم والأهداف والفئات',
    content: `
      <div style="color:white;">
        <div style="background:rgba(44,111,173,.3); border:1px solid #6eaad4; border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:#a8d4f5; font-size:.85rem;">لماذا هذه المرحلة؟</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            الهوية هي "الدستور" الداخلي للنادي — بدونها يُصبح النادي مجرد تجمُّع عشوائي.
          </p>
        </div>
        ${say('قبل الانتخابات، على كل نادٍ أن يُحدِّد من هو. الاسم ليس شكليًا — هو رسالة. والأهداف يجب أن تكون واضحة ليعرف المنتخَب ماذا يُدير.')}
        ${fpCollapsible('fp-names', '📛 كيف أختار اسمًا لناديي؟', `
          <strong>✅ أسماء جيدة:</strong>
          <ul style="padding-right:1.1rem; list-style:disc; margin:.3rem 0 .7rem;">
            <li>تعبِّر عن المجال (نادي البيئة الخضراء، نادي المسرح والإبداع)</li>
            <li>سهلة الحفظ والترديد</li>
            <li>تُثير الانتماء والفخر</li>
          </ul>
          <strong>❌ أسماء يُفضَّل تجنُّبها:</strong>
          <ul style="padding-right:1.1rem; list-style:disc; margin:.3rem 0;">
            <li>أسماء مجردة جداً (نادي 1، نادي التلاميذ)</li>
            <li>أسماء تُنسخ من أندية رياضية مشهورة</li>
            <li>أسماء طويلة جداً يصعب تذكُّرها</li>
          </ul>
        `)}
        ${fpCollapsible('fp-smart', '🎯 أهداف SMART للنادي', `
          أهداف جيدة تتبع معيار <strong>SMART</strong>:<br>
          <span style="color:var(--gold);">S</span>pécifique — محدَّدة وواضحة<br>
          <span style="color:var(--gold);">M</span>esurable — قابلة للقياس<br>
          <span style="color:var(--gold);">A</span>tteignable — واقعية وممكنة<br>
          <span style="color:var(--gold);">R</span>éaliste — مرتبطة بسياق المؤسسة<br>
          <span style="color:var(--gold);">T</span>emporel — محدَّدة في زمن<br><br>
          <em>مثال: "تنظيم 3 ورشات بيئية قبل نهاية شهر أبريل"</em> ✅<br>
          <em>مثال: "نساعد البيئة"</em> ❌
        `)}
        ${fpCollapsible('fp-audience', '👥 الفئات المستفيدة من النادي', `
          حدِّد بدقة من سيستفيد من أنشطة ناديك:<br><br>
          • <strong>داخلياً:</strong> تلاميذ الفوج الواحد؟ كل المستوى؟ كل المؤسسة؟<br>
          • <strong>خارجياً:</strong> أولياء الأمور؟ الحي؟ مؤسسات أخرى؟<br><br>
          كلما كانت الفئة أوسع، كلما احتجت موارد أكثر — ابدأ محدَّداً.
        `)}
      </div>
    `,
    timer: 8,
    tip: 'ضاق الوقت؟ افتح collapsible واحداً فقط (الأهداف SMART) وناقشوه شفهياً.',
  },

  /* ── 3. الجمع التأسيسي ───────────────────────────────── */
  {
    title: 'الخطوة 6 — الجمع العام التأسيسي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            تأسيس النادي رسمياً عبر انتخاب المكتب التنفيذي وتدوين المحضر.
          </p>
        </div>
        ${say('الآن ننتقل لأكثر لحظة جدية — الانتخابات. هذه ليست لعبة، هذه ممارسة ديمقراطية حقيقية. كل صوت يُحتسب، ولا أحد يُصوِّت لنفسه.')}
        ${fpCollapsible('fp-vote', '🗳️ إجراءات التصويت — 7 خطوات', `
          <ol style="padding-right:1.2rem; list-style:decimal; line-height:2.1;">
            <li>يُعيَّن رئيس مؤقَّت لإدارة الجلسة (أكبر عضو سناً أو بالتراضي).</li>
            <li>يُقرَّر المناصب التي سيُنتخَب أصحابها (رئيس / نائب الرئيس / كاتب).</li>
            <li>يُفتح باب الترشُّح — كل من يرغب يُعلن ترشيحه.</li>
            <li>يُصوِّت كل عضو بكتابة اسم مُرشَّح واحد فقط (غير اسمه هو).</li>
            <li>يُعدُّ الأصوات الرئيسُ المؤقَّت بحضور الجميع.</li>
            <li>يفوز من نال الأغلبية المطلقة — عند التعادل يُرجَّح صوت الرئيس المؤقَّت.</li>
            <li>يُدوِّن الكاتب المُنتخَب النتائج في المحضر (ن-02) فوراً.</li>
          </ol>
          <div style="background:rgba(192,57,43,.2); border:1px solid #e74c3c; border-radius:6px; padding:.5rem .7rem; margin-top:.5rem; font-size:.82rem;">
            ⚠️ <strong>ممنوع التصويت لنفسك</strong> — مبدأ ديمقراطي أساسي يُطبَّق صارماً.
          </div>
        `)}
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-02 المحضر التأسيسي + ن-03 إعلان التأسيس</strong>
        </div>
      </div>
    `,
    timer: 12,
    tip: 'ضاق الوقت؟ اقتصر على انتخاب الرئيس فقط شفهياً + كتابة اسمه في ن-02. الباقي يُكمَل لاحقاً.',
  },

  /* ── 4. هيكلة المكتب (جديد) ─────────────────────────── */
  {
    title: 'هيكلة المكتب التنفيذي — المناصب والمهام',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">المناصب الرسمية (دليل الحياة المدرسية)</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            المكتب التنفيذي يتكون من 3 مناصب منتخَبة — لا يجوز تعديل البنية الرسمية.
          </p>
        </div>
        ${say('قبل أن يبدأ المنتخَبون مهامهم، يجب أن يعرف كل عضو ماذا يعني منصبه. هذه ليست أسماء فقط — كل منصب له مسؤولية قانونية في الوثائق الرسمية.')}
        ${fpCollapsible('fp-roles', '👔 مهام كل منصب', `
          <div style="margin-bottom:.8rem; padding:.6rem; background:rgba(255,255,255,.06); border-radius:8px;">
            <strong style="color:var(--gold); font-size:.9rem;">الرئيس</strong>
            <ul style="padding-right:1.1rem; list-style:disc; margin:.3rem 0 0; font-size:.83rem;">
              <li>يرأس اجتماعات المكتب والجمع العام</li>
              <li>يُمثِّل النادي أمام الإدارة والشركاء</li>
              <li>يُوقِّع الوثائق الرسمية باسم النادي</li>
              <li>يتابع تنفيذ قرارات المكتب</li>
            </ul>
          </div>
          <div style="margin-bottom:.8rem; padding:.6rem; background:rgba(255,255,255,.06); border-radius:8px;">
            <strong style="color:#a8d4f5; font-size:.9rem;">نائب الرئيس</strong>
            <ul style="padding-right:1.1rem; list-style:disc; margin:.3rem 0 0; font-size:.83rem;">
              <li>يُنيب الرئيس عند غيابه بكامل صلاحياته</li>
              <li>يُنسِّق بين فرق العمل وأعضاء النادي</li>
              <li>يتابع الجانب اللوجيستي للأنشطة</li>
            </ul>
          </div>
          <div style="padding:.6rem; background:rgba(255,255,255,.06); border-radius:8px;">
            <strong style="color:#86efac; font-size:.9rem;">الكاتب</strong>
            <ul style="padding-right:1.1rem; list-style:disc; margin:.3rem 0 0; font-size:.83rem;">
              <li>يُحرِّر محاضر الاجتماعات (ن-09)</li>
              <li>يحتفظ بالأرشيف الرسمي للنادي</li>
              <li>يُعِدُّ المراسلات الإدارية</li>
            </ul>
          </div>
        `)}
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          💡 المكتب يُنتخَب من <strong>الجمع العام</strong> ويُساءَل أمامه — لا أمام الإدارة مباشرة.
        </div>
      </div>
    `,
    timer: 8,
    tip: 'اطلب من كل مجموعة أن يقول المنتخَب لمنصب الكاتب: "أنا مسؤول عن توثيق كل ما يُقرَّر في هذه المجموعة." — يُرسِّخ الوعي بالمسؤولية.',
  },

  /* ── 5. بناء مشروع النادي ───────────────────────────── */
  {
    title: 'الخطوة 7 — بناء مشروع النادي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            صياغة الوثيقة التأسيسية التي تُحدِّد هوية النادي وطريقة اشتغاله (8 محاور).
          </p>
        </div>
        ${say('الآن المنتخَبون يُثبتون كفاءتهم. بطاقة مشروع النادي هي "دستور" ناديكم — 8 محاور، كل محور سؤال تجيبون عليه معاً. من يُديرها؟ الرئيس بالتنسيق مع نائبه.')}
        <strong style="color:var(--gold); font-size:.88rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.45rem; line-height:2; font-size:.87rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تملأ بطاقة مشروع النادي (ن-07) — 8 محاور.</li>
          <li>التركيز على: <strong>الأهداف + الأنشطة + الفئات + الموارد + التمويل</strong>.</li>
          <li>عرض المشروع (دقيقتان لكل مجموعة) + أسئلة من الفصل.</li>
        </ol>
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-07 — بطاقة عناصر مشروع النادي (8 محاور)</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'محور التمويل دائماً يُهمل — ذكِّر: جمعية دعم مدرسة النجاح هي الإطار القانوني الوحيد لتلقي أي دعم مالي.',
  },

  /* ── 6. التخطيط السنوي ───────────────────────────────── */
  {
    title: 'الخطوة 8 — التخطيط السنوي',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            ترجمة المشروع إلى برامج وخطط قابلة للتنفيذ والمتابعة — ثلاثة نماذج مكمِّلة.
          </p>
        </div>
        ${say('لديكم الآن ثلاثة نماذج للتخطيط. لكن ما الفرق بينها؟ هذا هو السؤال الذي يُخطئ فيه الكثير من المؤطرين — دعونا نُوضِّح.')}
        ${fpCollapsible('fp-diff3', '🔍 الفرق بين النماذج الثلاثة (ن-04 / ن-05 / ن-06)', `
          <div style="margin-bottom:.65rem; padding:.55rem; background:rgba(176,125,58,.15); border-radius:7px;">
            <strong style="color:var(--gold);">ن-04 — برنامج العمل</strong>
            <p style="font-size:.82rem; margin:.25rem 0 0; line-height:1.65;">
              <em>ماذا؟</em> قائمة الأنشطة المُزمَع إنجازها مع التواريخ والمتدخلين.<br>
              مثل: جدول المواعيد السنوي.
            </p>
          </div>
          <div style="margin-bottom:.65rem; padding:.55rem; background:rgba(44,111,173,.18); border-radius:7px;">
            <strong style="color:#a8d4f5;">ن-05 — خطة العمل</strong>
            <p style="font-size:.82rem; margin:.25rem 0 0; line-height:1.65;">
              <em>لماذا؟</em> ربط كل نشاط بهدفٍ محدَّد ونتيجة منتظرة.<br>
              مثل: الخريطة التربوية التي تُظهر المنطق.
            </p>
          </div>
          <div style="padding:.55rem; background:rgba(45,106,79,.2); border-radius:7px;">
            <strong style="color:var(--accent-bg);">ن-06 — البرمجة الزمنية (Gantt)</strong>
            <p style="font-size:.82rem; margin:.25rem 0 0; line-height:1.65;">
              <em>متى بالضبط؟</em> توزيع الأنشطة على 12 شهراً (أكتوبر→شتنبر) بصرياً.<br>
              مثل: التقويم الشهري الذي يُعلَّق على الجدار.
            </p>
          </div>
          <p style="font-size:.8rem; color:rgba(255,255,255,.55); margin-top:.6rem;">
            الثلاثة ضرورية معاً — لا يُغني أحدها عن الآخر.
          </p>
        `)}
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-04 برنامج + ن-05 خطة + ن-06 Gantt (أكتوبر→شتنبر)</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'ضاق الوقت؟ افتح collapsible الفرق فقط، ناقشوه شفهياً، وعيِّن كل مجموعة تملأ ن-04 فقط كواجب.',
  },

  /* ── 7. التنفيذ ──────────────────────────────────────── */
  {
    title: 'الخطوة 9 — تنفيذ الأنشطة وتوثيقها',
    content: `
      <div style="color:white;">
        <div style="background:rgba(45,106,79,.35); border:1px solid var(--accent-l); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:var(--accent-bg); font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            إنجاز الأنشطة وتوثيقها — التنفيذ بدون توثيق كأنه لم يحدث.
          </p>
        </div>
        ${say('سؤال للفصل كله: لماذا يُطالَب المؤطِّر بملء ن-08 لكل نشاط؟ دعوهم يُجيبوا، ثم أكملوا: التوثيق هو دليلكم أمام الإدارة والمفتش والشركاء على أن النادي يشتغل فعلاً.')}
        <strong style="color:var(--gold); font-size:.88rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.45rem; line-height:2; font-size:.87rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تختار نشاطاً من برنامجها وتملأ بطاقة النشاط (ن-08).</li>
          <li>تُحاكي اجتماعاً داخلياً وتملأ المحضر (ن-09).</li>
          <li>مناقشة جماعية: <strong>الفرق بين نشاط موثَّق وآخر غير موثَّق؟</strong></li>
        </ol>
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-08 بطاقة النشاط + ن-09 محضر الاجتماع</strong>
        </div>
      </div>
    `,
    timer: 12,
    tip: 'ضاق الوقت؟ ن-09 فقط — اجتماع محاكاة + محضر = أسرع وأكثر إثارة من بطاقة النشاط.',
  },

  /* ── 8. التقويم ──────────────────────────────────────── */
  {
    title: 'الخطوات 10-11 — التقويم',
    content: `
      <div style="color:white;">
        <div style="background:rgba(107,70,193,.3); border:1px solid var(--violet); border-radius:10px; padding:.85rem 1rem; margin-bottom:.75rem;">
          <strong style="color:#c4b5fd; font-size:.85rem;">الهدف</strong>
          <p style="font-size:.87rem; margin-top:.3rem; line-height:1.7; color:rgba(255,255,255,.85);">
            تقييم ما أنجزه النادي واستخلاص الدروس للمستقبل — التقويم ليس عقاباً بل دليلُ نضج.
          </p>
        </div>
        ${say('وصلنا للمرحلة الأهم: التقويم. هذه المرحلة هي ما يُفرِّق نادياً جاداً عن نادٍ يشتغل بدون بوصلة. ن-10 لكل نادٍ على حدة، ون-11 للمُيسِّر يُجمِّع الصورة الكاملة.')}
        <strong style="color:var(--gold); font-size:.88rem;">🛠️ نشاط القسم:</strong>
        <ol style="padding-right:1.3rem; list-style:decimal; margin-top:.45rem; line-height:2; font-size:.87rem; color:rgba(255,255,255,.85);">
          <li>كل مجموعة تملأ بطاقة تقويم حصيلة ناديها (ن-10) — بصدق.</li>
          <li>عرض نتائج التقويم أمام الفصل.</li>
          <li>المُيسِّر يُوحِّد الحصيلة على مستوى "المؤسسة" (ن-11).</li>
          <li>نقاش: <strong>ما الذي يجعل النادي ناجحاً حقاً؟</strong></li>
        </ol>
        <div style="background:rgba(176,125,58,.15); border:1px solid var(--gold); border-radius:8px; padding:.65rem; margin-top:.65rem; font-size:.82rem; color:rgba(255,255,255,.8);">
          📎 <strong style="color:var(--gold);">ن-10 تقويم النادي + ن-11 تقويم الأندية (مستوى المؤسسة)</strong>
        </div>
      </div>
    `,
    timer: 15,
    tip: 'الختام: اطلب من كل مجموعة أن تُسمِّي شيئاً واحداً تعلَّمته لن تنساه — يُعزِّز الأثر التربوي ويختم الجلسة بقوة.',
  },

  /* ── 9. الخلاصة + SOS ───────────────────────────────── */
  {
    title: 'خلاصة المسار + طوارئ المُيسِّر',
    content: `
      <div style="color:white;">
        <div style="text-align:center; margin-bottom:.85rem;">
          <div style="font-size:2rem; margin-bottom:.3rem;">🎉</div>
          <h3 style="color:var(--gold); font-size:1rem; margin:0;">مسار الإحداث كاملاً</h3>
        </div>
        <div style="background:rgba(255,255,255,.05); border-radius:10px; padding:.75rem; font-size:.82rem; line-height:2; margin-bottom:1rem;">
          ${[
            ['ن-01', 'إعلان العزم على التأسيس'],
            ['ن-02', 'محضر الجمع التأسيسي'],
            ['ن-03', 'إعلان ما بعد التأسيس'],
            ['ن-07', 'بطاقة مشروع النادي'],
            ['ن-04+05+06', 'التخطيط (برنامج + خطة + Gantt)'],
            ['ن-08+09', 'التنفيذ (بطاقة النشاط + المحضر)'],
            ['ن-10+11', 'التقويم (النادي + المؤسسة)'],
          ].map(([n, t]) => `
            <div style="display:flex; align-items:center; gap:.55rem; padding:.18rem 0; border-bottom:1px solid rgba(255,255,255,.07);">
              <span style="background:var(--accent); color:white; font-size:.66rem; padding:2px 5px; border-radius:4px; flex-shrink:0;">${n}</span>
              <span>${t}</span>
            </div>`).join('')}
        </div>
        ${fpCollapsible('fp-sos', '🚨 طوارئ المُيسِّر — SOS', `
          <p style="font-size:.82rem; margin-bottom:.65rem; color:rgba(255,255,255,.6);">من الخبرة الميدانية — ليست في الدليل الرسمي:</p>
          ${[
            ['المجموعة ترفض الانتخابات ("كلنا رئيس")',
             'أوضح أن هذا النموذج يعكس الواقع المؤسسي — بدون رئيس لا توجد وثيقة رسمية موقَّعة. الانتخاب شرط لا خيار.'],
            ['لا أحد يريد أن يترشح لمنصب الكاتب',
             'قل: "الكاتب هو أكثر شخص يُؤثِّر على مستقبل النادي — لأن ما لا يُكتب لا يُحتسب." ثم أعطِ مثالاً واقعياً.'],
            ['مجموعة لا تعرف ماذا تختار كمجال لناديها',
             'قدِّم قائمة سريعة من بنك الأنشطة — اسأل: ما الذي يُزعجكم في مدرستكم؟ هناك ناديكم.'],
            ['أحد الطلاب يُهيمن على مجموعته ويمنع التصويت',
             'تدخَّل بلطف: "الجمع العام يعني أن كل صوت يُحتسب — ليس صوت الأعلى صوتاً."'],
            ['وقت أقل من المتوقع — خطوات لم تُغطَّ',
             'اجمع الخطوات المتبقية في جولة "عرض مُسرَّع": كل مجموعة تُسمِّي النموذج المقابل لكل خطوة بدون ملء — يكفي للتعريف.'],
          ].map(([prob, sol]) => `
            <div style="margin-bottom:.75rem; padding:.6rem; background:rgba(192,57,43,.12); border-right:3px solid #e74c3c; border-radius:0 7px 7px 0;">
              <strong style="font-size:.82rem; color:#ff9a9a;">⚠ ${prob}</strong>
              <p style="font-size:.8rem; margin:.25rem 0 0; line-height:1.65; color:rgba(255,255,255,.8);">${sol}</p>
            </div>`).join('')}
        `)}
      </div>
    `,
    timer: null,
    tip: 'للحفظ: "أسَّس ↔ خطَّط ↔ نفَّذ ↔ قيَّم" — كل حلقة لها بطاقة. الدورة تتكرر كل سنة.',
  },
];

/* ── Fillable fiches ─────────────────────────────────── */
function toggleFillMode() {
  const f = window.FICHES.find(x => x.id === state.modalFiche);
  if (!f) return;
  state.fillMode = !state.fillMode;

  const btn = document.getElementById('modal-fill-btn');
  const step = window.PARCOURS.find(s => s.id === f.step);
  const ctxHtml = step ? `
    <div class="fiche-step-ctx">
      <span class="fiche-step-ctx-label">تُستخدم في: <strong>الخطوة ${step.num} — ${step.title}</strong></span>
      <button class="fiche-step-ctx-btn" onclick="closeFicheModal(); navigateTo('parcours'); setTimeout(()=>{ toggleStep('${step.id}'); document.getElementById('body-${step.id}').scrollIntoView({behavior:'smooth',block:'center'}); }, 300);">عرض الخطوة</button>
    </div>` : '';

  if (state.fillMode) {
    btn.textContent = '👁 عرض النموذج';
    const builder = (window.FILL_BUILDERS || {})[f.id];
    if (!builder) throw new Error(`No fill builder found for ${f.id}`);
    const fillHtml = builder();
    document.getElementById('modal-body').innerHTML = ctxHtml + fillHtml;
    const root = document.getElementById('fiche-fill-' + f.id);
    loadFillable(f.id, root);
    bindFillableInputs(f.id, root);
  } else {
    btn.textContent = '✏️ ملء النموذج';
    document.getElementById('modal-body').innerHTML = ctxHtml + f.html;
  }
}

/* save / load / bind / clear / print → js/fill/engine.js */

/* ── Search ──────────────────────────────────────────── */
function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  document.getElementById('search-input').focus();
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  document.body.style.overflow = '';
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function runSearch(query) {
  const q = query.trim().toLowerCase();
  const results = document.getElementById('search-results');

  if (q.length < 2) {
    results.innerHTML = '';
    return;
  }

  const hits = [];

  // Search fiches
  (window.FICHES || []).forEach(f => {
    const text = (f.title + ' ' + (f.desc || '')).toLowerCase();
    if (text.includes(q)) {
      hits.push({
        section: 'fiches',
        sectionLabel: 'البطاقات',
        icon: '📋',
        title: f.title,
        sub: f.desc,
        action: () => { closeSearch(); openFiche(f.id); },
      });
    }
  });

  // Search parcours
  (window.PARCOURS || []).forEach(s => {
    const text = (s.title + ' ' + (s.goal || '') + ' ' + (s.actions || []).join(' ') + ' ' + (s.why || '')).toLowerCase();
    if (text.includes(q)) {
      hits.push({
        section: 'parcours',
        sectionLabel: 'المسار',
        icon: '🗺️',
        title: 'الخطوة ' + s.num + ' — ' + s.title,
        sub: s.goal || '',
        action: () => { closeSearch(); navigateTo('parcours'); },
      });
    }
  });

  // Search legal
  Object.entries(window.LEGAL_DOCS || {}).forEach(([id, l]) => {
    const text = (l.title + ' ' + (l.subtitle || '') + ' ' + (l.context || '') + ' ' + (l.extracts || []).join(' ')).toLowerCase();
    if (text.includes(q)) {
      hits.push({
        section: 'legal',
        sectionLabel: 'القانون',
        icon: '⚖️',
        title: l.title,
        sub: l.subtitle || '',
        action: () => { closeSearch(); navigateTo('legal'); showLegalView('doc:' + id); },
      });
    }
  });

  if (hits.length === 0) {
    results.innerHTML = `<div class="search-empty">لا نتائج لـ "<strong>${query}</strong>"</div>`;
    return;
  }

  results.innerHTML = hits.map((h, i) => `
    <div class="search-result-item" data-idx="${i}">
      <span class="search-result-icon">${h.icon}</span>
      <div class="search-result-body">
        <div class="search-result-title">${h.title}</div>
        ${h.sub ? `<div class="search-result-sub">${h.sub}</div>` : ''}
      </div>
      <span class="search-result-badge">${h.sectionLabel}</span>
    </div>
  `).join('');

  // Bind clicks after rendering
  results.querySelectorAll('.search-result-item').forEach((el, i) => {
    el.addEventListener('click', () => hits[i].action());
  });
}

function bindSearch() {
  const input = document.getElementById('search-input');
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => runSearch(input.value), 200);
  });

  // Close on overlay background click
  document.getElementById('search-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('search-overlay')) closeSearch();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('search-overlay').classList.contains('open')) {
      closeSearch();
    }
  });
}

function bindFacilitator() {
  // Close button
  document.getElementById('btn-exit-facilitator').addEventListener('click', closeFacilitator);

  // Navigation buttons
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

  // Swipe support (mobile)
  const content = document.getElementById('facilitator-content');
  let touchStartX = 0;
  content.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  content.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return; // ignore small movements
    if (dx < 0 && state.facilitatorSlide < FACILITATOR_SLIDES.length - 1) {
      // swipe left → next
      state.facilitatorSlide++;
      showSlide(state.facilitatorSlide);
    } else if (dx > 0 && state.facilitatorSlide > 0) {
      // swipe right → previous
      state.facilitatorSlide--;
      showSlide(state.facilitatorSlide);
    }
  }, { passive: true });
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

/* ── PWA Install ─────────────────────────────────────── */
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _installPrompt = e;
  document.getElementById('btn-install').classList.add('visible');
});

window.addEventListener('appinstalled', () => {
  _installPrompt = null;
  document.getElementById('btn-install').classList.remove('visible');
});

function installApp() {
  if (!_installPrompt) return;
  _installPrompt.prompt();
  _installPrompt.userChoice.then(() => { _installPrompt = null; });
}
