const SUPPLIER_DATA = {
  skyjack: {
    name:'Skyjack', category:'OEM · Aerial Work Platforms',
    icon:'ti-crane', color:'#854F0B', bg:'#FAEEDA', accent:'#F5A623',
    tagline:'SJIII scissor lifts, boom lifts, and telehandlers',
    description:'Primary OEM supplier for your aerial work platform fleet. Stocking dealer relationship with same-day local availability on most wear parts.',
    specialty:['Scissor Lifts','Boom Lifts','Telehandlers'],
    contact:{ rep:'Marcus Okafor', phone:'(512) 334-7890', email:'m.okafor@skyjack.com', leadTime:'1–2 days' },
    parts:[
      { pn:'SKJ-104210', name:'Hydraulic Lift Cylinder — SJIII 3219', price:289.00, stock:'in_stock', stockQty:3  },
      { pn:'SKJ-103100', name:'Cylinder Seal Kit — 3" Bore',           price:48.50,  stock:'in_stock', stockQty:8  },
      { pn:'SKJ-103278', name:'Relief Valve — 2500 PSI',               price:124.00, stock:'in_stock', stockQty:5  },
      { pn:'SKJ-HYD-200', name:'Hydraulic Pump Assembly',              price:415.00, stock:'low',      stockQty:1  },
      { pn:'SKJ-BAT-500', name:'Battery Pack — 24V 225Ah',             price:680.00, stock:'backorder',stockQty:0  },
      { pn:'SKJ-110044',  name:'Engine Air Filter — SJIII',            price:22.75,  stock:'in_stock', stockQty:14 },
    ],
    recentOrders:[
      { po:'PO-88341', date:'Jun 18, 2026', items:3, total:612.50,  status:'delivered' },
      { po:'PO-87204', date:'May 30, 2026', items:1, total:289.00,  status:'delivered' },
      { po:'PO-85990', date:'Apr 12, 2026', items:5, total:1203.75, status:'delivered' },
    ],
  },
  caterpillar: {
    name:'Caterpillar', category:'OEM · Heavy Equipment',
    icon:'ti-backhoe', color:'#1A1200', bg:'#F5A623', accent:'#E8980F',
    tagline:'Cat 320 excavators, undercarriage and track systems',
    description:'OEM parts for Cat heavy equipment. Orders processed through regional Cat dealer network with 2–3 day lead times on most components.',
    specialty:['Excavators','Track Systems','Undercarriage'],
    contact:{ rep:'Linda Chambers', phone:'(512) 441-2200', email:'l.chambers@cat.com', leadTime:'2–3 days' },
    parts:[
      { pn:'CAT-320-TRP',  name:'Track Roller — Cat 320GC',           price:198.00, stock:'in_stock', stockQty:4  },
      { pn:'CAT-320-CS',   name:'Carrier Roller Assembly',             price:244.00, stock:'in_stock', stockQty:2  },
      { pn:'CAT-320-FLT',  name:'Final Drive — LH',                   price:2100.00,stock:'low',      stockQty:1  },
      { pn:'CAT-320-SHOE', name:'Track Shoe — 600mm Triple Grouser',   price:88.00,  stock:'in_stock', stockQty:12 },
      { pn:'CAT-HYD-FLT',  name:'Hydraulic Return Filter',             price:64.00,  stock:'in_stock', stockQty:6  },
    ],
    recentOrders:[
      { po:'PO-88102', date:'Jun 10, 2026', items:2, total:442.00,  status:'delivered' },
      { po:'PO-86540', date:'May 2, 2026',  items:4, total:986.00,  status:'delivered' },
    ],
  },
  toyota: {
    name:'Toyota MH', category:'OEM · Material Handling',
    icon:'ti-forklift', color:'#B91C1C', bg:'#FEE2E2', accent:'#EF4444',
    tagline:'8FGU25 forklifts, mast systems, and electric lifts',
    description:'OEM forklift parts direct from Toyota Material Handling USA distributor. Strong local availability on 8FGU25 series wear parts.',
    specialty:['Forklifts','Mast Systems','Electric Lifts'],
    contact:{ rep:'David Nguyen', phone:'(512) 219-5500', email:'d.nguyen@toyotamh.com', leadTime:'1–3 days' },
    parts:[
      { pn:'TOY-04813-20600', name:'Mast Roller — Inner',              price:42.00,  stock:'in_stock', stockQty:6  },
      { pn:'TOY-04813-20610', name:'Mast Roller — Outer',              price:42.00,  stock:'in_stock', stockQty:6  },
      { pn:'TOY-00590-60533', name:'Lift Chain — 8FGU25',              price:118.00, stock:'in_stock', stockQty:2  },
      { pn:'TOY-LPG-FILTER',  name:'LPG Fuel Filter',                  price:18.50,  stock:'in_stock', stockQty:10 },
      { pn:'TOY-SPARK-SET',   name:'Spark Plug Set (4)',                price:28.00,  stock:'in_stock', stockQty:5  },
    ],
    recentOrders:[
      { po:'PO-87880', date:'Jun 22, 2026', items:3, total:202.00,  status:'in_transit' },
      { po:'PO-86210', date:'Apr 28, 2026', items:2, total:160.00,  status:'delivered'  },
    ],
  },
  bobcat: {
    name:'Bobcat', category:'OEM · Compact Equipment',
    icon:'ti-bulldozer', color:'#C2410C', bg:'#FFF0E6', accent:'#F97316',
    tagline:'S650 / S770 skid steers, loader attachments',
    description:'OEM parts for Bobcat compact equipment. Two new S770 units arriving Jul 8 — intake WOs should be created before delivery.',
    specialty:['Skid Steers','Attachments','Drive Systems'],
    contact:{ rep:'Kim Rasheed', phone:'(512) 388-4401', email:'k.rasheed@bobcat.com', leadTime:'2–4 days' },
    parts:[
      { pn:'BOB-6725765',   name:'Drive Motor — S770',                 price:880.00, stock:'backorder',stockQty:0  },
      { pn:'BOB-6737118',   name:'Hydraulic Pump — S650/S770',         price:1240.00,stock:'low',      stockQty:1  },
      { pn:'BOB-7023440',   name:'Loader Arm Bushing Kit',             price:64.00,  stock:'in_stock', stockQty:8  },
      { pn:'BOB-AIR-FLT',   name:'Engine Air Filter',                  price:19.00,  stock:'in_stock', stockQty:10 },
      { pn:'BOB-HYD-FLT',   name:'Hydraulic Filter',                   price:28.00,  stock:'in_stock', stockQty:7  },
    ],
    recentOrders:[
      { po:'PO-87990', date:'Jun 20, 2026', items:4, total:208.00,  status:'delivered' },
    ],
  },
  parker: {
    name:'Parker Hannifin', category:'Aftermarket · Hydraulics',
    icon:'ti-droplet', color:'#185FA5', bg:'#DBEAFE', accent:'#3B82F6',
    tagline:'Hose assemblies, control valves, and hydraulic cylinders',
    description:'Cross-fleet hydraulic components. Parker is the preferred aftermarket hydraulics supplier — compatible with Skyjack, Bobcat, and Cat equipment.',
    specialty:['Hose Assemblies','Control Valves','Cylinders'],
    contact:{ rep:'Steve Hallett', phone:'(800) 272-7537', email:'s.hallett@parker.com', leadTime:'1–2 days' },
    parts:[
      { pn:'PAR-CV-2201',  name:'Check Valve — 3/8" NPT',              price:38.50,  stock:'in_stock', stockQty:12 },
      { pn:'PAR-88821',    name:'Hydraulic Filter Element',             price:24.00,  stock:'in_stock', stockQty:20 },
      { pn:'PAR-H6-12',    name:'Hose Assembly — 3/4" × 12"',          price:31.00,  stock:'in_stock', stockQty:6  },
      { pn:'PAR-H6-24',    name:'Hose Assembly — 3/4" × 24"',          price:44.00,  stock:'in_stock', stockQty:4  },
      { pn:'PAR-RV-500',   name:'Relief Valve — Adjustable',           price:92.00,  stock:'in_stock', stockQty:3  },
    ],
    recentOrders:[
      { po:'PO-88290', date:'Jun 15, 2026', items:6, total:318.00,  status:'delivered' },
      { po:'PO-87110', date:'May 18, 2026', items:3, total:141.00,  status:'delivered' },
    ],
  },
  grainger: {
    name:'Grainger', category:'Distributor · MRO Supply',
    icon:'ti-package', color:'#0F6E56', bg:'#D1FAE5', accent:'#10B981',
    tagline:'Fasteners, lubricants, electrical, and safety PPE',
    description:'Primary MRO distributor for consumables and shop supplies across all branches. Net-30 account with next-day delivery to all locations.',
    specialty:['Fasteners','Lubricants','Electrical','Safety'],
    contact:{ rep:'Account Online', phone:'1-800-472-4643', email:'grainger.com/account', leadTime:'Next day' },
    parts:[
      { pn:'GRG-4WT47',    name:'Anti-Seize Compound — 8 oz',          price:14.25,  stock:'in_stock', stockQty:20 },
      { pn:'GRG-HYD-OIL',  name:'Hydraulic Oil AW46 — 1 gal',          price:22.50,  stock:'in_stock', stockQty:15 },
      { pn:'GRG-6K835',    name:'Cable Tie — 11" 50-pack',              price:6.80,   stock:'in_stock', stockQty:40 },
      { pn:'GRG-GLOVES-L', name:'Nitrile Gloves — Large, 100ct',        price:18.00,  stock:'in_stock', stockQty:12 },
      { pn:'GRG-5X855',    name:'Lock Washer — 3/8" (100pk)',            price:4.50,   stock:'in_stock', stockQty:30 },
    ],
    recentOrders:[
      { po:'PO-88400', date:'Jun 28, 2026', items:8, total:189.40,  status:'in_transit' },
      { po:'PO-87750', date:'Jun 5, 2026',  items:5, total:94.25,   status:'delivered'  },
      { po:'PO-86800', date:'May 10, 2026', items:12, total:302.10, status:'delivered'  },
    ],
  },
  trelleborg: {
    name:'Trelleborg', category:'Aftermarket · Sealing',
    icon:'ti-circle-dashed', color:'#534AB7', bg:'#EDE9FE', accent:'#8B5CF6',
    tagline:'Hydraulic seals, O-rings, and custom seal kits',
    description:'Specialty sealing components. Trelleborg seals are used as OEM-equivalent replacements for hydraulic cylinder and pump seal kits across all equipment.',
    specialty:['Hydraulic Seals','O-rings','Custom Kits'],
    contact:{ rep:'Anna Kowalski', phone:'(630) 552-1000', email:'a.kowalski@trelleborg.com', leadTime:'3–5 days' },
    parts:[
      { pn:'TRE-SKJ-KIT3', name:'Seal Kit — Skyjack SJIII Cylinder',   price:48.50,  stock:'in_stock', stockQty:5  },
      { pn:'TRE-OR-104',   name:'O-Ring Kit — 104-piece assortment',    price:34.00,  stock:'in_stock', stockQty:3  },
      { pn:'TRE-ROD-38',   name:'Rod Seal — 1.5" ID Polyurethane',      price:12.00,  stock:'in_stock', stockQty:10 },
      { pn:'TRE-WIPER-38', name:'Wiper Seal — 1.5" ID',                 price:9.50,   stock:'in_stock', stockQty:8  },
      { pn:'TRE-PISTON',   name:'Piston Seal — 3" Bore PTFE',           price:22.00,  stock:'in_stock', stockQty:6  },
    ],
    recentOrders:[
      { po:'PO-87310', date:'May 25, 2026', items:3, total:94.50,   status:'delivered' },
    ],
  },
};

