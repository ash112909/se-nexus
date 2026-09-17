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

  function makeIcon(a) {
    if (a.image) return `<img src="${escH(a.image)}" alt="${escH(a.model)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;"/>`;
    const icons = { 'Scissor Lift':'🛗', 'Boom Lift':'🏗️', 'Tracked Excavator':'🚜', 'Counterbalance Forklift':'🏭', 'Skid Steer / CTL':'🚧', 'Telehandler':'🏗️', 'Articulating Boom':'🏗️' };
    const emoji = icons[a.category] || '🔧';
    return `<span style="font-size:22px;">${emoji}</span>`;
  }

  function makeHeroIcon(a) {
    if (a.image) return `<img src="${escH(a.image)}" alt="${escH(a.model)}" style="width:100%;height:100%;object-fit:cover;"/>`;
    const icons = { 'Scissor Lift':'🛗', 'Boom Lift':'🏗️', 'Tracked Excavator':'🚜', 'Counterbalance Forklift':'🏭', 'Skid Steer / CTL':'🚧', 'Telehandler':'🏗️', 'Articulating Boom':'🏗️' };
    return `<span style="font-size:72px;">${icons[a.category] || '🔧'}</span>`;
  }

  el.innerHTML = `
<style>
/* ── Two-panel layout inside .main ── */
.fa-body { display:flex; flex:1; min-height:0; overflow:hidden; }
/* Left list panel */
.fa-list-panel { width:320px; min-width:320px; background:#FFFFFF; border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; overflow:hidden; flex-shrink:0; }
.fa-list-topbar { padding:14px 14px 0; flex-shrink:0; }
.fa-list-title { font-size:13px; font-weight:700; color:#111318; margin-bottom:9px; }
.fa-search-wrap { position:relative; margin-bottom:8px; }
.fa-search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:#B0AAA3; font-size:13px; pointer-events:none; }
.fa-search-input { width:100%; height:34px; background:#F5F2EE; border:1.5px solid #E8E4DF; border-radius:7px; padding:0 30px 0 32px; font-size:13px; font-family:inherit; color:#111318; outline:none; box-sizing:border-box; }
.fa-search-input:focus { border-color:#1C3969; background:#fff; }
.fa-search-input::placeholder { color:#B0AAA3; }
.fa-search-clear { position:absolute; right:7px; top:50%; transform:translateY(-50%); background:none; border:none; color:#B0AAA3; font-size:13px; cursor:pointer; padding:2px; display:none; }
.fa-search-clear.visible { display:block; }
.fa-filter-row { display:flex; gap:5px; padding-bottom:10px; overflow-x:auto; scrollbar-width:none; }
.fa-filter-row::-webkit-scrollbar { display:none; }
.fa-filter-chip { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid #E8E4DF; background:#FFFFFF; color:#6B7280; white-space:nowrap; }
.fa-filter-chip.active { background:#1C3969; color:#fff; border-color:#1C3969; }
.fa-list-count { font-size:11px; color:#9CA3AF; padding:0 14px 6px; }
.fa-list-scroll { flex:1; overflow-y:auto; }
.fa-asset-row { padding:11px 14px; border-bottom:0.5px solid #F0ECE8; cursor:pointer; display:flex; align-items:flex-start; gap:9px; transition:background .1s; }
.fa-asset-row:hover { background:#F9F8F6; }
.fa-asset-row.active { background:#EBF2FB; border-left:3px solid #1C3969; padding-left:11px; }
.fa-asset-thumb { width:42px; height:42px; border-radius:7px; background:#F0ECE8; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; overflow:hidden; }
.fa-asset-row-body { flex:1; min-width:0; }
.fa-asset-equip { font-size:12px; font-weight:700; color:#111318; }
.fa-asset-make-model { font-size:11px; color:#6B7280; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fa-asset-meta { display:flex; align-items:center; gap:5px; margin-top:4px; flex-wrap:wrap; }
.fa-status-pill { font-size:10px; font-weight:700; border-radius:10px; padding:2px 7px; }
.fa-loc-tag { font-size:10px; color:#9CA3AF; }
/* Right detail panel */
.fa-detail-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; background:#F5F2EE; }
.fa-detail-scroll { flex:1; overflow-y:auto; padding:20px 24px; }
.fa-detail-hero { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; margin-bottom:16px; overflow:hidden; }
.fa-hero-image { width:100%; height:180px; background:#F0ECE8; display:flex; align-items:center; justify-content:center; }
.fa-hero-body { padding:14px 18px 18px; }
.fa-hero-title { font-size:17px; font-weight:700; color:#111318; }
.fa-hero-sub { font-size:12px; color:#6B7280; margin-top:2px; }
.fa-hero-desc { font-size:12px; color:#6B7280; margin-top:8px; line-height:1.6; }
.fa-hero-actions { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
.fa-btn { height:32px; border-radius:7px; padding:0 14px; font-size:12px; font-weight:600; font-family:inherit; cursor:pointer; display:flex; align-items:center; gap:6px; border:none; }
.fa-btn-primary { background:#1C3969; color:#fff; }
.fa-btn-primary:hover { background:#152B52; }
.fa-btn-ghost { background:#F5F2EE; color:#3A3D4A; border:1px solid #E2DDD8; }
.fa-btn-ghost:hover { background:#ECEAE7; }
.fa-section { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; margin-bottom:14px; overflow:hidden; }
.fa-section-hdr { padding:11px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; gap:8px; }
.fa-section-hdr-icon { width:22px; height:22px; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:11px; }
.fa-section-hdr-title { font-size:12px; font-weight:700; color:#111318; }
.fa-field-grid { display:grid; grid-template-columns:1fr 1fr; }
.fa-field { padding:9px 16px; border-bottom:0.5px solid #F0ECE8; }
.fa-field:nth-child(odd) { border-right:0.5px solid #F0ECE8; }
.fa-field:nth-last-child(-n+2) { border-bottom:none; }
.fa-field-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:#9CA3AF; margin-bottom:2px; }
.fa-field-value { font-size:12px; font-weight:500; color:#111318; }
.fa-field-value.muted { color:#9CA3AF; font-style:italic; }
.fa-manual-row { display:flex; align-items:center; gap:9px; padding:10px 16px; border-bottom:0.5px solid #F0ECE8; cursor:pointer; transition:background .1s; }
.fa-manual-row:last-child { border-bottom:none; }
.fa-manual-row:hover { background:#F9F8F6; }
.fa-manual-icon { width:30px; height:30px; border-radius:7px; background:#E6F1FB; display:flex; align-items:center; justify-content:center; font-size:13px; color:#185FA5; flex-shrink:0; }
.fa-manual-body { flex:1; min-width:0; }
.fa-manual-title { font-size:12px; font-weight:600; color:#111318; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fa-manual-sub { font-size:11px; color:#9CA3AF; margin-top:1px; }
.fa-manual-type { font-size:10px; font-weight:700; border-radius:5px; padding:2px 7px; background:#E6F1FB; color:#185FA5; flex-shrink:0; }
.fa-wo-row { display:flex; align-items:center; gap:9px; padding:10px 16px; border-bottom:0.5px solid #F0ECE8; cursor:pointer; transition:background .1s; }
.fa-wo-row:last-child { border-bottom:none; }
.fa-wo-row:hover { background:#F9F8F6; }
.fa-empty-detail { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; gap:10px; color:#9CA3AF; padding:40px; }
.fa-no-content { padding:18px 16px; font-size:12px; color:#9CA3AF; text-align:center; }
@media (max-width:700px) {
  .fa-list-panel { width:100%; min-width:0; }
  .fa-body.detail-open .fa-list-panel { display:none; }
  .fa-body:not(.detail-open) .fa-detail-panel { display:none; }
}
</style>
<h2 class="sr-only">Fleet Assets</h2>
<div class="shell">
  ${buildSidebar('fleet-assets')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('home')">Home</a>
        <span>/</span>
        <span style="color:#FFFFFF;font-weight:500;">Fleet Assets</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="fa-body" id="fa-body">
      <div class="fa-list-panel">
        <div class="fa-list-topbar">
          <div class="fa-list-title">Fleet Assets</div>
          <div class="fa-search-wrap">
            <i class="ti ti-search fa-search-icon"></i>
            <input class="fa-search-input" id="fa-asset-search" type="text" placeholder="Serial, model, location…" value="${escH(_query)}"/>
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
        <div id="fa-detail-content" style="display:flex;flex-direction:column;height:100%;"></div>
      </div>
    </div>
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
      listEl.innerHTML = `<div style="padding:32px 14px;text-align:center;font-size:12px;color:#9CA3AF;">No assets match.</div>`;
      return;
    }
    listEl.innerHTML = assets.map(a => {
      const sc = statusColor(a.status);
      return `<div class="fa-asset-row ${_selectedId === a.id ? 'active' : ''}" onclick="faSelectAsset('${a.id}')">
        <div class="fa-asset-thumb">${makeIcon(a)}</div>
        <div class="fa-asset-row-body">
          <div class="fa-asset-equip">${escH(a.equipNum)}</div>
          <div class="fa-asset-make-model">${escH(a.make)} ${escH(a.model)}</div>
          <div class="fa-asset-meta">
            <span class="fa-status-pill" style="background:${sc.bg};color:${sc.color};">${escH(a.status)}</span>
            <span class="fa-loc-tag"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${escH(a.location)}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // ── Render detail ──────────────────────────────────────────────────────────

  function renderDetail(asset) {
    const sc = statusColor(asset.status);
    const manuals = manualsForAsset(asset);
    const detailEl = document.getElementById('fa-detail-content');

    // Related work orders — match by asset serial or equipment number
    const allWOs = Store.getWorkOrders ? Store.getWorkOrders('all') : [];
    const relatedWOs = allWOs.filter(wo =>
      (wo.serial && wo.serial === asset.serial) ||
      (wo.asset && (wo.asset.includes(asset.equipNum) || wo.asset.includes(asset.model)))
    ).slice(0, 5);

    // Parts relevant to this asset's make
    const vendorMap = { Skyjack: 'Skyjack', Caterpillar: 'Caterpillar', Toyota: 'Toyota', Bobcat: 'Bobcat', JLG: 'JLG', Genie: 'Genie' };
    const vendor = vendorMap[asset.make] || '';

    const field = (label, value, muted) =>
      `<div class="fa-field">
        <div class="fa-field-label">${label}</div>
        <div class="fa-field-value${muted ? ' muted' : ''}">${escH(String(value || '')) || '<span class="fa-field-value muted">—</span>'}</div>
      </div>`;

    detailEl.innerHTML = `
<div class="fa-detail-scroll">
  <div class="fa-detail-hero">
    <div class="fa-hero-image">${makeHeroIcon(asset)}</div>
    <div class="fa-hero-body">
      <div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap;">
        <div style="flex:1;min-width:0;">
          <div class="fa-hero-title">${escH(asset.make)} ${escH(asset.model)}</div>
          <div class="fa-hero-sub">${escH(asset.equipNum)} · ${escH(String(asset.year))} · ${escH(asset.serial)}</div>
        </div>
        <span class="fa-status-pill" style="background:${sc.bg};color:${sc.color};font-size:11px;flex-shrink:0;">${escH(asset.status)}</span>
      </div>
      ${asset.description ? `<div class="fa-hero-desc">${escH(asset.description)}</div>` : ''}
      <div class="fa-hero-actions">
        ${vendor ? `<button class="fa-btn fa-btn-primary" onclick="Router.navigate('parts-search')"><i class="ti ti-search" style="font-size:12px;"></i> Search ${escH(asset.make)} parts</button>` : ''}
        ${manuals.length ? `<button class="fa-btn fa-btn-ghost" onclick="Router.navigate('manuals')"><i class="ti ti-book" style="font-size:12px;"></i> View manuals</button>` : ''}
        <button class="fa-btn fa-btn-ghost" onclick="Router.navigate('wo-list')"><i class="ti ti-clipboard-list" style="font-size:12px;"></i> Work orders</button>
      </div>
    </div>
  </div>

  <div class="fa-section">
    <div class="fa-section-hdr">
      <div class="fa-section-hdr-icon" style="background:#E6F1FB;color:#185FA5;"><i class="ti ti-info-circle"></i></div>
      <div class="fa-section-hdr-title">Asset Information</div>
    </div>
    <div class="fa-field-grid">
      ${field('Company Code', asset.companyCode)}
      ${field('Equipment No.', asset.equipNum)}
      ${field('Type', asset.type)}
      ${field('Category', asset.category)}
      ${field('Class', asset.class)}
      ${field('Location / Branch', asset.location)}
      ${field('Make', asset.make)}
      ${field('Model', asset.model)}
      ${field('Serial Number', asset.serial)}
      ${field('Status', asset.status)}
      ${field('Year', asset.year)}
      ${field('Acquisition Date', asset.acquisitionDate)}
      ${field('Retired Date', asset.retiredDate || '—', !asset.retiredDate)}
      ${field('Warranty End', asset.warrantyEnd || '—', !asset.warrantyEnd)}
      ${field(asset.hours != null ? 'Hours' : 'Mileage',
              asset.hours != null
                ? asset.hours.toLocaleString() + ' hrs'
                : asset.mileage != null ? asset.mileage.toLocaleString() + ' mi' : '—',
              asset.hours == null && asset.mileage == null)}
      ${field('Description', asset.description || '—', !asset.description)}
    </div>
  </div>

  <div class="fa-section">
    <div class="fa-section-hdr">
      <div class="fa-section-hdr-icon" style="background:#E6F1FB;color:#185FA5;"><i class="ti ti-book"></i></div>
      <div class="fa-section-hdr-title">Manuals &amp; Documentation</div>
      <span style="margin-left:auto;font-size:11px;color:#9CA3AF;">${manuals.length} doc${manuals.length !== 1 ? 's' : ''}</span>
    </div>
    ${manuals.length
      ? manuals.map(m => `
        <div class="fa-manual-row" onclick="Router.navigate('manuals')">
          <div class="fa-manual-icon"><i class="ti ti-book"></i></div>
          <div class="fa-manual-body">
            <div class="fa-manual-title">${escH(m.title)}</div>
            <div class="fa-manual-sub">${escH(m.machine)} · ${escH(m.year)} · ${escH(String(m.pages))} pages · ${escH(m.size)}</div>
          </div>
          <span class="fa-manual-type">${escH(m.type)}</span>
        </div>`).join('')
      : `<div class="fa-no-content">No manuals linked to this equipment.</div>`
    }
  </div>

  ${relatedWOs.length ? `
  <div class="fa-section">
    <div class="fa-section-hdr">
      <div class="fa-section-hdr-icon" style="background:#FEF3C7;color:#B45309;"><i class="ti ti-clipboard-list"></i></div>
      <div class="fa-section-hdr-title">Related Work Orders</div>
      <span style="margin-left:auto;font-size:11px;color:#9CA3AF;">${relatedWOs.length}</span>
    </div>
    ${relatedWOs.map(wo => `
      <div class="fa-wo-row" onclick="Router.navigate('wo-detail',{woId:${wo.id}})">
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;color:#111318;">WO #${wo.id} · ${escH(wo.issue || wo.machine || '')}</div>
          <div style="font-size:11px;color:#9CA3AF;margin-top:1px;">${escH(wo.status || '')} · ${escH(wo.assignee || '')}</div>
        </div>
        <i class="ti ti-chevron-right" style="font-size:12px;color:#D1CCC6;flex-shrink:0;"></i>
      </div>`).join('')}
  </div>` : ''}
</div>`;

    document.getElementById('fa-body').classList.add('detail-open');
  }

  function renderEmptyDetail() {
    document.getElementById('fa-detail-content').innerHTML = `
<div class="fa-empty-detail">
  <i class="ti ti-tractor" style="font-size:52px;color:#E2DDD8;"></i>
  <div style="font-size:14px;font-weight:700;color:#3A3D4A;margin-top:10px;">Select an asset</div>
  <div style="font-size:12px;color:#9CA3AF;margin-top:4px;max-width:260px;line-height:1.6;">Choose a piece of equipment from the list to view its details, manuals, and linked work orders.</div>
</div>`;
    document.getElementById('fa-body').classList.remove('detail-open');
  }

  // ── Window handlers ────────────────────────────────────────────────────────

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
