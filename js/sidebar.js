function buildSidebar(activeItem, opts) {
  opts = opts || {};
  const loc  = (typeof Store !== 'undefined' && Store.getCurrentLocation) ? Store.getCurrentLocation() : null;
  const user = (typeof Store !== 'undefined' && Store.getCurrentUser)     ? Store.getCurrentUser()     : null;
  const role = user ? user.role : 'mechanic';
  const pinned = (typeof localStorage !== 'undefined' && localStorage.getItem('sb-pinned') === '1');
  const wrapCls = pinned ? ' sb-pinned' : '';
  const pinCls  = pinned ? ' sb-pinned' : '';
  const pinIcon = pinned ? 'ti-pin-filled' : 'ti-pin';
  const pinLabel = pinned ? 'Pinned' : 'Pin sidebar';

  // ── Impersonation-locked sidebar ──────────────────────────────────────────
  if (opts.impersonating) {
    const fleetName = opts.impersonatingFleet || 'Fleet';
    return `
  <div class="sb-wrap${wrapCls}">
  <div class="sidebar${pinCls}">
    <div class="sb-logo-area">
      <img src="smartequiplogo.png" class="sb-logo-img"/>
      <div class="sb-logo-sub">${fleetName} · Impersonation view</div>
    </div>
    <div class="sb-nav">
      <div class="sb-section-label">Viewing as fleet</div>
      <div class="sb-item active"><i class="ti ti-search"></i><span class="sb-lbl"> Search parts</span></div>
    </div>
    <div style="margin-top:auto;">
      <div class="sb-item" onclick="Router.navigate('supplier-portal')" style="color:#F5A623;border-top:1px solid #2A2A2A;">
        <i class="ti ti-arrow-left"></i><span class="sb-lbl"> Exit impersonation</span>
      </div>
      <div class="sb-pin-row" id="sb-pin-btn"><i class="ti ${pinIcon}"></i><span class="sb-pin-label">${pinLabel}</span></div>
    </div>
  </div>
  </div>`;
  }

  // ── Supplier sidebar ──────────────────────────────────────────────────────
  if (role === 'supplier') {
    const supplierId   = (user.supplierIds || [])[0] || 'SKJ';
    const NAMES        = { SKJ:'Skyjack', CAT:'Caterpillar', TOY:'Toyota', BOB:'Bobcat' };
    const supplierName = NAMES[supplierId] || supplierId;
    const pending      = (typeof Store !== 'undefined' && Store.getPriceRequests)
                         ? Store.getPriceRequests(supplierId).filter(r => r.status === 'pending').length : 0;
    return `
  <div class="sb-wrap${wrapCls}">
  <div class="sidebar${pinCls}">
    <div class="sb-logo-area">
      <img src="smartequiplogo.png" class="sb-logo-img"/>
      <div class="sb-logo-sub">${supplierName} · Supplier Portal</div>
    </div>
    <div class="sb-nav">
      <div class="sb-section-label">Portal</div>
      <div class="sb-item ${activeItem==='sp-home'?'active':''}"     data-sp-tab="home"><i class="ti ti-home"></i><span class="sb-lbl"> Home</span></div>
      <div class="sb-item ${activeItem==='sp-fleets'?'active':''}"   data-sp-tab="fleets"><i class="ti ti-building-warehouse"></i><span class="sb-lbl"> My Fleets</span></div>
      <div class="sb-item ${activeItem==='sp-requests'?'active':''}" data-sp-tab="requests"><i class="ti ti-tag"></i><span class="sb-lbl"> Price Requests ${pending > 0 ? `<span class="sb-badge">${pending}</span>` : ''}</span></div>
      <div class="sb-item ${activeItem==='sp-content'?'active':''}"  data-sp-tab="content"><i class="ti ti-pencil"></i><span class="sb-lbl"> Content</span></div>
      <div class="sb-section-label">Knowledge</div>
      <div class="sb-item ${activeItem==='sp-manuals'?'active':''}"  data-sp-tab="manuals"><i class="ti ti-book"></i><span class="sb-lbl"> Manuals &amp; Docs</span></div>
      <div class="sb-item ${activeItem==='sp-news'?'active':''}"     data-sp-tab="news"><i class="ti ti-news"></i><span class="sb-lbl"> News &amp; Updates</span></div>
      <div class="sb-section-label">Reports</div>
      <div class="sb-item ${activeItem==='sp-analytics'?'active':''}" data-sp-tab="analytics"><i class="ti ti-chart-bar"></i><span class="sb-lbl"> Analytics</span></div>
    </div>
    <div class="sb-pin-row" id="sb-pin-btn"><i class="ti ${pinIcon}"></i><span class="sb-pin-label">${pinLabel}</span></div>
  </div>
  </div>`;
  }

  // ── Fleet sidebar (mechanic / supervisor) ─────────────────────────────────
  const isSupervisor = role === 'supervisor';
  const locName      = loc ? loc.name : 'Mid-County Rental';
  return `
  <div class="sb-wrap${wrapCls}">
  <div class="sidebar${pinCls}">
    <div class="sb-logo-area">
      <img src="smartequiplogo.png" class="sb-logo-img"/>
      <div class="sb-logo-sub">Mid-County Rental · ${locName}</div>
    </div>
    <div class="sb-nav">
      <div class="sb-section-label">${isSupervisor ? 'Operations' : 'My work'}</div>
      <div class="sb-item ${activeItem==='home'?'active':''}" onclick="Router.navigate('home')"><i class="ti ti-home"></i><span class="sb-lbl"> Home</span></div>
      <div class="sb-item ${activeItem==='dashboard'?'active':''}" onclick="sendPrompt('Go back to dashboard')"><i class="ti ti-layout-dashboard"></i><span class="sb-lbl"> Dashboard</span></div>
      <div class="sb-item ${activeItem==='wo'?'active':''}" onclick="sendPrompt('Open orders list')"><i class="ti ti-clipboard-list"></i><span class="sb-lbl"> Orders <span class="sb-badge">2</span></span></div>
      <div class="sb-item ${activeItem==='order-history'?'active':''}" onclick="sendPrompt('Open order history')"><i class="ti ti-history"></i><span class="sb-lbl"> Order history</span></div>
      ${isSupervisor ? `
      <div class="sb-item ${activeItem==='approvals'?'active':''}" onclick="sendPrompt('Open approvals')"><i class="ti ti-circle-check"></i><span class="sb-lbl"> Approvals</span></div>
      <div class="sb-item ${activeItem==='analytics'?'active':''}" onclick="sendPrompt('Open analytics')"><i class="ti ti-chart-bar"></i><span class="sb-lbl"> Analytics</span></div>
      <div class="sb-item ${activeItem==='cms'?'active':''}" onclick="Router.navigate('cms')"><i class="ti ti-pencil"></i><span class="sb-lbl"> Content mgmt</span></div>
      ` : ''}
      <div class="sb-section-label">Parts</div>
      <div class="sb-item ${activeItem==='parts'?'active':''}" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><i class="ti ti-search"></i><span class="sb-lbl"> Search parts</span></div>
      <div class="sb-item ${activeItem==='recommended'?'active':''}" onclick="sendPrompt('Open recommended parts')"><i class="ti ti-star"></i><span class="sb-lbl"> Recommended</span></div>
      <div class="sb-section-label">Knowledge</div>
      <div class="sb-item ${activeItem==='manuals'?'active':''}" onclick="sendPrompt('Open manuals and docs')"><i class="ti ti-book"></i><span class="sb-lbl"> Manuals &amp; docs</span></div>
      <div class="sb-item ${activeItem==='diagnostics'?'active':''}" onclick="sendPrompt('Open diagnostic assistant')"><i class="ti ti-tool"></i><span class="sb-lbl"> Diagnostics</span></div>
      <div class="sb-item ${activeItem==='news'?'active':''}" onclick="sendPrompt('Open news and updates')"><i class="ti ti-news"></i><span class="sb-lbl"> News &amp; updates</span></div>
    </div>
    <div class="sb-pin-row" id="sb-pin-btn"><i class="ti ${pinIcon}"></i><span class="sb-pin-label">${pinLabel}</span></div>
  </div>
  </div>`;
}

