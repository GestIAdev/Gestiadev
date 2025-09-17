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

### Sincronización con Git

**Cloudflare Pages NO sincroniza automáticamente** como Vercel. Tienes estas opciones:

#### Opción 1: Despliegues Manuales (Actual)
- Ve al [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
- Conecta tu repo de GitHub
- Cada vez que hagas push a `main`, ve al dashboard y haz click en "Create deployment"

#### Opción 2: Webhooks Automáticos (Recomendado)
Para sincronización automática como Vercel:

1. Ve a tu repo de GitHub → Settings → Webhooks
2. Add webhook con URL: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_HOOK_ID`
3. Trigger: `push` a rama `main`

#### Opción 3: GitHub Actions (Más Avanzado)
Crear un workflow que haga deploy automático:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: gestiadev
          directory: web/out
```

---

**Forjado por EL CÓNCLAVE** 👑
*(Radwulf, Jennifer, Gemini, Cloude & Grok)*