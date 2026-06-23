function render_diagnostics(el) {
  el.innerHTML = `
<style>
.diag-layout { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.context-bar { background: #1E1E1E; padding: 10px 24px; border-bottom: 1px solid #2A2A2A; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ctx-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #8A8FA8; }
.ctx-item i { font-size: 13px; color: #5C6070; }
.ctx-item strong { color: #FFFFFF; font-weight: 600; }
.ctx-sep { color: #3C4052; }
.ctx-warranty { display: flex; align-items: center; gap: 5px; background: #0F3D22; border: 1px solid #1D6B3A; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 600; color: #5DCAA5; }
.chat-area { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.msg-user { display: flex; justify-content: flex-end; }
.msg-user-bubble { background: #1E1E1E; color: #FFFFFF; border-radius: 14px 14px 4px 14px; padding: 11px 16px; max-width: 60%; font-size: 14px; line-height: 1.5; }
.msg-ai { display: flex; gap: 12px; align-items: flex-start; }
.ai-avatar { width: 34px; height: 34px; background: #F5A623; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; color: #1A1200; flex-shrink: 0; margin-top: 2px; }
.ai-bubble { flex: 1; min-width: 0; }
.response-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.response-header { padding: 14px 16px 12px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.response-header-left { flex: 1; }
.response-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px; }
.response-title { font-size: 15px; font-weight: 700; color: #111318; letter-spacing: -0.2px; line-height: 1.3; }
.response-sub { font-size: 13px; color: #7A7F8E; margin-top: 4px; line-height: 1.5; }
.speak-btn { display: flex; align-items: center; gap: 6px; background: #F5F2EE; border: none; border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; flex-shrink: 0; white-space: nowrap; }
.speak-btn:hover { background: #FAEEDA; color: #854F0B; }
.speak-btn.speaking { background: #FAEEDA; color: #854F0B; }
@keyframes pulse-speak { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
.speak-btn.speaking i { animation: pulse-speak 1s ease-in-out infinite; }
.fault-meta { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #FAFAF8; border-bottom: 0.5px solid #F0ECE8; flex-wrap: wrap; }
.fault-code-badge { display: flex; align-items: center; gap: 5px; background: #FCEBEB; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #A32D2D; }
.confidence-wrap { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #7A7F8E; }
.confidence-bar { width: 80px; height: 6px; background: #F0ECE8; border-radius: 999px; overflow: hidden; }
.confidence-fill { height: 100%; background: #F5A623; border-radius: 999px; }
.severity-pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.sev-high { background: #FCEBEB; color: #A32D2D; }
.response-section { padding: 14px 16px; border-bottom: 0.5px solid #F0ECE8; }
.response-section:last-child { border-bottom: none; }
.rs-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.cause-list { display: flex; flex-direction: column; gap: 8px; }
.cause-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 0.5px solid #E8E4DF; background: #FAFAF8; }
.cause-rank { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.rank-1 { background: #F5A623; color: #1A1200; }
.rank-2 { background: #E8E4DF; color: #5A5F6E; }
.rank-3 { background: #E8E4DF; color: #5A5F6E; }
.cause-body { flex: 1; }
.cause-name { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 2px; }
.cause-detail { font-size: 12px; color: #7A7F8E; line-height: 1.5; }
.cause-prob { font-size: 11px; font-weight: 600; color: #854F0B; margin-top: 4px; }
.steps-list { display: flex; flex-direction: column; gap: 10px; }
.step-item { display: flex; gap: 12px; }
.step-num { width: 24px; height: 24px; background: #1E1E1E; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #FFFFFF; flex-shrink: 0; margin-top: 2px; }
.step-body { flex: 1; }
.step-title { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 3px; }
.step-detail { font-size: 12px; color: #5A5F6E; line-height: 1.6; }
.step-spec { display: inline-flex; align-items: center; gap: 5px; background: #F5F2EE; border-radius: 6px; padding: 3px 9px; font-size: 11px; font-weight: 600; color: #3A3D4A; margin-top: 5px; font-family: monospace; }
.step-doc-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #534AB7; font-weight: 500; cursor: pointer; margin-top: 5px; margin-left: 6px; }
.step-doc-link:hover { text-decoration: underline; }
.step-warning { display: flex; align-items: flex-start; gap: 6px; background: #FAEEDA; border-radius: 6px; padding: 7px 10px; margin-top: 7px; }
.step-warning i { font-size: 14px; color: #854F0B; flex-shrink: 0; margin-top: 1px; }
.step-warning-text { font-size: 12px; color: #854F0B; line-height: 1.5; }
.parts-inline { display: flex; flex-direction: column; gap: 8px; }
.part-inline-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: #FAFAF8; border: 0.5px solid #E8E4DF; border-radius: 9px; }
.part-inline-card.in-cart { background: #FFFBF2; border-color: #F5A623; }
.part-inline-icon { width: 34px; height: 34px; background: #F5F2EE; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #C8C3BC; flex-shrink: 0; }
.part-inline-info { flex: 1; min-width: 0; }
.part-inline-name { font-size: 13px; font-weight: 500; color: #111318; margin-bottom: 2px; }
.part-inline-num { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 5px; }
.part-inline-price { font-size: 13px; font-weight: 700; color: #111318; flex-shrink: 0; }
.in-cart-badge { background: #FAEEDA; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; color: #854F0B; white-space: nowrap; }
.add-cart-btn-sm { background: #F5A623; border: none; border-radius: 6px; padding: 5px 12px; font-size: 11px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.add-cart-btn-sm:hover { background: #E8980F; }
.docs-inline { display: flex; flex-direction: column; gap: 6px; }
.doc-inline-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #FAFAF8; border: 0.5px solid #E8E4DF; border-radius: 8px; cursor: pointer; }
.doc-inline-item:hover { border-color: #C8C3BC; background: #F5F2EE; }
.doc-inline-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.doc-icon-pdf { background: #FCEBEB; color: #A32D2D; }
.doc-icon-bulletin { background: #FAEEDA; color: #854F0B; }
.doc-icon-spec { background: #E1F5EE; color: #0F6E56; }
.doc-icon-diagram { background: #EEEDFE; color: #534AB7; }
.doc-inline-name { flex: 1; font-size: 12px; font-weight: 500; color: #111318; }
.doc-inline-meta { font-size: 11px; color: #9CA3AF; }
.doc-inline-open { font-size: 11px; color: #534AB7; font-weight: 500; display: flex; align-items: center; gap: 3px; white-space: nowrap; }
.response-warning { margin: 0 16px 14px; background: #EAF3DE; border-radius: 8px; padding: 10px 12px; display: flex; align-items: flex-start; gap: 8px; }
.response-warning i { font-size: 15px; color: #3B6D11; flex-shrink: 0; margin-top: 1px; }
.response-warning-text { font-size: 12px; color: #27500A; line-height: 1.5; }
.input-area { background: #FFFFFF; border-top: 0.5px solid #E8E4DF; padding: 14px 24px; }
.input-row { display: flex; align-items: flex-end; gap: 10px; }
.input-wrap { flex: 1; position: relative; }
.input-box { width: 100%; min-height: 44px; max-height: 120px; background: #F5F2EE; border: 1.5px solid #E2DDD8; border-radius: 12px; padding: 11px 50px 11px 16px; font-size: 14px; font-family: inherit; color: #111318; outline: none; resize: none; line-height: 1.5; transition: border-color 0.15s; }
.input-box:focus { border-color: #F5A623; background: #FFFFFF; box-shadow: 0 0 0 3px rgba(245,166,35,0.1); }
.input-box::placeholder { color: #B0AAA3; }
.voice-btn { position: absolute; right: 12px; bottom: 10px; width: 26px; height: 26px; border-radius: 50%; background: none; border: none; cursor: pointer; color: #9CA3AF; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.voice-btn:hover { color: #F5A623; }
.voice-btn.recording { color: #E24B4A; }
@keyframes recording-pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.2);} }
.voice-btn.recording i { animation: recording-pulse 1s ease-in-out infinite; }
.send-btn { width: 44px; height: 44px; background: #F5A623; border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #1A1200; flex-shrink: 0; }
.send-btn:hover { background: #E8980F; }
.input-hint { font-size: 11px; color: #B0AAA3; margin-top: 8px; display: flex; align-items: center; gap: 10px; }
.input-hint-chip { background: #F5F2EE; border-radius: 5px; padding: 2px 8px; cursor: pointer; color: #7A7F8E; }
.input-hint-chip:hover { background: #FAEEDA; color: #854F0B; }
</style>
<h2 class="sr-only">Diagnostic assistant — Skyjack SJIII 3219, WO #100094</h2>
<div class="shell">
  ${buildSidebar('diagnostics')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Diagnostic assistant</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="diag-layout">
      <div class="context-bar">
        <div class="ctx-item"><i class="ti ti-clipboard-list"></i> WO <strong>#100094</strong></div>
        <span class="ctx-sep">·</span>
        <div class="ctx-item"><i class="ti ti-crane"></i> <strong>Skyjack SJIII 3219</strong></div>
        <span class="ctx-sep">·</span>
        <div class="ctx-item"><i class="ti ti-tag"></i> Asset <strong>FL-094</strong> · Serial <strong>SJ3219-00847</strong></div>
        <span class="ctx-sep">·</span>
        <div class="ctx-warranty"><i class="ti ti-shield-check"></i> Under warranty · Sep 2027</div>
      </div>
      <div class="chat-area" id="diag-chat-area">
        <div class="msg-user"><div class="msg-user-bubble">Fault code HYD-04, pump is running but lift won't go up. No visible leaks.</div></div>
        <div class="msg-ai">
          <div class="ai-avatar"><i class="ti ti-sparkles"></i></div>
          <div class="ai-bubble">
            <div class="response-card">
              <div class="response-header">
                <div class="response-header-left">
                  <div class="response-label">Diagnostic result</div>
                  <div class="response-title">Low hydraulic pressure upstream of lift cylinder</div>
                  <div class="response-sub">HYD-04 on the SJIII 3219 indicates insufficient pressure reaching the lift cylinder. With the pump running and no external leaks, the most likely cause is an internal seal failure or a failed pressure relief valve.</div>
                </div>
                <button class="speak-btn" id="speak-btn" onclick="diagToggleSpeak()"><i class="ti ti-volume"></i> Read aloud</button>
              </div>
              <div class="fault-meta">
                <span class="fault-code-badge"><i class="ti ti-cpu" style="font-size:12px;"></i> HYD-04</span>
                <span class="severity-pill sev-high">High severity</span>
                <div class="confidence-wrap"><span>Confidence</span><div class="confidence-bar"><div class="confidence-fill" style="width:87%;"></div></div><span style="font-weight:600;color:#111318;">87%</span></div>
                <span style="font-size:11px;color:#9CA3AF;margin-left:auto;">Based on SJ3219-00847 · 3,412 hrs · symptoms described</span>
              </div>
              <div class="response-section">
                <div class="rs-label"><i class="ti ti-list-search"></i> Likely causes</div>
                <div class="cause-list">
                  <div class="cause-item"><div class="cause-rank rank-1">1</div><div class="cause-body"><div class="cause-name">Worn or failed lift cylinder internal seals</div><div class="cause-detail">At 3,412 hrs this unit is past the 3,000 hr seal replacement interval. Worn piston seals cause pressure bypass inside the cylinder.</div><div class="cause-prob">Most likely · ~65% of HYD-04 cases at this hour range</div></div></div>
                  <div class="cause-item"><div class="cause-rank rank-2">2</div><div class="cause-body"><div class="cause-name">Pressure relief valve stuck open or out of spec</div><div class="cause-detail">If the relief valve is opening prematurely, system pressure bleeds off before reaching the cylinder. Pressure test at Port A will confirm — spec is 2,500–2,800 PSI.</div><div class="cause-prob">Second most likely · ~25% of HYD-04 cases</div></div></div>
                  <div class="cause-item"><div class="cause-rank rank-3">3</div><div class="cause-body"><div class="cause-name">Control valve spool sticking or damaged</div><div class="cause-detail">Less likely given no other function losses, but a stuck directional control spool can prevent flow reaching the cylinder entirely.</div><div class="cause-prob">Less likely · ~10% of HYD-04 cases</div></div></div>
                </div>
              </div>
              <div class="response-section">
                <div class="rs-label"><i class="ti ti-list-numbers"></i> Diagnostic procedure</div>
                <div class="steps-list">
                  <div class="step-item"><div class="step-num">1</div><div class="step-body"><div class="step-title">Check hydraulic fluid level and condition</div><div class="step-detail">Verify fluid is at the correct level and not contaminated. Reservoir is at the rear of the base frame.</div><div><span class="step-spec">Fluid spec: ISO 46 hydraulic oil · capacity 7.5L</span></div></div></div>
                  <div class="step-item"><div class="step-num">2</div><div class="step-body"><div class="step-title">Pressure test at Port A (lift cylinder inlet)</div><div class="step-detail">Install a 0–5,000 PSI gauge at the Port A test port. Activate lift function and read pressure while pump is running.</div><div><span class="step-spec">Normal: 2,500–2,800 PSI</span><span class="step-spec" style="margin-left:6px;">Low (&lt;2,000): seal or relief valve fault</span></div><span class="step-doc-link" onclick="sendPrompt('Open manuals and docs')"><i class="ti ti-file-text" style="font-size:11px;"></i> Service Manual §7.4</span></div></div>
                  <div class="step-item"><div class="step-num">3</div><div class="step-body"><div class="step-title">Isolate: bypass relief valve temporarily</div><div class="step-detail">If pressure is low, temporarily increase the relief valve setting to determine if it is opening prematurely.</div><div class="step-warning"><i class="ti ti-alert-triangle"></i><div class="step-warning-text">Do not exceed 3,200 PSI when testing. Per SB-2847, this unit requires updated procedure for serial range SJ3219-00800 to SJ3219-01200.</div></div></div></div>
                  <div class="step-item"><div class="step-num">4</div><div class="step-body"><div class="step-title">Replace cylinder seals per SB-2847 procedure</div><div class="step-detail">Follow the revised procedure in SB-2847 — not the original service manual procedure, which has been superseded for this serial range.</div><div><span class="step-spec">Rod end torque: 185 Nm (136 ft·lb)</span></div></div></div>
                  <div class="step-item"><div class="step-num">5</div><div class="step-body"><div class="step-title">Bleed system and retest</div><div class="step-detail">Bleed the hydraulic system, refill to correct level, and run full lift cycle test. Clear HYD-04 and confirm no recurrence over 3 full cycles.</div></div></div>
                </div>
              </div>
              <div class="response-section">
                <div class="rs-label"><i class="ti ti-package"></i> Parts for this repair</div>
                <div class="parts-inline">
                  <div class="part-inline-card in-cart"><div class="part-inline-icon"><i class="ti ti-circle-dashed"></i></div><div class="part-inline-info"><div class="part-inline-name">Hydraulic lift cylinder seal kit</div><div class="part-inline-num">SKJ-103100 <span class="oem-badge">OEM</span></div></div><div style="font-size:11px;color:#3B6D11;flex-shrink:0;">In stock</div><div class="part-inline-price">$84.00</div><span class="in-cart-badge">In cart</span></div>
                  <div class="part-inline-card in-cart"><div class="part-inline-icon"><i class="ti ti-adjustments"></i></div><div class="part-inline-info"><div class="part-inline-name">Pressure relief valve</div><div class="part-inline-num">SKJ-103278 <span class="oem-badge">OEM</span></div></div><div style="font-size:11px;color:#3B6D11;flex-shrink:0;">In stock</div><div class="part-inline-price">$126.00</div><span class="in-cart-badge">In cart</span></div>
                  <div class="part-inline-card" id="diag-bleed-card"><div class="part-inline-icon"><i class="ti ti-circle-dashed"></i></div><div class="part-inline-info"><div class="part-inline-name">Hydraulic bleed screw kit</div><div class="part-inline-num">SKJ-103601 <span class="oem-badge">OEM</span></div></div><div style="font-size:11px;color:#3B6D11;flex-shrink:0;">In stock</div><div class="part-inline-price">$12.00</div><button class="add-cart-btn-sm" onclick="diagAddToCart(this,'diag-bleed-card')"><i class="ti ti-shopping-cart" style="font-size:11px;"></i> Add to cart</button></div>
                  <div class="part-inline-card" id="diag-fluid-card"><div class="part-inline-icon"><i class="ti ti-droplet"></i></div><div class="part-inline-info"><div class="part-inline-name">Hydraulic fluid — ISO 46 · 1 gal</div><div class="part-inline-num">SKJ-HF046-1G <span class="oem-badge">OEM</span></div></div><div style="font-size:11px;color:#3B6D11;flex-shrink:0;">Local stock</div><div class="part-inline-price">$28.00</div><button class="add-cart-btn-sm" onclick="diagAddToCart(this,'diag-fluid-card')"><i class="ti ti-shopping-cart" style="font-size:11px;"></i> Add to cart</button></div>
                </div>
              </div>
              <div class="response-section">
                <div class="rs-label"><i class="ti ti-books"></i> Related documents</div>
                <div class="docs-inline">
                  <div class="doc-inline-item" onclick="sendPrompt('Open manuals and docs')"><div class="doc-inline-icon doc-icon-bulletin"><i class="ti ti-alert-circle"></i></div><div class="doc-inline-name">Service Bulletin SB-2847 — Revised lift cylinder seal procedure</div><div class="doc-inline-meta">Applies to SJ3219-00847</div><div class="doc-inline-open"><i class="ti ti-arrow-right" style="font-size:11px;"></i> Open</div></div>
                  <div class="doc-inline-item" onclick="sendPrompt('Open manuals and docs')"><div class="doc-inline-icon doc-icon-spec"><i class="ti ti-ruler"></i></div><div class="doc-inline-name">Torque spec sheet — hydraulic cylinder rod assembly</div><div class="doc-inline-meta">Skyjack · Rev. 2</div><div class="doc-inline-open"><i class="ti ti-arrow-right" style="font-size:11px;"></i> Open</div></div>
                  <div class="doc-inline-item" onclick="sendPrompt('Open Parts Search scoped to WO #100094, Skyjack SJIII 3219 — diagram view, hydraulic lift cylinder')"><div class="doc-inline-icon doc-icon-diagram"><i class="ti ti-schema"></i></div><div class="doc-inline-name">Hydraulic system diagram — lift cylinder (interactive)</div><div class="doc-inline-meta">Serial-specific · SJ3219-00847</div><div class="doc-inline-open"><i class="ti ti-arrow-right" style="font-size:11px;"></i> Open</div></div>
                </div>
              </div>
              <div class="response-warning"><i class="ti ti-shield-check"></i><div class="response-warning-text"><strong>This machine is under warranty until Sep 14, 2027.</strong> Use OEM parts only and follow SB-2847 revised procedure.</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <div class="input-row">
          <div class="input-wrap">
            <textarea class="input-box" id="diag-chat-input" rows="1" placeholder="Describe a fault, enter a code, or ask a question…"></textarea>
            <button class="voice-btn" id="diag-voice-btn" onclick="diagToggleVoice()" title="Voice input"><i class="ti ti-microphone"></i></button>
          </div>
          <button class="send-btn" title="Send"><i class="ti ti-arrow-up"></i></button>
        </div>
        <div class="input-hint">Try: <span class="input-hint-chip" onclick="document.getElementById('diag-chat-input').value='What is the torque spec for the cylinder rod end?'">torque spec cylinder rod</span> <span class="input-hint-chip" onclick="document.getElementById('diag-chat-input').value='How do I bleed the hydraulic system on this unit?'">how to bleed hydraulic system</span></div>
      </div>
    </div>
  </div>
</div>`;

  let isSpeaking = false, isRecording = false;
  window.diagToggleSpeak = function() {
    const btn = document.getElementById('speak-btn');
    isSpeaking = !isSpeaking;
    if (isSpeaking) { btn.classList.add('speaking'); btn.innerHTML = '<i class="ti ti-volume"></i> Speaking…'; setTimeout(() => { isSpeaking = false; btn.classList.remove('speaking'); btn.innerHTML = '<i class="ti ti-volume"></i> Read aloud'; }, 4000); }
  };
  window.diagToggleVoice = function() {
    const btn = document.getElementById('diag-voice-btn');
    const input = document.getElementById('diag-chat-input');
    isRecording = !isRecording;
    if (isRecording) { btn.classList.add('recording'); input.placeholder = 'Listening…'; setTimeout(() => { isRecording = false; btn.classList.remove('recording'); input.placeholder = 'Describe a fault, enter a code, or ask a question…'; input.value = "The scissor lift won't go up, pump sounds like it's running but nothing moves"; }, 2500); }
    else { btn.classList.remove('recording'); input.placeholder = 'Describe a fault, enter a code, or ask a question…'; }
  };
  window.diagAddToCart = function(btn, cardId) { const card = document.getElementById(cardId); card.classList.add('in-cart'); btn.outerHTML = '<span class="in-cart-badge">In cart</span>'; };
}