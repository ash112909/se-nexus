function render_wo_list(el) {
  const CURRENT_USER = 'James W.';
  let _currentFilter = 'all';
  let _searchQuery = '';

  // Equipment lookup for auto-populate in new WO form
  const EQUIPMENT_DB = {
    'FL-094': { make: 'Skyjack',     model: 'SJIII 3219',        serial: 'SJ3219-00847'    },
    'FL-017': { make: 'Caterpillar', model: '320 Excavator',     serial: 'CAT320-01044'    },
    'FL-031': { make: 'Toyota',      model: '8FGU25',            serial: 'TOY8FGU-00391'   },
    'FL-008': { make: 'Bobcat',      model: 'S650',              serial: 'BOB-S650-00814'  },
    'SM-011': { make: 'Skyjack',     model: 'SJIII 4632',        serial: 'SJ4632-01122'    },
    'SM-004': { make: 'Toyota',      model: '8FGU32',            serial: 'TOY8FGU32-00205' },
    'KY-003': { make: 'Bobcat',      model: 'S770',              serial: 'BOB-S770-00301'  },
    'KY-007': { make: 'Caterpillar', model: '308 Mini Excavator',serial: 'CAT308-00512'    },
  };

  const WO_TYPE_META = {
    equipment: { label: 'Repair',  color: '#185FA5', bg: '#E6F1FB' },
    pm:        { label: 'PM',      color: '#0F6E56', bg: '#E1F5EE' },
    stock:     { label: 'Stock',   color: '#534AB7', bg: '#EEEDFE' },
    other:     { label: 'Other',   color: '#6B7280', bg: '#F3F4F6' },
  };

  function machineIcon(machine, woType) {
    if (woType === 'stock') return 'ti-package';
    const m = (machine || '').toLowerCase();
    if (m.includes('skyjack') || m.includes('scissor')) return 'ti-crane';
    if (m.includes('cat') || m.includes('excavator')) return 'ti-backhoe';
    if (m.includes('toyota') || m.includes('forklift')) return 'ti-forklift';
    if (m.includes('bobcat')) return 'ti-bulldozer';
    return 'ti-tool';
  }

  function typePill(woType) {
    const t = WO_TYPE_META[woType] || WO_TYPE_META.other;
    return `<span class="wol-type-pill" style="background:${t.bg};color:${t.color};">${t.label}</span>`;
  }

  function statusPill(wo) {
    const hasActiveOrder = (wo.submittedOrders || []).some(o => ['submitted','in_transit','backordered'].includes(o.status));
    if (wo.status === 'active' && hasActiveOrder) return '<span class="wol-pill wol-pill-ordered">Parts ordered</span>';
    if (wo.status === 'active')   return '<span class="wol-pill wol-pill-open">Open</span>';
    if (wo.status === 'pending')  return '<span class="wol-pill wol-pill-waiting">Pending</span>';
    if (wo.status === 'closed')   return '<span class="wol-pill wol-pill-done">Closed</span>';
    return `<span class="wol-pill wol-pill-open">${wo.status}</span>`;
  }

  function priorityCell(priority) {
    if (priority === 'high')   return '<span class="wol-priority-high"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;"></i>High</span>';
    if (priority === 'medium') return '<span class="wol-priority-med"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;"></i>Med</span>';
    return '<span class="wol-priority-low"><i class="ti ti-circle-filled" style="font-size:8px;margin-right:4px;"></i>Low</span>';
  }

  function dueDateCell(dueDate, status) {
    if (!dueDate) return '<span style="color:#C0BAB3;font-size:12px;">—</span>';
    if (status === 'closed') return `<span style="color:#9CA3AF;font-size:12px;">${dueDate}</span>`;
    // Check if overdue (simple string compare against today Jul 6 2026)
    const due = new Date(dueDate);
    const today = new Date('2026-07-06');
    if (due < today) return `<span style="font-size:12px;color:#A32D2D;font-weight:600;">${dueDate}</span>`;
    return `<span style="font-size:12px;color:#3A3D4A;">${dueDate}</span>`;
  }

  function renderRows(wos) {
    if (!wos.length) return '<div class="wol-empty">No work orders found.</div>';
    return wos.map(wo => `
      <div class="wol-row" onclick="sendPrompt('Show me the Work Order detail view for WO #${wo.id}')">
        <div class="wol-td">
          <span class="wol-wo-id">#${wo.id}</span>
          ${wo.externalId ? `<div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${wo.externalId}</div>` : ''}
        </div>
        <div class="wol-td">${typePill(wo.woType)}</div>
        <div class="wol-td">
          <div class="wol-machine">
            <div class="wol-machine-icon"><i class="ti ${machineIcon(wo.machine, wo.woType)}"></i></div>
            <div>
              <div class="wol-machine-name">${wo.woType === 'stock' ? 'Stock Order' : `${wo.machine} · ${wo.asset}`}</div>
              <div class="wol-machine-issue">${wo.issue}</div>
            </div>
          </div>
        </div>
        <div class="wol-td">${dueDateCell(wo.dueDate, wo.status)}</div>
        <div class="wol-td">${statusPill(wo)}</div>
        <div class="wol-td">${priorityCell(wo.priority)}</div>
        <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
      </div>`).join('');
  }

  function getMyWOs(statusFilter) {
    return Store.getWorkOrders(statusFilter || 'all', CURRENT_USER);
  }

  function getFilteredWOs() {
    let wos = getMyWOs(_currentFilter === 'all' ? 'all' : _currentFilter);
    if (_searchQuery.trim()) {
      const q = _searchQuery.toLowerCase();
      wos = wos.filter(wo =>
        (wo.machine || '').toLowerCase().includes(q) ||
        (wo.issue || '').toLowerCase().includes(q) ||
        String(wo.id).includes(q) ||
        (wo.externalId || '').toLowerCase().includes(q) ||
        (wo.asset || '').toLowerCase().includes(q)
      );
    }
    return wos;
  }

  function reRenderTable() {
    const tbody = document.getElementById('wol-tbody');
    if (tbody) tbody.innerHTML = renderRows(getFilteredWOs());
    updateSummary();
  }

  function updateSummary() {
    const myAll    = getMyWOs('all');
    const myActive = myAll.filter(w => w.status === 'active');
    const myHigh   = myAll.filter(w => w.priority === 'high' && w.status !== 'closed');
    const withActiveOrders = myAll.filter(w =>
      (w.submittedOrders || []).some(o => ['submitted','in_transit','backordered'].includes(o.status))
    );
    const arrivingToday = myAll.filter(w =>
      (w.submittedOrders || []).some(o => o.status === 'in_transit')
    );

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('wol-sum-active',   myActive.length);
    set('wol-sum-active-2', myActive.length);
    set('wol-sum-parts',    withActiveOrders.length);
    set('wol-sum-high',     myHigh.length);
    set('wol-sum-arriving', arrivingToday.length);
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
.wol-thead { display: grid; grid-template-columns: 100px 80px 1fr 110px 110px 80px 50px; gap: 0; border-bottom: 1px solid #F0ECE8; padding: 0 18px; background: #FAFAF9; }
.wol-th { font-size: 11px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 8px; }
.wol-row { display: grid; grid-template-columns: 100px 80px 1fr 110px 110px 80px 50px; gap: 0; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; cursor: pointer; transition: background 0.1s; align-items: center; }
.wol-row:last-child { border-bottom: none; }
.wol-row:hover { background: #FAFAF9; }
.wol-td { padding: 12px 8px; font-size: 13px; color: #3A3D4A; }
.wol-wo-id { font-size: 12px; font-weight: 600; color: #111318; font-family: 'SF Mono', 'Consolas', monospace; }
.wol-type-pill { display: inline-flex; font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 7px; letter-spacing: .4px; white-space: nowrap; }
.wol-machine { display: flex; align-items: center; gap: 10px; }
.wol-machine-icon { width: 34px; height: 34px; background: #F5F2EE; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 16px; flex-shrink: 0; }
.wol-machine-name { font-size: 13px; font-weight: 600; color: #111318; line-height: 1.3; }
.wol-machine-issue { font-size: 12px; color: #7A7F8E; margin-top: 1px; }
.wol-pill { display: inline-flex; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.wol-pill-ordered  { background: #FAEEDA; color: #854F0B; }
.wol-pill-open     { background: #E6F1FB; color: #185FA5; }
.wol-pill-waiting  { background: #F1EEFE; color: #534AB7; }
.wol-pill-done     { background: #F0ECE8; color: #5A5F6E; }
.wol-priority-high { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #A32D2D; }
.wol-priority-med  { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #854F0B; }
.wol-priority-low  { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #3B6D11; }
.wol-arrow { color: #C0BAB3; font-size: 14px; }
.wol-empty { padding: 48px 24px; text-align: center; color: #9CA3AF; font-size: 13px; }
.wol-summary-bar { display: flex; gap: 12px; margin-bottom: 20px; }
.wol-summary-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 10px; padding: 14px 18px; flex: 1; }
.wol-summary-val { font-size: 22px; font-weight: 700; color: #111318; letter-spacing: -0.5px; }
.wol-summary-label { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
/* modal form */
.modal-form-field { margin-bottom: 14px; }
.modal-form-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.modal-form-label .lbl-opt { font-weight: 400; color: #9CA3AF; }
.modal-form-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.modal-form-input:focus { border-color: #F5A623; }
.modal-form-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.modal-field-error { font-size: 11px; color: #A32D2D; margin-top: 3px; display: none; }
.modal-form-hint { font-size: 11px; color: #9CA3AF; margin-top: 3px; }
.nwo-autofill-banner { font-size: 11px; color: #0F6E56; background: #E1F5EE; border-radius: 6px; padding: 5px 9px; margin-top: 4px; display: none; }
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
          <div class="wol-title">My Work Orders</div>
          <div class="wol-subtitle">${(Store.getCurrentLocation()||{name:'—'}).name} · <span id="wol-sum-active">0</span> active</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <input class="wol-search" type="text" placeholder="Search WO, machine, asset…" id="wol-search-input"/>
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
          <div class="wol-th">Type</div>
          <div class="wol-th">Machine / Issue</div>
          <div class="wol-th">Due Date</div>
          <div class="wol-th">Status</div>
          <div class="wol-th">Priority</div>
          <div class="wol-th"></div>
        </div>
        <div id="wol-tbody"></div>
      </div>
    </div>
  </div>
</div>`;

  reRenderTable();
  updateSummary();

  document.getElementById('wol-filters').querySelectorAll('.wol-filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('#wol-filters .wol-filter-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      _currentFilter = this.dataset.filter;
      reRenderTable();
    });
  });

  document.getElementById('wol-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    reRenderTable();
  });

  document.getElementById('wol-new-btn').addEventListener('click', function() {
    const formHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">WO Type *</label>
          <select class="modal-form-select" id="nwo-type">
            <option value="equipment">Equipment Repair</option>
            <option value="pm">Scheduled PM</option>
            <option value="stock">Stock Order</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" id="nwo-equipment-section">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Equipment # <span class="lbl-opt">(auto-populates make, model, serial)</span></label>
          <input class="modal-form-input" id="nwo-asset" type="text" placeholder="e.g. FL-094"/>
          <div class="nwo-autofill-banner" id="nwo-autofill-msg"></div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Make</label>
          <input class="modal-form-input" id="nwo-make" type="text" placeholder="e.g. Skyjack"/>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Model</label>
          <input class="modal-form-input" id="nwo-model" type="text" placeholder="e.g. SJIII 3219"/>
        </div>
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Serial #</label>
          <input class="modal-form-input" id="nwo-serial" type="text" placeholder="e.g. SJ3219-00847"/>
        </div>
      </div>
      <div class="modal-form-field">
        <label class="modal-form-label">Description / Issue *</label>
        <input class="modal-form-input" id="nwo-issue" type="text" placeholder="Describe the fault, task, or order"/>
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
          <label class="modal-form-label">Due Date <span class="lbl-opt">(optional)</span></label>
          <input class="modal-form-input" id="nwo-due" type="date"/>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Assignee</label>
          <select class="modal-form-select" id="nwo-assignee">
            <option>James W.</option>
            <option>M. Torres</option>
            <option>R. Kim</option>
            <option>D. Reyes</option>
            <option>T. Nguyen</option>
          </select>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">External WO ID <span class="lbl-opt">(RentalMan / ERP)</span></label>
          <input class="modal-form-input" id="nwo-extid" type="text" placeholder="e.g. RM-10122"/>
        </div>
      </div>`;

    Modal.show({
      title: 'New Work Order',
      body: formHtml,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Create WO', primary: true, onClick: () => {
            const issue = document.getElementById('nwo-issue').value.trim();
            const errEl = document.getElementById('nwo-issue-err');
            if (!issue) { errEl.style.display = 'block'; return; }
            errEl.style.display = 'none';

            const woType = document.getElementById('nwo-type').value;
            const asset  = document.getElementById('nwo-asset')?.value.trim() || '';
            const make   = document.getElementById('nwo-make')?.value.trim() || '';
            const model  = document.getElementById('nwo-model')?.value.trim() || '';
            const serial = document.getElementById('nwo-serial')?.value.trim() || '';
            const machine = (make && model) ? `${make} ${model}` : asset || '';

            const dueDateRaw = document.getElementById('nwo-due').value;
            const dueDate = dueDateRaw
              ? new Date(dueDateRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '';

            Store.addWorkOrder({
              woType, asset, make, model, serial, machine, issue, dueDate,
              externalId: document.getElementById('nwo-extid').value.trim(),
              priority:   document.getElementById('nwo-priority').value,
              assignee:   document.getElementById('nwo-assignee').value,
            });
            Modal.close();
            reRenderTable();
            updateSummary();
          }
        }
      ]
    });

    // Auto-populate on equipment # blur
    setTimeout(() => {
      const assetInput = document.getElementById('nwo-asset');
      if (!assetInput) return;
      assetInput.addEventListener('blur', function() {
        const key = this.value.trim().toUpperCase();
        const eq = EQUIPMENT_DB[key] || EQUIPMENT_DB[this.value.trim()];
        if (!eq) return;
        document.getElementById('nwo-make').value   = eq.make;
        document.getElementById('nwo-model').value  = eq.model;
        document.getElementById('nwo-serial').value = eq.serial;
        const banner = document.getElementById('nwo-autofill-msg');
        banner.textContent = `Auto-filled from fleet: ${eq.make} ${eq.model} · ${eq.serial}`;
        banner.style.display = 'block';
      });

      // Hide equipment section for stock/other types
      document.getElementById('nwo-type').addEventListener('change', function() {
        const section = document.getElementById('nwo-equipment-section');
        section.style.display = (this.value === 'stock' || this.value === 'other') ? 'none' : 'grid';
      });
    }, 50);
  });
}
