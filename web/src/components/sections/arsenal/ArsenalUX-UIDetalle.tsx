// Ubicación: components/sections/ArsenalUX-UIDetalle.tsx

import { motion } from 'framer-motion';
import type { View } from '@/app/page';

interface ArsenalUXUIProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para la Doctrina UX/UI (El Anti-Ruido).
 */
const ArsenalUXUIDetalle: React.FC<ArsenalUXUIProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-ux-ui-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      
      {/* 1. TÍTULO */}
      <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
        Doctrina UX/UI (El Anti-Ruido)
      </h2>

      {/* 2. QUÉ ES (La Filosofía) */}
      <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
        <h3 className="text-2xl font-plex-mono mt-4">¿QUÉ ES? (La Filosofía)</h3>
        <p className="italic">
          "Nuestra obsesión por el UX. Creemos que el mejor software es el que se siente invisible. Si el usuario necesita un manual de instrucciones o se encuentra con un 'error de validación', el Arquitecto ha fracasado."
        </p>
      </div>

      {/* 3. CÓMO FUNCIONA (El Método Anti-Validación) */}
      <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
        <h3 className="text-2xl font-plex-mono mt-4">¿CÓMO FUNCIONA? (El Método Anti-Validación)</h3>
        <p className="italic">
          "Odiamos la fricción. Odiamos los pop-ups, los tooltips y los formularios burocráticos. Nuestro diseño previene el error en lugar de reportarlo. Simplificamos los flujos de trabajo hasta que solo queda la señal pura, eliminando todo el ruido corporativo."
        </p>
      </div>

      {/* 4. POR QUÉ GANA (La Prueba: Belasco) */}
      <h3 className="text-2xl font-plex-mono mb-4 mt-4">¿POR QUÉ GANA? (La Prueba de Flujo: IAnarkalendar V1.0)</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Columna 1: El Enemigo */}
        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-fucsia-neon mb-2">El Dogma "Corpo" (El Ruido)</h4>
          <ul className="list-disc list-inside text-sm font-plex-sans text-gris-neutro space-y-2">
            <li>El usuario introduce datos.</li>
            <li>El sistema espera al "Submit" para validar.</li>
            <li>El sistema devuelve 3 errores de validación (pop-ups).</li>
            <li>El usuario corrige 2 y olvida 1.</li>
            <li>El sistema devuelve el mismo error.</li>
            <li>El usuario abandona (Fricción = Fracaso).</li>
          </ul>
        </div>

        {/* Columna 2: Nuestra Doctrina */}
        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-menta mb-2">La Doctrina "Anti-Ruido" (Belasco)</h4>
           <ul className="list-disc list-inside text-sm font-plex-sans text-hueso space-y-2">
            <li>El diseño (UI) previene el error (ej: el calendario deshabilita días imposibles).</li>
            <li>La lógica simplifica el flujo (menos pasos).</li>
            <li>No hay validaciones invasivas.</li>
            <li>El software se siente invisible.</li>
            <li>El usuario completa la tarea en el primer intento (Cero Fricción).</li>
          </ul>
        </div>

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

export default ArsenalUXUIDetalle;