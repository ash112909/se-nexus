// ── Full-page search results ─────────────────────────────────────────────────

function render_search_results(el) {
  const ctx = Router.context || {};
  let _query = ctx.query || '';
  let _category = ctx.category || '';
  let _submitted = !!(ctx.query && ctx.category); // auto-run if both passed in

  const CATEGORIES = [
    { key: 'Parts',   label: 'Parts',   icon: 'ti-package', color: '#534AB7', bg: '#EEEDFE' },
    { key: 'Orders',  label: 'Orders',  icon: 'ti-receipt',  color: '#1C3969', bg: '#D6E4F7' },
    { key: 'Manuals', label: 'Manuals', icon: 'ti-book',     color: '#185FA5', bg: '#E6F1FB' },
    { key: 'Fleet',   label: 'Fleet Assets', icon: 'ti-tractor', color: '#065F46', bg: '#D1FAE5' },
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

  // ── Data fetchers per category ────────────────────────────────────────────

  function fetchResults(q, cat) {
    const ql = q.toLowerCase().trim();
    if (!ql || !cat) return [];
    const out = [];

    if (cat === 'Parts') {
      Store.getParts(q, '').forEach(p => out.push({
        icon: 'ti-package',
        label: p.description,
        sub: p.partNum + (p.vendor ? ' · ' + p.vendor : '') + (p.category ? ' · ' + p.category : ''),
        badge: null,
        action: () => Router.navigate('parts-search'),
      }));
    }

    if (cat === 'Orders') {
      Store.getOrders('all').filter(o =>
        (o.poNum||'').toLowerCase().includes(ql) || o.vendor.toLowerCase().includes(ql) ||
        o.name.toLowerCase().includes(ql) || o.wo.toLowerCase().includes(ql) ||
        o.asset.toLowerCase().includes(ql) || o.status.toLowerCase().includes(ql)
      ).forEach(o => out.push({
        icon: 'ti-receipt',
        label: o.name + (o.poNum ? ' · ' + o.poNum : ''),
        sub: o.vendor + ' · ' + o.wo + ' · ' + o.asset,
        badge: o.status === 'delivered'
          ? { text: 'Delivered',   color: '#3B6D11', bg: '#EAF3DE' }
          : o.status === 'backordered'
          ? { text: 'Backordered', color: '#A32D2D', bg: '#FEE2E2' }
          : { text: o.status,      color: '#1C3969', bg: '#D6E4F7' },
        action: () => Router.navigate('order-history'),
      }));
    }

    if (cat === 'Manuals') {
      Store.getManuals(q).forEach(m => out.push({
        icon: 'ti-book',
        label: m.title,
        sub: m.machine + ' · ' + m.type + ' manual · ' + m.year + ' · ' + m.pages + ' pages',
        badge: { text: m.type, color: '#185FA5', bg: '#E6F1FB' },
        action: () => Router.navigate('manuals'),
      }));
    }

    if (cat === 'News & Bulletins') {
      NEWS_ITEMS.filter(n =>
        n.title.toLowerCase().includes(ql) || n.tag.toLowerCase().includes(ql)
      ).forEach(n => out.push({
        icon: 'ti-news',
        label: n.title,
        sub: n.tag + ' · ' + n.date,
        badge: { text: n.tag, color: '#B91C1C', bg: '#FEE2E2' },
        action: n.action,
      }));
    }

    if (cat === 'Knowledge Base') {
      KB_ITEMS.filter(a =>
        a.title.toLowerCase().includes(ql) || a.cat.toLowerCase().includes(ql)
      ).forEach(a => out.push({
        icon: 'ti-help-circle',
        label: a.title,
        sub: 'Help article · ' + a.cat,
        badge: { text: a.cat, color: '#6B7280', bg: '#F3F4F6' },
        action: a.action || (() => HelpWidget && HelpWidget.setTab('articles')),
      }));
    }

    if (cat === 'Fleet') {
      // Fleet asset search — placeholder until asset inventory is built
      out.push({
        icon: 'ti-tractor',
        label: 'Fleet asset search coming soon',
        sub: 'Asset inventory management is not yet available',
        badge: null,
        action: () => {},
      });
    }

    return out;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function escH(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function highlight(text, q) {
    if (!q.trim() || !text) return escH(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
    return escH(text).replace(re, '<mark style="background:#FEF3C7;color:#92400E;border-radius:2px;padding:0 1px;">$1</mark>');
  }

  // ── Shell HTML ────────────────────────────────────────────────────────────

  el.innerHTML = `
<style>
.sr-shell{display:flex;flex-direction:column;height:100vh;overflow:hidden;background:#F5F2EE;}
.sr-topbar{background:#FFFFFF;border-bottom:0.5px solid #E8E4DF;padding:12px 24px;flex-shrink:0;display:flex;align-items:center;gap:12px;}
.sr-back-btn{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#5A5F6E;cursor:pointer;background:none;border:none;font-family:inherit;padding:0;flex-shrink:0;}
.sr-back-btn:hover{color:#111318;}
.sr-search-row{flex:1;display:flex;align-items:center;gap:8px;min-width:0;}
.sr-input-wrap{position:relative;flex:1;min-width:0;}
.sr-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9CA3AF;font-size:16px;pointer-events:none;}
.sr-search-input{width:100%;height:40px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:10px;padding:0 36px 0 40px;font-size:14px;font-family:inherit;color:#111318;outline:none;box-sizing:border-box;}
.sr-search-input:focus{border-color:#1C3969;background:#FFFFFF;}
.sr-search-input::placeholder{color:#B0AAA3;}
.sr-clear-btn{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#B0AAA3;font-size:14px;cursor:pointer;padding:2px;display:none;}
.sr-clear-btn.visible{display:block;}
.sr-cat-select{height:40px;padding:0 10px;border:1.5px solid #E2DDD8;border-radius:10px;background:#F5F2EE;font-size:13px;font-family:inherit;color:#111318;outline:none;cursor:pointer;flex-shrink:0;min-width:170px;}
.sr-cat-select:focus{border-color:#1C3969;}
.sr-search-btn{height:40px;padding:0 18px;background:#1C3969;color:#FFFFFF;border:none;border-radius:10px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;flex-shrink:0;white-space:nowrap;}
.sr-search-btn:hover{background:#152B52;}
.sr-search-btn:disabled{background:#9CA3AF;cursor:not-allowed;}
.sr-body{flex:1;overflow-y:auto;padding:28px 28px 48px;}
.sr-prompt{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:10px;color:#9CA3AF;padding:40px 20px;}
.sr-prompt i{font-size:44px;color:#E2DDD8;}
.sr-prompt-title{font-size:15px;font-weight:700;color:#3A3D4A;}
.sr-prompt-sub{font-size:13px;max-width:360px;line-height:1.6;}
.sr-results-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
.sr-cat-icon{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.sr-cat-title{font-size:14px;font-weight:700;color:#111318;}
.sr-cat-count{font-size:12px;color:#9CA3AF;}
.sr-results-list{display:flex;flex-direction:column;gap:5px;}
.sr-result-row{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:border-color .12s,box-shadow .12s;}
.sr-result-row:hover{border-color:#C8C3BC;box-shadow:0 2px 8px rgba(0,0,0,.05);}
.sr-result-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.sr-result-body{flex:1;min-width:0;}
.sr-result-label{font-size:13px;font-weight:600;color:#111318;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sr-result-sub{font-size:11px;color:#9CA3AF;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sr-result-badge{font-size:10px;font-weight:700;border-radius:6px;padding:2px 8px;flex-shrink:0;white-space:nowrap;}
.sr-result-arrow{font-size:14px;color:#D1CBC4;flex-shrink:0;opacity:0;transition:opacity .1s;}
.sr-result-row:hover .sr-result-arrow{opacity:1;}
.sr-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:12px;color:#9CA3AF;padding:40px 20px;}
.sr-empty i{font-size:44px;color:#E2DDD8;}
.sr-empty-title{font-size:16px;font-weight:700;color:#3A3D4A;}
.sr-empty-sub{font-size:13px;max-width:340px;line-height:1.6;}
</style>
<div class="sr-shell">
  <div class="sr-topbar">
    <button class="sr-back-btn" onclick="Router.back()"><i class="ti ti-arrow-left" style="font-size:13px;"></i> Back</button>
    <div class="sr-search-row">
      <div class="sr-input-wrap">
        <i class="ti ti-search sr-search-icon"></i>
        <input class="sr-search-input" id="sr-input" type="text" placeholder="Search…" autocomplete="off" spellcheck="false" value="${escH(_query)}"/>
        <button class="sr-clear-btn ${_query?'visible':''}" id="sr-clear-btn" title="Clear">✕</button>
      </div>
      <select class="sr-cat-select" id="sr-cat-select">
        <option value="">Select category…</option>
        ${CATEGORIES.map(c => `<option value="${escH(c.key)}" ${_category===c.key?'selected':''}>${escH(c.label)}</option>`).join('')}
      </select>
      <button class="sr-search-btn" id="sr-search-btn">Search</button>
    </div>
  </div>
  <div class="sr-body" id="sr-body"></div>
</div>`;

  // ── Wire up controls ──────────────────────────────────────────────────────

  const inputEl  = document.getElementById('sr-input');
  const clearBtn = document.getElementById('sr-clear-btn');
  const catSel   = document.getElementById('sr-cat-select');
  const searchBtn= document.getElementById('sr-search-btn');

  function syncBtn() {
    searchBtn.disabled = !inputEl.value.trim() || !catSel.value;
  }

  inputEl.addEventListener('input', function() {
    _query = this.value;
    clearBtn.classList.toggle('visible', !!_query);
    _submitted = false;
    syncBtn();
    renderBody();
  });

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !searchBtn.disabled) {
      e.preventDefault();
      doSearch();
    }
  });

  clearBtn.addEventListener('click', function() {
    _query = '';
    inputEl.value = '';
    clearBtn.classList.remove('visible');
    _submitted = false;
    syncBtn();
    renderBody();
    inputEl.focus();
  });

  catSel.addEventListener('change', function() {
    _category = this.value;
    _submitted = false;
    syncBtn();
    renderBody();
  });

  searchBtn.addEventListener('click', doSearch);

  function doSearch() {
    _query    = inputEl.value.trim();
    _category = catSel.value;
    if (!_query || !_category) return;
    _submitted = true;
    renderBody();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  let _results = [];

  function renderBody() {
    const body = document.getElementById('sr-body');
    if (!body) return;

    if (!_submitted || !_query || !_category) {
      const catMeta = CATEGORIES.find(c => c.key === _category);
      body.innerHTML = `<div class="sr-prompt">
        <i class="ti ti-search"></i>
        <div class="sr-prompt-title">${_category && catMeta ? 'Search ' + catMeta.label : 'Select a category and enter a search term'}</div>
        <div class="sr-prompt-sub">${_category ? 'Type a search term and click Search.' : 'Use the category dropdown to choose where you want to search, then enter your query.'}</div>
      </div>`;
      return;
    }

    _results = fetchResults(_query, _category);
    const catMeta = CATEGORIES.find(c => c.key === _category) || { icon: 'ti-search', color: '#5A5F6E', bg: '#F0ECE8', label: _category };

    if (!_results.length) {
      body.innerHTML = `<div class="sr-empty">
        <i class="ti ti-search-off"></i>
        <div class="sr-empty-title">No results in ${escH(catMeta.label)}</div>
        <div class="sr-empty-sub">Try different keywords — check spelling, or try a part number, serial number, or description.</div>
      </div>`;
      return;
    }

    body.innerHTML = `
      <div class="sr-results-header">
        <div class="sr-cat-icon" style="background:${catMeta.bg};color:${catMeta.color};"><i class="ti ${catMeta.icon}"></i></div>
        <span class="sr-cat-title">${escH(catMeta.label)}</span>
        <span class="sr-cat-count">${_results.length} result${_results.length!==1?'s':''} for "${escH(_query)}"</span>
      </div>
      <div class="sr-results-list">${_results.map((r, i) => rowHtml(r, i)).join('')}</div>`;

    body.querySelectorAll('.sr-result-row[data-idx]').forEach(row => {
      row.addEventListener('click', function() {
        const r = _results[parseInt(this.dataset.idx)];
        if (r) r.action();
      });
    });
  }

  function rowHtml(r, i) {
    const catMeta = CATEGORIES.find(c => c.key === _category) || { icon: 'ti-search', color: '#5A5F6E', bg: '#F0ECE8' };
    const badgeHtml = r.badge
      ? `<span class="sr-result-badge" style="background:${r.badge.bg||'#F0ECE8'};color:${r.badge.color};">${escH(r.badge.text)}</span>`
      : '';
    return `<div class="sr-result-row" data-idx="${i}">
      <div class="sr-result-icon" style="background:${catMeta.bg};color:${catMeta.color};"><i class="ti ${r.icon||catMeta.icon}"></i></div>
      <div class="sr-result-body">
        <div class="sr-result-label">${highlight(r.label, _query)}</div>
        <div class="sr-result-sub">${highlight(r.sub, _query)}</div>
      </div>
      ${badgeHtml}
      <i class="ti ti-chevron-right sr-result-arrow"></i>
    </div>`;
  }

  syncBtn();
  renderBody();
  if (_submitted) renderBody(); // auto-run if context had both query+category
  requestAnimationFrame(() => { if (!_query) inputEl.focus(); });
}
