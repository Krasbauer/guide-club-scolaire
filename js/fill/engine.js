/* =====================================================
   fill/engine.js — Fill mode shared engine
   All functions are scoped to a root element.
   ===================================================== */

/* Toolbar HTML — called at builder render time.
   Shows save badge only when stored data exists at the current schema version. */
function fillToolbarHtml(id) {
  const raw = localStorage.getItem('fill-' + id);
  let hasSaved = false;
  if (raw) {
    try {
      const stored = JSON.parse(raw);
      const ver = (window.FILL_VERSIONS || {})[id];
      hasSaved = ver !== undefined ? stored.v === ver : (raw !== null);
    } catch(e) {}
  }
  const badge = hasSaved ? '<span class="fi-saved-badge">💾 يوجد حفظ مسبق</span>' : '';
  return `<div class="fi-toolbar no-print">
  <span class="fi-toolbar-label">✏️ وضع الملء ${badge}</span>
  <button class="fi-btn-clear" onclick="clearFillable('${id}', this.closest('.fiche-fillable'))">🗑️ مسح</button>
  <button class="fi-btn-print" onclick="printFillable('${id}', this.closest('.fiche-fillable'))">🖨️ طباعة</button>
</div>`;
}

function saveFillable(id, root) {
  const data = {};
  root.querySelectorAll('[data-fkey]').forEach(el => {
    if (el.type === 'checkbox') data[el.dataset.fkey] = el.checked;
    else if (el.isContentEditable) data[el.dataset.fkey] = el.textContent;
    else data[el.dataset.fkey] = el.value;
  });
  const ver = (window.FILL_VERSIONS || {})[id];
  const payload = ver !== undefined ? { v: ver, data } : data;
  localStorage.setItem('fill-' + id, JSON.stringify(payload));
}

function loadFillable(id, root) {
  const raw = localStorage.getItem('fill-' + id);
  if (!raw) return;
  let stored;
  try { stored = JSON.parse(raw); } catch(e) { return; }

  const ver = (window.FILL_VERSIONS || {})[id];
  let data;

  if (ver !== undefined) {
    if (stored.v === ver) {
      data = stored.data;
    } else {
      const migrate = (window.FILL_MIGRATIONS || {})[id];
      const migrated = migrate ? migrate(stored) : null;
      if (migrated && migrated.v === ver) {
        data = migrated.data;
        localStorage.setItem('fill-' + id, JSON.stringify(migrated));
      } else {
        localStorage.removeItem('fill-' + id);
        return;
      }
    }
  } else {
    data = stored.data !== undefined ? stored.data : stored;
  }

  root.querySelectorAll('[data-fkey]').forEach(el => {
    const val = data[el.dataset.fkey];
    if (val === undefined) return;
    if (el.type === 'checkbox') el.checked = Boolean(val);
    else if (el.isContentEditable) el.textContent = val;
    else el.value = val;
  });
}

function bindFillableInputs(id, root) {
  let debounce;
  const save = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => saveFillable(id, root), 700);
  };
  root.querySelectorAll('[data-fkey]').forEach(el => {
    el.addEventListener('input', save);
  });
}

function clearFillable(id, root) {
  if (!confirm('مسح جميع البيانات المحفوظة لهذا النموذج؟')) return;
  localStorage.removeItem('fill-' + id);
  root.querySelectorAll('[data-fkey]').forEach(el => {
    if (el.type === 'checkbox') el.checked = false;
    else if (el.isContentEditable) el.textContent = '';
    else el.value = '';
  });
}

function printFillable(id, root) {
  const clone = root.cloneNode(true);

  const tb = clone.querySelector('.fi-toolbar');
  if (tb) tb.remove();

  clone.querySelectorAll('input[data-fkey]').forEach(el => {
    if (el.type === 'checkbox') {
      const span = document.createElement('span');
      span.className = 'fi-print-check';
      span.textContent = el.checked ? '×' : '';
      el.replaceWith(span);
      return;
    }
    const span = document.createElement('span');
    span.className = 'fi-print-val';
    span.textContent = el.value || '';
    el.replaceWith(span);
  });

  clone.querySelectorAll('textarea[data-fkey]').forEach(el => {
    const div = document.createElement('div');
    div.className = 'fi-print-val fi-print-block';
    div.textContent = el.value || '';
    el.replaceWith(div);
  });

  clone.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable');
  });

  const area = document.getElementById('print-area');
  area.innerHTML = `<div style="font-family:'IBM Plex Sans Arabic',Arial,sans-serif; direction:rtl; padding:1cm;">${clone.outerHTML}</div>`;
  document.body.classList.add('printing-fiche');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-fiche');
    area.innerHTML = '';
  }, 1000);
}
