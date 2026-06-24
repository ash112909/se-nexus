const Router = (() => {
  let current = null;

  const views = {
    'login': 'view-login',
    'dashboard': 'view-dashboard',
    'wo-detail': 'view-wo-detail',
    'parts-search': 'view-parts-search',
    'order-history': 'view-order-history',
    'diagnostics': 'view-diagnostics',
    'manuals': 'view-manuals',
    'recommended': 'view-recommended',
  };

  function navigate(view) {
    if (current) {
      document.getElementById(views[current])?.classList.remove('active');
    }
    current = view;
    const el = document.getElementById(views[view]);
    if (el) {
      el.classList.add('active');
      const renderer = window['render_' + view.replace(/-/g, '_')];
      if (renderer) renderer(el);
    }
  }

  // sendPrompt is referenced by all the HTML snippets' onclick handlers
  window.sendPrompt = function(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('dashboard')) { navigate('dashboard'); }
    else if (p.includes('go to login') || p.includes('show login') || p === 'login') { navigate('login'); }
    else if (p.includes('order history') || p.includes('order detail') || p.includes('tracking')) { navigate('order-history'); }
    else if (p.includes('work order detail') || p.includes('wo #100094') || p.includes('wo #100102')) { navigate('wo-detail'); }
    else if (p.includes('parts search') || p.includes('search parts') || p.includes('diagram')) { navigate('parts-search'); }
    else if (p.includes('diagnostic')) { navigate('diagnostics'); }
    else if (p.includes('manual') || p.includes('doc')) { navigate('manuals'); }
    else if (p.includes('recommended')) { navigate('recommended'); }
    else { navigate('dashboard'); }
  };

  return { navigate };
})();
