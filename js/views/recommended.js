function render_recommended(el) {
  // Reason map: why the system recommends each part.
  // Types: 'wo' (active work order), 'warranty' (service under warranty), 'scheduled' (PM/inspection), 'wear' (flagged wear)
  var PART_REASONS = {
    'SKJ-103100': { type: 'wo',        badge: 'Active WO #100094', icon: 'ti-tool',         text: 'Hydraulic fault repair on FL-094 (SJIII 3219) — lift cylinder seal kit not yet in WO cart.' },
    'SKJ-103278': { type: 'wo',        badge: 'Active WO #100094', icon: 'ti-tool',         text: 'Pressure relief valve flagged in HYD-04 diagnostic — commonly replaced alongside seal kit.' },
    'SKJ-103601': { type: 'wo',        badge: 'Active WO #100094', icon: 'ti-tool',         text: 'Bleed screw kit required to re-prime hydraulic circuit after cylinder seal replacement.' },
    'SKJ-HF046-1G': { type: 'wo',     badge: 'Active WO #100094', icon: 'ti-tool',         text: 'Hydraulic fluid top-off required after seal work on FL-094. ISO 46 specified by Skyjack.' },
    'SKJ-104880': { type: 'wo',        badge: 'Active WO #100094', icon: 'ti-tool',         text: 'Return-line filter should be replaced during any hydraulic seal service to prevent contamination.' },
    'SKJ-HYD-201': { type: 'warranty', badge: 'Warranty — exp. Sep 2027', icon: 'ti-shield-check', text: 'FL-094 is under Skyjack warranty. Replace pump seals now to complete hydraulic repair under coverage.' },
    'SKJ-BAT-500': { type: 'scheduled', badge: '500-hr PM due',    icon: 'ti-calendar-event', text: 'FL-094 deep-cycle batteries are due for replacement at upcoming 500-hr service in ~18 days.' },
    'SKJ-PAD-601': { type: 'wear',     badge: 'Inspection flag',   icon: 'ti-alert-triangle', text: 'Wear pad wear noted during last PM on FL-088. Replace before next utilization cycle.' },
    'SKJ-4632-SEA': { type: 'wo',      badge: 'Active WO #100081', icon: 'ti-tool',         text: 'FL-088 (SJIII 4632) lift cylinder leaking — seal kit not yet added to active WO cart.' },
    'CAT-1R0716':  { type: 'scheduled', badge: '250-hr service due', icon: 'ti-calendar-event', text: 'Cat 320 (FL-102) engine oil service is due within 2 weeks. OEM filter recommended.' },
    'CAT-TRK-7201': { type: 'wo',      badge: 'Active WO #100102', icon: 'ti-tool',         text: 'Track adjuster cylinder leaking grease on FL-102 — add before submitting WO parts order.' },
    'CAT-ROL-7303': { type: 'wear',    badge: 'Inspection flag',   icon: 'ti-alert-triangle', text: 'Undercarriage inspection on FL-102 flagged bottom roller wear exceeding 30% threshold.' },
    'CAT-CYL-8005': { type: 'warranty', badge: 'Warranty — active', icon: 'ti-shield-check', text: 'Cat 320 (FL-102) boom cylinder seal replacement covered under active Cat warranty. Order now.' },
    'TOY-MCH-114': { type: 'scheduled', badge: '2,000-hr mast service', icon: 'ti-calendar-event', text: 'Toyota 8FGU25 mast chain inspection interval approaching — chains showing elongation in last check.' },
    'TOY-TLT-203': { type: 'wo',       badge: 'Active WO #100099', icon: 'ti-tool',         text: 'Tilt cylinder hydraulic leak reported on forklift FL-099 — seal kit not yet added to WO.' },
    'TOY-32-SEA':  { type: 'scheduled', badge: '1,000-hr PM',       icon: 'ti-calendar-event', text: 'Toyota 8FGU32 lift cylinder seals are due at 1,000-hr PM scheduled for next month.' },
    'BOB-QC-520':  { type: 'wo',       badge: 'Active WO #100096', icon: 'ti-tool',         text: 'Quick coupler hydraulic leak on Bobcat S650 (FL-096) — seal kit not in WO cart yet.' },
  };

  var REASON_STYLES = {
    'wo':        { bg: '#FAEEDA', color: '#854F0B', border: '#F5A623' },
    'warranty':  { bg: '#EAF3DE', color: '#3B6D11', border: '#8DC751' },
    'scheduled': { bg: '#E6F1FB', color: '#185FA5', border: '#5DA0D6' },
    'wear':      { bg: '#FCEBEB', color: '#A32D2D', border: '#E87878' },
  };

  function reasonHtml(partId) {
    var r = PART_REASONS[partId];
    if (!r) return '<div class="part-card-reason"><i class="ti ti-sparkles" style="color:#854F0B;flex-shrink:0;margin-top:1px;"></i><span>Recommended for your fleet</span></div>';
    var s = REASON_STYLES[r.type] || REASON_STYLES['wo'];
    return '<div class="part-card-reason">'
      + '<span class="rec-reason-badge" style="background:' + s.bg + ';color:' + s.color + ';border-color:' + s.border + ';">'
      + '<i class="ti ' + r.icon + '" style="font-size:10px;"></i>' + r.badge + '</span>'
      + '<span class="rec-reason-text">' + r.text + '</span>'
      + '</div>';
  }

  function cartCount() { return Store.getCart().length; }
  function isInCart(partId) { return Store.getCart().some(function(c) { return c.id === partId; }); }

  function addToCart(partId) {
    var part = Store.getParts('', '').find(function(p) { return p.id === partId; });
    if (!part) return;
    Store.addToCart(part);
    re_render();
  }

  function renderCartStrip() {
    var count = cartCount();
    var total = Store.getCart().reduce(function(s, c) { return s + c.price * (c.qty || 1); }, 0);
    var strip = document.getElementById('rec-cart-strip');
    if (!strip) return;
    if (!count) { strip.style.display = 'none'; return; }
    strip.style.display = 'flex';
    strip.innerHTML = '<i class="ti ti-shopping-cart" style="font-size:18px;color:#F5A623;"></i><div style="flex:1;"><div class="cart-strip-label">' + count + ' item' + (count !== 1 ? 's' : '') + ' in cart · $' + total.toFixed(2) + '</div><div class="cart-strip-sub">Click "View cart" to submit your order</div></div><button class="cart-btn" onclick="recViewCart()">View cart</button>';
  }

  function re_render() {
    renderRecommendedParts();
    renderCartStrip();
  }

  var _vendorFilter = (Router.context && Router.context.vendor) || null;

  function renderRecommendedParts() {
    var container = document.getElementById('rec-parts-grid');
    if (!container) return;
    var parts = Store.getParts('', '').filter(function(p) {
      if (!p.recommended) return false;
      if (_vendorFilter && p.vendor !== _vendorFilter) return false;
      return true;
    }).slice(0, 12);
    if (!parts.length) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No recommended parts for this supplier.</div>';
      return;
    }
    container.innerHTML = parts.map(function(p) {
      var inCart = isInCart(p.id);
      var catIcon = p.category === 'Hydraulic' ? 'ti-droplet' : p.category === 'Seals' ? 'ti-circle-dashed' : p.category === 'Drive' ? 'ti-engine' : p.category === 'Electrical' ? 'ti-bolt' : p.category === 'Filtration' ? 'ti-filter' : 'ti-settings';
      return '<div class="part-card">'
        + '<div class="part-card-top"><div class="part-thumb"><i class="ti ' + catIcon + '"></i></div><div class="part-card-info"><div class="part-card-name">' + p.description + '</div><div class="part-card-num">' + p.partNum + (p.oemOnly ? ' <span class="oem-tag">OEM</span>' : '') + '</div></div></div>'
        + reasonHtml(p.id)
        + '<div class="part-card-bottom"><div><div class="part-card-price">$' + p.price.toFixed(2) + '</div><div class="part-card-avail"><div class="avail-dot ' + (p.inStock ? 'green' : 'amber') + '"></div><span class="avail-label ' + (p.inStock ? 'green' : 'amber') + '">' + (p.inStock ? 'In stock' : 'Backordered') + '</span></div></div>'
        + (inCart ? '<span class="in-cart-tag">In cart</span>' : '<button class="add-cart-btn" onclick="recAddToCart(\'' + p.id + '\')"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button>')
        + '</div></div>';
    }).join('');
  }

  var _recTitle = _vendorFilter ? ('Recommended — ' + _vendorFilter) : 'Recommended parts';
  var _recSub = _vendorFilter
    ? ('Showing recommended parts for <strong>' + _vendorFilter + '</strong>')
    : ('Personalized for your machines, work orders, and service schedule · ' + (Store.getCurrentLocation()||{name:'—'}).name);

  el.innerHTML = '<style>'
    + '.rec-content{flex:1;padding:24px;overflow-y:auto;}'
    + '.page-header{margin-bottom:20px;}'
    + '.page-title{font-size:20px;font-weight:700;color:#111318;letter-spacing:-0.3px;}'
    + '.page-title-sub{font-size:13px;color:#7A7F8E;margin-top:3px;}'
    + '.parts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;}'
    + '.part-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;}'
    + '.part-card:hover{border-color:#C8C3BC;}'
    + '.part-card-top{display:flex;align-items:flex-start;gap:10px;}'
    + '.part-thumb{width:44px;height:44px;background:#F5F2EE;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#C8C3BC;flex-shrink:0;}'
    + '.part-card-info{flex:1;min-width:0;}'
    + '.part-card-name{font-size:13px;font-weight:600;color:#111318;margin-bottom:2px;line-height:1.3;}'
    + '.part-card-num{font-size:11px;color:#9CA3AF;}'
    + '.oem-tag{background:#F5F2EE;color:#5A5F6E;font-size:10px;font-weight:600;border-radius:4px;padding:1px 5px;}'
    + '.part-card-reason{display:flex;flex-direction:column;gap:5px;padding:9px 10px;background:#F5F2EE;border-radius:7px;}'
    + '.rec-reason-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;border-radius:4px;padding:2px 7px;border:0.5px solid;width:fit-content;letter-spacing:0.1px;}'
    + '.rec-reason-text{font-size:11px;color:#5A5F6E;line-height:1.5;}'
    + '.part-card-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:0.5px solid #F0ECE8;}'
    + '.part-card-price{font-size:14px;font-weight:700;color:#111318;}'
    + '.part-card-avail{display:flex;align-items:center;gap:4px;font-size:11px;}'
    + '.avail-dot{width:6px;height:6px;border-radius:50%;}'
    + '.avail-dot.green{background:#639922;}.avail-dot.amber{background:#BA7517;}'
    + '.avail-label.green{color:#3B6D11;}.avail-label.amber{color:#854F0B;}'
    + '.in-cart-tag{background:#FAEEDA;color:#854F0B;font-size:11px;font-weight:600;border-radius:5px;padding:5px 10px;}'
    + '.add-cart-btn{background:#F5A623;border:none;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;}'
    + '.add-cart-btn:hover{background:#E8980F;}'
    + '.cart-strip{position:sticky;bottom:0;background:#1E1E1E;border-radius:12px;padding:12px 18px;display:flex;align-items:center;gap:12px;margin-top:8px;}'
    + '.cart-strip-label{font-size:13px;font-weight:600;color:#FFFFFF;}'
    + '.cart-strip-sub{font-size:11px;color:#5C6070;}'
    + '.cart-btn{background:#F5A623;border:none;border-radius:7px;padding:7px 16px;font-size:12px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;}'
    + '.rec-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}'
    + '.rec-section-left{display:flex;align-items:center;gap:10px;}'
    + '.rec-section-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}'
    + '.icon-amber{background:#FAEEDA;color:#854F0B;}'
    + '.rec-section-title{font-size:15px;font-weight:700;color:#111318;letter-spacing:-0.2px;}'
    + '.rec-section-sub{font-size:12px;color:#9CA3AF;margin-top:2px;}'
    + '.rec-legend{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}'
    + '.rec-legend-item{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#7A7F8E;}'
    + '.rec-legend-dot{width:8px;height:8px;border-radius:2px;}'
    + '</style>'
    + '<h2 class="sr-only">Recommended parts</h2><div class="shell">' + buildSidebar('recommended') + '<div class="main"><div class="topbar"><div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;"><a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt(\'dashboard\')">Dashboard</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Recommended parts</span></div><div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>' + buildTopbarRight() + '</div>'
    + '<div class="rec-content">'
    + '<div class="page-header" id="rec-page-header"><div class="page-title">' + _recTitle + '</div><div class="page-title-sub">' + _recSub + '</div></div>'
    + '<div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-amber"><i class="ti ti-sparkles"></i></div><div><div class="rec-section-title">Recommended for your active fleet</div><div class="rec-section-sub">Based on active WOs, warranty status, and service schedule</div></div></div>'
    + '<div class="rec-legend"><span class="rec-legend-item"><span class="rec-legend-dot" style="background:#F5A623;"></span>Active WO</span><span class="rec-legend-item"><span class="rec-legend-dot" style="background:#8DC751;"></span>Warranty</span><span class="rec-legend-item"><span class="rec-legend-dot" style="background:#5DA0D6;"></span>Scheduled PM</span><span class="rec-legend-item"><span class="rec-legend-dot" style="background:#E87878;"></span>Wear flag</span></div>'
    + '</div>'
    + '<div class="parts-grid" id="rec-parts-grid"></div>'
    + '<div class="cart-strip" id="rec-cart-strip" style="display:none;"></div>'
    + '</div></div></div>';

  function renderVendorChip() {
    var header = document.getElementById('rec-page-header');
    if (!header) return;
    var existing = document.getElementById('rec-vendor-chip');
    if (existing) existing.remove();
    if (!_vendorFilter) return;
    var chip = document.createElement('div');
    chip.id = 'rec-vendor-chip';
    chip.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:10px;';
    chip.innerHTML = '<span style="font-size:11px;color:#7A7F8E;">Filtered by:</span>'
      + '<span style="display:inline-flex;align-items:center;gap:5px;background:#FAEEDA;border:0.5px solid #F5A623;border-radius:100px;padding:3px 10px;font-size:12px;font-weight:600;color:#854F0B;">'
      + '<i class="ti ti-building-store" style="font-size:11px;"></i>'
      + _vendorFilter
      + '<button onclick="recClearVendor()" style="background:none;border:none;padding:0;margin-left:2px;cursor:pointer;color:#854F0B;font-size:14px;line-height:1;display:flex;align-items:center;" title="Remove filter">×</button>'
      + '</span>';
    header.appendChild(chip);
  }

  re_render();
  renderVendorChip();

  window.recClearVendor = function() {
    _vendorFilter = null;
    renderVendorChip();
    re_render();
  };

  window.recAddToCart = function(partId) {
    addToCart(partId);
  };

  window.recViewCart = function() {
    var cart = Store.getCart();
    if (!cart.length) {
      Modal.show({ title: 'Cart is empty', body: '<p style="color:#9CA3AF;font-size:13px;">Add parts to cart first.</p>' });
      return;
    }
    var total = cart.reduce(function(s, c) { return s + c.price * (c.qty || 1); }, 0);
    var wos = Store.getWorkOrders('active');
    var woOptions = wos.map(function(w) { return '<option value="' + w.id + '">' + w.machine + ' — WO #' + w.id + '</option>'; }).join('');
    var rows = cart.map(function(c) { return '<tr><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;">' + c.description + '<br><span style="font-size:11px;color:#9CA3AF;">' + c.partNum + '</span></td><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;">' + (c.qty||1) + '</td><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;text-align:right;font-weight:600;">$' + (c.price*(c.qty||1)).toFixed(2) + '</td></tr>'; }).join('');
    var body = '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><thead><tr style="background:#FAFAF8;"><th style="text-align:left;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Part</th><th style="text-align:left;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Qty</th><th style="text-align:right;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Price</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td colspan="2" style="padding:8px 10px;font-size:13px;font-weight:600;color:#111318;">Total</td><td style="padding:8px 10px;font-size:14px;font-weight:700;color:#111318;text-align:right;">$' + total.toFixed(2) + '</td></tr></tfoot></table><div style="margin-bottom:8px;"><label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Assign to Work Order</label><select id="rec-cart-wo" style="width:100%;height:36px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;outline:none;"><option value="">No WO (general)</option>' + woOptions + '</select></div>';
    Modal.show({ title: 'Review Cart', body: body, wide: true, actions: [{ label: 'Cancel', onClick: function() { Modal.close(); } }, { label: 'Confirm Order', primary: true, onClick: function() { var woId = document.getElementById('rec-cart-wo').value; Store.submitCart(woId || null); Modal.close(); re_render(); sendPrompt('Open order history'); } }] });
  };
}
