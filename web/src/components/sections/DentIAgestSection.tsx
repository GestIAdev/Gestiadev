'use client';

import { motion } from 'framer-motion';
import type { View } from '@/app/page';

interface DentIAgestSectionProps {
  setActiveView: (view: View) => void;
}

/**
 * DENTIAGEST — Sección propia
 * Placeholder listo para recibir:
 * - Auditorías técnicas
 * - UI actualizada + fotografías
 * - Vídeos y demos
 * - Ecosystem Web3 / IA clínica
 */
const DentIAgestSection = ({ setActiveView }: DentIAgestSectionProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.section
      className="w-full max-w-[1200px]"
      key="dentiagest-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* CABECERA */}
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p className="text-xs font-plex-mono text-fucsia-neon/60 tracking-[0.3em] uppercase mb-2">
            // En desarrollo · 85% completado
          </p>
          <h1 className="text-4xl lg:text-6xl font-plex-mono font-bold text-hueso">
            DentIAgest
          </h1>
          <p className="mt-2 text-base font-plex-sans text-gris-neutro max-w-xl">
            Plataforma de gestión dental de nueva generación.{' '}
            <span className="text-fucsia-neon">Selene Song Core</span> como reactor.
            Ecosystem Web3, IA clínica y RGPD Art. 9 de fábrica.
          </p>
        </div>
        {/* Badge estado */}
        <div className="flex items-center gap-2 border border-fucsia-neon/30 rounded-full px-4 py-2 self-start mt-1">
          <span className="text-sm font-plex-mono text-fucsia-neon">En desarrollo · 85%</span>
        </div>
      </div>

      {/* PLACEHOLDER — Área de capturas / vídeo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Área visual principal — 2/3 */}
        <div className="lg:col-span-2 border border-gris-trazado rounded-xl bg-noche/50 flex flex-col items-center justify-center min-h-[320px] gap-3">
          <div className="text-4xl opacity-20">🖼</div>
          <p className="font-plex-mono text-gris-neutro text-sm">Capturas de UI / Vídeo</p>
          <p className="font-plex-sans text-gris-neutro/50 text-xs">UI y fotografías actualizadas — próximamente</p>
        </div>

        {/* Panel lateral de stats */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'Progreso', value: '85%', sub: 'Completado' },
            { label: 'Ecosystem', value: 'Web3', sub: 'Integrado' },
            { label: 'Cumplimiento', value: 'RGPD', sub: 'Art. 9 nativo' },
            { label: 'Motor backend', value: 'Selene', sub: 'Song Core v5' },
          ].map((stat) => (
            <div key={stat.label} className="border border-gris-trazado rounded-lg p-4 bg-noche/50">
              <p className="text-xs font-plex-mono text-gris-neutro mb-1">{stat.label}</p>
              <p className="text-2xl font-plex-mono font-bold text-fucsia-neon">{stat.value}</p>
              <p className="text-xs font-plex-sans text-gris-neutro/60">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PLACEHOLDER — Módulos / Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          'Gestión de pacientes (RGPD Art.9)',
          'IAnarkalendar — Motor de citas',
          'Facturación y seguros',
          'IA clínica — Diagnóstico asistido',
          'Ecosystem Web3 — NFT/tokens',
          'Panel admin Selene Song Core',
        ].map((feature, i) => (
          <div
            key={i}
            className="border border-gris-trazado/50 border-dashed rounded-lg p-4 bg-noche/30 flex flex-col gap-1"
          >
            <p className="text-xs font-plex-mono text-fucsia-neon/50 uppercase tracking-wider">Módulo {i + 1}</p>
            <p className="text-sm font-plex-mono text-gris-neutro">{feature}</p>
            <p className="text-xs font-plex-sans text-gris-neutro/40 mt-1">Contenido próximamente</p>
          </div>
        ))}
      </div>

      {/* RETORNO */}
      <button
        onClick={() => setActiveView('armeria')}
        className="border border-gris-trazado text-gris-neutro px-5 py-2 font-plex-mono text-sm hover:border-fucsia-neon hover:text-fucsia-neon transition-colors duration-200"
      >
        ← Volver a la Armería
      </button>

    </motion.section>
  );
};

export default DentIAgestSection;
