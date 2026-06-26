function render_diagnostics(el) {
  const CANNED_RESPONSES = [
    { role: 'ai', text: 'Based on the Skyjack SJIII 3219 fault code HYD-04, the most likely causes are: (1) worn internal cylinder seals at 3,412 hrs — past the 3,000 hr interval, (2) pressure relief valve stuck open, or (3) control valve spool sticking. Start with a pressure test at Port A. Normal range is 2,500–2,800 PSI. Refer to Service Bulletin SB-2847 for the revised seal replacement procedure that applies to serial SJ3219-00847.' },
    { role: 'ai', text: 'For the Cat 320 Excavator track tension issue on FL-017: right-side track tension should be measured at the idler using a tape measure. Spec is 300–320mm sag midspan. If out of spec, adjust via the grease fitting on the recoil cylinder — add grease to tighten, release valve to loosen. Do not exceed 3 pumps without re-measuring. Torque on track bolts: 560 Nm (413 ft·lb).' },
    { role: 'ai', text: 'Mast chain elongation on the Toyota 8FGU25 (FL-031): measure chain pitch using a pitch gauge or 300mm rule — compare 12 links against the wear limit table in Service Manual Section 6.3. Typical wear limit is 3% elongation. If exceeded, replace both chains as a set — part number TOY-MCH-114. Also inspect chain anchors and sheaves during this service.' },
    { role: 'ai', text: 'Bobcat S650 quick coupler leak (FL-008): disconnect and inspect the coupler O-ring and backup ring — part BOB-QC-520 seal kit covers both. Confirm the coupler is fully locked before pressurizing. Leak at the face seal indicates O-ring failure; leak at the body indicates cracked housing. Torque on coupler lock pin: 68 Nm.' },
    { role: 'ai', text: 'Parts availability for your current WOs: SKJ-103100 (hydraulic lift cylinder seal kit) and SKJ-103278 (pressure relief valve) are in stock and en route for WO #100094. SKJ-107732 (pump seal kit) is backordered with ETA Jun 26. For Cat 320 track work, CAT-TRK-7201 (track adjuster grease cylinder) is in stock.' },
  ];

  let _responseIndex = 0;

  function escHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderMessages() {
    const area = document.getElementById('diag-chat-area');
    if (!area) return;
    const history = Store.getDiagnosticHistory();
    if (!history.length) {
      area.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="width:48px;height:48px;background:#FAEEDA;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#854F0B;margin:0 auto 14px;"><i class="ti ti-sparkles"></i></div><div style="font-size:14px;font-weight:600;color:#111318;margin-bottom:6px;">SmartEquip Diagnostic Assistant</div><div style="font-size:13px;color:#9CA3AF;max-width:320px;margin:0 auto;">Describe a fault, enter a fault code, or ask about any machine in your fleet. I know your active WOs and fleet data.</div></div>';
      return;
    }
    area.innerHTML = history.map(msg => {
      if (msg.role === 'user') {
        return '<div class="msg-user"><div class="msg-user-bubble">' + escHtml(msg.text) + '</div></div>';
      }
      return '<div class="msg-ai"><div class="ai-avatar"><i class="ti ti-sparkles"></i></div><div class="ai-bubble"><div class="response-card"><div class="response-header"><div class="response-label">SmartEquip AI</div><div class="response-sub">' + escHtml(msg.text) + '</div></div></div></div></div>';
    }).join('');
    area.scrollTop = area.scrollHeight;
  }

  function sendMessage() {
    const inp = document.getElementById('diag-chat-input');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    Store.addDiagnosticMessage({ role: 'user', text });
    inp.value = '';
    renderMessages();
    setTimeout(function() {
      const resp = CANNED_RESPONSES[_responseIndex % CANNED_RESPONSES.length];
      _responseIndex++;
      Store.addDiagnosticMessage({ role: 'ai', text: resp.text });
      renderMessages();
    }, 600);
  }

  el.innerHTML = '<style>.diag-layout{flex:1;display:flex;flex-direction:column;min-height:0;}.context-bar{background:#1E1E1E;padding:10px 24px;border-bottom:1px solid #2A2A2A;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}.ctx-item{display:flex;align-items:center;gap:5px;font-size:12px;color:#8A8FA8;}.ctx-item strong{color:#FFFFFF;font-weight:600;}.ctx-sep{color:#3C4052;}.ctx-warranty{display:flex;align-items:center;gap:5px;background:#0F3D22;border:1px solid #1D6B3A;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:600;color:#5DCAA5;}.chat-area{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:20px;}.msg-user{display:flex;justify-content:flex-end;}.msg-user-bubble{background:#1E1E1E;color:#FFFFFF;border-radius:14px 14px 4px 14px;padding:11px 16px;max-width:60%;font-size:14px;line-height:1.5;}.msg-ai{display:flex;gap:12px;align-items:flex-start;}.ai-avatar{width:34px;height:34px;background:#F5A623;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;color:#1A1200;flex-shrink:0;margin-top:2px;}.ai-bubble{flex:1;min-width:0;}.response-card{background:#FFFFFF;border:0.5px solid #E8E4DF;border-radius:12px;overflow:hidden;}.response-header{padding:14px 16px 12px;}.response-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:6px;}.response-sub{font-size:13px;color:#3A3D4A;line-height:1.65;}.input-area{background:#FFFFFF;border-top:0.5px solid #E8E4DF;padding:14px 24px;flex-shrink:0;}.input-row{display:flex;align-items:flex-end;gap:10px;}.input-wrap{flex:1;position:relative;}.input-box{width:100%;min-height:44px;max-height:120px;background:#F5F2EE;border:1.5px solid #E2DDD8;border-radius:12px;padding:11px 16px;font-size:14px;font-family:inherit;color:#111318;outline:none;resize:none;line-height:1.5;}.input-box:focus{border-color:#F5A623;background:#FFFFFF;}.input-box::placeholder{color:#B0AAA3;}.send-btn{width:44px;height:44px;background:#F5A623;border:none;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;color:#1A1200;flex-shrink:0;}.send-btn:hover{background:#E8980F;}.input-hint{font-size:11px;color:#B0AAA3;margin-top:8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}.input-hint-chip{background:#F5F2EE;border-radius:5px;padding:2px 8px;cursor:pointer;color:#7A7F8E;}.input-hint-chip:hover{background:#FAEEDA;color:#854F0B;}.diag-toolbar{background:#FAFAF8;border-bottom:0.5px solid #E8E4DF;padding:8px 24px;display:flex;align-items:center;gap:8px;}.diag-clear-btn{font-size:12px;font-weight:500;color:#7A7F8E;background:none;border:0.5px solid #E2DDD8;border-radius:6px;padding:4px 10px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;}.diag-clear-btn:hover{background:#F5F2EE;color:#3A3D4A;}</style><h2 class="sr-only">Diagnostic assistant</h2><div class="shell">' + buildSidebar('diagnostics') + '<div class="main"><div class="topbar"><div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;"><a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt(\'dashboard\')">Dashboard</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Diagnostic assistant</span></div><div class="topbar-right"><button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button><button class="topbar-icon-btn"><i class="ti ti-settings"></i></button></div></div><div class="diag-layout"><div class="context-bar"><div class="ctx-item"><i class="ti ti-clipboard-list"></i> Active WOs: <strong>' + Store.getWorkOrders('active').length + '</strong></div><span class="ctx-sep">·</span><div class="ctx-item"><i class="ti ti-crane"></i> <strong>Skyjack SJIII 3219</strong></div><span class="ctx-sep">·</span><div class="ctx-item"><i class="ti ti-backhoe"></i> <strong>Cat 320 Excavator</strong></div><span class="ctx-sep">·</span><div class="ctx-warranty"><i class="ti ti-shield-check"></i> FL-094 under warranty</div></div><div class="diag-toolbar"><button class="diag-clear-btn" id="diag-clear-btn"><i class="ti ti-trash" style="font-size:13px;"></i> Clear history</button><span style="font-size:12px;color:#9CA3AF;margin-left:auto;">Powered by SmartEquip AI</span></div><div class="chat-area" id="diag-chat-area"></div><div class="input-area"><div class="input-row"><div class="input-wrap"><textarea class="input-box" id="diag-chat-input" rows="1" placeholder="Describe a fault, enter a code, or ask a question…"></textarea></div><button class="send-btn" id="diag-send-btn" title="Send"><i class="ti ti-arrow-up"></i></button></div><div class="input-hint">Try: <span class="input-hint-chip" onclick="document.getElementById(\'diag-chat-input\').value=\'Fault code HYD-04 Skyjack won\\\'t elevate\'">HYD-04 Skyjack fault</span> <span class="input-hint-chip" onclick="document.getElementById(\'diag-chat-input\').value=\'Cat 320 track tension adjustment\'">Cat 320 track tension</span> <span class="input-hint-chip" onclick="document.getElementById(\'diag-chat-input\').value=\'What parts for Bobcat quick coupler leak?\'">Bobcat coupler parts</span></div></div></div></div></div>';

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
