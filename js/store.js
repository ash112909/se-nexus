const Store = (() => {
  const LS_KEY = 'se-nexus-v7';

  const DEFAULT_PARTS = [
    // ── Skyjack — SJIII 3219 / shared ────────────────────────────────────────
    { id: 'SKJ-103100', partNum: 'SKJ-103100', description: 'Hydraulic lift cylinder seal kit', vendor: 'Skyjack', price: 84.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'SKJ-103278', partNum: 'SKJ-103278', description: 'Pressure relief valve', vendor: 'Skyjack', price: 126.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-107732', partNum: 'SKJ-107732', description: 'Pump seal kit', vendor: 'Skyjack', price: 49.00, oemOnly: true, inStock: false, category: 'Seals', recommended: false },
    { id: 'SKJ-103445', partNum: 'SKJ-103445', description: 'Cylinder rod wiper seal', vendor: 'Skyjack', price: 22.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'SKJ-103512', partNum: 'SKJ-103512', description: 'Cylinder end cap O-ring set', vendor: 'Skyjack', price: 14.00, oemOnly: true, inStock: false, category: 'Seals', recommended: false },
    { id: 'SKJ-104210', partNum: 'SKJ-104210', description: 'Lift cylinder assembly — complete', vendor: 'Skyjack', price: 648.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-103601', partNum: 'SKJ-103601', description: 'Hydraulic bleed screw kit', vendor: 'Skyjack', price: 12.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-HF046-1G', partNum: 'SKJ-HF046-1G', description: 'Hydraulic fluid — ISO 46 · 1 gal', vendor: 'Skyjack', price: 28.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-104880', partNum: 'SKJ-104880', description: 'Hydraulic filter — return line', vendor: 'Skyjack', price: 34.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: true },
    { id: 'SKJ-110044', partNum: 'SKJ-110044', description: 'Engine oil filter', vendor: 'Skyjack', price: 18.00, oemOnly: true, inStock: true, category: 'Filtration', recommended: false },
    { id: 'SKJ-HF068-1G', partNum: 'SKJ-HF068-1G', description: 'Hydraulic fluid — high-temp ISO 68', vendor: 'Skyjack', price: 32.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-HYD-200', partNum: 'SKJ-HYD-200', description: 'Hydraulic gear pump assembly', vendor: 'Skyjack', price: 380.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-HYD-201', partNum: 'SKJ-HYD-201', description: 'Hydraulic pump seal kit', vendor: 'Skyjack', price: 58.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'SKJ-MAN-300', partNum: 'SKJ-MAN-300', description: 'Hydraulic manifold block assembly', vendor: 'Skyjack', price: 445.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-SOL-301', partNum: 'SKJ-SOL-301', description: 'Solenoid valve — 24V DC proportional', vendor: 'Skyjack', price: 134.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-CHK-302', partNum: 'SKJ-CHK-302', description: 'Check valve — 3/8" NPT, 35 PSI cracking', vendor: 'Parker', price: 44.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-MTR-400', partNum: 'SKJ-MTR-400', description: 'Drive motor — brushless DC 24V', vendor: 'Skyjack', price: 298.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'SKJ-HUB-401', partNum: 'SKJ-HUB-401', description: 'Drive hub assembly — wheel side', vendor: 'Skyjack', price: 188.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'SKJ-TIR-402', partNum: 'SKJ-TIR-402', description: 'Drive tire — solid foam 15×5"', vendor: 'Skyjack', price: 72.00, oemOnly: false, inStock: true, category: 'Drive', recommended: false },
    { id: 'SKJ-BAT-500', partNum: 'SKJ-BAT-500', description: 'Battery — 6V 220Ah deep cycle', vendor: 'Skyjack', price: 148.00, oemOnly: true, inStock: true, category: 'Electrical', recommended: true },
    { id: 'SKJ-CHR-501', partNum: 'SKJ-CHR-501', description: 'Battery charger — 24V 30A automatic', vendor: 'Skyjack', price: 312.00, oemOnly: true, inStock: true, category: 'Electrical', recommended: false },
    { id: 'SKJ-CTL-502', partNum: 'SKJ-CTL-502', description: 'Main controller board — base station', vendor: 'Skyjack', price: 876.00, oemOnly: true, inStock: false, category: 'Electrical', recommended: false },
    { id: 'SKJ-JOY-503', partNum: 'SKJ-JOY-503', description: 'Joystick controller — platform module', vendor: 'Skyjack', price: 224.00, oemOnly: true, inStock: true, category: 'Electrical', recommended: false },
    { id: 'SKJ-LIM-504', partNum: 'SKJ-LIM-504', description: 'Limit switch — descent safety bar', vendor: 'Skyjack', price: 34.00, oemOnly: false, inStock: true, category: 'Electrical', recommended: false },
    { id: 'SKJ-PIN-600', partNum: 'SKJ-PIN-600', description: 'Scissor arm pin — 25mm × 120mm', vendor: 'Skyjack', price: 28.00, oemOnly: true, inStock: true, category: 'Structure', recommended: false },
    { id: 'SKJ-PAD-601', partNum: 'SKJ-PAD-601', description: 'Wear pad — UHMW polyethylene', vendor: 'Skyjack', price: 16.00, oemOnly: false, inStock: true, category: 'Structure', recommended: true },
    { id: 'SKJ-4632-CYL', partNum: 'SKJ-4632-CYL', description: 'Lift cylinder assembly — SJIII 4632', vendor: 'Skyjack', price: 712.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-4632-SEA', partNum: 'SKJ-4632-SEA', description: 'Lift cylinder seal kit — SJIII 4632', vendor: 'Skyjack', price: 92.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'SKJ-4632-MTR', partNum: 'SKJ-4632-MTR', description: 'Drive motor — SJIII 4632 48V', vendor: 'Skyjack', price: 312.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'SKJ-SJ45-JIB', partNum: 'SKJ-SJ45-JIB', description: 'Jib boom cylinder assembly — SJ45T', vendor: 'Skyjack', price: 824.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'SKJ-SJ45-SLW', partNum: 'SKJ-SJ45-SLW', description: 'Slewing ring bearing — SJ45T turntable', vendor: 'Skyjack', price: 534.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'SKJ-SJ45-ROT', partNum: 'SKJ-SJ45-ROT', description: 'Rotary joint assembly — SJ45T hydraulic', vendor: 'Skyjack', price: 298.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    // ── Parker (aftermarket) ──────────────────────────────────────────────────
    { id: 'PAR-88821', partNum: 'PAR-88821', description: 'Wiper seal — aftermarket', vendor: 'Parker', price: 14.00, oemOnly: false, inStock: true, category: 'Seals', recommended: false },
    { id: 'PAR-CV-2201', partNum: 'PAR-CV-2201', description: 'Control valve kit — aftermarket', vendor: 'Parker', price: 89.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    // ── Caterpillar ──────────────────────────────────────────────────────────
    { id: 'CAT-1R0716', partNum: 'CAT-1R0716', description: 'Engine oil filter — Cat 320 C7.1', vendor: 'Caterpillar', price: 22.00, oemOnly: true, inStock: true, category: 'Filtration', recommended: true },
    { id: 'CAT-1R0750', partNum: 'CAT-1R0750', description: 'Fuel filter primary — Cat 320 C7.1', vendor: 'Caterpillar', price: 31.00, oemOnly: true, inStock: true, category: 'Filtration', recommended: false },
    { id: 'CAT-093-7521', partNum: 'CAT-093-7521', description: 'Hydraulic pilot filter element — 320', vendor: 'Caterpillar', price: 44.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'CAT-TRK-7201', partNum: 'CAT-TRK-7201', description: 'Track adjuster grease cylinder — 320', vendor: 'Caterpillar', price: 156.00, oemOnly: true, inStock: true, category: 'Drive', recommended: true },
    { id: 'CAT-TRK-7050', partNum: 'CAT-TRK-7050', description: 'Track idler recoil spring — 320', vendor: 'Caterpillar', price: 212.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'CAT-SPR-7301', partNum: 'CAT-SPR-7301', description: 'Drive sprocket — Cat 320 (17T)', vendor: 'Caterpillar', price: 342.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'CAT-ROL-7302', partNum: 'CAT-ROL-7302', description: 'Top carrier roller — Cat 320', vendor: 'Caterpillar', price: 188.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'CAT-ROL-7303', partNum: 'CAT-ROL-7303', description: 'Bottom track roller — Cat 320', vendor: 'Caterpillar', price: 156.00, oemOnly: false, inStock: true, category: 'Drive', recommended: true },
    { id: 'CAT-IDL-7304', partNum: 'CAT-IDL-7304', description: 'Front idler assembly — Cat 320', vendor: 'Caterpillar', price: 524.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'CAT-PMP-8001', partNum: 'CAT-PMP-8001', description: 'Main hydraulic pump — Cat 320 (tandem)', vendor: 'Caterpillar', price: 1248.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'CAT-MTR-8002', partNum: 'CAT-MTR-8002', description: 'Swing motor assembly — Cat 320', vendor: 'Caterpillar', price: 892.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'CAT-VLV-8004', partNum: 'CAT-VLV-8004', description: 'Main control valve — Cat 320 (8-spool)', vendor: 'Caterpillar', price: 678.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'CAT-CYL-8005', partNum: 'CAT-CYL-8005', description: 'Boom cylinder seal kit — Cat 320', vendor: 'Caterpillar', price: 84.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'CAT-BLT-9001', partNum: 'CAT-BLT-9001', description: 'Serpentine belt — C7.1 engine', vendor: 'Caterpillar', price: 44.00, oemOnly: false, inStock: true, category: 'Drive', recommended: false },
    { id: 'CAT-THR-9003', partNum: 'CAT-THR-9003', description: 'Engine thermostat — 82°C', vendor: 'Caterpillar', price: 28.00, oemOnly: false, inStock: true, category: 'Filtration', recommended: false },
    { id: 'CAT-WTP-9004', partNum: 'CAT-WTP-9004', description: 'Water pump seal kit — C7.1', vendor: 'Caterpillar', price: 62.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'CAT-308-TRK', partNum: 'CAT-308-TRK', description: 'Track chain link assembly — Cat 308', vendor: 'Caterpillar', price: 48.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'CAT-308-ROL', partNum: 'CAT-308-ROL', description: 'Bottom roller — Cat 308 mini exc.', vendor: 'Caterpillar', price: 112.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'CAT-308-IDL', partNum: 'CAT-308-IDL', description: 'Front idler assembly — Cat 308', vendor: 'Caterpillar', price: 288.00, oemOnly: true, inStock: false, category: 'Drive', recommended: false },
    { id: 'CAT-308-PMP', partNum: 'CAT-308-PMP', description: 'Hydraulic pump — Cat 308 (piston)', vendor: 'Caterpillar', price: 624.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    // ── Toyota ───────────────────────────────────────────────────────────────
    { id: 'TOY-MCH-114', partNum: 'TOY-MCH-114', description: 'Mast chain set — Toyota 8FGU25 (pair)', vendor: 'Toyota', price: 188.00, oemOnly: true, inStock: true, category: 'Drive', recommended: true },
    { id: 'TOY-LFT-088', partNum: 'TOY-LFT-088', description: 'Lift cylinder seal kit — 8FGU25', vendor: 'Toyota', price: 64.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'TOY-CRG-200', partNum: 'TOY-CRG-200', description: 'Carriage assembly — std class II', vendor: 'Toyota', price: 586.00, oemOnly: true, inStock: true, category: 'Structure', recommended: false },
    { id: 'TOY-FRK-201', partNum: 'TOY-FRK-201', description: 'Fork set — 1200mm × 100mm × 45mm', vendor: 'Toyota', price: 312.00, oemOnly: true, inStock: true, category: 'Structure', recommended: false },
    { id: 'TOY-PUL-202', partNum: 'TOY-PUL-202', description: 'Mast pulley — lift chain guide', vendor: 'Toyota', price: 88.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'TOY-TLT-203', partNum: 'TOY-TLT-203', description: 'Tilt cylinder seal kit — 8FGU series', vendor: 'Toyota', price: 74.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'TOY-PMP-204', partNum: 'TOY-PMP-204', description: 'Hydraulic pump assembly — 8FGU25', vendor: 'Toyota', price: 448.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'TOY-VLV-205', partNum: 'TOY-VLV-205', description: 'Main control valve — 8FGU series', vendor: 'Toyota', price: 356.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'TOY-BRK-301', partNum: 'TOY-BRK-301', description: 'Brake shoe kit — 8FGU25 rear axle', vendor: 'Toyota', price: 124.00, oemOnly: false, inStock: true, category: 'Drive', recommended: false },
    { id: 'TOY-TRN-302', partNum: 'TOY-TRN-302', description: 'Torque converter seal kit — 8FGU', vendor: 'Toyota', price: 88.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    { id: 'TOY-32-CYL', partNum: 'TOY-32-CYL', description: 'Lift cylinder assembly — 8FGU32', vendor: 'Toyota', price: 524.00, oemOnly: true, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'TOY-32-SEA', partNum: 'TOY-32-SEA', description: 'Lift cylinder seal kit — 8FGU32', vendor: 'Toyota', price: 78.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    // ── Bobcat ───────────────────────────────────────────────────────────────
    { id: 'BOB-QC-520', partNum: 'BOB-QC-520', description: 'Quick coupler seal kit — S650/S770', vendor: 'Bobcat', price: 47.00, oemOnly: true, inStock: true, category: 'Seals', recommended: true },
    { id: 'BOB-HYD-310', partNum: 'BOB-HYD-310', description: 'Hydraulic hose assembly — high-pressure', vendor: 'Bobcat', price: 94.00, oemOnly: false, inStock: true, category: 'Hydraulic', recommended: false },
    { id: 'BOB-PMP-400', partNum: 'BOB-PMP-400', description: 'Main hydraulic pump — S650 tandem', vendor: 'Bobcat', price: 524.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'BOB-VLV-401', partNum: 'BOB-VLV-401', description: 'Loader control valve — S-Series', vendor: 'Bobcat', price: 388.00, oemOnly: true, inStock: false, category: 'Hydraulic', recommended: false },
    { id: 'BOB-MTR-402', partNum: 'BOB-MTR-402', description: 'Drive motor — wheel side S650/S770', vendor: 'Bobcat', price: 312.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'BOB-CHN-500', partNum: 'BOB-CHN-500', description: 'Drive chain — chain case (per foot)', vendor: 'Bobcat', price: 24.00, oemOnly: false, inStock: true, category: 'Drive', recommended: false },
    { id: 'BOB-SPR-501', partNum: 'BOB-SPR-501', description: 'Drive sprocket — chain case S-Series', vendor: 'Bobcat', price: 88.00, oemOnly: true, inStock: true, category: 'Drive', recommended: false },
    { id: 'BOB-RLY-600', partNum: 'BOB-RLY-600', description: 'Relay kit — main control panel', vendor: 'Grainger', price: 42.00, oemOnly: false, inStock: true, category: 'Electrical', recommended: false },
    { id: 'BOB-CTL-601', partNum: 'BOB-CTL-601', description: 'Joystick controller module — S650', vendor: 'Bobcat', price: 448.00, oemOnly: true, inStock: false, category: 'Electrical', recommended: false },
    { id: 'BOB-BAT-602', partNum: 'BOB-BAT-602', description: 'Battery — 12V 800CCA group 31', vendor: 'Grainger', price: 148.00, oemOnly: false, inStock: true, category: 'Electrical', recommended: false },
    { id: 'BOB-770-CYL', partNum: 'BOB-770-CYL', description: 'Boom cylinder seal kit — S770', vendor: 'Bobcat', price: 92.00, oemOnly: true, inStock: true, category: 'Seals', recommended: false },
    // ── Generic ───────────────────────────────────────────────────────────────
    { id: 'GEN-FUSE-KIT', partNum: 'GEN-FUSE-KIT', description: 'Fuse kit — assorted 5–30A automotive', vendor: 'Grainger', price: 14.00, oemOnly: false, inStock: true, category: 'Electrical', recommended: false },
  ];

  const DEFAULT_MANUALS = [
    { id: 'man-1',  title: 'SJIII 3219 Service Manual — Hydraulic System',         machine: 'Skyjack SJIII 3219',     vendor: 'Skyjack',      type: 'Service',  year: 2019, pages: 312, size: '18 MB' },
    { id: 'man-2',  title: 'SJIII 3219 Parts Manual',                              machine: 'Skyjack SJIII 3219',     vendor: 'Skyjack',      type: 'Parts',    year: 2020, pages: 248, size: '24 MB' },
    { id: 'man-3',  title: 'SJIII 3219 Operator Manual',                           machine: 'Skyjack SJIII 3219',     vendor: 'Skyjack',      type: 'Operator', year: 2021, pages: 96,  size: '8 MB'  },
    { id: 'man-4',  title: 'Service Bulletin SB-2847 — Lift Cylinder Seal Procedure', machine: 'Skyjack SJIII 3219', vendor: 'Skyjack',      type: 'Bulletin', year: 2026, pages: 4,   size: '1.2 MB'},
    { id: 'man-11', title: 'SJIII 4632 Service Manual — Hydraulic & Electrical',   machine: 'Skyjack SJIII 4632',     vendor: 'Skyjack',      type: 'Service',  year: 2021, pages: 288, size: '22 MB' },
    { id: 'man-12', title: 'SJIII 3219 Electrical System Manual',                  machine: 'Skyjack SJIII 3219',     vendor: 'Skyjack',      type: 'Service',  year: 2022, pages: 144, size: '11 MB' },
    { id: 'man-19', title: 'SJIII 3219 Drive System & Wheel Motor Manual',         machine: 'Skyjack SJIII 3219',     vendor: 'Skyjack',      type: 'Service',  year: 2020, pages: 96,  size: '8 MB'  },
    { id: 'man-20', title: 'SJ45T Boom Lift Service Manual — Complete',            machine: 'Skyjack SJ45T',          vendor: 'Skyjack',      type: 'Service',  year: 2023, pages: 480, size: '38 MB' },
    { id: 'man-5',  title: 'Cat 320 Service Manual — Track & Undercarriage',       machine: 'Cat 320 Excavator',      vendor: 'Caterpillar',  type: 'Service',  year: 2018, pages: 540, size: '42 MB' },
    { id: 'man-6',  title: 'Cat 320 Parts Manual',                                 machine: 'Cat 320 Excavator',      vendor: 'Caterpillar',  type: 'Parts',    year: 2019, pages: 384, size: '31 MB' },
    { id: 'man-7',  title: 'Cat 320 Operator Manual',                              machine: 'Cat 320 Excavator',      vendor: 'Caterpillar',  type: 'Operator', year: 2020, pages: 128, size: '10 MB' },
    { id: 'man-13', title: 'Cat 320 Hydraulic System Service Manual',              machine: 'Cat 320 Excavator',      vendor: 'Caterpillar',  type: 'Service',  year: 2019, pages: 360, size: '28 MB' },
    { id: 'man-21', title: 'Cat 320 Engine Service Manual — C7.1',                 machine: 'Cat 320 Excavator',      vendor: 'Caterpillar',  type: 'Service',  year: 2020, pages: 428, size: '34 MB' },
    { id: 'man-14', title: 'Cat 308 Mini Excavator Service Manual',                machine: 'Cat 308 Mini Excavator', vendor: 'Caterpillar',  type: 'Service',  year: 2017, pages: 312, size: '26 MB' },
    { id: 'man-8',  title: 'Toyota 8FGU25 Service Manual — Complete',             machine: 'Toyota 8FGU25',          vendor: 'Toyota',       type: 'Service',  year: 2017, pages: 280, size: '22 MB' },
    { id: 'man-9',  title: 'Toyota 8FGU25 Parts Catalog',                         machine: 'Toyota 8FGU25',          vendor: 'Toyota',       type: 'Parts',    year: 2018, pages: 196, size: '18 MB' },
    { id: 'man-15', title: 'Toyota 8FGU25 Hydraulic System Manual',               machine: 'Toyota 8FGU25',          vendor: 'Toyota',       type: 'Service',  year: 2019, pages: 148, size: '12 MB' },
    { id: 'man-16', title: 'Toyota 8FGU32 Parts Catalog',                         machine: 'Toyota 8FGU32',          vendor: 'Toyota',       type: 'Parts',    year: 2020, pages: 204, size: '19 MB' },
    { id: 'man-10', title: 'Bobcat S650 Service Manual — Complete',               machine: 'Bobcat S650',            vendor: 'Bobcat',       type: 'Service',  year: 2016, pages: 420, size: '35 MB' },
    { id: 'man-17', title: 'Bobcat S650 Hydraulic System Service Manual',         machine: 'Bobcat S650',            vendor: 'Bobcat',       type: 'Service',  year: 2018, pages: 240, size: '20 MB' },
    { id: 'man-18', title: 'Bobcat S770 Service Manual',                          machine: 'Bobcat S770',            vendor: 'Bobcat',       type: 'Service',  year: 2019, pages: 388, size: '32 MB' },
    { id: 'man-22', title: 'Bobcat S650/S770 Drive System Manual',               machine: 'Bobcat S650',            vendor: 'Bobcat',       type: 'Service',  year: 2020, pages: 168, size: '14 MB' },
  ];

  const DEFAULTS = {
    workOrders: [
      // ── Austin – James W. active/pending ──
      {
        id: 100094, externalId: 'RM-10094', locationId: 'austin', woType: 'equipment',
        status: 'active', priority: 'high', dueDate: 'Jun 30, 2026',
        make: 'Skyjack', model: 'SJIII 3219', serial: 'SJ3219-00847',
        machine: 'Skyjack SJIII 3219', asset: 'FL-094',
        issue: "Scissor lift won't elevate — hydraulic fault",
        warranty: { active: true, expiry: 'Sep 14, 2027' },
        assignee: 'James W.', opened: 'Jun 20, 2026',
        notes: [
          { text: 'Ran diagnostic — HYD-04 fault code confirmed. Suspect internal seal failure.', author: 'James W.', time: '9:20' },
          { text: 'Parts ordered: SKJ-103100, SKJ-103278. Awaiting delivery.', author: 'James W.', time: '9:45' }
        ],
        cart: [
          { id: 'SKJ-104880', partNum: 'SKJ-104880', description: 'Hydraulic filter — return line', vendor: 'Skyjack', price: 34.00, oemOnly: true, inStock: true, category: 'Hydraulic', qty: 1, uom: 'EA',
            localInventory: [{ locationId: 'dallas', locationName: 'Dallas Shop', qty: 3, distance: '182 mi', type: 'shop' }],
            crossRefs: [{ partNum: 'PAR-HF-3219', description: 'Return-line hydraulic filter — Parker equiv.', vendor: 'Parker', uom: 'EA', price: 24.50, note: 'OEM-approved substitute, same micron rating', mandatory: false }] },
          { id: 'SKJ-103601', partNum: 'SKJ-103601', description: 'Hydraulic bleed screw kit', vendor: 'Skyjack', price: 12.00, oemOnly: true, inStock: true, category: 'Hydraulic', qty: 1, uom: 'KIT',
            localInventory: [],
            crossRefs: [] },
          { id: 'SKJ-HF046-1G', partNum: 'SKJ-HF046-1G', description: 'Hydraulic fluid — ISO 46 · 1 gal', vendor: 'Skyjack', price: 28.00, oemOnly: true, inStock: true, category: 'Hydraulic', qty: 2, uom: 'GAL',
            localInventory: [
              { locationId: 'austin', locationName: 'Austin Shop', qty: 6, distance: 'On-site', type: 'shop' },
              { locationId: 'san-antonio', locationName: 'San Antonio Yard', qty: 4, distance: '78 mi', type: 'fleet' }
            ],
            crossRefs: [] },
          { id: 'SKJ-HYD-201', partNum: 'SKJ-HYD-201', description: 'Hydraulic pump seal kit', vendor: 'Skyjack', price: 58.00, oemOnly: true, inStock: false, category: 'Seals', qty: 1, uom: 'KIT',
            localInventory: [],
            crossRefs: [{ partNum: 'TRE-HS-3219', description: 'Hydraulic pump seal kit — Trelleborg series', vendor: 'Trelleborg', uom: 'KIT', price: 47.00, note: 'Fleet-mandatory substitute when OEM backordered', mandatory: true }] },
        ],
        submittedOrders: [
          {
            id: 'wo-ord-100094-1', poNum: 'PO-7841', date: 'Jun 20, 2026',
            items: [
              { id: 'SKJ-103100', partNum: 'SKJ-103100', description: 'Hydraulic lift cylinder seal kit', vendor: 'Skyjack', price: 84.00, qty: 1 },
              { id: 'SKJ-103278', partNum: 'SKJ-103278', description: 'Pressure relief valve', vendor: 'Skyjack', price: 126.00, qty: 1 },
            ],
            total: 210.00, status: 'in_transit',
          },
          {
            id: 'wo-ord-100094-2', poNum: 'PO-7801', date: 'Jun 12, 2026',
            items: [
              { id: 'SKJ-107732', partNum: 'SKJ-107732', description: 'Pump seal kit', vendor: 'Skyjack', price: 49.00, qty: 2 },
            ],
            total: 98.00, status: 'backordered',
          }
        ]
      },
      {
        id: 100102, externalId: 'RM-10102', locationId: 'austin', woType: 'equipment',
        status: 'active', priority: 'medium', dueDate: 'Jul 3, 2026',
        make: 'Caterpillar', model: '320 Excavator', serial: 'CAT320-01044',
        machine: 'Cat 320 Excavator', asset: 'FL-017',
        issue: 'Track tension out of spec — right side',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'Jun 22, 2026',
        notes: [],
        cart: [
          { id: 'CAT-1R0716', partNum: 'CAT-1R0716', description: 'Engine oil filter — Cat 320 C7.1', vendor: 'Caterpillar', price: 22.00, oemOnly: true, inStock: false, category: 'Filtration', qty: 3, uom: 'EA',
            localInventory: [],
            crossRefs: [{ partNum: 'GRG-CAT-OEQ-716', description: 'Heavy-duty oil filter — Cat equivalent', vendor: 'Grainger', uom: 'EA', price: 14.50, note: 'Fleet-mandatory substitute when OEM backordered', mandatory: true }] },
          { id: 'CAT-TRK-7201', partNum: 'CAT-TRK-7201', description: 'Track adjuster grease cylinder — 320', vendor: 'Caterpillar', price: 156.00, oemOnly: true, inStock: true, category: 'Drive', qty: 1, uom: 'EA',
            localInventory: [{ locationId: 'houston', locationName: 'Houston Equipment Yard', qty: 1, distance: '163 mi', type: 'fleet' }],
            crossRefs: [] },
        ],
        submittedOrders: []
      },
      // ── Austin – other assignees (not shown to James W. in list) ──
      {
        id: 100089, externalId: 'RM-10089', locationId: 'austin', woType: 'pm',
        status: 'active', priority: 'low', dueDate: 'Jul 10, 2026',
        make: 'Toyota', model: '8FGU25', serial: 'TOY8FGU-00391',
        machine: 'Toyota 8FGU25', asset: 'FL-031',
        issue: 'Mast chain elongation — scheduled inspection',
        warranty: { active: true, expiry: 'Dec 3, 2026' },
        assignee: 'M. Torres', opened: 'Jun 18, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      {
        id: 100081, externalId: 'RM-10081', locationId: 'austin', woType: 'equipment',
        status: 'pending', priority: 'medium', dueDate: 'Jun 28, 2026',
        make: 'Bobcat', model: 'S650', serial: 'BOB-S650-00814',
        machine: 'Bobcat S650', asset: 'FL-008',
        issue: 'Hydraulic quick coupler leak',
        warranty: { active: false, expiry: null },
        assignee: 'R. Kim', opened: 'Jun 15, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      // ── Austin – James W. closed ──
      {
        id: 100071, externalId: 'RM-10071', locationId: 'austin', woType: 'equipment',
        status: 'closed', priority: 'high', dueDate: 'Jun 5, 2026', closedDate: 'Jun 6, 2026',
        make: 'Skyjack', model: 'SJIII 3219', serial: 'SJ3219-00847',
        machine: 'Skyjack SJIII 3219', asset: 'FL-094',
        issue: 'Hydraulic pump failure — unit down',
        warranty: { active: true, expiry: 'Sep 14, 2027' },
        assignee: 'James W.', opened: 'Jun 2, 2026',
        notes: [
          { text: 'Pump confirmed failed. Ordered SKJ-104210 (complete pump assembly).', author: 'James W.', time: '8:15' },
          { text: 'Part arrived. Installed and tested — unit back in service.', author: 'James W.', time: '14:30' },
        ],
        cart: [],
        submittedOrders: [
          {
            id: 'wo-ord-100071-1', poNum: 'PO-7762', date: 'Jun 3, 2026',
            items: [{ id: 'SKJ-104210', partNum: 'SKJ-104210', description: 'Lift cylinder assembly — complete', vendor: 'Skyjack', price: 648.00, qty: 1 }],
            total: 648.00, status: 'delivered',
          }
        ]
      },
      {
        id: 100058, externalId: 'RM-10058', locationId: 'austin', woType: 'pm',
        status: 'closed', priority: 'low', dueDate: 'May 28, 2026', closedDate: 'May 28, 2026',
        make: 'Caterpillar', model: '320 Excavator', serial: 'CAT320-01044',
        machine: 'Cat 320 Excavator', asset: 'FL-017',
        issue: '500-hr preventive maintenance service',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'May 25, 2026',
        notes: [
          { text: 'PM completed. Replaced oil, fuel filter, and hydraulic pilot filter. Track tension within spec.', author: 'James W.', time: '11:00' },
        ],
        cart: [],
        submittedOrders: [
          {
            id: 'wo-ord-100058-1', poNum: 'PO-7735', date: 'May 26, 2026',
            items: [
              { id: 'CAT-1R0716', partNum: 'CAT-1R0716', description: 'Engine oil filter — Cat 320', vendor: 'Caterpillar', price: 22.00, qty: 1 },
              { id: 'CAT-1R0750', partNum: 'CAT-1R0750', description: 'Fuel filter primary — Cat 320', vendor: 'Caterpillar', price: 31.00, qty: 1 },
              { id: 'CAT-093-7521', partNum: 'CAT-093-7521', description: 'Hydraulic pilot filter — Cat 320', vendor: 'Caterpillar', price: 44.00, qty: 1 },
            ],
            total: 97.00, status: 'delivered',
          }
        ]
      },
      {
        id: 100044, externalId: 'RM-10044', locationId: 'austin', woType: 'equipment',
        status: 'closed', priority: 'medium', dueDate: 'May 15, 2026', closedDate: 'May 15, 2026',
        make: 'Bobcat', model: 'S650', serial: 'BOB-S650-00814',
        machine: 'Bobcat S650', asset: 'FL-008',
        issue: 'Rear brake drag — left wheel adjustment',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'May 12, 2026',
        notes: [
          { text: 'Brake adjusted and tested. No further drag. Returned to service.', author: 'James W.', time: '10:40' },
        ],
        cart: [], submittedOrders: []
      },
      // ── San Marcos – James W. ──
      {
        id: 100110, externalId: 'RM-10110', locationId: 'san-marcos', woType: 'equipment',
        status: 'active', priority: 'high', dueDate: 'Jun 28, 2026',
        make: 'Skyjack', model: 'SJIII 4632', serial: 'SJ4632-01122',
        machine: 'Skyjack SJIII 4632', asset: 'SM-011',
        issue: 'Platform leveling sensor fault — tilt alarm triggered',
        warranty: { active: true, expiry: 'Mar 28, 2028' },
        assignee: 'James W.', opened: 'Jun 24, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      // ── San Marcos – other assignees ──
      {
        id: 100108, externalId: 'RM-10108', locationId: 'san-marcos', woType: 'equipment',
        status: 'pending', priority: 'medium', dueDate: 'Jul 1, 2026',
        make: 'Toyota', model: '8FGU32', serial: 'TOY8FGU32-00205',
        machine: 'Toyota 8FGU32', asset: 'SM-004',
        issue: 'Brake drag — left rear wheel',
        warranty: { active: false, expiry: null },
        assignee: 'D. Reyes', opened: 'Jun 21, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      // ── San Marcos – James W. closed ──
      {
        id: 100096, externalId: 'RM-10096', locationId: 'san-marcos', woType: 'stock',
        status: 'closed', priority: 'low', dueDate: 'Jun 14, 2026', closedDate: 'Jun 13, 2026',
        make: '', model: '', serial: '',
        machine: '', asset: 'SM-STOCK',
        issue: 'Hydraulic consumables stock replenishment',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'Jun 10, 2026',
        notes: [
          { text: 'Stock order placed and received. Shelved at new parts room bin H-12.', author: 'James W.', time: '13:20' },
        ],
        cart: [],
        submittedOrders: [
          {
            id: 'wo-ord-100096-1', poNum: 'PO-7780', date: 'Jun 11, 2026',
            items: [
              { id: 'SKJ-HF046-1G', partNum: 'SKJ-HF046-1G', description: 'Hydraulic fluid — ISO 46 · 1 gal', vendor: 'Skyjack', price: 28.00, qty: 4 },
              { id: 'SKJ-104880', partNum: 'SKJ-104880', description: 'Hydraulic filter — return line', vendor: 'Skyjack', price: 34.00, qty: 2 },
            ],
            total: 180.00, status: 'delivered',
          }
        ]
      },
      // ── Kyle – James W. ──
      {
        id: 100115, externalId: 'RM-10115', locationId: 'kyle', woType: 'equipment',
        status: 'active', priority: 'medium', dueDate: 'Jul 5, 2026',
        make: 'Bobcat', model: 'S770', serial: 'BOB-S770-00301',
        machine: 'Bobcat S770', asset: 'KY-003',
        issue: 'Loader arm hydraulic cylinder slow extension',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'Jun 25, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      // ── Kyle – other assignees ──
      {
        id: 100113, externalId: 'RM-10113', locationId: 'kyle', woType: 'equipment',
        status: 'closed', priority: 'low', dueDate: 'Jun 15, 2026', closedDate: 'Jun 16, 2026',
        make: 'Caterpillar', model: '308 Mini Excavator', serial: 'CAT308-00512',
        machine: 'Cat 308 Mini Excavator', asset: 'KY-007',
        issue: 'Engine coolant leak — water pump seal',
        warranty: { active: false, expiry: null },
        assignee: 'T. Nguyen', opened: 'Jun 10, 2026',
        notes: [], cart: [], submittedOrders: []
      },
      // ── Kyle – James W. closed ──
      {
        id: 100103, externalId: 'RM-10103', locationId: 'kyle', woType: 'pm',
        status: 'closed', priority: 'medium', dueDate: 'Jun 18, 2026', closedDate: 'Jun 18, 2026',
        make: 'Bobcat', model: 'S770', serial: 'BOB-S770-00301',
        machine: 'Bobcat S770', asset: 'KY-003',
        issue: '250-hr scheduled PM — filters and lubrication',
        warranty: { active: false, expiry: null },
        assignee: 'James W.', opened: 'Jun 16, 2026',
        notes: [
          { text: 'PM complete. Engine oil, air filter, and all grease points serviced.', author: 'James W.', time: '15:00' },
        ],
        cart: [], submittedOrders: []
      },
    ],
    orders: [
      { id: 'ord-1', poNum: 'PO-7841', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 20, 2026', user: 'James W.', name: 'Hydraulic seals — WO #100094', wo: 'WO #100094', asset: 'FL-094', amount: 268.00, status: 'submitted', tab: 'submitted',
        items: [
          { id: 'p-skj-1', partNum: 'SKJ-702-1285', description: 'Hydraulic Cylinder Seal Kit', vendor: 'Skyjack', price: 94.00, qty: 2, oemOnly: true },
          { id: 'p-skj-2', partNum: 'SKJ-702-1291', description: 'O-Ring Kit — Manifold Block', vendor: 'Skyjack', price: 42.00, qty: 1, oemOnly: false },
          { id: 'p-skj-3', partNum: 'SKJ-702-0855', description: 'Pump Shaft Seal', vendor: 'Skyjack', price: 38.00, qty: 1, oemOnly: true },
        ]
      },
      { id: 'ord-2', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 18, 2026', user: 'James W.', name: 'Filters & consumables', wo: 'WO #100102', asset: 'FL-102', amount: 94.50, status: 'saved', tab: 'drafts',
        items: [
          { id: 'p-fil-1', partNum: 'GRG-3HYK4', description: 'Hydraulic Oil Filter', vendor: 'Grainger', price: 18.50, qty: 3, oemOnly: false },
          { id: 'p-fil-2', partNum: 'GRG-4LMN9', description: 'Engine Air Filter', vendor: 'Grainger', price: 22.00, qty: 1, oemOnly: false },
          { id: 'p-fil-3', partNum: 'GRG-2TKR7', description: 'Grease Cartridge 400g', vendor: 'Grainger', price: 8.00, qty: 2, oemOnly: false },
        ]
      },
      { id: 'ord-3', poNum: 'PO-7792', vendor: 'Parker', vendorId: 'PKR-WD', date: 'Jun 15, 2026', user: 'M. Torres', name: 'Valve kit — FL-091', wo: 'WO #100088', asset: 'FL-091', amount: 145.00, status: 'delivered', tab: 'submitted',
        items: [
          { id: 'p-pkr-1', partNum: 'PAR-D1VW-4A', description: 'Directional Control Valve', vendor: 'Parker', price: 110.00, qty: 1, oemOnly: false },
          { id: 'p-pkr-2', partNum: 'PAR-VEP-018', description: 'Valve End Plate Seal', vendor: 'Parker', price: 35.00, qty: 1, oemOnly: false },
        ]
      },
      { id: 'ord-4', poNum: 'PO-7801', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 12, 2026', user: 'James W.', name: 'Pump seal kit ×2', wo: 'WO #100094', asset: 'FL-094', amount: 212.00, status: 'backordered', tab: 'submitted',
        items: [
          { id: 'p-skj-4', partNum: 'SKJ-105-5255', description: 'Gear Pump Seal Kit', vendor: 'Skyjack', price: 106.00, qty: 2, oemOnly: true },
        ]
      },
      { id: 'ord-5', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 10, 2026', user: 'R. Singh', name: 'Safety equipment restock', wo: 'General', asset: 'Austin', amount: 330.75, status: 'review', tab: 'review',
        items: [
          { id: 'p-sft-1', partNum: 'GRG-6LM49', description: 'Safety Harness Class III', vendor: 'Grainger', price: 89.00, qty: 2, oemOnly: false },
          { id: 'p-sft-2', partNum: 'GRG-2TLP8', description: 'Fall Arrest Lanyard 6ft', vendor: 'Grainger', price: 44.25, qty: 3, oemOnly: false },
          { id: 'p-sft-3', partNum: 'GRG-8KRN2', description: 'Hard Hat Type II Class E', vendor: 'Grainger', price: 24.00, qty: 2, oemOnly: false },
        ]
      },
      { id: 'ord-5b', poNum: null, vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 11, 2026', user: 'M. Torres', name: 'Platform parts — WO #100081', wo: 'WO #100081', asset: 'FL-088', amount: 487.50, status: 'review', tab: 'review',
        items: [
          { id: 'p-skj-5', partNum: 'SKJ-158-0055', description: 'Platform Extension Slide Kit', vendor: 'Skyjack', price: 215.00, qty: 1, oemOnly: true },
          { id: 'p-skj-6', partNum: 'SKJ-702-0900', description: 'Cylinder Wiper Seal', vendor: 'Skyjack', price: 28.50, qty: 3, oemOnly: true },
          { id: 'p-skj-7', partNum: 'SKJ-105-5310', description: 'Hydraulic Gear Pump', vendor: 'Skyjack', price: 158.00, qty: 1, oemOnly: false },
        ]
      },
      { id: 'ord-6', poNum: 'PO-7789', vendor: 'Parker', vendorId: 'PKR-WD', date: 'Jun 8, 2026', user: 'James W.', name: 'Aftermarket valve PAR-88821', wo: 'WO #100094', asset: 'FL-094', amount: 89.00, status: 'submitted', tab: 'submitted',
        items: [
          { id: 'p-pkr-3', partNum: 'PAR-88821', description: 'Relief Valve 3000 PSI', vendor: 'Parker', price: 89.00, qty: 1, oemOnly: false },
        ]
      },
      { id: 'ord-7', poNum: 'PO-7755', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'Jun 5, 2026', user: 'M. Torres', name: 'Hydraulic hose assembly', wo: 'WO #100081', asset: 'FL-088', amount: 174.00, status: 'delivered', tab: 'submitted',
        items: [
          { id: 'p-skj-8', partNum: 'SKJ-702-1104', description: 'Hydraulic Hose 3/8" × 48"', vendor: 'Skyjack', price: 58.00, qty: 2, oemOnly: false },
          { id: 'p-skj-9', partNum: 'SKJ-702-1108', description: 'JIC Fitting Kit', vendor: 'Skyjack', price: 29.00, qty: 2, oemOnly: false },
        ]
      },
      { id: 'ord-8', poNum: null, vendor: 'Grainger', vendorId: 'GRG-001', date: 'Jun 2, 2026', user: 'R. Singh', name: 'Oil & lubrication kits', wo: 'General', asset: 'Austin', amount: 58.20, status: 'saved', tab: 'drafts',
        items: [
          { id: 'p-lub-1', partNum: 'GRG-5MT22', description: 'Hydraulic Oil AW46 1-gal', vendor: 'Grainger', price: 19.40, qty: 2, oemOnly: false },
          { id: 'p-lub-2', partNum: 'GRG-3KLP6', description: 'Multi-Purpose Grease 14oz', vendor: 'Grainger', price: 9.70, qty: 2, oemOnly: false },
        ]
      },
      { id: 'ord-9', poNum: 'PO-7720', vendor: 'Skyjack', vendorId: 'SKJ-DIST', date: 'May 29, 2026', user: 'James W.', name: 'Drive motor brush kit', wo: 'WO #100074', asset: 'FL-077', amount: 122.00, status: 'delivered', tab: 'submitted',
        items: [
          { id: 'p-skj-10', partNum: 'SKJ-121-0047', description: 'Drive Motor Carbon Brush Kit', vendor: 'Skyjack', price: 61.00, qty: 2, oemOnly: true },
        ]
      },
      { id: 'ord-10', poNum: 'PO-7708', vendor: 'Parker', vendorId: 'PKR-WD', date: 'May 25, 2026', user: 'M. Torres', name: 'Cylinder rod seal set', wo: 'WO #100069', asset: 'FL-071', amount: 66.40, status: 'delivered', tab: 'submitted',
        items: [
          { id: 'p-pkr-4', partNum: 'PAR-SS-12-OE', description: 'Cylinder Rod Seal 1.5"', vendor: 'Parker', price: 22.80, qty: 1, oemOnly: false },
          { id: 'p-pkr-5', partNum: 'PAR-WP-12-U', description: 'Wiper Seal & U-cup Kit', vendor: 'Parker', price: 21.80, qty: 2, oemOnly: false },
        ]
      },
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
  function getWorkOrders(statusFilter, assigneeFilter) {
    let wos = _data.workOrders.filter(wo => !wo.locationId || wo.locationId === _currentLocationId);
    if (assigneeFilter) wos = wos.filter(wo => wo.assignee === assigneeFilter);
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
      externalId: '',
      locationId: _currentLocationId || 'austin',
      woType: 'equipment',
      status: 'active',
      priority: 'medium',
      dueDate: '',
      make: '',
      model: '',
      serial: '',
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

  function swapWoCartItem(woId, originalId, newPart) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return;
    const original = wo.cart.find(c => c.id === originalId);
    if (!original) return;
    const qty = original.qty || 1;
    original.replacedBy = newPart.id;
    if (!wo.cart.find(c => c.id === newPart.id)) {
      const idx = wo.cart.indexOf(original);
      wo.cart.splice(idx + 1, 0, Object.assign({}, newPart, { qty, replacesId: originalId }));
    }
    save(_data);
  }

  function setWoCartItemSource(woId, partId, source) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return;
    const item = wo.cart.find(c => c.id === partId);
    if (item) { item.selectedSource = source; item.selectedSources = source ? [source] : []; save(_data); }
  }

  function setWoCartItemSources(woId, partId, sources) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return;
    const item = wo.cart.find(c => c.id === partId);
    if (!item) return;
    item.selectedSources = sources || [];
    item.selectedSource = sources && sources.length === 1 ? sources[0] : (sources && sources.length > 1 ? sources[0] : null);
    save(_data);
  }

  function submitWoCartItems(woId, itemIds, orderMeta) {
    const wo = getWorkOrder(woId);
    if (!wo || !wo.cart) return null;
    const idSet = new Set(itemIds);
    const items = wo.cart.filter(c => idSet.has(c.id));
    if (!items.length) return null;
    const total = items.reduce((s, c) => s + c.price * (c.qty || 1), 0);
    const poNum = _nextPoNum();
    const submitted = Object.assign({
      id: 'wo-ord-' + Date.now(),
      poNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: items.map(c => Object.assign({}, c)),
      total: Math.round(total * 100) / 100,
      status: 'submitted',
    }, orderMeta || {});
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
    const replacedOriginalIds = items.filter(c => c.replacesId).map(c => c.replacesId);
    const removeSet = new Set([...itemIds, ...replacedOriginalIds]);
    wo.cart = wo.cart.filter(c => !removeSet.has(c.id));
    save(_data);
    return submitted;
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

  // --- Users ---
  const USERS = [
    {
      id: 'user-james-w',
      username: 'james.w',
      password: 'MCR-mech-01',
      displayName: 'James Whitfield',
      shortName: 'James W.',
      role: 'mechanic',
      email: 'james.w@midcountyrental.com',
      phone: '(512) 555-0182',
      defaultLocationId: 'austin',
      avatar: 'JW',
    },
  ];

  let _currentUser = null;
  try {
    const saved = localStorage.getItem('se-nexus-user');
    if (saved) _currentUser = JSON.parse(saved);
  } catch(e) {}

  function getUsers() { return USERS; }
  function authenticate(username, password) {
    const user = USERS.find(u => u.username === username && u.password === password);
    return user || null;
  }
  function setCurrentUser(user) {
    _currentUser = user;
    try { localStorage.setItem('se-nexus-user', JSON.stringify(user)); } catch(e) {}
  }
  function getCurrentUser() { return _currentUser; }
  function logout() {
    _currentUser = null;
    try { localStorage.removeItem('se-nexus-user'); } catch(e) {}
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
    swapWoCartItem, setWoCartItemSource, setWoCartItemSources, submitWoCartItems,
    addDiagnosticMessage, getDiagnosticHistory, clearDiagnosticHistory,
    getParts, getManuals,
    getUsers, authenticate, setCurrentUser, getCurrentUser, logout,
    getLocations, getCurrentLocation, setCurrentLocation,
    getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount,
    reset,
  };
})();

window.Store = Store;
