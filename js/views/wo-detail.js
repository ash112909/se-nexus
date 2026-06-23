function render_wo_detail(el) {
  el.innerHTML = `
<style>
.wo-detail-content { flex: 1; padding: 24px; overflow-y: auto; }
.wo-detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.wo-detail-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.wo-detail-meta { font-size: 13px; color: #7A7F8E; margin-top: 3px; }
.wo-status-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.pill-ordered { background: #FAEEDA; color: #854F0B; }
.pill-high { background: #FCEBEB; color: #A32D2D; }
.btn-primary { background: #F5A623; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
.btn-primary:hover { background: #E8980F; }
.btn-ghost { background: none; border: 0.5px solid #E2DDD8; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
.btn-ghost:hover { background: #F5F2EE; }
.wo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.wo-card-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; }
.wo-section-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px; }
.wo-field { margin-bottom: 10px; }
.wo-field-label { font-size: 11px; color: #9CA3AF; margin-bottom: 2px; }
.wo-field-value { font-size: 13px; font-weight: 500; color: #111318; }
.warranty-badge { display: inline-flex; align-items: center; gap: 5px; background: #E1F5EE; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; color: #0F6E56; }
.fault-badge { display: inline-flex; align-items: center; gap: 5px; background: #FCEBEB; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #A32D2D; }
.parts-ordered-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.pos-header { padding: 14px 16px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.pos-title { font-size: 14px; font-weight: 600; color: #111318; }
.pos-meta { font-size: 12px; color: #9CA3AF; }
.pos-row { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 0.5px solid #F5F2EE; }
.pos-row:last-child { border-bottom: none; }
.pos-icon { width: 36px; height: 36px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; color: #C8C3BC; flex-shrink: 0; }
.pos-info { flex: 1; }
.pos-name { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 2px; }
.pos-num { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 5px; }
.pos-price { font-size: 13px; font-weight: 600; color: #111318; flex-shrink: 0; }
.pos-status { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px; flex-shrink: 0; }
.status-arriving { background: #E1F5EE; color: #0F6E56; }
.pos-footer { padding: 11px 16px; background: #FAFAF8; display: flex; align-items: center; justify-content: space-between; }
.pos-total { font-size: 13px; color: #7A7F8E; }
.pos-total strong { color: #111318; font-weight: 600; }
.action-row { display: flex; gap: 10px; margin-bottom: 20px; }
.diag-cta { background: #1E1E1E; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; cursor: pointer; flex: 1; }
.diag-cta:hover { background: #262626; }
.diag-cta-icon { width: 34px; height: 34px; background: #F5A623; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #1A1200; flex-shrink: 0; }
.diag-cta-text { flex: 1; }
.diag-cta-label { font-size: 13px; font-weight: 600; color: #FFFFFF; margin-bottom: 1px; }
.diag-cta-sub { font-size: 11px; color: #5C6070; }
.timeline-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.tl-item { display: flex; gap: 12px; margin-bottom: 12px; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; background: #F5A623; flex-shrink: 0; margin-top: 4px; }
.tl-dot.done { background: #3B6D11; }
.tl-dot.pending { background: #E2DDD8; }
.tl-line { flex: 1; width: 1px; background: #F0ECE8; margin: 3px 0; }
.tl-body { flex: 1; }
.tl-title { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 1px; }
.tl-meta { font-size: 11px; color: #9CA3AF; }
</style>
<h2 class="sr-only">Work Order #100094 — Skyjack SJIII 3219</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">WO #100094</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="wo-detail-content">
      <div class="wo-detail-header">
        <div>
          <div class="wo-detail-title">Work Order #100094</div>
          <div class="wo-detail-meta">Opened Jun 22, 2026 · Austin Branch · Assigned to James W.</div>
          <div class="wo-status-row">
            <span class="pill pill-ordered">Parts ordered</span>
            <span class="pill pill-high">High priority</span>
            <span class="warranty-badge"><i class="ti ti-shield-check"></i> Under warranty · Sep 2027</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn-ghost"><i class="ti ti-printer" style="font-size:14px;"></i> Print WO</button>
          <button class="btn-primary"><i class="ti ti-check" style="font-size:14px;"></i> Mark complete</button>
        </div>
      </div>
      <div class="wo-grid">
        <div class="wo-card-section">
          <div class="wo-section-label">Machine</div>
          <div class="wo-field"><div class="wo-field-label">Model</div><div class="wo-field-value">Skyjack SJIII 3219</div></div>
          <div class="wo-field"><div class="wo-field-label">Asset ID</div><div class="wo-field-value">FL-094</div></div>
          <div class="wo-field"><div class="wo-field-label">Serial number</div><div class="wo-field-value">SJ3219-00847</div></div>
          <div class="wo-field"><div class="wo-field-label">Hours</div><div class="wo-field-value">3,412 hrs</div></div>
          <div class="wo-field"><div class="wo-field-label">Location</div><div class="wo-field-value">Austin Branch — Bay 3</div></div>
        </div>
        <div class="wo-card-section">
          <div class="wo-section-label">Fault &amp; complaint</div>
          <div class="wo-field"><div class="wo-field-label">Reported issue</div><div class="wo-field-value">Scissor lift won't elevate — pump running, no movement</div></div>
          <div class="wo-field"><div class="wo-field-label">Fault code</div><div><span class="fault-badge"><i class="ti ti-cpu" style="font-size:12px;"></i> HYD-04</span></div></div>
          <div class="wo-field"><div class="wo-field-label">Diagnosis</div><div class="wo-field-value">Low hydraulic pressure upstream of lift cylinder — likely internal seal failure (87% confidence)</div></div>
          <div class="wo-field"><div class="wo-field-label">Service bulletin</div><div class="wo-field-value" style="cursor:pointer;color:#534AB7;" onclick="sendPrompt('Open manuals and docs')">SB-2847 applies to this serial ↗</div></div>
        </div>
      </div>
      <div class="action-row">
        <div class="diag-cta" onclick="sendPrompt('Open diagnostic assistant')">
          <div class="diag-cta-icon"><i class="ti ti-sparkles"></i></div>
          <div class="diag-cta-text">
            <div class="diag-cta-label">Continue diagnostic session</div>
            <div class="diag-cta-sub">HYD-04 · 5-step procedure loaded · SB-2847 flagged</div>
          </div>
          <i class="ti ti-arrow-right" style="color:#F5A623;font-size:18px;"></i>
        </div>
        <div class="diag-cta" style="flex:0.6;" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')">
          <div class="diag-cta-icon"><i class="ti ti-schema"></i></div>
          <div class="diag-cta-text">
            <div class="diag-cta-label">View parts diagram</div>
            <div class="diag-cta-sub">Lift cylinder · 5 parts</div>
          </div>
          <i class="ti ti-arrow-right" style="color:#F5A623;font-size:18px;"></i>
        </div>
      </div>
      <div class="parts-ordered-section">
        <div class="pos-header">
          <div class="pos-title">Parts ordered</div>
          <div class="pos-meta">PO #55821 · 3 items · Est. delivery today by 2:00 PM</div>
        </div>
        <div class="pos-row">
          <div class="pos-icon"><i class="ti ti-circle-dashed"></i></div>
          <div class="pos-info"><div class="pos-name">Hydraulic lift cylinder seal kit</div><div class="pos-num">SKJ-103100 <span class="oem-badge">OEM</span></div></div>
          <div class="pos-price">$84.00</div>
          <span class="pos-status status-arriving">Arriving today</span>
        </div>
        <div class="pos-row">
          <div class="pos-icon"><i class="ti ti-adjustments"></i></div>
          <div class="pos-info"><div class="pos-name">Pressure relief valve</div><div class="pos-num">SKJ-103278 <span class="oem-badge">OEM</span></div></div>
          <div class="pos-price">$126.00</div>
          <span class="pos-status status-arriving">Arriving today</span>
        </div>
        <div class="pos-row">
          <div class="pos-icon"><i class="ti ti-circle-dashed"></i></div>
          <div class="pos-info"><div class="pos-name">Hydraulic bleed screw kit</div><div class="pos-num">SKJ-103601 <span class="oem-badge">OEM</span></div></div>
          <div class="pos-price">$12.00</div>
          <span class="pos-status status-arriving">Arriving today</span>
        </div>
        <div class="pos-footer">
          <div class="pos-total">3 parts · <strong>$222.00</strong> total</div>
          <button class="btn-ghost" style="font-size:12px;padding:5px 12px;">Track delivery <i class="ti ti-arrow-right" style="font-size:12px;"></i></button>
        </div>
      </div>
      <div class="timeline-section">
        <div class="wo-section-label">Work order timeline</div>
        <div class="tl-item"><div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div><div class="tl-body"><div class="tl-title">WO opened &amp; assigned to James W.</div><div class="tl-meta">Jun 22, 9:00 AM · by M. Torres (Lead)</div></div></div>
        <div class="tl-item"><div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div><div class="tl-body"><div class="tl-title">Diagnostic run — HYD-04 analyzed, SB-2847 flagged</div><div class="tl-meta">Jun 22, 9:20 AM · via SmartEquip AI</div></div></div>
        <div class="tl-item"><div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div><div class="tl-body"><div class="tl-title">Parts ordered — PO #55821 submitted</div><div class="tl-meta">Jun 22, 9:45 AM · 3 parts · $222.00</div></div></div>
        <div class="tl-item"><div class="tl-dot-wrap"><div class="tl-dot"></div><div class="tl-line"></div></div><div class="tl-body"><div class="tl-title">Parts delivery expected</div><div class="tl-meta">Jun 22, 2:00 PM · Skyjack direct</div></div></div>
        <div class="tl-item"><div class="tl-dot-wrap"><div class="tl-dot pending"></div></div><div class="tl-body"><div class="tl-title" style="color:#9CA3AF;">Repair &amp; quality check</div><div class="tl-meta">Pending parts arrival</div></div></div>
      </div>
    </div>
  </div>
</div>`;
}