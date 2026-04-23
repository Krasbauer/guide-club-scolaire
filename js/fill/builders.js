/* =====================================================
   fill/builders.js — Per-fiche fillable renderers
   FILL_VERSIONS, FILL_MIGRATIONS, FILL_BUILDERS
   ===================================================== */

/* Schema version per fiche — bump when field names change */
window.FILL_VERSIONS = {
  'F-01': 1,
  'F-02': 1,
  'F-03': 1,
  'F-04': 1,
  'F-05': 1,
  'F-06': 1,
  'F-07': 1,
  'F-08': 1,
  'F-09': 1,
  'F-10': 1,
  'F-11': 1,
};

/* Migration functions: called when stored.v !== FILL_VERSIONS[id].
   Receive the raw parsed object. Return { v, data } on success, null to discard. */
window.FILL_MIGRATIONS = {
  'F-08': function(stored) {
    if (stored.v !== undefined) return null;
    if (stored.academy !== undefined || stored.subject !== undefined || stored.num !== undefined) {
      return { v: 1, data: stored };
    }
    return null;
  },
};

/* Registry: fiche id → builder function */
window.FILL_BUILDERS = {
  'F-01': buildFillableF01,
  'F-02': buildFillableF02,
  'F-03': buildFillableF03,
  'F-04': buildFillableF04,
  'F-05': buildFillableF05,
  'F-06': buildFillableF06,
  'F-07': buildFillableF07,
  'F-08': buildFillableF08,
  'F-09': buildFillableF09,
  'F-10': buildFillableF10,
  'F-11': buildFillableF11,
};


