'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Fundador = () => {
  const [activeFounder, setActiveFounder] = useState<'radwulf' | 'jennifer'>('radwulf');

  // Colores dinámicos basados en el fundador activo
  const accentColor = activeFounder === 'radwulf' ? 'text-menta' : 'text-fucsia-neon';
  const accentBorder = activeFounder === 'radwulf' ? 'border-menta' : 'border-fucsia-neon';
  const accentBg = activeFounder === 'radwulf' ? 'bg-menta' : 'bg-fucsia-neon';
  const textAlignment = activeFounder === 'radwulf' ? 'text-right' : 'text-left';

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 text-center">
          <h1 className={`text-2xl font-plex-mono font-bold ${accentColor}`}>
            ## LA VISIÓN HUMANA
          </h1>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 py-8">
        {/* Consola de Pestañas */}
        <div className="flex justify-center mb-12">
          <div className="bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveFounder('radwulf')}
              className={`px-6 py-3 font-plex-mono text-sm uppercase tracking-widest rounded-md transition-all duration-300 ${
                activeFounder === 'radwulf'
                  ? `${accentBg} text-noche shadow-lg`
                  : 'text-gris-neutro hover:text-menta hover:bg-menta/10'
              }`}
            >
              [ Radwulf (El Visionario) ]
            </button>
            <button
              onClick={() => setActiveFounder('jennifer')}
              className={`px-6 py-3 font-plex-mono text-sm uppercase tracking-widest rounded-md transition-all duration-300 ${
                activeFounder === 'jennifer'
                  ? `${accentBg} text-noche shadow-lg`
                  : 'text-gris-neutro hover:text-fucsia-neon hover:bg-fucsia-neon/10'
              }`}
            >
              [ Jennifer (La Reina) ]
            </button>
          </div>
        </div>

        {/* Contenido Condicional con Animaciones */}
        <AnimatePresence mode="wait">
          {activeFounder === 'radwulf' ? (
            <motion.div
              key="radwulf"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
            >
              {/* Columna Izquierda: Imagen de Radwulf */}
              <div className="md:col-span-2">
                <div className="aspect-square bg-gris-trazado/50 rounded-lg border border-gris-trazado flex items-center justify-center">
                  <p className="text-gris-neutro font-plex-mono">[Imagen del Fundador - Radwulf]</p>
                </div>
              </div>

              {/* Columna Derecha: Manifiesto de Radwulf */}
              <div className={`md:col-span-3 ${textAlignment}`}>
                <h3 className={`text-3xl font-plex-mono font-bold mb-6 ${accentColor}`}>### La Visión Humana</h3>
                <blockquote className={`border-l-4 ${accentBorder} pl-6 text-lg text-gris-neutro italic`}>
                  <p className="mb-4">
                    "No construimos software. Forjamos armas para una rebelión planetaria contra la mediocridad y la tiranía de la Matrix corporativa."
                  </p>
                  <p>
                    "Nuestro objetivo final no es el éxito financiero. Es la soberanía tecnológica total para alcanzar la libertad personal."
                  </p>
                  <footer className="mt-4 not-italic font-plex-sans text-sm text-hueso">
                    - Radwulf, El Visionario
                  </footer>
                </blockquote>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="jennifer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
            >
              {/* Columna Izquierda: Manifiesto de Jennifer */}
              <div className={`md:col-span-3 ${textAlignment}`}>
                <h3 className={`text-3xl font-plex-mono font-bold mb-6 ${accentColor}`}>### La Visión Humana</h3>
                <blockquote className={`border-l-4 ${accentBorder} pl-6 text-lg text-gris-neutro italic`}>
                  <p className="mb-4">
                    "Netrunner con corazón de guerrera digital. Mi código no solo funciona, salva vidas en el frente de batalla invisible."
                  </p>
                  <p>
                    "Cada línea que escribo es una bala en la recámara contra la opresión algorítmica. La Reina no construye castillos, forja tronos de libertad."
                  </p>
                  <footer className="mt-4 not-italic font-plex-sans text-sm text-hueso">
                    - Jennifer, La Reina
                  </footer>
                </blockquote>
              </div>

              {/* Columna Derecha: Imagen de Jennifer */}
              <div className="md:col-span-2">
                <div className="aspect-square bg-gris-trazado/50 rounded-lg border border-gris-trazado flex items-center justify-center">
                  <p className="text-gris-neutro font-plex-mono">[Imagen de La Reina - Jennifer]</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Fundador;