// ── Restore pin state on load ─────────────────────────────────────────────
if (localStorage.getItem('sb-pinned') === '1') {
  document.body.setAttribute('data-sb-pinned', '1');
}

// ── Pin toggle — event delegation, runs once ──────────────────────────────
document.addEventListener('click', function(e) {
  const btn = e.target.closest('#sb-pin-btn');
  if (!btn) return;
  const nowPinned = !document.body.hasAttribute('data-sb-pinned');
  if (nowPinned) document.body.setAttribute('data-sb-pinned', '1');
  else document.body.removeAttribute('data-sb-pinned');
  localStorage.setItem('sb-pinned', nowPinned ? '1' : '');
  const icon = btn.querySelector('i');
  if (icon) icon.className = 'ti ' + (nowPinned ? 'ti-pin-filled' : 'ti-pin');
  const lbl = btn.querySelector('.sb-pin-label');
  if (lbl) lbl.textContent = nowPinned ? 'Pinned' : 'Pin sidebar';
});

function buildBanners() {
  if (typeof Store === 'undefined' || !Store.getActiveBanners) return '';
  const banners = Store.getActiveBanners();
  if (!banners.length) return '';
  const COLORS = { critical:'#B91C1C', high:'#C2410C', medium:'#B45309', low:'#185FA5' };
  const BGS    = { critical:'#FEE2E2', high:'#FFF7ED', medium:'#FFFBEB', low:'#EFF6FF' };
  return banners.map(b => `
    <div id="fleet-banner-${b.id}" style="background:${BGS[b.priority]||'#FFFBEB'};border-bottom:1.5px solid ${COLORS[b.priority]||'#B45309'};padding:9px 20px;display:flex;align-items:center;gap:10px;font-size:12px;font-weight:500;color:${COLORS[b.priority]||'#B45309'};flex-shrink:0;">
      <i class="ti ti-speakerphone" style="font-size:14px;flex-shrink:0;"></i>
      <span style="flex:1;">${b.text}</span>
      ${b.dismissible ? `<button onclick="Store.dismissBanner('${b.id}');document.getElementById('fleet-banner-${b.id}').remove();" style="background:none;border:none;cursor:pointer;color:${COLORS[b.priority]||'#B45309'};font-size:16px;line-height:1;padding:0 2px;opacity:0.7;" title="Dismiss">×</button>` : ''}
    </div>`).join('');
}

