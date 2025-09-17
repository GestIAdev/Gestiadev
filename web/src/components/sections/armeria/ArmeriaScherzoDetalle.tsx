'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, DraftingCompass, TerminalSquare, Play } from 'lucide-react';

interface ArmeriaScherzoDetalleProps {
  setActiveView: (view: string) => void;
}

const ArmeriaScherzoDetalle = ({ setActiveView }: ArmeriaScherzoDetalleProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Pasos del Scherzo
  const scherzoSteps = [
    {
      time: '00:00',
      icon: BrainCircuit,
      title: 'EL VISIONARIO',
      subtitle: '(18 Minutos)',
      description: 'La Reina define el "Porqué". 18 minutos de especificaciones y doctrina.',
      color: 'text-menta'
    },
    {
      time: '18:01',
      icon: DraftingCompass,
      title: 'EL ARQUITECTO',
      subtitle: '(1 Minuto)',
      description: 'El Arquitecto/Humano traduce la visión a planos (Arquitectura, Stack tecnologico, Workflow, diseño visual..., DB Specs, UI).',
      color: 'text-menta'
    },
    {
      time: '19:01',
      icon: TerminalSquare,
      title: 'EL EJECUTOR',
      subtitle: '(6 Minutos)',
      description: 'El Ejecutor forja el acero. 6 minutos de código. Despliegue automático.',
      color: 'text-menta'
    }
  ];

  // Auto-play de la línea de tiempo
  useEffect(() => {
    if (currentStep < scherzoSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000); // 2 segundos por paso

      return () => clearTimeout(timer);
    } else {
      // Mostrar resultado después del último paso
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }
  }, [currentStep]);

  const handleLoadDemo = () => {
    setActiveView('demo-cyberpunkvet');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-plex-mono font-bold text-menta">
            ## LA GUERRA RELÁMPAGO: CÓMO FORJAMOS UNA PLANTILLA SENCILLA EN 24 MINUTOS
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
        {/* Línea de Tiempo Animada */}
        <div className="relative mb-16">
          {/* Línea base */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gris-trazado rounded-full"></div>

          {/* Línea de progreso animada */}
          <motion.div
            className="absolute top-8 left-0 h-1 bg-menta rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / scherzoSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          {/* Pasos */}
          <div className="relative flex justify-between">
            {scherzoSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center w-1/3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isActive ? 1 : 0.3, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Círculo del paso */}
                  <motion.div
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 ${
                      isActive
                        ? 'border-menta bg-menta/20'
                        : 'border-gris-trazado bg-transparent'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                  >
                    <IconComponent
                      size={32}
                      className={isActive ? 'text-menta' : 'text-gris-trazado'}
                    />
                  </motion.div>

                  {/* Contenido del paso */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                      >
                        <div className="text-sm font-plex-mono text-gris-neutro mb-1">
                          [MINUTO {step.time}]
                        </div>
                        <h3 className="text-xl font-plex-mono font-bold text-menta mb-2">
                          PASO {index + 1}: {step.title}
                        </h3>
                        <div className="text-sm font-plex-mono text-gris-neutro mb-2">
                          {step.subtitle}
                        </div>
                        <p className="text-sm text-hueso leading-relaxed max-w-xs">
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Resultado Final */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-plex-mono font-bold text-menta mb-4"
              >
                [MINUTO 25:00] → RESULTADO: VICTORIA TOTAL
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conclusión */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-12"
            >
              <div className="bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-3xl font-plex-mono font-bold text-menta mb-6">
                  TIEMPO TOTAL DEL SCHERZO: 24 MINUTOS
                </h2>
                <p className="text-lg text-gris-neutro font-plex-sans mb-6">
                  (Más rápido que desplegar una plantilla de WordPress)
                </p>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadDemo}
                  className="px-8 py-4 bg-menta text-noche font-plex-mono font-bold text-lg uppercase tracking-widest border-2 border-menta hover:bg-transparent hover:text-menta transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Play size={24} />
                  VER EL ACERO FORJADO (CARGAR DEMO CIVET.VET)
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArmeriaScherzoDetalle;