import { motion } from 'framer-motion';
import TechCard from '@/components/ui/TechCard';
import { Cpu, ShieldCheck, Code, Palette, Hammer, Blocks } from 'lucide-react';
import type { View } from '@/app/page';

interface ArsenalProps {
  setActiveView: (view: View) => void;
}

const Arsenal: React.FC<ArsenalProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.section 
      className="w-full max-w-[1200px] py-20 animate-fadeIn"
      key="arsenal-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h2 className="text-4xl font-plex-mono font-bold text-center mb-12">
        ## Nuestro Arsenal Tecnológico
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button 
          onClick={() => setActiveView('apolloDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Cpu}
            title="Motor de Orquestación"
            description="Una singularidad de 133KB que reemplaza arquitecturas corporativas de más de 600KB."
            isClickable={true}
          />
        </button>
        <button 
          onClick={() => setActiveView('digitalFortressDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={ShieldCheck}
            title="Framework de Seguridad"
            description="Nuestra fortaleza no es un addon. Es nuestro estándar."
            isClickable={true}
          />
        </button>
        <button 
          onClick={() => setActiveView('iaPunkDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Code}
            title="Metodología Ágil IA"
            description="Inteligencia asimétrica para convertir la burocracia en un arma de asedio."
            isClickable={true}
          />
        </button>
        <button 
          onClick={() => setActiveView('uxUiDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Palette}
            title="Doctrina UX/UI"
            description="El Anti-Ruido. El mejor software es el que se siente invisible."
            isClickable={true}
          />
        </button>
        <button 
          onClick={() => setActiveView('customToolsDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Hammer}
            title="Soberanía Total"
            description="Armas 100% Custom. Cero dependencias externas."
            isClickable={true}
          />
        </button>
        <button 
          onClick={() => setActiveView('modularDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Blocks}
            title="Arquitectura Modular"
            description="El Core Replicante. Piezas de puzzle maestras."
            isClickable={true}
          />
        </button>
      </div>
    </motion.section>
  );
};

export default Arsenal;
