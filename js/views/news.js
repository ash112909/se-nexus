// Shared article data — defined at module level so dashboard and other views can call newsOpenArticle
const NEWS_TYPE_META = {
  bulletin:  { label: 'Service Bulletin', color: '#854F0B', bg: '#FAEEDA', icon: 'ti-alert-triangle' },
  fleet:     { label: 'Fleet Update',     color: '#185FA5', bg: '#E6F1FB', icon: 'ti-building'       },
  supplier:  { label: 'Supplier News',    color: '#534AB7', bg: '#EEEDFE', icon: 'ti-news'            },
  warranty:  { label: 'Warranty',         color: '#0F6E56', bg: '#E1F5EE', icon: 'ti-shield-check'   },
  safety:    { label: 'Safety Alert',     color: '#B91C1C', bg: '#FEE2E2', icon: 'ti-alert-octagon'  },
  pricing:   { label: 'Pricing',          color: '#6B7280', bg: '#F3F4F6', icon: 'ti-tag'            },
  training:  { label: 'Training',         color: '#5B21B6', bg: '#EDE9FE', icon: 'ti-certificate'    },
};

const NEWS_PRIORITY_META = {
  critical: { label: 'Critical',  color: '#B91C1C', bg: '#FEE2E2' },
  high:     { label: 'High',      color: '#C2410C', bg: '#FFF7ED' },
  medium:   { label: 'Medium',    color: '#B45309', bg: '#FFFBEB' },
  low:      { label: 'Low',       color: '#6B7280', bg: '#F9FAFB' },
};

function _newsTypeChip(type) {
  const m = NEWS_TYPE_META[type] || NEWS_TYPE_META.supplier;
  return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;background:${m.bg};color:${m.color};border-radius:4px;padding:2px 7px;"><i class="ti ${m.icon}" style="font-size:11px;"></i>${m.label}</span>`;
}

function _newsPriorityChip(priority) {
  const p = NEWS_PRIORITY_META[priority] || NEWS_PRIORITY_META.low;
  return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.5px;background:${p.bg};color:${p.color};border-radius:4px;padding:2px 7px;"><span style="width:6px;height:6px;border-radius:50%;background:${p.color};display:inline-block;flex-shrink:0;"></span>${p.label}</span>`;
}

