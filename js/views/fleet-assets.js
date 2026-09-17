// ── Fleet Assets ─────────────────────────────────────────────────────────────

function render_fleet_assets(el) {
  const ctx = Router.context || {};
  let _query = ctx.query || '';
  let _selectedId = ctx.assetId || null;
  let _statusFilter = 'all';

  const MANUALS = Store.getManuals ? Store.getManuals('') : [];

  function manualsForAsset(asset) {
    return MANUALS.filter(m =>
      (asset.manualMachines || []).some(name =>
        m.machine.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(m.machine.toLowerCase())
      )
    );
  }

  function statusColor(status) {
    if (status === 'Active')     return { color: '#3B6D11', bg: '#EAF3DE' };
    if (status === 'Retired')    return { color: '#6B7280', bg: '#F3F4F6' };
    if (status === 'In Service') return { color: '#1C3969', bg: '#D6E4F7' };
    return { color: '#BA7517', bg: '#FEF3C7' };
  }

  function escH(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  el.innerHTML = `
<style>
:root {
  --fa-bg: #F5F2EE;
  --fa-white: #FFFFFF;
  --fa-border: #E8E4DF;
  --fa-border-light: #F0ECE8;
  --fa-text: #111318;
  --fa-sub: #6B7280;
  --fa-muted: #9CA3AF;
  --fa-navy: #1C3969;
  --fa-navy-dark: #152B52;
}
.fa-shell { display:flex; height:100vh; overflow:hidden; background:var(--fa-bg); }
/* ── Left panel ── */
.fa-list-panel { width:340px; min-width:340px; background:var(--fa-white); border-right:0.5px solid var(--fa-border); display:flex; flex-direction:column; overflow:hidden; flex-shrink:0; }
.fa-list-topbar { padding:16px 16px 0; flex-shrink:0; }
.fa-list-title { font-size:15px; font-weight:700; color:var(--fa-text); margin-bottom:10px; }
.fa-search-wrap { position:relative; margin-bottom:10px; }
.fa-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--fa-muted); font-size:14px; pointer-events:none; }
.fa-search-input { width:100%; height:36px; background:#F5F2EE; border:1.5px solid var(--fa-border); border-radius:8px; padding:0 32px 0 34px; font-size:13px; font-family:inherit; color:var(--fa-text); outline:none; box-sizing:border-box; }
.fa-search-input:focus { border-color:var(--fa-navy); background:var(--fa-white); }
.fa-search-input::placeholder { color:#B0AAA3; }
.fa-search-clear { position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--fa-muted); font-size:13px; cursor:pointer; padding:2px; display:none; }
.fa-search-clear.visible { display:block; }
.fa-filter-row { display:flex; gap:6px; padding:0 0 10px; overflow-x:auto; }
.fa-filter-chip { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid var(--fa-border); background:var(--fa-white); color:var(--fa-sub); white-space:nowrap; }
.fa-filter-chip.active { background:var(--fa-navy); color:#fff; border-color:var(--fa-navy); }
.fa-list-count { font-size:11px; color:var(--fa-muted); padding:0 16px 8px; }
.fa-list-scroll { flex:1; overflow-y:auto; }
.fa-asset-row { padding:12px 16px; border-bottom:0.5px solid var(--fa-border-light); cursor:pointer; display:flex; align-items:flex-start; gap:10px; transition:background .1s; }
.fa-asset-row:hover { background:#F9F8F6; }
.fa-asset-row.active { background:#EBF2FB; border-left:3px solid var(--fa-navy); padding-left:13px; }
.fa-asset-thumb { width:44px; height:44px; border-radius:8px; background:#F0ECE8; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; color:var(--fa-muted); overflow:hidden; }
.fa-asset-thumb img { width:100%; height:100%; object-fit:cover; border-radius:8px; }
.fa-asset-row-body { flex:1; min-width:0; }
.fa-asset-equip { font-size:13px; font-weight:700; color:var(--fa-text); }
.fa-asset-make-model { font-size:12px; color:var(--fa-sub); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fa-asset-meta { display:flex; align-items:center; gap:6px; margin-top:4px; flex-wrap:wrap; }
.fa-status-pill { font-size:10px; font-weight:700; border-radius:10px; padding:2px 7px; }
.fa-loc-tag { font-size:10px; color:var(--fa-muted); }
/* ── Detail panel ── */
.fa-detail-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.fa-detail-topbar { background:var(--fa-white); border-bottom:0.5px solid var(--fa-border); padding:14px 24px; display:flex; align-items:center; gap:12px; flex-shrink:0; }
.fa-detail-back { background:none; border:none; font-size:12px; font-weight:600; color:var(--fa-sub); cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:4px; padding:0; }
.fa-detail-back:hover { color:var(--fa-text); }
.fa-detail-equip { font-size:16px; font-weight:700; color:var(--fa-text); }
.fa-detail-scroll { flex:1; overflow-y:auto; padding:24px; }
.fa-detail-hero { background:var(--fa-white); border:0.5px solid var(--fa-border); border-radius:12px; margin-bottom:20px; overflow:hidden; }
.fa-hero-image { width:100%; height:200px; background:#F0ECE8; display:flex; align-items:center; justify-content:center; font-size:64px; color:#D1CCC6; }
.fa-hero-image img { width:100%; height:100%; object-fit:cover; }
.fa-hero-body { padding:16px 20px 20px; }
.fa-hero-title { font-size:18px; font-weight:700; color:var(--fa-text); }
.fa-hero-sub { font-size:13px; color:var(--fa-sub); margin-top:2px; }
.fa-hero-desc { font-size:13px; color:var(--fa-sub); margin-top:10px; line-height:1.6; }
.fa-section { background:var(--fa-white); border:0.5px solid var(--fa-border); border-radius:12px; margin-bottom:16px; overflow:hidden; }
.fa-section-hdr { padding:12px 16px; border-bottom:0.5px solid var(--fa-border-light); display:flex; align-items:center; gap:8px; }
.fa-section-hdr-icon { width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:12px; }
.fa-section-hdr-title { font-size:12px; font-weight:700; color:var(--fa-text); }
.fa-field-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
.fa-field { padding:10px 16px; border-bottom:0.5px solid var(--fa-border-light); }
.fa-field:nth-child(odd):not(:last-child) { border-right:0.5px solid var(--fa-border-light); }
.fa-field-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:var(--fa-muted); margin-bottom:3px; }
.fa-field-value { font-size:13px; font-weight:500; color:var(--fa-text); }
.fa-field-value.muted { color:var(--fa-muted); font-style:italic; }
.fa-manual-row { display:flex; align-items:center; gap:10px; padding:10px 16px; border-bottom:0.5px solid var(--fa-border-light); cursor:pointer; transition:background .1s; }
.fa-manual-row:last-child { border-bottom:none; }
.fa-manual-row:hover { background:#F9F8F6; }
.fa-manual-icon { width:32px; height:32px; border-radius:8px; background:#E6F1FB; display:flex; align-items:center; justify-content:center; font-size:14px; color:#185FA5; flex-shrink:0; }
.fa-manual-body { flex:1; min-width:0; }
.fa-manual-title { font-size:13px; font-weight:600; color:var(--fa-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fa-manual-sub { font-size:11px; color:var(--fa-muted); margin-top:1px; }
.fa-manual-type { font-size:10px; font-weight:700; border-radius:5px; padding:2px 7px; background:#E6F1FB; color:#185FA5; flex-shrink:0; }
.fa-empty-detail { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; gap:10px; color:var(--fa-muted); padding:40px; }
.fa-empty-detail i { font-size:48px; color:#E2DDD8; }
.fa-no-manuals { padding:20px 16px; font-size:13px; color:var(--fa-muted); text-align:center; }
@media (max-width: 700px) {
  .fa-list-panel { width:100%; min-width:0; display:${_selectedId ? 'none' : 'flex'}; }
  .fa-detail-panel { display:${_selectedId ? 'flex' : 'none'}; }
}
</style>
<div class="fa-shell">
  <div class="fa-list-panel">
    <div class="fa-list-topbar">
      <div class="fa-list-title">Fleet Assets</div>
      <div class="fa-search-wrap">
        <i class="ti ti-search fa-search-icon"></i>
        <input class="fa-search-input" id="fa-asset-search" type="text" placeholder="Search by serial, model, location…" value="${escH(_query)}"/>
        <button class="fa-search-clear ${_query ? 'visible' : ''}" id="fa-search-clear">✕</button>
      </div>
      <div class="fa-filter-row" id="fa-filter-row">
        <div class="fa-filter-chip ${_statusFilter==='all'?'active':''}" onclick="faAssetFilter('all')">All</div>
        <div class="fa-filter-chip ${_statusFilter==='Active'?'active':''}" onclick="faAssetFilter('Active')">Active</div>
        <div class="fa-filter-chip ${_statusFilter==='In Service'?'active':''}" onclick="faAssetFilter('In Service')">In Service</div>
        <div class="fa-filter-chip ${_statusFilter==='Retired'?'active':''}" onclick="faAssetFilter('Retired')">Retired</div>
      </div>
    </div>
    <div class="fa-list-count" id="fa-list-count"></div>
    <div class="fa-list-scroll" id="fa-asset-list"></div>
  </div>
  <div class="fa-detail-panel" id="fa-detail-panel">
    <div id="fa-detail-content"></div>
  </div>
</div>`;

  // ── Render list ────────────────────────────────────────────────────────────

  function renderList() {
    const assets = Store.getFleetAssets(_query).filter(a =>
      _statusFilter === 'all' || a.status === _statusFilter
    );
    document.getElementById('fa-list-count').textContent =
      assets.length + ' asset' + (assets.length !== 1 ? 's' : '');

    const listEl = document.getElementById('fa-asset-list');
    if (!assets.length) {
      listEl.innerHTML = `<div style="padding:32px 16px;text-align:center;font-size:13px;color:#9CA3AF;">No assets match your search.</div>`;
      return;
    }

    listEl.innerHTML = assets.map(a => {
      const sc = statusColor(a.status);
      const icon = makeIcon(a);
      return `<div class="fa-asset-row ${_selectedId === a.id ? 'active' : ''}" onclick="faSelectAsset('${a.id}')">
        <div class="fa-asset-thumb">${icon}</div>
        <div class="fa-asset-row-body">
          <div class="fa-asset-equip">${escH(a.equipNum)}</div>
          <div class="fa-asset-make-model">${escH(a.make)} ${escH(a.model)} · ${escH(a.serial)}</div>
          <div class="fa-asset-meta">
            <span class="fa-status-pill" style="background:${sc.bg};color:${sc.color};">${escH(a.status)}</span>
            <span class="fa-loc-tag">${escH(a.location)}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function makeIcon(a) {
    if (a.image) return `<img src="${escH(a.image)}" alt="${escH(a.model)}"/>`;
    const icons = { 'Scissor Lift':'🛗', 'Boom Lift':'🏗️', 'Excavator':'🚜', 'Forklift':'🏭', 'Compact Track Loader':'🚧' };
    const emoji = icons[a.category] || '🔧';
    return `<span style="font-size:22px;">${emoji}</span>`;
  }

  // ── Render detail ──────────────────────────────────────────────────────────

  function renderDetail(asset) {
    const sc = statusColor(asset.status);
    const manuals = manualsForAsset(asset);
    const detailEl = document.getElementById('fa-detail-content');

    const field = (label, value, muted) =>
      `<div class="fa-field">
        <div class="fa-field-label">${label}</div>
        <div class="fa-field-value${muted?' muted':''}">${value || '<span class="fa-field-value muted">—</span>'}</div>
      </div>`;

    detailEl.innerHTML = `
<div style="display:flex;align-items:center;gap:12px;padding:14px 24px;background:#fff;border-bottom:0.5px solid #E8E4DF;flex-shrink:0;">
  <button class="fa-detail-back" onclick="faSelectAsset(null)"><i class="ti ti-arrow-left" style="font-size:12px;"></i> Assets</button>
  <div class="fa-detail-equip">${escH(asset.equipNum)} · ${escH(asset.make)} ${escH(asset.model)}</div>
  <span class="fa-status-pill" style="background:${sc.bg};color:${sc.color};font-size:11px;margin-left:auto;">${escH(asset.status)}</span>
</div>
<div class="fa-detail-scroll">
  <div class="fa-detail-hero">
    <div class="fa-hero-image">${asset.image ? `<img src="${escH(asset.image)}" alt="${escH(asset.model)}"/>` : makeIcon(asset)}</div>
    <div class="fa-hero-body">
      <div class="fa-hero-title">${escH(asset.make)} ${escH(asset.model)}</div>
      <div class="fa-hero-sub">${escH(asset.year)} · ${escH(asset.type)} · ${escH(asset.category)} · ${escH(asset.serial)}</div>
      ${asset.description ? `<div class="fa-hero-desc">${escH(asset.description)}</div>` : ''}
    </div>
  </div>

  <div class="fa-section">
    <div class="fa-section-hdr">
      <div class="fa-section-hdr-icon" style="background:#E6F1FB;color:#185FA5;"><i class="ti ti-info-circle"></i></div>
      <div class="fa-section-hdr-title">Asset Information</div>
    </div>
    <div class="fa-field-grid">
      ${field('Company Code',    asset.companyCode)}
      ${field('Equipment No.',   asset.equipNum)}
      ${field('Type',            asset.type)}
      ${field('Category',        asset.category)}
      ${field('Class',           asset.class)}
      ${field('Location / Branch', asset.location)}
      ${field('Make',            asset.make)}
      ${field('Model',           asset.model)}
      ${field('Serial Number',   asset.serial)}
      ${field('Status',          `<span class="fa-status-pill" style="background:${sc.bg};color:${sc.color};">${escH(asset.status)}</span>`)}
      ${field('Year',            asset.year)}
      ${field('Acquisition Date', asset.acquisitionDate)}
      ${field('Retired Date',    asset.retiredDate, !asset.retiredDate)}
      ${field('Warranty End',    asset.warrantyEnd, !asset.warrantyEnd)}
      ${field(asset.hours != null ? 'Hours' : 'Mileage',
              asset.hours != null
                ? (asset.hours.toLocaleString() + ' hrs')
                : asset.mileage != null ? (asset.mileage.toLocaleString() + ' mi') : null,
              asset.hours == null && asset.mileage == null)}
    </div>
  </div>

  <div class="fa-section">
    <div class="fa-section-hdr">
      <div class="fa-section-hdr-icon" style="background:#E6F1FB;color:#185FA5;"><i class="ti ti-book"></i></div>
      <div class="fa-section-hdr-title">Manuals &amp; Documentation</div>
      <span style="margin-left:auto;font-size:11px;color:#9CA3AF;">${manuals.length} doc${manuals.length!==1?'s':''}</span>
    </div>
    ${manuals.length
      ? manuals.map(m => `
        <div class="fa-manual-row" onclick="Router.navigate('manuals')">
          <div class="fa-manual-icon"><i class="ti ti-book"></i></div>
          <div class="fa-manual-body">
            <div class="fa-manual-title">${escH(m.title)}</div>
            <div class="fa-manual-sub">${escH(m.machine)} · ${escH(m.year)} · ${escH(m.pages)} pages · ${escH(m.size)}</div>
          </div>
          <span class="fa-manual-type">${escH(m.type)}</span>
        </div>`).join('')
      : `<div class="fa-no-manuals">No manuals linked to this equipment yet.</div>`
    }
  </div>
</div>`;
  }

  // ── Empty detail state ─────────────────────────────────────────────────────

  function renderEmptyDetail() {
    document.getElementById('fa-detail-content').innerHTML = `
<div class="fa-empty-detail" style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;">
  <i class="ti ti-tractor" style="font-size:48px;color:#E2DDD8;"></i>
  <div style="font-size:15px;font-weight:700;color:#3A3D4A;margin-top:12px;">Select an asset</div>
  <div style="font-size:13px;color:#9CA3AF;margin-top:4px;max-width:280px;text-align:center;line-height:1.6;">Choose a piece of equipment from the list to view its details and linked documentation.</div>
</div>`;
  }

  // ── Wire up ────────────────────────────────────────────────────────────────

  window.faSelectAsset = function(id) {
    _selectedId = id;
    document.querySelectorAll('.fa-asset-row').forEach(r => r.classList.remove('active'));
    if (id) {
      const row = document.querySelector(`.fa-asset-row[onclick*="'${id}'"]`);
      if (row) row.classList.add('active');
      const asset = Store.getFleetAssets().find(a => a.id === id);
      if (asset) renderDetail(asset);
    } else {
      renderEmptyDetail();
    }
  };

  window.faAssetFilter = function(status) {
    _statusFilter = status;
    document.querySelectorAll('.fa-filter-chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    renderList();
    if (_selectedId) {
      const stillVisible = Store.getFleetAssets(_query).find(a =>
        a.id === _selectedId && (_statusFilter === 'all' || a.status === _statusFilter)
      );
      if (!stillVisible) { _selectedId = null; renderEmptyDetail(); }
    }
  };

  const searchInput = document.getElementById('fa-asset-search');
  const clearBtn = document.getElementById('fa-search-clear');
  searchInput.addEventListener('input', function() {
    _query = this.value;
    clearBtn.classList.toggle('visible', !!_query);
    renderList();
  });
  clearBtn.addEventListener('click', function() {
    _query = '';
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    renderList();
    searchInput.focus();
  });

  renderList();
  if (_selectedId) {
    const asset = Store.getFleetAssets().find(a => a.id === _selectedId);
    if (asset) renderDetail(asset);
    else renderEmptyDetail();
  } else {
    renderEmptyDetail();
  }
}
