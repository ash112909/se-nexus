// Global search — command palette (Cmd/Ctrl+K, or click the sidebar search button)
const GlobalSearch = (() => {
  let _open = false;
  let _query = '';
  let _category = '';
  let _supplier = '';
  let _submitted = false;
  let _selIdx = 0;
  let _results = [];

  const CATEGORIES = [
    { key: 'Parts',   label: 'Parts',   icon: 'ti-package', needsSupplier: true },
    { key: 'Orders',  label: 'Orders',  icon: 'ti-receipt',  needsSupplier: false },
    { key: 'Manuals', label: 'Manuals', icon: 'ti-book',     needsSupplier: true },
  ];

  // Mirrors the catalog suppliers in parts-search.js
  const SUPPLIERS = [
    { id: 'SKJ', name: 'Skyjack' },
    { id: 'CAT', name: 'Caterpillar' },
    { id: 'TOY', name: 'Toyota' },
    { id: 'BOB', name: 'Bobcat' },
    { id: 'JLG', name: 'JLG' },
    { id: 'GEN', name: 'Genie' },
  ];

  // Static navigation targets (shown in empty state only)
  const NAV_ITEMS = [
    { label: 'Work Orders',       icon: 'ti-clipboard-list', action: () => Router.navigate('wo-list') },
    { label: 'Parts Search',      icon: 'ti-search',         action: () => Router.navigate('parts-search') },
    { label: 'Order History',     icon: 'ti-history',        action: () => Router.navigate('order-history') },
    { label: 'Manuals & Docs',    icon: 'ti-book',           action: () => Router.navigate('manuals') },
    { label: 'Diagnostics',       icon: 'ti-tool',           action: () => Router.navigate('diagnostics') },
    { label: 'Recommended Parts', icon: 'ti-star',           action: () => Router.navigate('recommended') },
  ];

  function buildResults(q, cat, supplier) {
    const ql = q.toLowerCase().trim();
    if (!ql || !cat) return [];
    const out = [];

    if (cat === 'Parts') {
      Store.getParts(q, supplier || '').slice(0, 8).forEach(p => out.push({
        icon: 'ti-package',
        label: p.description,
        sub: p.partNum + (p.vendor ? ' · ' + p.vendor : '') + (p.category ? ' · ' + p.category : ''),
        badge: null,
        action: () => Router.navigate('parts-search'),
      }));
    }

    if (cat === 'Orders') {
      // Search only on PO number or WO number
      Store.getOrders('all').filter(o =>
        (o.poNum || '').toLowerCase().includes(ql) ||
        (o.wo || '').toLowerCase().includes(ql)
      ).slice(0, 8).forEach(o => out.push({
        icon: 'ti-receipt',
        label: (o.poNum || o.wo || o.name),
        sub: (o.wo ? o.wo + ' · ' : '') + o.vendor + (o.date ? ' · ' + o.date : ''),
        badge: o.status === 'delivered'
          ? { text: 'Delivered',   color: '#3B6D11' }
          : o.status === 'backordered'
          ? { text: 'Backordered', color: '#A32D2D' }
          : { text: o.status,      color: '#1C3969' },
        action: () => Router.navigate('order-history'),
      }));
    }

    if (cat === 'Manuals') {
      Store.getManuals(q).filter(m =>
        !supplier || m.machine.toLowerCase().includes(SUPPLIERS.find(s=>s.id===supplier)?.name.toLowerCase()||'')
      ).slice(0, 8).forEach(m => out.push({
        icon: 'ti-book',
        label: m.title,
        sub: m.machine + ' · ' + m.type + ' · ' + m.year + ' · ' + m.pages + ' pp',
        badge: null,
        action: () => Router.navigate('manuals'),
      }));
    }

    return out;
  }

  // ── View-more destinations per category ──────────────────────────────────

  function viewMore() {
    const q = _query;
    const cat = _category;
    close();
    if (cat === 'Parts')   { Router.navigate('parts-search'); }
    else if (cat === 'Orders')  { Router.navigate('order-history'); }
    else if (cat === 'Manuals') { Router.navigate('manuals'); }
    else { Router.navigate('search-results', { query: q, category: cat }); }
  }

  // ── DOM helpers ───────────────────────────────────────────────────────────

  function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function highlight(text, q) {
    if (!q.trim() || !text) return escHtml(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escHtml(text).replace(re, '<mark style="background:#FEF3C7;color:#92400E;border-radius:2px;padding:0 1px;">$1</mark>');
  }

  // ── Sync UI state ─────────────────────────────────────────────────────────

  function syncControls() {
    const inp      = document.getElementById('gs-input');
    const catSel   = document.getElementById('gs-cat-select');
    const suppRow  = document.getElementById('gs-supplier-row');
    const suppSel  = document.getElementById('gs-supp-select');
    const btn      = document.getElementById('gs-search-btn');
    if (!inp || !catSel || !btn) return;

    const catMeta = CATEGORIES.find(c => c.key === catSel.value);
    const needsSupplier = catMeta && catMeta.needsSupplier;

    if (suppRow) suppRow.style.display = needsSupplier ? 'flex' : 'none';

    const hasQuery    = !!inp.value.trim();
    const hasCategory = !!catSel.value;
    const hasSuppOk   = !needsSupplier || (suppSel && !!suppSel.value);
    btn.disabled = !(hasQuery && hasCategory && hasSuppOk);
  }

  function doSearch() {
    const inp    = document.getElementById('gs-input');
    const catSel = document.getElementById('gs-cat-select');
    const suppSel= document.getElementById('gs-supp-select');
    if (!inp || !catSel) return;
    _query    = inp.value.trim();
    _category = catSel.value;
    _supplier = suppSel ? suppSel.value : '';
    _submitted = true;
    _selIdx = 0;
    renderResults();
  }

  // ── Result rendering ──────────────────────────────────────────────────────

  function renderResults() {
    const list = document.getElementById('gs-results');
    if (!list) return;

    if (!_submitted || !_query || !_category) {
      list.innerHTML = `<div class="gs-empty">
        <div style="font-size:12px;font-weight:600;color:#3A3D4A;margin-bottom:10px;">Jump to</div>
        <div class="gs-nav-grid">${NAV_ITEMS.map((n,i) =>
          `<div class="gs-nav-chip" onclick="GlobalSearch.pick(${i + 1000})"><i class="ti ${n.icon}"></i> ${n.label}</div>`
        ).join('')}</div>
        <div style="font-size:11px;color:#B0AAA3;margin-top:14px;text-align:center;">Select a category, enter a term, then click Search</div>
      </div>`;
      return;
    }

    _results = buildResults(_query, _category, _supplier);

    if (!_results.length) {
      list.innerHTML = `<div style="padding:32px;text-align:center;font-size:13px;color:#9CA3AF;">No results for "<strong>${escHtml(_query)}</strong>" in ${escHtml(_category)}</div>`;
      return;
    }

    const catLabel = CATEGORIES.find(c=>c.key===_category)?.label || _category;
    list.innerHTML =
      `<div class="gs-section-label">${escHtml(catLabel)} · ${_results.length} result${_results.length!==1?'s':''}</div>` +
      _results.map((r, i) =>
        `<div class="gs-row ${_selIdx === i ? 'gs-sel' : ''}" onclick="GlobalSearch.pick(${i})" data-idx="${i}">
          <div class="gs-row-icon"><i class="ti ${r.icon}"></i></div>
          <div class="gs-row-body">
            <div class="gs-row-label">${highlight(r.label, _query)}</div>
            <div class="gs-row-sub">${highlight(r.sub, _query)}</div>
          </div>
          ${r.badge ? `<span class="gs-badge" style="color:${r.badge.color};border-color:${r.badge.color}40;">${r.badge.text}</span>` : ''}
          <span class="gs-enter-hint">↵</span>
        </div>`
      ).join('') +
      `<div class="gs-view-more" onclick="GlobalSearch.viewMore()">
        View more in ${escHtml(catLabel)} <i class="ti ti-arrow-right" style="font-size:11px;"></i>
      </div>`;

    const selEl = list.querySelector('.gs-sel');
    if (selEl) selEl.scrollIntoView({ block: 'nearest' });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  function open() {
    if (_open) return;
    _open = true;
    _query = '';
    _category = '';
    _supplier = '';
    _submitted = false;
    _selIdx = 0;
    _results = [];
    const overlay = document.getElementById('gs-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('gs-visible'));
    const inp    = document.getElementById('gs-input');
    const catSel = document.getElementById('gs-cat-select');
    const suppSel= document.getElementById('gs-supp-select');
    if (inp)    inp.value = '';
    if (catSel) catSel.value = '';
    if (suppSel)suppSel.value = '';
    syncControls();
    renderResults();
    if (inp) inp.focus();
  }

  function close() {
    if (!_open) return;
    _open = false;
    const overlay = document.getElementById('gs-overlay');
    if (!overlay) return;
    overlay.classList.remove('gs-visible');
    setTimeout(() => { overlay.style.display = 'none'; }, 160);
  }

  function pick(idx) {
    if (idx >= 1000) {
      const navItem = NAV_ITEMS[idx - 1000];
      if (navItem) { close(); navItem.action(); }
      return;
    }
    const r = _results[idx];
    if (!r) return;
    close();
    r.action();
  }

  function moveSelection(dir) {
    if (!_results.length) return;
    _selIdx = (_selIdx + dir + _results.length) % _results.length;
    renderResults();
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    const overlay = document.createElement('div');
    overlay.id = 'gs-overlay';
    overlay.innerHTML = `
      <style>
        #gs-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:flex-start;justify-content:center;padding-top:72px;background:rgba(10,10,10,.55);opacity:0;transition:opacity .16s;}
        #gs-overlay.gs-visible{opacity:1;}
        #gs-modal{width:100%;max-width:640px;background:#FFFFFF;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.28);display:flex;flex-direction:column;max-height:calc(100vh - 130px);overflow:hidden;transform:translateY(-8px);transition:transform .16s;}
        #gs-overlay.gs-visible #gs-modal{transform:translateY(0);}
        #gs-search-row{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;flex-shrink:0;}
        #gs-search-icon{font-size:18px;color:#9CA3AF;flex-shrink:0;}
        #gs-input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:#111318;background:transparent;min-width:0;}
        #gs-input::placeholder{color:#B0AAA3;}
        #gs-controls-row{display:flex;align-items:center;gap:8px;padding:0 16px 8px;flex-shrink:0;}
        #gs-supplier-row{display:none;align-items:center;gap:8px;padding:0 16px 10px;flex-shrink:0;border-bottom:0.5px solid #E8E4DF;}
        #gs-supplier-row.visible{display:flex;}
        .gs-ctrl-select{flex:1;height:36px;padding:0 10px;border:1.5px solid #E2DDD8;border-radius:8px;background:#F5F2EE;font-size:13px;font-family:inherit;color:#111318;outline:none;cursor:pointer;min-width:0;}
        .gs-ctrl-select:focus{border-color:#1C3969;background:#fff;}
        #gs-search-btn{height:36px;padding:0 16px;background:#1C3969;color:#FFFFFF;border:none;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;flex-shrink:0;}
        #gs-search-btn:hover:not(:disabled){background:#152B52;}
        #gs-search-btn:disabled{background:#9CA3AF;cursor:not-allowed;}
        #gs-kbd-hint{font-size:11px;color:#C0BBB4;flex-shrink:0;white-space:nowrap;}
        #gs-results{overflow-y:auto;flex:1;padding:6px 0;}
        .gs-empty{padding:18px 16px 14px;}
        .gs-nav-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
        .gs-nav-chip{display:flex;align-items:center;gap:6px;padding:8px 10px;border:0.5px solid #E8E4DF;border-radius:8px;font-size:12px;font-weight:500;color:#3A3D4A;cursor:pointer;background:#FAFAF8;}
        .gs-nav-chip:hover{background:#F5F2EE;border-color:#C8C3BC;}
        .gs-nav-chip i{font-size:14px;color:#9CA3AF;}
        .gs-section-label{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#B0AAA3;padding:10px 16px 4px;background:#FAFAF8;}
        .gs-row{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;}
        .gs-row:hover,.gs-row.gs-sel{background:#F5F2EE;}
        .gs-row-icon{width:30px;height:30px;border-radius:8px;background:#F0ECE8;display:flex;align-items:center;justify-content:center;font-size:14px;color:#7A7F8E;flex-shrink:0;}
        .gs-row.gs-sel .gs-row-icon{background:#D6E4F7;color:#1C3969;}
        .gs-row-body{flex:1;min-width:0;}
        .gs-row-label{font-size:13px;font-weight:500;color:#111318;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .gs-row-sub{font-size:11px;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px;}
        .gs-badge{font-size:10px;font-weight:600;border-radius:5px;border:1px solid;padding:1px 6px;flex-shrink:0;}
        .gs-enter-hint{font-size:11px;color:#D1CBC4;flex-shrink:0;opacity:0;}
        .gs-row:hover .gs-enter-hint,.gs-row.gs-sel .gs-enter-hint{opacity:1;}
        .gs-view-more{padding:10px 16px;font-size:12px;font-weight:600;color:#1C3969;cursor:pointer;display:flex;align-items:center;gap:4px;border-top:0.5px solid #F0ECE8;}
        .gs-view-more:hover{background:#F5F2EE;}
        #gs-footer{padding:8px 16px;border-top:0.5px solid #F0ECE8;display:flex;align-items:center;gap:12px;flex-shrink:0;}
        .gs-footer-key{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#B0AAA3;}
        .gs-footer-key kbd{background:#F5F2EE;border:0.5px solid #E2DDD8;border-radius:3px;padding:1px 5px;font-size:10px;font-family:inherit;}
      </style>
      <div id="gs-modal">
        <div id="gs-search-row">
          <i class="ti ti-search" id="gs-search-icon"></i>
          <input id="gs-input" type="text" placeholder="Search…" autocomplete="off" spellcheck="false"/>
          <span id="gs-kbd-hint"><kbd>esc</kbd> to close</span>
        </div>
        <div id="gs-controls-row">
          <select id="gs-cat-select" class="gs-ctrl-select">
            <option value="">Select category…</option>
            ${CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('')}
          </select>
          <button id="gs-search-btn" disabled>Search</button>
        </div>
        <div id="gs-supplier-row">
          <select id="gs-supp-select" class="gs-ctrl-select">
            <option value="">All suppliers</option>
            ${SUPPLIERS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div id="gs-results"></div>
        <div id="gs-footer">
          <span class="gs-footer-key"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span class="gs-footer-key"><kbd>↵</kbd> Select</span>
          <span class="gs-footer-key"><kbd>Esc</kbd> Close</span>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const inp    = document.getElementById('gs-input');
    const catSel = document.getElementById('gs-cat-select');
    const suppSel= document.getElementById('gs-supp-select');
    const btn    = document.getElementById('gs-search-btn');

    inp.addEventListener('input', () => { _submitted = false; syncControls(); });
    catSel.addEventListener('change', () => { _submitted = false; syncControls(); });
    suppSel.addEventListener('change', () => { _submitted = false; syncControls(); });
    btn.addEventListener('click', doSearch);

    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Escape')    { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); moveSelection(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (!btn.disabled) doSearch();
        else if (_results[_selIdx]) pick(_selIdx);
      }
    });

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); _open ? close() : open(); }
      if (e.key === 'Escape' && _open) close();
    });
  }

  return { init, open, close, pick, viewMore };
})();

window.GlobalSearch = GlobalSearch;
