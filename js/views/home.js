function render_home(el) {
  const _user = Store.getCurrentUser();
  const _isSupervisor = _user && _user.role === 'supervisor';
  const _firstName = _user ? _user.displayName.split(' ')[0] : 'there';
  const loc = Store.getCurrentLocation();
  const locName = loc ? loc.name : (_isSupervisor ? 'All locations' : 'Mid-County Rental');
  const activeWOs = Store.getWorkOrders('active', _isSupervisor ? null : (_user ? _user.shortName : null));

  // ── Supplier directory ──────────────────────────────────────────────────
  const SUPPLIERS = [
    {
      id: 'skyjack', name: 'Skyjack', category: 'OEM · Aerial Work Platforms',
      icon: 'ti-crane', color: '#F5A623', bg: '#1A1200',
      tagline: 'SJIII scissor lifts · SJ articulating booms',
      specialty: ['Scissor Lifts', 'Boom Lifts', 'Telehandlers'],
      partCount: 34, contact: 'skyjack.com',
    },
    {
      id: 'caterpillar', name: 'Caterpillar', category: 'OEM · Heavy Equipment',
      icon: 'ti-backhoe', color: '#FFFFFF', bg: '#F5A623',
      tagline: 'Cat 320 excavators · undercarriage · track systems',
      specialty: ['Excavators', 'Track Systems', 'Undercarriage'],
      partCount: 18, contact: 'cat.com',
    },
    {
      id: 'toyota', name: 'Toyota MH', category: 'OEM · Material Handling',
      icon: 'ti-forklift', color: '#B91C1C', bg: '#FEE2E2',
      tagline: '8FGU25 forklifts · mast systems · electric',
      specialty: ['Forklifts', 'Mast Systems', 'Electric Lifts'],
      partCount: 22, contact: 'toyotaforklift.com',
    },
    {
      id: 'bobcat', name: 'Bobcat', category: 'OEM · Compact Equipment',
      icon: 'ti-bulldozer', color: '#C2410C', bg: '#FFF7ED',
      tagline: 'S650 / S770 skid steers · quick coupler systems',
      specialty: ['Skid Steers', 'Attachments', 'Drive Systems'],
      partCount: 16, contact: 'bobcat.com',
    },
    {
      id: 'parker', name: 'Parker Hannifin', category: 'Aftermarket · Hydraulics',
      icon: 'ti-droplet', color: '#185FA5', bg: '#E6F1FB',
      tagline: 'Hydraulic hose, valves, cylinders & fittings',
      specialty: ['Hose Assemblies', 'Control Valves', 'Cylinders'],
      partCount: 12, contact: 'parker.com',
    },
    {
      id: 'grainger', name: 'Grainger', category: 'Distributor · MRO Supply',
      icon: 'ti-package', color: '#0F6E56', bg: '#E1F5EE',
      tagline: 'Fasteners, lubricants, electrical & general MRO',
      specialty: ['Fasteners', 'Lubricants', 'Electrical', 'Safety'],
      partCount: 40, contact: 'grainger.com',
    },
    {
      id: 'trelleborg', name: 'Trelleborg', category: 'Aftermarket · Sealing',
      icon: 'ti-circle-dashed', color: '#534AB7', bg: '#EEEDFE',
      tagline: 'Hydraulic seals, O-rings & custom seal kits',
      specialty: ['Hydraulic Seals', 'O-rings', 'Custom Kits'],
      partCount: 8, contact: 'trelleborg.com',
    },
  ];

  // ── News feed ────────────────────────────────────────────────────────────
  function getNewsItems() {
    const cmsPublished = (typeof Store !== 'undefined' && Store.getCmsArticles)
      ? Store.getCmsArticles('published').map(a => ({
          id: a.id, type: a.type || 'notice',
          poster: a.poster || 'Mid-County Rental',
          date: a.postedDate || '', dateLabel: a.postedDate || '',
          priority: a.priority || 'medium',
          title: a.title, summary: a.summary || '', tags: a.tags || [],
        }))
      : [];
    const all = [...cmsPublished, ...(typeof NEWS_ARTICLES !== 'undefined'
      ? NEWS_ARTICLES.filter(n => !cmsPublished.find(c => c.id === n.id))
      : [])];
    all.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return all.slice(0, 5);
  }

  const TYPE_META = {
    bulletin: { label:'Service Bulletin', color:'#854F0B', bg:'#FAEEDA', icon:'ti-alert-triangle' },
    fleet:    { label:'Fleet Update',     color:'#185FA5', bg:'#E6F1FB', icon:'ti-building'       },
    supplier: { label:'Supplier News',    color:'#534AB7', bg:'#EEEDFE', icon:'ti-news'            },
    warranty: { label:'Warranty',         color:'#0F6E56', bg:'#E1F5EE', icon:'ti-shield-check'   },
    safety:   { label:'Safety Alert',     color:'#B91C1C', bg:'#FEE2E2', icon:'ti-alert-octagon'  },
    pricing:  { label:'Pricing',          color:'#6B7280', bg:'#F3F4F6', icon:'ti-tag'            },
    training: { label:'Training',         color:'#5B21B6', bg:'#EDE9FE', icon:'ti-certificate'    },
    notice:   { label:'Notice',           color:'#374151', bg:'#F9FAFB', icon:'ti-info-circle'    },
  };
  const PRIORITY_COLORS = { critical:'#B91C1C', high:'#C2410C', medium:'#B45309', low:'#6B7280' };

  // ── Carousel slides ──────────────────────────────────────────────────────
  const SLIDES = [
    {
      icon: 'ti-crane', iconBg: '#1A1200', iconColor: '#F5A623',
      eyebrow: 'Fleet highlight', accentBg: '#1A1200', accent: '#F5A623',
      title: '2 new Bobcat S770 units arriving Jul 8',
      body: 'Pre-delivery inspection checklists are ready. Assign intake work orders before the delivery date.',
      cta: 'Create intake WO', ctaFn: "sendPrompt('Open work orders list')", ctaStyle: 'background:#F5A623;color:#1A1200;',
    },
    {
      icon: 'ti-shield-check', iconBg: '#0F6E56', iconColor: '#FFFFFF',
      eyebrow: 'Warranty alert', accentBg: '#E1F5EE', accent: '#0F6E56',
      title: 'Toyota 8FGU25 FL-031 warranty expires Dec 2026',
      body: 'Submit outstanding warranty claims before coverage ends. Check the WO for eligible repairs.',
      cta: 'View WO #100103', ctaFn: "Router.navigate('wo-detail',{woId:100103})", ctaStyle: 'background:#0F6E56;color:#FFFFFF;',
    },
    {
      icon: 'ti-speakerphone', iconBg: '#534AB7', iconColor: '#FFFFFF',
      eyebrow: 'Platform update', accentBg: '#EEEDFE', accent: '#534AB7',
      title: 'SmartEquip training session — Jun 11, 2:00 PM',
      body: 'Covers parts diagram view, diagnostic assistant, and updated work order workflow. All technicians welcome.',
      cta: 'Read more', ctaFn: "sendPrompt('Open news and updates')", ctaStyle: 'background:#534AB7;color:#FFFFFF;',
    },
    {
      icon: 'ti-tag', iconBg: '#185FA5', iconColor: '#FFFFFF',
      eyebrow: 'Pricing notice', accentBg: '#E6F1FB', accent: '#185FA5',
      title: 'Caterpillar parts increase effective Jul 1 — 3–5%',
      body: 'Track adjuster and undercarriage parts are affected. Review open POs before Jun 30 to lock current pricing.',
      cta: 'View news', ctaFn: "sendPrompt('Open news and updates')", ctaStyle: 'background:#185FA5;color:#FFFFFF;',
    },
  ];

  function slideHtml(s, active) {
    return `<div class="home-slide${active ? ' active' : ''}" style="background:${s.accentBg};">
      <div style="width:44px;height:44px;border-radius:11px;background:${s.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:16px;">
        <i class="ti ${s.icon}" style="font-size:20px;color:${s.iconColor};"></i>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${s.accent};margin-bottom:5px;">${s.eyebrow}</div>
        <div style="font-size:15px;font-weight:700;color:#111318;line-height:1.35;margin-bottom:5px;">${s.title}</div>
        <div style="font-size:12px;color:#5A5F6E;line-height:1.6;margin-bottom:12px;">${s.body}</div>
        <button onclick="${s.ctaFn}" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;${s.ctaStyle}border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">${s.cta} <i class="ti ti-arrow-right" style="font-size:11px;"></i></button>
      </div>
    </div>`;
  }

  function dotsHtml() {
    return SLIDES.map((_, i) => `<button class="home-dot${i === 0 ? ' active' : ''}" onclick="homeGoSlide(${i})"></button>`).join('');
  }

  function newsCard(n) {
    const m = TYPE_META[n.type] || TYPE_META.notice;
    const pc = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.low;
    return `<div class="home-news-card" onclick="newsOpenArticle('${n.id}')">
      <div class="home-news-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
      <div class="home-news-body">
        <div class="home-news-type" style="color:${m.color};">${m.label}</div>
        <div class="home-news-title">${n.title}</div>
        <div class="home-news-sub">${n.summary}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;">
        <div class="home-news-date">${n.dateLabel || n.date || ''}</div>
        ${n.priority && n.priority !== 'low' ? `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${pc};"></span>` : ''}
      </div>
    </div>`;
  }

  function supplierCard(s) {
    return `<div class="home-sup-card" onclick="homeOpenSupplier('${s.id}')">
      <div class="home-sup-icon" style="background:${s.bg};color:${s.color};">
        <i class="ti ${s.icon}"></i>
      </div>
      <div class="home-sup-body">
        <div class="home-sup-name">${s.name}</div>
        <div class="home-sup-cat">${s.category}</div>
        <div class="home-sup-tagline">${s.tagline}</div>
        <div class="home-sup-tags">
          ${s.specialty.slice(0,2).map(t => `<span class="home-sup-tag">${t}</span>`).join('')}
          ${s.specialty.length > 2 ? `<span class="home-sup-tag">+${s.specialty.length - 2}</span>` : ''}
        </div>
      </div>
      <div class="home-sup-meta">
        <div class="home-sup-parts">${s.partCount}<span>parts</span></div>
        <i class="ti ti-chevron-right home-sup-chevron"></i>
      </div>
    </div>`;
  }

  el.innerHTML = `
<style>
/* ── Layout ── */
.home-main { flex:1; overflow-y:auto; display:flex; flex-direction:column; }
.home-body { display:grid; grid-template-columns:1fr 340px; gap:0; flex:1; min-height:0; }
.home-left { padding:28px 24px 40px; overflow-y:auto; min-width:0; }
.home-right { border-left:0.5px solid #E8E4DF; background:#FAFAF8; display:flex; flex-direction:column; overflow:hidden; }

/* ── Brand hero ── */
.home-brand-bar { background:#111318; padding:28px 24px 24px; color:#FFFFFF; position:relative; overflow:hidden; }
.home-brand-bar::before { content:''; position:absolute; right:-40px; top:-40px; width:220px; height:220px; border-radius:50%; background:rgba(245,166,35,0.08); pointer-events:none; }
.home-brand-bar::after { content:''; position:absolute; right:60px; bottom:-60px; width:160px; height:160px; border-radius:50%; background:rgba(245,166,35,0.05); pointer-events:none; }
.home-brand-logo { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
.home-brand-mark { width:44px; height:44px; background:#F5A623; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.home-brand-fleet { font-size:20px; font-weight:800; color:#FFFFFF; letter-spacing:-0.3px; line-height:1.1; }
.home-brand-tagline { font-size:11px; color:rgba(255,255,255,0.45); letter-spacing:.3px; margin-top:1px; }
.home-brand-greeting { font-size:13px; color:rgba(255,255,255,0.65); line-height:1.55; margin-bottom:16px; }
.home-brand-greeting strong { color:#FFFFFF; }
.home-brand-loc { display:inline-flex; align-items:center; gap:5px; font-size:11px; color:rgba(255,255,255,0.45); margin-bottom:20px; }
.home-stat-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }
.home-stat { background:rgba(255,255,255,0.07); border-radius:9px; padding:11px 12px; }
.home-stat-val { font-size:22px; font-weight:800; color:#FFFFFF; line-height:1; }
.home-stat-lbl { font-size:10px; color:rgba(255,255,255,0.45); margin-top:3px; letter-spacing:.3px; }
.home-cta-btn { display:flex; align-items:center; gap:8px; padding:11px 18px; background:#F5A623; color:#1A1200; border:none; border-radius:9px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; width:100%; justify-content:center; }
.home-cta-btn:hover { background:#E8980F; }

/* ── Carousel ── */
.home-carousel-wrap { margin-bottom:24px; }
.home-section-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.home-section-label { font-size:12px; font-weight:700; color:#111318; display:flex; align-items:center; gap:6px; }
.home-section-viewall { font-size:11px; color:#9CA3AF; cursor:pointer; display:flex; align-items:center; gap:3px; }
.home-section-viewall:hover { color:#5A5F6E; }
.home-carousel { border-radius:11px; border:0.5px solid #E8E4DF; overflow:hidden; background:#FAFAF8; }
.home-slide { display:none; padding:20px; align-items:flex-start; }
.home-slide.active { display:flex; }
.home-carousel-nav { display:flex; align-items:center; gap:5px; margin-top:8px; }
.home-dot { width:6px; height:6px; border-radius:50%; background:#E2DDD8; border:none; cursor:pointer; padding:0; transition:all .15s; }
.home-dot.active { background:#111318; width:16px; border-radius:3px; }
.home-arr { width:26px; height:26px; border:0.5px solid #E2DDD8; border-radius:6px; background:#FFFFFF; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:13px; color:#5A5F6E; margin-left:auto; }
.home-arr:hover { background:#F5F2EE; }

/* ── News ── */
.home-news-card { display:flex; align-items:flex-start; gap:11px; background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:9px; padding:11px 13px; cursor:pointer; margin-bottom:7px; }
.home-news-card:hover { border-color:#C8C3BC; }
.home-news-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.home-news-body { flex:1; min-width:0; }
.home-news-type { font-size:9px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; margin-bottom:2px; }
.home-news-title { font-size:12px; font-weight:600; color:#111318; line-height:1.4; margin-bottom:2px; }
.home-news-sub { font-size:11px; color:#9CA3AF; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.home-news-date { font-size:10px; color:#C0BAB3; white-space:nowrap; }

/* ── Suppliers panel ── */
.home-sup-header { padding:16px 18px 12px; border-bottom:0.5px solid #E8E4DF; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
.home-sup-header-label { font-size:12px; font-weight:700; color:#111318; display:flex; align-items:center; gap:6px; }
.home-sup-list { flex:1; overflow-y:auto; padding:10px 12px 16px; }
.home-sup-card { display:flex; align-items:flex-start; gap:11px; background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:9px; padding:11px 12px; cursor:pointer; margin-bottom:7px; transition:border-color .12s,box-shadow .12s; }
.home-sup-card:hover { border-color:#C8C3BC; box-shadow:0 1px 6px rgba(0,0,0,.06); }
.home-sup-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
.home-sup-body { flex:1; min-width:0; }
.home-sup-name { font-size:12px; font-weight:700; color:#111318; }
.home-sup-cat { font-size:10px; color:#9CA3AF; margin-top:1px; }
.home-sup-tagline { font-size:11px; color:#5A5F6E; margin-top:4px; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.home-sup-tags { display:flex; gap:4px; flex-wrap:wrap; margin-top:5px; }
.home-sup-tag { font-size:9px; font-weight:600; background:#F5F2EE; color:#7A7F8E; border-radius:4px; padding:1px 6px; }
.home-sup-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.home-sup-parts { font-size:16px; font-weight:800; color:#111318; line-height:1; text-align:right; }
.home-sup-parts span { display:block; font-size:9px; font-weight:500; color:#9CA3AF; }
.home-sup-chevron { font-size:13px; color:#C8C3BC; }
.home-sup-search { margin:0 12px 8px; display:flex; align-items:center; gap:7px; background:#FFFFFF; border:0.5px solid #E2DDD8; border-radius:7px; padding:7px 10px; font-size:12px; color:#9CA3AF; cursor:text; }
</style>

<div class="shell">
  ${buildSidebar('home')}
  <div class="main home-main" style="overflow:hidden;">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Home</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div class="home-body">

      <!-- LEFT: branding + carousel + news -->
      <div class="home-left">

        <!-- Carousel -->
        <div class="home-carousel-wrap">
          <div class="home-section-hdr">
            <div class="home-section-label"><i class="ti ti-speakerphone" style="font-size:13px;color:#F5A623;"></i> Fleet highlights</div>
            <div style="display:flex;gap:5px;">
              <button class="home-arr" onclick="homeGoSlide((window._homeSlide-1+${SLIDES.length})%${SLIDES.length})"><i class="ti ti-chevron-left"></i></button>
              <button class="home-arr" style="margin-left:0;" onclick="homeGoSlide((window._homeSlide+1)%${SLIDES.length})"><i class="ti ti-chevron-right"></i></button>
            </div>
          </div>
          <div class="home-carousel" id="home-carousel">
            ${SLIDES.map((s, i) => slideHtml(s, i === 0)).join('')}
          </div>
          <div class="home-carousel-nav" id="home-dots">
            ${dotsHtml()}
          </div>
        </div>

        <!-- News -->
        <div class="home-section-hdr">
          <div class="home-section-label"><i class="ti ti-news" style="font-size:13px;color:#9CA3AF;"></i> Fleet news &amp; updates</div>
          <div class="home-section-viewall" onclick="sendPrompt('Open news and updates')">View all <i class="ti ti-arrow-right" style="font-size:10px;"></i></div>
        </div>
        ${getNewsItems().map(newsCard).join('')}

      </div>

      <!-- RIGHT: brand hero + supplier directory -->
      <div class="home-right">

        <!-- Brand hero -->
        <div class="home-brand-bar">
          <div class="home-brand-logo">
            <div class="home-brand-mark">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16L11 6L18 16" stroke="#1A1200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="17.5" r="2.2" fill="#1A1200"/></svg>
            </div>
            <div>
              <div class="home-brand-fleet">Mid-County Rental</div>
              <div class="home-brand-tagline">Powered by SmartEquip</div>
            </div>
          </div>
          <div class="home-brand-loc"><i class="ti ti-map-pin" style="font-size:11px;"></i>${locName}</div>
          <div class="home-brand-greeting">Welcome back, <strong>${_firstName}</strong>. Your fleet is live and ready.</div>
          <div class="home-stat-row">
            <div class="home-stat">
              <div class="home-stat-val">${activeWOs.length}</div>
              <div class="home-stat-lbl">Active WOs</div>
            </div>
            <div class="home-stat">
              <div class="home-stat-val">3</div>
              <div class="home-stat-lbl">Branches</div>
            </div>
            <div class="home-stat">
              <div class="home-stat-val">${SUPPLIERS.length}</div>
              <div class="home-stat-lbl">Suppliers</div>
            </div>
          </div>
          <button class="home-cta-btn" onclick="sendPrompt('Go back to dashboard')">
            <i class="ti ti-layout-dashboard" style="font-size:15px;"></i> Go to dashboard <i class="ti ti-arrow-right" style="font-size:13px;opacity:.7;"></i>
          </button>
        </div>

        <!-- Supplier directory -->
        <div class="home-sup-header">
          <div class="home-sup-header-label">
            <i class="ti ti-building-store" style="font-size:14px;color:#9CA3AF;"></i>
            Supplier directory
            <span style="background:#F0ECE8;color:#7A7F8E;font-size:10px;font-weight:700;border-radius:999px;padding:1px 7px;">${SUPPLIERS.length}</span>
          </div>
          <div class="home-section-viewall" onclick="sendPrompt('Open Parts Search scoped to WO #100094')">Search parts <i class="ti ti-arrow-right" style="font-size:10px;"></i></div>
        </div>
        <div class="home-sup-search" onclick="GlobalSearch.open()">
          <i class="ti ti-search" style="font-size:13px;flex-shrink:0;"></i> Search suppliers &amp; parts…
        </div>
        <div class="home-sup-list" id="home-sup-list">
          ${SUPPLIERS.map(supplierCard).join('')}
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
  let _carouselTimer = setInterval(() => {
    if (!document.getElementById('home-carousel')) { clearInterval(_carouselTimer); return; }
    homeGoSlide((window._homeSlide + 1) % SLIDES.length);
  }, 6000);

  // Supplier detail modal
  window.homeOpenSupplier = function(id) {
    const s = SUPPLIERS.find(x => x.id === id);
    if (!s) return;
    Modal.show({
      title: s.name,
      body: `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
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
            <div style="font-size:22px;font-weight:800;color:#111318;">${s.partCount}</div>
          </div>
          <div style="background:#F5F2EE;border-radius:9px;padding:12px 14px;">
            <div style="font-size:11px;color:#9CA3AF;">Specialties</div>
            <div style="font-size:13px;font-weight:600;color:#111318;margin-top:2px;">${s.specialty.length}</div>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#9CA3AF;margin-bottom:8px;">Coverage</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${s.specialty.map(t => `<span style="background:#FFFFFF;border:0.5px solid #E2DDD8;border-radius:6px;padding:4px 10px;font-size:12px;color:#3A3D4A;">${t}</span>`).join('')}
          </div>
        </div>
        <div style="font-size:12px;color:#9CA3AF;"><i class="ti ti-world" style="font-size:12px;"></i> ${s.contact}</div>`,
      actions: [
        { label: 'Search parts', primary: true, onClick: () => { Modal.close(); sendPrompt('Open Parts Search scoped to WO #100094'); } },
        { label: 'Close', onClick: () => Modal.close() },
      ],
    });
  };
}
