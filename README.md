# Biel Gómez — Portfolio Web

## 🚀 Despliegue en GitHub + Vercel

### 1. Subir a GitHub

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit"

# Crea un repositorio nuevo en github.com (sin README)
# Luego:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a **[vercel.com](https://vercel.com)** e inicia sesión con tu cuenta de GitHub
2. Haz clic en **"Add New Project"**
3. Importa el repositorio que acabas de crear
4. En la configuración del proyecto, **no cambies nada** — Vercel detecta todo automáticamente
5. Haz clic en **"Deploy"**

### 3. ⚠️ Añadir la API key de Groq (IMPORTANTE)

Sin este paso el chat IA no funcionará:

1. En el dashboard de Vercel, ve a tu proyecto
2. **Settings → Environment Variables**
3. Añade esta variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `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`
   - **Environment:** Production, Preview, Development (marca los tres)
4. Haz clic en **Save**
5. Ve a **Deployments** y haz **Redeploy** para que coja la variable

### 4. Tu web está lista 🎉

Vercel te dará una URL del tipo `bielgomez.vercel.app`.
Puedes añadir tu dominio personalizado en **Settings → Domains**.

---

## 🛠 Estructura del proyecto

```
bielgomez/
├── index.html              ← Página de inicio
├── pages/                  ← Resto de páginas
│   ├── servicios.html
│   ├── portfolio.html
│   ├── sobre-mi.html
│   ├── precios.html
│   ├── blog.html
│   └── contacto.html
├── assets/
│   ├── css/global.css      ← Estilos globales
│   ├── js/main.js          ← Lógica principal
│   ├── js/nav.js           ← Nav + footer (inyectados en todas las páginas)
│   ├── js/chat.js          ← Widget chat IA
│   └── img/                ← Imágenes
├── api/
│   └── chat.js             ← Proxy serverless para Groq (API key segura)
├── vercel.json             ← Configuración de Vercel
└── .gitignore              ← Nunca sube .env ni node_modules
```
