/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Deshabilitar ESLint durante el build para evitar errores en producción
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración experimental para mejor compatibilidad
  experimental: {
    // Deshabilitar turbopack en producción para estabilidad
    turbopack: false,
  },
  // Configuración de headers para Cloudflare
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;