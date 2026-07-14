function render_manuals(el) {
  var _searchQuery = '';
  var _vendorFilter = (Router.context && Router.context.vendor) || null;
  var _machineFilter = 'All';

  var VENDORS = ['Skyjack', 'Caterpillar', 'Toyota', 'Bobcat'];

  var VENDOR_ICONS = {
    'Skyjack': 'ti-crane',
    'Caterpillar': 'ti-backhoe',
    'Toyota': 'ti-forklift',
    'Bobcat': 'ti-bulldozer',
  };

  function getMachinesForVendor(vendor) {
    var all = Store.getManuals('');
    var filtered = vendor ? all.filter(function(m) { return m.vendor === vendor; }) : all;
    var seen = {};
    var machines = [];
    filtered.forEach(function(m) {
      if (m.machine && !seen[m.machine]) { seen[m.machine] = true; machines.push(m.machine); }
    });
    return machines;
  }

  function getFiltered() {
    return Store.getManuals(_searchQuery).filter(function(m) {
      if (_vendorFilter && m.vendor !== _vendorFilter) return false;
      if (_machineFilter !== 'All' && m.machine !== _machineFilter) return false;
      return true;
    });
  }

  function typeBackground(type) {
    if (type === 'Service') return 'background:#FCEBEB;color:#A32D2D;';
    if (type === 'Parts') return 'background:#EEEDFE;color:#534AB7;';
    if (type === 'Operator') return 'background:#E6F1FB;color:#185FA5;';
    return 'background:#EAF3DE;color:#3B6D11;';
  }

  function typeIconClass(type) {
    if (type === 'Service') return 'ti-file-text';
    if (type === 'Parts') return 'ti-schema';
    if (type === 'Operator') return 'ti-book';
    return 'ti-file';
  }

  function renderGrid() {
    var container = document.getElementById('man-grid');
    if (!container) return;
    var manuals = getFiltered();
    if (!manuals.length) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:#9CA3AF;font-size:13px;">No manuals found.</div>';
      return;
    }
    container.innerHTML = manuals.map(function(m) {
      return '<div class="doc-card" data-manual-id="' + m.id + '">'
        + '<div class="doc-icon-wrap" style="' + typeBackground(m.type) + '"><i class="ti ' + typeIconClass(m.type) + '"></i></div>'
        + '<div class="doc-body">'
        + '<div class="doc-title">' + m.title + '</div>'
        + '<div class="doc-meta"><span>' + m.machine + '</span><span class="doc-meta-sep">·</span><span>' + m.year + '</span><span class="doc-meta-sep">·</span><span>' + m.pages + ' pages</span><span class="doc-meta-sep">·</span><span>' + m.size + '</span></div>'
        + '<div class="doc-tags"><span class="doc-tag tag-type">' + m.type + '</span></div>'
        + '<div class="doc-actions">'
        + '<button class="doc-btn doc-btn-primary" onclick="manViewManual(\'' + m.id + '\')"><i class="ti ti-eye" style="font-size:12px;"></i> View</button>'
        + '<button class="doc-btn doc-btn-ghost" onclick="manDownloadManual(\'' + m.id + '\')"><i class="ti ti-download" style="font-size:12px;"></i> Download</button>'
        + '</div></div></div>';
    }).join('');
  }

  function renderVendorList() {
    var list = document.getElementById('man-vendor-list');
    if (!list) return;
    var allManuals = Store.getManuals('');
    var allCount = _searchQuery ? Store.getManuals(_searchQuery).length : allManuals.length;

    var allItem = '<div class="man-vendor-item' + (!_vendorFilter ? ' active' : '') + '" data-vendor="">'
      + '<div class="mvi-icon"><i class="ti ti-books"></i></div>'
      + '<div class="mvi-name">All suppliers</div>'
      + '<div class="mvi-count">' + allCount + '</div>'
      + '</div>';

    var vendorItems = VENDORS.map(function(v) {
      var count = allManuals.filter(function(m) { return m.vendor === v; }).length;
      var isActive = _vendorFilter === v;
      return '<div class="man-vendor-item' + (isActive ? ' active' : '') + '" data-vendor="' + v + '">'
        + '<div class="mvi-icon"><i class="ti ' + (VENDOR_ICONS[v] || 'ti-building-store') + '"></i></div>'
        + '<div class="mvi-name">' + v + '</div>'
        + '<div class="mvi-count">' + count + '</div>'
        + '</div>';
    }).join('');

    list.innerHTML = allItem + vendorItems;

    list.querySelectorAll('.man-vendor-item').forEach(function(item) {
      item.addEventListener('click', function() {
        _vendorFilter = this.dataset.vendor || null;
        _machineFilter = 'All';
        renderVendorList();
        renderMachineChips();
        renderGrid();
      });
    });
  }

  function renderMachineChips() {
    var row = document.getElementById('man-machine-chips');
    if (!row) return;
    if (!_vendorFilter) {
      row.style.display = 'none';
      return;
    }
    var machines = getMachinesForVendor(_vendorFilter);
    if (machines.length <= 1) {
      row.style.display = 'none';
      return;
    }
    row.style.display = 'flex';
    var chips = [{ label: 'All', value: 'All' }].concat(machines.map(function(m) { return { label: m, value: m }; }));
    row.innerHTML = chips.map(function(c) {
      var isActive = _machineFilter === c.value;
      return '<button class="man-machine-chip' + (isActive ? ' active' : '') + '" data-machine="' + c.value + '">' + c.label + '</button>';
    }).join('');
    row.querySelectorAll('.man-machine-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        _machineFilter = this.dataset.machine;
        renderMachineChips();
        renderGrid();
      });
    });
  }

  el.innerHTML = '<style>'
    + '.man-content-row{display:flex;flex:1;min-height:0;}'
    + '.man-vendor-panel{width:200px;min-width:200px;background:#FFFFFF;border-right:0.5px solid #E8E4DF;display:flex;flex-direction:column;padding:16px 0;overflow-y:auto;}'
    + '.mvp-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px;padding:0 14px;}'
    + '.man-vendor-item{display:flex;align-items:center;gap:8px;padding:6px 14px;cursor:pointer;margin-bottom:2px;}'
    + '.man-vendor-item:hover{background:#F5F2EE;}'
    + '.man-vendor-item.active{background:#FAEEDA;}'
    + '.mvi-icon{width:26px;height:26px;background:#F5F2EE;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#9CA3AF;flex-shrink:0;}'
    + '.man-vendor-item.active .mvi-icon{background:#F5A623;color:#1A1200;}'
    + '.mvi-name{font-size:12px;font-weight:500;color:#3A3D4A;line-height:1.3;flex:1;}'
    + '.man-vendor-item.active .mvi-name{color:#854F0B;font-weight:600;}'
    + '.mvi-count{font-size:10px;color:#B0AAA3;}'
    + '.man-main-panel{flex:1;display:flex;flex-direction:column;min-width:0;}'
    + '.man-search-area{padding:12px 20px;background:#FFFFFF;border-bottom:0.5px solid #E8E4DF;}'
    + '.man-search-wrap{position:relative;}'
    + '.man-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9CA3AF;font-size:17px;pointer-events:none;}'
    + '.man-search-input{width:100%;height:40px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:10px;padding:0 14px 0 44px;font-size:14px;font-family:inherit;color:#111318;outline:none;box-sizing:border-box;}'
    + '.man-search-input:focus{border-color:#F5A623;background:#FFFFFF;}'
    + '.man-search-input::placeholder{color:#B0AAA3;}'
    + '.man-machine-chip-row{display:flex;align-items:center;gap:6px;padding:10px 20px;background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;flex-wrap:wrap;}'
    + '.man-machine-chip{height:28px;padding:0 12px;border:1px solid #E2DDD8;border-radius:999px;background:#FFFFFF;font-size:12px;font-weight:500;color:#5A5F6E;cursor:pointer;font-family:inherit;white-space:nowrap;}'
    + '.man-machine-chip:hover{background:#F5F2EE;border-color:#C8C3BC;}'
    + '.man-machine-chip.active{background:#FAEEDA;border-color:#F5A623;color:#854F0B;font-weight:600;}'
    + '.man-content-body{flex:1;padding:20px;overflow-y:auto;}'
    + '.man-section-label{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px;}'
    + '.docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:24px;}'
    + '.doc-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;padding:14px;display:flex;gap:12px;cursor:pointer;transition:border-color 0.12s;}'
    + '.doc-card:hover{border-color:#C8C3BC;}'
    + '.doc-icon-wrap{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}'
    + '.doc-body{flex:1;min-width:0;}'
    + '.doc-title{font-size:13px;font-weight:600;color:#111318;margin-bottom:3px;line-height:1.3;}'
    + '.doc-meta{font-size:11px;color:#9CA3AF;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}'
    + '.doc-meta-sep{color:#D1CBC4;}'
    + '.doc-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px;}'
    + '.doc-tag{font-size:10px;border-radius:4px;padding:2px 6px;font-weight:500;}'
    + '.tag-type{background:#FAEEDA;color:#854F0B;}'
    + '.doc-actions{display:flex;align-items:center;gap:6px;}'
    + '.doc-btn{font-size:11px;font-weight:500;border-radius:6px;padding:4px 10px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;}'
    + '.doc-btn-primary{background:#F5A623;border:none;color:#1A1200;font-weight:600;}'
    + '.doc-btn-primary:hover{background:#E8980F;}'
    + '.doc-btn-ghost{background:none;border:0.5px solid #E2DDD8;color:#3A3D4A;}'
    + '.doc-btn-ghost:hover{background:#F5F2EE;}'
    + '</style>'
    + '<h2 class="sr-only">Manuals and documentation</h2><div class="shell">' + buildSidebar('manuals') + '<div class="main">'
    + '<div class="topbar"><div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;"><a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt(\'dashboard\')">Dashboard</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Manuals &amp; docs</span></div><div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>' + buildTopbarRight() + '</div>'
    + '<div class="man-content-row">'
    + '<div class="man-vendor-panel"><div class="mvp-label">Supplier</div><div id="man-vendor-list"></div></div>'
    + '<div class="man-main-panel">'
    + '<div class="man-search-area"><div class="man-search-wrap"><i class="ti ti-search man-search-icon"></i><input class="man-search-input" id="man-search-input" type="text" placeholder="Search manuals, bulletins, specs…"/></div></div>'
    + '<div class="man-machine-chip-row" id="man-machine-chips" style="display:none;"></div>'
    + '<div class="man-content-body" id="man-content-body"><div class="man-section-label">Manuals &amp; documentation</div><div class="docs-grid" id="man-grid"></div></div>'
    + '</div></div></div></div>';

  renderVendorList();
  renderMachineChips();
  renderGrid();

  // If navigated here with a vendor filter pre-applied, show machine chips
  if (_vendorFilter) {
    renderMachineChips();
  }

  document.getElementById('man-search-input').addEventListener('input', function() {
    _searchQuery = this.value;
    renderVendorList();
    renderGrid();
  });

  window.manClearVendor = function() {
    _vendorFilter = null;
    _machineFilter = 'All';
    renderVendorList();
    renderMachineChips();
    renderGrid();
  };

  var _targetManualId = Router.context && Router.context.manualId;
  if (_targetManualId) {
    var _target = Store.getManuals('').find(function(x) { return x.id === _targetManualId; });
    if (_target) {
      setTimeout(function() {
        var card = document.querySelector('[data-manual-id="' + _targetManualId + '"]');
        if (card) { card.scrollIntoView({ behavior:'smooth', block:'center' }); card.style.borderColor = '#F5A623'; }
        manViewManual(_targetManualId);
      }, 80);
    }
  }

  window.manViewManual = function(id) {
    var m = Store.getManuals('').find(function(x) { return x.id === id; });
    if (!m) return;
    Modal.show({ title: 'Viewing: ' + m.title, body: '<div style="text-align:center;padding:20px;"><i class="ti ti-file-text" style="font-size:48px;color:#9CA3AF;"></i><p style="margin-top:12px;font-size:13px;color:#7A7F8E;">' + m.machine + ' · ' + m.type + ' Manual · ' + m.pages + ' pages</p><p style="font-size:12px;color:#B0AAA3;margin-top:6px;">Document viewer opened — ' + m.size + '</p></div>', actions: [{ label: 'Close', onClick: function() { Modal.close(); } }] });
  };

  window.manDownloadManual = function(id) {
    var m = Store.getManuals('').find(function(x) { return x.id === id; });
    if (!m) return;
    Modal.show({ title: 'Download started', body: '<div style="text-align:center;padding:20px;"><i class="ti ti-download" style="font-size:40px;color:#3B6D11;"></i><p style="margin-top:12px;font-size:14px;font-weight:600;color:#111318;">' + m.title + '</p><p style="font-size:13px;color:#7A7F8E;margin-top:4px;">' + m.size + ' · Download in progress</p></div>', actions: [{ label: 'OK', primary: true, onClick: function() { Modal.close(); } }] });
  };
}