/* ── F-01 — إعلان العزم على تأسيس النادي ───────────── */
function buildFillableF01() {
  const inp = (key, ph) =>
    `<input class="fi-input fi-input-inline" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off">`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-01">
${fillToolbarHtml('F-01')}
  <div class="fp-title">نموذج إعلان العزم على تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill">إعـــــلان</span></div>
    <p>
      في إطار تنويع أنشطة الحياة المدرسية بالمؤسسة، وبغية إتاحة الفرصة للتلاميذ قصد إبراز مواهبهم، وصقل مهاراتهم، ودعم تعلماتهم، في جو تربوي يسوده التعاون والتنافس الشريف، ويشجع المبادرة والاجتهاد، تعـلـن إدارة المؤسسة إلى عموم التلاميذ والأطر الإدارية والتربوية بالمؤسسة أنها تعتزم بتنسيق مع المجلس التربوي ومجلس التدبير إحداث نادٍ تربوي في مجال
      ${inp('domain', 'يحدد المجال')}.
      فعلى أعضاء هيئة التدريس والإدارة الراغبين في تأطير هذا النادي، والتلاميذ الراغبين في الانخراط فيه، تقديم طلباتهم إلى إدارة المؤسسة قبل يوم
      ${inp('deadline-day', 'يحدد اليوم')}
      في الساعة
      ${inp('deadline-time', 'تحدد الساعة')}
      كآخر أجل لتلقي الطلبات، علما أن الإدارة تضع رهن إشارتهم كافة المعلومات الضرورية حول هذا الموضوع.
    </p>
    <p style="margin-top:.7rem;">
      هذا وسينعقد الجمع العام التأسيسي يوم
      ${inp('meeting-day', 'يحدد اليوم')}
      على الساعة
      ${inp('meeting-time', 'تحدد الساعة')}
      بـ ${inp('meeting-place', 'يحدد مكان الانعقاد')}.
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`;
}

/* ── F-02 — محضر تأسيس النادي ────────────────────────── */
function buildFillableF02() {
  const inp = (key, ph) =>
    `<input class="fi-input fi-input-inline" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off">`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-02">
${fillToolbarHtml('F-02')}
  <div class="fp-title">نموذج محضر تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill fp-pill-pv">محضـر</span></div>
    <p>
      انعقد يوم ${inp('meeting-day', 'يحدد اليوم')} على الساعة ${inp('meeting-time', 'تحدد الساعة')} الجمع العام التأسيسي
      لنادي ${inp('club-name', 'يحدد اسم النادي')} تحت إشراف ${inp('supervisor', 'يحدد المشرف')}
      وبحضور منخرطي النادي، بالإضافة إلى ${inp('attendance', 'تحدد نوعية الحضور')}.
    </p>
    <p style="margin-top:.6rem;">
      وقد قدم منسق النادي في بداية اللقاء بنية النادي، وكيفية انتخاب هياكله، والتي على ضوئها قام المنخرطون بانتخاب أعضاء المكتب المسير الذين اختاروا من بينهم رئيس المكتب ومساعده، ومنسقي اللجان الوظيفية. كما تم كذلك خلال هذا الجمع تعيين مساعدي منسقي اللجان الوظيفية وتشكيل فرق العمل وتحديد منسقيها ومساعديهم.
    </p>
    <p style="margin-top:.6rem;">
      وقد مرت جميع هذه العمليات في جو تربوي ديموقراطي يسوده الشعور بالمسؤولية والإحساس بالانتماء الجماعي، وأفرزت الهيكلة التالية:
    </p>
    <p style="margin-top:.5rem; text-align:center;">
      ${inp('structure', 'تحدد الهيكلة مع أسماء القائمين')}
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`;
}

/* ── F-03 — إعلان عن تأسيس النادي ────────────────────── */
function buildFillableF03() {
  const inp = (key, ph) =>
    `<input class="fi-input fi-input-inline" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off">`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-03">
${fillToolbarHtml('F-03')}
  <div class="fp-title">نموذج إعلان عن تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill">إعـــلان</span></div>
    <p>
      تعـلـن إدارة المؤسسة إلى عموم التلاميذ والأطر الإدارية والتربوية بالمؤسسة أنه تم تأسيس نادي
      ${inp('club-name', 'يحدد اسم النادي')}, بعد انعقاد الجمع العام التأسيسي يوم
      ${inp('meeting-day', 'يحدد اليوم')} في الساعة ${inp('meeting-time', 'تحدد الساعة')}
      تم خلاله انتخاب مكتب النادي وتوزيع المهام بين أعضائه، وانتداب مؤطري النادي ومنسقي اللجان الوظيفية وفرق العمل.
    </p>
    <p style="margin-top:.6rem;">
      هذا ويبقى باب الانخراط مفتوحاً في وجه عموم التلاميذ وهيئة التدريس والإدارة. فعلى الراغبين في الانضمام إلى النادي الاتصال مباشرة بالسيد(ة)
      ${inp('coordinator-name', 'يحدد اسم المكلف بتنسيق النادي')}, أو بأعضاء المكتب المسير لتقديم طلباتهم.
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`;
}

/* ── F-04 — نموذج برنامج عمل ───────────────────────────── */
function buildFillableF04() {
  const inp = (key) =>
    `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;
  const headerHtml = `
    <div class="fp-header">
      <div class="fp-hrow">
        <span class="fp-hlabel">الأكاديمية :</span><input class="fi-input" data-fkey="academy" autocomplete="off">
        <span class="fp-hlabel">المديرية الإقليمية :</span><input class="fi-input" data-fkey="direction" autocomplete="off">
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">المؤسسة :</span><input class="fi-input" data-fkey="institution" autocomplete="off">
        <span class="fp-hlabel">النادي :</span><input class="fi-input" data-fkey="club" autocomplete="off">
      </div>
      <div class="fp-hrow" style="justify-content:center;">
        <span class="fp-hlabel">الموسم الدراسي :</span>
        <input class="fi-input" data-fkey="year" style="text-align:center; max-width:140px;" autocomplete="off">
      </div>
    </div>`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-04">
${fillToolbarHtml('F-04')}
  <div class="fp-title">نموذج برنامج عمل</div>
  ${headerHtml}
  <table class="fp-table">
    <thead>
      <tr>
        <th style="width:6%">رت<br><small>(*)</small></th>
        <th>موضوع النشاط<br><small>(**)</small></th>
        <th>فترة الإنجاز</th>
        <th>المتدخلون</th>
        <th>الفئات المستهدفة</th>
        <th>ملاحظات</th>
      </tr>
    </thead>
    <tbody>
      ${[1,2,3,4,5,6].map(r =>
        `<tr><td>${r}</td><td>${inp('r' + r + '-c1')}</td><td>${inp('r' + r + '-c2')}</td><td>${inp('r' + r + '-c3')}</td><td>${inp('r' + r + '-c4')}</td><td>${inp('r' + r + '-c5')}</td></tr>`
      ).join('')}
    </tbody>
  </table>
  <p class="fp-note">(*) : الرقم الترتيبي للنشاط</p>
  <p class="fp-note">(**) : يحدد الموضوع العام للنشاط دون تحديد التفاصيل المرتبطة به، على اعتبار أن هناك بطاقة تفصيلية للنشاط.</p>
</div>`;
}

/* ── F-05 — نموذج خطة عمل ────────────────────────────── */
function buildFillableF05() {
  const inp = (key) =>
    `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;
  const headerHtml = `
    <div class="fp-header">
      <div class="fp-hrow">
        <span class="fp-hlabel">الأكاديمية :</span><input class="fi-input" data-fkey="academy" autocomplete="off">
        <span class="fp-hlabel">المديرية الإقليمية :</span><input class="fi-input" data-fkey="direction" autocomplete="off">
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">المؤسسة :</span><input class="fi-input" data-fkey="institution" autocomplete="off">
        <span class="fp-hlabel">النادي :</span><input class="fi-input" data-fkey="club" autocomplete="off">
      </div>
      <div class="fp-hrow" style="justify-content:center;">
        <span class="fp-hlabel">الموسم الدراسي :</span>
        <input class="fi-input" data-fkey="year" style="text-align:center; max-width:140px;" autocomplete="off">
      </div>
    </div>`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-05">
${fillToolbarHtml('F-05')}
  <div class="fp-title">نموذج خطة عمل</div>
  ${headerHtml}
  <table class="fp-table">
    <thead>
      <tr>
        <th>الأهداف العامة<br>أو النتائج المنتظرة</th>
        <th>محاور الأنشطة</th>
        <th>موقت كل محور</th>
        <th>أجل الإنجاز</th>
      </tr>
    </thead>
    <tbody>
      ${[1,2,3,4,5,6].map(r =>
        `<tr><td>${inp('r' + r + '-c0')}</td><td>${inp('r' + r + '-c1')}</td><td>${inp('r' + r + '-c2')}</td><td>${inp('r' + r + '-c3')}</td></tr>`
      ).join('')}
    </tbody>
  </table>
</div>`;
}

/* ── F-06 — برمجة سنوية (Gantt) ───────────────────────── */
function buildFillableF06() {
  const actInp = (n) =>
    `<input class="fi-cell-input" data-fkey="activity-${n}" placeholder="النشاط ${n}" autocomplete="off">`;
  const chk = (row, col) =>
    `<input type="checkbox" class="fi-gantt-check" data-fkey="gantt-${row}-${col}">`;

  const months = ['أكتوبر', 'نونبر', 'دجنبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر'];
  const headerHtml = `
    <div class="fp-header">
      <div class="fp-hrow">
        <span class="fp-hlabel">الأكاديمية :</span><input class="fi-input" data-fkey="academy" autocomplete="off">
        <span class="fp-hlabel">المديرية الإقليمية :</span><input class="fi-input" data-fkey="direction" autocomplete="off">
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">المؤسسة :</span><input class="fi-input" data-fkey="institution" autocomplete="off">
        <span class="fp-hlabel">النادي :</span><input class="fi-input" data-fkey="club" autocomplete="off">
      </div>
      <div class="fp-hrow" style="justify-content:center;">
        <span class="fp-hlabel">الموسم الدراسي :</span>
        <input class="fi-input" data-fkey="year" style="text-align:center; max-width:140px;" autocomplete="off">
      </div>
    </div>`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-06">
${fillToolbarHtml('F-06')}
  <div class="fp-title">نموذج لبرمجة سنوية لأنشطة النادي</div>
  ${headerHtml}
  <div style="overflow-x:auto;">
  <table class="fp-table" style="min-width:480px;">
    <thead>
      <tr>
        <th style="min-width:120px; text-align:right; padding-right:.5rem;">الأنشطة</th>
        ${months.map(m => `<th>${m}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${[1,2,3,4,5,6,7,8,9,10].map(n =>
        `<tr><td style="text-align:right; padding-right:.5rem;">${actInp(n)}</td>${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => `<td style="text-align:center;">${chk(n, m)}</td>`).join('')}</tr>`
      ).join('')}
      <tr><td style="text-align:right; padding-right:.5rem;">${actInp(11)}</td>${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => `<td style="text-align:center;">${chk(11, m)}</td>`).join('')}</tr>
    </tbody>
  </table>
  </div>
  <p class="fp-note" style="margin-top:.5rem;">عُبِّئت هذه الجدولة من باب التمثيل فقط، فلا ينبغي التقيد بها من طرف الأندية.</p>
