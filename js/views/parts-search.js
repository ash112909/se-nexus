function render_parts_search(el) {
  const _woId = Router.context && Router.context.woId;
  const _wo = _woId ? Store.getWorkOrder(_woId) : null;
  const _ctxSupplierId = Router.context && Router.context.supplierId;

  const CATALOG = [
    { id:'SKJ', name:'Skyjack', icon:'ti-crane', models:[
      { id:'SKJ-SJIII3219', name:'SJIII 3219', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Lift Cylinder Assembly', partIds:['SKJ-104210','SKJ-103100','SKJ-103445','SKJ-103512'] },
          { name:'Pressure & Control',     partIds:['SKJ-103278','SKJ-103601','PAR-CV-2201','SKJ-CHK-302','SKJ-SOL-301'] },
          { name:'Hydraulic Pump',         partIds:['SKJ-HYD-200','SKJ-HYD-201','SKJ-107732'] },
          { name:'Fluid & Filters',        partIds:['SKJ-HF046-1G','SKJ-HF068-1G','SKJ-104880','PAR-88821'] },
          { name:'Manifold & Valves',      partIds:['SKJ-MAN-300','SKJ-SOL-301','SKJ-CHK-302'] },
        ]},
        { name:'Drive System', icon:'ti-settings', subs:[
          { name:'Drive Motors',           partIds:['SKJ-MTR-400'] },
          { name:'Hubs & Wheels',          partIds:['SKJ-HUB-401','SKJ-TIR-402'] },
        ]},
        { name:'Electrical System', icon:'ti-bolt', subs:[
          { name:'Power Supply',           partIds:['SKJ-BAT-500','SKJ-CHR-501'] },
          { name:'Controls & Sensors',     partIds:['SKJ-CTL-502','SKJ-JOY-503','SKJ-LIM-504'] },
        ]},
        { name:'Structure & Platform', icon:'ti-box', subs:[
          { name:'Scissor Arms',           partIds:['SKJ-PIN-600','SKJ-PAD-601'] },
          { name:'Engine & Filtration',    partIds:['SKJ-110044'] },
        ]},
      ]},
      { id:'SKJ-SJIII4632', name:'SJIII 4632', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Lift Cylinder Assembly', partIds:['SKJ-4632-CYL','SKJ-4632-SEA','SKJ-103445','SKJ-103512'] },
          { name:'Pump & Controls',        partIds:['SKJ-HYD-200','SKJ-HYD-201','SKJ-MAN-300','SKJ-SOL-301','SKJ-CHK-302'] },
          { name:'Fluid & Filters',        partIds:['SKJ-HF046-1G','SKJ-HF068-1G','SKJ-104880'] },
        ]},
        { name:'Drive System', icon:'ti-settings', subs:[
          { name:'Drive Motors',           partIds:['SKJ-4632-MTR','SKJ-MTR-400'] },
          { name:'Hubs & Wheels',          partIds:['SKJ-HUB-401','SKJ-TIR-402'] },
        ]},
        { name:'Electrical System', icon:'ti-bolt', subs:[
          { name:'Power Supply',           partIds:['SKJ-BAT-500','SKJ-CHR-501'] },
          { name:'Controls',               partIds:['SKJ-CTL-502','SKJ-JOY-503','SKJ-LIM-504'] },
        ]},
        { name:'Structure', icon:'ti-box', subs:[
          { name:'Arm Pins & Pads',        partIds:['SKJ-PIN-600','SKJ-PAD-601'] },
        ]},
      ]},
      { id:'SKJ-SJ45T', name:'SJ45T Boom Lift', components:[
        { name:'Boom & Jib', icon:'ti-crane', subs:[
          { name:'Jib Cylinder',           partIds:['SKJ-SJ45-JIB','SKJ-103445'] },
          { name:'Slewing Ring',           partIds:['SKJ-SJ45-SLW'] },
          { name:'Rotary Joint',           partIds:['SKJ-SJ45-ROT'] },
        ]},
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Pump & Control',         partIds:['SKJ-HYD-200','SKJ-HYD-201','SKJ-MAN-300','SKJ-SOL-301','SKJ-CHK-302'] },
          { name:'Fluid & Filters',        partIds:['SKJ-HF046-1G','SKJ-104880','PAR-88821'] },
        ]},
        { name:'Drive System', icon:'ti-settings', subs:[
          { name:'Drive Motors',           partIds:['SKJ-MTR-400'] },
          { name:'Hubs & Tires',           partIds:['SKJ-HUB-401','SKJ-TIR-402'] },
        ]},
        { name:'Electrical', icon:'ti-bolt', subs:[
          { name:'Controls',               partIds:['SKJ-CTL-502','SKJ-JOY-503','SKJ-LIM-504'] },
          { name:'Power Supply',           partIds:['SKJ-BAT-500','SKJ-CHR-501'] },
        ]},
      ]},
    ]},
    { id:'CAT', name:'Caterpillar', icon:'ti-backhoe', models:[
      { id:'CAT-320', name:'320 Excavator', components:[
        { name:'Track System', icon:'ti-settings', subs:[
          { name:'Sprocket & Chain',       partIds:['CAT-SPR-7301','CAT-TRK-7050'] },
          { name:'Rollers',                partIds:['CAT-ROL-7302','CAT-ROL-7303'] },
          { name:'Front Idler',            partIds:['CAT-IDL-7304','CAT-TRK-7201'] },
        ]},
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Main Pump',              partIds:['CAT-PMP-8001'] },
          { name:'Swing Motor',            partIds:['CAT-MTR-8002'] },
          { name:'Control Valve',          partIds:['CAT-VLV-8004'] },
          { name:'Boom Cylinders',         partIds:['CAT-CYL-8005'] },
        ]},
        { name:'Engine', icon:'ti-engine', subs:[
          { name:'Filtration',             partIds:['CAT-1R0716','CAT-1R0750','CAT-093-7521'] },
          { name:'Cooling System',         partIds:['CAT-BLT-9001','CAT-THR-9003','CAT-WTP-9004'] },
        ]},
      ]},
      { id:'CAT-308', name:'308 Mini Excavator', components:[
        { name:'Track System', icon:'ti-settings', subs:[
          { name:'Track Links',            partIds:['CAT-308-TRK','CAT-TRK-7050'] },
          { name:'Rollers',                partIds:['CAT-308-ROL','CAT-ROL-7303'] },
          { name:'Idler',                  partIds:['CAT-308-IDL'] },
        ]},
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Main Pump',              partIds:['CAT-308-PMP'] },
          { name:'Control Valve',          partIds:['CAT-VLV-8004'] },
          { name:'Cylinder Seals',         partIds:['CAT-CYL-8005'] },
        ]},
        { name:'Engine', icon:'ti-engine', subs:[
          { name:'Filtration',             partIds:['CAT-1R0716','CAT-093-7521'] },
          { name:'Cooling',                partIds:['CAT-THR-9003','CAT-WTP-9004'] },
        ]},
      ]},
    ]},
    { id:'TOY', name:'Toyota', icon:'ti-forklift', models:[
      { id:'TOY-8FGU25', name:'8FGU25 Forklift', components:[
        { name:'Lift System', icon:'ti-crane', subs:[
          { name:'Mast & Chain',           partIds:['TOY-MCH-114','TOY-PUL-202'] },
          { name:'Lift Cylinder',          partIds:['TOY-LFT-088','TOY-TLT-203'] },
          { name:'Pump & Valve',           partIds:['TOY-PMP-204','TOY-VLV-205'] },
        ]},
        { name:'Carriage & Forks', icon:'ti-forklift', subs:[
          { name:'Carriage Assembly',      partIds:['TOY-CRG-200'] },
          { name:'Fork Assembly',          partIds:['TOY-FRK-201'] },
        ]},
        { name:'Drive System', icon:'ti-settings', subs:[
          { name:'Transmission',           partIds:['TOY-TRN-302'] },
          { name:'Brakes',                 partIds:['TOY-BRK-301'] },
        ]},
      ]},
      { id:'TOY-8FGU32', name:'8FGU32 Forklift', components:[
        { name:'Lift System', icon:'ti-crane', subs:[
          { name:'Lift Cylinder',          partIds:['TOY-32-CYL','TOY-32-SEA','TOY-TLT-203'] },
          { name:'Mast & Chain',           partIds:['TOY-MCH-114','TOY-PUL-202'] },
          { name:'Pump & Valve',           partIds:['TOY-PMP-204','TOY-VLV-205'] },
        ]},
        { name:'Carriage & Forks', icon:'ti-forklift', subs:[
          { name:'Carriage Assembly',      partIds:['TOY-CRG-200'] },
          { name:'Fork Assembly',          partIds:['TOY-FRK-201'] },
        ]},
        { name:'Drive System', icon:'ti-settings', subs:[
          { name:'Transmission',           partIds:['TOY-TRN-302'] },
          { name:'Brakes',                 partIds:['TOY-BRK-301'] },
        ]},
      ]},
    ]},
    { id:'BOB', name:'Bobcat', icon:'ti-bulldozer', models:[
      { id:'BOB-S650', name:'S650 Skid-Steer', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Main Pump',              partIds:['BOB-PMP-400'] },
          { name:'Loader Valve',           partIds:['BOB-VLV-401'] },
          { name:'Drive Motor',            partIds:['BOB-MTR-402'] },
          { name:'Quick Coupler',          partIds:['BOB-QC-520'] },
          { name:'Hydraulic Lines',        partIds:['BOB-HYD-310'] },
        ]},
        { name:'Drive Train', icon:'ti-settings', subs:[
          { name:'Drive Chain',            partIds:['BOB-CHN-500'] },
          { name:'Sprocket',               partIds:['BOB-SPR-501'] },
        ]},
        { name:'Electrical System', icon:'ti-bolt', subs:[
          { name:'Control System',         partIds:['BOB-CTL-601','BOB-RLY-600'] },
          { name:'Power Supply',           partIds:['BOB-BAT-602','GEN-FUSE-KIT'] },
        ]},
      ]},
      { id:'BOB-S770', name:'S770 Skid-Steer', components:[
        { name:'Hydraulic System', icon:'ti-droplet', subs:[
          { name:'Boom Cylinder',          partIds:['BOB-770-CYL','BOB-VLV-401'] },
          { name:'Main Pump',              partIds:['BOB-PMP-400'] },
          { name:'Drive Motor',            partIds:['BOB-MTR-402'] },
          { name:'Quick Coupler',          partIds:['BOB-QC-520','BOB-HYD-310'] },
        ]},
        { name:'Drive Train', icon:'ti-settings', subs:[
          { name:'Drive Chain',            partIds:['BOB-CHN-500'] },
          { name:'Sprocket',               partIds:['BOB-SPR-501'] },
        ]},
        { name:'Electrical System', icon:'ti-bolt', subs:[
          { name:'Controls',               partIds:['BOB-CTL-601','BOB-RLY-600','BOB-BAT-602'] },
        ]},
      ]},
    ]},
  ];

  const EQUIPMENT = [
    { asset:'FL-094', serial:'SJ3219-00847',    supplierId:'SKJ', modelId:'SKJ-SJIII3219' },
    { asset:'FL-022', serial:'SJ4632-01124',    supplierId:'SKJ', modelId:'SKJ-SJIII4632' },
    { asset:'FL-047', serial:'SJ45T-00284',     supplierId:'SKJ', modelId:'SKJ-SJ45T' },
    { asset:'FL-017', serial:'CAT320-DKB00847', supplierId:'CAT', modelId:'CAT-320' },
    { asset:'FL-072', serial:'CAT308-KAB00234', supplierId:'CAT', modelId:'CAT-308' },
    { asset:'FL-031', serial:'TOY8FGU-00391',   supplierId:'TOY', modelId:'TOY-8FGU25' },
    { asset:'FL-058', serial:'TOY8FGU32-00512', supplierId:'TOY', modelId:'TOY-8FGU32' },
    { asset:'FL-008', serial:'BOB-S650-00712',  supplierId:'BOB', modelId:'BOB-S650' },
    { asset:'FL-033', serial:'BOB-S770-00891',  supplierId:'BOB', modelId:'BOB-S770' },
  ];

  const PART_META = {
    'SKJ-104210': { weight:'4.8 kg', dims:'Ø62 × 280 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'7.3', page:'124'},
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'7.1', page:'136'},
    ]},
    'SKJ-103100': { weight:'0.9 kg', dims:'Ø62 seal kit', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'7.3', page:'126'},
    ]},
    'SKJ-103445': { weight:'1.2 kg', dims:'Ø32 × 148 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'7.4', page:'131'},
      {manId:'man-20', title:'SJ45T Boom Lift Service Manual',       section:'10.4', page:'218'},
    ]},
    'SKJ-103512': { weight:'1.5 kg', dims:'Ø38 × 172 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'7.4', page:'131'},
    ]},
    'SKJ-103278': { weight:'0.7 kg', dims:'65 × 44 × 38 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'8.2', page:'145'},
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'8.2', page:'148'},
    ]},
    'SKJ-103601': { weight:'0.5 kg', dims:'52 × 38 × 28 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'8.2', page:'146'},
    ]},
    'SKJ-HYD-200': { weight:'3.4 kg', dims:'Ø88 × 142 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'6.1', page:'98'},
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'6.1', page:'102'},
    ]},
    'SKJ-HYD-201': { weight:'0.3 kg', dims:'Ø88 seal kit', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'6.1', page:'99'},
    ]},
    'SKJ-MAN-300': { weight:'2.8 kg', dims:'180 × 120 × 88 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'8.5', page:'162'},
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'8.5', page:'165'},
    ]},
    'SKJ-SOL-301': { weight:'0.4 kg', dims:'Ø32 × 78 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'8.6', page:'164'},
    ]},
    'SKJ-CHK-302': { weight:'0.2 kg', dims:'Ø16 × 44 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'8.6', page:'165'},
    ]},
    'SKJ-MTR-400': { weight:'8.2 kg', dims:'Ø148 × 188 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'9.1', page:'178'},
      {manId:'man-19', title:'SJIII 3219 Drive System Manual',       section:'3.2', page:'44'},
    ]},
    'SKJ-HUB-401': { weight:'4.1 kg', dims:'Ø168 × 82 mm', manualRefs:[
      {manId:'man-19', title:'SJIII 3219 Drive System Manual',       section:'3.4', page:'51'},
    ]},
    'SKJ-TIR-402': { weight:'12.4 kg', dims:'Ø406 × 152 mm', manualRefs:[
      {manId:'man-19', title:'SJIII 3219 Drive System Manual',       section:'3.5', page:'54'},
    ]},
    'SKJ-BAT-500': { weight:'34.2 kg', dims:'522 × 238 × 218 mm', manualRefs:[
      {manId:'man-12', title:'SJIII 3219 Electrical System Manual',  section:'4.1', page:'68'},
    ]},
    'SKJ-CHR-501': { weight:'6.8 kg', dims:'340 × 188 × 112 mm', manualRefs:[
      {manId:'man-12', title:'SJIII 3219 Electrical System Manual',  section:'4.3', page:'74'},
    ]},
    'SKJ-CTL-502': { weight:'2.1 kg', dims:'224 × 148 × 64 mm', manualRefs:[
      {manId:'man-12', title:'SJIII 3219 Electrical System Manual',  section:'5.1', page:'88'},
    ]},
    'SKJ-JOY-503': { weight:'0.8 kg', dims:'88 × 64 × 188 mm', manualRefs:[
      {manId:'man-12', title:'SJIII 3219 Electrical System Manual',  section:'5.4', page:'96'},
    ]},
    'SKJ-LIM-504': { weight:'0.1 kg', dims:'42 × 28 × 18 mm', manualRefs:[
      {manId:'man-12', title:'SJIII 3219 Electrical System Manual',  section:'5.6', page:'102'},
    ]},
    'SKJ-PIN-600': { weight:'0.3 kg', dims:'Ø22 × 92 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'12.1', page:'212'},
    ]},
    'SKJ-PAD-601': { weight:'0.1 kg', dims:'88 × 28 × 8 mm', manualRefs:[
      {manId:'man-1',  title:'SJIII 3219 Service Manual',           section:'12.1', page:'213'},
    ]},
    'SKJ-4632-CYL': { weight:'7.2 kg', dims:'Ø76 × 340 mm', manualRefs:[
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'7.3', page:'138'},
    ]},
    'SKJ-4632-SEA': { weight:'0.4 kg', dims:'Ø76 seal kit', manualRefs:[
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'7.3', page:'140'},
    ]},
    'SKJ-4632-MTR': { weight:'9.4 kg', dims:'Ø158 × 202 mm', manualRefs:[
      {manId:'man-11', title:'SJIII 4632 Service Manual',           section:'9.1', page:'192'},
    ]},
    'SKJ-SJ45-JIB': { weight:'9.8 kg', dims:'Ø88 × 420 mm', manualRefs:[
      {manId:'man-20', title:'SJ45T Boom Lift Service Manual',       section:'10.2', page:'211'},
    ]},
    'SKJ-SJ45-SLW': { weight:'28.4 kg', dims:'Ø548 × 68 mm', manualRefs:[
      {manId:'man-20', title:'SJ45T Boom Lift Service Manual',       section:'11.1', page:'228'},
    ]},
    'SKJ-SJ45-ROT': { weight:'4.2 kg', dims:'Ø82 × 128 mm', manualRefs:[
      {manId:'man-20', title:'SJ45T Boom Lift Service Manual',       section:'11.3', page:'234'},
    ]},
    'CAT-PMP-8001': { weight:'38.6 kg', dims:'348 × 288 × 224 mm', manualRefs:[
      {manId:'man-13', title:'Cat 320 Hydraulic System Manual',      section:'3.1', page:'48'},
    ]},
    'CAT-MTR-8002': { weight:'24.8 kg', dims:'Ø248 × 312 mm', manualRefs:[
      {manId:'man-13', title:'Cat 320 Hydraulic System Manual',      section:'4.2', page:'88'},
    ]},
    'CAT-VLV-8004': { weight:'18.2 kg', dims:'288 × 188 × 148 mm', manualRefs:[
      {manId:'man-13', title:'Cat 320 Hydraulic System Manual',      section:'5.1', page:'112'},
    ]},
    'CAT-CYL-8005': { weight:'0.6 kg', dims:'Boom cyl. seal kit', manualRefs:[
      {manId:'man-13', title:'Cat 320 Hydraulic System Manual',      section:'6.4', page:'148'},
    ]},
    'CAT-SPR-7301': { weight:'22.4 kg', dims:'Ø488 × 148 mm', manualRefs:[
      {manId:'man-21', title:'Cat 320 Engine Service Manual C7.1',   section:'12.1', page:'288'},
    ]},
    'CAT-ROL-7302': { weight:'8.8 kg', dims:'Ø148 × 188 mm', manualRefs:[
      {manId:'man-21', title:'Cat 320 Engine Service Manual C7.1',   section:'12.2', page:'292'},
    ]},
    'CAT-ROL-7303': { weight:'6.4 kg', dims:'Ø128 × 148 mm', manualRefs:[
      {manId:'man-21', title:'Cat 320 Engine Service Manual C7.1',   section:'12.3', page:'296'},
    ]},
    'CAT-IDL-7304': { weight:'44.2 kg', dims:'Ø388 × 188 mm', manualRefs:[
      {manId:'man-21', title:'Cat 320 Engine Service Manual C7.1',   section:'12.4', page:'301'},
    ]},
    'CAT-308-TRK': { weight:'2.8 kg', dims:'128 × 88 × 28 mm', manualRefs:[
      {manId:'man-14', title:'Cat 308 Service Manual',               section:'12.1', page:'248'},
    ]},
    'CAT-308-ROL': { weight:'4.4 kg', dims:'Ø102 × 128 mm', manualRefs:[
      {manId:'man-14', title:'Cat 308 Service Manual',               section:'12.2', page:'252'},
    ]},
    'CAT-308-IDL': { weight:'18.8 kg', dims:'Ø268 × 148 mm', manualRefs:[
      {manId:'man-14', title:'Cat 308 Service Manual',               section:'12.4', page:'261'},
    ]},
    'CAT-308-PMP': { weight:'14.2 kg', dims:'228 × 188 × 148 mm', manualRefs:[
      {manId:'man-14', title:'Cat 308 Service Manual',               section:'3.1', page:'54'},
    ]},
    'TOY-MCH-114': { weight:'2.4 kg', dims:'FL-3 × 1200 mm', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'11.1', page:'188'},
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'8.2', page:'148'},
    ]},
    'TOY-LFT-088': { weight:'8.8 kg', dims:'Ø64 × 448 mm', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'10.3', page:'172'},
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'7.1', page:'122'},
    ]},
    'TOY-CRG-200': { weight:'64.8 kg', dims:'1220 × 488 × 188 mm', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'5.1', page:'84'},
    ]},
    'TOY-FRK-201': { weight:'88.4 kg', dims:'1220 × 152 × 48 mm', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'5.2', page:'88'},
    ]},
    'TOY-PUL-202': { weight:'1.2 kg', dims:'Ø88 × 38 mm', manualRefs:[
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'8.4', page:'154'},
    ]},
    'TOY-TLT-203': { weight:'0.3 kg', dims:'Ø42 seal kit', manualRefs:[
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'7.3', page:'128'},
    ]},
    'TOY-PMP-204': { weight:'4.8 kg', dims:'Ø78 × 128 mm', manualRefs:[
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'3.1', page:'44'},
    ]},
    'TOY-VLV-205': { weight:'3.4 kg', dims:'188 × 128 × 88 mm', manualRefs:[
      {manId:'man-15', title:'Toyota 8FGU25 Hydraulic System Manual', section:'4.2', page:'68'},
    ]},
    'TOY-BRK-301': { weight:'1.8 kg', dims:'268 × 88 × 18 mm (set)', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'15.2', page:'244'},
    ]},
    'TOY-TRN-302': { weight:'0.6 kg', dims:'Ø248 seal kit', manualRefs:[
      {manId:'man-3',  title:'Toyota 8FGU25 Parts Catalog',          section:'14.1', page:'228'},
    ]},
    'TOY-32-CYL': { weight:'11.2 kg', dims:'Ø72 × 512 mm', manualRefs:[
      {manId:'man-16', title:'Toyota 8FGU32 Parts Catalog',          section:'10.3', page:'188'},
    ]},
    'TOY-32-SEA': { weight:'0.4 kg', dims:'Ø72 seal kit', manualRefs:[
      {manId:'man-16', title:'Toyota 8FGU32 Parts Catalog',          section:'10.3', page:'190'},
    ]},
    'BOB-PMP-400': { weight:'12.8 kg', dims:'248 × 188 × 148 mm', manualRefs:[
      {manId:'man-17', title:'Bobcat S650 Hydraulic System Manual',   section:'3.1', page:'52'},
      {manId:'man-22', title:'Bobcat S650/S770 Drive System Manual',  section:'2.1', page:'28'},
    ]},
    'BOB-VLV-401': { weight:'8.4 kg', dims:'248 × 168 × 128 mm', manualRefs:[
      {manId:'man-17', title:'Bobcat S650 Hydraulic System Manual',   section:'4.1', page:'78'},
    ]},
    'BOB-MTR-402': { weight:'14.2 kg', dims:'Ø168 × 224 mm', manualRefs:[
      {manId:'man-17', title:'Bobcat S650 Hydraulic System Manual',   section:'5.2', page:'102'},
      {manId:'man-22', title:'Bobcat S650/S770 Drive System Manual',  section:'3.2', page:'48'},
    ]},
    'BOB-CHN-500': { weight:'0.8 kg', dims:'Ø12.7 × 1 m (per unit)', manualRefs:[
      {manId:'man-22', title:'Bobcat S650/S770 Drive System Manual',  section:'4.1', page:'64'},
    ]},
    'BOB-SPR-501': { weight:'3.8 kg', dims:'Ø188 × 48 mm', manualRefs:[
      {manId:'man-22', title:'Bobcat S650/S770 Drive System Manual',  section:'4.2', page:'68'},
    ]},
    'BOB-CTL-601': { weight:'1.4 kg', dims:'128 × 88 × 68 mm', manualRefs:[
      {manId:'man-18', title:'Bobcat S770 Service Manual',            section:'6.1', page:'118'},
    ]},
    'BOB-RLY-600': { weight:'0.3 kg', dims:'Relay kit (8 pcs)', manualRefs:[
      {manId:'man-17', title:'Bobcat S650 Hydraulic System Manual',   section:'7.1', page:'142'},
    ]},
    'BOB-BAT-602': { weight:'18.4 kg', dims:'348 × 168 × 178 mm', manualRefs:[
      {manId:'man-18', title:'Bobcat S770 Service Manual',            section:'7.2', page:'152'},
    ]},
    'BOB-770-CYL': { weight:'0.5 kg', dims:'Ø88 seal kit', manualRefs:[
      {manId:'man-18', title:'Bobcat S770 Service Manual',            section:'10.3', page:'212'},
    ]},
  };

  // ── SVG diagram helpers ───────────────────────────────────────────────────
  const DW=580, DH=400;
  function svgOpen() { return `<svg width="${DW}" height="${DH}" viewBox="0 0 ${DW} ${DH}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hatch45" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#B0AAA3" stroke-width="0.7"/>
      </pattern>
      <pattern id="hatch135" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(135)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#C8C3BC" stroke-width="0.6"/>
      </pattern>
      <marker id="arr" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 5 2, 0 4" fill="#5A5F6E"/></marker>
      <marker id="arrL" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto"><polygon points="5 0, 0 2, 5 4" fill="#5A5F6E"/></marker>
    </defs>
    <rect width="${DW}" height="${DH}" fill="#F8F6F2"/>
    <rect x="3" y="3" width="${DW-6}" height="${DH-6}" fill="none" stroke="#8A8878" stroke-width="1.2"/>`;
  }
  function svgTB(title, dwgNo, scale) { return `
    <rect x="${DW-194}" y="${DH-58}" width="191" height="55" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <line x1="${DW-194}" y1="${DH-40}" x2="${DW-3}" y2="${DH-40}" stroke="#8A8878" stroke-width="0.5"/>
    <line x1="${DW-194}" y1="${DH-24}" x2="${DW-3}" y2="${DH-24}" stroke="#8A8878" stroke-width="0.5"/>
    <line x1="${DW-116}" y1="${DH-58}" x2="${DW-116}" y2="${DH-3}" stroke="#8A8878" stroke-width="0.5"/>
    <text x="${DW-192}" y="${DH-45}" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">${title}</text>
    <text x="${DW-192}" y="${DH-30}" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SCALE ${scale||'1:10'}</text>
    <text x="${DW-192}" y="${DH-15}" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">DATE 2026-06</text>
    <text x="${DW-114}" y="${DH-45}" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">${dwgNo}</text>
    <text x="${DW-114}" y="${DH-30}" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">REV C</text>
    <text x="${DW-114}" y="${DH-15}" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SHEET 1/1</text>`;
  }
  function dimH(x1,x2,y,label) { const yt=y-14; return `
    <line x1="${x1}" y1="${y}" x2="${x1}" y2="${yt+4}" stroke="#5A5F6E" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="${x2}" y1="${y}" x2="${x2}" y2="${yt+4}" stroke="#5A5F6E" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="${x1}" y1="${yt}" x2="${x2}" y2="${yt}" stroke="#5A5F6E" stroke-width="0.7" marker-start="url(#arrL)" marker-end="url(#arr)"/>
    <text x="${(x1+x2)/2}" y="${yt-3}" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif" text-anchor="middle">${label}</text>`; }
  function dimV(x,y1,y2,label) { const xt=x+14; return `
    <line x1="${x}" y1="${y1}" x2="${xt-4}" y2="${y1}" stroke="#5A5F6E" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="${x}" y1="${y2}" x2="${xt-4}" y2="${y2}" stroke="#5A5F6E" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="${xt}" y1="${y1}" x2="${xt}" y2="${y2}" stroke="#5A5F6E" stroke-width="0.7" marker-start="url(#arrL)" marker-end="url(#arr)"/>
    <text x="${xt+3}" y="${(y1+y2)/2+3}" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">${label}</text>`; }
  function cline(x1,y1,x2,y2) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8A8878" stroke-width="0.6" stroke-dasharray="8,3,2,3"/>`; }
  function leader(x1,y1,x2,y2,ref) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6A6F7E" stroke-width="0.75"/>
    <circle cx="${x2}" cy="${y2}" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="${x2}" y="${y2+3}" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">${ref}</text>`; }

  // ── Diagrams ──────────────────────────────────────────────────────────────
  const DIAGRAMS = {

    // ── SKJ SJIII 3219 — Hydraulic System ─────────────────────────────────
    'SKJ-SJIII3219~Hydraulic System': [
      { id:'hyd-circuit', title:'Hydraulic Circuit Schematic (ISO)',
        hotspots:[
          {sub:'Lift Cylinder Assembly', partId:'SKJ-104210', x:58, y:28, ref:1},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103100', x:58, y:40, ref:2},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103445', x:52, y:52, ref:3},
          {sub:'Pressure & Control',     partId:'SKJ-103278', x:32, y:58, ref:4},
          {sub:'Pressure & Control',     partId:'SKJ-SOL-301', x:22, y:46, ref:5},
          {sub:'Pressure & Control',     partId:'SKJ-CHK-302', x:22, y:58, ref:6},
          {sub:'Hydraulic Pump',         partId:'SKJ-HYD-200', x:22, y:74, ref:7},
          {sub:'Manifold & Valves',      partId:'SKJ-MAN-300', x:38, y:46, ref:8},
        ],
        svgFn: ()=> svgOpen() + `
    <!-- ISO Hydraulic Circuit Schematic -->
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Hydraulic Circuit Schematic</text>
    <!-- Hydraulic tank (bottom) -->
    <rect x="72" y="298" width="44" height="28" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="72" y1="326" x2="116" y2="326" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="72" y1="298" x2="116" y2="298" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="83" y="342" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Return filter -->
    <rect x="84" y="260" width="20" height="20" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2" transform="rotate(45 94 270)"/>
    <text x="108" y="274" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Filter</text>
    <!-- Pump (circle with arrow) -->
    <circle cx="94" cy="228" r="18" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.5"/>
    <polygon points="86,228 102,220 102,236" fill="#3A3D4A"/>
    <text x="116" y="232" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ⑦</text>
    <!-- Pump suction line -->
    <line x1="94" y1="246" x2="94" y2="260" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="94" y1="270" x2="94" y2="298" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Pump pressure line up -->
    <line x1="94" y1="210" x2="94" y2="188" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Manifold block -->
    <rect x="62" y="148" width="128" height="44" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="90" y="168" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">MANIFOLD BLOCK ⑧</text>
    <text x="78" y="182" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-MAN-300 / 180×120×88mm</text>
    <!-- Solenoid valve left -->
    <rect x="62" y="148" width="26" height="44" fill="none" stroke="#5A5F6E" stroke-width="0.75"/>
    <text x="64" y="162" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">SOL⑤</text>
    <!-- Check valve -->
    <rect x="88" y="148" width="22" height="44" fill="none" stroke="#5A5F6E" stroke-width="0.75"/>
    <text x="89" y="162" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">CHK⑥</text>
    <!-- Relief valve -->
    <rect x="140" y="148" width="26" height="44" fill="none" stroke="#5A5F6E" stroke-width="0.75"/>
    <text x="142" y="162" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">RV④</text>
    <!-- Relief valve spring symbol -->
    <path d="M149 172 q3-3 6 0 q3 3 6 0" stroke="#3A3D4A" stroke-width="0.8" fill="none"/>
    <!-- Main pressure line up from manifold -->
    <line x1="94" y1="148" x2="94" y2="188" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Line to cylinder -->
    <line x1="126" y1="130" x2="126" y2="148" stroke="#3A3D4A" stroke-width="2"/>
    <line x1="94" y1="130" x2="280" y2="130" stroke="#3A3D4A" stroke-width="2"/>
    <line x1="280" y1="130" x2="280" y2="88" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Lift cylinder (ISO symbol) -->
    <rect x="260" y="48" width="40" height="88" rx="3" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="268" y="52" width="24" height="36" fill="url(#hatch45)" stroke="#8A8878" stroke-width="0.5" opacity="0.7"/>
    <rect x="268" y="52" width="24" height="36" fill="none" stroke="#5A5F6E" stroke-width="0.75"/>
    <!-- Piston -->
    <rect x="264" y="92" width="32" height="10" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Piston rod -->
    <rect x="275" y="102" width="10" height="34" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="308" y="78" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">CYL ①</text>
    <text x="308" y="90" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-104210</text>
    <!-- Seal callout -->
    <line x1="292" y1="102" x2="340" y2="108" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="349" cy="108" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="349" y="111" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">2</text>
    <text x="362" y="112" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Seal kit</text>
    <!-- Rod end callout -->
    <line x1="280" y1="136" x2="338" y2="148" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="347" cy="148" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="347" y="151" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">3</text>
    <text x="360" y="152" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Rod end</text>
    <!-- Port A label -->
    <text x="246" y="96" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port A</text>
    <text x="236" y="106" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">2500–2800 PSI</text>
    <!-- Tank return line -->
    <line x1="72" y1="180" x2="62" y2="180" stroke="#5A5F6E" stroke-width="1.2" stroke-dasharray="4,2"/>
    <line x1="62" y1="180" x2="62" y2="312" stroke="#5A5F6E" stroke-width="1.2" stroke-dasharray="4,2"/>
    <line x1="62" y1="312" x2="72" y2="312" stroke="#5A5F6E" stroke-width="1.2" stroke-dasharray="4,2"/>
    <text x="32" y="184" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Return</text>
    <!-- Notes box -->
    <rect x="6" y="320" width="186" height="58" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="332" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="344" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Max system pressure: 3,000 PSI (207 bar)</text>
    <text x="10" y="355" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Hydraulic fluid: ISO VG 46 AW</text>
    <text x="10" y="366" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Filter: replace every 500 hrs or annually</text>
    <text x="10" y="377" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Torque pump coupling bolts 28 N·m</text>
    ` + svgTB('Hyd. Circuit Schematic','SKJ-3219-HYD-001','1:1') + `</svg>`
      },
      { id:'cyl-xsection', title:'Lift Cylinder Cross-Section A–A',
        hotspots:[
          {sub:'Lift Cylinder Assembly', partId:'SKJ-104210', x:40, y:38, ref:1},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103100', x:58, y:52, ref:2},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103445', x:72, y:44, ref:3},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103512', x:28, y:56, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Lift Cylinder Cross-Section A–A</text>
    <!-- Section cut line A-A -->
    <line x1="18" y1="228" x2="388" y2="228" stroke="#3A3D4A" stroke-width="0.8" stroke-dasharray="12,4,2,4"/>
    <text x="6" y="232" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">A</text>
    <text x="390" y="232" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">A</text>
    <!-- Cylinder barrel outer -->
    <rect x="112" y="68" width="156" height="248" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Cylinder barrel hatching -->
    <rect x="112" y="68" width="22" height="248" fill="url(#hatch45)" stroke="none" opacity="0.8"/>
    <rect x="246" y="68" width="22" height="248" fill="url(#hatch45)" stroke="none" opacity="0.8"/>
    <!-- Cylinder bore -->
    <rect x="134" y="68" width="112" height="248" fill="#F8F8F4" stroke="none"/>
    <!-- Port A top -->
    <rect x="100" y="80" width="14" height="28" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="72" y="94" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">Port A →</text>
    <text x="60" y="104" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">2500–2800 PSI</text>
    <!-- Port B bottom -->
    <rect x="266" y="208" width="14" height="28" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="284" y="222" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">← Port B</text>
    <!-- Piston with seals -->
    <rect x="134" y="198" width="112" height="38" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="134" y="198" width="112" height="6" fill="url(#hatch45)" opacity="0.6"/>
    <rect x="134" y="230" width="112" height="6" fill="url(#hatch45)" opacity="0.6"/>
    <!-- O-rings on piston -->
    <ellipse cx="162" cy="217" rx="4" ry="2" fill="#1A1200" opacity="0.6"/>
    <ellipse cx="218" cy="217" rx="4" ry="2" fill="#1A1200" opacity="0.6"/>
    <line x1="162" y1="215" x2="162" y2="222" stroke="#1A1200" stroke-width="0.5" opacity="0.5"/>
    <line x1="218" y1="215" x2="218" y2="222" stroke="#1A1200" stroke-width="0.5" opacity="0.5"/>
    <!-- Seal callout 2 -->
    <line x1="220" y1="217" x2="298" y2="208" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="307" cy="208" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="307" y="211" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">2</text>
    <!-- Piston rod -->
    <rect x="172" y="236" width="36" height="148" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="172" y="236" width="6" height="148" fill="url(#hatch135)" opacity="0.5"/>
    <!-- Rod end (clevis) -->
    <rect x="158" y="316" width="64" height="28" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.5"/>
    <circle cx="190" cy="330" r="9" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <circle cx="190" cy="330" r="3" fill="#3A3D4A"/>
    <!-- Rod end callout 3 -->
    <line x1="222" y1="330" x2="298" y2="322" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="307" cy="322" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="307" y="325" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">3</text>
    <!-- Base end cap -->
    <rect x="112" y="68" width="156" height="28" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="112" y="68" width="156" height="28" fill="url(#hatch45)" opacity="0.5"/>
    <circle cx="190" cy="82" r="9" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <circle cx="190" cy="82" r="3" fill="#3A3D4A"/>
    <!-- Base end callout 4 -->
    <line x1="112" y1="82" x2="72" y2="78" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="63" cy="78" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="63" y="81" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">4</text>
    <!-- Cylinder barrel callout 1 -->
    <line x1="112" y1="160" x2="72" y2="148" stroke="#9CA3AF" stroke-width="0.75"/>
    <circle cx="63" cy="148" r="9" fill="#FFF" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="63" y="151" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700" text-anchor="middle">1</text>
    <!-- Gland nut at top of rod -->
    <rect x="158" y="292" width="64" height="18" fill="#BFBAB4" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="158" y="292" width="64" height="18" fill="url(#hatch45)" opacity="0.4"/>
    <text x="330" y="298" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Gland nut</text>
    <line x1="222" y1="298" x2="328" y2="294" stroke="#B0AAA3" stroke-width="0.6" stroke-dasharray="3,2"/>
    <!-- Dimensions -->
    ${dimH(112,268,52,'Ø62 bore')}
    ${dimV(390,68,316,'Stroke 1,220 mm')}
    ${dimH(172,208,348,'Ø36 rod')}
    <!-- Notes -->
    <rect x="6" y="318" width="180" height="62" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="330" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES — SECTION A–A</text>
    <text x="10" y="342" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Bore: Ø62 mm  Rod: Ø36 mm</text>
    <text x="10" y="353" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Replace seals at every cylinder R&amp;R</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Torque gland nut: 180 N·m</text>
    <text x="10" y="375" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Inspect for scoring before reassembly</text>
    ` + svgTB('Lift Cyl. Cross-Section','SKJ-3219-CYL-002','1:4') + `</svg>`
      },
      { id:'manifold-assy', title:'Manifold & Valve Block Assembly',
        hotspots:[
          {sub:'Manifold & Valves', partId:'SKJ-MAN-300', x:38, y:42, ref:1},
          {sub:'Manifold & Valves', partId:'SKJ-SOL-301', x:22, y:34, ref:2},
          {sub:'Manifold & Valves', partId:'SKJ-CHK-302', x:52, y:34, ref:3},
          {sub:'Pressure & Control',partId:'SKJ-103278',  x:68, y:42, ref:4},
          {sub:'Pressure & Control',partId:'SKJ-103601',  x:38, y:60, ref:5},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Manifold &amp; Valve Block Assembly</text>
    <!-- Main manifold block body -->
    <rect x="80" y="80" width="300" height="180" rx="8" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Top face hatching -->
    <rect x="80" y="80" width="300" height="28" fill="url(#hatch45)" opacity="0.5" rx="8"/>
    <!-- Block internal galleries (dashed) -->
    <line x1="80" y1="130" x2="380" y2="130" stroke="#8A8878" stroke-width="0.7" stroke-dasharray="5,3"/>
    <line x1="80" y1="190" x2="380" y2="190" stroke="#8A8878" stroke-width="0.7" stroke-dasharray="5,3"/>
    <line x1="180" y1="80" x2="180" y2="260" stroke="#8A8878" stroke-width="0.7" stroke-dasharray="5,3"/>
    <line x1="280" y1="80" x2="280" y2="260" stroke="#8A8878" stroke-width="0.7" stroke-dasharray="5,3"/>
    <!-- Solenoid valve #2 left top -->
    <rect x="96" y="52" width="40" height="32" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="96" y="52" width="40" height="10" fill="#C8C3BC" stroke="none" rx="3"/>
    <text x="98" y="62" font-size="6" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">SOL-A</text>
    <line x1="116" y1="84" x2="116" y2="80" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="116" y1="52" x2="116" y2="46" stroke="#3A3D4A" stroke-width="1.2" stroke-dasharray="3,2"/>
    <!-- Solenoid valve #2 leader -->
    ${leader(136,68,160,62,2)}
    <!-- Check valve #3 middle top -->
    <circle cx="230" cy="58" r="18" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <polygon points="220,58 240,50 240,66" fill="#5A5F6E"/>
    <line x1="240" y1="58" x2="248" y2="58" stroke="#5A5F6E" stroke-width="1.2"/>
    <line x1="230" y1="76" x2="230" y2="80" stroke="#3A3D4A" stroke-width="1.5"/>
    <text x="218" y="44" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">CHK-302</text>
    ${leader(248,58,280,54,3)}
    <!-- Relief valve #4 right -->
    <rect x="316" y="52" width="48" height="40" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="318" y="54" width="44" height="12" fill="#C8C3BC" stroke="none"/>
    <path d="M328 66 q4-3 8 0 q4 3 8 0 q4-3 8 0" stroke="#3A3D4A" stroke-width="1" fill="none"/>
    <text x="320" y="84" font-size="6" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Relief</text>
    <line x1="340" y1="92" x2="340" y2="80" stroke="#3A3D4A" stroke-width="1.5"/>
    ${leader(364,72,398,66,4)}
    <!-- Flow control #5 bottom center -->
    <rect x="166" y="262" width="48" height="36" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="170" y="276" font-size="6" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Flow ctrl</text>
    <path d="M175 284 q6-2 12 0 q6 2 12 0" stroke="#3A3D4A" stroke-width="1" fill="none"/>
    <line x1="190" y1="262" x2="190" y2="260" stroke="#3A3D4A" stroke-width="1.5"/>
    ${leader(214,280,280,290,5)}
    <!-- Manifold callout 1 -->
    ${leader(80,160,42,148,1)}
    <!-- Inlet port label -->
    <text x="82" y="310" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">P (Pressure)</text>
    <rect x="80" y="260" width="20" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <line x1="90" y1="260" x2="90" y2="296" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- T port -->
    <text x="170" y="310" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">T (Return)</text>
    <rect x="168" y="260" width="20" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- A port output -->
    <text x="322" y="310" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">A → Cylinder</text>
    <rect x="330" y="260" width="20" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <line x1="340" y1="260" x2="340" y2="296" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Dimensions -->
    ${dimH(80,380,58,'180 mm')}
    ${dimV(388,80,260,'120 mm')}
    <!-- Notes -->
    <rect x="406" y="80" width="162" height="180" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="410" y="94" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">ASSEMBLY NOTES</text>
    <text x="410" y="108" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max P: 3000 PSI</text>
    <text x="410" y="120" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">RV setting: 2800 PSI</text>
    <text x="410" y="132" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">SOL voltage: 12 V DC</text>
    <text x="410" y="144" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Torque plugs: 45 N·m</text>
    <text x="410" y="156" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Use Loctite 545 on ports</text>
    <text x="410" y="168" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Flow: 12 L/min nom.</text>
    <text x="410" y="180" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Fluid: ISO VG 46 AW</text>
    <text x="410" y="192" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Body material: ductile iron</text>
    <text x="410" y="204" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Seals: Buna-N (NBR)</text>
    <text x="410" y="216" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Filtration: 10 micron req.</text>
    <text x="410" y="230" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">See SKJ-3219-HYD-001</text>
    <text x="410" y="242" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">for circuit schematic.</text>
    ` + svgTB('Manifold Assembly','SKJ-3219-MAN-003','1:2') + `</svg>`
      },
    ],

    // ── SKJ SJIII 3219 — Drive System ─────────────────────────────────────
    'SKJ-SJIII3219~Drive System': [
      { id:'drive-layout', title:'Drive System Layout',
        hotspots:[
          {sub:'Drive Motors',  partId:'SKJ-MTR-400', x:28, y:48, ref:1},
          {sub:'Hubs & Wheels', partId:'SKJ-HUB-401', x:48, y:68, ref:2},
          {sub:'Hubs & Wheels', partId:'SKJ-TIR-402', x:18, y:68, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Drive System Layout (Plan View)</text>
    <!-- Platform outline -->
    <rect x="82" y="68" width="340" height="220" rx="12" fill="#F0ECE8" stroke="#5A5F6E" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="196" y="178" font-size="9" fill="#B0AAA3" font-family="Inter,sans-serif" font-weight="600">SCISSOR PLATFORM</text>
    <!-- Drive wheels front -->
    <rect x="68" y="84" width="28" height="60" rx="6" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="68" y="84" width="28" height="60" fill="url(#hatch135)" opacity="0.4"/>
    ${cline(68,114,96,114)}
    ${leader(68,114,34,108,3)}
    <text x="6" y="108" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">FL Tire</text>
    <!-- Drive motor front left -->
    <circle cx="106" cy="114" r="22" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="106" cy="114" r="10" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    <polygon points="98,114 114,106 114,122" fill="#5A5F6E"/>
    ${leader(106,92,130,74,1)}
    <!-- Front right wheel -->
    <rect x="408" y="84" width="28" height="60" rx="6" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="408" y="84" width="28" height="60" fill="url(#hatch135)" opacity="0.4"/>
    ${cline(408,114,436,114)}
    <!-- Drive motor front right -->
    <circle cx="396" cy="114" r="22" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="396" cy="114" r="10" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    <polygon points="388,114 404,106 404,122" fill="#5A5F6E"/>
    <!-- Rear wheels (passive/caster) -->
    <ellipse cx="82" cy="252" rx="18" ry="26" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <ellipse cx="422" cy="252" rx="18" ry="26" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="32" y="256" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Caster</text>
    <text x="432" y="256" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Caster</text>
    <!-- Drive hub callout 2 -->
    ${leader(128,114,168,80,2)}
    <text x="170" y="78" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Hub assy.</text>
    <!-- Battery in center -->
    <rect x="140" y="120" width="224" height="88" rx="6" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="196" y="152" font-size="8" fill="#9CA3AF" font-family="Inter,sans-serif">BATTERY</text>
    <text x="196" y="166" font-size="7" fill="#B0AAA3" font-family="Inter,sans-serif">SKJ-BAT-500</text>
    <!-- Dimension lines -->
    ${dimH(68,436,52,'2,300 mm wheelbase')}
    ${dimV(448,68,288,'820 mm track width')}
    <!-- Notes -->
    <rect x="6" y="318" width="240" height="62" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="330" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="342" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Two independent 24V DC drive motors</text>
    <text x="10" y="353" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Max travel speed (platform down): 3.8 km/h</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Max gradeability: 25% (14.0°)</text>
    <text x="10" y="375" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Non-marking solid pneumatic tires</text>
    ` + svgTB('Drive System Layout','SKJ-3219-DRV-001','1:20') + `</svg>`
      },
      { id:'motor-xsection', title:'Drive Motor Cross-Section',
        hotspots:[
          {sub:'Drive Motors', partId:'SKJ-MTR-400', x:42, y:38, ref:1},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Drive Motor Cross-Section</text>
    <!-- Motor housing outer -->
    <rect x="130" y="68" width="220" height="220" rx="110" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Housing hatching ring -->
    <rect x="130" y="68" width="220" height="220" rx="110" fill="url(#hatch45)" opacity="0.3"/>
    <!-- Inner bore -->
    <circle cx="240" cy="178" r="88" fill="#F8F8F4"/>
    <!-- Stator laminations -->
    ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,r=78,cx=240+r*Math.cos(a),cy=178+r*Math.sin(a);return `<rect x="${cx-5}" y="${cy-14}" width="10" height="28" rx="2" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75" transform="rotate(${i*30} ${cx} ${cy})"/>`;}).join('')}
    <!-- Rotor -->
    <circle cx="240" cy="178" r="52" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <circle cx="240" cy="178" r="52" fill="url(#hatch135)" opacity="0.4"/>
    <!-- Shaft -->
    <circle cx="240" cy="178" r="18" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="240" cy="178" r="18" fill="url(#hatch45)" opacity="0.5"/>
    <circle cx="240" cy="178" r="6" fill="#3A3D4A"/>
    ${cline(240,68,240,288)}
    ${cline(130,178,350,178)}
    <!-- Bearing front -->
    <rect x="226" y="68" width="28" height="14" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="258" y="79" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Front bearing</text>
    <!-- Bearing rear -->
    <rect x="226" y="288" width="28" height="14" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="258" y="299" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Rear bearing</text>
    <!-- Callout 1 -->
    ${leader(130,178,72,168,1)}
    <text x="14" y="168" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Motor body</text>
    <!-- Dimensions -->
    ${dimH(130,350,48,'Ø148 flange')}
    ${dimV(360,68,288,'188 mm')}
    <!-- Spec table -->
    <rect x="406" y="68" width="162" height="180" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="410" y="82" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">MOTOR SPECIFICATIONS</text>
    <text x="410" y="96" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Type: DC permanent magnet</text>
    <text x="410" y="108" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Voltage: 24 V DC</text>
    <text x="410" y="120" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Rated power: 1.8 kW</text>
    <text x="410" y="132" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max current: 90 A</text>
    <text x="410" y="144" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">No-load RPM: 3,200</text>
    <text x="410" y="156" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Rated torque: 5.4 N·m</text>
    <text x="410" y="168" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Weight: 8.2 kg</text>
    <text x="410" y="180" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Shaft: Ø18 keyed</text>
    <text x="410" y="192" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Mount: B5 flange</text>
    <text x="410" y="204" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">IP rating: IP65</text>
    <text x="410" y="216" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Ref: man-19 §3.2</text>
    ` + svgTB('Drive Motor Cross-Section','SKJ-3219-DRV-002','1:3') + `</svg>`
      },
    ],

    // ── SKJ SJIII 3219 — Electrical System ───────────────────────────────
    'SKJ-SJIII3219~Electrical System': [
      { id:'elec-schematic', title:'Electrical System Schematic',
        hotspots:[
          {sub:'Power Supply',      partId:'SKJ-BAT-500', x:22, y:55, ref:1},
          {sub:'Power Supply',      partId:'SKJ-CHR-501', x:22, y:72, ref:2},
          {sub:'Controls & Sensors',partId:'SKJ-CTL-502', x:48, y:42, ref:3},
          {sub:'Controls & Sensors',partId:'SKJ-JOY-503', x:70, y:28, ref:4},
          {sub:'Controls & Sensors',partId:'SKJ-LIM-504', x:72, y:52, ref:5},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Electrical System Schematic (24V DC)</text>
    <!-- Battery block -->
    <rect x="34" y="180" width="80" height="50" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <text x="42" y="198" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">BATTERY ①</text>
    <text x="42" y="211" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">24V / 210 Ah</text>
    <text x="42" y="223" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SKJ-BAT-500</text>
    <!-- + and - terminals -->
    <circle cx="54" cy="180" r="6" fill="#D32F2F" stroke="#B71C1C" stroke-width="1.2"/>
    <text x="51" y="183" font-size="8" fill="#FFF" font-family="Inter,sans-serif">+</text>
    <circle cx="100" cy="180" r="6" fill="#1A1200" stroke="#3A3D4A" stroke-width="1.2"/>
    <text x="97" y="183" font-size="8" fill="#FFF" font-family="Inter,sans-serif">−</text>
    <!-- Positive main bus -->
    <line x1="54" y1="174" x2="54" y2="140" stroke="#D32F2F" stroke-width="2"/>
    <line x1="54" y1="140" x2="480" y2="140" stroke="#D32F2F" stroke-width="2"/>
    <!-- Negative bus -->
    <line x1="100" y1="174" x2="100" y2="280" stroke="#1A1200" stroke-width="2"/>
    <line x1="100" y1="280" x2="480" y2="280" stroke="#1A1200" stroke-width="2"/>
    <!-- Main contactor -->
    <rect x="148" y="120" width="36" height="40" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="162" y1="140" x2="172" y2="128" stroke="#3A3D4A" stroke-width="1.5"/>
    <text x="150" y="118" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Main CONT</text>
    <line x1="148" y1="140" x2="54" y2="140" stroke="#D32F2F" stroke-width="1.5"/>
    <line x1="184" y1="140" x2="220" y2="140" stroke="#D32F2F" stroke-width="1.5"/>
    <!-- Controller block -->
    <rect x="218" y="108" width="120" height="68" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <text x="226" y="124" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CONTROLLER ③</text>
    <text x="226" y="137" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-CTL-502</text>
    <text x="226" y="149" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">24V Curtis 1236</text>
    <text x="226" y="161" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">400A peak</text>
    <!-- Controller connections -->
    <line x1="218" y1="140" x2="148" y2="140" stroke="#D32F2F" stroke-width="1.5"/>
    <line x1="278" y1="280" x2="278" y2="176" stroke="#1A1200" stroke-width="1.5"/>
    <!-- Joystick controller -->
    <rect x="350" y="68" width="96" height="52" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="358" y="84" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">JOYSTICK ④</text>
    <text x="358" y="97" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-JOY-503</text>
    <text x="358" y="110" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">CAN-bus interface</text>
    <line x1="350" y1="94" x2="338" y2="94" stroke="#5A5F6E" stroke-width="1"/>
    <line x1="338" y1="94" x2="338" y2="140" stroke="#5A5F6E" stroke-width="1"/>
    <line x1="338" y1="140" x2="338" y2="140" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Limit switches -->
    <rect x="390" y="168" width="80" height="40" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="395" y="184" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">LIMIT SW ⑤</text>
    <text x="395" y="198" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SKJ-LIM-504 ×4</text>
    <line x1="430" y1="208" x2="430" y2="280" stroke="#1A1200" stroke-width="1"/>
    <!-- Drive motors -->
    <circle cx="440" cy="140" r="18" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <polygon points="432,140 448,132 448,148" fill="#5A5F6E"/>
    <text x="420" y="126" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Motor L</text>
    <circle cx="480" cy="140" r="18" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <polygon points="472,140 488,132 488,148" fill="#5A5F6E"/>
    <text x="460" y="126" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Motor R</text>
    <!-- Charger -->
    <rect x="34" y="248" width="80" height="44" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="42" y="264" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">CHARGER ②</text>
    <text x="42" y="277" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-CHR-501</text>
    <text x="42" y="288" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">24V / 25A</text>
    <line x1="74" y1="248" x2="74" y2="230" stroke="#3A3D4A" stroke-width="1.2"/>
    <!-- Labels for buses -->
    <text x="260" y="136" font-size="6" fill="#D32F2F" font-family="Inter,sans-serif">+24V BUS</text>
    <text x="260" y="292" font-size="6" fill="#1A1200" font-family="Inter,sans-serif">GND BUS</text>
    ` + svgTB('Electrical Schematic','SKJ-3219-ELC-001','N/A') + `</svg>`
      },
      { id:'controller-wiring', title:'Controller Wiring Diagram',
        hotspots:[
          {sub:'Controls & Sensors',partId:'SKJ-CTL-502', x:38, y:42, ref:1},
          {sub:'Controls & Sensors',partId:'SKJ-JOY-503', x:72, y:28, ref:2},
          {sub:'Controls & Sensors',partId:'SKJ-LIM-504', x:72, y:58, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 3219 — Controller Wiring Diagram</text>
    <!-- Controller block center -->
    <rect x="158" y="108" width="200" height="160" rx="8" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <text x="198" y="126" font-size="9" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">MOTOR CONTROLLER ①</text>
    <text x="198" y="140" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-CTL-502 — Curtis 1236</text>
    <!-- Connector pins left -->
    ${Array.from({length:8},(_,i)=>`<rect x="142" y="${120+i*16}" width="18" height="10" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="0.75"/><text x="128" y="${128+i*16}" font-size="5.5" fill="#7A7F8E" font-family="Inter,sans-serif">P${i+1}</text>`).join('')}
    <!-- Connector pins right -->
    ${Array.from({length:8},(_,i)=>`<rect x="358" y="${120+i*16}" width="18" height="10" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="0.75"/><text x="380" y="${128+i*16}" font-size="5.5" fill="#7A7F8E" font-family="Inter,sans-serif">P${i+9}</text>`).join('')}
    <!-- Left connections: Battery, Charger, Estop -->
    <rect x="28" y="108" width="90" height="28" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="34" y="120" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">+B / -B (Battery)</text>
    <text x="34" y="130" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">24V / 210Ah</text>
    <line x1="118" y1="122" x2="142" y2="124" stroke="#D32F2F" stroke-width="1.5"/>
    <rect x="28" y="148" width="90" height="24" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="34" y="163" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">E-STOP chain</text>
    <line x1="118" y1="160" x2="142" y2="152" stroke="#FF5722" stroke-width="1.5"/>
    <rect x="28" y="184" width="90" height="24" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="34" y="199" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Key switch</text>
    <line x1="118" y1="196" x2="142" y2="168" stroke="#FF9800" stroke-width="1.5"/>
    <!-- Right connections: Motors, solenoids, sensors -->
    <rect x="400" y="108" width="90" height="28" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="406" y="120" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Motor L (B+/B−)</text>
    <text x="406" y="130" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SKJ-MTR-400</text>
    <line x1="376" y1="124" x2="400" y2="122" stroke="#3F51B5" stroke-width="1.5"/>
    <rect x="400" y="148" width="90" height="24" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="406" y="163" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Motor R (B+/B−)</text>
    <line x1="376" y1="152" x2="400" y2="160" stroke="#3F51B5" stroke-width="1.5"/>
    <!-- Joystick top right -->
    <rect x="408" y="56" width="110" height="40" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="414" y="72" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">JOYSTICK ②</text>
    <text x="414" y="85" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-JOY-503 CAN-bus</text>
    <line x1="408" y1="76" x2="386" y2="76" stroke="#5A5F6E" stroke-width="1.2"/>
    <line x1="386" y1="76" x2="386" y2="120" stroke="#5A5F6E" stroke-width="1.2"/>
    <line x1="376" y1="120" x2="386" y2="120" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Limit switches bottom right -->
    <rect x="408" y="220" width="110" height="44" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="414" y="236" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">LIMIT SWITCHES ③</text>
    <text x="414" y="249" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-LIM-504 ×4</text>
    <text x="414" y="260" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Tilt / Height / Drive</text>
    <line x1="408" y1="242" x2="390" y2="242" stroke="#5A5F6E" stroke-width="1.2"/>
    <line x1="390" y1="242" x2="390" y2="220" stroke="#5A5F6E" stroke-width="1.2"/>
    <line x1="376" y1="220" x2="390" y2="220" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- CAN bus line -->
    <line x1="258" y1="108" x2="258" y2="84" stroke="#4CAF50" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="258" y1="84" x2="408" y2="84" stroke="#4CAF50" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="310" y="80" font-size="6.5" fill="#4CAF50" font-family="Inter,sans-serif">CAN Bus (120Ω)</text>
    ` + svgTB('Controller Wiring','SKJ-3219-ELC-002','N/A') + `</svg>`
      },
    ],

    // ── SKJ SJIII 4632 — Hydraulic System ────────────────────────────────
    'SKJ-SJIII4632~Hydraulic System': [
      { id:'4632-hyd-overview', title:'Hydraulic Circuit Overview',
        hotspots:[
          {sub:'Lift Cylinder Assembly', partId:'SKJ-4632-CYL', x:58, y:30, ref:1},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-4632-SEA', x:64, y:44, ref:2},
          {sub:'Pump & Controls',        partId:'SKJ-HYD-200',  x:22, y:72, ref:3},
          {sub:'Pump & Controls',        partId:'SKJ-MAN-300',  x:36, y:48, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 4632 — Hydraulic Circuit Overview</text>
    <!-- Tank -->
    <rect x="60" y="298" width="50" height="30" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="60" y1="328" x2="110" y2="328" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="68" y="346" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Filter -->
    <rect x="72" y="260" width="26" height="26" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2" transform="rotate(45 85 273)"/>
    <text x="104" y="276" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Filter</text>
    <!-- Pump -->
    <circle cx="85" cy="228" r="20" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.5"/>
    <polygon points="76,228 96,220 96,236" fill="#3A3D4A"/>
    <text x="110" y="232" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ③</text>
    <text x="110" y="243" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">SKJ-HYD-200</text>
    <line x1="85" y1="248" x2="85" y2="273" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="85" y1="208" x2="85" y2="178" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Manifold -->
    <rect x="52" y="138" width="140" height="44" rx="4" fill="#DEDAD4" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="78" y="158" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">MANIFOLD ④</text>
    <text x="78" y="172" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-MAN-300</text>
    <line x1="85" y1="138" x2="85" y2="178" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Cylinder — larger (4632 is bigger) -->
    <rect x="260" y="48" width="52" height="112" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="268" y="54" width="36" height="44" fill="url(#hatch45)" opacity="0.6"/>
    <rect x="268" y="54" width="36" height="44" fill="none" stroke="#8A8878" stroke-width="0.75"/>
    <!-- Piston -->
    <rect x="262" y="102" width="48" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Rod -->
    <rect x="278" y="114" width="16" height="46" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="320" y="78" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">CYL ①</text>
    <text x="320" y="92" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">SKJ-4632-CYL</text>
    <text x="320" y="104" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Ø76 × 340 mm</text>
    <!-- Seal callout -->
    ${leader(314,108,358,116,2)}
    <text x="370" y="120" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Seal kit</text>
    <!-- Pressure line -->
    <line x1="122" y1="158" x2="280" y2="158" stroke="#3A3D4A" stroke-width="2"/>
    <line x1="280" y1="158" x2="280" y2="102" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Notes -->
    <rect x="6" y="318" width="220" height="62" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="330" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES — 4632 vs 3219</text>
    <text x="10" y="342" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Bore: Ø76 mm (vs Ø62 mm on 3219)</text>
    <text x="10" y="354" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. System pressure same: 3,000 PSI</text>
    <text x="10" y="366" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Flow rate: 16 L/min (vs 12 L/min)</text>
    <text x="10" y="378" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Manifold shared with 3219 series</text>
    ` + svgTB('4632 Hydraulic Overview','SKJ-4632-HYD-001','1:1') + `</svg>`
      },
      { id:'4632-cyl-detail', title:'4632 Cylinder Assembly Detail',
        hotspots:[
          {sub:'Lift Cylinder Assembly', partId:'SKJ-4632-CYL', x:38, y:40, ref:1},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-4632-SEA', x:56, y:55, ref:2},
          {sub:'Lift Cylinder Assembly', partId:'SKJ-103445',   x:72, y:40, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJIII 4632 — Cylinder Assembly Detail</text>
    <!-- Cylinder outer -->
    <rect x="108" y="68" width="184" height="258" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="108" y="68" width="24" height="258" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="268" y="68" width="24" height="258" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="132" y="68" width="136" height="258" fill="#F8F8F4" stroke="none"/>
    <!-- Port A top -->
    <rect x="92" y="84" width="18" height="32" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="58" y="100" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port A →</text>
    <!-- Piston -->
    <rect x="132" y="200" width="136" height="44" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="132" y="200" width="136" height="7" fill="url(#hatch45)" opacity="0.5"/>
    <rect x="132" y="237" width="136" height="7" fill="url(#hatch45)" opacity="0.5"/>
    <!-- O-rings -->
    <ellipse cx="164" cy="221" rx="5" ry="2.5" fill="#1A1200" opacity="0.6"/>
    <ellipse cx="236" cy="221" rx="5" ry="2.5" fill="#1A1200" opacity="0.6"/>
    ${leader(241,221,318,214,2)}
    <text x="322" y="218" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Seal kit</text>
    <!-- Piston rod -->
    <rect x="176" y="244" width="48" height="82" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Rod end -->
    <rect x="162" y="306" width="76" height="20" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.5"/>
    <circle cx="200" cy="316" r="8" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(238,316,318,316,3)}
    <text x="322" y="320" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Rod end pin</text>
    <!-- Barrel callout -->
    ${leader(108,160,64,150,1)}
    <text x="14" y="154" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Barrel</text>
    ${dimH(108,292,50,'Ø76 bore')}
    ${dimV(400,68,326,'340 mm stroke')}
    ` + svgTB('4632 Cylinder Detail','SKJ-4632-CYL-002','1:3') + `</svg>`
      },
    ],

    // ── SKJ SJ45T — Boom & Jib ────────────────────────────────────────────
    'SKJ-SJ45T~Boom & Jib': [
      { id:'sj45t-boom-assy', title:'Boom & Jib Assembly Overview',
        hotspots:[
          {sub:'Jib Cylinder',  partId:'SKJ-SJ45-JIB', x:52, y:32, ref:1},
          {sub:'Slewing Ring',  partId:'SKJ-SJ45-SLW', x:24, y:70, ref:2},
          {sub:'Rotary Joint',  partId:'SKJ-SJ45-ROT', x:24, y:58, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJ45T Boom Lift — Boom &amp; Jib Assembly</text>
    <!-- Turntable base -->
    <ellipse cx="120" cy="280" rx="88" ry="32" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <ellipse cx="120" cy="280" rx="88" ry="32" fill="url(#hatch135)" opacity="0.3"/>
    <text x="82" y="284" font-size="7.5" fill="#5A5F6E" font-family="Inter,sans-serif">TURNTABLE</text>
    <!-- Slewing ring -->
    <ellipse cx="120" cy="260" rx="70" ry="20" fill="none" stroke="#5A5F6E" stroke-width="2.5"/>
    <ellipse cx="120" cy="260" rx="70" ry="20" fill="none" stroke="#9CA3AF" stroke-width="0.5" stroke-dasharray="4,2"/>
    ${leader(50,260,24,252,2)}
    <text x="6" y="256" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Slewing ring</text>
    <!-- Rotary joint -->
    <rect x="106" y="246" width="28" height="28" rx="14" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    ${leader(106,260,66,248,3)}
    <text x="6" y="252" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Rot. joint</text>
    <!-- Main boom arm -->
    <rect x="120" y="78" width="300" height="32" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2" transform="rotate(-28 120 94)"/>
    <text x="240" y="106" font-size="8" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600" transform="rotate(-28 240 106)">MAIN BOOM</text>
    <!-- Jib -->
    <rect x="350" y="52" width="140" height="22" rx="5" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="1.8" transform="rotate(-14 350 63)"/>
    <text x="390" y="62" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600" transform="rotate(-14 390 62)">JIB</text>
    <!-- Jib cylinder -->
    <rect x="332" y="74" width="88" height="22" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5" transform="rotate(-28 332 85)"/>
    ${leader(376,88,420,74,1)}
    <text x="424" y="78" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Jib Cyl ①</text>
    <text x="424" y="89" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">SKJ-SJ45-JIB</text>
    <!-- Platform at end of jib -->
    <rect x="470" y="44" width="52" height="40" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="478" y="68" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Platform</text>
    <!-- Dimension: working height -->
    ${dimV(540,44,280,'14 m max')}
    <!-- Notes -->
    <rect x="6" y="316" width="240" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJ45T SPECIFICATIONS</text>
    <text x="10" y="340" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Platform height: 14 m (45 ft)</text>
    <text x="10" y="352" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Horizontal reach: 7.5 m</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Slew: 360° continuous</text>
    <text x="10" y="376" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Jib cyl. bore: Ø88 × 420 mm</text>
    ` + svgTB('Boom & Jib Assembly','SKJ-SJ45T-BOM-001','1:40') + `</svg>`
      },
      { id:'sj45t-slew-detail', title:'Slewing Ring & Rotary Joint Detail',
        hotspots:[
          {sub:'Slewing Ring', partId:'SKJ-SJ45-SLW', x:40, y:44, ref:1},
          {sub:'Rotary Joint', partId:'SKJ-SJ45-ROT', x:58, y:38, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">SKYJACK</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SJ45T — Slewing Ring &amp; Rotary Joint Cross-Section</text>
    <!-- Slewing ring outer race -->
    <ellipse cx="200" cy="200" rx="160" ry="48" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <ellipse cx="200" cy="200" rx="160" ry="48" fill="url(#hatch45)" opacity="0.3"/>
    <!-- Slewing ring inner race -->
    <ellipse cx="200" cy="200" rx="130" ry="36" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Ball bearing row (cross-section) -->
    ${Array.from({length:14},(_,i)=>{const a=i*360/14*Math.PI/180,rx=144,ry=42,cx=200+rx*Math.cos(a),cy=200+ry*Math.sin(a);return `<circle cx="${cx}" cy="${cy}" r="5" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75"/>`;}).join('')}
    <!-- Gear teeth on outer race (partial view) -->
    ${Array.from({length:18},(_,i)=>`<rect x="${38+i*16}" y="245" width="10" height="6" rx="1" fill="#B8B3AC" stroke="#8A8878" stroke-width="0.5"/>`).join('')}
    <text x="80" y="260" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">External gear teeth (drive)</text>
    <!-- Bolt pattern -->
    ${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180,rx=152,ry=44,cx=200+rx*Math.cos(a),cy=200+ry*Math.sin(a);return `<circle cx="${cx}" cy="${cy}" r="3" fill="#5A5F6E" stroke="#3A3D4A" stroke-width="0.75"/>`;}).join('')}
    <!-- Center rotary joint -->
    <ellipse cx="200" cy="198" rx="36" ry="18" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <ellipse cx="200" cy="198" rx="20" ry="10" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="168" y="202" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Rot. Joint</text>
    <!-- Leaders -->
    ${leader(40,200,18,190,1)}
    <text x="6" y="190" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Slewing</text>
    ${leader(236,198,298,186,2)}
    <text x="302" y="190" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Rotary joint</text>
    ${dimH(40,360,142,'Ø548 O.D.')}
    ${dimH(70,330,160,'Ø416 I.D.')}
    <!-- Seal detail -->
    <rect x="62" y="192" width="8" height="14" rx="2" fill="#1A1200" opacity="0.6"/>
    <rect x="330" y="192" width="8" height="14" rx="2" fill="#1A1200" opacity="0.6"/>
    <text x="342" y="202" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Lip seals</text>
    <!-- Notes -->
    <rect x="6" y="310" width="220" height="70" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="322" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="334" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Repack bearing every 1,000 hrs</text>
    <text x="10" y="346" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Grease: Mobilux EP2 / 250g per port</text>
    <text x="10" y="358" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Rotary joint: check hydraulic seals at R&amp;R</text>
    <text x="10" y="370" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Bolt torque: 220 N·m (Grade 10.9)</text>
    <text x="10" y="382" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">5. Max slew speed: 1.2 rpm</text>
    ` + svgTB('Slewing Ring Detail','SKJ-SJ45T-SLW-002','1:4') + `</svg>`
      },
    ],

    // ── CAT 320 — Track System ────────────────────────────────────────────
    'CAT-320~Track System': [
      { id:'cat320-undercarriage', title:'Undercarriage System Overview',
        hotspots:[
          {sub:'Sprocket & Chain', partId:'CAT-SPR-7301', x:14, y:64, ref:1},
          {sub:'Rollers',          partId:'CAT-ROL-7302', x:36, y:74, ref:2},
          {sub:'Rollers',          partId:'CAT-ROL-7303', x:55, y:74, ref:3},
          {sub:'Front Idler',      partId:'CAT-IDL-7304', x:78, y:64, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 320 — Undercarriage System Overview</text>
    <!-- Track frame -->
    <rect x="42" y="178" width="460" height="68" rx="8" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Track links top row -->
    ${Array.from({length:28},(_,i)=>`<rect x="${46+i*16}" y="182" width="14" height="10" rx="2" fill="#BFBAB4" stroke="#8A8878" stroke-width="0.5"/>`).join('')}
    <!-- Track links bottom row -->
    ${Array.from({length:28},(_,i)=>`<rect x="${46+i*16}" y="228" width="14" height="10" rx="2" fill="#BFBAB4" stroke="#8A8878" stroke-width="0.5"/>`).join('')}
    <!-- Sprocket (drive) -->
    <circle cx="80" cy="210" r="36" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    ${Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180;return `<polygon points="${80+28*Math.cos(a)},${210+28*Math.sin(a)} ${80+36*Math.cos(a+0.2)},${210+36*Math.sin(a+0.2)} ${80+36*Math.cos(a-0.2)},${210+36*Math.sin(a-0.2)}" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75"/>`;}).join('')}
    <circle cx="80" cy="210" r="12" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(44,210,18,198,1)}
    <text x="6" y="196" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Sprocket</text>
    <!-- Top carrier rollers (2) -->
    <circle cx="200" cy="178" r="16" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <circle cx="200" cy="178" r="7" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    ${leader(200,162,200,140,2)}
    <text x="188" y="136" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Top roller</text>
    <circle cx="340" cy="178" r="16" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <circle cx="340" cy="178" r="7" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Bottom rollers (7) -->
    ${Array.from({length:7},(_,i)=>{const cx=120+i*44;return `<circle cx="${cx}" cy="${246}" r="22" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/><circle cx="${cx}" cy="${246}" r="9" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>`;}).join('')}
    ${leader(120,268,100,296,3)}
    <text x="58" y="300" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Bottom rollers</text>
    <!-- Front idler -->
    <circle cx="462" cy="210" r="36" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <circle cx="462" cy="210" r="16" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Recoil cylinder on front idler -->
    <rect x="460" y="192" width="78" height="18" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="464" y="204" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Recoil spring</text>
    ${leader(498,210,520,190,4)}
    <text x="524" y="188" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Idler</text>
    ${dimH(42,502,140,'Track length 3,100 mm')}
    ${dimV(540,140,278,'Track gauge 2,100 mm')}
    <!-- Notes -->
    <rect x="6" y="318" width="280" height="62" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="330" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="342" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Check track tension every 500 hrs (250 mm sag)</text>
    <text x="10" y="354" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Grease all roller ends — 10-pump per bearing</text>
    <text x="10" y="366" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Replace sprocket/idler together if >30% worn</text>
    <text x="10" y="378" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Track shoe torque: 550 N·m (Grade 10.9 bolts)</text>
    ` + svgTB('Undercarriage Overview','CAT-320-UCA-001','1:30') + `</svg>`
      },
      { id:'cat320-sprocket-detail', title:'Sprocket & Drive Hub Detail',
        hotspots:[
          {sub:'Sprocket & Chain', partId:'CAT-SPR-7301', x:42, y:44, ref:1},
          {sub:'Front Idler',      partId:'CAT-IDL-7304', x:68, y:44, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 320 — Sprocket &amp; Drive Hub (Section B–B)</text>
    ${cline(14,200,400,200)}
    <!-- Sprocket cross-section left -->
    <circle cx="162" cy="200" r="108" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <circle cx="162" cy="200" r="108" fill="url(#hatch45)" opacity="0.2"/>
    <circle cx="162" cy="200" r="80" fill="#F8F8F4" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Sprocket teeth (cross-section) -->
    ${Array.from({length:9},(_,i)=>{const a=i*40*Math.PI/180,r=94;return `<polygon points="${162+r*Math.cos(a)},${200+r*Math.sin(a)} ${162+(r+14)*Math.cos(a+0.1)},${200+(r+14)*Math.sin(a+0.1)} ${162+(r+14)*Math.cos(a-0.1)},${200+(r+14)*Math.sin(a-0.1)}" fill="#C8C3BC" stroke="#8A8878" stroke-width="1"/>`;}).join('')}
    <!-- Hub bore -->
    <circle cx="162" cy="200" r="42" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="162" cy="200" r="42" fill="url(#hatch45)" opacity="0.5"/>
    <circle cx="162" cy="200" r="22" fill="#F8F8F4" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Keyway -->
    <rect x="140" y="178" width="14" height="8" fill="#DEDAD4" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Bolt holes -->
    ${Array.from({length:6},(_,i)=>{const a=i*60*Math.PI/180,r=60;return `<circle cx="${162+r*Math.cos(a)}" cy="${200+r*Math.sin(a)}" r="5" fill="#F8F8F4" stroke="#5A5F6E" stroke-width="1"/>`;}).join('')}
    ${leader(54,200,18,192,1)}
    <text x="6" y="190" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Sprocket O.D.</text>
    <!-- Front idler cross-section right -->
    <circle cx="400" cy="200" r="88" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <circle cx="400" cy="200" r="88" fill="url(#hatch45)" opacity="0.2"/>
    <circle cx="400" cy="200" r="68" fill="#F8F8F4" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Idler tread -->
    <circle cx="400" cy="200" r="78" fill="none" stroke="#B8B3AC" stroke-width="6" opacity="0.7"/>
    <!-- Bearing races -->
    <circle cx="400" cy="200" r="30" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <circle cx="400" cy="200" r="30" fill="url(#hatch135)" opacity="0.4"/>
    <circle cx="400" cy="200" r="18" fill="#F8F8F4" stroke="#3A3D4A" stroke-width="1.5"/>
    ${leader(488,200,520,190,2)}
    <text x="524" y="188" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Idler</text>
    ${dimH(54,270,82,'Ø488 OD')}
    ${dimH(312,488,82,'Ø388 OD')}
    ${dimV(554,112,288,'148 mm')}
    <text x="142" y="342" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif">DRIVE SPROCKET</text>
    <text x="142" y="354" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-SPR-7301</text>
    <text x="365" y="342" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif">FRONT IDLER</text>
    <text x="365" y="354" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-IDL-7304</text>
    ` + svgTB('Sprocket & Idler Detail','CAT-320-UCA-002','1:5') + `</svg>`
      },
    ],

    // ── CAT 320 — Hydraulic System ────────────────────────────────────────
    'CAT-320~Hydraulic System': [
      { id:'cat320-hyd-circuit', title:'Hydraulic Circuit Schematic',
        hotspots:[
          {sub:'Main Pump',    partId:'CAT-PMP-8001', x:20, y:60, ref:1},
          {sub:'Swing Motor',  partId:'CAT-MTR-8002', x:62, y:28, ref:2},
          {sub:'Control Valve',partId:'CAT-VLV-8004', x:42, y:44, ref:3},
          {sub:'Boom Cylinders',partId:'CAT-CYL-8005',x:72, y:44, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 320 — Hydraulic Circuit Schematic (Simplified)</text>
    <!-- Tank -->
    <rect x="50" y="295" width="60" height="32" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="50" y1="327" x2="110" y2="327" stroke="#5A5F6E" stroke-width="2"/>
    <text x="60" y="344" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Pump -->
    <circle cx="80" cy="255" r="24" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="2"/>
    <polygon points="68,255 92,244 92,266" fill="#3A3D4A"/>
    <text x="108" y="259" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ①</text>
    <text x="108" y="271" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-PMP-8001</text>
    <text x="108" y="282" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">344 bar / 250 L/min</text>
    <line x1="80" y1="279" x2="80" y2="295" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="80" y1="231" x2="80" y2="198" stroke="#3A3D4A" stroke-width="2.5"/>
    <!-- Main pressure rail -->
    <line x1="80" y1="198" x2="520" y2="198" stroke="#3A3D4A" stroke-width="2.5"/>
    <!-- Return rail -->
    <line x1="80" y1="295" x2="520" y2="295" stroke="#5A5F6E" stroke-width="1.5" stroke-dasharray="6,3"/>
    <!-- Control valve bank -->
    <rect x="180" y="168" width="160" height="58" rx="6" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <text x="192" y="186" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CONTROL VALVE BANK ③</text>
    <text x="192" y="199" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">CAT-VLV-8004</text>
    <text x="192" y="211" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">6-spool directional ctrl</text>
    <text x="192" y="221" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Max 380 bar</text>
    <!-- Line to valve -->
    <line x1="180" y1="198" x2="80" y2="198" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Boom cylinder (ISO) -->
    <rect x="360" y="88" width="38" height="80" rx="3" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="366" y="94" width="26" height="28" fill="url(#hatch45)" opacity="0.6"/>
    <rect x="366" y="94" width="26" height="28" fill="none" stroke="#8A8878" stroke-width="0.5"/>
    <rect x="362" y="126" width="34" height="10" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="373" y="136" width="12" height="32" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="402" y="112" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">BOOM CYL ④</text>
    <text x="402" y="124" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-CYL-8005</text>
    <line x1="360" y1="120" x2="340" y2="120" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="340" y1="120" x2="340" y2="168" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Swing motor -->
    <circle cx="470" cy="132" r="26" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.8"/>
    <polygon points="456,132 478,122 478,142" fill="#3A3D4A" transform="rotate(180 467 132)"/>
    <text x="456" y="108" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">SWING ②</text>
    <text x="452" y="120" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-MTR-8002</text>
    <line x1="470" y1="158" x2="470" y2="198" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Pilot circuit -->
    <rect x="50" y="90" width="88" height="54" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="56" y="108" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PILOT PUMP</text>
    <text x="56" y="120" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">36 bar / 30 L/min</text>
    <line x1="94" y1="144" x2="94" y2="168" stroke="#F5A623" stroke-width="1.2" stroke-dasharray="4,2"/>
    <line x1="94" y1="168" x2="180" y2="168" stroke="#F5A623" stroke-width="1.2" stroke-dasharray="4,2"/>
    <text x="100" y="165" font-size="6" fill="#F5A623" font-family="Inter,sans-serif">Pilot supply</text>
    <!-- Notes -->
    <rect x="6" y="316" width="220" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="340" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Main pump: variable displacement axial piston</text>
    <text x="10" y="352" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Fluid: Cat HYDO Advanced 10</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Relief valve: 380 bar set pressure</text>
    <text x="10" y="376" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Filter: 6 micron return, 3 micron pilot</text>
    ` + svgTB('320 Hydraulic Schematic','CAT-320-HYD-001','N/A') + `</svg>`
      },
      { id:'cat320-mainpump', title:'Main Pump Assembly Detail',
        hotspots:[
          {sub:'Main Pump',  partId:'CAT-PMP-8001', x:42, y:44, ref:1},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 320 — Main Hydraulic Pump Cross-Section</text>
    <!-- Pump housing outer -->
    <rect x="80" y="68" width="280" height="240" rx="12" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="80" y="68" width="280" height="240" fill="url(#hatch45)" opacity="0.15"/>
    <!-- Pump housing body -->
    <rect x="100" y="88" width="240" height="200" rx="6" fill="#F8F8F4" stroke="none"/>
    <!-- Cylinder block -->
    <circle cx="220" cy="188" r="72" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Pistons in cylinder block (7 pistons) -->
    ${Array.from({length:7},(_,i)=>{const a=i*360/7*Math.PI/180,r=48;return `<rect x="${220+r*Math.cos(a)-6}" y="${188+r*Math.sin(a)-18}" width="12" height="28" rx="3" fill="#C8C3BC" stroke="#8A8878" stroke-width="1" transform="rotate(${i*360/7} ${220+r*Math.cos(a)} ${188+r*Math.sin(a)})"/>`;}).join('')}
    <!-- Shaft -->
    <circle cx="220" cy="188" r="22" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="220" cy="188" r="22" fill="url(#hatch45)" opacity="0.5"/>
    <circle cx="220" cy="188" r="8" fill="#3A3D4A"/>
    <!-- Swashplate -->
    <line x1="100" y1="108" x2="100" y2="268" stroke="#3A3D4A" stroke-width="2.5"/>
    <rect x="84" y="130" width="22" height="116" rx="4" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <text x="60" y="192" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" transform="rotate(-90 60 192)">Swashplate</text>
    <!-- Valve plate -->
    <rect x="340" y="108" width="20" height="160" rx="4" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <text x="362" y="192" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" transform="rotate(90 362 192)">Valve plate</text>
    <!-- Inlet / outlet ports -->
    <rect x="100" y="68" width="52" height="22" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="108" y="82" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">INLET</text>
    <rect x="240" y="68" width="52" height="22" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="248" y="82" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">OUTLET</text>
    ${leader(80,188,32,176,1)}
    <text x="6" y="174" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Housing</text>
    ${dimH(80,360,46,'348 mm')}
    ${dimV(372,68,308,'288 mm')}
    <!-- Specs -->
    <rect x="400" y="68" width="168" height="180" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="404" y="82" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">PUMP SPECIFICATIONS</text>
    <text x="404" y="96" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Type: axial piston (var. disp.)</text>
    <text x="404" y="108" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max pressure: 380 bar</text>
    <text x="404" y="120" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max flow: 250 L/min</text>
    <text x="404" y="132" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Drive speed: 1,800 RPM</text>
    <text x="404" y="144" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Control: electro-hydraulic</text>
    <text x="404" y="156" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Displacement: 110 cc/rev</text>
    <text x="404" y="168" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Weight: 38.6 kg</text>
    <text x="404" y="180" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Fluid: Cat HYDO Adv 10</text>
    <text x="404" y="192" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Rotation: CW (shaft side)</text>
    ` + svgTB('Main Pump Detail','CAT-320-HYD-002','1:5') + `</svg>`
      },
    ],

    // ── CAT 308 — Track System ────────────────────────────────────────────
    'CAT-308~Track System': [
      { id:'cat308-undercarriage', title:'Undercarriage Overview',
        hotspots:[
          {sub:'Track Links', partId:'CAT-308-TRK', x:50, y:74, ref:1},
          {sub:'Rollers',     partId:'CAT-308-ROL', x:38, y:66, ref:2},
          {sub:'Idler',       partId:'CAT-308-IDL', x:76, y:58, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 308 Mini Excavator — Undercarriage Overview</text>
    <!-- Track frame (smaller than 320) -->
    <rect x="62" y="182" width="380" height="58" rx="6" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.8"/>
    <!-- Track links -->
    ${Array.from({length:24},(_,i)=>`<rect x="${66+i*15}" y="186" width="13" height="9" rx="1.5" fill="#BFBAB4" stroke="#8A8878" stroke-width="0.5"/>`).join('')}
    ${Array.from({length:24},(_,i)=>`<rect x="${66+i*15}" y="224" width="13" height="9" rx="1.5" fill="#BFBAB4" stroke="#8A8878" stroke-width="0.5"/>`).join('')}
    <!-- Drive sprocket -->
    <circle cx="96" cy="208" r="30" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    ${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180,r=22;return `<polygon points="${96+r*Math.cos(a)},${208+r*Math.sin(a)} ${96+(r+8)*Math.cos(a+0.2)},${208+(r+8)*Math.sin(a+0.2)} ${96+(r+8)*Math.cos(a-0.2)},${208+(r+8)*Math.sin(a-0.2)}" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75"/>`;}).join('')}
    <circle cx="96" cy="208" r="10" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Bottom rollers (5) -->
    ${Array.from({length:5},(_,i)=>{const cx=140+i*48;return `<circle cx="${cx}" cy="${248}" r="18" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/><circle cx="${cx}" cy="${248}" r="7" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>`;}).join('')}
    ${leader(140,266,112,296,2)}
    <text x="62" y="300" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Track rollers</text>
    <!-- Track link callout -->
    ${leader(214,233,224,296,1)}
    <text x="228" y="300" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Track links</text>
    <!-- Front idler -->
    <circle cx="406" cy="208" r="30" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="406" cy="208" r="13" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(436,208,468,196,3)}
    <text x="472" y="200" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Front idler</text>
    ${dimH(62,442,154,'2,400 mm')}
    <!-- Notes -->
    <rect x="6" y="316" width="250" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 308 UNDERCARRIAGE SPECS</text>
    <text x="10" y="340" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Track width: 400 mm rubber pads</text>
    <text x="10" y="352" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">No. of bottom rollers: 5 per side</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Idler adjustment: hydraulic tensioner</text>
    <text x="10" y="376" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Track sag spec: 20–30 mm</text>
    ` + svgTB('308 Undercarriage','CAT-308-UCA-001','1:25') + `</svg>`
      },
      { id:'cat308-track-link', title:'Track Link Assembly Detail',
        hotspots:[
          {sub:'Track Links', partId:'CAT-308-TRK', x:42, y:42, ref:1},
          {sub:'Rollers',     partId:'CAT-308-ROL', x:72, y:42, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">CATERPILLAR</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CAT 308 — Track Link &amp; Roller Assembly</text>
    <!-- Track link chain view -->
    ${Array.from({length:8},(_,i)=>{const x=38+i*58;return `
    <rect x="${x}" y="148" width="50" height="32" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="${x}" y="148" width="50" height="32" fill="url(#hatch45)" opacity="0.3"/>
    <circle cx="${x+8}" cy="164" r="8" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <circle cx="${x+42}" cy="164" r="8" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    `;}).join('')}
    <!-- Master link highlight -->
    <rect x="38" y="148" width="50" height="32" rx="4" fill="none" stroke="#F5A623" stroke-width="2.5"/>
    <text x="40" y="196" font-size="7" fill="#F5A623" font-family="Inter,sans-serif" font-weight="600">Master link</text>
    <!-- Track shoe on one link -->
    <rect x="38" y="180" width="50" height="18" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Grouser bar -->
    <rect x="42" y="196" width="42" height="6" rx="2" fill="#B8B3AC" stroke="#5A5F6E" stroke-width="0.75"/>
    <text x="40" y="214" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Grouser bar</text>
    ${leader(38,164,14,152,1)}
    <text x="6" y="148" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Track link</text>
    <!-- Roller on track -->
    <circle cx="260" cy="148" r="38" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="260" cy="148" r="16" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <circle cx="260" cy="148" r="8" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Roller flanges contacting track links -->
    <rect x="222" y="148" width="76" height="16" fill="#DEDAD4" stroke="#5A5F6E" stroke-width="1"/>
    <rect x="222" y="112" width="76" height="14" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(298,148,356,138,2)}
    <text x="360" y="142" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Track roller</text>
    <text x="360" y="154" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">CAT-308-ROL</text>
    <!-- Shaft seal detail -->
    <rect x="222" y="124" width="14" height="22" rx="2" fill="#1A1200" opacity="0.5"/>
    <rect x="286" y="124" width="14" height="22" rx="2" fill="#1A1200" opacity="0.5"/>
    <text x="310" y="178" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">Shaft seals (floating)</text>
    ${dimH(38,496,120,'Pitch 128 mm')}
    ${dimH(222,298,82,'Ø102 roller')}
    <!-- Notes -->
    <rect x="6" y="316" width="250" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="340" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Lubricate link pins every 250 hrs</text>
    <text x="10" y="352" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Replace link sets not individual links</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Roller seals: factory sealed, no grease port</text>
    <text x="10" y="376" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Link pitch wear limit: +3 mm</text>
    ` + svgTB('Track Link Detail','CAT-308-UCA-002','1:3') + `</svg>`
      },
    ],

    // ── Toyota 8FGU25 — Lift System ───────────────────────────────────────
    'TOY-8FGU25~Lift System': [
      { id:'toy25-mast-overview', title:'Mast Assembly Overview',
        hotspots:[
          {sub:'Mast & Chain',  partId:'TOY-MCH-114', x:38, y:32, ref:1},
          {sub:'Mast & Chain',  partId:'TOY-PUL-202', x:52, y:22, ref:2},
          {sub:'Lift Cylinder', partId:'TOY-LFT-088', x:58, y:52, ref:3},
          {sub:'Lift Cylinder', partId:'TOY-TLT-203', x:72, y:68, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">TOYOTA</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Toyota 8FGU25 — Mast Assembly Overview (Triplex)</text>
    <!-- Outer mast rails -->
    <rect x="108" y="48" width="22" height="310" rx="3" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="108" y="48" width="22" height="310" fill="url(#hatch45)" opacity="0.4"/>
    <rect x="298" y="48" width="22" height="310" rx="3" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="298" y="48" width="22" height="310" fill="url(#hatch45)" opacity="0.4"/>
    <!-- Middle mast rails -->
    <rect x="140" y="88" width="16" height="240" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="272" y="88" width="16" height="240" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Inner mast rails -->
    <rect x="164" y="128" width="12" height="180" rx="2" fill="#B8B3AC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="252" y="128" width="12" height="180" rx="2" fill="#B8B3AC" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Cross bars -->
    <rect x="108" y="88" width="212" height="10" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <rect x="108" y="180" width="212" height="10" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <rect x="108" y="272" width="212" height="10" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Lift cylinder (free-lift center) -->
    <rect x="194" y="128" width="40" height="180" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="200" y="134" width="28" height="60" fill="url(#hatch45)" opacity="0.5"/>
    <rect x="200" y="134" width="28" height="60" fill="none" stroke="#8A8878" stroke-width="0.75"/>
    <rect x="196" y="198" width="36" height="10" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="205" y="208" width="18" height="100" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(234,188,294,176,3)}
    <text x="298" y="180" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Lift cyl.</text>
    <text x="298" y="190" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-LFT-088</text>
    <!-- Chain runs -->
    ${Array.from({length:8},(_,i)=>`<rect x="${152}" y="${90+i*28}" width="6" height="20" rx="1" fill="#9CA3AF" stroke="#7A7F8E" stroke-width="0.5"/>`).join('')}
    ${Array.from({length:8},(_,i)=>`<rect x="${270}" y="${90+i*28}" width="6" height="20" rx="1" fill="#9CA3AF" stroke="#7A7F8E" stroke-width="0.5"/>`).join('')}
    ${leader(152,104,102,92,1)}
    <text x="56" y="96" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Mast chains</text>
    <text x="56" y="106" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-MCH-114</text>
    <!-- Pulley at top -->
    <circle cx="214" cy="66" r="14" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <circle cx="214" cy="66" r="6" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1"/>
    ${leader(228,66,294,62,2)}
    <text x="298" y="66" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Chain pulley</text>
    <text x="298" y="76" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-PUL-202</text>
    <!-- Tilt cylinder base attachment -->
    <rect x="80" y="326" width="268" height="22" rx="4" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="186" y="318" width="56" height="12" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(440,330,468,318,4)}
    <text x="472" y="322" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Tilt cyl.</text>
    <text x="472" y="332" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-TLT-203</text>
    ${dimV(460,48,358,'3-stage mast 4,700 mm')}
    <!-- Notes -->
    <rect x="6" y="316" width="64" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="6.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SPECS</text>
    <text x="10" y="340" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">Cap: 2,500 kg</text>
    <text x="10" y="352" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">Lift: 4.7 m</text>
    <text x="10" y="364" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">Tilt: +6°/−3°</text>
    ` + svgTB('Mast Assembly','TOY-25-MST-001','1:20') + `</svg>`
      },
      { id:'toy25-cyl-xsection', title:'Lift Cylinder Cross-Section',
        hotspots:[
          {sub:'Lift Cylinder', partId:'TOY-LFT-088', x:40, y:38, ref:1},
          {sub:'Lift Cylinder', partId:'TOY-TLT-203', x:58, y:55, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">TOYOTA</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Toyota 8FGU25 — Lift Cylinder Cross-Section</text>
    <!-- Cylinder barrel -->
    <rect x="130" y="58" width="148" height="272" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="130" y="58" width="20" height="272" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="258" y="58" width="20" height="272" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="150" y="58" width="108" height="272" fill="#F8F8F4" stroke="none"/>
    <!-- Port top -->
    <rect x="110" y="74" width="22" height="30" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="70" y="92" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port →</text>
    <!-- Piston -->
    <rect x="150" y="190" width="108" height="40" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="150" y="190" width="108" height="7" fill="url(#hatch45)" opacity="0.5"/>
    <rect x="150" y="223" width="108" height="7" fill="url(#hatch45)" opacity="0.5"/>
    <ellipse cx="178" cy="210" rx="5" ry="2.5" fill="#1A1200" opacity="0.6"/>
    <ellipse cx="230" cy="210" rx="5" ry="2.5" fill="#1A1200" opacity="0.6"/>
    ${leader(235,210,310,200,2)}
    <text x="314" y="204" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Tilt cyl. seals</text>
    <text x="314" y="214" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-TLT-203</text>
    <!-- Piston rod -->
    <rect x="186" y="230" width="36" height="100" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Rod seal gland -->
    <rect x="162" y="286" width="84" height="20" fill="#BFBAB4" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="162" y="286" width="84" height="20" fill="url(#hatch45)" opacity="0.3"/>
    <!-- Base end -->
    <rect x="130" y="58" width="148" height="26" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="130" y="58" width="148" height="26" fill="url(#hatch45)" opacity="0.4"/>
    ${leader(130,172,82,162,1)}
    <text x="14" y="166" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Cylinder</text>
    <text x="14" y="176" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-LFT-088</text>
    ${dimH(130,278,40,'Ø64 bore')}
    ${dimV(390,58,330,'448 mm stroke')}
    ${dimH(186,222,354,'Ø36 rod')}
    <!-- Notes -->
    <rect x="6" y="310" width="200" height="70" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="322" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="334" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Bore: Ø64 mm, Rod: Ø36 mm</text>
    <text x="10" y="346" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Inspect chrome rod on every R&amp;R</text>
    <text x="10" y="358" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Gland torque: 120 N·m</text>
    <text x="10" y="370" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. OEM seals only — NBR grade C</text>
    <text x="10" y="382" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">5. Bleed cylinder after seal replacement</text>
    ` + svgTB('Lift Cyl. Cross-Section','TOY-25-CYL-002','1:4') + `</svg>`
      },
      { id:'toy25-hyd-circuit', title:'Lift/Tilt Hydraulic Circuit',
        hotspots:[
          {sub:'Pump & Valve', partId:'TOY-PMP-204', x:22, y:65, ref:1},
          {sub:'Pump & Valve', partId:'TOY-VLV-205', x:38, y:45, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">TOYOTA</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Toyota 8FGU25 — Lift &amp; Tilt Hydraulic Circuit</text>
    <!-- Tank -->
    <rect x="50" y="295" width="56" height="28" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="50" y1="323" x2="106" y2="323" stroke="#5A5F6E" stroke-width="2"/>
    <text x="56" y="340" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Pump -->
    <circle cx="78" cy="252" r="22" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.8"/>
    <polygon points="66,252 90,242 90,262" fill="#3A3D4A"/>
    <text x="104" y="256" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ①</text>
    <text x="104" y="268" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-PMP-204</text>
    <line x1="78" y1="274" x2="78" y2="295" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="78" y1="230" x2="78" y2="195" stroke="#3A3D4A" stroke-width="2"/>
    <line x1="78" y1="195" x2="420" y2="195" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Return line -->
    <line x1="78" y1="295" x2="420" y2="295" stroke="#5A5F6E" stroke-width="1.5" stroke-dasharray="5,3"/>
    <!-- Control valve -->
    <rect x="150" y="165" width="148" height="58" rx="5" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="1.8"/>
    <text x="162" y="184" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">CTRL VALVE ②</text>
    <text x="162" y="197" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">TOY-VLV-205</text>
    <text x="162" y="209" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">3-spool: Lift / Tilt / Attachment</text>
    <text x="162" y="220" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Max 200 bar</text>
    <line x1="150" y1="195" x2="78" y2="195" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Lift cylinder (up) -->
    <rect x="338" y="88" width="34" height="80" rx="3" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="344" y="94" width="22" height="28" fill="url(#hatch45)" opacity="0.6"/>
    <rect x="334" y="120" width="42" height="10" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="347" y="130" width="14" height="38" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="378" y="112" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">LIFT CYL</text>
    <text x="378" y="124" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-LFT-088</text>
    <line x1="338" y1="116" x2="298" y2="116" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="298" y1="116" x2="298" y2="165" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Tilt cylinders (2) -->
    <rect x="90" y="88" width="80" height="30" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="100" y="92" width="60" height="10" fill="#C8C3BC" stroke="none"/>
    <text x="94" y="128" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif">TILT CYL ×2</text>
    <line x1="130" y1="118" x2="130" y2="165" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Priority valve -->
    <rect x="78" y="130" width="48" height="30" rx="3" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="82" y="148" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif">Priority V.</text>
    <line x1="78" y1="145" x2="60" y2="145" stroke="#3A3D4A" stroke-width="1.2"/>
    <line x1="60" y1="145" x2="60" y2="195" stroke="#3A3D4A" stroke-width="1.2"/>
    <!-- Notes -->
    <rect x="6" y="316" width="220" height="64" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="328" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="340" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. Lift relief: 180 bar / Tilt relief: 120 bar</text>
    <text x="10" y="352" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Fluid: Toyota Genuine Hydraulic Oil S</text>
    <text x="10" y="364" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">3. Filter: replace every 1,000 hrs</text>
    <text x="10" y="376" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">4. Pump: gear type, engine-driven</text>
    ` + svgTB('Lift/Tilt Circuit','TOY-25-HYD-003','N/A') + `</svg>`
      },
    ],

    // ── Toyota 8FGU32 — Lift System ───────────────────────────────────────
    'TOY-8FGU32~Lift System': [
      { id:'toy32-mast-assy', title:'Mast Assembly (8FGU32)',
        hotspots:[
          {sub:'Lift Cylinder', partId:'TOY-32-CYL', x:56, y:48, ref:1},
          {sub:'Lift Cylinder', partId:'TOY-32-SEA', x:66, y:58, ref:2},
          {sub:'Mast & Chain',  partId:'TOY-MCH-114', x:36, y:30, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">TOYOTA</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Toyota 8FGU32 — Mast Assembly (3.2 t capacity)</text>
    <!-- Outer mast (wider — 32 is larger) -->
    <rect x="92" y="48" width="26" height="314" rx="3" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="92" y="48" width="26" height="314" fill="url(#hatch45)" opacity="0.4"/>
    <rect x="310" y="48" width="26" height="314" rx="3" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="310" y="48" width="26" height="314" fill="url(#hatch45)" opacity="0.4"/>
    <!-- Middle rails -->
    <rect x="128" y="90" width="18" height="244" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <rect x="282" y="90" width="18" height="244" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- Inner rails -->
    <rect x="156" y="130" width="14" height="186" rx="2" fill="#B8B3AC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="258" y="130" width="14" height="186" rx="2" fill="#B8B3AC" stroke="#5A5F6E" stroke-width="1.2"/>
    <!-- Cross members -->
    <rect x="92" y="90" width="244" height="12" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <rect x="92" y="186" width="244" height="12" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <rect x="92" y="282" width="244" height="12" rx="2" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1"/>
    <!-- Lift cylinder (larger bore Ø72) -->
    <rect x="186" y="130" width="56" height="184" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="194" y="138" width="40" height="64" fill="url(#hatch45)" opacity="0.5"/>
    <rect x="194" y="138" width="40" height="64" fill="none" stroke="#8A8878" stroke-width="0.75"/>
    <rect x="182" y="206" width="64" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="205" y="218" width="18" height="96" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    ${leader(242,188,310,176,1)}
    <text x="314" y="180" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Lift cyl. Ø72</text>
    <text x="314" y="190" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-32-CYL</text>
    ${leader(260,210,310,210,2)}
    <text x="314" y="214" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Seal kit</text>
    <text x="314" y="224" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-32-SEA</text>
    <!-- Chain rollers callout -->
    ${leader(128,104,78,96,3)}
    <text x="24" y="100" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Chains</text>
    ${dimV(455,48,362,'4,900 mm')}
    ${dimH(92,336,28,'(wider mast: 480 mm)')}
    ` + svgTB('8FGU32 Mast Assembly','TOY-32-MST-001','1:20') + `</svg>`
      },
      { id:'toy32-cyl-seals', title:'Cylinder & Seal Detail',
        hotspots:[
          {sub:'Lift Cylinder', partId:'TOY-32-CYL', x:38, y:40, ref:1},
          {sub:'Lift Cylinder', partId:'TOY-32-SEA', x:56, y:54, ref:2},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">TOYOTA</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Toyota 8FGU32 — Cylinder &amp; Seal Kit Detail</text>
    <!-- Cylinder outer -->
    <rect x="120" y="60" width="168" height="280" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="120" y="60" width="22" height="280" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="266" y="60" width="22" height="280" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="142" y="60" width="124" height="280" fill="#F8F8F4" stroke="none"/>
    <!-- Barrel callout -->
    ${leader(120,180,68,170,1)}
    <text x="14" y="174" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Cyl. barrel</text>
    <!-- Piston -->
    <rect x="142" y="202" width="124" height="44" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Seal groove details — show 3 seals in detail inset -->
    <rect x="420" y="88" width="144" height="200" rx="4" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="426" y="104" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SEAL DETAIL — 5:1</text>
    <!-- Piston seal groove cross-section -->
    <rect x="430" y="116" width="60" height="60" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="430" y="116" width="60" height="60" fill="url(#hatch45)" opacity="0.4"/>
    <!-- O-ring in groove -->
    <rect x="440" y="128" width="20" height="14" rx="3" fill="#F8F6F2" stroke="#5A5F6E" stroke-width="0.75"/>
    <ellipse cx="450" cy="135" rx="8" ry="4" fill="#1A1200" opacity="0.5" stroke="#1A1200" stroke-width="0.5"/>
    <text x="464" y="139" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">O-ring</text>
    <!-- Backup ring -->
    <rect x="440" y="148" width="20" height="8" rx="2" fill="#B0AAFC" opacity="0.7" stroke="#534AB7" stroke-width="0.75"/>
    <text x="464" y="155" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">Backup</text>
    <!-- Wiper seal -->
    <rect x="430" y="188" width="60" height="30" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="430" y="188" width="60" height="30" fill="url(#hatch135)" opacity="0.4"/>
    <rect x="444" y="192" width="28" height="14" rx="3" fill="#8A8878" opacity="0.6"/>
    <text x="434" y="232" font-size="6" fill="#5A5F6E" font-family="Inter,sans-serif">Rod wiper / lip seal</text>
    <!-- Seal kit callout -->
    ${leader(266,224,346,224,2)}
    <line x1="346" y1="224" x2="420" y2="180" stroke="#9CA3AF" stroke-width="0.75"/>
    <text x="350" y="220" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Seal kit</text>
    <text x="350" y="230" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">TOY-32-SEA</text>
    <text x="350" y="240" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Ø72 / NBR grade</text>
    <!-- Rod -->
    <rect x="190" y="246" width="28" height="94" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    ${dimH(120,288,42,'Ø72 bore')}
    ${dimV(400,60,340,'512 mm stroke')}
    ` + svgTB('8FGU32 Cylinder Detail','TOY-32-CYL-002','1:4') + `</svg>`
      },
    ],

    // ── Bobcat S650 — Hydraulic System ───────────────────────────────────
    'BOB-S650~Hydraulic System': [
      { id:'bob650-hyd-circuit', title:'Hydraulic Circuit Schematic',
        hotspots:[
          {sub:'Main Pump',   partId:'BOB-PMP-400', x:18, y:62, ref:1},
          {sub:'Loader Valve',partId:'BOB-VLV-401', x:38, y:44, ref:2},
          {sub:'Drive Motor', partId:'BOB-MTR-402', x:62, y:62, ref:3},
          {sub:'Quick Coupler',partId:'BOB-QC-520', x:72, y:36, ref:4},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">BOBCAT</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Bobcat S650 — Hydraulic Circuit Schematic</text>
    <!-- Tank -->
    <rect x="42" y="290" width="52" height="30" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="42" y1="320" x2="94" y2="320" stroke="#5A5F6E" stroke-width="2"/>
    <text x="50" y="338" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Tandem pump -->
    <rect x="28" y="222" width="80" height="56" rx="6" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="2"/>
    <circle cx="52" cy="248" r="14" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <polygon points="44,248 60,240 60,256" fill="#5A5F6E"/>
    <circle cx="88" cy="248" r="14" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <polygon points="80,248 96,240 96,256" fill="#5A5F6E"/>
    <text x="32" y="290" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ①</text>
    <text x="32" y="302" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">BOB-PMP-400</text>
    <text x="32" y="312" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Tandem gear 2×40cc</text>
    <line x1="68" y1="222" x2="68" y2="198" stroke="#3A3D4A" stroke-width="2.5"/>
    <line x1="68" y1="198" x2="480" y2="198" stroke="#3A3D4A" stroke-width="2.5"/>
    <!-- Control valve bank -->
    <rect x="155" y="158" width="168" height="60" rx="5" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <text x="168" y="178" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">LOADER VALVE ②</text>
    <text x="168" y="191" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">BOB-VLV-401</text>
    <text x="168" y="203" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">4-spool: Lift/Tilt/Aux/Coupler</text>
    <text x="168" y="213" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Max 250 bar</text>
    <line x1="155" y1="198" x2="68" y2="198" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Drive motors (left/right) -->
    <circle cx="70" cy="118" r="22" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.8"/>
    <polygon points="56,118 78,108 78,128" fill="#3A3D4A" transform="rotate(180 67 118)"/>
    <text x="40" y="100" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">MOTOR L ③</text>
    <line x1="70" y1="140" x2="70" y2="158" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="70" y1="158" x2="155" y2="158" stroke="#3A3D4A" stroke-width="1.5"/>
    <circle cx="440" cy="118" r="22" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="1.8"/>
    <polygon points="426,118 448,108 448,128" fill="#3A3D4A" transform="rotate(180 437 118)"/>
    <text x="414" y="100" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">MOTOR R</text>
    <text x="414" y="110" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">BOB-MTR-402</text>
    <line x1="440" y1="140" x2="440" y2="158" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="440" y1="158" x2="323" y2="158" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Quick coupler valve -->
    <rect x="358" y="76" width="96" height="38" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <text x="364" y="94" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Q-COUPLER ④</text>
    <text x="364" y="106" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">BOB-QC-520</text>
    <line x1="406" y1="114" x2="406" y2="158" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Return line -->
    <line x1="68" y1="320" x2="480" y2="320" stroke="#5A5F6E" stroke-width="1.5" stroke-dasharray="5,3"/>
    <!-- Notes -->
    <rect x="6" y="345" width="220" height="45" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="357" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">NOTES</text>
    <text x="10" y="369" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">1. High-flow aux: 128 L/min optional</text>
    <text x="10" y="380" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">2. Drive circuit: closed-loop hydrostatic</text>
    ` + svgTB('S650 Hydraulic Circuit','BOB-S650-HYD-001','N/A') + `</svg>`
      },
      { id:'bob650-valve-block', title:'Loader Valve Block Assembly',
        hotspots:[
          {sub:'Loader Valve', partId:'BOB-VLV-401', x:42, y:42, ref:1},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">BOBCAT</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Bobcat S650 — Loader Valve Block Assembly</text>
    <!-- Main valve body -->
    <rect x="78" y="72" width="320" height="220" rx="10" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="78" y="72" width="320" height="28" fill="url(#hatch45)" opacity="0.4" rx="10"/>
    <!-- Spool housings (4 spools) -->
    ${[0,1,2,3].map(i=>`
    <rect x="${98+i*72}" y="108" width="52" height="168" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="${106+i*72}" y="116" width="36" height="40" rx="3" fill="#D6D2CC" stroke="#8A8878" stroke-width="1"/>
    <rect x="${106+i*72}" y="162" width="36" height="24" rx="2" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75"/>
    <text x="${112+i*72}" y="200" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">${['Lift','Tilt','Aux','Coupler'][i]}</text>
    `).join('')}
    <!-- Inlet port P -->
    <rect x="78" y="258" width="30" height="32" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="82" y="280" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">P</text>
    <!-- Tank port T -->
    <rect x="368" y="258" width="30" height="32" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="374" y="280" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">T</text>
    <!-- Relief valve on top -->
    <rect x="298" y="54" width="52" height="22" rx="4" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <path d="M306 64 q6-3 12 0 q6 3 12 0" stroke="#3A3D4A" stroke-width="1" fill="none"/>
    <text x="300" y="52" font-size="7" fill="#5A5F6E" font-family="Inter,sans-serif">Relief V. 250 bar</text>
    <line x1="324" y1="76" x2="324" y2="72" stroke="#3A3D4A" stroke-width="1.5"/>
    ${leader(78,180,30,168,1)}
    <text x="6" y="166" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Valve body</text>
    ${dimH(78,398,50,'248 mm')}
    ${dimV(410,72,292,'220 mm')}
    <!-- Specs -->
    <rect x="430" y="72" width="138" height="160" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="434" y="86" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">VALVE SPECS</text>
    <text x="434" y="100" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Type: open centre</text>
    <text x="434" y="112" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Spools: 4</text>
    <text x="434" y="124" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max press: 250 bar</text>
    <text x="434" y="136" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max flow: 128 L/min</text>
    <text x="434" y="148" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port size: SAE #12</text>
    <text x="434" y="160" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Control: pilot / cable</text>
    <text x="434" y="172" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Fluid: Bobcat 6902178</text>
    <text x="434" y="184" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Filter: 10 micron</text>
    ` + svgTB('Loader Valve Block','BOB-S650-HYD-002','1:3') + `</svg>`
      },
      { id:'bob650-drive-motor', title:'Drive Motor Assembly Detail',
        hotspots:[
          {sub:'Drive Motor', partId:'BOB-MTR-402', x:42, y:42, ref:1},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">BOBCAT</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Bobcat S650 — Hydrostatic Drive Motor Cross-Section</text>
    <!-- Motor housing -->
    <rect x="86" y="68" width="248" height="240" rx="12" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="86" y="68" width="248" height="240" fill="url(#hatch45)" opacity="0.12"/>
    <rect x="106" y="88" width="208" height="200" rx="6" fill="#F8F8F4" stroke="none"/>
    <!-- Cylinder block -->
    <circle cx="210" cy="188" r="68" fill="#ECEAE6" stroke="#5A5F6E" stroke-width="1.5"/>
    <!-- 9 pistons (radial) -->
    ${Array.from({length:9},(_,i)=>{const a=i*40*Math.PI/180,r=46;return `<rect x="${210+r*Math.cos(a)-5}" y="${188+r*Math.sin(a)-16}" width="10" height="26" rx="3" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75" transform="rotate(${i*40} ${210+r*Math.cos(a)} ${188+r*Math.sin(a)})"/>`;}).join('')}
    <!-- Shaft -->
    <circle cx="210" cy="188" r="20" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.8"/>
    <circle cx="210" cy="188" r="20" fill="url(#hatch45)" opacity="0.5"/>
    <circle cx="210" cy="188" r="7" fill="#3A3D4A"/>
    <!-- Shaft extension -->
    <rect x="202" y="290" width="16" height="42" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    ${cline(210,68,210,330)}
    ${cline(86,188,334,188)}
    <!-- Brake piston (parking brake) -->
    <rect x="86" y="280" width="248" height="28" rx="6" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="86" y="280" width="248" height="28" fill="url(#hatch135)" opacity="0.4"/>
    <text x="148" y="298" font-size="7.5" fill="#5A5F6E" font-family="Inter,sans-serif" font-weight="600">SPRING-APPLIED PARKING BRAKE</text>
    <!-- Port A / B labels -->
    <rect x="86" y="108" width="22" height="30" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="60" y="126" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port A</text>
    <rect x="312" y="108" width="22" height="30" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="336" y="126" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Port B</text>
    ${leader(86,188,38,176,1)}
    <text x="6" y="174" font-size="6" fill="#7A7F8E" font-family="Inter,sans-serif">Housing</text>
    ${dimH(86,334,48,'Ø168 flange')}
    ${dimV(346,68,308,'224 mm')}
    <!-- Spec table -->
    <rect x="400" y="68" width="168" height="180" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="404" y="82" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">MOTOR SPECS</text>
    <text x="404" y="96" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Type: axial piston (fixed)</text>
    <text x="404" y="108" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Displacement: 80 cc/rev</text>
    <text x="404" y="120" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max pressure: 350 bar</text>
    <text x="404" y="132" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max speed: 3,800 RPM</text>
    <text x="404" y="144" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Max torque: 250 N·m</text>
    <text x="404" y="156" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Brake: spring/hydraulic</text>
    <text x="404" y="168" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Weight: 14.2 kg</text>
    <text x="404" y="180" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Mount: SAE B 2-bolt</text>
    ` + svgTB('Drive Motor Detail','BOB-S650-DRV-003','1:3') + `</svg>`
      },
    ],

    // ── Bobcat S770 — Hydraulic System ───────────────────────────────────
    'BOB-S770~Hydraulic System': [
      { id:'bob770-hyd-overview', title:'Hydraulic Circuit Overview',
        hotspots:[
          {sub:'Boom Cylinder', partId:'BOB-770-CYL', x:64, y:32, ref:1},
          {sub:'Main Pump',     partId:'BOB-PMP-400', x:18, y:64, ref:2},
          {sub:'Loader Valve',  partId:'BOB-VLV-401', x:38, y:44, ref:3},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">BOBCAT</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Bobcat S770 — Hydraulic Circuit Overview</text>
    <!-- Tank -->
    <rect x="38" y="285" width="56" height="30" fill="none" stroke="#5A5F6E" stroke-width="1.5"/>
    <line x1="38" y1="315" x2="94" y2="315" stroke="#5A5F6E" stroke-width="2"/>
    <text x="46" y="332" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">TANK</text>
    <!-- Pump (larger for S770 high-flow) -->
    <circle cx="66" cy="245" r="26" fill="#F8F6F2" stroke="#3A3D4A" stroke-width="2"/>
    <polygon points="52,245 80,232 80,258" fill="#3A3D4A"/>
    <text x="96" y="249" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">PUMP ②</text>
    <text x="96" y="261" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">BOB-PMP-400</text>
    <text x="96" y="272" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">High-flow: 155 L/min</text>
    <line x1="66" y1="271" x2="66" y2="285" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="66" y1="219" x2="66" y2="195" stroke="#3A3D4A" stroke-width="2.5"/>
    <line x1="66" y1="195" x2="500" y2="195" stroke="#3A3D4A" stroke-width="2.5"/>
    <!-- Control valve (larger — 5-spool) -->
    <rect x="145" y="155" width="188" height="65" rx="5" fill="#DEDAD4" stroke="#3A3D4A" stroke-width="2"/>
    <text x="158" y="175" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">LOADER VALVE ③</text>
    <text x="158" y="189" font-size="6.5" fill="#7A7F8E" font-family="Inter,sans-serif">BOB-VLV-401 (5-spool)</text>
    <text x="158" y="201" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Lift/Tilt/Aux1/Aux2/Coupler</text>
    <text x="158" y="213" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Max 250 bar</text>
    <line x1="145" y1="195" x2="66" y2="195" stroke="#3A3D4A" stroke-width="2"/>
    <!-- Boom cylinder (larger — S770 has heavier boom) -->
    <rect x="368" y="78" width="44" height="90" rx="4" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="1.8"/>
    <rect x="376" y="86" width="28" height="32" fill="url(#hatch45)" opacity="0.6"/>
    <rect x="364" y="120" width="52" height="12" fill="#C8C3BC" stroke="#5A5F6E" stroke-width="1.2"/>
    <rect x="382" y="132" width="16" height="36" fill="#D6D2CC" stroke="#5A5F6E" stroke-width="1.2"/>
    <text x="416" y="98" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">BOOM CYL ①</text>
    <text x="416" y="110" font-size="6.5" fill="#9CA3AF" font-family="Inter,sans-serif">BOB-770-CYL</text>
    <text x="416" y="122" font-size="6" fill="#9CA3AF" font-family="Inter,sans-serif">Ø88 bore</text>
    ${leader(412,110,454,102,1)}
    <line x1="368" y1="118" x2="333" y2="118" stroke="#3A3D4A" stroke-width="1.5"/>
    <line x1="333" y1="118" x2="333" y2="155" stroke="#3A3D4A" stroke-width="1.5"/>
    <!-- Return line -->
    <line x1="66" y1="315" x2="500" y2="315" stroke="#5A5F6E" stroke-width="1.5" stroke-dasharray="5,3"/>
    <!-- Notes -->
    <rect x="6" y="338" width="250" height="44" fill="#ECEAE6" stroke="#8A8878" stroke-width="0.75"/>
    <text x="10" y="350" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">S770 vs S650 — Key Differences</text>
    <text x="10" y="362" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">• Pump flow: 155 L/min (S650: 128 L/min)</text>
    <text x="10" y="374" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">• 5-spool valve (S650: 4-spool)</text>
    ` + svgTB('S770 Hydraulic Overview','BOB-S770-HYD-001','N/A') + `</svg>`
      },
      { id:'bob770-boom-cyl', title:'Boom Cylinder Seal Detail',
        hotspots:[
          {sub:'Boom Cylinder', partId:'BOB-770-CYL', x:40, y:44, ref:1},
        ],
        svgFn: ()=> svgOpen() + `
    <text x="14" y="20" font-size="7.5" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="700" letter-spacing="1.5">BOBCAT</text>
    <text x="14" y="34" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">Bobcat S770 — Boom Cylinder Seal Kit Detail</text>
    <!-- Cylinder barrel (partial) -->
    <rect x="100" y="72" width="180" height="260" rx="6" fill="#ECEAE6" stroke="#3A3D4A" stroke-width="2"/>
    <rect x="100" y="72" width="22" height="260" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="258" y="72" width="22" height="260" fill="url(#hatch45)" opacity="0.7"/>
    <rect x="122" y="72" width="136" height="260" fill="#F8F8F4" stroke="none"/>
    ${leader(100,186,50,174,1)}
    <text x="6" y="172" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Bore Ø88</text>
    <!-- Seal detail inset -->
    <rect x="336" y="72" width="228" height="260" rx="6" fill="#F8F6F2" stroke="#8A8878" stroke-width="1.2"/>
    <text x="344" y="90" font-size="7.5" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="700">SEAL KIT — BOB-770-CYL</text>
    <text x="344" y="104" font-size="7" fill="#7A7F8E" font-family="Inter,sans-serif">Contents (Ø88 set):</text>
    <!-- Seal types list -->
    ${[
      ['Piston seal (U-cup)', '2×', '#5A5F6E'],
      ['O-ring (piston)', '2×', '#5A5F6E'],
      ['Backup ring', '4×', '#5A5F6E'],
      ['Rod seal (lip type)', '1×', '#5A5F6E'],
      ['Rod wiper', '1×', '#5A5F6E'],
      ['Guide ring (piston)', '2×', '#5A5F6E'],
      ['Guide ring (rod)', '1×', '#5A5F6E'],
      ['Dust seal', '1×', '#5A5F6E'],
    ].map(([name,qty,col],i)=>`
    <rect x="344" y="${116+i*18}" width="14" height="12" rx="2" fill="#C8C3BC" stroke="#8A8878" stroke-width="0.75"/>
    <text x="364" y="${127+i*18}" font-size="7" fill="${col}" font-family="Inter,sans-serif">${name}</text>
    <text x="536" y="${127+i*18}" font-size="7" fill="#9CA3AF" font-family="Inter,sans-serif" text-anchor="end">${qty}</text>
    `).join('')}
    <line x1="340" y1="264" x2="558" y2="264" stroke="#E8E4DF" stroke-width="0.75"/>
    <text x="344" y="278" font-size="7" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">Material: Buna-N (NBR) / PTFE</text>
    <text x="344" y="291" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Temp range: −20°C to +100°C</text>
    <text x="344" y="302" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Fluid compat.: mineral / HFD</text>
    <text x="344" y="313" font-size="6.5" fill="#5A5F6E" font-family="Inter,sans-serif">Ref: BOB-S770 Service Manual §10.3</text>
    <!-- Piston assembly view -->
    <rect x="122" y="200" width="136" height="48" fill="#C8C3BC" stroke="#3A3D4A" stroke-width="1.5"/>
    <rect x="122" y="200" width="136" height="8" fill="url(#hatch45)" opacity="0.5"/>
    <rect x="122" y="240" width="136" height="8" fill="url(#hatch45)" opacity="0.5"/>
    <!-- Piston seals visible -->
    <ellipse cx="150" cy="224" rx="6" ry="3" fill="#1A1200" opacity="0.6"/>
    <ellipse cx="230" cy="224" rx="6" ry="3" fill="#1A1200" opacity="0.6"/>
    <!-- Rod -->
    <rect x="168" y="248" width="44" height="84" fill="#D6D2CC" stroke="#3A3D4A" stroke-width="1.5"/>
    ${dimH(100,280,52,'Ø88 bore')}
    ${dimH(168,212,358,'Ø48 rod')}
    ` + svgTB('S770 Boom Cyl. Seals','BOB-S770-HYD-002','1:3') + `</svg>`
      },
    ],
  }; // end DIAGRAMS

  // ── Supplier landing-page profiles ────────────────────────────────────────
  const SUPPLIER_PROFILES = {
    'SKJ': {
      displayName: 'Skyjack',
      tagline: 'Aerial Work Platforms',
      color: '#F5A623',
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="48" rx="4" fill="#1E1E1E"/><text x="14" y="32" font-size="22" font-weight="800" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-0.5">SKYJACK</text></svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="120" fill="#1A1A1A"/><defs><linearGradient id="skj-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A1A1A"/><stop offset="100%" stop-color="#2A2210"/></linearGradient></defs><rect x="0" y="0" width="800" height="120" fill="url(#skj-grad)"/><text x="28" y="52" font-size="32" font-weight="800" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-1">SKYJACK</text><text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#8A8878" letter-spacing="2">AERIAL WORK PLATFORMS</text><rect x="28" y="88" width="64" height="3" rx="1.5" fill="#F5A623"/></svg>`,
      categories: [
        { icon:'ti-crane',    label:'Scissor Lifts',    sub:'SJIII, SJIV Series',     navModelId:'SKJ-SJIII3219', navComp:null },
        { icon:'ti-forklift', label:'Boom Lifts',       sub:'SJ45T, SJ66T',           navModelId:'SKJ-SJ45T',    navComp:null },
        { icon:'ti-droplet',  label:'Hydraulic Parts',  sub:'Cylinders, Valves, Pumps',navModelId:'SKJ-SJIII3219',navComp:'Hydraulic System' },
        { icon:'ti-battery',  label:'Electrical Parts', sub:'Batteries, Controls',    navModelId:'SKJ-SJIII3219',navComp:'Electrical System' },
        { icon:'ti-settings', label:'Drive System',     sub:'Motors, Hubs, Wheels',   navModelId:'SKJ-SJIII3219',navComp:'Drive System' },
        { icon:'ti-tool',     label:'Wear Parts',       sub:'Filters, Seals, Pads',   navModelId:'SKJ-SJIII4632',navComp:'Hydraulic System' },
      ],
      actions: [
        { icon:'ti-book',  label:'All Manuals',               navView:'manuals',     navCtx:{ vendor:'Skyjack' } },
        { icon:'ti-bell',  label:'Bulletins & Alerts',         navView:'news',        navCtx:{ vendor:'Skyjack' } },
        { icon:'ti-star',  label:'Recommended Service Parts',  navView:'recommended', navCtx:{ vendor:'Skyjack' } },
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
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="48" rx="4" fill="#F5A623"/><text x="14" y="33" font-size="20" font-weight="900" font-family="Inter,sans-serif" fill="#1A1200" letter-spacing="-0.5">CAT</text><text x="60" y="33" font-size="11" font-weight="600" font-family="Inter,sans-serif" fill="#4A3600" letter-spacing="0.5">CATERPILLAR</text></svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="120" fill="#1A0E00"/><defs><linearGradient id="cat-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A0E00"/><stop offset="100%" stop-color="#2A1800"/></linearGradient></defs><rect x="0" y="0" width="800" height="120" fill="url(#cat-grad)"/><text x="28" y="52" font-size="32" font-weight="900" font-family="Inter,sans-serif" fill="#F5A623" letter-spacing="-1">CAT</text><text x="110" y="52" font-size="18" font-weight="600" font-family="Inter,sans-serif" fill="#D4880A" letter-spacing="2">CATERPILLAR</text><text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#6A5A38" letter-spacing="2">HEAVY CONSTRUCTION EQUIPMENT</text><rect x="28" y="88" width="64" height="3" rx="1.5" fill="#F5A623"/></svg>`,
      categories: [
        { icon:'ti-backhoe',   label:'Excavators',        sub:'320, 323, 308',        navModelId:'CAT-320',  navComp:null },
        { icon:'ti-bulldozer', label:'Mini Excavators',   sub:'308 Series',           navModelId:'CAT-308',  navComp:null },
        { icon:'ti-settings',  label:'Undercarriage',     sub:'Track, Rollers, Idlers',navModelId:'CAT-320',  navComp:'Track System' },
        { icon:'ti-engine',    label:'Engine Parts',      sub:'Filters, Belts, Seals',navModelId:'CAT-320',  navComp:'Engine' },
        { icon:'ti-droplet',   label:'Hydraulic System',  sub:'Pumps, Cylinders, Hoses',navModelId:'CAT-320', navComp:'Hydraulic System' },
        { icon:'ti-tool',      label:'Ground Engagement', sub:'Teeth, Adapters, Blades',navModelId:'CAT-308', navComp:'Track System' },
      ],
      actions: [
        { icon:'ti-book',  label:'All Manuals',               navView:'manuals',     navCtx:{ vendor:'Caterpillar' } },
        { icon:'ti-bell',  label:'Bulletins & Alerts',         navView:'news',        navCtx:{ vendor:'Caterpillar' } },
        { icon:'ti-star',  label:'Recommended Service Parts',  navView:'recommended', navCtx:{ vendor:'Caterpillar' } },
      ],
      description: "Caterpillar is the world's largest manufacturer of construction and mining equipment. Mid-County Rental sources genuine Cat parts for our excavator fleet.",
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
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="48" rx="4" fill="#C8102E"/><text x="14" y="33" font-size="18" font-weight="800" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="1">TOYOTA</text><text x="112" y="33" font-size="10" font-weight="500" font-family="Inter,sans-serif" fill="#FFAAAA" letter-spacing="0.5">FORKLIFTS</text></svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="120" fill="#6B0618"/><defs><linearGradient id="toy-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#6B0618"/><stop offset="100%" stop-color="#3A0210"/></linearGradient></defs><rect x="0" y="0" width="800" height="120" fill="url(#toy-grad)"/><text x="28" y="52" font-size="28" font-weight="800" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="2">TOYOTA</text><text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#FFAAAA" letter-spacing="2">MATERIAL HANDLING EQUIPMENT</text><rect x="28" y="88" width="64" height="3" rx="1.5" fill="#C8102E"/></svg>`,
      categories: [
        { icon:'ti-forklift',  label:'IC Forklifts',      sub:'8FGU, 8FG Series',    navModelId:'TOY-8FGU25', navComp:null },
        { icon:'ti-battery-2', label:'Electric Forklifts', sub:'8FBET, 7FBEU Series', navModelId:'TOY-8FGU32', navComp:null },
        { icon:'ti-crane',     label:'Mast & Lift System', sub:'Chains, Cylinders',   navModelId:'TOY-8FGU25', navComp:'Lift System' },
        { icon:'ti-gear',      label:'Transmission',       sub:'Clutches, Torque Conv.',navModelId:'TOY-8FGU25',navComp:'Powertrain' },
        { icon:'ti-settings',  label:'Drive & Steer Axle', sub:'Bearings, Seals',     navModelId:'TOY-8FGU25', navComp:'Drive System' },
        { icon:'ti-tool',      label:'Wear Parts',         sub:'Forks, Tires, Filters',navModelId:'TOY-8FGU32', navComp:'Lift System' },
      ],
      actions: [
        { icon:'ti-book',  label:'All Manuals',               navView:'manuals',     navCtx:{ vendor:'Toyota' } },
        { icon:'ti-bell',  label:'Bulletins & Alerts',         navView:'news',        navCtx:{ vendor:'Toyota' } },
        { icon:'ti-star',  label:'Recommended Service Parts',  navView:'recommended', navCtx:{ vendor:'Toyota' } },
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
      logo: `<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="48" rx="4" fill="#E87722"/><text x="14" y="33" font-size="20" font-weight="900" font-family="Inter,sans-serif" fill="#FFFFFF" letter-spacing="-0.5">BOBCAT</text></svg>`,
      bannerSvg: `<svg width="100%" height="120" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="120" fill="#1A0A00"/><defs><linearGradient id="bob-grad" x1="0" y1="0" x2="800" y2="0"><stop offset="0%" stop-color="#1A0A00"/><stop offset="100%" stop-color="#2A1408"/></linearGradient></defs><rect x="0" y="0" width="800" height="120" fill="url(#bob-grad)"/><text x="28" y="52" font-size="32" font-weight="900" font-family="Inter,sans-serif" fill="#E87722" letter-spacing="-1">BOBCAT</text><text x="28" y="76" font-size="13" font-family="Inter,sans-serif" fill="#6A4A28" letter-spacing="2">COMPACT EQUIPMENT</text><rect x="28" y="88" width="64" height="3" rx="1.5" fill="#E87722"/></svg>`,
      categories: [
        { icon:'ti-bulldozer', label:'Skid-Steer Loaders',    sub:'S650, S750, S850',    navModelId:'BOB-S650', navComp:null },
        { icon:'ti-tractor',   label:'Compact Track Loaders', sub:'T590, T650',          navModelId:'BOB-S770', navComp:null },
        { icon:'ti-droplet',   label:'Hydraulic System',      sub:'Pumps, Hoses, Couplers',navModelId:'BOB-S650',navComp:'Hydraulic System' },
        { icon:'ti-bolt',      label:'Electrical System',     sub:'Fuses, Relays, Controls',navModelId:'BOB-S650',navComp:'Electrical' },
        { icon:'ti-settings',  label:'Drive Train',           sub:'Chain Case, Motors',  navModelId:'BOB-S650', navComp:'Drive System' },
        { icon:'ti-tool',      label:'Attachments',           sub:'Buckets, Augers',     navModelId:'BOB-S770', navComp:'Hydraulic System' },
      ],
      actions: [
        { icon:'ti-book',  label:'All Manuals',               navView:'manuals',     navCtx:{ vendor:'Bobcat' } },
        { icon:'ti-bell',  label:'Bulletins & Alerts',         navView:'news',        navCtx:{ vendor:'Bobcat' } },
        { icon:'ti-star',  label:'Recommended Service Parts',  navView:'recommended', navCtx:{ vendor:'Bobcat' } },
      ],
      description: 'Bobcat Company is a leading manufacturer of compact equipment. Mid-County Rental maintains a fleet of Bobcat skid-steer loaders serviced with OEM and compatible parts.',
      features: [
        { ok:true,  label:'Parts Lookup' },
        { ok:true,  label:'Parts Diagrams' },
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
  function cartQty(partId) { const c=getActiveCart().find(c=>c.id===partId); return c ? (c.qty||1) : 0; }
  function inCartHtml(partId, size) {
    const qty = cartQty(partId);
    const sm = size==='sm';
    const h = sm ? '20px' : '24px';
    const fs = sm ? '10px' : '11px';
    const btnStyle = `width:${h};height:${h};border:1px solid #D4B483;border-radius:4px;background:#F5DEB5;color:#854F0B;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-family:inherit;padding:0;`;
    const valStyle = `font-size:${fs};font-weight:700;color:#854F0B;min-width:14px;text-align:center;`;
    return `<div style="display:inline-flex;align-items:center;gap:3px;background:#FAEEDA;border-radius:5px;padding:${sm?'1px 4px':'3px 6px'};">
      <button style="${btnStyle}" onclick="event.stopPropagation();psQtyAdj('${partId}',-1)">−</button>
      <span style="${valStyle}">${qty}</span>
      <button style="${btnStyle}" onclick="event.stopPropagation();psQtyAdj('${partId}',1)">+</button>
    </div>`;
  }
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
  function getWosForSupplier(supplierId) {
    const assets = EQUIPMENT.filter(e=>e.supplierId===supplierId).map(e=>e.asset);
    return Store.getWorkOrders('active').filter(wo=>assets.includes(wo.asset));
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let _nav = { supplierId:null, modelId:null, compName:null, subName:null };
  let _sel = null;
  let _searchMode = 'keyword';
  let _searchQuery = '';
  let _woFilter = null;
  let _centerView = 'list';
  let _expanded = new Set();
  let _diagTab = {};

  if (_wo) {
    const eq = EQUIPMENT.find(e=>e.asset===_wo.asset);
    if (eq) { _nav.supplierId=eq.supplierId; _nav.modelId=eq.modelId; _expanded.add(eq.supplierId); _expanded.add(eq.modelId); }
  } else if (_ctxSupplierId) {
    _nav.supplierId = _ctxSupplierId;
    _expanded.add(_ctxSupplierId);
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
.supplier-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px;}
.supplier-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:11px;padding:16px;cursor:pointer;}
.supplier-card:hover{border-color:#C8C3BC;}
.sc-icon{font-size:22px;color:#C8C3BC;margin-bottom:8px;}
.sc-name{font-size:14px;font-weight:700;color:#111318;margin-bottom:3px;}
.sc-meta{font-size:11px;color:#9CA3AF;margin-bottom:4px;}
.sc-models{font-size:11px;color:#5A5F6E;}
.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
.m-card,.c-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px;cursor:pointer;}
.m-card:hover,.c-card:hover{border-color:#C8C3BC;}
.m-card-name,.c-card-name{font-size:13px;font-weight:600;color:#111318;margin-bottom:3px;}
.m-card-meta,.c-card-meta{font-size:11px;color:#9CA3AF;margin-bottom:5px;}
.sub-chip{background:#F5F2EE;color:#7A7F8E;font-size:10px;border-radius:4px;padding:2px 5px;}
.c-card-icon{font-size:16px;color:#F5A623;margin-bottom:6px;}
.sub-section{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden;margin-bottom:10px;}
.sub-sec-hdr{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;background:#FAFAF8;border-bottom:0.5px solid #F0ECE8;}
.sub-sec-hdr:hover{background:#F5F2EE;}
.sub-sec-name{font-size:12px;font-weight:600;color:#111318;flex:1;}
.sub-sec-count{font-size:11px;color:#9CA3AF;}
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
.diag-wrap{display:flex;flex-direction:column;gap:0;flex:1;overflow:hidden;}
.diag-tab-row{display:flex;gap:4px;padding:8px 14px;background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;flex-wrap:wrap;flex-shrink:0;}
.diag-tab{padding:5px 12px;border-radius:6px;border:0.5px solid #E2DDD8;background:#FFFFFF;font-size:11px;font-weight:500;color:#5A5F6E;cursor:pointer;font-family:inherit;}
.diag-tab:hover{border-color:#C8C3BC;}
.diag-tab.active{background:#1E1E1E;color:#FFFFFF;border-color:#1E1E1E;}
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
.cbubble{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid;transition:transform .15s;box-shadow:0 2px 5px rgba(0,0,0,.14);}
.cbubble:hover{transform:scale(1.15);}
.cb-def{background:#FFF;border-color:#9CA3AF;color:#3A3D4A;}
.cb-cart{background:#F5A623;border-color:#D4880A;color:#1A1200;}
.cb-sel{background:#534AB7;border-color:#3B3497;color:#FFF;}
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
.dp-sec-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;padding:10px 14px 4px;}
.dp-manref{display:flex;align-items:center;gap:6px;padding:4px 14px;font-size:11px;}
.dp-manref-link{color:#534AB7;text-decoration:none;font-weight:500;flex:1;}
.dp-manref-link:hover{text-decoration:underline;}
.dp-manref-sec{color:#9CA3AF;font-size:10px;}
.slp-scroll{overflow-y:auto;flex:1;display:flex;flex-direction:column;}
.slp-banner{flex-shrink:0;line-height:0;}
.slp-banner svg{width:100%;display:block;}
.slp-body{display:flex;gap:18px;padding:18px;align-items:flex-start;flex:1;}
.slp-main{flex:1;min-width:0;}
.slp-side{width:240px;min-width:240px;display:flex;flex-direction:column;gap:14px;flex-shrink:0;}
.slp-section-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px;}
.slp-cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.slp-cat-tile{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px 12px;cursor:pointer;}
.slp-cat-tile:hover{border-color:#C8C3BC;background:#FAFAF8;}
.slp-cat-icon{font-size:20px;margin-bottom:6px;}
.slp-cat-label{font-size:12px;font-weight:600;color:#111318;margin-bottom:2px;}
.slp-cat-sub{font-size:10px;color:#9CA3AF;}
.slp-action-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.slp-action-tile{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:14px 10px;text-align:center;cursor:pointer;}
.slp-action-tile:hover{border-color:#C8C3BC;background:#FAFAF8;}
.slp-info-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;padding:16px;}
.slp-info-title{font-size:14px;font-weight:700;color:#111318;margin-bottom:2px;}
.slp-info-tag{font-size:11px;color:#9CA3AF;margin-bottom:10px;}
.slp-info-desc{font-size:12px;color:#5A5F6E;line-height:1.6;margin-bottom:12px;}
.slp-feat-list{display:flex;flex-direction:column;gap:5px;}
.slp-feat-row{display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#3A3D4A;}
.slp-news-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden;}
.slp-news-hdr{background:#F5F2EE;padding:10px 14px;font-size:11px;font-weight:700;color:#3A3D4A;border-bottom:0.5px solid #E8E4DF;}
.slp-news-body{padding:10px 14px;display:flex;flex-direction:column;gap:10px;}
.slp-news-date{font-size:10px;color:#9CA3AF;margin-bottom:2px;}
.slp-news-title{font-size:12px;color:#3A3D4A;line-height:1.5;}
.slp-wo-table{width:100%;border-collapse:collapse;margin-top:8px;}
.slp-wo-table th{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#9CA3AF;padding:6px 10px;text-align:left;border-bottom:1px solid #E8E4DF;background:#FAFAF8;}
.slp-wo-table td{padding:8px 10px;border-bottom:0.5px solid #F0ECE8;font-size:12px;color:#3A3D4A;}
.slp-wo-table tr:hover td{background:#FAFAF8;cursor:pointer;}
.wo-status-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;border-radius:4px;padding:2px 6px;}
.wo-status-badge.active{background:#FAEEDA;color:#854F0B;}
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
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
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
    const activeWos = getWosForSupplier(s.id);

    const categoryTiles = (pr.categories || []).map(cat => {
      const mId = cat.navModelId;
      const cName = cat.navComp;
      const onclick = mId
        ? `psNavTo('${s.id}','${mId}',${cName?`'${esc(cName)}'`:'null'},null)`
        : `psNavTo('${s.id}',null,null,null)`;
      return `<div class="slp-cat-tile" onclick="${onclick}">
        <div class="slp-cat-icon" style="color:${accent};"><i class="ti ${cat.icon}"></i></div>
        <div class="slp-cat-label">${cat.label}</div>
        <div class="slp-cat-sub">${cat.sub}</div>
      </div>`;
    }).join('');

    const actionTiles = (pr.actions || []).map(a => {
      const onclick = `Router.navigate('${a.navView}',{vendor:'${a.navCtx.vendor}'})`;
      return `<div class="slp-action-tile" onclick="${onclick}">
        <i class="ti ${a.icon}" style="font-size:20px;color:#9CA3AF;display:block;margin-bottom:6px;"></i>
        <div style="font-size:12px;font-weight:600;color:#3A3D4A;">${a.label}</div>
      </div>`;
    }).join('');

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

    const woRows = activeWos.map(wo =>
      `<tr onclick="sendPrompt('Work Order detail WO #${wo.id}')">
        <td style="font-weight:600;color:#111318;">WO #${wo.id}</td>
        <td>${wo.machine||'—'}</td>
        <td>${wo.asset||'—'}</td>
        <td>${wo.description||'—'}</td>
        <td><span class="wo-status-badge active">Active</span></td>
        <td><button onclick="event.stopPropagation();psNavFromWo(${wo.id})" style="background:#F5A623;border:none;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;">Browse Parts</button></td>
      </tr>`
    ).join('');

    document.getElementById('ps-center').innerHTML = `
    <div class="slp-scroll">
      <div class="slp-banner" style="position:relative;overflow:hidden;border-radius:0;">${pr.bannerSvg || ''}</div>
      <div class="slp-body">
        <div class="slp-main">
          ${activeWos.length ? `
          <div class="slp-section-label">Active Work Orders (${activeWos.length})</div>
          <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden;margin-bottom:22px;">
            <table class="slp-wo-table">
              <thead><tr><th>WO #</th><th>Machine</th><th>Asset</th><th>Description</th><th>Status</th><th></th></tr></thead>
              <tbody>${woRows}</tbody>
            </table>
          </div>` : ''}

          <div class="slp-section-label">Product Families</div>
          <div class="slp-cat-grid">${categoryTiles}</div>

          <div class="slp-section-label" style="margin-top:22px;">Actions</div>
          <div class="slp-action-grid">${actionTiles}</div>

          <div class="slp-section-label" style="margin-top:22px;">Models (${s.models.length})</div>
          <div class="card-grid" style="margin-bottom:0;">${modelCards}</div>
        </div>

        <div class="slp-side">
          <div class="slp-info-card">
            <div class="slp-info-title">${pr.displayName || s.name}</div>
            <div class="slp-info-tag">${pr.tagline || ''}</div>
            <p class="slp-info-desc">${pr.description || ''}</p>
            <div class="slp-feat-list">${featureList}</div>
          </div>
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

  // ── Parts table ───────────────────────────────────────────────────────────────
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
          <td>${inC?inCartHtml(p.id,'sm'):`<button class="add-btn" onclick="event.stopPropagation();psAddPart('${p.id}')"><i class="ti ti-plus" style="font-size:10px;"></i> Add</button>`}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  }

  // ── Diagram ───────────────────────────────────────────────────────────────────
  function diagramHtml(modelId, compName, subName) {
    const key = modelId + '~' + (compName || '');
    const diagrams = DIAGRAMS[key] || [];
    const idx = _diagTab[key] || 0;
    const diag = diagrams[idx] || null;
    const hs = diag
      ? diag.hotspots.filter(h => subName ? h.sub === subName : true)
      : [];
    const tabRow = diagrams.length > 1
      ? `<div class="diag-tab-row">${diagrams.map((d,i)=>`<button class="diag-tab ${i===idx?'active':''}" onclick="psDiagTab('${modelId}','${esc(compName||'')}',${i})">${d.title}</button>`).join('')}</div>`
      : '';
    const svgContent = diag ? diag.svgFn() : `<svg width="580" height="400" viewBox="0 0 580 400" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="580" height="400" fill="#F8F6F2"/><text x="290" y="200" text-anchor="middle" font-size="13" fill="#9CA3AF" font-family="Inter,sans-serif">No diagram available for this view.</text></svg>`;
    return `<div class="diag-wrap">
      ${tabRow}
      <div class="diag-svg-area">
        <div class="diag-canvas" id="ps-diag-canvas">${svgContent}<div id="ps-hotspots" style="position:absolute;inset:0;pointer-events:none;"></div></div>
      </div>
      <div class="diag-legend">${hs.length
        ? hs.map(h=>{const p=fp(h.partId);if(!p)return'';const iC=isInCart(p.id),iS=_sel===p.id;
            return `<div class="legend-row ${iS?'sel':''} ${iC?'inc':''}" onclick="psSelect('${p.id}')">
              <span class="legend-ref">${h.ref}</span>
              <span class="legend-name">${p.description}</span>
              <span class="legend-num">${p.partNum}</span>
              <span class="legend-price">$${p.price.toFixed(2)}</span>
              ${iC?inCartHtml(p.id,'sm'):`<button class="add-sm" onclick="event.stopPropagation();psAddPart('${p.id}')">Add</button>`}
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
    const key = modelId + '~' + (compName || '');
    const diagrams = DIAGRAMS[key] || [];
    const idx = _diagTab[key] || 0;
    const diag = diagrams[idx] || null;
    const hs = diag ? diag.hotspots.filter(h => subName ? h.sub === subName : true) : [];
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

  // ── Detail panel ──────────────────────────────────────────────────────────────
  function renderDetail() {
    const panel=document.getElementById('ps-detail'); if(!panel) return;
    if (!_sel) { panel.style.display='none'; return; }
    const p=fp(_sel); if(!p) { panel.style.display='none'; return; }
    panel.style.display='flex';
    const iC=isInCart(p.id);
    const cartLabel=_woId ? `Add to WO #${_woId}` : 'Add to cart';
    const meta = PART_META[p.id] || {};
    const manRefs = (meta.manualRefs || []).map(ref => {
      const man = (Store.getManuals ? Store.getManuals() : []).find(m=>m.id===ref.manId);
      const title = man ? man.title : ref.title;
      return `<div class="dp-manref">
        <i class="ti ti-book" style="font-size:10px;color:#9CA3AF;flex-shrink:0;"></i>
        <a class="dp-manref-link" onclick="psOpenManual('${ref.manId}')" href="javascript:void(0)">${title}</a>
        <span class="dp-manref-sec">§${ref.section} p.${ref.page}</span>
      </div>`;
    }).join('');
    panel.innerHTML=`
      <div class="dp-header"><div class="dp-title">${p.description}</div><button class="dp-close" onclick="psSelect(null)">×</button></div>
      <div class="dp-partnum">${p.partNum}</div>
      <div class="dp-badges">${p.oemOnly?'<span class="badge-oem">OEM only</span>':'<span class="badge-am">Aftermarket OK</span>'}${p.recommended?'<span class="badge-rec"><i class="ti ti-star" style="font-size:9px;"></i> Recommended</span>':''}</div>
      <div class="dp-div"></div>
      <div class="dp-field"><span class="dp-lbl">Vendor</span><span class="dp-val">${p.vendor}</span></div>
      <div class="dp-field"><span class="dp-lbl">Category</span><span class="dp-val">${p.category}</span></div>
      <div class="dp-field"><span class="dp-lbl">Price</span><span class="dp-val" style="font-size:18px;font-weight:700;color:#111318;">$${p.price.toFixed(2)}</span></div>
      <div class="dp-field"><span class="dp-lbl">Availability</span><span class="dp-avail ${p.inStock?'g':'a'}"><span class="avdot ${p.inStock?'g':'a'}"></span>${p.inStock?'In stock':'Backordered'}</span></div>
      ${meta.weight ? `<div class="dp-field"><span class="dp-lbl">Weight</span><span class="dp-val">${meta.weight}</span></div>` : ''}
      ${meta.dims   ? `<div class="dp-field"><span class="dp-lbl">Dimensions</span><span class="dp-val">${meta.dims}</span></div>` : ''}
      <div class="dp-div"></div>
      <div class="dp-path"><i class="ti ti-sitemap" style="font-size:10px;margin-top:2px;flex-shrink:0;"></i><span>${catalogPathFor(p.id)||'—'}</span></div>
      ${manRefs ? `<div class="dp-sec-label">Manual References</div>${manRefs}` : ''}
      <div class="dp-actions">${iC
        ?`<div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;display:flex;align-items:center;gap:6px;background:#FAEEDA;border-radius:8px;padding:8px 12px;"><i class="ti ti-check" style="color:#854F0B;font-size:13px;"></i><span style="font-size:13px;font-weight:600;color:#854F0B;flex:1;">In cart</span><button style="width:28px;height:28px;border:1px solid #D4B483;border-radius:5px;background:#F5DEB5;color:#854F0B;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;padding:0;" onclick="psQtyAdj('${p.id}',-1)">−</button><span style="font-size:14px;font-weight:700;color:#854F0B;min-width:20px;text-align:center;">${cartQty(p.id)}</span><button style="width:28px;height:28px;border:1px solid #D4B483;border-radius:5px;background:#F5DEB5;color:#854F0B;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;padding:0;" onclick="psQtyAdj('${p.id}',1)">+</button></div></div>`
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
      actionCell.innerHTML=iC?inCartHtml(p.id,'sm'):`<button class="add-btn" onclick="event.stopPropagation();psAddPart('${p.id}')"><i class="ti ti-plus" style="font-size:10px;"></i> Add</button>`;
    });
  }

  // ── Global handlers ───────────────────────────────────────────────────────────
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
  window.psQtyAdj = function(partId, delta) {
    const cart = getActiveCart();
    const item = cart.find(c=>c.id===partId);
    if (!item) return;
    const newQty = Math.max(1, (item.qty||1) + delta);
    if (_woId) Store.updateWoCartQty(_woId, partId, newQty);
    else Store.updateCartQty(partId, newQty);
    renderDetail();
    refreshRows();
  };
  window.psDiagTab = function(modelId, compName, idx) {
    const key = modelId + '~' + (compName || '');
    _diagTab[key] = idx;
    renderCenter();
    setTimeout(() => wireupDiagram(modelId, compName || null, _nav.subName), 0);
  };
  window.psOpenManual = function(manId) {
    const m = Store.getManuals('').find(x => x.id === manId);
    if (!m) return;
    const iconClass = m.type === 'Service' ? 'ti-file-text' : m.type === 'Parts' ? 'ti-schema' : m.type === 'Operator' ? 'ti-book' : 'ti-file';
    const iconStyle = m.type === 'Service' ? 'background:#FCEBEB;color:#A32D2D;' : m.type === 'Parts' ? 'background:#EEEDFE;color:#534AB7;' : m.type === 'Operator' ? 'background:#E6F1FB;color:#185FA5;' : 'background:#EAF3DE;color:#3B6D11;';
    const body = '<div style="display:flex;gap:16px;align-items:flex-start;padding:4px 0 16px;">'
      + '<div style="width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;' + iconStyle + '"><i class="ti ' + iconClass + '"></i></div>'
      + '<div><div style="font-size:15px;font-weight:700;color:#111318;margin-bottom:4px;">' + m.title + '</div>'
      + '<div style="font-size:12px;color:#7A7F8E;">' + m.machine + ' · ' + m.type + ' Manual · ' + m.year + '</div>'
      + '<div style="font-size:12px;color:#7A7F8E;margin-top:2px;">' + m.pages + ' pages · ' + m.size + '</div></div></div>'
      + '<div style="background:#F5F2EE;border-radius:8px;padding:12px 14px;font-size:12px;color:#5A5F6E;">'
      + '<strong>Publisher:</strong> ' + m.vendor + ' &nbsp;·&nbsp; <strong>Rev:</strong> ' + (m.year||'—')
      + '</div>';
    Modal.show({ title: m.title, body: body, actions: [
      { label: 'Download', onClick: function() { Modal.close(); setTimeout(function() { Modal.show({ title: 'Download started', body: '<div style="text-align:center;padding:20px;"><i class="ti ti-download" style="font-size:40px;color:#3B6D11;"></i><p style="margin-top:12px;font-size:14px;font-weight:600;color:#111318;">' + m.title + '</p><p style="font-size:13px;color:#7A7F8E;margin-top:4px;">' + m.size + ' · Download in progress</p></div>', actions: [{label:'OK',primary:true,onClick:function(){Modal.close();}}] }); }, 0); } },
      { label: 'Close', primary: true, onClick: function() { Modal.close(); } }
    ] });
  };

  window.psNavFromWo = function(woId) {
    const wo = Store.getWorkOrder(woId); if(!wo) return;
    const eq = EQUIPMENT.find(e=>e.asset===wo.asset); if(!eq) return;
    _nav={supplierId:eq.supplierId,modelId:eq.modelId,compName:null,subName:null};
    _expanded.add(eq.supplierId); _expanded.add(eq.modelId);
    renderAll();
  };

  function renderAll() {
    // Hide tree panel on supplier landing (no model selected) so the full-width banner shows cleanly
    const treePanel = document.getElementById('ps-tree');
    const onSupplierLanding = _nav.supplierId && !_nav.modelId && !(_searchMode==='keyword' && _searchQuery.trim());
    if (treePanel) treePanel.style.display = onSupplierLanding ? 'none' : '';
    renderTree(); renderCenter(); renderDetail(); renderBreadcrumb();
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  renderSearchBar();
  renderAll();
  if (_nav.modelId && _centerView==='diagram') setTimeout(()=>wireupDiagram(_nav.modelId,_nav.compName,_nav.subName),0);
}
