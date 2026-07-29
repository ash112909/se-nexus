// ── SJ III 3219 Diagnostic Knowledge Base ────────────────────────────────────
// Simulates a processed operator + service manual for the Skyjack SJIII 3219
// 19-ft electric scissor lift, 24V DC battery, single-stage lift cylinder.

const SJ3219_SECTIONS = [
  { id:'s1',    chapter:'1',   title:'Safety & Pre-Operation Checks',          page:1,   summary:'Personal protective equipment, lockout/tagout, pre-operation inspection checklist, load capacity table.' },
  { id:'s2',    chapter:'2',   title:'Machine Specifications',                  page:8,   summary:'Platform height 19 ft, capacity 500 lb, 24V DC, drive speed 0–2.5 mph elevated, overall dimensions.' },
  { id:'s3-1',  chapter:'3.1', title:'Hydraulic System Overview',               page:24,  summary:'System pressure 2,500–2,800 PSI normal. Relief valve set at 3,200 PSI. 2.5 gal ISO 46 AW fluid capacity.' },
  { id:'s3-2',  chapter:'3.2', title:'Lift Cylinder — Inspection & Seals',      page:31,  summary:'Single-stage cylinder. Acceptable drift: <2 in/min at rated load. Seal replacement interval 3,000 hr. See SB-2847.' },
  { id:'s3-3',  chapter:'3.3', title:'Hydraulic Pump',                          page:38,  summary:'Gear pump, 1.2 GPM at rated RPM. Replace if output pressure <2,000 PSI at rated RPM with good fluid.' },
  { id:'s3-4',  chapter:'3.4', title:'Control Valve & Solenoids',               page:42,  summary:'24V DC solenoid-actuated directional valve. Coil resistance nominal 18–22 Ω. Replace spool if sticking persists after cleaning.' },
  { id:'s3-5',  chapter:'3.5', title:'Pressure Relief Valve',                   page:47,  summary:'Factory set 3,200 PSI. Non-adjustable on SJIII 3219. Replace as assembly if reading outside 3,000–3,400 PSI.' },
  { id:'s3-6',  chapter:'3.6', title:'Hydraulic Filter & Fluid',                page:50,  summary:'10-micron return-line filter. Replace every 250 hr or when bypass indicator extends. Drain and refill at 1,000 hr.' },
  { id:'s4-1',  chapter:'4.1', title:'Battery System — 24V DC',                 page:55,  summary:'Four 6V 220 Ah deep-cycle batteries in series. Minimum charge voltage 22V. Specific gravity 1.265 fully charged.' },
  { id:'s4-2',  chapter:'4.2', title:'Fault Codes — Master Reference',          page:62,  summary:'All HYD, ELC, and DRV fault codes with cause matrix and first-response actions.' },
  { id:'s4-3',  chapter:'4.3', title:'Main Controller — Base Station',          page:71,  summary:'Self-diagnosing controller. LED blink pattern indicates fault class. Replace if fault persists after wiring inspection.' },
  { id:'s4-4',  chapter:'4.4', title:'Platform Controller & Joystick',          page:78,  summary:'Module communicates over CAN bus. Inspect connector P4 for corrosion. Replacement requires calibration procedure (p.82).' },
  { id:'s5-1',  chapter:'5.1', title:'Drive Motors & Brakes',                   page:88,  summary:'Brushless DC 24V drive motors. Spring-applied electromagnetic brakes release at >18V. Inspect brake gap 0.010–0.020".' },
  { id:'s5-2',  chapter:'5.2', title:'Drive System — Wheels & Tires',           page:95,  summary:'Solid foam tires. No inflation required. Replace when tread wear indicator groove disappears.' },
  { id:'s6-1',  chapter:'6.1', title:'Scissor Arms, Pins & Wear Pads',          page:102, summary:'Inspect pins for scoring or elongated holes. Replace wear pads when <1/4" thick. Lubricate all pins every 250 hr.' },
  { id:'s7',    chapter:'7',   title:'Maintenance Schedule',                    page:114, summary:'Daily, 250 hr, 500 hr, 1,000 hr, and 3,000 hr service intervals with checklist.' },
  { id:'sb2847',chapter:'SB',  title:'Service Bulletin SB-2847 — Lift Cylinder Seal Procedure', page:1, summary:'Revised seal installation sequence for SJIII 3219 serial SJ3219-00600 and later. Mandatory. Supersedes p.31 seal procedure.' },
];

