/* ═══════════════════════════════════════
   consent.js — RGPD WhatsApp Consent
   + BilyWeb Project watermark
═══════════════════════════════════════ */
(function () {
  const CONSENT_KEY = 'bilyweb_wa_consent';
  const CONSENT_VERSION = '1.0';

  function hasConsent() {
    try {
      const s = JSON.parse(localStorage.getItem(CONSENT_KEY));
      return s && s.version === CONSENT_VERSION && s.accepted === true;
    } catch { return false; }
  }
  function saveConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted, version: CONSENT_VERSION, date: new Date().toISOString()
    }));
  }

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #consent-overlay {
      display:none; position:fixed; inset:0;
      background:rgba(10,10,10,0.72); z-index:99999;
      align-items:center; justify-content:center;
      padding:1.5rem; backdrop-filter:blur(4px);
    }
    #consent-overlay.show { display:flex !important; }
    #consent-modal {
      background:#f5f0e8; border:3px solid #0a0a0a;
      border-radius:16px; box-shadow:8px 8px 0 #0a0a0a;
      max-width:460px; width:100%; overflow:hidden;
      animation:cmIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes cmIn { from{opacity:0;transform:scale(0.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .cm-head {
      background:#0a0a0a; padding:1.2rem 1.5rem;
      display:flex; align-items:center; gap:1rem;
    }
    .cm-head img { height:30px; width:auto; filter:brightness(0) invert(1); }
    .cm-head span { color:rgba(245,240,232,0.6); font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; font-family:'Instrument Sans',sans-serif; }
    .cm-body { padding:1.75rem 1.5rem 1.5rem; }
    .cm-body h2 { font-family:'Fraunces',Georgia,serif; font-weight:900; font-size:1.55rem; letter-spacing:-0.03em; color:#0a0a0a; margin-bottom:0.6rem; line-height:1.15; }
    .cm-body p { font-size:0.87rem; color:#6b6355; line-height:1.7; margin-bottom:0.6rem; font-family:'Instrument Sans',sans-serif; }
    .cm-legal { background:#fff; border:1px solid rgba(10,10,10,0.1); border-radius:8px; padding:0.9rem 1rem; font-size:0.77rem; color:#6b6355; line-height:1.65; margin:1rem 0 1.5rem; font-family:'Instrument Sans',sans-serif; }
    .cm-legal strong { color:#0a0a0a; }
    .cm-actions { display:flex; gap:0.75rem; flex-wrap:wrap; }
    #consent-accept {
      flex:1; background:#25D366; color:#fff; border:2px solid #25D366;
      border-radius:6px; padding:0.8rem 1.2rem;
      font-family:'Instrument Sans',sans-serif; font-weight:700;
      font-size:0.87rem; text-transform:uppercase; letter-spacing:0.05em;
      cursor:pointer; transition:all 0.2s;
    }
    #consent-accept:hover { background:#1da851; border-color:#1da851; transform:translateY(-1px); }
    #consent-decline {
      background:transparent; color:#6b6355; border:2px solid rgba(10,10,10,0.18);
      border-radius:6px; padding:0.8rem 1.2rem;
      font-family:'Instrument Sans',sans-serif; font-weight:600; font-size:0.82rem;
      cursor:pointer; transition:all 0.2s;
    }
    #consent-decline:hover { border-color:#e63325; color:#e63325; }
    #consent-declined-msg {
      display:none; position:fixed; bottom:calc(72px + 5rem); left:50%;
      transform:translateX(-50%); background:#0a0a0a; color:#f5f0e8;
      padding:0.75rem 1.5rem; border-radius:8px; border-left:4px solid #e63325;
      font-size:0.84rem; font-family:'Instrument Sans',sans-serif;
      z-index:9999; white-space:nowrap; box-shadow:0 8px 30px rgba(0,0,0,0.3);
      animation:cmIn 0.3s ease;
    }
    #bilyweb-watermark {
      position:fixed; bottom:calc(72px + 0.75rem); left:50%;
      transform:translateX(-50%); z-index:500;
      pointer-events:none; opacity:0.08; user-select:none;
    }
    #bilyweb-watermark img { height:26px; width:auto; filter:grayscale(1); }
  `;
  document.head.appendChild(style);

  /* ── Modal HTML ── */
  const overlay = document.createElement('div');
  overlay.id = 'consent-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div id="consent-modal">
      <div class="cm-head">
        <img src="/assets/img/logo-bilyweb.png" alt="BilyWeb Project">
        <span>Consentimiento RGPD</span>
      </div>
      <div class="cm-body">
        <h2>¿Quieres continuar a WhatsApp?</h2>
        <p>Para atenderte correctamente, necesitamos tu consentimiento para contactarte por WhatsApp.</p>
        <div class="cm-legal">
          <strong>¿Qué implica aceptar?</strong><br>
          Autorizas a <strong>BilyWeb Project</strong> (bielgrue@gmail.com) a contactarte mediante WhatsApp para responder a tu consulta. Tus datos no serán cedidos a terceros ni usados para fines distintos. Puedes retirar el consentimiento en cualquier momento.<br><br>
          Base legal: <strong>Consentimiento explícito</strong> · Art. 6.1.a RGPD
        </div>
        <div class="cm-actions">
          <button id="consent-accept">✓ Acepto — ir a WhatsApp</button>
          <button id="consent-decline">No acepto</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const declinedMsg = document.createElement('div');
  declinedMsg.id = 'consent-declined-msg';
  declinedMsg.textContent = '❌ Sin consentimiento no podemos abrir WhatsApp. Escríbenos al email: bielgrue@gmail.com';
  document.body.appendChild(declinedMsg);

  /* ── Watermark ── */
  const wm = document.createElement('div');
  wm.id = 'bilyweb-watermark';
  wm.innerHTML = '<img src="/assets/img/logo-bilyweb.png" alt="">';
  document.body.appendChild(wm);

  /* ── State ── */
  let pendingUrl = null;

  function showModal(url) {
    pendingUrl = url;
    overlay.classList.add('show');
    setTimeout(() => document.getElementById('consent-accept').focus(), 50);
  }
  function hideModal() {
    overlay.classList.remove('show');
    pendingUrl = null;
  }
  function showDeclined() {
    declinedMsg.style.display = 'block';
    setTimeout(() => { declinedMsg.style.display = 'none'; }, 4500);
  }
  function goToWhatsApp(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  document.getElementById('consent-accept').addEventListener('click', function() {
    saveConsent(true);
    hideModal();
    if (pendingUrl) goToWhatsApp(pendingUrl);
  });
  document.getElementById('consent-decline').addEventListener('click', function() {
    saveConsent(false);
    hideModal();
    showDeclined();
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) hideModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('show')) hideModal();
  });

  /* ── Global hook for programmatic opens ── */
  window.__openWhatsApp = function(url) {
    if (hasConsent()) { goToWhatsApp(url); }
    else { showModal(url); }
  };

  /* ── Intercept ALL clicks on WA links ── */
  document.addEventListener('click', function(e) {
    // Check for data-waurl attribute (set by main.js on data-whatsapp elements)
    const waUrlEl = e.target.closest('[data-waurl]');
    if (waUrlEl) {
      e.preventDefault();
      e.stopPropagation();
      const url = waUrlEl.dataset.waurl;
      if (hasConsent()) { goToWhatsApp(url); }
      else { showModal(url); }
      return;
    }

    // Check for direct wa.me href links
    const link = e.target.closest('a');
    if (link && link.href && link.href.includes('wa.me')) {
      e.preventDefault();
      e.stopPropagation();
      if (hasConsent()) { goToWhatsApp(link.href); }
      else { showModal(link.href); }
      return;
    }
  }, true); // capture phase — runs before any other listener

})();
