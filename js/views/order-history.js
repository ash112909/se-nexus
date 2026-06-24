function render_order_history(el) {
  el.innerHTML = `
<style>
.oh-tabs { display: flex; align-items: center; gap: 2px; padding: 0 24px; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; }
.oh-tab { padding: 12px 14px; font-size: 13px; font-weight: 500; color: #7A7F8E; cursor: pointer; border-bottom: 2px solid transparent; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.oh-tab:hover { color: #3A3D4A; }
.oh-tab.active { color: #111318; font-weight: 600; border-bottom-color: #F5A623; }
.oh-tab-badge { font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 7px; }
.oh-badge-neutral { background: #F0ECE8; color: #5A5F6E; }
.oh-badge-red { background: #FDE8E8; color: #B91C1C; }
.oh-filter-bar { padding: 10px 24px; background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.oh-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 260px; }
.oh-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 14px; pointer-events: none; }
.oh-search { width: 100%; height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 32px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.oh-search:focus { border-color: #F5A623; }
.oh-select { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #3A3D4A; outline: none; cursor: pointer; }
.oh-btn-ghost { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 12px; font-weight: 500; font-family: inherit; color: #3A3D4A; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.oh-btn-ghost:hover { background: #F5F2EE; }
.oh-btn-ghost-ml { margin-left: auto; }
.oh-table-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.oh-table { width: 100%; border-collapse: collapse; }
.oh-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 9px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.oh-table td { padding: 10px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.oh-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.oh-table tr.selected-row td { background: #FAEEDA; }
.status-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pill-saved { background: #F0ECE8; color: #5A5F6E; }
.pill-submitted { background: #DBEAFE; color: #1D4ED8; }
.pill-delivered { background: #D1FAE5; color: #065F46; }
.pill-backordered { background: #FEF3C7; color: #92400E; }
.pill-review { background: #EDE9FE; color: #5B21B6; }
.oh-actions { display: flex; align-items: center; gap: 6px; }
.oh-action-btn { width: 26px; height: 26px; background: #F5F2EE; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; color: #5A5F6E; }
.oh-action-btn:hover { background: #E8E4DF; }
.oh-pagination { padding: 10px 24px; background: #FFFFFF; border-top: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 10px; font-size: 12px; color: #7A7F8E; }
.oh-pag-btn { width: 28px; height: 28px; background: #F5F2EE; border: 0.5px solid #E2DDD8; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #3A3D4A; }
.oh-pag-btn:hover { background: #E8E4DF; }
.oh-pag-page { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; color: #3A3D4A; }
.oh-pag-page.cur { background: #F5A623; color: #1A1200; }
.oh-pag-ml { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.oh-detail-panel { background: #FFFFFF; border-top: 1px solid #E8E4DF; flex-shrink: 0; max-height: 55vh; overflow-y: auto; }
.oh-detail-header { display: flex; align-items: center; gap: 12px; padding: 14px 24px; border-bottom: 0.5px solid #E8E4DF; position: sticky; top: 0; background: #FFFFFF; z-index: 2; }
.oh-detail-title { font-size: 15px; font-weight: 700; color: #111318; flex: 1; }
.oh-detail-close { width: 28px; height: 28px; background: #F5F2EE; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #5A5F6E; }
.oh-detail-close:hover { background: #E8E4DF; }
.oh-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 0.5px solid #E8E4DF; }
.oh-detail-section { padding: 14px 24px; border-right: 0.5px solid #E8E4DF; }
.oh-detail-section:last-child { border-right: none; }
.oh-detail-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.oh-detail-row { display: flex; justify-content: space-between; padding: 3px 0; }
.oh-detail-label { font-size: 12px; color: #9CA3AF; }
.oh-detail-val { font-size: 12px; font-weight: 500; color: #111318; text-align: right; }
.oh-detail-items-table { width: 100%; border-collapse: collapse; }
.oh-detail-items-table th { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px; text-align: left; border-bottom: 0.5px solid #E8E4DF; background: #FAFAF8; }
.oh-detail-items-table td { font-size: 12px; color: #3A3D4A; padding: 9px 12px; border-bottom: 0.5px solid #F5F2EE; }
.ship-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; border-radius: 5px; padding: 2px 7px; }
.ship-tag-ups { background: #FEF3C7; color: #92400E; }
.ship-tag-bo { background: #FEE2E2; color: #991B1B; }
.oh-comments { padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.oh-comments-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; }
.oh-comment-input { width: 100%; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.tracking-section { padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.tracking-section-title { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.tracking-cards { display: flex; flex-direction: column; gap: 12px; }
.tracking-card { border: 1px solid #E8E4DF; border-radius: 10px; overflow: hidden; }
.tc-header { background: #FAFAF8; padding: 12px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 0.5px solid #E8E4DF; }
.tc-carrier-badge { height: 26px; padding: 0 10px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.tc-carrier-ups { background: #FEF3C7; color: #92400E; }
.tc-carrier-bo { background: #FEE2E2; color: #991B1B; }
.tc-tracking-num { font-size: 12px; color: #9CA3AF; font-family: monospace; }
.tc-status-badge { margin-left: auto; display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 4px 10px; }
.tc-status-otd { background: #D1FAE5; color: #065F46; }
.tc-status-bo { background: #FEF3C7; color: #92400E; }
@keyframes live-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #10B981; animation: live-pulse 1.4s ease-in-out infinite; display: inline-block; }
.live-dot-bo { background: #F59E0B; }
.tc-eta { font-size: 11px; color: #7A7F8E; margin-left: 8px; }
.tc-items { padding: 10px 16px; display: flex; flex-direction: column; gap: 4px; border-bottom: 0.5px solid #E8E4DF; }
.tc-item-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #3A3D4A; }
.tc-item-num { font-weight: 600; color: #111318; }
.tc-item-name { color: #7A7F8E; }
.tc-timeline { padding: 12px 16px; display: flex; gap: 0; }
.tc-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.tc-step:not(:last-child)::after { content: ''; position: absolute; top: 12px; left: 50%; right: -50%; height: 2px; background: #E8E4DF; z-index: 0; }
.tc-step.done:not(:last-child)::after { background: #10B981; }
.tc-step-dot { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; z-index: 1; position: relative; border: 2px solid; flex-shrink: 0; }
.tc-step-dot-done { background: #10B981; border-color: #10B981; color: #FFFFFF; }
.tc-step-dot-current { background: #F5A623; border-color: #F5A623; color: #1A1200; }
.tc-step-dot-pending { background: #FFFFFF; border-color: #E8E4DF; color: #B0AAA3; }
.tc-step-dot-alert { background: #F59E0B; border-color: #F59E0B; color: #FFFFFF; }
.tc-step-label { font-size: 10px; color: #9CA3AF; margin-top: 5px; text-align: center; line-height: 1.3; max-width: 60px; }
.tc-step-label.current-label { color: #111318; font-weight: 600; }
</style>

<h2 class="sr-only">Order History</h2>
<div class="shell">
  ${buildSidebar('order-history')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Order history</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;" id="oh-content">
      <div class="oh-tabs" id="oh-tabs">
        <div class="oh-tab active" data-tab="drafts" onclick="ohSwitchTab('drafts',this)">Drafts <span class="oh-tab-badge oh-badge-neutral">4</span></div>
        <div class="oh-tab" data-tab="local" onclick="ohSwitchTab('local',this)">Local <span class="oh-tab-badge oh-badge-neutral">2</span></div>
        <div class="oh-tab" data-tab="review" onclick="ohSwitchTab('review',this)">In review <span class="oh-tab-badge oh-badge-neutral">3</span></div>
        <div class="oh-tab" data-tab="submitted" onclick="ohSwitchTab('submitted',this)">Submitted <span class="oh-tab-badge oh-badge-neutral">18</span></div>
        <div class="oh-tab" data-tab="approvals" onclick="ohSwitchTab('approvals',this)">Manage approvals <span class="oh-tab-badge oh-badge-red">5</span></div>
      </div>

      <div class="oh-filter-bar">
        <div class="oh-search-wrap">
          <i class="ti ti-search oh-search-icon"></i>
          <input class="oh-search" type="text" placeholder="Search orders&hellip;"/>
        </div>
        <select class="oh-select"><option>All vendors</option><option>Skyjack</option><option>Parker</option><option>Grainger</option></select>
        <select class="oh-select"><option>All WOs</option><option>WO #100094</option><option>WO #100102</option></select>
        <button class="oh-btn-ghost"><i class="ti ti-columns"></i> Columns</button>
        <button class="oh-btn-ghost oh-btn-ghost-ml"><i class="ti ti-download"></i> Export</button>
      </div>

      <div class="oh-table-wrap">
        <table class="oh-table">
          <thead>
            <tr>
              <th>Vendor</th><th>Vendor ID</th><th>Date</th><th>User</th><th>Order name</th><th>WO / Equipment</th><th>Amount</th><th>Status</th><th>PO #</th><th></th>
            </tr>
          </thead>
          <tbody id="oh-tbody">
            <tr onclick="ohOpenDetail('ord-sub-1')" id="oh-row-ord-sub-1">
              <td><strong style="color:#111318;">Skyjack</strong></td><td style="font-size:11px;color:#9CA3AF;">SKJ-DIST</td><td>Jun 20, 2026</td><td>James W.</td><td>Hydraulic seals &mdash; WO #100094</td><td>WO #100094 &middot; FL-094</td><td style="font-weight:600;color:#111318;">$268.00</td><td><span class="status-pill pill-submitted">Submitted</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7841</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Grainger</strong></td><td style="font-size:11px;color:#9CA3AF;">GRG-001</td><td>Jun 18, 2026</td><td>James W.</td><td>Filters &amp; consumables</td><td>WO #100102 &middot; FL-102</td><td style="font-weight:600;color:#111318;">$94.50</td><td><span class="status-pill pill-saved">Saved</span></td><td style="font-size:11px;color:#9CA3AF;">&mdash;</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Parker</strong></td><td style="font-size:11px;color:#9CA3AF;">PKR-WD</td><td>Jun 15, 2026</td><td>M. Torres</td><td>Valve kit &mdash; FL-091</td><td>WO #100088 &middot; FL-091</td><td style="font-weight:600;color:#111318;">$145.00</td><td><span class="status-pill pill-delivered">Delivered</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7792</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Skyjack</strong></td><td style="font-size:11px;color:#9CA3AF;">SKJ-DIST</td><td>Jun 12, 2026</td><td>James W.</td><td>Pump seal kit &times;2 &mdash; FL-094</td><td>WO #100094 &middot; FL-094</td><td style="font-weight:600;color:#111318;">$212.00</td><td><span class="status-pill pill-backordered">Backordered</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7801</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Grainger</strong></td><td style="font-size:11px;color:#9CA3AF;">GRG-001</td><td>Jun 10, 2026</td><td>R. Singh</td><td>Safety equipment restock</td><td>General &middot; Austin</td><td style="font-weight:600;color:#111318;">$330.75</td><td><span class="status-pill pill-review">In review</span></td><td style="font-size:11px;color:#9CA3AF;">&mdash;</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Parker</strong></td><td style="font-size:11px;color:#9CA3AF;">PKR-WD</td><td>Jun 8, 2026</td><td>James W.</td><td>Aftermarket valve PAR-88821</td><td>WO #100094 &middot; FL-094</td><td style="font-weight:600;color:#111318;">$89.00</td><td><span class="status-pill pill-submitted">Submitted</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7789</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Skyjack</strong></td><td style="font-size:11px;color:#9CA3AF;">SKJ-DIST</td><td>Jun 5, 2026</td><td>M. Torres</td><td>Hydraulic hose assembly</td><td>WO #100081 &middot; FL-088</td><td style="font-weight:600;color:#111318;">$174.00</td><td><span class="status-pill pill-delivered">Delivered</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7755</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Grainger</strong></td><td style="font-size:11px;color:#9CA3AF;">GRG-001</td><td>Jun 2, 2026</td><td>R. Singh</td><td>Oil &amp; lubrication kits</td><td>General &middot; Austin</td><td style="font-weight:600;color:#111318;">$58.20</td><td><span class="status-pill pill-saved">Saved</span></td><td style="font-size:11px;color:#9CA3AF;">&mdash;</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Skyjack</strong></td><td style="font-size:11px;color:#9CA3AF;">SKJ-DIST</td><td>May 29, 2026</td><td>James W.</td><td>Drive motor brush kit</td><td>WO #100074 &middot; FL-077</td><td style="font-weight:600;color:#111318;">$122.00</td><td><span class="status-pill pill-delivered">Delivered</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7720</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
            <tr onclick="ohOpenDetail(null)">
              <td><strong style="color:#111318;">Parker</strong></td><td style="font-size:11px;color:#9CA3AF;">PKR-WD</td><td>May 25, 2026</td><td>M. Torres</td><td>Cylinder rod seal set</td><td>WO #100069 &middot; FL-071</td><td style="font-weight:600;color:#111318;">$66.40</td><td><span class="status-pill pill-delivered">Delivered</span></td><td style="font-size:11px;color:#9CA3AF;">PO-7708</td>
              <td><div class="oh-actions"><button class="oh-action-btn"><i class="ti ti-eye"></i></button><button class="oh-action-btn"><i class="ti ti-dots"></i></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="oh-detail-panel" style="display:none;" class="oh-detail-panel">
        <div class="oh-detail-header">
          <i class="ti ti-truck-delivery" style="font-size:16px;color:#F5A623;"></i>
          <div class="oh-detail-title">PO-7841 &middot; Skyjack &middot; Hydraulic seals &mdash; WO #100094</div>
          <span class="status-pill pill-submitted" style="margin-right:8px;">Submitted</span>
          <button class="oh-detail-close" onclick="ohCloseDetail()"><i class="ti ti-x"></i></button>
        </div>
        <div class="oh-detail-grid">
          <div class="oh-detail-section">
            <div class="oh-detail-section-title">Order info</div>
            <div class="oh-detail-row"><span class="oh-detail-label">Order name</span><span class="oh-detail-val">Hydraulic seals &mdash; WO #100094</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">PO #</span><span class="oh-detail-val">PO-7841</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Date submitted</span><span class="oh-detail-val">Jun 20, 2026</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Ordered by</span><span class="oh-detail-val">James W.</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Total</span><span class="oh-detail-val" style="color:#111318;font-weight:700;">$268.00</span></div>
          </div>
          <div class="oh-detail-section">
            <div class="oh-detail-section-title">Ship to / Bill to</div>
            <div class="oh-detail-row"><span class="oh-detail-label">Ship to</span><span class="oh-detail-val">Mid-County Rental, Austin</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Address</span><span class="oh-detail-val">1402 S Lamar Blvd, Austin TX</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Attn</span><span class="oh-detail-val">James W. &middot; Shop</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Bill to</span><span class="oh-detail-val">Mid-County Rental Corp</span></div>
          </div>
          <div class="oh-detail-section">
            <div class="oh-detail-section-title">Shipping options</div>
            <div class="oh-detail-row"><span class="oh-detail-label">Method</span><span class="oh-detail-val">Ground</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Carrier</span><span class="oh-detail-val">UPS / Vendor choice</span></div>
            <div class="oh-detail-row"><span class="oh-detail-label">Handling</span><span class="oh-detail-val">Standard</span></div>
          </div>
        </div>
        <div class="tracking-section">
          <div class="tracking-section-title"><span class="live-dot"></span> Live tracking</div>
          <div class="tracking-cards">
            <div class="tracking-card">
              <div class="tc-header">
                <span class="tc-carrier-badge tc-carrier-ups">UPS</span>
                <span class="tc-tracking-num">1Z999AA10123456784</span>
                <span class="tc-status-badge tc-status-otd"><span class="live-dot"></span> Out for delivery</span>
                <span class="tc-eta">Today by 2:00 PM</span>
              </div>
              <div class="tc-items">
                <div class="tc-item-row"><span class="tc-item-num">SKJ-103100</span><span class="tc-item-name">Hydraulic lift cylinder seal kit</span><span style="margin-left:auto;font-size:11px;color:#9CA3AF;">&times;1</span></div>
                <div class="tc-item-row"><span class="tc-item-num">SKJ-103278</span><span class="tc-item-name">Pressure relief valve</span><span style="margin-left:auto;font-size:11px;color:#9CA3AF;">&times;1</span></div>
              </div>
              <div class="tc-timeline">
                <div class="tc-step done"><div class="tc-step-dot tc-step-dot-done"><i class="ti ti-check" style="font-size:10px;"></i></div><div class="tc-step-label">Placed</div></div>
                <div class="tc-step done"><div class="tc-step-dot tc-step-dot-done"><i class="ti ti-check" style="font-size:10px;"></i></div><div class="tc-step-label">Picked up</div></div>
                <div class="tc-step done"><div class="tc-step-dot tc-step-dot-done"><i class="ti ti-check" style="font-size:10px;"></i></div><div class="tc-step-label">In transit</div></div>
                <div class="tc-step"><div class="tc-step-dot tc-step-dot-current"><i class="ti ti-truck-delivery" style="font-size:10px;"></i></div><div class="tc-step-label current-label">Out for delivery</div></div>
                <div class="tc-step"><div class="tc-step-dot tc-step-dot-pending"><i class="ti ti-home" style="font-size:10px;"></i></div><div class="tc-step-label">Delivered</div></div>
              </div>
            </div>
            <div class="tracking-card">
              <div class="tc-header">
                <span class="tc-carrier-badge tc-carrier-bo"><i class="ti ti-clock" style="font-size:11px;margin-right:3px;"></i>Backordered</span>
                <span class="tc-tracking-num" style="color:#D97706;">SKJ-107732 &times;2</span>
                <span class="tc-status-badge tc-status-bo"><span class="live-dot live-dot-bo"></span> Backordered</span>
                <span class="tc-eta">Est. Jun 26, 2026</span>
              </div>
              <div class="tc-items">
                <div class="tc-item-row"><span class="tc-item-num">SKJ-107732</span><span class="tc-item-name">Pump seal kit</span><span style="margin-left:auto;font-size:11px;color:#9CA3AF;">&times;2</span></div>
              </div>
              <div class="tc-timeline">
                <div class="tc-step done"><div class="tc-step-dot tc-step-dot-done"><i class="ti ti-check" style="font-size:10px;"></i></div><div class="tc-step-label">Placed</div></div>
                <div class="tc-step"><div class="tc-step-dot tc-step-dot-alert"><i class="ti ti-alert-triangle" style="font-size:10px;"></i></div><div class="tc-step-label current-label" style="color:#D97706;">Backordered</div></div>
                <div class="tc-step"><div class="tc-step-dot tc-step-dot-pending"><i class="ti ti-refresh" style="font-size:10px;"></i></div><div class="tc-step-label">Restock</div></div>
                <div class="tc-step"><div class="tc-step-dot tc-step-dot-pending"><i class="ti ti-home" style="font-size:10px;"></i></div><div class="tc-step-label">Delivered</div></div>
              </div>
            </div>
          </div>
        </div>
        <div style="padding:0 24px 14px;">
          <table class="oh-detail-items-table">
            <thead><tr><th>Part #</th><th>Description</th><th>Shipment</th><th>Qty</th><th>B/O qty</th><th>Unit price</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td style="font-weight:600;">SKJ-103100</td><td>Hydraulic lift cylinder seal kit</td><td><span class="ship-tag ship-tag-ups">UPS &middot; 1Z999AA1&hellip;</span></td><td>1</td><td style="color:#9CA3AF;">&mdash;</td><td>$98.00</td><td style="font-weight:600;">$98.00</td></tr>
              <tr><td style="font-weight:600;">SKJ-103278</td><td>Pressure relief valve</td><td><span class="ship-tag ship-tag-ups">UPS &middot; 1Z999AA1&hellip;</span></td><td>1</td><td style="color:#9CA3AF;">&mdash;</td><td>$72.00</td><td style="font-weight:600;">$72.00</td></tr>
              <tr><td style="font-weight:600;">SKJ-107732</td><td>Pump seal kit</td><td><span class="ship-tag ship-tag-bo"><i class="ti ti-clock" style="font-size:10px;"></i> Backordered</span></td><td>2</td><td style="color:#D97706;font-weight:600;">2</td><td>$49.00</td><td style="font-weight:600;">$98.00</td></tr>
            </tbody>
          </table>
        </div>
        <div class="oh-comments">
          <div class="oh-comments-label">Comments</div>
          <input class="oh-comment-input" type="text" placeholder="Add a comment&hellip;"/>
        </div>
      </div>

      <div class="oh-pagination">
        <button class="oh-pag-btn"><i class="ti ti-chevron-left" style="font-size:13px;"></i></button>
        <div class="oh-pag-page cur">1</div>
        <div class="oh-pag-page">2</div>
        <div class="oh-pag-page">3</div>
        <span style="color:#9CA3AF;">&hellip;</span>
        <div class="oh-pag-page">4</div>
        <button class="oh-pag-btn"><i class="ti ti-chevron-right" style="font-size:13px;"></i></button>
        <span style="color:#9CA3AF;margin-left:4px;">1&ndash;10 of 33</span>
        <div class="oh-pag-ml">
          <span>Rows per page:</span>
          <select class="oh-select" style="height:28px;font-size:12px;"><option>10</option><option>25</option><option>50</option></select>
        </div>
      </div>
    </div>
  </div>
</div>`;

  window.ohSwitchTab = function(tab, el) {
    document.querySelectorAll('.oh-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    ohCloseDetail();
  };

  window.ohOpenDetail = function(orderId) {
    const panel = document.getElementById('oh-detail-panel');
    if (!orderId) { ohCloseDetail(); return; }
    document.querySelectorAll('#oh-tbody tr').forEach(r => r.classList.remove('selected-row'));
    const row = document.getElementById('oh-row-' + orderId);
    if (row) row.classList.add('selected-row');
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window.ohCloseDetail = function() {
    document.getElementById('oh-detail-panel').style.display = 'none';
    document.querySelectorAll('#oh-tbody tr').forEach(r => r.classList.remove('selected-row'));
  };
}