const SJ3219_FAULT_CODES = {
  'HYD-01': { title:'Low system pressure (<1,800 PSI)', section:'s3-1', severity:'high',
    causes:['Worn pump (check output pressure at Port A)','Relief valve set too low or leaking by','Internal cylinder bypass — seals','Low fluid level'],
    parts:['SKJ-103278','SKJ-103100','SKJ-HYD-200','SKJ-HF046-1G','SKJ-104880'] },
  'HYD-02': { title:'Hydraulic filter bypass indicator extended', section:'s3-6', severity:'medium',
    causes:['Filter element saturated — overdue replacement','Cold fluid not yet warmed (normal at startup below 40°F)','Filter housing O-ring leak'],
    parts:['SKJ-104880','SKJ-HF046-1G'] },
  'HYD-03': { title:'Lift cylinder drift >2 in/min at rated load', section:'s3-2', severity:'high',
    causes:['Worn cylinder internal seals (rod seal, piston seal)','Control valve not fully closing','Check valve leak-by'],
    parts:['SKJ-103100','SKJ-103445','SKJ-103512','SKJ-CHK-302'] },
  'HYD-04': { title:'No lift function — platform will not elevate', section:'s3-4', severity:'critical',
    causes:['Solenoid valve coil failure (check 24V signal at connector C6)','Pump output failure — low pressure at Port A','Control valve spool sticking','Low fluid level'],
    parts:['SKJ-SOL-301','SKJ-103278','SKJ-HYD-200','SKJ-HYD-201','SKJ-HF046-1G','SKJ-103601'] },
  'HYD-05': { title:'Slow lift speed — platform elevates but slowly', section:'s3-3', severity:'medium',
    causes:['Pump wear — reduced volumetric efficiency','High fluid viscosity (wrong grade or cold)','Partial solenoid restriction','Filter bypass open — unfiltered flow'],
    parts:['SKJ-HYD-201','SKJ-104880','SKJ-HF046-1G','SKJ-HYD-200'] },
  'ELC-01': { title:'Low battery voltage (<22V under load)', section:'s4-1', severity:'high',
    causes:['Batteries undercharged — insufficient charge time','Failed cell in one battery (check individual battery voltages)','Charger fault','Excessive parasitic draw'],
    parts:['SKJ-BAT-500','SKJ-CHR-501'] },
  'ELC-02': { title:'Main controller fault — base station', section:'s4-3', severity:'high',
    causes:['Loose or corroded wiring at connectors J1–J4','Moisture ingress','Controller board failure after short circuit'],
    parts:['SKJ-CTL-502'] },
  'ELC-03': { title:'Platform controller / joystick fault', section:'s4-4', severity:'high',
    causes:['Corroded connector P4 (most common)','CAN bus communication error','Joystick module internal failure'],
    parts:['SKJ-JOY-503'] },
  'ELC-04': { title:'Emergency stop circuit active', section:'s4-2', severity:'medium',
    causes:['E-stop button not fully reset (twist to release)','Wiring fault in E-stop loop','Platform E-stop vs base E-stop conflict'],
    parts:[] },
  'ELC-05': { title:'Drive brake fault — brake not releasing or engaging', section:'s5-1', severity:'high',
    causes:['Limit switch on descent safety bar misaligned','Brake solenoid coil failure (check 24V signal)','Brake gap out of spec (spec: 0.010–0.020")'],
    parts:['SKJ-LIM-504'] },
  'DRV-01': { title:'Drive motor fault', section:'s5-1', severity:'high',
    causes:['Motor winding resistance out of spec','Controller output stage fault — check PWM signal','Broken drive axle or seized hub'],
    parts:['SKJ-MTR-400','SKJ-HUB-401'] },
  'DRV-02': { title:'Drive brake not releasing', section:'s5-1', severity:'high',
    causes:['Brake solenoid voltage <18V','Brake gap too tight — brake dragging','Solenoid coil open circuit'],
    parts:['SKJ-LIM-504','SKJ-MTR-400'] },
  'DRV-03': { title:'Drive function disabled at elevation', section:'s5-1', severity:'low',
    causes:['Normal interlock: drive speed reduces above 25% platform height and disables above ~6 ft','Elevation sensor fault if triggered at ground level'],
    parts:[] },
};

