/* ═══════════════════════════════════════
   BIEL GÓMEZ — Main JS Module
   Features: cursor, nav, scroll fx,
   contact form, budget calculator,
   project filter, visit counter,
   localStorage "CRM", toast system
═══════════════════════════════════════ */

// ── Config ──────────────────────────────
const WHATSAPP_NUMBER = '34611044321';
const EMAIL = 'bielgrue@gmail.com';

// ── Utils ────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const qs = (key) => new URLSearchParams(window.location.search).get(key);

// ── Toast System ─────────────────────────
function showToast(msg, type = 'default', duration = 3500) {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 350); }, duration);
}

// ── LocalStorage Mini-DB ─────────────────
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('bg_' + key)) || null; } catch { return null; } },
  set(key, val) { localStorage.setItem('bg_' + key, JSON.stringify(val)); },
  push(key, val) {
    const arr = DB.get(key) || [];
    arr.unshift({ ...val, id: Date.now(), ts: new Date().toISOString() });
    DB.set(key, arr);
    return arr;
  }
};

// ── Visit Counter ────────────────────────
function trackVisit() {
  const stats = DB.get('stats') || { visits: 0, pages: {} };
  stats.visits++;
  const page = document.title || 'unknown';
  stats.pages[page] = (stats.pages[page] || 0) + 1;
  stats.lastVisit = new Date().toISOString();
  DB.set('stats', stats);
}

// ── Custom Cursor ────────────────────────
function initCursor() {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverEls = 'a, button, .card, .project-card, .service-card, input, textarea, select, .btn, label';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) cursor.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) cursor.classList.remove('hover');
  });
}

