// ── Help Widget — universal floating chatbot, tickets & knowledge base ──────

const HelpWidget = (() => {
  let _open = false;
  let _tab = 'chat';          // 'chat' | 'articles' | 'ticket'
  let _chatMessages = [];
  let _articleSearch = '';
  let _ticketSubmitted = false;
  let _botTyping = false;

  // ── Mock knowledge base ──────────────────────────────────────────────────
  const KB_ARTICLES = [
    { id:'kb-01', cat:'Orders',       title:'How to submit a parts order',              body:'Navigate to Parts Search, add items to your cart, then proceed through the order review screen. Orders are submitted electronically to your supplier and tracked under Order History.' },
    { id:'kb-02', cat:'Orders',       title:'How to check order status',                body:'Open Order History from the sidebar. Each order shows a status badge (Submitted, In Review, Fulfilled). Tap any order row to see supplier messages and line-item detail.' },
    { id:'kb-03', cat:'Work Orders',  title:'Creating a new work order',                body:'Go to Work Orders → New. Fill in the equipment serial, fault description, and assign a mechanic. Work orders can be linked to parts orders and tracked through to completion.' },
    { id:'kb-04', cat:'Work Orders',  title:'Attaching parts to a work order',          body:'Open the work order detail page. Use the "Add Parts" button to search the catalog and link parts. Linked parts will be pre-populated when creating a parts order from that WO.' },
    { id:'kb-05', cat:'Parts Search', title:'Browsing parts by equipment model',        body:'Use the tree navigator on the left of Parts Search to drill down by manufacturer → model → component. You can also search by part number or description in the search bar.' },
    { id:'kb-06', cat:'Parts Search', title:'Understanding OEM vs. aftermarket parts',  body:'Parts marked OEM are original equipment manufacturer parts. Aftermarket alternatives are shown with a lower price. Your supervisor may have configured approval requirements for aftermarket substitutions.' },
    { id:'kb-07', cat:'Parts Search', title:'Requesting a price on a part',             body:'If a part shows "Price on request", tap the part then use the "Request Price" button. Your supplier will receive the request and respond typically within 24 hours.' },
    { id:'kb-08', cat:'Approvals',    title:'Why is my order pending approval?',        body:'Orders over a configurable dollar threshold, or containing OEM-only parts, require supervisor sign-off. You\'ll receive a notification when approved or if more information is needed.' },
    { id:'kb-09', cat:'Approvals',    title:'Approving or rejecting an order',          body:'Supervisors can review pending orders under Approvals in the sidebar. Each request shows the mechanic, WO link, line items, and total. Tap Approve or Return for revision.' },
    { id:'kb-10', cat:'Suppliers',    title:'How suppliers post content to fleets',     body:'Suppliers use the Content tab in the Supplier Portal to publish bulletins, safety notices, and promotions. Content can be targeted to specific fleets and placed in the news feed, order pages, or individual part detail pages.' },
    { id:'kb-11', cat:'Suppliers',    title:'Responding to a price request',            body:'Open Price Requests in your supplier portal. Locate the request and tap Respond. Enter your quoted price and lead time. The fleet will be notified and the status updates automatically.' },
    { id:'kb-12', cat:'Account',      title:'Changing your display name or password',   body:'Click your avatar in the top-right corner and open Account Settings. You can update your display name and password from there. Contact your administrator to change your role or fleet assignment.' },
    { id:'kb-13', cat:'Diagnostics',  title:'Running a diagnostic on a machine',        body:'Go to Diagnostics in the sidebar, select the machine model, then upload a fault code export or enter codes manually. The system maps codes to likely root causes and recommended parts.' },
    { id:'kb-14', cat:'Manuals',      title:'Downloading a service manual',             body:'Open Manuals from the sidebar. Filter by manufacturer or model. Tap View to read inline or Download to save a copy. Manuals are updated when your supplier publishes new revisions.' },
    { id:'kb-15', cat:'Analytics',    title:'Understanding the analytics dashboard',    body:'The Analytics tab shows order volume, spend by vendor, top parts, and WO completion rates. Use the period filter (7D, 30D, 90D, 12M) and location pills to slice the data.' },
  ];

  // ── Scripted chatbot ─────────────────────────────────────────────────────
  const BOT_RULES = [
    { match: /order|cart|checkout|submit/i,    articles: ['kb-01','kb-02','kb-08'], reply: 'I can help with orders! You can submit parts orders through Parts Search → cart → Order Review. Would you like to see the relevant help articles, or do you want to open a support ticket?' },
    { match: /work.?order|wo\b/i,              articles: ['kb-03','kb-04'],         reply: 'Work orders let you track repairs end-to-end and link them to parts. Want me to show you the help articles, or connect you with support?' },
    { match: /part|catalog|search|sku|price.?request/i, articles: ['kb-05','kb-06','kb-07'], reply: 'Parts Search has a full equipment tree, OEM/aftermarket filters, and price-request flow for unlisted items. Shall I pull up the relevant articles?' },
    { match: /approv/i,                        articles: ['kb-08','kb-09'],         reply: 'Approvals route high-value or OEM-only orders to supervisors before submission. I can show you how it works or raise a ticket if something seems stuck.' },
    { match: /supplier|bulletin|content|post/i,articles: ['kb-10','kb-11'],         reply: 'Suppliers publish content through their portal — bulletins, pricing updates, and part-level messages. Want the how-to articles?' },
    { match: /manual|doc|pdf|download/i,       articles: ['kb-14'],                 reply: 'Manuals are available in the Manuals section, filterable by type and model. Want me to link you there, or can I show the help article?' },
    { match: /diagnos|fault.?code|dtc/i,       articles: ['kb-13'],                 reply: 'Diagnostics lets you map fault codes to root causes and recommended parts. Here\'s the relevant article.' },
    { match: /analytic|report|dashboard|spend/i,articles:['kb-15'],                 reply: 'The Analytics dashboard covers spend, vendor breakdown, top parts, and WO stats. Want to see the guide?' },
    { match: /password|login|account|profile/i,articles: ['kb-12'],                 reply: 'For account changes, your avatar menu (top-right) covers display name and password. Admins handle role changes.' },
    { match: /ticket|support|bug|broken|issue|error|problem/i, articles: [],        reply: 'Sorry to hear something\'s not working right. Let me help you open a support ticket so our team can look into it.', action: 'ticket' },
    { match: /hello|hi\b|hey|help/i,           articles: [],                        reply: 'Hi there! I\'m the SmartEquip support assistant. I can help with orders, parts, work orders, approvals, manuals, and more — or I can open a support ticket for anything that needs human attention. What can I help you with?' },
    { match: /thank/i,                         articles: [],                        reply: 'Happy to help! Let me know if anything else comes up.' },
  ];

  const FALLBACK_REPLY = 'I\'m not sure about that specific question. Would you like me to search the knowledge base, or would you prefer to open a support ticket for our support team?';

  function getBotResponse(input) {
    const rule = BOT_RULES.find(r => r.match.test(input));
    if (!rule) return { reply: FALLBACK_REPLY, articles: [], action: null };
    return { reply: rule.reply, articles: rule.articles || [], action: rule.action || null };
  }

  // ── Escape util ──────────────────────────────────────────────────────────
  function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Build & inject DOM ───────────────────────────────────────────────────
  function init() {
    if (document.getElementById('hw-root')) return;

    const style = document.createElement('style');
    style.textContent = `
/* ── Help Widget ── */
#hw-fab { position:fixed; bottom:24px; right:24px; z-index:9000; width:52px; height:52px; border-radius:50%; background:#111318; color:#FFFFFF; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 18px rgba(0,0,0,.28); transition:transform .15s, background .15s; }
#hw-fab:hover { background:#2A2D3A; transform:scale(1.07); }
#hw-fab .hw-badge { position:absolute; top:2px; right:2px; width:16px; height:16px; background:#F5A623; border-radius:50%; font-size:9px; font-weight:700; color:#1A1200; display:flex; align-items:center; justify-content:center; border:2px solid #FFFFFF; display:none; }
#hw-panel { position:fixed; bottom:88px; right:24px; z-index:9000; width:380px; max-width:calc(100vw - 32px); background:#FFFFFF; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,.18); display:flex; flex-direction:column; overflow:hidden; transition:opacity .18s, transform .18s; transform-origin:bottom right; }
#hw-panel.hw-hidden { opacity:0; pointer-events:none; transform:scale(.94) translateY(8px); }
.hw-header { background:#111318; color:#FFFFFF; padding:14px 16px 12px; display:flex; align-items:center; gap:10px; flex-shrink:0; }
.hw-header-icon { width:32px; height:32px; border-radius:9px; background:#F5A623; display:flex; align-items:center; justify-content:center; font-size:15px; color:#1A1200; flex-shrink:0; }
.hw-header-title { font-size:14px; font-weight:700; flex:1; }
.hw-header-sub { font-size:11px; color:#9CA3AF; margin-top:1px; }
.hw-close-btn { background:none; border:none; color:#9CA3AF; font-size:18px; cursor:pointer; padding:2px; line-height:1; }
.hw-close-btn:hover { color:#FFFFFF; }
.hw-tabs { display:flex; border-bottom:1px solid #F0ECE8; flex-shrink:0; background:#FAFAF8; }
.hw-tab { flex:1; padding:10px 6px; font-size:12px; font-weight:600; color:#7A7F8E; text-align:center; cursor:pointer; border-bottom:2px solid transparent; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:5px; }
.hw-tab.active { color:#111318; border-bottom-color:#F5A623; background:#FFFFFF; }
.hw-tab:hover:not(.active) { background:#F5F2EE; color:#3A3D4A; }
.hw-body { flex:1; overflow:hidden; display:flex; flex-direction:column; min-height:0; }
/* ── Chat ── */
.hw-chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; min-height:280px; max-height:340px; }
.hw-msg { display:flex; flex-direction:column; gap:3px; max-width:86%; }
.hw-msg.bot { align-self:flex-start; }
.hw-msg.user { align-self:flex-end; }
.hw-msg-bubble { padding:9px 12px; border-radius:12px; font-size:13px; line-height:1.55; }
.hw-msg.bot .hw-msg-bubble { background:#F5F2EE; color:#111318; border-radius:12px 12px 12px 3px; }
.hw-msg.user .hw-msg-bubble { background:#111318; color:#FFFFFF; border-radius:12px 12px 3px 12px; }
.hw-msg-time { font-size:10px; color:#C0BAB3; }
.hw-msg.user .hw-msg-time { text-align:right; }
.hw-msg-articles { display:flex; flex-direction:column; gap:5px; margin-top:4px; }
.hw-msg-article-link { font-size:11px; font-weight:600; color:#534AB7; background:#EEEDFE; border-radius:6px; padding:5px 9px; cursor:pointer; display:flex; align-items:center; gap:5px; border:none; font-family:inherit; text-align:left; }
.hw-msg-article-link:hover { background:#DDD9FB; }
.hw-msg-action-btn { font-size:11px; font-weight:600; color:#0F6E56; background:#E1F5EE; border-radius:6px; padding:5px 9px; cursor:pointer; display:flex; align-items:center; gap:5px; border:none; font-family:inherit; margin-top:3px; }
.hw-msg-action-btn:hover { background:#C7EEE0; }
.hw-typing { display:flex; align-items:center; gap:4px; padding:10px 14px; }
.hw-typing span { width:7px; height:7px; border-radius:50%; background:#C0BAB3; display:inline-block; animation:hw-bounce .9s infinite; }
.hw-typing span:nth-child(2) { animation-delay:.15s; }
.hw-typing span:nth-child(3) { animation-delay:.3s; }
@keyframes hw-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
.hw-chat-input-row { display:flex; gap:8px; padding:12px; border-top:0.5px solid #F0ECE8; flex-shrink:0; }
.hw-chat-input { flex:1; height:36px; border:1px solid #E2DDD8; border-radius:9px; padding:0 12px; font-size:13px; font-family:inherit; color:#111318; outline:none; background:#FAFAF8; }
.hw-chat-input:focus { border-color:#F5A623; background:#FFFFFF; }
.hw-chat-send { width:36px; height:36px; border-radius:9px; background:#111318; color:#FFFFFF; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
.hw-chat-send:hover { background:#2A2D3A; }
/* ── Articles ── */
.hw-articles-search-wrap { padding:12px; border-bottom:0.5px solid #F0ECE8; position:relative; flex-shrink:0; }
.hw-articles-search-icon { position:absolute; left:22px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:14px; pointer-events:none; }
.hw-articles-search { width:100%; height:34px; background:#F5F2EE; border:1px solid #E2DDD8; border-radius:8px; padding:0 10px 0 32px; font-size:12px; font-family:inherit; color:#111318; outline:none; }
.hw-articles-search:focus { border-color:#F5A623; background:#FFFFFF; }
.hw-articles-list { flex:1; overflow-y:auto; padding:8px; max-height:380px; }
.hw-article-cat-label { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#9CA3AF; padding:8px 8px 4px; }
.hw-article-row { padding:9px 10px; border-radius:8px; cursor:pointer; border:0.5px solid transparent; margin-bottom:3px; }
.hw-article-row:hover { background:#F5F2EE; border-color:#E2DDD8; }
.hw-article-title { font-size:12px; font-weight:600; color:#111318; }
.hw-article-body { font-size:11px; color:#7A7F8E; margin-top:2px; line-height:1.45; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hw-article-detail { padding:14px; display:none; flex-direction:column; gap:10px; overflow-y:auto; max-height:430px; }
.hw-article-detail.active { display:flex; }
.hw-article-back { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#534AB7; cursor:pointer; background:none; border:none; font-family:inherit; padding:0; }
.hw-article-back:hover { color:#3B31A3; }
.hw-article-detail-title { font-size:14px; font-weight:700; color:#111318; }
.hw-article-detail-cat { display:inline-flex; align-items:center; font-size:10px; font-weight:700; background:#EEEDFE; color:#534AB7; border-radius:5px; padding:2px 8px; }
.hw-article-detail-body { font-size:13px; color:#3A3D4A; line-height:1.7; }
/* ── Ticket ── */
.hw-ticket-body { flex:1; overflow-y:auto; padding:14px; max-height:430px; }
.hw-ticket-field { margin-bottom:12px; }
.hw-ticket-label { font-size:11px; font-weight:600; color:#5A5F6E; text-transform:uppercase; letter-spacing:.6px; margin-bottom:4px; display:block; }
.hw-ticket-input { width:100%; height:34px; border:0.5px solid #E2DDD8; border-radius:8px; padding:0 10px; font-size:12px; font-family:inherit; color:#111318; outline:none; background:#FFFFFF; }
.hw-ticket-input:focus { border-color:#F5A623; }
.hw-ticket-select { width:100%; height:34px; border:0.5px solid #E2DDD8; border-radius:8px; padding:0 10px; font-size:12px; font-family:inherit; color:#111318; outline:none; background:#FFFFFF; cursor:pointer; }
.hw-ticket-select:focus { border-color:#F5A623; }
.hw-ticket-textarea { width:100%; min-height:90px; border:0.5px solid #E2DDD8; border-radius:8px; padding:8px 10px; font-size:12px; font-family:inherit; color:#111318; outline:none; resize:vertical; background:#FFFFFF; }
.hw-ticket-textarea:focus { border-color:#F5A623; }
.hw-ticket-submit { width:100%; height:38px; background:#111318; color:#FFFFFF; border:none; border-radius:9px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; margin-top:4px; }
.hw-ticket-submit:hover { background:#2A2D3A; }
.hw-ticket-success { text-align:center; padding:28px 20px; display:flex; flex-direction:column; align-items:center; gap:10px; }
.hw-ticket-success-icon { width:48px; height:48px; border-radius:50%; background:#E1F5EE; display:flex; align-items:center; justify-content:center; font-size:22px; color:#0F6E56; }
.hw-ticket-success-title { font-size:14px; font-weight:700; color:#111318; }
.hw-ticket-success-sub { font-size:12px; color:#7A7F8E; line-height:1.6; }
.hw-ticket-new-btn { font-size:12px; font-weight:600; color:#534AB7; background:none; border:none; cursor:pointer; font-family:inherit; margin-top:6px; }
.hw-ticket-new-btn:hover { text-decoration:underline; }
`;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'hw-root';
    root.innerHTML = `
      <button id="hw-fab" title="Help &amp; Support" onclick="HelpWidget.toggle()">
        <i class="ti ti-help"></i>
        <span class="hw-badge" id="hw-badge"></span>
      </button>
      <div id="hw-panel" class="hw-hidden">
        <div class="hw-header">
          <div class="hw-header-icon"><i class="ti ti-headset"></i></div>
          <div>
            <div class="hw-header-title">SmartEquip Support</div>
            <div class="hw-header-sub">Chat · Articles · Tickets</div>
          </div>
          <button class="hw-close-btn" onclick="HelpWidget.close()" title="Close"><i class="ti ti-x"></i></button>
        </div>
        <div class="hw-tabs">
          <div class="hw-tab active" id="hw-tab-chat" onclick="HelpWidget.setTab('chat')"><i class="ti ti-message-circle" style="font-size:14px;"></i> Chat</div>
          <div class="hw-tab" id="hw-tab-articles" onclick="HelpWidget.setTab('articles')"><i class="ti ti-book" style="font-size:14px;"></i> Articles</div>
          <div class="hw-tab" id="hw-tab-ticket" onclick="HelpWidget.setTab('ticket')"><i class="ti ti-ticket" style="font-size:14px;"></i> Open Ticket</div>
        </div>
        <div class="hw-body" id="hw-body"></div>
      </div>`;
    document.body.appendChild(root);

    // Seed welcome message
    _chatMessages = [{
      role: 'bot',
      text: 'Hi! I\'m the SmartEquip support assistant. Ask me anything about orders, parts, work orders, approvals, or manuals — or I can open a support ticket for you.',
      time: nowLabel(),
      articles: [],
    }];

    renderTab();
  }

  function nowLabel() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }

  // ── Tab rendering ────────────────────────────────────────────────────────
  function renderTab() {
    document.querySelectorAll('.hw-tab').forEach(t => t.classList.remove('active'));
    const activeTabEl = document.getElementById('hw-tab-' + _tab);
    if (activeTabEl) activeTabEl.classList.add('active');
    const body = document.getElementById('hw-body');
    if (!body) return;
    if (_tab === 'chat')     renderChat(body);
    if (_tab === 'articles') renderArticles(body);
    if (_tab === 'ticket')   renderTicket(body);
  }

  // ── Chat ─────────────────────────────────────────────────────────────────
  function renderChat(body) {
    body.innerHTML = `
      <div class="hw-chat-messages" id="hw-chat-msgs"></div>
      <div class="hw-chat-input-row">
        <input class="hw-chat-input" id="hw-chat-input" type="text" placeholder="Ask a question…" autocomplete="off"/>
        <button class="hw-chat-send" id="hw-chat-send" title="Send"><i class="ti ti-send"></i></button>
      </div>`;
    renderChatMessages();
    const input = document.getElementById('hw-chat-input');
    const send = document.getElementById('hw-chat-send');
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
      setTimeout(() => input.focus(), 60);
    }
    if (send) send.addEventListener('click', sendChat);
  }

  function renderChatMessages() {
    const el = document.getElementById('hw-chat-msgs');
    if (!el) return;
    el.innerHTML = _chatMessages.map(m => {
      const articleLinks = (m.articles || []).map(id => {
        const a = KB_ARTICLES.find(x => x.id === id);
        if (!a) return '';
        return `<button class="hw-msg-article-link" onclick="HelpWidget.openArticleFromChat('${a.id}')"><i class="ti ti-book" style="font-size:11px;"></i> ${esc(a.title)}</button>`;
      }).join('');
      const actionBtn = m.action === 'ticket'
        ? `<button class="hw-msg-action-btn" onclick="HelpWidget.setTab('ticket')"><i class="ti ti-ticket" style="font-size:11px;"></i> Open a support ticket</button>`
        : (m.articles && m.articles.length ? `<button class="hw-msg-action-btn" onclick="HelpWidget.setTab('articles')"><i class="ti ti-search" style="font-size:11px;"></i> Browse all articles</button>` : '');
      return `<div class="hw-msg ${m.role}">
        <div class="hw-msg-bubble">${esc(m.text).replace(/\n/g,'<br>')}</div>
        ${articleLinks ? `<div class="hw-msg-articles">${articleLinks}${actionBtn}</div>` : (actionBtn ? `<div class="hw-msg-articles">${actionBtn}</div>` : '')}
        <div class="hw-msg-time">${m.time}</div>
      </div>`;
    }).join('');
    if (_botTyping) {
      el.innerHTML += `<div class="hw-msg bot" id="hw-typing-indicator"><div class="hw-typing"><span></span><span></span><span></span></div></div>`;
    }
    el.scrollTop = el.scrollHeight;
  }

  function sendChat() {
    const input = document.getElementById('hw-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || _botTyping) return;
    input.value = '';
    _chatMessages.push({ role:'user', text, time: nowLabel(), articles:[] });
    _botTyping = true;
    renderChatMessages();
    setTimeout(() => {
      const { reply, articles, action } = getBotResponse(text);
      _botTyping = false;
      _chatMessages.push({ role:'bot', text: reply, time: nowLabel(), articles, action });
      renderChatMessages();
      if (action === 'ticket') {
        setTimeout(() => { _tab = 'ticket'; renderTab(); }, 900);
      }
    }, 700 + Math.random() * 400);
  }

  // ── Articles ─────────────────────────────────────────────────────────────
  let _articleDetailId = null;

  function renderArticles(body) {
    body.innerHTML = `
      <div class="hw-articles-search-wrap">
        <i class="ti ti-search hw-articles-search-icon"></i>
        <input class="hw-articles-search" id="hw-art-search" type="text" placeholder="Search articles…" value="${esc(_articleSearch)}"/>
      </div>
      <div class="hw-articles-list" id="hw-art-list"></div>
      <div class="hw-article-detail" id="hw-art-detail"></div>`;
    renderArticleList();
    const searchEl = document.getElementById('hw-art-search');
    if (searchEl) searchEl.addEventListener('input', function() { _articleSearch = this.value; _articleDetailId = null; renderArticleList(); });
    if (_articleDetailId) showArticleDetail(_articleDetailId);
  }

  function renderArticleList() {
    const listEl = document.getElementById('hw-art-list');
    const detailEl = document.getElementById('hw-art-detail');
    if (!listEl) return;
    if (_articleDetailId) {
      listEl.style.display = 'none';
      if (detailEl) detailEl.classList.add('active');
      showArticleDetail(_articleDetailId);
      return;
    }
    listEl.style.display = '';
    if (detailEl) detailEl.classList.remove('active');
    const q = _articleSearch.toLowerCase().trim();
    const filtered = q ? KB_ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q)) : KB_ARTICLES;
    if (!filtered.length) { listEl.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:12px;">No articles match your search.</div>'; return; }
    const byCat = {};
    filtered.forEach(a => { if (!byCat[a.cat]) byCat[a.cat] = []; byCat[a.cat].push(a); });
    listEl.innerHTML = Object.entries(byCat).map(([cat, arts]) =>
      `<div class="hw-article-cat-label">${esc(cat)}</div>` +
      arts.map(a => `<div class="hw-article-row" onclick="HelpWidget.showArticle('${a.id}')">
        <div class="hw-article-title">${esc(a.title)}</div>
        <div class="hw-article-body">${esc(a.body)}</div>
      </div>`).join('')
    ).join('');
  }

  function showArticleDetail(id) {
    _articleDetailId = id;
    const a = KB_ARTICLES.find(x => x.id === id);
    if (!a) return;
    const listEl = document.getElementById('hw-art-list');
    const detailEl = document.getElementById('hw-art-detail');
    if (listEl) listEl.style.display = 'none';
    if (detailEl) {
      detailEl.classList.add('active');
      detailEl.innerHTML = `
        <button class="hw-article-back" onclick="HelpWidget.backToList()"><i class="ti ti-arrow-left" style="font-size:13px;"></i> Back to articles</button>
        <div><span class="hw-article-detail-cat">${esc(a.cat)}</span></div>
        <div class="hw-article-detail-title">${esc(a.title)}</div>
        <div class="hw-article-detail-body">${esc(a.body)}</div>
        <div style="margin-top:12px;padding-top:12px;border-top:0.5px solid #F0ECE8;">
          <div style="font-size:11px;color:#9CA3AF;margin-bottom:8px;">Was this helpful?</div>
          <div style="display:flex;gap:8px;">
            <button style="font-size:12px;font-weight:600;padding:5px 14px;border-radius:7px;border:0.5px solid #E2DDD8;background:#FFFFFF;cursor:pointer;font-family:inherit;" onclick="HelpWidget.articleFeedback(true,'${a.id}')">👍 Yes</button>
            <button style="font-size:12px;font-weight:600;padding:5px 14px;border-radius:7px;border:0.5px solid #E2DDD8;background:#FFFFFF;cursor:pointer;font-family:inherit;" onclick="HelpWidget.articleFeedback(false,'${a.id}')">👎 No — open a ticket</button>
          </div>
          <div id="hw-art-feedback-msg" style="display:none;font-size:12px;color:#0F6E56;margin-top:8px;"><i class="ti ti-circle-check"></i> Thanks for your feedback!</div>
        </div>`;
    }
  }

  // ── Ticket ───────────────────────────────────────────────────────────────
  function renderTicket(body) {
    if (_ticketSubmitted) {
      renderTicketSuccess(body);
      return;
    }
    const user = (typeof Store !== 'undefined' && Store.getCurrentUser) ? Store.getCurrentUser() : null;
    body.innerHTML = `
      <div class="hw-ticket-body">
        <div class="hw-ticket-field">
          <label class="hw-ticket-label">Your name</label>
          <input class="hw-ticket-input" id="hw-tk-name" type="text" placeholder="Full name" value="${esc((user||{}).displayName||'')}"/>
        </div>
        <div class="hw-ticket-field">
          <label class="hw-ticket-label">Category</label>
          <select class="hw-ticket-select" id="hw-tk-cat">
            <option value="">Select a category…</option>
            <option value="orders">Orders &amp; Approvals</option>
            <option value="parts">Parts Search &amp; Catalog</option>
            <option value="work-orders">Work Orders</option>
            <option value="supplier">Supplier Portal</option>
            <option value="manuals">Manuals &amp; Docs</option>
            <option value="account">Account &amp; Access</option>
            <option value="bug">Bug / Technical Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="hw-ticket-field">
          <label class="hw-ticket-label">Priority</label>
          <select class="hw-ticket-select" id="hw-tk-priority">
            <option value="low">Low — general question</option>
            <option value="medium">Medium — something isn't working right</option>
            <option value="high">High — blocking my work</option>
            <option value="critical">Critical — system down / data issue</option>
          </select>
        </div>
        <div class="hw-ticket-field">
          <label class="hw-ticket-label">Subject *</label>
          <input class="hw-ticket-input" id="hw-tk-subject" type="text" placeholder="Brief description of your issue"/>
          <div id="hw-tk-subject-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <div class="hw-ticket-field">
          <label class="hw-ticket-label">Description *</label>
          <textarea class="hw-ticket-textarea" id="hw-tk-body" placeholder="Please describe what you were doing and what happened. Include any error messages or steps to reproduce."></textarea>
          <div id="hw-tk-body-err" style="font-size:11px;color:#A32D2D;margin-top:3px;display:none;">Required</div>
        </div>
        <button class="hw-ticket-submit" id="hw-tk-submit"><i class="ti ti-send"></i> Submit ticket</button>
      </div>`;

    document.getElementById('hw-tk-submit').addEventListener('click', function() {
      const subject = (document.getElementById('hw-tk-subject')||{}).value?.trim();
      const desc    = (document.getElementById('hw-tk-body')||{}).value?.trim();
      document.getElementById('hw-tk-subject-err').style.display = subject ? 'none' : 'block';
      document.getElementById('hw-tk-body-err').style.display    = desc    ? 'none' : 'block';
      if (!subject || !desc) return;
      _ticketSubmitted = true;
      renderTicketSuccess(body);
    });
  }

  function renderTicketSuccess(body) {
    const ticketId = 'TKT-' + Math.floor(10000 + Math.random() * 90000);
    body.innerHTML = `
      <div class="hw-ticket-body">
        <div class="hw-ticket-success">
          <div class="hw-ticket-success-icon"><i class="ti ti-circle-check"></i></div>
          <div class="hw-ticket-success-title">Ticket submitted!</div>
          <div style="font-size:11px;font-weight:700;color:#534AB7;background:#EEEDFE;border-radius:6px;padding:3px 12px;">${ticketId}</div>
          <div class="hw-ticket-success-sub">Our support team will get back to you within one business day. You'll receive a confirmation email with your ticket number.</div>
          <button class="hw-ticket-new-btn" onclick="HelpWidget.newTicket()"><i class="ti ti-plus" style="font-size:11px;"></i> Open another ticket</button>
        </div>
      </div>`;
  }

  // ── Public API ───────────────────────────────────────────────────────────
  return {
    init,
    toggle() {
      _open ? this.close() : this.open();
    },
    open() {
      _open = true;
      const fab = document.getElementById('hw-fab');
      const panel = document.getElementById('hw-panel');
      if (fab) fab.innerHTML = '<i class="ti ti-x"></i><span class="hw-badge" id="hw-badge"></span>';
      if (panel) panel.classList.remove('hw-hidden');
      renderTab();
    },
    close() {
      _open = false;
      const fab = document.getElementById('hw-fab');
      const panel = document.getElementById('hw-panel');
      if (fab) fab.innerHTML = '<i class="ti ti-help"></i><span class="hw-badge" id="hw-badge"></span>';
      if (panel) panel.classList.add('hw-hidden');
    },
    setTab(tab) {
      _tab = tab;
      if (!_open) this.open();
      else renderTab();
    },
    showArticle(id) {
      _tab = 'articles';
      _articleDetailId = id;
      renderTab();
    },
    openArticleFromChat(id) {
      _articleDetailId = id;
      _tab = 'articles';
      renderTab();
    },
    backToList() {
      _articleDetailId = null;
      renderArticleList();
      const listEl = document.getElementById('hw-art-list');
      const detailEl = document.getElementById('hw-art-detail');
      if (listEl) listEl.style.display = '';
      if (detailEl) detailEl.classList.remove('active');
    },
    articleFeedback(helpful, id) {
      if (!helpful) {
        _tab = 'ticket';
        _ticketSubmitted = false;
        renderTab();
        return;
      }
      const msgEl = document.getElementById('hw-art-feedback-msg');
      if (msgEl) msgEl.style.display = 'block';
    },
    newTicket() {
      _ticketSubmitted = false;
      renderTicket(document.getElementById('hw-body'));
    },
  };
})();
