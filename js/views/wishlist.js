function render_wishlist(el) {
  let _lists = Store.getWishLists();
  let _activeListId = _lists.length ? _lists[0].id : null;
  let _renaming = null;

  const _me = () => (Store.getCurrentUser() || {}).id || null;

  function getActive() {
    return (_lists = Store.getWishLists()).find(l => l.id === _activeListId) || null;
  }

  function renderSideLists() {
    _lists = Store.getWishLists();
    const nav = document.getElementById('wl-list-nav');
    if (!nav) return;

    const myId = _me();
    const pinned  = _lists.filter(l => l.pinned);
    const mine    = _lists.filter(l => !l.pinned && (l.ownerId === myId || !l.ownerId));
    const shared  = _lists.filter(l => !l.pinned && l.ownerId && l.ownerId !== myId && l.public);

    function listRow(l) {
      const isActive = l.id === _activeListId;
      const pubBadge = l.public
        ? `<span title="Public" style="font-size:9px;background:#E1F5EE;color:#1C6B4A;border-radius:3px;padding:1px 4px;font-weight:700;flex-shrink:0;">PUB</span>`
        : '';
      const pinBtn = `<button title="${l.pinned ? 'Unpin' : 'Pin'}" onclick="event.stopPropagation();wlTogglePin('${l.id}')" style="background:none;border:none;cursor:pointer;padding:2px;color:${l.pinned ? '#1C3969' : '#C8C3BC'};font-size:12px;flex-shrink:0;"><i class="ti ${l.pinned ? 'ti-pin-filled' : 'ti-pin'}"></i></button>`;
      return `<div class="wl-list-item${isActive ? ' active' : ''}" onclick="wlSelectList('${l.id}')">
        <i class="ti ti-heart" style="font-size:12px;flex-shrink:0;"></i>
        <span class="wl-list-name">${l.name}</span>
        ${pubBadge}
        <span class="wl-list-count">${l.items.length}</span>
        ${pinBtn}
      </div>`;
    }

    let html = '';
    if (pinned.length) {
      html += `<div class="wl-section-label"><i class="ti ti-pin-filled" style="font-size:10px;"></i> Pinned</div>`;
      html += pinned.map(listRow).join('');
    }
    html += `<div class="wl-section-label"><i class="ti ti-user" style="font-size:10px;"></i> My Lists</div>`;
    if (mine.length) {
      html += mine.map(listRow).join('');
    } else {
      html += `<div style="padding:6px 16px;font-size:12px;color:#9CA3AF;">No lists yet.</div>`;
    }
    if (shared.length) {
      html += `<div class="wl-section-label"><i class="ti ti-users" style="font-size:10px;"></i> Shared with me</div>`;
      html += shared.map(listRow).join('');
    }
    html += `<button class="wl-new-btn" id="wl-new-list-btn"><i class="ti ti-plus" style="font-size:12px;"></i> New list</button>`;

    nav.innerHTML = html;
    document.getElementById('wl-new-list-btn').addEventListener('click', wlCreateList);
  }

  function renderItems() {
    _lists = Store.getWishLists();
    const panel = document.getElementById('wl-items-panel');
    if (!panel) return;
    const list = getActive();

    if (!list) {
      panel.innerHTML = `<div style="padding:64px 24px;text-align:center;color:#9CA3AF;">
        <i class="ti ti-heart" style="font-size:48px;display:block;margin-bottom:16px;opacity:0.2;"></i>
        <div style="font-size:15px;font-weight:600;color:#5A5F6E;margin-bottom:8px;">No lists yet</div>
        <div style="font-size:13px;margin-bottom:20px;">Create a list to save parts you want to remember or order later.</div>
        <button class="btn-primary" onclick="wlCreateList()"><i class="ti ti-plus" style="font-size:13px;"></i> Create first list</button>
      </div>`;
      return;
    }

    const items = list.items;
    const otherLists = _lists.filter(l => l.id !== list.id);
    const canEdit = list.ownerId === _me() || !list.ownerId;
    const pubLabel = list.public
      ? `<span style="font-size:11px;font-weight:600;background:#E1F5EE;color:#1C6B4A;border-radius:4px;padding:2px 8px;"><i class="ti ti-world" style="font-size:10px;"></i> Public</span>`
      : `<span style="font-size:11px;font-weight:600;background:#F0ECE8;color:#7A7F8E;border-radius:4px;padding:2px 8px;"><i class="ti ti-lock" style="font-size:10px;"></i> Private</span>`;

    panel.innerHTML = `
      <div class="wl-panel-header">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
          ${_renaming === list.id
            ? `<input id="wl-rename-input" class="wl-rename-input" value="${list.name}" /><button class="wl-action-btn wl-action-primary" id="wl-rename-save-btn">Save</button><button class="wl-action-btn" id="wl-rename-cancel-btn">Cancel</button>`
            : `<h2 class="wl-panel-title">${list.name}</h2>${pubLabel}${canEdit ? `<button class="wl-action-btn" onclick="wlStartRename('${list.id}')" title="Rename"><i class="ti ti-pencil" style="font-size:11px;"></i></button>` : ''}`}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#9CA3AF;">${items.length} item${items.length !== 1 ? 's' : ''}</span>
          ${canEdit && items.length > 0 ? `<button class="wl-action-btn wl-action-primary" onclick="wlAddAllToCart('${list.id}')"><i class="ti ti-shopping-cart" style="font-size:11px;"></i> Add all to cart</button>` : ''}
          ${canEdit ? `<button class="wl-action-btn" onclick="wlTogglePublic('${list.id}')" title="${list.public ? 'Make private' : 'Make public'}"><i class="ti ${list.public ? 'ti-lock' : 'ti-world'}" style="font-size:11px;"></i> ${list.public ? 'Make private' : 'Make public'}</button>` : ''}
          ${canEdit ? `<button class="wl-action-btn wl-action-danger" onclick="wlDeleteList('${list.id}')"><i class="ti ti-trash" style="font-size:11px;"></i> Delete</button>` : ''}
        </div>
      </div>
      ${items.length === 0
        ? `<div style="padding:48px 24px;text-align:center;color:#9CA3AF;font-size:13px;">
            <i class="ti ti-shopping-bag" style="font-size:36px;display:block;margin-bottom:12px;opacity:0.25;"></i>
            <div style="font-weight:600;color:#7A7F8E;margin-bottom:6px;">List is empty</div>
            Add parts from <a style="color:#1C3969;cursor:pointer;" onclick="Router.navigate('parts-search')">Parts Search</a> using the "Save to list" button.
           </div>`
        : `<div class="wl-items-list">${items.map(item => wlItemCard(item, list, otherLists, canEdit)).join('')}</div>`}`;

    if (_renaming === list.id) {
      const inp = document.getElementById('wl-rename-input');
      if (inp) { inp.focus(); inp.select(); }
      document.getElementById('wl-rename-save-btn').addEventListener('click', () => wlSaveRename(list.id));
      document.getElementById('wl-rename-cancel-btn').addEventListener('click', () => { _renaming = null; renderItems(); });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') wlSaveRename(list.id);
        if (e.key === 'Escape') { _renaming = null; renderItems(); }
      });
    }
  }

  function wlItemCard(item, list, otherLists, canEdit) {
    const inStock = item.inStock !== false;
    const stockBadge = inStock
      ? `<span class="wl-stock-in"><i class="ti ti-circle-check" style="font-size:10px;"></i> In stock</span>`
      : `<span class="wl-stock-out"><i class="ti ti-clock" style="font-size:10px;"></i> Backorder</span>`;

    const localTotal = (item.localInventory || []).reduce((s, l) => s + l.qty, 0);
    const localBadge = localTotal > 0
      ? `<span class="wl-local-badge"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${localTotal} local</span>`
      : '';

    const moveSel = (canEdit && otherLists.length)
      ? `<select class="wl-move-select" onchange="wlMoveItem('${list.id}','${item.id}',this.value);this.value=''">
          <option value="">Move to…</option>
          ${otherLists.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
         </select>`
      : '';

    return `<div class="wl-item-card" id="wl-card-${item.id}">
      <div class="wl-item-main">
        <div class="wl-item-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="wl-partnum">${item.partNum}</span>
            ${stockBadge}
            ${localBadge}
            ${item.oemOnly ? '<span class="oem-badge">OEM</span>' : ''}
          </div>
          <div class="wl-item-desc">${item.description}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-top:4px;flex-wrap:wrap;">
            <span style="font-size:11px;color:#9CA3AF;">${item.vendor || ''}</span>
            ${item.uom ? `<span class="uom-badge">${item.uom}</span>` : ''}
            ${item.price ? `<span style="font-size:14px;font-weight:700;color:#111318;">$${item.price.toFixed(2)}</span>` : ''}
          </div>
        </div>
        <div class="wl-item-actions">
          <button class="wl-cart-btn" onclick="wlAddToCart('${list.id}','${item.id}')"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button>
          <button class="wl-search-btn" onclick="wlFindInSearch('${item.id}')"><i class="ti ti-search" style="font-size:12px;"></i> Find</button>
          ${moveSel}
          ${canEdit ? `<button class="ci-remove" onclick="wlRemoveItem('${list.id}','${item.id}')" title="Remove from list"><i class="ti ti-trash" style="font-size:13px;"></i></button>` : ''}
        </div>
      </div>
    </div>`;
  }

  function render() {
    renderSideLists();
    renderItems();
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  window.wlSelectList = function(id) {
    _activeListId = id;
    _renaming = null;
    render();
  };

  window.wlTogglePin = function(id) {
    const list = Store.getWishLists().find(l => l.id === id);
    if (list) Store.updateWishList(id, { pinned: !list.pinned });
    render();
  };

  window.wlTogglePublic = function(id) {
    const list = Store.getWishLists().find(l => l.id === id);
    if (list) Store.updateWishList(id, { public: !list.public });
    render();
  };

  window.wlCreateList = function() {
    Modal.show({
      title: 'Create wish list',
      body: `<div style="padding:4px 0 8px;">
        <label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">List name</label>
        <input id="wl-new-name-inp" class="modal-text-input" placeholder="e.g. Hydraulic parts, Season prep…" style="width:100%;height:36px;background:#F5F2EE;border:1px solid #E2DDD8;border-radius:7px;padding:0 12px;font-size:13px;font-family:inherit;color:#111318;outline:none;box-sizing:border-box;" autofocus />
        <div style="margin-top:12px;display:flex;align-items:center;gap:10px;">
          <button id="wl-vis-priv" class="wl-vis-btn wl-vis-active" onclick="wlVisSelect('private')"><i class="ti ti-lock" style="font-size:11px;"></i> Private</button>
          <button id="wl-vis-pub" class="wl-vis-btn" onclick="wlVisSelect('public')"><i class="ti ti-world" style="font-size:11px;"></i> Public</button>
          <span style="font-size:11px;color:#9CA3AF;" id="wl-vis-desc">Only visible to you</span>
        </div>
      </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Create list', primary: true, onClick: () => {
          const name = (document.getElementById('wl-new-name-inp') || {}).value || '';
          if (!name.trim()) return;
          const isPublic = document.getElementById('wl-vis-pub') && document.getElementById('wl-vis-pub').classList.contains('wl-vis-active');
          const list = Store.createWishList(name.trim(), { public: isPublic });
          _activeListId = list.id;
          Modal.close();
          render();
        }},
      ],
    });
    setTimeout(() => {
      const inp = document.getElementById('wl-new-name-inp');
      if (inp) {
        inp.focus();
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('.modal-btn-primary') && document.querySelector('.modal-btn-primary').click(); });
      }
    }, 80);
  };

  window.wlVisSelect = function(mode) {
    const privBtn = document.getElementById('wl-vis-priv');
    const pubBtn  = document.getElementById('wl-vis-pub');
    const desc    = document.getElementById('wl-vis-desc');
    if (!privBtn || !pubBtn) return;
    if (mode === 'public') {
      pubBtn.classList.add('wl-vis-active');
      privBtn.classList.remove('wl-vis-active');
      if (desc) desc.textContent = 'Visible to all members at your location';
    } else {
      privBtn.classList.add('wl-vis-active');
      pubBtn.classList.remove('wl-vis-active');
      if (desc) desc.textContent = 'Only visible to you';
    }
  };

  window.wlStartRename = function(id) {
    _renaming = id;
    renderItems();
  };

  window.wlSaveRename = function(id) {
    const inp = document.getElementById('wl-rename-input');
    const name = inp ? inp.value.trim() : '';
    if (name) Store.renameWishList(id, name);
    _renaming = null;
    render();
  };

  window.wlDeleteList = function(id) {
    const list = (_lists).find(l => l.id === id);
    if (!list) return;
    Modal.confirm(`Delete "${list.name}"? This cannot be undone.`, () => {
      Store.deleteWishList(id);
      _lists = Store.getWishLists();
      _activeListId = _lists.length ? _lists[0].id : null;
      render();
    });
  };

  window.wlRemoveItem = function(listId, partId) {
    Store.removeFromWishList(listId, partId);
    render();
  };

  window.wlMoveItem = function(fromListId, partId, toListId) {
    if (!toListId) return;
    Store.moveWishListItem(fromListId, toListId, partId);
    render();
  };

  window.wlAddToCart = function(listId, partId) {
    const list = Store.getWishLists().find(l => l.id === listId);
    const item = list && list.items.find(i => i.id === partId);
    if (!item) return;
    const wos = Store.getWorkOrders('active');
    if (!wos.length) {
      Store.addToCart(item);
      _showToast(`<i class="ti ti-check" style="color:#639922;"></i> Added to general cart`);
      return;
    }
    Modal.show({
      title: 'Add to work order',
      body: `<div style="padding:4px 0 8px;">
        <div style="font-size:13px;color:#5A5F6E;margin-bottom:12px;">Adding <strong>${item.partNum}</strong> — ${item.description}</div>
        <label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Select work order</label>
        <select id="wl-wo-picker" style="width:100%;height:36px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;color:#111318;outline:none;background:#FFFFFF;">
          ${wos.map(w => `<option value="${w.id}">${w.machine} — WO #${w.id}</option>`).join('')}
        </select>
      </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Add to cart', primary: true, onClick: () => {
          const v = (document.getElementById('wl-wo-picker') || {}).value;
          if (v) Store.addToWoCart(parseInt(v), item);
          else Store.addToCart(item);
          Modal.close();
          _showToast(`<i class="ti ti-check" style="color:#639922;"></i> Added to WO #${v}`);
        }},
      ],
    });
  };

  window.wlAddAllToCart = function(listId) {
    const list = Store.getWishLists().find(l => l.id === listId);
    if (!list || !list.items.length) return;
    const wos = Store.getWorkOrders('active');
    Modal.show({
      title: 'Add all items to cart',
      body: `<div style="padding:4px 0 8px;">
        <div style="font-size:13px;color:#5A5F6E;margin-bottom:12px;">Adding <strong>${list.items.length} items</strong> from <strong>${list.name}</strong></div>
        ${wos.length ? `<label style="font-size:12px;font-weight:600;color:#5A5F6E;display:block;margin-bottom:6px;">Select work order</label>
        <select id="wl-all-wo-picker" style="width:100%;height:36px;border:1px solid #E2DDD8;border-radius:7px;padding:0 10px;font-size:13px;font-family:inherit;color:#111318;outline:none;background:#FFFFFF;">
          ${wos.map(w => `<option value="${w.id}">${w.machine} — WO #${w.id}</option>`).join('')}
        </select>` : '<div style="font-size:13px;color:#9CA3AF;">Items will be added to your general cart.</div>'}
      </div>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Add all', primary: true, onClick: () => {
          const v = (document.getElementById('wl-all-wo-picker') || {}).value;
          list.items.forEach(item => {
            if (v) Store.addToWoCart(parseInt(v), item);
            else Store.addToCart(item);
          });
          Modal.close();
          _showToast(`<i class="ti ti-check" style="color:#639922;"></i> ${list.items.length} items added`);
        }},
      ],
    });
  };

  window.wlFindInSearch = function(partId) {
    Router.navigate('parts-search', { highlightPartId: partId });
  };

  function _showToast(html) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111318;color:#FFFFFF;border-radius:9px;padding:10px 18px;font-size:13px;font-weight:500;font-family:Inter,sans-serif;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px;white-space:nowrap;';
    t.innerHTML = html;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  el.innerHTML = `
<style>
.wl-panel-header { display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:0.5px solid #E8E4DF;gap:12px;flex-wrap:wrap;flex-shrink:0; }
.wl-panel-title { font-size:18px;font-weight:700;color:#111318; }
.wl-rename-input { font-size:16px;font-weight:700;color:#111318;border:1.5px solid #1C3969;border-radius:7px;padding:3px 10px;font-family:inherit;outline:none;background:#FFFFFF;min-width:140px;flex:1; }
.wl-action-btn { background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:#5A5F6E;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:4px;white-space:nowrap; }
.wl-action-btn:hover { background:#F5F2EE; }
.wl-action-primary { background:#1C3969;color:#FFFFFF;border-color:#1C3969; }
.wl-action-primary:hover { background:#152B52; }
.wl-action-danger { color:#A32D2D;border-color:#F5C5C5; }
.wl-action-danger:hover { background:#FCEBEB; }
.wl-sidebar { width:228px;flex-shrink:0;background:#FAFAF8;border-right:0.5px solid #E8E4DF;display:flex;flex-direction:column;padding:12px 0;overflow-y:auto; }
.wl-section-label { font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#9CA3AF;padding:8px 16px 4px;display:flex;align-items:center;gap:5px; }
.wl-list-item { display:flex;align-items:center;gap:8px;padding:8px 12px 8px 16px;cursor:pointer;font-size:13px;color:#3A3D4A; }
.wl-list-item:hover { background:#F0ECE8; }
.wl-list-item.active { background:#E6EDF7;color:#1C3969;font-weight:600; }
.wl-list-item i.ti-heart { color:#E03131;opacity:0.65; }
.wl-list-item.active i.ti-heart { opacity:1; }
.wl-list-name { flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.wl-list-count { font-size:10px;font-weight:700;background:#E8E4DF;color:#7A7F8E;border-radius:999px;padding:1px 7px; }
.wl-list-item.active .wl-list-count { background:#D6E4F7;color:#1C3969; }
.wl-new-btn { margin:8px 12px 0;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#1C3969;background:none;border:0.5px dashed #B8C7DB;border-radius:7px;padding:7px 12px;cursor:pointer;font-family:inherit;width:calc(100% - 24px); }
.wl-new-btn:hover { background:#EEF3F9; }
.wl-content { flex:1;display:flex;flex-direction:column;min-width:0;overflow-y:auto; }
.wl-items-list { padding:12px 20px;display:flex;flex-direction:column;gap:8px; }
.wl-item-card { background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:10px;overflow:hidden; }
.wl-item-card:hover { border-color:#C5D2E0; }
.wl-item-main { display:flex;align-items:flex-start;gap:16px;padding:14px 16px;flex-wrap:wrap; }
.wl-item-info { flex:1;min-width:200px; }
.wl-item-desc { font-size:13px;font-weight:500;color:#111318;margin-top:4px;line-height:1.35; }
.wl-item-actions { display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap; }
.wl-partnum { font-family:'SF Mono','Consolas',monospace;font-size:11px;font-weight:700;color:#3A3D4A; }
.wl-cart-btn { background:#1C3969;border:none;border-radius:7px;padding:7px 12px;font-size:12px;font-weight:600;color:#FFFFFF;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;white-space:nowrap; }
.wl-cart-btn:hover { background:#152B52; }
.wl-search-btn { background:#F5F2EE;border:0.5px solid #E2DDD8;border-radius:7px;padding:7px 10px;font-size:12px;font-weight:600;color:#3A3D4A;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px; }
.wl-search-btn:hover { background:#ECEAE6; }
.wl-move-select { height:32px;border:0.5px solid #E2DDD8;border-radius:7px;padding:0 8px;font-size:11px;font-family:inherit;color:#5A5F6E;outline:none;background:#FAFAF8;cursor:pointer;max-width:120px; }
.wl-stock-in { font-size:10px;font-weight:700;background:#E1F5EE;color:#1C6B4A;border-radius:4px;padding:2px 7px;display:inline-flex;align-items:center;gap:3px; }
.wl-stock-out { font-size:10px;font-weight:700;background:#FEF3C7;color:#92400E;border-radius:4px;padding:2px 7px;display:inline-flex;align-items:center;gap:3px; }
.wl-local-badge { font-size:10px;font-weight:700;background:#EAF3DE;color:#3B6D11;border-radius:4px;padding:2px 7px;display:inline-flex;align-items:center;gap:3px; }
.uom-badge { font-size:10px;font-weight:700;background:#F0ECE8;color:#5A5F6E;border-radius:4px;padding:2px 6px;letter-spacing:0.3px; }
.oem-badge { background:#F5F2EE;color:#5A5F6E;font-size:9px;font-weight:700;border-radius:3px;padding:1px 4px;letter-spacing:0.3px; }
.ci-remove { background:none;border:none;color:#C8C3BC;cursor:pointer;padding:4px;border-radius:5px; }
.ci-remove:hover { background:#FCEBEB;color:#A32D2D; }
.btn-primary { background:#1C3969;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;color:#FFFFFF;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px; }
.btn-primary:hover { background:#152B52; }
.wl-vis-btn { background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:500;color:#5A5F6E;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px; }
.wl-vis-active { background:#1C3969 !important;border-color:#1C3969 !important;color:#FFFFFF !important; }
</style>
<div class="shell">
  ${buildSidebar('wishlist')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="Router.navigate('home')">Home</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Wish Lists</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div style="display:flex;height:calc(100vh - 56px);">
      <div class="wl-sidebar">
        <div id="wl-list-nav"></div>
      </div>
      <div class="wl-content" id="wl-items-panel"></div>
    </div>
  </div>
</div>`;

  render();
}

// ── Global: add a part to a wish list from anywhere ────────────────────────
window.addToWishList = function(part) {
  if (!part) return;
  const lists = Store.getWishLists();
  const myId = (Store.getCurrentUser() || {}).id || null;
  const myLists = lists.filter(l => l.ownerId === myId || !l.ownerId);

  function _doAdd(listId) {
    Store.addToWishList(listId, part);
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111318;color:#FFFFFF;border-radius:9px;padding:10px 18px;font-size:13px;font-weight:500;font-family:Inter,sans-serif;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px;white-space:nowrap;';
    const name = (Store.getWishLists().find(l => l.id === listId) || {}).name || 'list';
    t.innerHTML = `<i class="ti ti-heart" style="color:#E03131;"></i> Saved to <strong>${name}</strong> &nbsp;<a style="color:#8BB6E8;cursor:pointer;font-size:12px;" onclick="Router.navigate('wishlist');this.closest('[style*=fixed]').remove();">View</a>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function _showPickerModal() {
    function _buildRows() {
      const currentLists = Store.getWishLists().filter(l => l.ownerId === myId || !l.ownerId);
      return currentLists.map(l => `<div class="wl-picker-row" onclick="wlPickerSelect('${l.id}')" id="wl-pick-${l.id}">
        <i class="ti ti-heart" style="font-size:13px;color:#E03131;flex-shrink:0;"></i>
        <span style="flex:1;font-size:13px;font-weight:500;color:#111318;">${l.name}</span>
        <span style="font-size:11px;color:#9CA3AF;">${l.items.length} item${l.items.length !== 1 ? 's' : ''}</span>
        ${l.public ? '<span style="font-size:9px;background:#E1F5EE;color:#1C6B4A;border-radius:3px;padding:1px 4px;font-weight:700;">PUB</span>' : ''}
      </div>`).join('');
    }

    const createInlineHtml = `
      <div id="wl-create-inline" style="display:none;border-top:0.5px solid #E8E4DF;padding:12px 12px 4px;">
        <input id="wl-inline-name" placeholder="List name…" style="width:100%;height:32px;border:1px solid #E2DDD8;border-radius:6px;padding:0 10px;font-size:13px;font-family:inherit;color:#111318;outline:none;background:#FFF;box-sizing:border-box;margin-bottom:8px;" />
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <button id="wl-ci-priv" class="wl-vis-btn wl-vis-active" onclick="event.stopPropagation();wlVisInlineSelect('private')" style="font-size:11px;padding:4px 10px;"><i class="ti ti-lock" style="font-size:10px;"></i> Private</button>
          <button id="wl-ci-pub" class="wl-vis-btn" onclick="event.stopPropagation();wlVisInlineSelect('public')" style="font-size:11px;padding:4px 10px;"><i class="ti ti-world" style="font-size:10px;"></i> Public</button>
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="wlInlineCreate()" style="flex:1;background:#1C3969;color:#FFF;border:none;border-radius:6px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Create &amp; add</button>
          <button onclick="document.getElementById('wl-create-inline').style.display='none'" style="background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:7px 10px;font-size:12px;color:#5A5F6E;cursor:pointer;font-family:inherit;">Cancel</button>
        </div>
      </div>`;

    Modal.show({
      title: 'Save to wish list',
      body: `<div style="padding:4px 0 8px;">
        <div style="font-size:13px;color:#5A5F6E;margin-bottom:14px;">Saving <strong>${part.partNum}</strong> — ${part.description}</div>
        <div id="wl-picker-rows">${_buildRows()}</div>
        <div style="margin-top:8px;">
          <button onclick="document.getElementById('wl-create-inline').style.display='block';document.getElementById('wl-inline-name').focus();" style="background:none;border:0.5px dashed #B8C7DB;border-radius:7px;padding:8px 14px;font-size:12px;font-weight:600;color:#1C3969;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;width:100%;"><i class="ti ti-plus" style="font-size:12px;"></i> Create new list</button>
        </div>
        ${createInlineHtml}
        <style>
          .wl-picker-row{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:8px;margin-bottom:2px;}
          .wl-picker-row:hover{background:#F5F2EE;}
          .wl-vis-btn{background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:500;color:#5A5F6E;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;}
          .wl-vis-active{background:#1C3969 !important;border-color:#1C3969 !important;color:#FFF !important;}
        </style>
      </div>`,
      actions: [{ label: 'Cancel', onClick: () => Modal.close() }],
    });

    window.wlPickerSelect = function(listId) {
      Modal.close();
      _doAdd(listId);
    };

    window.wlVisInlineSelect = function(mode) {
      const p = document.getElementById('wl-ci-priv');
      const q = document.getElementById('wl-ci-pub');
      if (!p || !q) return;
      if (mode === 'public') { q.classList.add('wl-vis-active'); p.classList.remove('wl-vis-active'); }
      else { p.classList.add('wl-vis-active'); q.classList.remove('wl-vis-active'); }
    };

    window.wlInlineCreate = function() {
      const name = (document.getElementById('wl-inline-name') || {}).value || '';
      if (!name.trim()) { const i = document.getElementById('wl-inline-name'); if (i) i.style.borderColor = '#A32D2D'; return; }
      const isPublic = document.getElementById('wl-ci-pub') && document.getElementById('wl-ci-pub').classList.contains('wl-vis-active');
      const list = Store.createWishList(name.trim(), { public: isPublic });
      Modal.close();
      _doAdd(list.id);
    };
  }

  _showPickerModal();
};