// ── Symptom matcher ──────────────────────────────────────────────────────────
// Each entry: keywords[], faultCodes[], sections[], parts[], response text template.

const SJ3219_SYMPTOMS = [
  {
    id:'no-lift',
    keywords:["won't elevate","won't raise","not lifting","can't raise","platform won't rise","won't go up","no lift","not going up","won't lift","won't elevate","doesnt elevate","doesn't elevate","can't elevate","platform stuck","stuck down","elevator stuck"],
    faultCodes:['HYD-04'],
    sections:['s3-1','s3-4','s3-3'],
    parts:['SKJ-SOL-301','SKJ-103278','SKJ-HYD-200','SKJ-HYD-201','SKJ-HF046-1G'],
    severity:'critical',
    diagnosis:`The SJIII 3219 "no lift" condition is most commonly caused by one of four things, in order of likelihood:

**1. Solenoid valve failure** — The lift solenoid (connector C6 on the base manifold) should read 24V DC when the lift switch is active. Check coil resistance: spec is 18–22 Ω. An open circuit means a failed coil.

**2. Pump output loss** — Connect a pressure gauge to Port A on the pump. Normal output is 2,500–2,800 PSI at rated RPM. Below 2,000 PSI indicates pump wear or internal bypass.

**3. Relief valve stuck open** — If pressure at Port A is normal but no lift movement occurs, the relief valve may be bypassing before system pressure builds. Replace as an assembly (non-adjustable on SJIII 3219).

**4. Low or contaminated fluid** — Check fluid level at the reservoir sight glass. Minimum level: 3/4 full at rest. Fluid specification: ISO 46 AW hydraulic oil.`,
    steps:[
      'Check hydraulic fluid level at reservoir sight glass. Refill if below 3/4.',
      'Activate lift switch. Verify 24V DC signal at solenoid connector C6 using a multimeter.',
      'If signal present, check solenoid coil resistance: spec 18–22 Ω. Replace coil or valve if open/short.',
      'Connect pressure gauge to Port A on pump. Activate lift — record pressure. Normal: 2,500–2,800 PSI.',
      'If pressure <2,000 PSI with good fluid level, suspect pump wear — inspect pump seal kit first.',
      'If pressure normal but no movement, check relief valve — replace if bypassing at <3,000 PSI.',
      'Inspect hydraulic filter bypass indicator. Replace filter if extended.',
    ],
  },
  {
    id:'slow-lift',
    keywords:["slow lift","lifts slowly","slow elevation","weak lift","slow to raise","takes forever to raise","sluggish lift","slow rise","rising slowly","platform slow"],
    faultCodes:['HYD-05'],
    sections:['s3-3','s3-6','s3-1'],
    parts:['SKJ-HYD-201','SKJ-104880','SKJ-HF046-1G'],
    severity:'medium',
    diagnosis:`Slow lift on the SJIII 3219 usually means reduced pump volumetric efficiency or restriction in the hydraulic circuit.

**Most likely causes:**
- **Pump wear** — Gear pump efficiency degrades with hours. At >2,000 hrs, volumetric efficiency often drops below spec (1.2 GPM rated). Check: pressure at Port A should still be 2,500+ PSI but flow rate is reduced.
- **Wrong or degraded fluid** — ISO 68 fluid at cold temperatures becomes too viscous and slows flow. Check fluid type (spec: ISO 46 AW) and temperature.
- **Dirty hydraulic filter** — A partially bypassing filter causes flow restriction. Replace if bypass indicator has extended at any point.
- **Partial solenoid restriction** — Debris on the solenoid spool can cause partial restriction without fully blocking flow.`,
    steps:[
      'Check fluid type and condition — should be ISO 46 AW, clear/amber. Milky fluid = water contamination.',
      'Check filter bypass indicator. If extended, replace filter (SKJ-104880) before further diagnosis.',
      'Measure cycle time: platform should reach full height in ~30 seconds. Record actual time.',
      'Connect pressure gauge to Port A — pressure should still be 2,500+ PSI even if slow (flow issue, not pressure).',
      'If pressure is low AND slow: suspect pump wear. Inspect pump seal kit first (SKJ-HYD-201).',
      'Inspect solenoid spool for debris — remove and clean with clean hydraulic fluid.',
    ],
  },
  {
    id:'cylinder-drift',
    keywords:["platform drifting","platform dropping","sinking","drift","platform drops","lowers on its own","descends on its own","slow descent","platform creeping down","platform creeps","won't hold height","losing height"],
    faultCodes:['HYD-03'],
    sections:['s3-2','s3-4'],
    parts:['SKJ-103100','SKJ-103445','SKJ-103512','SKJ-CHK-302'],
    severity:'high',
    diagnosis:`Platform drift on the SJIII 3219 is a significant safety concern. Acceptable maximum drift is **2 inches per minute** at rated load (500 lb). Anything beyond that requires immediate investigation.

**Primary cause: Cylinder internal seal wear** — The lift cylinder rod seal and piston seal wear over time, allowing fluid to bypass back to reservoir under load. The cylinder seal replacement interval is **3,000 hours**. Refer to **Service Bulletin SB-2847** for the revised procedure that applies to serial SJ3219-00600 and later.

**Secondary cause: Control valve leak-by** — The solenoid spool may not be fully seating when de-energized, allowing slow fluid return. Test by isolating: close the manual shut-off valve between pump and cylinder (if fitted) and re-check drift rate. If drift stops, the leak is upstream of the cylinder.

**Check valve** — A failed check valve in the lift circuit allows reverse flow. Test with a pressure gauge held at the cylinder port with valve isolated.`,
    steps:[
      'Measure actual drift rate: raise to full height, place 500 lb on platform, measure drop over 1 minute.',
      'If >2 in/min, raise and block platform for safety before further inspection.',
      'Visually inspect cylinder rod for scoring, pitting, or seal extrusion around rod seal area.',
      'Check service hours — if >3,000 hr, seal replacement is overdue regardless of measured drift.',
      'Isolate the cylinder from the valve by closing the manual shut-off (if fitted) and re-measure drift.',
      'If drift stops when isolated: valve leak-by. Replace or clean solenoid spool.',
      'If drift continues when isolated: cylinder seals failed. Order seal kit SKJ-103100. Follow SB-2847.',
      'After seal replacement, pressure test at 3,200 PSI for 5 minutes — zero visible drift required.',
    ],
  },
  {
    id:'hydraulic-leak',
    keywords:["hydraulic leak","oil leak","fluid leak","leaking hydraulic","hydraulic fluid leaking","dripping oil","oil on floor","puddle under","hydraulic fluid on","wet around cylinder","oil around"],
    faultCodes:['HYD-01','HYD-03'],
    sections:['s3-2','s3-6','s3-1'],
    parts:['SKJ-103100','SKJ-103445','SKJ-103512','SKJ-HF046-1G'],
    severity:'high',
    diagnosis:`External hydraulic leaks on the SJIII 3219 require immediate attention — fluid on the ground is both an environmental and slip hazard, and loss of fluid will cause HYD-01 (low pressure) if uncorrected.

**Locate the source first:**
- **Cylinder rod seal:** Most common leak point. Look for oil tracking down the cylinder rod. Replace rod wiper seal (SKJ-103445) as a minimum; full seal kit (SKJ-103100) preferred.
- **Hydraulic filter housing:** Check the filter housing O-ring and drain plug. A weeping filter base often looks like a pump or line leak.
- **Hose connections and fittings:** Inspect all JIC and NPT connections in the lift circuit. Wrench-tighten any weepers — do not over-torque.
- **Pump seal:** Oil around the pump drive shaft indicates pump shaft seal failure. Replace pump seal kit (SKJ-HYD-201).`,
    steps:[
      'Clean the entire hydraulic system with degreaser. Run the machine through several lift cycles.',
      'Identify the leak source — look for wet origin point with UV dye if needed.',
      'Check fluid level and top up with ISO 46 AW before continuing diagnostics.',
      'If leak is at cylinder rod: replace rod wiper seal (SKJ-103445) minimum, or full seal kit (SKJ-103100).',
      'If leak is at filter base: replace filter (SKJ-104880) and inspect housing O-ring.',
      'If leak is at pump shaft: replace pump seal kit (SKJ-HYD-201).',
      'After repair, pressure test at 2,800 PSI for 10 minutes and confirm zero external leakage.',
    ],
  },
  {
    id:'wont-drive',
    keywords:["won't drive","can't drive","not driving","drive not working","won't move","can't move","drive fault","drv","drive motor","wheels not turning","not moving"],
    faultCodes:['DRV-01','DRV-02','ELC-05'],
    sections:['s5-1','s4-2'],
    parts:['SKJ-MTR-400','SKJ-LIM-504'],
    severity:'high',
    diagnosis:`Drive failure on the SJIII 3219 is usually either a brake release issue or a motor/controller fault.

**Key distinction:** Is the machine trying to drive (motor energized but wheels don't turn) or completely unresponsive?

- **Unresponsive:** Check emergency stop status. Both base and platform E-stops must be reset. Check battery voltage under load (>22V required).
- **Motor energized but no movement:** Suspect brake not releasing (DRV-02). The electromagnetic brake requires >18V to release. Check brake solenoid voltage at connector B3.
- **Drive disabled at height:** Normal operation — drive speed is restricted when platform is elevated and disabled above approximately 6 ft (DRV-03). Lower the platform fully.
- **Fault code DRV-01:** Check drive motor winding resistance — should be 2–5 Ω per phase. Inspect hub for seizure.`,
    steps:[
      'Check all E-stop buttons — twist to release. Verify platform is fully lowered.',
      'Check battery voltage under load (during drive attempt) — must be >22V.',
      'If voltage OK, check brake solenoid voltage at connector B3 — must read >18V when drive selected.',
      'If brake voltage OK but brake not releasing, check brake air gap: spec 0.010–0.020". Adjust if needed.',
      'Check descent safety bar limit switch (SKJ-LIM-504) — must close when bar is in the up position.',
      'If motor is energized but no movement: inspect hub for seizure. Check wheel nut torque (100 Nm).',
      'Motor resistance test: disconnect motor leads, check resistance between each phase pair — spec 2–5 Ω.',
    ],
  },
  {
    id:'battery-electrical',
    keywords:["battery","batteries","low power","won't charge","not charging","charger","battery dead","low battery","electrical","elc","no power","power issue","controller","main controller","platform controller"],
    faultCodes:['ELC-01','ELC-02','ELC-03'],
    sections:['s4-1','s4-3','s4-4'],
    parts:['SKJ-BAT-500','SKJ-CHR-501','SKJ-CTL-502','SKJ-JOY-503'],
    severity:'high',
    diagnosis:`Battery and electrical faults on the SJIII 3219 span three systems: the battery bank, the base controller, and the platform controller.

**Battery System (24V, four 6V batteries in series):**
Fully charged specific gravity: **1.265**. Minimum operating voltage under load: **22V**. Check each battery individually — a single weak cell will pull the entire bank down. Most "low power" calls are single-battery failures, not full replacement needed.

**Main Controller (ELC-02):**
The base controller logs fault codes via LED blink patterns. Inspect connectors J1–J4 for corrosion before replacing. This is the most expensive component on the machine — confirm all wiring is clean first.

**Platform Controller (ELC-03):**
Communicates over CAN bus. The most common fault is connector P4 corrosion. Clean with electrical contact cleaner and inspect for bent pins before ordering the joystick module.`,
    steps:[
      'Check overall system voltage at battery terminals — should be ≥24V at rest, ≥22V under load.',
      'Check individual battery voltages — each 6V battery should read ≥6.0V at rest. Replace any <5.8V.',
      'Check battery specific gravity with hydrometer — target 1.265 per cell.',
      'Inspect battery charger output: check charger is reading correct voltage and current during charge cycle.',
      'For ELC-02: inspect connectors J1–J4 at base controller for corrosion. Note LED blink pattern.',
      'For ELC-03: inspect connector P4 at platform controller with electrical contact cleaner.',
      'If controller fault persists after wiring inspection: replace controller board.',
    ],
  },
  {
    id:'maintenance',
    keywords:["service","maintenance","service interval","when to replace","when should i","pm","preventive maintenance","scheduled maintenance","schedule","how often","hours","inspection","lubricate","grease","oil change"],
    faultCodes:[],
    sections:['s7','s3-6','s3-2','s6-1'],
    parts:['SKJ-104880','SKJ-HF046-1G','SKJ-103100','SKJ-PAD-601'],
    severity:'low',
    diagnosis:`SJIII 3219 Maintenance Schedule — Key Intervals:

**Daily / 8 hr:**
Check hydraulic fluid level, battery charge level, inspect for external leaks, test all E-stops and safety devices, inspect descent safety bar function.

**Every 250 hr:**
Replace hydraulic filter (SKJ-104880). Inspect and lubricate all scissor arm pins. Check wear pad thickness (replace if <1/4"). Check all fasteners for tightness.

**Every 500 hr:**
Inspect lift cylinder for drift (max 2 in/min). Battery load test. Check pressure relief valve setting (3,000–3,400 PSI). Inspect hoses for chafing.

**Every 1,000 hr:**
Full hydraulic fluid change (2.5 gal ISO 46 AW). Inspect all cylinder seals. Check drive motor brushes. Inspect all wear pads and pins for replacement.

**Every 3,000 hr:**
Lift cylinder seal replacement — mandatory. Follow Service Bulletin SB-2847 procedure.`,
    steps:[],
  },
  {
    id:'wear-pads-pins',
    keywords:["wear pad","wear pads","scissor pin","scissor arm","arm pin","binding","grinding","squeaking","noise","structural","wobble","platform wobbly","lateral movement"],
    faultCodes:[],
    sections:['s6-1','s7'],
    parts:['SKJ-PAD-601','SKJ-PIN-600'],
    severity:'medium',
    diagnosis:`Scissor arm wear pads and pins are the most commonly overlooked wear items on the SJIII 3219.

**Wear Pads (SKJ-PAD-601):**
UHMW polyethylene pads slide between scissor arm channels. Replace when remaining thickness is less than **1/4 inch** or when any lateral play becomes visible. A worn wear pad allows the scissor arm to contact the structural channel directly, causing scoring and accelerated structural wear. Replace pads in sets — all upper or all lower at once.

**Scissor Arm Pins (SKJ-PIN-600):**
Inspect pins for scoring, grooving, and elongated pin holes. Spec: 25mm diameter. Replace if worn below 24.5mm. Lubricate all pins every 250 hr with multi-purpose grease (not white lithium). A dry pin will cause binding on elevation and often sounds like a structural creak.

**Noise diagnosis:**
- Creak/groan on elevation: dry pins — lubricate first before replacing
- Grinding: worn pad allowing metal-to-metal contact
- Clunk: loose or worn pin — inspect and replace`,
    steps:[
      'Lower platform fully. Inspect all wear pads — check thickness at thinnest visible point.',
      'Replace all pads on one horizontal channel as a set if any pad is <1/4" thick.',
      'Inspect all scissor arm pins. Measure diameter with calipers — replace if <24.5mm.',
      'Check pin holes for elongation by attempting lateral movement at each joint.',
      'Lubricate all pins with multi-purpose grease before raising the platform.',
      'Raise and lower the platform 3× to distribute grease and re-check for noise.',
    ],
  },
];

