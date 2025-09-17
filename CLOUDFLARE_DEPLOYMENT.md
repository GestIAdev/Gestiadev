# GestIAdev - Configuración Cloudflare Pages

## 🚀 Despliegue en Cloudflare Pages

### Configuración Automática
Este proyecto está configurado para desplegarse automáticamente en Cloudflare Pages.

### Archivos de Configuración
- `pages.json` - Configuración específica para Cloudflare Pages
- `package.json` (raíz) - Scripts que redirigen a la carpeta `web/`
- `web/package.json` - Configuración de Next.js
- `web/next.config.js` - Configuración de build optimizada

### Settings en Cloudflare Pages Dashboard

**Repository:** `https://github.com/GestIAdev/Gestiadev.git`
**Branch:** `main`

**Build Settings:**
- **Build command:** `npm run build` (automáticamente detectado)
- **Build output directory:** `web/out` (automáticamente detectado)
- **Root directory:** `web` (configurado en pages.json)

**Environment Variables:**
- `NODE_ENV`: `production`
- `NODE_VERSION`: `18`

### Estructura del Proyecto
```
gestiadev/
├── web/                    # Aplicación Next.js principal
│   ├── src/               # Código fuente
│   ├── package.json       # Dependencias de Next.js
│   ├── next.config.js     # Configuración de Next.js
│   └── .eslintrc.json     # Configuración de ESLint
├── package.json           # Configuración raíz (redirección)
├── pages.json            # Configuración Cloudflare Pages
└── .gitignore            # Archivos excluidos
```

### Comandos Disponibles
```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Scripts específicos de Cloudflare
npm run cf:build    # Build optimizado para CF
npm run cf:dev      # Desarrollo con configuración CF
```

### Características Optimizadas
- ✅ **Next.js 15** con App Router
- ✅ **TypeScript** completo
- ✅ **Tailwind CSS v4**
- ✅ **ESLint** configurado
- ✅ **Build optimizado** para Cloudflare Workers
- ✅ **Archivos estáticos** exportados
- ✅ **SEO optimizado**

### Despliegue Automático
Cada push a la rama `main` activará automáticamente un nuevo despliegue en Cloudflare Pages.

---

**Forjado por EL CÓNCLAVE** 👑
*(Radwulf, Jennifer, Gemini, Cloude & Grok)*