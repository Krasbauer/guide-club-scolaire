/* =====================================================
   fiches.js — النماذج الرسمية
   HTML faithful to: Annexes du Guide de la Vie Scolaire (pp.12-27)
   ===================================================== */

/* ── Shared helpers ─────────────────────────────────── */
const D  = '. . . . . . . . . . . . . . . . . . . . . . .';   // short dots
const DD = '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .'; // long dots
const DL = `<span class="fp-dots-line">${DD}</span><span class="fp-dots-line">${DD}</span><span class="fp-dots-line">. . . . . .</span>`; // 2.5 lines

function hdr(extra) {
  return `
  <div class="fp-header">
    <div class="fp-hrow">
      <span class="fp-hlabel">الأكاديميـة :</span><span class="fp-hdots">${D}</span>
      <span class="fp-hlabel">المديرية الإقليمية :</span><span class="fp-hdots">. . . . . . . . . . . .</span>
    </div>
    <div class="fp-hrow">
      <span class="fp-hlabel">المؤسسـة :</span><span class="fp-hdots">${D}</span>
      <span class="fp-hlabel">النـادي :</span><span class="fp-hdots">. . . . . . . . . . . . .</span>
    </div>
    ${extra || ''}
    <div class="fp-hrow fp-hcenter" style="justify-content:center;">
      <span class="fp-hlabel">الموسم الدراسي :</span>&nbsp;<span class="fp-hdots" style="flex:none;">. . . . . . . . / . . . . . . . .</span>
    </div>
  </div>`;
}

function emptyRows(n, cols) {
  return Array(n).fill(`<tr>${Array(cols).fill('<td></td>').join('')}</tr>`).join('');
}

