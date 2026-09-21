function render_wo_list(el) {
  const _user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
  const _isSupervisor = _user && _user.role === 'supervisor';
  const CURRENT_USER = _user ? _user.shortName : 'James W.';

  // ── top-level tab: 'orders' | 'archive' ──────────────────────────
  let _mainTab = 'orders';

  // ── Orders tab state ─────────────────────────────────────────────
  let _statusFilter = 'all';
  let _supplierFilter = 'all';
  let _dateFilter = 'all';
  let _searchQuery = '';
  let _sortField = null;
  let _sortDir = 'asc';

  // ── Archive tab state ─────────────────────────────────────────────
  let _archSearch = '';
  let _archSelectedId = null;

  // ── Equipment lookup ──────────────────────────────────────────────
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

  const TYPE_META = {
    equipment: { label: 'Repair',  color: '#185FA5', bg: '#E6F1FB' },
    pm:        { label: 'PM',      color: '#1C3969', bg: '#E1F5EE' },
    stock:     { label: 'Stock',   color: '#534AB7', bg: '#EEEDFE' },
    other:     { label: 'General', color: '#6B7280', bg: '#F3F4F6' },
  };

  function isWorkOrder(wo) { return wo.woType === 'equipment' || wo.woType === 'pm'; }

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
    const t = TYPE_META[woType] || TYPE_META.other;
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
    const due = new Date(dueDate);
    const today = new Date('2026-09-18');
    if (due < today) return `<span style="font-size:12px;color:#A32D2D;font-weight:600;">${dueDate}</span>`;
    return `<span style="font-size:12px;color:#3A3D4A;">${dueDate}</span>`;
  }

  // Grid cols: supervisor gets an Assignee column
  const _cols = _isSupervisor
    ? '100px 80px 1fr 130px 110px 110px 80px 50px'
    : '100px 80px 1fr 110px 110px 80px 50px';

  // ── Orders tab: supplier list derived from WOs ────────────────────
  function getSupplierOptions() {
    const wos = Store.getWorkOrders('all', null);
    const makes = [...new Set(wos.map(w => w.make).filter(Boolean))].sort();
    return makes;
  }

  function dateMatchesFilter(dateStr, filter) {
    if (!filter || filter === 'all') return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date('2026-09-18');
    if (filter === 'week') {
      const wk = new Date(now); wk.setDate(now.getDate() - 7);
      return d >= wk;
    }
    if (filter === 'month') {
      const mo = new Date(now); mo.setDate(now.getDate() - 30);
      return d >= mo;
    }
    if (filter === 'quarter') {
      const qt = new Date(now); qt.setDate(now.getDate() - 90);
      return d >= qt;
    }
    return true;
  }

  function getFilteredWOs() {
    let wos = Store.getWorkOrders(_statusFilter === 'all' ? 'all' : _statusFilter,
      _isSupervisor ? null : CURRENT_USER);

    wos = wos.filter(w => !w.archived);

    if (_supplierFilter !== 'all') {
      wos = wos.filter(w => (w.make || '') === _supplierFilter);
    }
    if (_dateFilter !== 'all') {
      wos = wos.filter(w => dateMatchesFilter(w.opened || w.dueDate, _dateFilter));
    }
    if (_searchQuery.trim()) {
      const q = _searchQuery.toLowerCase();
      wos = wos.filter(wo =>
        (wo.machine || '').toLowerCase().includes(q) ||
        (wo.issue || '').toLowerCase().includes(q) ||
        String(wo.id).includes(q) ||
        (wo.externalId || '').toLowerCase().includes(q) ||
        (wo.asset || '').toLowerCase().includes(q) ||
        (wo.assignee || '').toLowerCase().includes(q)
      );
    }

    if (_sortField) {
      wos = [...wos].sort((a, b) => {
        let av = a[_sortField] || '';
        let bv = b[_sortField] || '';
        if (_sortField === 'id') { av = +av; bv = +bv; }
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return _sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return wos;
  }

  function renderOrderRows(wos) {
    if (!wos.length) return '<div class="wol-empty">No orders found.</div>';
    return wos.map(wo => `
      <div class="wol-row" style="grid-template-columns:${_cols};" onclick="Router.navigate('wo-detail',{woId:${wo.id}})">
        <div class="wol-td">
          <span class="wol-wo-id">#${wo.id}</span>
          ${wo.externalId ? `<div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${wo.externalId}</div>` : ''}
          ${isWorkOrder(wo) ? '<div style="font-size:9px;font-weight:700;letter-spacing:.6px;color:#4A9A6A;text-transform:uppercase;margin-top:1px;">WO</div>' : ''}
        </div>
        <div class="wol-td">${typePill(wo.woType)}</div>
        <div class="wol-td">
          <div class="wol-machine">
            <div class="wol-machine-icon"><i class="ti ${machineIcon(wo.machine, wo.woType)}"></i></div>
            <div>
              <div class="wol-machine-name">${(wo.woType === 'stock' || wo.woType === 'other') ? (wo.issue || 'General Order') : `${wo.machine} · ${wo.asset}`}</div>
              <div class="wol-machine-issue">${wo.issue}</div>
            </div>
          </div>
        </div>
        ${_isSupervisor ? `<div class="wol-td"><span style="font-size:12px;color:#5A5F6E;">${wo.assignee || '—'}</span></div>` : ''}
        <div class="wol-td">${dueDateCell(wo.dueDate, wo.status)}</div>
        <div class="wol-td">${statusPill(wo)}</div>
        <div class="wol-td">${priorityCell(wo.priority)}</div>
        <div class="wol-td" style="text-align:right;"><i class="ti ti-chevron-right wol-arrow"></i></div>
      </div>`).join('');
  }

  function reRenderOrderTable() {
    const tbody = document.getElementById('wol-tbody');
    if (tbody) tbody.innerHTML = renderOrderRows(getFilteredWOs());
    const countEl = document.getElementById('wol-result-count');
    if (countEl) countEl.textContent = getFilteredWOs().length + ' orders';
  }

  // ── Build supplier filter options (orders tab) ────────────────────
  const supplierOpts = getSupplierOptions();

  el.innerHTML = `
<style>
/* ── Shared shell / topbar ─────────────────────── */
.topbar-search { flex: 1; max-width: 380px; height: 32px; background: #0E1F3D; border: 1px solid #0E1F3D; border-radius: 8px; display: flex; align-items: center; gap: 8px; padding: 0 10px; color: #5C6070; font-size: 13px; cursor: text; }

/* ── Main tab bar ─────────────────────────────── */
.wol-main-tabs { display: flex; align-items: center; gap: 0; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; padding: 0 28px; }
.wol-mtab { padding: 13px 16px; font-size: 13px; font-weight: 500; color: #7A7F8E; cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.wol-mtab:hover { color: #3A3D4A; }
.wol-mtab.active { color: #111318; font-weight: 600; border-bottom-color: #1C3969; }
.wol-mtab-badge { font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 7px; background: #F0ECE8; color: #5A5F6E; }
.wol-mtab-new { margin-left: auto; }

/* ── Filter bar ───────────────────────────────── */
.wol-filter-bar { background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; padding: 10px 28px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.wol-filter-pills { display: flex; gap: 4px; }
.wol-filter-pill { padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid #E2DDD8; background: #FFFFFF; color: #5A5F6E; user-select: none; white-space: nowrap; }
.wol-filter-pill.active { background: #152B52; color: #FFFFFF; border-color: #152B52; }
.wol-filter-pill:hover:not(.active) { border-color: #C8C3BC; }
.wol-filter-divider { width: 1px; height: 24px; background: #E2DDD8; flex-shrink: 0; }
.wol-select { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 12px; font-family: inherit; color: #3A3D4A; outline: none; cursor: pointer; }
.wol-search-wrap { position: relative; }
.wol-search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 13px; pointer-events: none; }
.wol-search { height: 34px; background: #FFFFFF; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 30px; font-size: 12px; font-family: inherit; color: #111318; outline: none; width: 190px; }
.wol-search:focus { border-color: #1C3969; }
.wol-result-count { margin-left: auto; font-size: 12px; color: #B0AAA3; white-space: nowrap; }
.wol-new-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: #1C3969; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; color: #FFFFFF; cursor: pointer; font-family: inherit; }
.wol-new-btn:hover { background: #152B52; }

/* ── Orders table ─────────────────────────────── */
.wol-content { flex: 1; overflow-y: auto; }
.wol-table-wrap { padding: 0 28px 40px; }
.wol-table { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; margin-top: 20px; }
.wol-thead { display: grid; gap: 0; border-bottom: 1px solid #F0ECE8; padding: 0 18px; background: #FAFAF9; }
.wol-th { font-size: 11px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 8px; }
.wol-th-sort { cursor: pointer; user-select: none; white-space: nowrap; }
.wol-th-sort:hover { color: #5A5F6E; }
.wol-th-sort.sorted { color: #111318; }
.wol-sort-arrow { margin-left: 4px; font-size: 9px; }
.wol-row { display: grid; gap: 0; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; cursor: pointer; transition: background 0.1s; align-items: center; }
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
.wol-pill-ordered  { background: #D6E4F7; color: #1C3969; }
.wol-pill-open     { background: #E6F1FB; color: #185FA5; }
.wol-pill-waiting  { background: #F1EEFE; color: #534AB7; }
.wol-pill-done     { background: #F0ECE8; color: #5A5F6E; }
.wol-priority-high { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #A32D2D; }
.wol-priority-med  { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #1C3969; }
.wol-priority-low  { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; color: #3B6D11; }
.wol-arrow { color: #C0BAB3; font-size: 14px; }
.wol-empty { padding: 48px 24px; text-align: center; color: #9CA3AF; font-size: 13px; }

/* ── History tab ──────────────────────────────── */
.hist-tabs { display: flex; align-items: center; gap: 2px; padding: 0 28px; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; }
.hist-tab { padding: 11px 14px; font-size: 13px; font-weight: 500; color: #7A7F8E; cursor: pointer; border-bottom: 2px solid transparent; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.hist-tab:hover { color: #3A3D4A; }
.hist-tab.active { color: #111318; font-weight: 600; border-bottom-color: #1C3969; }
.hist-tab-badge { font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 7px; background: #F0ECE8; color: #5A5F6E; }
.hist-table-wrap { flex: 1; overflow-y: auto; min-height: 0; }
.oh-table { width: 100%; border-collapse: collapse; }
.oh-table th { background: #FAFAF8; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 9px 14px; text-align: left; border-bottom: 1px solid #E8E4DF; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.oh-table td { padding: 10px 14px; border-bottom: 0.5px solid #F0ECE8; font-size: 13px; color: #3A3D4A; vertical-align: middle; }
.oh-table tr:hover td { background: #FAFAF8; cursor: pointer; }
.oh-table tr.selected-row td { background: #D6E4F7; }
.status-pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pill-saved { background: #F0ECE8; color: #5A5F6E; }
.pill-submitted { background: #DBEAFE; color: #1D4ED8; }
.pill-delivered { background: #DBEAFE; color: #1C3969; }
.pill-backordered { background: #FEF3C7; color: #92400E; }
.pill-review { background: #EDE9FE; color: #5B21B6; }
.hist-detail-panel { background: #FFFFFF; border-top: 1px solid #E8E4DF; flex-shrink: 0; max-height: 55vh; overflow-y: auto; }
.oh-detail-header { display: flex; align-items: center; gap: 12px; padding: 14px 24px; border-bottom: 0.5px solid #E8E4DF; position: sticky; top: 0; background: #FFFFFF; z-index: 2; }
.oh-detail-title { font-size: 15px; font-weight: 700; color: #111318; flex: 1; }
.oh-detail-close { width: 28px; height: 28px; background: #F5F2EE; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: #5A5F6E; }
.oh-detail-close:hover { background: #E8E4DF; }
.oh-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 0.5px solid #E8E4DF; }
.oh-detail-section { padding: 14px 24px; border-right: 0.5px solid #E8E4DF; }
.oh-detail-section:last-child { border-right: none; }
.oh-detail-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
.oh-detail-row { display: flex; justify-content: space-between; padding: 3px 0; }
.oh-detail-label { font-size: 12px; color: #9CA3AF; }
.oh-detail-val { font-size: 12px; font-weight: 500; color: #111318; text-align: right; }
.oh-items-section { border-top: 0.5px solid #E8E4DF; }
.oh-items-title { display: flex; align-items: center; gap: 6px; padding: 12px 24px 8px; font-size: 12px; font-weight: 600; color: #5A5F6E; text-transform: uppercase; letter-spacing: 0.8px; }
.oh-items-table { width: 100%; border-collapse: collapse; }
.oh-items-table th { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 6px 24px; text-align: left; background: #FAFAF8; border-top: 0.5px solid #F0ECE8; border-bottom: 0.5px solid #F0ECE8; }
.oh-items-table td { padding: 8px 24px; font-size: 12px; color: #3A3D4A; border-bottom: 0.5px solid #F5F2EE; vertical-align: middle; }
.oh-items-table tr:last-child td { border-bottom: none; }
.oh-items-total { padding: 10px 24px; font-size: 12px; color: #7A7F8E; text-align: right; border-top: 0.5px solid #F0ECE8; }
.oh-comments { padding: 14px 24px; border-top: 0.5px solid #E8E4DF; }
.oh-comments-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; }
.oh-comment-input { width: 100%; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
/* modal */
.modal-form-field { margin-bottom: 14px; }
.modal-form-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.modal-form-label .lbl-opt { font-weight: 400; color: #9CA3AF; }
.modal-form-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.modal-form-input:focus { border-color: #1C3969; }
.modal-form-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.modal-field-error { font-size: 11px; color: #A32D2D; margin-top: 3px; display: none; }
.modal-form-hint { font-size: 11px; color: #9CA3AF; margin-top: 3px; }
.nwo-autofill-banner { font-size: 11px; color: #1C3969; background: #E1F5EE; border-radius: 6px; padding: 5px 9px; margin-top: 4px; display: none; }
.wol-type-pick-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 14px; background: #FAFAF9; border: 1.5px solid #E8E4DF; border-radius: 12px; cursor: pointer; transition: border-color 0.12s, background 0.12s; font-family: inherit; width: 100%; }
.wol-type-pick-card:hover { border-color: #1C3969; background: #FFFBF2; }
</style>
<h2 class="sr-only">Orders</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main" style="display:flex;flex-direction:column;min-height:0;overflow:hidden;">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Orders</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <!-- Main tab bar -->
    <div class="wol-main-tabs">
      <div class="wol-mtab active" id="mtab-orders" onclick="wolSwitchMain('orders')">
        <i class="ti ti-clipboard-list" style="font-size:14px;"></i> Orders
        <span class="wol-mtab-badge" id="mtab-orders-badge">${Store.getWorkOrders('all', _isSupervisor ? null : CURRENT_USER).length}</span>
      </div>
      <div class="wol-mtab" id="mtab-archive" onclick="wolSwitchMain('archive')">
        <i class="ti ti-archive" style="font-size:14px;"></i> Archive
        <span class="wol-mtab-badge" id="mtab-archive-badge">${Store.getWorkOrders('all', null).filter(w => w.archived).length}</span>
      </div>
      <div class="wol-mtab-new">
        <button class="wol-new-btn" id="wol-new-btn"><i class="ti ti-plus" style="font-size:14px;"></i> New Order</button>
      </div>
    </div>

    <!-- ══ ORDERS panel ══════════════════════════════════════════════ -->
    <div id="wol-orders-panel" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
      <!-- Filter bar -->
      <div class="wol-filter-bar">
        <div class="wol-filter-pills" id="wol-status-pills">
          <div class="wol-filter-pill active" data-filter="all">All</div>
          <div class="wol-filter-pill" data-filter="active">Active</div>
          <div class="wol-filter-pill" data-filter="pending">Pending</div>
          <div class="wol-filter-pill" data-filter="closed">Closed</div>
        </div>
        <div class="wol-filter-divider"></div>
        <select class="wol-select" id="wol-supplier-select">
          <option value="all">All suppliers</option>
          ${supplierOpts.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <select class="wol-select" id="wol-date-select">
          <option value="all">Any date</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
        </select>
        <div class="wol-search-wrap">
          <i class="ti ti-search wol-search-icon"></i>
          <input class="wol-search" type="text" placeholder="Search…" id="wol-search-input"/>
        </div>
        <span class="wol-result-count" id="wol-result-count"></span>
      </div>

      <!-- Table -->
      <div class="wol-content">
        <div class="wol-table-wrap">
          <div class="wol-table">
            <div class="wol-thead" style="grid-template-columns:${_cols};" id="wol-thead">
              <div class="wol-th wol-th-sort" data-sort="id">Order #</div>
              <div class="wol-th wol-th-sort" data-sort="woType">Type</div>
              <div class="wol-th wol-th-sort" data-sort="machine">Machine / Issue</div>
              ${_isSupervisor ? '<div class="wol-th wol-th-sort" data-sort="assignee">Assignee</div>' : ''}
              <div class="wol-th wol-th-sort" data-sort="dueDate">Due Date</div>
              <div class="wol-th wol-th-sort" data-sort="status">Status</div>
              <div class="wol-th wol-th-sort" data-sort="priority">Priority</div>
              <div class="wol-th"></div>
            </div>
            <div id="wol-tbody"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ ARCHIVE panel ═════════════════════════════════════════════ -->
    <div id="wol-archive-panel" style="display:none;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
      <!-- Archive filter bar -->
      <div class="wol-filter-bar">
        <div class="wol-search-wrap">
          <i class="ti ti-search wol-search-icon"></i>
          <input class="wol-search" id="arch-search-input" type="text" placeholder="Search archived orders…" style="width:220px;"/>
        </div>
        <span class="wol-result-count" id="arch-result-count"></span>
      </div>

      <!-- Archive table -->
      <div class="hist-table-wrap">
        <table class="oh-table">
          <thead>
            <tr>
              <th>WO #</th><th>Type</th><th>Machine / Issue</th><th>Assignee</th><th>Closed</th><th>Priority</th>
            </tr>
          </thead>
          <tbody id="arch-tbody"></tbody>
        </table>
      </div>

      <div style="padding:10px 24px;background:#FFFFFF;border-top:0.5px solid #E8E4DF;display:flex;align-items:center;font-size:12px;color:#7A7F8E;">
        <i class="ti ti-lock" style="font-size:12px;margin-right:5px;"></i> Archived orders are read-only
      </div>
    </div>

  </div>
</div>`;

  // ── Wire up Orders tab ────────────────────────────────────────────
  reRenderOrderTable();

  document.getElementById('wol-status-pills').querySelectorAll('.wol-filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('#wol-status-pills .wol-filter-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      _statusFilter = this.dataset.filter;
      reRenderOrderTable();
    });
  });

  document.getElementById('wol-supplier-select').addEventListener('change', function() {
    _supplierFilter = this.value;
    reRenderOrderTable();
  });

  document.getElementById('wol-date-select').addEventListener('change', function() {
    _dateFilter = this.value;
    reRenderOrderTable();
  });

  document.getElementById('wol-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    reRenderOrderTable();
  });

  // ── Wire up Archive tab ───────────────────────────────────────────
  function renderArchiveRows() {
    const tbody = document.getElementById('arch-tbody');
    if (!tbody) return;
    let wos = Store.getWorkOrders('all', null).filter(w => w.archived);
    if (_archSearch.trim()) {
      const q = _archSearch.toLowerCase();
      wos = wos.filter(w =>
        String(w.id).includes(q) ||
        (w.machine || '').toLowerCase().includes(q) ||
        (w.issue || '').toLowerCase().includes(q) ||
        (w.assignee || '').toLowerCase().includes(q)
      );
    }
    const countEl = document.getElementById('arch-result-count');
    if (countEl) countEl.textContent = wos.length + ' archived';
    if (!wos.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#9CA3AF;font-size:13px;">No archived orders.</td></tr>';
      return;
    }
    tbody.innerHTML = wos.map(wo => {
      const t = TYPE_META[wo.woType] || TYPE_META.other;
      return `<tr onclick="Router.navigate('wo-detail',{woId:${wo.id}})" style="cursor:pointer;">
        <td><strong style="font-size:12px;font-family:monospace;color:#111318;">#${wo.id}</strong>${wo.externalId ? `<div style="font-size:10px;color:#9CA3AF;">${wo.externalId}</div>` : ''}</td>
        <td><span class="wol-type-pill" style="background:${t.bg};color:${t.color};">${t.label}</span></td>
        <td>
          <div style="font-size:13px;font-weight:600;color:#111318;">${wo.machine || wo.asset || '—'}</div>
          <div style="font-size:12px;color:#7A7F8E;">${wo.issue || ''}</div>
        </td>
        <td style="font-size:12px;color:#5A5F6E;">${wo.assignee || '—'}</td>
        <td style="font-size:12px;color:#9CA3AF;">${wo.closedDate || wo.dueDate || '—'}</td>
        <td>${priorityCell(wo.priority)}</td>
      </tr>`;
    }).join('');
  }

  renderArchiveRows();

  document.getElementById('arch-search-input').addEventListener('input', function() {
    _archSearch = this.value; renderArchiveRows();
  });

  // ── Sort column headers ───────────────────────────────────────────
  function updateSortHeaders() {
    document.querySelectorAll('#wol-thead .wol-th-sort').forEach(th => {
      const f = th.dataset.sort;
      th.classList.toggle('sorted', f === _sortField);
      const arrow = th.querySelector('.wol-sort-arrow');
      if (arrow) arrow.remove();
      if (f === _sortField) {
        th.insertAdjacentHTML('beforeend', `<span class="wol-sort-arrow">${_sortDir === 'asc' ? '▲' : '▼'}</span>`);
      }
    });
  }

  document.getElementById('wol-thead').querySelectorAll('.wol-th-sort').forEach(th => {
    th.addEventListener('click', function() {
      const f = this.dataset.sort;
      if (_sortField === f) {
        _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        _sortField = f;
        _sortDir = 'asc';
      }
      updateSortHeaders();
      reRenderOrderTable();
    });
  });

  // ── Main tab switch ───────────────────────────────────────────────
  window.wolSwitchMain = function(tab) {
    _mainTab = tab;
    document.getElementById('mtab-orders').classList.toggle('active', tab === 'orders');
    document.getElementById('mtab-archive').classList.toggle('active', tab === 'archive');
    const op = document.getElementById('wol-orders-panel');
    const ap = document.getElementById('wol-archive-panel');
    if (op) { op.style.display = tab === 'orders' ? 'flex' : 'none'; }
    if (ap) { ap.style.display = tab === 'archive' ? 'flex' : 'none'; }
  };

  // ── New Order modal ───────────────────────────────────────────────
  const ASSIGNEES = ['James W.','Marcus T.','Lena R.','Darius K.','Priya N.'];

  function openWoForm() {
    const formHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Order Type *</label>
          <select class="modal-form-select" id="nwo-type">
            <option value="equipment">Equipment Repair</option>
            <option value="pm">Scheduled PM</option>
            <option value="stock">Stock / Parts</option>
            <option value="other">Other / General</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" id="nwo-equipment-section">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label" id="nwo-asset-lbl">Equipment # * <span class="lbl-opt">(auto-populates make, model, serial)</span></label>
          <input class="modal-form-input" id="nwo-asset" type="text" placeholder="e.g. FL-094"/>
          <div class="modal-field-error" id="nwo-asset-err">Required</div>
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
        <label class="modal-form-label" id="nwo-issue-lbl">Fault / Issue *</label>
        <input class="modal-form-input" id="nwo-issue" type="text" placeholder="Describe the fault or maintenance task"/>
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
          <label class="modal-form-label" id="nwo-due-lbl">Due Date *</label>
          <input class="modal-form-input" id="nwo-due" type="date"/>
          <div class="modal-field-error" id="nwo-due-err">Required</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Assignee</label>
          <select class="modal-form-select" id="nwo-assignee">
            ${ASSIGNEES.map(n => `<option${n === CURRENT_USER ? ' selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Order ID <span class="lbl-opt" style="font-size:10px;">(RentalMan / ERP — optional)</span></label>
          <input class="modal-form-input" id="nwo-extid" type="text" placeholder="e.g. RM-10122"/>
        </div>
      </div>`;

    Modal.show({
      title: 'New Order',
      body: formHtml,
      actions: [
        { label: 'Back', onClick: () => openTypePicker() },
        {
          label: 'Create Order', primary: true, onClick: () => {
            const woType = document.getElementById('nwo-type').value;
            const isWoType = woType === 'equipment' || woType === 'pm';
            const issue  = document.getElementById('nwo-issue').value.trim();
            const asset  = document.getElementById('nwo-asset').value.trim();
            const dueRaw = document.getElementById('nwo-due').value;
            const show   = (id, v) => { const e = document.getElementById(id); if (e) e.style.display = v ? 'block' : 'none'; };
            let valid = true;
            if (isWoType) {
              show('nwo-asset-err', !asset); if (!asset) valid = false;
              show('nwo-issue-err', !issue); if (!issue) valid = false;
              show('nwo-due-err',   !dueRaw); if (!dueRaw) valid = false;
            }
            if (!valid) return;
            const make    = document.getElementById('nwo-make')?.value.trim() || '';
            const model   = document.getElementById('nwo-model')?.value.trim() || '';
            const serial  = document.getElementById('nwo-serial')?.value.trim() || '';
            const machine = (make && model) ? `${make} ${model}` : asset || '';
            const extId   = document.getElementById('nwo-extid').value.trim();
            const dueDate = dueRaw ? new Date(dueRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            Store.addWorkOrder({ woType, asset, make, model, serial, machine, issue, dueDate,
              externalId: extId, priority: document.getElementById('nwo-priority').value,
              assignee: document.getElementById('nwo-assignee').value });
            Modal.close(); reRenderOrderTable();
          }
        }
      ]
    });

    setTimeout(() => {
      function updateRequiredLabels() {
        const woType = document.getElementById('nwo-type')?.value;
        const isWoType = woType === 'equipment' || woType === 'pm';
        const assetLbl = document.getElementById('nwo-asset-lbl');
        const issueLbl = document.getElementById('nwo-issue-lbl');
        const dueLbl   = document.getElementById('nwo-due-lbl');
        if (assetLbl) assetLbl.innerHTML = isWoType
          ? 'Equipment # * <span class="lbl-opt">(auto-populates make, model, serial)</span>'
          : 'Equipment # <span class="lbl-opt">(optional)</span>';
        if (issueLbl) issueLbl.textContent = isWoType ? 'Fault / Issue *' : 'Fault / Issue / Description';
        if (dueLbl)   dueLbl.textContent   = isWoType ? 'Due Date *' : 'Due Date';
      }
      const typeSelect = document.getElementById('nwo-type');
      if (typeSelect) typeSelect.addEventListener('change', updateRequiredLabels);
      const assetInput = document.getElementById('nwo-asset');
      if (!assetInput) return;
      assetInput.addEventListener('blur', function() {
        const eq = EQUIPMENT_DB[this.value.trim().toUpperCase()] || EQUIPMENT_DB[this.value.trim()];
        if (!eq) return;
        document.getElementById('nwo-make').value   = eq.make;
        document.getElementById('nwo-model').value  = eq.model;
        document.getElementById('nwo-serial').value = eq.serial;
        const banner = document.getElementById('nwo-autofill-msg');
        banner.textContent = `Auto-filled: ${eq.make} ${eq.model} · ${eq.serial}`;
        banner.style.display = 'block';
      });
    }, 50);
  }

  function openTypePicker() {
    Modal.show({
      title: 'New Order',
      body: `
        <p style="font-size:13px;color:#5A5F6E;margin-bottom:16px;">What kind of order do you need to create?</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button class="wol-type-pick-card" id="pick-wo">
            <i class="ti ti-clipboard-list" style="font-size:22px;color:#185FA5;margin-bottom:8px;"></i>
            <div style="font-size:13px;font-weight:700;color:#111318;">Work Order</div>
            <div style="font-size:11px;color:#7A7F8E;margin-top:3px;">Equipment repair or scheduled PM</div>
          </button>
          <button class="wol-type-pick-card" id="pick-ord">
            <i class="ti ti-shopping-cart" style="font-size:22px;color:#534AB7;margin-bottom:8px;"></i>
            <div style="font-size:13px;font-weight:700;color:#111318;">Parts Order</div>
            <div style="font-size:11px;color:#7A7F8E;margin-top:3px;">Stock request or general purchase</div>
          </button>
        </div>`,
      actions: [{ label: 'Cancel', onClick: () => Modal.close() }]
    });
    setTimeout(() => {
      document.getElementById('pick-wo')?.addEventListener('click', () => openWoForm());
      document.getElementById('pick-ord')?.addEventListener('click', () => openWoForm());
    }, 50);
  }

  document.getElementById('wol-new-btn').addEventListener('click', () => openTypePicker());
}

// ── Global: open the WO creation form from anywhere ───────────────────────────
(function() {
  const EQUIPMENT_DB_GLOBAL = {
    'FL-094': { make: 'Skyjack',     model: 'SJIII 3219',        serial: 'SJ3219-00847'    },
    'FL-017': { make: 'Caterpillar', model: '320 Excavator',     serial: 'CAT320-01044'    },
    'FL-031': { make: 'Toyota',      model: '8FGU25',            serial: 'TOY8FGU-00391'   },
    'FL-008': { make: 'Bobcat',      model: 'S650',              serial: 'BOB-S650-00814'  },
    'SM-011': { make: 'Skyjack',     model: 'SJIII 4632',        serial: 'SJ4632-01122'    },
    'SM-004': { make: 'Toyota',      model: '8FGU32',            serial: 'TOY8FGU32-00205' },
    'KY-003': { make: 'Bobcat',      model: 'S770',              serial: 'BOB-S770-00301'  },
    'KY-007': { make: 'Caterpillar', model: '308 Mini Excavator',serial: 'CAT308-00512'    },
  };
  const ASSIGNEES_GLOBAL = ['James W.','Marcus T.','Lena R.','Darius K.','Priya N.'];

  window.openNewWOModal = function(prefill) {
    prefill = prefill || {};
    const user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
    const currentUser = user ? user.shortName : 'James W.';

    const formHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Order Type *</label>
          <select class="modal-form-select" id="nwo-type">
            <option value="equipment" selected>Equipment Repair</option>
            <option value="pm">Scheduled PM</option>
            <option value="stock">Stock / Parts</option>
            <option value="other">Other / General</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" id="nwo-equipment-section">
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Equipment # * <span class="lbl-opt">(auto-populates make, model, serial)</span></label>
          <input class="modal-form-input" id="nwo-asset" type="text" placeholder="e.g. FL-094" value="${prefill.asset || ''}"/>
          <div class="modal-field-error" id="nwo-asset-err">Required</div>
          <div class="nwo-autofill-banner" id="nwo-autofill-msg"></div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Make</label>
          <input class="modal-form-input" id="nwo-make" type="text" placeholder="e.g. Skyjack" value="${prefill.make || ''}"/>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Model</label>
          <input class="modal-form-input" id="nwo-model" type="text" placeholder="e.g. SJIII 3219" value="${prefill.model || ''}"/>
        </div>
        <div class="modal-form-field" style="grid-column:1/-1;">
          <label class="modal-form-label">Serial #</label>
          <input class="modal-form-input" id="nwo-serial" type="text" placeholder="e.g. SJ3219-00847" value="${prefill.serial || ''}"/>
        </div>
      </div>
      <div class="modal-form-field">
        <label class="modal-form-label">Fault / Issue *</label>
        <input class="modal-form-input" id="nwo-issue" type="text" placeholder="Describe the fault or maintenance task" value="${(prefill.issue || '').replace(/"/g,'&quot;')}"/>
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
          <label class="modal-form-label">Due Date *</label>
          <input class="modal-form-input" id="nwo-due" type="date"/>
          <div class="modal-field-error" id="nwo-due-err">Required</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Assignee</label>
          <select class="modal-form-select" id="nwo-assignee">
            ${ASSIGNEES_GLOBAL.map(n => `<option${n === currentUser ? ' selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Order ID <span class="lbl-opt" style="font-size:10px;">(RentalMan / ERP — optional)</span></label>
          <input class="modal-form-input" id="nwo-extid" type="text" placeholder="e.g. RM-10122"/>
        </div>
      </div>
      ${prefill.cart && prefill.cart.length ? `
      <div style="background:#F5F2EE;border-radius:8px;padding:10px 12px;font-size:12px;color:#7A7F8E;">
        <strong style="color:#3A3D4A;">Parts from diagnostics cart (${prefill.cart.length}):</strong><br>
        ${prefill.cart.map(i => `${i.partNo} ×${i.qty}`).join(', ')}
      </div>` : ''}`;

    Modal.show({
      title: 'New Work Order',
      body: formHtml,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Create Order', primary: true, onClick: () => {
            const asset  = document.getElementById('nwo-asset').value.trim();
            const issue  = document.getElementById('nwo-issue').value.trim();
            const dueRaw = document.getElementById('nwo-due').value;
            const show   = (id, v) => { const e = document.getElementById(id); if (e) e.style.display = v ? 'block' : 'none'; };
            let valid = true;
            show('nwo-asset-err', !asset); if (!asset) valid = false;
            show('nwo-issue-err', !issue); if (!issue) valid = false;
            show('nwo-due-err',   !dueRaw); if (!dueRaw) valid = false;
            if (!valid) return;
            const make    = document.getElementById('nwo-make')?.value.trim() || '';
            const model   = document.getElementById('nwo-model')?.value.trim() || '';
            const serial  = document.getElementById('nwo-serial')?.value.trim() || '';
            const machine = (make && model) ? `${make} ${model}` : asset || '';
            const dueDate = new Date(dueRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const newWO = Store.addWorkOrder({
              woType: document.getElementById('nwo-type').value,
              asset, make, model, serial, machine, issue, dueDate,
              externalId: document.getElementById('nwo-extid').value.trim(),
              priority: document.getElementById('nwo-priority').value,
              assignee: document.getElementById('nwo-assignee').value,
            });
            if (prefill.cart && prefill.cart.length) {
              Store.addPartsToWorkOrder(newWO.id, prefill.cart);
            }
            Modal.close();
            if (typeof prefill.onCreated === 'function') prefill.onCreated(newWO);
            else {
              Modal.show({
                title: 'Work order created',
                body: `<div style="text-align:center;padding:12px 0;">
                  <div style="font-size:32px;margin-bottom:8px;color:#1C3969;">✓</div>
                  <div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:4px;">Work Order #${newWO.id} created</div>
                  <div style="font-size:13px;color:#7A7F8E;">${machine}</div>
                </div>`,
                actions: [
                  { label: 'Close', onClick: () => Modal.close() },
                  { label: 'View orders', primary: true, onClick: () => { Modal.close(); Router.navigate('wo-list'); } }
                ]
              });
            }
          }
        }
      ]
    });

    setTimeout(() => {
      const assetInput = document.getElementById('nwo-asset');
      if (!assetInput) return;
      assetInput.addEventListener('blur', function() {
        const eq = EQUIPMENT_DB_GLOBAL[this.value.trim().toUpperCase()] || EQUIPMENT_DB_GLOBAL[this.value.trim()];
        if (!eq) return;
        document.getElementById('nwo-make').value   = eq.make;
        document.getElementById('nwo-model').value  = eq.model;
        document.getElementById('nwo-serial').value = eq.serial;
        const banner = document.getElementById('nwo-autofill-msg');
        if (banner) { banner.textContent = `Auto-filled: ${eq.make} ${eq.model} · ${eq.serial}`; banner.style.display = 'block'; }
      });
    }, 50);
  };
})();
