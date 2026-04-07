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
};

module.exports = nextConfig;

module.exports = nextConfig;