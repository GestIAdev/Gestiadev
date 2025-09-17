'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Youtube, ArrowLeft } from 'lucide-react';

interface ArmeriaRedNomadaDetalleProps {
  setActiveView: (view: string) => void;
}

const ArmeriaRedNomadaDetalle = ({ setActiveView }: ArmeriaRedNomadaDetalleProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Features del Manifiesto con Visuales
  const manifestoFeatures = [
    {
      visual: '/blogeditor.png',
      title: 'Editor Custom (Anti-Blogger)',
      description: 'Nuestro editor de blogs 100% custom con MediaGallery, SEO, y diseño de contenido por componentes.',
      color: 'text-menta'
    },
    {
      visual: '/forodebate.png',
      title: 'Foros Libres (Anti-Facebook)',
      description: 'Nuestra plataforma de comunidad para el debate libre y la base de nuestro feed meritocrático.',
      color: 'text-menta'
    },
    {
      icon: TrendingUp,
      title: 'Feed Anti-Algoritmo',
      description: 'Cero algoritmos "corpo". El contenido mejor valorado por los usuarios (de blogs, foros) obtiene más visibilidad.',
      color: 'text-menta'
    },
    {
      icon: Youtube,
      title: 'Vídeo Soberano (Anti-YouTube)',
      description: 'Reproductor de vídeo 100% custom. Sin anuncios de terceros. Los creadores se financian con esponsorización directa (viajes gratis).',
      color: 'text-menta'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-plex-mono font-bold text-menta">
            ## LA RED NÓMADA (EL MANIFIESTO ANTI-SISTEMA)
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
        {/* QUÉ ES (El Pitch) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta mb-6">
            QUÉ ES (EL PITCH)
          </h2>
          <p className="text-xl text-hueso font-plex-sans leading-relaxed max-w-4xl mx-auto">
            "El 'establishment' te pide 4.500$ por un clon de Facebook. Nosotros forjamos una red social 
            soberana, gratuita y meritocrática por la Causa."
          </p>
        </motion.div>

        {/* El Arte: Grid de Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta text-center mb-8">
            PRUEBA VISUAL (LA GALERÍA FUSIONADA)
          </h2>
          <p className="text-lg text-gris-neutro font-plex-sans text-center mb-12">
            Grid 2x2 - La Arquitectura de la Libertad Digital
          </p>

          {/* Grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {manifestoFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              
              // Layout diferente para tarjetas con screenshots (índices 0 y 1)
              if (index < 2 && feature.visual) {
                return (
                  <motion.div
                    key={index}
                    className="bg-noche/50 backdrop-blur-sm border border-gris-trazado rounded-lg overflow-hidden hover:border-menta transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    {/* Imagen completa arriba */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={feature.visual}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Contenido abajo */}
                    <div className="p-6">
                      <h3 className="text-xl font-plex-mono font-bold text-menta mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-hueso leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              }
              
              // Layout original para tarjetas con iconos (índices 2 y 3)
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
                      className="w-12 h-12 rounded-full bg-menta/20 flex items-center justify-center overflow-hidden"
                      animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                    >
                      {feature.visual ? (
                        <img
                          src={feature.visual}
                          alt={feature.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        IconComponent && <IconComponent size={24} className="text-menta" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-plex-mono font-bold text-menta">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-hueso leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Por Qué Gana */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-plex-mono font-bold text-menta text-center mb-8">
            POR QUÉ GANA
          </h2>
          <div className="bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-8 max-w-4xl mx-auto">
            <p className="text-lg text-hueso font-plex-sans leading-relaxed text-center">
              "La prueba de que nuestra arquitectura (el Cónclave) puede forjar en meses lo que el 
              establishment cree imposible."
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

export default ArmeriaRedNomadaDetalle;