</div>`;
}

/* ── F-07 — بطاقة عناصر مشروع النادي ──────────────────── */
function buildFillableF07() {
  const ta = (key) =>
    `<textarea class="fi-textarea" data-fkey="${key}" rows="4" placeholder="اكتب هنا…"></textarea>`;

  const headerHtml = `
    <div class="fp-header">
      <div class="fp-hrow">
        <span class="fp-hlabel">الأكاديمية :</span><input class="fi-input" data-fkey="academy" autocomplete="off">
        <span class="fp-hlabel">المديرية الإقليمية :</span><input class="fi-input" data-fkey="direction" autocomplete="off">
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">المؤسسة :</span><input class="fi-input" data-fkey="institution" autocomplete="off">
        <span class="fp-hlabel">النادي :</span><input class="fi-input" data-fkey="club" autocomplete="off">
      </div>
      <div class="fp-hrow" style="justify-content:center;">
        <span class="fp-hlabel">الموسم الدراسي :</span>
        <input class="fi-input" data-fkey="year" style="text-align:center; max-width:140px;" autocomplete="off">
      </div>
    </div>`;

  const sections = [
    ['s1', '.1 الأهداف العامة للنادي وأولوياته:'],
    ['s2', '.2 الأنشطة المزمع إنجازها:'],
    ['s3', '.3 النتائج المنتظرة من الأنشطة:'],
    ['s4', '.4 الفئات المستفيدة من الأنشطة:'],
    ['s5', '.5 المتدخلون ونوع إسهامهم:'],
    ['s6', '.6 الوسائل والموارد الواجب تعبئتها:'],
    ['s7', '.7 آليات التطوير والاستشارة:'],
    ['s8', '.8 التمويل والمصادر:'],
  ];

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-07">
${fillToolbarHtml('F-07')}
  <div class="fp-title">بطاقة عناصر مشروع النادي</div>
  ${headerHtml}
  ${sections.map(([key, label]) => `
  <div class="fp-sh" style="margin-top:.7rem;">${label}</div>
  ${ta(key)}`).join('')}
</div>`;
}

