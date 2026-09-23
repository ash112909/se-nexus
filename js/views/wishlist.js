function render_wishlist(el) {
  const user = Store.getCurrentUser();
  let _lists = Store.getWishLists();
  let _activeListId = _lists.length ? _lists[0].id : null;
  let _renaming = null;

  function getActive() {
    return _lists.find(l => l.id === _activeListId) || null;
  }

  function renderSideLists() {
    _lists = Store.getWishLists();
    const listNav = document.getElementById('wl-list-nav');
    if (!listNav) return;
    listNav.innerHTML = _lists.map(l => `
      <div class="wl-list-item${l.id === _activeListId ? ' active' : ''}" onclick="wlSelectList('${l.id}')">
        <i class="ti ti-heart" style="font-size:13px;color:#E03131;opacity:0.7;flex-shrink:0;"></i>
        <span class="wl-list-name">${l.name}</span>
        <span class="wl-list-count">${l.items.length}</span>
      </div>`).join('') +
      `<button class="wl-new-btn" id="wl-new-list-btn"><i class="ti ti-plus" style="font-size:12px;"></i> New list</button>`;
    document.getElementById('wl-new-list-btn').addEventListener('click', wlCreateList);
  }

  function renderItems() {
    _lists = Store.getWishLists();
    const panel = document.getElementById('wl-items-panel');
    if (!panel) return;
    const list = getActive();
    if (!list) {
      panel.innerHTML = `<div style="padding:48px 24px;text-align:center;color:#9CA3AF;font-size:14px;">
        <i class="ti ti-heart" style="font-size:40px;display:block;margin-bottom:12px;opacity:0.3;"></i>
        No lists yet. Create your first wish list.
      </div>`;
      return;
    }
    const items = list.items;
    panel.innerHTML = `
      <div class="wl-panel-header">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          ${_renaming === list.id
            ? `<input id="wl-rename-input" class="wl-rename-input" value="${list.name}" />`
            : `<h2 class="wl-panel-title">${list.name}</h2>`}
          ${_renaming !== list.id
            ? `<button class="wl-action-btn" onclick="wlStartRename('${list.id}')"><i class="ti ti-pencil" style="font-size:11px;"></i></button>`
            : `<button class="wl-action-btn wl-action-save" id="wl-rename-save-btn">Save</button>`}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#9CA3AF;">${items.length} item${items.length !== 1 ? 's' : ''}</span>
          <button class="wl-action-btn wl-action-danger" onclick="wlDeleteList('${list.id}')"><i class="ti ti-trash" style="font-size:12px;"></i> Delete list</button>
        </div>
      </div>
      ${items.length === 0
        ? `<div style="padding:40px 24px;text-align:center;color:#9CA3AF;font-size:13px;">
            <i class="ti ti-shopping-bag" style="font-size:32px;display:block;margin-bottom:10px;opacity:0.3;"></i>
            This list is empty. Add parts from search or any part detail.
           </div>`
        : `<table class="wl-table">
            <thead><tr>
              <th class="wl-col-pn">Part #</th>
              <th class="wl-col-desc">Description</th>
              <th class="wl-col-vendor">Vendor</th>
              <th class="wl-col-uom">UOM</th>
              <th class="wl-col-price">Price</th>
              <th class="wl-col-stock">Stock</th>
              <th class="wl-col-move">Move to</th>
              <th class="wl-col-rm"></th>
            </tr></thead>
            <tbody>${items.map(item => wlItemRow(item, list)).join('')}</tbody>
           </table>`}`;

    if (_renaming === list.id) {
      const inp = document.getElementById('wl-rename-input');
      if (inp) { inp.focus(); inp.select(); }
      document.getElementById('wl-rename-save-btn').addEventListener('click', () => wlSaveRename(list.id));
      document.getElementById('wl-rename-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') wlSaveRename(list.id);
        if (e.key === 'Escape') { _renaming = null; renderItems(); }
      });
    }
  }

  function wlItemRow(item, list) {
    const otherLists = _lists.filter(l => l.id !== list.id);
    const moveOpts = otherLists.length
      ? `<select class="wl-move-select" onchange="wlMoveItem('${list.id}','${item.id}',this.value)">
          <option value="">Move to…</option>
          ${otherLists.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
         </select>`
      : '<span style="color:#C8C3BC;font-size:11px;">—</span>';

    return `<tr class="wl-row">
      <td class="wl-col-pn"><span class="wl-partnum">${item.partNum}</span></td>
      <td class="wl-col-desc"><span class="wl-desc">${item.description}</span></td>
      <td class="wl-col-vendor" style="font-size:12px;color:#7A7F8E;">${item.vendor || '—'}</td>
      <td class="wl-col-uom"><span class="uom-badge">${item.uom || 'EA'}</span></td>
      <td class="wl-col-price" style="font-size:13px;font-weight:700;color:#111318;text-align:right;">${item.price ? '$' + item.price.toFixed(2) : '—'}</td>
      <td class="wl-col-stock">${item.inStock === false
        ? '<span class="wl-stock-badge wl-stock-out">Backorder</span>'
        : '<span class="wl-stock-badge wl-stock-in">In stock</span>'}</td>
      <td class="wl-col-move">${moveOpts}</td>
      <td class="wl-col-rm"><button class="ci-remove" onclick="wlRemoveItem('${list.id}','${item.id}')" title="Remove"><i class="ti ti-trash" style="font-size:13px;"></i></button></td>
    </tr>`;
  }

  function render() {
    renderSideLists();
    renderItems();
  }

  window.wlSelectList = function(id) {
    _activeListId = id;
    _renaming = null;
    render();
  };

  window.wlCreateList = function() {
    const name = prompt('Name your new wish list:');
    if (!name || !name.trim()) return;
    const list = Store.createWishList(name.trim());
    _activeListId = list.id;
    render();
  };

  window.wlDeleteList = function(id) {
    const list = _lists.find(l => l.id === id);
    if (!list) return;
    if (!confirm(`Delete "${list.name}"? This cannot be undone.`)) return;
    Store.deleteWishList(id);
    _lists = Store.getWishLists();
    _activeListId = _lists.length ? _lists[0].id : null;
    render();
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

  window.wlRemoveItem = function(listId, partId) {
    Store.removeFromWishList(listId, partId);
    render();
  };

  window.wlMoveItem = function(fromListId, partId, toListId) {
    if (!toListId) return;
    Store.moveWishListItem(fromListId, toListId, partId);
    render();
  };

  el.innerHTML = `
<style>
.wl-layout { display: flex; height: 100%; min-height: 0; gap: 0; }
.wl-sidebar { width: 220px; flex-shrink: 0; background: #FAFAF8; border-right: 0.5px solid #E8E4DF; display: flex; flex-direction: column; padding: 16px 0; overflow-y: auto; }
.wl-sidebar-title { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #9CA3AF; padding: 0 16px 10px; }
.wl-list-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; cursor: pointer; border-radius: 0; font-size: 13px; color: #3A3D4A; transition: background 0.1s; }
.wl-list-item:hover { background: #F0ECE8; }
.wl-list-item.active { background: #E6EDF7; color: #1C3969; font-weight: 600; }
.wl-list-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wl-list-count { font-size: 10px; font-weight: 700; background: #E8E4DF; color: #7A7F8E; border-radius: 999px; padding: 1px 6px; }
.wl-list-item.active .wl-list-count { background: #D6E4F7; color: #1C3969; }
.wl-new-btn { margin: 8px 12px 0; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #1C3969; background: none; border: 0.5px dashed #B8C7DB; border-radius: 7px; padding: 7px 12px; cursor: pointer; font-family: inherit; width: calc(100% - 24px); }
.wl-new-btn:hover { background: #EEF3F9; }
.wl-content { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }
.wl-panel-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 0.5px solid #E8E4DF; gap: 12px; flex-wrap: wrap; }
.wl-panel-title { font-size: 18px; font-weight: 700; color: #111318; }
.wl-rename-input { font-size: 18px; font-weight: 700; color: #111318; border: 1.5px solid #1C3969; border-radius: 7px; padding: 2px 8px; font-family: inherit; outline: none; background: #FFFFFF; min-width: 0; flex: 1; }
.wl-action-btn { background: none; border: 0.5px solid #E2DDD8; border-radius: 6px; padding: 5px 10px; font-size: 11px; font-weight: 600; color: #5A5F6E; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 4px; }
.wl-action-btn:hover { background: #F5F2EE; }
.wl-action-save { background: #1C3969; color: #FFFFFF; border-color: #1C3969; }
.wl-action-save:hover { background: #152B52; }
.wl-action-danger { color: #A32D2D; border-color: #F5C5C5; }
.wl-action-danger:hover { background: #FCEBEB; }
.wl-table { width: 100%; border-collapse: collapse; }
.wl-table th { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #9CA3AF; padding: 8px 12px; text-align: left; background: #FAFAF8; border-bottom: 1px solid #E8E4DF; }
.wl-table td { padding: 10px 12px; border-bottom: 0.5px solid #F5F2EE; vertical-align: middle; }
.wl-row:last-child td { border-bottom: none; }
.wl-col-pn { width: 130px; }
.wl-col-uom { width: 56px; }
.wl-col-vendor { width: 120px; }
.wl-col-price { width: 80px; }
.wl-col-stock { width: 90px; }
.wl-col-move { width: 130px; }
.wl-col-rm { width: 40px; }
.wl-partnum { font-family: 'SF Mono','Consolas',monospace; font-size: 11px; font-weight: 700; color: #3A3D4A; }
.wl-desc { font-size: 13px; font-weight: 500; color: #111318; }
.wl-stock-badge { font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 7px; }
.wl-stock-in { background: #E1F5EE; color: #1C6B4A; }
.wl-stock-out { background: #FEF3C7; color: #92400E; }
.uom-badge { font-size: 10px; font-weight: 700; background: #F0ECE8; color: #5A5F6E; border-radius: 4px; padding: 2px 6px; letter-spacing: 0.3px; }
.ci-remove { background: none; border: none; color: #C8C3BC; cursor: pointer; padding: 4px; border-radius: 5px; }
.ci-remove:hover { background: #FCEBEB; color: #A32D2D; }
.wl-move-select { height: 28px; border: 0.5px solid #E2DDD8; border-radius: 6px; padding: 0 6px; font-size: 11px; font-family: inherit; color: #5A5F6E; outline: none; background: #FAFAF8; cursor: pointer; max-width: 120px; }
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
    <div style="display:flex;flex:1;min-height:0;height:calc(100vh - 56px);">
      <div class="wl-sidebar">
        <div class="wl-sidebar-title">My Lists</div>
        <div id="wl-list-nav"></div>
      </div>
      <div class="wl-content" id="wl-items-panel"></div>
    </div>
  </div>
</div>`;

  render();
}