const NEWS_ARTICLES = [
    {
      id:'n-01', type:'bulletin', poster:'Skyjack', date:'2026-06-24', dateLabel:'Jun 24, 2026', priority:'critical',
      title:'SB-2026-047 — Hydraulic pressure relief valve inspection required',
      summary:'Affects SJIII 3219 and 4626 units manufactured before Jan 2024. Inspect torque spec on relief valve before next lift cycle.',
      body:'Skyjack has identified a batch of pressure relief valves manufactured between Aug 2022 and Jan 2024 that may have been assembled with incorrect torque values. Units operating under repeated high-load cycles could experience premature valve wear. Affected models: SJIII 3219, SJIII 4626. Action required: inspect relief valve torque to spec (22–24 Nm) before the next operational lift cycle. Replace valve if out of spec. Part number: SKJ-103278. This bulletin is mandatory for all affected units.',
      tags:['hydraulics','safety','inspection'],
    },
    {
      id:'n-02', type:'fleet', poster:'Mid-County Rental', date:'2026-06-22', dateLabel:'Jun 22, 2026', priority:'medium',
      title:'2 new Bobcat S770 units arriving at Kyle Branch — Jul 8',
      summary:'Pre-delivery inspection checklist uploaded to Manuals. Assign intake WOs before arrival date.',
      body:'Two new Bobcat S770 skid steer loaders are scheduled for delivery to the Kyle Branch facility on July 8, 2026. Serial numbers will be confirmed on arrival. Pre-delivery inspection checklists have been uploaded to the Manuals & Docs section. Please ensure intake work orders are created and assigned before arrival. Fleet IDs will be KY-009 and KY-010. Contact Operations Lead T. Nguyen with any scheduling questions.',
      tags:['fleet','intake','kyle'],
    },
    {
      id:'n-03', type:'pricing', poster:'Caterpillar', date:'2026-06-19', dateLabel:'Jun 19, 2026', priority:'medium',
      title:'Caterpillar parts price update effective Jul 1, 2026',
      summary:'Track adjuster and undercarriage parts see a 3–5% price increase. Review open POs before end of June.',
      body:'Caterpillar has announced a price adjustment effective July 1, 2026 on select parts in the undercarriage and drive system categories. Affected categories include: track adjusters, idlers, recoil springs, and track link assemblies. The increase ranges from 3% to 5.2% depending on part number. Review any open purchase orders containing CAT-TRK-* part numbers before June 30 to lock in current pricing. The SmartEquip catalog will be updated automatically on July 1.',
      tags:['caterpillar','pricing','undercarriage'],
    },
    {
      id:'n-04', type:'warranty', poster:'Mid-County Rental', date:'2026-06-20', dateLabel:'Jun 20, 2026', priority:'high',
      title:'Toyota 8FGU25 FL-031 warranty expires Dec 3, 2026 — schedule service',
      summary:'Coverage ends in 6 months. Submit outstanding warranty claims through SmartEquip before expiry.',
      body:'The manufacturer warranty on FL-031 (Toyota 8FGU25, serial TOY8FGU-00391) expires on December 3, 2026. Any warranty-eligible repairs or part replacements must be initiated before this date. Common items to review before expiry: mast chain wear, brake adjustment, and hydraulic cylinder seals. Submit warranty claims through the SmartEquip portal under WO detail. Contact your Toyota dealer rep for guidance on eligible items.',
      tags:['warranty','toyota','fl-031'],
    },
    {
      id:'n-05', type:'safety', poster:'Mid-County Rental', date:'2026-06-18', dateLabel:'Jun 18, 2026', priority:'critical',
      title:'Mandatory safety briefing: fall protection update for elevated work platforms',
      summary:'New OSHA guidance on fall protection for scissor lifts above 10 ft. All operators must complete refresher by Jun 30.',
      body:'Following updated OSHA 1926.502 guidance issued May 2026, all operators of elevated work platforms above 10 feet must complete the updated fall protection refresher by June 30, 2026. The refresher covers: harness inspection, anchor point identification, and platform capacity awareness. Training materials have been uploaded to the Manuals section under Safety. Operators who have not completed the refresher must be accompanied by a certified supervisor until training is completed.',
      tags:['safety','osha','training','scissor-lift'],
    },
    {
      id:'n-06', type:'bulletin', poster:'Bobcat', date:'2026-06-17', dateLabel:'Jun 17, 2026', priority:'high',
      title:'Bobcat SB-S650-2026-12 — Quick coupler seal inspection',
      summary:'S650 units with hydraulic quick couplers built before Oct 2023 may have seal degradation. Inspect before next operation.',
      body:'Bobcat has issued service bulletin SB-S650-2026-12 addressing potential seal degradation in hydraulic quick coupler assemblies on S650 skid steers manufactured before October 2023. Symptoms include slow hydraulic response, minor fluid weeping at the coupler face, and reduced attachment clamping force. Recommended action: inspect and replace coupler seal kit (BOB-QC-520) during next scheduled maintenance. Units exhibiting active leakage should be taken out of service immediately.',
      tags:['bobcat','hydraulics','seal','s650'],
    },
    {
      id:'n-07', type:'supplier', poster:'Skyjack', date:'2026-06-15', dateLabel:'Jun 15, 2026', priority:'low',
      title:'Skyjack launches SmartConnect 2.0 — telematics integration now available',
      summary:'New telematics platform supports real-time fault code reporting and remote diagnostics for SJIII series.',
      body:'Skyjack has released SmartConnect 2.0, an enhanced telematics platform for the SJIII scissor lift series. New features include real-time fault code push notifications, remote hour-meter monitoring, geofencing, and integration with fleet management systems including SmartEquip. Units manufactured after Jan 2025 are compatible out of the box. Older units can be retrofitted using the SC2 adapter kit (SKJ-SC2-KIT, $149). Contact your Skyjack distributor to activate the feature on your fleet account.',
      tags:['skyjack','telematics','technology'],
    },
    {
      id:'n-08', type:'fleet', poster:'Mid-County Rental', date:'2026-06-14', dateLabel:'Jun 14, 2026', priority:'low',
      title:'Austin Branch: FL-088 Bobcat S650 retired from fleet',
      summary:'FL-088 has been decommissioned following repair cost assessment. Asset removed from active roster.',
      body:'Following a comprehensive repair cost vs. asset value assessment, FL-088 (Bobcat S650, serial BOB-S650-00814) has been formally retired from the Austin Branch fleet. The unit had accumulated 4,210 hours with significant drive system wear. Parts from FL-088 have been inventoried and cataloged for use as spares across the remaining S650 fleet. Any open work orders referencing FL-088 have been closed. The asset has been removed from SmartEquip. Contact fleet management if you have questions.',
      tags:['fleet','bobcat','decommission','austin'],
    },
    {
      id:'n-09', type:'bulletin', poster:'Caterpillar', date:'2026-06-13', dateLabel:'Jun 13, 2026', priority:'medium',
      title:'Cat 320 SIS update — revised track tension specs for sandy soil conditions',
      summary:'Updated factory specification for track tension when operating in loose or sandy soil. Reduces premature wear.',
      body:'Caterpillar has updated the Cat 320 Service Information System (SIS) with revised track tension specifications for loose or sandy soil conditions. Previous spec called for 25–35 mm track sag; revised spec recommends 30–40 mm to reduce premature wear on idler recoil springs and track links. This applies to Cat 320 units operating in sandy or loose-aggregate environments more than 30% of operating hours. Update your inspection checklist accordingly. Reference SIS doc #320-TRK-TEN-2026.',
      tags:['caterpillar','track','specifications'],
    },
    {
      id:'n-10', type:'training', poster:'Mid-County Rental', date:'2026-06-12', dateLabel:'Jun 12, 2026', priority:'low',
      title:'New technician onboarding: M. Torres now fully certified — Toyota & Bobcat',
      summary:'M. Torres has completed OEM certification for Toyota forklifts and Bobcat skid steers. Now available for WO assignment.',
      body:'Congratulations to M. Torres on completing OEM technician certification for Toyota Material Handling (8FG series) and Bobcat (S-Series skid steers) through the SmartEquip Certification Program. M. Torres is now available for full WO assignment on FL-031 and all S-Series units. This brings the Austin Branch certified technician count to 3. Certifications are logged in the HR system and available for review in the Team section.',
      tags:['training','certification','team'],
    },
    {
      id:'n-11', type:'bulletin', poster:'Parker', date:'2026-06-11', dateLabel:'Jun 11, 2026', priority:'high',
      title:'Parker Hannifin — D1VW series control valve updated torque spec',
      summary:'Revised installation torque for D1VW series directional control valves. Previous spec was 10% over recommended.',
      body:'Parker Hannifin has issued a correction notice for D1VW series directional control valves. The installation torque spec printed in manuals from 2021–2023 was incorrect at 32 Nm; the correct specification is 28–30 Nm. Over-torquing the valve body can cause micro-fractures in the housing that may not present immediately but can result in internal leakage after 500–800 operating hours. If your installation used the old spec, Parker recommends inspection at next service. Relevant part: PAR-CV-2201.',
      tags:['parker','hydraulics','valve','specification'],
    },
    {
      id:'n-12', type:'fleet', poster:'Mid-County Rental', date:'2026-06-10', dateLabel:'Jun 10, 2026', priority:'medium',
      title:'Quarterly PM schedule published — Q3 2026',
      summary:'Q3 preventive maintenance schedule is now live. WOs will be auto-created on Jul 1 for all assigned units.',
      body:'The Q3 2026 preventive maintenance schedule has been finalized and published. PM work orders will be automatically created on July 1 for all fleet units due for service in July, August, and September. Schedules are based on OEM-recommended intervals and actual hour meters logged via telematics. Technicians will receive their assigned PMs via notification on July 1. If a unit is currently out of service, its PM will be flagged for review rather than auto-assigned. Contact your fleet lead to adjust assignments.',
      tags:['maintenance','schedule','pm'],
    },
    {
      id:'n-13', type:'supplier', poster:'Toyota', date:'2026-06-09', dateLabel:'Jun 9, 2026', priority:'low',
      title:'Toyota introduces 8FBN series electric forklift — available Q4 2026',
      summary:'New 8FBN lithium-ion electric forklift replaces 8FBE series. SmartEquip parts integration available at launch.',
      body:'Toyota Material Handling has announced the 8FBN series lithium-ion electric counterbalance forklift, available for order Q4 2026. The 8FBN features a 48V lithium-ion battery pack with opportunity charging, a 20% improvement in lift cycle efficiency over the outgoing 8FBE, and integrated telematics via Toyota I_Site. SmartEquip parts catalogs for the 8FBN will be available at launch. Mid-County Rental is currently evaluating fleet acquisition. Contact Operations for demo availability.',
      tags:['toyota','electric','new-product'],
    },
    {
      id:'n-14', type:'safety', poster:'Skyjack', date:'2026-06-08', dateLabel:'Jun 8, 2026', priority:'critical',
      title:'Skyjack safety notice — overload sensor calibration drift on SJIII after 2,000 hrs',
      summary:'Units over 2,000 operating hours may have overload sensor drift of up to 8%. Recalibrate at next service.',
      body:'Skyjack has identified potential calibration drift in the platform load sensing system on SJIII series units with more than 2,000 operating hours. Drift of up to 8% of rated capacity has been observed, which could allow operation above maximum rated load. This is a safety-critical issue. Recalibration is required at the next scheduled service for any affected unit. Calibration procedure is documented in SB-2026-039. Contact your Skyjack service partner or use a calibrated load cell to verify. Do not operate at rated capacity until recalibrated.',
      tags:['skyjack','safety','calibration','sensor'],
    },
    {
      id:'n-15', type:'fleet', poster:'Mid-County Rental', date:'2026-06-07', dateLabel:'Jun 7, 2026', priority:'low',
      title:'San Marcos Branch: new parts storage area open — bin system updated in SmartEquip',
      summary:'The expanded parts room at San Marcos is now active. All bin locations have been updated in the system.',
      body:'The expansion of the San Marcos Branch parts storage area is complete. The new layout adds 40 additional shelf bins and a dedicated hydraulics shelf. All bin locations have been updated in SmartEquip — search for a part to see its current bin assignment. The old part room layout document has been archived. Parts staff will conduct a cycle count the week of June 14 to verify inventory accuracy. If you notice a discrepancy, log it through the Parts module.',
      tags:['san-marcos','parts','inventory'],
    },
    {
      id:'n-16', type:'bulletin', poster:'Toyota', date:'2026-06-06', dateLabel:'Jun 6, 2026', priority:'high',
      title:'Toyota 8FGU series — mast chain elongation inspection interval reduced to 500 hrs',
      summary:'Updated service interval for mast chain elongation check from 1,000 hrs to 500 hrs based on field data.',
      body:'Toyota Material Handling has issued an updated maintenance interval for mast chain elongation inspection on the 8FGU series (25, 30, 32, and 45 models). Based on 3-year field data, Toyota now recommends inspecting mast chain elongation every 500 operating hours rather than the previous 1,000-hour interval. Chains showing greater than 3% elongation must be replaced before further operation. This update applies retroactively to all 8FGU units currently in service. Update your PM checklist accordingly. Reference: Toyota SMG-8FGU-CH-2026.',
      tags:['toyota','mast','chain','maintenance'],
    },
    {
      id:'n-17', type:'pricing', poster:'Grainger', date:'2026-06-05', dateLabel:'Jun 5, 2026', priority:'low',
      title:'Grainger account terms updated — net-30 now available for orders over $500',
      summary:'Mid-County Rental account has been approved for net-30 payment terms on orders above $500 threshold.',
      body:'Mid-County Rental\'s Grainger account has been approved for net-30 payment terms on orders with a subtotal of $500 or greater, effective June 1, 2026. Orders under $500 continue to require payment at time of order. The updated terms apply to all branches. Account number and billing address are pre-filled in SmartEquip when ordering through Grainger. Questions about invoices should be directed to the accounts payable team.',
      tags:['grainger','billing','account'],
    },
    {
      id:'n-18', type:'fleet', poster:'Mid-County Rental', date:'2026-06-04', dateLabel:'Jun 4, 2026', priority:'medium',
      title:'Kyle Branch: FL-017 Cat 320 transferred from Austin — effective Jun 6',
      summary:'Cat 320 FL-017 will be transferred to Kyle Branch to support the new excavation contract starting Jun 10.',
      body:'Effective June 6, 2026, Cat 320 Excavator FL-017 is being transferred from Austin Branch to Kyle Branch to support the Rock Creek commercial excavation contract starting June 10. The transfer includes all current open work orders on FL-017, which have been reassigned to T. Nguyen at Kyle. Ensure the unit is transport-ready (fluids checked, pins greased, tracks inspected) before the flatbed pickup on June 6 at 7:00 AM. Contact Operations if the unit is not ready for transport.',
      tags:['fleet','cat','transfer','kyle'],
    },
    {
      id:'n-19', type:'supplier', poster:'Bobcat', date:'2026-06-03', dateLabel:'Jun 3, 2026', priority:'medium',
      title:'Bobcat expands parts same-day availability to Central Texas region',
      summary:'Bobcat has added a regional distribution hub in San Marcos. Most S-series parts now available same-day.',
      body:'Bobcat has opened a new regional distribution center in San Marcos, TX, effective June 1, 2026. The new hub significantly reduces lead times for S-series skid steer parts across the Central Texas region. Most high-turnover parts (filters, seals, hoses, electrical components) are now available for same-day delivery if ordered before 2:00 PM CST. Next-day availability applies to drivetrain components. SmartEquip order routing has been updated to reflect the new hub.',
      tags:['bobcat','parts','logistics','san-marcos'],
    },
    {
      id:'n-20', type:'safety', poster:'Mid-County Rental', date:'2026-06-02', dateLabel:'Jun 2, 2026', priority:'high',
      title:'Fire extinguisher inspection due at all branches — Jun 15 deadline',
      summary:'Annual inspection of all shop and vehicle fire extinguishers required by Jun 15. Coordinate with branch safety lead.',
      body:'Annual fire extinguisher inspection is due across all three branches by June 15, 2026. This includes shop-mounted units, vehicle-mounted units on all fleet assets, and portable units in the parts room. Coordinate with your branch safety lead to schedule the certified inspection. Tags must be updated with the inspection date and inspector signature. Any units that fail inspection must be replaced immediately — do not return them to service. Replacement units are available through Grainger (account already set up).',
      tags:['safety','compliance','inspection'],
    },
    {
      id:'n-21', type:'bulletin', poster:'Parker', date:'2026-05-30', dateLabel:'May 30, 2026', priority:'critical',
      title:'Parker hydraulic hose assemblies — batch recall on PTFE-lined hoses from Jan 2026',
      summary:'Specific batch of PTFE-lined hose assemblies may have adhesion failure between liner and hose body. Replace if from Jan 2026 batch.',
      body:'Parker Hannifin has issued a voluntary recall for PTFE-lined hydraulic hose assemblies manufactured in January 2026. The affected batch (lot codes JAN26-A and JAN26-B) may have an adhesion failure between the PTFE liner and the hose body, which can result in liner delamination and internal blockage under high-pressure cycling. Affected part families: PAR-H4-* and PAR-H6-* series. Check hose assemblies installed since January for batch markings. Replace any affected hoses immediately. Parker will issue replacements at no cost — contact your Parker distributor with lot code information.',
      tags:['parker','hose','recall','safety'],
    },
    {
      id:'n-22', type:'training', poster:'Mid-County Rental', date:'2026-05-28', dateLabel:'May 28, 2026', priority:'medium',
      title:'SmartEquip platform training session — Jun 11, 2:00 PM (all branches)',
      summary:'30-minute walkthrough of new SmartEquip features including parts search, diagnostics, and WO management.',
      body:'A company-wide SmartEquip platform training session is scheduled for June 11, 2026 at 2:00 PM CST. The session will be held via video call and covers new features added in the Q2 update: enhanced parts diagram view, the diagnostic assistant, and the updated work order management workflow. All technicians and fleet leads are encouraged to attend. The session will be recorded and posted to the Manuals section afterward. Meeting link will be shared by Operations on June 10.',
      tags:['training','smartequip','platform'],
    },
    {
      id:'n-23', type:'supplier', poster:'Caterpillar', date:'2026-05-26', dateLabel:'May 26, 2026', priority:'low',
      title:'Caterpillar opens online warranty claims portal — replaces dealer-submitted process',
      summary:'Cat dealers no longer act as intermediary for warranty claims. Submit directly via Cat.com with your SmartEquip asset data.',
      body:'Caterpillar has launched a direct online warranty claims portal at warranty.cat.com, effective May 15, 2026. Technicians can now submit warranty claims directly without routing through a dealer, reducing average claim processing time from 12 days to 3–5 days. To submit a claim, you will need the unit\'s serial number, hour meter reading, fault code or symptom description, and supporting photos. SmartEquip asset data can be exported directly from the WO detail screen. Dealer approval is still required for claims over $2,500.',
      tags:['caterpillar','warranty','portal'],
    },
    {
      id:'n-24', type:'fleet', poster:'Mid-County Rental', date:'2026-05-22', dateLabel:'May 22, 2026', priority:'medium',
      title:'Fuel card policy update — PIN required for all fuel transactions over $75',
      summary:'New fuel card security requirement from WEX effective Jun 1. All operators must set a PIN before then.',
      body:'WEX fuel card policy is being updated effective June 1, 2026. All fuel transactions over $75 will require PIN entry at the pump. Operators who have not yet set a PIN on their WEX card must do so before June 1 to avoid transaction declines. PINs can be set via the WEX online portal or by calling WEX support (number on back of card). Fleet leads should confirm PIN status for all assigned operators by May 30. Questions should be directed to the accounts payable team.',
      tags:['fuel','policy','fleet'],
    },
    {
      id:'n-25', type:'bulletin', poster:'Skyjack', date:'2026-05-20', dateLabel:'May 20, 2026', priority:'medium',
      title:'Skyjack SB-2026-031 — pothole protection module firmware update',
      summary:'Firmware v3.1.2 for SJIII pothole protection module corrects false-positive tilt fault on uneven surfaces.',
      body:'Skyjack has released firmware version 3.1.2 for the pothole protection module on SJIII series scissor lifts. The update corrects a known issue where the tilt sensor could trigger a false-positive fault (ERR-TILT-02) when traversing minor surface irregularities at low speed. The fault would lock platform elevation and require a power cycle to reset. The update is available via USB programmer through your Skyjack dealer or via the SmartConnect telematics portal if the unit is SmartConnect-enabled. Firmware can be applied during any scheduled service.',
      tags:['skyjack','firmware','software','tilt'],
    },
];