// ── Navigation ───────────────────────────
function initNav() {
  let drawerOpen = false;
  let drawer = null, overlay = null;

  function buildDrawer() {
    // Always use absolute paths
    const pages = [
      { href: '/index.html',            label: 'Inicio',    icon: '🏠' },
      { href: '/pages/servicios.html',  label: 'Servicios', icon: '🛠' },
      { href: '/pages/portfolio.html',  label: 'Portfolio', icon: '✦'  },
      { href: '/pages/sobre-mi.html',   label: 'Sobre mí',  icon: '👤' },
      { href: '/pages/precios.html',    label: 'Precios',   icon: '💰' },
      { href: '/pages/blog.html',       label: 'Blog',      icon: '📝' },
      { href: '/pages/contacto.html',   label: 'Contactar', icon: '✉'  },
    ];

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Overlay
    const ov = document.createElement('div');
    ov.id = 'drawer-overlay';
    ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(10,10,10,0.55);z-index:9998;opacity:0;transition:opacity 0.3s;backdrop-filter:blur(2px)';

    // Drawer
    const dr = document.createElement('nav');
    dr.id = 'mobile-drawer';
    dr.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:280px;max-width:85vw;background:#f5f0e8;border-left:2px solid #0a0a0a;z-index:9999;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.32s cubic-bezier(0.4,0,0.2,1);overflow-y:auto;';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:2px solid #0a0a0a;background:#0a0a0a;flex-shrink:0;';
    header.innerHTML = '<span style="font-family:Fraunces,Georgia,serif;font-weight:900;font-size:1.4rem;letter-spacing:-0.04em;color:#f5f0e8">Biel<em style=\'font-style:italic;color:#e63325\'>.</em></span>';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'drawer-close';
    closeBtn.setAttribute('aria-label', 'Cerrar menú');
    closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#f5f0e8;font-size:1.4rem;line-height:1;padding:0.25rem;';
    closeBtn.textContent = '✕';
    header.appendChild(closeBtn);
    dr.appendChild(header);

    // Links
    const linksWrap = document.createElement('div');
    linksWrap.style.cssText = 'flex:1;padding:0.5rem 0;';

    pages.forEach(p => {
      const isActive = p.href.split('/').pop() === currentPage;
      const a = document.createElement('a');
      a.href = p.href;
      a.style.cssText = 'display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;font-family:Instrument Sans,sans-serif;font-size:0.95rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:' + (isActive ? '#e63325' : '#0a0a0a') + ';text-decoration:none;border-bottom:1px solid rgba(10,10,10,0.07);background:' + (isActive ? 'rgba(230,51,37,0.06)' : 'transparent') + ';transition:background 0.15s;';
      a.innerHTML = '<span style="font-size:1.1rem;width:1.5rem;text-align:center">' + p.icon + '</span>' + p.label + (isActive ? '<span style="margin-left:auto;width:7px;height:7px;background:#e63325;border-radius:50%;flex-shrink:0"></span>' : '');
      a.addEventListener('mouseenter', function() { this.style.background = 'rgba(10,10,10,0.06)'; });
      a.addEventListener('mouseleave', function() { this.style.background = isActive ? 'rgba(230,51,37,0.06)' : 'transparent'; });
      linksWrap.appendChild(a);
    });
    dr.appendChild(linksWrap);

    // Footer WA button
    const foot = document.createElement('div');
    foot.style.cssText = 'padding:1.5rem;border-top:1px solid rgba(10,10,10,0.1);flex-shrink:0;';
    foot.innerHTML = '<a href="https://wa.me/34611044321?text=Hola%20Biel!" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:0.6rem;background:#25D366;color:white;text-decoration:none;padding:0.8rem;border-radius:6px;font-family:Instrument Sans,sans-serif;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">💬 WhatsApp directo</a>';
    dr.appendChild(foot);

    document.body.appendChild(ov);
    document.body.appendChild(dr);

    // Events
    closeBtn.addEventListener('click', closeDrawer);
    ov.addEventListener('click', closeDrawer);
    linksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    return { drawer: dr, overlay: ov };
  }

  function openDrawer() {
    if (!drawer) {
      const built = buildDrawer();
      drawer = built.drawer;
      overlay = built.overlay;
    }
    drawerOpen = true;
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        drawer.style.transform = 'translateX(0)';
      });
    });
    document.body.style.overflow = 'hidden';
    const burger = document.querySelector('.nav-burger');
    if (burger) {
      const s = burger.querySelectorAll('span');
      if (s[0]) s[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      if (s[1]) s[1].style.cssText = 'opacity:0';
      if (s[2]) s[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawerOpen = false;
    drawer.style.transform = 'translateX(100%)';
    overlay.style.opacity = '0';
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 320);
    document.body.style.overflow = '';
    const burger = document.querySelector('.nav-burger');
    if (burger) burger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  }

  document.addEventListener('click', function(e) {
    const burger = e.target.closest('.nav-burger');
    if (!burger) return;
    drawerOpen ? closeDrawer() : openDrawer();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawerOpen) closeDrawer();
  });

  // Active link in desktop nav
  function setActiveLink() {
    const nav = document.getElementById('nav');
    if (!nav) return setTimeout(setActiveLink, 80);
    const currentPath = window.location.pathname || '/index.html';
    nav.querySelectorAll('.nav-links a').forEach(function(a) {
      const href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
        a.classList.add('active');
      }
    });
  }
  setActiveLink();
}

