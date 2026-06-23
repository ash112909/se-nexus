function render_dashboard(el) {
  el.innerHTML = `
<style>
.topbar-search { flex: 1; max-width: 380px; height: 32px; background: #2A2A2A; border: 1px solid #333; border-radius: 8px; display: flex; align-items: center; gap: 8px; padding: 0 10px; color: #5C6070; font-size: 13px; cursor:text; }
.content { flex: 1; padding: 24px; overflow-y: auto; }
.greeting { margin-bottom: 20px; }
.greeting-top { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.greeting-sub { font-size: 13px; color: #7A7F8E; margin-top: 3px; }
.section-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.ai-strip { background: #1E1E1E; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 14px; margin-bottom: 20px; cursor: pointer; }
.ai-strip:hover { background: #262626; }
.ai-icon { width: 36px; height: 36px; background: #F5A623; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; color: #1A1200; }
.ai-text { flex: 1; }
.ai-label { font-size: 13px; font-weight: 600; color: #FFFFFF; margin-bottom: 2px; }
.ai-hint { font-size: 12px; color: #5C6070; }
.ai-arrow { color: #F5A623; font-size: 18px; }
.wo-active-card { background: #FFFFFF; border: 1.5px solid #F5A623; border-radius: 12px; padding: 16px 18px; margin-bottom: 8px; cursor: pointer; }
.wo-active-card:hover { border-color: #E8980F; }
.wo-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px 18px; margin-bottom: 8px; cursor: pointer; }
.wo-card:hover { border-color: #C8C3BC; }
.wo-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.pill-ordered { background: #FAEEDA; color: #854F0B; }
.pill-open { background: #E6F1FB; color: #185FA5; }
.pill-high { background: #FCEBEB; color: #A32D2D; }
.pill-med { background: #FAEEDA; color: #854F0B; }
.wo-num { font-size: 12px; color: #9CA3AF; font-weight: 500; }
.wo-priority { margin-left: auto; }
.wo-body { display: flex; align-items: center; gap: 12px; }
.wo-machine-thumb { width: 48px; height: 48px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #9CA3AF; font-size: 22px; }
.wo-machine-name { font-size: 14px; font-weight: 600; color: #111318; margin-bottom: 2px; }
.wo-machine-meta { display: flex; align-items: center; gap: 10px; }
.wo-machine-issue { font-size: 13px; color: #7A7F8E; }
.wo-warranty { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #0F6E56; background: #E1F5EE; border-radius: 999px; padding: 2px 7px; }
.wo-warranty.expired { color: #5F5E5A; background: #F1EFE8; }
.wo-footer { display: flex; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 0.5px solid #F0ECE8; gap: 16px; }
.wo-stat { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #9CA3AF; }
.wo-stat strong { color: #3A3D4A; font-weight: 600; }
.wo-action-btn { margin-left: auto; background: #F5A623; border: none; border-radius: 7px; padding: 5px 13px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit; }
.wo-action-btn:hover { background: #E8980F; }
.wo-action-btn-ghost { margin-left: auto; background: none; border: 0.5px solid #E2DDD8; border-radius: 7px; padding: 5px 13px; font-size: 12px; font-weight: 500; color: #5A5F6E; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: inherit; }
.wo-action-btn-ghost:hover { background: #F5F2EE; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
.action-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; }
.action-card:hover { border-color: #C8C3BC; }
.action-card-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; margin-bottom: 2px; }
.icon-amber { background: #FAEEDA; color: #854F0B; }
.icon-blue { background: #E6F1FB; color: #185FA5; }
.icon-purple { background: #EEEDFE; color: #534AB7; }
.icon-green { background: #EAF3DE; color: #3B6D11; }
.icon-teal { background: #E1F5EE; color: #0F6E56; }
.action-card-title { font-size: 13px; font-weight: 600; color: #111318; }
.action-card-sub { font-size: 12px; color: #9CA3AF; }
.action-card-badge { margin-top: auto; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #854F0B; background: #FAEEDA; border-radius: 999px; padding: 2px 8px; width: fit-content; }
.notif-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.notif-item { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 10px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; }
.notif-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; margin-top: 1px; }
.notif-body { flex: 1; min-width: 0; }
.notif-title { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 2px; }
.notif-sub { font-size: 12px; color: #9CA3AF; }
.notif-time { font-size: 11px; color: #C0BAB3; white-space: nowrap; }
.notif-unread { width: 7px; height: 7px; background: #F5A623; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
</style>
<h2 class="sr-only">Fleet Mechanic dashboard for James</h2>
<div class="shell">
  ${buildSidebar('dashboard')}
  <div class="main">
    <div class="topbar">
      <div class="topbar-search"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="content">
      <div class="greeting">
        <div class="greeting-top">Good morning, James</div>
        <div class="greeting-sub">Monday, June 22 · Austin Branch · 2 open work orders</div>
      </div>
      <div class="ai-strip" onclick="sendPrompt('Open diagnostic assistant')">
        <div class="ai-icon"><i class="ti ti-sparkles"></i></div>
        <div class="ai-text">
          <div class="ai-label">Ask SmartEquip</div>
          <div class="ai-hint">Ask about parts, specs, diagnostics — I know your current machines</div>
        </div>
        <i class="ti ti-arrow-right ai-arrow"></i>
      </div>
      <div class="section-label">Active work orders</div>
      <div class="wo-active-card" onclick="sendPrompt('Show me the Work Order detail view for WO #100094')">
        <div class="wo-header">
          <span class="pill pill-ordered">Parts ordered</span>
          <span class="wo-num">#100094</span>
          <span class="pill pill-high wo-priority">High</span>
        </div>
        <div class="wo-body">
          <div class="wo-machine-thumb"><i class="ti ti-crane"></i></div>
          <div>
            <div class="wo-machine-name">Skyjack SJIII 3219 · Asset FL-094</div>
            <div class="wo-machine-meta">
              <span class="wo-machine-issue">Scissor lift won't elevate — hydraulic fault</span>
              <span class="wo-warranty"><i class="ti ti-shield-check"></i> Warranty · Sep 2027</span>
            </div>
          </div>
        </div>
        <div class="wo-footer">
          <div class="wo-stat"><i class="ti ti-package"></i> <strong>3</strong> parts ordered</div>
          <div class="wo-stat"><i class="ti ti-clock"></i> Est. arrival <strong>today</strong></div>
          <button class="wo-action-btn" onclick="event.stopPropagation();sendPrompt('Show me the Work Order detail view for WO #100094')">Open WO <i class="ti ti-arrow-right" style="font-size:12px;"></i></button>
        </div>
      </div>
      <div class="wo-card" onclick="sendPrompt('Show me the Work Order detail view for WO #100102')">
        <div class="wo-header">
          <span class="pill pill-open">Open</span>
          <span class="wo-num">#100102</span>
          <span class="pill pill-med wo-priority">Medium</span>
        </div>
        <div class="wo-body">
          <div class="wo-machine-thumb"><i class="ti ti-backhoe"></i></div>
          <div>
            <div class="wo-machine-name">Cat 320 Excavator · Asset FL-017</div>
            <div class="wo-machine-meta">
              <span class="wo-machine-issue">Track tension out of spec — right side</span>
              <span class="wo-warranty expired"><i class="ti ti-shield-off"></i> Warranty expired</span>
            </div>
          </div>
        </div>
        <div class="wo-footer">
          <div class="wo-stat"><i class="ti ti-shopping-cart"></i> <strong>No parts</strong> ordered yet</div>
          <div class="wo-stat"><i class="ti ti-calendar"></i> Opened <strong>today</strong></div>
          <button class="wo-action-btn-ghost" onclick="event.stopPropagation();sendPrompt('Open Parts Search scoped to WO #100102')">Search parts</button>
        </div>
      </div>
      <div style="margin-bottom:20px;"></div>
      <div class="section-label">Quick actions</div>
      <div class="grid-2">
        <div class="action-card">
          <div class="action-card-icon icon-blue"><i class="ti ti-package"></i></div>
          <div class="action-card-title">Previous orders &amp; tracking</div>
          <div class="action-card-sub">View history and delivery status</div>
        </div>
        <div class="action-card" onclick="sendPrompt('Open manuals and docs')">
          <div class="action-card-icon icon-purple"><i class="ti ti-book-2"></i></div>
          <div class="action-card-title">Manuals &amp; support docs</div>
          <div class="action-card-sub">Bulletins, schematics, how-tos</div>
        </div>
      </div>
      <div class="grid-3">
        <div class="action-card" onclick="sendPrompt('Open recommended parts')">
          <div class="action-card-icon icon-green"><i class="ti ti-star"></i></div>
          <div class="action-card-title">Recommended parts</div>
          <div class="action-card-sub">Based on your fleet</div>
        </div>
        <div class="action-card" onclick="sendPrompt('Open diagnostic assistant')">
          <div class="action-card-icon icon-teal"><i class="ti ti-tool"></i></div>
          <div class="action-card-title">Diagnostic assistant</div>
          <div class="action-card-sub">Fault codes &amp; troubleshooting</div>
        </div>
        <div class="action-card">
          <div class="action-card-icon icon-amber"><i class="ti ti-truck-delivery"></i></div>
          <div class="action-card-title">Delivery tracking</div>
          <div class="action-card-sub">Live shipment status</div>
          <div class="action-card-badge"><i class="ti ti-clock" style="font-size:11px;"></i> 1 arriving today</div>
        </div>
      </div>
      <div class="section-label">Notifications</div>
      <div class="notif-list">
        <div class="notif-item">
          <div class="notif-icon icon-green"><i class="ti ti-truck-delivery"></i></div>
          <div class="notif-body">
            <div class="notif-title">Parts arriving today — WO #100094</div>
            <div class="notif-sub">3 items from Skyjack · Est. delivery by 2:00 PM</div>
          </div>
          <div class="notif-time">9:14 AM</div>
          <div class="notif-unread"></div>
        </div>
        <div class="notif-item">
          <div class="notif-icon icon-amber"><i class="ti ti-alert-triangle"></i></div>
          <div class="notif-body">
            <div class="notif-title">Backorder notice — hydraulic pump seal kit</div>
            <div class="notif-sub">Item #107732 backordered · New ETA Jun 26</div>
          </div>
          <div class="notif-time">Yesterday</div>
          <div class="notif-unread"></div>
        </div>
        <div class="notif-item">
          <div class="notif-icon icon-blue"><i class="ti ti-clipboard-check"></i></div>
          <div class="notif-body">
            <div class="notif-title">WO #100102 assigned to you</div>
            <div class="notif-sub">Cat 320 Excavator FL-017 · Assigned by M. Torres (Lead)</div>
          </div>
          <div class="notif-time">Yesterday</div>
          <div style="width:7px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}