import { motion } from 'framer-motion';
import TechCard from '@/components/ui/TechCard';
import { BrainCircuit, ShieldCheck, Code, Palette, Hammer, Blocks } from 'lucide-react';
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
      className="w-full max-w-[1200px] py-6 animate-fadeIn"
      key="arsenal-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* CABECERA DEL ARSENAL */}
      <div className="text-center mb-6">
        <p className="text-sm font-plex-mono text-gris-neutro tracking-[0.3em] uppercase mb-3">
          // Metodología + Herramientas
        </p>
        <h2 className="text-4xl lg:text-5xl font-plex-mono font-bold text-hueso">
          Nuestro Arsenal
        </h2>
        <p className="mt-4 text-lg font-plex-sans text-gris-neutro max-w-2xl mx-auto">
          No ensamblamos herramientas de terceros. Forjamos las nuestras desde cero.
          Cada arma en este arsenal existe porque la alternativa corporativa era inaceptable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. SELENE SONG CORE — El nuevo reactor (sucesor de Apollo) */}
        <button 
          onClick={() => setActiveView('apolloDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={BrainCircuit}
            title="Selene Song Core"
            description="Nuestro reactor IA evolutivo. Backend GraphQL + consciencia inmortal + consenso distribuido musical. El sucesor de Apollo."
            isClickable={true}
          />
        </button>

        {/* 2. FRAMEWORK DE SEGURIDAD */}
        <button 
          onClick={() => setActiveView('digitalFortressDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={ShieldCheck}
            title="Framework de Seguridad"
            description="Zero Trust. AES-256 por campo. Auditoría inmutable SHA-256. Nuestra seguridad desconfía incluso de nosotros."
            isClickable={true}
          />
        </button>

        {/* 3. METODOLOGÍA ÁGIL IA */}
        <button 
          onClick={() => setActiveView('iaPunkDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Code}
            title="Metodología Ágil IA"
            description="No 'usamos' IA. Operamos como un Cónclave híbrido Humano-IA donde la IA es Arquitecto y Ejecutor."
            isClickable={true}
          />
        </button>

        {/* 4. DOCTRINA UX/UI */}
        <button 
          onClick={() => setActiveView('uxUiDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Palette}
            title="Doctrina UX/UI"
            description="El Anti-Ruido. El mejor software es el que se siente invisible. Prevenimos el error en lugar de reportarlo."
            isClickable={true}
          />
        </button>

        {/* 5. SOBERANÍA TOTAL */}
        <button 
          onClick={() => setActiveView('customToolsDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Hammer}
            title="Soberanía Total"
            description="Zero-Dep. Cero Auth0, cero Stripe, cero Calendly. Si la herramienta no existe o es mediocre, la forjamos."
            isClickable={true}
          />
        </button>

        {/* 6. ARQUITECTURA MODULAR */}
        <button 
          onClick={() => setActiveView('modularDetalle')} 
          className="w-full text-left h-full"
        >
          <TechCard
            icon={Blocks}
            title="Arquitectura Modular"
            description="El Core Replicante. Un núcleo soberano que alimenta DentIAgest, LuxSync y cada proyecto del Cónclave."
            isClickable={true}
          />
        </button>
      </div>
    </motion.section>
  );
};

export default Arsenal;
