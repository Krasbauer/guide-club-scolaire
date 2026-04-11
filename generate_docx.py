"""
generate_docx.py
Génère les 11 fiches des Clubs Scolaires en .docx éditables.
Exécuter : python3 generate_docx.py
"""

import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

OUTPUT_DIR = 'fiches-docx'
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN = RGBColor(0x2d, 0x6a, 0x4f)
GREEN_BG = RGBColor(0xc8, 0xe8, 0xbc)
LIGHT_GREY = RGBColor(0xe8, 0xe8, 0xe8)
WHITE = RGBColor(0xff, 0xff, 0xff)

def set_rtl(paragraph):
    pPr = paragraph._p.get_or_add_pPr()
    bidi = OxmlElement('w:bidi')
    pPr.append(bidi)

def set_cell_bg(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_border(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side in ['top', 'left', 'bottom', 'right']:
        border = OxmlElement(f'w:{side}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), '555555')
        tcBorders.append(border)
    tcPr.append(tcBorders)

def new_doc(title):
    doc = Document()
    # Page margins
    for section in doc.sections:
        section.top_margin = Cm(1.5)
        section.bottom_margin = Cm(1.5)
        section.left_margin = Cm(2)
        section.right_margin = Cm(2)
    # Default font
    doc.styles['Normal'].font.name = 'Arial'
    doc.styles['Normal'].font.size = Pt(11)
    # RTL document-level
    doc.settings.element.append(OxmlElement('w:bidi'))
    return doc

def add_header(doc, num, title, subtitle=None):
    # Green title bar
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_bg(cell, 'c8e8bc')
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_rtl(p)
    run = p.add_run(f'  {num} — {title}  ')
    run.bold = True
    run.font.size = Pt(13)
    run.font.color.rgb = RGBColor(0x1a, 0x2b, 0x22)
    if subtitle:
        doc.add_paragraph()
        sub = doc.add_paragraph(subtitle)
        sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_rtl(sub)
        sub.runs[0].font.size = Pt(10)
        sub.runs[0].font.color.rgb = RGBColor(0x55, 0x55, 0x55)
    doc.add_paragraph()

def add_field_row(doc, label, lines=1):
    p = doc.add_paragraph()
    set_rtl(p)
    run = p.add_run(f'{label}: ')
    run.bold = True
    run.font.size = Pt(11)
    p.add_run('_' * 50)
    if lines > 1:
        for _ in range(lines - 1):
            p2 = doc.add_paragraph('_' * 70)
            set_rtl(p2)

def add_table_with_headers(doc, headers, rows=5, col_widths=None):
    tbl = doc.add_table(rows=rows+1, cols=len(headers))
    tbl.style = 'Table Grid'
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    for i, h in enumerate(headers):
        cell = tbl.cell(0, i)
        set_cell_bg(cell, 'e8e8e8')
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_rtl(p)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(10)
    # Data rows
    for r in range(1, rows+1):
        for c in range(len(headers)):
            cell = tbl.cell(r, c)
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph()
    return tbl

def add_section_title(doc, title):
    p = doc.add_paragraph()
    set_rtl(p)
    run = p.add_run(f'◆  {title}')
    run.bold = True
    run.font.size = Pt(11)
    run.font.color.rgb = GREEN

def add_dotted_line(doc, label, count=3):
    for _ in range(count):
        p = doc.add_paragraph()
        set_rtl(p)
        p.add_run(f'{label}: ').bold = True
        p.add_run('· ' * 35)

# ─────────────────────────────────────────────
# F-01 — إعلان العزم على التأسيس
# ─────────────────────────────────────────────
def f01():
    doc = new_doc('F-01')
    add_header(doc, 'F-01', 'إعلان العزم على تأسيس نادٍ تربوي')

    p = doc.add_paragraph()
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('إعلان')
    run.bold = True
    run.font.size = Pt(14)
    run.font.color.rgb = GREEN
    doc.add_paragraph()

    intro = doc.add_paragraph()
    set_rtl(intro)
    intro.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    intro.add_run(
        'نحن مجموعة من تلميذات وتلاميذ مؤسسة '
    )
    r2 = intro.add_run('___________________________')
    r2.underline = True
    intro.add_run(' نعلن عزمنا على تأسيس ')
    r3 = intro.add_run('___________________________')
    r3.underline = True
    intro.add_run(
        ' ونلتزم بالعمل المشترك في إطار الأهداف التربوية للمؤسسة.'
    )
    doc.add_paragraph()

    add_field_row(doc, 'اسم النادي المقترح')
    add_field_row(doc, 'المجال')
    add_field_row(doc, 'الفئة المستهدفة')
    add_field_row(doc, 'الأهداف المرجوة', lines=2)
    doc.add_paragraph()

    add_section_title(doc, 'الموقِّعون على هذا الإعلان')
    tbl = add_table_with_headers(doc, ['الاسم الكامل', 'القسم', 'التوقيع'], rows=10)

    doc.add_paragraph()
    add_field_row(doc, 'تاريخ الإعلان')
    add_field_row(doc, 'المؤطِّر المقترح')

    doc.save(f'{OUTPUT_DIR}/F-01.docx')
    print('✓ F-01.docx')

# ─────────────────────────────────────────────
# F-02 — محضر الجمع العام التأسيسي
# ─────────────────────────────────────────────
def f02():
    doc = new_doc('F-02')
    add_header(doc, 'F-02', 'محضر الجمع العام التأسيسي')

    for lbl in ['المؤسسة', 'التاريخ', 'المكان', 'عدد الحاضرين']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'جدول الأعمال')
    for item in ['التعريف بأهداف النادي وبرنامجه', 'انتخاب مكتب النادي', 'المصادقة على النظام الداخلي', 'تحديد الأنشطة الأولى']:
        p = doc.add_paragraph(f'  •  {item}', style='List Bullet')
        set_rtl(p)
    doc.add_paragraph()

    add_section_title(doc, 'نتائج الانتخابات')
    tbl = add_table_with_headers(doc,
        ['المنصب', 'الاسم الكامل', 'القسم', 'عدد الأصوات'],
        rows=6)
    for i, role in enumerate(['رئيس النادي', 'نائب الرئيس', 'الكاتب', 'نائب الكاتب', 'الخازن', 'نائب الخازن'], 1):
        tbl.cell(i, 0).paragraphs[0].text = role
        set_rtl(tbl.cell(i, 0).paragraphs[0])
    doc.add_paragraph()

    add_section_title(doc, 'ملخص المداولات')
    for _ in range(6):
        p = doc.add_paragraph('_' * 80)
        set_rtl(p)
    doc.add_paragraph()

    add_section_title(doc, 'التوقيعات')
    tbl2 = add_table_with_headers(doc, ['المنصب', 'الاسم', 'التوقيع'], rows=4)
    for i, role in enumerate(['رئيس الجلسة', 'الكاتب', 'ممثل الإدارة', 'المؤطِّر'], 1):
        tbl2.cell(i, 0).paragraphs[0].text = role
        set_rtl(tbl2.cell(i, 0).paragraphs[0])

    doc.save(f'{OUTPUT_DIR}/F-02.docx')
    print('✓ F-02.docx')

# ─────────────────────────────────────────────
# F-03 — إعلان تأسيس النادي
# ─────────────────────────────────────────────
def f03():
    doc = new_doc('F-03')
    add_header(doc, 'F-03', 'إعلان تأسيس النادي التربوي')

    p = doc.add_paragraph()
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('إعلان تأسيس')
    run.bold = True
    run.font.size = Pt(14)
    run.font.color.rgb = GREEN
    doc.add_paragraph()

    body = doc.add_paragraph()
    set_rtl(body)
    body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    body.add_run('يُسعدنا أن نُعلن عن التأسيس الرسمي لـ ')
    r = body.add_run('___________________________')
    r.underline = True
    body.add_run(' بمؤسسة ')
    r2 = body.add_run('___________________________')
    r2.underline = True
    body.add_run(
        '، وذلك في إطار الأندية التربوية المنصوص عليها في المذكرة الوزارية رقم 42.'
    )
    doc.add_paragraph()

    for lbl in ['تاريخ التأسيس', 'مجال النادي', 'المؤطِّر المسؤول', 'مُنسِّق لجنة التسيير']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'مكتب النادي المنتخب')
    tbl = add_table_with_headers(doc, ['المنصب', 'الاسم الكامل', 'القسم'], rows=6)
    for i, role in enumerate(['الرئيس', 'نائب الرئيس', 'الكاتب', 'نائب الكاتب', 'الخازن', 'نائب الخازن'], 1):
        tbl.cell(i, 0).paragraphs[0].text = role
        set_rtl(tbl.cell(i, 0).paragraphs[0])
    doc.add_paragraph()

    add_section_title(doc, 'رسالة النادي')
    for _ in range(4):
        p = doc.add_paragraph('_' * 80)
        set_rtl(p)

    doc.add_paragraph()
    p = doc.add_paragraph()
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.add_run('توقيع المؤطِّر: ___________________        توقيع مدير المؤسسة: ___________________')

    doc.save(f'{OUTPUT_DIR}/F-03.docx')
    print('✓ F-03.docx')

# ─────────────────────────────────────────────
# F-04 — برنامج العمل السنوي
# ─────────────────────────────────────────────
def f04():
    doc = new_doc('F-04')
    add_header(doc, 'F-04', 'برنامج عمل النادي التربوي — الموسم الدراسي')

    for lbl in ['اسم النادي', 'المؤطِّر', 'الموسم الدراسي']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_table_with_headers(doc,
        ['الرقم', 'النشاط', 'الفترة الزمنية', 'المتدخلون', 'الفئة المستهدفة', 'الملاحظات'],
        rows=12)

    doc.add_paragraph()
    p = doc.add_paragraph()
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.add_run('توقيع المؤطِّر: ___________________        توقيع الرئيس: ___________________')

    doc.save(f'{OUTPUT_DIR}/F-04.docx')
    print('✓ F-04.docx')

# ─────────────────────────────────────────────
# F-05 — خطة العمل بالأهداف
# ─────────────────────────────────────────────
def f05():
    doc = new_doc('F-05')
    add_header(doc, 'F-05', 'خطة عمل النادي التربوي بالأهداف')

    for lbl in ['اسم النادي', 'المؤطِّر', 'الموسم الدراسي']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_table_with_headers(doc,
        ['الأهداف العامة أو النتائج المنتظرة', 'محاور الأنشطة', 'موقت كل محور', 'أجل الإنجاز'],
        rows=8)

    doc.save(f'{OUTPUT_DIR}/F-05.docx')
    print('✓ F-05.docx')

# ─────────────────────────────────────────────
# F-06 — البرمجة الزمنية السنوية (Gantt)
# ─────────────────────────────────────────────
def f06():
    doc = new_doc('F-06')
    add_header(doc, 'F-06', 'البرمجة الزمنية السنوية للأنشطة (أكتوبر → شتنبر)')

    for lbl in ['اسم النادي', 'المؤطِّر', 'الموسم الدراسي']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    months = ['أكتوبر', 'نونبر', 'دجنبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر']
    headers = ['النشاط'] + months + ['ملاحظات']
    add_table_with_headers(doc, headers, rows=10)

    p = doc.add_paragraph()
    set_rtl(p)
    p.add_run('ملاحظة: ضع علامة ').italic = True
    p.add_run('✓').bold = True
    run = p.add_run(' في الخانة المناسبة لكل شهر.')
    run.italic = True

    doc.save(f'{OUTPUT_DIR}/F-06.docx')
    print('✓ F-06.docx')

# ─────────────────────────────────────────────
# F-07 — بطاقة عناصر مشروع النادي
# ─────────────────────────────────────────────
def f07():
    doc = new_doc('F-07')
    add_header(doc, 'F-07', 'بطاقة عناصر مشروع النادي التربوي')

    for lbl in ['اسم النادي', 'المؤسسة', 'الموسم الدراسي', 'المؤطِّر']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    sections = [
        ('1. رسالة النادي وأهدافه العامة', 3),
        ('2. الأهداف الخاصة (قابلة للقياس)', 3),
        ('3. الأنشطة المنتظرة', 3),
        ('4. الفئات المستفيدة', 2),
        ('5. المتدخلون والشركاء', 2),
        ('6. الوسائل المادية والبشرية المتاحة', 2),
        ('7. آليات التطوير والاستشارة', 2),
        ('8. التمويل والمصادر', 2),
    ]
    for title, lines in sections:
        add_section_title(doc, title)
        add_dotted_line(doc, '', count=lines)
        doc.add_paragraph()

    doc.save(f'{OUTPUT_DIR}/F-07.docx')
    print('✓ F-07.docx')

# ─────────────────────────────────────────────
# F-08 — بطاقة وصف نشاط
# ─────────────────────────────────────────────
def f08():
    doc = new_doc('F-08')
    add_header(doc, 'F-08', 'بطاقة وصف نشاط النادي التربوي')

    for lbl in ['اسم النادي', 'عنوان النشاط', 'التاريخ', 'المدة', 'المكان', 'المسؤول عن التنسيق']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'الأهداف التعلمية للنشاط')
    add_dotted_line(doc, '', count=3)
    doc.add_paragraph()

    add_section_title(doc, 'برنامج سير النشاط')
    add_table_with_headers(doc,
        ['التوقيت', 'المرحلة', 'المحتوى', 'الأدوات', 'المسؤول', 'الملاحظات'],
        rows=8)

    add_section_title(doc, 'تقييم النشاط')
    tbl = add_table_with_headers(doc,
        ['عدد المشاركين', 'نسبة الإنجاز', 'الصعوبات', 'المقترحات'],
        rows=2)

    doc.save(f'{OUTPUT_DIR}/F-08.docx')
    print('✓ F-08.docx')

