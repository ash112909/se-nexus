function render_order_review(el) {
  const ctx = Router.context || {};
  const woId = ctx.woId;
  const itemIds = ctx.itemIds || [];
  const wo = woId ? Store.getWorkOrder(woId) : null;

  if (!wo || !itemIds.length) {
    el.innerHTML = `<div class="shell">${buildSidebar('wo')}<div class="main"><div style="padding:40px;color:#9CA3AF;font-size:14px;">No order data. <a style="color:#1C3969;cursor:pointer;" onclick="history.back()">Go back</a></div></div></div>`;
    return;
  }

  const cart = Store.getWoCart(wo.id);
  const allItems = cart.filter(c => itemIds.includes(c.id));

  // ── PO Split Logic ────────────────────────────────────────────────────────
  // Items with selectedSources → one PO per source location (branch transfer / local stock)
  // Remaining items → one PO per vendor (external supplier order)
  function buildPoGroups(items) {
    const groups = [];
    const externalItems = [];

    items.forEach(c => {
      const sources = c.selectedSources || (c.selectedSource ? [c.selectedSource] : []);
      if (sources.length) {
        // Split by each source location
        sources.forEach(src => {
          const locKey = src.locationName || src.locationId || 'Local';
          let g = groups.find(x => x.type === 'local' && x.key === locKey);
          if (!g) {
            g = { type: 'local', key: locKey, label: locKey, icon: 'ti-map-pin', items: [] };
            groups.push(g);
          }
          // Push a copy of the item with only this source's qty
          g.items.push(Object.assign({}, c, { qty: src.qty || c.qty || 1, selectedSources: [src], selectedSource: src }));
        });
        // If item also has external qty (total qty > sum of source qtys), add remainder to external
        const srcTotal = sources.reduce((s, x) => s + (x.qty || 0), 0);
        const remaining = (c.qty || 1) - srcTotal;
        if (remaining > 0) externalItems.push(Object.assign({}, c, { qty: remaining, selectedSources: [], selectedSource: null }));
      } else {
        externalItems.push(c);
      }
    });

    // Group remaining external items by vendor
    const vendorMap = {};
    externalItems.forEach(c => {
      const v = c.vendor || 'Unknown';
      if (!vendorMap[v]) vendorMap[v] = [];
      vendorMap[v].push(c);
    });
    Object.entries(vendorMap).sort(([a],[b]) => a.localeCompare(b)).forEach(([vendor, vitems]) => {
      groups.push({ type: 'vendor', key: vendor, label: vendor, icon: 'ti-building', items: vitems });
    });

    return groups;
  }

  const _groups = buildPoGroups(allItems);
  let _activeGroupIdx = 0;
  // Per-group form state
  const _groupState = _groups.map(g => {
    const dueDate = wo.dueDate ? new Date(wo.dueDate) : null;
    const today = new Date();
    const daysUntilDue = dueDate ? Math.ceil((dueDate - today) / 86400000) : 99;
    const priority = wo.priority || 'medium';
    const allInStock = g.items.every(c => c.inStock !== false);
    let rec;
    if (priority === 'high' || daysUntilDue <= 3) rec = { carrier: 'FedEx', service: 'Priority Overnight', reason: 'High priority WO or due date within 3 days', badge: 'Urgent' };
    else if (daysUntilDue <= 7 || !allInStock) rec = { carrier: 'FedEx', service: '2-Day Air', reason: daysUntilDue <= 7 ? 'Due date within 7 days' : 'Some items may ship when available', badge: 'Expedited' };
    else rec = { carrier: 'UPS', service: 'Ground', reason: 'Standard priority with adequate lead time', badge: 'Standard' };
    if (g.type === 'local') rec = { carrier: 'Internal', service: 'Branch Transfer', reason: 'Fulfilling from ' + g.label, badge: 'Transfer' };
    const _orUser = Store.getCurrentUser();
    return {
      items: g.items,
      submitted: false,
      poNum: '',
      requestedDate: wo.dueDate || '',
      fullName: _orUser ? _orUser.displayName : 'James Whitfield',
      orderedBy: _orUser ? _orUser.shortName : 'James W.',
      notifyBy: 'email',
      phone: _orUser ? _orUser.phone : '(512) 555-0182',
      email: _orUser ? _orUser.email : 'james.w@midcountyrental.com',
      shipTo: { name: (Store.getCurrentLocation() || {}).name || 'Austin Branch', attn: _orUser ? _orUser.shortName : 'James W.', addr1: '1204 N Lamar Blvd', addr2: '', city: 'Austin', state: 'TX', zip: '78703', phone: _orUser ? _orUser.phone : '(512) 555-0182' },
      billTo: { name: 'Mid-County Rental', attn: 'Accounts Payable', addr1: '1204 N Lamar Blvd', addr2: '', city: 'Austin', state: 'TX', zip: '78703', phone: '(512) 555-0100' },
      carrier: rec.carrier,
      service: rec.service,
      shipOption: 'ship-complete',
      freightTerms: '',
      carrierAccount: '',
      comments: '',
      rec,
    };
  });

  const _orUser = Store.getCurrentUser();
  const isSingleGroup = _groups.length === 1;

  function recBadgeColor(badge) {
    if (badge === 'Urgent')   return 'background:#FCEBEB;color:#A32D2D;border:0.5px solid #F5C5C5;';
    if (badge === 'Expedited') return 'background:#D6E4F7;color:#1C3969;border:0.5px solid #1C3969;';
    if (badge === 'Transfer')  return 'background:#EEEDFE;color:#534AB7;border:0.5px solid #C8C3F2;';
    return 'background:#EAF3DE;color:#3B6D11;border:0.5px solid #A8D888;';
  }

  function renderOrderMessages(placement) {
    if (!Store.getCmsArticles) return '';
    const msgs = Store.getCmsArticles('published').filter(a => a.orderMsg && a.placement === placement);
    if (!msgs.length) return '';
    return msgs.map(a => {
      const isSupplier = !!a.supplierNote;
      const accentColor = isSupplier ? '#534AB7' : '#1C3969';
      const bgColor = isSupplier ? '#EEEDFE' : '#EFF4FB';
      const label = isSupplier ? (a.vendorName || 'Supplier') : 'Fleet message';
      return `<div style="background:${bgColor};border-radius:9px;padding:11px 14px;margin-bottom:12px;border-left:3px solid ${accentColor};">
        <div style="font-size:11px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">${label}${a.date ? `<span style="font-weight:400;color:#9CA3AF;margin-left:8px;text-transform:none;">${a.date}</span>` : ''}</div>
        <div style="font-size:13px;font-weight:600;color:#111318;margin-bottom:2px;">${a.title}</div>
        ${a.body ? `<div style="font-size:12px;color:#5A5F6E;line-height:1.55;">${a.body}</div>` : ''}
      </div>`;
    }).join('');
  }

  function renderSupplierMessages(groupItems) {
    if (!Store.getCmsArticles) return '';
    const vendors = [...new Set(groupItems.map(c => c.vendor).filter(Boolean))];
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

  function renderItemsTable(items) {
    const subtotal = items.reduce((s, c) => s + c.price * (c.qty || 1), 0);
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
      </tr></thead>
      <tbody>${items.map(c => `
        <tr class="or-row" data-id="${c.id}">
          <td><div class="or-partnum">${c.partNum}</div><div class="or-vendor">${c.vendor}</div></td>
          <td><div class="or-desc">${c.description}</div>${c.selectedSources && c.selectedSources.length ? `<div class="or-src-line"><i class="ti ti-map-pin" style="font-size:9px;"></i> ${c.selectedSources.map(s=>s.locationName+(s.qty?' ('+s.qty+')':'')).join(', ')}</div>` : ''}</td>
          <td style="text-align:center;"><span class="or-uom">${c.uom || 'EA'}</span></td>
          <td style="text-align:center;font-size:13px;font-weight:600;color:#111318;">${c.qty || 1}</td>
          <td style="text-align:right;font-size:12px;color:#7A7F8E;">$${c.price.toFixed(2)}</td>
          <td style="text-align:right;font-size:13px;font-weight:700;color:#111318;">$${(c.price * (c.qty || 1)).toFixed(2)}</td>
          <td style="text-align:center;font-size:11px;color:#7A7F8E;">${c.weight ? c.weight + ' lb' : '—'}</td>
          <td style="text-align:center;font-size:11px;color:#7A7F8E;">${c.dimensions || '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="or-items-footer">
      <div style="flex:1;"></div>
      <div class="or-subtotal-row"><span style="font-size:12px;color:#7A7F8E;">Subtotal (${items.length} item${items.length!==1?'s':''})</span><span style="font-size:15px;font-weight:700;color:#111318;margin-left:16px;">$${subtotal.toFixed(2)}</span></div>
    </div>`;
  }

  function addrBlock(idPrefix, obj) {
    return `<div class="or-addr-block" id="${idPrefix}">
      <div class="or-field-row"><label class="or-label">Company / location</label><input class="or-input" data-key="name" value="${obj.name}" placeholder="Company name"/></div>
      <div class="or-field-row"><label class="or-label">Attn</label><input class="or-input" data-key="attn" value="${obj.attn}" placeholder="Attention"/></div>
      <div class="or-field-row"><label class="or-label">Address line 1</label><input class="or-input" data-key="addr1" value="${obj.addr1}" placeholder="Street address"/></div>
      <div class="or-field-row"><label class="or-label">Address line 2</label><input class="or-input" data-key="addr2" value="${obj.addr2}" placeholder="Suite, building, etc."/></div>
      <div class="or-field-row-3">
        <div class="or-field-grow"><label class="or-label">City</label><input class="or-input" data-key="city" value="${obj.city}" placeholder="City"/></div>
        <div style="width:54px;"><label class="or-label">State</label><input class="or-input" data-key="state" value="${obj.state}" placeholder="ST" maxlength="2" style="text-transform:uppercase;"/></div>
        <div style="width:80px;"><label class="or-label">ZIP</label><input class="or-input" data-key="zip" value="${obj.zip}" placeholder="ZIP"/></div>
      </div>
      <div class="or-field-row"><label class="or-label">Phone</label><input class="or-input" data-key="phone" value="${obj.phone}" placeholder="Phone number"/></div>
    </div>`;
  }

  function renderGroupForm(gi) {
    const g = _groups[gi];
    const st = _groupState[gi];
    const rec = st.rec;
    const isLocal = g.type === 'local';
    const subtotal = st.items.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    return `
      <div class="or-card">
        <div class="or-card-header">
          <div class="or-card-title"><i class="ti ti-list" style="font-size:15px;color:#1C3969;"></i> Order items — ${g.label}</div>
        </div>
        <div>${renderItemsTable(st.items)}</div>
      </div>

      ${renderSupplierMessages(st.items)}
      ${renderOrderMessages('order-form-top')}

      <!-- Addresses -->
      <div class="or-card">
        <div class="or-card-header"><div class="or-card-title"><i class="ti ti-map-pin" style="font-size:15px;color:#9CA3AF;"></i> Addresses</div></div>
        <div class="or-card-body">
          <div class="or-addr-cols">
            <div><div class="or-addr-label">Ship To</div>${addrBlock('or-ship-to-' + gi, st.shipTo)}</div>
            <div><div class="or-addr-label">Bill To</div>${addrBlock('or-bill-to-' + gi, st.billTo)}</div>
          </div>
        </div>
      </div>

      <!-- Order options -->
      <div class="or-card">
        <div class="or-card-header"><div class="or-card-title"><i class="ti ti-settings" style="font-size:15px;color:#9CA3AF;"></i> Order options</div></div>
        <div class="or-card-body">
          <div class="or-opts-grid">
            <div class="or-field-row"><label class="or-label">PO # <span style="color:#C8C3BC;">(optional)</span></label><input class="or-input" id="or-po-num-${gi}" value="${st.poNum}" placeholder="Enter PO number"/></div>
            <div class="or-field-row"><label class="or-label">Order type</label><input class="or-input" value="${isLocal ? 'Branch Transfer' : 'Standard'}" readonly/></div>
            <div class="or-field-row"><label class="or-label">Requested delivery date${wo.dueDate ? ` <span style="color:#A32D2D;font-size:10px;">(on or before ${wo.dueDate})</span>` : ''}</label><input class="or-input" id="or-req-date-${gi}" type="date" value="${st.requestedDate}" max="${wo.dueDate || ''}"/></div>
            <div class="or-field-row"><label class="or-label">Payment terms</label><input class="or-input" value="MQ Terms" readonly/></div>
            <div class="or-field-row"><label class="or-label">Full name</label><input class="or-input" id="or-full-name-${gi}" value="${st.fullName}" placeholder="Full name"/></div>
            <div class="or-field-row"><label class="or-label">Ordered by</label><input class="or-input" value="${st.orderedBy}" readonly/></div>
            <div class="or-field-row"><label class="or-label">Notify by</label><select class="or-select" id="or-notify-by-${gi}"><option value="email" ${st.notifyBy==='email'?'selected':''}>Email</option><option value="phone" ${st.notifyBy==='phone'?'selected':''}>Phone</option><option value="fax" ${st.notifyBy==='fax'?'selected':''}>Fax</option></select></div>
            <div class="or-field-row"><label class="or-label">Phone</label><input class="or-input" id="or-phone-${gi}" value="${st.phone}" placeholder="Phone number"/></div>
            <div class="or-field-row" style="grid-column:1/-1;"><label class="or-label">Email address</label><input class="or-input" id="or-email-${gi}" value="${st.email}" placeholder="Email address"/></div>
          </div>
        </div>
      </div>

      <!-- Shipping -->
      <div class="or-card">
        <div class="or-card-header"><div class="or-card-title"><i class="ti ti-truck" style="font-size:15px;color:#9CA3AF;"></i> Shipping</div></div>
        <div class="or-card-body">
          <div class="or-rec-banner" style="${recBadgeColor(rec.badge).replace(/;/g,';').split('background:')[0]}background:${recBadgeColor(rec.badge).match(/background:([^;]+)/)?.[1]||'#EAF3DE'};border:0.5px solid ${recBadgeColor(rec.badge).match(/border:[^s][^;]+;/)?.[0]?.replace('border:','').replace(';','')||'#A8D888'};border-radius:9px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:36px;height:36px;background:${isLocal?'#534AB7':'#3B6D11'};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;flex-shrink:0;"><i class="ti ${isLocal?'ti-arrows-transfer-up':'ti-robot'}"></i></div>
            <div><div style="font-size:12px;font-weight:700;color:#111318;">${isLocal ? 'Branch Transfer — ' + g.label : 'System recommendation: ' + rec.carrier + ' ' + rec.service} <span style="font-size:10px;font-weight:700;border-radius:4px;padding:2px 7px;margin-left:4px;${recBadgeColor(rec.badge)}">${rec.badge}</span></div><div style="font-size:11px;color:#5A5F6E;margin-top:1px;">${rec.reason}</div></div>
          </div>
          <div class="or-ship-grid">
            <div class="or-field-row"><label class="or-label">Carrier</label>
              <select class="or-select" id="or-carrier-${gi}">
                <option value="FedEx" ${st.carrier==='FedEx'?'selected':''}>FedEx</option>
                <option value="UPS" ${st.carrier==='UPS'?'selected':''}>UPS</option>
                <option value="USPS" ${st.carrier==='USPS'?'selected':''}>USPS</option>
                <option value="DHL" ${st.carrier==='DHL'?'selected':''}>DHL</option>
                <option value="Internal" ${st.carrier==='Internal'?'selected':''}>Internal transfer</option>
                <option value="Other" ${st.carrier==='Other'?'selected':''}>Other / Fleet carrier</option>
              </select>
            </div>
            <div class="or-field-row"><label class="or-label">Service level</label>
              <select class="or-select" id="or-service-${gi}">
                <option value="Priority Overnight" ${st.service==='Priority Overnight'?'selected':''}>Priority Overnight</option>
                <option value="2-Day Air" ${st.service==='2-Day Air'?'selected':''}>2-Day Air</option>
                <option value="Express Saver" ${st.service==='Express Saver'?'selected':''}>Express Saver (3-day)</option>
                <option value="Ground" ${st.service==='Ground'?'selected':''}>Ground</option>
                <option value="Branch Transfer" ${st.service==='Branch Transfer'?'selected':''}>Branch Transfer</option>
                <option value="Freight" ${st.service==='Freight'?'selected':''}>Freight / LTL</option>
              </select>
            </div>
            <div class="or-field-row"><label class="or-label">Ship option</label>
              <select class="or-select" id="or-ship-option-${gi}">
                <option value="ship-complete" ${st.shipOption==='ship-complete'?'selected':''}>Ship complete</option>
                <option value="partial" ${st.shipOption==='partial'?'selected':''}>Partial ship &amp; B/O remainder</option>
              </select>
            </div>
            <div class="or-field-row"><label class="or-label">Freight terms</label>
              <select class="or-select" id="or-freight-terms-${gi}">
                <option value="" ${st.freightTerms===''?'selected':''}>— (blank)</option>
                <option value="collect" ${st.freightTerms==='collect'?'selected':''}>Collect</option>
                <option value="prepaid" ${st.freightTerms==='prepaid'?'selected':''}>Prepaid</option>
              </select>
            </div>
            <div class="or-field-row" style="grid-column:1/-1;"><label class="or-label">Fleet carrier account # <span style="color:#C8C3BC;">(optional)</span></label><input class="or-input" id="or-carrier-acct-${gi}" value="${st.carrierAccount}" placeholder="Enter carrier account number"/></div>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div class="or-card">
        <div class="or-card-header"><div class="or-card-title"><i class="ti ti-message" style="font-size:15px;color:#9CA3AF;"></i> Comments</div></div>
        <div class="or-card-body"><textarea class="or-textarea" id="or-comments-${gi}" placeholder="Special instructions, delivery notes, or comments…">${st.comments}</textarea></div>
      </div>

      ${renderOrderMessages('order-form-bottom')}
      <div style="height:80px;"></div>`;
  }

  function renderTabs() {
    if (isSingleGroup) return '';
    const total = _groups.length;
    return `<div class="or-po-tabs">
      ${_groups.map((g, i) => {
        const st = _groupState[i];
        const done = st.submitted;
        const active = i === _activeGroupIdx;
        return `<div class="or-po-tab ${active?'active':''} ${done?'done':''}" onclick="orSetGroup(${i})">
          <span class="or-po-tab-num">${done ? '<i class="ti ti-circle-check" style="font-size:12px;"></i>' : (i+1) + '/' + total}</span>
          <span class="or-po-tab-label"><i class="ti ${g.icon}" style="font-size:11px;margin-right:4px;"></i>${g.label}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  function renderActionBar() {
    const gi = _activeGroupIdx;
    const g = _groups[gi];
    const st = _groupState[gi];
    const subtotal = st.items.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const allSubmitted = _groupState.every(s => s.submitted);
    const pendingCount = _groupState.filter(s => !s.submitted).length;
    return `<div class="or-action-bar" id="or-action-bar">
      <button class="or-btn-danger" onclick="orCancel()"><i class="ti ti-x" style="font-size:13px;"></i> Cancel order</button>
      <div style="flex:1;"></div>
      ${!isSingleGroup ? `<span style="font-size:12px;color:#7A7F8E;margin-right:8px;">PO ${gi+1} of ${_groups.length}</span>` : ''}
      <div style="font-size:12px;color:#7A7F8E;margin-right:12px;">${st.items.length} item${st.items.length!==1?'s':''} · <strong style="color:#111318;">$${subtotal.toFixed(2)}</strong></div>
      ${st.submitted
        ? `<button class="or-btn-ghost" style="color:#3B6D11;border-color:#A8D888;" disabled><i class="ti ti-circle-check" style="font-size:13px;color:#3B6D11;"></i> Submitted</button>${_activeGroupIdx < _groups.length-1 ? `<button class="or-btn-primary" onclick="orSetGroup(${gi+1})">Next PO <i class="ti ti-arrow-right" style="font-size:13px;"></i></button>` : ''}`
        : `<button class="or-btn-primary" onclick="orSubmitGroup(${gi})"><i class="ti ti-check" style="font-size:13px;"></i> Submit${isSingleGroup ? ' order' : ' PO ' + (gi+1) + ' of ' + _groups.length}</button>`
      }
    </div>`;
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
.or-items-footer { display:flex; align-items:center; padding:10px 16px; border-top:0.5px solid #F0ECE8; background:#FAFAF8; }
.or-subtotal-row { display:flex; align-items:center; }
.or-addr-cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.or-addr-label { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; }
.or-field-row { margin-bottom:8px; }
.or-field-row-3 { display:flex; gap:8px; margin-bottom:8px; }
.or-field-grow { flex:1; }
.or-label { font-size:11px; color:#9CA3AF; display:block; margin-bottom:3px; }
.or-input { width:100%; height:32px; border:1px solid #E2DDD8; border-radius:6px; padding:0 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; }
.or-input:focus { border-color:#1C3969; background:#FFFFFF; }
.or-input[readonly] { background:#F5F2EE; color:#7A7F8E; cursor:default; }
.or-textarea { width:100%; border:1px solid #E2DDD8; border-radius:6px; padding:8px 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; resize:vertical; min-height:68px; }
.or-textarea:focus { border-color:#1C3969; background:#FFFFFF; }
.or-opts-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; }
.or-select { width:100%; height:32px; border:1px solid #E2DDD8; border-radius:6px; padding:0 9px; font-size:12px; font-family:inherit; color:#111318; background:#FAFAF8; outline:none; cursor:pointer; }
.or-select:focus { border-color:#1C3969; }
.or-ship-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; }
/* Multi-PO tab bar */
.or-po-tabs { display:flex; background:#FFFFFF; border-bottom:1px solid #E8E4DF; padding:0 24px; flex-shrink:0; overflow-x:auto; }
.or-po-tab { display:flex; flex-direction:column; align-items:center; padding:10px 18px; cursor:pointer; border-bottom:2px solid transparent; min-width:110px; gap:3px; }
.or-po-tab:hover { background:#FAFAF8; }
.or-po-tab.active { border-bottom-color:#1C3969; }
.or-po-tab-num { font-size:10px; font-weight:700; color:#9CA3AF; letter-spacing:.5px; }
.or-po-tab.active .or-po-tab-num { color:#1C3969; }
.or-po-tab.done .or-po-tab-num { color:#3B6D11; }
.or-po-tab-label { font-size:12px; font-weight:600; color:#5A5F6E; white-space:nowrap; }
.or-po-tab.active .or-po-tab-label { color:#111318; }
/* Action bar */
.or-action-bar { display:flex; align-items:center; gap:8px; padding:14px 20px; background:#FFFFFF; border-top:0.5px solid #E8E4DF; position:sticky; bottom:0; z-index:10; }
.or-btn-primary { background:#1C3969; border:none; border-radius:8px; padding:9px 20px; font-size:13px; font-weight:600; color:#FFFFFF; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-primary:hover { background:#152B52; }
.or-btn-ghost { background:none; border:0.5px solid #E2DDD8; border-radius:8px; padding:9px 16px; font-size:13px; font-weight:500; color:#3A3D4A; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-ghost:hover { background:#F5F2EE; }
.or-btn-danger { background:none; border:0.5px solid #F5C5C5; border-radius:8px; padding:9px 16px; font-size:13px; font-weight:500; color:#A32D2D; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
.or-btn-danger:hover { background:#FCEBEB; }
</style>
<h2 class="sr-only">Order Review — WO #${wo.id}</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('home')">Home</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('wo-list')">Orders</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('wo-detail',{woId:${wo.id}})">WO #${wo.id}</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Review order</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    ${renderTabs()}

    <div style="flex:1;overflow-y:auto;" id="or-scroll-area">
      <div class="or-content" id="or-group-content">
        <div class="or-page-title">Review order — WO #${wo.id}</div>
        <div class="or-page-sub">${wo.machine} · ${wo.asset}${!isSingleGroup ? ` · ${_groups.length} purchase orders` : ` · ${allItems.length} item${allItems.length!==1?'s':''}`}</div>
        ${renderGroupForm(0)}
      </div>
    </div>

    ${renderActionBar()}
  </div>
</div>`;

  function wireAddrs(gi) {
    function wireAddr(blockId, obj) {
      const block = document.getElementById(blockId);
      if (!block) return;
      block.querySelectorAll('input[data-key]').forEach(inp => {
        inp.addEventListener('input', function() { obj[this.dataset.key] = this.value; });
      });
    }
    wireAddr('or-ship-to-' + gi, _groupState[gi].shipTo);
    wireAddr('or-bill-to-' + gi, _groupState[gi].billTo);

    const reqDate = document.getElementById('or-req-date-' + gi);
    if (reqDate && wo.dueDate) {
      reqDate.addEventListener('change', function() {
        this.style.borderColor = (wo.dueDate && this.value > wo.dueDate) ? '#A32D2D' : '';
      });
    }
  }
  wireAddrs(0);

  window.orSetGroup = function(gi) {
    // Save current form state before switching
    _saveGroupState(_activeGroupIdx);
    _activeGroupIdx = gi;
    const content = document.getElementById('or-group-content');
    if (content) {
      content.innerHTML = `
        <div class="or-page-title">Review order — WO #${wo.id}</div>
        <div class="or-page-sub">${wo.machine} · ${wo.asset}${!isSingleGroup ? ` · ${_groups.length} purchase orders` : ''}</div>
        ${renderGroupForm(gi)}`;
      wireAddrs(gi);
    }
    // Re-render tabs
    const tabsEl = el.querySelector('.or-po-tabs');
    if (tabsEl) { const tmp = document.createElement('div'); tmp.innerHTML = renderTabs(); tabsEl.replaceWith(tmp.firstElementChild); }
    // Re-render action bar
    const bar = document.getElementById('or-action-bar');
    if (bar) { const tmp = document.createElement('div'); tmp.innerHTML = renderActionBar(); bar.replaceWith(tmp.firstElementChild); }
    // Scroll to top
    const scroll = document.getElementById('or-scroll-area');
    if (scroll) scroll.scrollTop = 0;
  };

  function _saveGroupState(gi) {
    const st = _groupState[gi];
    st.poNum         = (document.getElementById('or-po-num-' + gi) || {}).value || st.poNum;
    st.requestedDate = (document.getElementById('or-req-date-' + gi) || {}).value || st.requestedDate;
    st.fullName      = (document.getElementById('or-full-name-' + gi) || {}).value || st.fullName;
    st.notifyBy      = (document.getElementById('or-notify-by-' + gi) || {}).value || st.notifyBy;
    st.phone         = (document.getElementById('or-phone-' + gi) || {}).value || st.phone;
    st.email         = (document.getElementById('or-email-' + gi) || {}).value || st.email;
    st.carrier       = (document.getElementById('or-carrier-' + gi) || {}).value || st.carrier;
    st.service       = (document.getElementById('or-service-' + gi) || {}).value || st.service;
    st.shipOption    = (document.getElementById('or-ship-option-' + gi) || {}).value || st.shipOption;
    st.freightTerms  = (document.getElementById('or-freight-terms-' + gi) || {}).value || st.freightTerms;
    st.carrierAccount = (document.getElementById('or-carrier-acct-' + gi) || {}).value || st.carrierAccount;
    st.comments      = (document.getElementById('or-comments-' + gi) || {}).value || st.comments;
  }

  window.orSubmitGroup = function(gi) {
    _saveGroupState(gi);
    const st = _groupState[gi];

    if (st.requestedDate && wo.dueDate && st.requestedDate > wo.dueDate) {
      Modal.show({ title: 'Date error', body: '<div style="padding:16px;font-size:13px;color:#A32D2D;">Requested delivery date cannot exceed the WO due date (' + wo.dueDate + ').</div>', actions: [{ label: 'OK', primary: true, onClick: () => Modal.close() }] });
      return;
    }

    const orderMeta = {
      shipTo: Object.assign({}, st.shipTo),
      billTo: Object.assign({}, st.billTo),
      poNum: st.poNum, fullName: st.fullName, notifyBy: st.notifyBy,
      phone: st.phone, email: st.email, requestedDate: st.requestedDate,
      carrier: st.carrier, service: st.service, shipOption: st.shipOption,
      freightTerms: st.freightTerms, carrierAcct: st.carrierAccount, comments: st.comments,
    };

    const itemIds = st.items.map(c => c.id);
    const submitted = Store.submitWoCartItems(wo.id, itemIds, orderMeta);
    if (!submitted) return;

    st.submitted = true;
    st.poNum = submitted.poNum;

    const pendingGroups = _groupState.filter((s, i) => !s.submitted);
    const allDone = pendingGroups.length === 0;

    if (allDone) {
      const poList = _groupState.map((s, i) => `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:0.5px solid #F0ECE8;"><span style="font-size:12px;color:#5A5F6E;">${_groups[i].label}</span><span style="font-size:12px;font-weight:700;color:#111318;">${s.poNum}</span></div>`).join('');
      const grandTotal = _groupState.reduce((s, st2) => s + st2.items.reduce((a, c) => a + c.price * (c.qty || 1), 0), 0);
      Modal.show({
        title: isSingleGroup ? 'Order submitted' : 'All orders submitted',
        body: `<div style="text-align:center;padding:20px 16px 12px;">
          <div style="width:56px;height:56px;background:#EAF3DE;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#3B6D11;margin:0 auto 14px;"><i class="ti ti-circle-check"></i></div>
          <div style="font-size:15px;font-weight:700;color:#111318;margin-bottom:4px;">${isSingleGroup ? submitted.poNum : _groups.length + ' purchase orders submitted'}</div>
          <div style="font-size:13px;color:#7A7F8E;">For WO #${wo.id}</div>
        </div>
        ${!isSingleGroup ? `<div style="padding:0 16px 16px;">${poList}<div style="display:flex;justify-content:flex-end;padding-top:8px;"><span style="font-size:13px;font-weight:700;color:#111318;">Total: $${grandTotal.toFixed(2)}</span></div></div>` : `<div style="font-size:12px;color:#9CA3AF;text-align:center;padding-bottom:16px;">${submitted.poNum} · $${grandTotal.toFixed(2)} · ${st.carrier} ${st.service}</div>`}`,
        actions: [
          { label: 'View order history', onClick: () => { Modal.close(); Router.navigate('order-history'); } },
          { label: 'Back to WO', primary: true, onClick: () => { Modal.close(); Router.navigate('wo-detail', { woId: wo.id }); } },
        ],
      });
    } else {
      // Mark as done, advance to next pending
      const nextIdx = _groupState.findIndex((s, i) => !s.submitted);
      Modal.show({
        title: 'PO submitted',
        body: `<div style="padding:16px;text-align:center;">
          <div style="font-size:13px;font-weight:700;color:#111318;margin-bottom:4px;">${submitted.poNum}</div>
          <div style="font-size:13px;color:#7A7F8E;">${_groups[gi].label} — ${st.items.length} item${st.items.length!==1?'s':''}</div>
          <div style="font-size:12px;color:#9CA3AF;margin-top:8px;">${pendingGroups.length} order${pendingGroups.length!==1?'s':''} remaining</div>
        </div>`,
        actions: [{ label: 'Continue to next order →', primary: true, onClick: () => { Modal.close(); window.orSetGroup(nextIdx); } }],
      });
    }
  };

  window.orReturnAll = function() {
    Modal.confirm('Return all items to cart? The order will be discarded.', function() {
      Router.navigate('wo-detail', { woId: wo.id });
    });
  };

  window.orCancel = function() {
    Modal.confirm('Cancel this order and return to Work Order #' + wo.id + '?', function() {
      Router.navigate('wo-detail', { woId: wo.id });
    });
  };
}
