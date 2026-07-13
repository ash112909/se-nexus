function render_home(el) {
  const _user = Store.getCurrentUser();
  const _isSupervisor = _user && _user.role === 'supervisor';
  const _firstName = _user ? _user.displayName.split(' ')[0] : 'there';
  const loc = Store.getCurrentLocation();
  const locName = loc ? loc.name : (_isSupervisor ? 'All locations' : 'Mid-County Rental');
  const activeWOs = Store.getWorkOrders('active', _isSupervisor ? null : (_user ? _user.shortName : null));

  // ── Suppliers ────────────────────────────────────────────────────────────
  const SUPPLIERS = [
    { id:'skyjack',    name:'Skyjack',         category:'OEM · Aerial Work Platforms', icon:'ti-crane',         color:'#F5A623', bg:'#1A1200', tagline:'SJIII scissor lifts · boom lifts',          specialty:['Scissor Lifts','Boom Lifts','Telehandlers'], parts:34 },
    { id:'caterpillar',name:'Caterpillar',      category:'OEM · Heavy Equipment',       icon:'ti-backhoe',       color:'#1A1200', bg:'#F5A623', tagline:'Cat 320 excavators · undercarriage',          specialty:['Excavators','Track Systems','Undercarriage'], parts:18 },
    { id:'toyota',     name:'Toyota MH',        category:'OEM · Material Handling',     icon:'ti-forklift',      color:'#B91C1C', bg:'#FEE2E2', tagline:'8FGU25 forklifts · mast systems',             specialty:['Forklifts','Mast Systems','Electric Lifts'], parts:22 },
    { id:'bobcat',     name:'Bobcat',           category:'OEM · Compact Equipment',     icon:'ti-bulldozer',     color:'#C2410C', bg:'#FFF7ED', tagline:'S650 / S770 skid steers · attachments',      specialty:['Skid Steers','Attachments','Drive Systems'], parts:16 },
    { id:'parker',     name:'Parker Hannifin',  category:'Aftermarket · Hydraulics',    icon:'ti-droplet',       color:'#185FA5', bg:'#E6F1FB', tagline:'Hose assemblies · valves · cylinders',        specialty:['Hose Assemblies','Control Valves','Cylinders'], parts:12 },
    { id:'grainger',   name:'Grainger',         category:'Distributor · MRO Supply',    icon:'ti-package',       color:'#0F6E56', bg:'#E1F5EE', tagline:'Fasteners · lubricants · electrical · safety', specialty:['Fasteners','Lubricants','Electrical','Safety'], parts:40 },
    { id:'trelleborg', name:'Trelleborg',       category:'Aftermarket · Sealing',       icon:'ti-circle-dashed', color:'#534AB7', bg:'#EEEDFE', tagline:'Hydraulic seals · O-rings · custom kits',     specialty:['Hydraulic Seals','O-rings','Custom Kits'], parts:8 },
  ];

  // ── News ─────────────────────────────────────────────────────────────────
  function getNewsItems() {
    const cms = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).map(a => ({
      id:a.id, type:a.type||'notice', poster:a.poster||'Mid-County Rental',
      date:a.postedDate||'', dateLabel:a.postedDate||'',
      priority:a.priority||'medium', title:a.title, summary:a.summary||'',
    }));
    const all = [...cms, ...(typeof NEWS_ARTICLES!=='undefined'
      ? NEWS_ARTICLES.filter(n => !cms.find(c => c.id===n.id)) : [])];
    all.sort((a,b) => (b.date||'').localeCompare(a.date||''));
    return all.slice(0,5);
  }

  const TYPE_META = {
    bulletin:{ label:'Service Bulletin', color:'#854F0B', bg:'#FAEEDA', icon:'ti-alert-triangle' },
    fleet:   { label:'Fleet Update',     color:'#185FA5', bg:'#E6F1FB', icon:'ti-building'       },
    supplier:{ label:'Supplier News',    color:'#534AB7', bg:'#EEEDFE', icon:'ti-news'            },
    warranty:{ label:'Warranty',         color:'#0F6E56', bg:'#E1F5EE', icon:'ti-shield-check'   },
    safety:  { label:'Safety Alert',     color:'#B91C1C', bg:'#FEE2E2', icon:'ti-alert-octagon'  },
    pricing: { label:'Pricing',          color:'#6B7280', bg:'#F3F4F6', icon:'ti-tag'            },
    training:{ label:'Training',         color:'#5B21B6', bg:'#EDE9FE', icon:'ti-certificate'    },
    notice:  { label:'Notice',           color:'#374151', bg:'#F9FAFB', icon:'ti-info-circle'    },
  };
  const PRI_COLOR = { critical:'#B91C1C', high:'#C2410C', medium:'#B45309', low:'#6B7280' };

  // ── Carousel ─────────────────────────────────────────────────────────────
  const SLIDES = [
    { icon:'ti-crane',        iconBg:'#1A1200', iconColor:'#F5A623', accent:'#F5A623', bg:'#1C1E2A',
      eyebrow:'Fleet highlight', title:'2 new Bobcat S770 units arriving Jul 8',
      body:'Pre-delivery inspection checklists are ready. Assign intake work orders before the delivery date.',
      cta:'Create intake WO', ctaFn:"sendPrompt('Open work orders list')" },
    { icon:'ti-shield-check', iconBg:'#0F6E56', iconColor:'#FFF', accent:'#34D399', bg:'#0D2218',
      eyebrow:'Warranty alert', title:'Toyota FL-031 warranty expires Dec 2026',
      body:'Submit outstanding warranty claims before coverage ends.',
      cta:'View WO #100103', ctaFn:"Router.navigate('wo-detail',{woId:100103})" },
    { icon:'ti-speakerphone', iconBg:'#534AB7', iconColor:'#FFF', accent:'#A78BFA', bg:'#1A1730',
      eyebrow:'Platform update', title:'SmartEquip training — Jun 11, 2:00 PM',
      body:'Covers parts diagrams, the diagnostic assistant, and updated work order workflow.',
      cta:'Read more', ctaFn:"sendPrompt('Open news and updates')" },
    { icon:'ti-tag',          iconBg:'#185FA5', iconColor:'#FFF', accent:'#60A5FA', bg:'#0F1E33',
      eyebrow:'Pricing notice', title:'Caterpillar parts +3–5% effective Jul 1',
      body:'Track adjuster and undercarriage parts are affected. Review open POs before Jun 30.',
      cta:'View news', ctaFn:"sendPrompt('Open news and updates')" },
  ];

  function slideHtml(s, active) {
    return `<div class="home-slide${active?' active':''}" style="background:${s.bg};">
      <div style="width:40px;height:40px;border-radius:10px;background:${s.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:14px;">
        <i class="ti ${s.icon}" style="font-size:19px;color:${s.iconColor};"></i>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${s.accent};margin-bottom:4px;">${s.eyebrow}</div>
        <div style="font-size:14px;font-weight:700;color:#FFFFFF;line-height:1.35;margin-bottom:4px;">${s.title}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.55;margin-bottom:11px;">${s.body}</div>
        <button onclick="${s.ctaFn}" style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:${s.accent};color:#111318;border:none;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">${s.cta} <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
      </div>
    </div>`;
  }

  function newsCard(n) {
    const m = TYPE_META[n.type]||TYPE_META.notice;
    return `<div class="hn-card" onclick="newsOpenArticle('${n.id}')">
      <div class="hn-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
      <div class="hn-body">
        <div class="hn-type" style="color:${m.color};">${m.label}</div>
        <div class="hn-title">${n.title}</div>
        <div class="hn-sub">${n.summary}</div>
      </div>
      <div class="hn-date">${n.dateLabel||n.date||''}</div>
    </div>`;
  }

  function supplierRow(s) {
    return `<div class="hs-row" onclick="homeOpenSupplier('${s.id}')">
      <div class="hs-icon" style="background:${s.bg};color:${s.color};"><i class="ti ${s.icon}"></i></div>
      <div class="hs-body">
        <div class="hs-name">${s.name}</div>
        <div class="hs-cat">${s.category}</div>
      </div>
      <div class="hs-right">
        <div class="hs-parts">${s.parts} <span>parts</span></div>
        <i class="ti ti-chevron-right hs-chev"></i>
      </div>
    </div>`;
  }

  el.innerHTML = `
<style>
.home-main { flex:1; overflow-y:auto; }
.home-pg { max-width:980px; margin:0 auto; padding:0 0 48px; }

/* Hero banner */
.home-hero { background:#111318; padding:28px 32px 26px; position:relative; overflow:hidden; }
.home-hero::after { content:''; position:absolute; right:-60px; top:-60px; width:280px; height:280px; border-radius:50%; background:rgba(245,166,35,.06); pointer-events:none; }
.home-hero-inner { display:flex; align-items:center; gap:24px; flex-wrap:wrap; position:relative; }
.home-hero-brand { display:flex; align-items:center; gap:12px; flex-shrink:0; }
.home-hero-mark { width:46px; height:46px; background:#F5A623; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.home-hero-name { font-size:20px; font-weight:800; color:#FFF; letter-spacing:-.3px; line-height:1.1; }
.home-hero-powered { font-size:10px; color:rgba(255,255,255,.35); letter-spacing:.3px; margin-top:2px; }
.home-hero-divider { width:1px; height:40px; background:rgba(255,255,255,.1); flex-shrink:0; }
.home-hero-greeting { color:rgba(255,255,255,.55); font-size:13px; line-height:1.5; }
.home-hero-greeting strong { color:#FFF; }
.home-hero-loc { font-size:11px; color:rgba(255,255,255,.3); margin-top:2px; display:flex; align-items:center; gap:4px; }
.home-hero-stats { display:flex; gap:10px; margin-left:auto; flex-shrink:0; }
.home-hero-stat { background:rgba(255,255,255,.07); border-radius:9px; padding:10px 16px; text-align:center; min-width:72px; }
.home-hero-stat-val { font-size:22px; font-weight:800; color:#FFF; line-height:1; }
.home-hero-stat-lbl { font-size:9px; color:rgba(255,255,255,.4); margin-top:3px; letter-spacing:.3px; }
.home-hero-cta { background:#F5A623; color:#1A1200; border:none; border-radius:9px; padding:10px 20px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:7px; flex-shrink:0; white-space:nowrap; }
.home-hero-cta:hover { background:#E8980F; }

/* Two-col body */
.home-cols { display:grid; grid-template-columns:1fr 300px; gap:0; }
.home-col-left { padding:24px 24px 0 32px; }
.home-col-right { border-left:0.5px solid #E8E4DF; padding:20px 18px; }

/* Section headers */
.h-sec-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.h-sec-lbl { font-size:11px; font-weight:700; color:#111318; display:flex; align-items:center; gap:5px; letter-spacing:.1px; }
.h-sec-all { font-size:11px; color:#9CA3AF; cursor:pointer; display:flex; align-items:center; gap:3px; }
.h-sec-all:hover { color:#5A5F6E; }

/* Carousel */
.home-carousel { border-radius:11px; overflow:hidden; margin-bottom:22px; }
.home-slide { display:none; padding:18px 20px; align-items:flex-start; }
.home-slide.active { display:flex; }
.home-car-nav { display:flex; align-items:center; gap:5px; margin-top:8px; margin-bottom:22px; }
.home-dot { width:6px; height:6px; border-radius:50%; background:#E2DDD8; border:none; cursor:pointer; padding:0; transition:all .15s; }
.home-dot.active { background:#111318; width:16px; border-radius:3px; }
.home-car-arrows { display:flex; gap:4px; margin-left:auto; }
.home-arr { width:24px; height:24px; border:0.5px solid #E2DDD8; border-radius:5px; background:#FFF; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; color:#5A5F6E; }
.home-arr:hover { background:#F5F2EE; }

/* News cards */
.hn-card { display:flex; align-items:flex-start; gap:10px; background:#FFF; border:0.5px solid #E8E4DF; border-radius:9px; padding:11px 12px; cursor:pointer; margin-bottom:7px; }
.hn-card:hover { border-color:#C8C3BC; }
.hn-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.hn-body { flex:1; min-width:0; }
.hn-type { font-size:9px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; margin-bottom:2px; }
.hn-title { font-size:12px; font-weight:600; color:#111318; line-height:1.4; margin-bottom:1px; }
.hn-sub { font-size:11px; color:#9CA3AF; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hn-date { font-size:10px; color:#C0BAB3; white-space:nowrap; padding-top:1px; flex-shrink:0; }

/* Supplier rows */
.hs-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:0.5px solid #F0ECE8; cursor:pointer; }
.hs-row:last-child { border-bottom:none; }
.hs-row:hover .hs-name { color:#F5A623; }
.hs-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.hs-body { flex:1; min-width:0; }
.hs-name { font-size:12px; font-weight:600; color:#111318; transition:color .12s; }
.hs-cat { font-size:10px; color:#9CA3AF; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hs-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.hs-parts { font-size:13px; font-weight:700; color:#111318; white-space:nowrap; }
.hs-parts span { font-size:9px; font-weight:500; color:#9CA3AF; margin-left:2px; }
.hs-chev { font-size:12px; color:#D1CBC4; }
</style>

<div class="shell">
  ${buildSidebar('home')}
  <div class="main home-main">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Home</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div class="home-pg">

      <!-- Hero -->
      <div class="home-hero">
        <div class="home-hero-inner">
          <div class="home-hero-brand">
            <div class="home-hero-mark">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16L11 6L18 16" stroke="#1A1200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="17.5" r="2.2" fill="#1A1200"/></svg>
            </div>
            <div>
              <div class="home-hero-name">Mid-County Rental</div>
              <div class="home-hero-powered">Powered by SmartEquip</div>
            </div>
          </div>
          <div class="home-hero-divider"></div>
          <div>
            <div class="home-hero-greeting">Welcome back, <strong>${_firstName}</strong>.</div>
            <div class="home-hero-loc"><i class="ti ti-map-pin" style="font-size:10px;"></i>${locName}</div>
          </div>
          <div class="home-hero-stats">
            <div class="home-hero-stat">
              <div class="home-hero-stat-val">${activeWOs.length}</div>
              <div class="home-hero-stat-lbl">Active WOs</div>
            </div>
            <div class="home-hero-stat">
              <div class="home-hero-stat-val">3</div>
              <div class="home-hero-stat-lbl">Branches</div>
            </div>
            <div class="home-hero-stat">
              <div class="home-hero-stat-val">${SUPPLIERS.length}</div>
              <div class="home-hero-stat-lbl">Suppliers</div>
            </div>
          </div>
          <button class="home-hero-cta" onclick="sendPrompt('Go back to dashboard')">
            <i class="ti ti-layout-dashboard" style="font-size:15px;"></i> Go to dashboard
          </button>
        </div>
      </div>

      <!-- Two-col body -->
      <div class="home-cols">

        <!-- Left: carousel + news -->
        <div class="home-col-left">
          <div class="h-sec-hdr" style="margin-top:4px;">
            <div class="h-sec-lbl"><i class="ti ti-speakerphone" style="color:#F5A623;font-size:13px;"></i> Fleet highlights</div>
            <div style="display:flex;gap:4px;" class="home-car-arrows">
              <button class="home-arr" onclick="homeGoSlide((window._homeSlide-1+${SLIDES.length})%${SLIDES.length})"><i class="ti ti-chevron-left"></i></button>
              <button class="home-arr" onclick="homeGoSlide((window._homeSlide+1)%${SLIDES.length})"><i class="ti ti-chevron-right"></i></button>
            </div>
          </div>
          <div class="home-carousel" id="home-carousel">
            ${SLIDES.map((s, i) => slideHtml(s, i === 0)).join('')}
          </div>
          <div class="home-car-nav" id="home-dots">
            ${SLIDES.map((_, i) => `<button class="home-dot${i===0?' active':''}" onclick="homeGoSlide(${i})"></button>`).join('')}
          </div>

          <div class="h-sec-hdr">
            <div class="h-sec-lbl"><i class="ti ti-news" style="color:#9CA3AF;font-size:13px;"></i> Fleet news &amp; updates</div>
            <div class="h-sec-all" onclick="sendPrompt('Open news and updates')">View all <i class="ti ti-arrow-right" style="font-size:10px;"></i></div>
          </div>
          ${getNewsItems().map(newsCard).join('')}
        </div>

        <!-- Right: supplier directory -->
        <div class="home-col-right">
          <div class="h-sec-hdr">
            <div class="h-sec-lbl"><i class="ti ti-building-store" style="color:#9CA3AF;font-size:13px;"></i> Suppliers</div>
            <span style="font-size:10px;font-weight:700;background:#F0ECE8;color:#7A7F8E;border-radius:999px;padding:1px 7px;">${SUPPLIERS.length}</span>
          </div>
          ${SUPPLIERS.map(supplierRow).join('')}
        </div>

      </div>
    </div>
  </div>
</div>`;

  // Carousel
  window._homeSlide = 0;
  window.homeGoSlide = function(idx) {
    el.querySelectorAll('.home-slide').forEach((s, i) => s.classList.toggle('active', i === idx));
    el.querySelectorAll('.home-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    window._homeSlide = idx;
  };
  let _t = setInterval(() => {
    if (!document.getElementById('home-carousel')) { clearInterval(_t); return; }
    homeGoSlide((window._homeSlide + 1) % SLIDES.length);
  }, 6000);

  // Supplier modal
  window.homeOpenSupplier = function(id) {
    const s = SUPPLIERS.find(x => x.id === id);
    if (!s) return;
    Modal.show({
      title: s.name,
      body: `<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
        <div style="width:52px;height:52px;border-radius:13px;background:${s.bg};color:${s.color};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;"><i class="ti ${s.icon}"></i></div>
        <div>
          <div style="font-size:16px;font-weight:700;color:#111318;">${s.name}</div>
          <div style="font-size:12px;color:#9CA3AF;margin-top:2px;">${s.category}</div>
          <div style="font-size:12px;color:#5A5F6E;margin-top:3px;">${s.tagline}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#F5F2EE;border-radius:9px;padding:12px 14px;">
          <div style="font-size:11px;color:#9CA3AF;">Parts on file</div>
          <div style="font-size:22px;font-weight:800;color:#111318;">${s.parts}</div>
        </div>
        <div style="background:#F5F2EE;border-radius:9px;padding:12px 14px;">
          <div style="font-size:11px;color:#9CA3AF;">Specialties</div>
          <div style="font-size:13px;font-weight:600;color:#111318;margin-top:2px;">${s.specialty.length}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${s.specialty.map(t => `<span style="background:#FFF;border:0.5px solid #E2DDD8;border-radius:6px;padding:4px 10px;font-size:12px;color:#3A3D4A;">${t}</span>`).join('')}
      </div>`,
      actions: [
        { label:'Search parts', primary:true, onClick:() => { Modal.close(); sendPrompt('Open Parts Search scoped to WO #100094'); } },
        { label:'Close', onClick:() => Modal.close() },
      ],
    });
  };
}