const NEWS_POSTERS = ['All', 'Mid-County Rental', 'Skyjack', 'Caterpillar', 'Toyota', 'Bobcat', 'Parker', 'Grainger'];

// Global — callable from dashboard and any other view without needing the news view rendered
window.newsOpenArticle = function(id) {
  const n = NEWS_ARTICLES.find(x => x.id === id);
  if (!n) return;
  const saved = new Set(JSON.parse(localStorage.getItem('se-news-saved') || '[]')).has(id);
  Modal.show({
    title: n.title,
    body: `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
        ${_newsTypeChip(n.type)}${_newsPriorityChip(n.priority)}
        <span style="font-size:12px;color:#9CA3AF;">Posted by <strong style="color:#3A3D4A;">${n.poster}</strong> · ${n.dateLabel}</span>
      </div>
      <p style="font-size:13px;color:#3A3D4A;line-height:1.8;margin-bottom:16px;">${n.body}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
        ${n.tags.map(t => `<span style="font-size:11px;background:#F5F2EE;color:#7A7F8E;border-radius:4px;padding:2px 8px;">${t}</span>`).join('')}
      </div>
      <div style="display:flex;gap:8px;padding-top:12px;border-top:0.5px solid #F0ECE8;">
        <button onclick="newsSave('${n.id}');Modal.close();" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:0.5px solid #E2DDD8;background:${saved?'#FAEEDA':'#FFFFFF'};color:${saved?'#854F0B':'#5A5F6E'};font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;">
          <i class="ti ${saved?'ti-bookmark-filled':'ti-bookmark'}"></i> ${saved ? 'Remove from saved' : 'Save article'}
        </button>
        <button onclick="Modal.close();setTimeout(()=>newsReport('${n.id}'),80);" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:0.5px solid #E2DDD8;background:#FFFFFF;color:#5A5F6E;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;">
          <i class="ti ti-flag"></i> Report a problem
        </button>
      </div>`,
    actions: [{ label: 'Close', onClick: () => Modal.close() }]
  });
};