// Global helper: add a part to a wish list from anywhere in the app
window.addToWishList = function(part) {
  const lists = Store.getWishLists();
  if (!lists.length) {
    const name = prompt('Create your first wish list:');
    if (!name || !name.trim()) return;
    const list = Store.createWishList(name.trim());
    Store.addToWishList(list.id, part);
    return;
  }
  if (lists.length === 1) {
    Store.addToWishList(lists[0].id, part);
    // Brief toast
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111318;color:#FFFFFF;border-radius:9px;padding:10px 18px;font-size:13px;font-weight:500;font-family:Inter,sans-serif;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px;';
    t.innerHTML = `<i class="ti ti-heart" style="color:#E03131;"></i> Added to <strong>${lists[0].name}</strong>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
    return;
  }
  // Multiple lists — show picker
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const card = document.createElement('div');
  card.style.cssText = 'background:#FFFFFF;border-radius:14px;width:100%;max-width:340px;box-shadow:0 16px 48px rgba(0,0,0,.2);font-family:Inter,sans-serif;overflow:hidden;';
  card.innerHTML = `
    <div style="padding:16px 18px;border-bottom:0.5px solid #F0ECE8;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:14px;font-weight:700;color:#111318;">Add to wish list</div>
      <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#9CA3AF;line-height:1;">×</button>
    </div>
    <div style="padding:10px 0;">
      ${lists.map(l => `<div style="display:flex;align-items:center;gap:10px;padding:10px 18px;cursor:pointer;font-size:13px;color:#111318;" onmouseenter="this.style.background='#F5F2EE'" onmouseleave="this.style.background=''" onclick="Store.addToWishList('${l.id}',${JSON.stringify(JSON.stringify(part))});this.closest('[style*=fixed]').remove();">
        <i class="ti ti-heart" style="color:#E03131;font-size:15px;flex-shrink:0;"></i>
        <span style="flex:1;">${l.name}</span>
        <span style="font-size:11px;color:#9CA3AF;">${l.items.length} items</span>
      </div>`).join('')}
    </div>
    <div style="padding:12px 18px;border-top:0.5px solid #F0ECE8;">
      <button style="width:100%;background:none;border:0.5px dashed #B8C7DB;border-radius:7px;padding:8px;font-size:12px;font-weight:600;color:#1C3969;cursor:pointer;font-family:inherit;" onclick="const n=prompt('New list name:');if(n&&n.trim()){const l=Store.createWishList(n.trim());Store.addToWishList(l.id,JSON.parse(this.dataset.part));this.closest('[style*=fixed]').remove();}" data-part="${part.id}">
        <i class="ti ti-plus" style="font-size:11px;"></i> Create new list
      </button>
    </div>`;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
};
