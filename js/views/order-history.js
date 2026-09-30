function render_order_history(el) {
  let _currentTab = 'submitted';
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
        <i class="ti ti-truck-delivery" style="font-size:16px;color:#1C3969;"></i>
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
          <div class="oh-detail-section-title">Order</div>
          <div class="oh-detail-row"><span class="oh-detail-label">WO</span><span class="oh-detail-val">${o.wo}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Asset</span><span class="oh-detail-val">${o.asset}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Vendor</span><span class="oh-detail-val">${o.vendor}</span></div>
          <div class="oh-detail-row"><span class="oh-detail-label">Vendor ID</span><span class="oh-detail-val">${o.vendorId || '—'}</span></div>
        </div>
      </div>
      ${(o.items && o.items.length) ? `
      <div class="oh-items-section">
        <div class="oh-items-title"><i class="ti ti-package" style="font-size:14px;color:#9CA3AF;"></i> Line items <span style="font-size:11px;font-weight:600;background:#F0ECE8;color:#5A5F6E;border-radius:999px;padding:1px 8px;margin-left:4px;">${o.items.length}</span></div>
        <table class="oh-items-table">
          <thead><tr><th>Part #</th><th>Description</th><th>Vendor</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit</th><th style="text-align:right;">Total</th></tr></thead>
          <tbody>
            ${o.items.map(it => `
            <tr>
              <td style="font-family:monospace;font-size:11px;color:#5A5F6E;">${it.partNum || '—'}</td>
              <td>${it.description || it.name || '—'}${it.oemOnly ? ' <span style="font-size:10px;font-weight:600;background:#F5F2EE;color:#5A5F6E;border-radius:4px;padding:1px 5px;">OEM</span>' : ''}</td>
              <td style="color:#7A7F8E;">${it.vendor || '—'}</td>
              <td style="text-align:center;">×${it.qty || 1}</td>
              <td style="text-align:right;">$${(+it.price).toFixed(2)}</td>
              <td style="text-align:right;font-weight:600;color:#111318;">$${(it.price * (it.qty || 1)).toFixed(2)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="oh-items-total">Total <strong>$${(+o.amount).toFixed(2)}</strong></div>
      </div>` : ''}
      ${(() => {
        if (!Store.getCmsArticles) return '';
        const vendor = o.vendor || '';
        const msgs = Store.getCmsArticles('published').filter(a => a.showOnOrders && a.vendorName === vendor);
        if (!msgs.length) return '';
        return `<div style="padding:14px 24px;border-top:0.5px solid #E8E4DF;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#534AB7;margin-bottom:10px;display:flex;align-items:center;gap:6px;"><i class="ti ti-speakerphone" style="font-size:13px;"></i> Supplier messages</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${msgs.map(a => `<div style="background:#F5F2EE;border-radius:8px;padding:11px 13px;border-left:3px solid #534AB7;">
              <div style="font-size:11px;font-weight:700;color:#534AB7;margin-bottom:3px;">${a.vendorName}<span style="font-weight:400;color:#9CA3AF;margin-left:8px;">${a.date || ''}</span></div>
              <div style="font-size:12px;font-weight:600;color:#111318;margin-bottom:3px;">${a.title}</div>
              <div style="font-size:12px;color:#5A5F6E;line-height:1.5;">${a.body ? a.body.slice(0,250)+(a.body.length>250?'…':'') : ''}</div>
            </div>`).join('')}
          </div>
        </div>`;
      })()}
      <div class="oh-comments">
        <div class="oh-comments-label">Comments</div>
        <input class="oh-comment-input" type="text" placeholder="Add a comment…"/>
      </div>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updateTabBadges() {
    const tabs = {
      local: Store.getOrders('local').length,
      review: Store.getOrders('review').length,
      submitted: Store.getOrders('submitted').length,
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
.oh-tab.active { color: #111318; font-weight: 600; border-bottom-color: #1C3969; }
.oh-tab-badge { font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 7px; }
.oh-badge-neutral { background: #F0ECE8; color: #5A5F6E; }
.oh-badge-red { background: #FDE8E8; color: #B91C1C; }
.oh-filter-bar { padding: 10px 24px; background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.oh-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 260px; }
.oh-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 14px; pointer-events: none; }
.oh-search { width: 100%; height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 32px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.oh-search:focus { border-color: #1C3969; }
.oh-select { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #3A3D4A; outline: none; cursor: pointer; }
.oh-btn-ghost { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 12px; font-weight: 500; font-family: inherit; color: #3A3D4A; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.oh-btn-ghost:hover { background: #F5F2EE; }
.oh-btn-primary { height: 34px; background: #1C3969; border: none; border-radius: 7px; padding: 0 14px; font-size: 12px; font-weight: 600; font-family: inherit; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.oh-btn-primary:hover { background: #152B52; }
.oh-btn-ghost-ml { margin-left: auto; }
.oh-table-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.oh-table { width: 100%; border-collapse: collapse; }
.oh-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 9px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.oh-table td { padding: 10px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.oh-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.oh-table tr.selected-row td { background: #D6E4F7; }
.status-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pill-saved { background: #F0ECE8; color: #5A5F6E; }
.pill-submitted { background: #DBEAFE; color: #1D4ED8; }
.pill-delivered { background: #DBEAFE; color: #1C3969; }
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
.oh-items-section { border-top: 0.5px solid #E8E4DF; }
.oh-items-title { display: flex; align-items: center; gap: 6px; padding: 12px 24px 8px; font-size: 12px; font-weight: 600; color: #5A5F6E; text-transform: uppercase; letter-spacing: 0.8px; }
.oh-items-table { width: 100%; border-collapse: collapse; }
.oh-items-table th { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 6px 24px; text-align: left; background: #FAFAF8; border-top: 0.5px solid #F0ECE8; border-bottom: 0.5px solid #F0ECE8; }
.oh-items-table td { padding: 8px 24px; font-size: 12px; color: #3A3D4A; border-bottom: 0.5px solid #F5F2EE; vertical-align: middle; }
.oh-items-table tr:last-child td { border-bottom: none; }
.oh-items-total { padding: 10px 24px; font-size: 12px; color: #7A7F8E; text-align: right; border-top: 0.5px solid #F0ECE8; }
.oh-comments { padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.oh-comments-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; }
.oh-comment-input { width: 100%; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
</style>
<h2 class="sr-only">Order History</h2>
<div class="shell">
  ${buildSidebar('order-history')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('home')">Home</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Order history</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;" id="oh-content">
      <div class="oh-tabs" id="oh-tabs">
        <div class="oh-tab active" data-tab="submitted">Submitted <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="review">In review <span class="oh-tab-badge oh-badge-neutral">0</span></div>
        <div class="oh-tab" data-tab="local">Local <span class="oh-tab-badge oh-badge-neutral">0</span></div>
      </div>

      <div class="oh-filter-bar">
        <div class="oh-search-wrap">
          <i class="ti ti-search oh-search-icon"></i>
          <input class="oh-search" id="oh-search-input" type="text" placeholder="Search orders…"/>
        </div>
        <select class="oh-select"><option>All vendors</option><option>Skyjack</option><option>Parker</option><option>Grainger</option></select>
        <button class="oh-btn-ghost oh-btn-ghost-ml"><i class="ti ti-download"></i> Export</button>
        <button class="oh-btn-ghost" onclick="ohManageMessages()" style="color:#534AB7;border-color:#C8C3F2;"><i class="ti ti-speakerphone" style="font-size:12px;"></i> Manage messages</button>
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

  const OH_PLACEMENTS = [
    { id: 'cart-top',         label: 'Top of cart' },
    { id: 'order-form-top',   label: 'Top of order form' },
    { id: 'order-form-bottom',label: 'Bottom of order form' },
  ];

  function _ohMsgList() {
    if (!Store.getCmsArticles) return [];
    return Store.getCmsArticles('published').filter(a => !!a.orderMsg);
  }

  function _ohBuildMsgRow(a) {
    const pl = OH_PLACEMENTS.find(p => p.id === a.placement) || { label: a.placement || '—' };
    return `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-bottom:0.5px solid #F0ECE8;">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
          <span style="font-size:9px;font-weight:700;color:#534AB7;text-transform:uppercase;letter-spacing:.5px;background:#EEEDFE;padding:2px 6px;border-radius:3px;">${pl.label}</span>
          <span style="font-size:11px;font-weight:600;color:#111318;">${a.title}</span>
        </div>
        <div style="font-size:11px;color:#7A7F8E;">${a.body ? a.body.slice(0,120)+(a.body.length>120?'…':'') : ''}</div>
        ${a.date ? `<div style="font-size:10px;color:#B0AAA3;margin-top:2px;">${a.date}</div>` : ''}
      </div>
      <button onclick="ohDeleteMsg('${a.id}')" style="background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:4px 8px;font-size:11px;color:#D9534F;cursor:pointer;font-family:inherit;flex-shrink:0;">Remove</button>
    </div>`;
  }

  window.ohManageMessages = function() {
    const msgs = _ohMsgList();
    const locs = Store.getLocations ? Store.getLocations() : [];
    const locOpts = locs.map((l, i) => `<label style="display:flex;align-items:center;gap:8px;padding:${i===locs.length-1?'':''}4px 0;cursor:pointer;">
      <input type="checkbox" class="oh-loc-cb" value="${l.id}" checked style="accent-color:#1C3969;width:12px;height:12px;">
      <span style="font-size:11px;color:#5A5F6E;">${l.name}</span>
    </label>`).join('');

    const listHtml = msgs.length
      ? msgs.map(_ohBuildMsgRow).join('')
      : '<div style="font-size:13px;color:#9CA3AF;text-align:center;padding:20px 0;">No order messages yet.</div>';

    Modal.show({
      title: 'Order Messages',
      body: `<div style="max-height:480px;overflow-y:auto;margin:-16px;">
        <div style="padding:14px 16px;border-bottom:0.5px solid #F0ECE8;">
          <div style="font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px;">Add new message</div>
          <div style="display:grid;gap:7px;">
            <input id="oh-msg-title" type="text" placeholder="Message title *" style="width:100%;height:32px;border:0.5px solid #E2DDD8;border-radius:6px;padding:0 10px;font-size:12px;font-family:inherit;color:#111318;outline:none;background:#fff;"/>
            <textarea id="oh-msg-body" placeholder="Message content *" style="width:100%;min-height:56px;border:0.5px solid #E2DDD8;border-radius:6px;padding:7px 10px;font-size:12px;font-family:inherit;color:#111318;outline:none;resize:none;background:#fff;"></textarea>
            <select id="oh-msg-placement" style="height:32px;border:0.5px solid #E2DDD8;border-radius:6px;padding:0 10px;font-size:12px;font-family:inherit;color:#111318;outline:none;background:#fff;">
              ${OH_PLACEMENTS.map(p => `<option value="${p.id}">${p.label}</option>`).join('')}
            </select>
            ${locs.length > 1 ? `<div style="border:0.5px solid #E2DDD8;border-radius:8px;overflow:hidden;">
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#F5F2EE;border-bottom:0.5px solid #E2DDD8;cursor:pointer;">
                <input type="checkbox" id="oh-loc-all" checked onchange="document.querySelectorAll('.oh-loc-cb').forEach(cb=>cb.checked=this.checked)" style="accent-color:#1C3969;width:12px;height:12px;">
                <span style="font-size:11px;font-weight:600;color:#111318;">All locations</span>
              </label>
              <div style="padding:6px 10px;">${locOpts}</div>
            </div>` : ''}
            <button onclick="ohSaveMsg()" style="height:32px;background:#1C3969;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;font-family:inherit;cursor:pointer;">Add message</button>
          </div>
        </div>
        <div>
          <div style="padding:10px 16px 4px;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#534AB7;">Active messages (${msgs.length})</div>
          ${listHtml}
        </div>
      </div>`,
      actions: [{ label: 'Done', onClick: function() { Modal.close(); } }],
    });
  };

  window.ohSaveMsg = function() {
    const title = document.getElementById('oh-msg-title')?.value.trim();
    const body  = document.getElementById('oh-msg-body')?.value.trim();
    const placement = document.getElementById('oh-msg-placement')?.value || 'cart-top';
    if (!title || !body) { alert('Title and message content are required.'); return; }
    const locs = Store.getLocations ? Store.getLocations() : [];
    const allChecked = document.getElementById('oh-loc-all')?.checked !== false;
    const selLocs = allChecked ? ['all'] : Array.from(document.querySelectorAll('.oh-loc-cb:checked')).map(cb => cb.value);
    const _u = Store.getCurrentUser ? Store.getCurrentUser() : null;
    Store.saveCmsArticle({
      id: 'oh-msg-' + Date.now(),
      type: 'notice', subtype: 'order-message', status: 'published', postAs: 'orders',
      title, body, placement,
      orderMsg: true,
      fleetNote: true,
      showOnOrders: true,
      poster: (_u || {}).shortName || '',
      author: (_u || {}).displayName || '',
      date: new Date().toISOString().slice(0,7).replace('-','/'),
      locations: selLocs,
      priority: 'low',
    });
    Modal.close();
    ohManageMessages();
  };

  window.ohDeleteMsg = function(id) {
    if (Store.deleteCmsArticle) Store.deleteCmsArticle(id);
    Modal.close();
    ohManageMessages();
  };

  // Trigger initial tab
  document.querySelector('.oh-tab.active').click();
}
