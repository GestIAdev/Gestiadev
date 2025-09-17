'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, FileText, Cpu, ChevronLeft, ChevronRight, Stethoscope, Receipt, Brain, BarChart3 } from 'lucide-react';
import Lightbox from '@/components/ui/Lightbox';

const HolopadLaReina = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeTab, setActiveTab] = useState<'power' | 'goal'>('power');

  // Lista de imágenes del carrusel - IMÁGENES REALES DE DEMOSTRACIÓN
  const carouselImages = [
    '/assets/dentiagest/dashboard.png',
    '/assets/dentiagest/formulariopatient.png',
    '/assets/dentiagest/formulariocitas.png',
    '/assets/dentiagest/Kalendardiaria.png',
    '/assets/dentiagest/kalendarsemanal.png',
    '/assets/dentiagest/kalendarmes.png',
    '/assets/dentiagest/patientdetail.png',
    '/assets/dentiagest/dentlegal.png',
    '/assets/dentiagest/filemanagement.png',
    '/assets/dentiagest/2fa.png'
  ];

  // Auto-rotación del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Módulos Forjados (70% - Prueba de Poder)
  const forgedModules = [
    {
      title: 'Gestión Total (Pacientes y Citas)',
      icon: Users,
      summary: 'Módulo CRUD 100% completo, listo para producción, con gestión avanzada de pacientes e historial.',
      status: '100% Completo'
    },
    {
      title: 'Seguridad Nivel Espacial (2FA)',
      icon: Shield,
      summary: 'Autenticación de dos factores y Gestión de Roles (RBAC) 100% completa. Una fortaleza digital soberana.',
      status: '100% Completo'
    },
    {
      title: 'Documentos Cyberpunk (Módulo Legal)',
      icon: FileText,
      summary: 'Sistema único de 5 pestañas con detección de pacientes por IA y almacenamiento legal imprimible.',
      status: '100% Completo'
    },
    {
      title: 'Arsenal Soberano Integrado',
      icon: Cpu,
      summary: 'Impulsado por nuestro Motor de Orquestación (API de 133KB) y nuestro motor IAnarkalendar (0-dependencias).',
      status: '100% Completo'
    }
  ];

  // Módulos Objetivo (30% - Kickstarter)
  const goalModules = [
    {
      title: 'Tratamientos Avanzados',
      icon: Stethoscope,
      summary: 'Sistema completo de tratamientos dentales con IA predictiva y protocolos automatizados.',
      status: 'En Desarrollo'
    },
    {
      title: 'Facturación Inteligente',
      icon: Receipt,
      summary: 'Motor de facturación automática con integración de seguros y pagos electrónicos.',
      status: 'Planificación'
    },
    {
      title: 'IA Avanzada',
      icon: Brain,
      summary: 'Sistema de IA para diagnóstico asistido, predicción de tratamientos y análisis predictivo.',
      status: 'Concepto'
    },
    {
      title: 'Dashboard Analítico',
      icon: BarChart3,
      summary: 'Panel de control completo con métricas en tiempo real, reportes avanzados y BI integrada.',
      status: 'Diseño'
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-4">
      {/* Título Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-plex-mono font-bold text-menta mb-4">
          ## Holopad "La Reina" - Dentalsoft V6
        </h1>
        <p className="text-lg md:text-xl text-gris-neutro font-plex-sans">
          Arquitectura "Hollyshit" - Sistema Tabulado Interactivo
        </p>
      </motion.div>

      {/* Carrusel de Combate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mb-16 bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg overflow-hidden"
      >
        <div className="relative h-64 md:h-96">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={carouselImages[currentImageIndex]}
              alt={`Dentalsoft Screenshot ${currentImageIndex + 1}`}
              className="w-full h-full object-contain cursor-pointer"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                setLightboxImage(carouselImages[currentImageIndex]);
                setLightboxOpen(true);
              }}
            />
          </AnimatePresence>

          {/* Indicadores del carrusel */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-menta shadow-lg shadow-menta/50'
                    : 'bg-gris-trazado hover:bg-menta/50'
                }`}
              />
            ))}
          </div>

          {/* Controles del carrusel */}
          <button
            onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? carouselImages.length - 1 : currentImageIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-noche/80 text-menta p-2 rounded-full hover:bg-menta hover:text-noche transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentImageIndex(currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-noche/80 text-menta p-2 rounded-full hover:bg-menta hover:text-noche transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </motion.div>

      {/* Sistema de Tabs - El Santuario Interno */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8"
      >
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('power')}
              className={`px-4 py-2 md:px-6 md:py-3 font-plex-mono text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${
                activeTab === 'power'
                  ? 'bg-menta text-noche shadow-lg'
                  : 'text-gris-trazado hover:text-menta hover:bg-menta/10'
              }`}
            >
              [ ## PRUEBA DE PODER (70%) ]
            </button>
            <button
              onClick={() => setActiveTab('goal')}
              className={`px-4 py-2 md:px-6 md:py-3 font-plex-mono text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${
                activeTab === 'goal'
                  ? 'bg-fucsia-neon text-noche shadow-lg'
                  : 'text-gris-trazado hover:text-fucsia-neon hover:bg-fucsia-neon/10'
              }`}
            >
              [ ## OBJETIVO KICKSTARTER (30%) ]
            </button>
          </div>
        </div>

        {/* Grid Dinámico - El Lienzo Interno */}
        <AnimatePresence mode="wait">
          {activeTab === 'power' ? (
            <motion.div
              key="power-grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {forgedModules.map((module, index) => (
                <motion.div
                  key={`forged-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg p-6 hover:border-menta transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Título con Icono Soberano */}
                  <div className="flex items-center gap-3 mb-4">
                    <module.icon size={48} className="text-menta group-hover:text-hueso transition-colors flex-shrink-0" />
                    <h3 className="text-2xl font-plex-mono font-bold text-menta group-hover:text-hueso transition-colors">
                      {module.title}
                    </h3>
                  </div>

                  <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-4 flex-grow">
                    {module.summary}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-menta font-plex-mono text-sm font-bold">
                      {module.status}
                    </span>
                    <div className="w-24 h-2 bg-gris-trazado rounded-full overflow-hidden">
                      <div className="w-full h-full bg-menta rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="goal-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {goalModules.map((module, index) => (
                <motion.div
                  key={`goal-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg p-6 hover:border-fucsia-neon transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Título con Icono Soberano */}
                  <div className="flex items-center gap-3 mb-4">
                    <module.icon size={48} className="text-fucsia-neon group-hover:text-hueso transition-colors flex-shrink-0" />
                    <h3 className="text-2xl font-plex-mono font-bold text-fucsia-neon group-hover:text-hueso transition-colors">
                      {module.title}
                    </h3>
                  </div>

                  <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-4 flex-grow">
                    {module.summary}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-fucsia-neon font-plex-mono text-sm font-bold">
                      {module.status}
                    </span>
                    <div className="w-24 h-2 bg-gris-trazado rounded-full overflow-hidden">
                      <div className="w-16 h-full bg-fucsia-neon rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Misión Kickstarter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="text-center bg-transparent backdrop-blur-sm border border-gris-trazado rounded-lg p-8"
      >
        <h2 className="text-2xl md:text-3xl font-plex-mono font-bold text-menta mb-6">
          ## Misión Kickstarter: La Dominación Total
        </h2>
        <p className="text-base md:text-lg text-gris-neutro font-plex-sans leading-relaxed max-w-4xl mx-auto">
          Este imperio (70% completo) necesita los 4 módulos finales (Tratamientos, Facturación, IA Avanzada y Dashboard Analítico) para la dominación total.
          <br /><br />
          <span className="text-menta font-bold">Únete a la rebelión.</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 md:px-8 md:py-4 bg-menta text-noche font-plex-mono font-bold text-base md:text-lg uppercase tracking-widest border-2 border-menta hover:bg-transparent hover:text-menta transition-all duration-300"
        >
          [ Iniciar Campaña Kickstarter ]
        </motion.button>
      </motion.div>

      {/* Lightbox para ampliación de imágenes */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={lightboxImage}
        alt="Dentalsoft Screenshot Ampliada"
      />
    </section>
  );
};

export default HolopadLaReina;