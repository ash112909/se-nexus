// ── Analytics page state ───────────────────────────────────────────────────
let _anPeriod = '30D';
let _anLocs = null; // null = all; Set otherwise

function render_analytics(el) {
  const _user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  if (!_user || _user.role !== 'supervisor') {
    el.innerHTML = `<div class="shell">${buildSidebar('analytics')}<div class="main"><div style="padding:60px;text-align:center;color:#9CA3AF;font-size:14px;"><i class="ti ti-lock" style="font-size:32px;display:block;margin-bottom:12px;"></i>You don't have access to Analytics.</div></div></div>`;
    return;
  }

  const locations = Store.getLocations();
  if (!_anLocs) _anLocs = new Set(locations.map(l => l.id));

  el.innerHTML = `
<style>
/* ── Shell & layout ───── */
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
.an-loc-dot { width:6px; height:6px; border-radius:50%; }
.an-content { flex:1; padding:20px 24px 40px; overflow-y:auto; }
/* ── KPI strip ───── */
.an-kpi-row { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-bottom:18px; }
.an-kpi { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px 16px; }
.an-kpi-val { font-size:22px; font-weight:700; color:#111318; letter-spacing:-0.5px; line-height:1.1; }
.an-kpi-label { font-size:11px; color:#9CA3AF; margin-top:3px; line-height:1.3; }
.an-kpi-delta { font-size:11px; margin-top:4px; font-weight:600; }
.an-kpi-delta.up { color:#3B6D11; } .an-kpi-delta.down { color:#A32D2D; } .an-kpi-delta.neutral { color:#9CA3AF; }
/* ── Cards ───── */
.an-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.an-grid-3 { display:grid; grid-template-columns:2fr 1fr 1fr; gap:14px; margin-bottom:14px; }
.an-grid-insight { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
.an-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; overflow:hidden; }
.an-card-hdr { padding:11px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; justify-content:space-between; }
.an-card-title { font-size:12px; font-weight:600; color:#111318; display:flex; align-items:center; gap:6px; }
.an-card-sub { font-size:10px; color:#9CA3AF; }
.an-card-body { padding:14px 16px; }
/* ── Trend chart ───── */
.an-trend-wrap { display:flex; align-items:flex-end; gap:5px; height:100px; }
.an-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:default; }
.an-bar-col:hover .an-bar-seg { opacity:0.8; }
.an-bar-seg { width:100%; border-radius:3px 3px 0 0; transition:height 0.3s; min-height:2px; }
.an-bar-lbl { font-size:9px; color:#9CA3AF; }
.an-bar-amt { font-size:8px; font-weight:600; color:#5A5F6E; }
/* ── Mechanic table ───── */
.an-mech-row { display:flex; align-items:center; gap:9px; margin-bottom:9px; }
.an-mech-row:last-child { margin-bottom:0; }
.an-avatar { width:26px; height:26px; border-radius:50%; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.an-name { font-size:12px; font-weight:500; color:#111318; min-width:64px; }
.an-bar-inline { flex:1; height:6px; background:#F5F2EE; border-radius:3px; overflow:hidden; }
.an-bar-fill { height:100%; border-radius:3px; }
.an-val { font-size:11px; font-weight:700; color:#111318; text-align:right; min-width:52px; }
.an-cnt { font-size:10px; color:#9CA3AF; text-align:right; min-width:40px; }
/* ── Vendor ───── */
.an-vendor-row { display:flex; align-items:center; gap:8px; margin-bottom:9px; }
.an-vendor-row:last-child { margin-bottom:0; }
.an-vdot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.an-vname { font-size:12px; font-weight:500; color:#111318; min-width:72px; }
.an-vpct { font-size:10px; color:#9CA3AF; min-width:30px; text-align:right; }
.an-vval { font-size:11px; font-weight:700; color:#111318; min-width:54px; text-align:right; }
/* ── Parts ───── */
.an-part-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.an-part-row:last-child { margin-bottom:0; }
.an-rank { width:17px; height:17px; border-radius:4px; background:#F5F2EE; font-size:9px; font-weight:700; color:#9CA3AF; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.an-part-info { flex:1; min-width:0; }
.an-part-desc { font-size:11px; font-weight:500; color:#111318; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.an-part-meta { font-size:9px; color:#9CA3AF; margin-top:1px; }
.an-part-qty { font-size:11px; font-weight:700; color:#111318; min-width:24px; text-align:right; }
.an-trend-arrow { font-size:10px; }
.an-trend-up { color:#3B6D11; } .an-trend-down { color:#A32D2D; } .an-trend-flat { color:#9CA3AF; }
/* ── WO health ───── */
.an-wo-stat { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:0.5px solid #F5F2EE; }
.an-wo-stat:last-child { border-bottom:none; }
.an-wo-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; }
/* ── Category ───── */
.an-cat-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.an-cat-row:last-child { margin-bottom:0; }
.an-cat-name { font-size:11px; font-weight:500; color:#111318; min-width:80px; }
.an-cat-val { font-size:11px; font-weight:700; color:#111318; min-width:52px; text-align:right; }
/* ── WO type donut (simulated) ───── */
.an-donut-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.an-donut-row:last-child { margin-bottom:0; }
.an-donut-swatch { width:10px; height:10px; border-radius:2px; flex-shrink:0; }
.an-donut-label { font-size:12px; color:#111318; flex:1; }
.an-donut-pct { font-size:11px; font-weight:700; color:#111318; }
.an-donut-val { font-size:10px; color:#9CA3AF; min-width:48px; text-align:right; }
/* ── Insight cards ───── */
.an-insight { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; gap:6px; }
.an-insight-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.an-insight-title { font-size:12px; font-weight:600; color:#111318; }
.an-insight-body { font-size:11px; color:#5A5F6E; line-height:1.55; }
.an-insight-tag { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-top:2px; width:fit-content; }
/* ── Approval pipeline ───── */
.an-appr-row { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:0.5px solid #F5F2EE; }
.an-appr-row:last-child { border-bottom:none; }
/* ── No-data ───── */
.an-empty { color:#9CA3AF; font-size:12px; padding:8px 0; }
</style>
<h2 class="sr-only">Fleet Analytics</h2>
<div class="shell">
  ${buildSidebar('analytics')}
  <div class="main an-main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Analytics</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <!-- Filter bar -->
    <div class="an-filter-bar">
      <span class="an-filter-label">Period</span>
      <div class="an-period-pills">
        ${['7D','30D','90D','12M'].map(p => `<div class="an-period-pill ${_anPeriod===p?'active':''}" onclick="anSetPeriod('${p}')">${p}</div>`).join('')}
      </div>
      <div class="an-filter-sep"></div>
      <span class="an-filter-label">Locations</span>
      <div class="an-loc-pills">
        <div class="an-loc-pill ${_anLocs.size===locations.length?'active':''}" onclick="anToggleAllLocs()" style="${_anLocs.size===locations.length?'background:#111318;color:#FFFFFF;border-color:#111318;':''}">
          <i class="ti ti-stack-2" style="font-size:11px;"></i> All
        </div>
        ${locations.map((l, i) => {
          const LC = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];
          const active = _anLocs.has(l.id);
          return `<div class="an-loc-pill ${active?'active':''}" onclick="anToggleLoc('${l.id}')">
            <div class="an-loc-dot" style="background:${LC[i%LC.length]};"></div>
            ${l.name.split(' ')[0]}
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="an-content" id="an-content-body"></div>
  </div>
</div>`;

  anRenderContent();
}

// ── Filter handlers ────────────────────────────────────────────────────────
window.anSetPeriod = function(p) {
  _anPeriod = p;
  document.querySelectorAll('.an-period-pill').forEach(el => {
    el.classList.toggle('active', el.textContent.trim() === p);
  });
  anRenderContent();
};

window.anToggleAllLocs = function() {
  const locs = Store.getLocations();
  if (_anLocs.size === locs.length) {
    _anLocs = new Set([locs[0].id]);
  } else {
    _anLocs = new Set(locs.map(l => l.id));
  }
  _syncLocPills();
  anRenderContent();
};

window.anToggleLoc = function(id) {
  if (_anLocs.has(id)) {
    if (_anLocs.size === 1) return;
    _anLocs.delete(id);
  } else {
    _anLocs.add(id);
  }
  _syncLocPills();
  anRenderContent();
};

function _syncLocPills() {
  const locs = Store.getLocations();
  const LC = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];
  const allActive = _anLocs.size === locs.length;
  document.querySelectorAll('.an-loc-pill').forEach((pill, i) => {
    if (i === 0) {
      pill.classList.toggle('active', allActive);
      pill.style.cssText = allActive ? 'background:#111318;color:#FFFFFF;border-color:#111318;' : '';
    } else {
      const loc = locs[i - 1];
      const active = loc && _anLocs.has(loc.id);
      pill.classList.toggle('active', active);
      pill.style.cssText = active ? `background:#FAEEDA;color:#854F0B;border-color:#F5C97A;` : '';
    }
  });
}

