/* ═══════════════════════════════════════
   consent.js — RGPD WhatsApp Consent
   + BilyWeb Project watermark
═══════════════════════════════════════ */

(function () {
  const CONSENT_KEY = 'bilyweb_wa_consent';
  const CONSENT_VERSION = '1.0';

  // ── Check if already consented ────────
  function hasConsent() {
    try {
      const stored = JSON.parse(localStorage.getItem(CONSENT_KEY));
      return stored && stored.version === CONSENT_VERSION && stored.accepted === true;
    } catch { return false; }
  }

  function saveConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted,
      version: CONSENT_VERSION,
      date: new Date().toISOString()
    }));
  }

  // ── Inject CSS ────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #consent-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(10,10,10,0.7);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      backdrop-filter: blur(3px);
    }
    #consent-overlay.show { display: flex; }

    #consent-modal {
      background: #f5f0e8;
      border: 3px solid #0a0a0a;
      border-radius: 16px;
      box-shadow: 8px 8px 0 #0a0a0a;
      max-width: 460px;
      width: 100%;
      overflow: hidden;
      animation: consentIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes consentIn {
      from { opacity:0; transform:scale(0.88) translateY(16px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }

    #consent-modal .cm-header {
      background: #0a0a0a;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    #consent-modal .cm-header img {
      height: 32px; width: auto;
      filter: brightness(0) invert(1);
    }
    #consent-modal .cm-header span {
      color: rgba(245,240,232,0.6);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: 'Instrument Sans', sans-serif;
    }

    #consent-modal .cm-body {
      padding: 1.75rem 1.5rem 1.5rem;
    }
    #consent-modal .cm-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }
    #consent-modal h2 {
      font-family: 'Fraunces', Georgia, serif;
      font-weight: 900;
      font-size: 1.6rem;
      letter-spacing: -0.03em;
      color: #0a0a0a;
      margin-bottom: 0.75rem;
      line-height: 1.1;
    }
    #consent-modal p {
      font-size: 0.88rem;
      color: #6b6355;
      line-height: 1.7;
      margin-bottom: 0.75rem;
      font-family: 'Instrument Sans', sans-serif;
    }
    #consent-modal .cm-legal {
      background: white;
      border: 1px solid rgba(10,10,10,0.1);
      border-radius: 8px;
      padding: 0.9rem 1rem;
      font-size: 0.78rem;
      color: #6b6355;
      line-height: 1.6;
      margin: 1rem 0 1.5rem;
    }
    #consent-modal .cm-legal strong { color: #0a0a0a; }

    #consent-modal .cm-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    #consent-accept {
      flex: 1;
      background: #25D366;
      color: white;
      border: 2px solid #25D366;
      border-radius: 6px;
      padding: 0.8rem 1.2rem;
      font-family: 'Instrument Sans', sans-serif;
      font-weight: 700;
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
    #consent-accept:hover {
      background: #1da851;
      border-color: #1da851;
      transform: translateY(-1px);
    }
    #consent-decline {
      background: transparent;
      color: #6b6355;
      border: 2px solid rgba(10,10,10,0.2);
      border-radius: 6px;
      padding: 0.8rem 1.2rem;
      font-family: 'Instrument Sans', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    #consent-decline:hover {
      border-color: #e63325;
      color: #e63325;
    }

    /* Declined message */
    #consent-declined-msg {
      display: none;
      position: fixed;
      bottom: calc(72px + 5rem);
      left: 50%;
      transform: translateX(-50%);
      background: #0a0a0a;
      color: #f5f0e8;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #e63325;
      font-size: 0.85rem;
      font-family: 'Instrument Sans', sans-serif;
      z-index: 9999;
      white-space: nowrap;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      animation: consentIn 0.3s ease;
    }

    /* ── Watermark ── */
    #bilyweb-watermark {
      position: fixed;
      bottom: calc(72px + 0.5rem);
      left: 50%;
      transform: translateX(-50%);
      z-index: 500;
      pointer-events: none;
      opacity: 0.07;
      user-select: none;
    }
    #bilyweb-watermark img {
      height: 28px;
      width: auto;
      filter: grayscale(1);
    }
  `;
  document.head.appendChild(style);

  // ── Build modal DOM ───────────────────
  const overlay = document.createElement('div');
  overlay.id = 'consent-overlay';
  overlay.innerHTML = `
    <div id="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div class="cm-header">
        <img src="/assets/img/logo-bilyweb.png" alt="BilyWeb Project">
        <span>Consentimiento RGPD</span>
      </div>
      <div class="cm-body">
        <span class="cm-icon">💬</span>
        <h2 id="consent-title">Antes de continuar a WhatsApp</h2>
        <p>Para poder atenderte correctamente, necesitamos tu consentimiento para contactarte a través de WhatsApp.</p>
        <div class="cm-legal">
          <strong>¿Qué implica aceptar?</strong><br>
          Al aceptar, autorizas a <strong>BilyWeb Project</strong> (bielgrue@gmail.com) a contactarte mediante WhatsApp para responder a tu consulta. Tus datos no serán cedidos a terceros. Puedes retirar tu consentimiento en cualquier momento.<br><br>
          Base legal: <strong>Consentimiento explícito</strong> (Art. 6.1.a RGPD).
        </div>
        <div class="cm-actions">
          <button id="consent-accept">✓ Acepto y continuar a WhatsApp</button>
          <button id="consent-decline">No acepto</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const declinedMsg = document.createElement('div');
  declinedMsg.id = 'consent-declined-msg';
  declinedMsg.textContent = '❌ Sin consentimiento no podemos abrir WhatsApp. Puedes escribirnos al email.';
  document.body.appendChild(declinedMsg);

  // ── Watermark ─────────────────────────
  const watermark = document.createElement('div');
  watermark.id = 'bilyweb-watermark';
  watermark.innerHTML = '<img src="/assets/img/logo-bilyweb.png" alt="">';
  document.body.appendChild(watermark);

  // ── State ─────────────────────────────
  let pendingUrl = null;

  function showConsent(url) {
    pendingUrl = url;
    overlay.classList.add('show');
    document.getElementById('consent-accept').focus();
  }

  function hideConsent() {
    overlay.classList.remove('show');
    pendingUrl = null;
  }

  function showDeclined() {
    declinedMsg.style.display = 'block';
    setTimeout(() => { declinedMsg.style.display = 'none'; }, 4000);
  }

  // Accept
  document.getElementById('consent-accept').addEventListener('click', () => {
    saveConsent(true);
    hideConsent();
    if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
  });

  // Decline
  document.getElementById('consent-decline').addEventListener('click', () => {
    saveConsent(false);
    hideConsent();
    showDeclined();
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideConsent();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideConsent();
  });

  // ── Intercept ALL WhatsApp links ──────
  function interceptWhatsApp(e) {
    const link = e.target.closest('a[href*="wa.me"], a[data-whatsapp]');
    if (!link) return;

    // Get the actual WA URL
    let waUrl = link.href;
    if (link.dataset.whatsapp !== undefined) {
      const msg = link.dataset.whatsapp || 'Hola BilyWeb! Me interesa vuestro servicio de diseño web.';
      waUrl = 'https://wa.me/34611044321?text=' + encodeURIComponent(msg);
    }

    // If not a WA link, ignore
    if (!waUrl || !waUrl.includes('wa.me')) return;

    e.preventDefault();
    e.stopPropagation();

    // If already consented this session, go directly
    if (hasConsent()) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Show consent modal
    showConsent(waUrl);
  }

  document.addEventListener('click', interceptWhatsApp, true); // capture phase

  // Also intercept programmatic WA opens (buildWhatsApp in main.js)
  window.__openWhatsApp = function(url) {
    if (hasConsent()) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showConsent(url);
    }
  };

})();
