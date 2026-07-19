function render_recommended(el) {

  // ── Reason map: why each part is recommended ───────────────────────────────
  // woId present → add to that WO's cart; absent → prompt WO creation
  var PART_REASONS = {
    'SKJ-103100':  { type: 'wo',        woId: 100094, badge: 'Order #100094',       icon: 'ti-tool',           text: 'Hydraulic fault repair on FL-094 (SJIII 3219) — lift cylinder seal kit not yet in order cart.' },
    'SKJ-103278':  { type: 'wo',        woId: 100094, badge: 'Order #100094',       icon: 'ti-tool',           text: 'Pressure relief valve flagged in HYD-04 diagnostic — commonly replaced alongside seal kit.' },
    'SKJ-103601':  { type: 'wo',        woId: 100094, badge: 'Order #100094',       icon: 'ti-tool',           text: 'Bleed screw kit required to re-prime hydraulic circuit after cylinder seal replacement.' },
    'SKJ-HF046-1G':{ type: 'wo',        woId: 100094, badge: 'Order #100094',       icon: 'ti-tool',           text: 'Hydraulic fluid top-off required after seal work on FL-094. ISO 46 specified by Skyjack.' },
    'SKJ-104880':  { type: 'wo',        woId: 100094, badge: 'Order #100094',       icon: 'ti-tool',           text: 'Return-line filter should be replaced during any hydraulic seal service to prevent contamination.' },
    'SKJ-HYD-201': { type: 'warranty',  asset: 'FL-094', machine: 'Skyjack SJIII 3219', badge: 'Warranty — exp. Sep 2027', icon: 'ti-shield-check',   text: 'FL-094 is under Skyjack warranty. Replace pump seals now to complete hydraulic repair under coverage.' },
    'SKJ-BAT-500': { type: 'scheduled', asset: 'FL-094', machine: 'Skyjack SJIII 3219', badge: '500-hr PM due',    icon: 'ti-calendar-event', text: 'FL-094 deep-cycle batteries are due for replacement at upcoming 500-hr service in ~18 days.' },
    'SKJ-PAD-601': { type: 'wear',      asset: 'FL-088', machine: 'Skyjack SJIII 4632', badge: 'Inspection flag',  icon: 'ti-alert-triangle', text: 'Wear pad wear noted during last PM on FL-088. Replace before next utilization cycle.' },
    'SKJ-4632-SEA':{ type: 'wo',        woId: 100081, badge: 'Order #100081',       icon: 'ti-tool',           text: 'FL-088 (SJIII 4632) lift cylinder leaking — seal kit not yet added to order cart.' },
    'CAT-1R0716':  { type: 'scheduled', asset: 'FL-102', machine: 'Cat 320 Excavator',  badge: '250-hr service due',icon: 'ti-calendar-event', text: 'Cat 320 (FL-102) engine oil service is due within 2 weeks. OEM filter recommended.' },
    'CAT-TRK-7201':{ type: 'wo',        woId: 100102, badge: 'Order #100102',       icon: 'ti-tool',           text: 'Track adjuster cylinder leaking grease on FL-102 — add before submitting parts order.' },
    'CAT-ROL-7303':{ type: 'wear',      asset: 'FL-102', machine: 'Cat 320 Excavator',  badge: 'Inspection flag',  icon: 'ti-alert-triangle', text: 'Undercarriage inspection on FL-102 flagged bottom roller wear exceeding 30% threshold.' },
    'CAT-CYL-8005':{ type: 'warranty',  asset: 'FL-102', machine: 'Cat 320 Excavator',  badge: 'Warranty — active',icon: 'ti-shield-check',   text: 'Cat 320 (FL-102) boom cylinder seal replacement covered under active Cat warranty. Order now.' },
    'TOY-MCH-114': { type: 'scheduled', asset: 'FL-031', machine: 'Toyota 8FGU25',      badge: '2,000-hr mast service', icon: 'ti-calendar-event', text: 'Toyota 8FGU25 mast chain inspection interval approaching — chains showing elongation in last check.' },
    'TOY-TLT-203': { type: 'wo',        woId: 100099, badge: 'Order #100099',       icon: 'ti-tool',           text: 'Tilt cylinder hydraulic leak reported on forklift FL-099 — seal kit not yet added to order.' },
    'TOY-32-SEA':  { type: 'scheduled', asset: 'SM-004', machine: 'Toyota 8FGU32',      badge: '1,000-hr PM',      icon: 'ti-calendar-event', text: 'Toyota 8FGU32 lift cylinder seals are due at 1,000-hr PM scheduled for next month.' },
    'BOB-QC-520':  { type: 'wo',        woId: 100096, badge: 'Order #100096',       icon: 'ti-tool',           text: 'Quick coupler hydraulic leak on Bobcat S650 (FL-096) — seal kit not in order cart yet.' },
  };

  var REASON_STYLES = {
    'wo':        { bg: '#FAEEDA', color: '#854F0B', border: '#F5A623' },
    'warranty':  { bg: '#EAF3DE', color: '#3B6D11', border: '#8DC751' },
    'scheduled': { bg: '#E6F1FB', color: '#185FA5', border: '#5DA0D6' },
    'wear':      { bg: '#FCEBEB', color: '#A32D2D', border: '#E87878' },
  };

  var CAT_META = {
    'Seals':       { icon: 'ti-circle-dashed', color: '#185FA5', bg: '#E6F1FB' },
    'Hydraulic':   { icon: 'ti-droplet',        color: '#854F0B', bg: '#FAEEDA' },
    'Electrical':  { icon: 'ti-bolt',           color: '#534AB7', bg: '#EEEDFE' },
    'Drive':       { icon: 'ti-engine',         color: '#3B6D11', bg: '#EAF3DE' },
    'Structure':   { icon: 'ti-building',       color: '#5A5F6E', bg: '#F0ECE8' },
    'Filtration':  { icon: 'ti-filter',         color: '#0F6E56', bg: '#E1F5EE' },
  };

  var _vendorFilter = (Router.context && Router.context.vendor) || null;

  // ── Cart helpers ──────────────────────────────────────────────────────────

  function isInCart(partId) {
    var r = PART_REASONS[partId];
    if (r && r.woId) {
      return Store.getWoCart(r.woId).some(function(c) { return c.id === partId; });
    }
    return Store.getCart().some(function(c) { return c.id === partId; });
  }

  function cartItemCount() {
    // Count unique recommended parts currently in any cart
    return getRecommendedParts().filter(function(p) { return isInCart(p.id); }).length;
  }

  // ── Part list ─────────────────────────────────────────────────────────────

  function getRecommendedParts() {
    return Store.getParts('', '').filter(function(p) {
      if (!p.recommended) return false;
      if (_vendorFilter && p.vendor !== _vendorFilter) return false;
      return true;
    });
  }

  // ── Add to cart logic ─────────────────────────────────────────────────────

  function doAddToCart(partId) {
    var part = Store.getParts('', '').find(function(p) { return p.id === partId; });
    if (!part) return;
    var r = PART_REASONS[partId];

    if (r && r.woId) {
      // Has an active WO — add directly to that WO's cart
      var wo = Store.getWorkOrder(r.woId);
      if (wo) {
        Store.addToWoCart(r.woId, part);
        re_render();
        return;
      }
    }

    // No WO (scheduled PM, warranty, wear flag, or WO not found) → prompt
    var assetLabel = (r && r.asset) ? r.asset : 'this asset';
    var machineLabel = (r && r.machine) ? r.machine : 'this machine';
    var badgeLabel = (r && r.badge) ? r.badge : 'Recommended';

    var inputStyle = 'width:100%;height:34px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;background:#FFFFFF;';
    var labelStyle = 'display:block;font-size:11px;font-weight:600;color:#5A5F6E;margin-bottom:4px;';
    var fieldStyle = 'margin-bottom:10px;';
    var optStyle   = 'font-size:10px;font-weight:400;color:#9CA3AF;margin-left:4px;';

    Modal.show({
      title: 'No active order',
      body: '<div style="display:flex;flex-direction:column;gap:12px;">'
        + '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:#FFF8EC;border:0.5px solid #F5C97A;border-radius:9px;">'
        + '<i class="ti ti-alert-triangle" style="font-size:16px;color:#854F0B;flex-shrink:0;margin-top:1px;"></i>'
        + '<div style="font-size:12px;color:#7A5510;line-height:1.5;"><strong>' + assetLabel + '</strong>' + (machineLabel !== assetLabel ? ' (' + machineLabel + ')' : '') + ' has no active order. Create one to track this part, or add to a general order.</div>'
        + '</div>'
        + '<div style="font-size:12px;font-weight:600;color:#3A3D4A;">Part: ' + part.description + ' <span style="color:#9CA3AF;font-weight:400;">· ' + part.partNum + ' · $' + part.price.toFixed(2) + '</span></div>'
        + '<div style="border:0.5px solid #E2DDD8;border-radius:10px;padding:14px;background:#FAFAF8;">'
        + '<div style="font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px;">New order <span style="font-weight:400;letter-spacing:0;text-transform:none;">— all fields optional</span></div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
        + '<div style="' + fieldStyle + 'grid-column:1/-1;"><label style="' + labelStyle + '">Description / issue <span style="' + optStyle + '">optional</span></label><input id="rec-wo-issue" style="' + inputStyle + '" placeholder="e.g. 500-hr PM, hydraulic seal replacement…" value="' + (r && r.badge ? r.badge : '') + '"/></div>'
        + '<div style="' + fieldStyle + '"><label style="' + labelStyle + '">Asset ID <span style="' + optStyle + '">optional</span></label><input id="rec-wo-asset" style="' + inputStyle + '" placeholder="e.g. FL-094" value="' + (assetLabel !== 'this asset' ? assetLabel : '') + '"/></div>'
        + '<div style="' + fieldStyle + '"><label style="' + labelStyle + '">Machine / model <span style="' + optStyle + '">optional</span></label><input id="rec-wo-machine" style="' + inputStyle + '" placeholder="e.g. Skyjack SJIII 3219" value="' + (machineLabel !== 'this machine' ? machineLabel : '') + '"/></div>'
        + '<div style="' + fieldStyle + '"><label style="' + labelStyle + '">Priority <span style="' + optStyle + '">optional</span></label><select id="rec-wo-priority" style="' + inputStyle + 'height:34px;"><option value="">— select —</option><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select></div>'
        + '<div style="' + fieldStyle + '"><label style="' + labelStyle + '">Due date <span style="' + optStyle + '">optional</span></label><input id="rec-wo-due" type="date" style="' + inputStyle + '"/></div>'
        + '<div style="' + fieldStyle + 'grid-column:1/-1;"><label style="' + labelStyle + '">Order / ERP reference <span style="' + optStyle + '">optional</span></label><input id="rec-wo-extid" style="' + inputStyle + '" placeholder="e.g. RM-10122, PO-7890"/></div>'
        + '</div></div>'
        + '</div>',
      actions: [
        {
          label: 'Create order & add part',
          primary: true,
          onClick: function() {
            var machine = (document.getElementById('rec-wo-machine') || {}).value || machineLabel;
            var asset   = (document.getElementById('rec-wo-asset') || {}).value || assetLabel;
            var issue   = (document.getElementById('rec-wo-issue') || {}).value || badgeLabel;
            var priority = (document.getElementById('rec-wo-priority') || {}).value || 'medium';
            var dueRaw  = (document.getElementById('rec-wo-due') || {}).value;
            var extId   = (document.getElementById('rec-wo-extid') || {}).value;
            var dueDate = dueRaw ? new Date(dueRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            var newWo = Store.addWorkOrder({ machine: machine, asset: asset, issue: issue, woType: 'equipment', priority: priority, dueDate: dueDate, externalId: extId });
            Store.addToWoCart(newWo.id, part);
            Modal.close();
            re_render();
          },
        },
        {
          label: 'Add to general order',
          onClick: function() {
            Store.addToCart(part);
            Modal.close();
            re_render();
          },
        },
        { label: 'Cancel', onClick: function() { Modal.close(); } },
      ],
    });
  }

  // ── Reason HTML ──────────────────────────────────────────────────────────

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

  // ── Cart button in header ────────────────────────────────────────────────

  function renderCartBtn() {
    var btn = document.getElementById('rec-cart-btn');
    if (!btn) return;
    var count = cartItemCount();
    if (!count) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'flex';
      btn.innerHTML = '<i class="ti ti-shopping-cart" style="font-size:13px;"></i> View cart'
        + '<span style="background:#F5A623;color:#1A1200;font-size:10px;font-weight:700;border-radius:999px;padding:1px 6px;margin-left:4px;">' + count + '</span>';
    }
  }

  // ── Parts grid by category ───────────────────────────────────────────────

  function renderRecommendedParts() {
    var container = document.getElementById('rec-parts-body');
    if (!container) return;
    var parts = getRecommendedParts();
    if (!parts.length) {
      container.innerHTML = '<div style="padding:60px;text-align:center;color:#9CA3AF;font-size:13px;">No recommended parts.</div>';
      return;
    }

    // Group by category preserving a defined order
    var CAT_ORDER = ['Seals', 'Hydraulic', 'Filtration', 'Drive', 'Electrical', 'Structure'];
    var byCategory = {};
    parts.forEach(function(p) {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p);
    });

    var cats = CAT_ORDER.filter(function(c) { return byCategory[c] && byCategory[c].length; });
    // Any categories not in the order list go at the end
    Object.keys(byCategory).forEach(function(c) {
      if (cats.indexOf(c) === -1) cats.push(c);
    });

    container.innerHTML = cats.map(function(cat) {
      var catParts = byCategory[cat];
      var meta = CAT_META[cat] || { icon: 'ti-package', color: '#9CA3AF', bg: '#F5F2EE' };
      var cardsHtml = catParts.map(function(p) {
        var inCart = isInCart(p.id);
        var r = PART_REASONS[p.id];
        var woLabel = '';
        if (inCart && r && r.woId) {
          woLabel = 'In WO #' + r.woId;
        } else if (inCart) {
          woLabel = 'In cart';
        }
        return '<div class="part-card">'
          + '<div class="part-card-top">'
          + '<div class="part-thumb" style="background:' + meta.bg + ';color:' + meta.color + ';"><i class="ti ' + meta.icon + '"></i></div>'
          + '<div class="part-card-info">'
          + '<div class="part-card-name">' + p.description + '</div>'
          + '<div class="part-card-num">' + p.partNum + (p.oemOnly ? ' <span class="oem-tag">OEM</span>' : '') + '</div>'
          + '</div></div>'
          + reasonHtml(p.id)
          + '<div class="part-card-bottom">'
          + '<div><div class="part-card-price">$' + p.price.toFixed(2) + '</div>'
          + '<div class="part-card-avail"><div class="avail-dot ' + (p.inStock ? 'green' : 'amber') + '"></div><span class="avail-label ' + (p.inStock ? 'green' : 'amber') + '">' + (p.inStock ? 'In stock' : 'Backordered') + '</span></div>'
          + '</div>'
          + (inCart
            ? '<span class="in-cart-tag"><i class="ti ti-check" style="font-size:11px;"></i> ' + woLabel + '</span>'
            : '<button class="add-cart-btn" onclick="recAddToCart(\'' + p.id + '\')"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button>')
          + '</div></div>';
      }).join('');

      return '<div class="rec-cat-section">'
        + '<div class="rec-cat-hdr">'
        + '<div style="width:26px;height:26px;border-radius:6px;background:' + meta.bg + ';display:flex;align-items:center;justify-content:center;font-size:13px;color:' + meta.color + ';flex-shrink:0;"><i class="ti ' + meta.icon + '"></i></div>'
        + '<div style="font-size:13px;font-weight:700;color:#111318;">' + cat + '</div>'
        + '<div style="font-size:11px;color:#9CA3AF;">' + catParts.length + ' part' + (catParts.length !== 1 ? 's' : '') + '</div>'
        + '</div>'
        + '<div class="parts-grid">' + cardsHtml + '</div>'
        + '</div>';
    }).join('');
  }

  function re_render() {
    renderRecommendedParts();
    renderCartBtn();
  }

  var _recTitle = _vendorFilter ? ('Recommended — ' + _vendorFilter) : 'Recommended parts';
  var _recSub = _vendorFilter
    ? ('Showing recommended parts for <strong>' + _vendorFilter + '</strong>')
    : ('Personalized for your machines, work orders, and service schedule · ' + ((Store.getCurrentLocation() || {}).name || '—'));

  el.innerHTML = '<style>'
    + '.rec-content{flex:1;padding:24px;overflow-y:auto;}'
    + '.rec-page-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px;}'
    + '.page-title{font-size:20px;font-weight:700;color:#111318;letter-spacing:-0.3px;}'
    + '.page-title-sub{font-size:13px;color:#7A7F8E;margin-top:3px;}'
    + '.rec-cart-btn{display:none;align-items:center;gap:6px;background:#1E1E1E;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;color:#FFFFFF;cursor:pointer;font-family:inherit;flex-shrink:0;margin-top:2px;}'
    + '.rec-cart-btn:hover{background:#111318;}'
    + '.rec-legend{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:18px;}'
    + '.rec-legend-item{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#7A7F8E;}'
    + '.rec-legend-dot{width:8px;height:8px;border-radius:2px;}'
    + '.rec-cat-section{margin-bottom:28px;}'
    + '.rec-cat-hdr{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:10px;border-bottom:0.5px solid #E8E4DF;}'
    + '.parts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;}'
    + '.part-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;transition:border-color 0.12s;}'
    + '.part-card:hover{border-color:#C8C3BC;}'
    + '.part-card-top{display:flex;align-items:flex-start;gap:10px;}'
    + '.part-thumb{width:44px;height:44px;background:#F5F2EE;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}'
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
    + '.in-cart-tag{background:#EAF3DE;color:#3B6D11;font-size:11px;font-weight:600;border-radius:5px;padding:5px 10px;display:inline-flex;align-items:center;gap:4px;}'
    + '.add-cart-btn{background:#F5A623;border:none;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;}'
    + '.add-cart-btn:hover{background:#E8980F;}'
    + '</style>'
    + '<h2 class="sr-only">Recommended parts</h2>'
    + '<div class="shell">' + buildSidebar('recommended') + '<div class="main">'
    + '<div class="topbar">'
    + '<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;"><a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt(\'dashboard\')">Dashboard</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Recommended parts</span></div>'
    + '<div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>'
    + buildTopbarRight()
    + '</div>'
    + '<div class="rec-content">'
    + '<div class="rec-page-hdr">'
    + '<div><div class="page-title">' + _recTitle + '</div><div class="page-title-sub">' + _recSub + '</div></div>'
    + '<button class="rec-cart-btn" id="rec-cart-btn" onclick="recViewCart()"></button>'
    + '</div>'
    + '<div class="rec-legend">'
    + '<span class="rec-legend-item"><span class="rec-legend-dot" style="background:#F5A623;"></span>Active WO</span>'
    + '<span class="rec-legend-item"><span class="rec-legend-dot" style="background:#8DC751;"></span>Warranty</span>'
    + '<span class="rec-legend-item"><span class="rec-legend-dot" style="background:#5DA0D6;"></span>Scheduled PM</span>'
    + '<span class="rec-legend-item"><span class="rec-legend-dot" style="background:#E87878;"></span>Wear flag</span>'
    + '</div>'
    + '<div id="rec-parts-body"></div>'
    + '</div></div></div>';

  // Vendor chip
  (function renderVendorChip() {
    if (!_vendorFilter) return;
    var legend = el.querySelector('.rec-legend');
    if (!legend) return;
    var chip = document.createElement('div');
    chip.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:12px;';
    chip.innerHTML = '<span style="font-size:11px;color:#7A7F8E;">Filtered by:</span>'
      + '<span style="display:inline-flex;align-items:center;gap:5px;background:#FAEEDA;border:0.5px solid #F5A623;border-radius:100px;padding:3px 10px;font-size:12px;font-weight:600;color:#854F0B;">'
      + '<i class="ti ti-building-store" style="font-size:11px;"></i>' + _vendorFilter
      + '<button onclick="recClearVendor()" style="background:none;border:none;padding:0;margin-left:2px;cursor:pointer;color:#854F0B;font-size:14px;line-height:1;display:flex;align-items:center;" title="Remove filter">×</button>'
      + '</span>';
    legend.parentNode.insertBefore(chip, legend);
  })();

  re_render();

  // ── Public handlers ───────────────────────────────────────────────────────

  window.recClearVendor = function() {
    _vendorFilter = null;
    Router.navigate('recommended');
  };

  window.recAddToCart = function(partId) {
    doAddToCart(partId);
  };

  window.recViewCart = function() {
    // Collect all recommended parts currently in any cart, grouped by WO
    var allRec = getRecommendedParts();
    var byWo = {}; // woId (or 'general') → { label, items }

    allRec.forEach(function(p) {
      if (!isInCart(p.id)) return;
      var r = PART_REASONS[p.id];
      var key = (r && r.woId) ? String(r.woId) : 'general';
      if (!byWo[key]) {
        if (r && r.woId) {
          var wo = Store.getWorkOrder(r.woId);
          byWo[key] = { label: 'WO #' + r.woId + (wo ? ' — ' + (wo.machine || wo.asset) : ''), items: [] };
        } else {
          byWo[key] = { label: 'General order', items: [] };
        }
      }
      byWo[key].items.push(p);
    });

    var keys = Object.keys(byWo);
    if (!keys.length) {
      Modal.show({ title: 'Cart is empty', body: '<p style="color:#9CA3AF;font-size:13px;padding:8px 0;">Add parts using the "Add to cart" buttons below.</p>' });
      return;
    }

    var bodyHtml = keys.map(function(key) {
      var group = byWo[key];
      var rows = group.items.map(function(p) {
        var cartItems = key === 'general' ? Store.getCart() : Store.getWoCart(parseInt(key));
        var cartItem = cartItems.find(function(c) { return c.id === p.id; });
        var qty = cartItem ? (cartItem.qty || 1) : 1;
        return '<tr>'
          + '<td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;">' + p.description + '<br><span style="font-size:11px;color:#9CA3AF;">' + p.partNum + '</span></td>'
          + '<td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;text-align:center;">' + qty + '</td>'
          + '<td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;text-align:right;font-weight:600;">$' + (p.price * qty).toFixed(2) + '</td>'
          + '</tr>';
      }).join('');
      var total = group.items.reduce(function(s, p) {
        var cartItems = key === 'general' ? Store.getCart() : Store.getWoCart(parseInt(key));
        var ci = cartItems.find(function(c) { return c.id === p.id; });
        return s + p.price * ((ci && ci.qty) || 1);
      }, 0);
      return '<div style="margin-bottom:16px;">'
        + '<div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">' + group.label + '</div>'
        + '<table style="width:100%;border-collapse:collapse;">'
        + '<thead><tr style="background:#FAFAF8;"><th style="text-align:left;padding:6px 10px;font-size:11px;color:#9CA3AF;font-weight:600;border-bottom:1px solid #E8E4DF;">Part</th><th style="text-align:center;padding:6px 10px;font-size:11px;color:#9CA3AF;font-weight:600;border-bottom:1px solid #E8E4DF;">Qty</th><th style="text-align:right;padding:6px 10px;font-size:11px;color:#9CA3AF;font-weight:600;border-bottom:1px solid #E8E4DF;">Price</th></tr></thead>'
        + '<tbody>' + rows + '</tbody>'
        + '<tfoot><tr><td colspan="2" style="padding:6px 10px;font-size:12px;font-weight:600;color:#111318;">Subtotal</td><td style="padding:6px 10px;font-size:13px;font-weight:700;color:#111318;text-align:right;">$' + total.toFixed(2) + '</td></tr></tfoot>'
        + '</table>'
        + (key !== 'general'
          ? '<button onclick="recGoToWo(' + key + ');Modal.close();" style="margin-top:8px;padding:5px 12px;border-radius:7px;border:0.5px solid #E2DDD8;background:#FFFFFF;font-size:11px;font-weight:600;color:#111318;cursor:pointer;font-family:inherit;">Go to Order #' + key + ' <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>'
          : '')
        + '</div>';
    }).join('');

    Modal.show({
      title: 'Recommended cart',
      body: bodyHtml,
      wide: true,
      actions: [{ label: 'Close', onClick: function() { Modal.close(); } }],
    });
  };

  window.recGoToWo = function(woId) {
    Router.navigate('wo-detail', { woId: parseInt(woId) });
  };
}
