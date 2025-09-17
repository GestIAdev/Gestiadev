// Ubicación: components/sections/ArsenalDigitalFortressDetalle.tsx

import { motion } from 'framer-motion';
import type { View } from '@/app/page';

interface ArsenalDigitalFortressProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para el Framework de Seguridad.
 * Explica la doctrina "Compliance = Arma".
 */
const ArsenalDigitalFortressDetalle: React.FC<ArsenalDigitalFortressProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-digital-fortress-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full w-full">
        {/* 1. TÍTULO */}
        <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
          Framework de Seguridad (Doctrina: Compliance = Arma)
        </h2>

        {/* 2. QUÉ ES (El Estándar "Estación Espacial") */}
        <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
          <h3 className="text-2xl font-plex-mono mt-4">¿QUÉ ES? (El Estándar "Estación Espacial")</h3>
          <p>
            El Framework de Seguridad es nuestro estándar de seguridad <strong className="text-menta">"Defensa en Profundidad"</strong>.
          </p>
          <p>
            Para el establishment, la seguridad es un parche. Para nosotros, es el cimiento. No "cumplimos" con las regulaciones; diseñamos nuestra arquitectura para superarlas por defecto, incluyendo los estándares de datos médicos más duros del planeta (diseñado para cumplir el Artículo 9 del RGPD).
          </p>
        </div>

        {/* 3. CÓMO FUNCIONA (La Prueba y la Historia) */}
        <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
          <h3 className="text-2xl font-plex-mono mt-4">¿CÓMO FUNCIONA? (La Prueba y la Historia)</h3>
          <p>Usamos un enfoque paranoico "Zero Trust" que incluye:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-base">
            {/* Card 1: Cifrado */}
            <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
              <h4 className="font-bold text-menta mb-2">Cifrado por Campo (PHI)</h4>
              <p className="text-sm text-gris-neutro font-plex-sans">No solo ciframos la base de datos; usamos AES-256 por campo para los Historiales Médicos (PHI).</p>
            </div>
            {/* Card 2: Auditoría */}
            <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
              <h4 className="font-bold text-menta mb-2">Auditoría Inmutable</h4>
              <p className="text-sm text-gris-neutro font-plex-sans">Cada acción se graba en logs inmutables con hash (SHA-256), haciendo el sabotaje criptográficamente imposible de ocultar.</p>
            </div>
            {/* Card 3: Detección */}
            <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
              <h4 className="font-bold text-menta mb-2">Detección de Anomalías</h4>
              <p className="text-sm text-gris-neutro font-plex-sans">Nuestro sistema incluye limitación de tasa consciente del rol y análisis de comportamiento.</p>
            </div>
          </div>
          <div className="border-l-4 border-menta pl-4 italic text-gris-neutro mt-4">
              <h4 className="font-bold text-hueso not-italic mb-2">Caso de Estudio (La Anécdota de la 1:15 AM):</h4>
              <p>"Esta arquitectura es tan agresiva que bloqueó a nuestros propios devs durante las pruebas de Dentalsoft. Nuestro 'Middleware RBAC' y la 'Detección de Anomalías' marcaron correctamente el acceso a la 1:15 AM como un vector de ataque potencial y bloquearon la sesión. Nuestra seguridad desconfía incluso de nosotros."</p>
          </div>
        </div>

        {/* 4. LA SALVAGUARDA DE IA (El Arma Anti-Corpo) */}
         <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
          <h3 className="text-2xl font-plex-mono mt-4">LA SALVAGUARDA DE IA (El Arma Anti-Corpo)</h3>
          <p>
            Cuando nuestro sistema interactúa con IA (LLMs externos), Digital Fortress impone un firewall de <strong className="text-menta">Pseudonimización obligatorio</strong>. Solo se transmiten cargas mínimas y "limpiadas" de datos sensibles, protegiendo al cliente (y a nosotros) antes de que cualquier LLM externo sea contactado.
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
      </div>
    </motion.div>
  );
};

export default ArsenalDigitalFortressDetalle;
