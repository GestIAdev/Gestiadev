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
      {/* 1. ANCLA VISUAL — Logo Selene */}
      <Image
        src="/luxsync/interpreted_vector_logo.png"
        alt="Selene LUX Core"
        width={320}
        height={320}
        className="w-48 md:w-64 lg:w-80 h-auto mb-6 rounded-full aspect-square object-cover shadow-[0_0_40px_rgba(0,242,169,0.2)]"
        priority
      />

      {/* 2. COPYWRITING — Centro */}
      <h1 className="text-3xl md:text-5xl font-plex-mono font-bold text-hueso mb-4">
        Luxync DMX. La automatización ha evolucionado.
      </h1>

      <p className="text-base md:text-lg text-gris-neutro max-w-2xl mx-auto mb-8 font-plex-sans">
        Físicas de fluidos, sincronización Radix-2 y el primer motor cognitivo DMX. Jubila los presets.
      </p>

      {/* 3. BOTONERA BINARIA — Abajo */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        {/* Botón Primario */}
        <button
          onClick={() => setActiveView('luxsync')}
          className="font-plex-mono font-bold bg-menta text-noche px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:bg-[#00cce6]"
        >
          [ RECLAMAR BETA ]
        </button>

        {/* Botón Secundario */}
        <button
          onClick={() => setActiveView('armeria')}
          className="font-plex-mono text-gris-neutro border border-gris-trazado px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:border-hueso hover:text-hueso"
        >
          [ EXPLORAR ARMERÍA ]
        </button>
      </div>
    </motion.section>
  );
};
export default Hero;