# ─────────────────────────────────────────────
# F-09 — محضر اجتماع مكتب النادي
# ─────────────────────────────────────────────
def f09():
    doc = new_doc('F-09')
    add_header(doc, 'F-09', 'محضر اجتماع مكتب النادي التربوي')

    for lbl in ['اسم النادي', 'رقم الاجتماع', 'التاريخ', 'المكان', 'المسيِّر', 'الحاضرون', 'المتغيِّبون']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'جدول الأعمال')
    for _ in range(4):
        p = doc.add_paragraph('  •  ___________________________')
        set_rtl(p)
    doc.add_paragraph()

    add_section_title(doc, 'نتائج المداولات')
    add_table_with_headers(doc,
        ['النقطة', 'المداولة / القرار', 'المسؤول عن التنفيذ', 'الأجل', 'الملاحظات'],
        rows=8)

    add_section_title(doc, 'التوقيعات')
    tbl = add_table_with_headers(doc, ['المنصب', 'الاسم', 'التوقيع'], rows=3)
    for i, role in enumerate(['رئيس الجلسة', 'الكاتب', 'المؤطِّر'], 1):
        tbl.cell(i, 0).paragraphs[0].text = role
        set_rtl(tbl.cell(i, 0).paragraphs[0])

    doc.save(f'{OUTPUT_DIR}/F-09.docx')
    print('✓ F-09.docx')

