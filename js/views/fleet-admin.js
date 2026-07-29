function render_fleet_admin(el) {
  const _user = Store.getCurrentUser();
  if (!_user || _user.role !== 'fleet_admin') { Router.navigate('login'); return; }

  let _activeTab = 'home';
  let _faUserSearch = '';
  let _faUserRoleFilter = 'all';
  let _faUserStatusFilter = 'all';
  let _faUserDetailId = null;
  let _faFeaturesView = 'roles'; // 'roles' | userId

  const ROLE_LABELS = { mechanic: 'Mechanic', supervisor: 'Supervisor' };
  const ROLE_COLORS = { mechanic: { color:'#534AB7', bg:'#EEEDFE' }, supervisor: { color:'#0F6E56', bg:'#E1F5EE' } };
  const STATUS_COLORS = { active: { color:'#0F6E56', bg:'#E1F5EE' }, inactive: { color:'#5A5F6E', bg:'#F0ECE8' } };

  el.innerHTML = `
<style>
.fa-content { flex:1; overflow-y:auto; padding:28px; }

/* ── remove custom shell overrides — use shared .shell/.main/.topbar ── */

/* ── KPI tiles ── */
.fa-kpi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-bottom:28px; }
.fa-kpi { background:#fff; border:0.5px solid #E8E4DF; border-radius:12px; padding:18px; }
.fa-kpi-label { font-size:11px; font-weight:600; color:#9CA3AF; letter-spacing:.8px; text-transform:uppercase; margin-bottom:8px; }
.fa-kpi-val { font-size:28px; font-weight:700; color:#111318; }
.fa-kpi-sub { font-size:11px; color:#9CA3AF; margin-top:4px; }

/* ── Tables ── */
.fa-table { border:1px solid #E8E4DF; border-radius:10px; overflow:hidden; background:#fff; }
.fa-table-head { display:grid; background:#F9F8F7; border-bottom:1px solid #E8E4DF; }
.fa-table-th { padding:9px 14px; font-size:11px; font-weight:600; color:#9CA3AF; letter-spacing:.5px; text-transform:uppercase; }
.fa-table-row { display:grid; border-bottom:1px solid #F0ECE8; transition:background .12s; }
.fa-table-row:last-child { border-bottom:none; }
.fa-table-row:hover { background:#FAFAF9; }
.fa-table-row.fa-row-open { background:#F5F2EE; }
.fa-table-td { padding:12px 14px; font-size:12px; color:#4B5268; display:flex; align-items:center; }

/* ── Status / role pills ── */
.fa-pill { display:inline-block; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:600; }

/* ── User detail panel ── */
.fa-detail { border:1px solid #E8E4DF; border-radius:10px; background:#fff; margin-top:2px; margin-bottom:8px; animation:faSlide .15s ease; }
@keyframes faSlide { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
.fa-detail-header { padding:16px 20px; background:#F9F8F7; border-bottom:1px solid #E8E4DF; display:flex; align-items:center; gap:16px; }
.fa-detail-body { display:grid; grid-template-columns:1fr 300px; }
.fa-detail-main { padding:20px; border-right:1px solid #F0ECE8; }
.fa-detail-side { padding:20px; }

/* ── Feature toggle rows ── */
.fa-feat-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #F0ECE8; background:#fff; }
.fa-feat-row:last-child { border-bottom:none; }
.fa-feat-info { display:flex; flex-direction:column; gap:2px; }
.fa-feat-label { font-size:13px; font-weight:600; color:#111318; display:flex; align-items:center; gap:6px; }
.fa-feat-desc { font-size:12px; color:#9CA3AF; }
.fa-override-note { font-size:11px; color:#534AB7; margin-top:3px; }

/* ── Topbar title ── */
.fa-topbar-title { font-size:13px; font-weight:500; color:#FFFFFF; }

/* ── Toggle switch ── */
.fa-toggle { position:relative; width:40px; height:22px; flex-shrink:0; }
.fa-toggle input { opacity:0; width:0; height:0; }
.fa-toggle-track { position:absolute; inset:0; border-radius:11px; background:#E2E5EE; cursor:pointer; transition:background .2s; }
.fa-toggle input:checked + .fa-toggle-track { background:#1A6DB5; }
.fa-toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:8px; background:#fff; pointer-events:none; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,.15); }
.fa-toggle input:checked ~ .fa-toggle-thumb { transform:translateX(18px); }

/* ── Filter bar ── */
.fa-filter-bar { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.fa-filter-select { height:32px; border:1px solid #E2E5EE; border-radius:7px; padding:0 10px; font-size:12px; color:#111318; background:#fff; }
.fa-filter-input { height:32px; border:1px solid #E2E5EE; border-radius:7px; padding:0 10px; font-size:12px; color:#111318; background:#fff; width:180px; }
.fa-filter-input::placeholder { color:#B0B5C3; }

/* ── Role tab switcher ── */
.fa-role-tabs { display:flex; gap:2px; background:#F5F2EE; border-radius:8px; padding:3px; margin-bottom:20px; width:fit-content; }
.fa-role-tab { padding:6px 16px; border:none; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer; color:#7A7F8E; background:transparent; }
.fa-role-tab.active { background:#fff; color:#111318; box-shadow:0 1px 3px rgba(0,0,0,.08); }

/* ── Section titles ── */
.fa-section-title { font-size:14px; font-weight:700; color:#111318; margin-bottom:4px; }
.fa-section-sub { font-size:12px; color:#7A7F8E; margin-bottom:16px; }

/* ── Avatar ── */
.fa-avatar { width:36px; height:36px; border-radius:50%; background:#1E1E1E; color:#F5A623; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* ── Location card ── */
.fa-loc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; }
.fa-loc-card { background:#fff; border:0.5px solid #E8E4DF; border-radius:12px; padding:18px; }
.fa-loc-name { font-size:14px; font-weight:700; color:#111318; margin-bottom:2px; }
.fa-loc-addr { font-size:12px; color:#9CA3AF; margin-bottom:12px; }
.fa-loc-stats { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.fa-loc-stat { background:#F5F2EE; border-radius:7px; padding:8px 10px; }
.fa-loc-stat-val { font-size:16px; font-weight:700; color:#111318; }
.fa-loc-stat-label { font-size:10px; color:#9CA3AF; text-transform:uppercase; letter-spacing:.5px; margin-top:1px; }

/* ── Activity log ── */
.fa-log-row { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid #F0ECE8; }
.fa-log-row:last-child { border-bottom:none; }
.fa-log-icon { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:1px; }
.fa-log-body { flex:1; }
.fa-log-text { font-size:13px; color:#111318; line-height:1.4; }
.fa-log-meta { font-size:11px; color:#9CA3AF; margin-top:2px; }

/* ── Buttons ── */
.fa-btn { height:32px; padding:0 14px; border-radius:7px; border:none; font-size:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; }
.fa-btn-primary { background:#111318; color:#fff; }
.fa-btn-primary:hover { background:#2A2D38; }
.fa-btn-ghost { background:transparent; color:#4B5268; border:1px solid #E2E5EE; }
.fa-btn-ghost:hover { background:#F5F2EE; }
.fa-btn-danger { background:transparent; color:#A32D2D; border:1px solid #FECACA; }
.fa-btn-danger:hover { background:#FEF2F2; }
</style>

<div class="shell">
  ${buildSidebar('fa-home')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <span class="fa-topbar-title" id="fa-topbar-title">Home</span>
      </div>
      ${buildTopbarRight()}
    </div>
    <div class="fa-content" id="fa-content"></div>
  </div>
</div>`;

  // ── Tab routing ────────────────────────────────────────────────────────────
  function setTab(tab) {
    _activeTab = tab;
    el.querySelectorAll('.sb-item[data-fa-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.faTab === tab);
    });
    const contentEl = document.getElementById('fa-content');
    if (contentEl) contentEl.style.cssText = 'flex:1;overflow-y:auto;padding:28px;box-sizing:border-box;';
    if (tab === 'home')      renderHome();
    if (tab === 'users')     renderUsers();
    if (tab === 'features')  renderFeatures();
    if (tab === 'locations') renderLocations();
    if (tab === 'activity')  renderActivity();
  }

  el.querySelectorAll('.sb-item[data-fa-tab]').forEach(item => {
    item.addEventListener('click', () => setTab(item.dataset.faTab));
  });

  // ── Home ───────────────────────────────────────────────────────────────────
  function renderHome() {
    document.getElementById('fa-topbar-title').textContent = 'Home';
    const users = Store.getManagedUsers();
    const active = users.filter(u => u.status === 'active').length;
    const mechanics = users.filter(u => u.role === 'mechanic').length;
    const supervisors = users.filter(u => u.role === 'supervisor').length;
    const locs = Store.getLocations();

    document.getElementById('fa-content').innerHTML = `
<div style="font-size:20px;font-weight:700;color:#111318;margin-bottom:4px;">Welcome back, ${_user.displayName.split(' ')[0]}</div>
<div style="font-size:13px;color:#7A7F8E;margin-bottom:24px;">Fleet administration for Mid-County Rental</div>

<div class="fa-kpi-grid">
  <div class="fa-kpi">
    <div class="fa-kpi-label">Total Users</div>
    <div class="fa-kpi-val">${users.length}</div>
    <div class="fa-kpi-sub">${active} active</div>
  </div>
  <div class="fa-kpi">
    <div class="fa-kpi-label">Mechanics</div>
    <div class="fa-kpi-val">${mechanics}</div>
  </div>
  <div class="fa-kpi">
    <div class="fa-kpi-label">Supervisors</div>
    <div class="fa-kpi-val">${supervisors}</div>
  </div>
  <div class="fa-kpi">
    <div class="fa-kpi-label">Locations</div>
    <div class="fa-kpi-val">${locs.length}</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
  <div>
    <div class="fa-section-title">Recent Users</div>
    <div class="fa-section-sub">Last active across the fleet</div>
    <div class="fa-table">
      ${users.slice(0,4).map(u => {
        const rc = ROLE_COLORS[u.role] || ROLE_COLORS.mechanic;
        return `<div class="fa-table-row" style="grid-template-columns:36px 1fr auto auto;" onclick="faOpenUser('${u.id}')" style="cursor:pointer;">
          <div class="fa-table-td"><div class="fa-avatar">${u.avatar}</div></div>
          <div class="fa-table-td" style="flex-direction:column;align-items:flex-start;gap:1px;">
            <span style="font-size:13px;color:#111318;font-weight:500;">${u.displayName}</span>
            <span style="font-size:11px;color:#9CA3AF;">${u.location}</span>
          </div>
          <div class="fa-table-td"><span class="fa-pill" style="background:${rc.bg};color:${rc.color};">${ROLE_LABELS[u.role]||u.role}</span></div>
          <div class="fa-table-td" style="font-size:11px;color:#9CA3AF;">${u.lastSeen}</div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:10px;">
      <button class="fa-btn fa-btn-ghost" onclick="faSetTab('users')">View all users</button>
    </div>
  </div>
  <div>
    <div class="fa-section-title">Feature Access</div>
    <div class="fa-section-sub">Role defaults — click to manage</div>
    <div class="fa-table">
      ${Store.getManagedFeatures().slice(0,5).map(f => {
        const mechOn = Store.getRoleFeatures('mechanic')[f.id];
        const supOn  = Store.getRoleFeatures('supervisor')[f.id];
        return `<div class="fa-table-row" style="grid-template-columns:1fr 72px 80px;" onclick="faSetTab('features')" style="cursor:pointer;">
          <div class="fa-table-td" style="gap:7px;"><i class="ti ${f.icon}" style="font-size:14px;color:#9CA3AF;"></i><span style="font-size:13px;color:#111318;">${f.label}</span></div>
          <div class="fa-table-td"><span style="font-size:11px;color:${mechOn?'#0F6E56':'#9CA3AF'};">${mechOn?'✓ Mech':'— Mech'}</span></div>
          <div class="fa-table-td"><span style="font-size:11px;color:${supOn?'#0F6E56':'#9CA3AF'};">${supOn?'✓ Sup':'— Sup'}</span></div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:10px;">
      <button class="fa-btn fa-btn-ghost" onclick="faSetTab('features')">Manage features</button>
    </div>
  </div>
</div>`;
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  function renderUsers() {
    document.getElementById('fa-topbar-title').textContent = 'Users';
    let users = Store.getManagedUsers().filter(u => {
      if (_faUserRoleFilter !== 'all' && u.role !== _faUserRoleFilter) return false;
      if (_faUserStatusFilter !== 'all' && u.status !== _faUserStatusFilter) return false;
      if (_faUserSearch && !u.displayName.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.username.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.location.toLowerCase().includes(_faUserSearch.toLowerCase())) return false;
      return true;
    });

    document.getElementById('fa-content').innerHTML = `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
  <div>
    <div class="fa-section-title">Users</div>
    <div class="fa-section-sub">${Store.getManagedUsers().length} users · ${Store.getManagedUsers().filter(u=>u.status==='active').length} active</div>
  </div>
  <button class="fa-btn fa-btn-primary" onclick="faAddUser()"><i class="ti ti-plus" style="font-size:13px;"></i> Add User</button>
</div>
<div class="fa-filter-bar">
  <input class="fa-filter-input" id="fa-u-search" placeholder="Search by name, username, location…" value="${_faUserSearch}" oninput="faUserFilterText()" />
  <select class="fa-filter-select" id="fa-u-role" onchange="faUserFilter()">
    <option value="all">All roles</option>
    <option value="mechanic" ${_faUserRoleFilter==='mechanic'?'selected':''}>Mechanic</option>
    <option value="supervisor" ${_faUserRoleFilter==='supervisor'?'selected':''}>Supervisor</option>
  </select>
  <select class="fa-filter-select" id="fa-u-status" onchange="faUserFilter()">
    <option value="all">All statuses</option>
    <option value="active" ${_faUserStatusFilter==='active'?'selected':''}>Active</option>
    <option value="inactive" ${_faUserStatusFilter==='inactive'?'selected':''}>Inactive</option>
  </select>
</div>
<div id="fa-users-wrap">
  ${_renderUsersTable(users)}
</div>`;

    if (_faUserDetailId) {
      const still = Store.getManagedUsers().find(u => u.id === _faUserDetailId);
      if (still) _renderUserDetail(_faUserDetailId);
      else _faUserDetailId = null;
    }
  }

  function _renderUsersTable(users) {
    if (!users.length) return '<div style="padding:48px;text-align:center;color:#9CA3AF;font-size:13px;">No users match the current filters.</div>';
    const cols = '36px 1fr 110px 130px 120px 90px 100px';
    return `
<div class="fa-table">
  <div class="fa-table-head" style="grid-template-columns:${cols};">
    <div class="fa-table-th"></div>
    <div class="fa-table-th">Name</div>
    <div class="fa-table-th">Role</div>
    <div class="fa-table-th">Location</div>
    <div class="fa-table-th">Last seen</div>
    <div class="fa-table-th">Status</div>
    <div class="fa-table-th"></div>
  </div>
  ${users.map(u => {
    const rc = ROLE_COLORS[u.role] || ROLE_COLORS.mechanic;
    const sc = STATUS_COLORS[u.status] || STATUS_COLORS.active;
    const isOpen = _faUserDetailId === u.id;
    return `<div class="fa-table-row${isOpen?' fa-row-open':''}" style="grid-template-columns:${cols};cursor:pointer;" onclick="faToggleUser('${u.id}')">
      <div class="fa-table-td"><div class="fa-avatar" style="width:28px;height:28px;font-size:10px;">${u.avatar}</div></div>
      <div class="fa-table-td" style="flex-direction:column;align-items:flex-start;gap:1px;">
        <span style="font-size:13px;color:#111318;font-weight:500;">${u.displayName}</span>
        <span style="font-size:11px;color:#9CA3AF;">${u.username}</span>
      </div>
      <div class="fa-table-td"><span class="fa-pill" style="background:${rc.bg};color:${rc.color};">${ROLE_LABELS[u.role]||u.role}</span></div>
      <div class="fa-table-td" style="font-size:12px;">${u.location}</div>
      <div class="fa-table-td" style="font-size:12px;color:#7A7F8E;">${u.lastSeen}</div>
      <div class="fa-table-td"><span class="fa-pill" style="background:${sc.bg};color:${sc.color};">${u.status}</span></div>
      <div class="fa-table-td" style="justify-content:flex-end;gap:6px;" onclick="event.stopPropagation()">
        <button class="fa-btn fa-btn-ghost" style="height:28px;font-size:11px;" onclick="faEditUser('${u.id}')">Edit</button>
        <i class="ti ti-chevron-${isOpen?'up':'down'}" style="font-size:14px;color:#9CA3AF;cursor:pointer;" onclick="faToggleUser('${u.id}')"></i>
      </div>
    </div>`;
  }).join('')}
</div>`;
  }

  function _renderUserDetail(id) {
    const u = Store.getManagedUsers().find(x => x.id === id);
    if (!u) return;
    const features = Store.getManagedFeatures();
    const effective = Store.getEffectiveFeatures(id);
    const overrides = Store.getUserFeatureOverrides(id);
    const roleDefaults = Store.getRoleFeatures(u.role);
    const rc = ROLE_COLORS[u.role] || ROLE_COLORS.mechanic;

    const wrap = document.getElementById('fa-users-wrap');
    if (!wrap) return;
    const existing = document.getElementById('fa-user-detail');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'fa-user-detail';
    panel.style.cssText = 'margin-top:2px;';
    panel.innerHTML = `
<div class="fa-detail">
  <div class="fa-detail-header">
    <div class="fa-avatar" style="width:44px;height:44px;font-size:14px;">${u.avatar}</div>
    <div style="flex:1;">
      <div style="font-size:15px;font-weight:700;color:#111318;">${u.displayName}</div>
      <div style="font-size:12px;color:#7A7F8E;">${u.username} · ${u.email}</div>
    </div>
    <span class="fa-pill" style="background:${rc.bg};color:${rc.color};">${ROLE_LABELS[u.role]||u.role}</span>
    <button class="fa-btn fa-btn-ghost" onclick="faEditUser('${u.id}')">Edit user</button>
  </div>
  <div class="fa-detail-body">
    <div class="fa-detail-main">
      <div style="font-size:12px;font-weight:600;color:#9CA3AF;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;">
        Feature access <span style="font-size:11px;font-weight:400;color:#B0B5C3;text-transform:none;letter-spacing:0;">— overrides apply to this user only; role defaults shown where no override is set</span>
      </div>
      <div class="fa-table">
        ${features.map(f => {
          const hasOverride = id in overrides && f.id in (overrides);
          const isOn = effective[f.id];
          const roleDefault = roleDefaults[f.id];
          const overridden = overrides[f.id] !== undefined;
          return `<div class="fa-feat-row">
            <div class="fa-feat-info">
              <div class="fa-feat-label"><i class="ti ${f.icon}" style="font-size:13px;color:#9CA3AF;"></i>${f.label}</div>
              <div class="fa-feat-desc">${f.description}</div>
              ${overridden ? `<div class="fa-override-note">User override: ${isOn?'enabled':'disabled'} (role default: ${roleDefault?'on':'off'}) · <button style="background:none;border:none;color:#534AB7;cursor:pointer;font-size:11px;text-decoration:underline;padding:0;" onclick="faClearOverride('${id}','${f.id}')">Clear override</button></div>` : `<div style="font-size:11px;color:#B0B5C3;margin-top:2px;">Following role default (${roleDefault?'on':'off'})</div>`}
            </div>
            <label class="fa-toggle">
              <input type="checkbox" ${isOn?'checked':''} onchange="faSetUserOverride('${id}','${f.id}',this.checked)"/>
              <div class="fa-toggle-track"></div>
              <div class="fa-toggle-thumb"></div>
            </label>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="fa-detail-side">
      <div style="font-size:12px;font-weight:600;color:#9CA3AF;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px;">User details</div>
      ${[
        ['Email', u.email],
        ['Phone', u.phone || '—'],
        ['Location', u.location],
        ['Last seen', u.lastSeen],
        ['Status', u.status],
      ].map(([l,v]) => `<div style="margin-bottom:12px;"><div style="font-size:11px;color:#9CA3AF;margin-bottom:2px;">${l}</div><div style="font-size:13px;color:#111318;font-weight:500;">${v}</div></div>`).join('')}
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #F0ECE8;display:flex;flex-direction:column;gap:8px;">
        <button class="fa-btn fa-btn-ghost" style="justify-content:flex-start;" onclick="faEditUser('${u.id}')"><i class="ti ti-pencil" style="font-size:13px;"></i> Edit profile</button>
        <button class="fa-btn fa-btn-${u.status==='active'?'danger':'ghost'}" style="justify-content:flex-start;" onclick="faToggleUserStatus('${u.id}')">
          <i class="ti ti-${u.status==='active'?'user-off':'user-check'}" style="font-size:13px;"></i>
          ${u.status==='active'?'Deactivate user':'Reactivate user'}
        </button>
      </div>
    </div>
  </div>
</div>`;
    wrap.appendChild(panel);
  }

  // ── Features (role-level) ─────────────────────────────────────────────────
  function renderFeatures() {
    document.getElementById('fa-topbar-title').textContent = 'Features';
    const features = Store.getManagedFeatures();

    document.getElementById('fa-content').innerHTML = `
<div class="fa-section-title">Feature Access</div>
<div class="fa-section-sub" style="margin-bottom:20px;">Set defaults by role, then use individual user settings to make exceptions.</div>

<div class="fa-role-tabs">
  <button class="fa-role-tab ${_faFeaturesView==='roles'?'active':''}" onclick="faFeatView('roles')">Role defaults</button>
  <button class="fa-role-tab ${_faFeaturesView!=='roles'?'active':''}" id="fa-feat-user-tab" onclick="faFeatView('users')" style="${_faFeaturesView!=='roles'?'':''}">Per-user overrides</button>
</div>

<div id="fa-feat-body">
  ${_faFeaturesView === 'roles' ? _renderRoleFeatures(features) : _renderPerUserFeatures(features)}
</div>`;
  }

  function _renderRoleFeatures(features) {
    return `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
  ${['mechanic','supervisor'].map(role => {
    const rf = Store.getRoleFeatures(role);
    const rc = ROLE_COLORS[role];
    return `<div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span class="fa-pill" style="background:${rc.bg};color:${rc.color};font-size:12px;">${ROLE_LABELS[role]}</span>
        <span style="font-size:12px;color:#9CA3AF;">${Store.getManagedUsers().filter(u=>u.role===role).length} users</span>
      </div>
      <div class="fa-table">
        ${features.map(f => `
          <div class="fa-feat-row">
            <div class="fa-feat-info">
              <div class="fa-feat-label"><i class="ti ${f.icon}" style="font-size:13px;color:#9CA3AF;"></i>${f.label}</div>
              <div class="fa-feat-desc">${f.description}</div>
            </div>
            <label class="fa-toggle">
              <input type="checkbox" ${rf[f.id]?'checked':''} onchange="faSetRoleFeature('${role}','${f.id}',this.checked)"/>
              <div class="fa-toggle-track"></div>
              <div class="fa-toggle-thumb"></div>
            </label>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('')}
</div>
<div style="margin-top:16px;padding:12px 16px;background:#F5F2EE;border-radius:8px;font-size:12px;color:#7A7F8E;">
  Role defaults apply to all users of that role. Individual user overrides take precedence — manage those in <button style="background:none;border:none;color:#1A6DB5;cursor:pointer;font-size:12px;text-decoration:underline;padding:0;" onclick="faFeatView('users')">Per-user overrides</button> or by opening a user on the Users tab.
</div>`;
  }

  function _renderPerUserFeatures(features) {
    const users = Store.getManagedUsers();
    return `
<div class="fa-table">
  <div class="fa-table-head" style="grid-template-columns:200px ${features.map(()=>'1fr').join(' ')};">
    <div class="fa-table-th">User</div>
    ${features.map(f => `<div class="fa-table-th" title="${f.description}"><i class="ti ${f.icon}" style="font-size:12px;"></i> ${f.label}</div>`).join('')}
  </div>
  ${users.map(u => {
    const effective = Store.getEffectiveFeatures(u.id);
    const overrides = Store.getUserFeatureOverrides(u.id);
    const rc = ROLE_COLORS[u.role] || ROLE_COLORS.mechanic;
    return `<div class="fa-table-row" style="grid-template-columns:200px ${features.map(()=>'1fr').join(' ')};">
      <div class="fa-table-td" style="flex-direction:column;align-items:flex-start;gap:1px;">
        <span style="font-size:13px;color:#111318;font-weight:500;">${u.displayName}</span>
        <span class="fa-pill" style="background:${rc.bg};color:${rc.color};font-size:10px;">${ROLE_LABELS[u.role]||u.role}</span>
      </div>
      ${features.map(f => {
        const isOn = effective[f.id];
        const overridden = overrides[f.id] !== undefined;
        return `<div class="fa-table-td" style="justify-content:center;">
          <label class="fa-toggle" title="${overridden?'User override':'Role default'}">
            <input type="checkbox" ${isOn?'checked':''} onchange="faSetUserOverride('${u.id}','${f.id}',this.checked)"/>
            <div class="fa-toggle-track" style="${overridden?'outline:2px solid #534AB7;outline-offset:1px;border-radius:11px;':''}"></div>
            <div class="fa-toggle-thumb"></div>
          </label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('')}
</div>
<div style="margin-top:12px;font-size:11px;color:#9CA3AF;">Toggles with a <span style="display:inline-block;width:10px;height:10px;border:2px solid #534AB7;border-radius:3px;vertical-align:middle;"></span> purple outline are individual overrides that differ from the role default.</div>`;
  }

  // ── Locations ─────────────────────────────────────────────────────────────
  function renderLocations() {
    document.getElementById('fa-topbar-title').textContent = 'Locations';
    const locs = Store.getLocations();
    const users = Store.getManagedUsers();
    document.getElementById('fa-content').innerHTML = `
<div class="fa-section-title">Locations</div>
<div class="fa-section-sub">Fleet branches and their user breakdown</div>
<div class="fa-loc-grid">
  ${locs.map(l => {
    const locUsers = users.filter(u => u.location && u.location.toLowerCase().includes(l.name.toLowerCase().split(' ')[0]));
    const mechanics  = locUsers.filter(u => u.role==='mechanic').length;
    const supervisors= locUsers.filter(u => u.role==='supervisor').length;
    return `<div class="fa-loc-card">
      <div class="fa-loc-name">${l.name}</div>
      <div class="fa-loc-addr">${l.address}</div>
      <div class="fa-loc-stats">
        <div class="fa-loc-stat">
          <div class="fa-loc-stat-val">${l.fleetSize}</div>
          <div class="fa-loc-stat-label">Assets</div>
        </div>
        <div class="fa-loc-stat">
          <div class="fa-loc-stat-val">${locUsers.length}</div>
          <div class="fa-loc-stat-label">Users</div>
        </div>
        <div class="fa-loc-stat">
          <div class="fa-loc-stat-val">${mechanics}</div>
          <div class="fa-loc-stat-label">Mechanics</div>
        </div>
        <div class="fa-loc-stat">
          <div class="fa-loc-stat-val">${supervisors}</div>
          <div class="fa-loc-stat-label">Supervisors</div>
        </div>
      </div>
    </div>`;
  }).join('')}
</div>`;
  }

  // ── Activity Log ──────────────────────────────────────────────────────────
  function renderActivity() {
    document.getElementById('fa-topbar-title').textContent = 'Activity Log';
    const logs = [
      { icon:'ti-toggle-right', bg:'#EEEDFE', color:'#534AB7', text:'<strong>Analytics</strong> disabled for <strong>Marcus Taylor</strong> (user override)', meta:'Jul 29, 2026 · 10:14 AM · Admin User' },
      { icon:'ti-user-plus',    bg:'#E1F5EE', color:'#0F6E56', text:'New user <strong>Rosa Flores</strong> added as Supervisor at San Marcos Branch', meta:'Jul 28, 2026 · 3:42 PM · Admin User' },
      { icon:'ti-toggle-right', bg:'#EEEDFE', color:'#534AB7', text:'<strong>Diagnostics Chat</strong> enabled for role <strong>Mechanic</strong> (role default updated)', meta:'Jul 27, 2026 · 11:05 AM · Admin User' },
      { icon:'ti-user-off',     bg:'#FEE2E2', color:'#B91C1C', text:'<strong>Thanh Nguyen</strong> deactivated', meta:'Jul 10, 2026 · 8:30 AM · Admin User' },
      { icon:'ti-toggle-right', bg:'#EEEDFE', color:'#534AB7', text:'<strong>Content Management</strong> disabled for role <strong>Mechanic</strong> (role default updated)', meta:'Jul 8, 2026 · 2:17 PM · Admin User' },
      { icon:'ti-user-plus',    bg:'#E1F5EE', color:'#0F6E56', text:'New user <strong>Dana Kowalski</strong> added as Mechanic at Kyle Branch', meta:'Jul 5, 2026 · 9:00 AM · Admin User' },
    ];
    document.getElementById('fa-content').innerHTML = `
<div class="fa-section-title">Activity Log</div>
<div class="fa-section-sub">Admin actions on users and feature settings</div>
<div class="fa-table" style="padding:0 16px;">
  ${logs.map(l => `<div class="fa-log-row">
    <div class="fa-log-icon" style="background:${l.bg};color:${l.color};"><i class="ti ${l.icon}"></i></div>
    <div class="fa-log-body">
      <div class="fa-log-text">${l.text}</div>
      <div class="fa-log-meta">${l.meta}</div>
    </div>
  </div>`).join('')}
</div>`;
  }

  // ── Window-level handlers ──────────────────────────────────────────────────

  window.faSetTab = function(tab) { setTab(tab); };

  window.faFeatView = function(view) {
    _faFeaturesView = view;
    renderFeatures();
  };

  window.faSetRoleFeature = function(role, featureId, enabled) {
    Store.setRoleFeature(role, featureId, enabled);
    // Don't full re-render — toggles are live
  };

  window.faSetUserOverride = function(userId, featureId, enabled) {
    Store.setUserFeatureOverride(userId, featureId, enabled);
    // If detail panel is open, refresh the override note text only
    if (_faUserDetailId === userId) {
      _renderUserDetail(userId);
    }
    // If in per-user feature grid, refresh that
    if (_faFeaturesView !== 'roles' && _activeTab === 'features') {
      renderFeatures();
    }
  };

  window.faClearOverride = function(userId, featureId) {
    Store.setUserFeatureOverride(userId, featureId, null);
    if (_faUserDetailId === userId) _renderUserDetail(userId);
  };

  window.faToggleUser = function(id) {
    if (_faUserDetailId === id) {
      _faUserDetailId = null;
      document.getElementById('fa-user-detail')?.remove();
      document.querySelectorAll('.fa-table-row').forEach(r => r.classList.remove('fa-row-open'));
    } else {
      _faUserDetailId = id;
      const wrap = document.getElementById('fa-users-wrap');
      const users = Store.getManagedUsers().filter(u => {
        if (_faUserRoleFilter !== 'all' && u.role !== _faUserRoleFilter) return false;
        if (_faUserStatusFilter !== 'all' && u.status !== _faUserStatusFilter) return false;
        if (_faUserSearch && !u.displayName.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
            !u.username.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
            !u.location.toLowerCase().includes(_faUserSearch.toLowerCase())) return false;
        return true;
      });
      if (wrap) wrap.innerHTML = _renderUsersTable(users);
      _renderUserDetail(id);
    }
  };

  window.faOpenUser = function(id) {
    _faUserDetailId = id;
    setTab('users');
  };

  window.faUserFilterText = function() {
    _faUserSearch = document.getElementById('fa-u-search')?.value || '';
    const users = Store.getManagedUsers().filter(u => {
      if (_faUserRoleFilter !== 'all' && u.role !== _faUserRoleFilter) return false;
      if (_faUserStatusFilter !== 'all' && u.status !== _faUserStatusFilter) return false;
      if (_faUserSearch && !u.displayName.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.username.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.location.toLowerCase().includes(_faUserSearch.toLowerCase())) return false;
      return true;
    });
    const wrap = document.getElementById('fa-users-wrap');
    if (wrap) wrap.innerHTML = _renderUsersTable(users);
    if (_faUserDetailId) _renderUserDetail(_faUserDetailId);
  };

  window.faUserFilter = function() {
    _faUserRoleFilter   = document.getElementById('fa-u-role')?.value   || 'all';
    _faUserStatusFilter = document.getElementById('fa-u-status')?.value || 'all';
    const users = Store.getManagedUsers().filter(u => {
      if (_faUserRoleFilter !== 'all' && u.role !== _faUserRoleFilter) return false;
      if (_faUserStatusFilter !== 'all' && u.status !== _faUserStatusFilter) return false;
      if (_faUserSearch && !u.displayName.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.username.toLowerCase().includes(_faUserSearch.toLowerCase()) &&
          !u.location.toLowerCase().includes(_faUserSearch.toLowerCase())) return false;
      return true;
    });
    const wrap = document.getElementById('fa-users-wrap');
    if (wrap) wrap.innerHTML = _renderUsersTable(users);
    if (_faUserDetailId) _renderUserDetail(_faUserDetailId);
  };

  window.faEditUser = function(id) {
    const u = Store.getManagedUsers().find(x => x.id === id);
    if (!u) return;
    const locs = Store.getLocations();
    Modal.show({
      title: 'Edit User',
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="modal-form-field" style="grid-column:1/-1;">
            <label class="modal-form-label">Full name</label>
            <input class="modal-form-input" id="eu-name" value="${u.displayName}"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Username</label>
            <input class="modal-form-input" id="eu-username" value="${u.username}"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Email</label>
            <input class="modal-form-input" id="eu-email" value="${u.email}"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Phone</label>
            <input class="modal-form-input" id="eu-phone" value="${u.phone||''}"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Role</label>
            <select class="modal-form-select" id="eu-role">
              <option value="mechanic" ${u.role==='mechanic'?'selected':''}>Mechanic</option>
              <option value="supervisor" ${u.role==='supervisor'?'selected':''}>Supervisor</option>
            </select>
          </div>
          <div class="modal-form-field" style="grid-column:1/-1;">
            <label class="modal-form-label">Location</label>
            <select class="modal-form-select" id="eu-loc">
              ${locs.map(l => `<option value="${l.name}" ${u.location===l.name?'selected':''}>${l.name}</option>`).join('')}
            </select>
          </div>
        </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Save changes', primary: true, onClick: () => {
          const name = document.getElementById('eu-name').value.trim();
          if (!name) return;
          Store.updateManagedUser(id, {
            displayName: name,
            shortName: name.split(' ').map((p,i) => i===0?p:p[0]+'.').join(' '),
            username: document.getElementById('eu-username').value.trim(),
            email: document.getElementById('eu-email').value.trim(),
            phone: document.getElementById('eu-phone').value.trim(),
            role: document.getElementById('eu-role').value,
            location: document.getElementById('eu-loc').value,
          });
          Modal.close();
          renderUsers();
        }},
      ]
    });
  };

  window.faAddUser = function() {
    const locs = Store.getLocations();
    Modal.show({
      title: 'Add User',
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="modal-form-field" style="grid-column:1/-1;">
            <label class="modal-form-label">Full name <span style="color:#A32D2D;">*</span></label>
            <input class="modal-form-input" id="au-name" placeholder="e.g. Jordan Ellis"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Username <span style="color:#A32D2D;">*</span></label>
            <input class="modal-form-input" id="au-username" placeholder="e.g. j.ellis"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Email</label>
            <input class="modal-form-input" id="au-email" placeholder="j.ellis@midcountyrental.com"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Phone</label>
            <input class="modal-form-input" id="au-phone" placeholder="(512) 555-0000"/>
          </div>
          <div class="modal-form-field">
            <label class="modal-form-label">Role</label>
            <select class="modal-form-select" id="au-role">
              <option value="mechanic">Mechanic</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div class="modal-form-field" style="grid-column:1/-1;">
            <label class="modal-form-label">Location</label>
            <select class="modal-form-select" id="au-loc">
              ${locs.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div id="au-err" style="font-size:11px;color:#A32D2D;margin-top:8px;display:none;">Name and username are required.</div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Add User', primary: true, onClick: () => {
          const name = document.getElementById('au-name').value.trim();
          const username = document.getElementById('au-username').value.trim();
          if (!name || !username) { document.getElementById('au-err').style.display='block'; return; }
          const parts = name.split(' ');
          const initials = parts.map(p=>p[0]).join('').toUpperCase().slice(0,2);
          Store.addManagedUser({
            username,
            displayName: name,
            shortName: parts.length > 1 ? parts[0]+' '+parts[1][0]+'.' : parts[0],
            avatar: initials,
            role: document.getElementById('au-role').value,
            email: document.getElementById('au-email').value.trim(),
            phone: document.getElementById('au-phone').value.trim(),
            location: document.getElementById('au-loc').value,
            lastSeen: 'Never',
          });
          Modal.close();
          renderUsers();
        }},
      ]
    });
  };

  window.faToggleUserStatus = function(id) {
    const u = Store.getManagedUsers().find(x => x.id === id);
    if (!u) return;
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    if (newStatus === 'inactive') {
      Modal.show({
        title: 'Deactivate user',
        body: `<div style="font-size:13px;color:#4B5268;line-height:1.6;">Deactivating <strong>${u.displayName}</strong> will prevent them from logging in. Their history and feature settings are preserved and can be restored by reactivating the account.</div>`,
        actions: [
          { label: 'Cancel', onClick: () => Modal.close() },
          { label: 'Deactivate', danger: true, onClick: () => {
            Store.updateManagedUser(id, { status: 'inactive' });
            Modal.close();
            renderUsers();
          }},
        ]
      });
    } else {
      Store.updateManagedUser(id, { status: 'active' });
      renderUsers();
    }
  };

  setTab('home');
}
