function render_approvals(el) {
  const _user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  const _feat = (_user && Store.getEffectiveFeatures) ? Store.getEffectiveFeatures(_user.id) : {};
  const _canApprovals = 'approvals' in _feat ? _feat.approvals : _user?.role === 'supervisor';
  if (!_user || !_canApprovals) {
    el.innerHTML = `<div class="shell">${buildSidebar('approvals')}<div class="main"><div style="padding:60px;text-align:center;color:#9CA3AF;font-size:14px;"><i class="ti ti-lock" style="font-size:32px;display:block;margin-bottom:12px;"></i>You don't have access to Approvals.<br><a style="color:#1C3969;cursor:pointer;margin-top:10px;display:inline-block;" onclick="Router.navigate('home')">Back to Home</a></div></div></div>`;
    return;
  }

  let _searchQuery = '';
  let _selectedOrderId = null;
  let _editItems = [];
  let _originalItems = [];

  // ─── helpers ───────────────────────────────────────────────────────────────

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

  function approvalTypeBadge(o) {
    if (o.approvalType === 'limit_exceeded') {
      const limit = o.buyerLimit ? '$' + (+o.buyerLimit).toLocaleString() : 'limit';
      return `<span class="ap-type-badge ap-type-limit"><i class="ti ti-alert-triangle" style="font-size:10px;"></i> Over ${limit}</span>`;
    }
    if (o.approvalType === 'cart_only') {
      return `<span class="ap-type-badge ap-type-cart"><i class="ti ti-shopping-cart" style="font-size:10px;"></i> Cart-only user</span>`;
    }
    return `<span class="ap-type-badge ap-type-limit"><i class="ti ti-alert-triangle" style="font-size:10px;"></i> Needs review</span>`;
  }

  function calcTotal(items) {
    return items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  }

  // ─── table rows ────────────────────────────────────────────────────────────

  function renderRows() {
    const orders = getOrders();
    const tbody = document.getElementById('ap-tbody');
    if (!tbody) return;
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:48px;color:#9CA3AF;font-size:13px;">No orders pending approval.</td></tr>';
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
        <td>${approvalTypeBadge(o)}</td>
        <td><span class="status-pill ${statusPillClass(o.status)}">${statusLabel(o.status)}</span></td>
        <td>
          <div class="ap-actions">
            ${rowActions(o)}
          </div>
        </td>
      </tr>`).join('');
  }

  function rowActions(o) {
    if (o.approvalType === 'cart_only') {
      return `<button class="ap-action-btn ap-approve" onclick="event.stopPropagation();apContinue('${o.id}')" title="Continue to order"><i class="ti ti-arrow-right"></i> Continue</button>
              <button class="ap-action-btn ap-reject" onclick="event.stopPropagation();apReject('${o.id}')" title="Reject"><i class="ti ti-x"></i> Reject</button>`;
    }
    return `<button class="ap-action-btn ap-approve" onclick="event.stopPropagation();apApprove('${o.id}')" title="Approve"><i class="ti ti-check"></i> Approve</button>
            <button class="ap-action-btn ap-reject" onclick="event.stopPropagation();apReject('${o.id}')" title="Reject"><i class="ti ti-x"></i> Reject</button>`;
  }

  function updateBadge(count) {
    const badge = document.getElementById('ap-pending-badge');
    if (badge) badge.textContent = count > 0 ? count + ' pending' : 'No items pending';
  }

  // ─── cart rendering — mirrors wo-detail's renderCart exactly ───────────────

  function itemStatus(c) {
    if (c.replacedBy) return 'replaced';
    if (c.replacesId) return c.inStock ? 'orderable' : 'needs_attention';
    const hasMand = (c.crossRefs || []).some(r => r.mandatory);
    if (!c.inStock && !(c.crossRefs || []).length) return 'unorderable';
    if (hasMand) return 'blocked';
    if (!c.inStock) return 'needs_attention';
    if ((c.localInventory || []).length && !c.selectedSources && !c.selectedSource) return 'needs_attention';
    return 'orderable';
  }

  function statusCell(c) {
    const st = itemStatus(c);
    if (st === 'replaced') return `<div class="ci-status" style="color:#C8C3BC;"><i class="ti ti-replace"></i></div>`;
    if (st === 'blocked') return `<div class="ci-status ci-err"><i class="ti ti-lock"></i></div>`;
    const tip = !c.inStock ? 'Backordered' : 'Ready to order';
    if (st === 'orderable') return `<div class="ci-status ci-ok"><i class="ti ti-circle-check"></i></div>`;
    if (st === 'needs_attention') return `<div class="ci-status ci-warn"><i class="ti ti-alert-triangle"></i></div>`;
    return `<div class="ci-status ci-err"><i class="ti ti-circle-x"></i></div>`;
  }

  function xrefBadge(c) {
    if (c.replacedBy || c.replacesId) return '';
    const refs = c.crossRefs || [];
    if (!refs.length) return '';
    if (refs.some(r => r.mandatory)) {
      return `<span class="ci-xref ci-xref-mand"><i class="ti ti-switch-horizontal" style="font-size:10px;"></i> Mandatory cross-ref</span>`;
    }
    return `<span class="ci-xref ci-xref-opt"><i class="ti ti-switch-horizontal" style="font-size:10px;"></i> ${refs.length} optional cross-ref${refs.length !== 1 ? 's' : ''}</span>`;
  }

  function localCell(c) {
    if (c.replacedBy) return '<span class="ci-dash">—</span>';
    const sources = c.selectedSources || (c.selectedSource ? [c.selectedSource] : []);
    if (sources.length) {
      const srcQty = sources.reduce((s, x) => s + (x.qty || 0), 0);
      const label = sources.length === 1 ? sources[0].locationName : sources.length + ' locations';
      return `<span class="ci-local ci-local-sel"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${label}${srcQty ? ' (' + srcQty + ')' : ''}</span>`;
    }
    const inv = c.localInventory || [];
    if (!inv.length) return '<span class="ci-dash">—</span>';
    const total = inv.reduce((s, l) => s + l.qty, 0);
    return `<span class="ci-local"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${total} avail</span>`;
  }

  function itemRow(c, idx) {
    const replaced = !!c.replacedBy;
    const rowStyle = replaced ? 'opacity:0.45;' : '';
    const descStyle = replaced ? 'text-decoration:line-through;color:#9CA3AF;' : '';
    const partStyle = replaced ? 'text-decoration:line-through;color:#9CA3AF;' : '';
    const replacesOrig = c.replacesId ? _editItems.find(x => x.id === c.replacesId) : null;
    return `<tr class="cart-row" style="${rowStyle}">
      <td class="col-st">${statusCell(c)}</td>
      <td class="col-pn">
        <div class="ci-partnum" style="${partStyle}">${c.partNum || '—'}</div>
        <div class="ci-vendor-line">${c.vendor || '—'}${c.oemOnly ? ' <span class="oem-badge">OEM</span>' : ''}</div>
      </td>
      <td class="col-desc">
        <div class="ci-desc-name" style="${descStyle}">${c.description || c.name || '—'}</div>
        ${replacesOrig ? `<div style="font-size:10px;color:#7A7F8E;margin-top:2px;display:flex;align-items:center;gap:3px;"><i class="ti ti-arrows-exchange" style="font-size:10px;"></i> Replaces ${replacesOrig.partNum}</div>` : ''}
        <div style="display:flex;align-items:center;gap:5px;margin-top:3px;">${xrefBadge(c)}</div>
      </td>
      <td class="col-uom"><span class="uom-badge">${c.uom || 'EA'}</span></td>
      <td class="col-loc">${localCell(c)}</td>
      <td class="col-qty">
        ${replaced ? '<span style="color:#C8C3BC;font-size:12px;">—</span>' : `<div class="ci-qty-ctrl">
          <button class="qty-btn" onclick="apQtyAdj(${idx},-1)">−</button>
          <span class="qty-val">${c.qty || 1}</span>
          <button class="qty-btn" onclick="apQtyAdj(${idx},1)">+</button>
        </div>`}
      </td>
      <td class="col-unit" style="text-align:right;font-size:12px;color:#7A7F8E;">${replaced ? '—' : '$' + c.price.toFixed(2)}</td>
      <td class="col-tot" style="text-align:right;font-size:13px;font-weight:700;color:${replaced ? '#C8C3BC' : '#111318'};">${replaced ? '—' : '$' + (c.price * (c.qty || 1)).toFixed(2)}</td>
      <td class="col-rm">${replaced ? '' : `<button class="ci-remove" onclick="apRemoveItem(${idx})" title="Remove"><i class="ti ti-trash" style="font-size:13px;"></i></button>`}</td>
    </tr>`;
  }

  function renderCartTable() {
    const wrap = document.getElementById('ap-cart-wrap');
    const totalEl = document.getElementById('ap-items-total');
    const badgeEl = document.getElementById('ap-items-badge');
    if (!wrap) return;

    if (!_editItems.length) {
      wrap.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:13px;">No line items.</div>';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    // Build units (cross-ref pairs stay together)
    const rendered = new Set();
    const units = [];
    _editItems.forEach((c, idx) => {
      if (rendered.has(idx)) return;
      if (c.replacesId) return;
      rendered.add(idx);
      if (c.replacedBy) {
        const repIdx = _editItems.findIndex(x => x.id === c.replacedBy);
        if (repIdx !== -1 && !rendered.has(repIdx)) {
          rendered.add(repIdx);
          units.push([{ c, idx }, { c: _editItems[repIdx], idx: repIdx }]);
          return;
        }
      }
      units.push([{ c, idx }]);
    });
    _editItems.forEach((c, idx) => { if (!rendered.has(idx)) units.push([{ c, idx }]); });

    const theadHtml = `<thead><tr>
      <th class="col-st"></th>
      <th class="col-pn">Part #</th>
      <th class="col-desc">Description</th>
      <th class="col-uom">UOM</th>
      <th class="col-loc">Source / stock</th>
      <th class="col-qty" style="text-align:center;">Qty</th>
      <th class="col-unit" style="text-align:right;">Unit</th>
      <th class="col-tot" style="text-align:right;">Total</th>
      <th class="col-rm"></th>
    </tr></thead>`;

    const bodyHtml = units.map((unit, ui) => {
      const sep = ui > 0 ? `<tr class="cart-unit-sep"><td colspan="9"></td></tr>` : '';
      if (unit.length === 2) {
        const [orig, rep] = unit;
        return `${sep}<tbody class="cart-unit-pair">
          ${itemRow(orig.c, orig.idx)}
          <tr class="cart-xref-label-row"><td colspan="9"><div class="cart-xref-label"><i class="ti ti-arrows-exchange" style="font-size:10px;"></i> Cross-ref applied — replaced by</div></td></tr>
          ${itemRow(rep.c, rep.idx)}
        </tbody>`;
      }
      return `${sep}<tbody class="cart-unit-single">${itemRow(unit[0].c, unit[0].idx)}</tbody>`;
    }).join('');

    wrap.innerHTML = `<table class="wod-cart-table">${theadHtml}${bodyHtml}</table>`;

    if (totalEl) totalEl.textContent = '$' + calcTotal(_editItems).toFixed(2);
    if (badgeEl) badgeEl.textContent = _editItems.length;
  }

  // ─── detail panel ──────────────────────────────────────────────────────────

  function renderDetailPanel(orderId) {
    const panel = document.getElementById('ap-detail-panel');
    if (!panel) return;
    if (!orderId) { panel.style.display = 'none'; return; }
    const o = Store.getOrders('all').find(x => x.id === orderId);
    if (!o) { panel.style.display = 'none'; return; }

    _editItems = (o.items || []).map(it => Object.assign({}, it));
    _originalItems = (o.items || []).map(it => Object.assign({}, it));

    const isCartOnly = o.approvalType === 'cart_only';
    const isLimitExceeded = o.approvalType === 'limit_exceeded';

    let banner = '';
    if (isLimitExceeded && o.buyerLimit) {
      banner = `<div class="ap-type-banner ap-banner-limit">
        <i class="ti ti-alert-triangle" style="font-size:14px;flex-shrink:0;margin-top:1px;"></i>
        <div><strong>${o.user}</strong> has a <strong>$${(+o.buyerLimit).toLocaleString()}</strong> buyer limit — this order totals <strong>$${(+o.amount).toFixed(2)}</strong>. Approve to override the limit and submit to vendor.</div>
      </div>`;
    } else if (isCartOnly) {
      banner = `<div class="ap-type-banner ap-banner-cart">
        <i class="ti ti-shopping-cart" style="font-size:14px;flex-shrink:0;margin-top:1px;"></i>
        <div><strong>${o.user}</strong> is a cart-only user and cannot submit orders directly. Review the items below, then continue to the order screen to submit — or reject.</div>
      </div>`;
    }

    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="ap-detail-header">
        <i class="ti ti-truck-delivery" style="font-size:16px;color:#1C3969;"></i>
        <div class="ap-detail-title">${o.poNum ? o.poNum + ' · ' : ''}${o.vendor} · ${o.name}</div>
        <span class="status-pill ${statusPillClass(o.status)}" style="margin-right:4px;">${statusLabel(o.status)}</span>
        ${approvalTypeBadge(o)}
        <button class="ap-detail-close" onclick="apCloseDetail()"><i class="ti ti-x"></i></button>
      </div>
      ${banner}
      <div class="ap-detail-grid">
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Order info</div>
          <div class="ap-detail-row"><span class="ap-detail-label">Order name</span><span class="ap-detail-val">${o.name}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">PO #</span><span class="ap-detail-val">${o.poNum || '—'}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Date</span><span class="ap-detail-val">${o.date}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Requested by</span><span class="ap-detail-val">${o.user}</span></div>
        </div>
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Ship to / Bill to</div>
          <div class="ap-detail-row"><span class="ap-detail-label">Ship to</span><span class="ap-detail-val">Mid-County Rental, Austin</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Address</span><span class="ap-detail-val">1402 S Lamar Blvd, Austin TX</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Attn</span><span class="ap-detail-val">${o.user} · Shop</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Bill to</span><span class="ap-detail-val">Mid-County Rental Corp</span></div>
        </div>
        <div class="ap-detail-section">
          <div class="ap-detail-section-title">Order</div>
          <div class="ap-detail-row"><span class="ap-detail-label">WO</span><span class="ap-detail-val">${o.wo}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Asset</span><span class="ap-detail-val">${o.asset}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Vendor</span><span class="ap-detail-val">${o.vendor}</span></div>
          <div class="ap-detail-row"><span class="ap-detail-label">Vendor ID</span><span class="ap-detail-val">${o.vendorId || '—'}</span></div>
        </div>
      </div>
      <div class="ap-items-section">
        <div class="ap-items-header">
          <div style="display:flex;align-items:center;gap:6px;">
            <i class="ti ti-package" style="font-size:14px;color:#9CA3AF;"></i>
            <span>Line items</span>
            <span class="ap-items-badge" id="ap-items-badge">${_editItems.length}</span>
          </div>
          <div style="font-size:11px;color:#9CA3AF;">Modify quantities or remove items before acting</div>
        </div>
        <div id="ap-cart-wrap"></div>
        <div class="ap-items-total-row">Order total <strong id="ap-items-total">$0.00</strong></div>
      </div>
      ${renderTimeline(o)}
      <div class="ap-panel-actions">
        ${isCartOnly
          ? `<button class="ap-panel-approve" onclick="apContinue('${o.id}')"><i class="ti ti-arrow-right"></i> Continue to order screen</button>`
          : `<button class="ap-panel-approve" onclick="apApprove('${o.id}')"><i class="ti ti-check"></i> Approve &amp; submit</button>`
        }
        <button class="ap-panel-reject" onclick="apReject('${o.id}')"><i class="ti ti-x"></i> Reject</button>
        <span id="ap-edit-indicator" style="display:none;font-size:11px;color:#1C3969;margin-left:4px;"><i class="ti ti-pencil" style="font-size:11px;"></i> Edits will be saved and noted on approve/continue</span>
      </div>`;
    renderCartTable();
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderTimeline(o) {
    const notes = o.notes || [];
    if (!notes.length) return '';
    return `<div class="ap-timeline">
      <div class="ap-timeline-title"><i class="ti ti-history" style="font-size:12px;"></i> Activity</div>
      ${notes.map(n => `<div class="ap-timeline-entry">
        <div class="ap-timeline-dot"></div>
        <div class="ap-timeline-body">
          <span class="ap-timeline-author">${n.author || 'System'}</span>
          <span class="ap-timeline-time">${n.time || ''}</span>
          <div class="ap-timeline-text">${n.text}</div>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // ─── edit helpers ──────────────────────────────────────────────────────────

  function markEdited() {
    const ind = document.getElementById('ap-edit-indicator');
    if (ind) ind.style.display = 'inline-flex';
  }

  function diffItems(original, edited) {
    const changes = [];
    const origMap = {};
    original.forEach(it => { origMap[it.id] = it; });
    const editMap = {};
    edited.forEach(it => { editMap[it.id] = it; });
    original.forEach(it => { if (!editMap[it.id]) changes.push(`Removed: ${it.partNum || it.description} (was qty ${it.qty || 1})`); });
    edited.forEach(it => { if (!origMap[it.id]) changes.push(`Added: ${it.partNum || it.description} (qty ${it.qty || 1})`); });
    edited.forEach(it => {
      const orig = origMap[it.id];
      if (!orig) return;
      if ((orig.qty || 1) !== (it.qty || 1)) changes.push(`${it.partNum || it.description}: qty ${orig.qty || 1} → ${it.qty || 1}`);
    });
    return changes;
  }

  function autoNoteChanges(orderId) {
    const changes = diffItems(_originalItems, _editItems);
    if (!changes.length) return;
    const approverName = _user.name || _user.email || 'Approver';
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const o = Store.getOrders('all').find(x => x.id === orderId);
    if (!o) return;
    const notes = (o.notes || []).concat([{ author: approverName, time: timeStr, text: `Approver edits: ${changes.join('; ')}.` }]);
    Store.updateOrder(orderId, { notes });
  }

  // ─── global window callbacks ───────────────────────────────────────────────

  window.apQtyAdj = function(idx, delta) {
    if (!_editItems[idx]) return;
    const newQty = (_editItems[idx].qty || 1) + delta;
    if (newQty <= 0) { apRemoveItem(idx); return; }
    _editItems[idx].qty = newQty;
    markEdited(); renderCartTable();
  };

  window.apRemoveItem = function(idx) {
    const it = _editItems[idx];
    if (it && it.replacedBy) {
      const repIdx = _editItems.findIndex(x => x.id === it.replacedBy);
      if (repIdx !== -1) _editItems.splice(repIdx, 1);
    }
    if (it && it.replacesId) {
      const origIdx = _editItems.findIndex(x => x.id === it.replacesId);
      if (origIdx !== -1) _editItems[origIdx].replacedBy = null;
    }
    _editItems.splice(idx, 1);
    markEdited(); renderCartTable();
  };

  window.apApprove = function(orderId) {
    autoNoteChanges(orderId);
    const newTotal = Math.round(calcTotal(_editItems) * 100) / 100;
    Store.updateOrder(orderId, { status: 'submitted', tab: 'submitted', items: _editItems.slice(), amount: newTotal });
    if (_selectedOrderId === orderId) apCloseDetail();
    renderRows();
  };

  window.apContinue = function(orderId) {
    autoNoteChanges(orderId);
    const newTotal = Math.round(calcTotal(_editItems) * 100) / 100;
    Store.updateOrder(orderId, { items: _editItems.slice(), amount: newTotal, approvalType: null });
    if (_selectedOrderId === orderId) apCloseDetail();
    renderRows();
    Router.navigate('order-review', { orderId });
  };

  window.apReject = function(orderId) {
    const o = Store.getOrders('all').find(x => x.id === orderId);
    if (!o) return;
    const body = '<div style="margin-bottom:8px;">'
      + '<label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Reason for rejection <span style="color:#B91C1C;font-size:11px;">Required</span></label>'
      + '<textarea id="ap-reject-comment" rows="4" placeholder="e.g. Incorrect part numbers, budget not approved, need OEM parts only…" style="width:100%;border:1px solid #E2DDD8;border-radius:8px;padding:10px 12px;font-size:13px;font-family:inherit;color:#111318;outline:none;resize:vertical;box-sizing:border-box;"></textarea>'
      + '<div id="ap-reject-err" style="display:none;color:#B91C1C;font-size:11px;margin-top:4px;">A rejection reason is required.</div>'
      + '</div>'
      + '<div style="background:#FCEBEB;border-radius:8px;padding:10px 12px;font-size:12px;color:#A32D2D;">'
      + '<strong>' + o.name + '</strong> will be moved back to Drafts and the requester will be notified.'
      + '</div>';
    Modal.show({
      title: 'Reject order',
      body,
      actions: [
        { label: 'Cancel', onClick() { Modal.close(); } },
        { label: 'Confirm rejection', primary: false, onClick() {
          const comment = document.getElementById('ap-reject-comment').value.trim();
          const errEl = document.getElementById('ap-reject-err');
          if (!comment) {
            if (errEl) errEl.style.display = 'block';
            document.getElementById('ap-reject-comment').style.borderColor = '#B91C1C';
            return;
          }
          const approverName = _user.name || _user.email || 'Approver';
          const now = new Date();
          const timeStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
          const notes = (o.notes || []).concat([{ author: approverName, time: timeStr, text: `Rejected: ${comment}` }]);
          Store.updateOrder(orderId, { status: 'saved', tab: 'drafts', rejectionComment: comment, notes });
          Modal.close();
          if (_selectedOrderId === orderId) apCloseDetail();
          renderRows();
        }}
      ]
    });
    setTimeout(function() {
      const ta = document.getElementById('ap-reject-comment');
      if (ta) ta.focus();
    }, 50);
  };

  // ─── shell ─────────────────────────────────────────────────────────────────

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
.ap-search:focus { border-color: #1C3969; }
.ap-table-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.ap-table { width: 100%; border-collapse: collapse; }
.ap-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 9px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.ap-table td { padding: 10px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.ap-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.ap-table tr.selected-row td { background: #D6E4F7; }
.status-pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pill-saved { background: #F0ECE8; color: #5A5F6E; }
.pill-submitted { background: #DBEAFE; color: #1D4ED8; }
.pill-delivered { background: #DBEAFE; color: #1C3969; }
.pill-backordered { background: #FEF3C7; color: #92400E; }
.pill-review { background: #EDE9FE; color: #5B21B6; }
.ap-type-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; border-radius: 999px; padding: 3px 8px; white-space: nowrap; }
.ap-type-limit { background: #FEF3C7; color: #92400E; }
.ap-type-cart { background: #EDE9FE; color: #5B21B6; }
.ap-type-banner { display: flex; align-items: flex-start; gap: 10px; padding: 12px 24px; font-size: 12px; border-bottom: 0.5px solid #E8E4DF; line-height: 1.5; }
.ap-banner-limit { background: #FFFBEB; color: #92400E; }
.ap-banner-cart { background: #F5F3FF; color: #5B21B6; }
.ap-actions { display: flex; align-items: center; gap: 6px; }
.ap-action-btn { display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 10px; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; }
.ap-approve { background: #EAF3DE; color: #3B6D11; }
.ap-approve:hover { background: #D5EBBE; }
.ap-reject { background: #FCEBEB; color: #A32D2D; }
.ap-reject:hover { background: #F9D5D5; }
.ap-detail-panel { background: #FFFFFF; border-top: 1px solid #E8E4DF; flex-shrink: 0; max-height: 70vh; overflow-y: auto; }
.ap-detail-header { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border-bottom: 0.5px solid #E8E4DF; position: sticky; top: 0; background: #FFFFFF; z-index: 2; flex-wrap: wrap; }
.ap-detail-title { font-size: 15px; font-weight: 700; color: #111318; flex: 1; min-width: 0; }
.ap-detail-close { width: 28px; height: 28px; background: #F5F2EE; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #5A5F6E; flex-shrink: 0; }
.ap-detail-close:hover { background: #E8E4DF; }
.ap-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 0.5px solid #E8E4DF; }
.ap-detail-section { padding: 14px 24px; border-right: 0.5px solid #E8E4DF; }
.ap-detail-section:last-child { border-right: none; }
.ap-detail-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.ap-detail-row { display: flex; justify-content: space-between; padding: 3px 0; }
.ap-detail-label { font-size: 12px; color: #9CA3AF; }
.ap-detail-val { font-size: 12px; font-weight: 500; color: #111318; text-align: right; }
.ap-panel-actions { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border-top: 0.5px solid #E8E4DF; flex-wrap: wrap; }
.ap-panel-approve { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 16px; background: #EAF3DE; color: #3B6D11; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.ap-panel-approve:hover { background: #D5EBBE; }
.ap-panel-reject { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 16px; background: none; color: #A32D2D; border: 1px solid #F5C5C5; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; }
.ap-panel-reject:hover { background: #FCEBEB; }
.ap-items-section { border-top: 0.5px solid #E8E4DF; }
.ap-items-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px 8px; }
.ap-items-header span { font-size: 12px; font-weight: 600; color: #5A5F6E; text-transform: uppercase; letter-spacing: 0.8px; }
.ap-items-badge { font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 8px; background: #F0ECE8; color: #5A5F6E; }
.ap-items-total-row { padding: 10px 24px; font-size: 12px; color: #7A7F8E; text-align: right; border-top: 0.5px solid #F0ECE8; }
.ap-timeline { border-top: 0.5px solid #E8E4DF; padding: 14px 24px; }
.ap-timeline-title { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.ap-timeline-entry { display: flex; gap: 10px; margin-bottom: 10px; }
.ap-timeline-dot { width: 7px; height: 7px; border-radius: 50%; background: #C8C3BE; flex-shrink: 0; margin-top: 4px; }
.ap-timeline-body { flex: 1; }
.ap-timeline-author { font-size: 12px; font-weight: 600; color: #111318; }
.ap-timeline-time { font-size: 11px; color: #9CA3AF; margin-left: 6px; }
.ap-timeline-text { font-size: 12px; color: #5A5F6E; margin-top: 2px; }
</style>
<h2 class="sr-only">Approvals</h2>
<div class="shell">
  ${buildSidebar('approvals')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('home')">Home</a>
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
          <div style="font-size:12px;color:#7A7F8E;margin-top:2px;">Parts orders that require your sign-off before they are sent to vendors.</div>
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
              <th>Vendor</th><th>Vendor ID</th><th>Date</th><th>Requested by</th><th>Order name</th><th>WO / Equipment</th><th>Amount</th><th>Reason</th><th>Status</th><th>Actions</th>
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
}
