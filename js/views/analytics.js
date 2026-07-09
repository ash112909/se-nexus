function render_analytics(el) {
  const _user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  if (!_user || _user.role !== 'supervisor') {
    el.innerHTML = `<div class="shell">${buildSidebar('analytics')}<div class="main"><div style="padding:60px;text-align:center;color:#9CA3AF;font-size:14px;"><i class="ti ti-lock" style="font-size:32px;display:block;margin-bottom:12px;"></i>You don't have access to Analytics.</div></div></div>`;
    return;
  }

  // Derive metrics from store data
  const allOrders = Store.getOrders('all');
  const allWOs = Store.getWorkOrders('all');

  // --- Spend by mechanic ---
  const spendByMechanic = {};
  const ordersByMechanic = {};
  allOrders.forEach(function(o) {
    const mechanic = o.user || 'Unknown';
    spendByMechanic[mechanic] = (spendByMechanic[mechanic] || 0) + (o.amount || 0);
    ordersByMechanic[mechanic] = (ordersByMechanic[mechanic] || 0) + 1;
  });
  const mechanicRows = Object.keys(spendByMechanic).sort((a, b) => spendByMechanic[b] - spendByMechanic[a]);
  const maxSpend = Math.max(...Object.values(spendByMechanic), 1);

  // --- Part ordering frequency ---
  const partFreq = {};
  const partNames = {};
  allOrders.forEach(function(o) {
    (o.items || []).forEach(function(it) {
      partFreq[it.partNum] = (partFreq[it.partNum] || 0) + (it.qty || 1);
      partNames[it.partNum] = it.description;
    });
  });
  const topParts = Object.keys(partFreq).sort((a, b) => partFreq[b] - partFreq[a]).slice(0, 8);
  const maxFreq = Math.max(...Object.values(partFreq), 1);

  // --- Vendor spend distribution ---
  const vendorSpend = {};
  allOrders.forEach(function(o) {
    (o.items || []).forEach(function(it) {
      const v = it.vendor || o.vendor || 'Unknown';
      vendorSpend[v] = (vendorSpend[v] || 0) + it.price * (it.qty || 1);
    });
  });
  const vendorList = Object.keys(vendorSpend).sort((a, b) => vendorSpend[b] - vendorSpend[a]);
  const totalVendorSpend = Object.values(vendorSpend).reduce((s, v) => s + v, 0) || 1;
  const VENDOR_COLORS = ['#F5A623','#3B6D11','#185FA5','#534AB7','#A32D2D','#0F6E56'];

  // --- WO summary ---
  const openWOs = allWOs.filter(w => w.status === 'active').length;
  const highPriWOs = allWOs.filter(w => w.priority === 'high' && w.status !== 'closed').length;
  const closedThisMonth = allWOs.filter(w => w.status === 'closed').length;
  const totalOrderValue = allOrders.reduce((s, o) => s + (o.amount || 0), 0);

  // --- Category breakdown ---
  const catSpend = {};
  allOrders.forEach(function(o) {
    (o.items || []).forEach(function(it) {
      const cat = it.category || 'Other';
      catSpend[cat] = (catSpend[cat] || 0) + it.price * (it.qty || 1);
    });
  });
  const catList = Object.keys(catSpend).sort((a, b) => catSpend[b] - catSpend[a]);
  const maxCat = Math.max(...Object.values(catSpend), 1);

  // --- Simulated monthly trend (last 6 months) ---
  const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const TREND = [3420, 5180, 4260, 6740, 5920, totalOrderValue || 4850];
  const maxTrend = Math.max(...TREND, 1);

  function bar(pct, color, height) {
    return `<div style="width:100%;background:#F5F2EE;border-radius:4px;overflow:hidden;height:${height||8}px;"><div style="width:${Math.round(pct*100)}%;background:${color};height:100%;border-radius:4px;transition:width 0.4s;"></div></div>`;
  }

  el.innerHTML = `
<style>
.an-content { flex:1; padding:24px 28px 40px; overflow-y:auto; }
.an-page-title { font-size:18px; font-weight:700; color:#111318; margin-bottom:2px; }
.an-page-sub { font-size:12px; color:#7A7F8E; margin-bottom:20px; }
.an-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
.an-kpi { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:16px 18px; }
.an-kpi-val { font-size:26px; font-weight:700; color:#111318; letter-spacing:-0.5px; line-height:1.1; }
.an-kpi-label { font-size:12px; color:#9CA3AF; margin-top:4px; }
.an-kpi-sub { font-size:11px; margin-top:3px; font-weight:500; }
.an-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.an-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; overflow:hidden; }
.an-card-full { grid-column:1/-1; }
.an-card-header { padding:13px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; justify-content:space-between; }
.an-card-title { font-size:13px; font-weight:600; color:#111318; display:flex; align-items:center; gap:7px; }
.an-card-body { padding:16px; }
.an-mech-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.an-mech-row:last-child { margin-bottom:0; }
.an-mech-avatar { width:28px; height:28px; border-radius:50%; background:#F5A623; color:#1A1200; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.an-mech-name { font-size:12px; font-weight:500; color:#111318; min-width:72px; }
.an-mech-val { font-size:12px; font-weight:700; color:#111318; min-width:64px; text-align:right; }
.an-mech-cnt { font-size:10px; color:#9CA3AF; min-width:42px; text-align:right; }
.an-part-row { display:flex; align-items:center; gap:8px; margin-bottom:9px; }
.an-part-row:last-child { margin-bottom:0; }
.an-part-num { font-family:'SF Mono','Consolas',monospace; font-size:10px; color:#7A7F8E; min-width:88px; }
.an-part-desc { font-size:11px; color:#111318; font-weight:500; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.an-part-qty { font-size:11px; font-weight:700; color:#111318; min-width:28px; text-align:right; }
.an-vendor-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.an-vendor-name { font-size:12px; font-weight:500; color:#111318; min-width:80px; }
.an-vendor-pct { font-size:11px; color:#9CA3AF; min-width:36px; text-align:right; }
.an-vendor-val { font-size:12px; font-weight:700; color:#111318; min-width:60px; text-align:right; }
/* Trend chart */
.an-trend-wrap { display:flex; align-items:flex-end; gap:8px; height:80px; padding:0 4px; }
.an-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
.an-bar-seg { width:100%; border-radius:4px 4px 0 0; transition:height 0.4s; }
.an-bar-label { font-size:10px; color:#9CA3AF; }
.an-bar-val { font-size:9px; font-weight:600; color:#5A5F6E; }
/* Category */
.an-cat-row { display:flex; align-items:center; gap:10px; margin-bottom:9px; }
.an-cat-name { font-size:12px; color:#111318; font-weight:500; min-width:90px; }
.an-cat-val { font-size:12px; font-weight:700; color:#111318; min-width:60px; text-align:right; }
</style>
<h2 class="sr-only">Fleet Analytics</h2>
<div class="shell">
  ${buildSidebar('analytics')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Analytics</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="an-content">
      <div class="an-page-title">Fleet Analytics</div>
      <div class="an-page-sub">${(Store.getCurrentLocation()||{name:'All locations'}).name} · Parts ordering &amp; work order trends</div>

      <!-- KPI row -->
      <div class="an-kpi-row">
        <div class="an-kpi">
          <div class="an-kpi-val">$${totalOrderValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          <div class="an-kpi-label">Total parts spend</div>
          <div class="an-kpi-sub" style="color:#3B6D11;">↑ 12% vs last period</div>
        </div>
        <div class="an-kpi">
          <div class="an-kpi-val">${allOrders.length}</div>
          <div class="an-kpi-label">Orders placed</div>
          <div class="an-kpi-sub" style="color:#3B6D11;">↑ 3 vs last period</div>
        </div>
        <div class="an-kpi">
          <div class="an-kpi-val">${openWOs}</div>
          <div class="an-kpi-label">Open work orders</div>
          <div class="an-kpi-sub" style="color:#A32D2D;">${highPriWOs} high priority</div>
        </div>
        <div class="an-kpi">
          <div class="an-kpi-val">${closedThisMonth}</div>
          <div class="an-kpi-label">WOs closed</div>
          <div class="an-kpi-sub" style="color:#9CA3AF;">All time</div>
        </div>
      </div>

      <!-- Spend trend + Vendor split -->
      <div class="an-grid">
        <div class="an-card">
          <div class="an-card-header">
            <div class="an-card-title"><i class="ti ti-trending-up" style="font-size:14px;color:#F5A623;"></i> Monthly parts spend</div>
            <span style="font-size:10px;color:#9CA3AF;">Last 6 months</span>
          </div>
          <div class="an-card-body">
            <div class="an-trend-wrap">
              ${MONTHS.map((m, i) => {
                const h = Math.round((TREND[i] / maxTrend) * 72);
                const isLast = i === MONTHS.length - 1;
                return `<div class="an-bar-col">
                  <div class="an-bar-val">$${(TREND[i]/1000).toFixed(1)}k</div>
                  <div class="an-bar-seg" style="height:${h}px;background:${isLast ? '#F5A623' : '#E8E4DF'};"></div>
                  <div class="an-bar-label">${m}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="an-card">
          <div class="an-card-header">
            <div class="an-card-title"><i class="ti ti-building-store" style="font-size:14px;color:#9CA3AF;"></i> Spend by vendor</div>
          </div>
          <div class="an-card-body">
            ${vendorList.length ? vendorList.map((v, i) => `
              <div class="an-vendor-row">
                <div style="width:8px;height:8px;border-radius:50%;background:${VENDOR_COLORS[i % VENDOR_COLORS.length]};flex-shrink:0;"></div>
                <div class="an-vendor-name">${v}</div>
                <div style="flex:1;">${bar(vendorSpend[v] / totalVendorSpend, VENDOR_COLORS[i % VENDOR_COLORS.length], 7)}</div>
                <div class="an-vendor-pct">${Math.round(vendorSpend[v] / totalVendorSpend * 100)}%</div>
                <div class="an-vendor-val">$${vendorSpend[v].toFixed(0)}</div>
              </div>`).join('')
            : '<div style="color:#9CA3AF;font-size:12px;padding:8px 0;">No order data yet.</div>'}
          </div>
        </div>
      </div>

      <!-- Spend by mechanic + Part frequency -->
      <div class="an-grid">
        <div class="an-card">
          <div class="an-card-header">
            <div class="an-card-title"><i class="ti ti-user" style="font-size:14px;color:#9CA3AF;"></i> Parts spend by mechanic</div>
          </div>
          <div class="an-card-body">
            ${mechanicRows.length ? mechanicRows.map((name, i) => {
              const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              const colors = ['#F5A623','#3B6D11','#185FA5','#534AB7','#A32D2D'];
              return `<div class="an-mech-row">
                <div class="an-mech-avatar" style="background:${colors[i % colors.length]};color:${i === 0 ? '#1A1200' : '#FFFFFF'};">${initials}</div>
                <div class="an-mech-name">${name}</div>
                <div style="flex:1;">${bar(spendByMechanic[name] / maxSpend, '#F5A623', 7)}</div>
                <div class="an-mech-cnt">${ordersByMechanic[name]} order${ordersByMechanic[name]!==1?'s':''}</div>
                <div class="an-mech-val">$${spendByMechanic[name].toFixed(0)}</div>
              </div>`;
            }).join('')
            : '<div style="color:#9CA3AF;font-size:12px;padding:8px 0;">No order data yet.</div>'}
          </div>
        </div>

        <div class="an-card">
          <div class="an-card-header">
            <div class="an-card-title"><i class="ti ti-repeat" style="font-size:14px;color:#9CA3AF;"></i> Most ordered parts</div>
            <span style="font-size:10px;color:#9CA3AF;">By total qty ordered</span>
          </div>
          <div class="an-card-body">
            ${topParts.length ? topParts.map((pn, i) => `
              <div class="an-part-row">
                <div style="width:18px;height:18px;border-radius:4px;background:#F5F2EE;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#9CA3AF;flex-shrink:0;">${i+1}</div>
                <div style="flex:1;min-width:0;">
                  <div class="an-part-desc">${partNames[pn] || pn}</div>
                  <div class="an-part-num">${pn}</div>
                  <div style="margin-top:3px;">${bar(partFreq[pn] / maxFreq, '#534AB7', 5)}</div>
                </div>
                <div class="an-part-qty">${partFreq[pn]}×</div>
              </div>`).join('')
            : '<div style="color:#9CA3AF;font-size:12px;padding:8px 0;">No order data yet.</div>'}
          </div>
        </div>
      </div>

      <!-- Category breakdown (full width) -->
      <div class="an-card an-card-full">
        <div class="an-card-header">
          <div class="an-card-title"><i class="ti ti-tags" style="font-size:14px;color:#9CA3AF;"></i> Spend by parts category</div>
        </div>
        <div class="an-card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:10px 32px;">
          ${catList.length ? catList.map((cat, i) => `
            <div class="an-cat-row">
              <div class="an-cat-name">${cat}</div>
              <div style="flex:1;">${bar(catSpend[cat] / maxCat, '#185FA5', 7)}</div>
              <div class="an-cat-val">$${catSpend[cat].toFixed(0)}</div>
            </div>`).join('')
          : '<div style="color:#9CA3AF;font-size:12px;grid-column:1/-1;">No category data yet.</div>'}
        </div>
      </div>

    </div>
  </div>
</div>`;
}
