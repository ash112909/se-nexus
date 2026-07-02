function render_wo_list(el) {
  let _currentFilter = 'all';
  let _searchQuery = '';

  function machineIcon(machine) {
    const m = (machine || '').toLowerCase();
    if (m.includes('skyjack') || m.includes('scissor')) return 'ti-crane';
    if (m.includes('cat') || m.includes('excavator')) return 'ti-backhoe';
    if (m.includes('toyota') || m.includes('forklift')) return 'ti-forklift';
    if (m.includes('bobcat')) return 'ti-bulldozer';
    return 'ti-tool';
  }

  function statusPill(wo) {
    const s = wo.status;
    if (s === 'active' && wo.partIds && wo.partIds.length > 0) return '<span class="wol-pill wol-pill-ordered">Parts ordered</span>';
    if (s === 'active') return '<span class="wol-pill wol-pill-open">Open</span>';
    if (s === 'pending') return '<span class="wol-pill wol-pill-waiting">Pending</span>';
    if (s === 'closed') return '<span class="wol-pill wol-pill-done">Closed</span>';
    return '<span class="wol-pill wol-pill-open">' + s + '</span>';
  }

  function priorityCell(priority) {
    if (priority === 'high') return '<span class="wol-priority-high"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>High</span>';
    if (priority === 'medium') return '<span class="wol-priority-med"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>Med</span>';
    return '<span class="wol-priority-low"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;margin-top:1px;"></i>Low</span>';
  }

  function assigneeInitials(name) {
    return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function renderRows(wos) {
    if (!wos.length) return '<div class="wol-empty">No work orders found.</div>';
    return wos.map(wo => `
      <div class="wol-row" onclick="sendPrompt('Show me the Work Order detail view for WO #${wo.id}')">
        <div class="wol-td"><span class="wol-wo-id">#${wo.id}</span></div>
        <div class="wol-td">
          <div class="wol-machine">
            <div class="wol-machine-icon"><i class="ti ${machineIcon(wo.machine)}"></i></div>
            <div>
              <div class="wol-machine-name">${wo.machine} · ${wo.asset}</div>
              <div class="wol-machine-issue">${wo.issue}</div>
            </div>
          </div>
        </div>
        <div class="wol-td">
          <div class="wol-assignee">
            <div class="wol-avatar-sm">${assigneeInitials(wo.assignee)}</div>
            <span style="font-size:12px;color:#5A5F6E;">${wo.assignee}</span>
          </div>
        </div>
        <div class="wol-td">${statusPill(wo)}</div>
        <div class="wol-td">${priorityCell(wo.priority)}</div>
        <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
      </div>`).join('');
  }

  function getFilteredWOs() {
    let wos = Store.getWorkOrders(_currentFilter === 'all' ? 'all' : _currentFilter);
    if (_searchQuery.trim()) {
      const q = _searchQuery.toLowerCase();
      wos = wos.filter(wo => wo.machine.toLowerCase().includes(q) || wo.issue.toLowerCase().includes(q) || String(wo.id).includes(q));
    }
    return wos;
  }

  function reRenderTable() {
    const tbody = document.getElementById('wol-tbody');
    if (tbody) tbody.innerHTML = renderRows(getFilteredWOs());
    updateSummary();
  }

  function updateSummary() {
    const all = Store.getWorkOrders('all');
    const active = Store.getWorkOrders('active');
    const high = all.filter(w => w.priority === 'high');
    const withParts = all.filter(w => w.partIds && w.partIds.length > 0);
    const s = document.getElementById('wol-sum-active');
    const s2 = document.getElementById('wol-sum-parts');
    const s3 = document.getElementById('wol-sum-high');
    const s4 = document.getElementById('wol-sum-arriving');
    if (s) s.textContent = active.length;
    if (s2) s2.textContent = withParts.length;
    if (s3) s3.textContent = high.length;
    if (s4) s4.textContent = withParts.length;
  }

  el.innerHTML = `
<style>
.topbar-search { flex: 1; max-width: 380px; height: 32px; background: #2A2A2A; border: 1px solid #333; border-radius: 8px; display: flex; align-items: center; gap: 8px; padding: 0 10px; color: #5C6070; font-size: 13px; cursor: text; }
.wol-content { flex: 1; padding: 28px 28px 40px; overflow-y: auto; }
.wol-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.wol-title { font-size: 18px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.wol-subtitle { font-size: 13px; color: #7A7F8E; margin-top: 2px; }
.wol-filters { display: flex; align-items: center; gap: 8px; }
.wol-filter-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid #E2DDD8; background: #FFFFFF; color: #5A5F6E; transition: all 0.12s; user-select: none; }
.wol-filter-pill.active { background: #1E1E1E; color: #FFFFFF; border-color: #1E1E1E; }
.wol-filter-pill:hover:not(.active) { border-color: #C8C3BC; }
.wol-search { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 8px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; width: 200px; }
.wol-search:focus { border-color: #F5A623; }
.wol-new-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #F5A623; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
.wol-new-btn:hover { background: #E8980F; }
.wol-table { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.wol-thead { display: grid; grid-template-columns: 110px 1fr 160px 90px 90px 80px; gap: 0; border-bottom: 1px solid #F0ECE8; padding: 0 18px; background: #FAFAF9; }
.wol-th { font-size: 11px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 8px; }
.wol-row { display: grid; grid-template-columns: 110px 1fr 160px 90px 90px 80px; gap: 0; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; cursor: pointer; transition: background 0.1s; align-items: center; }
.wol-row:last-child { border-bottom: none; }
.wol-row:hover { background: #FAFAF9; }
.wol-td { padding: 14px 8px; font-size: 13px; color: #3A3D4A; }
.wol-wo-id { font-size: 12px; font-weight: 600; color: #111318; font-family: 'SF Mono', 'Consolas', monospace; }
.wol-machine { display: flex; align-items: center; gap: 10px; }
.wol-machine-icon { width: 34px; height: 34px; background: #F5F2EE; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 16px; flex-shrink: 0; }
.wol-machine-name { font-size: 13px; font-weight: 600; color: #111318; line-height: 1.3; }
.wol-machine-issue { font-size: 12px; color: #7A7F8E; margin-top: 1px; }
.wol-assignee { display: flex; align-items: center; gap: 7px; }
.wol-avatar-sm { width: 22px; height: 22px; border-radius: 50%; background: #3C4052; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #FFFFFF; flex-shrink: 0; }
.wol-pill { display: inline-flex; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.wol-pill-ordered { background: #FAEEDA; color: #854F0B; }
.wol-pill-open { background: #E6F1FB; color: #185FA5; }
.wol-pill-progress { background: #EAF3DE; color: #3B6D11; }
.wol-pill-waiting { background: #F1EEFE; color: #534AB7; }
.wol-pill-done { background: #F0ECE8; color: #5A5F6E; }
.wol-priority-high { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #A32D2D; }
.wol-priority-med { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #854F0B; }
.wol-priority-low { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #3B6D11; }
.wol-arrow { color: #C0BAB3; font-size: 14px; }
.wol-empty { padding: 48px 24px; text-align: center; color: #9CA3AF; font-size: 13px; }
.wol-summary-bar { display: flex; gap: 12px; margin-bottom: 20px; }
.wol-summary-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 10px; padding: 14px 18px; flex: 1; }
.wol-summary-val { font-size: 22px; font-weight: 700; color: #111318; letter-spacing: -0.5px; }
.wol-summary-label { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
/* modal form */
.modal-form-field { margin-bottom: 14px; }
.modal-form-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.modal-form-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.modal-form-input:focus { border-color: #F5A623; }
.modal-form-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.modal-field-error { font-size: 11px; color: #A32D2D; margin-top: 3px; display: none; }
</style>
<h2 class="sr-only">Work Orders</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="wol-content">
      <div class="wol-header">
        <div>
          <div class="wol-title">Work Orders</div>
          <div class="wol-subtitle">${(Store.getCurrentLocation()||{name:'—'}).name} · <span id="wol-sum-active">0</span> active</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <input class="wol-search" type="text" placeholder="Search machine or issue…" id="wol-search-input"/>
          <div class="wol-filters" id="wol-filters">
            <div class="wol-filter-pill active" data-filter="all">All</div>
            <div class="wol-filter-pill" data-filter="active">Active</div>
            <div class="wol-filter-pill" data-filter="pending">Pending</div>
            <div class="wol-filter-pill" data-filter="closed">Closed</div>
          </div>
          <button class="wol-new-btn" id="wol-new-btn"><i class="ti ti-plus" style="font-size:14px;"></i> New WO</button>
        </div>
      </div>

      <div class="wol-summary-bar">
        <div class="wol-summary-card">
          <div class="wol-summary-val" id="wol-sum-active-2">0</div>
          <div class="wol-summary-label">Active orders</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#854F0B;" id="wol-sum-parts">0</div>
          <div class="wol-summary-label">Parts on order</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#A32D2D;" id="wol-sum-high">0</div>
          <div class="wol-summary-label">High priority</div>
        </div>
        <div class="wol-summary-card">
          <div class="wol-summary-val" style="color:#0F6E56;" id="wol-sum-arriving">0</div>
          <div class="wol-summary-label">Parts arriving today</div>
        </div>
      </div>

      <div class="wol-table">
        <div class="wol-thead">
          <div class="wol-th">WO #</div>
          <div class="wol-th">Machine / Issue</div>
          <div class="wol-th">Assigned</div>
          <div class="wol-th">Status</div>
          <div class="wol-th">Priority</div>
          <div class="wol-th"></div>
        </div>
        <div id="wol-tbody"></div>
      </div>
    </div>
  </div>
</div>`;

  // Initial render
  reRenderTable();
  updateSummary();

  // Wire up filter pills
  document.getElementById('wol-filters').querySelectorAll('.wol-filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('#wol-filters .wol-filter-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      _currentFilter = this.dataset.filter;
      reRenderTable();
    });
  });

  // Wire up search
  document.getElementById('wol-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    reRenderTable();
  });

  // New WO button
  document.getElementById('wol-new-btn').addEventListener('click', function() {
    const formHtml = `
      <div class="modal-form-field">
        <label class="modal-form-label">Machine name *</label>
        <input class="modal-form-input" id="nwo-machine" type="text" placeholder="e.g. Skyjack SJIII 3219"/>
        <div class="modal-field-error" id="nwo-machine-err">Required</div>
      </div>
      <div class="modal-form-field">
        <label class="modal-form-label">Asset ID *</label>
        <input class="modal-form-input" id="nwo-asset" type="text" placeholder="e.g. FL-094"/>
        <div class="modal-field-error" id="nwo-asset-err">Required</div>
      </div>
      <div class="modal-form-field">
        <label class="modal-form-label">Issue description *</label>
        <input class="modal-form-input" id="nwo-issue" type="text" placeholder="Describe the fault or task"/>
        <div class="modal-field-error" id="nwo-issue-err">Required</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field">
          <label class="modal-form-label">Priority</label>
          <select class="modal-form-select" id="nwo-priority">
            <option value="high">High</option>
            <option value="medium" selected>Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Assignee</label>
          <select class="modal-form-select" id="nwo-assignee">
            <option>James W.</option>
            <option>M. Torres</option>
            <option>R. Kim</option>
            <option>R. Singh</option>
          </select>
        </div>
      </div>`;

    Modal.show({
      title: 'New Work Order',
      body: formHtml,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Create WO', primary: true, onClick: () => {
            const machine = document.getElementById('nwo-machine').value.trim();
            const asset = document.getElementById('nwo-asset').value.trim();
            const issue = document.getElementById('nwo-issue').value.trim();
            let valid = true;
            ['machine', 'asset', 'issue'].forEach(f => {
              const val = document.getElementById('nwo-' + f).value.trim();
              const errEl = document.getElementById('nwo-' + f + '-err');
              if (!val) { errEl.style.display = 'block'; valid = false; }
              else errEl.style.display = 'none';
            });
            if (!valid) return;
            Store.addWorkOrder({
              machine, asset, issue,
              priority: document.getElementById('nwo-priority').value,
              assignee: document.getElementById('nwo-assignee').value,
            });
            Modal.close();
            reRenderTable();
            updateSummary();
          }
        }
      ]
    });
  });
}
