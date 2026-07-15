// ── Full-page search results ─────────────────────────────────────────────────

function render_search_results(el) {
  const ctx = Router.context || {};
  let _query = ctx.query || '';
  let _filter = 'all'; // 'all' | section key

  // ── Data sources (mirrors global-search.js buildResults, no slice caps) ──

  const SECTION_META = {
    'Parts':           { icon: 'ti-package',        color: '#534AB7', bg: '#EEEDFE' },
    'Work Orders':     { icon: 'ti-clipboard-list',  color: '#0F6E56', bg: '#E1F5EE' },
    'Manuals':         { icon: 'ti-book',            color: '#185FA5', bg: '#E6F1FB' },
    'Orders':          { icon: 'ti-receipt',         color: '#854F0B', bg: '#FAEEDA' },
    'News & Bulletins':{ icon: 'ti-news',            color: '#B91C1C', bg: '#FEE2E2' },
    'Pages':           { icon: 'ti-layout-dashboard', color: '#5B21B6', bg: '#EDE9FE' },
    'Knowledge Base':  { icon: 'ti-help-circle',     color: '#6B7280', bg: '#F3F4F6' },
  };

  const NAV_ITEMS = [
    { label: 'Dashboard',         icon: 'ti-layout-dashboard', action: () => Router.navigate('dashboard') },
    { label: 'Work Orders',       icon: 'ti-clipboard-list',   action: () => Router.navigate('wo-list') },
    { label: 'Parts Search',      icon: 'ti-search',           action: () => Router.navigate('parts-search') },
    { label: 'Order History',     icon: 'ti-history',          action: () => Router.navigate('order-history') },
    { label: 'Manuals & Docs',    icon: 'ti-book',             action: () => Router.navigate('manuals') },
    { label: 'Diagnostics',       icon: 'ti-tool',             action: () => Router.navigate('diagnostics') },
    { label: 'Recommended Parts', icon: 'ti-star',             action: () => Router.navigate('recommended') },
    { label: 'News & Updates',    icon: 'ti-news',             action: () => Router.navigate('news') },
    { label: 'Analytics',         icon: 'ti-chart-bar',        action: () => Router.navigate('analytics') },
    { label: 'Content Management',icon: 'ti-pencil',           action: () => Router.navigate('cms') },
    { label: 'Approvals',         icon: 'ti-checkbox',         action: () => Router.navigate('approvals') },
  ];

  const NEWS_ITEMS = [
    { title: 'SJIII 3219 hydraulic seal kit now available',           date: 'Jun 2026', tag: 'Skyjack',     action: () => Router.navigate('parts-search') },
    { title: 'Updated service bulletin — lift cylinder torque specs', date: 'May 2026', tag: 'Skyjack',     action: () => Router.navigate('manuals') },
    { title: '320 track adjuster grease spec update',                 date: 'Jun 2026', tag: 'Caterpillar', action: () => Router.navigate('manuals') },
    { title: 'C7.1 engine filter cross-reference now available',      date: 'Apr 2026', tag: 'Caterpillar', action: () => Router.navigate('parts-search') },
    { title: '8FGU25 mast chain inspection interval bulletin',        date: 'May 2026', tag: 'Toyota',      action: () => Router.navigate('manuals') },
    { title: 'New OEM lift cylinder seals now stocked',               date: 'Mar 2026', tag: 'Toyota',      action: () => Router.navigate('parts-search') },
    { title: 'S650 hydraulic quick-coupler recall notice',            date: 'Jun 2026', tag: 'Bobcat',      action: () => Router.navigate('manuals') },
    { title: 'Revised fuse panel layout — S-Series 2020+',           date: 'Feb 2026', tag: 'Bobcat',      action: () => Router.navigate('manuals') },
  ];

  // KB articles from help widget if available, fallback inline
  const KB_ITEMS = (typeof HelpWidget !== 'undefined' && HelpWidget._kbArticles)
    ? HelpWidget._kbArticles
    : [
      { id:'kb-01', cat:'Orders',       title:'How to submit a parts order',             action: () => HelpWidget && HelpWidget.showArticle('kb-01') },
      { id:'kb-02', cat:'Orders',       title:'How to check order status',               action: () => HelpWidget && HelpWidget.showArticle('kb-02') },
      { id:'kb-03', cat:'Work Orders',  title:'Creating a new work order',               action: () => HelpWidget && HelpWidget.showArticle('kb-03') },
      { id:'kb-04', cat:'Work Orders',  title:'Attaching parts to a work order',         action: () => HelpWidget && HelpWidget.showArticle('kb-04') },
      { id:'kb-05', cat:'Parts Search', title:'Browsing parts by equipment model',       action: () => HelpWidget && HelpWidget.showArticle('kb-05') },
      { id:'kb-06', cat:'Parts Search', title:'Understanding OEM vs. aftermarket parts', action: () => HelpWidget && HelpWidget.showArticle('kb-06') },
      { id:'kb-07', cat:'Parts Search', title:'Requesting a price on a part',            action: () => HelpWidget && HelpWidget.showArticle('kb-07') },
      { id:'kb-08', cat:'Approvals',    title:'Why is my order pending approval?',       action: () => HelpWidget && HelpWidget.showArticle('kb-08') },
      { id:'kb-09', cat:'Approvals',    title:'Approving or rejecting an order',         action: () => HelpWidget && HelpWidget.showArticle('kb-09') },
      { id:'kb-10', cat:'Suppliers',    title:'How suppliers post content to fleets',    action: () => HelpWidget && HelpWidget.showArticle('kb-10') },
      { id:'kb-11', cat:'Suppliers',    title:'Responding to a price request',           action: () => HelpWidget && HelpWidget.showArticle('kb-11') },
      { id:'kb-12', cat:'Account',      title:'Changing your display name or password',  action: () => HelpWidget && HelpWidget.showArticle('kb-12') },
      { id:'kb-13', cat:'Diagnostics',  title:'Running a diagnostic on a machine',       action: () => HelpWidget && HelpWidget.showArticle('kb-13') },
      { id:'kb-14', cat:'Manuals',      title:'Downloading a service manual',            action: () => HelpWidget && HelpWidget.showArticle('kb-14') },
      { id:'kb-15', cat:'Analytics',    title:'Understanding the analytics dashboard',   action: () => HelpWidget && HelpWidget.showArticle('kb-15') },
    ];

  function buildAllResults(q) {
    const ql = q.toLowerCase().trim();
    if (!ql) return [];
    const out = [];

    // Parts — no cap
    Store.getParts(q, '').forEach(p => out.push({
      section: 'Parts', icon: 'ti-package',
      label: p.description,
      sub: p.partNum + ' · ' + p.vendor + ' · $' + p.price.toFixed(2),
      badge: p.inStock ? { text: 'In stock', color: '#3B6D11', bg: '#EAF3DE' } : { text: 'Backorder', color: '#BA7517', bg: '#FEF3C7' },
      action: () => Router.navigate('parts-search'),
    }));

    // Work Orders — no cap
    Store.getWorkOrders('all').filter(wo =>
      String(wo.id).includes(ql) || wo.machine.toLowerCase().includes(ql) ||
      wo.asset.toLowerCase().includes(ql) || wo.issue.toLowerCase().includes(ql) ||
      wo.status.toLowerCase().includes(ql) || wo.assignee.toLowerCase().includes(ql)
    ).forEach(wo => out.push({
      section: 'Work Orders', icon: 'ti-clipboard-list',
      label: 'WO #' + wo.id + ' — ' + wo.machine,
      sub: wo.asset + ' · ' + wo.issue + ' · Assigned to ' + wo.assignee,
      badge: wo.status === 'active'
        ? { text: 'Active',    color: '#3B6D11', bg: '#EAF3DE' }
        : wo.status === 'pending'
        ? { text: 'Pending',   color: '#854F0B', bg: '#FAEEDA' }
        : { text: wo.status,   color: '#5A5F6E', bg: '#F0ECE8' },
      action: () => Router.navigate('wo-detail', { woId: wo.id }),
    }));

    // Manuals — no cap
    Store.getManuals(q).forEach(m => out.push({
      section: 'Manuals', icon: 'ti-book',
      label: m.title,
      sub: m.machine + ' · ' + m.type + ' manual · ' + m.year + ' · ' + m.pages + ' pages · ' + m.size,
      badge: { text: m.type, color: '#185FA5', bg: '#E6F1FB' },
      action: () => Router.navigate('manuals'),
    }));

    // Orders — no cap
    Store.getOrders('all').filter(o =>
      (o.poNum || '').toLowerCase().includes(ql) || o.vendor.toLowerCase().includes(ql) ||
      o.name.toLowerCase().includes(ql) || o.wo.toLowerCase().includes(ql) ||
      o.asset.toLowerCase().includes(ql) || o.status.toLowerCase().includes(ql)
    ).forEach(o => out.push({
      section: 'Orders', icon: 'ti-receipt',
      label: o.name + (o.poNum ? ' · ' + o.poNum : ''),
      sub: o.vendor + ' · ' + o.wo + ' · $' + o.amount.toFixed(2),
      badge: o.status === 'delivered'
        ? { text: 'Delivered',   color: '#3B6D11', bg: '#EAF3DE' }
        : o.status === 'backordered'
        ? { text: 'Backordered', color: '#A32D2D', bg: '#FEE2E2' }
        : { text: o.status,      color: '#854F0B', bg: '#FAEEDA' },
      action: () => Router.navigate('order-history'),
    }));

    // News
    NEWS_ITEMS.filter(n =>
      n.title.toLowerCase().includes(ql) || n.tag.toLowerCase().includes(ql)
    ).forEach(n => out.push({
      section: 'News & Bulletins', icon: 'ti-news',
      label: n.title,
      sub: n.tag + ' · ' + n.date,
      badge: { text: n.tag, color: '#B91C1C', bg: '#FEE2E2' },
      action: n.action,
    }));

    // Knowledge base
    KB_ITEMS.filter(a =>
      a.title.toLowerCase().includes(ql) || a.cat.toLowerCase().includes(ql)
    ).forEach(a => out.push({
      section: 'Knowledge Base', icon: 'ti-help-circle',
      label: a.title,
      sub: 'Help article · ' + a.cat,
      badge: { text: a.cat, color: '#6B7280', bg: '#F3F4F6' },
      action: a.action || (() => HelpWidget && HelpWidget.setTab('articles')),
    }));

    // Pages
    NAV_ITEMS.filter(n => n.label.toLowerCase().includes(ql)).forEach(n => out.push({
      section: 'Pages', icon: n.icon,
      label: n.label,
      sub: 'Navigate to ' + n.label,
      badge: null,
      action: n.action,
    }));

    return out;
  }

  function escH(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function highlight(text, q) {
    if (!q.trim() || !text) return escH(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return escH(text).replace(re, '<mark style="background:#FEF3C7;color:#92400E;border-radius:2px;padding:0 1px;">$1</mark>');
  }

  // ── Shell ─────────────────────────────────────────────────────────────────

  el.innerHTML = `
<style>
.sr-shell { display:flex; height:100vh; overflow:hidden; background:#F5F2EE; }
.sr-sidebar { width:220px; min-width:220px; background:#FFFFFF; border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; padding:20px 0 24px; overflow-y:auto; flex-shrink:0; }
.sr-sidebar-hdr { padding:0 16px 12px; display:flex; align-items:center; gap:8px; }
.sr-back-btn { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#5A5F6E; cursor:pointer; background:none; border:none; font-family:inherit; padding:0; }
.sr-back-btn:hover { color:#111318; }
.sr-section-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#B0AAA3; padding:12px 16px 6px; }
.sr-filter-item { display:flex; align-items:center; gap:8px; padding:7px 16px; cursor:pointer; border-radius:0; border-left:3px solid transparent; font-size:13px; color:#5A5F6E; transition:all .12s; }
.sr-filter-item:hover { background:#F5F2EE; color:#111318; }
.sr-filter-item.active { background:#FAEEDA; color:#854F0B; font-weight:600; border-left-color:#F5A623; }
.sr-filter-icon { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
.sr-filter-count { margin-left:auto; font-size:10px; font-weight:700; background:#F0ECE8; color:#7A7F8E; border-radius:10px; padding:1px 7px; }
.sr-filter-item.active .sr-filter-count { background:#F5A623; color:#1A1200; }
.sr-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.sr-topbar { background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; padding:14px 24px; flex-shrink:0; display:flex; align-items:center; gap:14px; }
.sr-search-wrap { flex:1; max-width:580px; position:relative; }
.sr-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:18px; pointer-events:none; }
.sr-search-input { width:100%; height:42px; background:#F5F2EE; border:1.5px solid #E2DDD8; border-radius:11px; padding:0 14px 0 44px; font-size:15px; font-family:inherit; color:#111318; outline:none; }
.sr-search-input:focus { border-color:#F5A623; background:#FFFFFF; }
.sr-search-input::placeholder { color:#B0AAA3; }
.sr-clear-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#B0AAA3; font-size:16px; cursor:pointer; padding:2px; line-height:1; display:none; }
.sr-clear-btn.visible { display:block; }
.sr-clear-btn:hover { color:#5A5F6E; }
.sr-topbar-meta { font-size:12px; color:#9CA3AF; white-space:nowrap; flex-shrink:0; }
.sr-body { flex:1; overflow-y:auto; padding:20px 24px 40px; }
.sr-section { margin-bottom:28px; }
.sr-section-hdr { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.sr-section-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.sr-section-title { font-size:13px; font-weight:700; color:#111318; }
.sr-section-count { font-size:11px; color:#9CA3AF; }
.sr-results-list { display:flex; flex-direction:column; gap:4px; }
.sr-result-row { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:10px; padding:11px 14px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:border-color .12s, box-shadow .12s; }
.sr-result-row:hover { border-color:#C8C3BC; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.sr-result-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.sr-result-body { flex:1; min-width:0; }
.sr-result-label { font-size:13px; font-weight:600; color:#111318; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sr-result-sub { font-size:11px; color:#9CA3AF; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sr-result-badge { font-size:10px; font-weight:700; border-radius:6px; padding:2px 8px; flex-shrink:0; white-space:nowrap; }
.sr-result-arrow { font-size:14px; color:#D1CBC4; flex-shrink:0; opacity:0; transition:opacity .1s; }
.sr-result-row:hover .sr-result-arrow { opacity:1; }
.sr-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; gap:12px; }
.sr-empty-icon { font-size:40px; color:#E2DDD8; }
.sr-empty-title { font-size:16px; font-weight:700; color:#3A3D4A; }
.sr-empty-sub { font-size:13px; color:#9CA3AF; max-width:340px; line-height:1.6; }
.sr-no-query { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; gap:10px; color:#9CA3AF; }
.sr-no-query i { font-size:40px; color:#E2DDD8; }
</style>
<div class="sr-shell">
  <div class="sr-sidebar">
    <div class="sr-sidebar-hdr">
      <button class="sr-back-btn" onclick="history.back()"><i class="ti ti-arrow-left" style="font-size:13px;"></i> Back</button>
    </div>
    <div class="sr-section-label">Filter by type</div>
    <div id="sr-filter-list"></div>
  </div>
  <div class="sr-main">
    <div class="sr-topbar">
      <div class="sr-search-wrap">
        <i class="ti ti-search sr-search-icon"></i>
        <input class="sr-search-input" id="sr-input" type="text" placeholder="Search parts, work orders, manuals, orders…" autocomplete="off" spellcheck="false" value="${escH(_query)}"/>
        <button class="sr-clear-btn ${_query?'visible':''}" id="sr-clear-btn" title="Clear">✕</button>
      </div>
      <div class="sr-topbar-meta" id="sr-meta"></div>
    </div>
    <div class="sr-body" id="sr-body"></div>
  </div>
</div>`;

  // ── Wire up input ────────────────────────────────────────────────────────

  const inputEl = document.getElementById('sr-input');
  const clearBtn = document.getElementById('sr-clear-btn');

  inputEl.addEventListener('input', function() {
    _query = this.value;
    clearBtn.classList.toggle('visible', !!_query);
    _filter = 'all';
    render();
  });
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { this.blur(); }
  });
  clearBtn.addEventListener('click', function() {
    _query = '';
    inputEl.value = '';
    clearBtn.classList.remove('visible');
    _filter = 'all';
    render();
    inputEl.focus();
  });

  window.srSetFilter = function(f) {
    _filter = f;
    renderSidebar(allResults);
    renderBody(allResults);
  };

  // Focus the input on load for keyboard-first users
  requestAnimationFrame(() => inputEl.focus());

  // ── Render ───────────────────────────────────────────────────────────────

  let allResults = [];

  function render() {
    allResults = buildAllResults(_query);
    renderSidebar(allResults);
    renderBody(allResults);
    const metaEl = document.getElementById('sr-meta');
    if (metaEl) {
      metaEl.textContent = _query.trim()
        ? allResults.length + ' result' + (allResults.length !== 1 ? 's' : '') + ' for "' + _query + '"'
        : '';
    }
  }

  function renderSidebar(results) {
    const listEl = document.getElementById('sr-filter-list');
    if (!listEl) return;

    const counts = {};
    results.forEach(r => { counts[r.section] = (counts[r.section] || 0) + 1; });
    const total = results.length;
    const sections = Object.keys(SECTION_META).filter(s => counts[s]);

    listEl.innerHTML = `
      <div class="sr-filter-item ${_filter==='all'?'active':''}" onclick="srSetFilter('all')">
        <div class="sr-filter-icon" style="background:#F0ECE8;color:#7A7F8E;"><i class="ti ti-layout-grid"></i></div>
        All results
        <span class="sr-filter-count">${total}</span>
      </div>
      ${sections.map(s => {
        const m = SECTION_META[s];
        return `<div class="sr-filter-item ${_filter===s?'active':''}" onclick="srSetFilter('${s.replace(/'/g,"\\'")}')">
          <div class="sr-filter-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
          ${s}
          <span class="sr-filter-count">${counts[s]}</span>
        </div>`;
      }).join('')}`;
  }

  function renderBody(results) {
    const body = document.getElementById('sr-body');
    if (!body) return;

    if (!_query.trim()) {
      body.innerHTML = `<div class="sr-no-query"><i class="ti ti-search"></i><div style="font-size:14px;font-weight:600;color:#3A3D4A;">Start typing to search</div><div style="font-size:12px;margin-top:4px;">Parts, work orders, orders, manuals, news, and more</div></div>`;
      return;
    }

    const filtered = _filter === 'all' ? results : results.filter(r => r.section === _filter);

    if (!filtered.length) {
      body.innerHTML = `<div class="sr-empty">
        <i class="ti ti-search-off sr-empty-icon"></i>
        <div class="sr-empty-title">No results${_filter !== 'all' ? ' in ' + _filter : ''}</div>
        <div class="sr-empty-sub">${_filter !== 'all' ? 'Try selecting "All results" or changing your search.' : 'Try different keywords — check for typos or try a part number, serial, or description.'}</div>
        ${_filter !== 'all' ? `<button style="margin-top:8px;font-size:12px;font-weight:600;color:#534AB7;background:none;border:none;cursor:pointer;font-family:inherit;" onclick="srSetFilter('all')">Show all results</button>` : ''}
      </div>`;
      return;
    }

    if (_filter !== 'all') {
      // Single category — flat list
      const m = SECTION_META[_filter] || { icon: 'ti-search', color: '#5A5F6E', bg: '#F0ECE8' };
      body.innerHTML = `
        <div class="sr-section">
          <div class="sr-section-hdr">
            <div class="sr-section-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
            <span class="sr-section-title">${_filter}</span>
            <span class="sr-section-count">${filtered.length} result${filtered.length!==1?'s':''}</span>
          </div>
          <div class="sr-results-list">${filtered.map(r => resultRowHtml(r)).join('')}</div>
        </div>`;
    } else {
      // Grouped by section
      const bySec = {};
      filtered.forEach((r, i) => {
        if (!bySec[r.section]) bySec[r.section] = [];
        bySec[r.section].push({ ...r, _i: i });
      });
      body.innerHTML = Object.entries(bySec).map(([sec, items]) => {
        const m = SECTION_META[sec] || { icon: 'ti-search', color: '#5A5F6E', bg: '#F0ECE8' };
        return `<div class="sr-section">
          <div class="sr-section-hdr">
            <div class="sr-section-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
            <span class="sr-section-title">${sec}</span>
            <span class="sr-section-count">${items.length} result${items.length!==1?'s':''}</span>
            ${items.length > 5 ? `<button style="margin-left:auto;font-size:11px;font-weight:600;color:#534AB7;background:none;border:none;cursor:pointer;font-family:inherit;" onclick="srSetFilter('${sec.replace(/'/g,"\\'")}')">View all ${items.length} →</button>` : ''}
          </div>
          <div class="sr-results-list">${items.map(r => resultRowHtml(r)).join('')}</div>
        </div>`;
      }).join('');
    }

    // Wire up row clicks after render
    body.querySelectorAll('.sr-result-row[data-action-idx]').forEach(row => {
      row.addEventListener('click', function() {
        const idx = parseInt(this.dataset.actionIdx);
        const r = filtered[idx];
        if (r) r.action();
      });
    });
  }

  function resultRowHtml(r, idx) {
    const m = SECTION_META[r.section] || { icon: 'ti-search', color: '#5A5F6E', bg: '#F0ECE8' };
    const badgeHtml = r.badge
      ? `<span class="sr-result-badge" style="background:${r.badge.bg||'#F0ECE8'};color:${r.badge.color};">${escH(r.badge.text)}</span>`
      : '';
    // Store idx for click handler
    const actionIdx = idx !== undefined ? idx : 0;
    return `<div class="sr-result-row" data-action-idx="${actionIdx}" onclick="(${r.action.toString()})()">
      <div class="sr-result-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${r.icon || m.icon}"></i></div>
      <div class="sr-result-body">
        <div class="sr-result-label">${highlight(r.label, _query)}</div>
        <div class="sr-result-sub">${highlight(r.sub, _query)}</div>
      </div>
      ${badgeHtml}
      <i class="ti ti-chevron-right sr-result-arrow"></i>
    </div>`;
  }

  render();
}
