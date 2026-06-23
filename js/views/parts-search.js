function render_parts_search(el) {
  el.innerHTML = `
<style>
.wo-context-ribbon { background: #1E1E1E; padding: 10px 24px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #2A2A2A; flex-wrap: wrap; }
.ribbon-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8A8FA8; }
.ribbon-item strong { color: #FFFFFF; font-weight: 600; }
.ribbon-sep { color: #3C4052; }
.ribbon-warranty { display: flex; align-items: center; gap: 5px; background: #0F3D22; border: 1px solid #1D6B3A; border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 600; color: #5DCAA5; }
.ribbon-pill { background: #FAEEDA; color: #854F0B; font-size: 11px; font-weight: 600; border-radius: 999px; padding: 2px 9px; }
.content-row { display: flex; flex: 1; min-height: 0; }
.tree-panel { width: 210px; min-width: 210px; background: #FFFFFF; border-right: 0.5px solid #E8E4DF; display: flex; flex-direction: column; }
.tree-search { padding: 12px; border-bottom: 0.5px solid #F0ECE8; }
.tree-search-wrap { position: relative; }
.tree-search-input { width: 100%; height: 32px; background: #F5F2EE; border: 1px solid #E2DDD8; border-radius: 7px; padding: 0 10px 0 32px; font-size: 13px; font-family: inherit; color: #111318; outline: none; }
.tree-search-input::placeholder { color: #B0AAA3; }
.tree-search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #B0AAA3; font-size: 14px; pointer-events: none; }
.tree-body { flex: 1; overflow-y: auto; padding: 8px 0; }
.tree-section-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #B0AAA3; padding: 8px 12px 4px; }
.tree-node { display: flex; align-items: center; cursor: pointer; padding: 6px 12px; font-size: 13px; color: #3A3D4A; user-select: none; }
.tree-node:hover { background: #F5F2EE; }
.tree-node.active { background: #FAEEDA; color: #854F0B; font-weight: 500; }
.tree-indent { display: inline-block; width: 14px; flex-shrink: 0; }
.tree-toggle { width: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #B0AAA3; font-size: 11px; }
.tree-node-icon { font-size: 14px; color: #B0AAA3; flex-shrink: 0; margin-right: 6px; }
.tree-node-label { flex: 1; line-height: 1.3; font-size: 12px; }
.tree-node-count { font-size: 10px; color: #B0AAA3; margin-left: auto; }
.ctx-badges { padding: 8px 12px; display: flex; flex-direction: column; gap: 5px; }
.ctx-badge { border-radius: 7px; padding: 6px 10px; display: flex; align-items: center; gap: 7px; }
.ctx-badge-purple { background: #EEEDFE; }
.ctx-badge-green { background: #E1F5EE; }
.ctx-badge i { font-size: 13px; flex-shrink: 0; }
.ctx-badge-purple i { color: #534AB7; }
.ctx-badge-green i { color: #0F6E56; }
.ctx-badge-label { font-size: 10px; font-weight: 600; }
.ctx-badge-purple .ctx-badge-label { color: #534AB7; }
.ctx-badge-green .ctx-badge-label { color: #0F6E56; }
.ctx-badge-val { font-size: 10px; }
.ctx-badge-purple .ctx-badge-val { color: #7F77DD; }
.ctx-badge-green .ctx-badge-val { color: #1D9E75; }
.main-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.catalog-breadcrumb { padding: 9px 20px; background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 5px; }
.cb-item { font-size: 12px; color: #9CA3AF; cursor: pointer; }
.cb-item:hover { color: #F5A623; }
.cb-item.active-node { color: #111318; font-weight: 500; cursor: default; }
.cb-sep { font-size: 12px; color: #D1CBC4; }
.view-toolbar { padding: 9px 20px; background: #FFFFFF; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 10px; }
.view-title { font-size: 14px; font-weight: 700; color: #111318; flex: 1; letter-spacing: -0.2px; }
.view-toggle { display: flex; background: #F5F2EE; border-radius: 7px; padding: 3px; gap: 2px; }
.vtoggle-btn { padding: 5px 12px; border-radius: 5px; border: none; background: none; font-size: 12px; font-weight: 500; color: #7A7F8E; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; }
.vtoggle-btn.active { background: #FFFFFF; color: #111318; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
.btn-ghost-sm { background: none; border: 0.5px solid #E2DDD8; border-radius: 7px; padding: 5px 11px; font-size: 12px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; }
.btn-ghost-sm:hover { background: #F5F2EE; }
.diagram-tools { padding: 8px 20px; background: #FAFAF8; border-bottom: 0.5px solid #E8E4DF; display: flex; align-items: center; gap: 8px; }
.tool-btn { width: 30px; height: 30px; background: #FFFFFF; border: 0.5px solid #E2DDD8; border-radius: 7px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; color: #5A5F6E; }
.tool-btn:hover { background: #F5F2EE; }
.zoom-display { font-size: 12px; color: #7A7F8E; padding: 0 6px; min-width: 40px; text-align: center; }
.tool-sep { width: 0.5px; height: 20px; background: #E2DDD8; margin: 0 4px; }
.callout-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #5A5F6E; cursor: pointer; padding: 4px 10px; background: #FFFFFF; border: 0.5px solid #E2DDD8; border-radius: 7px; }
.callout-toggle input { accent-color: #F5A623; }
.legend { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #7A7F8E; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.diagram-body-row { display: flex; flex: 1; min-height: 0; }
.diagram-canvas-wrap { flex: 1; position: relative; overflow: hidden; background: #F8F6F2; }
.diagram-canvas { width: 100%; height: 100%; min-height: 520px; position: relative; display: flex; align-items: center; justify-content: center; }
.diagram-svg-wrap { position: relative; display: inline-block; }
.hotspot { position: absolute; cursor: pointer; }
.callout-bubble { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid; transition: transform 0.15s; position: relative; z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
.callout-bubble:hover { transform: scale(1.15); }
.callout-default { background: #FFFFFF; border-color: #9CA3AF; color: #3A3D4A; }
.callout-ordered { background: #F5A623; border-color: #D4880A; color: #1A1200; }
.callout-selected { background: #534AB7; border-color: #3B3497; color: #FFFFFF; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } 60% { transform: translateY(-3px); } }
.callout-bounce { animation: bounce 1.8s ease-in-out infinite; }
.callout-bounce:hover { animation: none; transform: scale(1.15); }
@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
.callout-pulse::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #534AB7; animation: pulse-ring 1.4s ease-out infinite; }
.diagram-zoom-hint { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: rgba(30,30,30,0.7); color: #FFFFFF; font-size: 11px; padding: 5px 12px; border-radius: 999px; display: flex; align-items: center; gap: 6px; pointer-events: none; }
.parts-panel { width: 280px; min-width: 280px; background: #FFFFFF; border-left: 0.5px solid #E8E4DF; display: flex; flex-direction: column; }
.parts-panel-header { padding: 12px 14px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.parts-panel-title { font-size: 13px; font-weight: 600; color: #111318; }
.parts-panel-count { font-size: 11px; color: #9CA3AF; }
.parts-list { flex: 1; overflow-y: auto; }
.part-row-sm { padding: 10px 14px; border-bottom: 0.5px solid #F5F2EE; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.part-row-sm:hover { background: #FAFAF8; }
.part-row-sm.active-row { background: #EEEDFE; }
.part-row-sm.in-order { background: #FFFBF2; }
.part-callout-num { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; border: 1.5px solid; }
.pc-default { background: #FFFFFF; border-color: #9CA3AF; color: #3A3D4A; }
.pc-ordered { background: #F5A623; border-color: #D4880A; color: #1A1200; }
.pc-selected { background: #534AB7; border-color: #3B3497; color: #FFFFFF; }
.part-row-info { flex: 1; min-width: 0; }
.part-row-name { font-size: 12px; font-weight: 500; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.part-row-num { font-size: 11px; color: #9CA3AF; }
.part-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.part-row-price { font-size: 12px; font-weight: 600; color: #111318; }
.add-to-cart-btn { font-size: 11px; font-weight: 600; background: #F5A623; border: none; border-radius: 5px; padding: 3px 8px; color: #1A1200; cursor: pointer; font-family: inherit; }
.in-order-label { font-size: 10px; font-weight: 600; color: #854F0B; background: #FAEEDA; border-radius: 5px; padding: 3px 7px; }
.part-detail-drawer { border-top: 0.5px solid #E8E4DF; padding: 14px; background: #FAFAF8; }
.drawer-part-name { font-size: 13px; font-weight: 700; color: #111318; margin-bottom: 2px; }
.drawer-part-num { font-size: 11px; color: #9CA3AF; margin-bottom: 10px; }
.drawer-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 0.5px solid #F0ECE8; }
.drawer-label { font-size: 11px; color: #9CA3AF; }
.drawer-val { font-size: 11px; font-weight: 500; color: #111318; }
.drawer-add-btn { width: 100%; background: #F5A623; border: none; border-radius: 7px; padding: 9px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; }
.docs-strip { padding: 10px 14px; border-top: 0.5px solid #E8E4DF; background: #FFFFFF; }
.docs-strip-label { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; }
.doc-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 0.5px solid #F5F2EE; cursor: pointer; }
.doc-item:last-child { border-bottom: none; }
.doc-item:hover .doc-name { color: #F5A623; }
.doc-icon { width: 26px; height: 26px; background: #F5F2EE; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #7A7F8E; flex-shrink: 0; }
.doc-name { font-size: 12px; color: #3A3D4A; font-weight: 500; flex: 1; line-height: 1.3; }
.doc-type { font-size: 10px; color: #B0AAA3; }
.cart-strip-bottom { background: #1E1E1E; padding: 11px 14px; display: flex; align-items: center; gap: 10px; }
.cart-strip-label2 { font-size: 12px; font-weight: 600; color: #FFFFFF; }
.cart-strip-sub2 { font-size: 11px; color: #5C6070; }
.cart-btn2 { background: #F5A623; border: none; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
</style>
<h2 class="sr-only">Hydraulic system diagram — Skyjack SJIII 3219, lift cylinder</h2>
<div class="shell">
  ${buildSidebar('parts')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('Show me the Work Order detail view for WO #100094')">WO #100094</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Search parts</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="wo-context-ribbon">
      <div class="ribbon-item"><i class="ti ti-clipboard-list"></i> WO <strong>#100094</strong></div>
      <span class="ribbon-sep">·</span>
      <div class="ribbon-item"><i class="ti ti-crane"></i> <strong>Skyjack SJIII 3219</strong></div>
      <span class="ribbon-sep">·</span>
      <div class="ribbon-item"><i class="ti ti-tag"></i> Asset <strong>FL-094</strong></div>
      <span class="ribbon-sep">·</span>
      <div class="ribbon-warranty"><i class="ti ti-shield-check"></i> Under warranty · expires Sep 14, 2027</div>
      <span class="ribbon-sep">·</span>
      <span class="ribbon-pill">Parts ordered</span>
    </div>
    <div class="content-row">
      <div class="tree-panel">
        <div class="tree-search"><div class="tree-search-wrap"><i class="ti ti-search tree-search-icon"></i><input class="tree-search-input" type="text" placeholder="Filter catalog…"/></div></div>
        <div class="tree-body">
          <div class="ctx-badges">
            <div class="ctx-badge ctx-badge-purple"><i class="ti ti-fingerprint"></i><div><div class="ctx-badge-label">Serial confirmed</div><div class="ctx-badge-val">SJ3219-00847</div></div></div>
            <div class="ctx-badge ctx-badge-green"><i class="ti ti-shield-check"></i><div><div class="ctx-badge-label">Under warranty</div><div class="ctx-badge-val">Expires Sep 14, 2027</div></div></div>
          </div>
          <div class="tree-section-label">Catalog</div>
          <div class="tree-node" style="font-weight:600;color:#111318;"><span class="tree-toggle"><i class="ti ti-chevron-down" style="font-size:11px;"></i></span><i class="ti ti-building-factory-2 tree-node-icon"></i><span class="tree-node-label">Skyjack</span></div>
          <div class="tree-node"><span class="tree-indent"></span><span class="tree-toggle"><i class="ti ti-chevron-down" style="font-size:11px;"></i></span><i class="ti ti-crane tree-node-icon"></i><span class="tree-node-label">Scissor Lifts</span></div>
          <div class="tree-node" style="background:#FFF8E8;"><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-toggle"><i class="ti ti-chevron-down" style="font-size:11px;color:#F5A623;"></i></span><i class="ti ti-crane tree-node-icon" style="color:#F5A623;"></i><span class="tree-node-label" style="color:#854F0B;font-weight:600;">SJIII 3219</span></div>
          <div class="tree-node" style="color:#534AB7;font-weight:500;"><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-toggle"><i class="ti ti-chevron-down" style="font-size:11px;"></i></span><i class="ti ti-droplet tree-node-icon" style="color:#534AB7;"></i><span class="tree-node-label">Hydraulic system</span></div>
          <div class="tree-node active"><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-toggle"></span><i class="ti ti-point tree-node-icon"></i><span class="tree-node-label">Lift cylinder</span><span class="tree-node-count">5</span></div>
          <div class="tree-node"><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-toggle"></span><i class="ti ti-point tree-node-icon"></i><span class="tree-node-label">Pump &amp; motor</span><span class="tree-node-count">7</span></div>
          <div class="tree-node"><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-toggle"></span><i class="ti ti-point tree-node-icon"></i><span class="tree-node-label">Control valve</span><span class="tree-node-count">4</span></div>
        </div>
      </div>
      <div class="main-panel">
        <div class="catalog-breadcrumb"><span class="cb-item">Skyjack</span><span class="cb-sep">/</span><span class="cb-item">Scissor Lifts</span><span class="cb-sep">/</span><span class="cb-item">SJIII 3219</span><span class="cb-sep">/</span><span class="cb-item">Hydraulic system</span><span class="cb-sep">/</span><span class="cb-item active-node">Lift cylinder</span></div>
        <div class="view-toolbar">
          <div class="view-title">Lift cylinder</div>
          <div class="view-toggle"><button class="vtoggle-btn active"><i class="ti ti-schema" style="font-size:13px;"></i> Diagram</button><button class="vtoggle-btn"><i class="ti ti-list" style="font-size:13px;"></i> Parts list</button></div>
          <button class="btn-ghost-sm"><i class="ti ti-printer" style="font-size:13px;"></i> Print</button>
        </div>
        <div class="diagram-tools">
          <button class="tool-btn"><i class="ti ti-zoom-in"></i></button>
          <span class="zoom-display">100%</span>
          <button class="tool-btn"><i class="ti ti-zoom-out"></i></button>
          <button class="tool-btn"><i class="ti ti-focus-centered"></i></button>
          <div class="tool-sep"></div>
          <label class="callout-toggle"><input type="checkbox" checked/> Show callouts</label>
          <div class="legend"><div class="legend-item"><div class="legend-dot" style="background:#F5A623;"></div> In cart</div><div class="legend-item"><div class="legend-dot" style="background:#534AB7;"></div> Selected</div><div class="legend-item"><div class="legend-dot" style="background:#FFFFFF;border:1.5px solid #9CA3AF;"></div> Available</div></div>
        </div>
        <div class="diagram-body-row">
          <div class="diagram-canvas-wrap">
            <div class="diagram-canvas">
              <div class="diagram-svg-wrap" id="ps-diagram-svg-wrap" style="position:relative;width:560px;height:420px;">
                <svg width="560" height="420" viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="560" height="420" fill="#F8F6F2"/>
                  <rect x="16" y="16" width="200" height="36" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>
                  <text x="24" y="30" font-size="9" fill="#9CA3AF" font-family="Inter,sans-serif" font-weight="600" letter-spacing="1">SKYJACK</text>
                  <text x="24" y="44" font-size="10" fill="#3A3D4A" font-family="Inter,sans-serif" font-weight="600">SJIII 3219 — Hydraulic Lift Cylinder</text>
                  <rect x="380" y="16" width="160" height="36" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>
                  <text x="388" y="30" font-size="9" fill="#9CA3AF" font-family="Inter,sans-serif">Serial: SJ3219-00847</text>
                  <text x="388" y="44" font-size="9" fill="#9CA3AF" font-family="Inter,sans-serif">Rev. 4 · Jun 2019</text>
                  <rect x="160" y="130" width="240" height="80" rx="4" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <rect x="140" y="140" width="24" height="60" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
                  <rect x="396" y="140" width="24" height="60" rx="3" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1.5"/>
                  <rect x="420" y="158" width="100" height="24" rx="2" fill="#C8C3BC" stroke="#A8A39C" stroke-width="1.5"/>
                  <circle cx="530" cy="170" r="12" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <circle cx="530" cy="170" r="5" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1"/>
                  <rect x="310" y="136" width="16" height="68" rx="2" fill="#D6D2CC" stroke="#A8A39C" stroke-width="1" stroke-dasharray="3,2"/>
                  <rect x="200" y="110" width="30" height="22" rx="2" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <text x="215" y="107" font-size="8" fill="#9CA3AF" text-anchor="middle" font-family="Inter,sans-serif">Port A</text>
                  <rect x="310" y="208" width="30" height="22" rx="2" fill="#ECEAE6" stroke="#B8B3AC" stroke-width="1.5"/>
                  <text x="325" y="242" font-size="8" fill="#9CA3AF" text-anchor="middle" font-family="Inter,sans-serif">Port B</text>
                  <line x1="152" y1="150" x2="152" y2="190" stroke="#F5A623" stroke-width="2" stroke-dasharray="4,2"/>
                  <line x1="408" y1="150" x2="408" y2="190" stroke="#B8B3AC" stroke-width="1.5" stroke-dasharray="3,2"/>
                  <ellipse cx="152" cy="170" rx="12" ry="24" fill="none" stroke="#F5A623" stroke-width="2" stroke-dasharray="4,2" opacity="0.7"/>
                  <rect x="8" y="8" width="544" height="404" fill="none" stroke="#D1CBC4" stroke-width="0.75"/>
                  <text x="280" y="334" font-size="9" fill="#9CA3AF" text-anchor="middle" font-family="Inter,sans-serif">Cylinder bore: 82mm</text>
                </svg>
                <div id="ps-hotspots-layer" style="position:absolute;inset:0;pointer-events:none;"></div>
                <style>#ps-hotspots-layer .hotspot { pointer-events: all; }</style>
              </div>
            </div>
            <div class="diagram-zoom-hint"><i class="ti ti-hand-grab" style="font-size:13px;"></i> Click a callout to see part details</div>
          </div>
          <div class="parts-panel">
            <div class="parts-panel-header"><div class="parts-panel-title">Lift cylinder parts</div><div class="parts-panel-count">5 parts</div></div>
            <div class="parts-list"><div id="ps-parts-list-inner"></div><div id="ps-part-detail-drawer" class="part-detail-drawer" style="display:none;"></div></div>
            <div class="docs-strip">
              <div class="docs-strip-label">Related documents</div>
              <div class="doc-item" onclick="sendPrompt('Open manuals and docs')"><div class="doc-icon"><i class="ti ti-file-text"></i></div><div><div class="doc-name">Hydraulic System Service Manual</div><div class="doc-type">PDF · SJIII 3219 · Section 7</div></div></div>
              <div class="doc-item" onclick="sendPrompt('Open manuals and docs')"><div class="doc-icon"><i class="ti ti-alert-circle"></i></div><div><div class="doc-name">Service Bulletin SB-2847</div><div class="doc-type">Lift cylinder seal replacement</div></div></div>
              <div class="doc-item" onclick="sendPrompt('Open manuals and docs')"><div class="doc-icon"><i class="ti ti-ruler"></i></div><div><div class="doc-name">Torque spec sheet — cylinder rod</div><div class="doc-type">PDF · Rev. 2</div></div></div>
            </div>
            <div class="cart-strip-bottom"><div><div class="cart-strip-label2">2 parts in cart</div><div class="cart-strip-sub2">$210.00 · All OEM</div></div><button class="cart-btn2" style="margin-left:auto;">View cart</button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const psParts = [
    { ref: 10, name: 'Hydraulic lift cylinder seal kit', num: 'SKJ-103100', oem: true, price: '$84.00', avail: 'green', status: 'ordered', x: 52, y: 38 },
    { ref: 20, name: 'Pressure relief valve', num: 'SKJ-103278', oem: true, price: '$126.00', avail: 'green', status: 'ordered', x: 74, y: 55 },
    { ref: 30, name: 'Cylinder rod wiper seal', num: 'SKJ-103445', oem: true, price: '$22.00', avail: 'green', status: 'normal', x: 38, y: 62 },
    { ref: 40, name: 'Cylinder end cap O-ring set', num: 'SKJ-103512', oem: true, price: '$14.00', avail: 'amber', status: 'normal', x: 60, y: 74 },
    { ref: 50, name: 'Lift cylinder assembly — complete', num: 'SKJ-104210', oem: true, price: '$648.00', avail: 'green', status: 'normal', x: 82, y: 30 },
  ];
  let psSelected = 30;

  function psGetCalloutClass(p) {
    if (p.ref === psSelected) return 'callout-selected callout-pulse';
    if (p.status === 'ordered') return 'callout-ordered callout-bounce';
    return 'callout-default';
  }
  function psGetListClass(p) {
    if (p.ref === psSelected) return 'pc-selected';
    if (p.status === 'ordered') return 'pc-ordered';
    return 'pc-default';
  }
  function psRenderDiagram() {
    const layer = document.getElementById('ps-hotspots-layer');
    if (!layer) return;
    layer.innerHTML = '';
    psParts.forEach(p => {
      const div = document.createElement('div');
      div.className = 'hotspot';
      div.style.left = p.x + '%'; div.style.top = p.y + '%';
      div.style.transform = 'translate(-50%,-50%)';
      const bubble = document.createElement('div');
      bubble.className = 'callout-bubble ' + psGetCalloutClass(p);
      bubble.textContent = p.ref;
      bubble.onclick = () => { psSelected = psSelected === p.ref ? null : p.ref; psRenderDiagram(); psRenderList(); };
      div.appendChild(bubble); layer.appendChild(div);
    });
  }
  function psRenderList() {
    const list = document.getElementById('ps-parts-list-inner');
    const drawer = document.getElementById('ps-part-detail-drawer');
    if (!list) return;
    list.innerHTML = '';
    psParts.forEach(p => {
      const isSelected = p.ref === psSelected;
      const row = document.createElement('div');
      row.className = 'part-row-sm' + (isSelected ? ' active-row' : '') + (p.status === 'ordered' ? ' in-order' : '');
      row.onclick = () => { psSelected = psSelected === p.ref ? null : p.ref; psRenderDiagram(); psRenderList(); };
      row.innerHTML = `<div class="part-callout-num ${psGetListClass(p)}">${p.ref}</div><div class="part-row-info"><div class="part-row-name">${p.name}</div><div class="part-row-num">${p.num} ${p.oem ? '<span class="oem-badge">OEM</span>' : ''}</div></div><div class="part-row-right"><div class="part-row-price">${p.price}</div>${p.status === 'ordered' ? '<span class="in-order-label">In cart</span>' : '<button class="add-to-cart-btn">Add</button>'}</div>`;
      list.appendChild(row);
    });
    if (psSelected) {
      const p = psParts.find(x => x.ref === psSelected);
      if (p) {
        drawer.style.display = 'block';
        drawer.innerHTML = `<div class="drawer-part-name">${p.name}</div><div class="drawer-part-num">${p.num} · Skyjack OEM</div><div class="drawer-row"><div class="drawer-label">Diagram ref</div><div class="drawer-val">Callout ${p.ref}</div></div><div class="drawer-row"><div class="drawer-label">Availability</div><div class="drawer-val" style="color:${p.avail==='green'?'#3B6D11':'#854F0B'}">${p.avail==='green'?'In stock':'Backordered'}</div></div><div class="drawer-row"><div class="drawer-label">Net price</div><div class="drawer-val">${p.price}</div></div><div class="drawer-row"><div class="drawer-label">Fits serial</div><div class="drawer-val">SJ3219-00847</div></div>${p.status !== 'ordered' ? '<button class="drawer-add-btn"><i class="ti ti-shopping-cart" style="font-size:14px;"></i> Add to cart</button>' : '<div style="background:#FAEEDA;border-radius:7px;padding:8px 10px;text-align:center;font-size:12px;font-weight:600;color:#854F0B;margin-top:12px;">Already in cart</div>'}`;
      }
    } else { drawer.style.display = 'none'; }
  }
  psRenderDiagram();
  psRenderList();
}