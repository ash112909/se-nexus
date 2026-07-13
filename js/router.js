const Router = (() => {
  let current = null;

  const views = {
    'login': 'view-login',
    'home': 'view-home',
    'dashboard': 'view-dashboard',
    'wo-list': 'view-wo-list',
    'wo-detail': 'view-wo-detail',
    'parts-search': 'view-parts-search',
    'order-history': 'view-order-history',
    'diagnostics': 'view-diagnostics',
    'manuals': 'view-manuals',
    'recommended': 'view-recommended',
    'news': 'view-news',
    'approvals': 'view-approvals',
    'order-review': 'view-order-review',
    'analytics': 'view-analytics',
    'cms': 'view-cms',
  };

  let _context = {};

  function navigate(view, ctx) {
    _context = ctx || {};
    if (current) {
      document.getElementById(views[current])?.classList.remove('active');
    }
    current = view;
    const el = document.getElementById(views[view]);
    if (el) {
      el.classList.add('active');
      const renderer = window['render_' + view.replace(/-/g, '_')];
      if (renderer) renderer(el);
      // Inject banners after render (skip login)
      if (view !== 'login' && typeof buildBanners === 'function') {
        const mainEl = el.querySelector('.main');
        if (mainEl) {
          mainEl.querySelectorAll('.fleet-banner-host').forEach(b => b.remove());
          const bannerHtml = buildBanners();
          if (bannerHtml) {
            const host = document.createElement('div');
            host.className = 'fleet-banner-host';
            host.innerHTML = bannerHtml;
            const topbar = mainEl.querySelector('.topbar');
            if (topbar) topbar.after(host);
            else mainEl.insertAdjacentElement('afterbegin', host);
          }
        }
      }
    }
  }

  // sendPrompt is referenced by all the HTML snippets' onclick handlers
  window.sendPrompt = function(prompt) {
    const p = prompt.toLowerCase();

    // Extract WO ID from strings like "WO #100094" or "wo #100094"
    const woMatch = prompt.match(/WO\s*#?(\d{5,6})/i);
    const woId = woMatch ? parseInt(woMatch[1]) : null;

    if (p.includes('dashboard')) { navigate('dashboard'); }
    else if (p.includes('go to login') || p.includes('show login') || p === 'login') { navigate('login'); }
    else if (p.includes('order history')) { navigate('order-history'); }
    else if (p.includes('parts search') || p.includes('search parts') || p.includes('diagram')) { navigate('parts-search', woId ? { woId } : {}); }
    else if ((p.includes('work order detail') || p.includes('wo #') || p.includes('wo detail')) && woId) {
      navigate('wo-detail', { woId });
    }
    else if (p.includes('work order') || p.includes('open wo') || p.includes('wo list')) { navigate('wo-list'); }
    else if (p.includes('diagnostic')) { navigate('diagnostics'); }
    else if (p.includes('manual') || p.includes('doc')) { navigate('manuals'); }
    else if (p.includes('recommended')) { navigate('recommended'); }
    else if (p.includes('news')) { navigate('news'); }
    else if (p.includes('approval')) { navigate('approvals'); }
    else if (p.includes('analytics')) { navigate('analytics'); }
    else { navigate('dashboard'); }
  };

  return { navigate, get context() { return _context; }, get currentView() { return current; } };
})();
