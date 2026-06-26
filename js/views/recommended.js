function render_recommended(el) {
  el.innerHTML = `
<style>
.rec-content { flex: 1; padding: 24px; overflow-y: auto; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 20px; font-weight: 700; color: #111318; letter-spacing: -0.3px; }
.page-title-sub { font-size: 13px; color: #7A7F8E; margin-top: 3px; }
.category-filter { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.cat-pill { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid transparent; display: flex; align-items: center; gap: 6px; font-family: inherit; }
.cat-pill.all { background: #1E1E1E; color: #FFFFFF; border-color: #1E1E1E; }
.cat-pill.inactive { background: #FFFFFF; color: #5A5F6E; border-color: #E2DDD8; }
.cat-pill.inactive:hover { border-color: #C8C3BC; color: #111318; }
.rec-section { margin-bottom: 32px; }
.rec-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.rec-section-left { display: flex; align-items: center; gap: 10px; }
.rec-section-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.icon-amber { background: #FAEEDA; color: #854F0B; }
.icon-blue { background: #E6F1FB; color: #185FA5; }
.icon-purple { background: #EEEDFE; color: #534AB7; }
.icon-green { background: #EAF3DE; color: #3B6D11; }
.icon-teal { background: #E1F5EE; color: #0F6E56; }
.rec-section-title { font-size: 15px; font-weight: 700; color: #111318; letter-spacing: -0.2px; }
.rec-section-sub { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.see-all-btn { font-size: 12px; color: #F5A623; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 4px; background: none; border: none; font-family: inherit; }
.parts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.part-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; cursor: pointer; }
.part-card:hover { border-color: #C8C3BC; }
.part-card-top { display: flex; align-items: flex-start; gap: 10px; }
.part-thumb { width: 44px; height: 44px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #C8C3BC; flex-shrink: 0; }
.part-card-info { flex: 1; min-width: 0; }
.part-card-name { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 2px; line-height: 1.3; }
.part-card-num { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 5px; }
.part-card-reason { font-size: 11px; color: #7A7F8E; line-height: 1.5; padding: 8px 10px; background: #F5F2EE; border-radius: 7px; }
.part-card-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 0.5px solid #F0ECE8; }
.part-card-price { font-size: 14px; font-weight: 700; color: #111318; }
.part-card-avail { display: flex; align-items: center; gap: 4px; font-size: 11px; }
.avail-dot { width: 6px; height: 6px; border-radius: 50%; }
.avail-dot.green { background: #639922; }
.avail-dot.amber { background: #BA7517; }
.avail-label.green { color: #3B6D11; }
.avail-label.amber { color: #854F0B; }
.add-cart-btn { background: #F5A623; border: none; border-radius: 7px; padding: 5px 12px; font-size: 11px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; }
.add-cart-btn:hover { background: #E8980F; }
.service-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; overflow: hidden; }
.service-card-header { padding: 12px 14px; border-bottom: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; }
.service-card-machine { display: flex; align-items: center; gap: 10px; }
.machine-icon { width: 36px; height: 36px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #9CA3AF; }
.machine-name { font-size: 13px; font-weight: 600; color: #111318; margin-bottom: 2px; }
.machine-meta { font-size: 11px; color: #9CA3AF; }
.urgency-pill { font-size: 11px; font-weight: 600; border-radius: 999px; padding: 3px 10px; }
.urgency-due { background: #FAEEDA; color: #854F0B; }
.urgency-overdue { background: #FCEBEB; color: #A32D2D; }
.service-card-parts { padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; }
.service-part-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #FAFAF8; border-radius: 8px; }
.service-part-name { flex: 1; font-size: 12px; font-weight: 500; color: #111318; }
.service-part-price { font-size: 12px; font-weight: 600; color: #111318; }
.service-card-footer { padding: 10px 14px; border-top: 0.5px solid #F0ECE8; display: flex; align-items: center; justify-content: space-between; background: #FAFAF8; }
.service-total { font-size: 12px; color: #7A7F8E; }
.service-total strong { color: #111318; font-weight: 600; }
.add-all-btn { background: #F5A623; border: none; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; }
.reorder-card { background: #FFFFFF; border: 0.5px solid #E8E4DF; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 14px; cursor: pointer; }
.reorder-card:hover { border-color: #C8C3BC; }
.reorder-thumb { width: 40px; height: 40px; background: #F5F2EE; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #C8C3BC; flex-shrink: 0; }
.reorder-info { flex: 1; min-width: 0; }
.reorder-name { font-size: 13px; font-weight: 500; color: #111318; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.reorder-meta { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 8px; }
.reorder-price { font-size: 13px; font-weight: 700; color: #111318; flex-shrink: 0; }
.reorder-btn { background: none; border: 0.5px solid #E2DDD8; border-radius: 7px; padding: 5px 11px; font-size: 11px; font-weight: 500; color: #3A3D4A; cursor: pointer; font-family: inherit; flex-shrink: 0; }
.cart-strip { position: sticky; bottom: 0; background: #1E1E1E; border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.cart-strip-label { font-size: 13px; font-weight: 600; color: #FFFFFF; }
.cart-strip-sub { font-size: 11px; color: #5C6070; }
.cart-btn { background: #F5A623; border: none; border-radius: 7px; padding: 7px 16px; font-size: 12px; font-weight: 600; color: #1A1200; cursor: pointer; font-family: inherit; }
</style>
<h2 class="sr-only">Recommended parts</h2>
<div class="shell">
  ${buildSidebar('recommended')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">Recommended parts</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn"><i class="ti ti-bell"></i><span class="notif-dot"></span></button>
        <button class="topbar-icon-btn"><i class="ti ti-settings"></i></button>
      </div>
    </div>
    <div class="rec-content">
      <div class="page-header"><div class="page-title">Recommended parts</div><div class="page-title-sub">Personalized for your machines, work orders, and service schedule · Austin Branch</div></div>
      <div class="category-filter">
        <button class="cat-pill all"><i class="ti ti-sparkles"></i> All recommendations</button>
        <button class="cat-pill inactive"><i class="ti ti-clipboard-list"></i> Active WOs</button>
        <button class="cat-pill inactive"><i class="ti ti-calendar-event"></i> Service due</button>
        <button class="cat-pill inactive"><i class="ti ti-history"></i> Reorder</button>
        <button class="cat-pill inactive"><i class="ti ti-sun"></i> Seasonal</button>
      </div>
      <div class="rec-section">
        <div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-amber"><i class="ti ti-clipboard-list"></i></div><div><div class="rec-section-title">Commonly ordered with your active WO</div><div class="rec-section-sub">Based on WO #100094 · Skyjack SJIII 3219 · Hydraulic fault HYD-04</div></div></div><button class="see-all-btn">See all <i class="ti ti-arrow-right" style="font-size:11px;"></i></button></div>
        <div class="parts-grid">
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-circle-dashed"></i></div><div class="part-card-info"><div class="part-card-name">Hydraulic bleed screw kit</div><div class="part-card-num">SKJ-103601 <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-users" style="color:#854F0B;"></i> Ordered with lift cylinder seal kit in 78% of cases</div><div class="part-card-bottom"><div><div class="part-card-price">$12.00</div><div class="part-card-avail"><div class="avail-dot green"></div><span class="avail-label green">In stock</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-droplet"></i></div><div class="part-card-info"><div class="part-card-name">Hydraulic fluid — 1 gal ISO 46</div><div class="part-card-num">SKJ-HF046-1G <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-users" style="color:#854F0B;"></i> Required after seal replacement — system refill</div><div class="part-card-bottom"><div><div class="part-card-price">$28.00</div><div class="part-card-avail"><div class="avail-dot green"></div><span class="avail-label green">Local stock (4)</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-settings"></i></div><div class="part-card-info"><div class="part-card-name">Hydraulic filter — return line</div><div class="part-card-num">SKJ-104880 <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-tool" style="color:#854F0B;"></i> Replace when rebuilding hydraulic system — SB-2847</div><div class="part-card-bottom"><div><div class="part-card-price">$34.00</div><div class="part-card-avail"><div class="avail-dot green"></div><span class="avail-label green">In stock</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
        </div>
      </div>
      <div class="rec-section">
        <div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-blue"><i class="ti ti-calendar-event"></i></div><div><div class="rec-section-title">Upcoming &amp; overdue service intervals</div><div class="rec-section-sub">Based on current hours and service schedule for your assigned machines</div></div></div><button class="see-all-btn">See all <i class="ti ti-arrow-right" style="font-size:11px;"></i></button></div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="service-card"><div class="service-card-header"><div class="service-card-machine"><div class="machine-icon"><i class="ti ti-crane"></i></div><div><div class="machine-name">Skyjack SJIII 3219 · FL-094</div><div class="machine-meta">3,412 hrs · 3,500 hr service due in 88 hrs</div></div></div><span class="urgency-pill urgency-due">Due soon — 88 hrs</span></div><div class="service-card-parts"><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Engine oil filter</div><div style="font-size:11px;color:#9CA3AF;">SKJ-110044 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$18.00</div></div><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Hydraulic fluid filter</div><div style="font-size:11px;color:#9CA3AF;">SKJ-110088 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$24.00</div></div><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Drive motor brush set</div><div style="font-size:11px;color:#9CA3AF;">SKJ-110201 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$56.00</div></div></div><div class="service-card-footer"><div class="service-total">3 parts · <strong>$98.00</strong> est. kit total</div><button class="add-all-btn"><i class="ti ti-shopping-cart" style="font-size:13px;"></i> Add all to cart</button></div></div>
          <div class="service-card"><div class="service-card-header"><div class="service-card-machine"><div class="machine-icon"><i class="ti ti-backhoe"></i></div><div><div class="machine-name">Cat 320 Excavator · FL-017</div><div class="machine-meta">987 hrs · 1,000 hr service due in 13 hrs</div></div></div><span class="urgency-pill urgency-overdue">Due in 13 hrs</span></div><div class="service-card-parts"><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Engine oil filter — Cat 320</div><div style="font-size:11px;color:#9CA3AF;">CAT-1R0716 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$22.00</div></div><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Fuel filter primary</div><div style="font-size:11px;color:#9CA3AF;">CAT-1R0750 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$31.00</div></div><div class="service-part-row"><div style="flex:1;"><div class="service-part-name">Hydraulic pilot filter</div><div style="font-size:11px;color:#9CA3AF;">CAT-093-7521 <span class="oem-badge">OEM</span></div></div><div class="service-part-price">$44.00</div></div></div><div class="service-card-footer"><div class="service-total">3 parts · <strong>$97.00</strong> est. kit total</div><button class="add-all-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add all to cart</button></div></div>
        </div>
      </div>
      <div class="rec-section">
        <div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-purple"><i class="ti ti-history"></i></div><div><div class="rec-section-title">Reorder — frequently purchased</div><div class="rec-section-sub">Consumables and wear items you order regularly</div></div></div><button class="see-all-btn">See all <i class="ti ti-arrow-right" style="font-size:11px;"></i></button></div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div class="reorder-card"><div class="reorder-thumb"><i class="ti ti-droplet"></i></div><div class="reorder-info"><div class="reorder-name">Hydraulic fluid — ISO 46 · 1 gal</div><div class="reorder-meta"><span>SKJ-HF046-1G</span><span>·</span><span>Last ordered Jun 3</span><span>·</span><span style="color:#3B6D11;">In stock</span></div></div><div class="reorder-price">$28.00</div><button class="reorder-btn">Reorder</button></div>
          <div class="reorder-card"><div class="reorder-thumb"><i class="ti ti-circle-dashed"></i></div><div class="reorder-info"><div class="reorder-name">Grease cartridge — multi-purpose EP2</div><div class="reorder-meta"><span>LUB-EP2-14OZ</span><span>·</span><span>Last ordered May 18</span><span>·</span><span style="color:#3B6D11;">In stock</span></div></div><div class="reorder-price">$8.00</div><button class="reorder-btn">Reorder</button></div>
          <div class="reorder-card"><div class="reorder-thumb"><i class="ti ti-settings"></i></div><div class="reorder-info"><div class="reorder-name">Air filter — inner element Cat 320</div><div class="reorder-meta"><span>CAT-1W8957</span><span>·</span><span>Last ordered Apr 29</span><span>·</span><span style="color:#3B6D11;">In stock</span></div></div><div class="reorder-price">$47.00</div><button class="reorder-btn">Reorder</button></div>
          <div class="reorder-card"><div class="reorder-thumb"><i class="ti ti-bolt"></i></div><div class="reorder-info"><div class="reorder-name">Fuse kit — assorted 5–30A automotive</div><div class="reorder-meta"><span>GEN-FUSE-KIT</span><span>·</span><span>Last ordered Apr 2</span><span>·</span><span style="color:#3B6D11;">Local stock</span></div></div><div class="reorder-price">$14.00</div><button class="reorder-btn">Reorder</button></div>
        </div>
      </div>
      <div class="rec-section">
        <div class="rec-section-header"><div class="rec-section-left"><div class="rec-section-icon icon-teal"><i class="ti ti-sun"></i></div><div><div class="rec-section-title">Seasonal — summer in Austin</div><div class="rec-section-sub">High heat and dust conditions increase wear on these systems — June through September</div></div></div><button class="see-all-btn">See all <i class="ti ti-arrow-right" style="font-size:11px;"></i></button></div>
        <div class="parts-grid">
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-wind"></i></div><div class="part-card-info"><div class="part-card-name">Radiator coolant flush kit</div><div class="part-card-num">GEN-CF-KIT <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-sun" style="color:#0F6E56;"></i> Cooling system stress peaks Jun–Sep in this region</div><div class="part-card-bottom"><div><div class="part-card-price">$22.00</div><div class="part-card-avail"><div class="avail-dot green"></div><span class="avail-label green">In stock</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-settings"></i></div><div class="part-card-info"><div class="part-card-name">Outer air filter element</div><div class="part-card-num">CAT-1W8956 <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-sun" style="color:#0F6E56;"></i> Dust filter load increases 2–3× in summer months</div><div class="part-card-bottom"><div><div class="part-card-price">$38.00</div><div class="part-card-avail"><div class="avail-dot green"></div><span class="avail-label green">In stock</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
          <div class="part-card"><div class="part-card-top"><div class="part-thumb"><i class="ti ti-droplet"></i></div><div class="part-card-info"><div class="part-card-name">Hydraulic fluid — high-temp ISO 68</div><div class="part-card-num">SKJ-HF068-1G <span class="oem-badge">OEM</span></div></div></div><div class="part-card-reason"><i class="ti ti-sun" style="color:#0F6E56;"></i> High-viscosity fluid recommended above 95°F ambient</div><div class="part-card-bottom"><div><div class="part-card-price">$32.00</div><div class="part-card-avail"><div class="avail-dot amber"></div><span class="avail-label amber">Low stock (2)</span></div></div><button class="add-cart-btn"><i class="ti ti-shopping-cart" style="font-size:12px;"></i> Add to cart</button></div></div>
        </div>
      </div>
      <div class="cart-strip" id="rec-cart-strip" style="display:none;"><i class="ti ti-shopping-cart" style="font-size:18px;color:#F5A623;"></i><div style="flex:1;"><div class="cart-strip-label" id="rec-cart-label">0 parts in cart</div><div class="cart-strip-sub">Click "View cart" to review &amp; submit</div></div><button class="cart-btn" id="rec-cart-btn">View cart</button></div>
    </div>
  </div>
</div>`;

  function updateCartStrip() {
    const cart = Store.getCart();
    const strip = document.getElementById('rec-cart-strip');
    const label = document.getElementById('rec-cart-label');
    if (!strip) return;
    if (cart.length > 0) {
      strip.style.display = 'flex';
      const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
      label.textContent = `${cart.length} part${cart.length!==1?'s':''} in cart · $${total.toFixed(2)}`;
    } else {
      strip.style.display = 'none';
    }
  }

  updateCartStrip();

  el.querySelectorAll('.add-cart-btn, .reorder-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.part-card, .reorder-card');
      if (!card) return;
      const nameEl = card.querySelector('.part-card-name, .reorder-name');
      const numEl = card.querySelector('.part-card-num, .reorder-meta span:first-child');
      const priceEl = card.querySelector('.part-card-price, .reorder-price');
      const name = nameEl ? nameEl.textContent.trim() : 'Part';
      const partNum = numEl ? numEl.textContent.replace(/OEM|Aftermarket/g, '').trim() : 'GEN';
      const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g,'')) : 0;
      const part = Store.getParts(partNum, '')[0] || { id: partNum, partNum, description: name, price, vendor: 'Various', oemOnly: false, inStock: true, category: 'General' };
      Store.addToCart(part);
      btn.innerHTML = '<i class="ti ti-check" style="font-size:12px;"></i> Added';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      updateCartStrip();
    });
  });

  const cartBtn = document.getElementById('rec-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const cart = Store.getCart();
      const wos = Store.getWorkOrders('all');
      Modal.show({
        title: 'Cart', wide: true,
        body: `<div style="margin-bottom:12px;">${cart.map(i=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid #F0ECE8;"><div style="flex:1;font-size:13px;color:#111318;">${i.description}</div><div style="font-size:12px;color:#9CA3AF;">${i.partNum}</div><div style="font-size:13px;font-weight:600;">$${i.price.toFixed(2)}</div></div>`).join('')}</div>
        <div><label style="font-size:12px;color:#7A7F8E;display:block;margin-bottom:4px;">Assign to Work Order</label><select id="rc-wo" style="width:100%;border:1px solid #E2DDD8;border-radius:7px;padding:8px 12px;font-family:inherit;font-size:13px;"><option value="">No WO</option>${wos.map(w=>`<option value="${w.id}">WO #${w.id} — ${w.machine}</option>`).join('')}</select></div>`,
        actions: [{
          label: 'Submit Order', primary: true, onClick: () => {
            const woId = document.getElementById('rc-wo')?.value;
            Store.submitCart(woId || null);
            Modal.close();
            updateCartStrip();
            Modal.show({ title: 'Order submitted', body: '<div style="text-align:center;padding:16px 0;"><div style="font-size:40px;margin-bottom:10px;">✓</div><div style="font-size:14px;color:#111318;">Your order has been submitted successfully.</div></div>', actions: [{ label: 'View order history', primary: true, onClick: () => { Modal.close(); sendPrompt('Open order history'); } }, { label: 'Close', onClick: Modal.close }] });
          }
        }, { label: 'Cancel', onClick: Modal.close }]
      });
    });
  }
}