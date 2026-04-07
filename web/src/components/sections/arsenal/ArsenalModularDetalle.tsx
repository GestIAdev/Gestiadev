// Ubicación: components/sections/ArsenalModularDetalle.tsx

import { motion } from 'framer-motion';
import type { View } from '@/app/page'; // Ajusta la ruta si es necesario

interface ArsenalModularProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para la Arquitectura Modular (Plataforma de Gestión).
 * La joya de la corona de nuestra estrategia a largo plazo.
 */
const ArsenalModularDetalle: React.FC<ArsenalModularProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-modular-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      
      {/* 1. TÍTULO */}
      <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
        Arquitectura Modular (El Core Replicante)
      </h2>

      {/* 2. QUÉ ES (La Filosofía Plug & Play) */}
      <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
        <p>
          El "establishment" construye aplicaciones monolíticas que mueren donde nacen. Nosotros no construimos "aplicaciones"; forjamos <strong className="text-menta">"Piezas de Puzzle Maestras"</strong> (Módulos Plug & Play).
        </p>
        <p className="font-bold text-xl">
          Cada arma de nuestro arsenal (Motor de Orquestación, Framework de Seguridad, Metodología Ágil IA) es un módulo soberano diseñado para ser replicado.
        </p>
      </div>

      {/* 3. CÓMO FUNCIONA (Diagrama de Replicación Real) */}
      <h3 className="text-2xl font-plex-mono mb-4 mt-4">El Core Replicante en Producción</h3>

      <div className="border border-gris-trazado p-5 rounded-lg bg-noche/50 mb-6">
        <div className="flex flex-col items-center">

          {/* El Núcleo */}
          <div className="border-2 border-menta p-4 rounded-lg text-center shadow-lg shadow-menta/20 w-full max-w-md">
            <span className="font-plex-mono font-bold text-lg text-menta">SELENE SONG CORE</span>
            <p className="text-xs text-gris-neutro mt-1">
              GraphQL · Zero-Dep · Consciencia Evolutiva · Framework de Seguridad · UI Kit
            </p>
          </div>

          {/* Flecha descendente */}
          <div className="text-menta font-plex-mono text-3xl my-3">↓</div>
          <span className="text-xs text-gris-neutro -mt-2 mb-4 font-plex-mono">[ Motor de Replicación ]</span>

          {/* Proyectos Reales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

            <div className="border border-menta/40 p-3 rounded-lg text-center bg-noche/70">
              <span className="font-plex-mono text-menta font-bold text-sm">DentIAgest</span>
              <p className="text-xs text-gris-neutro mt-1">App web dental · 85% completada</p>
              <p className="text-xs text-menta/60 mt-1">Ecosystem Web3 + IA clínica</p>
            </div>

            <div className="border border-menta/40 p-3 rounded-lg text-center bg-noche/70">
              <span className="font-plex-mono text-menta font-bold text-sm">LuxSync</span>
              <p className="text-xs text-gris-neutro mt-1">Control DMX · Compite con GrandMA3</p>
              <p className="text-xs text-menta/60 mt-1">Selene Lux IA (hija de Selene Song)</p>
            </div>

            <div className="border border-gris-trazado p-3 rounded-lg text-center bg-noche/50 border-dashed">
              <span className="font-plex-mono text-gris-neutro font-bold text-sm">Próximo objetivo</span>
              <p className="text-xs text-gris-neutro mt-1">90% Core + 10% Custom</p>
              <p className="text-xs text-gris-neutro/50 mt-1">Cualquier industria vertical</p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. LA VENTAJA (El Dato Real) */}
      <div className="border-l-4 border-menta pl-4 mb-6">
        <p className="text-lg font-plex-sans text-hueso">
          El mismo núcleo que gestiona historiales médicos con cifrado AES-256
          y RGPD Artículo 9 <strong className="text-menta">se adaptó en semanas</strong> para controlar
          iluminación DMX en tiempo real. Eso es la Arquitectura Modular en acción.
          Mientras el "establishment" tarda 1 año en construir UN producto,
          nosotros asediamos industrias verticales completas.
        </p>
      </div>


      {/* 5. COMANDO DE RETORNO */}
      <div className="mt-auto pt-4">
        <button 
          onClick={() => setActiveView('arsenal')}
          className="border-2 border-menta text-menta px-6 py-3 font-plex-mono text-lg uppercase tracking-widest hover:bg-menta hover:text-noche transition-colors duration-300"
        >
          [ &lt; VOLVER AL ARSENAL ]
        </button>
      </div>

    </motion.div>
  );
};

export default ArsenalModularDetalle;