/* ── F-09 — بطاقة عناصر محضر الاجتماع ───────────────── */
function buildFillableF09() {
  const ta = (key, rows) =>
    `<textarea class="fi-textarea" data-fkey="${key}" rows="${rows || 3}" placeholder="اكتب هنا…"></textarea>`;
  const inp = (key) =>
    `<input class="fi-input" data-fkey="${key}" autocomplete="off">`;
  const cellInp = (key) =>
    `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;

  const headerHtml = `
    <div class="fp-header">
      <div class="fp-hrow">
        <span class="fp-hlabel">الأكاديمية :</span>${inp('academy')}
        <span class="fp-hlabel">المديرية الإقليمية :</span>${inp('direction')}
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">المؤسسة :</span>${inp('institution')}
        <span class="fp-hlabel">النادي :</span>${inp('club')}
      </div>
      <div class="fp-hrow">
        <span class="fp-hlabel">التاريخ :</span>${inp('date')}
        <span class="fp-hlabel">المكان :</span>${inp('location')}
      </div>
      <div class="fp-hrow" style="justify-content:center;">
        <span class="fp-hlabel">الموسم الدراسي :</span>
        ${inp('year')}
      </div>
    </div>`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-09">
${fillToolbarHtml('F-09')}
  <div class="fp-title">بطاقة عناصر محضر الاجتماع</div>
  ${headerHtml}

  <div class="fp-star-row"><span class="fp-star-key">المسير(ة) أو المسيرون :</span>${inp('facilitator')}</div>

  <div class="fp-sh" style="margin-top:.5rem;">جدول الأعمال :</div>
  ${ta('agenda', 3)}

  <div class="fp-sh" style="margin-top:.7rem;">الحاضرون :</div>
  ${ta('attendees', 3)}

  <div class="fp-sh" style="margin-top:.7rem;">المتغيبون بعذر ثم بدون عذر :</div>
  ${ta('absent', 3)}

  <div class="fp-sh" style="margin-top:.7rem;">نتائج الاجتماع :</div>
  <table class="fp-table">
    <thead>
      <tr>
        <th>المحور<br><small>(من نقط جدول الأعمال)</small></th>
        <th>القرارات المتخذة</th>
        <th>مسؤولية الإنجاز</th>
        <th>النتائج المنتظرة</th>
        <th>آجال الإنجاز</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>${cellInp('r1-c0')}</td><td>${cellInp('r1-c1')}</td><td>${cellInp('r1-c2')}</td><td>${cellInp('r1-c3')}</td><td>${cellInp('r1-c4')}</td></tr>
      <tr><td>${cellInp('r2-c0')}</td><td>${cellInp('r2-c1')}</td><td>${cellInp('r2-c2')}</td><td>${cellInp('r2-c3')}</td><td>${cellInp('r2-c4')}</td></tr>
      <tr><td>${cellInp('r3-c0')}</td><td>${cellInp('r3-c1')}</td><td>${cellInp('r3-c2')}</td><td>${cellInp('r3-c3')}</td><td>${cellInp('r3-c4')}</td></tr>
    </tbody>
  </table>
</div>`;
}

