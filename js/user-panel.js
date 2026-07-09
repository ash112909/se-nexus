// UserPanel — notifications dropdown + profile/location dropdown
const UserPanel = (() => {
  let _notifOpen = false;
  let _profileOpen = false;
  let _notifFilter = 'unread'; // 'unread' | 'all'

  function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Notification dot refresh (called after render) ────────────────────────
  function refreshDot() {
    const count = Store.getUnreadCount();
    document.querySelectorAll('.notif-dot').forEach(dot => {
      dot.style.display = count > 0 ? '' : 'none';
    });
    document.querySelectorAll('.notif-count-badge').forEach(badge => {
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? '' : 'none';
    });
  }

  // ── Notifications panel ───────────────────────────────────────────────────
  function openNotifications() {
    if (!document.getElementById('up-profile-panel')) _profileOpen = false;
    if (!document.getElementById('up-notif-panel')) _notifOpen = false;
    if (_profileOpen) closeProfile();
    if (_notifOpen) { closeNotifications(); return; }
    _notifOpen = true;
    renderNotifPanel();
  }

  function closeNotifications() {
    _notifOpen = false;
    const p = document.getElementById('up-notif-panel');
    if (p) p.remove();
  }

  function renderNotifPanel() {
    let p = document.getElementById('up-notif-panel');
    if (!p) {
      p = document.createElement('div');
      p.id = 'up-notif-panel';
      document.body.appendChild(p);
    }
    const notifs = Store.getNotifications(_notifFilter === 'unread');
    const unreadCount = Store.getUnreadCount();

    p.innerHTML = `
      <div class="up-panel-arrow"></div>
      <div class="up-panel-header">
        <span class="up-panel-title">Notifications</span>
        <div class="up-filter-toggle">
          <button class="up-ftab ${_notifFilter==='unread'?'active':''}" onclick="UserPanel._setNotifFilter('unread')">Unread ${unreadCount>0?'('+unreadCount+')':''}</button>
          <button class="up-ftab ${_notifFilter==='all'?'active':''}" onclick="UserPanel._setNotifFilter('all')">All</button>
        </div>
        ${unreadCount > 0 ? `<button class="up-mark-all" onclick="UserPanel._markAll()">Mark all read</button>` : ''}
      </div>
      <div class="up-notif-list">
        ${notifs.length ? notifs.map(n => `
          <div class="up-notif-row ${n.read?'':'unread'}" onclick="UserPanel._openNotif('${n.id}')">
            <div class="up-notif-icon-wrap up-icon-${n.type}"><i class="ti ${n.icon}"></i></div>
            <div class="up-notif-body">
              <div class="up-notif-title">${escHtml(n.title)}</div>
              <div class="up-notif-time">${escHtml(n.time)}</div>
            </div>
            ${n.read ? '' : '<div class="up-unread-dot"></div>'}
          </div>`).join('')
        : `<div class="up-empty">No ${_notifFilter === 'unread' ? 'unread ' : ''}notifications</div>`}
      </div>`;

    positionPanel(p, 'notif');
  }

  function _setNotifFilter(f) { _notifFilter = f; renderNotifPanel(); }

  function _markAll() {
    Store.markAllNotificationsRead();
    refreshDot();
    renderNotifPanel();
  }

  function _openNotif(id) {
    const notifs = Store.getNotifications(false);
    const n = notifs.find(x => x.id === id);
    if (!n) return;
    Store.markNotificationRead(id);
    refreshDot();
    renderNotifPanel();
    const typeLabel = { order:'Order update', bulletin:'Service bulletin', wo:'Work order', warranty:'Warranty notice' }[n.type] || 'Notification';
    Modal.show({
      title: n.title,
      body: `<div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#9CA3AF;">${typeLabel}</span>
          <span style="font-size:11px;color:#B0AAA3;">· ${escHtml(n.time)}</span>
        </div>
        <p style="font-size:13px;color:#3A3D4A;line-height:1.7;">${escHtml(n.body)}</p>
      </div>`,
      actions: [{ label: 'Dismiss', onClick: () => Modal.close() }]
    });
  }

  // ── Profile / location panel ──────────────────────────────────────────────
  function openProfile() {
    if (!document.getElementById('up-notif-panel')) _notifOpen = false;
    if (!document.getElementById('up-profile-panel')) _profileOpen = false;
    if (_notifOpen) closeNotifications();
    if (_profileOpen) { closeProfile(); return; }
    _profileOpen = true;
    renderProfilePanel();
  }

  function closeProfile() {
    _profileOpen = false;
    const p = document.getElementById('up-profile-panel');
    if (p) p.remove();
  }

  function renderProfilePanel() {
    let p = document.getElementById('up-profile-panel');
    if (!p) {
      p = document.createElement('div');
      p.id = 'up-profile-panel';
      document.body.appendChild(p);
    }
    const loc = Store.getCurrentLocation();
    const locations = Store.getLocations();
    const user = Store.getCurrentUser();
    const avatar = user ? user.avatar : 'JW';
    const name = user ? user.displayName : 'James Whitfield';
    const roleLabel = user && user.role === 'supervisor' ? 'Fleet Supervisor' : 'Fleet Mechanic';

    p.innerHTML = `
      <div class="up-panel-arrow"></div>
      <div class="up-profile-hdr">
        <div class="up-profile-avatar">${avatar}</div>
        <div>
          <div class="up-profile-name">${escHtml(name)}</div>
          <div class="up-profile-role">${roleLabel}</div>
        </div>
      </div>
      <div class="up-panel-divider"></div>
      <div class="up-panel-section-label">Branch / Location</div>
      ${locations.map(l => `
        <div class="up-loc-row ${loc && loc.id===l.id ? 'active' : ''}" onclick="UserPanel._switchLocation('${l.id}')">
          <div class="up-loc-icon"><i class="ti ti-map-pin"></i></div>
          <div class="up-loc-body">
            <div class="up-loc-name">${l.name}</div>
            <div class="up-loc-addr">${l.address}</div>
          </div>
          ${loc && loc.id===l.id ? '<i class="ti ti-check" style="color:#F5A623;font-size:13px;flex-shrink:0;"></i>' : ''}
        </div>`).join('')}
      <div class="up-panel-divider"></div>
      <div class="up-panel-action" onclick="UserPanel._signOut()"><i class="ti ti-logout"></i> Sign out</div>`;

    positionPanel(p, 'profile');
  }

  function _signOut() {
    closeProfile();
    Store.logout();
    Router.navigate('login');
  }

  function _switchLocation(id) {
    Store.setCurrentLocation(id);
    closeProfile();
    if (typeof Router !== 'undefined' && Router.currentView && Router.currentView !== 'login') {
      Router.navigate(Router.currentView, Router.context);
    }
  }

  // ── Shared positioning ────────────────────────────────────────────────────
  function positionPanel(panel, type) {
    panel.className = 'up-panel';
    const btnId = type === 'notif' ? 'up-btn-notif' : 'up-btn-profile';
    const activeView = document.querySelector('.view.active');
    const btn = (activeView || document).querySelector('#' + btnId);
    if (!btn) { panel.style.cssText = 'top:56px;right:16px;'; return; }
    const r = btn.getBoundingClientRect();
    panel.style.top = (r.bottom + 8) + 'px';
    panel.style.right = (window.innerWidth - r.right) + 'px';
  }

  // ── Location picker modal (called from login) ─────────────────────────────
  function showLocationPicker(onSelect) {
    const locations = Store.getLocations();
    Modal.show({
      title: 'Select your branch',
      body: `<p style="font-size:13px;color:#7A7F8E;margin-bottom:16px;">Choose the location you're working from today. You can switch at any time from your profile.</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${locations.map(l => `
            <div class="loc-picker-row" onclick="UserPanel._pickLocation('${l.id}')">
              <div class="lpr-icon"><i class="ti ti-map-pin"></i></div>
              <div class="lpr-body">
                <div class="lpr-name">${l.name}</div>
                <div class="lpr-meta">${l.address} · ${l.fleetSize} units</div>
              </div>
              <i class="ti ti-chevron-right" style="color:#C8C3BC;font-size:13px;"></i>
            </div>`).join('')}
        </div>
        <style>
          .loc-picker-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border:0.5px solid #E8E4DF;border-radius:10px;cursor:pointer;}
          .loc-picker-row:hover{background:#FAFAF8;border-color:#C8C3BC;}
          .lpr-icon{width:36px;height:36px;background:#FAEEDA;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#854F0B;flex-shrink:0;}
          .lpr-body{flex:1;}.lpr-name{font-size:13px;font-weight:600;color:#111318;margin-bottom:2px;}
          .lpr-meta{font-size:11px;color:#9CA3AF;}
        </style>`,
      actions: []
    });
    UserPanel._pendingLocationCallback = onSelect;
  }

  function _pickLocation(id) {
    Store.setCurrentLocation(id);
    Modal.close();
    if (UserPanel._pendingLocationCallback) {
      UserPanel._pendingLocationCallback(id);
      UserPanel._pendingLocationCallback = null;
    }
  }

  // ── Close on outside click ────────────────────────────────────────────────
  document.addEventListener('click', function(e) {
    const activeView = document.querySelector('.view.active');
    const notifBtn = activeView && activeView.querySelector('#up-btn-notif');
    const profileBtn = activeView && activeView.querySelector('#up-btn-profile');
    if (_notifOpen && !e.target.closest('#up-notif-panel') && !(notifBtn && notifBtn.contains(e.target))) closeNotifications();
    if (_profileOpen && !e.target.closest('#up-profile-panel') && !(profileBtn && profileBtn.contains(e.target))) closeProfile();
  });

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() { refreshDot(); }

  return {
    init, openNotifications, closeNotifications, openProfile, closeProfile,
    showLocationPicker, refreshDot,
    _setNotifFilter, _markAll, _openNotif, _signOut, _switchLocation, _pickLocation,
  };
})();

window.UserPanel = UserPanel;
