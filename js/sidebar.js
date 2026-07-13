function buildSidebar(activeItem) {
  const loc = (typeof Store !== 'undefined' && Store.getCurrentLocation) ? Store.getCurrentLocation() : null;
  const locName = loc ? loc.name : 'Mid-County Rental';
  const user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  const role = user ? user.role : 'mechanic';
  const isSupervisor = role === 'supervisor';
  return `
  <div class="sidebar">
    <div class="sb-fleet">
      <div class="sb-fleet-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 13L9 5L15 13" stroke="#1A1200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="14" r="1.8" fill="#1A1200"/></svg>
      </div>
      <div>
        <div class="sb-fleet-name">Mid-County Rental</div>
        <div class="sb-fleet-sub">${locName}</div>
      </div>
    </div>
    <div class="sb-nav">
      <div class="sb-section-label">${isSupervisor ? 'Operations' : 'My work'}</div>
      <div class="sb-item ${activeItem==='home'?'active':''}" onclick="Router.navigate('home')"><i class="ti ti-home"></i> Home</div>
      <div class="sb-item ${activeItem==='dashboard'?'active':''}" onclick="sendPrompt('Go back to dashboard')"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
      <div class="sb-item ${activeItem==='wo'?'active':''}" onclick="sendPrompt('Open work orders list')"><i class="ti ti-clipboard-list"></i> Work orders <span class="sb-badge">2</span></div>
      <div class="sb-item ${activeItem==='order-history'?'active':''}" onclick="sendPrompt('Open order history')"><i class="ti ti-history"></i> Order history</div>
      ${isSupervisor ? `
      <div class="sb-item ${activeItem==='approvals'?'active':''}" onclick="sendPrompt('Open approvals')"><i class="ti ti-circle-check"></i> Approvals</div>
      <div class="sb-item ${activeItem==='analytics'?'active':''}" onclick="sendPrompt('Open analytics')"><i class="ti ti-chart-bar"></i> Analytics</div>
      <div class="sb-item ${activeItem==='cms'?'active':''}" onclick="Router.navigate('cms')"><i class="ti ti-pencil"></i> Content mgmt</div>
      ` : ''}
      <div class="sb-section-label">Parts</div>
      <div class="sb-item ${activeItem==='parts'?'active':''}" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><i class="ti ti-search"></i> Search parts</div>
      <div class="sb-item ${activeItem==='recommended'?'active':''}" onclick="sendPrompt('Open recommended parts')"><i class="ti ti-star"></i> Recommended</div>
      <div class="sb-section-label">Knowledge</div>
      <div class="sb-item ${activeItem==='manuals'?'active':''}" onclick="sendPrompt('Open manuals and docs')"><i class="ti ti-book"></i> Manuals &amp; docs</div>
      <div class="sb-item ${activeItem==='diagnostics'?'active':''}" onclick="sendPrompt('Open diagnostic assistant')"><i class="ti ti-tool"></i> Diagnostics</div>
      <div class="sb-item ${activeItem==='news'?'active':''}" onclick="sendPrompt('Open news and updates')"><i class="ti ti-news"></i> News &amp; updates</div>
    </div>
  </div>`;
}

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
  const loc = (typeof Store !== 'undefined' && Store.getCurrentLocation) ? Store.getCurrentLocation() : null;
  const locName = loc ? loc.name : 'Austin Branch';
  const unread = (typeof Store !== 'undefined' && Store.getUnreadCount) ? Store.getUnreadCount() : 0;
  const user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  const avatar = user ? user.avatar : 'JW';
  const shortName = user ? user.shortName : 'James W.';
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
        <div class="tp-loc">${locName}</div>
      </div>
      <i class="ti ti-selector" style="font-size:12px;color:#5C6070;flex-shrink:0;"></i>
    </button>
  </div>`;
}
