import { motion } from 'framer-motion';
import Image from 'next/image';
import type { View } from '@/app/page';

interface HeroProps {
  setActiveView: (view: View) => void;
}

const Hero = ({ setActiveView }: HeroProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.section 
      className="h-[calc(100vh-6rem)] w-full max-w-[1100px] flex flex-col justify-center items-center text-center"
      key="hero-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo Selene — Ancla Visual */}
      <div className="mb-8 relative">
        <div className="w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 rounded-full shadow-[0_0_40px_rgba(0,242,169,0.15)] flex items-center justify-center bg-noche/40 border border-menta/20">
          <Image
            src="/luxsync/interpreted_vector_logo.png"
            alt="Selene LUX Core"
            width={384}
            height={384}
            className="w-52 md:w-64 lg:w-72 h-auto rounded-full"
            priority
          />
        </div>
      </div>

      {/* Kicker — INICIANDO SECUENCIA */}
      <p className="text-xs md:text-sm font-plex-mono text-menta tracking-[0.3em] uppercase mb-4">
        // INICIANDO SECUENCIA BETA
      </p>

      {/* H1 — Titular Principal */}
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-plex-mono font-bold tracking-tighter mb-6 text-hueso">
        Luxync DMX. La automatización ha evolucionado.
      </h1>

      {/* Subtítulo — Descripción */}
      <p className="max-w-2xl text-base md:text-lg text-gris-neutro mb-10 font-plex-sans">
        Físicas de fluidos, sincronización Radix-2 y el primer motor cognitivo DMX. Únete a la Beta Testing y jubila los presets.
      </p>

      {/* Doble Embudo de CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Botón Primario — Reclamar Beta */}
        <button
          onClick={() => setActiveView('luxsync')}
          className="font-plex-mono font-bold bg-menta text-noche px-6 py-3 text-sm md:text-base transition-all duration-300 hover:bg-menta/90 hover:shadow-[0_0_20px_rgba(0,242,169,0.3)]"
        >
          [ RECLAMAR BETA ]
        </button>

        {/* Botón Secundario — Explorar Armería */}
        <button
          onClick={() => setActiveView('arsenal')}
          className="font-plex-mono text-gris-neutro border border-gris-trazado px-6 py-3 text-sm md:text-base transition-all duration-300 hover:text-menta hover:border-menta"
        >
          [ EXPLORAR ARMERÍA ]
        </button>
      </div>
    </motion.section>
  );
};
export default Hero;