# ─────────────────────────────────────────────
# F-10 — بطاقة تقويم حصيلة النادي
# ─────────────────────────────────────────────
def f10():
    doc = new_doc('F-10')
    add_header(doc, 'F-10', 'بطاقة تقويم حصيلة النادي التربوي')

    for lbl in ['اسم النادي', 'المؤطِّر', 'الموسم الدراسي']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'أولاً: تقييم أدوار الأطراف')
    add_table_with_headers(doc,
        ['الطرف', 'المهام المُنجزة', 'المهام غير المُنجزة', 'الأسباب', 'المقترحات'],
        rows=5)

    add_section_title(doc, 'ثانياً: مدى تحقق الأهداف')
    goals = [
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
    ]
    add_table_with_headers(doc,
        ['الهدف', 'مُحقَّق', 'مُحقَّق جزئياً', 'غير مُحقَّق', 'الملاحظات'],
        rows=len(goals))
    doc.add_paragraph()

    add_section_title(doc, 'ثالثاً: إحصاء الأنشطة')
    add_table_with_headers(doc,
        ['عدد الأنشطة المبرمجة', 'عدد الأنشطة المُنجزة', 'نسبة الإنجاز (%)'],
        rows=2)

    add_section_title(doc, 'رابعاً: انخراط التلاميذ')
    add_table_with_headers(doc,
        ['إجمالي الأعضاء المنخرطين', 'نسبة الإناث', 'نسبة الذكور', 'نسبة الحضور المنتظم'],
        rows=2)

    add_section_title(doc, 'خامساً: الصعوبات والمقترحات')
    add_dotted_line(doc, 'الصعوبات الرئيسية', count=3)
    add_dotted_line(doc, 'مقترحات التحسين', count=3)

    doc.save(f'{OUTPUT_DIR}/F-10.docx')
    print('✓ F-10.docx')

