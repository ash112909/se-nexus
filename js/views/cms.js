// ── CMS state ──────────────────────────────────────────────────────────────
let _cmsTab = 'list';       // 'list' | 'edit' | 'part-notes'
let _cmsEditId = null;      // null = new article
let _cmsListFilter = 'all'; // 'all' | 'published' | 'draft' | 'scheduled'
let _cmsAiMode = null;      // null | 'rewrite' | 'simplify' | 'translate'
let _cmsPtSelectedPartId = null;
let _cmsPtExpandedCats = new Set();
let _cmsPtExpandedVendors = new Set();

const CMS_TYPES = {
  bulletin: { label:'Service Bulletin', icon:'ti-alert-triangle', color:'#854F0B', bg:'#FAEEDA' },
  fleet:    { label:'Fleet Update',     icon:'ti-building',       color:'#185FA5', bg:'#E6F1FB' },
  safety:   { label:'Safety Alert',     icon:'ti-alert-octagon',  color:'#B91C1C', bg:'#FEE2E2' },
  warranty: { label:'Warranty Notice',  icon:'ti-shield-check',   color:'#0F6E56', bg:'#E1F5EE' },
  supplier: { label:'Supplier News',    icon:'ti-news',           color:'#534AB7', bg:'#EEEDFE' },
  training: { label:'Training',         icon:'ti-certificate',    color:'#5B21B6', bg:'#EDE9FE' },
  pricing:  { label:'Pricing Update',   icon:'ti-tag',            color:'#6B7280', bg:'#F3F4F6' },
  notice:   { label:'General Notice',   icon:'ti-info-circle',    color:'#374151', bg:'#F9FAFB' },
};
const CMS_SUBTYPES = {
  bulletin: ['Mandatory','Advisory','Recall'],
  fleet:    ['Operations','Equipment','Staffing'],
  safety:   ['Compliance','Hazard','PPE','Procedure'],
  warranty: ['Expiry','Claim','Coverage'],
  supplier: ['Pricing','Availability','Product Launch'],
  training: ['Required','Optional','Certification'],
  pricing:  ['Increase','Decrease','Promotional'],
  notice:   ['Policy','Reminder','Administrative'],
};
const CMS_PRIORITIES = [
  { value:'critical', label:'Critical', color:'#B91C1C', bg:'#FEE2E2' },
  { value:'high',     label:'High',     color:'#C2410C', bg:'#FFF7ED' },
  { value:'medium',   label:'Medium',   color:'#B45309', bg:'#FFFBEB' },
  { value:'low',      label:'Low',      color:'#6B7280', bg:'#F9FAFB' },
];
const CMS_LANGUAGES = [
  { value:'en', label:'English' },
  { value:'es', label:'Spanish (Español)' },
  { value:'fr', label:'French (Français)' },
  { value:'pt', label:'Portuguese (Português)' },
];
const CMS_POST_AS = [
  { value:'news',   label:'News & updates feed only' },
  { value:'banner', label:'Site-wide banner only' },
  { value:'both',   label:'News feed + banner' },
];

// AI simulations
const AI_REWRITES = {
  rewrite: (text) => text.replace(/\./g, '.').split('. ').map((s,i) => i===0 ? s : s.charAt(0).toUpperCase()+s.slice(1)).join('. ') +
    '\n\n[AI enhanced: improved clarity and professional tone.]',
  simplify: (text) => {
    const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>10).slice(0,3);
    return sentences.map(s=>s.trim()).join('. ') + '.\n\n[AI simplified: reduced to key points.]';
  },
  translate_es: (text) => {
    const map = { 'required':'requerido','inspection':'inspección','safety':'seguridad','all':'todos','before':'antes de','must':'debe','complete':'completar','operators':'operadores','units':'unidades','please':'por favor','and':'y','the':'el','a':'un','in':'en','to':'a','of':'de' };
    return '[Traducción al Español]\n\n' + text.split(' ').map(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g,'');
      return map[clean] ? w.replace(clean, map[clean]) : w;
    }).join(' ');
  },
};