function buildTopbarRight() {
  const loc      = (typeof Store !== 'undefined' && Store.getCurrentLocation) ? Store.getCurrentLocation() : null;
  const user     = (typeof Store !== 'undefined' && Store.getCurrentUser)     ? Store.getCurrentUser()     : null;
  const role     = user ? user.role : 'mechanic';
  const unread   = (typeof Store !== 'undefined' && Store.getUnreadCount) ? Store.getUnreadCount() : 0;
  const avatar   = user ? user.avatar   : 'JW';
  const shortName = user ? user.shortName : 'James W.';
  const subLine  = role === 'supplier'
    ? (user.email || 'Supplier')
    : (loc ? loc.name : 'Austin Branch');
  return `<div class="topbar-right">
    <button class="topbar-icon-btn" id="up-btn-notif" onclick="UserPanel.openNotifications()" title="Notifications">
      <i class="ti ti-bell"></i>
      <span class="notif-dot" style="${unread > 0 ? '' : 'display:none;'}"></span>
    </button>
    <button class="topbar-icon-btn" title="Settings"><i class="ti ti-settings"></i></button>
    <button class="topbar-profile-btn" id="up-btn-profile" onclick="UserPanel.openProfile()">
      <div class="tp-avatar">${avatar}</div>
      <div class="tp-info">
        <div class="tp-name">${shortName}</div>
        <div class="tp-loc">${subLine}</div>
      </div>
      <i class="ti ti-selector" style="font-size:12px;color:#5C6070;flex-shrink:0;"></i>
    </button>
  </div>`;
}
