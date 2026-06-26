function render_order_history(el) {
  let _currentTab = 'drafts';
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

  function getDisplayOrders() {
    let orders = Store.getOrders(_currentTab);
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
    const orders = getDisplayOrders();
    const tbody = document.getElementById('oh-tbody');
    if (!tbody) return;
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:32px;color:#9CA3AF;font-size:13px;">No orders found.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => {
      const isApprovals = _currentTab === 'approvals';
      const approvalBtns = isApprovals ? `
        <div class="oh-actions">
          <button class="oh-action-btn" style="background:#EAF3DE;color:#3B6D11;" onclick="event.stopPropagation();ohApprove('${o.id}')"><i class="ti ti-check"></i></button>
          <button class="oh-action-btn" style="background:#FCEBEB;color:#A32D2D;" onclick="event.stopPropagation();ohReject('${o.id}')"><i class="ti ti-x"></i></button>
        </div>` : `
        <div class="oh-actions">
          <button class="oh-action-btn" onclick="event.stopPropagation();ohOpenDetail('${o.id}')"><i class="ti ti-eye"></i></button>
          <button class="oh-action-btn"><i class="ti ti-dots"></i></button>
        </div>`;
      return `
        <tr data-id="${o.id}" class="${o.id === _selectedOrderId ? 'selected-row' : ''}" onclick="ohOpenDetail('${o.id}')">
          <td><strong style="color:#111318;">${o.vendor}</strong></td>
          <td style="font-size:11px;color:#9CA3AF;">${o.vendorId || '—'}</td>
          <td>${o.date}</td>
          <td>${o.user}</td>
          <td>${o.name}</td>
          <td>${o.wo}${o.asset && o.asset !== o.wo ? ' · ' + o.asset : ''}</td>
          <td style="font-weight:600;color:#111318;">$${(+o.amount).toFixed(2)}</td>
          <td><span class="status-pill ${statusPillClass(o.status)}">${statusLabel(o.status)}</span></td>
          <td style="font-size:11px;color:#9CA3AF;">${o.poNum || '—'}</td>
          <td>${approvalBtns}</td>
        </tr>`;
    }).join('');
  }

  function renderDetailPanel(orderId) {
    const panel = document.getElementById('oh-detail-panel');
    if (!panel) return;
    if (!orderId) { panel.style.display = 'none'; return; }
    const o = Store.getOrders('all').find(x => x.id === orderId);
    if (!o) { panel.style.display = 'none'; return; }

    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="oh-detail-header">
        <i class="ti ti-truck-delivery" style="font-size:16px;color:#F5A623;"></i>
        <div class="oh-detail-title">${o.poNum ? o.poNum + ' · ' : ''}${o.vendor} · ${o.name}</div>
        <span class="status-pill ${statusPillClass(o.status)}" style="margin-right:8px;">${statusLabel(o.status)}</span>
        <button class="oh-detail-close" onclick="ohCloseDetail()"><i class="ti ti-x"></i></button>
      </div>
      <div class="oh-detail-grid">
        <div class="oh-detail-section">
          <div class="oh-detail-section-title">Order info</div>
          <div class="oh-detail-row"><span class="oh-detail-label">Order name</span><span class="oh-detail-val">${o.name}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">PO #</span><span class="oh-detail-val">${o.poNum || '—'}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Date</span><span class="oh-detail-val">${o.date}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Ordered by</span><span class="oh-detail-val">${o.user}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Total</span><span class="oh-detail-val" style="color:#111318;font-weight:700;">$${(+o.amount).toFixed(2)}</span></div>
        </div>
        <div class="oh-detail-section">
          <div class="oh-detail-section-title">Ship to / Bill to</div>
          <div class="oh-detail-row"><span class="oh-detail-label">Ship to</span><span class="oh-detail-val">Mid-County Rental, Austin</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Address</span><span class="oh-detail-val">1402 S Lamar Blvd, Austin TX</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Attn</span><span class="oh-detail-val">${o.user} · Shop</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Bill to</span><span class="oh-detail-val">Mid-County Rental Corp</span></div>
        </div>
        <div class="oh-detail-section">
          <div class="oh-detail-section-title">Work order</div>
          <div class="oh-detail-row"><span class="oh-detail-label">WO</span><span class="oh-detail-val">${o.wo}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Asset</span><span class="oh-detail-val">${o.asset}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Vendor</span><span class="oh-detail-val">${o.vendor}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Vendor ID</span><span class="oh-detail-val">${o.vendorId || '—'}</span></div>
        </div>
      </div>
      <div class="oh-comments">
        <div class="oh-comments-label">Comments</div>
        <input class="oh-comment-input" type="text" placeholder="Add a comment…"/>
      </div>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updateTabBadges() {
    const tabs = {
      drafts: Store.getOrders('drafts').length,
      local: Store.getOrders('local').length,
      review: Store.getOrders('review').length,
      submitted: Store.getOrders('submitted').length,
      approvals: Store.getOrders('approvals').length,
    };
    Object.entries(tabs).forEach(([tab, count]) => {
      const el2 = document.querySelector(`.oh-tab[data-tab="${tab}"] .oh-tab-badge`);
      if (el2) el2.textContent = count;
    });
  }

  el.innerHTML = `
<style>
.oh-tabs { display: flex; align-items: center; gap: 2px; padding: 0 24px; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; flex-wrap: wrap; }
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
.oh-btn-primary { height: 34px; background: #F5A623; border: none; border-radius: 7px; padding: 0 14px; font-size: 12px; font-weight: 600; font-family: inherit; color: #1A1200; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.oh-btn-primary:hover { background: #E8980F; }
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
.oh-comments { padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.oh-comments-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; }
.oh-comment-input { width: 100%; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
/* modal form */
.modal-form-field { margin-bottom: 14px; }
.modal-form-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.modal-form-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.modal-form-input:focus { border-color: #F5A623; }
.modal-form-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.modal-field-error { font-size: 11px; color: #A32D2D; margin-top: 3px; display: none; }
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
        <div class="oh-tab active" data-tab="drafts">Drafts <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="local">Local <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="review">In review <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="submitted">Submitted <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="approvals">Manage approvals <span class="oh-tab-badge oh-badge-red">0</span></div>
      </div>

      <div class="oh-filter-bar">
        <div class="oh-search-wrap">
          <i class="ti ti-search oh-search-icon"></i>
          <input class="oh-search" id="oh-search-input" type="text" placeholder="Search orders…"/>
        </div>
        <select class="oh-select"><option>All vendors</option><option>Skyjack</option><option>Parker</option><option>Grainger</option></select>
        <button class="oh-btn-primary" id="oh-new-order-btn"><i class="ti ti-plus" style="font-size:13px;"></i> New Order</button>
        <button class="oh-btn-ghost oh-btn-ghost-ml"><i class="ti ti-download"></i> Export</button>
      </div>

      <div class="oh-table-wrap">
        <table class="oh-table">
          <thead>
            <tr>
              <th>Vendor</th><th>Vendor ID</th><th>Date</th><th>User</th><th>Order name</th><th>WO / Equipment</th><th>Amount</th><th>Status</th><th>PO #</th><th></th>
            </tr>
          </thead>
          <tbody id="oh-tbody"></tbody>
        </table>
      </div>

      <div id="oh-detail-panel" style="display:none;" class="oh-detail-panel"></div>

      <div class="oh-pagination">
        <span style="color:#9CA3AF;">Showing orders</span>
      </div>
    </div>
  </div>
</div>`;

  updateTabBadges();
  renderRows();

  // Tab switching
  document.getElementById('oh-tabs').querySelectorAll('.oh-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#oh-tabs .oh-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      _currentTab = this.dataset.tab;
      _selectedOrderId = null;
      renderRows();
      renderDetailPanel(null);
    });
  });

  // Search
  document.getElementById('oh-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    renderRows();
  });

  // New Order button
  document.getElementById('oh-new-order-btn').addEventListener('click', function() {
    const wos = Store.getWorkOrders('all');
    const woOptions = wos.map(w => `<option value="WO #${w.id}">${w.machine} — WO #${w.id}</option>`).join('');

    const formHtml = `
      <div class="modal-form-field">
        <label class="modal-form-label">Order name *</label>
        <input class="modal-form-input" id="no-name" type="text" placeholder="e.g. Hydraulic seals — WO #100094"/>
        <div class="modal-field-error" id="no-name-err">Required</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field">
          <label class="modal-form-label">Vendor *</label>
          <select class="modal-form-select" id="no-vendor">
            <option value="">Select vendor</option>
            <option>Skyjack</option>
            <option>Parker</option>
            <option>Grainger</option>
            <option>Caterpillar</option>
            <option>Toyota</option>
          </select>
          <div class="modal-field-error" id="no-vendor-err">Required</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Work order</label>
          <select class="modal-form-select" id="no-wo">
            <option value="General">General (no WO)</option>
            ${woOptions}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field">
          <label class="modal-form-label">Amount ($) *</label>
          <input class="modal-form-input" id="no-amount" type="number" min="0" step="0.01" placeholder="0.00"/>
          <div class="modal-field-error" id="no-amount-err">Required</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Status</label>
          <select class="modal-form-select" id="no-status">
            <option value="saved">Draft (saved)</option>
            <option value="submitted">Submit now</option>
            <option value="review">Send for review</option>
          </select>
        </div>
      </div>`;

    Modal.show({
      title: 'New Order',
      body: formHtml,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Create Order', primary: true, onClick: () => {
            const name = document.getElementById('no-name').value.trim();
            const vendor = document.getElementById('no-vendor').value.trim();
            const amountRaw = document.getElementById('no-amount').value.trim();
            let valid = true;
            if (!name) { document.getElementById('no-name-err').style.display = 'block'; valid = false; } else document.getElementById('no-name-err').style.display = 'none';
            if (!vendor) { document.getElementById('no-vendor-err').style.display = 'block'; valid = false; } else document.getElementById('no-vendor-err').style.display = 'none';
            if (!amountRaw) { document.getElementById('no-amount-err').style.display = 'block'; valid = false; } else document.getElementById('no-amount-err').style.display = 'none';
            if (!valid) return;
            const status = document.getElementById('no-status').value;
            const tabMap = { saved: 'drafts', submitted: 'submitted', review: 'review' };
            Store.addOrder({
              name, vendor,
              wo: document.getElementById('no-wo').value,
              amount: parseFloat(amountRaw),
              status,
              tab: tabMap[status] || 'drafts',
            });
            Modal.close();
            updateTabBadges();
            renderRows();
          }
        }
      ]
    });
  });

  window.ohOpenDetail = function(orderId) {
    _selectedOrderId = orderId;
    // Highlight row
    document.querySelectorAll('#oh-tbody tr').forEach(r => {
      r.classList.toggle('selected-row', r.dataset.id === orderId);
    });
    renderDetailPanel(orderId);
  };

  window.ohCloseDetail = function() {
    _selectedOrderId = null;
    document.querySelectorAll('#oh-tbody tr').forEach(r => r.classList.remove('selected-row'));
    const panel = document.getElementById('oh-detail-panel');
    if (panel) panel.style.display = 'none';
  };

  window.ohApprove = function(orderId) {
    Store.updateOrder(orderId, { status: 'submitted', tab: 'submitted' });
    updateTabBadges();
    renderRows();
  };

  window.ohReject = function(orderId) {
    Store.updateOrder(orderId, { status: 'saved', tab: 'drafts' });
    updateTabBadges();
    renderRows();
  };

  // Trigger initial tab
  document.querySelector('.oh-tab.active').click();
}
