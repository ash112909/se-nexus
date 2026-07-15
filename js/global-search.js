// Global search — command palette (Cmd/Ctrl+K, or click the sidebar search button)
const GlobalSearch = (() => {
  let _open = false;
  let _query = '';
  let _selIdx = 0;
  let _results = [];

  // Static navigation targets
  const NAV_ITEMS = [
    { label: 'Dashboard',          icon: 'ti-layout-dashboard', action: () => Router.navigate('dashboard'),    section: 'Pages' },
    { label: 'Work Orders',        icon: 'ti-clipboard-list',   action: () => Router.navigate('wo-list'),      section: 'Pages' },
    { label: 'Parts Search',       icon: 'ti-search',           action: () => Router.navigate('parts-search'), section: 'Pages' },
    { label: 'Order History',      icon: 'ti-history',          action: () => Router.navigate('order-history'),section: 'Pages' },
    { label: 'Manuals & Docs',     icon: 'ti-book',             action: () => Router.navigate('manuals'),      section: 'Pages' },
    { label: 'Diagnostics',        icon: 'ti-tool',             action: () => Router.navigate('diagnostics'),  section: 'Pages' },
    { label: 'Recommended Parts',  icon: 'ti-star',             action: () => Router.navigate('recommended'),  section: 'Pages' },
  ];

  // Supplier news — matches supplier landing page profiles
  const NEWS_ITEMS = [
    { title: 'SJIII 3219 hydraulic seal kit now available',           date: 'Jun 2026', tag: 'Skyjack',     action: () => { Router.navigate('parts-search'); } },
    { title: 'Updated service bulletin — lift cylinder torque specs', date: 'May 2026', tag: 'Skyjack',     action: () => Router.navigate('manuals') },
    { title: '320 track adjuster grease spec update',                 date: 'Jun 2026', tag: 'Caterpillar', action: () => Router.navigate('manuals') },
    { title: 'C7.1 engine filter cross-reference now available',      date: 'Apr 2026', tag: 'Caterpillar', action: () => Router.navigate('parts-search') },
    { title: '8FGU25 mast chain inspection interval bulletin',        date: 'May 2026', tag: 'Toyota',      action: () => Router.navigate('manuals') },
    { title: 'New OEM lift cylinder seals now stocked',               date: 'Mar 2026', tag: 'Toyota',      action: () => Router.navigate('parts-search') },
    { title: 'S650 hydraulic quick-coupler recall notice',            date: 'Jun 2026', tag: 'Bobcat',      action: () => Router.navigate('manuals') },
    { title: 'Revised fuse panel layout — S-Series 2020+',           date: 'Feb 2026', tag: 'Bobcat',      action: () => Router.navigate('manuals') },
  ];

  function buildResults(q) {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    const out = [];

    // Parts
    const parts = Store.getParts(q, '');
    parts.slice(0, 6).forEach(p => out.push({
      section: 'Parts',
      icon: 'ti-package',
      label: p.description,
      sub: p.partNum + ' · ' + p.vendor + ' · $' + p.price.toFixed(2),
      badge: p.inStock ? { text: 'In stock', color: '#639922' } : { text: 'B/O', color: '#BA7517' },
      action: () => { Router.navigate('parts-search'); },
    }));

    // Work orders
    const wos = Store.getWorkOrders('all').filter(wo =>
      String(wo.id).includes(ql) ||
      wo.machine.toLowerCase().includes(ql) ||
      wo.asset.toLowerCase().includes(ql) ||
      wo.issue.toLowerCase().includes(ql) ||
      wo.status.toLowerCase().includes(ql) ||
      wo.assignee.toLowerCase().includes(ql)
    );
    wos.slice(0, 4).forEach(wo => out.push({
      section: 'Work Orders',
      icon: 'ti-clipboard-list',
      label: 'WO #' + wo.id + ' — ' + wo.machine,
      sub: wo.asset + ' · ' + wo.issue,
      badge: { text: wo.status, color: wo.status === 'active' ? '#639922' : '#BA7517' },
      action: () => Router.navigate('wo-detail', { woId: wo.id }),
    }));

    // Manuals
    const manuals = Store.getManuals(q);
    manuals.slice(0, 4).forEach(m => out.push({
      section: 'Manuals',
      icon: 'ti-book',
      label: m.title,
      sub: m.machine + ' · ' + m.type + ' · ' + m.year + ' · ' + m.pages + ' pp',
      badge: null,
      action: () => Router.navigate('manuals'),
    }));

    // Orders
    const orders = Store.getOrders('all').filter(o =>
      (o.poNum || '').toLowerCase().includes(ql) ||
      o.vendor.toLowerCase().includes(ql) ||
      o.name.toLowerCase().includes(ql) ||
      o.wo.toLowerCase().includes(ql) ||
      o.asset.toLowerCase().includes(ql) ||
      o.status.toLowerCase().includes(ql)
    );
    orders.slice(0, 4).forEach(o => out.push({
      section: 'Orders',
      icon: 'ti-receipt',
      label: o.name + (o.poNum ? ' · ' + o.poNum : ''),
      sub: o.vendor + ' · ' + o.wo + ' · $' + o.amount.toFixed(2),
      badge: { text: o.status, color: o.status === 'delivered' ? '#639922' : o.status === 'backordered' ? '#C0392B' : '#BA7517' },
      action: () => Router.navigate('order-history'),
    }));

    // News
    NEWS_ITEMS.filter(n =>
      n.title.toLowerCase().includes(ql) ||
      n.tag.toLowerCase().includes(ql) ||
      n.date.toLowerCase().includes(ql)
    ).slice(0, 3).forEach(n => out.push({
      section: 'News & Bulletins',
      icon: 'ti-news',
      label: n.title,
      sub: n.tag + ' · ' + n.date,
      badge: null,
      action: n.action,
    }));

    // Navigation pages
    NAV_ITEMS.filter(nav => nav.label.toLowerCase().includes(ql)).forEach(nav => out.push({
      section: 'Pages',
      icon: nav.icon,
      label: nav.label,
      sub: 'Navigate to ' + nav.label,
      badge: null,
      action: nav.action,
    }));

    return out;
  }

  function renderResults() {
    const list = document.getElementById('gs-results');
    if (!list) return;
    const vaEl = document.getElementById('gs-view-all');
    if (!_query.trim()) {
      list.innerHTML = `<div class="gs-empty">
        <div style="font-size:12px;font-weight:600;color:#3A3D4A;margin-bottom:12px;">Jump to</div>
        <div class="gs-nav-grid">${NAV_ITEMS.map((n,i) =>
          `<div class="gs-nav-chip" onclick="GlobalSearch.pick(${i + 1000})"><i class="ti ${n.icon}"></i> ${n.label}</div>`
        ).join('')}</div>
        <div style="font-size:11px;color:#B0AAA3;margin-top:16px;text-align:center;">Type to search parts, work orders, manuals, orders, and more</div>
      </div>`;
      if (vaEl) vaEl.style.display = 'none';
      return;
    }

    _results = buildResults(_query);
    if (!_results.length) {
      list.innerHTML = `<div style="padding:32px;text-align:center;font-size:13px;color:#9CA3AF;">No results for "${_query}"</div>`;
      if (vaEl) vaEl.style.display = 'none';
      return;
    }
    if (vaEl) { vaEl.style.display = 'inline'; vaEl.textContent = `View all ${_results.length}+ results →`; }

    // Group by section
    const sections = {};
    _results.forEach((r, i) => {
      if (!sections[r.section]) sections[r.section] = [];
      sections[r.section].push({ ...r, _idx: i });
    });

    list.innerHTML = Object.entries(sections).map(([sec, items]) =>
      `<div class="gs-section-label">${sec}</div>` +
      items.map(r =>
        `<div class="gs-row ${_selIdx === r._idx ? 'gs-sel' : ''}" onclick="GlobalSearch.pick(${r._idx})" data-idx="${r._idx}">
          <div class="gs-row-icon"><i class="ti ${r.icon}"></i></div>
          <div class="gs-row-body">
            <div class="gs-row-label">${highlight(r.label, _query)}</div>
            <div class="gs-row-sub">${highlight(r.sub, _query)}</div>
          </div>
          ${r.badge ? `<span class="gs-badge" style="color:${r.badge.color};border-color:${r.badge.color}40;">${r.badge.text}</span>` : ''}
          <span class="gs-enter-hint">↵</span>
        </div>`
      ).join('')
    ).join('');

    // Scroll selected row into view
    const selEl = list.querySelector('.gs-sel');
    if (selEl) selEl.scrollIntoView({ block: 'nearest' });
  }

  function highlight(text, q) {
    if (!q.trim() || !text) return escHtml(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escHtml(text).replace(re, '<mark style="background:#FEF3C7;color:#92400E;border-radius:2px;padding:0 1px;">$1</mark>');
  }

  function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function open() {
    if (_open) return;
    _open = true;
    _query = '';
    _selIdx = 0;
    _results = [];
    const overlay = document.getElementById('gs-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('gs-visible'));
    const inp = document.getElementById('gs-input');
    if (inp) { inp.value = ''; inp.focus(); }
    renderResults();
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
      // nav item from empty state
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

  function init() {
    // Build overlay DOM once
    const overlay = document.createElement('div');
    overlay.id = 'gs-overlay';
    overlay.innerHTML = `
      <style>
        #gs-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:flex-start;justify-content:center;padding-top:80px;background:rgba(10,10,10,.55);opacity:0;transition:opacity .16s;}
        #gs-overlay.gs-visible{opacity:1;}
        #gs-modal{width:100%;max-width:620px;background:#FFFFFF;border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.28);display:flex;flex-direction:column;max-height:calc(100vh - 140px);overflow:hidden;transform:translateY(-8px);transition:transform .16s;}
        #gs-overlay.gs-visible #gs-modal{transform:translateY(0);}
        #gs-search-row{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:0.5px solid #E8E4DF;flex-shrink:0;}
        #gs-search-icon{font-size:18px;color:#9CA3AF;flex-shrink:0;}
        #gs-input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:#111318;background:transparent;}
        #gs-input::placeholder{color:#B0AAA3;}
        #gs-kbd-hint{font-size:11px;color:#C0BBB4;flex-shrink:0;}
        #gs-results{overflow-y:auto;flex:1;padding:6px 0;}
        .gs-empty{padding:18px 18px 14px;}
        .gs-nav-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
        .gs-nav-chip{display:flex;align-items:center;gap:6px;padding:8px 10px;border:0.5px solid #E8E4DF;border-radius:8px;font-size:12px;font-weight:500;color:#3A3D4A;cursor:pointer;background:#FAFAF8;}
        .gs-nav-chip:hover{background:#F5F2EE;border-color:#C8C3BC;}
        .gs-nav-chip i{font-size:14px;color:#9CA3AF;}
        .gs-section-label{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#B0AAA3;padding:10px 18px 4px;background:#FAFAF8;}
        .gs-row{display:flex;align-items:center;gap:10px;padding:9px 18px;cursor:pointer;}
        .gs-row:hover,.gs-row.gs-sel{background:#F5F2EE;}
        .gs-row-icon{width:30px;height:30px;border-radius:8px;background:#F0ECE8;display:flex;align-items:center;justify-content:center;font-size:14px;color:#7A7F8E;flex-shrink:0;}
        .gs-row.gs-sel .gs-row-icon{background:#FAEEDA;color:#854F0B;}
        .gs-row-body{flex:1;min-width:0;}
        .gs-row-label{font-size:13px;font-weight:500;color:#111318;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .gs-row-sub{font-size:11px;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px;}
        .gs-badge{font-size:10px;font-weight:600;border-radius:5px;border:1px solid;padding:1px 6px;flex-shrink:0;}
        .gs-enter-hint{font-size:11px;color:#D1CBC4;flex-shrink:0;opacity:0;}
        .gs-row:hover .gs-enter-hint,.gs-row.gs-sel .gs-enter-hint{opacity:1;}
        #gs-footer{padding:8px 18px;border-top:0.5px solid #F0ECE8;display:flex;align-items:center;gap:12px;flex-shrink:0;}
        .gs-footer-key{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#B0AAA3;}
        .gs-footer-key kbd{background:#F5F2EE;border:0.5px solid #E2DDD8;border-radius:3px;padding:1px 5px;font-size:10px;font-family:inherit;}
      </style>
      <div id="gs-modal">
        <div id="gs-search-row">
          <i class="ti ti-search" id="gs-search-icon"></i>
          <input id="gs-input" type="text" placeholder="Search parts, work orders, manuals, orders…" autocomplete="off" spellcheck="false"/>
          <span id="gs-kbd-hint"><kbd>esc</kbd> to close</span>
        </div>
        <div id="gs-results"></div>
        <div id="gs-footer">
          <span class="gs-footer-key"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span class="gs-footer-key"><kbd>↵</kbd> Select</span>
          <span class="gs-footer-key"><kbd>Esc</kbd> Close</span>
          <span id="gs-view-all" style="margin-left:auto;display:none;font-size:11px;color:#854F0B;font-weight:600;cursor:pointer;" onclick="GlobalSearch.viewAll()">View all results →</span>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Input events
    const inp = document.getElementById('gs-input');
    inp.addEventListener('input', function() {
      _query = this.value;
      _selIdx = 0;
      renderResults();
    });
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (_query.trim() && _results.length === 0) {
          close(); Router.navigate('search-results', { query: _query });
        } else if (_query.trim() && _selIdx === 0 && !_results[0]) {
          close(); Router.navigate('search-results', { query: _query });
        } else {
          pick(_selIdx);
        }
      }
    });

    // Global keyboard shortcut
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        _open ? close() : open();
      }
      if (e.key === 'Escape' && _open) close();
    });
  }

  function viewAll() {
    const q = _query;
    close();
    Router.navigate('search-results', { query: q });
  }

  return { init, open, close, pick, viewAll };
})();

window.GlobalSearch = GlobalSearch;