function render_supplier(el) {
  const supplierId = Router.context && Router.context.supplierId;
  const s = supplierId && SUPPLIER_DATA[supplierId];
  if (!s) { Router.navigate('home'); return; }

  const STOCK = {
    in_stock: { label:'In stock',   color:'#0F6E56', bg:'#D1FAE5' },
    low:      { label:'Low stock',  color:'#B45309', bg:'#FEF3C7' },
    backorder:{ label:'Backorder',  color:'#B91C1C', bg:'#FEE2E2' },
  };
  const ORDER_STATUS = {
    delivered:  { label:'Delivered',   color:'#0F6E56', bg:'#D1FAE5' },
    in_transit: { label:'In transit',  color:'#185FA5', bg:'#DBEAFE' },
    processing: { label:'Processing',  color:'#B45309', bg:'#FEF3C7' },
  };

  const totalParts = s.parts.reduce((n,p) => n + (p.stockQty||0), 0);
  const inStockCount = s.parts.filter(p => p.stock==='in_stock'||p.stock==='low').length;

  el.innerHTML = `
<style>
.sup-main { flex:1; overflow-y:auto; background:#F5F2EE; }
.sup-body  { max-width:900px; margin:0 auto; padding:24px 28px 48px; }

/* Header card */
.sup-hdr { background:#FFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:24px; margin-bottom:20px; display:flex; align-items:flex-start; gap:18px; }
.sup-hdr-icon { width:56px; height:56px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; background:${s.bg}; color:${s.color}; }
.sup-hdr-body { flex:1; min-width:0; }
.sup-hdr-name { font-size:20px; font-weight:800; color:#111318; letter-spacing:-.3px; }
.sup-hdr-cat  { font-size:12px; color:#9CA3AF; margin-top:2px; }
.sup-hdr-desc { font-size:13px; color:#5A5F6E; margin-top:8px; line-height:1.6; }
.sup-hdr-tags { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
.sup-hdr-tag  { font-size:11px; background:#F5F2EE; color:#3A3D4A; border-radius:6px; padding:3px 10px; }
.sup-hdr-actions { display:flex; gap:8px; flex-shrink:0; flex-direction:column; align-items:flex-end; }
.sup-btn-primary { background:#F5A623; color:#1A1200; border:none; border-radius:8px; padding:9px 16px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
.sup-btn-primary:hover { background:#E8980F; }
.sup-btn-ghost { background:#FFF; color:#3A3D4A; border:0.5px solid #E2DDD8; border-radius:8px; padding:8px 14px; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }
.sup-btn-ghost:hover { border-color:#C8C3BC; }

/* Stats row */
.sup-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px; }
.sup-stat  { background:#FFF; border:0.5px solid #E8E4DF; border-radius:10px; padding:14px 16px; }
.sup-stat-val { font-size:22px; font-weight:800; color:#111318; line-height:1; }
.sup-stat-lbl { font-size:10px; color:#9CA3AF; margin-top:4px; }

/* Two-col */
.sup-cols { display:grid; grid-template-columns:1fr 260px; gap:16px; align-items:start; }

/* Parts table */
.sup-card { background:#FFF; border:0.5px solid #E8E4DF; border-radius:11px; overflow:hidden; margin-bottom:16px; }
.sup-card-hdr { padding:12px 16px; border-bottom:0.5px solid #F0ECE8; display:flex; align-items:center; gap:6px; }
.sup-card-title { font-size:12px; font-weight:700; color:#111318; }
.sup-card-ct { font-size:10px; font-weight:700; background:#F0ECE8; color:#7A7F8E; border-radius:999px; padding:1px 7px; margin-left:2px; }
.sup-part-row { display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:0.5px solid #F5F2EE; }
.sup-part-row:last-child { border-bottom:none; }
.sup-part-pn   { font-size:10px; font-weight:700; color:#ABA6A0; font-family:monospace; flex-shrink:0; width:100px; }
.sup-part-name { font-size:12px; color:#111318; flex:1; min-width:0; }
.sup-part-price { font-size:13px; font-weight:700; color:#111318; flex-shrink:0; }
.sup-stock-pill { font-size:9px; font-weight:700; border-radius:999px; padding:2px 8px; flex-shrink:0; }
.sup-add-btn { width:24px; height:24px; border-radius:6px; background:#F5F2EE; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; color:#5A5F6E; flex-shrink:0; }
.sup-add-btn:hover { background:#F5A623; color:#1A1200; }

/* Orders */
.sup-order-row { display:flex; align-items:center; gap:10px; padding:10px 16px; border-bottom:0.5px solid #F5F2EE; }
.sup-order-row:last-child { border-bottom:none; }
.sup-order-po   { font-size:11px; font-weight:700; color:#3A3D4A; font-family:monospace; }
.sup-order-date { font-size:10px; color:#ABA6A0; margin-top:1px; }
.sup-order-body { flex:1; min-width:0; }
.sup-order-meta { font-size:10px; color:#9CA3AF; }
.sup-order-amt  { font-size:13px; font-weight:700; color:#111318; flex-shrink:0; }

/* Contact card */
.sup-contact-row { display:flex; align-items:flex-start; gap:10px; padding:10px 16px; border-bottom:0.5px solid #F5F2EE; }
.sup-contact-row:last-child { border-bottom:none; }
.sup-contact-lbl { font-size:10px; color:#ABA6A0; min-width:72px; margin-top:1px; flex-shrink:0; }
.sup-contact-val { font-size:12px; color:#111318; font-weight:500; }
</style>

<div class="shell">
  ${buildSidebar('')}
  <div class="main sup-main">
    <div class="topbar">
      <button onclick="Router.navigate('home')" style="background:none;border:none;cursor:pointer;color:#8A8FA8;font-size:20px;display:flex;align-items:center;margin-right:4px;"><i class="ti ti-arrow-left"></i></button>
      <div style="font-size:13px;color:#5C6070;font-weight:500;">${s.name}</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div class="sup-body">

      <!-- Header -->
      <div class="sup-hdr">
        <div class="sup-hdr-icon"><i class="ti ${s.icon}"></i></div>
        <div class="sup-hdr-body">
          <div class="sup-hdr-name">${s.name}</div>
          <div class="sup-hdr-cat">${s.category}</div>
          <div class="sup-hdr-desc">${s.description}</div>
          <div class="sup-hdr-tags">${s.specialty.map(t=>`<span class="sup-hdr-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="sup-hdr-actions">
          <button class="sup-btn-primary" onclick="sendPrompt('Open Parts Search')"><i class="ti ti-search" style="font-size:13px;"></i> Search parts</button>
          <button class="sup-btn-ghost" onclick="sendPrompt('Open order history')"><i class="ti ti-history" style="font-size:12px;"></i> Order history</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="sup-stats">
        <div class="sup-stat">
          <div class="sup-stat-val">${s.parts.length}</div>
          <div class="sup-stat-lbl">Parts on file</div>
        </div>
        <div class="sup-stat">
          <div class="sup-stat-val">${inStockCount}</div>
          <div class="sup-stat-lbl">Available now</div>
        </div>
        <div class="sup-stat">
          <div class="sup-stat-val">${totalParts}</div>
          <div class="sup-stat-lbl">Units in stock</div>
        </div>
        <div class="sup-stat">
          <div class="sup-stat-val">${s.recentOrders.length}</div>
          <div class="sup-stat-lbl">Recent orders</div>
        </div>
      </div>

      <div class="sup-cols">
        <div>
          <!-- Parts -->
          <div class="sup-card">
            <div class="sup-card-hdr">
              <i class="ti ti-package" style="font-size:13px;color:#9CA3AF;"></i>
              <span class="sup-card-title">Parts catalog</span>
              <span class="sup-card-ct">${s.parts.length}</span>
              <button onclick="sendPrompt('Open Parts Search')" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:11px;color:#ABA6A0;font-family:inherit;display:flex;align-items:center;gap:3px;">Full catalog <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
            </div>
            ${s.parts.map(p => {
              const st = STOCK[p.stock]||STOCK.in_stock;
              return `<div class="sup-part-row">
                <div class="sup-part-pn">${p.pn}</div>
                <div class="sup-part-name">${p.name}</div>
                <div class="sup-stock-pill" style="background:${st.bg};color:${st.color};">${st.label}</div>
                <div class="sup-part-price">$${p.price.toFixed(2)}</div>
                <button class="sup-add-btn" title="Add to cart"><i class="ti ti-plus"></i></button>
              </div>`;
            }).join('')}
          </div>

          <!-- Recent orders -->
          <div class="sup-card">
            <div class="sup-card-hdr">
              <i class="ti ti-history" style="font-size:13px;color:#9CA3AF;"></i>
              <span class="sup-card-title">Recent orders</span>
              <span class="sup-card-ct">${s.recentOrders.length}</span>
              <button onclick="sendPrompt('Open order history')" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:11px;color:#ABA6A0;font-family:inherit;display:flex;align-items:center;gap:3px;">View all <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
            </div>
            ${s.recentOrders.map(o => {
              const os = ORDER_STATUS[o.status]||ORDER_STATUS.delivered;
              return `<div class="sup-order-row">
                <div class="sup-order-body">
                  <div class="sup-order-po">${o.po}</div>
                  <div class="sup-order-date">${o.date} · ${o.items} item${o.items!==1?'s':''}</div>
                </div>
                <div class="sup-stock-pill" style="background:${os.bg};color:${os.color};">${os.label}</div>
                <div class="sup-order-amt">$${o.total.toFixed(2)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Right: contact -->
        <div>
          <div class="sup-card">
            <div class="sup-card-hdr">
              <i class="ti ti-address-book" style="font-size:13px;color:#9CA3AF;"></i>
              <span class="sup-card-title">Contact &amp; ordering</span>
            </div>
            <div class="sup-contact-row">
              <div class="sup-contact-lbl">Rep</div>
              <div class="sup-contact-val">${s.contact.rep}</div>
            </div>
            <div class="sup-contact-row">
              <div class="sup-contact-lbl">Phone</div>
              <div class="sup-contact-val">${s.contact.phone}</div>
            </div>
            <div class="sup-contact-row">
              <div class="sup-contact-lbl">Email</div>
              <div class="sup-contact-val" style="font-size:11px;word-break:break-all;">${s.contact.email}</div>
            </div>
            <div class="sup-contact-row">
              <div class="sup-contact-lbl">Lead time</div>
              <div class="sup-contact-val">${s.contact.leadTime}</div>
            </div>
            <div style="padding:14px 16px;">
              <button class="sup-btn-primary" style="width:100%;justify-content:center;" onclick="sendPrompt('Open Parts Search')">
                <i class="ti ti-search" style="font-size:13px;"></i> Search ${s.name} parts
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>`;
}
