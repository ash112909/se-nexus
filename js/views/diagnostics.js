function render_diagnostics(el) {
  const CANNED_RESPONSES = [
    { role: 'ai', text: 'Based on the Skyjack SJIII 3219 fault code HYD-04, the most likely causes are: (1) worn internal cylinder seals at 3,412 hrs — past the 3,000 hr interval, (2) pressure relief valve stuck open, or (3) control valve spool sticking. Start with a pressure test at Port A. Normal range is 2,500–2,800 PSI. Refer to Service Bulletin SB-2847 for the revised seal replacement procedure that applies to serial SJ3219-00847.' },
    { role: 'ai', text: 'For the Cat 320 Excavator track tension issue on FL-017: right-side track tension should be measured at the idler using a tape measure. Spec is 300–320mm sag midspan. If out of spec, adjust via the grease fitting on the recoil cylinder — add grease to tighten, release valve to loosen. Do not exceed 3 pumps without re-measuring. Torque on track bolts: 560 Nm (413 ft·lb).' },
    { role: 'ai', text: 'Mast chain elongation on the Toyota 8FGU25 (FL-031): measure chain pitch using a pitch gauge or 300mm rule — compare 12 links against the wear limit table in Service Manual Section 6.3. Typical wear limit is 3% elongation. If exceeded, replace both chains as a set — part number TOY-MCH-114. Also inspect chain anchors and sheaves during this service.' },
    { role: 'ai', text: 'Bobcat S650 quick coupler leak (FL-008): disconnect and inspect the coupler O-ring and backup ring — part BOB-QC-520 seal kit covers both. Confirm the coupler is fully locked before pressurizing. Leak at the face seal indicates O-ring failure; leak at the body indicates cracked housing. Torque on coupler lock pin: 68 Nm.' },
    { role: 'ai', text: 'Parts availability for your current WOs: SKJ-103100 (hydraulic lift cylinder seal kit) and SKJ-103278 (pressure relief valve) are in stock and en route for WO #100094. SKJ-107732 (pump seal kit) is backordered with ETA Jun 26. For Cat 320 track work, CAT-TRK-7201 (track adjuster grease cylinder) is in stock.' },
  ];

  let _responseIndex = 0;

  // Context types: { type: 'none' } | { type: 'wo', woId } | { type: 'parts', query? }
  let _ctx = Router.context && Router.context.woId
    ? { type: 'wo', woId: Router.context.woId }
    : { type: 'none' };

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
    if (ctx.type === 'wo') return '#F5A623';
    if (ctx.type === 'parts') return '#7C6FF7';
    return '#8A8FA8';
  }

  function escHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
    } else if (_ctx.type === 'parts' && _ctx.query) {
      detail = `<span class="ctx-detail">${escHtml(_ctx.query)}</span>`;
    }

    bar.innerHTML = `
      <div class="ctx-active" style="border-color:${color}20;background:${color}10;">
        <i class="ti ${icon}" style="color:${color};font-size:13px;flex-shrink:0;"></i>
        <span class="ctx-active-label" style="color:${color};">${label}</span>
        ${detail}
        <button class="ctx-switch-btn" onclick="diagSwitchContext()">Switch context <i class="ti ti-selector" style="font-size:10px;"></i></button>
      </div>
      ${_ctx.type !== 'none' ? `<button class="ctx-clear-btn" onclick="diagClearContext()" title="Remove context"><i class="ti ti-x" style="font-size:11px;"></i></button>` : ''}
    `;
  }

  function renderMessages() {
    const area = document.getElementById('diag-chat-area');
    if (!area) return;
    const history = Store.getDiagnosticHistory();
    if (!history.length) {
      area.innerHTML = `<div style="text-align:center;padding:48px 20px;">
        <div style="width:48px;height:48px;background:#FAEEDA;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#854F0B;margin:0 auto 14px;"><i class="ti ti-sparkles"></i></div>
        <div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:6px;">Diagnostic Assistant</div>
        <div style="font-size:13px;color:#9CA3AF;max-width:300px;margin:0 auto;line-height:1.6;">Ask about a fault code, a machine, a work order, or search for parts. Set a context above to focus the conversation.</div>
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
      return `<div class="msg-ai">
        <div class="ai-avatar"><i class="ti ti-sparkles"></i></div>
        <div class="ai-bubble">
          <div class="response-card">
            <div class="response-header">
              <div class="response-label">SmartEquip AI</div>
              <div class="response-sub">${escHtml(msg.text)}</div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
    area.scrollTop = area.scrollHeight;
  }

  function sendMessage() {
    const inp = document.getElementById('diag-chat-input');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    Store.addDiagnosticMessage({ role: 'user', text, ctx: Object.assign({}, _ctx) });
    inp.value = '';
    renderMessages();
    setTimeout(function() {
      const resp = CANNED_RESPONSES[_responseIndex % CANNED_RESPONSES.length];
      _responseIndex++;
      Store.addDiagnosticMessage({ role: 'ai', text: resp.text });
      renderMessages();
    }, 600);
  }

  // ── Context switcher modal ────────────────────────────────────────────────
  window.diagSwitchContext = function() {
    const wos = Store.getWorkOrders('active');
    const woOptions = wos.map(w =>
      `<div class="ctx-option ${_ctx.type==='wo' && _ctx.woId===w.id ? 'selected' : ''}" onclick="diagSetCtx('wo',${w.id})">
        <i class="ti ti-clipboard-list" style="color:#F5A623;font-size:14px;flex-shrink:0;"></i>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:600;color:#111318;">WO #${w.id} — ${w.machine}</div>
          <div style="font-size:11px;color:#9CA3AF;">${w.asset} · ${w.status}</div>
        </div>
        ${_ctx.type==='wo' && _ctx.woId===w.id ? '<i class="ti ti-check" style="color:#F5A623;font-size:13px;"></i>' : ''}
      </div>`
    ).join('');

    Modal.show({
      title: 'Switch context',
      wide: false,
      body: `<div style="display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin-bottom:2px;">No context</div>
        <div class="ctx-option ${_ctx.type==='none' ? 'selected' : ''}" onclick="diagSetCtx('none')">
          <i class="ti ti-message-circle" style="color:#8A8FA8;font-size:14px;flex-shrink:0;"></i>
          <div style="flex:1;"><div style="font-size:12px;font-weight:600;color:#111318;">General question</div><div style="font-size:11px;color:#9CA3AF;">No machine or WO attached</div></div>
          ${_ctx.type==='none' ? '<i class="ti ti-check" style="color:#8A8FA8;font-size:13px;"></i>' : ''}
        </div>

        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin:10px 0 2px;">Work Orders</div>
        ${woOptions || '<div style="font-size:12px;color:#9CA3AF;padding:6px 0;">No active work orders.</div>'}

        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin:10px 0 2px;">Parts search</div>
        <div class="ctx-option ${_ctx.type==='parts' ? 'selected' : ''}" onclick="diagSetCtx('parts')">
          <i class="ti ti-search" style="color:#7C6FF7;font-size:14px;flex-shrink:0;"></i>
          <div style="flex:1;"><div style="font-size:12px;font-weight:600;color:#111318;">Parts search</div><div style="font-size:11px;color:#9CA3AF;">Ask about parts, availability, or diagrams</div></div>
          ${_ctx.type==='parts' ? '<i class="ti ti-check" style="color:#7C6FF7;font-size:13px;"></i>' : ''}
        </div>
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
    else if (type === 'parts') _ctx = { type: 'parts' };
    const next = ctxLabel(_ctx);
    Modal.close();
    if (prev !== next) {
      Store.addDiagnosticMessage({ role: 'system', text: `Context switched to: ${next}` });
    }
    renderContextBar();
    renderMessages();
    document.getElementById('diag-chat-input')?.focus();
  };

  window.diagClearContext = function() {
    _ctx = { type: 'none' };
    Store.addDiagnosticMessage({ role: 'system', text: 'Context cleared — asking general questions.' });
    renderContextBar();
    renderMessages();
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  el.innerHTML = `<style>
.diag-layout{flex:1;display:flex;flex-direction:column;min-height:0;}
/* Context bar */
.diag-ctx-strip{background:#1A1A1A;padding:9px 22px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #252525;flex-shrink:0;}
.ctx-active{display:flex;align-items:center;gap:7px;padding:5px 12px;border-radius:8px;border:1px solid;flex:1;}
.ctx-active-label{font-size:12px;font-weight:600;flex:1;}
.ctx-detail{font-size:11px;color:#8A8FA8;padding-left:6px;border-left:1px solid #3C4052;margin-left:2px;}
.ctx-switch-btn{margin-left:auto;background:none;border:0.5px solid #3C4052;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:500;color:#8A8FA8;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;white-space:nowrap;}
.ctx-switch-btn:hover{border-color:#6C7082;color:#FFFFFF;}
.ctx-clear-btn{width:26px;height:26px;background:none;border:0.5px solid #3C4052;border-radius:6px;color:#8A8FA8;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ctx-clear-btn:hover{border-color:#6C7082;color:#FFFFFF;}
/* Toolbar */
.diag-toolbar{background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;padding:7px 22px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
.diag-clear-btn{font-size:11px;font-weight:500;color:#7A7F8E;background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:3px 9px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;}
.diag-clear-btn:hover{background:#F5F2EE;color:#3A3D4A;}
/* Chat */
.chat-area{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:16px;}
.msg-system{display:flex;align-items:center;gap:5px;font-size:11px;color:#9CA3AF;text-align:center;justify-content:center;padding:2px 0;}
.msg-user{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
.msg-ctx-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 7px;border-radius:5px;border:1px solid;}
.msg-user-bubble{background:#1E1E1E;color:#FFFFFF;border-radius:14px 14px 4px 14px;padding:11px 16px;max-width:60%;font-size:13px;line-height:1.5;}
.msg-ai{display:flex;gap:12px;align-items:flex-start;}
.ai-avatar{width:32px;height:32px;background:#F5A623;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#1A1200;flex-shrink:0;margin-top:2px;}
.ai-bubble{flex:1;min-width:0;}
.response-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;overflow:hidden;}
.response-header{padding:12px 16px;}
.response-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:5px;}
.response-sub{font-size:13px;color:#3A3D4A;line-height:1.65;}
/* Input */
.input-area{background:#FFFFFF;border-top:0.5px solid #E8E4DF;padding:14px 24px;flex-shrink:0;}
.input-row{display:flex;align-items:flex-end;gap:10px;}
.input-wrap{flex:1;position:relative;}
.input-box{width:100%;min-height:44px;max-height:120px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:12px;padding:11px 16px;font-size:13px;font-family:inherit;color:#111318;outline:none;resize:none;line-height:1.5;}
.input-box:focus{border-color:#F5A623;background:#FFFFFF;}
.input-box::placeholder{color:#B0AAA3;}
.send-btn{width:44px;height:44px;background:#F5A623;border:none;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;color:#1A1200;flex-shrink:0;}
.send-btn:hover{background:#E8980F;}
.input-hints{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.hint-chip{background:#F5F2EE;border-radius:5px;padding:3px 9px;cursor:pointer;color:#7A7F8E;font-size:11px;}
.hint-chip:hover{background:#FAEEDA;color:#854F0B;}
</style>
<h2 class="sr-only">Diagnostic assistant</h2>
<div class="shell">
  ${buildSidebar('diagnostics')}
  <div class="main" style="display:flex;flex-direction:column;overflow:hidden;">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Diagnostic assistant</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="diag-layout">
      <div class="diag-ctx-strip" id="diag-ctx-bar"></div>
      <div class="diag-toolbar">
        <button class="diag-clear-btn" id="diag-clear-btn"><i class="ti ti-trash" style="font-size:12px;"></i> Clear history</button>
        <span style="font-size:11px;color:#9CA3AF;margin-left:auto;">Powered by SmartEquip AI</span>
      </div>
      <div class="chat-area" id="diag-chat-area"></div>
      <div class="input-area">
        <div class="input-row">
          <div class="input-wrap">
            <textarea class="input-box" id="diag-chat-input" rows="1" placeholder="Ask a question, describe a fault, or enter a code…"></textarea>
          </div>
          <button class="send-btn" id="diag-send-btn"><i class="ti ti-arrow-up"></i></button>
        </div>
        <div class="input-hints">
          <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='Fault code HYD-04 on Skyjack — won\\'t elevate'">HYD-04 fault</span>
          <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='Cat 320 track tension spec'">Cat 320 track tension</span>
          <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='What parts for a Bobcat quick coupler leak?'">Bobcat coupler parts</span>
          <span class="hint-chip" onclick="document.getElementById('diag-chat-input').value='What is the service interval for the Toyota mast chain?'">Toyota mast chain interval</span>
        </div>
      </div>
    </div>
  </div>
</div>`;

  renderContextBar();
  renderMessages();

  document.getElementById('diag-send-btn').addEventListener('click', sendMessage);
  document.getElementById('diag-chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById('diag-clear-btn').addEventListener('click', function() {
    Modal.confirm('Clear all diagnostic history?', function() {
      Store.clearDiagnosticHistory();
      _responseIndex = 0;
      renderMessages();
    });
  });
}
