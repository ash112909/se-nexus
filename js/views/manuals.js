function render_manuals(el) {
  el.innerHTML = `
<style>
.content-row { display: flex; flex: 1; min-height: 0; }
.filter-panel { width: 220px; min-width: 220px; background: #FFFFFF; border-right: 0.5px solid #E8E4DF; display: flex; flex-direction: column; padding: 16px 0; }
.fp-section { padding: 0 14px 14px; border-bottom: 0.5px solid #F0ECE8; margin-bottom: 14px; }
.fp-section:last-child { border-bottom: none; margin-bottom: 0; }
.fp-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.fp-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #3A3D4A; cursor: pointer; margin-bottom: 2px; }
.fp-item:hover { background: #F5F2EE; }
.fp-item.active { background: #FAEEDA; color: #854F0B; font-weight: 500; }
.fp-item i { font-size: 15px; flex-shrink: 0; }
.fp-item.active i { color: #F5A623; }
.fp-count { margin-left: auto; font-size: 11px; color: #B0AAA3; }
.machine-filter-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; cursor: pointer; margin-bottom: 3px; }
.machine-filter-item:hover { background: #F5F2EE; }
.machine-filter-item.active { background: #FAEEDA; }
.mfi-icon { width: 26px; height: 26px; background: #F5F2EE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #9CA3AF; flex-shrink: 0; }
.machine-filter-item.active .mfi-icon { background: #F5A623; color: #1A1200; }
.mfi-name { font-size: 12px; font-weight: 500; color: #3A3D4A; line-height: 1.3; flex: 1; }
.machine-filter-item.active .mfi-name { color: #854F0B; }
.mfi-count { font-size: 10px; color: #B0AAA3; }
.main-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.search-area { padding: 16px 24px; background: #FFFFFF; border-bottom: 0.5px solid #E8E4DF; }
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 17px; pointer-events: none; }
.search-input { width: 100%; height: 44px; background: #F5F2EE; border: 1.5px solid #E2DDD8; border-radius: 10px; padding: 0 14px 0 44px; font-size: 14px; font-family: inherit; color: #111318; outline: none; transition: border-color 0.15s; }
.search-input:focus { border-color: #F5A623; background: #FFFFFF; box-shadow: 0 0 0 3px rgba(245,166,35,0.1); }
.search-input::placeholder { color: #B0AAA3; }
.search-hint { font-size: 12px; color: #9CA3AF; margin-top: 8px; display: flex; align-items: center; gap: 12px; }
.search-hint-chip { background: #F5F2EE; border-radius: 5px; padding: 2px 8px; cursor: pointer; }
.search-hint-chip:hover { background: #FAEEDA; color: #854F0B; }
.content-body { flex: 1; padding: 20px 24px; overflow-y: auto; }
.machine-context-banner { background: #1E1E1E; border-radius: 10px; padding: 11px 16px; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.mcb-icon { width: 30px; height: 30px; background: #F5A623; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #1A1200; flex-shrink: 0; }
.mcb-text { flex: 1; font-size: 12px; color: #8A8FA8; }
.mcb-text strong { color: #FFFFFF; }
.mcb-clear { font-size: 12px; color: #5C6070; cursor: pointer; display: flex; align-items: center; gap: 4px; background: none; border: none; font-family: inherit; }
.bulletin-alert { background: #FCEBEB; border: 0.5px solid #F5C5C5; border-radius: 10px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; cursor: pointer; }
.bulletin-alert:hover { background: #FAE0E0; }
.bulletin-alert i { font-size: 16px; color: #E24B4A; flex-shrink: 0; margin-top: 1px; }
.bulletin-alert-body { flex: 1; }
.bulletin-alert-title { font-size: 13px; font-weight: 600; color: #A32D2D; margin-bottom: 2px; }
.bulletin-alert-sub { font-size: 12px; color: #C05050; }
.bulletin-alert-badge { font-size: 11px; font-weight: 600; background: #E24B4A; color: #FFFFFF; border-radius: 999px; padding: 2px 8px; flex-shrink: 0; }
.section-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px; }
.docs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
.docs-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
.doc-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 14px; display: flex; gap: 12px; cursor: pointer; transition: border-color 0.12s; }
.doc-card:hover { border-color: #C8C3BC; }
.doc-card.featured { border-color: #F5A623; border-width: 1.5px; }
.doc-icon-wrap { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.doc-icon-pdf { background: #FCEBEB; color: #A32D2D; }
.doc-icon-diagram { background: #EEEDFE; color: #534AB7; }
.doc-icon-bulletin { background: #FAEEDA; color: #854F0B; }
.doc-icon-spec { background: #E1F5EE; color: #0F6E56; }
.doc-icon-op { background: #E6F1FB; color: #185FA5; }
.doc-icon-warranty { background: #EAF3DE; color: #3B6D11; }
.doc-body { flex: 1; min-width: 0; }
.doc-title { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 3px; line-height: 1.3; }
.doc-meta { font-size: 11px; color: #9CA3AF; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.doc-meta-sep { color: #D1CBC4; }
.doc-tags { display: flex; gap: 5px; flex-wrap: wrap; }
.doc-tag { font-size: 10px; border-radius: 4px; padding: 2px 6px; font-weight: 500; }
.tag-machine { background: #FAEEDA; color: #854F0B; }
.tag-section { background: #F5F2EE; color: #5A5F6E; }
.tag-new { background: #FCEBEB; color: #A32D2D; font-weight: 700; }
.doc-actions { display: flex; align-items: center; gap: 6px; margin-top: 10px; }
.doc-btn { font-size: 11px; font-weight: 500; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 4px; }
.doc-btn-primary { background: #F5A623; border: none; color: #1A1200; font-weight: 600; }
.doc-btn-primary:hover { background: #E8980F; }
.doc-btn-ghost { background: none; border: 0.5px solid #E2DDD8; color: #3A3D4A; }
.doc-btn-ghost:hover { background: #F5F2EE; }
.doc-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.doc-list-item { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 10px; padding: 11px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; }
.doc-list-item:hover { border-color: #C8C3BC; }
.doc-list-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.doc-list-body { flex: 1; min-width: 0; }
.doc-list-title { font-size: 13px; font-weight: 500; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.doc-list-meta { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 8px; }
.doc-list-action { font-size: 12px; color: #F5A623; font-weight: 500; white-space: nowrap; cursor: pointer; }
.view-more-btn { width: 100%; background: #FFFFFF; border: 0.5px solid #E2DDD8; border-radius: 9px; padding: 10px; font-size: 13px; font-weight: 500; color: #5A5F6E; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 24px; }
.view-more-btn:hover { background: #F5F2EE; }
</style>
<h2 class="sr-only">Manuals and documentation</h2>
<div class="shell">
  ${buildSidebar('manuals')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Manuals &amp; docs</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="content-row">
      <div class="filter-panel">
        <div class="fp-section">
          <div class="fp-label">Doc type</div>
          <div class="fp-item active"><i class="ti ti-books"></i> All documents <span class="fp-count">47</span></div>
          <div class="fp-item"><i class="ti ti-file-text"></i> Service manuals <span class="fp-count">8</span></div>
          <div class="fp-item"><i class="ti ti-schema"></i> Parts diagrams <span class="fp-count">14</span></div>
          <div class="fp-item"><i class="ti ti-alert-circle"></i> Service bulletins <span class="fp-count" style="background:#FCEBEB;color:#A32D2D;border-radius:999px;padding:1px 6px;">3</span></div>
          <div class="fp-item"><i class="ti ti-ruler"></i> Torque &amp; specs <span class="fp-count">9</span></div>
          <div class="fp-item"><i class="ti ti-shield-check"></i> Warranty docs <span class="fp-count">4</span></div>
        </div>
        <div class="fp-section">
          <div class="fp-label">My machines</div>
          <div class="machine-filter-item active"><div class="mfi-icon"><i class="ti ti-crane"></i></div><div class="mfi-name">Skyjack SJIII 3219</div><div class="mfi-count">22</div></div>
          <div class="machine-filter-item"><div class="mfi-icon"><i class="ti ti-backhoe"></i></div><div class="mfi-name">Cat 320 Excavator</div><div class="mfi-count">19</div></div>
        </div>
        <div class="fp-section">
          <div class="fp-label">All manufacturers</div>
          <div class="fp-item" style="font-size:12px;"><i class="ti ti-building-factory-2"></i> Skyjack</div>
          <div class="fp-item" style="font-size:12px;"><i class="ti ti-building-factory-2"></i> Caterpillar</div>
          <div class="fp-item" style="font-size:12px;"><i class="ti ti-building-factory-2"></i> Bomag</div>
          <div class="fp-item" style="font-size:12px;color:#9CA3AF;"><i class="ti ti-dots"></i> More…</div>
        </div>
      </div>
      <div class="main-panel">
        <div class="search-area">
          <div class="search-wrap"><i class="ti ti-search search-icon"></i><input class="search-input" type="text" placeholder="Search manuals, bulletins, specs — e.g. &quot;HYD-04 fault&quot;…"/></div>
          <div class="search-hint">Try: <span class="search-hint-chip">hydraulic seal replacement</span> <span class="search-hint-chip">3500 hr service SJIII</span> <span class="search-hint-chip">HYD-04</span></div>
        </div>
        <div class="content-body">
          <div class="machine-context-banner"><div class="mcb-icon"><i class="ti ti-crane"></i></div><div class="mcb-text">Showing docs for <strong>Skyjack SJIII 3219 · FL-094 · SJ3219-00847</strong> — from WO #100094</div><button class="mcb-clear"><i class="ti ti-x" style="font-size:11px;"></i> Clear filter</button></div>
          <div class="bulletin-alert"><i class="ti ti-alert-triangle"></i><div class="bulletin-alert-body"><div class="bulletin-alert-title">Service bulletin SB-2847 applies to this machine</div><div class="bulletin-alert-sub">Revised lift cylinder seal replacement procedure — affects serial range SJ3219-00800 to SJ3219-01200.</div></div><span class="bulletin-alert-badge">New</span></div>
          <div class="section-label">Relevant to your active repair — WO #100094</div>
          <div class="docs-grid">
            <div class="doc-card featured"><div class="doc-icon-wrap doc-icon-bulletin"><i class="ti ti-alert-circle"></i></div><div class="doc-body"><div class="doc-title">Service Bulletin SB-2847 — Lift cylinder seal replacement</div><div class="doc-meta">Skyjack <span class="doc-meta-sep">·</span> Jun 2026 <span class="doc-meta-sep">·</span> 4 pages</div><div class="doc-tags"><span class="doc-tag tag-machine">SJIII 3219</span><span class="doc-tag tag-new">New</span></div><div class="doc-actions"><button class="doc-btn doc-btn-primary"><i class="ti ti-eye" style="font-size:12px;"></i> View</button><button class="doc-btn doc-btn-ghost"><i class="ti ti-download" style="font-size:12px;"></i> Download</button></div></div></div>
            <div class="doc-card"><div class="doc-icon-wrap doc-icon-spec"><i class="ti ti-ruler"></i></div><div class="doc-body"><div class="doc-title">Torque spec sheet — hydraulic cylinder rod assembly</div><div class="doc-meta">Skyjack <span class="doc-meta-sep">·</span> Rev. 2 · Mar 2024</div><div class="doc-tags"><span class="doc-tag tag-machine">SJIII 3219</span><span class="doc-tag tag-section">Lift cylinder</span></div><div class="doc-actions"><button class="doc-btn doc-btn-primary"><i class="ti ti-eye" style="font-size:12px;"></i> View</button><button class="doc-btn doc-btn-ghost"><i class="ti ti-download" style="font-size:12px;"></i> Download</button></div></div></div>
            <div class="doc-card"><div class="doc-icon-wrap doc-icon-pdf"><i class="ti ti-file-text"></i></div><div class="doc-body"><div class="doc-title">SJIII 3219 Service Manual — Section 7: Hydraulic system</div><div class="doc-meta">Skyjack <span class="doc-meta-sep">·</span> 2019 edition <span class="doc-meta-sep">·</span> 84 pages</div><div class="doc-tags"><span class="doc-tag tag-machine">SJIII 3219</span><span class="doc-tag tag-section">Section 7</span></div><div class="doc-actions"><button class="doc-btn doc-btn-primary"><i class="ti ti-eye" style="font-size:12px;"></i> View</button><button class="doc-btn doc-btn-ghost"><i class="ti ti-download" style="font-size:12px;"></i> Download</button></div></div></div>
            <div class="doc-card"><div class="doc-icon-wrap doc-icon-diagram"><i class="ti ti-schema"></i></div><div class="doc-body"><div class="doc-title">Hydraulic system diagram — lift cylinder assembly</div><div class="doc-meta">Skyjack <span class="doc-meta-sep">·</span> Serial SJ3219-00847 <span class="doc-meta-sep">·</span> Interactive</div><div class="doc-tags"><span class="doc-tag tag-machine">SJIII 3219</span><span class="doc-tag tag-section">Hydraulic</span></div><div class="doc-actions"><button class="doc-btn doc-btn-primary" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><i class="ti ti-schema" style="font-size:12px;"></i> Open diagram</button><button class="doc-btn doc-btn-ghost"><i class="ti ti-download" style="font-size:12px;"></i> PDF</button></div></div></div>
          </div>
          <div class="section-label">Recently viewed</div>
          <div class="doc-list">
            <div class="doc-list-item"><div class="doc-list-icon doc-icon-spec"><i class="ti ti-ruler"></i></div><div class="doc-list-body"><div class="doc-list-title">Torque spec sheet — hydraulic cylinder rod assembly</div><div class="doc-list-meta"><span>Skyjack · SJIII 3219</span><span>·</span><span>Viewed 2 hrs ago</span></div></div><div class="doc-list-action">View <i class="ti ti-arrow-right" style="font-size:11px;"></i></div></div>
            <div class="doc-list-item"><div class="doc-list-icon doc-icon-pdf"><i class="ti ti-file-text"></i></div><div class="doc-list-body"><div class="doc-list-title">SJIII 3219 Service Manual — Section 7: Hydraulic system</div><div class="doc-list-meta"><span>Skyjack · 84 pages</span><span>·</span><span>Viewed yesterday</span></div></div><div class="doc-list-action">View <i class="ti ti-arrow-right" style="font-size:11px;"></i></div></div>
            <div class="doc-list-item" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><div class="doc-list-icon doc-icon-diagram"><i class="ti ti-schema"></i></div><div class="doc-list-body"><div class="doc-list-title">Hydraulic system diagram — lift cylinder (interactive)</div><div class="doc-list-meta"><span>Skyjack · SJIII 3219 · SJ3219-00847</span><span>·</span><span>Viewed yesterday</span></div></div><div class="doc-list-action">Open <i class="ti ti-arrow-right" style="font-size:11px;"></i></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  // Wire up search input
  const searchInput = el.querySelector('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      el.querySelectorAll('.doc-card, .doc-list-item').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }

  // Wire up View/Download buttons to show modal
  el.querySelectorAll('.doc-btn').forEach(btn => {
    if (btn.onclick || btn.getAttribute('onclick')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.doc-card, .doc-list-item');
      const title = card ? (card.querySelector('.doc-title, .doc-list-title') || {}).textContent : 'Document';
      const isDownload = btn.textContent.trim().toLowerCase().includes('download');
      Modal.show({
        title: isDownload ? 'Download started' : 'Viewing document',
        body: `<div style="text-align:center;padding:20px 0;">
          <div style="width:56px;height:56px;background:#EAF3DE;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;color:#3B6D11;margin:0 auto 14px;">
            <i class="ti ti-${isDownload?'download':'file-text'}"></i>
          </div>
          <div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:6px;">${title}</div>
          <div style="font-size:13px;color:#7A7F8E;">${isDownload?'Your download has started. Check your downloads folder.':'Document viewer would open here in a full implementation.'}</div>
        </div>`,
        actions: [{ label: 'OK', primary: true, onClick: Modal.close }]
      });
    });
  });
}