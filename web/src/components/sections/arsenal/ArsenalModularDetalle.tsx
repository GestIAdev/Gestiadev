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

      {/* 3. CÓMO FUNCIONA (El "Arte": El Diagrama de Replicación) */}
      <h3 className="text-2xl font-plex-mono mb-4 mt-4">La Prueba: El Motor "Plataforma de Gestión"</h3>
      
      <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50 mb-6">
        <p className="text-center text-menta font-plex-mono text-lg mb-4">[ Diagrama de Replicación del Core ]</p>
        <div className="flex flex-col items-center">
          
          {/* El Core */}
          <div className="border-2 border-menta p-4 rounded text-center shadow-lg shadow-menta/20">
            <span className="font-plex-mono font-bold text-lg">NÚCLEO CORE (Ej: Dentalsoft)</span>
            <p className="text-sm text-gris-neutro"> (Motor de Orquestación + Framework de Seguridad + Metodología Ágil IA + UI Kit)</p>
          </div>

          {/* Flecha (El Motor) */}
          <div className="text-menta font-plex-mono text-3xl my-3 transform rotate-90">➔</div>
          <span className="text-sm text-gris-neutro -mt-4 mb-4"> (Motor de Replicación: Apollo)</span>

          {/* Los Clones (Grid 3-col) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="border border-gris-trazado p-3 rounded text-center bg-noche/50">
              <span className="font-plex-mono text-hueso">VeteGest (Veterinaria)</span>
              <p className="text-xs text-gris-neutro">90% Core + 10% Custom</p>
            </div>
            <div className="border border-gris-trazado p-3 rounded text-center bg-noche/50">
              <span className="font-plex-mono text-hueso">FitGest (Gimnasio)</span>
              <p className="text-xs text-gris-neutro">90% Core + 10% Custom</p>
            </div>
            <div className="border border-gris-trazado p-3 rounded text-center bg-noche/50">
              <span className="font-plex-mono text-hueso">LegalGest (Abogados)</span>
              <p className="text-xs text-gris-neutro">90% Core + 10% Custom</p>
            </div>
          </div>

        </div>
      </div>


       {/* 4. POR QUÉ GANA (El Objetivo Final) */}
       <p className="text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
         Esta es nuestra arma de asedio a largo plazo: La <strong className="text-menta">Plataforma de Gestión</strong>. Es la capacidad de clonar nuestro "Core" y asediar cualquier industria vertical. Mientras el "establishment" tarda 1 año en construir UN producto, nosotros podemos lanzar DIEZ.
       </p>


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