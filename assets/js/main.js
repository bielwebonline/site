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
  let menuOpen = false;

  function getNavLinks() {
    return document.querySelector('#nav .nav-links');
  }

  function openMenu(burger) {
    const links = getNavLinks();
    if (!links) return;
    menuOpen = true;
    // Show menu with inline styles — guaranteed to work regardless of CSS cascade
    links.style.cssText = `
      display: flex !important;
      flex-direction: column;
      position: fixed;
      bottom: var(--nav-h, 72px);
      top: auto;
      left: 0;
      right: 0;
      background: #f5f0e8;
      border-top: 2px solid #0a0a0a;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
      padding: 1.5rem 2rem 2rem;
      gap: 0;
      z-index: 8999;
      max-height: 80vh;
      overflow-y: auto;
      list-style: none;
    `;
    // Style each link
    links.querySelectorAll('li').forEach((li, i) => {
      li.style.cssText = 'border-bottom: 1px solid rgba(10,10,10,0.08); margin:0;';
    });
    links.querySelectorAll('a').forEach(a => {
      a.style.cssText = 'display:block; padding:0.85rem 0; font-size:1rem; color:#0a0a0a; font-weight:600; text-transform:uppercase; letter-spacing:0.06em;';
    });
    // Burger → X
    if (burger) {
      const spans = burger.querySelectorAll('span');
      spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    }
  }

  function closeMenu() {
    const links = getNavLinks();
    if (!links) return;
    menuOpen = false;
    links.style.cssText = 'display: none;';
    // Reset burger
    const burger = document.querySelector('.nav-burger');
    if (burger) burger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  }

  // Burger click — delegated
  document.addEventListener('click', (e) => {
    const burger = e.target.closest('.nav-burger');
    if (!burger) return;
    if (menuOpen) closeMenu();
    else openMenu(burger);
  });

  // Close on link click
  document.addEventListener('click', (e) => {
    if (menuOpen && e.target.closest('.nav-links a')) {
      closeMenu();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menuOpen && !e.target.closest('#nav')) {
      closeMenu();
    }
  });

  // Active link — retry until nav exists
  function setActiveLink() {
    const nav = document.getElementById('nav');
    if (!nav) return setTimeout(setActiveLink, 50);
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
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