// ── Scroll Reveal ────────────────────────
function initScrollReveal() {
  const elements = $$('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });
}

// Inject reveal CSS
const revealCSS = document.createElement('style');
revealCSS.textContent = `
  .reveal-init { opacity:0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
  .revealed { opacity:1; transform: translateY(0); }
`;
document.head.appendChild(revealCSS);

// ── WhatsApp Link Builder ────────────────
function buildWhatsApp(msg = '') {
  const encoded = encodeURIComponent(msg || '¡Hola Biel! Me interesa tu servicio de diseño web.');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function initWhatsAppButtons() {
  $$('[data-whatsapp]').forEach(el => {
    const msg = el.dataset.whatsapp;
    el.href = buildWhatsApp(msg);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

// ── Contact Form ─────────────────────────
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.email || !data.message) {
      showToast('Por favor, rellena todos los campos.', 'error');
      return;
    }

    // Save to localStorage
    DB.push('leads', data);

    // Open WhatsApp with pre-filled message
    const msg = `Hola Biel! Soy ${data.name} (${data.email}).\n\nServicio: ${data.service || 'Por definir'}\nPresupuesto: ${data.budget || 'Sin especificar'}\n\n${data.message}`;
    window.open(buildWhatsApp(msg), '_blank');

    showToast('¡Mensaje enviado! Abro WhatsApp para conectarte con Biel.', 'success');
    form.reset();
  });
}

// ── Budget Calculator ────────────────────
const PRICE_BASE = {
  landing: 400,
  corporativa: 900,
  tienda: 1500,
  rediseno: 600,
  seo: 200
};
const EXTRAS = {
  blog: 150,
  multiidioma: 300,
  animaciones: 200,
  mantenimiento: 50,
  chat: 100,
  urgente: 0.25 // % extra
};

function initCalculator() {
  const calc = $('#budget-calc');
  if (!calc) return;

  function update() {
    const type = $('#calc-type')?.value;
    let base = PRICE_BASE[type] || 0;
    let extras = 0;

    $$('.calc-extra:checked', calc).forEach(cb => {
      const key = cb.value;
      if (key === 'urgente') extras += base * EXTRAS.urgente;
      else extras += EXTRAS[key] || 0;
    });

    const pages = parseInt($('#calc-pages')?.value || 1);
    if (type === 'corporativa') base += Math.max(0, pages - 5) * 80;

    const total = base + extras;
    const el = $('#calc-result');
    if (el) el.textContent = total.toLocaleString('es-ES') + ' €';

    const breakdown = $('#calc-breakdown');
    if (breakdown) {
      breakdown.innerHTML = `<span>Base: ${base.toLocaleString('es-ES')}€</span>${extras ? `<span> + Extras: ${extras.toLocaleString('es-ES')}€</span>` : ''}`;
    }
  }

  $$('select, input', calc).forEach(el => el.addEventListener('change', update));
  $$('.calc-extra', calc).forEach(el => el.addEventListener('change', update));
  update();

  const sendBtn = $('#calc-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const type = $('#calc-type')?.value;
      const total = $('#calc-result')?.textContent;
      const msg = `Hola Biel! He usado tu calculadora y me sale un presupuesto de ${total} para una web tipo "${type}". Me gustaría hablar contigo.`;
      window.open(buildWhatsApp(msg), '_blank');
    });
  }
}

// ── Portfolio Filter ─────────────────────
function initPortfolioFilter() {
  const filters = $$('[data-filter]');
  const items = $$('[data-category]');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = show ? '' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 150);
        item.style.transition = 'opacity 0.3s, transform 0.3s';
      });
    });
  });
}

// ── FAQ Accordion ─────────────────────────
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item);
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Counter Animation ────────────────────
function animateCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ── Floating WhatsApp Button ─────────────
function initFloatingWA() {
  const btn = document.createElement('a');
  btn.href = buildWhatsApp();
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.id = 'wa-float';
  btn.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <span>¿Hablamos?</span>
  `;
  btn.style.cssText = `
    position:fixed; bottom:calc(var(--nav-h) + 1.5rem); right:2rem; z-index:8000;
    background:#25D366; color:white;
    display:flex; align-items:center; gap:0.6rem;
    padding:0.75rem 1.4rem; border-radius:100px;
    font-family:var(--font-body); font-weight:600; font-size:0.88rem;
    box-shadow:0 8px 30px rgba(37,211,102,0.4);
    transition:transform 0.2s, box-shadow 0.2s;
    text-decoration:none;
  `;
  btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-3px) scale(1.03)'; btn.style.boxShadow = '0 12px 40px rgba(37,211,102,0.55)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.boxShadow = '0 8px 30px rgba(37,211,102,0.4)'; });
  document.body.appendChild(btn);
}

// ── Page load animation ───────────────────
function initPageLoad() {
  document.body.classList.add('page-enter');
}

// ── INIT ALL ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initCursor();
  initNav();
  initScrollReveal();
  initWhatsAppButtons();
  initContactForm();
  initCalculator();
  initPortfolioFilter();
  initFAQ();
  initFloatingWA();
  trackVisit();

  // Counter animation when in view
  const counterSection = document.querySelector('[data-counters]');
  if (counterSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(counterSection);
  }
});
