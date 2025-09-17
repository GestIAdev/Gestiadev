'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Brain, Check, MousePointer, ArrowLeft } from 'lucide-react';

interface ArmeriaMigracionDetalleProps {
  setActiveView: (view: string) => void;
}

const ArmeriaMigracionDetalle = ({ setActiveView }: ArmeriaMigracionDetalleProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Pasos del Wizard de Migración
  const wizardSteps = [
    {
      icon: Upload,
      title: 'UPLOAD',
      description: 'Arrastra tu archivo (CSV, Excel, SQL Dump). Nuestro motor lo encripta.',
      color: 'text-menta'
    },
    {
      icon: Brain,
      title: 'AI ANALYSIS',
      description: 'Nuestra IA (Cloude) analiza la estructura, detecta patrones (\'Nombre\' -> \'first_name\') y mapea el 95% de los campos automáticamente.',
      color: 'text-menta'
    },
    {
      icon: Check,
      title: 'PREVIEW',
      description: 'Te mostramos la vista previa: \'347 Pacientes Detectados ✅\'. Cero riesgo.',
      color: 'text-menta'
    },
    {
      icon: MousePointer,
      title: 'CLICK',
      description: 'Pulsas \'Migrar Ahora\'. En 5 minutos, tu nueva clínica está operativa. Cero esfuerzo humano (Raul effort = 0 minutes).',
      color: 'text-menta'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-plex-mono font-bold text-menta">
            ## DOCTRINA DE LIBERACIÓN (MIGRACIÓN 1-CLICK)
          </h1>
          <button
            onClick={() => setActiveView('armeria')}
            className="text-gris-neutro hover:text-menta transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 py-8">
        {/* El Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta mb-6">
            EL PITCH (QUÉ ES)
          </h2>
          <p className="text-xl text-hueso font-plex-sans leading-relaxed max-w-4xl mx-auto">
            "El 'establishment' te cobra €2.000 y tarda 4 semanas en migrar tus datos (mal). 
            Nosotros te migramos GRATIS en 5 minutos."
          </p>
        </motion.div>

        {/* El Arte: Wizard de 4 Pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta text-center mb-8">
            EL ARTE (CÓMO FUNCIONA)
          </h2>
          <p className="text-lg text-gris-neutro font-plex-sans text-center mb-12">
            El Wizard de 4 Pasos - Customer Experience Flow
          </p>

          {/* Grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {wizardSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-noche/50 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 hover:border-menta transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-menta/20 flex items-center justify-center"
                      animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                    >
                      <IconComponent size={24} className="text-menta" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-plex-mono font-bold text-menta">
                        PASO {index + 1}: {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-hueso leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* La Doctrina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta text-center mb-8">
            LA DOCTRINA (EL REALISMO ANTI-HUMO)
          </h2>
          <div className="bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-8 max-w-4xl mx-auto">
            <p className="text-lg text-hueso font-plex-sans leading-relaxed">
              Nuestra Doctrina Anti-Humo: Este "Smart Migration Engine" se aplica a archivos digitales. 
              El 95% de estos casos son automáticos (Escenario A). Para migraciones complejas 
              ('lápiz y papel' o bases de datos corruptas), aplicamos intervención manual (Escenario C), 
              reduciendo el trabajo de semanas a horas.
            </p>
          </div>
        </motion.div>

        {/* Comando de Retorno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView('armeria')}
            className="px-8 py-4 bg-menta text-noche font-plex-mono font-bold text-lg uppercase tracking-widest border-2 border-menta hover:bg-transparent hover:text-menta transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowLeft size={24} />
            [ &lt; VOLVER A LA ARMERÍA ]
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ArmeriaMigracionDetalle;