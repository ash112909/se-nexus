function render_wo_detail(el) {
  const woId = Router.context && Router.context.woId;
  const wo = woId ? Store.getWorkOrder(woId) : null;

  if (!wo) {
    el.innerHTML = `
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span>/</span><span style="color:#FFFFFF;">WO not found</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i></button>
      </div>
    </div>
    <div style="padding:40px;color:#9CA3AF;font-size:14px;">
      <p>Work order not found. <a style="color:#F5A623;cursor:pointer;" onclick="sendPrompt('Work orders')">Return to work orders list</a></p>
    </div>
  </div>
</div>`;
    return;
  }

  function renderWO() {
    const parts = (wo.partIds || []).map(pid => Store.getParts('', '').find ? Store.getParts(pid, '').find ? Store.getParts().find(p => p.id === pid) : null : null).filter(Boolean);
    // better approach:
    const allParts = Store.getParts('', 'All'.replace('All',''));
    const orderedParts = (wo.partIds || []).map(pid => allParts.find ? allParts.find(p => p.id === pid) : null).filter(Boolean);

    function statusBadge() {
      const s = wo.status;
      if (s === 'active' && wo.partIds && wo.partIds.length > 0) return '<span class="pill pill-ordered">Parts ordered</span>';
      if (s === 'active') return '<span class="pill pill-open">Open</span>';
      if (s === 'pending') return '<span class="pill pill-pending">Pending</span>';
      if (s === 'closed') return '<span class="pill pill-closed">Closed</span>';
      return '<span class="pill pill-open">' + s + '</span>';
    }

    function warrantyBadge() {
      if (wo.warranty && wo.warranty.active && wo.warranty.expiry) {
        return `<span class="warranty-badge"><i class="ti ti-shield-check"></i> Under warranty · ${wo.warranty.expiry}</span>`;
      }
      return `<span class="warranty-badge" style="background:#F1EFE8;color:#5F5E5A;"><i class="ti ti-shield-off"></i> Warranty expired</span>`;
    }

    function priorityBadge() {
      if (wo.priority === 'high') return '<span class="pill pill-high">High priority</span>';
      if (wo.priority === 'medium') return '<span class="pill pill-med">Med priority</span>';
      return '<span class="pill pill-low">Low priority</span>';
    }

    const notesHtml = (wo.notes && wo.notes.length)
      ? wo.notes.map(n => `
          <div class="tl-item">
            <div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div>
            <div class="tl-body">
              <div class="tl-title">${n.text}</div>
              <div class="tl-meta">${n.author} · ${n.time}</div>
            </div>
          </div>`).join('')
      : '<div style="color:#9CA3AF;font-size:13px;">No notes yet.</div>';

    const partsHtml = orderedParts.length
      ? orderedParts.map(p => `
          <div class="pos-row">
            <div class="pos-icon"><i class="ti ti-circle-dashed"></i></div>
            <div class="pos-info">
              <div class="pos-name">${p.description}</div>
              <div class="pos-num">${p.partNum} ${p.oemOnly ? '<span style="background:#F5F2EE;color:#5A5F6E;font-size:10px;font-weight:600;border-radius:4px;padding:1px 5px;">OEM</span>' : ''}</div>
            </div>
            <div class="pos-price">$${p.price.toFixed(2)}</div>
            <span class="pos-status ${p.inStock ? 'status-arriving' : 'status-bo'}">${p.inStock ? 'In stock' : 'Backordered'}</span>
          </div>`).join('')
      : '<div style="padding:16px;color:#9CA3AF;font-size:13px;">No parts ordered yet. <a style="color:#F5A623;cursor:pointer;" onclick="sendPrompt(\'Open Parts Search scoped to WO #' + wo.id + '\')">Search parts</a></div>';

    const total = orderedParts.reduce((s, p) => s + p.price, 0);

    return `
<style>
.wo-detail-content { flex: 1; padding: 24px; overflow-y: auto; }
.wo-detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.wo-detail-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.wo-detail-meta { font-size: 13px; color: #7A7F8E; margin-top: 3px; }
.wo-status-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.pill-ordered { background: #FAEEDA; color: #854F0B; }
.pill-open { background: #E6F1FB; color: #185FA5; }
.pill-pending { background: #F1EEFE; color: #534AB7; }
.pill-closed { background: #F0ECE8; color: #5A5F6E; }
.pill-high { background: #FCEBEB; color: #A32D2D; }
.pill-med { background: #FAEEDA; color: #854F0B; }
.pill-low { background: #EAF3DE; color: #3B6D11; }
.btn-primary { background: #F5A623; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
.btn-primary:hover { background: #E8980F; }
.btn-ghost { background: none; border: 0.5px solid #E2DDD8; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
.btn-ghost:hover { background: #F5F2EE; }
.btn-danger { background: none; border: 0.5px solid #F5C5C5; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: #A32D2D; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px; }
.btn-danger:hover { background: #FCEBEB; }
.wo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.wo-card-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; }
.wo-section-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px; }
.wo-field { margin-bottom: 10px; }
.wo-field-label { font-size: 11px; color: #9CA3AF; margin-bottom: 2px; }
.wo-field-value { font-size: 13px; font-weight: 500; color: #111318; }
.warranty-badge { display: inline-flex; align-items: center; gap: 5px; background: #E1F5EE; border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 600; color: #0F6E56; }
.parts-ordered-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.pos-header { padding: 14px 16px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.pos-title { font-size: 14px; font-weight: 600; color: #111318; }
.pos-meta { font-size: 12px; color: #9CA3AF; }
.pos-row { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 0.5px solid #F5F2EE; }
.pos-row:last-child { border-bottom: none; }
.pos-icon { width: 36px; height: 36px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 17px; color: #C8C3BC; flex-shrink: 0; }
.pos-info { flex: 1; }
.pos-name { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 2px; }
.pos-num { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 5px; }
.pos-price { font-size: 13px; font-weight: 600; color: #111318; flex-shrink: 0; }
.pos-status { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px; flex-shrink: 0; }
.status-arriving { background: #E1F5EE; color: #0F6E56; }
.status-bo { background: #FEF3C7; color: #92400E; }
.pos-footer { padding: 11px 16px; background: #FAFAF8; display: flex; align-items: center; justify-content: space-between; }
.pos-total { font-size: 13px; color: #7A7F8E; }
.pos-total strong { color: #111318; font-weight: 600; }
.notes-section { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.note-input-row { display: flex; gap: 8px; margin-top: 14px; }
.note-input { flex: 1; height: 36px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 12px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.note-input:focus { border-color: #F5A623; background: #FFFFFF; }
.note-add-btn { background: #F5A623; border: none; border-radius: 7px; padding: 0 14px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; white-space: nowrap; }
.tl-item { display: flex; gap: 12px; margin-bottom: 12px; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; background: #F5A623; flex-shrink: 0; margin-top: 4px; }
.tl-dot.done { background: #3B6D11; }
.tl-dot.pending { background: #E2DDD8; }
.tl-line { flex: 1; width: 1px; background: #F0ECE8; margin: 3px 0; min-height: 16px; }
.tl-body { flex: 1; }
.tl-title { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 1px; }
.tl-meta { font-size: 11px; color: #9CA3AF; }
.status-select { height: 34px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.status-select:focus { border-color: #F5A623; }
</style>
<h2 class="sr-only">Work Order #${wo.id} — ${wo.machine}</h2>
<div class="shell">
  ${buildSidebar('wo')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Work orders')">Work orders</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">WO #${wo.id}</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="wo-detail-content" id="wod-content">
      <div class="wo-detail-header">
        <div>
          <div class="wo-detail-title">Work Order #${wo.id}</div>
          <div class="wo-detail-meta">Opened ${wo.opened} · Austin Branch · Assigned to ${wo.assignee}</div>
          <div class="wo-status-row">
            ${statusBadge()}
            ${priorityBadge()}
            ${warrantyBadge()}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <div style="display:flex;align-items:center;gap:6px;">
            <label style="font-size:12px;color:#9CA3AF;">Status:</label>
            <select class="status-select" id="wod-status-select">
              <option value="active" ${wo.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="pending" ${wo.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="closed" ${wo.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <button class="btn-ghost" onclick="sendPrompt('Work orders')"><i class="ti ti-arrow-left" style="font-size:14px;"></i> Back</button>
          ${wo.status !== 'closed'
            ? `<button class="btn-danger" id="wod-close-btn"><i class="ti ti-x" style="font-size:14px;"></i> Close WO</button>`
            : ''}
        </div>
      </div>
      <div class="wo-grid">
        <div class="wo-card-section">
          <div class="wo-section-label">Machine</div>
          <div class="wo-field"><div class="wo-field-label">Model</div><div class="wo-field-value">${wo.machine}</div></div>
          <div class="wo-field"><div class="wo-field-label">Asset ID</div><div class="wo-field-value">${wo.asset}</div></div>
          <div class="wo-field"><div class="wo-field-label">Warranty</div><div class="wo-field-value">${wo.warranty && wo.warranty.active ? 'Active · Expires ' + wo.warranty.expiry : 'Expired'}</div></div>
          <div class="wo-field"><div class="wo-field-label">Opened</div><div class="wo-field-value">${wo.opened}</div></div>
        </div>
        <div class="wo-card-section">
          <div class="wo-section-label">Fault &amp; complaint</div>
          <div class="wo-field"><div class="wo-field-label">Reported issue</div><div class="wo-field-value">${wo.issue}</div></div>
          <div class="wo-field"><div class="wo-field-label">Priority</div><div class="wo-field-value" style="text-transform:capitalize;">${wo.priority}</div></div>
          <div class="wo-field"><div class="wo-field-label">Assignee</div><div class="wo-field-value">${wo.assignee}</div></div>
          <div class="wo-field"><div class="wo-field-label">Parts on order</div><div class="wo-field-value">${(wo.partIds || []).length} parts</div></div>
        </div>
      </div>
      <div class="parts-ordered-section">
        <div class="pos-header">
          <div class="pos-title">Parts ordered</div>
          <div class="pos-meta">${orderedParts.length} item${orderedParts.length !== 1 ? 's' : ''} · $${total.toFixed(2)} total</div>
        </div>
        ${partsHtml}
        ${orderedParts.length ? `<div class="pos-footer"><div class="pos-total">${orderedParts.length} parts · <strong>$${total.toFixed(2)}</strong> total</div><button class="btn-ghost" style="font-size:12px;padding:5px 12px;" onclick="sendPrompt('Open Parts Search scoped to WO #${wo.id}')">Add more parts <i class="ti ti-arrow-right" style="font-size:12px;"></i></button></div>` : ''}
      </div>
      <div class="notes-section">
        <div class="wo-section-label">Notes &amp; timeline</div>
        <div id="wod-notes-list">${notesHtml}</div>
        <div class="note-input-row">
          <input class="note-input" type="text" id="wod-note-input" placeholder="Add a note…"/>
          <button class="note-add-btn" id="wod-add-note-btn">Add note</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
  }

  el.innerHTML = renderWO();

  // Wire up status change
  const statusSel = document.getElementById('wod-status-select');
  if (statusSel) {
    statusSel.addEventListener('change', function() {
      Store.updateWorkOrder(wo.id, { status: this.value });
      wo.status = this.value;
    });
  }

  // Wire up close WO
  const closeBtn = document.getElementById('wod-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      Modal.confirm('Close Work Order #' + wo.id + '? This cannot be undone.', () => {
        Store.closeWorkOrder(wo.id);
        sendPrompt('Work orders');
      });
    });
  }

  // Wire up add note
  const noteBtn = document.getElementById('wod-add-note-btn');
  if (noteBtn) {
    noteBtn.addEventListener('click', function() {
      const inp = document.getElementById('wod-note-input');
      const text = inp ? inp.value.trim() : '';
      if (!text) return;
      Store.addWoNote(wo.id, text);
      inp.value = '';
      // re-render notes
      const notesContainer = document.getElementById('wod-notes-list');
      if (notesContainer) {
        const notes = wo.notes;
        notesContainer.innerHTML = notes.length
          ? notes.map(n => `
              <div class="tl-item">
                <div class="tl-dot-wrap"><div class="tl-dot done"></div><div class="tl-line"></div></div>
                <div class="tl-body">
                  <div class="tl-title">${n.text}</div>
                  <div class="tl-meta">${n.author} · ${n.time}</div>
                </div>
              </div>`).join('')
          : '<div style="color:#9CA3AF;font-size:13px;">No notes yet.</div>';
      }
    });
    document.getElementById('wod-note-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') noteBtn.click();
    });
  }
}
