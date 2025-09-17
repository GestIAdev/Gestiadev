// Ubicación: components/sections/ArsenalIAPunkDetalle.tsx

import { motion } from 'framer-motion';
import type { View } from '@/app/page'; // Ajusta la ruta si es necesario

interface ArsenalIAPunkProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para la Metodología Ágil IA (Scherzo de Combate).
 * Traduce nuestra doctrina interna (Cónclave) a una narrativa pública (Simbiosis Estratégica).
 */
const ArsenalIAPunkDetalle: React.FC<ArsenalIAPunkProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-ia-punk-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      
      {/* 1. TÍTULO */}
      <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
        Metodología Ágil IA (Inteligencia Asimétrica)
      </h2>

      {/* 2. QUÉ ES (La Filosofía) */}
      <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
        <p>
          El "establishment" usa la IA como un "asistente" para escribir boilerplate más rápido. Nuestra metodología es una **simbiosis arquitectónica completa**.
        </p>
        <p className="font-bold text-xl">
          No "usamos" IA; operamos como un Cónclave híbrido Humano-IA donde la IA es el Arquitecto y el Ejecutor.
        </p>
      </div>

      {/* 3. CÓMO FUNCIONA (El Scherzo de Combate traducido) */}
      <h3 className="text-2xl font-plex-mono mb-4 mt-4">El Scherzo de Combate (Nuestro Flujo Táctico)</h3>
      
      {/* Usamos el grid de 3 columnas (aprobado en Turno 58) para el flujo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-menta mb-2">1. El Estratega (Humano)</h4>
          <p className="text-sm font-plex-sans text-gris-neutro">
            Un Estratega Humano (con base lógica de Ingeniería) define el "PORQUÉ": la misión, la filosofía y los objetivos que rompen el dogma corporativo.
          </p>
        </div>

        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-menta mb-2">2. El Arquitecto (IA-Humano)</h4>
          <p className="text-sm font-plex-sans text-gris-neutro">
             Generamos el "CÓMO" de manera híbrida: los planos técnicos completos, la arquitectura (Motor de Orquestación) y los protocolos de datos se documentan a la par.
          </p>
        </div>

        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-menta mb-2">3. El Ejecutor (IA)</h4>
          <p className="text-sm font-plex-sans text-gris-neutro">
            Un Ejecutor IA toma esos planos de arquitectura y forja en pequeñas fases el código limpio y soberano a velocidad sobrehumana. Un humano revisa y corrige. Se procede despues a la depuracion manual
          </p>
        </div>
      </div>

       {/* 4. POR QUÉ GANA (La Prueba) */}
       <h3 className="text-2xl font-plex-mono mb-4 mt-4">La Prueba: 60% de Dentalsoft en 2 Semanas</h3>
       <p className="text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
         Así es como nuestro Cónclave (un Estratega Humano dirigiendo Arquitectos IA) forja software médico complejo. Convertimos la burocracia (el tiempo) en nuestra arma de asedio.
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

export default ArsenalIAPunkDetalle;
