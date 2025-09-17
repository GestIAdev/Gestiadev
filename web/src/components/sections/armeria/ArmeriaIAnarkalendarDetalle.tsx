'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, Shield, Globe } from 'lucide-react';
import Image from 'next/image';
import type { View } from '@/app/page';

interface ArmeriaIAnarkalendarDetalleProps {
  setActiveView: (view: View) => void;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Módulo de Detalle V2 para IAnarkalendar.
 * Fusiona la Doctrina (Specs) con la Prueba Visual (Galería).
 */
const ArmeriaIAnarkalendarDetalle = ({ setActiveView }: ArmeriaIAnarkalendarDetalleProps) => {
  const [lightboxImgSrc, setLightboxImgSrc] = useState<string | null>(null);

  const handleBackClick = () => {
    setActiveView('armeria');
  };

  return (
    /* El Holopad de Intel (Tipo B - Dentro del Layout Normal) */
    <motion.div
      className="w-full max-w-7xl mx-auto"
      key="armeria-ianarkalendar"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Contenedor del Holopad */}
      <div className="relative w-full flex flex-col justify-start items-center p-8 bg-black/60 backdrop-blur-sm border border-gris-trazado rounded-lg">

        {/* Botón Volver */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 right-4 flex items-center space-x-2 bg-noche/90 backdrop-blur-sm border border-gris-trazado rounded-lg px-4 py-2 text-menta hover:text-hueso hover:bg-noche transition-all duration-300 group"
          title="Volver a la Armería"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-plex-mono uppercase tracking-widest text-sm">[ &lt; VOLVER ]</span>
        </button>

        {/* --- CONTENIDO DEL HOLOPAD --- */}

        <h2 className="text-3xl lg:text-5xl font-plex-mono mb-4 text-menta">
          IAnarkalendar
        </h2>
        <p className="text-xl font-plex-sans text-hueso mb-10 max-w-4xl text-center">
          Nuestra arma soberana de gestión de tiempo. Forjada para ahorrar +$1,000/año en tarifas de SaaS y darnos control total.
        </p>

        {/* --- GRID DE PRUEBAS FUSIONADO (2x2) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-10">

          {/* Tarjeta 1: La Prueba Visual Semanal */}
          <motion.div
            className="border border-gris-trazado p-6 rounded-lg bg-noche/50 hover:bg-noche/70 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-xl font-plex-mono text-menta mb-4">Apilamiento Táctico (Stacking)</h4>
            {/* Imagen: Vista Semanal */}
            <div 
              className="h-48 bg-gris-trazado/20 rounded-lg mb-4 overflow-hidden border border-gris-trazado/50 cursor-pointer hover:border-menta/50 transition-colors"
              onClick={() => setLightboxImgSrc('/ianarkalendar2.png')}
              title="Haz clic para ver en detalle"
            >
              <Image
                src="/ianarkalendar2.png"
                alt="Vista Semanal - Apilamiento Táctico"
                width={400}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
              Diseñado para alta densidad. El calendario agrupa (apila) citas y revela la pila completa con &quot;Hover Reveal&quot;, soportando 5+ citas por slot.
            </p>
          </motion.div>

          {/* Tarjeta 2: La Prueba Visual Diaria */}
          <motion.div
            className="border border-gris-trazado p-6 rounded-lg bg-noche/50 hover:bg-noche/70 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-xl font-plex-mono text-menta mb-4">Citas Codificadas (Datos Ricos)</h4>
            {/* Imagen: Vista Diaria */}
            <div 
              className="h-48 bg-gris-trazado/20 rounded-lg mb-4 overflow-hidden border border-gris-trazado/50 cursor-pointer hover:border-menta/50 transition-colors"
              onClick={() => setLightboxImgSrc('/Ianarkalendar.png')}
              title="Haz clic para ver en detalle"
            >
              <Image
                src="/Ianarkalendar.png"
                alt="Vista Diaria - Citas Codificadas"
                width={400}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
              Tarjetas de datos ricas con código de color instantáneo por tipo de cita (Tratamiento, Consulta), iconos de estado (Urgencia) y alta densidad (múltiples slots de 15 minutos).
            </p>
          </motion.div>

          {/* Tarjeta 3: La Prueba Técnica de Seguridad */}
          <motion.div
            className="border border-gris-trazado p-6 rounded-lg bg-noche/50 hover:bg-noche/70 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={32} className="text-menta group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-plex-mono text-menta">Fortaleza RBAC (Anti-Ruido)</h4>
            </div>
            <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
              Arma &quot;Compliance = Arma&quot;. Filtra datos sensibles (medical_notes) basado en el rol (Admin vs. Recepcionista) a nivel de servidor.
            </p>
          </motion.div>

          {/* Tarjeta 4: La Prueba Técnica de Alcance */}
          <motion.div
            className="border border-gris-trazado p-6 rounded-lg bg-noche/50 hover:bg-noche/70 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Globe size={32} className="text-menta group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-plex-mono text-menta">Sincronización Global</h4>
            </div>
            <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
              Soporte nativo y sincronización automática de franjas horarias para 15 países.
            </p>
          </motion.div>

        </div>

        {/* CTA Final */}
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleBackClick}
            className="inline-flex items-center space-x-3 bg-menta text-noche px-8 py-4 font-plex-mono uppercase tracking-widest hover:bg-hueso hover:text-noche transition-all duration-300 rounded-lg border-2 border-menta hover:border-hueso hover:shadow-lg hover:shadow-menta/20"
          >
            <ArrowLeft size={24} />
            <span>[ VOLVER A LA ARMERÍA ]</span>
          </button>
        </motion.div>

        {/* --- VISOR SOBERANO (LIGHTBOX) --- */}
        <AnimatePresence>
          {lightboxImgSrc && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-noche/90 backdrop-blur-md p-8"
              onClick={() => setLightboxImgSrc(null)} // Cierra al hacer clic fuera de la imagen
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Contenedor de Imagen (para evitar que el clic en la img cierre el modal) */}
              <motion.div
                className="relative max-w-full max-h-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                onClick={(e) => e.stopPropagation()} // Previene el cierre al hacer clic EN la imagen
              >
                <img
                  src={lightboxImgSrc}
                  alt="Vista de detalle de IAnarkalendar"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setLightboxImgSrc(null)}
                  className="absolute -top-4 -right-4 z-[201] bg-menta text-noche rounded-full w-10 h-10 flex items-center justify-center font-bold text-2xl hover:scale-110 transition-transform"
                  title="Cerrar Visor"
                >
                  &times;
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div> {/* Fin del Contenedor de Holopad Interno */}
    </motion.div>
  );
};

export default ArmeriaIAnarkalendarDetalle;