// newsReport/newsSave are re-registered each time the news view renders (they need closure state)
// but they also work globally since they just write to localStorage and call renderCards (no-op if not rendered)
window.newsReport = window.newsReport || function(id) { /* defined in render_news */ };
window.newsSave   = window.newsSave   || function(id) { /* defined in render_news */ };

function render_news(el) {
  let _search = '';
  let _filterType = 'all';
  let _filterPoster = 'all';
  let _filterPriority = 'all';
  let _sortDir = 'desc';

  // Persist saved + reported in localStorage
  let _saved = new Set(JSON.parse(localStorage.getItem('se-news-saved') || '[]'));
  let _reported = new Set(JSON.parse(localStorage.getItem('se-news-reported') || '[]'));
  let _showSaved = false;

  function persistSaved() { try { localStorage.setItem('se-news-saved', JSON.stringify([..._saved])); } catch(e) {} }
  function persistReported() { try { localStorage.setItem('se-news-reported', JSON.stringify([..._reported])); } catch(e) {} }

  const NEWS = NEWS_ARTICLES;
  const TYPE_META = NEWS_TYPE_META;
  const PRIORITY_META = NEWS_PRIORITY_META;
  const POSTERS = NEWS_POSTERS;
  function typeChip(t) { return _newsTypeChip(t); }
  function priorityChip(p) { return _newsPriorityChip(p); }

  function filteredNews() {
    let items = NEWS.slice();
    if (_showSaved) items = items.filter(n => _saved.has(n.id));
    if (_filterType !== 'all') items = items.filter(n => n.type === _filterType);
    if (_filterPoster !== 'all') items = items.filter(n => n.poster === _filterPoster);
    if (_filterPriority !== 'all') items = items.filter(n => n.priority === _filterPriority);
    if (_search.trim()) {
      const q = _search.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some(t => t.includes(q)) ||
        n.poster.toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => _sortDir === 'desc'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date));
    return items;
  }

  function priorityChip(priority) {
    const p = PRIORITY_META[priority] || PRIORITY_META.low;
    return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.5px;background:${p.bg};color:${p.color};border-radius:4px;padding:2px 7px;"><span style="width:6px;height:6px;border-radius:50%;background:${p.color};display:inline-block;flex-shrink:0;"></span>${p.label}</span>`;
  }

  function typeChip(type) {
    const m = TYPE_META[type] || TYPE_META.supplier;
    return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;background:${m.bg};color:${m.color};border-radius:4px;padding:2px 7px;"><i class="ti ${m.icon}" style="font-size:11px;"></i>${m.label}</span>`;
  }

  function renderCards() {
    const items = filteredNews();
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    if (!items.length) {
      grid.innerHTML = '<div style="padding:32px 0;text-align:center;color:#9CA3AF;font-size:13px;">No articles match your filters.</div>';
      document.getElementById('news-count').textContent = '0 articles';
      return;
    }
    document.getElementById('news-count').textContent = `${items.length} article${items.length !== 1 ? 's' : ''}`;
    grid.innerHTML = items.map(n => {
      const m = TYPE_META[n.type] || TYPE_META.supplier;
      const saved = _saved.has(n.id);
      const reported = _reported.has(n.id);
      return `
      <div class="news-card" id="nc-${n.id}">
        <div class="nc-top" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">
          <div class="nc-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
          <div class="nc-meta">
            <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">${typeChip(n.type)}${priorityChip(n.priority)}</div>
            <span class="nc-poster">${n.poster}</span>
          </div>
          <span class="nc-date">${n.dateLabel}</span>
        </div>
        <div class="nc-title" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${n.title}</div>
        <div class="nc-summary" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${n.summary}</div>
        <div class="nc-tags" onclick="newsOpenArticle('${n.id}')" style="cursor:pointer;">${n.tags.map(t => `<span class="nc-tag">${t}</span>`).join('')}</div>
        <div class="nc-actions">
          <button class="nc-action-btn ${saved ? 'nc-saved' : ''}" onclick="event.stopPropagation();newsSave('${n.id}')" title="${saved ? 'Remove from saved' : 'Save article'}">
            <i class="ti ${saved ? 'ti-bookmark-filled' : 'ti-bookmark'}"></i> ${saved ? 'Saved' : 'Save'}
          </button>
          <button class="nc-action-btn nc-report-btn ${reported ? 'nc-reported' : ''}" onclick="event.stopPropagation();newsReport('${n.id}')" title="Report a problem">
            <i class="ti ti-flag"></i> ${reported ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>`;
    }).join('');
  }

  window.newsSave = function(id) {
    if (_saved.has(id)) { _saved.delete(id); } else { _saved.add(id); }
    persistSaved();
    renderCards();
    const savedCount = _saved.size;
    const lbl = document.getElementById('nfp-saved-count');
    if (lbl) lbl.textContent = savedCount > 0 ? ` (${savedCount})` : '';
  };

  window.newsReport = function(id) {
    if (_reported.has(id)) {
      Modal.show({ title: 'Already reported', body: '<p style="font-size:13px;color:#3A3D4A;">You have already submitted a report for this article.</p>', actions: [{ label: 'OK', onClick: () => Modal.close() }] });
      return;
    }
    const n = NEWS.find(x => x.id === id);
    Modal.show({
      title: 'Report a problem',
      body: `
        <p style="font-size:13px;color:#7A7F8E;margin-bottom:16px;">Let us know what's wrong with "<strong style="color:#111318;">${n ? n.title.slice(0,60)+'…' : 'this article'}</strong>"</p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
          ${['Inaccurate or incorrect information','Outdated — information no longer applies','Duplicate post','Inappropriate or irrelevant content','Missing critical information','Other'].map((reason, i) => `
            <label style="display:flex;align-items:center;gap:9px;padding:9px 12px;border:0.5px solid #E2DDD8;border-radius:8px;cursor:pointer;font-size:13px;color:#3A3D4A;">
              <input type="radio" name="report-reason" value="${reason}" ${i===0?'checked':''} style="accent-color:#F5A623;"/> ${reason}
            </label>`).join('')}
        </div>
        <textarea id="report-notes" placeholder="Additional notes (optional)" style="width:100%;height:72px;padding:9px 12px;border:0.5px solid #E2DDD8;border-radius:8px;font-size:13px;font-family:inherit;color:#111318;resize:none;outline:none;"></textarea>`,
      actions: [
        { label: 'Cancel', onClick: () => Modal.close() },
        { label: 'Submit report', onClick: () => {
          const reason = document.querySelector('input[name="report-reason"]:checked')?.value || 'Other';
          _reported.add(id);
          persistReported();
          renderCards();
          Modal.close();
          setTimeout(() => Modal.show({
            title: 'Report submitted',
            body: `<p style="font-size:13px;color:#3A3D4A;line-height:1.7;">Thanks for flagging this. Your report has been sent to the content team.<br><span style="color:#9CA3AF;font-size:12px;">Reason: ${reason}</span></p>`,
            actions: [{ label: 'Done', onClick: () => Modal.close() }]
          }), 80);
        }}
      ]
    });
  };

  el.innerHTML = `<style>
.news-shell { display:flex; flex:1; min-height:0; }
.news-filter-panel { width:220px; min-width:220px; background:#FFFFFF; border-right:0.5px solid #E8E4DF; display:flex; flex-direction:column; padding:16px 0; overflow-y:auto; flex-shrink:0; }
.nfp-section { padding:0 14px; margin-bottom:18px; }
.nfp-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-bottom:8px; }
.nfp-item { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:7px; cursor:pointer; font-size:12px; color:#5A5F6E; margin-bottom:2px; }
.nfp-item:hover { background:#F5F2EE; }
.nfp-item.active { background:#FAEEDA; color:#854F0B; font-weight:600; }
.nfp-item-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.nfp-poster { display:flex; align-items:center; gap:8px; padding:5px 8px; border-radius:7px; cursor:pointer; font-size:12px; color:#5A5F6E; margin-bottom:2px; }
.nfp-poster:hover { background:#F5F2EE; }
.nfp-poster.active { background:#FAEEDA; color:#854F0B; font-weight:600; }
.news-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
.news-toolbar { padding:14px 20px; background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.news-search-wrap { position:relative; flex:1; min-width:200px; max-width:360px; }
.news-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#9CA3AF; font-size:15px; pointer-events:none; }
.news-search-input { width:100%; height:36px; background:#F5F2EE; border:1.5px solid #E2DDD8; border-radius:9px; padding:0 12px 0 34px; font-size:13px; font-family:inherit; color:#111318; outline:none; }
.news-search-input:focus { border-color:#F5A623; background:#FFFFFF; }
.news-search-input::placeholder { color:#B0AAA3; }
.news-sort-btn { display:flex; align-items:center; gap:5px; height:36px; padding:0 12px; background:#FFFFFF; border:0.5px solid #E2DDD8; border-radius:9px; font-size:12px; font-weight:500; color:#5A5F6E; cursor:pointer; font-family:inherit; white-space:nowrap; }
.news-sort-btn:hover { background:#F5F2EE; }
.news-count-label { font-size:12px; color:#9CA3AF; margin-left:auto; white-space:nowrap; }
.news-body { flex:1; padding:16px 20px; overflow-y:auto; }
.news-card { background:#FFFFFF; border:0.5px solid #E8E4DF; border-radius:12px; padding:15px; margin-bottom:10px; cursor:pointer; transition:border-color .12s, box-shadow .12s; }
.news-card:hover { border-color:#C8C3BC; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.nc-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
.nc-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.nc-meta { flex:1; display:flex; flex-direction:column; gap:3px; }
.nc-poster { font-size:11px; color:#9CA3AF; }
.nc-date { font-size:11px; color:#C0BAB3; white-space:nowrap; flex-shrink:0; }
.nc-title { font-size:13px; font-weight:600; color:#111318; line-height:1.45; margin-bottom:5px; }
.nc-summary { font-size:12px; color:#7A7F8E; line-height:1.6; margin-bottom:10px; }
.nc-tags { display:flex; gap:5px; flex-wrap:wrap; }
.nc-tag { font-size:10px; background:#F5F2EE; color:#7A7F8E; border-radius:4px; padding:2px 7px; }
.nc-actions { display:flex; align-items:center; gap:8px; margin-top:10px; padding-top:10px; border-top:0.5px solid #F0ECE8; }
.nc-action-btn { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:7px; border:0.5px solid #E2DDD8; background:#FFFFFF; color:#5A5F6E; font-size:11px; font-weight:500; cursor:pointer; font-family:inherit; transition:background .1s,border-color .1s; }
.nc-action-btn:hover { background:#F5F2EE; }
.nc-saved { background:#FAEEDA; color:#854F0B; border-color:#F5A623; }
.nc-saved:hover { background:#F5DFC0; }
.nc-report-btn:hover { background:#FFF5F5; color:#B91C1C; border-color:#FCA5A5; }
.nc-reported { color:#9CA3AF; border-color:#E2DDD8; cursor:default; }
</style>
<h2 class="sr-only">News &amp; updates</h2>
<div class="shell">
  ${buildSidebar('news')}
  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#5C6070;">
        <a style="color:#5C6070;cursor:pointer;" onclick="sendPrompt('dashboard')">Dashboard</a>
        <span style="color:#3C4052;">/</span>
        <span style="color:#FFFFFF;font-weight:500;">News &amp; updates</span>
      </div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>
    <div class="news-shell">
      <div class="news-filter-panel">
        <div class="nfp-section">
          <div class="nfp-item ${_showSaved ? 'active' : ''}" id="nfp-saved-filter" onclick="newsFilter('saved','')"><i class="ti ti-bookmark" style="font-size:13px;"></i> Saved<span id="nfp-saved-count">${_saved.size > 0 ? ' (' + _saved.size + ')' : ''}</span></div>
        </div>
        <div class="nfp-section">
          <div class="nfp-label">Priority</div>
          <div class="nfp-item active" id="nfpr-all" onclick="newsFilter('priority','all')"><div class="nfp-item-dot" style="background:#D1D5DB;"></div>All priorities</div>
          <div class="nfp-item" id="nfpr-critical" onclick="newsFilter('priority','critical')"><div class="nfp-item-dot" style="background:#B91C1C;"></div>Critical</div>
          <div class="nfp-item" id="nfpr-high" onclick="newsFilter('priority','high')"><div class="nfp-item-dot" style="background:#C2410C;"></div>High</div>
          <div class="nfp-item" id="nfpr-medium" onclick="newsFilter('priority','medium')"><div class="nfp-item-dot" style="background:#B45309;"></div>Medium</div>
          <div class="nfp-item" id="nfpr-low" onclick="newsFilter('priority','low')"><div class="nfp-item-dot" style="background:#6B7280;"></div>Low</div>
        </div>
        <div class="nfp-section">
          <div class="nfp-label">Category</div>
          <div class="nfp-item active" id="nft-all" onclick="newsFilter('type','all')"><div class="nfp-item-dot" style="background:#D1D5DB;"></div>All types</div>
          <div class="nfp-item" id="nft-bulletin" onclick="newsFilter('type','bulletin')"><div class="nfp-item-dot" style="background:#F5A623;"></div>Service Bulletin</div>
          <div class="nfp-item" id="nft-fleet" onclick="newsFilter('type','fleet')"><div class="nfp-item-dot" style="background:#3B82F6;"></div>Fleet Update</div>
          <div class="nfp-item" id="nft-supplier" onclick="newsFilter('type','supplier')"><div class="nfp-item-dot" style="background:#8B5CF6;"></div>Supplier News</div>
          <div class="nfp-item" id="nft-warranty" onclick="newsFilter('type','warranty')"><div class="nfp-item-dot" style="background:#10B981;"></div>Warranty</div>
          <div class="nfp-item" id="nft-safety" onclick="newsFilter('type','safety')"><div class="nfp-item-dot" style="background:#EF4444;"></div>Safety Alert</div>
          <div class="nfp-item" id="nft-pricing" onclick="newsFilter('type','pricing')"><div class="nfp-item-dot" style="background:#6B7280;"></div>Pricing</div>
          <div class="nfp-item" id="nft-training" onclick="newsFilter('type','training')"><div class="nfp-item-dot" style="background:#7C3AED;"></div>Training</div>
        </div>
        <div class="nfp-section">
          <div class="nfp-label">Posted by</div>
          ${POSTERS.map(p => `<div class="nfp-poster ${p==='All'?'active':''}" id="nfp-${p.replace(/\s+/g,'-').toLowerCase()}" onclick="newsFilter('poster','${p}')">${p}</div>`).join('')}
        </div>
      </div>
      <div class="news-main">
        <div class="news-toolbar">
          <div class="news-search-wrap">
            <i class="ti ti-search news-search-icon"></i>
            <input class="news-search-input" id="news-search-input" type="text" placeholder="Search by keyword, tag, or title…"/>
          </div>
          <button class="news-sort-btn" onclick="newsToggleSort()" id="news-sort-btn"><i class="ti ti-arrow-down" id="news-sort-icon"></i> Newest first</button>
          <span class="news-count-label" id="news-count">25 articles</span>
        </div>
        <div class="news-body">
          <div id="news-grid"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  renderCards();

  document.getElementById('news-search-input').addEventListener('input', function() {
    _search = this.value;
    renderCards();
  });

  window.newsFilter = function(dimension, value) {
    if (dimension === 'saved') {
      _showSaved = !_showSaved;
      document.getElementById('nfp-saved-filter')?.classList.toggle('active', _showSaved);
    } else if (dimension === 'priority') {
      _filterPriority = value;
      document.querySelectorAll('[id^="nfpr-"]').forEach(el => el.classList.remove('active'));
      document.getElementById('nfpr-' + (value === 'all' ? 'all' : value))?.classList.add('active');
    } else if (dimension === 'type') {
      _filterType = value;
      document.querySelectorAll('[id^="nft-"]').forEach(el => el.classList.remove('active'));
      document.getElementById('nft-' + (value === 'all' ? 'all' : value))?.classList.add('active');
    } else {
      _filterPoster = value;
      document.querySelectorAll('[id^="nfp-"]').forEach(el => el.classList.remove('active'));
      document.getElementById('nfp-' + value.replace(/\s+/g,'-').toLowerCase())?.classList.add('active');
    }
    renderCards();
  };

  window.newsToggleSort = function() {
    _sortDir = _sortDir === 'desc' ? 'asc' : 'desc';
    const btn = document.getElementById('news-sort-btn');
    const icon = document.getElementById('news-sort-icon');
    if (btn) btn.innerHTML = `<i class="ti ti-arrow-${_sortDir==='desc'?'down':'up'}" id="news-sort-icon"></i> ${_sortDir==='desc'?'Newest':'Oldest'} first`;
    renderCards();
  };
}