function render_cms(el) {
  const _user = Store.getCurrentUser();
  if (!_user || _user.role !== 'supervisor') {
    el.innerHTML = `<div class="shell">${buildSidebar('cms')}<div class="main"><div style="padding:60px;text-align:center;color:#9CA3AF;"><i class="ti ti-lock" style="font-size:32px;display:block;margin-bottom:12px;"></i>Access restricted.</div></div></div>`;
    return;
  }

  el.innerHTML = `
<style>
/* ── Shell ──────────────── */
.cms-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.cms-content { flex:1; overflow-y:auto; padding:0; }
/* ── Header ─────────────── */
.cms-hdr { padding:16px 24px 0; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
.cms-hdr-title { font-size:17px; font-weight:700; color:#111318; }
.cms-hdr-sub { font-size:12px; color:#9CA3AF; margin-top:2px; }
.cms-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:#111318; color:#FFFFFF; border:none; border-radius:8px; font-size:12px; font-weight:600; font-family:inherit; cursor:pointer; }
.cms-btn-primary:hover { background:#2A2D3A; }
.cms-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; background:#FFFFFF; color:#3A3D4A; border:0.5px solid #E2DDD8; border-radius:8px; font-size:12px; font-weight:500; font-family:inherit; cursor:pointer; }
.cms-btn-ghost:hover { background:#F5F2EE; }
.cms-btn-danger { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; background:#FEE2E2; color:#B91C1C; border:none; border-radius:8px; font-size:12px; font-weight:600; font-family:inherit; cursor:pointer; }
.cms-btn-danger:hover { background:#FCA5A5; }
/* ── Filter bar ─────────── */
.cms-filter-bar { display:flex; align-items:center; gap:8px; padding:12px 24px; border-bottom:0.5px solid #E8E4DF; flex-wrap:wrap; }
.cms-ftab { padding:5px 13px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:0.5px solid transparent; color:#5A5F6E; transition:all .15s; }
.cms-ftab.active { background:#111318; color:#FFFFFF; }
.cms-ftab:hover:not(.active) { background:#F5F2EE; }
.cms-count { font-size:10px; font-weight:700; background:#F0ECE8; color:#5A5F6E; border-radius:10px; padding:1px 6px; margin-left:3px; }
/* ── Article list ────────── */
.cms-list { padding:12px 24px 32px; display:flex; flex-direction:column; gap:8px; }
.cms-row { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:14px 16px; display:flex; align-items:flex-start; gap:14px; cursor:pointer; transition:border-color .15s; }
.cms-row:hover { border-color:#C8C3BC; }
.cms-row-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.cms-row-body { flex:1; min-width:0; }
.cms-row-title { font-size:13px; font-weight:600; color:#111318; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cms-row-meta { font-size:11px; color:#9CA3AF; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.cms-row-actions { display:flex; gap:6px; flex-shrink:0; }
.cms-chip { display:inline-flex; align-items:center; gap:3px; padding:2px 7px; border-radius:6px; font-size:10px; font-weight:600; }
.cms-status-published { background:#D1FAE5; color:#065F46; }
.cms-status-draft     { background:#F0ECE8; color:#5A5F6E; }
.cms-status-scheduled { background:#DBEAFE; color:#1D4ED8; }
.cms-status-expired   { background:#FEE2E2; color:#B91C1C; }
/* ── Editor ─────────────── */
.cms-editor { padding:20px 24px 40px; }
.cms-editor-grid { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:start; }
.cms-panel { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; overflow:hidden; }
.cms-panel-hdr { padding:12px 16px; border-bottom:0.5px solid #F0ECE8; font-size:12px; font-weight:600; color:#111318; display:flex; align-items:center; gap:6px; }
.cms-panel-body { padding:16px; display:flex; flex-direction:column; gap:14px; }
.cms-field { display:flex; flex-direction:column; gap:5px; }
.cms-label { font-size:11px; font-weight:600; color:#5A5F6E; text-transform:uppercase; letter-spacing:.6px; }
.cms-input { width:100%; padding:8px 10px; border:0.5px solid #E2DDD8; border-radius:8px; font-size:13px; font-family:inherit; color:#111318; outline:none; background:#FFFFFF; }
.cms-input:focus { border-color:#F5A623; }
.cms-textarea { width:100%; padding:10px; border:0.5px solid #E2DDD8; border-radius:8px; font-size:13px; font-family:inherit; color:#111318; outline:none; resize:vertical; min-height:120px; line-height:1.6; background:#FFFFFF; }
.cms-textarea:focus { border-color:#F5A623; }
.cms-select { width:100%; padding:8px 10px; border:0.5px solid #E2DDD8; border-radius:8px; font-size:13px; font-family:inherit; color:#111318; outline:none; background:#FFFFFF; cursor:pointer; }
.cms-select:focus { border-color:#F5A623; }
.cms-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
/* ── AI panel ───────────── */
.cms-ai-btn { display:flex; align-items:center; gap:7px; padding:8px 12px; border:0.5px solid #E2DDD8; border-radius:8px; font-size:12px; font-weight:500; font-family:inherit; cursor:pointer; background:#FFFFFF; color:#3A3D4A; transition:all .15s; width:100%; }
.cms-ai-btn:hover { background:#F5F2EE; border-color:#C8C3BC; }
.cms-ai-btn .ai-icon { width:22px; height:22px; border-radius:6px; background:#111318; color:#F5A623; display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
.cms-ai-preview { background:#F5F2EE; border:0.5px solid #E2DDD8; border-radius:8px; padding:12px; font-size:12px; color:#3A3D4A; line-height:1.6; margin-top:2px; white-space:pre-wrap; }
/* ── Attachments ────────── */
.cms-attach-row { display:flex; align-items:center; gap:8px; padding:6px 8px; background:#F5F2EE; border-radius:7px; font-size:11px; color:#3A3D4A; }
.cms-attach-name { flex:1; }
/* ── Banner preview ──────── */
.cms-banner-preview { padding:9px 14px; display:flex; align-items:center; gap:8px; font-size:12px; font-weight:500; border-radius:8px; margin-top:4px; }
/* ── Post-as toggle ──────── */
.cms-post-toggle { display:flex; flex-direction:column; gap:5px; }
.cms-post-opt { display:flex; align-items:center; gap:8px; padding:8px 10px; border:0.5px solid #E2DDD8; border-radius:8px; cursor:pointer; font-size:12px; color:#3A3D4A; transition:all .15s; }
.cms-post-opt.selected { border-color:#F5A623; background:#FAEEDA; color:#854F0B; font-weight:600; }
.cms-post-opt input[type=radio] { accent-color:#F5A623; }
/* ── Action bar ─────────── */
.cms-action-bar { display:flex; align-items:center; gap:8px; padding:16px 24px; border-top:0.5px solid #E8E4DF; background:#FAFAF8; flex-shrink:0; }
</style>
<h2 class="sr-only">Content Management</h2>
<div class="shell">
  ${buildSidebar('cms')}
  <div class="main cms-main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        ${_cmsTab === 'edit' ? `<a style="color:#5C6070;cursor:pointer;" onclick="cmsGoList()">Content mgmt</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">${_cmsEditId ? 'Edit article' : 'New article'}</span>` : _cmsTab === 'part-notes' ? `<a style="color:#5C6070;cursor:pointer;" onclick="cmsGoList()">Content mgmt</a><span style="color:#3C4052;">/</span><span style="color:#FFFFFF;font-weight:500;">Part notes</span>` : `<span style="color:#FFFFFF;font-weight:500;">Content mgmt</span>`}
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="cms-content" id="cms-content-body"></div>
  </div>
</div>`;

  if (_cmsTab === 'edit') cmsRenderEditor();
  else if (_cmsTab === 'part-notes') cmsRenderPartNotes();
  else cmsRenderList();
}

// ── List view ──────────────────────────────────────────────────────────────
function cmsRenderList() {
  const body = document.getElementById('cms-content-body');
  if (!body) return;

  const all = Store.getCmsArticles('all');
  const now = new Date();
  function getStatus(a) {
    if (a.status === 'draft') return 'draft';
    if (a.status === 'scheduled') return 'scheduled';
    if (a.expiryDate && new Date(a.expiryDate) < now) return 'expired';
    return 'published';
  }

  const counts = { all: all.length, published: 0, draft: 0, scheduled: 0, expired: 0 };
  all.forEach(a => { const s = getStatus(a); if (counts[s] !== undefined) counts[s]++; });

  const filtered = _cmsListFilter === 'all' ? all : all.filter(a => getStatus(a) === _cmsListFilter);

  body.innerHTML = `
    <div class="cms-hdr">
      <div>
        <div class="cms-hdr-title">Content Management</div>
        <div class="cms-hdr-sub">Manage fleet news, notices, and site-wide banners</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="cms-btn-ghost" onclick="cmsGoPartNotes()"><i class="ti ti-tag"></i> Part notes</button>
        <button class="cms-btn-primary" onclick="cmsNewArticle()"><i class="ti ti-plus"></i> New article</button>
      </div>
    </div>
    <div class="cms-filter-bar">
      ${[['all','All'],['published','Published'],['draft','Draft'],['scheduled','Scheduled'],['expired','Expired']].map(([v,l]) =>
        `<div class="cms-ftab ${_cmsListFilter===v?'active':''}" onclick="cmsSetFilter('${v}')">${l}<span class="cms-count">${counts[v]||0}</span></div>`
      ).join('')}
    </div>
    <div class="cms-list">
      ${filtered.length === 0 ? `<div style="text-align:center;padding:40px;color:#9CA3AF;font-size:13px;">No ${_cmsListFilter === 'all' ? '' : _cmsListFilter + ' '}articles yet.</div>` :
        filtered.map(a => {
          const status = getStatus(a);
          const tm = CMS_TYPES[a.type] || CMS_TYPES.notice;
          const pri = CMS_PRIORITIES.find(p => p.value === a.priority) || CMS_PRIORITIES[2];
          return `<div class="cms-row" onclick="cmsEditArticle('${a.id}')">
            <div class="cms-row-icon" style="background:${tm.bg};color:${tm.color};"><i class="ti ${tm.icon}"></i></div>
            <div class="cms-row-body">
              <div class="cms-row-title">${a.title}</div>
              <div class="cms-row-meta">
                <span class="cms-chip cms-status-${status}">${status.charAt(0).toUpperCase()+status.slice(1)}</span>
                <span class="cms-chip" style="background:${pri.bg};color:${pri.color};">${pri.label}</span>
                <span class="cms-chip" style="background:${tm.bg};color:${tm.color};"><i class="ti ${tm.icon}" style="font-size:10px;"></i> ${tm.label}</span>
                ${a.banner ? `<span class="cms-chip" style="background:#EFF6FF;color:#1D4ED8;"><i class="ti ti-speakerphone" style="font-size:10px;"></i> Banner</span>` : ''}
                <span>By ${a.poster || 'Unknown'}</span>
                <span>${a.postedDate || ''}</span>
                ${a.expiryDate ? `<span>Expires ${a.expiryDate}</span>` : ''}
              </div>
            </div>
            <div class="cms-row-actions" onclick="event.stopPropagation()">
              <button class="cms-btn-ghost" style="padding:5px 9px;" onclick="cmsEditArticle('${a.id}')"><i class="ti ti-pencil"></i></button>
              <button class="cms-btn-danger" style="padding:5px 9px;" onclick="cmsDeleteArticle('${a.id}')"><i class="ti ti-trash"></i></button>
            </div>
          </div>`;
        }).join('')}
    </div>`;
}

// ── Editor view ────────────────────────────────────────────────────────────
function cmsRenderEditor() {
  const body = document.getElementById('cms-content-body');
  if (!body) return;

  const existing = _cmsEditId ? Store.getCmsArticle(_cmsEditId) : null;
  const a = existing || {
    id: 'cms-' + Date.now(), type:'fleet', subtype:'Operations', priority:'medium', status:'draft', postAs:'news',
    title:'', summary:'', body:'', poster: (Store.getCurrentUser()||{}).shortName || '',
    postedDate: new Date().toISOString().slice(0,10), expiryDate:'', language:'en',
    tags:[], attachments:[], locations:['all'], banner:false, bannerDismissible:true, bannerText:'',
  };

  const subtypeOpts = (CMS_SUBTYPES[a.type] || []).map(s => `<option value="${s}" ${a.subtype===s?'selected':''}>${s}</option>`).join('');
  const tm = CMS_TYPES[a.type] || CMS_TYPES.notice;

  body.innerHTML = `
    <div class="cms-editor">
      <div class="cms-editor-grid">

        <!-- Left: main content -->
        <div style="display:flex;flex-direction:column;gap:14px;">

          <div class="cms-panel">
            <div class="cms-panel-hdr"><i class="ti ti-article" style="color:#9CA3AF;"></i> Article content</div>
            <div class="cms-panel-body">
              <div class="cms-field">
                <label class="cms-label">Title *</label>
                <input class="cms-input" id="cms-f-title" placeholder="Headline — clear and specific" value="${escCms(a.title)}"/>
              </div>
              <div class="cms-field">
                <label class="cms-label">Summary / teaser</label>
                <input class="cms-input" id="cms-f-summary" placeholder="One-sentence description shown in the news feed" value="${escCms(a.summary)}"/>
              </div>
              <div class="cms-field">
                <label class="cms-label">Body *</label>
                <textarea class="cms-textarea" id="cms-f-body" rows="8" placeholder="Full article content…">${escCms(a.body)}</textarea>
              </div>
              <div class="cms-field">
                <label class="cms-label">Tags <span style="font-weight:400;text-transform:none;letter-spacing:0;color:#9CA3AF;">(comma-separated)</span></label>
                <input class="cms-input" id="cms-f-tags" placeholder="e.g. hydraulics, safety, toyota" value="${(a.tags||[]).join(', ')}"/>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="cms-panel">
            <div class="cms-panel-hdr"><i class="ti ti-paperclip" style="color:#9CA3AF;"></i> Attachments</div>
            <div class="cms-panel-body" id="cms-attachments-body">
              ${(a.attachments||[]).map((f,i) => `
                <div class="cms-attach-row" id="cms-att-${i}">
                  <i class="ti ti-file-description" style="color:#9CA3AF;"></i>
                  <span class="cms-attach-name">${f}</span>
                  <button onclick="cmsRemoveAttachment(${i})" style="background:none;border:none;cursor:pointer;color:#9CA3AF;font-size:14px;">×</button>
                </div>`).join('')}
              <div>
                <input type="file" id="cms-file-input" style="display:none;" multiple onchange="cmsHandleFiles(this)"/>
                <button class="cms-btn-ghost" onclick="document.getElementById('cms-file-input').click()"><i class="ti ti-upload"></i> Upload file</button>
                <span style="font-size:11px;color:#9CA3AF;margin-left:8px;">PDF, DOCX, images</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: settings sidebar -->
        <div style="display:flex;flex-direction:column;gap:14px;">

          <!-- Classification -->
          <div class="cms-panel">
            <div class="cms-panel-hdr"><i class="ti ti-tags" style="color:#9CA3AF;"></i> Classification</div>
            <div class="cms-panel-body">
              <div class="cms-field">
                <label class="cms-label">Type</label>
                <select class="cms-select" id="cms-f-type" onchange="cmsTypeChange(this.value)">
                  ${Object.entries(CMS_TYPES).map(([v,t]) => `<option value="${v}" ${a.type===v?'selected':''}>${t.label}</option>`).join('')}
                </select>
              </div>
              <div class="cms-field">
                <label class="cms-label">Sub-type</label>
                <select class="cms-select" id="cms-f-subtype">${subtypeOpts}</select>
              </div>
              <div class="cms-field">
                <label class="cms-label">Urgency</label>
                <select class="cms-select" id="cms-f-priority">
                  ${CMS_PRIORITIES.map(p => `<option value="${p.value}" ${a.priority===p.value?'selected':''}>${p.label}</option>`).join('')}
                </select>
              </div>
              <div class="cms-row-2">
                <div class="cms-field">
                  <label class="cms-label">Publish date</label>
                  <input class="cms-input" type="date" id="cms-f-date" value="${a.postedDate||''}"/>
                </div>
                <div class="cms-field">
                  <label class="cms-label">Expiry date</label>
                  <input class="cms-input" type="date" id="cms-f-expiry" value="${a.expiryDate||''}"/>
                </div>
              </div>
              <div class="cms-field">
                <label class="cms-label">Language</label>
                <select class="cms-select" id="cms-f-language">
                  ${CMS_LANGUAGES.map(l => `<option value="${l.value}" ${a.language===l.value?'selected':''}>${l.label}</option>`).join('')}
                </select>
              </div>
              <div class="cms-field">
                <label class="cms-label">Locations</label>
                <select class="cms-select" id="cms-f-locations">
                  <option value="all" ${(a.locations||[]).includes('all')?'selected':''}>All locations</option>
                  ${Store.getLocations().map(l => `<option value="${l.id}" ${(a.locations||[]).includes(l.id)?'selected':''}>${l.name}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Distribution -->
          <div class="cms-panel">
            <div class="cms-panel-hdr"><i class="ti ti-send" style="color:#9CA3AF;"></i> Post as</div>
            <div class="cms-panel-body">
              <div class="cms-post-toggle">
                ${CMS_POST_AS.map(opt => `
                  <label class="cms-post-opt ${a.postAs===opt.value?'selected':''}" onclick="cmsSelectPostAs('${opt.value}')">
                    <input type="radio" name="cms-post-as" value="${opt.value}" ${a.postAs===opt.value?'checked':''} style="display:none;"/>
                    <i class="ti ${opt.value==='news'?'ti-news':opt.value==='banner'?'ti-speakerphone':'ti-layout-board'}" style="font-size:14px;color:#9CA3AF;"></i>
                    ${opt.label}
                  </label>`).join('')}
              </div>
              <div id="cms-banner-opts" style="${a.postAs==='news'?'display:none;':''}">
                <div class="cms-field" style="margin-top:6px;">
                  <label class="cms-label">Banner text</label>
                  <input class="cms-input" id="cms-f-banner-text" placeholder="Short message shown in the banner" value="${escCms(a.bannerText||a.summary||'')}"/>
                </div>
                <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#5A5F6E;margin-top:6px;cursor:pointer;">
                  <input type="checkbox" id="cms-f-dismissible" ${a.bannerDismissible!==false?'checked':''}/> Users can dismiss banner
                </label>
                <div class="cms-banner-preview" id="cms-banner-live" style="background:#FFFBEB;border:1.5px solid #B45309;color:#B45309;display:${a.postAs==='news'?'none':'flex'};">
                  <i class="ti ti-speakerphone"></i>
                  <span id="cms-banner-live-text">${escCms(a.bannerText||a.summary||'Banner preview')}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- AI tools -->
          <div class="cms-panel">
            <div class="cms-panel-hdr"><i class="ti ti-sparkles" style="color:#F5A623;"></i> AI writing tools</div>
            <div class="cms-panel-body" style="gap:8px;">
              <button class="cms-ai-btn" onclick="cmsAiAction('rewrite')">
                <div class="ai-icon"><i class="ti ti-wand"></i></div>
                <div><div style="font-weight:600;">Rewrite &amp; improve</div><div style="font-size:10px;color:#9CA3AF;">Enhance clarity and professional tone</div></div>
              </button>
              <button class="cms-ai-btn" onclick="cmsAiAction('simplify')">
                <div class="ai-icon"><i class="ti ti-list-check"></i></div>
                <div><div style="font-weight:600;">Simplify</div><div style="font-size:10px;color:#9CA3AF;">Reduce to key action items</div></div>
              </button>
              <button class="cms-ai-btn" onclick="cmsAiAction('translate')">
                <div class="ai-icon"><i class="ti ti-language"></i></div>
                <div><div style="font-weight:600;">Translate</div><div style="font-size:10px;color:#9CA3AF;">Convert to selected language</div></div>
              </button>
              <div id="cms-ai-preview-area" style="display:none;">
                <div class="cms-ai-preview" id="cms-ai-preview-text"></div>
                <div style="display:flex;gap:6px;margin-top:8px;">
                  <button class="cms-btn-primary" style="font-size:11px;padding:5px 11px;" onclick="cmsAiApply()"><i class="ti ti-check"></i> Apply</button>
                  <button class="cms-btn-ghost" style="font-size:11px;padding:5px 11px;" onclick="cmsAiDismiss()">Discard</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Action bar -->
      <div class="cms-action-bar">
        <button class="cms-btn-ghost" onclick="cmsGoList()"><i class="ti ti-arrow-left"></i> Back to list</button>
        <div style="flex:1;"></div>
        <button class="cms-btn-ghost" onclick="cmsSaveDraft()"><i class="ti ti-device-floppy"></i> Save draft</button>
        <button class="cms-btn-ghost" onclick="cmsSchedule()"><i class="ti ti-calendar-event"></i> Schedule</button>
        <button class="cms-btn-primary" onclick="cmsPublish()"><i class="ti ti-send"></i> Publish now</button>
      </div>
    </div>`;

  // Live banner preview update
  const bannerInput = document.getElementById('cms-f-banner-text');
  if (bannerInput) bannerInput.addEventListener('input', () => {
    const t = document.getElementById('cms-banner-live-text');
    if (t) t.textContent = bannerInput.value || 'Banner preview';
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function escCms(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

window.cmsGoList = function() { _cmsTab = 'list'; _cmsEditId = null; Router.navigate('cms'); };
window.cmsSetFilter = function(f) { _cmsListFilter = f; cmsRenderList(); };
window.cmsNewArticle = function() { _cmsTab = 'edit'; _cmsEditId = null; Router.navigate('cms'); };
window.cmsEditArticle = function(id) { _cmsTab = 'edit'; _cmsEditId = id; Router.navigate('cms'); };
window.cmsGoPartNotes = function() { _cmsTab = 'part-notes'; _cmsPtSelectedPartId = null; Router.navigate('cms'); };

window.cmsDeleteArticle = function(id) {
  Modal.show({
    title: 'Delete article',
    body: '<p style="font-size:13px;color:#5A5F6E;">This will permanently remove the article and any associated banner. This cannot be undone.</p>',
    actions: [
      { label: 'Delete', style:'danger', onClick: () => { Store.deleteCmsArticle(id); Modal.close(); cmsRenderList(); } },
      { label: 'Cancel', onClick: () => Modal.close() },
    ],
  });
};

window.cmsTypeChange = function(type) {
  const st = document.getElementById('cms-f-subtype');
  if (st) st.innerHTML = (CMS_SUBTYPES[type]||[]).map(s=>`<option>${s}</option>`).join('');
};

window.cmsSelectPostAs = function(val) {
  document.querySelectorAll('.cms-post-opt').forEach(el => {
    el.classList.toggle('selected', el.querySelector('input').value === val);
  });
  const bannerOpts = document.getElementById('cms-banner-opts');
  const bannerLive = document.getElementById('cms-banner-live');
  if (bannerOpts) bannerOpts.style.display = val === 'news' ? 'none' : '';
  if (bannerLive) bannerLive.style.display = val === 'news' ? 'none' : 'flex';
};

window.cmsHandleFiles = function(input) {
  const body = document.getElementById('cms-attachments-body');
  if (!body) return;
  Array.from(input.files).forEach(f => {
    const row = document.createElement('div');
    row.className = 'cms-attach-row';
    row.innerHTML = `<i class="ti ti-file-description" style="color:#9CA3AF;"></i><span class="cms-attach-name">${f.name}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#9CA3AF;font-size:14px;">×</button>`;
    body.insertBefore(row, body.lastElementChild);
  });
};

window.cmsRemoveAttachment = function(i) {
  const el = document.getElementById('cms-att-' + i);
  if (el) el.remove();
};

window.cmsAiAction = function(action) {
  const body = document.getElementById('cms-f-body');
  if (!body || !body.value.trim()) {
    alert('Add body content first to use AI tools.');
    return;
  }
  _cmsAiMode = action;
  let result;
  if (action === 'translate') {
    const lang = (document.getElementById('cms-f-language')||{}).value || 'en';
    result = lang === 'es' ? AI_REWRITES.translate_es(body.value)
           : lang === 'en' ? body.value + '\n\n[Content is already in English.]'
           : `[Translation to ${lang.toUpperCase()} would appear here via your connected translation service.]\n\n` + body.value;
  } else {
    result = AI_REWRITES[action](body.value);
  }
  const preview = document.getElementById('cms-ai-preview-text');
  const area = document.getElementById('cms-ai-preview-area');
  if (preview) preview.textContent = result;
  if (area) area.style.display = '';
};

window.cmsAiApply = function() {
  const body = document.getElementById('cms-f-body');
  const preview = document.getElementById('cms-ai-preview-text');
  if (body && preview) body.value = preview.textContent;
  cmsAiDismiss();
};

window.cmsAiDismiss = function() {
  const area = document.getElementById('cms-ai-preview-area');
  if (area) area.style.display = 'none';
  _cmsAiMode = null;
};

window.cmsSaveDraft = function() {
  const article = cmsCollectForm('draft');
  if (!article) return;
  Store.saveCmsArticle(article);
  _cmsTab = 'list'; _cmsEditId = null;
  Router.navigate('cms');
};

window.cmsPublish = function() {
  const article = cmsCollectForm('published');
  if (!article) return;
  Store.saveCmsArticle(article);
  // Also push a notification if banner
  if (article.banner && (article.postAs === 'banner' || article.postAs === 'both')) {
    Modal.show({
      title: 'Published & banner activated',
      body: `<div style="font-size:13px;color:#5A5F6E;line-height:1.6;">
        <p><strong>${article.title}</strong> has been published to the news feed.</p>
        ${article.postAs !== 'news' ? '<p style="margin-top:8px;">A site-wide banner has been activated. It will appear at the top of every page until dismissed or the article expires.</p>' : ''}
      </div>`,
      actions: [{ label: 'Done', onClick: () => Modal.close() }],
    });
  }
  _cmsTab = 'list'; _cmsEditId = null;
  Router.navigate('cms');
};

window.cmsSchedule = function() {
  const article = cmsCollectForm('scheduled');
  if (!article) return;
  Store.saveCmsArticle(article);
  _cmsTab = 'list'; _cmsEditId = null;
  Router.navigate('cms');
};

function cmsCollectForm(status) {
  const g = id => (document.getElementById(id)||{}).value || '';
  const title = g('cms-f-title').trim();
  if (!title) { alert('Title is required.'); return null; }
  const body = g('cms-f-body').trim();
  if (!body) { alert('Body content is required.'); return null; }
  const postAs = (document.querySelector('.cms-post-opt.selected input')||{}).value || 'news';
  const existing = _cmsEditId ? Store.getCmsArticle(_cmsEditId) : null;
  const attachRows = document.querySelectorAll('#cms-attachments-body .cms-attach-row .cms-attach-name');
  return {
    id: existing ? existing.id : 'cms-' + Date.now(),
    type: g('cms-f-type'), subtype: g('cms-f-subtype'), priority: g('cms-f-priority'),
    status, postAs,
    title, summary: g('cms-f-summary'), body,
    poster: (Store.getCurrentUser()||{}).shortName || '',
    postedDate: g('cms-f-date'), expiryDate: g('cms-f-expiry'), language: g('cms-f-language'),
    tags: g('cms-f-tags').split(',').map(t=>t.trim()).filter(Boolean),
    attachments: Array.from(attachRows).map(el => el.textContent.trim()),
    locations: [g('cms-f-locations') || 'all'],
    banner: postAs !== 'news',
    bannerDismissible: (document.getElementById('cms-f-dismissible')||{}).checked !== false,
    bannerText: g('cms-f-banner-text'),
  };
}

// ── Part Notes view ────────────────────────────────────────────────────────
function cmsRenderPartNotes() {
  const body = document.getElementById('cms-content-body');
  if (!body) return;

  const VENDOR_NAMES = ['Skyjack', 'Caterpillar', 'Toyota', 'Bobcat'];
  const allParts = Store.getParts('', '');

  // Group by vendor → category
  const byVendor = {};
  VENDOR_NAMES.forEach(v => { byVendor[v] = {}; });
  allParts.forEach(p => {
    const v = p.vendor;
    if (!byVendor[v]) return;
    const cat = p.category || 'General';
    if (!byVendor[v][cat]) byVendor[v][cat] = [];
    byVendor[v][cat].push(p);
  });

  body.innerHTML = `
<style>
.cpn-layout { display:grid; grid-template-columns:280px 1fr; gap:0; height:100%; min-height:0; overflow:hidden; }
.cpn-tree { border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; overflow:hidden; }
.cpn-tree-hdr { padding:14px 18px 10px; border-bottom:0.5px solid #F0ECE8; flex-shrink:0; }
.cpn-tree-title { font-size:13px; font-weight:700; color:#111318; margin-bottom:8px; }
.cpn-tree-search-wrap { position:relative; }
.cpn-tree-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:14px; pointer-events:none; }
.cpn-tree-search { width:100%; height:32px; background:#F5F2EE; border:1px solid #E2DDD8; border-radius:7px; padding:0 10px 0 30px; font-size:12px; font-family:inherit; color:#111318; outline:none; }
.cpn-tree-search:focus { border-color:#F5A623; background:#FFFFFF; }
.cpn-tree-body { flex:1; overflow-y:auto; padding:8px 0; }
.cpn-vendor-hdr { display:flex; align-items:center; gap:7px; padding:7px 14px; cursor:pointer; font-size:12px; font-weight:700; color:#3A3D4A; }
.cpn-vendor-hdr:hover { background:#F5F2EE; }
.cpn-vendor-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.cpn-vendor-chevron { font-size:10px; color:#B0AAA3; margin-left:auto; transition:transform .15s; }
.cpn-vendor-chevron.open { transform:rotate(90deg); }
.cpn-cat-hdr { display:flex; align-items:center; gap:6px; padding:5px 14px 5px 28px; cursor:pointer; font-size:10px; font-weight:600; color:#7A7F8E; letter-spacing:.5px; text-transform:uppercase; }
.cpn-cat-hdr:hover { background:#FAFAF9; }
.cpn-cat-chevron { font-size:9px; color:#C0BAB3; margin-left:auto; transition:transform .15s; }
.cpn-cat-chevron.open { transform:rotate(90deg); }
.cpn-part-item { display:flex; flex-direction:column; padding:5px 14px 5px 38px; cursor:pointer; border-left:2px solid transparent; }
.cpn-part-item:hover { background:#FAFAF9; border-left-color:#E2DDD8; }
.cpn-part-item.selected { background:#FAEEDA; border-left-color:#F5A623; }
.cpn-part-pnum { font-size:10px; font-weight:700; color:#9CA3AF; font-family:monospace; }
.cpn-part-item.selected .cpn-part-pnum { color:#854F0B; }
.cpn-part-desc { font-size:11px; font-weight:500; color:#3A3D4A; line-height:1.3; margin-top:1px; }
.cpn-part-item.selected .cpn-part-desc { color:#111318; }
.cpn-main { display:flex; flex-direction:column; overflow:hidden; }
.cpn-main-inner { flex:1; overflow-y:auto; padding:20px 24px 40px; }
.cpn-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; color:#B0AAA3; font-size:13px; gap:8px; }
.cpn-empty-icon { font-size:32px; }
.cpn-notes-area { display:flex; flex-direction:column; gap:16px; }
.cpn-part-banner { background:#F5F2EE; border-radius:10px; padding:12px 14px; display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.cpn-part-banner-pnum { font-size:11px; font-weight:700; color:#534AB7; font-family:monospace; }
.cpn-part-banner-desc { font-size:13px; font-weight:600; color:#111318; margin-top:1px; }
.cpn-existing { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:10px; padding:13px; }
.cpn-existing-hdr { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
.cpn-note-card { background:#F5F2EE; border-radius:8px; padding:10px 12px; margin-bottom:8px; border-left:2px solid #534AB7; }
.cpn-note-card.fleet-note { border-left-color:#3B6D11; background:#EAF3DE; }
.cpn-note-meta { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
.cpn-note-vendor { font-size:10px; font-weight:700; color:#534AB7; }
.cpn-note-card.fleet-note .cpn-note-vendor { color:#3B6D11; }
.cpn-note-date { font-size:10px; color:#B0AAA3; }
.cpn-note-title { font-size:12px; font-weight:600; color:#111318; margin-bottom:3px; }
.cpn-note-body { font-size:11px; color:#5A5F6E; line-height:1.5; }
.cpn-compose { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:10px; overflow:hidden; }
.cpn-compose-hdr { padding:11px 14px; border-bottom:0.5px solid #F0ECE8; font-size:12px; font-weight:600; color:#111318; display:flex; align-items:center; gap:6px; }
.cpn-compose-body { padding:14px; display:flex; flex-direction:column; gap:12px; }
.cpn-label { font-size:11px; font-weight:600; color:#5A5F6E; margin-bottom:4px; display:block; }
.cpn-input { width:100%; height:34px; border:0.5px solid #E2DDD8; border-radius:7px; padding:0 10px; font-size:12px; font-family:inherit; color:#111318; outline:none; background:#FFFFFF; }
.cpn-input:focus { border-color:#F5A623; }
.cpn-textarea { width:100%; min-height:90px; border:0.5px solid #E2DDD8; border-radius:7px; padding:9px 10px; font-size:12px; font-family:inherit; color:#111318; outline:none; resize:vertical; background:#FFFFFF; }
.cpn-textarea:focus { border-color:#F5A623; }
</style>
    <div style="display:flex;align-items:center;gap:10px;padding:14px 24px 10px;flex-shrink:0;">
      <button class="cms-btn-ghost" onclick="cmsGoList()"><i class="ti ti-arrow-left"></i> Back to articles</button>
      <div style="font-size:16px;font-weight:700;color:#111318;margin-left:4px;">Part Notes</div>
      <div style="font-size:12px;color:#9CA3AF;margin-top:1px;">Add fleet-internal notes to specific parts</div>
    </div>
    <div class="cpn-layout" style="flex:1;min-height:0;">
      <div class="cpn-tree">
        <div class="cpn-tree-hdr">
          <div class="cpn-tree-search-wrap">
            <i class="ti ti-search cpn-tree-search-icon"></i>
            <input class="cpn-tree-search" id="cpn-search" type="text" placeholder="Search parts…"/>
          </div>
        </div>
        <div class="cpn-tree-body" id="cpn-tree-body"></div>
      </div>
      <div class="cpn-main">
        <div class="cpn-main-inner" id="cpn-main-body">
          <div class="cpn-empty">
            <i class="ti ti-tag cpn-empty-icon"></i>
            Select a part to view or add fleet notes.
          </div>
        </div>
      </div>
    </div>`;

  const VENDOR_COLORS = { Skyjack:'#F5A623', Caterpillar:'#C2410C', Toyota:'#185FA5', Bobcat:'#534AB7' };
  let _cpnSearch = '';

  function renderCpnTree() {
    const treeBody = document.getElementById('cpn-tree-body');
    if (!treeBody) return;
    const q = _cpnSearch.toLowerCase().trim();
    let html = '';
    VENDOR_NAMES.forEach(v => {
      const cats = byVendor[v];
      if (!cats || !Object.keys(cats).length) return;
      const vOpen = _cmsPtExpandedVendors.has(v) || q;
      const vColor = VENDOR_COLORS[v] || '#9CA3AF';
      html += `<div class="cpn-vendor-hdr" onclick="cpnToggleVendor('${v}')">
        <div class="cpn-vendor-dot" style="background:${vColor};"></div>
        <span>${v}</span>
        ${!q ? `<i class="ti ti-chevron-right cpn-vendor-chevron ${vOpen?'open':''}"></i>` : ''}
      </div>`;
      if (vOpen) {
        Object.entries(cats).forEach(([cat, parts]) => {
          const visible = q ? parts.filter(p => p.description.toLowerCase().includes(q) || p.partNum.toLowerCase().includes(q)) : parts;
          if (!visible.length) return;
          const cKey = v + ':' + cat;
          const cOpen = _cmsPtExpandedCats.has(cKey) || q;
          html += `<div class="cpn-cat-hdr" onclick="cpnToggleCat('${cKey.replace(/'/g,"\\'")}')">
            <i class="ti ti-folder" style="font-size:11px;color:#B0AAA3;"></i>
            <span>${cat}</span>
            <span style="font-size:9px;font-weight:400;color:#C0BAB3;margin-left:3px;">${visible.length}</span>
            ${!q ? `<i class="ti ti-chevron-right cpn-cat-chevron ${cOpen?'open':''}"></i>` : ''}
          </div>`;
          if (cOpen) {
            visible.forEach(p => {
              html += `<div class="cpn-part-item ${_cmsPtSelectedPartId===p.id?'selected':''}" onclick="cpnSelectPart('${p.id}')">
                <span class="cpn-part-pnum">${p.partNum}</span>
                <span class="cpn-part-desc">${p.description}</span>
              </div>`;
            });
          }
        });
      }
    });
    if (!html) html = '<div style="padding:24px;text-align:center;color:#B0AAA3;font-size:12px;">No parts match.</div>';
    treeBody.innerHTML = html;
  }

  function renderCpnMain() {
    const mainBody = document.getElementById('cpn-main-body');
    if (!mainBody) return;
    if (!_cmsPtSelectedPartId) {
      mainBody.innerHTML = '<div class="cpn-empty"><i class="ti ti-tag cpn-empty-icon"></i>Select a part to view or add fleet notes.</div>';
      return;
    }
    const part = allParts.find(p => p.id === _cmsPtSelectedPartId);
    if (!part) return;

    const existingNotes = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).filter(a => a.showOnPartPage && a.targetPartNum === _cmsPtSelectedPartId);

    mainBody.innerHTML = `
      <div class="cpn-notes-area">
        <div class="cpn-part-banner">
          <i class="ti ti-tag" style="font-size:15px;color:#534AB7;flex-shrink:0;"></i>
          <div>
            <div class="cpn-part-banner-pnum">${part.partNum}</div>
            <div class="cpn-part-banner-desc">${part.description}</div>
          </div>
          <div style="margin-left:auto;font-size:11px;color:#9CA3AF;">${part.vendor}</div>
        </div>
        ${existingNotes.length ? `
        <div class="cpn-existing">
          <div class="cpn-existing-hdr"><i class="ti ti-notes" style="font-size:12px;"></i> Existing notes (${existingNotes.length})</div>
          ${existingNotes.map(a => {
            const isFleet = !!a.fleetNote;
            return `<div class="cpn-note-card ${isFleet?'fleet-note':''}">
              <div class="cpn-note-meta">
                <span class="cpn-note-vendor">${a.vendorName || (isFleet ? 'Fleet' : 'Supplier')}</span>
                <span style="font-size:9px;color:#D0CBB4;">&bull;</span>
                <span class="cpn-note-date">${a.date || ''}</span>
              </div>
              <div class="cpn-note-title">${a.title}</div>
              <div class="cpn-note-body">${a.body ? a.body.slice(0,200) + (a.body.length>200?'…':'') : ''}</div>
            </div>`;
          }).join('')}
        </div>` : ''}
        <div class="cpn-compose">
          <div class="cpn-compose-hdr"><i class="ti ti-pencil" style="font-size:13px;color:#9CA3AF;"></i> Add fleet note</div>
          <div class="cpn-compose-body">
            <div>
              <label class="cpn-label">Note title *</label>
              <input class="cpn-input" id="cpn-note-title" type="text" placeholder="e.g. Only use OEM seal kit on this model"/>
              <div id="cpn-note-title-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
            </div>
            <div>
              <label class="cpn-label">Note body *</label>
              <textarea class="cpn-textarea" id="cpn-note-body" placeholder="Internal fleet note visible to mechanics viewing this part's page…"></textarea>
              <div id="cpn-note-body-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;">
              <button class="cms-btn-ghost" onclick="document.getElementById('cpn-note-title').value='';document.getElementById('cpn-note-body').value='';">Clear</button>
              <button class="cms-btn-primary" id="cpn-save-note-btn"><i class="ti ti-send"></i> Save note</button>
            </div>
            <div id="cpn-note-confirm" style="font-size:12px;color:#0F6E56;display:none;"><i class="ti ti-circle-check"></i> Note saved and visible on part page.</div>
          </div>
        </div>
      </div>`;

    document.getElementById('cpn-save-note-btn').addEventListener('click', function() {
      const title = document.getElementById('cpn-note-title').value.trim();
      const body  = document.getElementById('cpn-note-body').value.trim();
      document.getElementById('cpn-note-title-err').style.display = title ? 'none' : 'block';
      document.getElementById('cpn-note-body-err').style.display  = body  ? 'none' : 'block';
      if (!title || !body) return;
      const _user = Store.getCurrentUser();
      Store.saveCmsArticle({
        id: 'cms-fleet-note-' + Date.now(),
        type: 'notice',
        subtype: 'fleet-part-note',
        status: 'published',
        postAs: 'news',
        title,
        body,
        author: (_user || {}).displayName || '',
        poster: (_user || {}).shortName || '',
        showOnPartPage: true,
        targetPartNum: _cmsPtSelectedPartId,
        targetPartDesc: part.description,
        fleetNote: true,
        date: 'Jul 2026',
        priority: 'low',
        locations: ['all'],
      });
      document.getElementById('cpn-note-title').value = '';
      document.getElementById('cpn-note-body').value = '';
      const confirmEl = document.getElementById('cpn-note-confirm');
      if (confirmEl) { confirmEl.style.display = 'block'; setTimeout(() => { if (confirmEl) confirmEl.style.display = 'none'; }, 3000); }
      // Re-render to show the new note in the existing list
      renderCpnMain();
    });
  }

  window.cpnToggleVendor = function(v) {
    if (_cmsPtExpandedVendors.has(v)) { _cmsPtExpandedVendors.delete(v); } else { _cmsPtExpandedVendors.add(v); }
    renderCpnTree();
  };
  window.cpnToggleCat = function(key) {
    if (_cmsPtExpandedCats.has(key)) { _cmsPtExpandedCats.delete(key); } else { _cmsPtExpandedCats.add(key); }
    renderCpnTree();
  };
  window.cpnSelectPart = function(partId) {
    _cmsPtSelectedPartId = partId;
    renderCpnTree();
    renderCpnMain();
  };

  renderCpnTree();

  document.getElementById('cpn-search').addEventListener('input', function() {
    _cpnSearch = this.value;
    renderCpnTree();
  });
}

// Action bar rendered outside the scrollable content
function cmsRenderActionBar() {
  // Injected by the view's template — handled below
}
