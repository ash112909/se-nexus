function render_parts_search(el) {
  const _woId = Router.context && Router.context.woId;
  const _wo = _woId ? Store.getWorkOrder(_woId) : null;

  // ── Catalog tree ────────────────────────────────────────────────────────
  const CATALOG = [
    { id:'SKJ', name:'Skyjack', icon:'ti-crane', models:[
      { id:'SKJ-SJIII3219', name:'SJIII 3219', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Lift Cylinder Assembly', partIds:['SKJ-104210','SKJ-103100','SKJ-103445','SKJ-103512'] },
          { name:'Pressure & Control',     partIds:['SKJ-103278','SKJ-103601','PAR-CV-2201'] },
          { name:'Fluid & Filters',        partIds:['SKJ-HF046-1G','SKJ-HF068-1G','SKJ-104880','PAR-88821'] },
        ]},
        { name:'Engine', icon:'ti-engine', subs:[
          { name:'Filtration', partIds:['SKJ-110044'] },
        ]},
      ]},
    ]},
    { id:'CAT', name:'Caterpillar', icon:'ti-backhoe', models:[
      { id:'CAT-320', name:'320 Excavator', components:[
        { name:'Track System', icon:'ti-settings', subs:[
          { name:'Track Adjuster', partIds:['CAT-TRK-7201','CAT-TRK-7050'] },
        ]},
        { name:'Engine', icon:'ti-engine', subs:[
          { name:'Filtration', partIds:['CAT-1R0716','CAT-1R0750','CAT-093-7521'] },
        ]},
      ]},
    ]},
    { id:'TOY', name:'Toyota', icon:'ti-forklift', models:[
      { id:'TOY-8FGU25', name:'8FGU25', components:[
        { name:'Lift System', icon:'ti-crane', subs:[
          { name:'Mast & Chain',  partIds:['TOY-MCH-114'] },
          { name:'Lift Cylinder', partIds:['TOY-LFT-088'] },
        ]},
      ]},
    ]},
    { id:'BOB', name:'Bobcat', icon:'ti-bulldozer', models:[
      { id:'BOB-S650', name:'S650', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Quick Coupler',   partIds:['BOB-QC-520'] },
          { name:'Hydraulic Lines', partIds:['BOB-HYD-310'] },
        ]},
        { name:'Electrical', icon:'ti-bolt', subs:[
          { name:'Fuses & Misc', partIds:['GEN-FUSE-KIT'] },
        ]},
      ]},
    ]},
  ];

  const EQUIPMENT = [
    { asset:'FL-094', serial:'SJ3219-00847',    supplierId:'SKJ', modelId:'SKJ-SJIII3219' },
    { asset:'FL-017', serial:'CAT320-DKB00847', supplierId:'CAT', modelId:'CAT-320' },
    { asset:'FL-031', serial:'TOY8FGU-00391',   supplierId:'TOY', modelId:'TOY-8FGU25' },
    { asset:'FL-008', serial:'BOB-S650-00712',  supplierId:'BOB', modelId:'BOB-S650' },
  ];

  const HOTSPOTS = {
    'SKJ-SJIII3219': [
      { sub:'Lift Cylinder Assembly', partId:'SKJ-104210', x:50, y:42, ref:1 },
      { sub:'Lift Cylinder Assembly', partId:'SKJ-103100', x:38, y:55, ref:2 },
      { sub:'Lift Cylinder Assembly', partId:'SKJ-103445', x:26, y:65, ref:3 },
      { sub:'Lift Cylinder Assembly', partId:'SKJ-103512', x:60, y:70, ref:4 },
      { sub:'Pressure & Control',     partId:'SKJ-103278', x:72, y:55, ref:5 },
      { sub:'Pressure & Control',     partId:'SKJ-103601', x:82, y:64, ref:6 },
      { sub:'Fluid & Filters',        partId:'SKJ-104880', x:88, y:40, ref:7 },
    ],
    'CAT-320': [
      { sub:'Track Adjuster', partId:'CAT-TRK-7201', x:22, y:72, ref:1 },
      { sub:'Track Adjuster', partId:'CAT-TRK-7050', x:44, y:76, ref:2 },
      { sub:'Filtration',     partId:'CAT-1R0716',   x:60, y:38, ref:3 },
      { sub:'Filtration',     partId:'CAT-1R0750',   x:68, y:46, ref:4 },
      { sub:'Filtration',     partId:'CAT-093-7521', x:76, y:38, ref:5 },
    ],
    'TOY-8FGU25': [
      { sub:'Mast & Chain',  partId:'TOY-MCH-114', x:42, y:28, ref:1 },
      { sub:'Lift Cylinder', partId:'TOY-LFT-088', x:53, y:55, ref:2 },
    ],
    'BOB-S650': [
      { sub:'Quick Coupler',   partId:'BOB-QC-520',   x:18, y:76, ref:1 },
      { sub:'Hydraulic Lines', partId:'BOB-HYD-310',  x:22, y:60, ref:2 },
      { sub:'Fuses & Misc',    partId:'GEN-FUSE-KIT', x:65, y:35, ref:3 },
    ],
  };

  // ── SVG diagrams ─────────────────────────────────────────────────────────
  function getModelSvg(modelId) {
    const W=520,H=340;
    const base=`<rect width="${W}" height="${H}" fill="#F8F6F2"/><rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>`;
    if (modelId==='SKJ-SJIII3219') return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${base}
      <text x="14" y="22" font-size="8" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">SKYJACK</text>
      <text x="14" y="36" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">SJIII 3219 — Hydraulic Lift Cylinder</text>
      <rect x="130" y="120" width="240" height="72" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="108" y="132" width="24" height="48" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="368" y="132" width="24" height="48" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="390" y="148" width="96" height="18" rx="2" fill="#C8C3BC" stroke="#A8A39C" stroke-width="1.5"/>
      <circle cx="490" cy="157" r="10" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <text x="148" y="115" font-size="7" fill="#9CA3AF" font-family="Inter,sans-serif">Port A (2500-2800 PSI)</text>
      <text x="300" y="115" font-size="7" fill="#9CA3AF" font-family="Inter,sans-serif">Port B</text>
      <line x1="130" y1="140" x2="130" y2="168" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="368" y1="140" x2="368" y2="168" stroke="#F5A623" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="286" y="196" width="58" height="32" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <text x="296" y="216" font-size="8" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Relief V.</text>
      <line x1="315" y1="196" x2="268" y2="156" stroke="#B8B3AC" stroke-width="1" stroke-dasharray="4,2"/>
      <rect x="402" y="56" width="48" height="58" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <text x="408" y="88" font-size="8" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Filter</text>
      <line x1="130" y1="218" x2="368" y2="218" stroke="#D1CBC4" stroke-width="0.75"/>
      <text x="218" y="232" font-size="7" fill="#B0AAA3" font-family="Inter,sans-serif">Stroke: 1,220 mm</text>
    </svg>`;
    if (modelId==='CAT-320') return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${base}
      <text x="14" y="22" font-size="8" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">CATERPILLAR</text>
      <text x="14" y="36" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">320 Excavator — Track &amp; Drive System</text>
      <rect x="55" y="230" width="390" height="56" rx="6" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      ${Array.from({length:19},(_,i)=>`<rect x="${59+i*20}" y="234" width="16" height="10" rx="2" fill="#C0BBB4" stroke="#A8A39C" stroke-width="0.5"/>`).join('')}
      ${Array.from({length:19},(_,i)=>`<rect x="${59+i*20}" y="268" width="16" height="10" rx="2" fill="#C0BBB4" stroke="#A8A39C" stroke-width="0.5"/>`).join('')}
      <circle cx="80" cy="252" r="20" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="2"/>
      <circle cx="80" cy="252" r="9" fill="#D6D2CC" stroke="#B8B3AC" stroke-width="1.5"/>
      <circle cx="420" cy="252" r="20" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="2"/>
      <circle cx="420" cy="252" r="9" fill="#D6D2CC" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="88" y="246" width="66" height="12" rx="3" fill="#B8B3AC" stroke="#9CA3AF" stroke-width="1.5"/>
      <text x="92" y="242" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Recoil cyl.</text>
      <rect x="130" y="110" width="240" height="118" rx="8" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="280" y="72" width="88" height="76" rx="6" fill="#DDD9D4" stroke="#B8B3AC" stroke-width="1.5"/>
      <text x="143" y="148" font-size="9" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Engine bay</text>
      <rect x="140" y="154" width="52" height="28" rx="3" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1"/>
      <text x="148" y="171" font-size="7" fill="#9CA3AF" font-family="Inter,sans-serif">Filters</text>
    </svg>`;
    if (modelId==='TOY-8FGU25') return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${base}
      <text x="14" y="22" font-size="8" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">TOYOTA</text>
      <text x="14" y="36" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">8FGU25 — Mast &amp; Lift System</text>
      <rect x="196" y="36" width="18" height="272" rx="2" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="296" y="36" width="18" height="272" rx="2" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="178" y="230" width="154" height="14" rx="2" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="204" y="244" width="14" height="56" rx="2" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="292" y="244" width="14" height="56" rx="2" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <rect x="228" y="76" width="52" height="168" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="2"/>
      <text x="234" y="162" font-size="8" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Lift cyl.</text>
      ${Array.from({length:11},(_,i)=>`<rect x="214" y="${50+i*18}" width="8" height="12" rx="1" fill="#C0BBB4" stroke="#A8A39C" stroke-width="0.5"/>`).join('')}
      ${Array.from({length:11},(_,i)=>`<rect x="288" y="${50+i*18}" width="8" height="12" rx="1" fill="#C0BBB4" stroke="#A8A39C" stroke-width="0.5"/>`).join('')}
      <rect x="112" y="284" width="286" height="48" rx="6" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
      <text x="224" y="62" font-size="7" fill="#B0AAA3" font-family="Inter,sans-serif">3-stage mast</text>
    </svg>`;
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${base}
      <text x="14" y="22" font-size="8" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">BOBCAT</text>
      <text x="14" y="36" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">S650 — Hydraulic &amp; Electrical System</text>
      <rect x="80" y="96" width="300" height="172" rx="10" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="240" y="56" width="116" height="96" rx="6" fill="#DDD9D4" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="30" y="224" width="94" height="36" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <rect x="30" y="258" width="94" height="14" rx="3" fill="#D6D2CC" stroke="#F5A623" stroke-width="2"/>
      <text x="40" y="270" font-size="7" fill="#854F0B" font-family="Inter,sans-serif" font-weight="600">Quick coupler</text>
      <path d="M 80 192 Q 52 192 52 232" stroke="#B8B3AC" stroke-width="3" fill="none"/>
      <path d="M 80 204 Q 46 204 46 244" stroke="#B8B3AC" stroke-width="3" fill="none"/>
      <rect x="288" y="112" width="68" height="48" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
      <text x="298" y="140" font-size="8" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Fuse box</text>
      <circle cx="128" cy="286" r="22" fill="#D6D2CC" stroke="#A8A39C" stroke-width="2"/>
      <circle cx="328" cy="286" r="22" fill="#D6D2CC" stroke="#A8A39C" stroke-width="2"/>
    </svg>`;
  }

  // ── Supplier landing-page profiles ────────────────────────────────────────
  const SUPPLIER_PROFILES = {
    'SKJ': {
      displayName: 'Skyjack',
      tagline: 'Aerial Work Platforms',
      color: '#F5A623',
      accentText: '#1A1200',
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="48" rx="4" fill="#1E1E1E"/>
        <text x="14" y="32" font-size="22" font-weight="800" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-0.5">SKYJACK</text>
      </svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="120" fill="#1A1A1A"/>
        <rect x="0" y="0" width="800" height="120" fill="url(#skj-grad)"/>
        <defs><linearGradient id="skj-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A1A1A"/><stop offset="100%" stop-color="#2A2210"/></linearGradient></defs>
        <text x="28" y="52" font-size="32" font-weight="800" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-1">SKYJACK</text>
        <text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#8A8878" letter-spacing="2">AERIAL WORK PLATFORMS</text>
        <rect x="28" y="88" width="64" height="3" rx="1.5" fill="#F5A623"/>
        <rect x="480" y="20" width="120" height="80" rx="6" fill="#232010" stroke="#3A3010" stroke-width="1"/>
        <rect x="508" y="36" width="8" height="48" rx="2" fill="#F5A623" opacity=".6"/>
        <rect x="524" y="24" width="8" height="60" rx="2" fill="#F5A623" opacity=".8"/>
        <rect x="540" y="44" width="8" height="40" rx="2" fill="#F5A623" opacity=".5"/>
        <rect x="556" y="30" width="8" height="54" rx="2" fill="#F5A623" opacity=".7"/>
        <rect x="572" y="50" width="8" height="34" rx="2" fill="#F5A623" opacity=".4"/>
      </svg>`,
      categories: [
        { icon:'ti-crane',       label:'Scissor Lifts',        sub:'SJIII, SJIV Series' },
        { icon:'ti-forklift',    label:'Boom Lifts',           sub:'SJ45T, SJ66T' },
        { icon:'ti-droplet',     label:'Hydraulic Parts',      sub:'Cylinders, Valves, Pumps' },
        { icon:'ti-battery',     label:'Electrical Parts',     sub:'Batteries, Controls' },
        { icon:'ti-settings',    label:'Drive System',         sub:'Motors, Hubs, Wheels' },
        { icon:'ti-tool',        label:'Wear Parts',           sub:'Filters, Seals, O-rings' },
      ],
      actions: [
        { icon:'ti-package',   label:'Order by Item' },
        { icon:'ti-book',      label:'All Manuals' },
        { icon:'ti-bell',      label:'Bulletins & Alerts' },
        { icon:'ti-star',      label:'Recommended Service Parts' },
      ],
      description: 'Skyjack is a world-leading manufacturer of scissor lifts, boom lifts, and telehandlers. Mid-County Rental stocks genuine Skyjack OEM parts for all fleet units.',
      features: [
        { ok:true,  label:'Parts Lookup' },
        { ok:true,  label:'Parts Diagrams' },
        { ok:true,  label:'Support Manuals' },
        { ok:true,  label:'Recommended Service Parts' },
        { ok:false, label:'Real-Time OEM Inventory' },
        { ok:true,  label:'Digital Order Delivery' },
      ],
      news: [
        { date:'Jun 2026', title:'SJIII 3219 hydraulic seal kit now available' },
        { date:'May 2026', title:'Updated service bulletin — lift cylinder torque specs' },
      ],
    },
    'CAT': {
      displayName: 'Caterpillar',
      tagline: 'Heavy Construction Equipment',
      color: '#F5A623',
      accentText: '#1A1200',
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="48" rx="4" fill="#F5A623"/>
        <text x="14" y="33" font-size="20" font-weight="900" font-family="Inter,sans-serif" fill="#1A1200" letter-spacing="-0.5">CAT</text>
        <text x="60" y="33" font-size="11" font-weight="600" font-family="Inter,sans-serif" fill="#4A3600" letter-spacing="0.5">CATERPILLAR</text>
      </svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="120" fill="#1A0E00"/>
        <rect x="0" y="0" width="800" height="120" fill="url(#cat-grad)"/>
        <defs><linearGradient id="cat-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A0E00"/><stop offset="100%" stop-color="#2A1800"/></linearGradient></defs>
        <text x="28" y="52" font-size="32" font-weight="900" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-1">CAT</text>
        <text x="110" y="52" font-size="18" font-weight="600" font-family="Inter,sans-serif" fill="#D4880A" letter-spacing="2">CATERPILLAR</text>
        <text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#6A5A38" letter-spacing="2">HEAVY CONSTRUCTION EQUIPMENT</text>
        <rect x="28" y="88" width="64" height="3" rx="1.5" fill="#F5A623"/>
      </svg>`,
      categories: [
        { icon:'ti-backhoe',     label:'Excavators',           sub:'320, 323, 330 Series' },
        { icon:'ti-bulldozer',   label:'Track-Type Tractors',  sub:'D6, D8, D9' },
        { icon:'ti-settings',    label:'Undercarriage',        sub:'Track, Rollers, Idlers' },
        { icon:'ti-engine',      label:'Engine Parts',         sub:'Filters, Belts, Seals' },
        { icon:'ti-droplet',     label:'Hydraulic System',     sub:'Pumps, Cylinders, Hoses' },
        { icon:'ti-tool',        label:'Ground Engagement',    sub:'Teeth, Adapters, Blades' },
      ],
      actions: [
        { icon:'ti-package',   label:'Order by Item' },
        { icon:'ti-book',      label:'All Manuals' },
        { icon:'ti-bell',      label:'Bulletins & Alerts' },
        { icon:'ti-star',      label:'Recommended Service Parts' },
      ],
      description: 'Caterpillar is the world's largest manufacturer of construction and mining equipment. Mid-County Rental sources genuine Cat parts for our excavator and dozer fleet.',
      features: [
        { ok:true,  label:'Parts Lookup' },
        { ok:true,  label:'Parts Diagrams' },
        { ok:false, label:'Support Manuals' },
        { ok:true,  label:'Recommended Service Parts' },
        { ok:false, label:'Real-Time OEM Inventory' },
        { ok:true,  label:'Digital Order Delivery' },
      ],
      news: [
        { date:'Jun 2026', title:'320 track adjuster grease spec update' },
        { date:'Apr 2026', title:'C7.1 engine filter cross-reference now available' },
      ],
    },
    'TOY': {
      displayName: 'Toyota',
      tagline: 'Material Handling Equipment',
      color: '#C8102E',
      accentText: '#FFFFFF',
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="48" rx="4" fill="#C8102E"/>
        <text x="14" y="33" font-size="18" font-weight="800" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="1">TOYOTA</text>
        <text x="112" y="33" font-size="10" font-weight="500" font-family="Inter,sans-serif" fill="#FFAAAA" letter-spacing="0.5">FORKLIFTS</text>
      </svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="120" fill="#6B0618"/>
        <rect x="0" y="0" width="800" height="120" fill="url(#toy-grad)"/>
        <defs><linearGradient id="toy-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#6B0618"/><stop offset="100%" stop-color="#3A0210"/></linearGradient></defs>
        <text x="28" y="52" font-size="28" font-weight="800" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="2">TOYOTA</text>
        <text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#FFAAAA" letter-spacing="2">MATERIAL HANDLING EQUIPMENT</text>
        <rect x="28" y="88" width="64" height="3" rx="1.5" fill="#C8102E"/>
      </svg>`,
      categories: [
        { icon:'ti-forklift',    label:'IC Forklifts',         sub:'8FGU, 8FG Series' },
        { icon:'ti-battery-2',   label:'Electric Forklifts',   sub:'8FBET, 7FBEU Series' },
        { icon:'ti-crane',       label:'Mast & Lift System',   sub:'Chains, Cylinders' },
        { icon:'ti-gear',        label:'Transmission',         sub:'Clutches, Torque Conv.' },
        { icon:'ti-settings',    label:'Drive & Steer Axle',   sub:'Bearings, Seals' },
        { icon:'ti-tool',        label:'Wear Parts',           sub:'Tires, Forks, Filters' },
      ],
      actions: [
        { icon:'ti-package',   label:'Order by Item' },
        { icon:'ti-book',      label:'All Manuals' },
        { icon:'ti-bell',      label:'Bulletins & Alerts' },
        { icon:'ti-star',      label:'Recommended Service Parts' },
      ],
      description: 'Toyota Material Handling is the #1 forklift brand worldwide. Mid-County Rental services Toyota IC and electric forklifts with genuine OEM and quality aftermarket parts.',
      features: [
        { ok:true,  label:'Parts Lookup' },
        { ok:true,  label:'Parts Diagrams' },
        { ok:true,  label:'Support Manuals' },
        { ok:true,  label:'Recommended Service Parts' },
        { ok:false, label:'Real-Time OEM Inventory' },
        { ok:false, label:'Invoice Lookup' },
      ],
      news: [
        { date:'May 2026', title:'8FGU25 mast chain inspection interval bulletin' },
        { date:'Mar 2026', title:'New OEM lift cylinder seals now stocked' },
      ],
    },
    'BOB': {
      displayName: 'Bobcat',
      tagline: 'Compact Equipment',
      color: '#E87722',
      accentText: '#FFFFFF',
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="48" rx="4" fill="#E87722"/>
        <text x="14" y="33" font-size="20" font-weight="900" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="-0.5">BOBCAT</text>
      </svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="120" fill="#1A0A00"/>
        <rect x="0" y="0" width="800" height="120" fill="url(#bob-grad)"/>
        <defs><linearGradient id="bob-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A0A00"/><stop offset="100%" stop-color="#2A1408"/></linearGradient></defs>
        <text x="28" y="52" font-size="32" font-weight="900" font-family="Inter,sans-serif" fill="#E87722" letter-spacing="-1">BOBCAT</text>
        <text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#6A4A28" letter-spacing="2">COMPACT EQUIPMENT</text>
        <rect x="28" y="88" width="64" height="3" rx="1.5" fill="#E87722"/>
      </svg>`,
      categories: [
        { icon:'ti-bulldozer',   label:'Skid-Steer Loaders',   sub:'S650, S750, S850' },
        { icon:'ti-tractor',     label:'Compact Track Loaders', sub:'T590, T650' },
        { icon:'ti-droplet',     label:'Hydraulic System',      sub:'Pumps, Hoses, Couplers' },
        { icon:'ti-bolt',        label:'Electrical System',     sub:'Fuses, Relays, Controls' },
        { icon:'ti-settings',    label:'Drive Train',           sub:'Chain Case, Motors' },
        { icon:'ti-tool',        label:'Attachments',           sub:'Buckets, Augers, Grapples' },
      ],
      actions: [
        { icon:'ti-package',   label:'Order by Item' },
        { icon:'ti-book',      label:'All Manuals' },
        { icon:'ti-bell',      label:'Bulletins & Alerts' },
        { icon:'ti-star',      label:'Recommended Service Parts' },
      ],
      description: 'Bobcat Company is a leading manufacturer of compact equipment. Mid-County Rental maintains a fleet of Bobcat skid-steer loaders serviced with OEM and compatible parts.',
      features: [
        { ok:true,  label:'Parts Lookup' },
        { ok:false, label:'Parts Diagrams' },
        { ok:false, label:'Support Manuals' },
        { ok:true,  label:'Recommended Service Parts' },
        { ok:false, label:'Real-Time OEM Inventory' },
        { ok:true,  label:'Digital Order Delivery' },
      ],
      news: [
        { date:'Jun 2026', title:'S650 hydraulic quick-coupler recall notice' },
        { date:'Feb 2026', title:'Revised fuse panel layout — S-Series 2020+' },
      ],
    },
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const ALL_PARTS = Store.getParts('', '');
  function fp(id) { return ALL_PARTS.find(p => p.id === id); }
  function findModelEntry(modelId) {
    for (const s of CATALOG) { const m = s.models.find(m => m.id === modelId); if (m) return {supplier:s,model:m}; }
    return null;
  }
  function partsForSub(modelId,compName,subName) {
    const e=findModelEntry(modelId); if(!e) return [];
    const c=e.model.components.find(c=>c.name===compName); if(!c) return [];
    const s=c.subs.find(s=>s.name===subName); if(!s) return [];
    return s.partIds.map(fp).filter(Boolean);
  }
  function partsForComp(modelId,compName) {
    const e=findModelEntry(modelId); if(!e) return [];
    const c=e.model.components.find(c=>c.name===compName); if(!c) return [];
    return c.subs.flatMap(s=>s.partIds).map(fp).filter(Boolean);
  }
  function partsForModel(modelId) {
    const e=findModelEntry(modelId); if(!e) return [];
    return e.model.components.flatMap(c=>c.subs.flatMap(s=>s.partIds)).map(fp).filter(Boolean);
  }
  function catalogPathFor(partId) {
    for (const s of CATALOG) for (const m of s.models) for (const c of m.components) for (const sub of c.subs)
      if (sub.partIds.includes(partId)) return `${s.name} › ${m.name} › ${c.name} › ${sub.name}`;
    return '';
  }
  function getActiveCart() { return _woId ? Store.getWoCart(_woId) : Store.getCart(); }
  function isInCart(partId) { return getActiveCart().some(c=>c.id===partId); }
  function doAddToCart(part) {
    if (_woId) { Store.addToWoCart(_woId, part); renderDetail(); refreshRows(); }
    else {
      const wos = Store.getWorkOrders('active');
      const opts = wos.map(w=>`<option value="${w.id}">${w.machine} — WO #${w.id}</option>`).join('');
      Modal.show({ title:'Add to cart', body:`<p style="font-size:13px;color:#3A3D4A;margin-bottom:14px;"><strong>${part.description}</strong> · $${part.price.toFixed(2)}</p><label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Assign to Work Order</label><select id="ps-wo-picker" style="width:100%;height:36px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;outline:none;"><option value="">No WO (general)</option>${opts}</select>`,
        actions:[
          {label:'Cancel', onClick:()=>Modal.close()},
          {label:'Add to cart', primary:true, onClick:()=>{ const v=document.getElementById('ps-wo-picker').value; if(v) Store.addToWoCart(parseInt(v),part); else Store.addToCart(part); Modal.close(); renderDetail(); refreshRows(); }}
        ]
      });
    }
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let _nav = { supplierId:null, modelId:null, compName:null, subName:null };
  let _sel = null;
  let _searchMode = 'keyword';
  let _searchQuery = '';
  let _woFilter = null;
  let _centerView = 'list';
  let _expanded = new Set();

  if (_wo) {
    const eq = EQUIPMENT.find(e=>e.asset===_wo.asset);
    if (eq) { _nav.supplierId=eq.supplierId; _nav.modelId=eq.modelId; _expanded.add(eq.supplierId); _expanded.add(eq.modelId); }
  }

  // ── Initial HTML ─────────────────────────────────────────────────────────
  el.innerHTML = `<style>
.ps-layout{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}
.ps-search-area{padding:10px 20px;background:#FFFFFF;border-bottom:0.5px solid #E8E4DF;flex-shrink:0;}
.search-mode-row{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;}
.smode-btn{padding:4px 10px;border-radius:6px;border:0.5px solid #E2DDD8;background:none;font-size:11px;font-weight:500;color:#5A5F6E;cursor:pointer;font-family:inherit;}
.smode-btn.active{background:#1E1E1E;color:#FFFFFF;border-color:#1E1E1E;}
.search-input-row{display:flex;gap:8px;align-items:center;}
.search-input-wrap{position:relative;flex:1;}
.search-icon-abs{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#B0AAA3;font-size:14px;pointer-events:none;}
.ps-search-input{width:100%;height:36px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:8px;padding:0 10px 0 34px;font-size:13px;font-family:inherit;color:#111318;outline:none;}
.ps-search-input:focus{border-color:#F5A623;background:#FFFFFF;}
.ps-search-input::placeholder{color:#B0AAA3;}
.wo-mode-select{height:36px;border:1px solid #E2DDD8;border-radius:8px;padding:0 10px;font-size:13px;font-family:inherit;color:#111318;outline:none;background:#FFFFFF;flex:1;}
.ps-breadcrumb{display:flex;align-items:center;padding:5px 20px;background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;font-size:12px;color:#5C6070;gap:4px;flex-shrink:0;flex-wrap:wrap;}
.ps-body{display:flex;flex:1;min-height:0;overflow:hidden;}
.ps-tree-panel{width:236px;min-width:236px;background:#FFFFFF;border-right:0.5px solid #E8E4DF;overflow-y:auto;flex-shrink:0;}
.ps-center-panel{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;}
.ps-detail-panel{width:296px;min-width:296px;background:#FFFFFF;border-left:0.5px solid #E8E4DF;display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0;}
/* Tree */
.tree-root-node{display:flex;align-items:center;gap:6px;padding:8px 14px;font-size:12px;font-weight:600;color:#3A3D4A;cursor:pointer;border-bottom:0.5px solid #F0ECE8;}
.tree-root-node:hover,.tree-root-node.active{background:#FAEEDA;color:#854F0B;}
.tree-node{display:flex;align-items:center;gap:5px;font-size:12px;color:#3A3D4A;cursor:pointer;padding:5px 0;}
.tree-node:hover{background:#F5F2EE;}
.tree-node.active{background:#FAEEDA;color:#854F0B;}
.tree-toggle{color:#9CA3AF;font-size:10px;width:12px;text-align:center;flex-shrink:0;cursor:pointer;}
.tree-count{margin-left:auto;font-size:10px;color:#B0AAA3;padding-right:12px;}
.tree-s{padding-left:10px;font-weight:600;}
.tree-m{padding-left:24px;}
.tree-c{padding-left:40px;font-size:11px;}
.tree-sub{padding-left:54px;font-size:11px;color:#7A7F8E;}
/* Center */
.center-toolbar{padding:9px 18px;background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.center-body{padding:18px;overflow-y:auto;flex:1;}
.center-title{font-size:17px;font-weight:700;color:#111318;letter-spacing:-0.3px;}
.center-sub{font-size:12px;color:#7A7F8E;margin-top:2px;}
.center-hdr{margin-bottom:16px;}
.vtoggle-wrap{display:flex;background:#F0ECE8;border-radius:6px;padding:2px;gap:2px;}
.vtoggle-btn{padding:4px 11px;border-radius:4px;border:none;background:none;font-size:11px;font-weight:500;color:#7A7F8E;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;}
.vtoggle-btn.active{background:#FFFFFF;color:#111318;box-shadow:0 1px 2px rgba(0,0,0,.06);}
.eq-chip{display:inline-flex;align-items:center;gap:4px;background:#F5F2EE;border:0.5px solid #E2DDD8;border-radius:5px;padding:2px 7px;font-size:11px;color:#5A5F6E;}
.sec-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px;margin-top:16px;}
/* Supplier cards */
.supplier-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px;}
.supplier-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:11px;padding:16px;cursor:pointer;}
.supplier-card:hover{border-color:#C8C3BC;}
.sc-icon{font-size:22px;color:#C8C3BC;margin-bottom:8px;}
.sc-name{font-size:14px;font-weight:700;color:#111318;margin-bottom:3px;}
.sc-meta{font-size:11px;color:#9CA3AF;margin-bottom:4px;}
.sc-models{font-size:11px;color:#5A5F6E;}
/* Model / comp cards */
.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
.m-card,.c-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px;cursor:pointer;}
.m-card:hover,.c-card:hover{border-color:#C8C3BC;}
.m-card-name,.c-card-name{font-size:13px;font-weight:600;color:#111318;margin-bottom:3px;}
.m-card-meta,.c-card-meta{font-size:11px;color:#9CA3AF;margin-bottom:5px;}
.sub-chip{background:#F5F2EE;color:#7A7F8E;font-size:10px;border-radius:4px;padding:2px 5px;}
.c-card-icon{font-size:16px;color:#F5A623;margin-bottom:6px;}
/* Sub sections */
.sub-section{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden;margin-bottom:10px;}
.sub-sec-hdr{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;background:#FAFAF8;border-bottom:0.5px solid #F0ECE8;}
.sub-sec-hdr:hover{background:#F5F2EE;}
.sub-sec-name{font-size:12px;font-weight:600;color:#111318;flex:1;}
.sub-sec-count{font-size:11px;color:#9CA3AF;}
/* Parts table */
.parts-tbl{width:100%;border-collapse:collapse;}
.parts-tbl th{background:#FAFAF8;font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#9CA3AF;padding:7px 12px;text-align:left;border-bottom:1px solid #E8E4DF;white-space:nowrap;}
.parts-tbl td{padding:8px 12px;border-bottom:0.5px solid #F0ECE8;font-size:12px;color:#3A3D4A;vertical-align:middle;}
.parts-tbl tr.prow{cursor:pointer;}
.parts-tbl tr.prow:hover td{background:#FAFAF8;}
.parts-tbl tr.prow.sel td{background:#EEEDFE;}
.pnum{font-weight:600;color:#111318;font-size:11px;font-family:'SF Mono','Consolas',monospace;white-space:nowrap;}
.pdesc{font-size:12px;font-weight:500;color:#111318;margin-bottom:2px;}
.pbadges{display:flex;gap:3px;flex-wrap:wrap;}
.badge-oem{background:#F5F2EE;color:#5A5F6E;font-size:9px;font-weight:600;border-radius:4px;padding:1px 5px;}
.badge-am{background:#FAEEDA;color:#854F0B;font-size:9px;font-weight:600;border-radius:4px;padding:1px 5px;}
.badge-rec{background:#EAF3DE;color:#3B6D11;font-size:9px;font-weight:600;border-radius:4px;padding:1px 5px;display:inline-flex;align-items:center;gap:2px;}
.avdot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:3px;flex-shrink:0;}
.avdot.g{background:#639922;}.avdot.a{background:#BA7517;}
.avlbl.g{color:#3B6D11;}.avlbl.a{color:#854F0B;}
.incart-badge{background:#FAEEDA;color:#854F0B;font-size:10px;font-weight:600;border-radius:5px;padding:3px 8px;}
.add-btn{background:#F5A623;border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;}
.add-btn:hover{background:#E8980F;}
/* Diagram */
.diag-wrap{display:flex;flex-direction:column;gap:0;flex:1;overflow:hidden;}
.diag-svg-area{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:16px;background:#F8F6F2;}
.diag-canvas{position:relative;display:inline-block;}
.diag-legend{border-top:0.5px solid #E8E4DF;flex-shrink:0;max-height:200px;overflow-y:auto;}
.legend-row{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:0.5px solid #F5F2EE;cursor:pointer;font-size:12px;}
.legend-row:last-child{border-bottom:none;}
.legend-row:hover{background:#FAFAF8;}
.legend-row.sel{background:#EEEDFE;}
.legend-row.inc{background:#FFFBF2;}
.legend-ref{width:20px;height:20px;border-radius:50%;background:#F5F2EE;border:1.5px solid #D1CBC4;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#3A3D4A;flex-shrink:0;}
.legend-row.sel .legend-ref{background:#534AB7;border-color:#3B3497;color:#FFF;}
.legend-row.inc .legend-ref{background:#F5A623;border-color:#D4880A;color:#1A1200;}
.legend-name{flex:1;font-weight:500;color:#111318;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.legend-num{font-size:10px;color:#9CA3AF;min-width:76px;}
.legend-price{font-weight:700;color:#111318;min-width:46px;text-align:right;}
.add-sm{background:#F5A623;border:none;border-radius:5px;padding:2px 7px;font-size:10px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;}
.incart-sm{background:#FAEEDA;color:#854F0B;font-size:10px;font-weight:600;border-radius:5px;padding:2px 6px;}
/* Callouts */
.cbubble{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid;transition:transform .15s;box-shadow:0 2px 5px rgba(0,0,0,.14);}
.cbubble:hover{transform:scale(1.15);}
.cb-def{background:#FFF;border-color:#9CA3AF;color:#3A3D4A;}
.cb-cart{background:#F5A623;border-color:#D4880A;color:#1A1200;}
.cb-sel{background:#534AB7;border-color:#3B3497;color:#FFF;}
.cb-dim{background:#F5F2EE;border-color:#D1CBC4;color:#B0AAA3;opacity:.6;}
/* Detail panel */
.dp-header{display:flex;align-items:flex-start;gap:6px;padding:14px 14px 0;}
.dp-title{flex:1;font-size:13px;font-weight:700;color:#111318;line-height:1.4;}
.dp-close{background:none;border:none;font-size:18px;color:#9CA3AF;cursor:pointer;padding:0;line-height:1;flex-shrink:0;}
.dp-close:hover{color:#3A3D4A;}
.dp-partnum{padding:3px 14px 6px;font-size:11px;font-weight:600;color:#9CA3AF;font-family:'SF Mono','Consolas',monospace;}
.dp-badges{padding:0 14px 8px;display:flex;gap:4px;flex-wrap:wrap;}
.dp-div{height:0.5px;background:#F0ECE8;margin:6px 0;}
.dp-field{display:flex;align-items:baseline;gap:6px;padding:5px 14px;}
.dp-lbl{font-size:11px;color:#9CA3AF;min-width:76px;flex-shrink:0;}
.dp-val{font-size:12px;font-weight:500;color:#111318;}
.dp-avail{display:flex;align-items:center;font-size:12px;font-weight:500;}
.dp-avail.g{color:#3B6D11;}.dp-avail.a{color:#854F0B;}
.dp-path{padding:4px 14px 8px;font-size:10px;color:#9CA3AF;line-height:1.6;display:flex;align-items:flex-start;gap:4px;}
.dp-actions{padding:12px 14px;border-top:0.5px solid #F0ECE8;margin-top:auto;}
.dp-add{width:100%;background:#F5A623;border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;}
.dp-add:hover{background:#E8980F;}
.dp-incart{width:100%;background:#FAEEDA;border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;color:#854F0B;cursor:default;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;}
/* Supplier landing page */
.slp-scroll{overflow-y:auto;flex:1;display:flex;flex-direction:column;}
.slp-banner{flex-shrink:0;line-height:0;}
.slp-banner svg{width:100%;display:block;}
.slp-body{display:flex;gap:18px;padding:18px;align-items:flex-start;flex:1;}
.slp-main{flex:1;min-width:0;}
.slp-side{width:240px;min-width:240px;display:flex;flex-direction:column;gap:14px;flex-shrink:0;}
.slp-section-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px;}
.slp-cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.slp-cat-tile{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px 12px;cursor:pointer;}
.slp-cat-tile:hover{border-color:#C8C3BC;}
.slp-cat-icon{font-size:20px;margin-bottom:6px;}
.slp-cat-label{font-size:12px;font-weight:600;color:#111318;margin-bottom:2px;}
.slp-cat-sub{font-size:10px;color:#9CA3AF;}
.slp-action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.slp-action-tile{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px 10px;text-align:center;cursor:pointer;}
.slp-action-tile:hover{border-color:#C8C3BC;}
.slp-info-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:16px;}
.slp-info-title{font-size:14px;font-weight:700;color:#111318;margin-bottom:2px;}
.slp-info-tag{font-size:11px;color:#9CA3AF;margin-bottom:10px;}
.slp-info-desc{font-size:12px;color:#5A5F6E;line-height:1.6;margin-bottom:12px;}
.slp-feat-list{display:flex;flex-direction:column;gap:5px;}
.slp-feat-row{display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#3A3D4A;}
.slp-news-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden;}
.slp-news-hdr{background:#F5F2EE;padding:10px 14px;font-size:11px;font-weight:700;color:#3A3D4A;border-bottom:0.5px solid #E8E4DF;}
.slp-news-body{padding:10px 14px;display:flex;flex-direction:column;gap:10px;}
.slp-news-item{}
.slp-news-date{font-size:10px;color:#9CA3AF;margin-bottom:2px;}
.slp-news-title{font-size:12px;color:#3A3D4A;line-height:1.5;}
/* WO ribbon */
.wo-ribbon{background:#1E1E1E;padding:9px 22px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #2A2A2A;flex-shrink:0;flex-wrap:wrap;}
.wr-item{display:flex;align-items:center;gap:5px;font-size:12px;color:#8A8FA8;}
.wr-item strong{color:#FFF;font-weight:600;}
.wr-sep{color:#3C4052;}
</style>
<h2 class="sr-only">Parts search</h2>
<div class="shell">
  ${buildSidebar('parts')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        ${_wo ? `<a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work Order detail WO #${_wo.id}')">WO #${_wo.id}</a><span style="color:#3C4052;">/</span>` : ''}
        <span style="color:#FFFFFF;font-weight:500;">Parts search</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    ${_wo ? `<div class="wo-ribbon"><div class="wr-item"><i class="ti ti-shopping-cart" style="color:#F5A623;"></i> Adding to <strong>WO #${_wo.id}</strong></div><span class="wr-sep">·</span><div class="wr-item"><strong>${_wo.machine}</strong></div><span class="wr-sep">·</span><div class="wr-item"><strong>${_wo.asset}</strong></div><button onclick="sendPrompt('Work Order detail WO #${_wo.id}')" style="margin-left:auto;background:none;border:1px solid #3C4052;border-radius:6px;padding:4px 11px;font-size:11px;color:#8A8FA8;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;"><i class="ti ti-arrow-left" style="font-size:11px;"></i> Back to WO</button></div>` : ''}
    <div class="ps-search-area">
      <div class="search-mode-row" id="ps-mode-row"></div>
      <div class="search-input-row" id="ps-input-row"></div>
    </div>
    <div class="ps-breadcrumb" id="ps-breadcrumb"></div>
    <div class="ps-body">
      <div class="ps-tree-panel" id="ps-tree"></div>
      <div class="ps-center-panel" id="ps-center"></div>
      <div class="ps-detail-panel" id="ps-detail" style="display:none;flex-direction:column;"></div>
    </div>
  </div>
</div>`;

  // ── Search bar ────────────────────────────────────────────────────────────
  const MODES = [
    { id:'keyword',   label:'Keyword',    ph:'Search parts, components, vendors…' },
    { id:'wo',        label:'By WO',      ph:null },
    { id:'equipment', label:'Equip. #',   ph:'e.g. FL-094' },
    { id:'model',     label:'Model',      ph:'e.g. SJIII 3219' },
    { id:'serial',    label:'Serial #',   ph:'e.g. SJ3219-00847' },
  ];

  function renderSearchBar() {
    const modeRow = document.getElementById('ps-mode-row');
    const inputRow = document.getElementById('ps-input-row');
    if (!modeRow || !inputRow) return;
    modeRow.innerHTML = MODES.map(m =>
      `<button class="smode-btn ${_searchMode === m.id ? 'active' : ''}" onclick="psSetMode('${m.id}')">${m.label}</button>`
    ).join('');
    if (_searchMode === 'wo') {
      const wos = Store.getWorkOrders('active');
      const opts = wos.map(w => `<option value="${w.id}" ${_woFilter == w.id ? 'selected' : ''}>${w.machine} — WO #${w.id} (${w.asset})</option>`).join('');
      inputRow.innerHTML = `<select class="wo-mode-select" id="ps-wo-select"><option value="">Select a work order…</option>${opts}</select><button onclick="psApplyWoFilter()" style="background:#F5A623;border:none;border-radius:7px;padding:0 14px;height:36px;font-size:12px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;">Go</button>`;
      document.getElementById('ps-wo-select').addEventListener('change', function() { _woFilter = this.value || null; });
    } else {
      const mode = MODES.find(m => m.id === _searchMode);
      inputRow.innerHTML = `<div class="search-input-wrap"><i class="ti ti-search search-icon-abs"></i><input class="ps-search-input" id="ps-search-input" type="text" placeholder="${mode ? mode.ph : 'Search…'}" value="${_searchQuery}"/></div>${_searchQuery ? `<button onclick="psClearSearch()" style="background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:0 10px;height:36px;font-size:11px;color:#7A7F8E;cursor:pointer;font-family:inherit;">Clear</button>` : ''}`;
      const inp = document.getElementById('ps-search-input');
      if (inp) inp.addEventListener('input', function() {
        _searchQuery = this.value;
        if (_searchMode === 'keyword') { renderCenter(); }
        else if (this.value.trim()) psApplySearch();
      });
    }
  }

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  function renderBreadcrumb() {
    const el2 = document.getElementById('ps-breadcrumb');
    if (!el2) return;
    const crumbs = [{ label:'All parts', action:"psNavTo(null,null,null,null)" }];
    if (_nav.supplierId) { const s=CATALOG.find(x=>x.id===_nav.supplierId); if(s) crumbs.push({label:s.name, action:`psNavTo('${s.id}',null,null,null)`}); }
    if (_nav.modelId) { const e=findModelEntry(_nav.modelId); if(e) crumbs.push({label:e.model.name, action:`psNavTo('${e.supplier.id}','${e.model.id}',null,null)`}); }
    if (_nav.compName) crumbs.push({label:_nav.compName, action:`psNavTo('${_nav.supplierId}','${_nav.modelId}','${esc(_nav.compName)}',null)`});
    if (_nav.subName) crumbs.push({label:_nav.subName, action:null});
    el2.innerHTML = crumbs.map((c,i) => i===crumbs.length-1
      ? `<span style="color:#FFFFFF;font-weight:500;">${c.label}</span>`
      : `<a style="color:#5C6070;cursor:pointer;" onclick="${c.action}">${c.label}</a><span style="color:#3C4052;"> / </span>`
    ).join('');
  }

  function esc(s) { return (s||'').replace(/'/g,"\\'"); }

  // ── Tree ──────────────────────────────────────────────────────────────────
  function renderTree() {
    const panel = document.getElementById('ps-tree');
    if (!panel) return;
    const isRoot = !_nav.supplierId;
    let h = `<div class="tree-root-node ${isRoot?'active':''}" onclick="psNavTo(null,null,null,null)"><i class="ti ti-package" style="font-size:13px;"></i> All parts <span class="tree-count">${ALL_PARTS.length}</span></div>`;
    for (const s of CATALOG) {
      const sExp = _expanded.has(s.id);
      const sActive = _nav.supplierId===s.id && !_nav.modelId;
      const sCount = [...new Set(s.models.flatMap(m=>m.components.flatMap(c=>c.subs.flatMap(sub=>sub.partIds))))].length;
      h += `<div class="tree-node tree-s ${sActive?'active':''}">
        <span class="tree-toggle" onclick="event.stopPropagation();psToggle('${s.id}')">${sExp?'▾':'▸'}</span>
        <i class="ti ${s.icon}" style="font-size:12px;flex-shrink:0;"></i>
        <span onclick="psNavTo('${s.id}',null,null,null)" style="flex:1;">${s.name}</span>
        <span class="tree-count">${sCount}</span>
      </div>`;
      if (sExp) for (const m of s.models) {
        const mExp = _expanded.has(m.id);
        const mActive = _nav.modelId===m.id && !_nav.compName;
        const mCount = [...new Set(m.components.flatMap(c=>c.subs.flatMap(sub=>sub.partIds)))].length;
        h += `<div class="tree-node tree-m ${mActive?'active':''}">
          <span class="tree-toggle" onclick="event.stopPropagation();psToggle('${m.id}')">${mExp?'▾':'▸'}</span>
          <i class="ti ti-tag" style="font-size:11px;flex-shrink:0;"></i>
          <span onclick="psNavTo('${s.id}','${m.id}',null,null)" style="flex:1;">${m.name}</span>
          <span class="tree-count">${mCount}</span>
        </div>`;
        if (mExp) for (const c of m.components) {
          const cActive = _nav.modelId===m.id && _nav.compName===c.name && !_nav.subName;
          const cCount = [...new Set(c.subs.flatMap(sub=>sub.partIds))].length;
          h += `<div class="tree-node tree-c ${cActive?'active':''}" onclick="psNavTo('${s.id}','${m.id}','${esc(c.name)}',null)">
            <span class="tree-toggle"></span><i class="ti ${c.icon||'ti-settings'}" style="font-size:11px;flex-shrink:0;"></i>
            <span style="flex:1;">${c.name}</span><span class="tree-count">${cCount}</span>
          </div>`;
          for (const sub of c.subs) {
            const subActive = _nav.modelId===m.id && _nav.compName===c.name && _nav.subName===sub.name;
            h += `<div class="tree-node tree-sub ${subActive?'active':''}" onclick="psNavTo('${s.id}','${m.id}','${esc(c.name)}','${esc(sub.name)}')" title="${sub.name}">
              <span class="tree-toggle"></span><i class="ti ti-point" style="font-size:10px;flex-shrink:0;"></i>
              <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sub.name}</span>
              <span class="tree-count">${sub.partIds.length}</span>
            </div>`;
          }
        }
      }
    }
    panel.innerHTML = h;
  }

  // ── Center ────────────────────────────────────────────────────────────────
  function renderCenter() {
    const panel = document.getElementById('ps-center');
    if (!panel) return;
    if (_searchMode === 'keyword' && _searchQuery.trim()) { renderSearchResults(); return; }
    if (!_nav.supplierId) { renderRoot(); return; }
    if (!_nav.modelId)   { renderSupplier(); return; }
    if (!_nav.compName)  { renderModel(); return; }
    if (!_nav.subName)   { renderComponent(); return; }
    renderSubComponent();
  }

  function toolbar() {
    return `<div class="center-toolbar">
      <div class="vtoggle-wrap">
        <button class="vtoggle-btn ${_centerView==='list'?'active':''}" onclick="psSetView('list')"><i class="ti ti-list" style="font-size:11px;"></i> List</button>
        <button class="vtoggle-btn ${_centerView==='diagram'?'active':''}" onclick="psSetView('diagram')"><i class="ti ti-schema" style="font-size:11px;"></i> Diagram</button>
      </div>
    </div>`;
  }

  function renderRoot() {
    document.getElementById('ps-center').innerHTML = `<div class="center-body">
      <div class="center-hdr"><div class="center-title">Parts catalog</div><div class="center-sub">${ALL_PARTS.length} parts across ${CATALOG.length} suppliers</div></div>
      <div class="supplier-grid">${CATALOG.map(s=>{
        const ids=[...new Set(s.models.flatMap(m=>m.components.flatMap(c=>c.subs.flatMap(sub=>sub.partIds))))];
        return `<div class="supplier-card" onclick="psNavTo('${s.id}',null,null,null)">
          <div class="sc-icon"><i class="ti ${s.icon}"></i></div>
          <div class="sc-name">${s.name}</div>
          <div class="sc-meta">${s.models.length} model${s.models.length!==1?'s':''} · ${ids.length} parts</div>
          <div class="sc-models">${s.models.map(m=>m.name).join(', ')}</div>
        </div>`;
      }).join('')}</div>
      <div class="sec-label">All parts</div>
      ${partsTable(ALL_PARTS)}
    </div>`;
  }

  function renderSupplier() {
    const s = CATALOG.find(x=>x.id===_nav.supplierId); if(!s) return;
    const pr = SUPPLIER_PROFILES[s.id] || {};
    const accent = pr.color || '#F5A623';
    const fleetEq = EQUIPMENT.filter(e=>e.supplierId===s.id);

    const categoryTiles = (pr.categories || []).map(cat =>
      `<div class="slp-cat-tile">
        <div class="slp-cat-icon" style="color:${accent};"><i class="ti ${cat.icon}"></i></div>
        <div class="slp-cat-label">${cat.label}</div>
        <div class="slp-cat-sub">${cat.sub}</div>
      </div>`
    ).join('');

    const actionTiles = (pr.actions || []).map(a =>
      `<div class="slp-action-tile">
        <i class="ti ${a.icon}" style="font-size:20px;color:#9CA3AF;display:block;margin-bottom:6px;"></i>
        <div style="font-size:12px;font-weight:600;color:#3A3D4A;">${a.label}</div>
      </div>`
    ).join('');

    const featureList = (pr.features || []).map(f =>
      `<div class="slp-feat-row">
        <i class="ti ${f.ok?'ti-check':'ti-x'}" style="color:${f.ok?'#639922':'#C0392B'};font-size:12px;flex-shrink:0;margin-top:1px;"></i>
        <span>${f.label}</span>
      </div>`
    ).join('');

    const newsList = (pr.news || []).map(n =>
      `<div class="slp-news-item">
        <div class="slp-news-date">${n.date}</div>
        <div class="slp-news-title">${n.title}</div>
      </div>`
    ).join('');

    const modelCards = s.models.map(m => {
      const eq = EQUIPMENT.filter(e=>e.modelId===m.id);
      const cnt = [...new Set(m.components.flatMap(c=>c.subs.flatMap(sub=>sub.partIds)))].length;
      return `<div class="m-card" onclick="psNavTo('${s.id}','${m.id}',null,null)">
        <div class="m-card-name">${m.name}</div>
        <div class="m-card-meta">${cnt} parts · ${m.components.length} systems</div>
        ${eq.length?`<div style="margin-top:6px;display:flex;gap:5px;flex-wrap:wrap;">${eq.map(e=>`<span class="eq-chip"><i class="ti ti-barcode" style="font-size:10px;"></i> ${e.asset}</span>`).join('')}</div>`:''}
      </div>`;
    }).join('');

    document.getElementById('ps-center').innerHTML = `
    <div class="slp-scroll">
      <!-- Banner -->
      <div class="slp-banner" style="position:relative;overflow:hidden;border-radius:0;">${pr.bannerSvg || ''}</div>

      <!-- Body grid -->
      <div class="slp-body">
        <!-- Main column -->
        <div class="slp-main">
          <!-- Categories -->
          <div class="slp-section-label">Product Families</div>
          <div class="slp-cat-grid">${categoryTiles}</div>

          <!-- Actions -->
          <div class="slp-section-label" style="margin-top:22px;">Actions</div>
          <div class="slp-action-grid">${actionTiles}</div>

          <!-- Fleet equipment -->
          ${fleetEq.length ? `<div class="slp-section-label" style="margin-top:22px;">Fleet Equipment (${fleetEq.length})</div>
          <div class="card-grid" style="margin-bottom:0;">${modelCards}</div>` : ''}
        </div>

        <!-- Side column -->
        <div class="slp-side">
          <!-- Info card -->
          <div class="slp-info-card">
            <div class="slp-info-title">${pr.displayName || s.name}</div>
            <div class="slp-info-tag">${pr.tagline || ''}</div>
            <p class="slp-info-desc">${pr.description || ''}</p>
            <div class="slp-feat-list">${featureList}</div>
          </div>

          <!-- News card -->
          ${newsList ? `<div class="slp-news-card">
            <div class="slp-news-hdr">${pr.displayName || s.name} News and Info</div>
            <div class="slp-news-body">${newsList}</div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  }

  function renderModel() {
    const e=findModelEntry(_nav.modelId); if(!e) return;
    const {supplier:s,model:m}=e;
    const eq=EQUIPMENT.filter(x=>x.modelId===m.id);
    const allP=partsForModel(m.id);
    const isD=_centerView==='diagram';
    document.getElementById('ps-center').innerHTML = toolbar() + (isD
      ? diagramHtml(m.id, null, null)
      : `<div class="center-body">
          <div class="center-hdr">
            <div class="center-title">${m.name}</div>
            <div class="center-sub">${allP.length} parts · ${m.components.length} systems</div>
            ${eq.length?`<div style="display:flex;gap:5px;margin-top:6px;flex-wrap:wrap;">${eq.map(x=>`<span class="eq-chip"><i class="ti ti-barcode" style="font-size:10px;"></i> ${x.asset} · <span style="color:#9CA3AF;">${x.serial}</span></span>`).join('')}</div>`:''}
          </div>
          <div class="card-grid">${m.components.map(c=>{
            const cp=partsForComp(m.id,c.name);
            return `<div class="c-card" onclick="psNavTo('${s.id}','${m.id}','${esc(c.name)}',null)">
              <div class="c-card-icon"><i class="ti ${c.icon||'ti-settings'}"></i></div>
              <div class="c-card-name">${c.name}</div>
              <div class="c-card-meta">${c.subs.length} sub-components · ${cp.length} parts</div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px;">${c.subs.map(sub=>`<span class="sub-chip">${sub.name}</span>`).join('')}</div>
            </div>`;
          }).join('')}</div>
          <div class="sec-label">All parts for ${m.name}</div>
          ${partsTable(allP)}
        </div>`);
    if (isD) wireupDiagram(m.id, null, null);
  }

  function renderComponent() {
    const e=findModelEntry(_nav.modelId); if(!e) return;
    const {supplier:s,model:m}=e;
    const comp=m.components.find(c=>c.name===_nav.compName); if(!comp) return;
    const isD=_centerView==='diagram';
    document.getElementById('ps-center').innerHTML = toolbar() + (isD
      ? diagramHtml(m.id, comp.name, null)
      : `<div class="center-body">
          <div class="center-hdr"><div class="center-title">${comp.name}</div><div class="center-sub">${comp.subs.length} sub-components · ${partsForComp(m.id,comp.name).length} parts</div></div>
          ${comp.subs.map(sub=>{
            const sp=partsForSub(m.id,comp.name,sub.name);
            return `<div class="sub-section">
              <div class="sub-sec-hdr" onclick="psNavTo('${s.id}','${m.id}','${esc(comp.name)}','${esc(sub.name)}')">
                <span class="sub-sec-name">${sub.name}</span>
                <span class="sub-sec-count">${sp.length} part${sp.length!==1?'s':''}</span>
                <i class="ti ti-chevron-right" style="color:#9CA3AF;font-size:11px;margin-left:auto;"></i>
              </div>
              ${partsTable(sp, true)}
            </div>`;
          }).join('')}
        </div>`);
    if (isD) wireupDiagram(m.id, comp.name, null);
  }

  function renderSubComponent() {
    const e=findModelEntry(_nav.modelId); if(!e) return;
    const {model:m}=e;
    const comp=m.components.find(c=>c.name===_nav.compName); if(!comp) return;
    const sub=comp.subs.find(s=>s.name===_nav.subName); if(!sub) return;
    const parts=partsForSub(m.id,comp.name,sub.name);
    const isD=_centerView==='diagram';
    document.getElementById('ps-center').innerHTML = toolbar() + (isD
      ? diagramHtml(m.id, comp.name, sub.name)
      : `<div class="center-body">
          <div class="center-hdr"><div class="center-title">${sub.name}</div><div class="center-sub">${parts.length} part${parts.length!==1?'s':''}</div></div>
          ${partsTable(parts)}
        </div>`);
    if (isD) wireupDiagram(m.id, comp.name, sub.name);
  }

  function renderSearchResults() {
    const q=_searchQuery.toLowerCase().trim();
    const results=ALL_PARTS.filter(p=>
      p.description.toLowerCase().includes(q)||
      p.partNum.toLowerCase().includes(q)||
      p.vendor.toLowerCase().includes(q)||
      p.category.toLowerCase().includes(q)||
      catalogPathFor(p.id).toLowerCase().includes(q)
    );
    document.getElementById('ps-center').innerHTML = `<div class="center-body">
      <div class="center-hdr"><div class="center-title">Search results</div><div class="center-sub">${results.length} part${results.length!==1?'s':''} for "${_searchQuery}"</div></div>
      ${results.length ? partsTable(results) : '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No parts found.</div>'}
    </div>`;
  }

  // ── Parts table ───────────────────────────────────────────────────────────
  function partsTable(parts, compact) {
    if (!parts.length) return '<div style="padding:14px;color:#9CA3AF;font-size:12px;">No parts.</div>';
    return `<table class="parts-tbl">
      <thead><tr><th>Part #</th><th>Description</th><th>Vendor</th><th>Avail.</th><th>Price</th><th></th></tr></thead>
      <tbody>${parts.map(p=>{
        const inC=isInCart(p.id), isSel=_sel===p.id;
        return `<tr class="prow ${isSel?'sel':''}" onclick="psSelect('${p.id}')">
          <td class="pnum">${p.partNum}</td>
          <td><div class="pdesc">${p.description}</div><div class="pbadges">${p.oemOnly?'<span class="badge-oem">OEM</span>':'<span class="badge-am">Aftermarket</span>'}${p.recommended?'<span class="badge-rec"><i class="ti ti-star" style="font-size:8px;"></i> Rec</span>':''}</div></td>
          <td style="color:#7A7F8E;font-size:11px;white-space:nowrap;">${p.vendor}</td>
          <td><span class="avdot ${p.inStock?'g':'a'}"></span><span class="avlbl ${p.inStock?'g':'a'}">${p.inStock?'In stock':'B/O'}</span></td>
          <td style="font-weight:700;color:#111318;white-space:nowrap;">$${p.price.toFixed(2)}</td>
          <td>${inC?'<span class="incart-badge">In cart</span>':`<button class="add-btn" onclick="event.stopPropagation();psAddPart('${p.id}')"><i class="ti ti-plus" style="font-size:10px;"></i> Add</button>`}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  }

  // ── Diagram ───────────────────────────────────────────────────────────────
  function diagramHtml(modelId, compName, subName) {
    const hs=(HOTSPOTS[modelId]||[]).filter(h=> subName ? h.sub===subName : true);
    return `<div class="diag-wrap">
      <div class="diag-svg-area">
        <div class="diag-canvas" id="ps-diag-canvas">${getModelSvg(modelId)}<div id="ps-hotspots" style="position:absolute;inset:0;pointer-events:none;"></div></div>
      </div>
      <div class="diag-legend">${hs.length
        ? hs.map(h=>{const p=fp(h.partId);if(!p)return'';const iC=isInCart(p.id),iS=_sel===p.id;
            return `<div class="legend-row ${iS?'sel':''} ${iC?'inc':''}" onclick="psSelect('${p.id}')">
              <span class="legend-ref">${h.ref}</span>
              <span class="legend-name">${p.description}</span>
              <span class="legend-num">${p.partNum}</span>
              <span class="legend-price">$${p.price.toFixed(2)}</span>
              ${iC?'<span class="incart-sm">In cart</span>':`<button class="add-sm" onclick="event.stopPropagation();psAddPart('${p.id}')">Add</button>`}
            </div>`;}).join('')
        : '<div style="padding:12px;font-size:12px;color:#9CA3AF;">Navigate to a sub-component to see parts on diagram.</div>'}
      </div>
    </div>`;
  }

  function wireupDiagram(modelId, compName, subName) {
    const canvas=document.getElementById('ps-diag-canvas');
    const hEl=document.getElementById('ps-hotspots');
    if (!canvas||!hEl) return;
    const svgEl=canvas.querySelector('svg');
    if (!svgEl) return;
    hEl.style.width=svgEl.getAttribute('width')+'px';
    hEl.style.height=svgEl.getAttribute('height')+'px';
    hEl.style.pointerEvents='none';
    hEl.innerHTML='';
    const hs=(HOTSPOTS[modelId]||[]).filter(h=> subName ? h.sub===subName : true);
    hs.forEach(h=>{
      const p=fp(h.partId); if(!p) return;
      const iC=isInCart(p.id), iS=_sel===p.id;
      const d=document.createElement('div');
      d.style.cssText=`position:absolute;left:${h.x}%;top:${h.y}%;transform:translate(-50%,-50%);pointer-events:all;cursor:pointer;z-index:2;`;
      const cls=iS?'cb-sel':iC?'cb-cart':'cb-def';
      d.innerHTML=`<div class="cbubble ${cls}" title="${p.partNum} — ${p.description}">${h.ref}</div>`;
      d.onclick=()=>{ _sel=_sel===h.partId?null:h.partId; renderDetail(); refreshRows(); wireupDiagram(modelId,compName,subName); };
      hEl.appendChild(d);
    });
  }

  // ── Detail panel ──────────────────────────────────────────────────────────
  function renderDetail() {
    const panel=document.getElementById('ps-detail'); if(!panel) return;
    if (!_sel) { panel.style.display='none'; return; }
    const p=fp(_sel); if(!p) { panel.style.display='none'; return; }
    panel.style.display='flex';
    const iC=isInCart(p.id);
    const cartLabel=_woId ? `Add to WO #${_woId}` : 'Add to cart';
    panel.innerHTML=`
      <div class="dp-header"><div class="dp-title">${p.description}</div><button class="dp-close" onclick="psSelect(null)">×</button></div>
      <div class="dp-partnum">${p.partNum}</div>
      <div class="dp-badges">${p.oemOnly?'<span class="badge-oem">OEM only</span>':'<span class="badge-am">Aftermarket OK</span>'}${p.recommended?'<span class="badge-rec"><i class="ti ti-star" style="font-size:9px;"></i> Recommended</span>':''}</div>
      <div class="dp-div"></div>
      <div class="dp-field"><span class="dp-lbl">Vendor</span><span class="dp-val">${p.vendor}</span></div>
      <div class="dp-field"><span class="dp-lbl">Category</span><span class="dp-val">${p.category}</span></div>
      <div class="dp-field"><span class="dp-lbl">Price</span><span class="dp-val" style="font-size:18px;font-weight:700;color:#111318;">$${p.price.toFixed(2)}</span></div>
      <div class="dp-field"><span class="dp-lbl">Availability</span><span class="dp-avail ${p.inStock?'g':'a'}"><span class="avdot ${p.inStock?'g':'a'}"></span>${p.inStock?'In stock':'Backordered'}</span></div>
      <div class="dp-div"></div>
      <div class="dp-path"><i class="ti ti-sitemap" style="font-size:10px;margin-top:2px;flex-shrink:0;"></i><span>${catalogPathFor(p.id)||'—'}</span></div>
      <div class="dp-actions">${iC
        ?`<button class="dp-incart"><i class="ti ti-check"></i> In cart</button>`
        :`<button class="dp-add" onclick="psAddPart('${p.id}')"><i class="ti ti-shopping-cart" style="font-size:13px;"></i> ${cartLabel}</button>`
      }</div>`;
  }

  function refreshRows() {
    document.querySelectorAll('.prow').forEach(r=>{
      const numCell=r.querySelector('.pnum');
      if (!numCell) return;
      const p=ALL_PARTS.find(x=>x.partNum===numCell.textContent);
      if (!p) return;
      r.classList.toggle('sel', _sel===p.id);
      const actionCell=r.cells[5];
      if (!actionCell) return;
      const iC=isInCart(p.id);
      actionCell.innerHTML=iC?'<span class="incart-badge">In cart</span>':`<button class="add-btn" onclick="event.stopPropagation();psAddPart('${p.id}')"><i class="ti ti-plus" style="font-size:10px;"></i> Add</button>`;
    });
  }

  // ── Global handlers ───────────────────────────────────────────────────────
  window.psNavTo = function(sId, mId, cName, subName) {
    _nav={supplierId:sId, modelId:mId, compName:cName, subName};
    if (sId) _expanded.add(sId);
    if (mId) _expanded.add(mId);
    _sel=null;
    renderAll();
  };
  window.psToggle = function(id) {
    if (_expanded.has(id)) _expanded.delete(id); else _expanded.add(id);
    renderTree();
  };
  window.psSelect = function(partId) {
    _sel = _sel===partId ? null : partId;
    renderDetail();
    refreshRows();
    if (_nav.modelId && _centerView==='diagram') wireupDiagram(_nav.modelId, _nav.compName, _nav.subName);
  };
  window.psSetView = function(mode) {
    _centerView=mode; renderCenter();
    if (_nav.modelId && mode==='diagram') setTimeout(()=>wireupDiagram(_nav.modelId,_nav.compName,_nav.subName),0);
  };
  window.psSetMode = function(mode) {
    _searchMode=mode; _searchQuery=''; _woFilter=null;
    renderSearchBar();
    document.getElementById('ps-search-input')?.focus();
  };
  window.psClearSearch = function() {
    _searchQuery=''; renderSearchBar(); renderCenter();
  };
  window.psApplyWoFilter = function() {
    if (!_woFilter) return;
    const wo=Store.getWorkOrder(parseInt(_woFilter));
    if (!wo) return;
    const eq=EQUIPMENT.find(e=>e.asset===wo.asset);
    if (eq) { _nav={supplierId:eq.supplierId,modelId:eq.modelId,compName:null,subName:null}; _expanded.add(eq.supplierId); _expanded.add(eq.modelId); renderAll(); }
  };
  window.psApplySearch = function() {
    const q=_searchQuery.toLowerCase().trim(); if(!q) return;
    if (_searchMode==='equipment') {
      const eq=EQUIPMENT.find(e=>e.asset.toLowerCase().includes(q));
      if (eq) { _nav={supplierId:eq.supplierId,modelId:eq.modelId,compName:null,subName:null}; _expanded.add(eq.supplierId); _expanded.add(eq.modelId); renderAll(); } else renderCenter();
    } else if (_searchMode==='serial') {
      const eq=EQUIPMENT.find(e=>e.serial.toLowerCase().includes(q));
      if (eq) { _nav={supplierId:eq.supplierId,modelId:eq.modelId,compName:null,subName:null}; _expanded.add(eq.supplierId); _expanded.add(eq.modelId); renderAll(); } else renderCenter();
    } else if (_searchMode==='model') {
      for (const s of CATALOG) { const m=s.models.find(m=>m.name.toLowerCase().includes(q)||m.id.toLowerCase().includes(q)); if(m){_nav={supplierId:s.id,modelId:m.id,compName:null,subName:null};_expanded.add(s.id);_expanded.add(m.id);renderAll();return;} }
    }
  };
  window.psAddPart = function(partId) {
    const p=fp(partId); if(!p) return;
    doAddToCart(p);
  };

  function renderAll() { renderTree(); renderCenter(); renderDetail(); renderBreadcrumb(); }

  // ── Init ──────────────────────────────────────────────────────────────────
  renderSearchBar();
  renderAll();
  if (_nav.modelId && _centerView==='diagram') setTimeout(()=>wireupDiagram(_nav.modelId,_nav.compName,_nav.subName),0);
}
