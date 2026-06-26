const Store = (() => {
  const LS_KEY = 'se-nexus-v1';

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
        status: 'active',
        priority: 'high',
        machine: 'Skyjack SJIII 3219',
        asset: 'FL-094',
        issue: "Scissor lift won't elevate — hydraulic fault",
        warranty: { active: true, expiry: 'Sep 2027' },
        assignee: 'James W.',
        opened: 'Jun 20, 2026',
        notes: [
          { text: 'Ran diagnostic — HYD-04 fault code confirmed. Suspect internal seal failure.', author: 'James W.', time: '9:20' },
          { text: 'Parts ordered: SKJ-103100, SKJ-103278. Awaiting delivery.', author: 'James W.', time: '9:45' }
        ],
        partIds: ['SKJ-103100', 'SKJ-103278', 'SKJ-107732']
      },
      {
        id: 100102,
        status: 'active',
        priority: 'medium',
        machine: 'Cat 320 Excavator',
        asset: 'FL-017',
        issue: 'Track tension out of spec — right side',
        warranty: { active: false, expiry: null },
        assignee: 'James W.',
        opened: 'Jun 22, 2026',
        notes: [],
        partIds: []
      },
      {
        id: 100089,
        status: 'active',
        priority: 'low',
        machine: 'Toyota 8FGU25',
        asset: 'FL-031',
        issue: 'Mast chain elongation — scheduled inspection',
        warranty: { active: true, expiry: 'Dec 2026' },
        assignee: 'M. Torres',
        opened: 'Jun 18, 2026',
        notes: [],
        partIds: []
      },
      {
        id: 100081,
        status: 'pending',
        priority: 'medium',
        machine: 'Bobcat S650',
        asset: 'FL-008',
        issue: 'Hydraulic quick coupler leak',
        warranty: { active: false, expiry: null },
        assignee: 'R. Kim',
        opened: 'Jun 15, 2026',
        notes: [],
        partIds: []
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
    if (!statusFilter || statusFilter === 'all') return _data.workOrders;
    return _data.workOrders.filter(wo => wo.status === statusFilter);
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
      partIds: []
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

  // --- Reset ---
  function reset() {
    _data = JSON.parse(JSON.stringify(DEFAULTS));
    save(_data);
  }

  return {
    getWorkOrders, getWorkOrder, addWorkOrder, updateWorkOrder, addWoNote, closeWorkOrder,
    getOrders, addOrder, updateOrder,
    getCart, addToCart, removeFromCart, updateCartQty, clearCart, submitCart,
    addDiagnosticMessage, getDiagnosticHistory, clearDiagnosticHistory,
    getParts, getManuals,
    reset,
  };
})();

window.Store = Store;
