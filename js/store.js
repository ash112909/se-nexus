const Store = (() => {
  const LS_KEY = 'se-nexus-v3';

  const DEFAULT_PARTS = [
    { id: 'SKJ-103100', partNum: 'SKJ-103100', description: 'Hydraulic lift cylinder seal kit', vendor: 'Skyjack', price: 84.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'SKJ-103278', partNum: 'SKJ-103278', description: 'Pressure relief valve', vendor: 'Skyjack', price: 126.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-107732', partNum: 'SKJ-107732', description: 'Pump seal kit', vendor: 'Skyjack', price: 49.00, oemOnly: true, inStock: false, category: 'Seals', recommended: false },
    { id: 'SKJ-103445', partNum: 'SKJ-103445', description: 'Cylinder rod wiper seal', vendor: 'Skyjack', price: 22.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'SKJ-103512', partNum: 'SKJ-103512', description: 'Cylinder end cap O-ring set', vendor: 'Skyjack', price: 14.00, oemOnly: true, inStock: false, category: 'Seals', recommended: false },
    { id: 'SKJ-104210', partNum: 'SKJ-104210', description: 'Lift cylinder assembly — complete', vendor: 'Skyjack', price: 648.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-103601', partNum: 'SKJ-103601', description: 'Hydraulic bleed screw kit', vendor: 'Skyjack', price: 12.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-HF046-1G', partNum: 'SKJ-HF046-1G', description: 'Hydraulic fluid — ISO 46 · 1 gal', vendor: 'Skyjack', price: 28.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-104880', partNum: 'SKJ-104880', description: 'Hydraulic filter — return line', vendor: 'Skyjack', price: 34.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-110044', partNum: 'SKJ-110044', description: 'Engine oil filter', vendor: 'Skyjack', price: 18.00, oemOnly: true, inStock: true, category: 'Electrical', recommended: false },
    { id: 'PAR-88821', partNum: 'PAR-88821', description: 'Wiper seal — aftermarket', vendor: 'Parker', price: 14.00, oemOnly: false, inStock: true, category: 'Seals', recommended: false },
    { id: 'PAR-CV-2201', partNum: 'PAR-CV-2201', description: 'Control valve kit', vendor: 'Parker', price: 89.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'CAT-1R0716', partNum: 'CAT-1R0716', description: 'Engine oil filter — Cat 320', vendor: 'Caterpillar', price: 22.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'CAT-1R0750', partNum: 'CAT-1R0750', description: 'Fuel filter primary — Cat 320', vendor: 'Caterpillar', price: 31.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'CAT-093-7521', partNum: 'CAT-093-7521', description: 'Hydraulic pilot filter — Cat 320', vendor: 'Caterpillar', price: 44.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'CAT-TRK-7201', partNum: 'CAT-TRK-7201', description: 'Track adjuster grease cylinder', vendor: 'Caterpillar', price: 156.00, oemOnly: true, inStock: true, category: 'Drive', recommended: true },
    { id: 'CAT-TRK-7050', partNum: 'CAT-TRK-7050', description: 'Track idler recoil spring', vendor: 'Caterpillar', price: 212.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'TOY-MCH-114', partNum: 'TOY-MCH-114', description: 'Mast chain set — Toyota 8FGU25', vendor: 'Toyota', price: 188.00, oemOnly: true, inStock: true, category: 'Drive', recommended: true },
    { id: 'TOY-LFT-088', partNum: 'TOY-LFT-088', description: 'Lift cylinder seal kit — Toyota', vendor: 'Toyota', price: 64.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'BOB-QC-520', partNum: 'BOB-QC-520', description: 'Quick coupler seal kit — S650', vendor: 'Bobcat', price: 47.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'BOB-HYD-310', partNum: 'BOB-HYD-310', description: 'Hydraulic hose assembly — Bobcat', vendor: 'Bobcat', price: 94.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'GEN-FUSE-KIT', partNum: 'GEN-FUSE-KIT', description: 'Fuse kit — assorted 5–30A automotive', vendor: 'Grainger', price: 14.00, oemOnly: false, inStock: true, category: 'Electrical', recommended: false },
    { id: 'SKJ-HF068-1G', partNum: 'SKJ-HF068-1G', description: 'Hydraulic fluid — high-temp ISO 68', vendor: 'Skyjack', price: 32.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
  ];

  const DEFAULT_MANUALS = [
    { id: 'man-1', title: 'SJIII 3219 Service Manual — Hydraulic System', machine: 'Skyjack SJIII 3219', type: 'Service', year: 2019, pages: 312, size: '18 MB' },
    { id: 'man-2', title: 'SJIII 3219 Parts Manual', machine: 'Skyjack SJIII 3219', type: 'Parts', year: 2020, pages: 248, size: '24 MB' },
    { id: 'man-3', title: 'SJIII 3219 Operator Manual', machine: 'Skyjack SJIII 3219', type: 'Operator', year: 2021, pages: 96, size: '8 MB' },
    { id: 'man-4', title: 'Service Bulletin SB-2847 — Lift Cylinder Seal Procedure', machine: 'Skyjack SJIII 3219', type: 'Service', year: 2026, pages: 4, size: '1.2 MB' },
    { id: 'man-5', title: 'Cat 320 Service Manual — Track System', machine: 'Cat 320 Excavator', type: 'Service', year: 2018, pages: 540, size: '42 MB' },
    { id: 'man-6', title: 'Cat 320 Parts Manual', machine: 'Cat 320 Excavator', type: 'Parts', year: 2019, pages: 384, size: '31 MB' },
    { id: 'man-7', title: 'Cat 320 Operator Manual', machine: 'Cat 320 Excavator', type: 'Operator', year: 2020, pages: 128, size: '10 MB' },
    { id: 'man-8', title: 'Toyota 8FGU25 Service Manual', machine: 'Toyota 8FGU25', type: 'Service', year: 2017, pages: 280, size: '22 MB' },
    { id: 'man-9', title: 'Toyota 8FGU25 Parts Catalog', machine: 'Toyota 8FGU25', type: 'Parts', year: 2018, pages: 196, size: '18 MB' },
    { id: 'man-10', title: 'Bobcat S650 Service Manual', machine: 'Bobcat S650', type: 'Service', year: 2016, pages: 420, size: '35 MB' },
  ];

  const DEFAULTS = {
    workOrders: [
      {
        id: 100094,
        locationId: 'austin',
        status: 'active',
        priority: 'high',
        machine: 'Skyjack SJIII 3219',
        asset: 'FL-094',
        issue: "Scissor lift won't elevate — hydraulic fault",
        warranty: { active: true, expiry: 'Sep 14, 2027' },
        assignee: 'James W.',
        opened: 'Jun 20, 2026',
        notes: [
          { text: 'Ran diagnostic — HYD-04 fault code confirmed. Suspect internal seal failure.', author: 'James W.', time: '9:20' },
          { text: 'Parts ordered: SKJ-103100, SKJ-103278. Awaiting delivery.', author: 'James W.', time: '9:45' }
        ],
        cart: [
          { id: 'SKJ-104880', partNum: 'SKJ-104880', description: 'Hydraulic filter — return line', vendor: 'Skyjack', price: 34.00, oemOnly: true, inStock: true, category: 'Hydraulic', qty: 1 }
        ],
        submittedOrders: [
          {
            id: 'wo-ord-100094-1',
            poNum: 'PO-7841',
            date: 'Jun 20, 2026',
            items: [
              { id: 'SKJ-103100', partNum: 'SKJ-103100', description: 'Hydraulic lift cylinder seal kit', vendor: 'Skyjack', price: 84.00, qty: 1 },
              { id: 'SKJ-103278', partNum: 'SKJ-103278', description: 'Pressure relief valve', vendor: 'Skyjack', price: 126.00, qty: 1 },
            ],
            total: 210.00,
            status: 'submitted',
          },
          {
            id: 'wo-ord-100094-2',
            poNum: 'PO-7801',
            date: 'Jun 12, 2026',
            items: [
              { id: 'SKJ-107732', partNum: 'SKJ-107732', description: 'Pump seal kit', vendor: 'Skyjack', price: 49.00, qty: 2 },
            ],
            total: 98.00,
            status: 'backordered',
          }
        ]
      },
      {
        id: 100102,
        locationId: 'austin',
        status: 'active',
        priority: 'medium',
        machine: 'Cat 320 Excavator',
        asset: 'FL-017',
        issue: 'Track tension out of spec — right side',
        warranty: { active: false, expiry: null },
        assignee: 'James W.',
        opened: 'Jun 22, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100089,
        locationId: 'austin',
        status: 'active',
        priority: 'low',
        machine: 'Toyota 8FGU25',
        asset: 'FL-031',
        issue: 'Mast chain elongation — scheduled inspection',
        warranty: { active: true, expiry: 'Dec 3, 2026' },
        assignee: 'M. Torres',
        opened: 'Jun 18, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100081,
        locationId: 'austin',
        status: 'pending',
        priority: 'medium',
        machine: 'Bobcat S650',
        asset: 'FL-008',
        issue: 'Hydraulic quick coupler leak',
        warranty: { active: false, expiry: null },
        assignee: 'R. Kim',
        opened: 'Jun 15, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100110,
        locationId: 'san-marcos',
        status: 'active',
        priority: 'high',
        machine: 'Skyjack SJIII 4632',
        asset: 'SM-011',
        issue: 'Platform leveling sensor fault — tilt alarm triggered',
        warranty: { active: true, expiry: 'Mar 28, 2028' },
        assignee: 'James W.',
        opened: 'Jun 24, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100108,
        locationId: 'san-marcos',
        status: 'pending',
        priority: 'medium',
        machine: 'Toyota 8FGU32',
        asset: 'SM-004',
        issue: 'Brake drag — left rear wheel',
        warranty: { active: false, expiry: null },
        assignee: 'D. Reyes',
        opened: 'Jun 21, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100115,
        locationId: 'kyle',
        status: 'active',
        priority: 'medium',
        machine: 'Bobcat S770',
        asset: 'KY-003',
        issue: 'Loader arm hydraulic cylinder slow extension',
        warranty: { active: false, expiry: null },
        assignee: 'James W.',
        opened: 'Jun 25, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      },
      {
        id: 100113,
        locationId: 'kyle',
        status: 'closed',
        priority: 'low',
        machine: 'Cat 308 Mini Excavator',
        asset: 'KY-007',
        issue: 'Engine coolant leak — water pump seal',
        warranty: { active: false, expiry: null },
        assignee: 'T. Nguyen',
        opened: 'Jun 10, 2026',
        notes: [],
        cart: [],
        submittedOrders: []
      }
    ],
    orders: [
      { id: 'ord-1', poNum: 'PO-7841', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 20, 2026', user: 'James W.', name: 'Hydraulic seals — WO #100094', wo: 'WO #100094', asset: 'FL-094', amount: 268.00, status: 'submitted', tab: 'submitted' },
      { id: 'ord-2', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 18, 2026', user: 'James W.', name: 'Filters & consumables', wo: 'WO #100102', asset: 'FL-102', amount: 94.50, status: 'saved', tab: 'drafts' },
      { id: 'ord-3', poNum: 'PO-7792', vendor: 'Parker', vendorId: 'PKR-WD', date: 'Jun 15, 2026', user: 'M. Torres', name: 'Valve kit — FL-091', wo: 'WO #100088', asset: 'FL-091', amount: 145.00, status: 'delivered', tab: 'submitted' },
      { id: 'ord-4', poNum: 'PO-7801', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 12, 2026', user: 'James W.', name: 'Pump seal kit ×2', wo: 'WO #100094', asset: 'FL-094', amount: 212.00, status: 'backordered', tab: 'submitted' },
      { id: 'ord-5', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 10, 2026', user: 'R. Singh', name: 'Safety equipment restock', wo: 'General', asset: 'Austin', amount: 330.75, status: 'review', tab: 'review' },
      { id: 'ord-6', poNum: 'PO-7789', vendor: 'Parker', vendorId: 'PKR-WD', date: 'Jun 8, 2026', user: 'James W.', name: 'Aftermarket valve PAR-88821', wo: 'WO #100094', asset: 'FL-094', amount: 89.00, status: 'submitted', tab: 'submitted' },
      { id: 'ord-7', poNum: 'PO-7755', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 5, 2026', user: 'M. Torres', name: 'Hydraulic hose assembly', wo: 'WO #100081', asset: 'FL-088', amount: 174.00, status: 'delivered', tab: 'submitted' },
      { id: 'ord-8', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 2, 2026', user: 'R. Singh', name: 'Oil & lubrication kits', wo: 'General', asset: 'Austin', amount: 58.20, status: 'saved', tab: 'drafts' },
      { id: 'ord-9', poNum: 'PO-7720', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'May 29, 2026', user: 'James W.', name: 'Drive motor brush kit', wo: 'WO #100074', asset: 'FL-077', amount: 122.00, status: 'delivered', tab: 'submitted' },
      { id: 'ord-10', poNum: 'PO-7708', vendor: 'Parker', vendorId: 'PKR-WD', date: 'May 25, 2026', user: 'M. Torres', name: 'Cylinder rod seal set', wo: 'WO #100069', asset: 'FL-071', amount: 66.40, status: 'delivered', tab: 'submitted' },
    ],
    cart: [],
    diagnosticHistory: [],
    parts: DEFAULT_PARTS,
    manuals: DEFAULT_MANUALS,
  };

  function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)) {
      if (Array.isArray(source[key])) {
        // Arrays: use source if result key missing, else keep result
        if (!result[key]) result[key] = source[key];
      } else if (source[key] && typeof source[key] === 'object') {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        if (result[key] === undefined) result[key] = source[key];
      }
    }
    return result;
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return deepMerge(saved, DEFAULTS);
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
  }

  let _data = load();

  // --- Work Orders ---
  function getWorkOrders(statusFilter) {
    let wos = _data.workOrders.filter(wo => !wo.locationId || wo.locationId === _currentLocationId);
    if (statusFilter && statusFilter !== 'all') wos = wos.filter(wo => wo.status === statusFilter);
    return wos;
  }

  function getWorkOrder(id) {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    return _data.workOrders.find(wo => wo.id === numId || wo.id === id) || null;
  }

  function addWorkOrder(fields) {
    const maxId = _data.workOrders.reduce((m, w) => Math.max(m, w.id), 100000);
    const wo = Object.assign({
      id: maxId + 1,
      status: 'active',
      priority: 'medium',
      machine: '',
      asset: '',
      issue: '',
      warranty: { active: false, expiry: null },
      assignee: 'James W.',
      opened: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notes: [],
      cart: [],
      submittedOrders: [],
    }, fields);
    _data.workOrders.unshift(wo);
    save(_data);
    return wo;
  }

  function updateWorkOrder(id, changes) {
    const wo = getWorkOrder(id);
    if (!wo) return null;
    Object.assign(wo, changes);
    save(_data);
    return wo;
  }

  function addWoNote(id, text) {
    const wo = getWorkOrder(id);
    if (!wo) return null;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const note = { text, author: 'James W.', time };
    wo.notes.push(note);
    save(_data);
    return note;
  }

  function closeWorkOrder(id) {
    return updateWorkOrder(id, { status: 'closed' });
  }

  // --- WO Cart ---
  function getWoCart(woId) {
    const wo = getWorkOrder(woId);
    if (!wo) return [];
    if (!wo.cart) wo.cart = [];
    return wo.cart;
  }

  function addToWoCart(woId, part) {
    const wo = getWorkOrder(woId);
    if (!wo) return;
    if (!wo.cart) wo.cart = [];
    const existing = wo.cart.find(c => c.id === part.id);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else { wo.cart.push(Object.assign({}, part, { qty: 1 })); }
    save(_data);
  }

  function removeFromWoCart(woId, partId) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return;
    wo.cart = wo.cart.filter(c => c.id !== partId);
    save(_data);
  }

  function updateWoCartQty(woId, partId, qty) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return;
    const item = wo.cart.find(c => c.id === partId);
    if (item) { item.qty = Math.max(1, qty); save(_data); }
  }

  function submitWoCart(woId) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart || !wo.cart.length) return null;
    const items = wo.cart.slice();
    const total = items.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const poNum = _nextPoNum();
    const submitted = {
      id: 'wo-ord-' + Date.now(),
      poNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items,
      total: Math.round(total * 100) / 100,
      status: 'submitted',
    };
    if (!wo.submittedOrders) wo.submittedOrders = [];
    wo.submittedOrders.unshift(submitted);
    addOrder({
      vendor: items.length === 1 ? items[0].vendor : 'Various',
      name: items.length === 1 ? items[0].description : items.length + ' parts — WO #' + wo.id,
      wo: 'WO #' + wo.id,
      asset: wo.asset,
      amount: Math.round(total * 100) / 100,
      status: 'submitted',
      tab: 'submitted',
      items,
      poNum,
    });
    wo.cart = [];
    save(_data);
    return submitted;
  }

  // --- Orders ---
  function getOrders(tab) {
    if (!tab || tab === 'all') return _data.orders;
    if (tab === 'approvals') return _data.orders.filter(o => o.tab === 'review');
    return _data.orders.filter(o => o.tab === tab);
  }

  function _nextPoNum() {
    const nums = _data.orders.filter(o => o.poNum).map(o => parseInt((o.poNum || '').replace('PO-', ''))).filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 7841;
    return 'PO-' + (max + 1);
  }

  function addOrder(fields) {
    const id = 'ord-' + Date.now();
    const poNum = (fields.status === 'submitted') ? _nextPoNum() : null;
    const order = Object.assign({
      id,
      poNum,
      vendor: '',
      vendorId: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      user: 'James W.',
      name: '',
      wo: '',
      asset: '',
      amount: 0,
      status: 'saved',
      tab: 'drafts'
    }, fields, { id, poNum: fields.poNum !== undefined ? fields.poNum : poNum });
    _data.orders.unshift(order);
    save(_data);
    return order;
  }

  function updateOrder(id, changes) {
    const order = _data.orders.find(o => o.id === id);
    if (!order) return null;
    Object.assign(order, changes);
    save(_data);
    return order;
  }

  // --- Cart ---
  function getCart() { return _data.cart; }

  function addToCart(part) {
    const existing = _data.cart.find(c => c.id === part.id);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else { _data.cart.push(Object.assign({}, part, { qty: 1 })); }
    save(_data);
  }

  function removeFromCart(partId) {
    _data.cart = _data.cart.filter(c => c.id !== partId);
    save(_data);
  }

  function updateCartQty(partId, qty) {
    const item = _data.cart.find(c => c.id === partId);
    if (item) { item.qty = Math.max(1, qty); save(_data); }
  }

  function clearCart() { _data.cart = []; save(_data); }

  function submitCart(woId) {
    const cart = _data.cart.slice();
    const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const wo = woId ? getWorkOrder(woId) : null;
    const order = addOrder({
      vendor: cart[0] ? cart[0].vendor : 'Various',
      name: 'Cart order' + (wo ? ' — WO #' + wo.id : ''),
      wo: wo ? 'WO #' + wo.id : 'General',
      asset: wo ? wo.asset : 'Austin',
      amount: Math.round(total * 100) / 100,
      status: 'submitted',
      tab: 'submitted',
      items: cart,
    });
    clearCart();
    return order;
  }

  // --- Diagnostics ---
  function addDiagnosticMessage(msg) { _data.diagnosticHistory.push(msg); save(_data); }
  function getDiagnosticHistory() { return _data.diagnosticHistory; }
  function clearDiagnosticHistory() { _data.diagnosticHistory = []; save(_data); }

  // --- Parts ---
  function getParts(query, category) {
    let parts = _data.parts || DEFAULT_PARTS;
    if (category && category !== 'All') {
      parts = parts.filter(p => p.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      parts = parts.filter(p =>
        p.description.toLowerCase().includes(q) ||
        p.partNum.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q)
      );
    }
    return parts;
  }

  // --- Manuals ---
  function getManuals(query) {
    let manuals = _data.manuals || DEFAULT_MANUALS;
    if (query && query.trim()) {
      const q = query.toLowerCase();
      manuals = manuals.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.machine.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
      );
    }
    return manuals;
  }

  // --- Locations ---
  const LOCATIONS = [
    { id: 'austin',     name: 'Austin Branch',      address: '1204 N Lamar Blvd, Austin TX 78703',          fleetSize: 14 },
    { id: 'san-marcos', name: 'San Marcos Branch',  address: '912 Wonder World Dr, San Marcos TX 78666',    fleetSize: 8  },
    { id: 'kyle',       name: 'Kyle Branch',        address: '401 Kohlers Crossing, Kyle TX 78640',         fleetSize: 6  },
  ];
  let _currentLocationId = localStorage.getItem('se-nexus-location') || null;

  function getLocations() { return LOCATIONS; }
  function getCurrentLocation() { return LOCATIONS.find(l => l.id === _currentLocationId) || null; }
  function setCurrentLocation(id) {
    _currentLocationId = id;
    try { localStorage.setItem('se-nexus-location', id); } catch(e) {}
  }

  // --- Notifications ---
  const DEFAULT_NOTIFICATIONS = [
    { id:'notif-1', type:'order',    icon:'ti-package',     title:'PO-7841 delivered',                          body:'Your order PO-7841 (Hydraulic seals — WO #100094) has been delivered to Austin Branch. 2 items, $268.00.',                                                    time:'2h ago',   read:false },
    { id:'notif-2', type:'order',    icon:'ti-alert-circle',title:'PO-7801 backordered',                        body:'Pump seal kit ×2 (SKJ-107732) on PO-7801 is backordered with Skyjack. Estimated availability: Jun 26, 2026. WO #100094 is affected.',                       time:'5h ago',   read:false },
    { id:'notif-3', type:'bulletin', icon:'ti-file-alert',  title:'Service bulletin: SB-2847',                  body:'Skyjack has issued Service Bulletin SB-2847 — Lift Cylinder Seal Replacement Procedure. Affects SJIII 3219 units with serial range SJ3219-00600 through SJ3219-01100. Review before performing cylinder service on FL-094.', time:'Yesterday', read:false },
    { id:'notif-4', type:'wo',       icon:'ti-clipboard-list',title:'WO #100089 assigned to M. Torres',         body:'Work order WO #100089 (Toyota 8FGU25 — mast chain elongation inspection) has been assigned to M. Torres. Asset: FL-031, Austin Branch.',                    time:'Yesterday', read:true  },
    { id:'notif-5', type:'warranty', icon:'ti-shield-check', title:'Warranty expiry: FL-031 in 6 months',       body:'The warranty on FL-031 (Toyota 8FGU25, serial TOY8FGU-00391) expires Dec 3, 2026. Schedule any warranty service before expiry to avoid out-of-pocket costs.',  time:'Jun 20',   read:true  },
    { id:'notif-6', type:'order',    icon:'ti-check',        title:'PO-7792 delivered',                          body:'Order PO-7792 (Valve kit — FL-091) has been delivered. Submitted by M. Torres on Jun 15, 2026. $145.00.',                                                   time:'Jun 15',   read:true  },
  ];

  function getNotifications(unreadOnly) {
    const notifs = _data.notifications || DEFAULT_NOTIFICATIONS;
    return unreadOnly ? notifs.filter(n => !n.read) : notifs;
  }
  function markNotificationRead(id) {
    if (!_data.notifications) _data.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    const n = _data.notifications.find(x => x.id === id);
    if (n) { n.read = true; save(_data); }
  }
  function markAllNotificationsRead() {
    if (!_data.notifications) _data.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    _data.notifications.forEach(n => n.read = true);
    save(_data);
  }
  function getUnreadCount() { return getNotifications(true).length; }

  // --- Reset ---
  function reset() {
    _data = JSON.parse(JSON.stringify(DEFAULTS));
    save(_data);
  }

  return {
    getWorkOrders, getWorkOrder, addWorkOrder, updateWorkOrder, addWoNote, closeWorkOrder,
    getOrders, addOrder, updateOrder,
    getCart, addToCart, removeFromCart, updateCartQty, clearCart, submitCart,
    getWoCart, addToWoCart, removeFromWoCart, updateWoCartQty, submitWoCart,
    addDiagnosticMessage, getDiagnosticHistory, clearDiagnosticHistory,
    getParts, getManuals,
    getLocations, getCurrentLocation, setCurrentLocation,
    getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount,
    reset,
  };
})();

window.Store = Store;
