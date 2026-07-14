function render_supplier_portal(el) {
  const _user = Store.getCurrentUser();
  if (!_user || _user.role !== 'supplier') { Router.navigate('login'); return; }

  const _supplierId = (_user.supplierIds || [])[0] || 'SKJ';
  const _fleets = Store.getSupplierFleets(_supplierId);
  let _activeTab = 'fleets';

  // Status meta for price requests
  const PR_STATUS = {
    pending:    { label: 'Awaiting response', color: '#854F0B', bg: '#FAEEDA' },
    needs_info: { label: 'More info needed',  color: '#534AB7', bg: '#EEEDFE' },
    quoted:     { label: 'Quoted',            color: '#0F6E56', bg: '#E1F5EE' },
    rejected:   { label: 'Not available',     color: '#5A5F6E', bg: '#F0ECE8' },
  };

  const SUPPLIER_NAMES = { SKJ: 'Skyjack', CAT: 'Caterpillar', TOY: 'Toyota', BOB: 'Bobcat' };
  const supplierName = SUPPLIER_NAMES[_supplierId] || _supplierId;

  el.innerHTML = `
<style>
.sp-shell { display: flex; height: 100vh; overflow: hidden; }
.sp-sidebar { width: 220px; min-width: 220px; background: #1E1E1E; display: flex; flex-direction: column; padding: 0; overflow-y: auto; flex-shrink: 0; }
.sp-sb-header { padding: 20px 16px 14px; border-bottom: 1px solid #2A2A2A; }
.sp-sb-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.sp-sb-logo-icon { width: 32px; height: 32px; background: #F5A623; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #1A1200; flex-shrink: 0; }
.sp-sb-name { font-size: 13px; font-weight: 700; color: #FFFFFF; }
.sp-sb-role { font-size: 11px; color: #6B7080; margin-top: 1px; }
.sp-sb-nav { padding: 12px 10px; flex: 1; }
.sp-sb-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #4A4E5A; padding: 0 6px; margin: 14px 0 6px; }
.sp-sb-item { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 7px; font-size: 13px; color: #9CA3AF; cursor: pointer; transition: background 0.1s, color 0.1s; margin-bottom: 2px; }
.sp-sb-item:hover { background: #2A2A2A; color: #FFFFFF; }
.sp-sb-item.active { background: #2E2E2E; color: #FFFFFF; }
.sp-sb-item i { font-size: 15px; flex-shrink: 0; }
.sp-sb-badge { margin-left: auto; background: #F5A623; color: #1A1200; font-size: 10px; font-weight: 700; border-radius: 999px; padding: 1px 6px; }
.sp-sb-footer { padding: 12px 10px; border-top: 1px solid #2A2A2A; }
.sp-sb-user { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 7px; cursor: pointer; }
.sp-sb-user:hover { background: #2A2A2A; }
.sp-sb-avatar { width: 28px; height: 28px; background: #3A3D4A; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #FFFFFF; flex-shrink: 0; }
.sp-sb-uname { font-size: 12px; font-weight: 600; color: #FFFFFF; }
.sp-sb-uemail { font-size: 11px; color: #6B7080; }
.sp-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #F5F2EE; }
.sp-topbar { height: 52px; background: #FFFFFF; border-bottom: 1px solid #E8E4DF; display: flex; align-items: center; padding: 0 24px; gap: 12px; flex-shrink: 0; }
.sp-topbar-title { font-size: 14px; font-weight: 600; color: #111318; flex: 1; }
.sp-topbar-pill { display: inline-flex; align-items: center; gap: 5px; background: #FAEEDA; color: #854F0B; border-radius: 999px; font-size: 11px; font-weight: 600; padding: 3px 10px; }
.sp-content { flex: 1; overflow-y: auto; padding: 28px; }
.sp-page-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; margin-bottom: 4px; }
.sp-page-sub { font-size: 13px; color: #7A7F8E; margin-bottom: 24px; }
/* Fleet cards */
.sp-fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-bottom: 32px; }
.sp-fleet-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.sp-fleet-card-header { display: flex; align-items: center; gap: 12px; }
.sp-fleet-logo { width: 40px; height: 40px; background: #1E1E1E; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #F5A623; flex-shrink: 0; letter-spacing: .5px; }
.sp-fleet-name { font-size: 14px; font-weight: 700; color: #111318; }
.sp-fleet-city { font-size: 12px; color: #9CA3AF; }
.sp-fleet-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sp-fleet-stat { background: #F5F2EE; border-radius: 7px; padding: 8px 10px; }
.sp-fleet-stat-val { font-size: 16px; font-weight: 700; color: #111318; }
.sp-fleet-stat-lbl { font-size: 10px; color: #9CA3AF; margin-top: 1px; }
.sp-fleet-actions { display: flex; gap: 8px; }
.sp-btn { height: 32px; padding: 0 12px; border-radius: 7px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; border: none; transition: opacity 0.1s; }
.sp-btn:hover { opacity: 0.85; }
.sp-btn-primary { background: #F5A623; color: #1A1200; }
.sp-btn-ghost { background: #FFFFFF; color: #3A3D4A; border: 1px solid #E2DDD8 !important; }
/* Price requests table */
.sp-table { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.sp-table-head { display: grid; grid-template-columns: 120px 1fr 100px 120px 90px 90px; padding: 0 18px; background: #FAFAF9; border-bottom: 1px solid #F0ECE8; }
.sp-table-th { font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: .8px; text-transform: uppercase; padding: 10px 8px; }
.sp-table-row { display: grid; grid-template-columns: 120px 1fr 100px 120px 90px 90px; padding: 0 18px; border-bottom: 0.5px solid #F5F2EE; align-items: center; }
.sp-table-row:last-child { border-bottom: none; }
.sp-table-td { padding: 12px 8px; font-size: 13px; color: #3A3D4A; }
.sp-status-pill { display: inline-flex; font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
/* Content composer */
.sp-compose-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 22px; max-width: 680px; }
.sp-compose-field { margin-bottom: 16px; }
.sp-compose-label { font-size: 12px; font-weight: 600; color: #5A5F6E; margin-bottom: 5px; display: block; }
.sp-compose-input { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; }
.sp-compose-input:focus { border-color: #F5A623; }
.sp-compose-textarea { width: 100%; min-height: 100px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; resize: vertical; }
.sp-compose-textarea:focus { border-color: #F5A623; }
.sp-compose-select { width: 100%; height: 36px; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px; font-size: 13px; font-family: inherit; color: #111318; outline: none; background: #FFFFFF; cursor: pointer; }
.sp-fleet-check-row { display: flex; flex-direction: column; gap: 7px; padding: 10px; background: #FAFAF9; border: 1px solid #E8E4DF; border-radius: 7px; }
.sp-fleet-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #3A3D4A; cursor: pointer; }
.sp-fleet-check input { accent-color: #F5A623; }
/* Impersonation banner */
.sp-impersonate-banner { background: #FFF7ED; border-bottom: 2px solid #F5A623; padding: 9px 20px; display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; color: #854F0B; flex-shrink: 0; }
.sp-impersonate-exit { margin-left: auto; background: #1E1E1E; color: #FFFFFF; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; font-family: inherit; cursor: pointer; }
</style>

<div class="sp-shell">
  <div class="sp-sidebar">
    <div class="sp-sb-header">
      <div class="sp-sb-logo">
        <div class="sp-sb-logo-icon">${_supplierId}</div>
        <div>
          <div class="sp-sb-name">${supplierName}</div>
          <div class="sp-sb-role">Supplier Portal</div>
        </div>
      </div>
    </div>
    <div class="sp-sb-nav">
      <div class="sp-sb-label">Portal</div>
      <div class="sp-sb-item ${_activeTab==='fleets'?'active':''}" data-tab="fleets"><i class="ti ti-building-warehouse"></i> My Fleets</div>
      <div class="sp-sb-item ${_activeTab==='requests'?'active':''}" data-tab="requests"><i class="ti ti-tag"></i> Price Requests <span class="sp-sb-badge" id="sp-pr-badge">0</span></div>
      <div class="sp-sb-item ${_activeTab==='content'?'active':''}" data-tab="content"><i class="ti ti-pencil"></i> Post Content</div>
    </div>
    <div class="sp-sb-footer">
      <div class="sp-sb-user" onclick="Store.logout();Router.navigate('login');">
        <div class="sp-sb-avatar">${_user.avatar}</div>
        <div>
          <div class="sp-sb-uname">${_user.shortName}</div>
          <div class="sp-sb-uemail">Sign out</div>
        </div>
      </div>
    </div>
  </div>

  <div class="sp-main">
    <div class="sp-topbar">
      <div class="sp-topbar-title" id="sp-topbar-title">My Fleets</div>
      <span class="sp-topbar-pill"><i class="ti ti-shield-check" style="font-size:11px;"></i> Supplier view</span>
    </div>
    <div class="sp-content" id="sp-content"></div>
  </div>
</div>`;

  const pendingCount = Store.getPriceRequests(_supplierId).filter(r => r.status === 'pending').length;
  const badge = document.getElementById('sp-pr-badge');
  if (badge) badge.textContent = pendingCount;

  // ── Tab rendering ────────────────────────────────────────────────────────────

  function renderFleets() {
    document.getElementById('sp-topbar-title').textContent = 'My Fleets';
    const openRequests = Store.getPriceRequests(_supplierId).filter(r => r.status === 'pending').length;
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">My Fleets</div>
      <div class="sp-page-sub">${_fleets.length} fleet${_fleets.length !== 1 ? 's' : ''} onboarded · ${openRequests} open price request${openRequests !== 1 ? 's' : ''}</div>
      <div class="sp-fleet-grid">
        ${_fleets.map(f => `
          <div class="sp-fleet-card">
            <div class="sp-fleet-card-header">
              <div class="sp-fleet-logo">${f.logoText}</div>
              <div>
                <div class="sp-fleet-name">${f.fleetName}</div>
                <div class="sp-fleet-city">${f.city} · ${f.locations} location${f.locations !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div class="sp-fleet-stats">
              <div class="sp-fleet-stat">
                <div class="sp-fleet-stat-val">${f.activeOrders}</div>
                <div class="sp-fleet-stat-lbl">Active orders</div>
              </div>
              <div class="sp-fleet-stat">
                <div class="sp-fleet-stat-val">${Store.getPriceRequests(_supplierId).filter(r=>r.fleetId===f.fleetId&&r.status==='pending').length}</div>
                <div class="sp-fleet-stat-lbl">Price requests</div>
              </div>
            </div>
            <div class="sp-fleet-actions">
              <button class="sp-btn sp-btn-primary" onclick="spImpersonate('${f.fleetId}','${f.fleetName}')"><i class="ti ti-eye" style="font-size:12px;"></i> View as fleet</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function renderRequests() {
    document.getElementById('sp-topbar-title').textContent = 'Price Requests';
    const reqs = Store.getPriceRequests(_supplierId);
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">Price Requests</div>
      <div class="sp-page-sub">${reqs.length} total · ${reqs.filter(r=>r.status==='pending').length} awaiting response</div>
      <div class="sp-table">
        <div class="sp-table-head">
          <div class="sp-table-th">Part #</div>
          <div class="sp-table-th">Description</div>
          <div class="sp-table-th">Fleet</div>
          <div class="sp-table-th">Requested by</div>
          <div class="sp-table-th">Qty</div>
          <div class="sp-table-th">Status</div>
          <div></div>
        </div>
        ${reqs.length ? reqs.map(r => {
          const s = PR_STATUS[r.status] || PR_STATUS.pending;
          return `<div class="sp-table-row" style="grid-template-columns:120px 1fr 100px 120px 50px 130px 80px;">
            <div class="sp-table-td"><span style="font-size:11px;font-weight:600;font-family:monospace;color:#111318;">${r.partNum}</span></div>
            <div class="sp-table-td">
              <div style="font-size:13px;color:#111318;font-weight:500;">${r.partDesc}</div>
              ${r.notes ? `<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">${r.notes}</div>` : ''}
            </div>
            <div class="sp-table-td" style="font-size:12px;">${r.fleetName}</div>
            <div class="sp-table-td" style="font-size:12px;">${r.requestedBy}<div style="font-size:10px;color:#9CA3AF;">${r.requestedDate}</div></div>
            <div class="sp-table-td">${r.qty}</div>
            <div class="sp-table-td"><span class="sp-status-pill" style="background:${s.bg};color:${s.color};">${s.label}</span></div>
            <div class="sp-table-td"><button class="sp-btn sp-btn-ghost" onclick="spRespondToRequest('${r.id}')">Respond</button></div>
          </div>`;
        }).join('') : '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No price requests yet.</div>'}
      </div>`;
  }

  function renderContent() {
    document.getElementById('sp-topbar-title').textContent = 'Post Content';
    const fleetOpts = [
      `<label class="sp-fleet-check"><input type="radio" name="sp-fleet-target" value="all" checked/> All onboarded fleets</label>`,
      ...(_fleets.map(f => `<label class="sp-fleet-check"><input type="radio" name="sp-fleet-target" value="${f.fleetId}"/> ${f.fleetName} only</label>`))
    ].join('');
    document.getElementById('sp-content').innerHTML = `
      <div class="sp-page-title">Post Content</div>
      <div class="sp-page-sub">Publish news, bulletins, or product updates to your fleet customers.</div>
      <div class="sp-compose-card">
        <div class="sp-compose-field">
          <label class="sp-compose-label">Content type</label>
          <select class="sp-compose-select" id="sp-ctype">
            <option value="bulletin">Service bulletin</option>
            <option value="news">Product news</option>
            <option value="safety">Safety notice</option>
            <option value="promo">Promotion</option>
          </select>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Title *</label>
          <input class="sp-compose-input" id="sp-ctitle" type="text" placeholder="e.g. SJIII 3219 hydraulic seal kit now available"/>
          <div id="sp-ctitle-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Body *</label>
          <textarea class="sp-compose-textarea" id="sp-cbody" placeholder="Write your content here…"></textarea>
          <div id="sp-cbody-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <div class="sp-compose-field">
          <label class="sp-compose-label">Post to</label>
          <div class="sp-fleet-check-row">${fleetOpts}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
          <button class="sp-btn sp-btn-ghost" onclick="document.getElementById('sp-ctitle').value='';document.getElementById('sp-cbody').value='';">Clear</button>
          <button class="sp-btn sp-btn-primary" id="sp-publish-btn"><i class="ti ti-send" style="font-size:12px;"></i> Publish</button>
        </div>
        <div id="sp-publish-confirm" style="margin-top:12px;font-size:12px;color:#0F6E56;display:none;">
          <i class="ti ti-circle-check"></i> Content published successfully.
        </div>
      </div>`;

    document.getElementById('sp-publish-btn').addEventListener('click', function() {
      const title = document.getElementById('sp-ctitle').value.trim();
      const body  = document.getElementById('sp-cbody').value.trim();
      document.getElementById('sp-ctitle-err').style.display = title ? 'none' : 'block';
      document.getElementById('sp-cbody-err').style.display  = body  ? 'none' : 'block';
      if (!title || !body) return;

      const target = document.querySelector('input[name="sp-fleet-target"]:checked')?.value || 'all';
      const typeMap = { bulletin:'bulletin', news:'bulletin', safety:'bulletin', promo:'bulletin' };

      Store.saveCmsArticle({
        id: 'cms-sup-' + Date.now(),
        type: typeMap[document.getElementById('sp-ctype').value] || 'bulletin',
        subtype: document.getElementById('sp-ctype').value,
        status: 'published',
        postAs: 'news',
        title,
        body,
        author: _user.displayName,
        supplierId: _supplierId,
        targetFleet: target,
        date: 'Jul 2026',
        priority: 'low',
        locations: [target === 'all' ? 'all' : target],
      });

      document.getElementById('sp-ctitle').value = '';
      document.getElementById('sp-cbody').value = '';
      document.getElementById('sp-publish-confirm').style.display = 'block';
      setTimeout(() => {
        const el = document.getElementById('sp-publish-confirm');
        if (el) el.style.display = 'none';
      }, 3500);
    });
  }

  // ── Impersonation ────────────────────────────────────────────────────────────

  window.spImpersonate = function(fleetId, fleetName) {
    Router.navigate('parts-search', { supplierId: _supplierId, impersonating: true, impersonatingFleet: fleetName });
  };

  // ── Respond to price request ─────────────────────────────────────────────────

  window.spRespondToRequest = function(reqId) {
    const reqs = Store.getPriceRequests(_supplierId);
    const r = reqs.find(x => x.id === reqId);
    if (!r) return;

    Modal.show({
      title: 'Respond to Price Request',
      body: `
        <div style="background:#F5F2EE;border-radius:8px;padding:12px 14px;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;">Request details</div>
          <div style="font-size:13px;font-weight:600;color:#111318;">${r.partDesc}</div>
          <div style="font-size:12px;color:#7A7F8E;margin-top:3px;">${r.partNum} · Qty ${r.qty} · ${r.fleetName}</div>
          ${r.notes ? `<div style="font-size:12px;color:#7A7F8E;margin-top:3px;font-style:italic;">"${r.notes}"</div>` : ''}
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label">Response type</label>
          <select class="modal-form-select" id="sp-resp-type">
            <option value="quoted">Provide a price</option>
            <option value="needs_info">Request more information</option>
            <option value="rejected">Item not available</option>
          </select>
        </div>
        <div class="modal-form-field" id="sp-price-row">
          <label class="modal-form-label">Unit price (USD)</label>
          <input class="modal-form-input" id="sp-resp-price" type="number" min="0" step="0.01" placeholder="e.g. 149.00"/>
          <div id="sp-resp-price-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required when providing a price</div>
        </div>
        <div class="modal-form-field">
          <label class="modal-form-label" id="sp-msg-label">Message <span style="font-weight:400;color:#9CA3AF;">(optional)</span></label>
          <textarea class="modal-form-input" id="sp-resp-msg" style="height:72px;resize:none;padding-top:8px;" placeholder="Add lead time, notes, or follow-up questions…"></textarea>
        </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        {
          label: 'Send Response', primary: true, onClick: () => {
            const type    = document.getElementById('sp-resp-type').value;
            const priceEl = document.getElementById('sp-resp-price');
            const msg     = document.getElementById('sp-resp-msg').value.trim();
            const price   = parseFloat(priceEl?.value);

            if (type === 'quoted' && (!priceEl.value || isNaN(price) || price <= 0)) {
              document.getElementById('sp-resp-price-err').style.display = 'block';
              return;
            }
            Store.respondToPriceRequest(reqId, {
              status: type,
              price: type === 'quoted' ? price : null,
              message: msg,
            });
            Modal.close();
            renderRequests();
            // refresh badge
            const pending = Store.getPriceRequests(_supplierId).filter(r => r.status === 'pending').length;
            const b = document.getElementById('sp-pr-badge');
            if (b) b.textContent = pending;
          }
        }
      ]
    });

    // Toggle price row based on response type
    setTimeout(() => {
      const typeEl = document.getElementById('sp-resp-type');
      const priceRow = document.getElementById('sp-price-row');
      const msgLabel = document.getElementById('sp-msg-label');
      if (!typeEl) return;

      function syncFields() {
        const t = typeEl.value;
        priceRow.style.display = t === 'quoted' ? 'block' : 'none';
        if (t === 'needs_info') {
          msgLabel.innerHTML = 'Message to fleet <span style="font-weight:700;color:#A32D2D;">*</span>';
        } else if (t === 'rejected') {
          msgLabel.innerHTML = 'Reason <span style="font-weight:400;color:#9CA3AF;">(optional)</span>';
        } else {
          msgLabel.innerHTML = 'Message <span style="font-weight:400;color:#9CA3AF;">(optional)</span>';
        }
      }
      syncFields();
      typeEl.addEventListener('change', syncFields);
    }, 50);
  };

  // ── Tab switching ─────────────────────────────────────────────────────────────

  function setTab(tab) {
    _activeTab = tab;
    el.querySelectorAll('.sp-sb-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tab);
    });
    if (tab === 'fleets')   renderFleets();
    if (tab === 'requests') renderRequests();
    if (tab === 'content')  renderContent();
  }

  el.querySelectorAll('.sp-sb-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => setTab(item.dataset.tab));
  });

  setTab('fleets');
}
