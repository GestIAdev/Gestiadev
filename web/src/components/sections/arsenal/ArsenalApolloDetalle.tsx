// Ubicación: components/sections/ArsenalApolloDetalle.tsx
// NOTA: Este archivo mantiene su nombre técnico interno pero el contenido es genérico

import { motion } from 'framer-motion';
import type { View } from '@/app/page'; // (Asegúrate de que el tipo 'View' esté exportado desde page.tsx)

interface ArsenalApolloProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para el Motor de Orquestación.
 * Traduce el Manifiesto Técnico (SPEC.md) a contenido didáctico (Anti-Sorna).
 */
const ArsenalApolloDetalle: React.FC<ArsenalApolloProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-apollo-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full w-full">
        {/* 1. TÍTULO (La Traducción Táctica) */}
        <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
          El Monolito Optimizado (Motor de Orquestación)
        </h2>

        {/* 2. LA ANALOGÍA (El Reactor vs. Cocinas) */}
        <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
          <p>
            La arquitectura "corpo" (Microservicios) es un restaurante con 10 cocinas lentas: una para Pagos, otra para Usuarios, otra para Citas. Cada petición requiere múltiples viajes de red internos, creando latencia y caos.
          </p>
          <p className="font-bold text-xl">
            El Motor de Orquestación es UN Reactor centralizado.
          </p>
          <p>
            Técnicamente, es nuestro framework backend monolítico. Cuando el frontend pide datos, hace <strong className="text-menta">UNA sola llamada</strong> al Reactor. El Motor gestiona la Seguridad, la Autenticación y la lógica en un solo proceso (133KB) a velocidad de RAM, eliminando la latencia de red.
          </p>
        </div>

        {/* 3. LAS MÉTRICAS (Hard Data del Manifiesto de Cloude) */}
        <h3 className="text-2xl font-plex-mono mb-4 mt-4">Métricas de Superioridad (vs. Arquitectura Corpo)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Métrica 1: Tamaño */}
          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/90">
            <span className="text-4xl font-plex-mono text-menta">70%</span>
            <p className="mt-2 text-gris-neutro text-sm font-plex-sans">
              Menos Footprint (133.78KB vs 600KB+ de bloat corporativo).
            </p>
          </div>
          
          {/* Métrica 2: Desarrollo */}
          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/90">
            <span className="text-4xl font-plex-mono text-menta">62.5%</span>
            <p className="mt-2 text-gris-neutro text-sm font-plex-sans">
              Más Rápido (Dev Velocity). Forjamos features en horas, no en sprints de semanas.
            </p>
          </div>
          
          {/* Métrica 3: Democracia */}
          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/90">
            <span className="text-4xl font-plex-mono text-menta">95%</span>
            <p className="mt-2 text-gris-neutro text-sm font-plex-sans">
              Reducción de Onboarding (30 min vs 4 días). Eso es Democracia de Código.
            </p>
          </div>
          
          {/* Métrica 4: GESTIÓN UNIFICADA (El Reactor) */}
          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/90">
            <span className="text-2xl font-plex-mono text-menta">GESTIÓN</span>
            <p className="mt-2 text-gris-neutro text-sm font-plex-sans">
              <strong className="text-menta">UNIFICADA</strong><br/>
              No es un simple 'wrapper'. Es un reactor que auto-maneja Autenticación, Errores Unificados y APIs de Dominio (como PatientsAPI) de fábrica. Cero configuración. Cero bloat.
            </p>
          </div>
        </div>

        {/* 4. COMANDO DE RETORNO (UX del Terminal) */}
        <div className="mt-auto pt-4"> {/* Empuja el botón al fondo del contenedor flex */}
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

export default ArsenalApolloDetalle;
