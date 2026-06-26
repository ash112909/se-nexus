const Modal = (() => {
  let _el = null;

  function close() {
    if (_el && _el.parentNode) _el.parentNode.removeChild(_el);
    _el = null;
  }

  function show({ title, body, actions, wide } = {}) {
    close();
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const card = document.createElement('div');
    card.style.cssText = `background:#FFFFFF;border-radius:14px;width:100%;max-width:${wide?680:480}px;box-shadow:0 20px 60px rgba(0,0,0,0.2);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden;`;

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:0.5px solid #F0ECE8;';
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size:15px;font-weight:700;color:#111318;letter-spacing:-0.2px;';
    titleEl.textContent = title || '';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="ti ti-x"></i>';
    closeBtn.style.cssText = 'width:28px;height:28px;background:#F5F2EE;border:none;border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:#5A5F6E;font-family:inherit;';
    closeBtn.onclick = close;
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    card.appendChild(header);

    if (body) {
      const bodyEl = document.createElement('div');
      bodyEl.style.cssText = 'padding:18px 20px;max-height:70vh;overflow-y:auto;';
      if (typeof body === 'string') bodyEl.innerHTML = body;
      else bodyEl.appendChild(body);
      card.appendChild(bodyEl);
    }

    if (actions && actions.length) {
      const footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:0.5px solid #F0ECE8;';
      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.textContent = a.label;
        btn.style.cssText = a.primary
          ? 'background:#F5A623;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;color:#1A1200;cursor:pointer;font-family:inherit;'
          : 'background:#FFFFFF;border:0.5px solid #E2DDD8;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:500;color:#3A3D4A;cursor:pointer;font-family:inherit;';
        btn.onclick = () => { if (a.onClick) a.onClick(); };
        footer.appendChild(btn);
      });
      card.appendChild(footer);
    }

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    _el = overlay;

    // focus first input
    setTimeout(() => { const inp = card.querySelector('input,select,textarea'); if (inp) inp.focus(); }, 50);
    return overlay;
  }

  function confirm(message, onYes) {
    show({
      title: 'Confirm',
      body: `<p style="font-size:14px;color:#3A3D4A;line-height:1.6;">${message}</p>`,
      actions: [
        { label: 'Cancel', onClick: close },
        { label: 'Confirm', primary: true, onClick: () => { close(); if (onYes) onYes(); } }
      ]
    });
  }

  return { show, close, confirm };
})();

window.Modal = Modal;
