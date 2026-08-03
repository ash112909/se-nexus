function render_diagnostics(el) {
  // ── State ────────────────────────────────────────────────────────────────
  let _ctx = Router.context && Router.context.woId
    ? { type: 'wo', woId: Router.context.woId }
    : { type: 'none' };

  // Session management
  function renderSessions() {
    const panel = document.getElementById('diag-sessions-panel');
    if (!panel) return;
    const sessions = Store.getDiagSessions();
    const active = Store.getActiveDiagSession();
    const activeId = active ? active.id : null;
    panel.innerHTML = `
      <div class="ds-header">
        <button class="ds-new-btn" onclick="diagNewChat()"><i class="ti ti-plus" style="font-size:12px;"></i> New chat</button>
      </div>
      <div class="ds-list">
        ${sessions.length === 0 ? `<div style="padding:12px 10px;font-size:11px;color:#6C7082;text-align:center;">No previous chats</div>` : ''}
        ${sessions.map(s => `
          <div class="ds-item ${s.id === activeId ? 'ds-item-active' : ''}" onclick="diagSwitchSession('${s.id}')">
            <div class="ds-item-title">${escHtml(s.title)}</div>
            <div class="ds-item-foot">
              <span class="ds-item-time">${_relTime(s.createdAt)}</span>
              <button class="ds-item-del" onclick="event.stopPropagation();diagDeleteSession('${s.id}')" title="Delete"><i class="ti ti-trash" style="font-size:10px;"></i></button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function _relTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  window.diagNewChat = function() {
    Store.createDiagSession('New chat');
    renderSessions();
    renderMessages();
    renderContextBar();
    document.getElementById('diag-chat-input')?.focus();
  };

  window.diagSwitchSession = function(id) {
    Store.setActiveDiagSession(id);
    renderSessions();
    renderMessages();
  };

  window.diagDeleteSession = function(id) {
    const sessions = Store.getDiagSessions();
    if (sessions.length <= 1 && sessions[0]?.id === id) {
      Store.deleteDiagSession(id);
      renderSessions();
      renderMessages();
      return;
    }
    Store.deleteDiagSession(id);
    renderSessions();
    renderMessages();
  };

  // Cart: [{ partNo, qty, desc, price }]
  let _diagCart = [];
  let _cartOpen = false;

  // Part catalog for display
  const PART_INFO = {
    'SKJ-103100': { desc:'Lift Cylinder Seal Kit (full)',    price:148.00 },
    'SKJ-103278': { desc:'Pressure Relief Valve Assembly',   price:212.50 },
    'SKJ-103445': { desc:'Cylinder Rod Wiper Seal',          price:42.00  },
    'SKJ-103512': { desc:'Cylinder Piston Seal',             price:58.00  },
    'SKJ-103601': { desc:'Hydraulic Pump O-ring Set',        price:24.00  },
    'SKJ-CHK-302':{ desc:'Check Valve — Lift Circuit',       price:94.00  },
    'SKJ-HYD-200':{ desc:'Gear Pump — Complete',             price:485.00 },
    'SKJ-HYD-201':{ desc:'Gear Pump Seal Kit',               price:67.50  },
    'SKJ-HF046-1G':{ desc:'Hydraulic Fluid ISO 46 AW (1 gal)',price:18.00 },
    'SKJ-104880': { desc:'Hydraulic Filter Element 10-micron',price:32.00 },
    'SKJ-SOL-301': { desc:'Lift Solenoid Valve Coil',        price:88.00  },
    'SKJ-BAT-500': { desc:'6V 220Ah Battery (each)',         price:310.00 },
    'SKJ-CHR-501': { desc:'Battery Charger — 24V',           price:560.00 },
    'SKJ-CTL-502': { desc:'Base Controller Board',           price:1420.00},
    'SKJ-JOY-503': { desc:'Platform Joystick Module',        price:640.00 },
    'SKJ-LIM-504': { desc:'Descent Safety Bar Limit Switch', price:44.00  },
    'SKJ-MTR-400': { desc:'Drive Motor — Brushless 24V',     price:890.00 },
    'SKJ-HUB-401': { desc:'Drive Hub Assembly',              price:245.00 },
    'SKJ-PAD-601': { desc:'Scissor Arm Wear Pad Set (8pc)',  price:76.00  },
    'SKJ-PIN-600': { desc:'Scissor Arm Pin 25mm',            price:38.00  },
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderMd(text) {
    return (text || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/\n\n/g,'</p><p class="rp">')
      .replace(/\n/g,'<br>');
  }

  function severityBadge(sev) {
    const map = {
      critical: ['#B91C1C','#FEE2E2','CRITICAL'],
      high:     ['#C2410C','#FFF7ED','HIGH'],
      medium:   ['#B45309','#FFFBEB','MEDIUM'],
      low:      ['#185FA5','#EFF6FF','LOW'],
    };
    const [color, bg, label] = map[sev] || map.low;
    return `<span style="background:${bg};color:${color};border:1px solid ${color}30;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700;letter-spacing:.7px;">${label}</span>`;
  }

  function partInfo(partNo) {
    return PART_INFO[partNo] || { desc: partNo, price: null };
  }

  function cartTotal() {
    return _diagCart.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  }

  function cartHasItem(partNo) {
    return _diagCart.some(i => i.partNo === partNo);
  }

  // ── Context helpers ───────────────────────────────────────────────────────
  function ctxLabel(ctx) {
    if (!ctx || ctx.type === 'none') return 'General';
    if (ctx.type === 'wo') {
      const wo = Store.getWorkOrder(ctx.woId);
      return wo ? `WO #${wo.id} — ${wo.machine}` : `WO #${ctx.woId}`;
    }
    if (ctx.type === 'parts') return ctx.query ? `Parts: "${ctx.query}"` : 'Parts search';
    return 'General';
  }
  function ctxIcon(ctx) {
    if (!ctx || ctx.type === 'none') return 'ti-message-circle';
    if (ctx.type === 'wo') return 'ti-clipboard-list';
    if (ctx.type === 'parts') return 'ti-search';
    return 'ti-message-circle';
  }
  function ctxColor(ctx) {
    if (!ctx || ctx.type === 'none') return '#8A8FA8';
    if (ctx.type === 'wo') return '#00843D';
    if (ctx.type === 'parts') return '#7C6FF7';
    return '#8A8FA8';
  }

  // ── Rich response card renderer ───────────────────────────────────────────
  function renderAiCard(resp) {
    const sev = severityBadge(resp.severity);

    // Steps
    const stepsHtml = resp.steps && resp.steps.length
      ? `<div class="rc-section">
          <div class="rc-section-lbl">Step-by-step procedure</div>
          <ol class="rc-steps">${resp.steps.map(s=>`<li>${renderMd(s)}</li>`).join('')}</ol>
        </div>`
      : '';

    // Manual refs
    const manualsHtml = resp.manualRefs && resp.manualRefs.length
      ? `<div class="rc-section">
          <div class="rc-section-lbl">Manual references</div>
          <div class="rc-chips">${resp.manualRefs.map(ref=>
            `<span class="rc-chip rc-chip-manual" onclick="diagOpenManual('${ref.id}','${escHtml(ref.title)}')"
              title="${escHtml(ref.summary)}">
              <i class="ti ti-book" style="font-size:10px;"></i> Ch.${ref.chapter} — ${escHtml(ref.title)}
              <span style="opacity:.6;margin-left:3px;">p.${ref.page}</span>
            </span>`
          ).join('')}</div>
        </div>`
      : '';

    // Fault code chips
    const fcHtml = resp.faultCodes && resp.faultCodes.length
      ? `<div class="rc-chips" style="margin-bottom:8px;">${resp.faultCodes.map(fc=>
          `<span class="rc-chip rc-chip-fc" onclick="diagLookupFc('${fc}')">${fc}</span>`
        ).join('')}</div>`
      : '';

    // Parts
    const partsHtml = resp.parts && resp.parts.length
      ? `<div class="rc-section">
          <div class="rc-section-lbl">Recommended parts</div>
          <div class="rc-parts">${resp.parts.map(p => {
            const pi = partInfo(p);
            const inCart = cartHasItem(p);
            return `<div class="rc-part-card" id="pcard-${p.replace(/[^A-Za-z0-9]/g,'-')}">
              <div class="rc-part-no">${p}</div>
              <div class="rc-part-desc">${escHtml(pi.desc)}</div>
              <div class="rc-part-foot">
                ${pi.price ? `<span class="rc-part-price">$${pi.price.toFixed(2)}</span>` : ''}
                ${inCart
                  ? `<button class="rc-part-btn rc-part-btn-added" disabled><i class="ti ti-check" style="font-size:11px;"></i> In cart</button>`
                  : `<button class="rc-part-btn" onclick="diagAddToCart('${p}')"><i class="ti ti-shopping-cart-plus" style="font-size:11px;"></i> Add to cart</button>`
                }
              </div>
            </div>`;
          }).join('')}</div>
        </div>`
      : '';

    return `<div class="response-card">
      <div class="rc-header">
        <div class="rc-meta">
          <span class="rc-tag">SmartEquip AI · ${escHtml(resp.machine || 'SJIII 3219')}</span>
          ${sev}
        </div>
        <div class="rc-title">${escHtml(resp.title)}</div>
      </div>
      <div class="rc-body">
        ${fcHtml}
        <p class="rp">${renderMd(resp.body)}</p>
        ${stepsHtml}
        ${manualsHtml}
        ${partsHtml}
      </div>
    </div>`;
  }

  // ── Cart panel ────────────────────────────────────────────────────────────
  function renderCart() {
    const wrap = document.getElementById('diag-cart-panel');
    if (!wrap) return;
    if (!_cartOpen || !_diagCart.length) {
      wrap.innerHTML = '';
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = 'flex';
    const total = cartTotal();
    const rows = _diagCart.map((item, i) => `
      <div class="cart-row">
        <div class="cart-row-info">
          <div class="cart-row-no">${item.partNo}</div>
          <div class="cart-row-desc">${escHtml(item.desc)}</div>
        </div>
        <div class="cart-row-right">
          <div class="cart-qty-ctrl">
            <button onclick="diagCartQty(${i},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="diagCartQty(${i},1)">+</button>
          </div>
          ${item.price ? `<div class="cart-row-price">$${(item.price*item.qty).toFixed(2)}</div>` : ''}
          <button class="cart-row-del" onclick="diagCartRemove(${i})" title="Remove"><i class="ti ti-x" style="font-size:11px;"></i></button>
        </div>
      </div>`).join('');
    wrap.innerHTML = `
      <div class="cart-header">
        <div class="cart-title"><i class="ti ti-shopping-cart" style="font-size:13px;"></i> Parts Cart (${_diagCart.length})</div>
        <button class="cart-close-btn" onclick="diagToggleCart()"><i class="ti ti-x" style="font-size:12px;"></i></button>
      </div>
      <div class="cart-rows">${rows}</div>
      <div class="cart-footer">
        <div class="cart-total">Total estimate: <strong>$${total.toFixed(2)}</strong></div>
        <div class="cart-actions">
          <button class="cart-action-btn cart-action-secondary" onclick="diagAddToExistingWO()">
            <i class="ti ti-clipboard-list" style="font-size:12px;"></i> Add to existing WO
          </button>
          <button class="cart-action-btn cart-action-primary" onclick="diagCreateWO()">
            <i class="ti ti-plus" style="font-size:12px;"></i> New work order
          </button>
        </div>
      </div>`;
  }

  function renderCartBadge() {
    const btn = document.getElementById('diag-cart-btn');
    if (!btn) return;
    const badge = btn.querySelector('.cart-badge');
    if (badge) badge.textContent = _diagCart.length || '';
    btn.style.display = _diagCart.length ? 'flex' : 'none';
  }

  // ── Messages ──────────────────────────────────────────────────────────────
  function renderMessages() {
    const area = document.getElementById('diag-chat-area');
    if (!area) return;
    const history = Store.getDiagnosticHistory();
    if (!history.length) {
      area.innerHTML = `<div style="text-align:center;padding:48px 20px;">
        <div style="width:48px;height:48px;background:#E6F4EC;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#1B5E35;margin:0 auto 14px;"><i class="ti ti-sparkles"></i></div>
        <div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:6px;">Diagnostic Assistant — Skyjack SJIII 3219</div>
        <div style="font-size:13px;color:#9CA3AF;max-width:320px;margin:0 auto;line-height:1.6;">Describe a fault code, symptom, or ask about a service interval. Parts can be added to a cart and converted to a work order.</div>
      </div>`;
      return;
    }
    area.innerHTML = history.map(msg => {
      if (msg.role === 'system') {
        return `<div class="msg-system"><i class="ti ti-arrow-right" style="font-size:10px;opacity:.5;"></i> ${escHtml(msg.text)}</div>`;
      }
      if (msg.role === 'user') {
        const ctxPill = msg.ctx && msg.ctx.type !== 'none'
          ? `<div class="msg-ctx-pill" style="color:${ctxColor(msg.ctx)};border-color:${ctxColor(msg.ctx)}40;">
              <i class="ti ${ctxIcon(msg.ctx)}" style="font-size:9px;"></i> ${ctxLabel(msg.ctx)}
            </div>`
          : '';
        return `<div class="msg-user">${ctxPill}<div class="msg-user-bubble">${escHtml(msg.text)}</div></div>`;
      }
      // AI message with rich card
      if (msg.role === 'ai' && msg.resp) {
        return `<div class="msg-ai">
          <div class="ai-avatar"><i class="ti ti-sparkles"></i></div>
          <div class="ai-bubble">${renderAiCard(msg.resp)}</div>
        </div>`;
      }
      // Fallback plain text AI
      return `<div class="msg-ai">
        <div class="ai-avatar"><i class="ti ti-sparkles"></i></div>
        <div class="ai-bubble">
          <div class="response-card">
            <div class="rc-header"><div class="rc-title">SmartEquip AI</div></div>
            <div class="rc-body"><p class="rp">${escHtml(msg.text)}</p></div>
          </div>
        </div>
      </div>`;
    }).join('');
    area.scrollTop = area.scrollHeight;
  }

  function renderContextBar() {
    const bar = document.getElementById('diag-ctx-bar');
    if (!bar) return;
    const color = ctxColor(_ctx);
    const icon = ctxIcon(_ctx);
    const label = ctxLabel(_ctx);
    let detail = '';
    if (_ctx.type === 'wo') {
      const wo = Store.getWorkOrder(_ctx.woId);
      if (wo) detail = `<span class="ctx-detail">${wo.asset} · ${wo.status}</span>`;
    }
    bar.innerHTML = `
      <div class="ctx-active" style="border-color:${color}20;background:${color}10;">
        <i class="ti ${icon}" style="color:${color};font-size:13px;flex-shrink:0;"></i>
        <span class="ctx-active-label" style="color:${color};">${label}</span>
        ${detail}
        <button class="ctx-switch-btn" onclick="diagSwitchContext()">Switch context <i class="ti ti-selector" style="font-size:10px;"></i></button>
      </div>
      ${_ctx.type !== 'none' ? `<button class="ctx-clear-btn" onclick="diagClearContext()" title="Remove context"><i class="ti ti-x" style="font-size:11px;"></i></button>` : ''}`;
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  function sendMessage() {
    const inp = document.getElementById('diag-chat-input');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    Store.addDiagnosticMessage({ role: 'user', text, ctx: Object.assign({}, _ctx) });
    inp.value = '';
    renderSessions();
    renderMessages();
    setTimeout(function() {
      const resp = diagGenerateResponse(text, _ctx);
      Store.addDiagnosticMessage({ role: 'ai', resp });
      renderMessages();
    }, 500);
  }

  // ── Cart actions ──────────────────────────────────────────────────────────
  window.diagAddToCart = function(partNo) {
    if (cartHasItem(partNo)) return;
    const pi = partInfo(partNo);
    _diagCart.push({ partNo, qty: 1, desc: pi.desc, price: pi.price });
    // Update button in DOM without full re-render
    const id = 'pcard-' + partNo.replace(/[^A-Za-z0-9]/g,'-');
    const card = document.getElementById(id);
    if (card) {
      const btn = card.querySelector('.rc-part-btn');
      if (btn) {
        btn.outerHTML = `<button class="rc-part-btn rc-part-btn-added" disabled><i class="ti ti-check" style="font-size:11px;"></i> In cart</button>`;
      }
    }
    if (!_cartOpen) { _cartOpen = true; }
    renderCart();
    renderCartBadge();
  };

  window.diagCartQty = function(idx, delta) {
    _diagCart[idx].qty = Math.max(1, (_diagCart[idx].qty || 1) + delta);
    renderCart();
  };

  window.diagCartRemove = function(idx) {
    _diagCart.splice(idx, 1);
    if (!_diagCart.length) _cartOpen = false;
    renderCart();
    renderCartBadge();
    renderMessages(); // refresh "in cart" buttons
  };

  window.diagToggleCart = function() {
    _cartOpen = !_cartOpen;
    renderCart();
  };

  window.diagLookupFc = function(code) {
    const inp = document.getElementById('diag-chat-input');
    if (inp) { inp.value = `Fault code ${code}`; inp.focus(); }
  };

  window.diagOpenManual = function(sectionId, title) {
    const sec = (window.SJ3219_SECTIONS || []).find(s => s.id === sectionId);
    const pdfPage = sec ? sec.pdfPage : null;
    const pdfFile = window.SJIII_MANUAL_PDF || 'manuals/sjiii-operating-manual.pdf';
    const pdfSrc = pdfFile + (pdfPage ? '#page=' + pdfPage : '');
    const manPage = sec ? sec.page : null;
    Modal.show({
      title: title || 'Manual Reference',
      fullscreen: true,
      body: '<style>'
        + '.pdf-viewer-wrap{display:flex;flex-direction:column;flex:1;overflow:hidden;}'
        + '.pdf-viewer-toolbar{background:#3AAA35;padding:8px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;}'
        + '.pdf-viewer-meta{color:#9CA3AF;font-size:11px;flex:1;}'
        + '.pdf-frame{flex:1;border:none;background:#525659;width:100%;}'
        + '</style>'
        + '<div class="pdf-viewer-wrap">'
        + '<div class="pdf-viewer-toolbar">'
        + '<i class="ti ti-book" style="color:#9CA3AF;font-size:13px;flex-shrink:0;"></i>'
        + '<span class="pdf-viewer-meta">Skyjack SJIII Series Operating Manual (ANSI/CSA) · 93 pages</span>'
        + (manPage ? '<span style="font-size:11px;color:#00843D;display:flex;align-items:center;gap:4px;"><i class="ti ti-bookmark-filled" style="font-size:11px;"></i> Page ' + manPage + '</span>' : '')
        + '<a href="' + pdfFile + '" download style="font-size:11px;color:#9CA3AF;background:#2D8528;border:0.5px solid #3C4052;border-radius:5px;padding:4px 10px;text-decoration:none;display:flex;align-items:center;gap:4px;flex-shrink:0;"><i class="ti ti-download" style="font-size:11px;"></i> Download</a>'
        + '</div>'
        + '<iframe class="pdf-frame" src="' + pdfSrc + '" title="' + (title || 'Manual') + '"></iframe>'
        + '</div>',
      actions: [{ label: 'Close', onClick: () => Modal.close() }]
    });
  };

  // ── WO flows ──────────────────────────────────────────────────────────────
  window.diagCreateWO = function() {
    if (typeof window.openNewWOModal !== 'function') {
      Modal.show({ title: 'Error', body: '<p style="font-size:13px;color:#7A7F8E;">Work order form not available. Please navigate to Orders first.</p>',
        actions: [{ label: 'Close', onClick: () => Modal.close() }] });
      return;
    }
    const cartSnapshot = _diagCart.map(i => ({ partNo: i.partNo, qty: i.qty, desc: i.desc, price: i.price }));
    window.openNewWOModal({
      asset: 'FL-094',
      make: 'Skyjack',
      model: 'SJIII 3219',
      serial: 'SJ3219-00847',
      issue: 'Diagnostic finding from AI assistant',
      cart: cartSnapshot,
      onCreated: function(newWO) {
        _diagCart = [];
        _cartOpen = false;
        renderCart();
        renderCartBadge();
        renderMessages();
        Modal.show({
          title: 'Work order created',
          body: `<div style="text-align:center;padding:12px 0;">
            <div style="font-size:32px;margin-bottom:8px;color:#15803D;">✓</div>
            <div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:4px;">Work Order #${newWO.id} created</div>
            <div style="font-size:13px;color:#7A7F8E;">Skyjack SJIII 3219 · parts attached</div>
          </div>`,
          actions: [
            { label: 'Close', onClick: () => Modal.close() },
            { label: 'View orders', primary: true, onClick: () => { Modal.close(); sendPrompt('Open orders list'); } }
          ]
        });
      }
    });
  };

  window.diagAddToExistingWO = function() {
    const wos = Store.getWorkOrders('active');
    if (!wos.length) {
      Modal.show({ title: 'No active orders', body: '<p style="font-size:13px;color:#7A7F8E;">There are no active work orders to add parts to. Create a new work order instead.</p>',
        actions: [{ label: 'Close', onClick: () => Modal.close() }] });
      return;
    }
    Modal.show({
      title: 'Add parts to existing work order',
      body: `<div style="display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:12px;color:#7A7F8E;margin-bottom:6px;">Select the order to add ${_diagCart.length} part(s) to:</div>
        ${wos.map(wo=>`
          <div class="ctx-option" onclick="diagConfirmAddToWO(${wo.id})" style="cursor:pointer;">
            <i class="ti ti-clipboard-list" style="color:#00843D;font-size:14px;flex-shrink:0;"></i>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;color:#111318;">Order #${wo.id} — ${wo.machine}</div>
              <div style="font-size:11px;color:#9CA3AF;">${wo.asset || ''} · ${wo.status}</div>
            </div>
          </div>`).join('')}
      </div>
      <style>
        .ctx-option{display:flex;align-items:center;gap:10px;padding:10px 12px;border:0.5px solid #E8E4DF;border-radius:9px;transition:background .1s;}
        .ctx-option:hover{background:#FAFAF8;}
      </style>`,
      actions: [{ label: 'Cancel', onClick: () => Modal.close() }]
    });
  };

  window.diagConfirmAddToWO = function(woId) {
    Store.addPartsToWorkOrder(woId, _diagCart.map(i => ({ partNo: i.partNo, qty: i.qty, desc: i.desc, price: i.price })));
    Modal.close();
    _diagCart = [];
    _cartOpen = false;
    renderCart();
    renderCartBadge();
    renderMessages();
    Modal.show({
      title: 'Parts added',
      body: `<div style="text-align:center;padding:12px 0;font-size:13px;color:#7A7F8E;">Parts have been added to Work Order #${woId}.</div>`,
      actions: [
        { label: 'Close', onClick: () => Modal.close() },
        { label: 'View order', primary: true, onClick: () => { Modal.close(); sendPrompt('Open orders list'); } }
      ]
    });
  };

  // ── Context switcher ──────────────────────────────────────────────────────
  window.diagSwitchContext = function() {
    const wos = Store.getWorkOrders('active');
    Modal.show({
      title: 'Switch context',
      body: `<div style="display:flex;flex-direction:column;gap:6px;">
        <div class="ctx-option ${_ctx.type==='none'?'selected':''}" onclick="diagSetCtx('none')">
          <i class="ti ti-message-circle" style="color:#8A8FA8;font-size:14px;flex-shrink:0;"></i>
          <div style="flex:1;"><div style="font-size:12px;font-weight:600;color:#111318;">General question</div><div style="font-size:11px;color:#9CA3AF;">No machine or WO attached</div></div>
        </div>
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin:8px 0 2px;">Orders</div>
        ${wos.map(w=>`<div class="ctx-option ${_ctx.type==='wo'&&_ctx.woId===w.id?'selected':''}" onclick="diagSetCtx('wo',${w.id})">
          <i class="ti ti-clipboard-list" style="color:#00843D;font-size:14px;flex-shrink:0;"></i>
          <div style="flex:1;"><div style="font-size:12px;font-weight:600;color:#111318;">Order #${w.id} — ${w.machine}</div><div style="font-size:11px;color:#9CA3AF;">${w.asset||''} · ${w.status}</div></div>
        </div>`).join('')}
      </div>
      <style>
        .ctx-option{display:flex;align-items:center;gap:10px;padding:10px 12px;border:0.5px solid #E8E4DF;border-radius:9px;cursor:pointer;transition:background .1s;}
        .ctx-option:hover{background:#FAFAF8;}
        .ctx-option.selected{background:#FAFAF8;border-color:#D1CBC4;}
      </style>`,
      actions: [{ label: 'Cancel', onClick: () => Modal.close() }]
    });
  };

  window.diagSetCtx = function(type, woId) {
    const prev = ctxLabel(_ctx);
    if (type === 'none') _ctx = { type: 'none' };
    else if (type === 'wo') _ctx = { type: 'wo', woId };
    const next = ctxLabel(_ctx);
    Modal.close();
    if (prev !== next) Store.addDiagnosticMessage({ role: 'system', text: `Context switched to: ${next}` });
    renderContextBar();
    renderMessages();
    document.getElementById('diag-chat-input')?.focus();
  };

  window.diagClearContext = function() {
    _ctx = { type: 'none' };
    Store.addDiagnosticMessage({ role: 'system', text: 'Context cleared.' });
    renderContextBar();
    renderMessages();
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  el.innerHTML = `<style>
/* ── Diagnostic layout ──────────────────────────────────────── */
.diag-layout{flex:1;display:flex;min-height:0;overflow:hidden;}
.diag-main{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;}
/* Sessions sidebar */
#diag-sessions-panel{width:210px;flex-shrink:0;border-right:0.5px solid #2D8528;background:#2D8528;display:flex;flex-direction:column;overflow:hidden;}
.ds-header{padding:10px 10px 8px;border-bottom:0.5px solid #2D8528;flex-shrink:0;}
.ds-new-btn{width:100%;background:#2D8528;border:0.5px solid rgba(255,255,255,0.25);border-radius:7px;padding:7px 10px;font-size:12px;font-weight:600;color:#FFFFFF;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;}
.ds-new-btn:hover{background:#353545;color:#FFF;}
.ds-list{flex:1;overflow-y:auto;padding:6px 6px;}
.ds-item{padding:8px 10px;border-radius:7px;cursor:pointer;margin-bottom:2px;}
.ds-item:hover{background:#2D8528;}
.ds-item-active{background:#2D8528 !important;border:0.5px solid rgba(255,255,255,0.25);}
.ds-item-title{font-size:11.5px;color:#C8CADF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.4;}
.ds-item-active .ds-item-title{color:#FFF;}
.ds-item-foot{display:flex;align-items:center;justify-content:space-between;margin-top:3px;}
.ds-item-time{font-size:10px;color:#C5EAC3;}
.ds-item-del{background:none;border:none;color:#C5EAC3;cursor:pointer;padding:0;display:none;align-items:center;justify-content:center;width:18px;height:18px;border-radius:3px;}
.ds-item:hover .ds-item-del,.ds-item-active .ds-item-del{display:flex;}
.ds-item-del:hover{background:#2A1010;color:#F87171;}
/* Context bar */
.diag-ctx-strip{background:#3AAA35;padding:9px 22px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2D8528;flex-shrink:0;}
.ctx-active{display:flex;align-items:center;gap:7px;padding:5px 12px;border-radius:8px;border:1px solid;flex:1;}
.ctx-active-label{font-size:12px;font-weight:600;flex:1;}
.ctx-detail{font-size:11px;color:#8A8FA8;padding-left:6px;border-left:1px solid #3C4052;margin-left:2px;}
.ctx-switch-btn{margin-left:auto;background:none;border:0.5px solid rgba(255,255,255,0.3);border-radius:5px;padding:3px 9px;font-size:11px;font-weight:500;color:#DCEFD9;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;white-space:nowrap;}
.ctx-switch-btn:hover{border-color:#FFFFFF;color:#FFF;}
.ctx-clear-btn{width:26px;height:26px;background:none;border:0.5px solid rgba(255,255,255,0.3);border-radius:6px;color:#DCEFD9;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ctx-clear-btn:hover{border-color:#FFFFFF;color:#FFF;}
/* Toolbar */
.diag-toolbar{background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;padding:7px 22px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
.diag-clear-btn{font-size:11px;font-weight:500;color:#7A7F8E;background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:3px 9px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;}
.diag-clear-btn:hover{background:#F5F2EE;color:#3A3D4A;}
.diag-cart-btn{font-size:11px;font-weight:600;color:#1B5E35;background:#E6F4EC;border:1px solid #00843D40;border-radius:6px;padding:4px 12px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;margin-left:auto;}
.diag-cart-btn:hover{background:#B7DEC7;}
.cart-badge{background:#00843D;color:#0D2E18;border-radius:10px;padding:0 5px;font-size:10px;font-weight:700;min-width:16px;text-align:center;}
/* Chat */
.chat-area{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:18px;}
.msg-system{display:flex;align-items:center;gap:5px;font-size:11px;color:#9CA3AF;justify-content:center;padding:2px 0;}
.msg-user{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
.msg-ctx-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 7px;border-radius:5px;border:1px solid;}
.msg-user-bubble{background:#3AAA35;color:#FFF;border-radius:14px 14px 4px 14px;padding:11px 16px;max-width:60%;font-size:13px;line-height:1.5;}
.msg-ai{display:flex;gap:12px;align-items:flex-start;}
.ai-avatar{width:32px;height:32px;background:#00843D;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#0D2E18;flex-shrink:0;margin-top:2px;}
.ai-bubble{flex:1;min-width:0;}
/* Response card */
.response-card{background:#FFF;border:0.5px solid #E8E4DF;border-radius:12px;overflow:hidden;}
.rc-header{padding:12px 16px 10px;border-bottom:0.5px solid #F0EDE9;}
.rc-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.rc-tag{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;}
.rc-title{font-size:14px;font-weight:700;color:#111318;line-height:1.3;}
.rc-body{padding:14px 16px;display:flex;flex-direction:column;gap:14px;}
p.rp{margin:0;font-size:13px;color:#3A3D4A;line-height:1.65;}
.rc-section{display:flex;flex-direction:column;gap:6px;}
.rc-section-lbl{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#B0AAA3;}
.rc-steps{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;}
.rc-steps li{font-size:12.5px;color:#3A3D4A;line-height:1.55;}
.rc-chips{display:flex;flex-wrap:wrap;gap:5px;}
.rc-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid;}
.rc-chip-manual{background:#EFF6FF;color:#185FA5;border-color:#BFDBFE;}
.rc-chip-manual:hover{background:#DBEAFE;}
.rc-chip-fc{background:#FEF3C7;color:#92400E;border-color:#FDE68A;}
.rc-chip-fc:hover{background:#FDE68A;}
/* Parts */
.rc-parts{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:8px;}
.rc-part-card{background:#FAFAF8;border:0.5px solid #E8E4DF;border-radius:9px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;}
.rc-part-no{font-size:11px;font-weight:700;color:#7C6FF7;font-family:monospace;}
.rc-part-desc{font-size:12px;color:#3A3D4A;flex:1;line-height:1.4;}
.rc-part-foot{display:flex;align-items:center;justify-content:space-between;margin-top:6px;}
.rc-part-price{font-size:12px;font-weight:600;color:#111318;}
.rc-part-btn{font-size:11px;font-weight:600;color:#185FA5;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:5px;padding:3px 8px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:3px;}
.rc-part-btn:hover{background:#DBEAFE;}
.rc-part-btn-added{color:#15803D;background:#F0FDF4;border-color:#BBF7D0;cursor:default;}
/* Cart panel */
#diag-cart-panel{width:300px;flex-shrink:0;border-left:0.5px solid #E8E4DF;background:#FAFAF8;display:flex;flex-direction:column;overflow:hidden;}
.cart-header{padding:12px 16px;border-bottom:0.5px solid #E8E4DF;display:flex;align-items:center;justify-content:space-between;background:#FFF;flex-shrink:0;}
.cart-title{font-size:13px;font-weight:700;color:#111318;display:flex;align-items:center;gap:6px;}
.cart-close-btn{width:24px;height:24px;background:none;border:none;cursor:pointer;color:#9CA3AF;display:flex;align-items:center;justify-content:center;border-radius:4px;}
.cart-close-btn:hover{background:#F0EDE9;color:#3A3D4A;}
.cart-rows{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px;}
.cart-row{background:#FFF;border:0.5px solid #E8E4DF;border-radius:8px;padding:9px 10px;display:flex;align-items:center;gap:8px;}
.cart-row-info{flex:1;min-width:0;}
.cart-row-no{font-size:11px;font-weight:700;color:#7C6FF7;font-family:monospace;}
.cart-row-desc{font-size:11px;color:#5C6070;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cart-row-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.cart-qty-ctrl{display:flex;align-items:center;gap:2px;}
.cart-qty-ctrl button{width:20px;height:20px;background:#F0EDE9;border:none;border-radius:4px;cursor:pointer;font-size:13px;line-height:1;color:#3A3D4A;display:flex;align-items:center;justify-content:center;}
.cart-qty-ctrl span{font-size:12px;font-weight:600;color:#111318;width:20px;text-align:center;}
.cart-row-price{font-size:11px;font-weight:600;color:#111318;width:46px;text-align:right;}
.cart-row-del{width:22px;height:22px;background:none;border:none;cursor:pointer;color:#B0AAA3;display:flex;align-items:center;justify-content:center;border-radius:4px;}
.cart-row-del:hover{background:#FEE2E2;color:#B91C1C;}
.cart-footer{border-top:0.5px solid #E8E4DF;padding:12px;background:#FFF;flex-shrink:0;}
.cart-total{font-size:13px;color:#3A3D4A;margin-bottom:10px;}
.cart-actions{display:flex;flex-direction:column;gap:6px;}
.cart-action-btn{width:100%;padding:8px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid;display:flex;align-items:center;justify-content:center;gap:5px;}
.cart-action-secondary{background:#F5F2EE;color:#3A3D4A;border-color:#E2DDD8;}
.cart-action-secondary:hover{background:#EAE6E1;}
.cart-action-primary{background:#00843D;color:#0D2E18;border-color:#006830;}
.cart-action-primary:hover{background:#006830;}
/* Input */
.input-area{background:#FFF;border-top:0.5px solid #E8E4DF;padding:14px 24px;flex-shrink:0;}
.input-row{display:flex;align-items:flex-end;gap:10px;}
.input-wrap{flex:1;position:relative;}
.input-box{width:100%;min-height:44px;max-height:120px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:12px;padding:11px 16px;font-size:13px;font-family:inherit;color:#111318;outline:none;resize:none;line-height:1.5;box-sizing:border-box;}
.input-box:focus{border-color:#00843D;background:#FFF;}
.input-box::placeholder{color:#B0AAA3;}
.send-btn{width:44px;height:44px;background:#00843D;border:none;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;color:#0D2E18;flex-shrink:0;}
.send-btn:hover{background:#006830;}
.input-hints{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.hint-chip{background:#F5F2EE;border-radius:5px;padding:3px 9px;cursor:pointer;color:#7A7F8E;font-size:11px;}
.hint-chip:hover{background:#E6F4EC;color:#1B5E35;}
</style>
<h2 class="sr-only">Diagnostic assistant</h2>
<div class="shell">
  ${buildSidebar('diagnostics')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFF;font-weight:500;">Diagnostic assistant</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="diag-ctx-strip" id="diag-ctx-bar"></div>
    <div class="diag-layout">
      <div id="diag-sessions-panel"></div>
      <div class="diag-main">
        <div class="diag-toolbar">
          <button class="diag-clear-btn" id="diag-clear-btn"><i class="ti ti-trash" style="font-size:12px;"></i> Clear chat</button>
          <button class="diag-cart-btn" id="diag-cart-btn" onclick="diagToggleCart()" style="display:none;">
            <i class="ti ti-shopping-cart" style="font-size:13px;"></i>
            Cart <span class="cart-badge">0</span>
          </button>
          <span style="font-size:11px;color:#9CA3AF;margin-left:auto;">Skyjack SJIII 3219 · SmartEquip AI</span>
        </div>
        <div class="chat-area" id="diag-chat-area"></div>
        <div class="input-area">
          <div class="input-row">
            <div class="input-wrap">
              <textarea class="input-box" id="diag-chat-input" rows="1" placeholder="Describe a fault, enter a code (e.g. HYD-04), or ask about service intervals…"></textarea>
            </div>
            <button class="send-btn" id="diag-send-btn"><i class="ti ti-arrow-up"></i></button>
          </div>
          <div class="input-hints">
            <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='Fault code HYD-04 — platform won\\'t elevate';document.getElementById('diag-chat-input').focus();">HYD-04 — won't elevate</span>
            <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='Platform is drifting down slowly on its own';document.getElementById('diag-chat-input').focus();">Platform drift</span>
            <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='There is a hydraulic fluid leak near the cylinder';document.getElementById('diag-chat-input').focus();">Hydraulic leak</span>
            <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='Machine won\\'t drive, wheels not turning';document.getElementById('diag-chat-input').focus();">Won't drive</span>
            <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='What is the maintenance schedule?';document.getElementById('diag-chat-input').focus();">Maintenance intervals</span>
          </div>
        </div>
      </div>
      <div id="diag-cart-panel" style="display:none;"></div>
    </div>
  </div>
</div>`;

  renderContextBar();
  renderSessions();
  renderMessages();
  renderCartBadge();

  document.getElementById('diag-send-btn').addEventListener('click', sendMessage);
  document.getElementById('diag-chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById('diag-clear-btn').addEventListener('click', function() {
    Modal.confirm('Clear this chat?', function() {
      Store.clearDiagnosticHistory();
      renderMessages();
      renderSessions();
    });
  });
}
