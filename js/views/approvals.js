function render_approvals(el) {
  let _searchQuery = '';
  let _selectedOrderId = null;

  function statusPillClass(status) {
    const map = { saved: 'pill-saved', submitted: 'pill-submitted', delivered: 'pill-delivered', backordered: 'pill-backordered', review: 'pill-review' };
    return map[status] || 'pill-saved';
  }
  function statusLabel(status) {
    const map = { saved: 'Saved', submitted: 'Submitted', delivered: 'Delivered', backordered: 'Backordered', review: 'In review' };
    return map[status] || status;
  }

  function getOrders() {
    let orders = Store.getOrders('approvals');
    if (_searchQuery.trim()) {
      const q = _searchQuery.toLowerCase();
      orders = orders.filter(o =>
        (o.name || '').toLowerCase().includes(q) ||
        (o.vendor || '').toLowerCase().includes(q) ||
        (o.poNum || '').toLowerCase().includes(q) ||
        (o.wo || '').toLowerCase().includes(q)
      );
    }
    return orders;
  }

  function renderRows() {
    const orders = getOrders();
    const tbody = document.getElementById('ap-tbody');
    if (!tbody) return;
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:48px;color:#9CA3AF;font-size:13px;">No orders pending approval.</td></tr>';
      updateBadge(0);
      return;
    }
    updateBadge(orders.length);
    tbody.innerHTML = orders.map(o => `
      <tr data-id="${o.id}" class="${o.id === _selectedOrderId ? 'selected-row' : ''}" onclick="apOpenDetail('${o.id}')">
        <td><strong style="color:#111318;">${o.vendor}</strong></td>
        <td style="font-size:11px;color:#9CA3AF;">${o.vendorId || '—'}</td>
        <td>${o.date}</td>
        <td>${o.user}</td>
        <td>${o.name}</td>
        <td>${o.wo}${o.asset && o.asset !== o.wo ? ' · ' + o.asset : ''}</td>
        <td style="font-weight:600;color:#111318;">$${(+o.amount).toFixed(2)}</td>
        <td><span class="status-pill ${statusPillClass(o.status)}">${statusLabel(o.status)}</span></td>
        <td>
          <div class="ap-actions">
            <button class="ap-action-btn ap-approve" onclick="event.stopPropagation();apApprove('${o.id}')" title="Approve"><i class="ti ti-check"></i> Approve</button>
            <button class="ap-action-btn ap-reject" onclick="event.stopPropagation();apReject('${o.id}')" title="Reject"><i class="ti ti-x"></i> Reject</button>
          </div>
        </td>
      </tr>`).join('');
  }

  function updateBadge(count) {
    const badge = document.getElementById('ap-pending-badge');
    if (badge) badge.textContent = count > 0 ? count + ' pending' : 'No items pending';
  }

  function renderDetailPanel(orderId) {
    const panel = document.getElementById('ap-detail-panel');
    if (!panel) return;
    if (!orderId) { panel.style.display = 'none'; return; }
    const o = Store.getOrders('all').find(x => x.id === orderId);
    if (!o) { panel.style.display = 'none'; return; }

    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="ap-detail-header">
        <i class="ti ti-truck-delivery" style="font-size:16px;color:#F5A623;"></i>
        <div class="ap-detail-title">${o.poNum ? o.poNum + ' · ' : ''}${o.vendor} · ${o.name}</div>
        <span class="status-pill ${statusPillClass(o.status)}" style="margin-right:8px;">${statusLabel(o.status)}</span>
        <button class="ap-detail-close" onclick="apCloseDetail()"><i class="ti ti-x"></i></button>
      </div>
      <div class="ap-detail-grid">
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Order info</div>
          <div class="ap-detail-row"><span class="ap-detail-label">Order name</span><span class="ap-detail-val">${o.name}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">PO #</span><span class="ap-detail-val">${o.poNum || '—'}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Date</span><span class="ap-detail-val">${o.date}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Requested by</span><span class="ap-detail-val">${o.user}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Total</span><span class="ap-detail-val" style="color:#111318;font-weight:700;">$${(+o.amount).toFixed(2)}</span></div>
        </div>
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Ship to / Bill to</div>
          <div class="ap-detail-row"><span class="ap-detail-label">Ship to</span><span class="ap-detail-val">Mid-County Rental, Austin</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Address</span><span class="ap-detail-val">1402 S Lamar Blvd, Austin TX</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Attn</span><span class="ap-detail-val">${o.user} · Shop</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Bill to</span><span class="ap-detail-val">Mid-County Rental Corp</span></div>
        </div>
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Work order</div>
          <div class="ap-detail-row"><span class="ap-detail-label">WO</span><span class="ap-detail-val">${o.wo}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Asset</span><span class="ap-detail-val">${o.asset}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Vendor</span><span class="ap-detail-val">${o.vendor}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Vendor ID</span><span class="ap-detail-val">${o.vendorId || '—'}</span></div>
        </div>
      </div>
      <div class="ap-panel-actions">
        <button class="ap-panel-approve" onclick="apApprove('${o.id}')"><i class="ti ti-check"></i> Approve order</button>
        <button class="ap-panel-reject" onclick="apReject('${o.id}')"><i class="ti ti-x"></i> Reject</button>
      </div>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  el.innerHTML = `
<style>
.ap-page { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
.ap-header-bar { padding: 16px 24px 12px; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.ap-heading { font-size: 18px; font-weight: 700; color: #111318; }
.ap-pending-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; background: #FDE8E8; color: #B91C1C; border-radius: 999px; padding: 4px 12px; }
.ap-filter-bar { padding: 10px 24px; background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ap-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 300px; }
.ap-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 14px; pointer-events: none; }
.ap-search { width: 100%; height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 32px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.ap-search:focus { border-color: #F5A623; }
.ap-table-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.ap-table { width: 100%; border-collapse: collapse; }
.ap-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 9px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.ap-table td { padding: 10px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.ap-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.ap-table tr.selected-row td { background: #FAEEDA; }
.status-pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pill-saved { background: #F0ECE8; color: #5A5F6E; }
.pill-submitted { background: #DBEAFE; color: #1D4ED8; }
.pill-delivered { background: #D1FAE5; color: #065F46; }
.pill-backordered { background: #FEF3C7; color: #92400E; }
.pill-review { background: #EDE9FE; color: #5B21B6; }
.ap-actions { display: flex; align-items: center; gap: 6px; }
.ap-action-btn { display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 10px; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; }
.ap-approve { background: #EAF3DE; color: #3B6D11; }
.ap-approve:hover { background: #D5EBBE; }
.ap-reject { background: #FCEBEB; color: #A32D2D; }
.ap-reject:hover { background: #F9D5D5; }
.ap-detail-panel { background: #FFFFFF; border-top: 1px solid #E8E4DF; flex-shrink: 0; max-height: 55vh; overflow-y: auto; }
.ap-detail-header { display: flex; align-items: center; gap: 12px; padding: 14px 24px; border-bottom: 0.5px solid #E8E4DF; position: sticky; top: 0; background: #FFFFFF; z-index: 2; }
.ap-detail-title { font-size: 15px; font-weight: 700; color: #111318; flex: 1; }
.ap-detail-close { width: 28px; height: 28px; background: #F5F2EE; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #5A5F6E; }
.ap-detail-close:hover { background: #E8E4DF; }
.ap-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 0.5px solid #E8E4DF; }
.ap-detail-section { padding: 14px 24px; border-right: 0.5px solid #E8E4DF; }
.ap-detail-section:last-child { border-right: none; }
.ap-detail-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.ap-detail-row { display: flex; justify-content: space-between; padding: 3px 0; }
.ap-detail-label { font-size: 12px; color: #9CA3AF; }
.ap-detail-val { font-size: 12px; font-weight: 500; color: #111318; text-align: right; }
.ap-panel-actions { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.ap-panel-approve { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 16px; background: #EAF3DE; color: #3B6D11; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.ap-panel-approve:hover { background: #D5EBBE; }
.ap-panel-reject { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 16px; background: none; color: #A32D2D; border: 1px solid #F5C5C5; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; }
.ap-panel-reject:hover { background: #FCEBEB; }
</style>
<h2 class="sr-only">Approvals</h2>
<div class="shell">
  ${buildSidebar('approvals')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Approvals</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div class="ap-page">
      <div class="ap-header-bar">
        <div>
          <div class="ap-heading">Approvals</div>
          <div style="font-size:12px;color:#7A7F8E;margin-top:2px;">Orders submitted from work orders that require your sign-off before they are sent to vendors.</div>
        </div>
        <span class="ap-pending-badge" id="ap-pending-badge">0 pending</span>
      </div>

      <div class="ap-filter-bar">
        <div class="ap-search-wrap">
          <i class="ti ti-search ap-search-icon"></i>
          <input class="ap-search" id="ap-search-input" type="text" placeholder="Search by vendor, WO, or name…"/>
        </div>
      </div>

      <div class="ap-table-wrap">
        <table class="ap-table">
          <thead>
            <tr>
              <th>Vendor</th><th>Vendor ID</th><th>Date</th><th>Requested by</th><th>Order name</th><th>WO / Equipment</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="ap-tbody"></tbody>
        </table>
      </div>

      <div id="ap-detail-panel" style="display:none;" class="ap-detail-panel"></div>
    </div>
  </div>
</div>`;

  renderRows();

  document.getElementById('ap-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    renderRows();
  });

  window.apOpenDetail = function(orderId) {
    _selectedOrderId = orderId;
    document.querySelectorAll('#ap-tbody tr').forEach(r => {
      r.classList.toggle('selected-row', r.dataset.id === orderId);
    });
    renderDetailPanel(orderId);
  };

  window.apCloseDetail = function() {
    _selectedOrderId = null;
    document.querySelectorAll('#ap-tbody tr').forEach(r => r.classList.remove('selected-row'));
    const panel = document.getElementById('ap-detail-panel');
    if (panel) panel.style.display = 'none';
  };

  window.apApprove = function(orderId) {
    Store.updateOrder(orderId, { status: 'submitted', tab: 'submitted' });
    if (_selectedOrderId === orderId) apCloseDetail();
    renderRows();
  };

  window.apReject = function(orderId) {
    Store.updateOrder(orderId, { status: 'saved', tab: 'drafts' });
    if (_selectedOrderId === orderId) apCloseDetail();
    renderRows();
  };
}
