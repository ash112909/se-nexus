function render_wo_detail(el) {
  const woId = Router.context && Router.context.woId;
  const wo = woId ? Store.getWorkOrder(woId) : null;

  if (!wo) {
    el.innerHTML = `
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span>/</span><span style="color:#FFFFFF;">WO not found</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div style="padding:40px;color:#9CA3AF;font-size:14px;">
      <p>Work order not found. <a style="color:#F5A623;cursor:pointer;" onclick="sendPrompt('Work orders')">Return to work orders list</a></p>
    </div>
  </div>
</div>`;
    return;
  }

  function statusBadge() {
    const s = wo.status;
    if (s === 'active') return '<span class="pill pill-open">Open</span>';
    if (s === 'pending') return '<span class="pill pill-pending">Pending</span>';
    if (s === 'closed') return '<span class="pill pill-closed">Closed</span>';
    return '<span class="pill pill-open">' + s + '</span>';
  }

  function warrantyBadge() {
    if (wo.warranty && wo.warranty.active && wo.warranty.expiry) {
      return `<span class="warranty-badge"><i class="ti ti-shield-check"></i> Under warranty · ${wo.warranty.expiry}<span class="wb-tip"><i class="ti ti-shield-check" style="color:#4ADE80;margin-right:5px;"></i>This machine is under warranty until ${wo.warranty.expiry}.</span></span>`;
    }
    return `<span class="warranty-badge" style="background:#F1EFE8;color:#5F5E5A;"><i class="ti ti-shield-off"></i> Warranty expired</span>`;
  }

  function priorityBadge() {
    if (wo.priority === 'high') return '<span class="pill pill-high">High priority</span>';
    if (wo.priority === 'medium') return '<span class="pill pill-med">Med priority</span>';
    return '<span class="pill pill-low">Low priority</span>';
  }

  function renderNotes() {
    return (wo.notes && wo.notes.length)
      ? wo.notes.map(n => `
          <div class="tl-item">
            <div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div>
            <div class="tl-body">
              <div class="tl-title">${n.text}</div>
              <div class="tl-meta">${n.author} · ${n.time}</div>
            </div>
          </div>`).join('')
      : '<div style="color:#9CA3AF;font-size:13px;">No notes yet.</div>';
  }

  function itemStatus(c) {
    if (c.replacedBy) return 'replaced';
    if (c.replacesId) return c.inStock ? 'orderable' : 'needs_attention';
    const hasMandUnresolved = (c.crossRefs || []).some(r => r.mandatory);
    if (!c.inStock && !(c.crossRefs || []).length) return 'unorderable';
    if (hasMandUnresolved) return 'blocked';
    if (!c.inStock) return 'needs_attention';
    if ((c.localInventory || []).length && !c.selectedSource) return 'needs_attention';
    return 'orderable';
  }

  function renderCart() {
    const cart = Store.getWoCart(wo.id);
    const container = document.getElementById('wod-cart-body');
    if (!container) return;

    if (!cart.length) {
      container.innerHTML = `<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:13px;">No items in cart. <a style="color:#F5A623;cursor:pointer;" onclick="sendPrompt('Open Parts Search scoped to WO #${wo.id}')">Search parts to add</a></div>`;
      document.getElementById('wod-cart-total-row').style.display = 'none';
      return;
    }

    function statusCell(c) {
      const st = itemStatus(c);
      const reasons = [];
      if (st === 'replaced') return `<div class="ci-status" style="color:#C8C3BC;"><i class="ti ti-replace"></i></div>`;
      if (st === 'blocked') return `<div class="ci-status ci-err" onmouseenter="wodShowTip(this,'Mandatory cross-ref required — select substitute to proceed')" onmouseleave="wodHideTip()"><i class="ti ti-lock"></i></div>`;
      if (!c.inStock) reasons.push('Backordered');
      if ((c.localInventory || []).length && !c.selectedSource) reasons.push('Local stock available — select source');
      const tip = reasons.join(' · ') || 'Ready to order';
      if (st === 'orderable') {
        return `<div class="ci-status ci-ok" onmouseenter="wodShowTip(this,'${tip}')" onmouseleave="wodHideTip()"><i class="ti ti-circle-check"></i></div>`;
      } else if (st === 'needs_attention') {
        return `<div class="ci-status ci-warn" onmouseenter="wodShowTip(this,'${tip}')" onmouseleave="wodHideTip()"><i class="ti ti-alert-triangle"></i></div>`;
      }
      return `<div class="ci-status ci-err" onmouseenter="wodShowTip(this,'Item unavailable — no alternatives')" onmouseleave="wodHideTip()"><i class="ti ti-circle-x"></i></div>`;
    }

    function xrefBadge(c) {
      if (c.replacedBy || c.replacesId) return '';
      const refs = c.crossRefs || [];
      if (!refs.length) return '';
      if (refs.some(r => r.mandatory)) {
        return `<button class="ci-xref ci-xref-mand" onclick="wodOpenCrossRefs('${c.id}')"><i class="ti ti-switch-horizontal" style="font-size:10px;"></i> Mandatory cross-ref</button>`;
      }
      return `<button class="ci-xref ci-xref-opt" onclick="wodOpenCrossRefs('${c.id}')"><i class="ti ti-switch-horizontal" style="font-size:10px;"></i> ${refs.length} optional cross-ref${refs.length !== 1 ? 's' : ''}</button>`;
    }

    function localCell(c) {
      if (c.replacedBy) return '<span class="ci-dash">—</span>';
      const sources = c.selectedSources || (c.selectedSource ? [c.selectedSource] : []);
      if (sources.length) {
        const srcQty = sources.reduce((s, x) => s + (x.qty || 0), 0);
        const label = sources.length === 1 ? sources[0].locationName : sources.length + ' locations';
        return `<button class="ci-local ci-local-sel" onclick="wodOpenLocal('${c.id}')"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${label}${srcQty ? ' (' + srcQty + ')' : ''}</button>`;
      }
      const inv = c.localInventory || [];
      if (!inv.length) return '<span class="ci-dash">—</span>';
      const total = inv.reduce((s, l) => s + l.qty, 0);
      return `<button class="ci-local" onclick="wodOpenLocal('${c.id}')"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${total} avail</button>`;
    }

    const isReplaced = c => !!c.replacedBy;
    const submittable = cart.filter(c => !['blocked','unorderable','replaced'].includes(itemStatus(c)));
    const notSubmittable = cart.filter(c => ['blocked','unorderable'].includes(itemStatus(c))).length;
    const total = submittable.reduce((s, c) => s + c.price * (c.qty || 1), 0);

    container.innerHTML = `
      <table class="wod-cart-table">
        <thead><tr>
          <th class="col-st"></th>
          <th class="col-pn">Part #</th>
          <th class="col-desc">Description</th>
          <th class="col-uom">UOM</th>
          <th class="col-loc">Source / stock</th>
          <th class="col-qty" style="text-align:center;">Qty</th>
          <th class="col-unit" style="text-align:right;">Unit</th>
          <th class="col-tot" style="text-align:right;">Total</th>
          <th class="col-rm"></th>
        </tr></thead>
        <tbody>${cart.map(c => {
          const replaced = isReplaced(c);
          const rowStyle = replaced ? 'opacity:0.45;' : '';
          const descStyle = replaced ? 'text-decoration:line-through;color:#9CA3AF;' : '';
          const partStyle = replaced ? 'text-decoration:line-through;color:#9CA3AF;' : '';
          const replacesOrig = c.replacesId ? cart.find(x => x.id === c.replacesId) : null;
          return `
          <tr class="cart-row" style="${rowStyle}">
            <td class="col-st">${statusCell(c)}</td>
            <td class="col-pn">
              <div class="ci-partnum" style="${partStyle}">${c.partNum}</div>
              <div class="ci-vendor-line">${c.vendor}${c.oemOnly ? ' <span class="oem-badge">OEM</span>' : ''}</div>
            </td>
            <td class="col-desc">
              <div class="ci-desc-name" style="${descStyle}">${c.description}</div>
              ${replacesOrig ? `<div style="font-size:10px;color:#7A7F8E;margin-top:2px;display:flex;align-items:center;gap:3px;"><i class="ti ti-arrows-exchange" style="font-size:10px;"></i> Replaces ${replacesOrig.partNum}</div>` : ''}
              <div style="display:flex;align-items:center;gap:5px;margin-top:3px;">${xrefBadge(c)}</div>
            </td>
            <td class="col-uom"><span class="uom-badge">${c.uom || 'EA'}</span></td>
            <td class="col-loc">${localCell(c)}</td>
            <td class="col-qty">
              ${replaced ? '<span style="color:#C8C3BC;font-size:12px;">—</span>' : `<div class="ci-qty-ctrl">
                <button class="qty-btn" onclick="wodQtyDec('${c.id}')">−</button>
                <span class="qty-val">${c.qty || 1}</span>
                <button class="qty-btn" onclick="wodQtyInc('${c.id}')">+</button>
              </div>`}
            </td>
            <td class="col-unit" style="text-align:right;font-size:12px;color:#7A7F8E;">${replaced ? '—' : '$' + c.price.toFixed(2)}</td>
            <td class="col-tot" style="text-align:right;font-size:13px;font-weight:700;color:${replaced ? '#C8C3BC' : '#111318'};">${replaced ? '—' : '$' + (c.price * (c.qty || 1)).toFixed(2)}</td>
            <td class="col-rm">${replaced ? '' : `<button class="ci-remove" onclick="wodRemoveItem('${c.id}')" title="Remove"><i class="ti ti-trash" style="font-size:13px;"></i></button>`}</td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>`;

    const totalRow = document.getElementById('wod-cart-total-row');
    if (totalRow) {
      totalRow.style.display = 'flex';
      const submitLabel = notSubmittable > 0
        ? `Submit orderable items <span style="font-size:12px;background:rgba(0,0,0,0.15);border-radius:4px;padding:1px 6px;margin-left:4px;">⚠ ${notSubmittable} unorderable</span>`
        : `<i class="ti ti-check" style="font-size:14px;"></i> Submit order`;
      totalRow.innerHTML = `
        <div style="flex:1;font-size:13px;color:#7A7F8E;">${cart.length} item${cart.length !== 1 ? 's' : ''}</div>
        <div style="font-size:14px;font-weight:700;color:#111318;margin-right:14px;">$${total.toFixed(2)}</div>
        <button class="btn-primary" onclick="wodSubmitCart()" ${submittable.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>${submitLabel}</button>`;
    }
  }

  function renderSubmittedOrders() {
    const container = document.getElementById('wod-orders-body');
    if (!container) return;
    const orders = (wo.submittedOrders || []);
    if (!orders.length) {
      container.innerHTML = '<div style="color:#9CA3AF;font-size:13px;padding:4px 0;">No orders submitted yet.</div>';
      return;
    }
    const statusStyle = {
      submitted: 'background:#E6F1FB;color:#185FA5;',
      backordered: 'background:#FEF3C7;color:#92400E;',
      delivered: 'background:#E1F5EE;color:#0F6E56;',
    };
    container.innerHTML = orders.map(ord => `
      <div class="ord-block">
        <div class="ord-block-header">
          <div>
            <span class="ord-po">${ord.poNum}</span>
            <span class="ord-date">${ord.date}</span>
          </div>
          <span style="font-size:11px;font-weight:600;border-radius:999px;padding:3px 10px;${statusStyle[ord.status] || 'background:#F0ECE8;color:#5A5F6E;'}">${ord.status.charAt(0).toUpperCase() + ord.status.slice(1)}</span>
        </div>
        ${ord.items.map(it => `
          <div class="ord-item-row">
            <span class="ord-item-name">${it.description}</span>
            <span class="ord-item-num">${it.partNum}</span>
            <span class="ord-item-qty">×${it.qty || 1}</span>
            <span class="ord-item-price">$${(it.price * (it.qty || 1)).toFixed(2)}</span>
          </div>`).join('')}
        <div class="ord-block-footer">Total: <strong>$${ord.total.toFixed(2)}</strong></div>
      </div>`).join('');
  }

  el.innerHTML = `
<style>
.wo-detail-content { flex: 1; padding: 24px; overflow-y: auto; }
.wo-detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.wo-detail-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.wo-detail-meta { font-size: 13px; color: #7A7F8E; margin-top: 3px; }
.wo-status-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.pill-ordered { background: #FAEEDA; color: #854F0B; }
.pill-open { background: #E6F1FB; color: #185FA5; }
.pill-pending { background: #F1EEFE; color: #534AB7; }
.pill-closed { background: #F0ECE8; color: #5A5F6E; }
.pill-high { background: #FCEBEB; color: #A32D2D; }
.pill-med { background: #FAEEDA; color: #854F0B; }
.pill-low { background: #EAF3DE; color: #3B6D11; }
.btn-primary { background: #F5A623; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
.btn-primary:hover { background: #E8980F; }
.btn-ghost { background: none; border: 0.5px solid #E2DDD8; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
.btn-ghost:hover { background: #F5F2EE; }
.btn-danger { background: none; border: 0.5px solid #F5C5C5; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #A32D2D; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
.btn-danger:hover { background: #FCEBEB; }
.wo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.wo-card-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; }
.wo-section-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px; }
.wo-field { margin-bottom: 10px; }
.wo-field-label { font-size: 11px; color: #9CA3AF; margin-bottom: 2px; }
.wo-field-value { font-size: 13px; font-weight: 500; color: #111318; }
.warranty-badge { display: inline-flex; align-items: center; gap: 5px; background: #E1F5EE; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; color: #0F6E56; position: relative; cursor: default; }
.warranty-badge .wb-tip { display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #1E1E1E; color: #FFFFFF; font-size: 12px; font-weight: 400; border-radius: 8px; padding: 8px 12px; white-space: nowrap; pointer-events: none; z-index: 999; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
.warranty-badge .wb-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #1E1E1E; }
.warranty-badge:hover .wb-tip { display: block; }
/* Cart */
.cart-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.cart-section-header { padding: 14px 16px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.cart-section-title { font-size: 14px; font-weight: 600; color: #111318; display: flex; align-items: center; gap: 8px; }
.cart-badge { background: #F5A623; color: #1A1200; font-size: 11px; font-weight: 700; border-radius: 999px; padding: 1px 8px; }
.add-parts-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #854F0B; background: #FAEEDA; border: none; border-radius: 7px; padding: 6px 12px; cursor: pointer; font-family: inherit; }
.add-parts-btn:hover { background: #F5DEB5; }
/* Cart table */
.wod-cart-table { width: 100%; border-collapse: collapse; }
.wod-cart-table th { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 7px 10px; text-align: left; background: #FAFAF8; border-bottom: 1px solid #E8E4DF; white-space: nowrap; }
.wod-cart-table td { padding: 9px 10px; border-bottom: 0.5px solid #F5F2EE; vertical-align: middle; }
.cart-row:last-child td { border-bottom: none; }
.col-st { width: 32px; padding-left: 14px !important; }
.col-pn { width: 130px; }
.col-desc { }
.col-uom { width: 52px; }
.col-loc { width: 88px; }
.col-qty { width: 96px; }
.col-unit { width: 68px; }
.col-tot { width: 72px; }
.col-rm { width: 36px; padding-right: 10px !important; }
/* Status icon */
.ci-status { display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: default; }
.ci-ok { color: #639922; }
.ci-warn { color: #BA7517; }
.ci-err { color: #A32D2D; }
/* Fixed-position tooltip — appended to body so it escapes overflow:hidden */
#wod-float-tip { position: fixed; background: #1E1E1E; color: #FFFFFF; font-size: 11px; font-weight: 400; border-radius: 7px; padding: 6px 10px; white-space: nowrap; pointer-events: none; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,.25); display: none; }
/* Part # cell */
.ci-partnum { font-family: 'SF Mono','Consolas',monospace; font-size: 11px; color: #3A3D4A; font-weight: 600; }
.ci-vendor-line { font-size: 10px; color: #9CA3AF; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
.oem-badge { background: #F5F2EE; color: #5A5F6E; font-size: 9px; font-weight: 700; border-radius: 3px; padding: 1px 4px; letter-spacing: 0.3px; }
/* Description cell */
.ci-desc-name { font-size: 13px; font-weight: 500; color: #111318; line-height: 1.3; }
/* Cross-ref badges */
.ci-xref { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; border: none; border-radius: 4px; padding: 2px 7px; cursor: pointer; font-family: inherit; }
.ci-xref-mand { background: #FAEEDA; color: #854F0B; }
.ci-xref-mand:hover { background: #F5DEB5; }
.ci-xref-opt { background: #EEEDFE; color: #534AB7; }
.ci-xref-opt:hover { background: #DDD9FE; }
/* Local stock badge */
.ci-local { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; background: #EAF3DE; color: #3B6D11; border: none; border-radius: 4px; padding: 3px 7px; cursor: pointer; font-family: inherit; }
.ci-local:hover { background: #D5EBBE; }
.ci-local-sel { background: #3B6D11; color: #FFFFFF; }
.ci-local-sel:hover { background: #2D5309; }
.ci-dash { color: #D1CBC4; font-size: 13px; }
/* UOM */
.uom-badge { font-size: 10px; font-weight: 700; background: #F0ECE8; color: #5A5F6E; border-radius: 4px; padding: 2px 6px; letter-spacing: 0.3px; }
/* Qty controls */
.ci-qty-ctrl { display: flex; align-items: center; gap: 5px; justify-content: center; }
.qty-btn { width: 22px; height: 22px; border: 1px solid #E2DDD8; border-radius: 4px; background: #F5F2EE; color: #3A3D4A; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; line-height: 1; padding: 0; }
.qty-btn:hover { background: #ECEAE6; }
.qty-val { font-size: 13px; font-weight: 600; color: #111318; min-width: 16px; text-align: center; }
.ci-remove { background: none; border: none; color: #C8C3BC; cursor: pointer; padding: 4px; border-radius: 5px; }
.ci-remove:hover { background: #FCEBEB; color: #A32D2D; }
.cart-total-row { display: flex; align-items: center; padding: 12px 16px; background: #FAFAF8; border-top: 0.5px solid #F0ECE8; }
/* Submitted orders */
.orders-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.ord-block { border-bottom: 0.5px solid #F0ECE8; }
.ord-block:last-child { border-bottom: none; }
.ord-block-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px 8px; }
.ord-po { font-size: 12px; font-weight: 700; color: #111318; font-family: 'SF Mono','Consolas',monospace; margin-right: 8px; }
.ord-date { font-size: 11px; color: #9CA3AF; }
.ord-item-row { display: flex; align-items: center; gap: 8px; padding: 5px 16px; font-size: 12px; color: #3A3D4A; }
.ord-item-name { flex: 1; font-weight: 500; }
.ord-item-num { color: #9CA3AF; font-size: 11px; min-width: 90px; }
.ord-item-qty { color: #7A7F8E; min-width: 24px; }
.ord-item-price { font-weight: 600; color: #111318; text-align: right; min-width: 56px; }
.ord-block-footer { padding: 8px 16px 12px; font-size: 12px; color: #7A7F8E; }
/* Notes */
.notes-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.note-input-row { display: flex; gap: 8px; margin-top: 14px; }
.note-input { flex: 1; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.note-input:focus { border-color: #F5A623; background: #FFFFFF; }
.note-add-btn { background: #F5A623; border: none; border-radius: 7px; padding: 0 14px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; white-space: nowrap; }
.tl-item { display: flex; gap: 12px; margin-bottom: 12px; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; background: #F5A623; flex-shrink: 0; margin-top: 4px; }
.tl-dot.done { background: #3B6D11; }
.tl-line { flex: 1; width: 1px; background: #F0ECE8; margin: 3px 0; min-height: 16px; }
.tl-body { flex: 1; }
.tl-title { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 1px; }
.tl-meta { font-size: 11px; color: #9CA3AF; }
.status-select { height: 34px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.status-select:focus { border-color: #F5A623; }
.field-select { height: 30px; border: 1px solid #E2DDD8; border-radius: 6px; padding: 0 8px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; font-weight: 500; }
.field-select:focus { border-color: #F5A623; }
.field-date { height: 30px; border: 1px solid #E2DDD8; border-radius: 6px; padding: 0 8px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.field-date:focus { border-color: #F5A623; }
</style>
<h2 class="sr-only">Work Order #${wo.id} — ${wo.machine}</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">WO #${wo.id}</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="wo-detail-content">
      <div class="wo-detail-header">
        <div>
          <div class="wo-detail-title">Work Order #${wo.id}</div>
          <div class="wo-detail-meta">Opened ${wo.opened} · ${(Store.getCurrentLocation()||{name:'—'}).name} · ${wo.assignee}</div>
          <div class="wo-status-row">
            ${statusBadge()} ${priorityBadge()} ${warrantyBadge()}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <div style="display:flex;align-items:center;gap:6px;">
            <label style="font-size:12px;color:#9CA3AF;">Status:</label>
            <select class="status-select" id="wod-status-select">
              <option value="active" ${wo.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="pending" ${wo.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="closed" ${wo.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <button class="btn-ghost" onclick="sendPrompt('Work orders')"><i class="ti ti-arrow-left" style="font-size:14px;"></i> Back</button>
          ${wo.status !== 'closed' ? `<button class="btn-danger" id="wod-close-btn"><i class="ti ti-x" style="font-size:14px;"></i> Close WO</button>` : ''}
        </div>
      </div>

      <div class="wo-grid">
        <div class="wo-card-section">
          <div class="wo-section-label">Machine</div>
          <div class="wo-field"><div class="wo-field-label">Model</div><div class="wo-field-value">${wo.machine}</div></div>
          <div class="wo-field"><div class="wo-field-label">Asset ID</div><div class="wo-field-value">${wo.asset}</div></div>
          <div class="wo-field"><div class="wo-field-label">Warranty</div><div class="wo-field-value">${wo.warranty && wo.warranty.active ? 'Active · Expires ' + wo.warranty.expiry : 'Expired'}</div></div>
          <div class="wo-field"><div class="wo-field-label">Opened</div><div class="wo-field-value">${wo.opened}</div></div>
        </div>
        <div class="wo-card-section">
          <div class="wo-section-label">Fault &amp; complaint</div>
          <div class="wo-field"><div class="wo-field-label">Reported issue</div><div class="wo-field-value">${wo.issue}</div></div>
          <div class="wo-field">
            <div class="wo-field-label">Priority</div>
            <select class="field-select" id="wod-priority-select">
              <option value="high" ${wo.priority === 'high' ? 'selected' : ''}>High</option>
              <option value="medium" ${wo.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="low" ${(wo.priority === 'low' || !wo.priority) ? 'selected' : ''}>Low</option>
            </select>
          </div>
          <div class="wo-field">
            <div class="wo-field-label">Due Date</div>
            <input class="field-date" type="date" id="wod-due-date" value="${wo.dueDate || ''}"/>
          </div>
          <div class="wo-field">
            <div class="wo-field-label">Assignee</div>
            <select class="field-select" id="wod-assignee-select">
              <option value="James W." ${wo.assignee === 'James W.' ? 'selected' : ''}>James W.</option>
              <option value="Carlos M." ${wo.assignee === 'Carlos M.' ? 'selected' : ''}>Carlos M.</option>
              <option value="Rita T." ${wo.assignee === 'Rita T.' ? 'selected' : ''}>Rita T.</option>
              <option value="Devon K." ${wo.assignee === 'Devon K.' ? 'selected' : ''}>Devon K.</option>
              <option value="Priya S." ${wo.assignee === 'Priya S.' ? 'selected' : ''}>Priya S.</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Active Cart -->
      <div class="cart-section">
        <div class="cart-section-header">
          <div class="cart-section-title">
            <i class="ti ti-shopping-cart" style="font-size:16px;color:#F5A623;"></i>
            Active cart
            <span class="cart-badge" id="wod-cart-badge">${(Store.getWoCart(wo.id) || []).length}</span>
          </div>
          <button class="add-parts-btn" onclick="sendPrompt('Open Parts Search scoped to WO #${wo.id}')">
            <i class="ti ti-plus" style="font-size:12px;"></i> Add parts
          </button>
        </div>
        <div id="wod-cart-body"></div>
        <div class="cart-total-row" id="wod-cart-total-row" style="display:none;"></div>
      </div>

      <!-- Submitted Orders -->
      <div class="orders-section">
        <div class="cart-section-header">
          <div class="cart-section-title">
            <i class="ti ti-receipt" style="font-size:16px;color:#9CA3AF;"></i>
            Orders submitted
            <span style="font-size:11px;font-weight:600;color:#9CA3AF;background:#F5F2EE;border-radius:999px;padding:1px 8px;">${(wo.submittedOrders || []).length}</span>
          </div>
        </div>
        <div id="wod-orders-body"></div>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <div class="wo-section-label">Notes &amp; timeline</div>
        <div id="wod-notes-list">${renderNotes()}</div>
        <div class="note-input-row">
          <input class="note-input" type="text" id="wod-note-input" placeholder="Add a note…"/>
          <button class="note-add-btn" id="wod-add-note-btn">Add note</button>
        </div>
      </div>
    </div>
  </div>
</div>`;

  renderCart();
  renderSubmittedOrders();

  // Status select
  const statusSel = document.getElementById('wod-status-select');
  if (statusSel) {
    statusSel.addEventListener('change', function() {
      Store.updateWorkOrder(wo.id, { status: this.value });
      wo.status = this.value;
    });
  }

  // Priority select
  const prioritySel = document.getElementById('wod-priority-select');
  if (prioritySel) {
    prioritySel.addEventListener('change', function() {
      Store.updateWorkOrder(wo.id, { priority: this.value });
      wo.priority = this.value;
    });
  }

  // Due date
  const dueDateInput = document.getElementById('wod-due-date');
  if (dueDateInput) {
    dueDateInput.addEventListener('change', function() {
      Store.updateWorkOrder(wo.id, { dueDate: this.value });
      wo.dueDate = this.value;
    });
  }

  // Assignee select
  const assigneeSel = document.getElementById('wod-assignee-select');
  if (assigneeSel) {
    assigneeSel.addEventListener('change', function() {
      Store.updateWorkOrder(wo.id, { assignee: this.value });
      wo.assignee = this.value;
    });
  }

  // Close WO
  const closeBtn = document.getElementById('wod-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      Modal.confirm('Close Work Order #' + wo.id + '? This cannot be undone.', () => {
        Store.closeWorkOrder(wo.id);
        sendPrompt('Work orders');
      });
    });
  }

  // Add note
  const noteBtn = document.getElementById('wod-add-note-btn');
  if (noteBtn) {
    noteBtn.addEventListener('click', function() {
      const inp = document.getElementById('wod-note-input');
      const text = inp ? inp.value.trim() : '';
      if (!text) return;
      Store.addWoNote(wo.id, text);
      inp.value = '';
      const notesContainer = document.getElementById('wod-notes-list');
      if (notesContainer) notesContainer.innerHTML = renderNotes();
    });
    document.getElementById('wod-note-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') noteBtn.click();
    });
  }

  // Cart mutations
  window.wodQtyInc = function(partId) {
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    if (item) Store.updateWoCartQty(wo.id, partId, (item.qty || 1) + 1);
    renderCart();
    updateCartBadge();
  };
  window.wodQtyDec = function(partId) {
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    if (item) Store.updateWoCartQty(wo.id, partId, (item.qty || 1) - 1);
    renderCart();
    updateCartBadge();
  };
  window.wodRemoveItem = function(partId) {
    Store.removeFromWoCart(wo.id, partId);
    renderCart();
    updateCartBadge();
  };
  window.wodSubmitCart = function() {
    const cart = Store.getWoCart(wo.id);
    if (!cart.length) return;
    const submittable = cart.filter(c => !['blocked','unorderable','replaced'].includes(itemStatus(c)));
    if (!submittable.length) return;
    Router.navigate('order-review', { woId: wo.id, itemIds: submittable.map(c => c.id) });
  };

  function updateCartBadge() {
    const badge = document.getElementById('wod-cart-badge');
    if (badge) badge.textContent = Store.getWoCart(wo.id).length;
  }

  var _xrefMap = {};

  window.wodOpenCrossRefs = function(partId) {
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    if (!item) return;
    const refs = item.crossRefs || [];
    const hasMand = refs.some(r => r.mandatory);
    _xrefMap = {};
    refs.forEach(function(r, i) { _xrefMap[i] = r; });
    const body = `
      ${hasMand ? '<div style="display:flex;align-items:center;gap:8px;background:#FAEEDA;border:0.5px solid #F5A623;border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:12px;color:#854F0B;"><i class="ti ti-alert-triangle" style="flex-shrink:0;"></i><span>Fleet policy requires using the substitute below. Select it to unblock this item in the cart.</span></div>' : ''}
      <div style="margin-bottom:14px;font-size:12px;color:#7A7F8E;">Original part: <strong style="color:#111318;">${item.partNum}</strong> — ${item.description}</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr style="background:#FAFAF8;">
          <th style="text-align:left;padding:7px 12px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Part #</th>
          <th style="text-align:left;padding:7px 12px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Description</th>
          <th style="text-align:left;padding:7px 12px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Vendor</th>
          <th style="text-align:center;padding:7px 12px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">UOM</th>
          <th style="text-align:right;padding:7px 12px;font-size:10px;font-weight:600;color:#9CA3AF;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Price</th>
          <th style="padding:7px 12px;border-bottom:1px solid #E8E4DF;"></th>
        </tr></thead>
        <tbody>${refs.map(r => `
          <tr>
            <td style="padding:9px 12px;font-family:monospace;font-size:11px;color:#3A3D4A;font-weight:600;border-bottom:0.5px solid #F0ECE8;">${r.partNum}</td>
            <td style="padding:9px 12px;font-size:12px;color:#111318;border-bottom:0.5px solid #F0ECE8;">${r.description}<br><span style="font-size:10px;color:#9CA3AF;">${r.note || ''}</span></td>
            <td style="padding:9px 12px;font-size:12px;color:#7A7F8E;border-bottom:0.5px solid #F0ECE8;">${r.vendor}</td>
            <td style="padding:9px 12px;text-align:center;border-bottom:0.5px solid #F0ECE8;"><span style="font-size:10px;background:#F0ECE8;color:#5A5F6E;border-radius:4px;padding:2px 6px;font-weight:700;">${r.uom || 'EA'}</span></td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:700;color:#111318;border-bottom:0.5px solid #F0ECE8;">$${r.price.toFixed(2)}</td>
            <td style="padding:9px 12px;border-bottom:0.5px solid #F0ECE8;">
              <button style="font-size:11px;font-weight:600;background:#F5A623;border:none;border-radius:6px;padding:5px 12px;color:#1A1200;cursor:pointer;font-family:inherit;" onclick="wodSwapCrossRef('${item.id}',${refs.indexOf(r)})">Use this instead</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    Modal.show({ title: 'Cross-references — ' + item.partNum, body, wide: true, actions: [{ label: 'Close', onClick: () => Modal.close() }] });
  };

  window.wodSwapCrossRef = function(partId, refIdx) {
    const ref = _xrefMap[refIdx];
    if (!ref) return;
    const newPart = { id: ref.partNum, partNum: ref.partNum, description: ref.description, vendor: ref.vendor, price: ref.price, uom: ref.uom || 'EA', inStock: true, localInventory: [], crossRefs: [] };
    Store.swapWoCartItem(wo.id, partId, newPart);
    Modal.close();
    renderCart();
    updateCartBadge();
  };

  window.wodOpenLocal = function(partId) {
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    if (!item) return;
    const inv = item.localInventory || [];
    const existingSources = item.selectedSources || (item.selectedSource ? [item.selectedSource] : []);
    const needed = item.qty || 1;

    const body = `
      <div style="margin-bottom:14px;">
        <div style="font-size:13px;font-weight:600;color:#111318;">${item.description}</div>
        <div style="font-size:11px;color:#9CA3AF;margin-top:2px;">${item.partNum} · ${item.vendor}</div>
        <div style="font-size:12px;color:#5A5F6E;margin-top:8px;">Set how many units to pull from each location. You can split across multiple locations if needed.</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:8px 12px;background:#F5F2EE;border-radius:8px;">
        <span style="font-size:12px;color:#5A5F6E;">Units needed for this WO</span>
        <span style="font-size:13px;font-weight:700;color:#111318;">${needed}</span>
      </div>
      <div id="local-src-summary" style="margin-bottom:10px;font-size:12px;color:#5A5F6E;"></div>
      ${inv.map((loc, i) => {
        const existing = existingSources.find(s => s.locationId === loc.locationId);
        const val = existing ? existing.qty : 0;
        return `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:0.5px solid #E8E4DF;border-radius:10px;margin-bottom:8px;background:#FAFAF8;" id="loc-row-${i}">
          <div style="width:36px;height:36px;background:#EAF3DE;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;color:#3B6D11;flex-shrink:0;"><i class="ti ${loc.type === 'shop' ? 'ti-building' : 'ti-crane'}"></i></div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#111318;">${loc.locationName}</div>
            <div style="font-size:11px;color:#7A7F8E;margin-top:1px;">${loc.distance} · ${loc.type === 'shop' ? 'Shop stock' : 'Fleet yard'} · <strong style="color:#3B6D11;">${loc.qty} available</strong></div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button style="width:24px;height:24px;border:1px solid #E2DDD8;border-radius:4px;background:#F5F2EE;color:#3A3D4A;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;padding:0;" onclick="wodLocalQtyAdj('${partId}',${i},${loc.qty},-1)">−</button>
            <input id="loc-qty-${i}" type="number" min="0" max="${loc.qty}" value="${val}" oninput="wodLocalQtyUpdate('${partId}',${i},${loc.qty})" style="width:44px;height:24px;text-align:center;border:1px solid #E2DDD8;border-radius:4px;font-size:13px;font-weight:600;font-family:inherit;color:#111318;background:#FFFFFF;outline:none;padding:0 4px;"/>
            <button style="width:24px;height:24px;border:1px solid #E2DDD8;border-radius:4px;background:#F5F2EE;color:#3A3D4A;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;padding:0;" onclick="wodLocalQtyAdj('${partId}',${i},${loc.qty},1)">+</button>
          </div>
        </div>`;
      }).join('')}`;

    Modal.show({
      title: 'Local inventory — ' + item.partNum,
      body,
      actions: [
        { label: 'Clear sources', onClick: function() {
            Store.setWoCartItemSources(wo.id, partId, []);
            Modal.close();
            renderCart();
          }
        },
        { label: 'Save sources', primary: true, onClick: function() {
            const sources = inv.map(function(loc, i) {
              const input = document.getElementById('loc-qty-' + i);
              const q = input ? parseInt(input.value) || 0 : 0;
              return q > 0 ? { locationId: loc.locationId, locationName: loc.locationName, qty: q } : null;
            }).filter(Boolean);
            Store.setWoCartItemSources(wo.id, partId, sources);
            Modal.close();
            renderCart();
          }
        },
      ],
    });

    wodLocalUpdateSummary(partId, inv, needed);
  };

  window.wodLocalQtyAdj = function(partId, idx, max, delta) {
    const input = document.getElementById('loc-qty-' + idx);
    if (!input) return;
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    const inv = item ? item.localInventory || [] : [];
    const needed = item ? (item.qty || 1) : 1;
    input.value = Math.max(0, Math.min(max, (parseInt(input.value) || 0) + delta));
    wodLocalUpdateSummary(partId, inv, needed);
  };

  window.wodLocalQtyUpdate = function(partId, idx, max) {
    const input = document.getElementById('loc-qty-' + idx);
    if (!input) return;
    const v = parseInt(input.value) || 0;
    input.value = Math.max(0, Math.min(max, v));
    const item = Store.getWoCart(wo.id).find(c => c.id === partId);
    const inv = item ? item.localInventory || [] : [];
    const needed = item ? (item.qty || 1) : 1;
    wodLocalUpdateSummary(partId, inv, needed);
  };

  window.wodLocalUpdateSummary = function(partId, inv, needed) {
    const summary = document.getElementById('local-src-summary');
    if (!summary) return;
    let allocated = 0;
    inv.forEach(function(loc, i) {
      const input = document.getElementById('loc-qty-' + i);
      allocated += input ? (parseInt(input.value) || 0) : 0;
    });
    if (allocated === 0) { summary.textContent = ''; return; }
    const remaining = needed - allocated;
    if (remaining > 0) {
      summary.innerHTML = `<span style="color:#BA7517;">⚠ ${allocated} of ${needed} allocated — ${remaining} still needed from vendor order</span>`;
    } else if (remaining < 0) {
      summary.innerHTML = `<span style="color:#A32D2D;">⚠ ${allocated} allocated exceeds qty needed (${needed})</span>`;
    } else {
      summary.innerHTML = `<span style="color:#3B6D11;">✓ All ${needed} units allocated from local stock</span>`;
    }
  };

  window.wodShowTip = function(el, text) {
    let tip = document.getElementById('wod-float-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'wod-float-tip';
      document.body.appendChild(tip);
    }
    tip.textContent = text;
    tip.style.display = 'block';
    const rect = el.getBoundingClientRect();
    tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
    tip.style.top = (rect.top - tip.offsetHeight - 7) + 'px';
  };

  window.wodHideTip = function() {
    const tip = document.getElementById('wod-float-tip');
    if (tip) tip.style.display = 'none';
  };
}
