function render_wo_list(el) {
  el.innerHTML = `
<style>
.wol-topbar-search { flex: 1; max-width: 380px; height: 32px; background: #2A2A2A; border: 1px solid #333; border-radius: 8px; display: flex; align-items: center; gap: 8px; padding: 0 10px; color: #5C6070; font-size: 13px; cursor: text; }
.wol-content { flex: 1; padding: 28px 28px 40px; overflow-y: auto; }
.wol-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.wol-title { font-size: 18px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.wol-subtitle { font-size: 13px; color: #7A7F8E; margin-top: 2px; }
.wol-filters { display: flex; align-items: center; gap: 8px; }
.wol-filter-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid #E2DDD8; background: #FFFFFF; color: #5A5F6E; transition: all 0.12s; }
.wol-filter-pill.active { background: #1E1E1E; color: #FFFFFF; border-color: #1E1E1E; }
.wol-filter-pill:hover:not(.active) { border-color: #C8C3BC; }
.wol-new-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #F5A623; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
.wol-new-btn:hover { background: #E8980F; }
.wol-table { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.wol-thead { display: grid; grid-template-columns: 110px 1fr 160px 90px 90px 80px; gap: 0; border-bottom: 1px solid #F0ECE8; padding: 0 18px; background: #FAFAF9; }
.wol-th { font-size: 11px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 8px; }
.wol-row { display: grid; grid-template-columns: 110px 1fr 160px 90px 90px 80px; gap: 0; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; cursor: pointer; transition: background 0.1s; align-items: center; }
.wol-row:last-child { border-bottom: none; }
.wol-row:hover { background: #FAFAF9; }
.wol-td { padding: 14px 8px; font-size: 13px; color: #3A3D4A; }
.wol-wo-id { font-size: 12px; font-weight: 600; color: #111318; font-family: 'SF Mono', 'Consolas', monospace; }
.wol-machine { display: flex; align-items: center; gap: 10px; }
.wol-machine-icon { width: 34px; height: 34px; background: #F5F2EE; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 16px; flex-shrink: 0; }
.wol-machine-name { font-size: 13px; font-weight: 600; color: #111318; line-height: 1.3; }
.wol-machine-issue { font-size: 12px; color: #7A7F8E; margin-top: 1px; }
.wol-assignee { display: flex; align-items: center; gap: 7px; }
.wol-avatar-sm { width: 22px; height: 22px; border-radius: 50%; background: #3C4052; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #FFFFFF; flex-shrink: 0; }
.wol-pill { display: inline-flex; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.wol-pill-ordered { background: #FAEEDA; color: #854F0B; }
.wol-pill-open { background: #E6F1FB; color: #185FA5; }
.wol-pill-progress { background: #EAF3DE; color: #3B6D11; }
.wol-pill-waiting { background: #F1EEFE; color: #534AB7; }
.wol-priority-high { display: inline-flex; font-size: 11px; font-weight: 700; color: #A32D2D; }
.wol-priority-med { display: inline-flex; font-size: 11px; font-weight: 700; color: #854F0B; }
.wol-priority-low { display: inline-flex; font-size: 11px; font-weight: 700; color: #3B6D11; }
.wol-arrow { color: #C0BAB3; font-size: 14px; }
.wol-summary-bar { display: flex; gap: 12px; margin-bottom: 20px; }
.wol-summary-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 10px; padding: 14px 18px; flex: 1; }
.wol-summary-val { font-size: 22px; font-weight: 700; color: #111318; letter-spacing: -0.5px; }
.wol-summary-label { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
</style>
<h2 class="sr-only">Work Orders</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div class="wol-topbar-search"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="wol-content">
      <div class="wol-header">
        <div>
          <div class="wol-title">Work Orders</div>
          <div class="wol-subtitle">Austin Branch · 2 active</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="wol-filters">
            <div class="wol-filter-pill active">All <span style="margin-left:2px;background:#3C4052;color:#fff;border-radius:999px;padding:0 5px;font-size:10px;">4</span></div>
            <div class="wol-filter-pill">Active <span style="margin-left:2px;background:#F5A623;color:#1A1200;border-radius:999px;padding:0 5px;font-size:10px;">2</span></div>
            <div class="wol-filter-pill">Pending</div>
            <div class="wol-filter-pill">Closed</div>
          </div>
          <button class="wol-new-btn"><i class="ti ti-plus" style="font-size:14px;"></i> New WO</button>
        </div>
      </div>

      <div class="wol-summary-bar">
        <div class="wol-summary-card">
          <div class="wol-summary-val">2</div>
          <div class="wol-summary-label">Active orders</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#854F0B;">1</div>
          <div class="wol-summary-label">Parts pending</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#A32D2D;">1</div>
          <div class="wol-summary-label">High priority</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#0F6E56;">3</div>
          <div class="wol-summary-label">Parts arriving today</div>
        </div>
      </div>

      <div class="wol-table">
        <div class="wol-thead">
          <div class="wol-th">WO #</div>
          <div class="wol-th">Machine / Issue</div>
          <div class="wol-th">Assigned</div>
          <div class="wol-th">Status</div>
          <div class="wol-th">Priority</div>
          <div class="wol-th"></div>
        </div>

        <div class="wol-row" onclick="sendPrompt('Show me the Work Order detail view for WO #100094')">
          <div class="wol-td"><span class="wol-wo-id">#100094</span></div>
          <div class="wol-td">
            <div class="wol-machine">
              <div class="wol-machine-icon"><i class="ti ti-crane"></i></div>
              <div>
                <div class="wol-machine-name">Skyjack SJIII 3219 · FL-094</div>
                <div class="wol-machine-issue">Scissor lift won't elevate — hydraulic fault</div>
              </div>
            </div>
          </div>
          <div class="wol-td">
            <div class="wol-assignee">
              <div class="wol-avatar-sm">JW</div>
              <span style="font-size:12px;color:#5A5F6E;">James W.</span>
            </div>
          </div>
          <div class="wol-td"><span class="wol-pill wol-pill-ordered">Parts ordered</span></div>
          <div class="wol-td"><span class="wol-priority-high"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>High</span></div>
          <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
        </div>

        <div class="wol-row" onclick="sendPrompt('Show me the Work Order detail view for WO #100102')">
          <div class="wol-td"><span class="wol-wo-id">#100102</span></div>
          <div class="wol-td">
            <div class="wol-machine">
              <div class="wol-machine-icon"><i class="ti ti-backhoe"></i></div>
              <div>
                <div class="wol-machine-name">Cat 320 Excavator · FL-017</div>
                <div class="wol-machine-issue">Track tension out of spec — right side</div>
              </div>
            </div>
          </div>
          <div class="wol-td">
            <div class="wol-assignee">
              <div class="wol-avatar-sm">JW</div>
              <span style="font-size:12px;color:#5A5F6E;">James W.</span>
            </div>
          </div>
          <div class="wol-td"><span class="wol-pill wol-pill-open">Open</span></div>
          <div class="wol-td"><span class="wol-priority-med"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>Med</span></div>
          <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
        </div>

        <div class="wol-row" style="opacity:0.5;pointer-events:none;">
          <div class="wol-td"><span class="wol-wo-id">#100089</span></div>
          <div class="wol-td">
            <div class="wol-machine">
              <div class="wol-machine-icon"><i class="ti ti-forklift"></i></div>
              <div>
                <div class="wol-machine-name">Toyota 8FGU25 · FL-031</div>
                <div class="wol-machine-issue">Mast chain elongation — scheduled inspection</div>
              </div>
            </div>
          </div>
          <div class="wol-td">
            <div class="wol-assignee">
              <div class="wol-avatar-sm" style="background:#5A5F6E;">MT</div>
              <span style="font-size:12px;color:#5A5F6E;">M. Torres</span>
            </div>
          </div>
          <div class="wol-td"><span class="wol-pill wol-pill-progress">In progress</span></div>
          <div class="wol-td"><span class="wol-priority-low"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>Low</span></div>
          <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
        </div>

        <div class="wol-row" style="opacity:0.5;pointer-events:none;">
          <div class="wol-td"><span class="wol-wo-id">#100081</span></div>
          <div class="wol-td">
            <div class="wol-machine">
              <div class="wol-machine-icon"><i class="ti ti-bulldozer"></i></div>
              <div>
                <div class="wol-machine-name">Bobcat S650 · FL-008</div>
                <div class="wol-machine-issue">Hydraulic quick coupler leak</div>
              </div>
            </div>
          </div>
          <div class="wol-td">
            <div class="wol-assignee">
              <div class="wol-avatar-sm" style="background:#5A5F6E;">RK</div>
              <span style="font-size:12px;color:#5A5F6E;">R. Kim</span>
            </div>
          </div>
          <div class="wol-td"><span class="wol-pill wol-pill-waiting">Waiting</span></div>
          <div class="wol-td"><span class="wol-priority-med"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>Med</span></div>
          <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}
