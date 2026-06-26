function render_parts_search(el) {
  let _searchQuery = '';
  let _category = 'All';
  let psSelected = null;
  let psListSelected = null;

  const CATEGORIES = ['All', 'Hydraulic', 'Electrical', 'Drive', 'Seals'];

  function getFilteredParts() {
    return Store.getParts(_searchQuery, _category === 'All' ? '' : _category);
  }

  function cartCount() { return Store.getCart().length; }
  function isInCart(partId) { return Store.getCart().some(c => c.id === partId); }

  function updateCartStrip() {
    const strips = document.querySelectorAll('.cart-strip-count');
    strips.forEach(s => s.textContent = cartCount() + ' item' + (cartCount() !== 1 ? 's' : '') + ' in cart');
    const total = Store.getCart().reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const strips2 = document.querySelectorAll('.cart-strip-total');
    strips2.forEach(s => s.textContent = '$' + total.toFixed(2));
  }

  function machineIcon(machine) {
    const m = (machine || '').toLowerCase();
    if (m.includes('skyjack') || m.includes('scissor')) return 'ti-crane';
    if (m.includes('cat') || m.includes('excavator')) return 'ti-backhoe';
    if (m.includes('toyota') || m.includes('forklift')) return 'ti-forklift';
    if (m.includes('bobcat')) return 'ti-bulldozer';
    return 'ti-tool';
  }

  el.innerHTML = `
<style>
.wo-context-ribbon { background: #1E1E1E; padding: 10px 24px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #2A2A2A; flex-wrap: wrap; }
.ribbon-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8A8FA8; }
.ribbon-item strong { color: #FFFFFF; font-weight: 600; }
.ribbon-sep { color: #3C4052; }
.ribbon-warranty { display: flex; align-items: center; gap: 5px; background: #0F3D22; border: 1px solid #1D6B3A; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 600; color: #5DCAA5; }
.ribbon-pill { background: #FAEEDA; color: #854F0B; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 2px 9px; }
.content-row { display: flex; flex: 1; min-height: 0; }
.tree-panel { width: 210px; min-width: 210px; background: #FFFFFF; border-right: 0.5px solid #E8E4DF; display: flex; flex-direction: column; }
.tree-search { padding: 12px; border-bottom: 0.5px solid #F0ECE8; }
.tree-search-wrap { position: relative; }
.tree-search-input { width: 100%; height: 32px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 32px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.tree-search-input::placeholder { color: #B0AAA3; }
.tree-search-input:focus { border-color: #F5A623; }
.tree-search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 14px; pointer-events: none; }
.tree-body { flex: 1; overflow-y: auto; padding: 8px 0; }
.tree-section-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #B0AAA3; padding: 8px 12px 4px; }
.cat-filter-item { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; font-size: 13px; color: #3A3D4A; border-radius: 6px; margin: 2px 8px; }
.cat-filter-item:hover { background: #F5F2EE; }
.cat-filter-item.active { background: #FAEEDA; color: #854F0B; font-weight: 600; }
.main-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.view-toolbar { padding: 10px 20px; background: #FFFFFF; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 10px; }
.view-title { font-size: 14px; font-weight: 700; color: #111318; flex: 1; letter-spacing: -0.2px; }
.view-toggle { display: flex; background: #F5F2EE; border-radius: 7px; padding: 3px; gap: 2px; }
.vtoggle-btn { padding: 5px 12px; border-radius: 5px; border: none; background: none; font-size: 12px; font-weight: 500; color: #7A7F8E; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; }
.vtoggle-btn.active { background: #FFFFFF; color: #111318; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
/* List view */
.list-view-body { display: flex; flex: 1; min-height: 0; flex-direction: column; }
.list-table-wrap { flex: 1; overflow-y: auto; }
.list-table { width: 100%; border-collapse: collapse; }
.list-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 8px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; position: sticky; top: 0; z-index: 1; white-space: nowrap; }
.list-table td { padding: 9px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.list-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.lt-part-name { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 2px; }
.lt-part-num { font-size: 11px; color: #9CA3AF; }
.lt-add-btn { background: #F5A623; border: none; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
.lt-add-btn:hover { background: #E8980F; }
.lt-incart-badge { background: #FAEEDA; color: #854F0B; font-size: 11px; font-weight: 600; border-radius: 5px; padding: 4px 9px; }
.lt-avail-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
.lt-avail-green { background: #10B981; }
.lt-avail-amber { background: #F59E0B; }
/* Diagram view */
.diagram-view-body { display: flex; flex: 1; min-height: 0; }
.diagram-canvas-wrap { flex: 1; position: relative; overflow: hidden; background: #F8F6F2; display: flex; align-items: center; justify-content: center; }
.diagram-canvas { position: relative; display: inline-block; }
.hotspot { position: absolute; cursor: pointer; transform: translate(-50%,-50%); }
.callout-bubble { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid; transition: transform 0.15s; position: relative; z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
.callout-bubble:hover { transform: scale(1.15); }
.callout-default { background: #FFFFFF; border-color: #9CA3AF; color: #3A3D4A; }
.callout-incart { background: #F5A623; border-color: #D4880A; color: #1A1200; }
.callout-selected { background: #534AB7; border-color: #3B3497; color: #FFFFFF; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } 60% { transform: translateY(-2px); } }
.callout-bounce { animation: bounce 1.8s ease-in-out infinite; }
.parts-panel { width: 280px; min-width: 280px; background: #FFFFFF; border-left: 0.5px solid #E8E4DF; display: flex; flex-direction: column; }
.parts-panel-header { padding: 12px 14px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.parts-panel-title { font-size: 13px; font-weight: 600; color: #111318; }
.parts-panel-count { font-size: 11px; color: #9CA3AF; }
.parts-list { flex: 1; overflow-y: auto; }
.part-row-sm { padding: 10px 14px; border-bottom: 0.5px solid #F5F2EE; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.part-row-sm:hover { background: #FAFAF8; }
.part-row-sm.active-row { background: #EEEDFE; }
.part-row-sm.in-cart { background: #FFFBF2; }
.part-row-info { flex: 1; min-width: 0; }
.part-row-name { font-size: 12px; font-weight: 500; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.part-row-num { font-size: 11px; color: #9CA3AF; }
.part-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.part-row-price { font-size: 12px; font-weight: 600; color: #111318; }
.add-to-cart-btn { font-size: 11px; font-weight: 600; background: #F5A623; border: none; border-radius: 5px; padding: 3px 8px; color: #1A1200; cursor: pointer; font-family: inherit; }
.in-cart-label { font-size: 10px; font-weight: 600; color: #854F0B; background: #FAEEDA; border-radius: 5px; padding: 3px 7px; }
.cart-strip-bottom { background: #1E1E1E; padding: 11px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.cart-strip-label2 { font-size: 12px; font-weight: 600; color: #FFFFFF; }
.cart-strip-sub2 { font-size: 11px; color: #5C6070; }
.cart-btn2 { background: #F5A623; border: none; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
.cart-empty { padding: 8px 0; color: #5C6070; font-size: 11px; }
</style>
<h2 class="sr-only">Parts search</h2>
<div class="shell">
  ${buildSidebar('parts')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Search parts</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;flex:1;min-height:0;">
      <div class="content-row" style="flex:1;min-height:0;">
        <div class="tree-panel">
          <div class="tree-search">
            <div class="tree-search-wrap">
              <i class="ti ti-search tree-search-icon"></i>
              <input class="tree-search-input" id="ps-search-input" type="text" placeholder="Search parts…"/>
            </div>
          </div>
          <div class="tree-body">
            <div class="tree-section-label">Category</div>
            <div id="ps-category-list"></div>
          </div>
        </div>
        <div class="main-panel">
          <div class="view-toolbar">
            <div class="view-title" id="ps-view-title">All parts</div>
            <div class="view-toggle">
              <button class="vtoggle-btn active" id="ps-toggle-list" onclick="psSwitchView('list')"><i class="ti ti-list" style="font-size:13px;"></i> Parts list</button>
              <button class="vtoggle-btn" id="ps-toggle-diagram" onclick="psSwitchView('diagram')"><i class="ti ti-schema" style="font-size:13px;"></i> Diagram</button>
            </div>
          </div>
          <div id="ps-list-view" class="list-view-body" style="display:flex;">
            <div class="list-table-wrap">
              <table class="list-table">
                <thead><tr><th>Part #</th><th>Description</th><th>Vendor</th><th>Category</th><th>Available</th><th>Price</th><th>Action</th></tr></thead>
                <tbody id="ps-list-tbody"></tbody>
              </table>
            </div>
            <div class="cart-strip-bottom">
              <div>
                <div class="cart-strip-label2 cart-strip-count">0 items in cart</div>
                <div class="cart-strip-sub2 cart-strip-total">$0.00</div>
              </div>
              <button class="cart-btn2" style="margin-left:auto;" id="ps-cart-review-btn">Review &amp; submit order</button>
            </div>
          </div>
          <div id="ps-diagram-view" class="diagram-view-body" style="display:none;">
            <div class="diagram-canvas-wrap">
              <div class="diagram-canvas" id="ps-diagram-canvas">
                <svg width="560" height="420" viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="560" height="420" fill="#F8F6F2"/>
                  <rect x="16" y="16" width="200" height="36" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>
                  <text x="24" y="30" font-size="9" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">SKYJACK</text>
                  <text x="24" y="44" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">SJIII 3219 — Hydraulic Lift Cylinder</text>
                  <rect x="160" y="130" width="240" height="80" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <rect x="140" y="140" width="24" height="60" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
                  <rect x="396" y="140" width="24" height="60" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
                  <rect x="420" y="158" width="100" height="24" rx="2" fill="#C8C3BC" stroke="#A8A39C" stroke-width="1.5"/>
                  <circle cx="530" cy="170" r="12" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <rect x="8" y="8" width="544" height="404" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>
                </svg>
                <div id="ps-hotspots" style="position:absolute;inset:0;pointer-events:none;"></div>
                <style>#ps-hotspots .hotspot { pointer-events:all; }</style>
              </div>
            </div>
            <div class="parts-panel">
              <div class="parts-panel-header">
                <div class="parts-panel-title">Parts</div>
                <div class="parts-panel-count" id="ps-parts-count">0 parts</div>
              </div>
              <div class="parts-list" id="ps-parts-list-inner"></div>
              <div class="cart-strip-bottom">
                <div>
                  <div class="cart-strip-label2 cart-strip-count">0 items in cart</div>
                  <div class="cart-strip-sub2 cart-strip-total">$0.00</div>
                </div>
                <button class="cart-btn2" id="ps-cart-review-btn2">View cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  function renderCategories() {
    const list = document.getElementById('ps-category-list');
    if (!list) return;
    list.innerHTML = CATEGORIES.map(cat => `
      <div class="cat-filter-item ${cat === _category ? 'active' : ''}" data-cat="${cat}">
        <i class="ti ${cat === 'Hydraulic' ? 'ti-droplet' : cat === 'Electrical' ? 'ti-bolt' : cat === 'Drive' ? 'ti-engine' : cat === 'Seals' ? 'ti-circle-dashed' : 'ti-list'}"></i>
        ${cat}
      </div>`).join('');
    list.querySelectorAll('.cat-filter-item').forEach(item => {
      item.addEventListener('click', function() {
        _category = this.dataset.cat;
        renderCategories();
        renderListView();
        renderDiagramParts();
      });
    });
  }

  function renderListView() {
    const tbody = document.getElementById('ps-list-tbody');
    if (!tbody) return;
    const parts = getFilteredParts();
    const titleEl = document.getElementById('ps-view-title');
    if (titleEl) titleEl.textContent = (_category === 'All' ? 'All' : _category) + ' parts (' + parts.length + ')';
    if (!parts.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:#9CA3AF;font-size:13px;">No parts found.</td></tr>';
      return;
    }
    tbody.innerHTML = parts.map(p => `
      <tr>
        <td style="font-weight:600;color:#111318;font-size:12px;">${p.partNum}</td>
        <td>
          <div class="lt-part-name">${p.description}</div>
          <div class="lt-part-num">${p.oemOnly ? '<span style="background:#F5F2EE;color:#5A5F6E;font-size:10px;font-weight:600;border-radius:4px;padding:1px 5px;">OEM</span>' : '<span style="background:#FAEEDA;color:#854F0B;font-size:10px;font-weight:600;border-radius:4px;padding:1px 5px;">Aftermarket</span>'}</div>
        </td>
        <td>${p.vendor}</td>
        <td>${p.category}</td>
        <td><span class="lt-avail-dot ${p.inStock ? 'lt-avail-green' : 'lt-avail-amber'}"></span>${p.inStock ? 'In stock' : 'Backordered'}</td>
        <td style="font-weight:600;color:#111318;">$${p.price.toFixed(2)}</td>
        <td>${isInCart(p.id)
          ? '<span class="lt-incart-badge">In cart</span>'
          : `<button class="lt-add-btn" onclick="psAddToCart('${p.id}')">Add to cart</button>`
        }</td>
      </tr>`).join('');
    updateCartStrip();
  }

  const diagramParts = [
    { id: 'SKJ-103100', x: 26, y: 43 },
    { id: 'SKJ-103278', x: 72, y: 55 },
    { id: 'SKJ-103445', x: 38, y: 65 },
    { id: 'SKJ-103512', x: 60, y: 74 },
    { id: 'SKJ-104210', x: 85, y: 30 },
  ];

  function renderDiagramParts() {
    const hotspots = document.getElementById('ps-hotspots');
    const listEl = document.getElementById('ps-parts-list-inner');
    const countEl = document.getElementById('ps-parts-count');
    if (!hotspots || !listEl) return;

    const allParts = Store.getParts('', '');
    const mapped = diagramParts.map((dp, i) => {
      const part = allParts.find(p => p.id === dp.id);
      return part ? { ...part, x: dp.x, y: dp.y, ref: i + 1 } : null;
    }).filter(Boolean);

    if (countEl) countEl.textContent = mapped.length + ' parts';

    hotspots.innerHTML = '';
    hotspots.style.position = 'absolute';
    hotspots.style.inset = '0';
    hotspots.style.pointerEvents = 'none';

    mapped.forEach(p => {
      const div = document.createElement('div');
      div.className = 'hotspot';
      div.style.left = p.x + '%';
      div.style.top = p.y + '%';
      div.style.pointerEvents = 'all';
      const inCart = isInCart(p.id);
      const isSelected = psSelected === p.id;
      const cls = isSelected ? 'callout-selected' : inCart ? 'callout-incart callout-bounce' : 'callout-default';
      div.innerHTML = `<div class="callout-bubble ${cls}">${p.ref}</div>`;
      div.onclick = () => {
        psSelected = psSelected === p.id ? null : p.id;
        renderDiagramParts();
      };
      hotspots.appendChild(div);
    });

    listEl.innerHTML = mapped.map(p => {
      const inCart = isInCart(p.id);
      const isSelected = psSelected === p.id;
      return `
        <div class="part-row-sm ${isSelected ? 'active-row' : ''} ${inCart ? 'in-cart' : ''}" onclick="psDiagramSelect('${p.id}')">
          <div style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:1.5px solid;flex-shrink:0;${isSelected ? 'background:#534AB7;border-color:#3B3497;color:#fff;' : inCart ? 'background:#F5A623;border-color:#D4880A;color:#1A1200;' : 'background:#fff;border-color:#9CA3AF;color:#3A3D4A;'}">${p.ref}</div>
          <div class="part-row-info">
            <div class="part-row-name">${p.description}</div>
            <div class="part-row-num">${p.partNum}</div>
          </div>
          <div class="part-row-right">
            <div class="part-row-price">$${p.price.toFixed(2)}</div>
            ${inCart ? '<span class="in-cart-label">In cart</span>' : `<button class="add-to-cart-btn" onclick="event.stopPropagation();psAddToCart('${p.id}')">Add</button>`}
          </div>
        </div>`;
    }).join('');
    updateCartStrip();
  }

  window.psDiagramSelect = function(partId) {
    psSelected = psSelected === partId ? null : partId;
    renderDiagramParts();
  };

  window.psAddToCart = function(partId) {
    const part = Store.getParts('', '').find(p => p.id === partId);
    if (!part) return;
    Store.addToCart(part);
    renderListView();
    renderDiagramParts();
    updateCartStrip();
  };

  window.psSwitchView = function(mode) {
    const listView = document.getElementById('ps-list-view');
    const diagramView = document.getElementById('ps-diagram-view');
    const btnList = document.getElementById('ps-toggle-list');
    const btnDiagram = document.getElementById('ps-toggle-diagram');
    if (mode === 'list') {
      listView.style.display = 'flex';
      diagramView.style.display = 'none';
      btnList.classList.add('active');
      btnDiagram.classList.remove('active');
      renderListView();
    } else {
      listView.style.display = 'none';
      diagramView.style.display = 'flex';
      btnList.classList.remove('active');
      btnDiagram.classList.add('active');
      renderDiagramParts();
    }
  };

  function openCartModal() {
    const cart = Store.getCart();
    if (!cart.length) {
      Modal.show({ title: 'Cart is empty', body: '<p style="color:#9CA3AF;font-size:13px;">Add parts to cart first.</p>' });
      return;
    }
    const wos = Store.getWorkOrders('active');
    const woOptions = wos.map(w => `<option value="${w.id}">${w.machine} — WO #${w.id}</option>`).join('');
    const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const body = `
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead><tr style="background:#FAFAF8;">
          <th style="text-align:left;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Part</th>
          <th style="text-align:left;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Qty</th>
          <th style="text-align:right;padding:8px 10px;font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;border-bottom:1px solid #E8E4DF;">Price</th>
        </tr></thead>
        <tbody>
          ${cart.map(c => `<tr><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;">${c.description}<br><span style="font-size:11px;color:#9CA3AF;">${c.partNum}</span></td><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;">${c.qty || 1}</td><td style="padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:13px;text-align:right;font-weight:600;">$${(c.price * (c.qty || 1)).toFixed(2)}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr><td colspan="2" style="padding:8px 10px;font-size:13px;font-weight:600;color:#111318;">Total</td><td style="padding:8px 10px;font-size:14px;font-weight:700;color:#111318;text-align:right;">$${total.toFixed(2)}</td></tr></tfoot>
      </table>
      <div style="margin-bottom:8px;">
        <label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Assign to Work Order</label>
        <select id="cart-wo-select" style="width:100%;height:36px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;outline:none;">
          <option value="">No WO (general purchase)</option>
          ${woOptions}
        </select>
      </div>`;

    Modal.show({
      title: 'Review Cart & Submit Order',
      body,
      wide: true,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Confirm Order', primary: true, onClick: () => {
            const woId = document.getElementById('cart-wo-select').value;
            Store.submitCart(woId || null);
            Modal.close();
            updateCartStrip();
            renderListView();
            renderDiagramParts();
            // navigate to order history
            sendPrompt('Open order history');
          }
        }
      ]
    });
  }

  // Wire up search
  document.getElementById('ps-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    renderListView();
  });

  // Cart review buttons
  const cartBtn = document.getElementById('ps-cart-review-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCartModal);
  const cartBtn2 = document.getElementById('ps-cart-review-btn2');
  if (cartBtn2) cartBtn2.addEventListener('click', openCartModal);

  // Initial render
  renderCategories();
  renderListView();
}
