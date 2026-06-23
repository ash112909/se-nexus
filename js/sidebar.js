function buildSidebar(activeItem) {
  return `
  <div class="sidebar">
    <div class="sb-fleet">
      <div class="sb-fleet-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 13L9 5L15 13" stroke="#1A1200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="14" r="1.8" fill="#1A1200"/></svg>
      </div>
      <div>
        <div class="sb-fleet-name">Mid-County Rental</div>
        <div class="sb-fleet-sub">Austin Branch</div>
      </div>
    </div>
    <div class="sb-nav">
      <div class="sb-section-label">My work</div>
      <div class="sb-item ${activeItem==='dashboard'?'active':''}" onclick="sendPrompt('Go back to dashboard')"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
      <div class="sb-item ${activeItem==='wo'?'active':''}" onclick="sendPrompt('Show me the Work Order detail view for WO #100094')"><i class="ti ti-clipboard-list"></i> Work orders <span class="sb-badge">2</span></div>
      <div class="sb-item"><i class="ti ti-history"></i> Order history</div>
      <div class="sb-section-label">Parts</div>
      <div class="sb-item ${activeItem==='parts'?'active':''}" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><i class="ti ti-search"></i> Search parts</div>
      <div class="sb-item"><i class="ti ti-truck-delivery"></i> Tracking</div>
      <div class="sb-item ${activeItem==='recommended'?'active':''}" onclick="sendPrompt('Open recommended parts')"><i class="ti ti-star"></i> Recommended</div>
      <div class="sb-section-label">Knowledge</div>
      <div class="sb-item ${activeItem==='manuals'?'active':''}" onclick="sendPrompt('Open manuals and docs')"><i class="ti ti-book"></i> Manuals &amp; docs</div>
      <div class="sb-item ${activeItem==='diagnostics'?'active':''}" onclick="sendPrompt('Open diagnostic assistant')"><i class="ti ti-tool"></i> Diagnostics</div>
    </div>
    <div class="sb-footer">
      <div class="sb-avatar">JW</div>
      <div><div class="sb-user-name">James W.</div><div class="sb-user-role">Fleet Mechanic</div></div>
      <i class="ti ti-logout sb-logout"></i>
    </div>
  </div>`;
}