'use client';

import { useMotionValue, useTransform, motion } from 'framer-motion';

interface ScherzoCardProps {
  setActiveView: (view: string) => void;
}

const ScherzoCard = ({ setActiveView }: ScherzoCardProps) => {
  const handleMissionClick = () => {
    setActiveView('armeria-scherzo');
  };

  // Parallax 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="relative bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg flex flex-col h-[450px] transition-all duration-300 group cursor-pointer"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: 1.03,
        borderColor: "rgb(0, 255, 136)",
        boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleMissionClick}
    >
      {/* Screenshot central - Flush */}
      <div className="h-40">
        <motion.img
          src="/otros/civetpunky.png"
          alt="CIVET.vet Screenshot"
          className="w-full h-full object-cover rounded-t-lg"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Contenido inferior - Con padding */}
      <div className="p-6 flex-1 flex flex-col text-center">
        <h3 className="text-xl font-plex-mono text-menta font-bold mb-3 group-hover:text-hueso transition-colors">
          El Replicador "Scherzo"
        </h3>
        <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-6">
          De Idea a plantilla funcional en 25 minutos. Diseños absurdamente locos e improvisados que son puro arte .
        </p>
        <button
          className="w-full border-2 border-menta text-menta py-3 font-plex-mono uppercase tracking-widest hover:bg-menta hover:text-noche transition-all duration-300 group-hover:shadow-lg group-hover:shadow-menta/20 mt-auto"
        >
          [ CREA TU WEB ]
        </button>
      </div>
    </motion.div>
  );
};

export default ScherzoCard;