/* ── F-08 — بطاقة نشاط النادي ───────────────────────── */
function buildFillableF08() {
  const inp = (key, ph, extra) => {
    const attrs = extra ? ' ' + extra : '';
    return `<input class="fi-input" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off"${attrs}>`;
  };
  const cell = (key) =>
    `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-08">
${fillToolbarHtml('F-08')}
  <div class="fp-title">بطاقة نشاط النادي</div>

  <div class="fp-header">
    <div class="fp-hrow">
      <span class="fp-hlabel">الأكاديمية :</span>${inp('academy', '...')}
      <span class="fp-hlabel">المديرية الإقليمية :</span>${inp('direction', '...')}
    </div>
    <div class="fp-hrow">
      <span class="fp-hlabel">المؤسسة :</span>${inp('institution', '...')}
      <span class="fp-hlabel">النادي :</span>${inp('club', '...')}
    </div>
    <div class="fp-hrow" style="justify-content:center;">
      <span class="fp-hlabel">الموسم الدراسي :</span>
      ${inp('year', '2024 / 2025', 'style="text-align:center; max-width:140px;"')}
    </div>
  </div>

  <div class="fi-field-row">
    <span class="fp-star-key">* رقم النشاط :</span>
    ${inp('num', 'كما هو وارد في برنامج العمل')}
  </div>
  <div class="fi-field-row">
    <span class="fp-star-key">* موضوعه :</span>
    ${inp('subject', '...')}
  </div>
  <div class="fi-field-col">
    <span class="fp-star-key">* أهدافه :</span>
    <textarea class="fi-textarea" data-fkey="goals" rows="3" placeholder="اكتب أهداف النشاط — سطر لكل هدف"></textarea>
  </div>
  <div class="fi-field-row">
    <span class="fp-star-key">* الفئات المستفيدة :</span>
    ${inp('beneficiaries', '...')}
  </div>

  <table class="fp-table fi-table" style="margin-top:.7rem;">
    <thead>
      <tr>
        <th>العمليات المبرمجة</th>
        <th>فترات الإنجاز</th>
        <th>الوسائل المعينة</th>
        <th>المسؤولون عن الإنجاز</th>
        <th>المتدخلون</th>
        <th>التمويل</th>
      </tr>
    </thead>
    <tbody>
      ${[1,2,3,4,5].map(r =>
        `<tr>${[0,1,2,3,4,5].map(c => `<td>${cell('t' + r + 'c' + c)}</td>`).join('')}</tr>`
      ).join('\n      ')}
    </tbody>
  </table>

  <div style="margin-top:1rem; font-weight:700; font-size:.82rem; text-align:center; border-bottom:1px solid #ccc; padding-bottom:.3rem;">— الصفحة الثانية —</div>

  <div class="fp-eval-grid" style="margin-top:.5rem;">
    <div style="border-left:1px solid #333;">
      <div class="fp-eval-head">النتائج المحققة</div>
      <div class="fp-eval-body" style="padding:.4rem;">
        <textarea class="fi-textarea fi-textarea-full" data-fkey="results" rows="9" placeholder="النتائج المحققة…"></textarea>
      </div>
    </div>
    <div>
      <div class="fp-eval-head">تقويم النشاط</div>
      <div class="fp-eval-body" style="padding:.4rem;">
        <textarea class="fi-textarea fi-textarea-full" data-fkey="evaluation" rows="9" placeholder="تقويم النشاط…"></textarea>
      </div>
    </div>
  </div>
</div>`;
}

