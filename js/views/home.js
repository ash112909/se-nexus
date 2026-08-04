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

  // SVG logo helpers — all produce a 34×34 inline SVG mark
  function _svgWrap(inner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">${inner}</svg>`;
  }
  function _txt(lbl, fg, sz, y) {
    return `<text x="17" y="${y||17}" text-anchor="middle" dominant-baseline="central" fill="${fg}" font-family="system-ui,Arial,sans-serif" font-weight="800" font-size="${sz||13}" letter-spacing=".5">${lbl}</text>`;
  }
  // Solid flat color badge (rounded rect)
  function svgFlat(bg, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="${bg}"/>${_txt(lbl,fg,sz)}`);
  }
  // Circle badge on light card
  function svgBadge(circleFill, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="#F5F2EE"/><circle cx="17" cy="17" r="12" fill="${circleFill}"/>${_txt(lbl,fg,sz)}`);
  }
  // Horizontal split (top / bottom)
  function svgSH(top, bot, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="${bot}"/><rect width="34" height="17" rx="0" fill="${top}"/><rect width="34" height="8" rx="8" fill="${top}" y="0"/><rect width="34" height="8" rx="8" fill="${bot}" y="26"/>${_txt(lbl,fg,sz)}`);
  }
  // Vertical split (left / right)
  function svgSV(left, right, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="${right}"/><rect width="17" height="34" fill="${left}"/><rect width="9" height="34" rx="8" fill="${left}" x="0"/><rect width="9" height="34" rx="8" fill="${right}" x="25"/>${_txt(lbl,fg,sz)}`);
  }
  // Diagonal split (top-left / bottom-right)
  function svgDG(c1, c2, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="${c2}"/><path d="M0 0 L34 0 L0 34 Z" fill="${c1}" clip-path="url(#dgc)"/><clipPath id="dgc"><rect width="34" height="34" rx="8"/></clipPath>${_txt(lbl,fg,sz)}`);
  }
  // Stripe accent — solid bg with a right-edge accent stripe
  function svgStripe(bg, stripe, lbl, fg, sz) {
    return _svgWrap(`<rect width="34" height="34" rx="8" fill="${bg}"/><rect x="28" width="6" height="34" fill="${stripe}"/><rect x="28" width="6" height="34" rx="0" fill="${stripe}"/><rect x="29" width="5" height="34" rx="3" fill="${stripe}"/>${_txt(lbl,fg,sz)}`);
  }

  // Per-supplier logo map
  const SUPPLIER_LOGOS = {
    'abatement':   svgFlat('#005F8A','ABT','#FFF',10),
    'abc-weld':    svgFlat('#1A1A1A','ABC','#F59E0B',10),
    'access-inn':  svgBadge('#6366F1','AI','#FFF',13),
    'access-trk':  svgFlat('#0F4C81','ATP','#FFF',10),
    'advance':     svgFlat('#CC0000','ADV','#FFF',10),
    'airgas':      svgFlat('#003087','AG','#FFF',13),
    'allen-eng':   svgFlat('#2563EB','AE','#FFF',13),
    'allmand':     svgFlat('#D97706','AMB','#FFF',10),
    'ametek':      svgFlat('#1E3A5F','AMK','#FFF',10),
    'ana-airman':  svgSH('#005BAA','#E8F0FB','ANA','#FFF',11),
    'apt':         svgFlat('#374151','APT','#FCD34D',11),
    'armadillo':   svgBadge('#92400E','AT','#FFF',13),
    'arp-elec':    svgFlat('#FDE68A','ARP','#1F2937',10),
    'arrow':       svgFlat('#6B7280','ARW','#FFF',10),
    'astrak':      svgFlat('#0D4F3C','ASK','#4ADE80',10),
    'atlas-cop':   svgFlat('#0072BC','AC','#FFF',13),
    'baldor':      svgFlat('#1B3A6B','BLD','#FFF',10),
    'baldwin':     svgFlat('#D32F2F','BFI','#FFF',10),
    'bobcat':      svgFlat('#FF6720','BC','#FFF',14),
    'bosch-pt':    svgFlat('#D40000','BSC','#FFF',10),
    'bosch-rex':   svgFlat('#D40000','BRX','#FFF',10),
    'bridgestone': svgSH('#CC0000','#1A1A1A','BS','#FFF',13),
    'carquest':    svgFlat('#CC0000','CQ','#FFF',13),
    'case':        svgFlat('#F0A500','CAS','#1A1A1A',10),
    'caterpillar': svgFlat('#FFC72C','CAT','#1A1A1A',11),
    'continental': svgFlat('#F5A200','CNT','#1A1A1A',10),
    'cte':         svgFlat('#1D4ED8','CTE','#FFF',11),
    'cummins':     svgBadge('#E31C37','C','#FFF',17),
    'danfoss':     svgFlat('#E2001A','DAN','#FFF',10),
    'dewalt':      svgFlat('#FEBD17','DW','#1A1A1A',14),
    'donaldson':   svgFlat('#005E9E','DON','#FFF',10),
    'doosan':      svgFlat('#003087','DPN','#FFF',10),
    'dur-a-lift':  svgFlat('#CC5500','DAL','#FFF',10),
    'eaton':       svgFlat('#001A70','ETN','#FFF',10),
    'emerson':     svgFlat('#0056A2','EMR','#FFF',10),
    'empire-hyd':  svgDG('#7C3AED','#1E1B4B','EH','#FFF',13),
    'enerpac':     svgFlat('#E10600','EP','#FFF',13),
    'fastenal':    svgFlat('#003DA5','FST','#FFC72C',10),
    'fleetpride':  svgFlat('#CC0000','FP','#FFF',13),
    'flo-comp':    svgFlat('#0F766E','FLO','#FFF',11),
    'flowserve':   svgFlat('#003087','FSV','#FFF',10),
    'genie':       svgFlat('#00AEEF','GEN','#1A1A1A',10),
    'grainger':    svgFlat('#CC0000','GRA','#FFF',10),
    'grove':       svgFlat('#1B5E20','GRV','#A5D6A7',10),
    'haulotte':    svgFlat('#F97316','HAU','#FFF',10),
    'hendrickson': svgFlat('#003DA5','HEN','#FFF',10),
    'hose-fit':    svgFlat('#374151','HFI','#FCD34D',10),
    'husco':       svgFlat('#005BAA','HSC','#FFF',10),
    'hydraforce':  svgFlat('#0F4C81','HF','#FFF',13),
    'igus':        svgFlat('#FF6600','IGS','#1A1A1A',10),
    'ingersoll':   svgFlat('#003DA5','IR','#FFF',14),
    'inpro':       svgFlat('#2D3748','IPR','#FFF',10),
    'interstate':  svgFlat('#CC0000','INT','#FFF',10),
    'jlg':         svgFlat('#003DA5','JLG','#FFF',11),
    'john-deere':  svgSV('#367C2B','#FFDE00','JD','#FFF',13),
    'knd':         svgFlat('#E10600','K&N','#1A1A1A',11),
    'komatsu':     svgFlat('#F59E0B','KMT','#1A1A1A',10),
    'lift-parts':  svgBadge('#059669','LQ','#FFF',13),
    'lincoln-elc': svgFlat('#CC0000','LNE','#FFF',10),
    'link-belt':   svgFlat('#F59E0B','LBC','#1A1A1A',10),
    'lubrizol':    svgFlat('#0F5132','LBZ','#FFF',10),
    'manitou':     svgSH('#E10600','#1A1A1A','MAN','#FFF',10),
    'manitowoc':   svgFlat('#003087','MTC','#FFF',10),
    'mcneilus':    svgFlat('#CC0000','MCN','#FFF',10),
    'meritor':     svgFlat('#003DA5','MRT','#FFF',10),
    'michelin':    svgFlat('#003087','MCH','#FFF',10),
    'mobil-ind':   svgFlat('#CC0000','MOB','#FFF',10),
    'msc':         svgFlat('#0052A5','MSC','#FFF',11),
    'napa':        svgSH('#003DA5','#F7A800','NAPA','#FFF',9),
    'nat-hyd':     svgFlat('#1D4ED8','NHS','#FFF',10),
    'netzsch':     svgFlat('#E10600','NTZ','#FFF',10),
    'oregon':      svgFlat('#4B5320','ORG','#FFF',10),
    'pce':         svgFlat('#0F4C81','PCE','#FFF',10),
    'parker':      svgDG('#FF6600','#1A1A1A','PH','#FFF',13),
    'perkins':     svgFlat('#003DA5','PKS','#FFF',10),
    'pettibone':   svgFlat('#CC5500','PTB','#FFF',10),
    'raymond':     svgFlat('#0052A5','RCO','#FFF',10),
    'rexnord':     svgFlat('#1B3A6B','RXN','#FFF',10),
    'sauer':       svgFlat('#E2001A','S-D','#FFF',11),
    'schaeffer':   svgFlat('#003087','SFR','#FFF',10),
    'shell-lub':   svgFlat('#FCD217','SHL','#CC0000',10),
    'skf':         svgFlat('#003DA5','SKF','#FEBD17',11),
    'skyjack':     svgFlat('#1F6B22','SJ','#FFF',14),
    'stanley':     svgFlat('#FCD217','SWK','#1A1A1A',10),
    'sun-hyd':     svgBadge('#0052A5','SH','#FFF',13),
    'sunbelt-pts': svgFlat('#F97316','SBP','#FFF',10),
    'superior':    svgFlat('#6B21A8','SUP','#FFF',10),
    'terex':       svgFlat('#009639','TRX','#FFF',10),
    'toro':        svgFlat('#CC0000','TRO','#FFF',10),
    'toyota':      svgBadge('#CC0000','TMH','#FFF',10),
    'trelleborg':  svgFlat('#00457C','TRB','#FFF',10),
    'twin-power':  svgFlat('#1B3A6B','TP','#FFF',13),
    'united-pts':  svgFlat('#003DA5','UPS','#FFF',10),
    'valeo':       svgFlat('#003DA5','VLO','#FFF',10),
    'vanair':      svgFlat('#1D4ED8','VNR','#FFF',10),
    'vermeer':     svgFlat('#F59E0B','VMR','#1A1A1A',10),
    'wagner':      svgFlat('#374151','WGR','#FFF',10),
    'wesco':       svgFlat('#CC0000','WSC','#FFF',10),
    'xtreme':      svgFlat('#7C3AED','XPT','#FFF',10),
    'ziegler':     svgFlat('#FFC72C','ZGR','#1A1A1A',10),
  };

  // Fallback letter avatar for unmapped suppliers
  const AV_COLORS = [
    { bg:'#E6F4EC', fg:'#1B5E35' }, { bg:'#DBEAFE', fg:'#1D4ED8' }, { bg:'#FEE2E2', fg:'#B91C1C' },
    { bg:'#EDE9FE', fg:'#534AB7' }, { bg:'#D1FAE5', fg:'#065F46' }, { bg:'#FEF3C7', fg:'#92400E' },
    { bg:'#F3F4F6', fg:'#374151' }, { bg:'#FFE4E6', fg:'#9F1239' }, { bg:'#E0F2FE', fg:'#0369A1' },
    { bg:'#FDF4FF', fg:'#7E22CE' },
  ];
  function svgLogo(id, name) {
    if (SUPPLIER_LOGOS[id]) return SUPPLIER_LOGOS[id];
    const av = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
    return svgFlat(av.bg, name[0].toUpperCase(), av.fg, 15);
  }

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
.hs-avatar  { width:34px; height:34px; border-radius:8px; overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.hs-avatar svg { width:34px; height:34px; display:block; }
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
              ${ALL_SUPPLIERS.map(s => `<div class="hs-row" data-name="${s.name.toLowerCase()}" onclick="homeOpenSupplier('${s.id}')">
                  <div class="hs-avatar">${svgLogo(s.id, s.name)}</div>
                  <div class="hs-row-name">${s.name}</div>
                </div>`).join('')}
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
