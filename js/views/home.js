function render_home(el) {
  const _user = Store.getCurrentUser();
  const _isSupervisor = _user && _user.role === 'supervisor';
  const _firstName = _user ? _user.displayName.split(' ')[0] : 'there';
  const loc = Store.getCurrentLocation();
  const locName = loc ? loc.name : (_isSupervisor ? 'All locations' : 'Mid-County Rental');
  const activeWOs = Store.getWorkOrders('active', _isSupervisor ? null : (_user ? _user.shortName : null));

  const SUPPLIERS = [
    { id:'skyjack',    name:'Skyjack',        category:'Aerial / OEM',      icon:'ti-crane',         color:'#854F0B', bg:'#FAEEDA' },
    { id:'caterpillar',name:'Caterpillar',     category:'Heavy / OEM',       icon:'ti-backhoe',       color:'#1A1200', bg:'#F5A623' },
    { id:'toyota',     name:'Toyota MH',       category:'Material / OEM',    icon:'ti-forklift',      color:'#B91C1C', bg:'#FEE2E2' },
    { id:'bobcat',     name:'Bobcat',          category:'Compact / OEM',     icon:'ti-bulldozer',     color:'#C2410C', bg:'#FFF0E6' },
    { id:'parker',     name:'Parker Hannifin', category:'Hydraulics / Afmkt', icon:'ti-droplet',       color:'#185FA5', bg:'#DBEAFE' },
    { id:'grainger',   name:'Grainger',        category:'MRO / Distributor', icon:'ti-package',       color:'#0F6E56', bg:'#D1FAE5' },
    { id:'trelleborg', name:'Trelleborg',      category:'Sealing / Afmkt',   icon:'ti-circle-dashed', color:'#534AB7', bg:'#EDE9FE' },
  ];

  function getNewsItems() {
    const cms = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).map(a => ({
      id:a.id, type:a.type||'notice', date:a.postedDate||'', dateLabel:a.postedDate||'',
      title:a.title, summary:a.summary||'',
    }));
    const all = [...cms, ...(typeof NEWS_ARTICLES!=='undefined'
      ? NEWS_ARTICLES.filter(n => !cms.find(c=>c.id===n.id)) : [])];
    all.sort((a,b) => (b.date||'').localeCompare(a.date||''));
    return all.slice(0,4);
  }

  const TYPE_META = {
    bulletin:{ label:'Service Bulletin', color:'#854F0B', bg:'#FAEEDA', icon:'ti-alert-triangle' },
    fleet:   { label:'Fleet Update',     color:'#185FA5', bg:'#DBEAFE', icon:'ti-building'       },
    supplier:{ label:'Supplier News',    color:'#534AB7', bg:'#EDE9FE', icon:'ti-news'            },
    warranty:{ label:'Warranty',         color:'#0F6E56', bg:'#D1FAE5', icon:'ti-shield-check'   },
    safety:  { label:'Safety Alert',     color:'#B91C1C', bg:'#FEE2E2', icon:'ti-alert-octagon'  },
    pricing: { label:'Pricing',          color:'#6B7280', bg:'#F3F4F6', icon:'ti-tag'            },
    training:{ label:'Training',         color:'#5B21B6', bg:'#EDE9FE', icon:'ti-certificate'    },
    notice:  { label:'Notice',           color:'#374151', bg:'#F9FAFB', icon:'ti-info-circle'    },
  };

  const SLIDES = [
    { icon:'ti-crane',        iconBg:'#FAEEDA', iconColor:'#854F0B', accent:'#F5A623', bg:'#1C1F2E',
      eyebrow:'Fleet highlight', title:'2 new Bobcat S770 units arriving Jul 8',
      body:'Pre-delivery inspection checklists are ready. Assign intake work orders before delivery.',
      cta:'Create intake WO', ctaFn:"sendPrompt('Open work orders list')" },
    { icon:'ti-shield-check', iconBg:'#D1FAE5', iconColor:'#0F6E56', accent:'#34D399', bg:'#0E2218',
      eyebrow:'Warranty alert', title:'Toyota FL-031 warranty expires Dec 2026',
      body:'Submit outstanding warranty claims before coverage lapses.',
      cta:'View WO #100103', ctaFn:"Router.navigate('wo-detail',{woId:100103})" },
    { icon:'ti-speakerphone', iconBg:'#EDE9FE', iconColor:'#534AB7', accent:'#A78BFA', bg:'#19163A',
      eyebrow:'Platform update', title:'SmartEquip training — Jun 11, 2:00 PM',
      body:'Covers parts diagrams, the diagnostic assistant, and updated work order workflow.',
      cta:'Read more', ctaFn:"sendPrompt('Open news and updates')" },
    { icon:'ti-tag',          iconBg:'#DBEAFE', iconColor:'#185FA5', accent:'#60A5FA', bg:'#0E1E38',
      eyebrow:'Pricing notice', title:'Caterpillar parts +3–5% effective Jul 1',
      body:'Track adjuster and undercarriage parts affected. Review open POs before Jun 30.',
      cta:'View news', ctaFn:"sendPrompt('Open news and updates')" },
  ];

  el.innerHTML = `
<style>
/* ── Layout shell ─────────────────────────────────────── */
.home-main { flex:1; overflow-y:auto; background:#F5F2EE; }
.home-body  { padding:24px 28px 48px; }

/* ── Welcome bar ──────────────────────────────────────── */
.home-welcome { background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; padding:18px 28px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.hw-brand     { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.hw-mark      { width:38px; height:38px; background:#F5A623; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hw-name      { font-size:15px; font-weight:800; color:#111318; letter-spacing:-.3px; line-height:1.15; }
.hw-sub       { font-size:10px; color:#ABA6A0; margin-top:1px; }
.hw-sep       { width:1px; height:30px; background:#E8E4DF; flex-shrink:0; }
.hw-greet     { font-size:13px; color:#5A5F6E; line-height:1.5; }
.hw-greet strong { color:#111318; font-weight:700; }
.hw-loc       { font-size:11px; color:#ABA6A0; display:flex; align-items:center; gap:3px; margin-top:1px; }
.hw-stats     { display:flex; gap:6px; margin-left:auto; }
.hw-stat      { text-align:center; padding:7px 14px; background:#F5F2EE; border-radius:8px; min-width:64px; }
.hw-stat-val  { font-size:18px; font-weight:800; color:#111318; line-height:1; }
.hw-stat-lbl  { font-size:9px; color:#9CA3AF; margin-top:2px; letter-spacing:.2px; white-space:nowrap; }
.hw-cta       { background:#F5A623; color:#1A1200; border:none; border-radius:8px; padding:9px 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; flex-shrink:0; }
.hw-cta:hover { background:#E8980F; }

/* ── Two-col grid ─────────────────────────────────────── */
.home-grid   { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:start; }
.home-left   {}
.home-right  {}

/* ── Section label ────────────────────────────────────── */
.h-lbl { font-size:11px; font-weight:700; color:#3A3D4A; letter-spacing:.1px; display:flex; align-items:center; gap:5px; margin-bottom:10px; }
.h-lbl-action { margin-left:auto; font-size:11px; font-weight:400; color:#ABA6A0; cursor:pointer; display:flex; align-items:center; gap:3px; }
.h-lbl-action:hover { color:#5A5F6E; }

/* ── Carousel ─────────────────────────────────────────── */
.home-car-wrap { background:#111318; border-radius:12px; overflow:hidden; margin-bottom:8px; }
.home-slide    { display:none; padding:22px 22px 20px; align-items:flex-start; gap:14px; }
.home-slide.active { display:flex; }
.home-car-footer { display:flex; align-items:center; padding:0 4px 14px 4px; }
.home-dot  { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.2); border:none; cursor:pointer; padding:0; margin-right:5px; transition:all .15s; }
.home-dot.active { background:#F5A623; width:16px; border-radius:3px; }
.home-arr  { width:26px; height:26px; border:0.5px solid rgba(255,255,255,.12); border-radius:6px; background:rgba(255,255,255,.06); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; color:rgba(255,255,255,.5); margin-left:4px; }
.home-arr:hover { background:rgba(255,255,255,.12); color:#FFF; }

/* ── News cards ───────────────────────────────────────── */
.hn-card  { display:flex; align-items:flex-start; gap:10px; background:#FFF; border:0.5px solid #E8E4DF; border-radius:9px; padding:11px 12px; cursor:pointer; margin-bottom:7px; }
.hn-card:hover { border-color:#C8C3BC; }
.hn-icon  { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:1px; }
.hn-type  { font-size:9px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; margin-bottom:1px; }
.hn-title { font-size:12px; font-weight:600; color:#111318; line-height:1.4; }
.hn-sub   { font-size:11px; color:#9CA3AF; line-height:1.4; margin-top:1px; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
.hn-date  { font-size:10px; color:#C0BAB3; white-space:nowrap; flex-shrink:0; padding-top:1px; margin-left:auto; padding-left:10px; }

/* ── Supplier cards (2×grid) ──────────────────────────── */
.hs-grid  { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.hs-card  { background:#FFF; border:0.5px solid #E8E4DF; border-radius:10px; padding:12px 12px 10px; cursor:pointer; transition:border-color .12s, box-shadow .12s; }
.hs-card:hover { border-color:#C8C3BC; box-shadow:0 2px 8px rgba(0,0,0,.06); }
.hs-icon  { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; margin-bottom:8px; }
.hs-name  { font-size:12px; font-weight:700; color:#111318; line-height:1.2; }
.hs-cat   { font-size:10px; color:#9CA3AF; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
</style>

<div class="shell">
  ${buildSidebar('home')}
  <div class="main home-main">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Home</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <!-- Welcome bar -->
    <div class="home-welcome">
      <div class="hw-brand">
        <img src="smartequiplogo.jpeg" style="height:28px;width:auto;object-fit:contain;display:block;"/>
      </div>
      <div class="hw-sep"></div>
      <div>
        <div class="hw-greet">Welcome back, <strong>${_firstName}</strong>.</div>
        <div class="hw-loc"><i class="ti ti-map-pin" style="font-size:10px;"></i>${locName}</div>
      </div>
      <div class="hw-stats">
        <div class="hw-stat">
          <div class="hw-stat-val">${activeWOs.length}</div>
          <div class="hw-stat-lbl">Active WOs</div>
        </div>
        <div class="hw-stat">
          <div class="hw-stat-val">3</div>
          <div class="hw-stat-lbl">Branches</div>
        </div>
        <div class="hw-stat">
          <div class="hw-stat-val">${SUPPLIERS.length}</div>
          <div class="hw-stat-lbl">Suppliers</div>
        </div>
      </div>
      <button class="hw-cta" onclick="sendPrompt('Go back to dashboard')">
        <i class="ti ti-layout-dashboard" style="font-size:14px;"></i> Dashboard
      </button>
    </div>

    <div class="home-body">
      <div class="home-grid">

        <!-- Left: carousel + news -->
        <div class="home-left">
          <div class="h-lbl"><i class="ti ti-speakerphone" style="color:#F5A623;"></i> Fleet highlights</div>
          <div class="home-car-wrap">
            ${SLIDES.map((s, i) => `
            <div class="home-slide${i===0?' active':''}" style="background:${s.bg};" id="hslide-${i}">
              <div style="width:38px;height:38px;border-radius:9px;background:${s.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ${s.icon}" style="font-size:18px;color:${s.iconColor};"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:9px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${s.accent};margin-bottom:4px;">${s.eyebrow}</div>
                <div style="font-size:14px;font-weight:700;color:#FFF;line-height:1.35;margin-bottom:5px;">${s.title}</div>
                <div style="font-size:11px;color:rgba(255,255,255,.45);line-height:1.55;margin-bottom:13px;">${s.body}</div>
                <button onclick="${s.ctaFn}" style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:${s.accent};color:#111318;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">${s.cta} <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
              </div>
            </div>`).join('')}
            <div class="home-car-footer">
              ${SLIDES.map((_, i) => `<button class="home-dot${i===0?' active':''}" onclick="homeGoSlide(${i})"></button>`).join('')}
              <div style="margin-left:auto;display:flex;gap:4px;">
                <button class="home-arr" onclick="homeGoSlide((window._homeSlide-1+${SLIDES.length})%${SLIDES.length})"><i class="ti ti-chevron-left"></i></button>
                <button class="home-arr" onclick="homeGoSlide((window._homeSlide+1)%${SLIDES.length})"><i class="ti ti-chevron-right"></i></button>
              </div>
            </div>
          </div>

          <div class="h-lbl" style="margin-top:20px;">
            <i class="ti ti-news" style="color:#ABA6A0;"></i> Fleet news &amp; updates
            <span class="h-lbl-action" onclick="sendPrompt('Open news and updates')">View all <i class="ti ti-arrow-right" style="font-size:10px;"></i></span>
          </div>
          ${getNewsItems().map(n => {
            const m = TYPE_META[n.type]||TYPE_META.notice;
            return `<div class="hn-card" onclick="newsOpenArticle('${n.id}')">
              <div class="hn-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
              <div style="flex:1;min-width:0;">
                <div class="hn-type" style="color:${m.color};">${m.label}</div>
                <div class="hn-title">${n.title}</div>
                <div class="hn-sub">${n.summary}</div>
              </div>
              <div class="hn-date">${n.dateLabel||n.date||''}</div>
            </div>`;
          }).join('')}
        </div>

        <!-- Right: suppliers -->
        <div class="home-right">
          <div class="h-lbl">
            <i class="ti ti-building-store" style="color:#ABA6A0;"></i> Suppliers
            <span style="margin-left:2px;font-size:10px;font-weight:700;background:#F0ECE8;color:#7A7F8E;border-radius:999px;padding:1px 7px;">${SUPPLIERS.length}</span>
          </div>
          <div class="hs-grid">
            ${SUPPLIERS.map(s => `
            <div class="hs-card" onclick="homeOpenSupplier('${s.id}')">
              <div class="hs-icon" style="background:${s.bg};color:${s.color};"><i class="ti ${s.icon}"></i></div>
              <div class="hs-name">${s.name}</div>
              <div class="hs-cat">${s.category}</div>
            </div>`).join('')}
          </div>
        </div>

      </div>
    </div>
  </div>
</div>`;

  // Carousel
  window._homeSlide = 0;
  window.homeGoSlide = function(idx) {
    el.querySelectorAll('.home-slide').forEach((s, i) => s.classList.toggle('active', i===idx));
    el.querySelectorAll('.home-dot').forEach((d, i) => d.classList.toggle('active', i===idx));
    window._homeSlide = idx;
  };
  let _t = setInterval(() => {
    if (!el.querySelector('.home-car-wrap')) { clearInterval(_t); return; }
    homeGoSlide((window._homeSlide + 1) % SLIDES.length);
  }, 6000);

  // Map home supplier IDs to parts-search catalog IDs (OEM suppliers with full catalog profiles)
  const CATALOG_ID_MAP = { skyjack:'SKJ', caterpillar:'CAT', toyota:'TOY', bobcat:'BOB' };

  window.homeOpenSupplier = function(id) {
    const catalogId = CATALOG_ID_MAP[id];
    if (catalogId) {
      Router.navigate('parts-search', { supplierId: catalogId });
    } else {
      Router.navigate('supplier', { supplierId: id });
    }
  };
}
