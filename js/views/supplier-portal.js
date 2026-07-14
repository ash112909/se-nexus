function render_supplier_portal(el) {
  const _user = Store.getCurrentUser();
  if (!_user || _user.role !== 'supplier') { Router.navigate('login'); return; }

  const _supplierId = (_user.supplierIds || [])[0] || 'SKJ';
  const _fleets = Store.getSupplierFleets(_supplierId);
  const SUPPLIER_NAMES = { SKJ: 'Skyjack', CAT: 'Caterpillar', TOY: 'Toyota', BOB: 'Bobcat' };
  const _supplierName = SUPPLIER_NAMES[_supplierId] || _supplierId;
  let _activeTab = 'home';

  // Analytics state (persists across tab switches)
  let _spPeriod = '30D';
  let _spFleetId = null; // null = all

  // Manuals state
  let _spManType = null; // null = all
  let _spManMachine = 'All';
  let _spManSearch = '';

  // News state
  let _spNewsSearch = '';
  let _spNewsType = 'all';
  let _spNewsPoster = 'all';
  let _spNewsPriority = 'all';
  let _spNewsSortDir = 'desc';
  let _spNewsShowSaved = false;
  let _spNewsSaved = new Set(JSON.parse(localStorage.getItem('se-news-saved') || '[]'));
  let _spNewsReported = new Set(JSON.parse(localStorage.getItem('se-news-reported') || '[]'));

  const PR_STATUS = {
    pending:    { label: 'Awaiting response', color: '#854F0B', bg: '#FAEEDA' },
    needs_info: { label: 'More info needed',  color: '#534AB7', bg: '#EEEDFE' },
    quoted:     { label: 'Quoted',            color: '#0F6E56', bg: '#E1F5EE' },
    rejected:   { label: 'Not available',     color: '#5A5F6E', bg: '#F0ECE8' },
  };

  el.innerHTML = `
<style>
/* ── Supplier portal base ─── */
.sp-page-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; margin-bottom: 4px; }
.sp-page-sub { font-size: 13px; color: #7A7F8E; margin-bottom: 24px; }
.sp-fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-bottom: 32px; }
.sp-fleet-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.sp-fleet-card-header { display: flex; align-items: center; gap: 12px; }
.sp-fleet-logo { width: 40px; height: 40px; background: #1E1E1E; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #F5A623; flex-shrink: 0; letter-spacing: .5px; }
.sp-fleet-name { font-size: 14px; font-weight: 700; color: #111318; }
.sp-fleet-city { font-size: 12px; color: #9CA3AF; }
.sp-fleet-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sp-fleet-stat { background: #F5F2EE; border-radius: 7px; padding: 8px 10px; }
.sp-fleet-stat-val { font-size: 16px; font-weight: 700; color: #111318; }
.sp-fleet-stat-lbl { font-size: 10px; color: #9CA3AF; margin-top: 1px; }
.sp-fleet-actions { display: flex; gap: 8px; }
.sp-btn { height: 32px; padding: 0 12px; border-radius: 7px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; border: none; transition: opacity 0.1s; }
.sp-btn:hover { opacity: 0.85; }
.sp-btn-primary { background: #F5A623; color: #1A1200; }
.sp-btn-ghost { background: #FFFFFF; color: #3A3D4A; border: 1px solid #E2DDD8 !important; }
.sp-table { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.sp-table-head { display: grid; grid-template-columns: 120px 1fr 100px 120px 90px 90px; padding: 0 18px; background: #FAFAF9; border-bottom: 1px solid #F0ECE8; }
.sp-table-th { font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: .8px; text-transform: uppercase; padding: 10px 8px; }
.sp-table-row { display: grid; grid-template-columns: 120px 1fr 100px 120px 90px 90px; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; align-items: center; }
.sp-table-row:last-child { border-bottom: none; }
.sp-table-td { padding: 12px 8px; font-size: 13px; color: #3A3D4A; }
.sp-status-pill { display: inline-flex; font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
.sp-compose-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 22px; max-width: 680px; }
.sp-compose-field { margin-bottom: 16px; }
.sp-compose-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.sp-compose-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.sp-compose-input:focus { border-color: #F5A623; }
.sp-compose-textarea { width: 100%; min-height: 100px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; resize: vertical; }
.sp-compose-textarea:focus { border-color: #F5A623; }
.sp-compose-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.sp-fleet-check-row { display: flex; flex-direction: column; gap: 7px; padding: 10px; background: #FAFAF9; border: 1px solid #E8E4DF; border-radius: 7px; }
.sp-fleet-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #3A3D4A; cursor: pointer; }
.sp-fleet-check input { accent-color: #F5A623; }
/* ── Manuals CSS ─── */
.man-content-row { display:flex; flex:1; min-height:0; overflow:hidden; }
.man-vendor-panel { width:200px; min-width:200px; background:#FFFFFF; border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; padding:16px 0; overflow-y:auto; }
.mvp-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; padding:0 14px; }
.man-vendor-item { display:flex; align-items:center; gap:8px; padding:6px 14px; cursor:pointer; margin-bottom:2px; }
.man-vendor-item:hover { background:#F5F2EE; }
.man-vendor-item.active { background:#FAEEDA; }
.mvi-icon { width:26px; height:26px; background:#F5F2EE; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:13px; color:#9CA3AF; flex-shrink:0; }
.man-vendor-item.active .mvi-icon { background:#F5A623; color:#1A1200; }
.mvi-name { font-size:12px; font-weight:500; color:#3A3D4A; line-height:1.3; flex:1; }
.man-vendor-item.active .mvi-name { color:#854F0B; font-weight:600; }
.mvi-count { font-size:10px; color:#B0AAA3; }
.man-main-panel { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
.man-search-area { padding:12px 20px; background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; flex-shrink:0; }
.man-search-wrap { position:relative; }
.man-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:17px; pointer-events:none; }
.man-search-input { width:100%; height:40px; background:#F5F2EE; border:1.5px solid #E2DDD8; border-radius:10px; padding:0 14px 0 44px; font-size:14px; font-family:inherit; color:#111318; outline:none; box-sizing:border-box; }
.man-search-input:focus { border-color:#F5A623; background:#FFFFFF; }
.man-search-input::placeholder { color:#B0AAA3; }
.man-machine-chip-row { display:flex; align-items:center; gap:6px; padding:10px 20px; background:#FAFAF8; border-bottom:0.5px solid #E8E4DF; flex-wrap:wrap; flex-shrink:0; }
.man-machine-chip { height:28px; padding:0 12px; border:1px solid #E2DDD8; border-radius:999px; background:#FFFFFF; font-size:12px; font-weight:500; color:#5A5F6E; cursor:pointer; font-family:inherit; white-space:nowrap; }
.man-machine-chip:hover { background:#F5F2EE; border-color:#C8C3BC; }
.man-machine-chip.active { background:#FAEEDA; border-color:#F5A623; color:#854F0B; font-weight:600; }
.man-content-body { flex:1; padding:20px; overflow-y:auto; }
.man-section-label { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:12px; }
.docs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:10px; margin-bottom:24px; }
.doc-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px; display:flex; gap:12px; cursor:pointer; transition:border-color 0.12s; }
.doc-card:hover { border-color:#C8C3BC; }
.doc-icon-wrap { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.doc-body { flex:1; min-width:0; }
.doc-title { font-size:13px; font-weight:600; color:#111318; margin-bottom:3px; line-height:1.3; }
.doc-meta { font-size:11px; color:#9CA3AF; margin-bottom:6px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.doc-meta-sep { color:#D1CBC4; }
.doc-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:6px; }
.doc-tag { font-size:10px; border-radius:4px; padding:2px 6px; font-weight:500; }
.tag-type { background:#FAEEDA; color:#854F0B; }
.doc-actions { display:flex; align-items:center; gap:6px; }
.doc-btn { font-size:11px; font-weight:500; border-radius:6px; padding:4px 10px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:4px; }
.doc-btn-primary { background:#F5A623; border:none; color:#1A1200; font-weight:600; }
.doc-btn-primary:hover { background:#E8980F; }
.doc-btn-ghost { background:none; border:0.5px solid #E2DDD8; color:#3A3D4A; }
.doc-btn-ghost:hover { background:#F5F2EE; }
/* ── News CSS ─── */
.news-shell { display:flex; flex:1; min-height:0; overflow:hidden; }
.news-filter-panel { width:220px; min-width:220px; background:#FFFFFF; border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; padding:16px 0; overflow-y:auto; flex-shrink:0; }
.nfp-section { padding:0 14px; margin-bottom:18px; }
.nfp-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:8px; }
.nfp-item { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:7px; cursor:pointer; font-size:12px; color:#5A5F6E; margin-bottom:2px; }
.nfp-item:hover { background:#F5F2EE; }
.nfp-item.active { background:#FAEEDA; color:#854F0B; font-weight:600; }
.nfp-item-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.nfp-poster { display:flex; align-items:center; gap:8px; padding:5px 8px; border-radius:7px; cursor:pointer; font-size:12px; color:#5A5F6E; margin-bottom:2px; }
.nfp-poster:hover { background:#F5F2EE; }
.nfp-poster.active { background:#FAEEDA; color:#854F0B; font-weight:600; }
.news-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
.news-toolbar { padding:14px 20px; background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex-shrink:0; }
.news-search-wrap { position:relative; flex:1; min-width:200px; max-width:360px; }
.news-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:15px; pointer-events:none; }
.news-search-input { width:100%; height:36px; background:#F5F2EE; border:1.5px solid #E2DDD8; border-radius:9px; padding:0 12px 0 34px; font-size:13px; font-family:inherit; color:#111318; outline:none; }
.news-search-input:focus { border-color:#F5A623; background:#FFFFFF; }
.news-search-input::placeholder { color:#B0AAA3; }
.news-sort-btn { display:flex; align-items:center; gap:5px; height:36px; padding:0 12px; background:#FFFFFF; border:0.5px solid #E2DDD8; border-radius:9px; font-size:12px; font-weight:500; color:#5A5F6E; cursor:pointer; font-family:inherit; white-space:nowrap; }
.news-sort-btn:hover { background:#F5F2EE; }
.news-count-label { font-size:12px; color:#9CA3AF; margin-left:auto; white-space:nowrap; }
.news-body { flex:1; padding:16px 20px; overflow-y:auto; }
.news-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:15px; margin-bottom:10px; transition:border-color .12s, box-shadow .12s; }
.news-card:hover { border-color:#C8C3BC; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.nc-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
.nc-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.nc-meta { flex:1; display:flex; flex-direction:column; gap:3px; }
.nc-poster { font-size:11px; color:#9CA3AF; }
.nc-date { font-size:11px; color:#C0BAB3; white-space:nowrap; flex-shrink:0; }
.nc-title { font-size:13px; font-weight:600; color:#111318; line-height:1.45; margin-bottom:5px; }
.nc-summary { font-size:12px; color:#7A7F8E; line-height:1.6; margin-bottom:10px; }
.nc-tags { display:flex; gap:5px; flex-wrap:wrap; }
.nc-tag { font-size:10px; background:#F5F2EE; color:#7A7F8E; border-radius:4px; padding:2px 7px; }
.nc-actions { display:flex; align-items:center; gap:8px; margin-top:10px; padding-top:10px; border-top:0.5px solid #F0ECE8; }
.nc-action-btn { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:7px; border:0.5px solid #E2DDD8; background:#FFFFFF; color:#5A5F6E; font-size:11px; font-weight:500; cursor:pointer; font-family:inherit; }
.nc-action-btn:hover { background:#F5F2EE; }
.nc-saved { background:#FAEEDA; color:#854F0B; border-color:#F5A623; }
.nc-saved:hover { background:#F5DFC0; }
.nc-report-btn:hover { background:#FFF5F5; color:#B91C1C; border-color:#FCA5A5; }
.nc-reported { color:#9CA3AF; border-color:#E2DDD8; cursor:default; }
/* ── Analytics CSS ─── */
.an-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.an-filter-bar { display:flex; align-items:center; gap:12px; padding:10px 24px; border-bottom:0.5px solid #E8E4DF; background:#FAFAF8; flex-shrink:0; flex-wrap:wrap; }
.an-filter-label { font-size:11px; font-weight:600; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.8px; white-space:nowrap; }
.an-period-pills { display:flex; gap:4px; }
.an-period-pill { padding:4px 11px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:0.5px solid #E0DBD5; color:#5A5F6E; background:#FFFFFF; transition:all 0.15s; white-space:nowrap; }
.an-period-pill.active { background:#111318; color:#FFFFFF; border-color:#111318; }
.an-period-pill:hover:not(.active) { border-color:#9CA3AF; color:#111318; }
.an-filter-sep { width:0.5px; height:20px; background:#E8E4DF; }
.an-loc-pills { display:flex; gap:5px; flex-wrap:wrap; }
.an-loc-pill { display:flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:0.5px solid #E0DBD5; color:#5A5F6E; background:#FFFFFF; transition:all 0.15s; white-space:nowrap; }
.an-loc-pill.active { background:#FAEEDA; color:#854F0B; border-color:#F5C97A; }
.an-loc-pill:hover:not(.active) { border-color:#9CA3AF; }
.an-content { flex:1; padding:20px 24px 40px; overflow-y:auto; }
.an-kpi-row { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-bottom:18px; }
.an-kpi { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px 16px; }
.an-kpi-val { font-size:22px; font-weight:700; color:#111318; letter-spacing:-0.5px; line-height:1.1; }
.an-kpi-label { font-size:11px; color:#9CA3AF; margin-top:3px; line-height:1.3; }
.an-kpi-delta { font-size:11px; margin-top:4px; font-weight:600; }
.an-kpi-delta.up { color:#3B6D11; } .an-kpi-delta.down { color:#A32D2D; } .an-kpi-delta.neutral { color:#9CA3AF; }
.an-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.an-grid-3 { display:grid; grid-template-columns:2fr 1fr; gap:14px; margin-bottom:14px; }
.an-grid-insight { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
.an-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; overflow:hidden; }
.an-card-hdr { padding:11px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; justify-content:space-between; }
.an-card-title { font-size:12px; font-weight:600; color:#111318; display:flex; align-items:center; gap:6px; }
.an-card-sub { font-size:10px; color:#9CA3AF; }
.an-card-body { padding:14px 16px; }
.an-trend-wrap { display:flex; align-items:flex-end; gap:5px; height:100px; }
.an-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:default; }
.an-bar-col:hover .an-bar-seg { opacity:0.8; }
.an-bar-seg { width:100%; border-radius:3px 3px 0 0; transition:height 0.3s; min-height:2px; }
.an-bar-lbl { font-size:9px; color:#9CA3AF; }
.an-bar-amt { font-size:8px; font-weight:600; color:#5A5F6E; }
.an-mech-row { display:flex; align-items:center; gap:9px; margin-bottom:9px; }
.an-mech-row:last-child { margin-bottom:0; }
.an-avatar { width:26px; height:26px; border-radius:50%; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.an-name { font-size:12px; font-weight:500; color:#111318; min-width:80px; }
.an-bar-inline { flex:1; height:6px; background:#F5F2EE; border-radius:3px; overflow:hidden; }
.an-bar-fill { height:100%; border-radius:3px; }
.an-val { font-size:11px; font-weight:700; color:#111318; text-align:right; min-width:52px; }
.an-cnt { font-size:10px; color:#9CA3AF; text-align:right; min-width:40px; }
.an-vendor-row { display:flex; align-items:center; gap:8px; margin-bottom:9px; }
.an-vendor-row:last-child { margin-bottom:0; }
.an-vdot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.an-vname { font-size:12px; font-weight:500; color:#111318; min-width:72px; }
.an-vpct { font-size:10px; color:#9CA3AF; min-width:30px; text-align:right; }
.an-vval { font-size:11px; font-weight:700; color:#111318; min-width:54px; text-align:right; }
.an-part-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.an-part-row:last-child { margin-bottom:0; }
.an-rank { width:17px; height:17px; border-radius:4px; background:#F5F2EE; font-size:9px; font-weight:700; color:#9CA3AF; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.an-part-info { flex:1; min-width:0; }
.an-part-desc { font-size:11px; font-weight:500; color:#111318; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.an-part-meta { font-size:9px; color:#9CA3AF; margin-top:1px; }
.an-part-qty { font-size:11px; font-weight:700; color:#111318; min-width:24px; text-align:right; }
.an-trend-arrow { font-size:10px; }
.an-trend-up { color:#3B6D11; } .an-trend-down { color:#A32D2D; } .an-trend-flat { color:#9CA3AF; }
.an-wo-stat { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:0.5px solid #F5F2EE; }
.an-wo-stat:last-child { border-bottom:none; }
.an-wo-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; }
.an-cat-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.an-cat-row:last-child { margin-bottom:0; }
.an-cat-name { font-size:11px; font-weight:500; color:#111318; min-width:80px; }
.an-cat-val { font-size:11px; font-weight:700; color:#111318; min-width:52px; text-align:right; }
.an-donut-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.an-donut-row:last-child { margin-bottom:0; }
.an-donut-swatch { width:10px; height:10px; border-radius:2px; flex-shrink:0; }
.an-donut-label { font-size:12px; color:#111318; flex:1; }
.an-donut-pct { font-size:11px; font-weight:700; color:#111318; }
.an-donut-val { font-size:10px; color:#9CA3AF; min-width:48px; text-align:right; }
.an-insight { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; }
.an-insight-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.an-insight-title { font-size:12px; font-weight:600; color:#111318; }
.an-insight-body { font-size:11px; color:#5A5F6E; line-height:1.55; }
.an-insight-tag { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-top:2px; width:fit-content; }
.an-empty { color:#9CA3AF; font-size:12px; padding:8px 0; }
</style>
<div class="shell">
  ${buildSidebar('sp-home')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <span style="color:#FFFFFF;font-weight:500;" id="sp-topbar-title">Home</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div id="sp-content" style="flex:1;overflow-y:auto;padding:28px;"></div>
  </div>
</div>`;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function spBar(pct, color) {
    return `<div class="an-bar-inline"><div class="an-bar-fill" style="width:${Math.max(2, Math.round(pct*100))}%;background:${color};"></div></div>`;
  }

  // ── Tab rendering ────────────────────────────────────────────────────────────

  function renderHome() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'Home';
    const pending = Store.getPriceRequests(_supplierId).filter(r => r.status === 'pending').length;
    const myArticles = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).filter(a => a.supplierId === _supplierId);
    const recentReqs = Store.getPriceRequests(_supplierId).slice(0, 3);
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">Welcome back, ${_user.displayName.split(' ')[0]}</div>
      <div class="sp-page-sub">Here's a summary of your supplier activity.</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:28px;">
        <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:18px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;">Onboarded Fleets</div>
          <div style="font-size:28px;font-weight:700;color:#111318;">${_fleets.length}</div>
        </div>
        <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:18px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;">Open Price Requests</div>
          <div style="font-size:28px;font-weight:700;color:${pending > 0 ? '#854F0B' : '#111318'};">${pending}</div>
        </div>
        <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:18px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;">Content Published</div>
          <div style="font-size:28px;font-weight:700;color:#111318;">${myArticles.length}</div>
        </div>
        <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:18px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;">Total Requests</div>
          <div style="font-size:28px;font-weight:700;color:#111318;">${Store.getPriceRequests(_supplierId).length}</div>
        </div>
      </div>
      ${recentReqs.length ? `
      <div style="font-size:14px;font-weight:700;color:#111318;margin-bottom:12px;">Recent Price Requests</div>
      <div class="sp-table" style="margin-bottom:24px;">
        ${recentReqs.map(r => {
          const s = PR_STATUS[r.status] || PR_STATUS.pending;
          return `<div class="sp-table-row" style="grid-template-columns:1fr 110px 130px 80px;">
            <div class="sp-table-td">
              <div style="font-weight:500;color:#111318;">${r.partDesc}</div>
              <div style="font-size:11px;color:#9CA3AF;margin-top:2px;">${r.partNum} · ${r.fleetName}</div>
            </div>
            <div class="sp-table-td" style="font-size:12px;color:#7A7F8E;">${r.requestedDate}</div>
            <div class="sp-table-td"><span class="sp-status-pill" style="background:${s.bg};color:${s.color};">${s.label}</span></div>
            <div class="sp-table-td"><button class="sp-btn sp-btn-ghost" onclick="spRespondToRequest('${r.id}')">Respond</button></div>
          </div>`;
        }).join('')}
      </div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="sp-btn sp-btn-primary" onclick="document.querySelector('.sb-item[data-sp-tab=fleets]').click()"><i class="ti ti-building-warehouse" style="font-size:12px;"></i> View My Fleets</button>
        <button class="sp-btn sp-btn-ghost" onclick="document.querySelector('.sb-item[data-sp-tab=content]').click()"><i class="ti ti-pencil" style="font-size:12px;"></i> Post Content</button>
      </div>`;
  }

  function renderFleets() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'My Fleets';
    const openRequests = Store.getPriceRequests(_supplierId).filter(r => r.status === 'pending').length;
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">My Fleets</div>
      <div class="sp-page-sub">${_fleets.length} fleet${_fleets.length !== 1 ? 's' : ''} onboarded · ${openRequests} open price request${openRequests !== 1 ? 's' : ''}</div>
      <div class="sp-fleet-grid">
        ${_fleets.map(f => `
          <div class="sp-fleet-card">
            <div class="sp-fleet-card-header">
              <div class="sp-fleet-logo">${f.logoText}</div>
              <div>
                <div class="sp-fleet-name">${f.fleetName}</div>
                <div class="sp-fleet-city">${f.city} · ${f.locations} location${f.locations !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div class="sp-fleet-stats">
              <div class="sp-fleet-stat">
                <div class="sp-fleet-stat-val">${f.activeOrders}</div>
                <div class="sp-fleet-stat-lbl">Active orders</div>
              </div>
              <div class="sp-fleet-stat">
                <div class="sp-fleet-stat-val">${Store.getPriceRequests(_supplierId).filter(r=>r.fleetId===f.fleetId&&r.status==='pending').length}</div>
                <div class="sp-fleet-stat-lbl">Price requests</div>
              </div>
            </div>
            <div class="sp-fleet-actions">
              <button class="sp-btn sp-btn-primary" onclick="spImpersonate('${f.fleetId}','${f.fleetName}')"><i class="ti ti-eye" style="font-size:12px;"></i> View as fleet</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function renderRequests() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'Price Requests';
    const reqs = Store.getPriceRequests(_supplierId);
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">Price Requests</div>
      <div class="sp-page-sub">${reqs.length} total · ${reqs.filter(r=>r.status==='pending').length} awaiting response</div>
      <div class="sp-table">
        <div class="sp-table-head">
          <div class="sp-table-th">Part #</div>
          <div class="sp-table-th">Description</div>
          <div class="sp-table-th">Fleet</div>
          <div class="sp-table-th">Requested by</div>
          <div class="sp-table-th">Qty</div>
          <div class="sp-table-th">Status</div>
          <div></div>
        </div>
        ${reqs.length ? reqs.map(r => {
          const s = PR_STATUS[r.status] || PR_STATUS.pending;
          return `<div class="sp-table-row" style="grid-template-columns:120px 1fr 100px 120px 50px 130px 80px;">
            <div class="sp-table-td"><span style="font-size:11px;font-weight:600;font-family:monospace;color:#111318;">${r.partNum}</span></div>
            <div class="sp-table-td">
              <div style="font-size:13px;color:#111318;font-weight:500;">${r.partDesc}</div>
              ${r.notes ? `<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">${r.notes}</div>` : ''}
            </div>
            <div class="sp-table-td" style="font-size:12px;">${r.fleetName}</div>
            <div class="sp-table-td" style="font-size:12px;">${r.requestedBy}<div style="font-size:10px;color:#9CA3AF;">${r.requestedDate}</div></div>
            <div class="sp-table-td">${r.qty}</div>
            <div class="sp-table-td"><span class="sp-status-pill" style="background:${s.bg};color:${s.color};">${s.label}</span></div>
            <div class="sp-table-td"><button class="sp-btn sp-btn-ghost" onclick="spRespondToRequest('${r.id}')">Respond</button></div>
          </div>`;
        }).join('') : '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No price requests yet.</div>'}
      </div>`;
  }

  function renderContent() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'Post Content';
    const fleetOpts = [
      `<label class="sp-fleet-check"><input type="radio" name="sp-fleet-target" value="all" checked/> All onboarded fleets</label>`,
      ...(_fleets.map(f => `<label class="sp-fleet-check"><input type="radio" name="sp-fleet-target" value="${f.fleetId}"/> ${f.fleetName} only</label>`))
    ].join('');
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">Post Content</div>
      <div class="sp-page-sub">Publish news, bulletins, or product updates to your fleet customers.</div>
      <div class="sp-compose-card">
        <div class="sp-compose-field">
          <label class="sp-compose-label">Content type</label>
          <select class="sp-compose-select" id="sp-ctype">
            <option value="bulletin">Service bulletin</option>
            <option value="news">Product news</option>
            <option value="safety">Safety notice</option>
            <option value="promo">Promotion</option>
          </select>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Title *</label>
          <input class="sp-compose-input" id="sp-ctitle" type="text" placeholder="e.g. SJIII 3219 hydraulic seal kit now available"/>
          <div id="sp-ctitle-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Body *</label>
          <textarea class="sp-compose-textarea" id="sp-cbody" placeholder="Write your content here…"></textarea>
          <div id="sp-cbody-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Post to</label>
          <div class="sp-fleet-check-row">${fleetOpts}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
          <button class="sp-btn sp-btn-ghost" onclick="document.getElementById('sp-ctitle').value='';document.getElementById('sp-cbody').value='';">Clear</button>
          <button class="sp-btn sp-btn-primary" id="sp-publish-btn"><i class="ti ti-send" style="font-size:12px;"></i> Publish</button>
        </div>
        <div id="sp-publish-confirm" style="margin-top:12px;font-size:12px;color:#0F6E56;display:none;">
          <i class="ti ti-circle-check"></i> Content published successfully.
        </div>
      </div>`;

    document.getElementById('sp-publish-btn').addEventListener('click', function() {
      const title = document.getElementById('sp-ctitle').value.trim();
      const body  = document.getElementById('sp-cbody').value.trim();
      document.getElementById('sp-ctitle-err').style.display = title ? 'none' : 'block';
      document.getElementById('sp-cbody-err').style.display  = body  ? 'none' : 'block';
      if (!title || !body) return;

      const target = document.querySelector('input[name="sp-fleet-target"]:checked')?.value || 'all';
      Store.saveCmsArticle({
        id: 'cms-sup-' + Date.now(),
        type: document.getElementById('sp-ctype').value === 'bulletin' ? 'bulletin' : 'bulletin',
        subtype: document.getElementById('sp-ctype').value,
        status: 'published',
        postAs: 'news',
        title,
        body,
        author: _user.displayName,
        supplierId: _supplierId,
        targetFleet: target,
        date: 'Jul 2026',
        priority: 'low',
        locations: [target === 'all' ? 'all' : target],
      });

      document.getElementById('sp-ctitle').value = '';
      document.getElementById('sp-cbody').value = '';
      document.getElementById('sp-publish-confirm').style.display = 'block';
      setTimeout(() => {
        const c = document.getElementById('sp-publish-confirm');
        if (c) c.style.display = 'none';
      }, 3500);
    });
  }

  // ── Manuals ──────────────────────────────────────────────────────────────────

  function renderManuals() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'Manuals & Docs';

    const contentEl = document.getElementById('sp-content');
    contentEl.innerHTML = `
      <div class="man-content-row" style="flex:1;display:flex;overflow:hidden;">
        <div class="man-vendor-panel">
          <div class="mvp-label">Doc Type</div>
          <div id="sp-man-type-list"></div>
        </div>
        <div class="man-main-panel">
          <div class="man-search-area">
            <div class="man-search-wrap">
              <i class="ti ti-search man-search-icon"></i>
              <input class="man-search-input" id="sp-man-search" type="text" placeholder="Search manuals, bulletins, specs…" value="${_spManSearch}"/>
            </div>
          </div>
          <div class="man-machine-chip-row" id="sp-man-machine-chips" style="display:none;"></div>
          <div class="man-content-body">
            <div class="man-section-label">${_supplierName} — Manuals &amp; Documentation</div>
            <div class="docs-grid" id="sp-man-grid"></div>
          </div>
        </div>
      </div>`;

    function typeBackground(type) {
      if (type === 'Service') return 'background:#FCEBEB;color:#A32D2D;';
      if (type === 'Parts') return 'background:#EEEDFE;color:#534AB7;';
      if (type === 'Operator') return 'background:#E6F1FB;color:#185FA5;';
      return 'background:#EAF3DE;color:#3B6D11;';
    }
    function typeIconClass(type) {
      if (type === 'Service') return 'ti-file-text';
      if (type === 'Parts') return 'ti-schema';
      if (type === 'Operator') return 'ti-book';
      return 'ti-file';
    }

    function getMyManuals() {
      return Store.getManuals(_spManSearch).filter(m => m.vendor === _supplierName);
    }

    function getFiltered() {
      return getMyManuals().filter(m => {
        if (_spManType && m.type !== _spManType) return false;
        if (_spManMachine !== 'All' && m.machine !== _spManMachine) return false;
        return true;
      });
    }

    function getMachines() {
      const seen = {};
      const machines = [];
      getMyManuals().filter(m => !_spManType || m.type === _spManType).forEach(m => {
        if (m.machine && !seen[m.machine]) { seen[m.machine] = true; machines.push(m.machine); }
      });
      return machines;
    }

    function renderTypeList() {
      const list = document.getElementById('sp-man-type-list');
      if (!list) return;
      const allMans = getMyManuals();
      const types = ['Service', 'Parts', 'Operator', 'Bulletin'];
      const allItem = `<div class="man-vendor-item ${!_spManType ? 'active' : ''}" data-type="">
        <div class="mvi-icon"><i class="ti ti-books"></i></div>
        <div class="mvi-name">All types</div>
        <div class="mvi-count">${allMans.length}</div>
      </div>`;
      const typeItems = types.map(t => {
        const count = allMans.filter(m => m.type === t).length;
        if (!count) return '';
        const icons = { Service:'ti-file-text', Parts:'ti-schema', Operator:'ti-book', Bulletin:'ti-alert-triangle' };
        return `<div class="man-vendor-item ${_spManType === t ? 'active' : ''}" data-type="${t}">
          <div class="mvi-icon"><i class="ti ${icons[t] || 'ti-file'}"></i></div>
          <div class="mvi-name">${t}</div>
          <div class="mvi-count">${count}</div>
        </div>`;
      }).join('');
      list.innerHTML = allItem + typeItems;
      list.querySelectorAll('.man-vendor-item').forEach(item => {
        item.addEventListener('click', function() {
          _spManType = this.dataset.type || null;
          _spManMachine = 'All';
          renderTypeList();
          renderMachineChips();
          renderGrid();
        });
      });
    }

    function renderMachineChips() {
      const row = document.getElementById('sp-man-machine-chips');
      if (!row) return;
      const machines = getMachines();
      if (machines.length <= 1) { row.style.display = 'none'; return; }
      row.style.display = 'flex';
      const chips = [{ label: 'All', value: 'All' }].concat(machines.map(m => ({ label: m, value: m })));
      row.innerHTML = chips.map(c => `<button class="man-machine-chip ${_spManMachine === c.value ? 'active' : ''}" data-machine="${c.value}">${c.label}</button>`).join('');
      row.querySelectorAll('.man-machine-chip').forEach(chip => {
        chip.addEventListener('click', function() {
          _spManMachine = this.dataset.machine;
          renderMachineChips();
          renderGrid();
        });
      });
    }

    function renderGrid() {
      const grid = document.getElementById('sp-man-grid');
      if (!grid) return;
      const manuals = getFiltered();
      if (!manuals.length) {
        grid.innerHTML = '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No manuals found.</div>';
        return;
      }
      grid.innerHTML = manuals.map(m =>
        `<div class="doc-card" data-manual-id="${m.id}">
          <div class="doc-icon-wrap" style="${typeBackground(m.type)}"><i class="ti ${typeIconClass(m.type)}"></i></div>
          <div class="doc-body">
            <div class="doc-title">${m.title}</div>
            <div class="doc-meta"><span>${m.machine}</span><span class="doc-meta-sep">·</span><span>${m.year}</span><span class="doc-meta-sep">·</span><span>${m.pages} pages</span><span class="doc-meta-sep">·</span><span>${m.size}</span></div>
            <div class="doc-tags"><span class="doc-tag tag-type">${m.type}</span></div>
            <div class="doc-actions">
              <button class="doc-btn doc-btn-primary" onclick="manViewManual('${m.id}')"><i class="ti ti-eye" style="font-size:12px;"></i> View</button>
              <button class="doc-btn doc-btn-ghost" onclick="manDownloadManual('${m.id}')"><i class="ti ti-download" style="font-size:12px;"></i> Download</button>
            </div>
          </div>
        </div>`
      ).join('');
    }

    renderTypeList();
    renderMachineChips();
    renderGrid();

    document.getElementById('sp-man-search').addEventListener('input', function() {
      _spManSearch = this.value;
      renderTypeList();
      renderGrid();
    });
  }

  // ── News ─────────────────────────────────────────────────────────────────────

  function renderNews() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'News & Updates';

    // Supplier's own articles from NEWS_ARTICLES (where poster === supplierName)
    const supplierNewsArticles = (typeof NEWS_ARTICLES !== 'undefined' ? NEWS_ARTICLES : []).filter(n => n.poster === _supplierName);

    // CMS articles published by this supplier
    const cmsArticles = (Store.getCmsArticles ? Store.getCmsArticles('published') : [])
      .filter(a => a.supplierId === _supplierId)
      .map(a => ({
        id: a.id, type: a.subtype || a.type || 'supplier', poster: _supplierName,
        date: a.date || '2026-07-01', dateLabel: a.date || 'Jul 2026',
        priority: a.priority || 'low', title: a.title,
        summary: a.body ? a.body.slice(0, 120) + (a.body.length > 120 ? '…' : '') : '',
        body: a.body || '', tags: a.tags || [],
      }));

    // SmartEquip platform news
    const PLATFORM_NEWS = [
      { id:'sp-pn-01', type:'supplier', poster:'SmartEquip', date:'2026-07-10', dateLabel:'Jul 10, 2026', priority:'low',
        title:'SmartEquip v4.2 — Supplier Analytics Dashboard',
        summary:'Suppliers now have access to a dedicated analytics tab with fleet-level price request tracking and content engagement metrics.',
        body:'The latest SmartEquip release includes a full analytics dashboard for suppliers. Track price request volume, quote conversion rates, average response times, and content engagement across your onboarded fleets. All data is available with period filters (7D, 30D, 90D, 12M) and per-fleet breakdowns.',
        tags:['platform','analytics','update'] },
      { id:'sp-pn-02', type:'supplier', poster:'SmartEquip', date:'2026-06-28', dateLabel:'Jun 28, 2026', priority:'low',
        title:'Price Request response SLA reporting now live',
        summary:'Average response times are now tracked and visible in your analytics. Fleet customers can view supplier responsiveness scores.',
        body:'SmartEquip now tracks average response time to price requests and exposes this data in the supplier analytics dashboard. Fleet customers can also see a supplier responsiveness score when browsing available vendors. This encourages timely quoting and helps fleets make informed purchasing decisions.',
        tags:['platform','sla','response-time'] },
      { id:'sp-pn-03', type:'supplier', poster:'SmartEquip', date:'2026-06-15', dateLabel:'Jun 15, 2026', priority:'low',
        title:'New: Target specific fleets when posting content',
        summary:'You can now select individual fleets as targets when posting bulletins or product news, rather than broadcasting to all.',
        body:'The Post Content feature now supports fleet-specific targeting. When publishing a bulletin, safety notice, or product update, you can choose to send it to all onboarded fleets or restrict visibility to individual fleet accounts. This allows more relevant, targeted communication with your fleet customers.',
        tags:['platform','content','targeting'] },
      { id:'sp-pn-04', type:'supplier', poster:'SmartEquip', date:'2026-05-30', dateLabel:'May 30, 2026', priority:'low',
        title:'3 new fleets added to the SmartEquip network this month',
        summary:'H&E Equipment Services, Maxim Crane Works, and Neff Rental have been added to the SmartEquip network.',
        body:'SmartEquip has onboarded three new fleet customers this month: H&E Equipment Services (multi-region), Maxim Crane Works (Northeast), and Neff Rental (Southeast). As a Skyjack supplier, you may receive price requests from these fleets. Ensure your parts catalog is up to date.',
        tags:['platform','network','fleet'] },
    ];

    const ALL_SP_NEWS = [...cmsArticles, ...supplierNewsArticles, ...PLATFORM_NEWS];
    const TYPE_META = typeof NEWS_TYPE_META !== 'undefined' ? NEWS_TYPE_META : {};
    const PRIORITY_META = typeof NEWS_PRIORITY_META !== 'undefined' ? NEWS_PRIORITY_META : {};

    function typeChip(type) {
      const m = TYPE_META[type] || { label: type, color: '#374151', bg: '#F3F4F6', icon: 'ti-news' };
      return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;background:${m.bg};color:${m.color};border-radius:4px;padding:2px 7px;"><i class="ti ${m.icon}" style="font-size:11px;"></i>${m.label}</span>`;
    }
    function priorityChip(priority) {
      const p = PRIORITY_META[priority] || { label: priority, color: '#6B7280', bg: '#F9FAFB' };
      return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.5px;background:${p.bg};color:${p.color};border-radius:4px;padding:2px 7px;"><span style="width:6px;height:6px;border-radius:50%;background:${p.color};display:inline-block;flex-shrink:0;"></span>${p.label}</span>`;
    }

    function filteredNews() {
      let items = ALL_SP_NEWS.slice();
      if (_spNewsShowSaved) items = items.filter(n => _spNewsSaved.has(n.id));
      if (_spNewsType !== 'all') items = items.filter(n => n.type === _spNewsType);
      if (_spNewsPoster !== 'all') items = items.filter(n => n.poster === _spNewsPoster);
      if (_spNewsPriority !== 'all') items = items.filter(n => n.priority === _spNewsPriority);
      if (_spNewsSearch.trim()) {
        const q = _spNewsSearch.toLowerCase();
        items = items.filter(n =>
          n.title.toLowerCase().includes(q) ||
          (n.summary || '').toLowerCase().includes(q) ||
          (n.tags || []).some(t => t.includes(q)) ||
          (n.poster || '').toLowerCase().includes(q)
        );
      }
      items.sort((a, b) => _spNewsSortDir === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
      return items;
    }

    function renderNewsCards() {
      const items = filteredNews();
      const grid = document.getElementById('sp-news-grid');
      if (!grid) return;
      const countEl = document.getElementById('sp-news-count');
      if (countEl) countEl.textContent = `${items.length} article${items.length !== 1 ? 's' : ''}`;
      if (!items.length) {
        grid.innerHTML = '<div style="padding:32px 0;text-align:center;color:#9CA3AF;font-size:13px;">No articles match your filters.</div>';
        return;
      }
      grid.innerHTML = items.map(n => {
        const m = TYPE_META[n.type] || { bg: '#F3F4F6', color: '#374151', icon: 'ti-news' };
        const saved = _spNewsSaved.has(n.id);
        const reported = _spNewsReported.has(n.id);
        return `<div class="news-card" id="spnc-${n.id}">
          <div class="nc-top" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">
            <div class="nc-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
            <div class="nc-meta">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">${typeChip(n.type)}${priorityChip(n.priority)}</div>
              <span class="nc-poster">${n.poster}</span>
            </div>
            <span class="nc-date">${n.dateLabel}</span>
          </div>
          <div class="nc-title" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${n.title}</div>
          <div class="nc-summary" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${n.summary}</div>
          <div class="nc-tags" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${(n.tags||[]).map(t => `<span class="nc-tag">${t}</span>`).join('')}</div>
          <div class="nc-actions">
            <button class="nc-action-btn ${saved ? 'nc-saved' : ''}" onclick="event.stopPropagation();spNewsSave('${n.id}')" title="${saved ? 'Remove from saved' : 'Save article'}">
              <i class="ti ${saved ? 'ti-bookmark-filled' : 'ti-bookmark'}"></i> ${saved ? 'Saved' : 'Save'}
            </button>
            <button class="nc-action-btn nc-report-btn ${reported ? 'nc-reported' : ''}" onclick="event.stopPropagation();spNewsReport('${n.id}')" title="Report a problem">
              <i class="ti ti-flag"></i> ${reported ? 'Reported' : 'Report'}
            </button>
          </div>
        </div>`;
      }).join('');
    }

    window.spNewsSave = function(id) {
      if (_spNewsSaved.has(id)) { _spNewsSaved.delete(id); } else { _spNewsSaved.add(id); }
      try { localStorage.setItem('se-news-saved', JSON.stringify([..._spNewsSaved])); } catch(e) {}
      renderNewsCards();
      const lbl = document.getElementById('sp-nfp-saved-count');
      if (lbl) lbl.textContent = _spNewsSaved.size > 0 ? ` (${_spNewsSaved.size})` : '';
    };

    window.spNewsReport = function(id) {
      if (_spNewsReported.has(id)) {
        Modal.show({ title: 'Already reported', body: '<p style="font-size:13px;color:#3A3D4A;">You have already submitted a report for this article.</p>', actions: [{ label: 'OK', onClick: () => Modal.close() }] });
        return;
      }
      const n = ALL_SP_NEWS.find(x => x.id === id);
      Modal.show({
        title: 'Report a problem',
        body: `<p style="font-size:13px;color:#7A7F8E;margin-bottom:16px;">Let us know what's wrong with "<strong style="color:#111318;">${n ? n.title.slice(0,60)+'…' : 'this article'}</strong>"</p>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
            ${['Inaccurate or incorrect information','Outdated — information no longer applies','Duplicate post','Inappropriate or irrelevant content','Other'].map((reason, i) => `
              <label style="display:flex;align-items:center;gap:9px;padding:9px 12px;border:0.5px solid #E2DDD8;border-radius:8px;cursor:pointer;font-size:13px;color:#3A3D4A;">
                <input type="radio" name="sp-report-reason" value="${reason}" ${i===0?'checked':''} style="accent-color:#F5A623;"/> ${reason}
              </label>`).join('')}
          </div>
          <textarea id="sp-report-notes" placeholder="Additional notes (optional)" style="width:100%;height:72px;padding:9px 12px;border:0.5px solid #E2DDD8;border-radius:8px;font-size:13px;font-family:inherit;color:#111318;resize:none;outline:none;"></textarea>`,
        actions: [
          { label: 'Cancel', onClick: () => Modal.close() },
          { label: 'Submit report', onClick: () => {
            const reason = document.querySelector('input[name="sp-report-reason"]:checked')?.value || 'Other';
            _spNewsReported.add(id);
            try { localStorage.setItem('se-news-reported', JSON.stringify([..._spNewsReported])); } catch(e) {}
            renderNewsCards();
            Modal.close();
            setTimeout(() => Modal.show({
              title: 'Report submitted',
              body: `<p style="font-size:13px;color:#3A3D4A;line-height:1.7;">Thanks for flagging this. Your report has been sent to the content team.<br><span style="color:#9CA3AF;font-size:12px;">Reason: ${reason}</span></p>`,
              actions: [{ label: 'Done', onClick: () => Modal.close() }]
            }), 80);
          }}
        ]
      });
    };

    const SP_NEWS_POSTERS = ['all', _supplierName, 'SmartEquip'];
    const posterLabels = { all: 'All sources', [_supplierName]: _supplierName, 'SmartEquip': 'SmartEquip' };

    const contentEl = document.getElementById('sp-content');
    contentEl.innerHTML = `
      <div class="news-shell">
        <div class="news-filter-panel">
          <div class="nfp-section">
            <div class="nfp-item ${_spNewsShowSaved ? 'active' : ''}" id="sp-nfp-saved-filter" onclick="spNewsFilter('saved','')">
              <i class="ti ti-bookmark" style="font-size:13px;"></i> Saved<span id="sp-nfp-saved-count">${_spNewsSaved.size > 0 ? ' (' + _spNewsSaved.size + ')' : ''}</span>
            </div>
          </div>
          <div class="nfp-section">
            <div class="nfp-label">Priority</div>
            <div class="nfp-item ${_spNewsPriority==='all'?'active':''}" id="sp-nfpr-all" onclick="spNewsFilter('priority','all')"><div class="nfp-item-dot" style="background:#D1D5DB;"></div>All priorities</div>
            <div class="nfp-item ${_spNewsPriority==='critical'?'active':''}" id="sp-nfpr-critical" onclick="spNewsFilter('priority','critical')"><div class="nfp-item-dot" style="background:#B91C1C;"></div>Critical</div>
            <div class="nfp-item ${_spNewsPriority==='high'?'active':''}" id="sp-nfpr-high" onclick="spNewsFilter('priority','high')"><div class="nfp-item-dot" style="background:#C2410C;"></div>High</div>
            <div class="nfp-item ${_spNewsPriority==='medium'?'active':''}" id="sp-nfpr-medium" onclick="spNewsFilter('priority','medium')"><div class="nfp-item-dot" style="background:#B45309;"></div>Medium</div>
            <div class="nfp-item ${_spNewsPriority==='low'?'active':''}" id="sp-nfpr-low" onclick="spNewsFilter('priority','low')"><div class="nfp-item-dot" style="background:#6B7280;"></div>Low</div>
          </div>
          <div class="nfp-section">
            <div class="nfp-label">Category</div>
            <div class="nfp-item ${_spNewsType==='all'?'active':''}" id="sp-nft-all" onclick="spNewsFilter('type','all')"><div class="nfp-item-dot" style="background:#D1D5DB;"></div>All types</div>
            <div class="nfp-item ${_spNewsType==='bulletin'?'active':''}" id="sp-nft-bulletin" onclick="spNewsFilter('type','bulletin')"><div class="nfp-item-dot" style="background:#F5A623;"></div>Service Bulletin</div>
            <div class="nfp-item ${_spNewsType==='supplier'?'active':''}" id="sp-nft-supplier" onclick="spNewsFilter('type','supplier')"><div class="nfp-item-dot" style="background:#8B5CF6;"></div>Supplier / Platform</div>
            <div class="nfp-item ${_spNewsType==='safety'?'active':''}" id="sp-nft-safety" onclick="spNewsFilter('type','safety')"><div class="nfp-item-dot" style="background:#EF4444;"></div>Safety Alert</div>
          </div>
          <div class="nfp-section">
            <div class="nfp-label">Posted by</div>
            ${SP_NEWS_POSTERS.map(p => `<div class="nfp-poster ${_spNewsPoster===p?'active':''}" id="sp-nfp-${p.replace(/\s+/g,'-').toLowerCase()}" onclick="spNewsFilter('poster','${p}')">${posterLabels[p]||p}</div>`).join('')}
          </div>
        </div>
        <div class="news-main">
          <div class="news-toolbar">
            <div class="news-search-wrap">
              <i class="ti ti-search news-search-icon"></i>
              <input class="news-search-input" id="sp-news-search" type="text" placeholder="Search by keyword, tag, or title…" value="${_spNewsSearch}"/>
            </div>
            <button class="news-sort-btn" onclick="spNewsToggleSort()" id="sp-news-sort-btn">
              <i class="ti ti-arrow-${_spNewsSortDir==='desc'?'down':'up'}"></i> ${_spNewsSortDir==='desc'?'Newest':'Oldest'} first
            </button>
            <span class="news-count-label" id="sp-news-count">${ALL_SP_NEWS.length} articles</span>
          </div>
          <div class="news-body">
            <div id="sp-news-grid"></div>
          </div>
        </div>
      </div>`;

    renderNewsCards();

    document.getElementById('sp-news-search').addEventListener('input', function() {
      _spNewsSearch = this.value;
      renderNewsCards();
    });

    window.spNewsFilter = function(dimension, value) {
      if (dimension === 'saved') {
        _spNewsShowSaved = !_spNewsShowSaved;
        document.getElementById('sp-nfp-saved-filter')?.classList.toggle('active', _spNewsShowSaved);
      } else if (dimension === 'priority') {
        _spNewsPriority = value;
        document.querySelectorAll('[id^="sp-nfpr-"]').forEach(e => e.classList.remove('active'));
        document.getElementById(`sp-nfpr-${value}`)?.classList.add('active');
      } else if (dimension === 'type') {
        _spNewsType = value;
        document.querySelectorAll('[id^="sp-nft-"]').forEach(e => e.classList.remove('active'));
        document.getElementById(`sp-nft-${value}`)?.classList.add('active');
      } else {
        _spNewsPoster = value;
        document.querySelectorAll('[id^="sp-nfp-"]').forEach(e => e.classList.remove('active'));
        document.getElementById(`sp-nfp-${value.replace(/\s+/g,'-').toLowerCase()}`)?.classList.add('active');
      }
      renderNewsCards();
    };

    window.spNewsToggleSort = function() {
      _spNewsSortDir = _spNewsSortDir === 'desc' ? 'asc' : 'desc';
      const btn = document.getElementById('sp-news-sort-btn');
      if (btn) btn.innerHTML = `<i class="ti ti-arrow-${_spNewsSortDir==='desc'?'down':'up'}"></i> ${_spNewsSortDir==='desc'?'Newest':'Oldest'} first`;
      renderNewsCards();
    };
  }

  // ── Analytics ─────────────────────────────────────────────────────────────────

  function renderAnalytics() {
    const titleEl = document.getElementById('sp-topbar-title');
    if (titleEl) titleEl.textContent = 'Analytics';

    const contentEl = document.getElementById('sp-content');
    const FLEET_COLORS = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];

    contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
        <div class="an-filter-bar">
          <span class="an-filter-label">Period</span>
          <div class="an-period-pills">
            ${['7D','30D','90D','12M'].map(p => `<div class="an-period-pill ${_spPeriod===p?'active':''}" onclick="spAnSetPeriod('${p}')">${p}</div>`).join('')}
          </div>
          <div class="an-filter-sep"></div>
          <span class="an-filter-label">Fleet</span>
          <div class="an-loc-pills" id="sp-an-fleet-pills">
            ${renderFleetPills()}
          </div>
        </div>
        <div class="an-content" id="sp-an-body"></div>
      </div>`;

    renderSpAnalyticsContent();
  }

  function renderFleetPills() {
    const FLEET_COLORS = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];
    const allActive = !_spFleetId;
    return `<div class="an-loc-pill ${allActive?'active':''}" onclick="spAnSetFleet(null)" style="${allActive?'background:#111318;color:#FFFFFF;border-color:#111318;':''}">
        <i class="ti ti-stack-2" style="font-size:11px;"></i> All fleets
      </div>
      ${_fleets.map((f, i) => {
        const active = _spFleetId === f.fleetId;
        return `<div class="an-loc-pill ${active?'active':''}" onclick="spAnSetFleet('${f.fleetId}')" style="${active?`background:#FAEEDA;color:#854F0B;border-color:#F5C97A;`:''}">
          <div class="an-loc-dot" style="background:${FLEET_COLORS[i%FLEET_COLORS.length]};"></div>
          ${f.fleetName.split(' ')[0]}
        </div>`;
      }).join('')}`;
  }

  window.spAnSetPeriod = function(p) {
    _spPeriod = p;
    document.querySelectorAll('.an-period-pill').forEach(el => {
      el.classList.toggle('active', el.textContent.trim() === p);
    });
    renderSpAnalyticsContent();
  };

  window.spAnSetFleet = function(fleetId) {
    _spFleetId = fleetId;
    const pillsEl = document.getElementById('sp-an-fleet-pills');
    if (pillsEl) pillsEl.innerHTML = renderFleetPills();
    renderSpAnalyticsContent();
  };

  function renderSpAnalyticsContent() {
    const body = document.getElementById('sp-an-body');
    if (!body) return;

    const allReqs = Store.getPriceRequests(_supplierId);
    const filteredReqs = _spFleetId ? allReqs.filter(r => r.fleetId === _spFleetId) : allReqs;
    const filteredFleets = _spFleetId ? _fleets.filter(f => f.fleetId === _spFleetId) : _fleets;
    const myArticles = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).filter(a => a.supplierId === _supplierId);

    // KPI calculations
    const totalReqs = filteredReqs.length;
    const quoted = filteredReqs.filter(r => r.status === 'quoted').length;
    const pending = filteredReqs.filter(r => r.status === 'pending').length;
    const convRate = totalReqs > 0 ? Math.round(quoted / totalReqs * 100) : 0;
    const periodMult = { '7D':0.065, '30D':0.28, '90D':0.78, '12M':1 }[_spPeriod] || 0.28;
    const avgRespTime = (1.2 + Math.random() * 0.4).toFixed(1);
    const activeFleetCount = filteredFleets.length;

    // Requests trend data
    const TREND_DATA = {
      '7D':  { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values:[2,4,3,5,3,1,1] },
      '30D': { labels:['Wk 1','Wk 2','Wk 3','Wk 4'], values:[7,11,9,12] },
      '90D': { labels:['May','Jun','Jul'], values:[28,35,31] },
      '12M': { labels:['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'], values:[18,22,20,25,19,24,28,30,27,35,31,28] },
    };
    const trend = TREND_DATA[_spPeriod] || TREND_DATA['30D'];
    const scaledValues = trend.values.map(v => Math.round(v * (filteredFleets.length / Math.max(_fleets.length, 1))));
    const maxTrendVal = Math.max(...scaledValues, 1);

    const trendBars = trend.labels.map((lbl, i) => {
      const h = Math.max(4, Math.round((scaledValues[i] / maxTrendVal) * 90));
      const isLast = i === trend.labels.length - 1;
      return `<div class="an-bar-col">
        <div class="an-bar-amt">${isLast || trend.labels.length <= 5 ? scaledValues[i] : ''}</div>
        <div class="an-bar-seg" style="height:${h}px;background:${isLast?'#F5A623':'#E0DBD5'};"></div>
        <div class="an-bar-lbl">${lbl}</div>
      </div>`;
    }).join('');

    // By fleet breakdown
    const FLEET_COLORS = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];
    const byFleetData = _fleets.map((f, i) => {
      const fReqs = allReqs.filter(r => r.fleetId === f.fleetId);
      return { name: f.fleetName, total: fReqs.length, quoted: fReqs.filter(r=>r.status==='quoted').length,
               pending: fReqs.filter(r=>r.status==='pending').length, color: FLEET_COLORS[i%FLEET_COLORS.length] };
    }).filter(f => f.total > 0).sort((a, b) => b.total - a.total);
    const maxFleetReqs = Math.max(...byFleetData.map(f => f.total), 1);

    // Most requested parts
    const partCounts = {};
    filteredReqs.forEach(r => {
      if (!partCounts[r.partNum]) partCounts[r.partNum] = { desc: r.partDesc, pn: r.partNum, qty: 0 };
      partCounts[r.partNum].qty++;
    });
    const topParts = Object.values(partCounts).sort((a, b) => b.qty - a.qty).slice(0, 6);
    const maxPartQty = Math.max(...topParts.map(p => p.qty), 1);

    // Content by type
    const contentByType = [
      { type: 'bulletin', label: 'Service Bulletins', color: '#F5A623' },
      { type: 'news', label: 'Product News', color: '#185FA5' },
      { type: 'safety', label: 'Safety Notices', color: '#A32D2D' },
      { type: 'promo', label: 'Promotions', color: '#3B6D11' },
    ].map(t => ({ ...t, count: myArticles.filter(a => a.subtype === t.type || a.type === t.type).length }))
     .filter(t => t.count > 0);
    const maxContent = Math.max(...contentByType.map(t => t.count), 1);

    // Insights
    const convRateDelta = convRate - 58;
    const topFleetReq = byFleetData[0];
    const INSIGHTS = [
      {
        icon: convRate >= 60 ? 'ti-trending-up' : 'ti-trending-down',
        iconBg: convRate >= 60 ? '#F0FDF4' : '#FEF2F2',
        iconColor: convRate >= 60 ? '#3B6D11' : '#A32D2D',
        title: `${convRate}% quote conversion rate`,
        body: convRate >= 60
          ? `Your quote-to-request conversion is above the SmartEquip supplier average of 58%. Fast response times and competitive pricing are driving wins.`
          : `Your conversion rate is ${Math.abs(convRateDelta)}% below the supplier average of 58%. Consider reviewing pricing on pending requests and responding faster to pending items.`,
        tag: convRate >= 60 ? 'Above average' : 'Below average',
        tagBg: convRate >= 60 ? '#F0FDF4' : '#FEF2F2',
        tagColor: convRate >= 60 ? '#3B6D11' : '#A32D2D',
      },
      {
        icon: pending > 3 ? 'ti-alert-triangle' : 'ti-circle-check',
        iconBg: pending > 3 ? '#FFF8EC' : '#F0FDF4',
        iconColor: pending > 3 ? '#854F0B' : '#3B6D11',
        title: pending > 0 ? `${pending} request${pending !== 1 ? 's' : ''} awaiting response` : 'All requests responded to',
        body: pending > 0
          ? `${pending} price request${pending !== 1 ? 's are' : ' is'} awaiting your response. Fleets expect a reply within 24 hours — late responses can affect your responsiveness score.`
          : 'Great work — you\'re fully caught up on price requests. Your responsiveness score is strong.',
        tag: pending > 3 ? 'Action needed' : (pending > 0 ? 'In progress' : 'Up to date'),
        tagBg: pending > 3 ? '#FFF8EC' : (pending > 0 ? '#EDE9FE' : '#F0FDF4'),
        tagColor: pending > 3 ? '#854F0B' : (pending > 0 ? '#534AB7' : '#3B6D11'),
      },
      {
        icon: 'ti-building-warehouse',
        iconBg: '#EDE9FE',
        iconColor: '#534AB7',
        title: topFleetReq ? `${topFleetReq.name} is your most active fleet` : `${activeFleetCount} active fleet${activeFleetCount !== 1 ? 's' : ''}`,
        body: topFleetReq
          ? `${topFleetReq.name} has submitted ${topFleetReq.total} price request${topFleetReq.total !== 1 ? 's' : ''}, making them your highest-volume fleet customer. ${topFleetReq.quoted > 0 ? `${topFleetReq.quoted} have been quoted.` : 'Consider prioritising their open requests.'}`
          : `You have ${activeFleetCount} onboarded fleet${activeFleetCount !== 1 ? 's' : ''} with no requests yet. Reach out with product updates to drive engagement.`,
        tag: 'Fleet insight',
        tagBg: '#EDE9FE',
        tagColor: '#534AB7',
      },
    ];

    body.innerHTML = `
    <!-- KPI strip -->
    <div class="an-kpi-row">
      <div class="an-kpi">
        <div class="an-kpi-val">${totalReqs}</div>
        <div class="an-kpi-label">Price requests · ${_spPeriod}</div>
        <div class="an-kpi-delta neutral">${pending} pending response</div>
      </div>
      <div class="an-kpi">
        <div class="an-kpi-val">${quoted}</div>
        <div class="an-kpi-label">Quotes sent</div>
        <div class="an-kpi-delta neutral">${totalReqs - quoted - pending} closed / declined</div>
      </div>
      <div class="an-kpi">
        <div class="an-kpi-val">${convRate}%</div>
        <div class="an-kpi-label">Quote conversion rate</div>
        <div class="an-kpi-delta ${convRate >= 58 ? 'up' : 'down'}">${convRate >= 58 ? '↑' : '↓'} vs 58% avg</div>
      </div>
      <div class="an-kpi">
        <div class="an-kpi-val">${avgRespTime}d</div>
        <div class="an-kpi-label">Avg response time</div>
        <div class="an-kpi-delta ${parseFloat(avgRespTime) <= 1.5 ? 'up' : 'down'}">${parseFloat(avgRespTime) <= 1.5 ? 'Within SLA' : 'Exceeds SLA'}</div>
      </div>
      <div class="an-kpi">
        <div class="an-kpi-val">${myArticles.length}</div>
        <div class="an-kpi-label">Content published</div>
        <div class="an-kpi-delta neutral">${contentByType.length} type${contentByType.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="an-kpi">
        <div class="an-kpi-val">${activeFleetCount}</div>
        <div class="an-kpi-label">Active fleets</div>
        <div class="an-kpi-delta neutral">${_fleets.length} total onboarded</div>
      </div>
    </div>

    <!-- Insights -->
    <div class="an-grid-insight" style="margin-bottom:14px;">
      ${INSIGHTS.map(ins => `
        <div class="an-insight">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div class="an-insight-icon" style="background:${ins.iconBg};color:${ins.iconColor};"><i class="ti ${ins.icon}"></i></div>
            <div style="flex:1;min-width:0;">
              <div class="an-insight-title">${ins.title}</div>
              <div class="an-insight-body">${ins.body}</div>
              <div class="an-insight-tag" style="background:${ins.tagBg};color:${ins.tagColor};">${ins.tag}</div>
            </div>
          </div>
        </div>`).join('')}
    </div>

    <!-- Trend + Request status -->
    <div class="an-grid-3" style="margin-bottom:14px;">
      <div class="an-card" style="grid-column:1/2;">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-trending-up" style="font-size:13px;color:#F5A623;"></i> Price request trend</div>
          <span class="an-card-sub">${_spFleetId ? filteredFleets[0]?.fleetName : 'All fleets'} · ${_spPeriod}</span>
        </div>
        <div class="an-card-body">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
            <div style="font-size:20px;font-weight:700;color:#111318;letter-spacing:-0.5px;">${scaledValues.reduce((a,b)=>a+b,0)} requests</div>
            <div style="font-size:11px;color:#9CA3AF;">${_spPeriod} period</div>
          </div>
          <div class="an-trend-wrap">${trendBars}</div>
        </div>
      </div>

      <div class="an-card">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-tag" style="font-size:13px;color:#9CA3AF;"></i> Request status</div>
        </div>
        <div class="an-card-body" style="padding:10px 16px;">
          <div class="an-wo-stat">
            <span style="font-size:12px;color:#5A5F6E;">Quoted</span>
            <span class="an-wo-badge" style="background:#E1F5EE;color:#0F6E56;">${quoted}</span>
          </div>
          <div class="an-wo-stat">
            <span style="font-size:12px;color:#5A5F6E;">Pending response</span>
            <span class="an-wo-badge" style="background:#FAEEDA;color:#854F0B;">${pending}</span>
          </div>
          <div class="an-wo-stat">
            <span style="font-size:12px;color:#5A5F6E;">More info needed</span>
            <span class="an-wo-badge" style="background:#EEEDFE;color:#534AB7;">${filteredReqs.filter(r=>r.status==='needs_info').length}</span>
          </div>
          <div class="an-wo-stat">
            <span style="font-size:12px;color:#5A5F6E;">Not available</span>
            <span class="an-wo-badge" style="background:#F0ECE8;color:#5A5F6E;">${filteredReqs.filter(r=>r.status==='rejected').length}</span>
          </div>
          <div style="margin-top:12px;padding-top:10px;border-top:0.5px solid #F0ECE8;">
            <div style="height:10px;background:#F0ECE8;border-radius:5px;overflow:hidden;display:flex;">
              ${totalReqs > 0 ? `
              <div style="width:${Math.round(quoted/totalReqs*100)}%;background:#0F6E56;"></div>
              <div style="width:${Math.round(pending/totalReqs*100)}%;background:#F5A623;"></div>
              <div style="width:${Math.round(filteredReqs.filter(r=>r.status==='needs_info').length/totalReqs*100)}%;background:#534AB7;"></div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- By fleet + Most requested parts -->
    <div class="an-grid-2" style="margin-bottom:14px;">
      <div class="an-card">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-building-warehouse" style="font-size:13px;color:#9CA3AF;"></i> Requests by fleet</div>
          <span class="an-card-sub">${_spPeriod}</span>
        </div>
        <div class="an-card-body">
          ${byFleetData.length ? byFleetData.map(f => `
            <div class="an-mech-row">
              <div class="an-avatar" style="background:${f.color};color:#FFFFFF;font-size:8px;">${f.name.slice(0,2).toUpperCase()}</div>
              <div class="an-name" style="min-width:100px;">${f.name.split(' ')[0]}</div>
              ${spBar(f.total / maxFleetReqs, f.color)}
              <div class="an-cnt">${f.quoted}/${f.total} quoted</div>
              <div class="an-val">${f.total}</div>
            </div>`).join('')
          : '<div class="an-empty">No requests in this period.</div>'}
        </div>
      </div>

      <div class="an-card">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-repeat" style="font-size:13px;color:#9CA3AF;"></i> Most requested parts</div>
          <span class="an-card-sub">By request count</span>
        </div>
        <div class="an-card-body">
          ${topParts.length ? topParts.map((p, i) => `
            <div class="an-part-row">
              <div class="an-rank">${i+1}</div>
              <div class="an-part-info">
                <div class="an-part-desc">${p.desc}</div>
                <div class="an-part-meta">${p.pn}</div>
                <div style="margin-top:3px;height:4px;background:#F5F2EE;border-radius:2px;overflow:hidden;">
                  <div style="height:100%;width:${Math.round(p.qty/maxPartQty*100)}%;background:#534AB7;border-radius:2px;"></div>
                </div>
              </div>
              <div class="an-part-qty">${p.qty}×</div>
            </div>`).join('')
          : '<div class="an-empty">No parts data yet.</div>'}
        </div>
      </div>
    </div>

    <!-- Content breakdown -->
    <div class="an-grid-2" style="margin-bottom:14px;">
      <div class="an-card">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-pencil" style="font-size:13px;color:#9CA3AF;"></i> Content by type</div>
          <span class="an-card-sub">${myArticles.length} total published</span>
        </div>
        <div class="an-card-body">
          ${contentByType.length ? contentByType.map(t => `
            <div class="an-cat-row">
              <div style="width:9px;height:9px;border-radius:2px;background:${t.color};flex-shrink:0;"></div>
              <div class="an-cat-name">${t.label}</div>
              ${spBar(t.count / maxContent, t.color)}
              <div class="an-cat-val">${t.count}</div>
            </div>`).join('')
          : '<div class="an-empty">No content published yet. Use Post Content to get started.</div>'}
        </div>
      </div>

      <div class="an-card">
        <div class="an-card-hdr">
          <div class="an-card-title"><i class="ti ti-users" style="font-size:13px;color:#9CA3AF;"></i> Fleet engagement</div>
          <span class="an-card-sub">Onboarded fleets</span>
        </div>
        <div class="an-card-body">
          ${_fleets.map((f, i) => {
            const fReqs = allReqs.filter(r => r.fleetId === f.fleetId);
            const fQuoted = fReqs.filter(r => r.status === 'quoted').length;
            return `<div class="an-mech-row">
              <div class="an-avatar" style="background:${FLEET_COLORS[i%FLEET_COLORS.length]};color:#FFFFFF;font-size:8px;">${f.logoText}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:12px;font-weight:500;color:#111318;">${f.fleetName}</div>
                <div style="font-size:10px;color:#9CA3AF;">${f.city} · ${fReqs.length} requests</div>
              </div>
              <div style="font-size:11px;font-weight:600;color:#0F6E56;">${fQuoted} quoted</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }

  // ── Impersonation ────────────────────────────────────────────────────────────

  window.spImpersonate = function(fleetId, fleetName) {
    Router.navigate('parts-search', { supplierId: _supplierId, impersonating: true, impersonatingFleet: fleetName });
  };

  // ── Respond to price request ─────────────────────────────────────────────────

  window.spRespondToRequest = function(reqId) {
    const reqs = Store.getPriceRequests(_supplierId);
    const r = reqs.find(x => x.id === reqId);
    if (!r) return;

    Modal.show({
      title: 'Respond to Price Request',
      body: `
        <div style="background:#F5F2EE;border-radius:8px;padding:12px 14px;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Request details</div>
          <div style="font-size:13px;font-weight:600;color:#111318;">${r.partDesc}</div>
          <div style="font-size:12px;color:#7A7F8E;margin-top:3px;">${r.partNum} · Qty ${r.qty} · ${r.fleetName}</div>
          ${r.notes ? `<div style="font-size:12px;color:#7A7F8E;margin-top:3px;font-style:italic;">"${r.notes}"</div>` : ''}
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Response type</label>
          <select class="modal-form-select" id="sp-resp-type">
            <option value="quoted">Provide a price</option>
            <option value="needs_info">Request more information</option>
            <option value="rejected">Item not available</option>
          </select>
        </div>
        <div class="modal-form-field" id="sp-price-row">
          <label class="modal-form-label">Unit price (USD)</label>
          <input class="modal-form-input" id="sp-resp-price" type="number" min="0" step="0.01" placeholder="e.g. 149.00"/>
          <div id="sp-resp-price-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required when providing a price</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label" id="sp-msg-label">Message <span style="font-weight:400;color:#9CA3AF;">(optional)</span></label>
          <textarea class="modal-form-input" id="sp-resp-msg" style="height:72px;resize:none;padding-top:8px;" placeholder="Add lead time, notes, or follow-up questions…"></textarea>
        </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Send Response', primary: true, onClick: () => {
            const type    = document.getElementById('sp-resp-type').value;
            const priceEl = document.getElementById('sp-resp-price');
            const msg     = document.getElementById('sp-resp-msg').value.trim();
            const price   = parseFloat(priceEl?.value);

            if (type === 'quoted' && (!priceEl.value || isNaN(price) || price <= 0)) {
              document.getElementById('sp-resp-price-err').style.display = 'block';
              return;
            }
            Store.respondToPriceRequest(reqId, {
              status: type,
              price: type === 'quoted' ? price : null,
              message: msg,
            });
            Modal.close();
            renderRequests();
          }
        }
      ]
    });

    setTimeout(() => {
      const typeEl = document.getElementById('sp-resp-type');
      const priceRow = document.getElementById('sp-price-row');
      const msgLabel = document.getElementById('sp-msg-label');
      if (!typeEl) return;

      function syncFields() {
        const t = typeEl.value;
        priceRow.style.display = t === 'quoted' ? 'block' : 'none';
        if (t === 'needs_info') {
          msgLabel.innerHTML = 'Message to fleet <span style="font-weight:700;color:#A32D2D;">*</span>';
        } else if (t === 'rejected') {
          msgLabel.innerHTML = 'Reason <span style="font-weight:400;color:#9CA3AF;">(optional)</span>';
        } else {
          msgLabel.innerHTML = 'Message <span style="font-weight:400;color:#9CA3AF;">(optional)</span>';
        }
      }
      syncFields();
      typeEl.addEventListener('change', syncFields);
    }, 50);
  };

  // ── Tab switching ─────────────────────────────────────────────────────────────

  function setTab(tab) {
    _activeTab = tab;
    el.querySelectorAll('.sb-item[data-sp-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.spTab === tab);
    });

    const contentEl = document.getElementById('sp-content');
    const fullHeight = ['manuals', 'news', 'analytics'].includes(tab);
    if (fullHeight) {
      contentEl.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;padding:0;';
    } else {
      contentEl.style.cssText = 'flex:1;overflow-y:auto;padding:28px;';
    }

    if (tab === 'home')      renderHome();
    if (tab === 'fleets')    renderFleets();
    if (tab === 'requests')  renderRequests();
    if (tab === 'content')   renderContent();
    if (tab === 'manuals')   renderManuals();
    if (tab === 'news')      renderNews();
    if (tab === 'analytics') renderAnalytics();
  }

  el.querySelectorAll('.sb-item[data-sp-tab]').forEach(item => {
    item.addEventListener('click', () => setTab(item.dataset.spTab));
  });

  setTab('home');
}