/* ── F-10 — بطاقة تقويم حصيلة النادي ──────────────────── */
function buildFillableF10() {
  const inp = (key, ph) => `<input class="fi-input fi-input-inline" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off">`;
  const cell = (key) => `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;
  const chk = (key) => `<input type="checkbox" class="fi-print-check" data-fkey="${key}">`;

  const roles = ['مجلس التدبير','المجلس التربوي','هيئة الإدارة','هيئة التدريس','المتعلمون','هيئة التفتيش','جمعية الآباء','الجماعة المحلية','قطاعات حكومية','جمعيات تنموية','شركاء','أشخاص مصادر'];
  const roleHeads = ['إحداث المكتب','تشكيل اللجان','تشكيل الفرق','التأطير','التدبير','الدعم المادي','الاستشارة','إنجاز الأنشطة'];

  const goals = ['استقبال التعلمات في الحياة العملية وتوظيفها في وضعيات حياتية','تحمل المسؤولية والممارسة الديمقراطية','تقوية الانتماء إلى الجماعة والمجتمع والمؤسسة','دعم المبادرة الفردية والتربية على العمل الجماعي','انفتاح روح التعاون والتشارك واحترام الرأي الآخر','التربية على إبداء الرأي واحترام رأي الآخر وقبول الاختلاف','تنمية الموارد والمواهب وصقلها','معالجة ظواهر الانحراف وتنمية السلوكات الإيجابية','تنمية مهارات التواصل والحوار والإنصات','تنمية قدرات التنظيم والتنسيق والرقابة والتقويم','تعزيز الانفتاح على المحيط الثقافي والاجتماعي'];

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-10">
${fillToolbarHtml('F-10')}
  <div class="fp-title">بطاقة تقويم حصيلة النادي</div>
  <div class="fp-header">
    <div class="fp-hrow">
      <span class="fp-hlabel">الأكاديميـة :</span><span class="fp-hdots">${inp('academy', '')}</span>
      <span class="fp-hlabel">المديرية الإقليمية :</span><span class="fp-hdots">${inp('region', '')}</span>
    </div>
    <div class="fp-hrow">
      <span class="fp-hlabel">المؤسسـة :</span><span class="fp-hdots">${inp('institution', '')}</span>
      <span class="fp-hlabel">النـادي :</span><span class="fp-hdots">${inp('club', '')}</span>
    </div>
    <div class="fp-hrow fp-hcenter" style="justify-content:center;">
      <span class="fp-hlabel">الموسم الدراسي :</span>&nbsp;<span class="fp-hdots" style="flex:none;">${inp('schoolYear', '')}</span>
    </div>
  </div>

  <div class="fp-sh">.1 الأطراف المشاركة وأدوارها في تفعيل النادي <small style="font-weight:400;">(توضع علامة × في الخانة المناسبة)</small></div>
  <div style="overflow-x:auto;">
  <table class="fp-table" style="min-width:520px; font-size:.72rem;">
    <thead>
      <tr>
        <th rowspan="2" style="min-width:80px;">الأطراف</th>
        <th colspan="8">الأدوار</th>
      </tr>
      <tr>
        ${roleHeads.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${roles.map((r, ri) => `<tr><td class="fp-rlabel" style="text-align:right;">${r}</td>${Array(8).fill(0).map((_, ci) => `<td>${chk('roles-' + ri + '-' + ci)}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.2 أهداف النادي</div>
  <table class="fp-table">
    <thead>
      <tr>
        <th style="width:5%">×</th>
        <th>الأهداف</th>
        <th>الأنشطة المنجزة لتحقيقها</th>
      </tr>
    </thead>
    <tbody>
      ${goals.map((g, gi) => `<tr><td>${chk('goals-check-' + gi)}</td><td class="fp-rlabel" style="text-align:right;">${g}</td><td>${cell('goals-activity-' + gi)}</td></tr>`).join('')}
      <tr><td>${chk('goals-check-11')}</td><td class="fp-star-val" style="text-align:center;">${cell('goals-extra-1')}</td><td>${cell('goals-activity-11')}</td></tr>
      <tr><td>${chk('goals-check-12')}</td><td class="fp-star-val" style="text-align:center;">${cell('goals-extra-2')}</td><td>${cell('goals-activity-12')}</td></tr>
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.3 إنجاز أنشطة برنامج عمل النادي</div>
  <table class="fp-table">
    <thead>
      <tr>
        <th>الأنشطة المسطرة في برنامج العمل</th>
        <th>منجزة</th>
        <th>غير منجزة</th>
        <th>ملاحظات</th>
      </tr>
    </thead>
    <tbody>
      ${[0,1,2,3,4].map(i => `<tr><td class="fp-rlabel" style="text-align:right;">${inp('activity-' + i + '-name', 'النشاط...')}</td><td>${chk('activity-' + i + '-done')}</td><td>${chk('activity-' + i + '-notdone')}</td><td>${cell('activity-' + i + '-notes')}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.4 التلاميذ المنخرطون والمستفيدون من أنشطة النادي</div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem; font-size:.8rem;">
    <table class="fp-table">
      <thead><tr><th>عدد المنخرطين في التأطير</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع:</td><td>${inp('supervisors-male', '')}</td><td>${inp('supervisors-female', '')}</td></tr></tbody>
    </table>
    <table class="fp-table">
      <thead><tr><th>عدد المستفيدين من الأنشطة</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع:</td><td>${inp('beneficiaries-male', '')}</td><td>${inp('beneficiaries-female', '')}</td></tr>
      <tr><td colspan="3" style="text-align:right; font-size:.75rem;">عدد تلاميذ المؤسسة: ${inp('beneficiaries-school-total', '')}</td></tr></tbody>
    </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.5 أهم الدروس والعبر المستخلصة من تجربة النادي</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    <textarea class="fi-textarea" data-fkey="lessons" rows="5" placeholder="الدروس والعبر…"></textarea>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.6 أهم المقترحات لتطوير النادي مستقبلاً</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    <textarea class="fi-textarea" data-fkey="proposals" rows="3" placeholder="المقترحات…"></textarea>
  </div>
</div>`;
}

/* ── F-11 — بطاقة تقويم الأندية (مستوى المؤسسة) ────────── */
function buildFillableF11() {
  const inp = (key, ph) => `<input class="fi-input fi-input-inline" data-fkey="${key}" placeholder="${ph || ''}" autocomplete="off">`;
  const cell = (key) => `<input class="fi-cell-input" data-fkey="${key}" autocomplete="off">`;
  const chk = (key) => `<input type="checkbox" class="fi-print-check" data-fkey="${key}">`;

  const impacts = ['تحسين نسبة النجاح','تقليل نسبة الهدر المدرسي','تزايد مظاهر تحمل المسؤولية والممارسة الديمقراطية','تزايد مظاهر المبادرة الفردية والعمل الجماعي','تزايد مظاهر التعاون والتشارك بين التلاميذ','التربية على إبداء الرأي واحترام رأي الآخر','بروز حالات دالة على تنمية مواهب التلاميذ','تقلص ظواهر الانحراف وتنمية السلوكات الإيجابية','تزايد أنشطة تطبيقات التعلم في الحياة العملية'];

  return `<div class="fiche-preview fiche-fillable" id="fiche-fill-F-11">
${fillToolbarHtml('F-11')}
  <div class="fp-title">بطاقة تقويم الأندية</div>
  <div class="fp-header">
    <div class="fp-hrow">
      <span class="fp-hlabel">الأكاديميـة :</span><span class="fp-hdots">${inp('academy', '')}</span>
      <span class="fp-hlabel">المديرية الإقليمية :</span><span class="fp-hdots">${inp('region', '')}</span>
    </div>
    <div class="fp-hrow">
      <span class="fp-hlabel">المؤسسـة :</span><span class="fp-hdots">${inp('institution', '')}</span>
    </div>
    <div class="fp-hrow fp-hcenter" style="justify-content:center;">
      <span class="fp-hlabel">الموسم الدراسي :</span>&nbsp;<span class="fp-hdots" style="flex:none;">${inp('schoolYear', '')}</span>
    </div>
  </div>

  <div class="fp-sh">.1 الأندية المحدثة في المؤسسة</div>
  <table class="fp-table">
    <thead>
      <tr>
        <th>النادي</th>
        <th>تاريخ الإحداث</th>
        <th>رئيس المكتب</th>
        <th>عدد اللجان الوظيفية</th>
        <th>عدد فرق العمل</th>
      </tr>
    </thead>
    <tbody>
      ${[0,1,2].map(i => `<tr><td>${cell('clubs-' + i + '-name')}</td><td>${cell('clubs-' + i + '-date')}</td><td>${cell('clubs-' + i + '-president')}</td><td>${cell('clubs-' + i + '-committees')}</td><td>${cell('clubs-' + i + '-teams')}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.2 التلاميذ المنخرطون والمستفيدون من أنشطة النادي</div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem; font-size:.8rem;">
    <table class="fp-table">
      <thead><tr><th>عدد المنخرطين في التأطير</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع:</td><td>${inp('supervisors-male', '')}</td><td>${inp('supervisors-female', '')}</td></tr></tbody>
    </table>
    <table class="fp-table">
      <thead><tr><th>عدد المستفيدين من الأنشطة</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع:</td><td>${inp('beneficiaries-male', '')}</td><td>${inp('beneficiaries-female', '')}</td></tr>
      <tr><td colspan="3" style="text-align:right; font-size:.75rem;">عدد تلاميذ المؤسسة: ${inp('beneficiaries-school-total', '')}</td></tr></tbody>
    </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.3 أثر الأندية على بعض مؤشرات الارتقاء بالمؤسسة</div>
  <table class="fp-table">
    <thead>
      <tr><th>الأثر في</th><th>جيد</th><th>مستحسن</th><th>متوسط</th><th>ضعيف</th></tr>
    </thead>
    <tbody>
      ${impacts.map((r, ri) => `<tr><td class="fp-rlabel" style="text-align:right;">${r}</td>${[0,1,2,3].map(ci => `<td>${chk('impact-' + ri + '-' + ci)}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.4 نتائج تقويم حصيلة الأندية</div>
  <table class="fp-table">
    <thead><tr><th style="width:25%">النادي</th><th>نتائج التقويم</th></tr></thead>
    <tbody>
      ${[0,1,2].map(i => `<tr><td class="fp-rlabel" style="text-align:right;">النادي ${i+1}</td><td style="height:3.5rem;vertical-align:top; padding:.3rem .4rem;"><textarea class="fi-textarea" data-fkey="eval-${i}-text" rows="4" placeholder="نتائج التقويم…" style="border:none; resize:none; width:100%;"></textarea></td></tr>`).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.5 أهم الدروس والعبر المستخلصة من تجربة الأندية</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    <textarea class="fi-textarea" data-fkey="lessons" rows="4" placeholder="الدروس والعبر…"></textarea>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.6 أهم المقترحات لتطوير العمل بالأندية مستقبلاً</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    <textarea class="fi-textarea" data-fkey="proposals" rows="3" placeholder="المقترحات…"></textarea>
  </div>
</div>`;
}
