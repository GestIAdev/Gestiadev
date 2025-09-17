'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArmeriaBelascoDetalleProps {
  setActiveView: (view: string) => void;
}

const ArmeriaBelascoDetalle = ({ setActiveView }: ArmeriaBelascoDetalleProps) => {
  const [isReadyToMount, setIsReadyToMount] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const demoUrl = 'https://belasco-baquedano-x8jx.vercel.app/';

  // ARRAY DE DOCTRINA - Features del Visionario
  const features = [
    "Reproductor HTML5 100% Custom",
    "Contenido dinámico (Futuro Admin Panel)",
    "Módulo de Eventos (Réplica RRSS)",
    "Restaurante: Carta Viva",
    "Tienda con Lógica Bimonetaria",
    "Próximamente: Sistema Operativo de Bodega...",
    "Diseño elegante y responsivo",
    "Preparado para expansion con Central de Reservas integral"
  ];

  const handleBackClick = () => {
    setActiveView('armeria');
  };

  // MONTAJE RETARDADO - Animación de inicialización deliberada
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsReadyToMount(true);
    }, 2000); // 2 segundos de animación cyberpunk

    return () => clearTimeout(bootTimer);
  }, []);

  // MOTOR DEL TICKER - Cicla automáticamente las features cada 4 segundos
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      // Incrementa el índice y usa módulo (%) para volver al inicio (loop)
      setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000); // 4 segundos por feature

    return () => clearInterval(tickerInterval); // Limpieza (Cero memory leaks)
  }, [features.length]);

  return (
    /* HOLOPAD FULLSCREEN - Overlay completo que cubre todo el viewport */
    <div className="fixed inset-0 z-[100] bg-[#0A0A0A]">
      
      {/* Botón flotante para volver - siempre visible */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 right-4 z-[101] flex items-center space-x-2 bg-noche/90 backdrop-blur-sm border border-gris-trazado rounded-lg px-4 py-2 text-menta hover:text-hueso hover:bg-noche transition-all duration-300 group"
        title="Volver a la Armería"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-plex-mono uppercase tracking-widest text-sm">[ &lt; VOLVER ]</span>
      </button>

      {/* RENDERIZADO CONDICIONAL - Spinner vs Iframe */}
      {isReadyToMount ? (
        /* ESTADO MONTADO - Iframe activo */
        <iframe
          src={demoUrl}
          className="w-full h-full border-none"
          title="Demo Viva: Belasco de Baquedano - Sistema Operativo Bodega"
          allow="fullscreen"
        />
      ) : (
        /* ESTADO BOOTING - Animación de inicialización cyberpunk */
        <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-menta border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <h2 className="text-3xl font-plex-mono font-bold text-menta mb-4 animate-pulse">
              INICIALIZANDO HOLOPAD
            </h2>
            <p className="text-gris-neutro font-plex-sans text-xl mb-6">
              Cargando Sistema Operativo Bodega...
            </p>
            <div className="space-y-2">
              <p className="text-gris-neutro/70 font-plex-mono text-sm">
                [DEMO VIVA] - CEBO ESTRATÉGICO ACTIVO
              </p>
              <p className="text-menta/60 font-plex-mono text-xs animate-pulse">
                Conectando a belasco-baquedano-x8jx.vercel.app...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TICKER DE DOCTRINA (LA NUEVA ARMA) --- */}
      {/* Este es el "minibloque flotante" (esquina inferior izquierda) */}
      <div className="absolute bottom-6 left-6 z-[101] max-w-md p-4 bg-noche/70 backdrop-blur-md border border-gris-trazado rounded-lg">
        <AnimatePresence mode="wait"> {/* 'mode="wait"' asegura un fade suave de salida/entrada */}
          <motion.p
            key={featureIndex} // CRÍTICO: La animación se dispara cuando esta key cambia
            className="font-plex-mono text-menta text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {features[featureIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArmeriaBelascoDetalle;