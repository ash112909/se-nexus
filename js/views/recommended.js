function render_recommended(el) {
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
    container.innerHTML = parts.map(function(p) {
      var inCart = isInCart(p.id);
      return '<div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ' + (p.category === 'Hydraulic' ? 'ti-droplet' : p.category === 'Seals' ? 'ti-circle-dashed' : p.category === 'Drive' ? 'ti-engine' : 'ti-settings') + '"></i></div><div class="part-card-info"><div class="part-card-name">' + p.description + '</div><div class="part-card-num">' + p.partNum + (p.oemOnly ? ' <span style="background:#F5F2EE;color:#5A5F6E;font-size:10px;font-weight:600;border-radius:4px;padding:1px 5px;">OEM</span>' : '') + '</div></div></div><div class="part-card-reason"><i class="ti ti-star" style="color:#854F0B;"></i> Recommended for your fleet · ' + p.vendor + '</div><div class="part-card-bottom"><div><div class="part-card-price">$' + p.price.toFixed(2) + '</div><div class="part-card-avail"><div class="avail-dot ' + (p.inStock ? 'green' : 'amber') + '"></div><span class="avail-label ' + (p.inStock ? 'green' : 'amber') + '">' + (p.inStock ? 'In stock' : 'Backordered') + '</span></div></div>' + (inCart ? '<span style="background:#FAEEDA;color:#854F0B;font-size:11px;font-weight:600;border-radius:5px;padding:5px 10px;">In cart</span>' : '<button class="add-cart-btn" onclick="recAddToCart(\'' + p.id + '\')"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button>') + '</div></div>';
    }).join('');
  }

  var _recTitle = _vendorFilter ? ('Recommended — ' + _vendorFilter) : 'Recommended parts';
  var _recSub = _vendorFilter
    ? ('Showing recommended parts for <strong>' + _vendorFilter + '</strong>')
    : ('Personalized for your machines, work orders, and service schedule · ' + (Store.getCurrentLocation()||{name:'—'}).name);

  el.innerHTML = '<style>.rec-content{flex:1;padding:24px;overflow-y:auto;}.page-header{margin-bottom:24px;}.page-title{font-size:20px;font-weight:700;color:#111318;letter-spacing:-0.3px;}.page-title-sub{font-size:13px;color:#7A7F8E;margin-top:3px;}.parts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;}.part-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;}.part-card:hover{border-color:#C8C3BC;}.part-card-top{display:flex;align-items:flex-start;gap:10px;}.part-thumb{width:44px;height:44px;background:#F5F2EE;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#C8C3BC;flex-shrink:0;}.part-card-info{flex:1;min-width:0;}.part-card-name{font-size:13px;font-weight:600;color:#111318;margin-bottom:2px;line-height:1.3;}.part-card-num{font-size:11px;color:#9CA3AF;}.part-card-reason{font-size:11px;color:#7A7F8E;line-height:1.5;padding:8px 10px;background:#F5F2EE;border-radius:7px;}.part-card-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:0.5px solid #F0ECE8;}.part-card-price{font-size:14px;font-weight:700;color:#111318;}.part-card-avail{display:flex;align-items:center;gap:4px;font-size:11px;}.avail-dot{width:6px;height:6px;border-radius:50%;}.avail-dot.green{background:#639922;}.avail-dot.amber{background:#BA7517;}.avail-label.green{color:#3B6D11;}.avail-label.amber{color:#854F0B;}.add-cart-btn{background:#F5A623;border:none;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;}.add-cart-btn:hover{background:#E8980F;}.cart-strip{position:sticky;bottom:0;background:#1E1E1E;border-radius:12px;padding:12px 18px;display:flex;align-items:center;gap:12px;margin-top:8px;}.cart-strip-label{font-size:13px;font-weight:600;color:#FFFFFF;}.cart-strip-sub{font-size:11px;color:#5C6070;}.cart-btn{background:#F5A623;border:none;border-radius:7px;padding:7px 16px;font-size:12px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;}.rec-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}.rec-section-left{display:flex;align-items:center;gap:10px;}.rec-section-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}.icon-amber{background:#FAEEDA;color:#854F0B;}.rec-section-title{font-size:15px;font-weight:700;color:#111318;letter-spacing:-0.2px;}.rec-section-sub{font-size:12px;color:#9CA3AF;margin-top:2px;}</style><h2 class="sr-only">Recommended parts</h2><div class="shell">' + buildSidebar('recommended') + '<div class="main"><div class="topbar"><div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;"><a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt(\'dashboard\')">Dashboard</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Recommended parts</span></div><div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>' + buildTopbarRight() + '</div><div class="rec-content"><div class="page-header"><div class="page-title">' + _recTitle + '</div><div class="page-title-sub">' + _recSub + '</div></div><div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-amber"><i class="ti ti-sparkles"></i></div><div><div class="rec-section-title">Recommended for your active fleet</div><div class="rec-section-sub">Based on active WOs and your machines\' service history</div></div></div></div><div class="parts-grid" id="rec-parts-grid"></div><div class="cart-strip" id="rec-cart-strip"></div></div></div></div>';

  re_render();

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