window.FICHES = [

  /* ── F-01 ────────────────────────────────────────── */
  {
    id: 'F-01', group: 'green', groupLabel: 'إحداث النادي',
    num: 'ن-01', title: 'إعلان العزم على تأسيس النادي',
    desc: 'إعلان رسمي من الإدارة لاستقطاب الأعضاء قبل الجمع التأسيسي',
    step: 'step-5', pdfPage: 12,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج إعلان العزم على تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill">إعـــــلان</span></div>
    <p>
      في إطار تنويع أنشطة الحياة المدرسية بالمؤسسة، وبغية إتاحة الفرصة للتلاميذ قصد إبراز مواهبهم، وصقل مهاراتهم، ودعم تعلماتهم، في جو تربوي يسوده التعاون والتنافس الشريف، ويشجع المبادرة والاجتهاد، تعـلـن إدارة المؤسسة إلى عموم التلاميذ والأطر الإدارية والتربوية بالمؤسسة أنها تعتزم بتنسيق مع المجلس التربوي ومجلس التدبير إحداث نادٍ تربوي في مجال
      <span class="fp-ph">(يحدد المجال)</span>.
      فعلى أعضاء هيئة التدريس والإدارة الراغبين في تأطير هذا النادي، والتلاميذ الراغبين في الانخراط فيه، تقديم طلباتهم إلى إدارة المؤسسة قبل يوم
      <span class="fp-ph">(يحدد اليوم)</span>
      في الساعة
      <span class="fp-ph">(تحدد الساعة)</span>
      كآخر أجل لتلقي الطلبات، علما أن الإدارة تضع رهن إشارتهم كافة المعلومات الضرورية حول هذا الموضوع.
    </p>
    <p style="margin-top:.7rem;">
      هذا وسينعقد الجمع العام التأسيسي يوم
      <span class="fp-ph">(يحدد اليوم)</span>
      على الساعة
      <span class="fp-ph">(تحدد الساعة)</span>
      بـ <span class="fp-ph">(يحدد مكان الانعقاد)</span>.
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`
  },

  /* ── F-02 ────────────────────────────────────────── */
  {
    id: 'F-02', group: 'green', groupLabel: 'إحداث النادي',
    num: 'ن-02', title: 'محضر تأسيس النادي',
    desc: 'نموذج محضر الجمع العام التأسيسي وانتخاب مكتب النادي',
    step: 'step-6', pdfPage: 13,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج محضر تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill">إعـــلان</span></div>
    <p>
      انعقد يوم <span class="fp-ph">(يحدد اليوم)</span> على الساعة <span class="fp-ph">(تحدد الساعة)</span> الجمع العام التأسيسي
      لنادي <span class="fp-ph">(يحدد اسم النادي)</span> تحت إشراف <span class="fp-ph">(يحدد المشرف: الإدارة / منسق النادي...)</span>
      وبحضور منخرطي النادي، بالإضافة إلى <span class="fp-ph">(تحدد نوعية الحضور وعدده إن أمكن)</span>.
    </p>
    <p style="margin-top:.6rem;">
      وقد قدم منسق النادي في بداية اللقاء بنية النادي، وكيفية انتخاب هياكله، والتي على ضوئها قام المنخرطون بانتخاب أعضاء المكتب المسير الذين اختاروا من بينهم رئيس المكتب ومساعده، ومنسقي اللجان الوظيفية. كما تم كذلك خلال هذا الجمع تعيين مساعدي منسقي اللجان الوظيفية وتشكيل فرق العمل وتحديد منسقيها ومساعديهم.
    </p>
    <p style="margin-top:.6rem;">
      وقد مرت جميع هذه العمليات في جو تربوي ديموقراطي يسوده الشعور بالمسؤولية والإحساس بالانتماء الجماعي، وأفرزت الهيكلة التالية:
    </p>
    <p style="margin-top:.5rem; text-align:center;">
      <span class="fp-ph">(تحدد الهيكلة مع ذكر أسماء القائمين على مختلف الهياكل)</span>
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`
  },

  /* ── F-03 ────────────────────────────────────────── */
  {
    id: 'F-03', group: 'green', groupLabel: 'إحداث النادي',
    num: 'ن-03', title: 'إعلان عن تأسيس النادي',
    desc: 'إعلان رسمي بعد التأسيس لفتح باب الانخراط أمام الجميع',
    step: 'step-6', pdfPage: 14,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج إعلان عن تأسيس النادي</div>
  <div class="fp-announce-wrap">
    <div class="fp-pill-wrap"><span class="fp-pill">إعـــلان</span></div>
    <p>
      تعـلـن إدارة المؤسسة إلى عموم التلاميذ والأطر الإدارية والتربوية بالمؤسسة أنه تم تأسيس نادي
      <span class="fp-ph">(يحدد اسم النادي)</span>، بعد انعقاد الجمع العام التأسيسي يوم
      <span class="fp-ph">(يحدد اليوم)</span> في الساعة <span class="fp-ph">(تحدد الساعة)</span>
      تم خلاله انتخاب مكتب النادي وتوزيع المهام بين أعضائه، وانتداب مؤطري النادي ومنسقي اللجان الوظيفية وفرق العمل.
    </p>
    <p style="margin-top:.6rem;">
      هذا ويبقى باب الانخراط مفتوحاً في وجه عموم التلاميذ وهيئة التدريس والإدارة. فعلى الراغبين في الانضمام إلى النادي الاتصال مباشرة بالسيد(ة)
      <span class="fp-ph">(يحدد اسم المكلف(ة) بتنسيق النادي)</span>، أو بأعضاء المكتب المسير لتقديم طلباتهم.
    </p>
    <div class="fp-admin">الإدارة</div>
  </div>
</div>`
  },

  /* ── F-04 ────────────────────────────────────────── */
  {
    id: 'F-04', group: 'gold', groupLabel: 'التخطيط',
    num: 'ن-04', title: 'نموذج برنامج عمل',
    desc: 'جدول الأنشطة السنوية: الموضوع، فترة الإنجاز، المتدخلون، الفئات المستهدفة',
    step: 'step-8', pdfPage: 15,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج برنامج عمل</div>
  ${hdr()}
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
      <tr><td>1</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>2</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>3</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>4</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>5</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>6</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>...</td><td></td><td></td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
  <p class="fp-note">(*) : الرقم الترتيبي للنشاط</p>
  <p class="fp-note">(**) : يحدد الموضوع العام للنشاط دون تحديد التفاصيل المرتبطة به، على اعتبار أن هناك بطاقة تفصيلية للنشاط.</p>
</div>`
  },

  /* ── F-05 ────────────────────────────────────────── */
  {
    id: 'F-05', group: 'gold', groupLabel: 'التخطيط',
    num: 'ن-05', title: 'نموذج خطة عمل',
    desc: 'ربط الأهداف العامة بالأنشطة المبرمجة ومجالاتها ومؤطريها وآجالها',
    step: 'step-8', pdfPage: 16,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج خطة عمل</div>
  ${hdr()}
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
      ${emptyRows(6, 4)}
    </tbody>
  </table>
</div>`
  },

  /* ── F-06 ────────────────────────────────────────── */
  {
    id: 'F-06', group: 'gold', groupLabel: 'التخطيط',
    num: 'ن-06', title: 'نموذج برمجة سنوية لأنشطة النادي',
    desc: 'جدول زمني Gantt: الأنشطة × الأشهر (أكتوبر → شتنبر) — 12 شهراً',
    step: 'step-8', pdfPage: 17,
    html: `<div class="fiche-preview">
  <div class="fp-title">نموذج لبرمجة سنوية لأنشطة النادي</div>
  ${hdr()}
  <div style="overflow-x:auto;">
  <table class="fp-table" style="min-width:480px;">
    <thead>
      <tr>
        <th style="min-width:80px; text-align:right; padding-right:.5rem;">الأنشطة</th>
        <th>أكتوبر</th><th>نونبر</th><th>دجنبر</th><th>يناير</th><th>فبراير</th>
        <th>مارس</th><th>أبريل</th><th>ماي</th><th>يونيو</th><th>يوليوز</th><th>غشت</th><th>شتنبر</th>
      </tr>
    </thead>
    <tbody>
      ${[1,2,3,4,5,6,7,8,9,10].map(i =>
        `<tr><td class="fp-rlabel" style="text-align:right; padding-right:.5rem;">النشاط ${i}</td>${Array(12).fill('<td></td>').join('')}</tr>`
      ).join('')}
      <tr><td class="fp-rlabel" style="text-align:right; padding-right:.5rem;">النشاط ......</td>${Array(12).fill('<td></td>').join('')}</tr>
    </tbody>
  </table>
  </div>
  <p class="fp-note" style="margin-top:.5rem;">عُبِّئت هذه الجدولة من باب التمثيل فقط، فلا ينبغي التقيد بها من طرف الأندية.</p>
</div>`
  },

  /* ── F-07 ────────────────────────────────────────── */
  {
    id: 'F-07', group: 'gold', groupLabel: 'التخطيط',
    num: 'ن-07', title: 'بطاقة عناصر مشروع النادي',
    desc: '8 محاور: الأهداف، الأنشطة، النتائج، الفئات، المتدخلون، الوسائل، التأطير، التمويل',
    step: 'step-7', pdfPage: 18,
    html: `<div class="fiche-preview">
  <div class="fp-title">بطاقة عناصر مشروع النادي</div>
  ${hdr()}
  ${[
    ['.1', 'الأهداف العامة للنادي وأولوياته:'],
    ['.2', 'الأنشطة المزمع إنجازها:'],
    ['.3', 'النتائج المنتظرة من الأنشطة:'],
    ['.4', 'الفئات المستفيدة من الأنشطة:'],
    ['.5', 'المتدخلون ونوع إسهامهم:'],
    ['.6', 'الوسائل والموارد الواجب تعبئتها:'],
    ['.7', 'آليات التطوير والاستشارة:'],
    ['.8', 'التمويل والمصادر:'],
  ].map(([n, t]) => `
    <div class="fp-sh">${n} ${t}</div>
    ${DL}`).join('')}
</div>`
  },

  /* ── F-08 ────────────────────────────────────────── */
  {
    id: 'F-08', group: 'blue', groupLabel: 'التنفيذ',
    num: 'ن-08', title: 'بطاقة نشاط النادي',
    desc: 'توثيق إعداد وتنفيذ وتقويم نشاط واحد (صفحتان)',
    step: 'step-9', pdfPage: 21,
    html: `<div class="fiche-preview">
  <div class="fp-title">بطاقة نشاط النادي</div>
  ${hdr()}

  <div class="fp-star-row"><span class="fp-star-key">* رقم النشاط :</span><span class="fp-star-val">. . . . . . . . . . (كما هو وارد في برنامج العمل)</span></div>
  <div class="fp-star-row"><span class="fp-star-key">* موضوعه :</span><span class="fp-star-val">${D}</span></div>
  <div class="fp-star-row" style="align-items:flex-start; flex-direction:column; gap:.05rem;">
    <span class="fp-star-key">* أهدافه :</span>
    <span class="fp-star-val" style="width:100%;">${D}</span>
    <span class="fp-star-val" style="width:100%;">${D}</span>
    <span class="fp-star-val" style="width:100%;">${D}</span>
  </div>
  <div class="fp-star-row"><span class="fp-star-key">* الفئات المستفيدة :</span><span class="fp-star-val">${D}</span></div>

  <table class="fp-table" style="margin-top:.6rem;">
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
    <tbody>${emptyRows(5, 6)}</tbody>
  </table>

  <div style="margin-top:1rem; font-weight:700; font-size:.82rem; text-align:center; border-bottom:1px solid #ccc; padding-bottom:.3rem;">— الصفحة الثانية —</div>

  <div class="fp-eval-grid" style="margin-top:.5rem;">
    <div style="border-left:1px solid #333;">
      <div class="fp-eval-head">النتائج المحققة</div>
      <div class="fp-eval-body">
        ${Array(9).fill(`<span class="fp-dots-line">. . . . . . . . . . . . . . . . . . . . . . . .</span>`).join('')}
      </div>
    </div>
    <div>
      <div class="fp-eval-head">تقويم النشاط</div>
      <div class="fp-eval-body">
        ${Array(9).fill(`<span class="fp-dots-line">. . . . . . . . . . . . . . . . . . . . . . . .</span>`).join('')}
      </div>
    </div>
  </div>
</div>`
  },

  /* ── F-09 ────────────────────────────────────────── */
  {
    id: 'F-09', group: 'blue', groupLabel: 'التنفيذ',
    num: 'ن-09', title: 'بطاقة عناصر محضر الاجتماع',
    desc: 'جدول الأعمال، الحاضرون، المتغيبون، نتائج الاجتماع وقراراته',
    step: 'step-9', pdfPage: 20,
    html: `<div class="fiche-preview">
  <div class="fp-title">بطاقة عناصر محضر الاجتماع</div>
  ${hdr(`
    <div class="fp-hrow">
      <span class="fp-hlabel">التاريـخ :</span><span class="fp-hdots">. . . . . . . . . . . . . . . . . .</span>
      <span class="fp-hlabel">المكـان :</span><span class="fp-hdots">. . . . . . . . . . . . . . . . . .</span>
    </div>`)}

  <div class="fp-star-row"><span class="fp-star-key">المسير(ة) أو المسيرون :</span><span class="fp-star-val">${DD}</span></div>

  <div class="fp-sh" style="margin-top:.5rem;">جدول الأعمال :</div>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">. . . . . . . . . . .</span>

  <div class="fp-sh">الحاضرون :</div>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">. . . . . . . . . . .</span>

  <div class="fp-sh">المتغيبون بعذر ثم بدون عذر :</div>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">${DD}</span>
  <span class="fp-dots-line">. . . . . . . . . . .</span>

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
    <tbody>${emptyRows(3, 5)}</tbody>
  </table>
</div>`
  },

  /* ── F-10 ────────────────────────────────────────── */
  {
    id: 'F-10', group: 'violet', groupLabel: 'التقويم',
    num: 'ن-10', title: 'بطاقة تقويم حصيلة النادي',
    desc: 'تقييم شامل لأداء النادي: الأطراف وأدوارها، الأهداف، الأنشطة، المنخرطون، الدروس، المقترحات (3 صفحات)',
    step: 'step-10', pdfPage: 23,
    html: `<div class="fiche-preview">
  <div class="fp-title">بطاقة تقويم حصيلة النادي</div>
  ${hdr()}

  <div class="fp-sh">.1 الأطراف المشاركة وأدوارها في تفعيل النادي <small style="font-weight:400;">(توضع علامة × في الخانة المناسبة)</small></div>
  <div style="overflow-x:auto;">
  <table class="fp-table" style="min-width:520px; font-size:.72rem;">
    <thead>
      <tr>
        <th rowspan="2" style="min-width:80px;">الأطراف</th>
        <th colspan="8">الأدوار</th>
      </tr>
      <tr>
        <th>إحداث المكتب</th>
        <th>تشكيل اللجان</th>
        <th>تشكيل الفرق</th>
        <th>التأطير</th>
        <th>التدبير</th>
        <th>الدعم المادي</th>
        <th>الاستشارة</th>
        <th>إنجاز الأنشطة</th>
      </tr>
    </thead>
    <tbody>
      ${['مجلس التدبير','المجلس التربوي','هيئة الإدارة','هيئة التدريس','المتعلمون','هيئة التفتيش','جمعية الآباء','الجماعة المحلية','قطاعات حكومية','جمعيات تنموية','شركاء','أشخاص مصادر']
        .map(r => `<tr><td class="fp-rlabel" style="text-align:right;">${r}</td>${Array(8).fill('<td></td>').join('')}</tr>`)
        .join('')}
    </tbody>
  </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.2 أهداف النادي <small style="font-weight:400;">(توضع علامة × قبل الأهداف المبرمجة فعلاً، مع إضافة أهداف النادي التي لم يتضمنها الجدول)</small></div>
  <table class="fp-table">
    <thead>
      <tr>
        <th style="width:5%">×</th>
        <th>الأهداف</th>
        <th>الأنشطة المنجزة لتحقيقها</th>
      </tr>
    </thead>
    <tbody>
      ${[
        'استقبال التعلمات في الحياة العملية وتوظيفها في وضعيات حياتية',
        'تحمل المسؤولية والممارسة الديمقراطية',
        'تقوية الانتماء إلى الجماعة والمجتمع والمؤسسة',
        'دعم المبادرة الفردية والتربية على العمل الجماعي',
        'انفتاح روح التعاون والتشارك واحترام الرأي الآخر',
        'التربية على إبداء الرأي واحترام رأي الآخر وقبول الاختلاف',
        'تنمية الموارد والمواهب وصقلها',
        'معالجة ظواهر الانحراف وتنمية السلوكات الإيجابية',
        'تنمية مهارات التواصل والحوار والإنصات',
        'تنمية قدرات التنظيم والتنسيق والرقابة والتقويم',
        'تعزيز الانفتاح على المحيط الثقافي والاجتماعي',
      ].map(g => `<tr><td></td><td class="fp-rlabel" style="text-align:right;">${g}</td><td></td></tr>`).join('')}
      <tr><td></td><td class="fp-star-val" style="text-align:center;">. . . . . . . . . . . . . . . . . . . . . .</td><td></td></tr>
      <tr><td></td><td class="fp-star-val" style="text-align:center;">. . . . . . . . . . . . . . . . . . . . . .</td><td></td></tr>
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.3 إنجاز أنشطة برنامج عمل النادي <small style="font-weight:400;">(توضع علامة × في الخانة المناسبة وتسجل الملاحظات عند الاقتضاء)</small></div>
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
      ${[1,2,3,4,'...'].map(i =>
        `<tr><td class="fp-rlabel" style="text-align:right;">النشاط ${i} . . . . . . . . . . . . . .</td><td></td><td></td><td></td></tr>`
      ).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.4 التلاميذ المنخرطون والمستفيدون من أنشطة النادي</div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem; font-size:.8rem;">
    <table class="fp-table">
      <thead><tr><th>عدد المنخرطين في التأطير</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع: . . . . . . .</td><td></td><td></td></tr></tbody>
    </table>
    <table class="fp-table">
      <thead><tr><th>عدد المستفيدين من الأنشطة</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع: . . . . . . .</td><td></td><td></td></tr>
      <tr><td colspan="3" style="text-align:right; font-size:.75rem;">عدد تلاميذ المؤسسة: . . . . . . .</td></tr></tbody>
    </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.5 أهم الدروس والعبر المستخلصة من تجربة النادي <small style="font-weight:400;">(المزايا، الصعوبات، الإكراهات، الحلول...)</small></div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    ${Array(5).fill(`<span class="fp-dots-line">${DD}</span>`).join('')}
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.6 أهم المقترحات لتطوير النادي مستقبلاً على ضوء التجربة ونتائج التقويم</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    ${Array(3).fill(`<span class="fp-dots-line">${DD}</span>`).join('')}
  </div>
</div>`
  },

  /* ── F-11 ────────────────────────────────────────── */
  {
    id: 'F-11', group: 'violet', groupLabel: 'التقويم',
    num: 'ن-11', title: 'بطاقة تقويم الأندية (مستوى المؤسسة)',
    desc: 'تقييم إجمالي لجميع أندية المؤسسة: المحدثة، المنخرطون، الأثر، الحصيلة، الدروس (صفحتان)',
    step: 'step-11', pdfPage: 26,
    html: `<div class="fiche-preview">
  <div class="fp-title">بطاقة تقويم الأندية</div>
  <div class="fp-header">
    <div class="fp-hrow">
      <span class="fp-hlabel">الأكاديميـة :</span><span class="fp-hdots">${D}</span>
      <span class="fp-hlabel">المديرية الإقليمية :</span><span class="fp-hdots">. . . . . . . . . . . .</span>
    </div>
    <div class="fp-hrow">
      <span class="fp-hlabel">المؤسسـة :</span><span class="fp-hdots">${D}</span>
    </div>
    <div class="fp-hrow fp-hcenter" style="justify-content:center;">
      <span class="fp-hlabel">الموسم الدراسي :</span>&nbsp;<span class="fp-hdots" style="flex:none;">. . . . . . . . / . . . . . . . .</span>
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
    <tbody>${emptyRows(3, 5)}</tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.2 التلاميذ المنخرطون والمستفيدون من أنشطة النادي</div>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem; font-size:.8rem;">
    <table class="fp-table">
      <thead><tr><th>عدد المنخرطين في التأطير</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع: . . . . . . .</td><td></td><td></td></tr></tbody>
    </table>
    <table class="fp-table">
      <thead><tr><th>عدد المستفيدين من الأنشطة</th><th>ذكور</th><th>إناث</th></tr></thead>
      <tbody><tr><td>المجموع: . . . . . . .</td><td></td><td></td></tr>
      <tr><td colspan="3" style="text-align:right; font-size:.75rem;">عدد تلاميذ المؤسسة: . . . . . . .</td></tr></tbody>
    </table>
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.3 أثر الأندية على بعض مؤشرات الارتقاء بالمؤسسة وتحسين نتائج التعلم <small style="font-weight:400;">(توضع علامة × في الخانة المناسبة)</small></div>
  <table class="fp-table">
    <thead>
      <tr><th>الأثر في</th><th>جيد</th><th>مستحسن</th><th>متوسط</th><th>ضعيف</th></tr>
    </thead>
    <tbody>
      ${[
        'تحسين نسبة النجاح',
        'تقليل نسبة الهدر المدرسي',
        'تزايد مظاهر تحمل المسؤولية والممارسة الديمقراطية',
        'تزايد مظاهر المبادرة الفردية والعمل الجماعي',
        'تزايد مظاهر التعاون والتشارك بين التلاميذ',
        'التربية على إبداء الرأي واحترام رأي الآخر',
        'بروز حالات دالة على تنمية مواهب التلاميذ',
        'تقلص ظواهر الانحراف وتنمية السلوكات الإيجابية',
        'تزايد أنشطة تطبيقات التعلم في الحياة العملية',
      ].map(r => `<tr><td class="fp-rlabel" style="text-align:right;">${r}</td><td></td><td></td><td></td><td></td></tr>`).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.4 نتائج تقويم حصيلة الأندية <small style="font-weight:400;">(يدرج ملخص مركز بنتائج التقويم الخاصة بكل نادٍ على حدة)</small></div>
  <table class="fp-table">
    <thead><tr><th style="width:25%">النادي</th><th>نتائج التقويم</th></tr></thead>
    <tbody>
      ${['النادي 1','النادي 2','النادي . . .'].map(n =>
        `<tr><td class="fp-rlabel" style="text-align:right;">${n}</td><td style="height:3.5rem;vertical-align:top; padding:.3rem .4rem; color:#888; letter-spacing:1.5px; font-size:.76rem; line-height:2;">${Array(4).fill('. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .').join('<br>')}</td></tr>`
      ).join('')}
    </tbody>
  </table>

  <div class="fp-sh" style="margin-top:.85rem;">.5 أهم الدروس والعبر المستخلصة من تجربة الأندية <small style="font-weight:400;">(المزايا، الصعوبات، الإكراهات، الحلول...)</small></div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    ${Array(4).fill(`<span class="fp-dots-line">${DD}</span>`).join('')}
  </div>

  <div class="fp-sh" style="margin-top:.85rem;">.6 أهم المقترحات لتطوير العمل بالأندية مستقبلاً على ضوء التجربة ونتائج التقويم</div>
  <div style="border:1px solid #555; padding:.4rem .6rem;">
    ${Array(3).fill(`<span class="fp-dots-line">${DD}</span>`).join('')}
  </div>
</div>`
  },

];