// ── Response generator ────────────────────────────────────────────────────────

function diagFindFaultCode(text) {
  const match = text.toUpperCase().match(/\b(HYD|ELC|DRV)-\d{2}\b/);
  return match ? match[0] : null;
}

function diagMatchSymptom(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const s of SJ3219_SYMPTOMS) {
    let score = 0;
    for (const kw of s.keywords) {
      if (lower.includes(kw)) score += kw.split(' ').length; // longer match = higher score
    }
    if (score > bestScore) { bestScore = score; best = s; }
  }
  return bestScore > 0 ? best : null;
}

function diagLookupFaultCode(code) {
  return SJ3219_FAULT_CODES[code] || null;
}

function diagGetSection(id) {
  return SJ3219_SECTIONS.find(s => s.id === id) || null;
}

// Returns a structured response object
function diagGenerateResponse(userMessage, ctx) {
  const text = userMessage.trim();

  // 1. Explicit fault code?
  const faultCode = diagFindFaultCode(text);
  if (faultCode && SJ3219_FAULT_CODES[faultCode]) {
    const fc = SJ3219_FAULT_CODES[faultCode];
    const section = diagGetSection(fc.section);
    return {
      type: 'fault_code',
      faultCode,
      title: `Fault code ${faultCode}: ${fc.title}`,
      severity: fc.severity,
      body: `**Fault ${faultCode}** — ${fc.title}\n\n**Most likely causes:**\n${fc.causes.map((c,i)=>`${i+1}. ${c}`).join('\n')}`,
      steps: SJ3219_SYMPTOMS.find(s=>s.faultCodes.includes(faultCode))?.steps || [],
      manualRefs: [section].filter(Boolean),
      parts: fc.parts,
      machine: 'Skyjack SJIII 3219',
    };
  }

  // 2. Symptom keyword match?
  const symptom = diagMatchSymptom(text);
  if (symptom) {
    const manualRefs = symptom.sections.map(id => diagGetSection(id)).filter(Boolean);
    return {
      type: 'symptom',
      title: symptom.id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
      severity: symptom.severity,
      body: symptom.diagnosis,
      steps: symptom.steps,
      faultCodes: symptom.faultCodes,
      manualRefs,
      parts: symptom.parts,
      machine: 'Skyjack SJIII 3219',
    };
  }

  // 3. Manual section lookup?
  const sectionMatch = SJ3219_SECTIONS.find(s =>
    s.title.toLowerCase().split(' ').some(w => w.length > 4 && text.toLowerCase().includes(w))
  );
  if (sectionMatch) {
    return {
      type: 'manual',
      title: `Manual Reference — ${sectionMatch.title}`,
      severity: 'low',
      body: `**Chapter ${sectionMatch.chapter} — ${sectionMatch.title}** (p.${sectionMatch.page})\n\n${sectionMatch.summary}`,
      steps: [],
      manualRefs: [sectionMatch],
      parts: [],
      machine: 'Skyjack SJIII 3219',
    };
  }

  // 4. Part number lookup?
  const partMatch = text.match(/SKJ-[\w-]+/i);
  if (partMatch) {
    return {
      type: 'parts_lookup',
      title: 'Parts Reference',
      severity: 'low',
      body: `Looking up part **${partMatch[0].toUpperCase()}** in the SJIII 3219 parts catalog. See the part card below for availability and pricing.`,
      steps: [],
      manualRefs: [],
      parts: [partMatch[0].toUpperCase()],
      machine: 'Skyjack SJIII 3219',
    };
  }

  // 5. General / unmatched
  return {
    type: 'general',
    title: 'Diagnostic Assistant',
    severity: 'low',
    body: `I'm scoped to the **Skyjack SJIII 3219** service manual and parts database. I can help you with:\n\n- **Fault codes** (e.g. HYD-04, ELC-01, DRV-02)\n- **Symptoms** (e.g. "won't elevate", "platform drifting", "won't drive")\n- **Maintenance intervals** and service procedures\n- **Parts identification** and recommendations\n\nDescribe what you're seeing on the machine and I'll walk through the diagnosis with you.`,
    steps: [],
    manualRefs: [],
    parts: [],
    machine: 'Skyjack SJIII 3219',
  };
}

window.SJ3219_SECTIONS = SJ3219_SECTIONS;
window.SJ3219_FAULT_CODES = SJ3219_FAULT_CODES;
window.diagGenerateResponse = diagGenerateResponse;
