import { motion } from 'framer-motion';
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
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-plex-mono font-bold tracking-tighter mb-6">
        Forjamos el Futuro del Software.
      </h1>
      <p className="max-w-2xl text-base md:text-lg text-gris-neutro mb-10">
        Las herramientas de élite no deberían ser un privilegio. Construimos tecnología de alto rendimiento accesible para todos.
      </p>
      <button
        onClick={() => setActiveView('arsenal')}
        className="font-plex-mono text-menta border border-menta rounded-md px-4 py-2 md:px-6 md:py-3 transition-all duration-300 hover:bg-menta hover:text-noche text-sm md:text-base"
      >
        [ Explorar Nuestro Arsenal ]
      </button>
    </motion.section>
  );
};
export default Hero;