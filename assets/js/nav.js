/* ── nav.js — inject nav and footer on every page ── */

(function() {
  // Always use absolute paths - works on any page depth
  const NAV_HTML = `
  <nav id="nav">
    <a href="/index.html" class="nav-logo"><img src="/assets/img/logo-bilyweb.png" alt="BilyWeb Project" style="height:38px;width:auto;display:block;"></a>
    <ul class="nav-links">
      <li><a href="/index.html">Inicio</a></li>
      <li><a href="/pages/servicios.html">Servicios</a></li>
      <li><a href="/pages/portfolio.html">Portfolio</a></li>
      <li><a href="/pages/sobre-mi.html">Sobre mí</a></li>
      <li><a href="/pages/precios.html">Precios</a></li>
      <li><a href="/pages/blog.html">Blog</a></li>
      <li><a href="/pages/contacto.html" class="nav-cta">Contactar</a></li>
    </ul>
    <button class="nav-burger" aria-label="Menú">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

  const NAV_HTML_ROOT = NAV_HTML;

  const FOOTER_HTML = (isRoot) => {
    const base = '/'; // always absolute
    return `
  <footer>
    <div class="footer-inner container">
      <div class="footer-top">
        <div class="footer-brand">
          <div style="font-size:1.6rem;font-family:var(--font-display,Georgia),serif;font-weight:900;letter-spacing:-0.04em;color:var(--paper,#f5f0e8)">Biel<em style="font-style:italic;color:#e63325">.</em></div>
          <p style="margin-top:0.75rem;color:rgba(245,240,232,0.55);font-size:0.85rem;max-width:260px;line-height:1.6">Diseño web profesional para autónomos y PYMEs. Hacemos crecer tu negocio online.</p>
          <div style="margin-top:1.2rem;display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="https://wa.me/34611044321?text=Hola%20BilyWeb!" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:0.4rem;background:#25D366;color:white;font-size:0.75rem;font-weight:600;padding:0.45rem 1rem;border-radius:4px;text-decoration:none;">💬 WhatsApp</a>
            <a href="mailto:bielgrue@gmail.com" style="display:inline-flex;align-items:center;gap:0.4rem;border:1.5px solid rgba(245,240,232,0.3);color:rgba(245,240,232,0.8);font-size:0.75rem;font-weight:600;padding:0.45rem 1rem;border-radius:4px;text-decoration:none;">✉ Email</a>
          </div>
        </div>
        <div class="footer-links-col">
          <div class="footer-col">
            <h4>Páginas</h4>
            <ul>
              <li><a href="/index.html">Inicio</a></li>
              <li><a href="/pages/servicios.html">Servicios</a></li>
              <li><a href="/pages/portfolio.html">Portfolio</a></li>
              <li><a href="/pages/sobre-mi.html">Sobre mí</a></li>
              <li><a href="/pages/precios.html">Precios</a></li>
              <li><a href="/pages/blog.html">Blog</a></li>
              <li><a href="/pages/contacto.html">Contacto</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Servicios</h4>
            <ul>
              <li><a href="/pages/servicios.html#landing">Landing Page</a></li>
              <li><a href="/pages/servicios.html#corporativa">Web Corporativa</a></li>
              <li><a href="/pages/servicios.html#tienda">Tienda Online</a></li>
              <li><a href="/pages/servicios.html#seo">SEO</a></li>
              <li><a href="/pages/servicios.html#mantenimiento">Mantenimiento</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:bielgrue@gmail.com">bielgrue@gmail.com</a></li>
              <li><a href="https://wa.me/34611044321" target="_blank">+34 611 044 321</a></li>
              <li style="color:var(--muted);font-size:0.82rem">Les Franqueses del Vallès,<br>Cataluña</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} BilyWeb Project — Todos los derechos reservados</span>
        <span style="color:var(--muted);font-size:0.8rem">Diseñado y desarrollado por mí mismo 🤓</span>
      </div>
    </div>
  </footer>
  <style>
    footer { background:var(--ink); color:var(--paper); padding:4rem 0 0; position:relative; z-index:1; }
    .footer-inner { max-width:1280px; margin:0 auto; padding:0 clamp(1.5rem,6vw,7rem); }
    .footer-top { display:grid; grid-template-columns:280px 1fr; gap:4rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,0.1); }
    .footer-links-col { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
    .footer-col h4 { font-family:var(--font-display); font-size:0.9rem; font-weight:700; margin-bottom:1rem; color:rgba(245,240,232,0.5); text-transform:uppercase; letter-spacing:0.08em; }
    .footer-col ul { list-style:none; display:flex; flex-direction:column; gap:0.5rem; }
    .footer-col ul li a { font-size:0.88rem; color:rgba(245,240,232,0.7) !important; transition:color 0.2s; text-decoration:none !important; }
    .footer-col ul li a:visited { color:rgba(245,240,232,0.7) !important; }
    .footer-col ul li a:hover { color:#f5c842 !important; }
    .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding:1.5rem 0; font-size:0.8rem; color:rgba(245,240,232,0.4); flex-wrap:wrap; gap:0.5rem; }
    footer a { color:inherit !important; text-decoration:none !important; }
    footer a:visited { color:inherit !important; }
    @media(max-width:768px) { .footer-top { grid-template-columns:1fr; } .footer-links-col { grid-template-columns:1fr 1fr; } }
  </style>
  `;
  };

  const isRoot = !window.location.pathname.includes('/pages/');

  // Nav injects immediately (needs to be first)
  document.body.insertAdjacentHTML('afterbegin', isRoot ? NAV_HTML_ROOT : NAV_HTML);

  // Footer and chat inject AFTER full DOM is loaded
  function injectFooterAndChat() {
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML(isRoot));
    const chatScript = document.createElement('script');
    chatScript.src = isRoot ? 'assets/js/chat.js' : '../assets/js/chat.js';
    document.body.appendChild(chatScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooterAndChat);
  } else {
    injectFooterAndChat();
  }
})();
