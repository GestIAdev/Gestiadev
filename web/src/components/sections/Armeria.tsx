import BelascoCard from './armeria/BelascoCard';
import IAnarkalendarCard from './armeria/IAnarkalendarCard';
import BarChafyCard from './armeria/BarChafyCard';
import ScherzoCard from './armeria/ScherzoCard';
import MigracionCard from './armeria/MigracionCard';
import RedNomadaCard from './armeria/RedNomadaCard';
import { useMotionValue, useTransform, motion } from 'framer-motion';

interface ArmeriaProps {
  setActiveView: (view: string) => void;
}

const ProjectCard = ({ name, status, description, imageSrc }: { name: string, status: string, description: string, imageSrc?: string }) => {
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
      className="group relative h-[450px] bg-transparent backdrop-blur-sm rounded-lg border border-gris-trazado flex flex-col cursor-pointer"
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
    >
            {/* Screenshot central - Flush */}
      <div className="h-32">
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={`${name} Screenshot`}
            className="w-full h-full object-cover rounded-t-lg"
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <p className="text-gris-neutro font-plex-mono">{description}</p>
        )}
      </div>

      {/* Contenido inferior - Con padding */}
      <div className="p-6 flex-1 flex flex-col text-center">
        <h3 className="text-xl font-plex-mono text-menta font-bold mb-3 group-hover:text-hueso transition-colors">
          {name}
        </h3>
        <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-6">
          {status}
        </p>
      </div>
    </motion.div>
  );
};

const Armeria = ({ setActiveView }: ArmeriaProps) => {
  return (
    <section className="w-full max-w-[1100px] py-20">
      <h2 className="text-4xl font-plex-mono font-bold text-center mb-12">
        ## La Armería: Proyectos en Desarrollo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Primera tarjeta: BelascoCard - Nuestro Cebo Estratégico */}
        <BelascoCard setActiveView={setActiveView} />
        
        {/* Segunda tarjeta: BarChafy */}
        <BarChafyCard setActiveView={setActiveView} />
        
        {/* Tercera tarjeta: IAnarkalendar */}
        <IAnarkalendarCard setActiveView={setActiveView} />
        
        {/* Cuarta tarjeta: El Replicador Scherzo */}
        <ScherzoCard setActiveView={setActiveView} />
        
        {/* Quinta tarjeta: Migración 1-Click */}
        <MigracionCard setActiveView={setActiveView} />
        
        {/* Sexta tarjeta: La Red Nómada */}
        <RedNomadaCard setActiveView={setActiveView} />
      </div>
    </section>
  );
};

export default Armeria;