# ─────────────────────────────────────────────
# F-11 — بطاقة التقويم المؤسسي للأندية
# ─────────────────────────────────────────────
def f11():
    doc = new_doc('F-11')
    add_header(doc, 'F-11', 'بطاقة التقويم المؤسسي للأندية التربوية')

    for lbl in ['المؤسسة', 'مُنسِّق لجنة التسيير', 'الموسم الدراسي']:
        add_field_row(doc, lbl)
    doc.add_paragraph()

    add_section_title(doc, 'أولاً: إحصاء الأندية')
    add_table_with_headers(doc,
        ['اسم النادي', 'المجال', 'المؤطِّر', 'عدد الأعضاء', 'عدد الأنشطة المُنجزة', 'التقييم العام'],
        rows=8)

    add_section_title(doc, 'ثانياً: مؤشرات الأثر على مستوى المؤسسة')
    indicators = [
        'تحسين نسبة النجاح',
        'تقليل نسبة الهدر المدرسي',
        'تزايد مظاهر تحمل المسؤولية والممارسة الديمقراطية',
        'تزايد مظاهر المبادرة الفردية والعمل الجماعي',
        'تزايد مظاهر التعاون والتشارك بين التلاميذ',
        'التربية على إبداء الرأي واحترام رأي الآخر',
        'بروز حالات دالة على تنمية مواهب التلاميذ',
        'تقلص ظواهر الانحراف وتنمية السلوكات الإيجابية',
        'تزايد أنشطة تطبيقات التعلم في الحياة العملية',
    ]
    add_table_with_headers(doc,
        ['المؤشر', 'القيمة / النسبة', 'الملاحظات'],
        rows=len(indicators))
    doc.add_paragraph()

    add_section_title(doc, 'ثالثاً: توصيات للسنة القادمة')
    add_dotted_line(doc, '', count=5)
    doc.add_paragraph()

    p = doc.add_paragraph()
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.add_run('توقيع المُنسِّق: ___________________        توقيع المدير: ___________________')

    doc.save(f'{OUTPUT_DIR}/F-11.docx')
    print('✓ F-11.docx')


if __name__ == '__main__':
    f01(); f02(); f03()
    f04(); f05(); f06(); f07()
    f08(); f09()
    f10(); f11()
    print(f'\n✅ 11 fiches générées dans {OUTPUT_DIR}/')
