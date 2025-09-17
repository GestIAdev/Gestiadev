// Ubicación: components/sections/ArsenalCustomToolsDetalle.tsx

import { motion } from 'framer-motion';
import type { View } from '@/app/page'; // Ajusta la ruta si es necesario

interface ArsenalCustomToolsProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle para la Doctrina de Soberanía (Armas Custom).
 * Traduce nuestra filosofía Zero-Dep.
 */
const ArsenalCustomToolsDetalle: React.FC<ArsenalCustomToolsProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-custom-tools-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      
      {/* 1. TÍTULO */}
      <h2 className="text-3xl lg:text-4xl font-plex-mono mb-4 text-menta">
        Soberanía Total (Armas 100% Custom)
      </h2>

      {/* 2. QUÉ ES (La Filosofía) */}
      <div className="space-y-4 text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
        <p>
          La Doctrina de <strong className="text-menta">Cero Dependencias Externas (Zero-Dep)</strong>. El "establishment" ensambla 50 herramientas, plugins y licencias de terceros, y reza para que funcionen juntas.
        </p>
        <p className="font-bold text-xl">
          Nosotros no ensamblamos. Nosotros Forjamos.
        </p>
      </div>

      {/* 3. CÓMO FUNCIONA (La Prueba de Flujo) */}
      <h3 className="text-2xl font-plex-mono mb-4 mt-4">La Prueba: Stack Soberano vs. Stack "Corpo"</h3>
      
      {/* El Grid Comparativo (El "Arte") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Columna 1: El Enemigo */}
        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-fucsia-neon mb-2">Stack "Corpo" (Dependencia)</h4>
          <p className="text-sm font-plex-sans text-gris-neutro mb-3">Un infierno de licencias de terceros, bloat y puntos de fallo:</p>
          <ul className="list-disc list-inside text-sm font-plex-sans text-gris-neutro space-y-2">
            <li>Auth0 (Autenticación)</li>
            <li>Calendly (Gestión de Citas)</li>
            <li>Stripe (Pagos)</li>
            <li>Wordpress (CMS / Blog)</li>
            <li>Múltiple Plugins de AWS/Azure</li>
            <li className="text-hueso font-bold mt-2">Resultado: Si un tercero falla, TU app falla.</li>
          </ul>
        </div>

        {/* Columna 2: Nuestra Doctrina */}
        <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
          <h4 className="text-xl font-plex-mono text-menta mb-2">Stack Cónclave (Soberano)</h4>
          <p className="text-sm font-plex-sans text-hueso mb-3">Si la herramienta no existe o es mediocre, la forjamos:</p>
           <ul className="list-disc list-inside text-sm font-plex-sans text-hueso space-y-2">
            <li><strong className="text-menta">Motor de Orquestación</strong> (Nuestro Reactor Backend/Auth).</li>
            <li><strong className="text-menta">IAnarkalendar</strong> (Nuestro Motor de Citas Punk-Hacked).</li>
            <li><strong className="text-menta">Framework de Seguridad</strong> (Nuestra Seguridad Core).</li>
            <li>Payload CMS (Nuestro Panel Admin Soberano).</li>
            <li>Cero dependencias "corpo" críticas.</li>
            <li className="text-menta font-bold mt-2">Resultado: Control Total. Cero Bloat.</li>
          </ul>
        </div>
      </div>

       {/* 4. POR QUÉ GANA (El Pacto) */}
       <h3 className="text-2xl font-plex-mono mb-4 mt-4">Beneficio: Aliados, No Clientes</h3>
       <p className="text-lg font-plex-sans text-hueso mb-6 max-w-4xl">
         Cuando te entregamos software, es tuyo. Es un arma soberana, no un alquiler mensual de 50 licencias frágiles.
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

export default ArsenalCustomToolsDetalle;