function render_home(el) {
  const _user = Store.getCurrentUser();
  const _isSupervisor = _user && _user.role === 'supervisor';
  const _firstName = _user ? _user.displayName.split(' ')[0] : 'there';
  const loc = Store.getCurrentLocation();
  const locName = loc ? loc.name : (_isSupervisor ? 'All locations' : 'Mid-County Rental');

  // Pull published CMS articles + hardcoded news, sorted newest first
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
    return all.slice(0, 6);
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

  const PRIORITY_COLORS = {
    critical: '#B91C1C', high: '#C2410C', medium: '#B45309', low: '#6B7280',
  };

  // Carousel slides — fleet management highlights & brandable spots
  const SLIDES = [
    {
      icon: 'ti-crane', iconBg: '#1A1200', iconColor: '#F5A623',
      eyebrow: 'Fleet highlight',
      title: '2 new Bobcat S770 units arriving Jul 8',
      body: 'Pre-delivery inspection checklists are ready. Assign intake work orders before the delivery date to stay on schedule.',
      cta: 'Create intake WO', ctaFn: "sendPrompt('Open work orders list')",
      accent: '#F5A623', accentBg: '#1A1200',
    },
    {
      icon: 'ti-shield-check', iconBg: '#0F6E56', iconColor: '#FFFFFF',
      eyebrow: 'Warranty alert',
      title: 'Toyota 8FGU25 FL-031 warranty expires Dec 2026',
      body: 'Submit outstanding warranty claims through SmartEquip before coverage ends. Check the WO detail for eligible repairs.',
      cta: 'View WO #100103', ctaFn: "Router.navigate('wo-detail',{woId:100103})",
      accent: '#0F6E56', accentBg: '#E1F5EE',
    },
    {
      icon: 'ti-speakerphone', iconBg: '#534AB7', iconColor: '#FFFFFF',
      eyebrow: 'SmartEquip update',
      title: 'Platform training session — Jun 11, 2:00 PM',
      body: 'Covers the updated parts diagram view, diagnostic assistant, and work order workflow. All technicians encouraged to attend.',
      cta: 'Read more', ctaFn: "sendPrompt('Open news and updates')",
      accent: '#534AB7', accentBg: '#EEEDFE',
    },
    {
      icon: 'ti-tag', iconBg: '#185FA5', iconColor: '#FFFFFF',
      eyebrow: 'Pricing notice',
      title: 'Caterpillar parts price increase effective Jul 1',
      body: 'Track adjuster and undercarriage parts see a 3–5% increase. Review open POs before end of June to lock in current pricing.',
      cta: 'View news', ctaFn: "sendPrompt('Open news and updates')",
      accent: '#185FA5', accentBg: '#E6F1FB',
    },
  ];

  let _slide = 0;

  function newsCard(n) {
    const m = TYPE_META[n.type] || TYPE_META.notice;
    const pc = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.low;
    return `<div class="home-news-card" onclick="newsOpenArticle('${n.id}')">
      <div class="home-news-icon" style="background:${m.bg};color:${m.color};">
        <i class="ti ${m.icon}"></i>
      </div>
      <div class="home-news-body">
        <div class="home-news-type" style="color:${m.color};">${m.label}</div>
        <div class="home-news-title">${n.title}</div>
        <div class="home-news-sub">${n.summary}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
        <div class="home-news-date">${n.dateLabel || n.date || ''}</div>
        ${n.priority && n.priority !== 'low' ? `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${pc};flex-shrink:0;"></span>` : ''}
      </div>
    </div>`;
  }

  function slideHtml(s, active) {
    return `<div class="home-slide${active ? ' active' : ''}" style="background:${s.accentBg};">
      <div style="display:flex;align-items:flex-start;gap:16px;flex:1;min-width:0;">
        <div style="width:48px;height:48px;border-radius:12px;background:${s.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="ti ${s.icon}" style="font-size:22px;color:${s.iconColor};"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${s.accent};margin-bottom:4px;">${s.eyebrow}</div>
          <div style="font-size:15px;font-weight:700;color:#111318;line-height:1.35;margin-bottom:6px;">${s.title}</div>
          <div style="font-size:12px;color:#5A5F6E;line-height:1.6;margin-bottom:12px;">${s.body}</div>
          <button onclick="${s.ctaFn}" style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:${s.accent};color:#FFFFFF;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">${s.cta} <i class="ti ti-arrow-right" style="font-size:11px;"></i></button>
        </div>
      </div>
    </div>`;
  }

  function dotsHtml() {
    return SLIDES.map((_, i) => `<button class="home-dot${i === _slide ? ' active' : ''}" onclick="homeGoSlide(${i})"></button>`).join('');
  }

  el.innerHTML = `
<style>
/* ── Shell ── */
.home-main { flex:1; display:flex; flex-direction:column; overflow-y:auto; }
.home-content { flex:1; padding:28px 28px 40px; max-width:920px; margin:0 auto; width:100%; }

/* ── Hero ── */
.home-hero { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
.home-hero-left { flex:1; min-width:200px; }
.home-fleet-eyebrow { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:6px; }
.home-fleet-name { font-size:26px; font-weight:800; color:#111318; letter-spacing:-0.5px; line-height:1.15; }
.home-fleet-loc { font-size:14px; color:#7A7F8E; margin-top:4px; display:flex; align-items:center; gap:5px; }
.home-greeting { font-size:13px; color:#5A5F6E; margin-top:10px; line-height:1.5; }
.home-cta-btn { display:inline-flex; align-items:center; gap:8px; padding:11px 24px; background:#111318; color:#FFFFFF; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; margin-top:16px; }
.home-cta-btn:hover { background:#2A2D3A; }
.home-cta-sub { font-size:11px; color:#9CA3AF; margin-top:8px; }

/* ── Carousel ── */
.home-carousel-wrap { position:relative; margin-bottom:28px; }
.home-carousel-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; }
.home-carousel { position:relative; overflow:hidden; border-radius:12px; border:0.5px solid #E8E4DF; min-height:160px; }
.home-slide { display:none; padding:22px 24px; align-items:flex-start; background:#FAFAF8; }
.home-slide.active { display:flex; }
.home-carousel-nav { display:flex; align-items:center; gap:6px; margin-top:10px; justify-content:center; }
.home-dot { width:7px; height:7px; border-radius:50%; background:#E2DDD8; border:none; cursor:pointer; padding:0; }
.home-dot.active { background:#111318; width:18px; border-radius:4px; }
.home-carousel-arrows { display:flex; gap:6px; }
.home-arr { width:28px; height:28px; border:0.5px solid #E2DDD8; border-radius:6px; background:#FFFFFF; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; color:#5A5F6E; }
.home-arr:hover { background:#F5F2EE; }

/* ── News ── */
.home-section-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.home-section-label { font-size:13px; font-weight:700; color:#111318; }
.home-section-viewall { font-size:12px; color:#9CA3AF; cursor:pointer; display:flex; align-items:center; gap:4px; }
.home-section-viewall:hover { color:#5A5F6E; }
.home-news-card { display:flex; align-items:flex-start; gap:12px; background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:10px; padding:13px 14px; cursor:pointer; margin-bottom:8px; }
.home-news-card:hover { border-color:#C8C3BC; }
.home-news-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.home-news-body { flex:1; min-width:0; }
.home-news-type { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; margin-bottom:2px; }
.home-news-title { font-size:13px; font-weight:600; color:#111318; line-height:1.4; margin-bottom:2px; }
.home-news-sub { font-size:12px; color:#9CA3AF; line-height:1.5; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.home-news-date { font-size:11px; color:#C0BAB3; white-space:nowrap; }
</style>

<div class="shell">
  ${buildSidebar('home')}
  <div class="main home-main">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Home</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <div class="home-content">

      <!-- Hero -->
      <div class="home-hero">
        <div class="home-hero-left">
          <div class="home-fleet-eyebrow">Welcome to SmartEquip</div>
          <div class="home-fleet-name">Mid-County Rental</div>
          <div class="home-fleet-loc"><i class="ti ti-map-pin" style="font-size:13px;"></i>${locName}</div>
          <div class="home-greeting">Good to see you, <strong>${_firstName}</strong>. Here's what's happening across your fleet today.</div>
          <button class="home-cta-btn" onclick="sendPrompt('Go back to dashboard')">
            <i class="ti ti-layout-dashboard" style="font-size:15px;"></i> Go to dashboard
            <i class="ti ti-arrow-right" style="font-size:13px;opacity:.7;"></i>
          </button>
          <div class="home-cta-sub">Your work orders, parts, and tools are waiting.</div>
        </div>
        <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:10px;padding-top:4px;">
          <div style="background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:14px 18px;text-align:right;min-width:140px;">
            <div style="font-size:11px;color:#9CA3AF;margin-bottom:4px;">Active work orders</div>
            <div style="font-size:28px;font-weight:800;color:#111318;line-height:1;">${Store.getWorkOrders('active', _isSupervisor ? null : (_user ? _user.shortName : null)).length}</div>
            <div style="font-size:11px;color:#F5A623;margin-top:3px;cursor:pointer;" onclick="sendPrompt('Open work orders list')">View all →</div>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div class="home-carousel-wrap">
        <div class="home-carousel-label">
          <span>Fleet highlights &amp; announcements</span>
          <div class="home-carousel-arrows">
            <button class="home-arr" onclick="homeGoSlide((_homeSlide-1+${SLIDES.length})%${SLIDES.length})"><i class="ti ti-chevron-left"></i></button>
            <button class="home-arr" onclick="homeGoSlide((_homeSlide+1)%${SLIDES.length})"><i class="ti ti-chevron-right"></i></button>
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
        <div class="home-section-label">Fleet news &amp; updates</div>
        <div class="home-section-viewall" onclick="sendPrompt('Open news and updates')">
          View all <i class="ti ti-arrow-right" style="font-size:11px;"></i>
        </div>
      </div>
      <div id="home-news-list">
        ${getNewsItems().map(newsCard).join('')}
      </div>

    </div>
  </div>
</div>`;

  // Carousel state — module-level so arrow buttons can reference it
  window._homeSlide = 0;

  window.homeGoSlide = function(idx) {
    const slides = el.querySelectorAll('.home-slide');
    const dots = el.querySelectorAll('.home-dot');
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    window._homeSlide = idx;
  };

  // Auto-advance every 6 seconds
  let _carouselTimer = setInterval(() => {
    if (!document.getElementById('home-carousel')) { clearInterval(_carouselTimer); return; }
    homeGoSlide((window._homeSlide + 1) % SLIDES.length);
  }, 6000);
}
