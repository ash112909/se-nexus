function render_order_review(el) {
  const ctx = Router.context || {};
  const woId = ctx.woId;
  const itemIds = ctx.itemIds || [];
  const wo = woId ? Store.getWorkOrder(woId) : null;

  if (!wo || !itemIds.length) {
    el.innerHTML = `<div class="shell">${buildSidebar('wo')}<div class="main"><div style="padding:40px;color:#9CA3AF;font-size:14px;">No order data. <a style="color:#F5A623;cursor:pointer;" onclick="history.back()">Go back</a></div></div></div>`;
    return;
  }

  const cart = Store.getWoCart(wo.id);
  let _items = cart.filter(c => itemIds.includes(c.id));

  // Shipping recommendation logic
  function recommendShipping() {
    const dueDate = wo.dueDate ? new Date(wo.dueDate) : null;
    const today = new Date();
    const daysUntilDue = dueDate ? Math.ceil((dueDate - today) / 86400000) : 99;
    const priority = wo.priority || 'medium';
    const allInStock = _items.every(c => c.inStock !== false);

    if (priority === 'high' || daysUntilDue <= 3) {
      return { carrier: 'FedEx', service: 'Priority Overnight', reason: 'High priority WO or due date within 3 days', badge: 'Urgent' };
    }
    if (daysUntilDue <= 7 || !allInStock) {
      return { carrier: 'FedEx', service: '2-Day Air', reason: daysUntilDue <= 7 ? 'Due date within 7 days' : 'Some items may ship when available', badge: 'Expedited' };
    }
    return { carrier: 'UPS', service: 'Ground', reason: 'Standard priority with adequate lead time', badge: 'Standard' };
  }

  const _rec = recommendShipping();

  // State
  const _orUser = Store.getCurrentUser();
  let _shipTo = { name: (Store.getCurrentLocation() || {}).name || 'Austin Branch', attn: _orUser ? _orUser.shortName : 'James W.', addr1: '1204 N Lamar Blvd', addr2: '', city: 'Austin', state: 'TX', zip: '78703', phone: _orUser ? _orUser.phone : '(512) 555-0182' };
  let _billTo = { name: 'Mid-County Rental', attn: 'Accounts Payable', addr1: '1204 N Lamar Blvd', addr2: '', city: 'Austin', state: 'TX', zip: '78703', phone: '(512) 555-0100' };
  let _opts = {
    poNum: '',
    orderType: 'Standard',
    requestedDate: wo.dueDate || '',
    paymentTerms: 'MQ Terms',
    fullName: _orUser ? _orUser.displayName : 'James Whitfield',
    orderedBy: _orUser ? _orUser.shortName : 'James W.',
    notifyBy: 'email',
    phone: _orUser ? _orUser.phone : '(512) 555-0182',
    email: _orUser ? _orUser.email : 'james.w@midcountyrental.com',
  };
  let _ship = {
    carrier: _rec.carrier,
    service: _rec.service,
    shipOption: 'ship-complete',
    terms: '',
    carrierAccount: '',
  };
  let _comments = '';

  function subtotal() { return _items.reduce((s, c) => s + c.price * (c.qty || 1), 0); }
  function totalWeight() { return _items.reduce((s, c) => s + (c.weight || 0) * (c.qty || 1), 0); }

  function renderSupplierMessages() {
    if (!Store.getCmsArticles) return '';
    const vendors = [...new Set(_items.map(c => c.vendor).filter(Boolean))];
    const msgs = Store.getCmsArticles('published').filter(a => a.showOnOrders && a.vendorName && vendors.includes(a.vendorName));
    if (!msgs.length) return '';
    return `<div class="or-card">
      <div class="or-card-header">
        <div class="or-card-title"><i class="ti ti-speakerphone" style="font-size:15px;color:#534AB7;"></i> Messages from your supplier${msgs.length !== 1 ? 's' : ''}</div>
      </div>
      <div class="or-card-body" style="display:flex;flex-direction:column;gap:10px;">
        ${msgs.map(a => `<div style="background:#F5F2EE;border-radius:9px;padding:12px 14px;border-left:3px solid #534AB7;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
            <span style="font-size:11px;font-weight:700;color:#534AB7;text-transform:uppercase;letter-spacing:.6px;">${a.vendorName}</span>
            <span style="font-size:10px;color:#9CA3AF;">${a.date || ''}</span>
          </div>
          <div style="font-size:13px;font-weight:600;color:#111318;margin-bottom:3px;">${a.title}</div>
          <div style="font-size:12px;color:#5A5F6E;line-height:1.55;">${a.body ? a.body.slice(0, 300) + (a.body.length > 300 ? '…' : '') : ''}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  function renderItemsTable() {
    return `<table class="or-table">
      <thead><tr>
        <th style="width:100px;">Part #</th>
        <th>Description</th>
        <th style="width:50px;text-align:center;">UOM</th>
        <th style="width:60px;text-align:center;">Qty</th>
        <th style="width:70px;text-align:right;">Unit</th>
        <th style="width:72px;text-align:right;">Total</th>
        <th style="width:60px;text-align:center;">Weight</th>
        <th style="width:80px;text-align:center;">Dimensions</th>
        <th style="width:32px;"></th>
      </tr></thead>
      <tbody>${_items.map(c => `
        <tr class="or-row" data-id="${c.id}">
          <td><div class="or-partnum">${c.partNum}</div><div class="or-vendor">${c.vendor}</div></td>
          <td><div class="or-desc">${c.description}</div>${c.selectedSources && c.selectedSources.length ? `<div class="or-src-line"><i class="ti ti-map-pin" style="font-size:9px;"></i> ${c.selectedSources.map(s=>s.locationName+(s.qty?' ('+s.qty+')':'')).join(', ')}</div>` : ''}</td>
          <td style="text-align:center;"><span class="or-uom">${c.uom || 'EA'}</span></td>
          <td style="text-align:center;font-size:13px;font-weight:600;color:#111318;">${c.qty || 1}</td>
          <td style="text-align:right;font-size:12px;color:#7A7F8E;">$${c.price.toFixed(2)}</td>
          <td style="text-align:right;font-size:13px;font-weight:700;color:#111318;">$${(c.price * (c.qty || 1)).toFixed(2)}</td>
          <td style="text-align:center;font-size:11px;color:#7A7F8E;">${c.weight ? c.weight + ' lb' : '—'}</td>
          <td style="text-align:center;font-size:11px;color:#7A7F8E;">${c.dimensions || '—'}</td>
          <td><button class="or-return-btn" title="Return to cart" onclick="orReturnItem('${c.id}')"><i class="ti ti-arrow-back-up" style="font-size:12px;"></i></button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="or-items-footer">
      <div style="flex:1;"></div>
      <div class="or-subtotal-row"><span style="font-size:12px;color:#7A7F8E;">Subtotal (${_items.length} item${_items.length!==1?'s':''})</span><span style="font-size:15px;font-weight:700;color:#111318;margin-left:16px;">$${subtotal().toFixed(2)}</span></div>
    </div>`;
  }

  function addrBlock(id, obj) {
    return `<div class="or-addr-block" id="${id}">
      <div class="or-field-row">
        <label class="or-label">Company / location</label>
        <input class="or-input" data-key="name" value="${obj.name}" placeholder="Company name"/>
      </div>
      <div class="or-field-row">
        <label class="or-label">Attn</label>
        <input class="or-input" data-key="attn" value="${obj.attn}" placeholder="Attention"/>
      </div>
      <div class="or-field-row">
        <label class="or-label">Address line 1</label>
        <input class="or-input" data-key="addr1" value="${obj.addr1}" placeholder="Street address"/>
      </div>
      <div class="or-field-row">
        <label class="or-label">Address line 2</label>
        <input class="or-input" data-key="addr2" value="${obj.addr2}" placeholder="Suite, building, etc."/>
      </div>
      <div class="or-field-row-3">
        <div class="or-field-grow"><label class="or-label">City</label><input class="or-input" data-key="city" value="${obj.city}" placeholder="City"/></div>
        <div style="width:54px;"><label class="or-label">State</label><input class="or-input" data-key="state" value="${obj.state}" placeholder="ST" maxlength="2" style="text-transform:uppercase;"/></div>
        <div style="width:80px;"><label class="or-label">ZIP</label><input class="or-input" data-key="zip" value="${obj.zip}" placeholder="ZIP"/></div>
      </div>
      <div class="or-field-row">
        <label class="or-label">Phone</label>
        <input class="or-input" data-key="phone" value="${obj.phone}" placeholder="Phone number"/>
      </div>
    </div>`;
  }

  function recBadgeColor(badge) {
    if (badge === 'Urgent') return 'background:#FCEBEB;color:#A32D2D;border:0.5px solid #F5C5C5;';
    if (badge === 'Expedited') return 'background:#FAEEDA;color:#854F0B;border:0.5px solid #F5A623;';
    return 'background:#EAF3DE;color:#3B6D11;border:0.5px solid #A8D888;';
  }

  el.innerHTML = `
<style>
.or-content { flex:1; padding:24px; overflow-y:auto; max-width:1100px; margin:0 auto; }
.or-page-title { font-size:18px; font-weight:700; color:#111318; margin-bottom:2px; }
.or-page-sub { font-size:12px; color:#7A7F8E; margin-bottom:20px; }
.or-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; margin-bottom:16px; overflow:hidden; }
.or-card-header { padding:13px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; justify-content:space-between; }
.or-card-title { font-size:13px; font-weight:600; color:#111318; display:flex; align-items:center; gap:7px; }
.or-card-body { padding:16px; }
.or-table { width:100%; border-collapse:collapse; }
.or-table th { font-size:10px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9CA3AF; padding:6px 10px; text-align:left; background:#FAFAF8; border-bottom:1px solid #E8E4DF; }
.or-table td { padding:9px 10px; border-bottom:0.5px solid #F5F2EE; vertical-align:middle; }
.or-row:last-child td { border-bottom:none; }
.or-partnum { font-family:'SF Mono','Consolas',monospace; font-size:11px; font-weight:600; color:#3A3D4A; }
.or-vendor { font-size:10px; color:#9CA3AF; margin-top:1px; }
.or-desc { font-size:12px; font-weight:500; color:#111318; }
.or-src-line { font-size:10px; color:#3B6D11; margin-top:2px; display:flex; align-items:center; gap:3px; }
.or-uom { font-size:10px; font-weight:700; background:#F0ECE8; color:#5A5F6E; border-radius:3px; padding:1px 5px; }
.or-return-btn { background:none; border:none; color:#C8C3BC; cursor:pointer; padding:3px; border-radius:4px; }
.or-return-btn:hover { background:#FAEEDA; color:#854F0B; }
.or-items-footer { display:flex; align-items:center; padding:10px 16px; border-top:0.5px solid #F0ECE8; background:#FAFAF8; }
.or-subtotal-row { display:flex; align-items:center; }
/* Address */
.or-addr-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.or-addr-label { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; }
.or-field-row { margin-bottom:8px; }
.or-field-row-3 { display:flex; gap:8px; margin-bottom:8px; }
.or-field-grow { flex:1; }
.or-label { font-size:11px; color:#9CA3AF; display:block; margin-bottom:3px; }
.or-input { width:100%; height:32px; border:1px solid #E2DDD8; border-radius:6px; padding:0 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; }
.or-input:focus { border-color:#F5A623; background:#FFFFFF; }
.or-input[readonly] { background:#F5F2EE; color:#7A7F8E; cursor:default; }
.or-textarea { width:100%; border:1px solid #E2DDD8; border-radius:6px; padding:8px 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; resize:vertical; min-height:68px; }
.or-textarea:focus { border-color:#F5A623; background:#FFFFFF; }
/* Options grid */
.or-opts-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; }
.or-select { width:100%; height:32px; border:1px solid #E2DDD8; border-radius:6px; padding:0 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; cursor:pointer; }
.or-select:focus { border-color:#F5A623; }
/* Shipping rec */
.or-rec-banner { display:flex; align-items:center; gap:12px; padding:12px 14px; background:#EAF3DE; border:0.5px solid #A8D888; border-radius:9px; margin-bottom:14px; }
.or-rec-icon { width:36px; height:36px; background:#3B6D11; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:18px; color:#FFFFFF; flex-shrink:0; }
.or-rec-body { flex:1; }
.or-rec-label { font-size:12px; font-weight:700; color:#111318; }
.or-rec-reason { font-size:11px; color:#5A5F6E; margin-top:1px; }
.or-ship-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; }
/* Action bar */
.or-action-bar { display:flex; align-items:center; gap:8px; padding:14px 20px; background:#FFFFFF; border-top:0.5px solid #E8E4DF; position:sticky; bottom:0; z-index:10; }
.or-btn-primary { background:#F5A623; border:none; border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; color:#1A1200; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-primary:hover { background:#E8980F; }
.or-btn-ghost { background:none; border:0.5px solid #E2DDD8; border-radius:8px; padding:9px 16px; font-size:13px; font-weight:500; color:#3A3D4A; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-ghost:hover { background:#F5F2EE; }
.or-btn-danger { background:none; border:0.5px solid #F5C5C5; border-radius:8px; padding:9px 16px; font-size:13px; font-weight:500; color:#A32D2D; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-danger:hover { background:#FCEBEB; }
.or-return-all { margin-right:auto; }
</style>
<h2 class="sr-only">Order Review — WO #${wo.id}</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('wo-detail',{woId:${wo.id}})">WO #${wo.id}</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Review order</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div style="flex:1;overflow-y:auto;">
      <div class="or-content">
        <div class="or-page-title">Review order — WO #${wo.id}</div>
        <div class="or-page-sub">${wo.machine} · ${wo.asset} · ${_items.length} item${_items.length!==1?'s':''}</div>

        <!-- Line items -->
        <div class="or-card">
          <div class="or-card-header">
            <div class="or-card-title"><i class="ti ti-list" style="font-size:15px;color:#F5A623;"></i> Order items</div>
            <button class="or-btn-ghost" style="font-size:11px;padding:5px 10px;" onclick="orReturnAll()"><i class="ti ti-arrow-back-up" style="font-size:12px;"></i> Return all to cart</button>
          </div>
          <div id="or-items-wrap">
            ${renderItemsTable()}
          </div>
        </div>

        ${renderSupplierMessages()}

        <!-- Ship To / Bill To -->
        <div class="or-card">
          <div class="or-card-header">
            <div class="or-card-title"><i class="ti ti-map-pin" style="font-size:15px;color:#9CA3AF;"></i> Addresses</div>
          </div>
          <div class="or-card-body">
            <div class="or-addr-cols">
              <div>
                <div class="or-addr-label">Ship To</div>
                ${addrBlock('or-ship-to', _shipTo)}
              </div>
              <div>
                <div class="or-addr-label">Bill To</div>
                ${addrBlock('or-bill-to', _billTo)}
              </div>
            </div>
          </div>
        </div>

        <!-- Order options -->
        <div class="or-card">
          <div class="or-card-header">
            <div class="or-card-title"><i class="ti ti-settings" style="font-size:15px;color:#9CA3AF;"></i> Order options</div>
          </div>
          <div class="or-card-body">
            <div class="or-opts-grid">
              <div class="or-field-row">
                <label class="or-label">PO # <span style="color:#C8C3BC;">(optional)</span></label>
                <input class="or-input" id="or-po-num" value="${_opts.poNum}" placeholder="Enter PO number"/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Order type</label>
                <input class="or-input" value="Standard" readonly/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Requested delivery date <span style="color:#A32D2D;font-size:10px;">${wo.dueDate ? '(must be on or before WO due date '+wo.dueDate+')' : ''}</span></label>
                <input class="or-input" id="or-req-date" type="date" value="${_opts.requestedDate}" max="${wo.dueDate || ''}"/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Payment terms</label>
                <input class="or-input" value="MQ Terms" readonly/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Full name</label>
                <input class="or-input" id="or-full-name" value="${_opts.fullName}" placeholder="Full name"/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Ordered by</label>
                <input class="or-input" value="${_opts.orderedBy}" readonly/>
              </div>
              <div class="or-field-row">
                <label class="or-label">Notify by</label>
                <select class="or-select" id="or-notify-by">
                  <option value="email" ${_opts.notifyBy==='email'?'selected':''}>Email</option>
                  <option value="phone" ${_opts.notifyBy==='phone'?'selected':''}>Phone</option>
                  <option value="fax" ${_opts.notifyBy==='fax'?'selected':''}>Fax</option>
                </select>
              </div>
              <div class="or-field-row">
                <label class="or-label">Phone</label>
                <input class="or-input" id="or-phone" value="${_opts.phone}" placeholder="Phone number"/>
              </div>
              <div class="or-field-row" style="grid-column:1/-1;">
                <label class="or-label">Email address</label>
                <input class="or-input" id="or-email" value="${_opts.email}" placeholder="Email address"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping -->
        <div class="or-card">
          <div class="or-card-header">
            <div class="or-card-title"><i class="ti ti-truck" style="font-size:15px;color:#9CA3AF;"></i> Shipping</div>
          </div>
          <div class="or-card-body">
            <div class="or-rec-banner" id="or-rec-banner">
              <div class="or-rec-icon"><i class="ti ti-robot"></i></div>
              <div class="or-rec-body">
                <div class="or-rec-label">System recommendation: ${_rec.carrier} ${_rec.service} <span style="font-size:10px;font-weight:700;border-radius:4px;padding:2px 7px;margin-left:4px;${recBadgeColor(_rec.badge)}">${_rec.badge}</span></div>
                <div class="or-rec-reason">${_rec.reason}${totalWeight() > 0 ? ' · Est. weight: ' + totalWeight().toFixed(1) + ' lb' : ''}</div>
              </div>
            </div>
            <div class="or-ship-grid">
              <div class="or-field-row">
                <label class="or-label">Carrier</label>
                <select class="or-select" id="or-carrier">
                  <option value="FedEx" ${_ship.carrier==='FedEx'?'selected':''}>FedEx</option>
                  <option value="UPS" ${_ship.carrier==='UPS'?'selected':''}>UPS</option>
                  <option value="USPS" ${_ship.carrier==='USPS'?'selected':''}>USPS</option>
                  <option value="DHL" ${_ship.carrier==='DHL'?'selected':''}>DHL</option>
                  <option value="Other" ${_ship.carrier==='Other'?'selected':''}>Other / Fleet carrier</option>
                </select>
              </div>
              <div class="or-field-row">
                <label class="or-label">Service level</label>
                <select class="or-select" id="or-service">
                  <option value="Priority Overnight" ${_ship.service==='Priority Overnight'?'selected':''}>Priority Overnight</option>
                  <option value="2-Day Air" ${_ship.service==='2-Day Air'?'selected':''}>2-Day Air</option>
                  <option value="Express Saver" ${_ship.service==='Express Saver'?'selected':''}>Express Saver (3-day)</option>
                  <option value="Ground" ${_ship.service==='Ground'?'selected':''}>Ground</option>
                  <option value="Freight" ${_ship.service==='Freight'?'selected':''}>Freight / LTL</option>
                </select>
              </div>
              <div class="or-field-row">
                <label class="or-label">Ship option</label>
                <select class="or-select" id="or-ship-option">
                  <option value="ship-complete" ${_ship.shipOption==='ship-complete'?'selected':''}>Ship complete</option>
                  <option value="partial" ${_ship.shipOption==='partial'?'selected':''}>Partial ship &amp; B/O remainder</option>
                </select>
              </div>
              <div class="or-field-row">
                <label class="or-label">Freight terms</label>
                <select class="or-select" id="or-freight-terms">
                  <option value="" ${_ship.terms===''?'selected':''}>— (blank)</option>
                  <option value="collect" ${_ship.terms==='collect'?'selected':''}>Collect</option>
                  <option value="prepaid" ${_ship.terms==='prepaid'?'selected':''}>Prepaid</option>
                </select>
              </div>
              <div class="or-field-row" style="grid-column:1/-1;">
                <label class="or-label">Fleet carrier account # <span style="color:#C8C3BC;">(optional)</span></label>
                <input class="or-input" id="or-carrier-acct" value="${_ship.carrierAccount}" placeholder="Enter carrier account number"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="or-card">
          <div class="or-card-header">
            <div class="or-card-title"><i class="ti ti-message" style="font-size:15px;color:#9CA3AF;"></i> Comments</div>
          </div>
          <div class="or-card-body">
            <textarea class="or-textarea" id="or-comments" placeholder="Special instructions, delivery notes, or comments for the vendor…">${_comments}</textarea>
          </div>
        </div>

        <div style="height:80px;"></div>
      </div>
    </div>

    <div class="or-action-bar">
      <button class="or-btn-danger" onclick="orCancel()"><i class="ti ti-x" style="font-size:13px;"></i> Cancel order</button>
      <div style="flex:1;"></div>
      <div style="font-size:12px;color:#7A7F8E;margin-right:12px;">${_items.length} item${_items.length!==1?'s':''} · <strong style="color:#111318;">$${subtotal().toFixed(2)}</strong></div>
      <button class="or-btn-primary" onclick="orSubmitOrder()"><i class="ti ti-check" style="font-size:13px;"></i> Submit order</button>
    </div>
  </div>
</div>`;

  // Wire up address inputs
  function wireAddr(blockId, obj) {
    const block = document.getElementById(blockId);
    if (!block) return;
    block.querySelectorAll('input[data-key]').forEach(function(inp) {
      inp.addEventListener('input', function() { obj[this.dataset.key] = this.value; });
    });
  }
  wireAddr('or-ship-to', _shipTo);
  wireAddr('or-bill-to', _billTo);

  // Requested date validation
  const reqDate = document.getElementById('or-req-date');
  if (reqDate && wo.dueDate) {
    reqDate.addEventListener('change', function() {
      if (wo.dueDate && this.value > wo.dueDate) {
        this.style.borderColor = '#A32D2D';
        this.title = 'Date exceeds WO due date';
      } else {
        this.style.borderColor = '';
        this.title = '';
      }
    });
  }

  // Return a single item to cart
  window.orReturnItem = function(partId) {
    _items = _items.filter(c => c.id !== partId);
    if (!_items.length) {
      Router.navigate('wo-detail', { woId: wo.id });
      return;
    }
    const wrap = document.getElementById('or-items-wrap');
    if (wrap) wrap.innerHTML = renderItemsTable();
    document.querySelector('.or-action-bar div strong') && (document.querySelector('.or-action-bar').innerHTML = document.querySelector('.or-action-bar').innerHTML); // re-render action bar total
    // Re-render action bar
    const bar = document.querySelector('.or-action-bar');
    if (bar) {
      bar.querySelector('div strong') && (bar.children[1].innerHTML = _items.length + ' item' + (_items.length!==1?'s':'') + ' · <strong style="color:#111318;">$'+subtotal().toFixed(2)+'</strong>');
    }
  };

  // Return all items to cart
  window.orReturnAll = function() {
    Modal.confirm('Return all items to cart? The order will be discarded.', function() {
      Router.navigate('wo-detail', { woId: wo.id });
    });
  };

  // Cancel order
  window.orCancel = function() {
    Modal.confirm('Cancel this order and return to Work Order #' + wo.id + '?', function() {
      Router.navigate('wo-detail', { woId: wo.id });
    });
  };

  // Submit order
  window.orSubmitOrder = function() {
    if (!_items.length) return;

    // Collect current field values
    const poNum = (document.getElementById('or-po-num') || {}).value || '';
    const reqDateVal = (document.getElementById('or-req-date') || {}).value || '';
    const fullName = (document.getElementById('or-full-name') || {}).value || '';
    const notifyBy = (document.getElementById('or-notify-by') || {}).value || 'email';
    const phone = (document.getElementById('or-phone') || {}).value || '';
    const email = (document.getElementById('or-email') || {}).value || '';
    const carrier = (document.getElementById('or-carrier') || {}).value || '';
    const service = (document.getElementById('or-service') || {}).value || '';
    const shipOption = (document.getElementById('or-ship-option') || {}).value || '';
    const freightTerms = (document.getElementById('or-freight-terms') || {}).value || '';
    const carrierAcct = (document.getElementById('or-carrier-acct') || {}).value || '';
    const comments = (document.getElementById('or-comments') || {}).value || '';

    // Date validation
    if (reqDateVal && wo.dueDate && reqDateVal > wo.dueDate) {
      Modal.show({ title: 'Date error', body: '<div style="padding:16px;font-size:13px;color:#A32D2D;">Requested delivery date cannot exceed the WO due date (' + wo.dueDate + ').</div>', actions: [{ label: 'OK', primary: true, onClick: () => Modal.close() }] });
      return;
    }

    const orderMeta = {
      shipTo: Object.assign({}, _shipTo),
      billTo: Object.assign({}, _billTo),
      poNum, fullName, notifyBy, phone, email,
      requestedDate: reqDateVal,
      carrier, service, shipOption, freightTerms, carrierAcct, comments,
      systemRecommendation: _rec,
    };

    const submitted = Store.submitWoCartItems(wo.id, _items.map(c => c.id), orderMeta);

    if (submitted) {
      Modal.show({
        title: 'Order submitted',
        body: `<div style="text-align:center;padding:20px 16px;">
          <div style="width:56px;height:56px;background:#EAF3DE;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#3B6D11;margin:0 auto 14px;"><i class="ti ti-circle-check"></i></div>
          <div style="font-size:15px;font-weight:700;color:#111318;margin-bottom:6px;">${submitted.poNum}</div>
          <div style="font-size:13px;color:#7A7F8E;">Order submitted for WO #${wo.id}</div>
          <div style="font-size:12px;color:#9CA3AF;margin-top:4px;">${_items.length} item${_items.length!==1?'s':''} · $${subtotal().toFixed(2)} · ${carrier} ${service}</div>
        </div>`,
        actions: [
          { label: 'View order history', onClick: () => { Modal.close(); Router.navigate('order-history'); } },
          { label: 'Back to WO', primary: true, onClick: () => { Modal.close(); Router.navigate('wo-detail', { woId: wo.id }); } },
        ],
      });
    }
  };
}
