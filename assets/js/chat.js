/* ═══════════════════════════════════════
   BIEL.IA — Chat Asistente con Groq
   Asistente de diseño web flotante
   Modelo: llama3-8b-8192 via Groq API
═══════════════════════════════════════ */

(function () {
  // API key lives in Vercel environment variables - never in frontend code
  const API_ENDPOINT = '/api/chat';
  const WA_LINK = 'https://wa.me/34611044321?text=Hola%20Biel!%20El%20asistente%20me%20ha%20redirigido%20aquí.';
  const EMAIL = 'mailto:bielgrue@gmail.com';

  const SYSTEM_PROMPT = `Eres el asistente virtual de Biel Gómez, diseñador web freelance en España. 
Tu función es responder preguntas básicas sobre diseño web, precios, plazos y necesidades de los visitantes de su portfolio.

SOBRE BIEL:
- Diseñador web freelance, especialista en webs para autónomos y PYMEs
- Servicios: Landing Page (desde 400€), Web Corporativa (desde 900€), Tienda Online (desde 1.500€), Rediseño (desde 600€), SEO (desde 200€/mes), Mantenimiento (desde 50€/mes)
- Plazo: 5–7 días landing, 10–14 días web corporativa, 3–4 semanas tienda
- Tecnologías: HTML/CSS, JavaScript, Figma, Node.js, UI/UX, código a medida
- Contacto: bielgrue@gmail.com | WhatsApp: +34 611 044 321
- Ubicación: Les Franqueses del Vallès, Cataluña. Trabajo 100% remoto.

REGLAS IMPORTANTES:
- Responde siempre en español, de forma amigable, directa y concisa (máx 3 párrafos)
- Si te preguntan algo muy técnico, sobre proyectos específicos, sobre disponibilidad actual o sobre presupuestos exactos → diles que contacten directamente con Biel por WhatsApp o email
- No inventes precios exactos para proyectos personalizados, da rangos orientativos
- Si alguien parece interesado en contratar → anímale a contactar con Biel directamente
- No hables de temas que no sean diseño web, presencia online, o servicios de Biel
- Si te preguntan algo fuera de tema → redirige amablemente a diseño web o a contactar con Biel`;

  // ── Build widget HTML ──────────────────
  const style = document.createElement('style');
  style.textContent = `
    #biel-chat-btn {
      position: fixed;
      bottom: calc(var(--nav-h) + 1.5rem);
      left: 1.5rem;
      z-index: 8997;
      width: 52px; height: 52px;
      background: var(--ink, #0a0a0a);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 30px rgba(10,10,10,0.25);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #biel-chat-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(10,10,10,0.35); }
    #biel-chat-btn svg { transition: transform 0.2s; }
    #biel-chat-btn.open svg { transform: rotate(90deg); }

    #biel-chat-badge {
      position: absolute;
      top: -4px; right: -4px;
      width: 14px; height: 14px;
      background: var(--red, #e63325);
      border-radius: 50%;
      border: 2px solid var(--paper, #f5f0e8);
      animation: pulse-badge 2s ease infinite;
    }
    @keyframes pulse-badge {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    #biel-chat-window {
      position: fixed;
      bottom: calc(var(--nav-h) + 5.5rem);
      left: 1.5rem;
      z-index: 8996;
      width: 340px;
      max-height: 520px;
      background: #fff;
      border: 2px solid var(--ink, #0a0a0a);
      border-radius: 16px;
      box-shadow: 6px 6px 0 var(--ink, #0a0a0a);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.85) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s;
      font-family: 'Instrument Sans', sans-serif;
    }
    #biel-chat-window.visible {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    .bc-header {
      background: var(--ink, #0a0a0a);
      color: var(--paper, #f5f0e8);
      padding: 1rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .bc-avatar {
      width: 34px; height: 34px;
      background: var(--red, #e63325);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .bc-header-info { flex: 1; }
    .bc-name { font-weight: 700; font-size: 0.88rem; line-height: 1.2; }
    .bc-status { font-size: 0.7rem; opacity: 0.6; display: flex; align-items: center; gap: 0.3rem; }
    .bc-status::before {
      content: '';
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
    }
    .bc-close {
      background: none; border: none; color: var(--paper, #f5f0e8);
      font-size: 1.2rem; cursor: pointer; opacity: 0.7; padding: 0;
      line-height: 1;
    }
    .bc-close:hover { opacity: 1; }

    .bc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-height: 200px;
      max-height: 320px;
      background: #fafaf8;
    }
    .bc-messages::-webkit-scrollbar { width: 4px; }
    .bc-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

    .bc-msg {
      max-width: 88%;
      padding: 0.6rem 0.9rem;
      border-radius: 12px;
      font-size: 0.82rem;
      line-height: 1.55;
      animation: msgIn 0.25s ease;
    }
    @keyframes msgIn {
      from { opacity:0; transform: translateY(6px); }
      to { opacity:1; transform: translateY(0); }
    }
    .bc-msg.bot {
      background: #fff;
      border: 1px solid #e5e5e5;
      align-self: flex-start;
      color: #222;
      border-radius: 4px 12px 12px 12px;
    }
    .bc-msg.user {
      background: var(--ink, #0a0a0a);
      color: #fff;
      align-self: flex-end;
      border-radius: 12px 12px 4px 12px;
    }
    .bc-msg.typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 0.7rem 1rem;
    }
    .bc-dot {
      width: 7px; height: 7px;
      background: #bbb;
      border-radius: 50%;
      animation: dot-bounce 1.2s ease infinite;
    }
    .bc-dot:nth-child(2) { animation-delay: 0.2s; }
    .bc-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dot-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    .bc-contact-btns {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.3rem;
    }
    .bc-contact-btn {
      display: inline-flex; align-items: center; gap: 0.3rem;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 4px;
      text-decoration: none;
      border: 1.5px solid currentColor;
      transition: background 0.15s;
    }
    .bc-contact-btn.wa { color: #25D366; }
    .bc-contact-btn.wa:hover { background: #25D366; color: white; }
    .bc-contact-btn.em { color: var(--red, #e63325); }
    .bc-contact-btn.em:hover { background: var(--red, #e63325); color: white; }

    .bc-quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding: 0.75rem 1rem 0.4rem;
      background: #fafaf8;
      border-top: 1px solid #eee;
      flex-shrink: 0;
    }
    .bc-chip {
      background: #fff;
      border: 1.5px solid #ddd;
      border-radius: 100px;
      padding: 0.25rem 0.7rem;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      color: #444;
      transition: border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .bc-chip:hover { border-color: var(--red, #e63325); color: var(--red, #e63325); }

    .bc-input-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-top: 1px solid #eee;
      background: #fff;
      flex-shrink: 0;
    }
    .bc-input {
      flex: 1;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      padding: 0.55rem 0.8rem;
      font-family: inherit;
      font-size: 0.82rem;
      outline: none;
      color: #222;
      background: #fafaf8;
      transition: border-color 0.2s;
    }
    .bc-input:focus { border-color: var(--ink, #0a0a0a); }
    .bc-send {
      width: 34px; height: 34px;
      background: var(--ink, #0a0a0a);
      border: none; border-radius: 8px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .bc-send:hover { background: var(--red, #e63325); }
    .bc-send:disabled { background: #ccc; cursor: not-allowed; }

    @media(max-width: 400px) {
      #biel-chat-window { width: calc(100vw - 3rem); left: 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Widget DOM ─────────────────────────
  const btn = document.createElement('button');
  btn.id = 'biel-chat-btn';
  btn.setAttribute('aria-label', 'Abrir chat con IA');
  btn.innerHTML = `
    <div id="biel-chat-badge"></div>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;

  const win = document.createElement('div');
  win.id = 'biel-chat-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Chat con asistente IA');
  win.innerHTML = `
    <div class="bc-header">
      <div class="bc-avatar">🤖</div>
      <div class="bc-header-info">
        <div class="bc-name">Asistente de Biel</div>
        <div class="bc-status">IA activa · pregúntame lo que quieras</div>
      </div>
      <button class="bc-close" id="bc-close-btn" aria-label="Cerrar chat">✕</button>
    </div>
    <div class="bc-messages" id="bc-messages"></div>
    <div class="bc-quick-chips" id="bc-chips">
      <button class="bc-chip" data-q="¿Cuánto cuesta una web?">💰 Precio web</button>
      <button class="bc-chip" data-q="¿Cuánto tarda en estar lista?">⏱ Plazos</button>
      <button class="bc-chip" data-q="¿Necesito una web si ya tengo Instagram?">📱 ¿Necesito web?</button>
      <button class="bc-chip" data-q="¿Qué servicios ofreces?">🛠 Servicios</button>
    </div>
    <div class="bc-input-row">
      <input type="text" class="bc-input" id="bc-input" placeholder="Pregúntame lo que quieras..." maxlength="300" autocomplete="off"/>
      <button class="bc-send" id="bc-send" aria-label="Enviar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // ── State ──────────────────────────────
  let isOpen = false;
  let isLoading = false;
  const history = []; // {role, content}

  // ── DOM refs ───────────────────────────
  const msgBox = win.querySelector('#bc-messages');
  const input = win.querySelector('#bc-input');
  const sendBtn = win.querySelector('#bc-send');
  const chips = win.querySelector('#bc-chips');
  const closeBtn = win.querySelector('#bc-close-btn');

  // ── Helpers ────────────────────────────
  function toggleWindow() {
    isOpen = !isOpen;
    win.classList.toggle('visible', isOpen);
    btn.classList.toggle('open', isOpen);
    const badge = btn.querySelector('#biel-chat-badge');
    if (badge) badge.style.display = 'none';
    if (isOpen) {
      if (msgBox.children.length === 0) greet();
      setTimeout(() => input.focus(), 300);
    }
  }

  function greet() {
    appendMsg('bot', '👋 ¡Hola! Soy el asistente de Biel. Puedo ayudarte con dudas sobre diseño web, precios, plazos y si realmente necesitas una web para tu negocio.\n\n¿Qué quieres saber?');
  }

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `bc-msg ${role}`;

    if (role === 'bot') {
      // Parse markdown-like bold + line breaks
      const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      div.innerHTML = formatted;

      // Check if should show contact buttons
      const needsContact = /whatsapp|contacta|escríbele|escribe|biel directamente|email|correo|presupuesto exacto|disponibilidad/i.test(text);
      if (needsContact) {
        const btns = document.createElement('div');
        btns.className = 'bc-contact-btns';
        btns.innerHTML = `
          <a class="bc-contact-btn wa" href="${WA_LINK}" target="_blank" rel="noopener">💬 WhatsApp</a>
          <a class="bc-contact-btn em" href="${EMAIL}">✉ Email</a>`;
        div.appendChild(btns);
      }
    } else {
      div.textContent = text;
    }

    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'bc-msg bot typing';
    div.id = 'bc-typing';
    div.innerHTML = '<div class="bc-dot"></div><div class="bc-dot"></div><div class="bc-dot"></div>';
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function hideTyping() {
    const el = msgBox.querySelector('#bc-typing');
    if (el) el.remove();
  }

  // ── Groq API call ──────────────────────
  async function askGroq(userMessage) {
    if (isLoading) return;
    isLoading = true;
    sendBtn.disabled = true;

    history.push({ role: 'user', content: userMessage });
    appendMsg('user', userMessage);
    input.value = '';
    showTyping();

    // Hide chips after first real question
    chips.style.display = 'none';

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-8)
          ]
        })
      });

      if (!res.ok) {
        let errText = '';
        try { const errData = await res.json(); errText = errData?.error || errData?.message || JSON.stringify(errData); }
        catch { errText = await res.text().catch(() => res.statusText); }
        throw new Error(`Servidor ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (!reply) throw new Error('Respuesta vacía');

      history.push({ role: 'assistant', content: reply });
      hideTyping();
      appendMsg('bot', reply);

    } catch (err) {
      hideTyping();
      console.error('Chat error:', err);
      appendMsg('bot', `⚠️ Error: ${err.message}. Contacta con Biel directamente:`);
      const btns = document.createElement('div');
      btns.className = 'bc-contact-btns';
      btns.innerHTML = `<a class="bc-contact-btn wa" href="${WA_LINK}" target="_blank" rel="noopener">💬 WhatsApp</a><a class="bc-contact-btn em" href="${EMAIL}">✉ Email</a>`;
      msgBox.lastElementChild.appendChild(btns);
      msgBox.scrollTop = msgBox.scrollHeight;
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ── Events ─────────────────────────────
  btn.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', toggleWindow);

  sendBtn.addEventListener('click', () => {
    const msg = input.value.trim();
    if (msg) askGroq(msg);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const msg = input.value.trim();
      if (msg) askGroq(msg);
    }
  });

  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.bc-chip');
    if (chip) askGroq(chip.dataset.q);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !win.contains(e.target) && !btn.contains(e.target)) {
      toggleWindow();
    }
  });

  // Show badge after 4s if not opened
  setTimeout(() => {
    if (!isOpen) {
      const badge = btn.querySelector('#biel-chat-badge');
      if (badge) badge.style.display = 'block';
    }
  }, 4000);

})();
