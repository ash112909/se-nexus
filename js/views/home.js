function render_home(el) {
  const _user = Store.getCurrentUser();
  const _isSupervisor = _user && _user.role === 'supervisor';
  const _firstName = _user ? _user.displayName.split(' ')[0] : 'there';
  const loc = Store.getCurrentLocation();
  const locName = loc ? loc.name : (_isSupervisor ? 'All locations' : 'Mid-County Rental');
  const activeWOs = Store.getWorkOrders('active', _isSupervisor ? null : (_user ? _user.shortName : null));

  const ALL_SUPPLIERS = [
    { id:'abatement',   name:'Abatement Technologies'  }, { id:'abc-weld',    name:'ABC Welding Supply'       },
    { id:'access-inn',  name:'Access Innovators LLC'   }, { id:'access-trk',  name:'Access Truck Parts'       },
    { id:'advance',     name:'Advance Auto Parts'      }, { id:'airgas',      name:'Airgas'                   },
    { id:'allen-eng',   name:'Allen Engineering'       }, { id:'allmand',     name:'Allmand Brothers'         },
    { id:'ametek',      name:'Ametek'                  }, { id:'ana-airman',  name:'ANA - Airman'             },
    { id:'apt',         name:'APT Parts & Tools'       }, { id:'armadillo',   name:'Armadillo Tire LLC'       },
    { id:'arp-elec',    name:'ARP Electric'            }, { id:'arrow',       name:'Arrow LLC'                },
    { id:'astrak',      name:'Astrak USA'              }, { id:'atlas-cop',   name:'Atlas Copco'              },
    { id:'baldor',      name:'Baldor Electric'         }, { id:'baldwin',     name:'Baldwin Filters'          },
    { id:'bobcat',      name:'Bobcat'                  }, { id:'bosch-pt',    name:'Bosch Power Tools'        },
    { id:'bosch-rex',   name:'Bosch Rexroth'           }, { id:'bridgestone', name:'Bridgestone Americas'     },
    { id:'carquest',    name:'Carquest Auto Parts'     }, { id:'case',        name:'Case Construction Parts'  },
    { id:'caterpillar', name:'Caterpillar'             }, { id:'continental', name:'Continental Tires'        },
    { id:'cte',         name:'CTE Parts'               }, { id:'cummins',     name:'Cummins'                  },
    { id:'danfoss',     name:'Danfoss'                 }, { id:'dewalt',      name:'DeWalt Industrial'        },
    { id:'donaldson',   name:'Donaldson Filtration'    }, { id:'doosan',      name:'Doosan Portable Power'    },
    { id:'dur-a-lift',  name:'Dur-A-Lift'              }, { id:'eaton',       name:'Eaton Corporation'        },
    { id:'emerson',     name:'Emerson Electric'        }, { id:'empire-hyd',  name:'Empire Hydraulics'        },
    { id:'enerpac',     name:'Enerpac'                 }, { id:'fastenal',    name:'Fastenal'                 },
    { id:'fleetpride',  name:'FleetPride'              }, { id:'flo-comp',    name:'FLO Components'           },
    { id:'flowserve',   name:'Flowserve'               }, { id:'genie',       name:'Genie (Terex)'            },
    { id:'grainger',    name:'Grainger'                }, { id:'grove',       name:'Grove Cranes'             },
    { id:'haulotte',    name:'Haulotte'                }, { id:'hendrickson', name:'Hendrickson'              },
    { id:'hose-fit',    name:'Hose & Fittings Inc'     }, { id:'husco',       name:'Husco International'      },
    { id:'hydraforce',  name:'Hydraforce'              }, { id:'igus',        name:'Igus'                     },
    { id:'ingersoll',   name:'Ingersoll Rand'          }, { id:'inpro',       name:'Inpro Corporation'        },
    { id:'interstate',  name:'Interstate Battery'      }, { id:'jlg',         name:'JLG Industries'           },
    { id:'john-deere',  name:'John Deere Parts'        }, { id:'knd',         name:'K&N Engineering'          },
    { id:'komatsu',     name:'Komatsu'                 }, { id:'lift-parts',  name:'Liftquip Parts'           },
    { id:'lincoln-elc', name:'Lincoln Electric'        }, { id:'link-belt',   name:'Link-Belt Cranes'         },
    { id:'lubrizol',    name:'Lubrizol'                }, { id:'manitou',     name:'Manitou Americas'         },
    { id:'manitowoc',   name:'Manitowoc Cranes'        }, { id:'mcneilus',    name:'McNeilus Companies'       },
    { id:'meritor',     name:'Meritor'                 }, { id:'michelin',    name:'Michelin North America'   },
    { id:'mobil-ind',   name:'Mobil Industrial Lubes'  }, { id:'msc',         name:'MSC Industrial Supply'    },
    { id:'napa',        name:'NAPA Auto Parts'         }, { id:'nat-hyd',     name:'National Hydraulics'      },
    { id:'netzsch',     name:'Netzsch Pumps'           }, { id:'oregon',      name:'Oregon Tool'              },
    { id:'pce',         name:'Pacific Coast Engines'   }, { id:'parker',      name:'Parker Hannifin'          },
    { id:'perkins',     name:'Perkins Engines'         }, { id:'pettibone',   name:'Pettibone'                },
    { id:'raymond',     name:'Raymond Corporation'     }, { id:'rexnord',     name:'Rexnord'                  },
    { id:'sauer',       name:'Sauer-Danfoss'           }, { id:'schaeffer',   name:'Schaeffer Mfg'            },
    { id:'shell-lub',   name:'Shell Lubricants'        }, { id:'skf',         name:'SKF Bearings'             },
    { id:'skyjack',     name:'Skyjack'                 }, { id:'stanley',     name:'Stanley Tools'            },
    { id:'sun-hyd',     name:'Sun Hydraulics'          }, { id:'sunbelt-pts', name:'Sunbelt Parts Supply'     },
    { id:'superior',    name:'Superior Industries'     }, { id:'terex',       name:'Terex Parts'              },
    { id:'toro',        name:'Toro Parts'              }, { id:'toyota',      name:'Toyota MH'                },
    { id:'trelleborg',  name:'Trelleborg'              }, { id:'twin-power',  name:'Twin Power'               },
    { id:'united-pts',  name:'United Parts & Supply'   }, { id:'valeo',       name:'Valeo'                    },
    { id:'vanair',      name:'Vanair Manufacturing'    }, { id:'vermeer',     name:'Vermeer'                  },
    { id:'wagner',      name:'Wagner Parts'            }, { id:'wesco',       name:'Wesco Distribution'       },
    { id:'xtreme',      name:'Xtreme Parts'            }, { id:'ziegler',     name:'Ziegler CAT Parts'        },
  ].sort((a,b) => a.name.localeCompare(b.name));

  // Avatar color palette — cycled by first-letter char code
  const AV_COLORS = [
    { bg:'#E6F4EC', fg:'#1B5E35' }, { bg:'#DBEAFE', fg:'#1D4ED8' }, { bg:'#FEE2E2', fg:'#B91C1C' },
    { bg:'#EDE9FE', fg:'#534AB7' }, { bg:'#D1FAE5', fg:'#065F46' }, { bg:'#FEF3C7', fg:'#92400E' },
    { bg:'#F3F4F6', fg:'#374151' }, { bg:'#FFE4E6', fg:'#9F1239' }, { bg:'#E0F2FE', fg:'#0369A1' },
    { bg:'#FDF4FF', fg:'#7E22CE' },
  ];
  function avColor(name) { return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length]; }

  // Keep a small array for the welcome-bar stat reference
  const SUPPLIERS = ALL_SUPPLIERS;

  function getNewsItems() {
    const cms = (Store.getCmsArticles ? Store.getCmsArticles('published') : []).map(a => ({
      id:a.id, type:a.type||'notice', date:a.postedDate||'', dateLabel:a.postedDate||'',
      title:a.title, summary:a.summary||'',
    }));
    const all = [...cms, ...(typeof NEWS_ARTICLES!=='undefined'
      ? NEWS_ARTICLES.filter(n => !cms.find(c=>c.id===n.id)) : [])];
    all.sort((a,b) => (b.date||'').localeCompare(a.date||''));
    return all.slice(0,4);
  }

  const TYPE_META = {
    bulletin:{ label:'Service Bulletin', color:'#1B5E35', bg:'#E6F4EC', icon:'ti-alert-triangle' },
    fleet:   { label:'Fleet Update',     color:'#185FA5', bg:'#DBEAFE', icon:'ti-building'       },
    supplier:{ label:'Supplier News',    color:'#534AB7', bg:'#EDE9FE', icon:'ti-news'            },
    warranty:{ label:'Warranty',         color:'#0F6E56', bg:'#D1FAE5', icon:'ti-shield-check'   },
    safety:  { label:'Safety Alert',     color:'#B91C1C', bg:'#FEE2E2', icon:'ti-alert-octagon'  },
    pricing: { label:'Pricing',          color:'#6B7280', bg:'#F3F4F6', icon:'ti-tag'            },
    training:{ label:'Training',         color:'#5B21B6', bg:'#EDE9FE', icon:'ti-certificate'    },
    notice:  { label:'Notice',           color:'#374151', bg:'#F9FAFB', icon:'ti-info-circle'    },
  };

  const SLIDES = [
    { icon:'ti-crane',        iconBg:'#E6F4EC', iconColor:'#1B5E35', accent:'#00843D', bg:'#1C1F2E',
      eyebrow:'Fleet highlight', title:'2 new Bobcat S770 units arriving Jul 8',
      body:'Pre-delivery inspection checklists are ready. Assign intake orders before delivery.',
      cta:'Create intake order', ctaFn:"sendPrompt('Open orders list')" },
    { icon:'ti-shield-check', iconBg:'#D1FAE5', iconColor:'#0F6E56', accent:'#34D399', bg:'#0E2218',
      eyebrow:'Warranty alert', title:'Toyota FL-031 warranty expires Dec 2026',
      body:'Submit outstanding warranty claims before coverage lapses.',
      cta:'View WO #100103', ctaFn:"Router.navigate('wo-detail',{woId:100103})" },
    { icon:'ti-speakerphone', iconBg:'#EDE9FE', iconColor:'#534AB7', accent:'#A78BFA', bg:'#19163A',
      eyebrow:'Platform update', title:'SmartEquip training — Jun 11, 2:00 PM',
      body:'Covers parts diagrams, the diagnostic assistant, and the updated ordering workflow.',
      cta:'Read more', ctaFn:"sendPrompt('Open news and updates')" },
    { icon:'ti-tag',          iconBg:'#DBEAFE', iconColor:'#185FA5', accent:'#60A5FA', bg:'#0E1E38',
      eyebrow:'Pricing notice', title:'Caterpillar parts +3–5% effective Jul 1',
      body:'Track adjuster and undercarriage parts affected. Review open POs before Jun 30.',
      cta:'View news', ctaFn:"sendPrompt('Open news and updates')" },
  ];

  el.innerHTML = `
<style>
/* ── Layout shell ─────────────────────────────────────── */
.home-main { flex:1; overflow-y:auto; background:#F5F2EE; }
.home-body  { padding:24px 28px 48px; }

/* ── Welcome bar ──────────────────────────────────────── */
.home-welcome { background:#FFFFFF; border-bottom:0.5px solid #E8E4DF; padding:18px 28px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.hw-brand     { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.hw-mark      { width:38px; height:38px; background:#00843D; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hw-name      { font-size:15px; font-weight:800; color:#111318; letter-spacing:-.3px; line-height:1.15; }
.hw-sub       { font-size:10px; color:#ABA6A0; margin-top:1px; }
.hw-sep       { width:1px; height:30px; background:#E8E4DF; flex-shrink:0; }
.hw-greet     { font-size:13px; color:#5A5F6E; line-height:1.5; }
.hw-greet strong { color:#111318; font-weight:700; }
.hw-loc       { font-size:11px; color:#ABA6A0; display:flex; align-items:center; gap:3px; margin-top:1px; }
.hw-stats     { display:flex; gap:6px; margin-left:auto; }
.hw-stat      { text-align:center; padding:7px 14px; background:#F5F2EE; border-radius:8px; min-width:64px; }
.hw-stat-val  { font-size:18px; font-weight:800; color:#111318; line-height:1; }
.hw-stat-lbl  { font-size:9px; color:#9CA3AF; margin-top:2px; letter-spacing:.2px; white-space:nowrap; }
.hw-cta       { background:#00843D; color:#0D2E18; border:none; border-radius:8px; padding:9px 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; flex-shrink:0; }
.hw-cta:hover { background:#006830; }

/* ── Two-col grid ─────────────────────────────────────── */
.home-grid   { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:start; }
.home-left   {}
.home-right  {}

/* ── Section label ────────────────────────────────────── */
.h-lbl { font-size:11px; font-weight:700; color:#3A3D4A; letter-spacing:.1px; display:flex; align-items:center; gap:5px; margin-bottom:10px; }
.h-lbl-action { margin-left:auto; font-size:11px; font-weight:400; color:#ABA6A0; cursor:pointer; display:flex; align-items:center; gap:3px; }
.h-lbl-action:hover { color:#5A5F6E; }

/* ── Carousel ─────────────────────────────────────────── */
.home-car-wrap { background:#111318; border-radius:12px; overflow:hidden; margin-bottom:8px; }
.home-slide    { display:none; padding:22px 22px 20px; align-items:flex-start; gap:14px; }
.home-slide.active { display:flex; }
.home-car-footer { display:flex; align-items:center; padding:0 4px 14px 4px; }
.home-dot  { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.2); border:none; cursor:pointer; padding:0; margin-right:5px; transition:all .15s; }
.home-dot.active { background:#00843D; width:16px; border-radius:3px; }
.home-arr  { width:26px; height:26px; border:0.5px solid rgba(255,255,255,.12); border-radius:6px; background:rgba(255,255,255,.06); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; color:rgba(255,255,255,.5); margin-left:4px; }
.home-arr:hover { background:rgba(255,255,255,.12); color:#FFF; }

/* ── News cards ───────────────────────────────────────── */
.hn-card  { display:flex; align-items:flex-start; gap:10px; background:#FFF; border:0.5px solid #E8E4DF; border-radius:9px; padding:11px 12px; cursor:pointer; margin-bottom:7px; }
.hn-card:hover { border-color:#C8C3BC; }
.hn-icon  { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:1px; }
.hn-type  { font-size:9px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; margin-bottom:1px; }
.hn-title { font-size:12px; font-weight:600; color:#111318; line-height:1.4; }
.hn-sub   { font-size:11px; color:#9CA3AF; line-height:1.4; margin-top:1px; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
.hn-date  { font-size:10px; color:#C0BAB3; white-space:nowrap; flex-shrink:0; padding-top:1px; margin-left:auto; padding-left:10px; }

/* ── Supplier network list ───────────────────────────── */
.hs-panel   { background:#FFF; border:0.5px solid #E8E4DF; border-radius:12px; overflow:hidden; }
.hs-search  { width:100%; height:36px; border:none; border-bottom:0.5px solid #E8E4DF; padding:0 12px 0 36px; font-size:13px; font-family:inherit; color:#111318; outline:none; background:#FAFAF9; box-sizing:border-box; }
.hs-search::placeholder { color:#B0AAA3; }
.hs-search:focus { background:#FFF; }
.hs-search-wrap { position:relative; flex-shrink:0; }
.hs-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#B0AAA3; font-size:14px; pointer-events:none; }
.hs-list    { max-height:540px; overflow-y:auto; padding:4px 0; }
.hs-row     { display:flex; align-items:center; gap:10px; padding:7px 12px; cursor:pointer; transition:background .1s; }
.hs-row:hover { background:#F5F2EE; }
.hs-avatar  { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; letter-spacing:.3px; }
.hs-row-name { font-size:13px; font-weight:600; color:#111318; line-height:1.3; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
</style>

<div class="shell">
  ${buildSidebar('home')}
  <div class="main home-main">
    <div class="topbar">
      <div style="font-size:13px;color:#5C6070;font-weight:500;">Home</div>
      <div class="topbar-search" onclick="GlobalSearch.open()"><i class="ti ti-search"></i> Search parts, serials, manuals…</div>
      ${buildTopbarRight()}
    </div>

    <!-- Welcome bar -->
    <div class="home-welcome">
      <div class="hw-brand">
        <img src="smartequiplogo.png" style="height:32px;width:auto;object-fit:contain;display:block;border-radius:4px;"/>
      </div>
      <div class="hw-sep"></div>
      <div>
        <div class="hw-greet">Welcome back, <strong>${_firstName}</strong>.</div>
        <div class="hw-loc"><i class="ti ti-map-pin" style="font-size:10px;"></i>${locName}</div>
      </div>
      <div class="hw-stats">
        <div class="hw-stat">
          <div class="hw-stat-val">${activeWOs.length}</div>
          <div class="hw-stat-lbl">Active WOs</div>
        </div>
        <div class="hw-stat">
          <div class="hw-stat-val">3</div>
          <div class="hw-stat-lbl">Branches</div>
        </div>
        <div class="hw-stat">
          <div class="hw-stat-val">${ALL_SUPPLIERS.length}</div>
          <div class="hw-stat-lbl">Suppliers</div>
        </div>
      </div>
      <button class="hw-cta" onclick="sendPrompt('Go back to dashboard')">
        <i class="ti ti-layout-dashboard" style="font-size:14px;"></i> Dashboard
      </button>
    </div>

    <div class="home-body">
      <div class="home-grid">

        <!-- Left: carousel + news -->
        <div class="home-left">
          <div class="h-lbl"><i class="ti ti-speakerphone" style="color:#00843D;"></i> Fleet highlights</div>
          <div class="home-car-wrap">
            ${SLIDES.map((s, i) => `
            <div class="home-slide${i===0?' active':''}" style="background:${s.bg};" id="hslide-${i}">
              <div style="width:38px;height:38px;border-radius:9px;background:${s.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ${s.icon}" style="font-size:18px;color:${s.iconColor};"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:9px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${s.accent};margin-bottom:4px;">${s.eyebrow}</div>
                <div style="font-size:14px;font-weight:700;color:#FFF;line-height:1.35;margin-bottom:5px;">${s.title}</div>
                <div style="font-size:11px;color:rgba(255,255,255,.45);line-height:1.55;margin-bottom:13px;">${s.body}</div>
                <button onclick="${s.ctaFn}" style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:${s.accent};color:#111318;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">${s.cta} <i class="ti ti-arrow-right" style="font-size:10px;"></i></button>
              </div>
            </div>`).join('')}
            <div class="home-car-footer">
              ${SLIDES.map((_, i) => `<button class="home-dot${i===0?' active':''}" onclick="homeGoSlide(${i})"></button>`).join('')}
              <div style="margin-left:auto;display:flex;gap:4px;">
                <button class="home-arr" onclick="homeGoSlide((window._homeSlide-1+${SLIDES.length})%${SLIDES.length})"><i class="ti ti-chevron-left"></i></button>
                <button class="home-arr" onclick="homeGoSlide((window._homeSlide+1)%${SLIDES.length})"><i class="ti ti-chevron-right"></i></button>
              </div>
            </div>
          </div>

          <div class="h-lbl" style="margin-top:20px;">
            <i class="ti ti-news" style="color:#ABA6A0;"></i> Fleet news &amp; updates
            <span class="h-lbl-action" onclick="sendPrompt('Open news and updates')">View all <i class="ti ti-arrow-right" style="font-size:10px;"></i></span>
          </div>
          ${getNewsItems().map(n => {
            const m = TYPE_META[n.type]||TYPE_META.notice;
            return `<div class="hn-card" onclick="newsOpenArticle('${n.id}')">
              <div class="hn-icon" style="background:${m.bg};color:${m.color};"><i class="ti ${m.icon}"></i></div>
              <div style="flex:1;min-width:0;">
                <div class="hn-type" style="color:${m.color};">${m.label}</div>
                <div class="hn-title">${n.title}</div>
                <div class="hn-sub">${n.summary}</div>
              </div>
              <div class="hn-date">${n.dateLabel||n.date||''}</div>
            </div>`;
          }).join('')}
        </div>

        <!-- Right: supplier network list -->
        <div class="home-right">
          <div class="h-lbl">
            <i class="ti ti-building-store" style="color:#ABA6A0;"></i> Supplier network
            <span style="margin-left:2px;font-size:10px;font-weight:700;background:#F0ECE8;color:#7A7F8E;border-radius:999px;padding:1px 7px;">${ALL_SUPPLIERS.length}</span>
          </div>
          <div class="hs-panel">
            <div class="hs-search-wrap">
              <i class="ti ti-search hs-search-icon"></i>
              <input class="hs-search" id="hs-search" placeholder="Filter suppliers…" oninput="hsFilter(this.value)" autocomplete="off"/>
            </div>
            <div class="hs-list" id="hs-list">
              ${ALL_SUPPLIERS.map(s => {
                const av = avColor(s.name);
                return `<div class="hs-row" data-name="${s.name.toLowerCase()}" onclick="homeOpenSupplier('${s.id}')">
                  <div class="hs-avatar" style="background:${av.bg};color:${av.fg};">${s.name[0].toUpperCase()}</div>
                  <div class="hs-row-name">${s.name}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>`;

  // Carousel
  window._homeSlide = 0;
  window.homeGoSlide = function(idx) {
    el.querySelectorAll('.home-slide').forEach((s, i) => s.classList.toggle('active', i===idx));
    el.querySelectorAll('.home-dot').forEach((d, i) => d.classList.toggle('active', i===idx));
    window._homeSlide = idx;
  };
  let _t = setInterval(() => {
    if (!el.querySelector('.home-car-wrap')) { clearInterval(_t); return; }
    homeGoSlide((window._homeSlide + 1) % SLIDES.length);
  }, 6000);

  // Map home supplier IDs to parts-search catalog IDs (OEM suppliers with full catalog profiles)
  const CATALOG_ID_MAP = { skyjack:'SKJ', caterpillar:'CAT', toyota:'TOY', bobcat:'BOB' };

  window.homeOpenSupplier = function(id) {
    const catalogId = CATALOG_ID_MAP[id];
    if (catalogId) {
      Router.navigate('parts-search', { supplierId: catalogId });
    } else {
      Router.navigate('supplier', { supplierId: id });
    }
  };

  window.hsFilter = function(q) {
    const q2 = q.toLowerCase().trim();
    document.querySelectorAll('#hs-list .hs-row').forEach(row => {
      row.style.display = (!q2 || row.dataset.name.includes(q2)) ? '' : 'none';
    });
  };
}