// ── Main content renderer ──────────────────────────────────────────────────
function anRenderContent() {
  const body = document.getElementById('an-content-body');
  if (!body) return;

  const locations = Store.getLocations();
  const LC = ['#F5A623','#185FA5','#3B6D11','#534AB7','#A32D2D'];
  const selLocs = locations.filter(l => _anLocs.has(l.id));
  const selLocNames = selLocs.map(l => l.name.split(' ')[0]).join(', ');

  // ── Synthetic dataset (period-aware) ──────────────────────────────────────
  // Base spend per location per month (last 12)
  const LOC_BASE = {
    austin:      [4200,5100,3800,6200,5400,4800,7100,6300,5900,8200,7400,6850],
    'san-marcos':[2100,2800,1900,3400,2900,2600,3800,3200,3000,4100,3700,3420],
    kyle:        [1600,2100,1400,2600,2200,1900,2900,2400,2200,3100,2800,2580],
    houston:     [3800,4600,3400,5600,4900,4400,6500,5700,5300,7400,6700,6200],
    dallas:      [3200,3900,2900,4800,4200,3700,5500,4800,4500,6300,5700,5280],
  };
  const MONTH_LABELS_12 = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];

  function getSpendSeries() {
    const base = {};
    selLocs.forEach(l => { base[l.id] = LOC_BASE[l.id] || LOC_BASE.austin.map(v => Math.round(v * 0.7)); });

    if (_anPeriod === '12M') {
      const combined = MONTH_LABELS_12.map((_, mi) =>
        selLocs.reduce((s, l) => s + (base[l.id][mi] || 0), 0)
      );
      return { labels: MONTH_LABELS_12, values: combined, segmented: selLocs.map((l, li) => ({
        label: l.name.split(' ')[0], color: LC[li % LC.length],
        values: base[l.id] || [],
      }))};
    }
    if (_anPeriod === '90D') {
      const labels = ['May','Jun','Jul'];
      const combined = [9, 10, 11].map(mi => selLocs.reduce((s, l) => s + (base[l.id][mi] || 0), 0));
      return { labels, values: combined };
    }
    if (_anPeriod === '30D') {
      const labels = ['Wk 1','Wk 2','Wk 3','Wk 4'];
      const monthBase = selLocs.reduce((s, l) => s + (base[l.id][11] || 0), 0);
      const split = [0.22, 0.28, 0.24, 0.26].map(r => Math.round(monthBase * r));
      return { labels, values: split };
    }
    // 7D
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const wkBase = selLocs.reduce((s, l) => s + Math.round((base[l.id][11] || 0) / 4.3), 0);
    const split = [0.14,0.18,0.16,0.22,0.17,0.08,0.05].map(r => Math.round(wkBase * r));
    return { labels, values: split };
  }

  const spend = getSpendSeries();
  const totalSpend = spend.values.reduce((s, v) => s + v, 0);
  const priorSpend = totalSpend * (0.82 + Math.random() * 0.24);
  const spendDelta = ((totalSpend - priorSpend) / priorSpend * 100).toFixed(1);
  const maxSpendVal = Math.max(...spend.values, 1);

  // ── WO metrics (from store + synthetic) ──────────────────────────────────
  const allWOs = Store.getWorkOrders('all');
  const filteredWOs = allWOs.filter(w => !w.locationId || _anLocs.has(w.locationId));
  const openWOs = filteredWOs.filter(w => w.status === 'active');
  const pendingWOs = filteredWOs.filter(w => w.status === 'pending');
  const closedWOs = filteredWOs.filter(w => w.status === 'closed');
  const highPriOpen = openWOs.filter(w => w.priority === 'high').length;
  const overdueWOs = openWOs.filter(w => {
    if (!w.dueDate) return false;
    return new Date(w.dueDate) < new Date('2026-07-09');
  }).length;

  // synthetic averages
  const avgDaysToClose = (2.4 + selLocs.length * 0.3).toFixed(1);
  const ftfRate = Math.round(78 + selLocs.length * 2);
  const pendingApprovalCount = 3 + selLocs.length;
  const pendingApprovalValue = 1840 + selLocs.length * 620;
  const localPullRate = Math.round(22 + selLocs.length * 3);

  // ── Mechanic spend (synthetic by mechanic) ─────────────────────────────
  const MECHANICS = [
    { name: 'James W.',   avatar:'JW', color:'#F5A623', textColor:'#1A1200' },
    { name: 'Marcus T.',  avatar:'MT', color:'#185FA5', textColor:'#FFFFFF' },
    { name: 'Lena R.',    avatar:'LR', color:'#3B6D11', textColor:'#FFFFFF' },
    { name: 'Darius K.',  avatar:'DK', color:'#534AB7', textColor:'#FFFFFF' },
    { name: 'Priya N.',   avatar:'PN', color:'#A32D2D', textColor:'#FFFFFF' },
  ];
  const periodMult = { '7D':0.065, '30D':0.28, '90D':0.78, '12M':1 }[_anPeriod] || 0.28;
  const mechData = MECHANICS.map((m, i) => {
    const base = [6800, 5200, 4100, 3800, 2900][i] * periodMult * (selLocs.size || 1) * 0.55;
    const orders = Math.round([14, 11, 9, 8, 6][i] * periodMult);
    return { ...m, spend: Math.round(base), orders };
  }).sort((a, b) => b.spend - a.spend);
  const maxMechSpend = Math.max(...mechData.map(m => m.spend), 1);

  // ── Vendor spend ──────────────────────────────────────────────────────────
  const VENDOR_SEED = [
    { name:'Skyjack',     pct:0.38, color:'#F5A623' },
    { name:'Caterpillar', pct:0.24, color:'#185FA5' },
    { name:'Toyota',      pct:0.16, color:'#3B6D11' },
    { name:'Bobcat',      pct:0.12, color:'#534AB7' },
    { name:'Parker',      pct:0.06, color:'#A32D2D' },
    { name:'Grainger',    pct:0.04, color:'#0F6E56' },
  ];
  const vendorData = VENDOR_SEED.map(v => ({ ...v, amount: Math.round(totalSpend * v.pct) }));
  const topVendorPct = Math.round(VENDOR_SEED[0].pct * 100);
  const vendorConcentrationRisk = topVendorPct >= 40;

  // ── Top parts ─────────────────────────────────────────────────────────────
  const TOP_PARTS = [
    { pn:'SKJ-103100', desc:'Hydraulic lift cylinder seal kit', qty: Math.round(18 * periodMult), trend:'up' },
    { pn:'CAT-1R0716', desc:'Engine oil filter — Cat 320 C7.1', qty: Math.round(14 * periodMult), trend:'flat' },
    { pn:'TOY-MCH-114', desc:'Mast chain set — Toyota 8FGU25', qty: Math.round(11 * periodMult), trend:'up' },
    { pn:'SKJ-HF046-1G', desc:'Hydraulic fluid — ISO 46 · 1 gal', qty: Math.round(28 * periodMult), trend:'up' },
    { pn:'BOB-QC-520', desc:'Quick coupler seal kit — S650/S770', qty: Math.round(9 * periodMult), trend:'down' },
    { pn:'SKJ-BAT-500', desc:'Battery — 6V 220Ah deep cycle', qty: Math.round(7 * periodMult), trend:'up' },
    { pn:'CAT-TRK-7201', desc:'Track adjuster grease cylinder', qty: Math.round(6 * periodMult), trend:'flat' },
    { pn:'SKJ-PAD-601', desc:'Wear pad — UHMW polyethylene', qty: Math.round(22 * periodMult), trend:'up' },
  ].filter(p => p.qty > 0).sort((a, b) => b.qty - a.qty).slice(0, 7);
  const maxPartQty = Math.max(...TOP_PARTS.map(p => p.qty), 1);

  // ── Category breakdown ────────────────────────────────────────────────────
  const CAT_DATA = [
    { name:'Hydraulic',   pct:0.32, color:'#185FA5' },
    { name:'Drive',       pct:0.22, color:'#3B6D11' },
    { name:'Seals',       pct:0.18, color:'#F5A623' },
    { name:'Electrical',  pct:0.12, color:'#534AB7' },
    { name:'Filtration',  pct:0.09, color:'#A32D2D' },
    { name:'Structure',   pct:0.07, color:'#0F6E56' },
  ].map(c => ({ ...c, amount: Math.round(totalSpend * c.pct) }));
  const maxCat = Math.max(...CAT_DATA.map(c => c.amount), 1);

  // ── WO type mix ───────────────────────────────────────────────────────────
  const WO_TYPES = [
    { label:'Corrective / repair', pct:52, color:'#A32D2D', icon:'ti-tool' },
    { label:'Preventive maintenance', pct:31, color:'#185FA5', icon:'ti-calendar-check' },
    { label:'Inspection / safety', pct:12, color:'#3B6D11', icon:'ti-shield-check' },
    { label:'Stock replenishment', pct:5,  color:'#9CA3AF', icon:'ti-package' },
  ];

  // ── Pending approvals ─────────────────────────────────────────────────────
  const APPROVALS_PREVIEW = [
    { wo:'WO #100094', mech:'James W.', items:4, value:612, age:'2d' },
    { wo:'WO #100110', mech:'Marcus T.', items:2, value:388, age:'4d' },
    { wo:'WO #100102', mech:'Lena R.', items:3, value:840, age:'6h' },
  ].slice(0, pendingApprovalCount > 3 ? 3 : pendingApprovalCount);

  // ── Smart insights ────────────────────────────────────────────────────────
  const INSIGHTS = [
    {
      icon:'ti-trending-up', iconBg:'#FAEEDA', iconColor:'#854F0B',
      title:'Hydraulic spend trending up 34%',
      body:`Seal kits and cylinder assemblies account for 3 of your top 5 parts this period. Two active Cat 320 WOs are driving elevated hydraulic parts demand.`,
      tag:'Watch', tagBg:'#FFF8EC', tagColor:'#854F0B',
    },
    {
      icon:'ti-alert-triangle', iconBg:'#FEF2F2', iconColor:'#A32D2D',
      title:`${pendingApprovalCount} orders pending approval`,
      body:`$${pendingApprovalValue.toLocaleString()} in parts orders are awaiting sign-off — oldest is ${APPROVALS_PREVIEW[1]?.age || '4d'} old. Delays may impact WO due dates.`,
      tag:'Action needed', tagBg:'#FEF2F2', tagColor:'#A32D2D',
    },
    {
      icon:'ti-building-store', iconBg: vendorConcentrationRisk ? '#FEF2F2' : '#F0FDF4', iconColor: vendorConcentrationRisk ? '#A32D2D' : '#3B6D11',
      title: vendorConcentrationRisk ? `${topVendorPct}% spend with Skyjack` : 'Vendor mix is healthy',
      body: vendorConcentrationRisk
        ? `High vendor concentration with Skyjack may limit your negotiating position. Consider qualifying OEM-equivalent suppliers for seal kits and filters.`
        : `Spend is distributed across 6 vendors. Your top supplier (Skyjack) is under 40%, reducing supply chain risk.`,
      tag: vendorConcentrationRisk ? 'Supply risk' : 'Healthy', tagBg: vendorConcentrationRisk ? '#FEF2F2' : '#F0FDF4', tagColor: vendorConcentrationRisk ? '#A32D2D' : '#3B6D11',
    },
  ];

  // ── Helper: inline bar ────────────────────────────────────────────────────
  function bar(pct, color) {
    return `<div class="an-bar-inline"><div class="an-bar-fill" style="width:${Math.max(2, Math.round(pct*100))}%;background:${color};"></div></div>`;
  }
  function fmt(n) { return '$' + Math.round(n).toLocaleString(); }

  // ── Trend chart bars ──────────────────────────────────────────────────────
  const trendBars = spend.labels.map((lbl, i) => {
    const h = Math.max(4, Math.round((spend.values[i] / maxSpendVal) * 90));
    const isLast = i === spend.labels.length - 1;
    const amtStr = spend.values[i] >= 1000
      ? `$${(spend.values[i]/1000).toFixed(1)}k`
      : `$${spend.values[i]}`;
    return `<div class="an-bar-col">
      <div class="an-bar-amt">${isLast || spend.labels.length <= 5 ? amtStr : ''}</div>
      <div class="an-bar-seg" style="height:${h}px;background:${isLast ? '#F5A623' : '#E0DBD5'};"></div>
      <div class="an-bar-lbl">${lbl}</div>
    </div>`;
  }).join('');

  body.innerHTML = `
  <!-- KPI strip -->
  <div class="an-kpi-row">
    <div class="an-kpi">
      <div class="an-kpi-val">${fmt(totalSpend)}</div>
      <div class="an-kpi-label">Parts spend · ${_anPeriod}</div>
      <div class="an-kpi-delta ${parseFloat(spendDelta) >= 0 ? 'up' : 'down'}">${parseFloat(spendDelta) >= 0 ? '↑' : '↓'} ${Math.abs(parseFloat(spendDelta))}% vs prior</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val">${fmt(totalSpend / Math.max(closedWOs.length + 2, 1))}</div>
      <div class="an-kpi-label">Avg cost per WO closed</div>
      <div class="an-kpi-delta neutral">${closedWOs.length} WOs closed</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val">${openWOs.length + pendingWOs.length}</div>
      <div class="an-kpi-label">Open work orders</div>
      <div class="an-kpi-delta ${highPriOpen > 0 ? 'down' : 'neutral'}">${highPriOpen > 0 ? `${highPriOpen} high priority` : 'None high priority'}</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val">${avgDaysToClose}d</div>
      <div class="an-kpi-label">Avg days to close WO</div>
      <div class="an-kpi-delta ${overdueWOs > 0 ? 'down' : 'up'}">${overdueWOs > 0 ? `${overdueWOs} overdue` : 'None overdue'}</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val">${pendingApprovalCount}</div>
      <div class="an-kpi-label">Pending approvals</div>
      <div class="an-kpi-delta down">${fmt(pendingApprovalValue)} at risk</div>
    </div>
    <div class="an-kpi">
      <div class="an-kpi-val">${ftfRate}%</div>
      <div class="an-kpi-label">First-time fix rate</div>
      <div class="an-kpi-delta ${ftfRate >= 80 ? 'up' : 'down'}">${localPullRate}% local inventory pulls</div>
    </div>
  </div>

  <!-- Smart insights -->
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

  <!-- Spend trend (2/3) + WO health (1/3) -->
  <div class="an-grid-3" style="margin-bottom:14px;">
    <div class="an-card" style="grid-column:1/3;">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-trending-up" style="font-size:13px;color:#F5A623;"></i> Parts spend trend</div>
        <span class="an-card-sub">${selLocNames} · ${_anPeriod}</span>
      </div>
      <div class="an-card-body">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <div style="font-size:20px;font-weight:700;color:#111318;letter-spacing:-0.5px;">${fmt(totalSpend)}</div>
          <div style="font-size:11px;color:${parseFloat(spendDelta)>=0?'#3B6D11':'#A32D2D'};font-weight:600;">${parseFloat(spendDelta)>=0?'↑':'↓'} ${Math.abs(parseFloat(spendDelta))}% vs prior period</div>
        </div>
        <div class="an-trend-wrap">${trendBars}</div>
      </div>
    </div>

    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-clipboard-list" style="font-size:13px;color:#9CA3AF;"></i> WO health</div>
      </div>
      <div class="an-card-body" style="padding:10px 16px;">
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">Active</span>
          <span class="an-wo-badge" style="background:#FEF2F2;color:#A32D2D;">${openWOs.length}</span>
        </div>
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">Pending</span>
          <span class="an-wo-badge" style="background:#FFF8EC;color:#854F0B;">${pendingWOs.length}</span>
        </div>
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">Closed</span>
          <span class="an-wo-badge" style="background:#F0FDF4;color:#3B6D11;">${closedWOs.length}</span>
        </div>
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">Overdue</span>
          <span class="an-wo-badge" style="background:${overdueWOs>0?'#FEF2F2':'#F5F2EE'};color:${overdueWOs>0?'#A32D2D':'#9CA3AF'};">${overdueWOs}</span>
        </div>
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">High priority</span>
          <span class="an-wo-badge" style="background:#FEF2F2;color:#A32D2D;">${highPriOpen}</span>
        </div>
        <div class="an-wo-stat">
          <span style="font-size:12px;color:#5A5F6E;">Pending approvals</span>
          <span class="an-wo-badge" style="background:#F0F4FF;color:#3050A0;">${pendingApprovalCount}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Mechanic spend + Vendor concentration -->
  <div class="an-grid-2">
    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-users" style="font-size:13px;color:#9CA3AF;"></i> Parts spend by mechanic</div>
        <span class="an-card-sub">${_anPeriod}</span>
      </div>
      <div class="an-card-body">
        ${mechData.map(m => `
          <div class="an-mech-row">
            <div class="an-avatar" style="background:${m.color};color:${m.textColor};">${m.avatar}</div>
            <div class="an-name">${m.name}</div>
            ${bar(m.spend / maxMechSpend, m.color)}
            <div class="an-cnt">${m.orders} orders</div>
            <div class="an-val">${fmt(m.spend)}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-building-store" style="font-size:13px;color:#9CA3AF;"></i> Vendor spend</div>
        ${vendorConcentrationRisk ? `<span style="font-size:10px;font-weight:600;color:#A32D2D;background:#FEF2F2;padding:2px 7px;border-radius:8px;">Concentration risk</span>` : ''}
      </div>
      <div class="an-card-body">
        ${vendorData.map(v => `
          <div class="an-vendor-row">
            <div class="an-vdot" style="background:${v.color};"></div>
            <div class="an-vname">${v.name}</div>
            ${bar(v.pct, v.color)}
            <div class="an-vpct">${Math.round(v.pct * 100)}%</div>
            <div class="an-vval">${fmt(v.amount)}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Top parts + Category breakdown -->
  <div class="an-grid-2" style="margin-top:14px;">
    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-repeat" style="font-size:13px;color:#9CA3AF;"></i> Most ordered parts</div>
        <span class="an-card-sub">By qty · ${_anPeriod}</span>
      </div>
      <div class="an-card-body">
        ${TOP_PARTS.map((p, i) => {
          const tIcon = p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→';
          const tClass = p.trend === 'up' ? 'an-trend-up' : p.trend === 'down' ? 'an-trend-down' : 'an-trend-flat';
          return `<div class="an-part-row">
            <div class="an-rank">${i+1}</div>
            <div class="an-part-info">
              <div style="display:flex;align-items:center;gap:5px;">
                <div class="an-part-desc">${p.desc}</div>
                <span class="an-trend-arrow ${tClass}">${tIcon}</span>
              </div>
              <div class="an-part-meta">${p.pn}</div>
              <div style="margin-top:3px;height:4px;background:#F5F2EE;border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(p.qty/maxPartQty*100)}%;background:#534AB7;border-radius:2px;"></div></div>
            </div>
            <div class="an-part-qty">${p.qty}×</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-tags" style="font-size:13px;color:#9CA3AF;"></i> Spend by category</div>
        <span class="an-card-sub">${fmt(totalSpend)} total</span>
      </div>
      <div class="an-card-body">
        ${CAT_DATA.map(c => `
          <div class="an-cat-row">
            <div style="width:9px;height:9px;border-radius:2px;background:${c.color};flex-shrink:0;"></div>
            <div class="an-cat-name">${c.name}</div>
            ${bar(c.amount / maxCat, c.color)}
            <div style="font-size:10px;color:#9CA3AF;min-width:28px;text-align:right;">${Math.round(c.pct*100)}%</div>
            <div class="an-cat-val">${fmt(c.amount)}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- WO type mix + Approval pipeline -->
  <div class="an-grid-2" style="margin-top:14px;">
    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-chart-donut" style="font-size:13px;color:#9CA3AF;"></i> Work order type mix</div>
        <span class="an-card-sub">${filteredWOs.length} total WOs</span>
      </div>
      <div class="an-card-body">
        <!-- Stacked bar -->
        <div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin-bottom:14px;gap:1px;">
          ${WO_TYPES.map(t => `<div style="width:${t.pct}%;background:${t.color};"></div>`).join('')}
        </div>
        ${WO_TYPES.map(t => `
          <div class="an-donut-row">
            <div class="an-donut-swatch" style="background:${t.color};"></div>
            <div class="an-donut-label">${t.label}</div>
            <div class="an-donut-pct">${t.pct}%</div>
            <div class="an-donut-val">${Math.round(filteredWOs.length * t.pct / 100)} WOs</div>
          </div>`).join('')}
        <div style="margin-top:12px;padding-top:10px;border-top:0.5px solid #F0ECE8;display:flex;gap:20px;">
          <div><div style="font-size:18px;font-weight:700;color:#111318;">${ftfRate}%</div><div style="font-size:10px;color:#9CA3AF;">First-time fix rate</div></div>
          <div><div style="font-size:18px;font-weight:700;color:#111318;">${avgDaysToClose}d</div><div style="font-size:10px;color:#9CA3AF;">Avg days to close</div></div>
          <div><div style="font-size:18px;font-weight:700;color:${overdueWOs>0?'#A32D2D':'#3B6D11'};">${overdueWOs}</div><div style="font-size:10px;color:#9CA3AF;">Overdue</div></div>
        </div>
      </div>
    </div>

    <div class="an-card">
      <div class="an-card-hdr">
        <div class="an-card-title"><i class="ti ti-circle-check" style="font-size:13px;color:#9CA3AF;"></i> Approval pipeline</div>
        <span style="font-size:10px;font-weight:600;color:#A32D2D;background:#FEF2F2;padding:2px 7px;border-radius:8px;">${pendingApprovalCount} pending</span>
      </div>
      <div class="an-card-body" style="padding:10px 16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
          <div><div style="font-size:18px;font-weight:700;color:#111318;">${fmt(pendingApprovalValue)}</div><div style="font-size:10px;color:#9CA3AF;">Total value awaiting approval</div></div>
          <button onclick="sendPrompt('approvals')" style="padding:5px 12px;border-radius:8px;border:0.5px solid #E8E4DF;background:#FFFFFF;font-size:11px;font-weight:600;color:#111318;cursor:pointer;">Review all <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
        </div>
        ${APPROVALS_PREVIEW.map(ap => `
          <div class="an-appr-row">
            <div style="flex:1;min-width:0;">
              <div style="font-size:12px;font-weight:600;color:#111318;">${ap.wo}</div>
              <div style="font-size:10px;color:#9CA3AF;">${ap.mech} · ${ap.items} items</div>
            </div>
            <div style="font-size:10px;color:#9CA3AF;margin-right:10px;">Waiting ${ap.age}</div>
            <div style="font-size:12px;font-weight:700;color:#111318;">${fmt(ap.value)}</div>
          </div>`).join('')}
        ${pendingApprovalCount > 3 ? `<div style="font-size:11px;color:#9CA3AF;padding-top:6px;text-align:center;">+${pendingApprovalCount - 3} more <a onclick="sendPrompt('approvals')" style="color:#185FA5;cursor:pointer;">View all</a></div>` : ''}
      </div>
    </div>
  </div>`;
}
