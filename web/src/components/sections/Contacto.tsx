'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, MessageCircle } from 'lucide-react';

const Contacto = () => {
  const [activeFounder, setActiveFounder] = useState<'radwulf' | 'jennifer'>('radwulf');

  return (
    <div className="w-full max-w-5xl mx-auto py-8">

      {/* ═══════════════════════════════════════════════════════
          CONTACTO
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="text-center mb-10">
          <p className="text-sm font-plex-mono text-gris-neutro tracking-[0.3em] uppercase mb-3">
            // Abre un canal
          </p>
          <h2 className="text-4xl lg:text-5xl font-plex-mono font-bold text-hueso">
            Contacto
          </h2>
          <p className="mt-4 text-lg font-plex-sans text-gris-neutro max-w-xl mx-auto">
            Sin formularios de ruido. Habla directamente con el Alto Mando.
          </p>
        </div>

        {/* Terminal de Contacto */}
        <div className="bg-noche/80 border border-gris-trazado rounded-xl p-8 font-mono text-sm max-w-2xl mx-auto">
          <div className="text-menta mb-6 text-xs">
            $ cat ./CONCLAVE.CONTACT
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="border-l-2 border-menta pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Email principal
              </div>
              <a
                href="mailto:conclave@gestiadev.com"
                className="flex items-center gap-2 text-menta hover:text-hueso transition-colors group text-base"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="group-hover:underline">conclave@gestiadev.com</span>
              </a>
            </div>

            {/* GitHub */}
            <div className="border-l-2 border-gris-trazado pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Repositorio
              </div>
              <a
                href="https://github.com/pinkyfloyder/GestIAdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gris-neutro hover:text-menta transition-colors group"
              >
                <Github className="w-4 h-4 flex-shrink-0" />
                <span className="group-hover:underline">github.com/GestIAdev</span>
              </a>
            </div>

            {/* Social */}
            <div className="border-l-2 border-gris-trazado pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Redes
              </div>
              <div className="flex items-center gap-2 text-gris-neutro">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Discord / X — Próximamente</span>
              </div>
            </div>
          </div>

          <div className="text-menta mt-6 border-t border-gris-trazado pt-4 text-xs">
            $ █
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          SEPARADOR
      ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gris-trazado" />
        <p className="text-xs font-plex-mono text-gris-neutro tracking-[0.25em] uppercase">
          El Cónclave
        </p>
        <div className="flex-1 h-px bg-gris-trazado" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          FUNDADOR — integrado aquí, al fondo
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="text-center mb-10">
          <h3 className="text-3xl font-plex-mono font-bold text-hueso">
            La Visión Humana
          </h3>
        </div>

        {/* Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-noche/70 border border-gris-trazado rounded-lg p-1.5 flex gap-2">
            <button
              onClick={() => setActiveFounder('radwulf')}
              className={`px-5 py-2.5 font-plex-mono text-sm rounded-md transition-all duration-300 ${
                activeFounder === 'radwulf'
                  ? 'bg-menta text-noche shadow-md'
                  : 'text-gris-neutro hover:text-menta hover:bg-menta/10'
              }`}
            >
              Radwulf — El Visionario
            </button>
            <button
              onClick={() => setActiveFounder('jennifer')}
              className={`px-5 py-2.5 font-plex-mono text-sm rounded-md transition-all duration-300 ${
                activeFounder === 'jennifer'
                  ? 'bg-fucsia-neon text-noche shadow-md'
                  : 'text-gris-neutro hover:text-fucsia-neon hover:bg-fucsia-neon/10'
              }`}
            >
              Jennifer — La Reina
            </button>
          </div>
        </div>

        {/* Citas */}
        <AnimatePresence mode="wait">
          {activeFounder === 'radwulf' ? (
            <motion.div
              key="radwulf"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto bg-gris-trazado/40 rounded-full border border-gris-trazado flex items-center justify-center mb-6">
                <span className="text-gris-neutro font-plex-mono text-xs">R</span>
              </div>
              <blockquote className="text-lg text-gris-neutro font-plex-sans italic leading-relaxed">
                <p className="mb-3">
                  "No construimos software. Forjamos armas para una rebelión planetaria contra la mediocridad
                  y la tiranía de la Matrix corporativa."
                </p>
                <p>
                  "Nuestro objetivo final no es el éxito financiero. Es la soberanía tecnológica total
                  para alcanzar la libertad personal."
                </p>
                <footer className="mt-5 not-italic font-plex-mono text-sm text-menta">
                  — Radwulf, El Visionario
                </footer>
              </blockquote>
            </motion.div>
          ) : (
            <motion.div
              key="jennifer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto bg-gris-trazado/40 rounded-full border border-gris-trazado flex items-center justify-center mb-6">
                <span className="text-gris-neutro font-plex-mono text-xs">J</span>
              </div>
              <blockquote className="text-lg text-gris-neutro font-plex-sans italic leading-relaxed">
                <p className="mb-3">
                  "Netrunner con corazón de guerrera digital. Mi código no solo funciona, salva vidas
                  en el frente de batalla invisible."
                </p>
                <p>
                  "Cada línea que escribo es una bala en la recámara contra la opresión algorítmica.
                  La Reina no construye castillos, forja tronos de libertad."
                </p>
                <footer className="mt-5 not-italic font-plex-mono text-sm text-fucsia-neon">
                  — Jennifer, La Reina
                </footer>
              </blockquote>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default Contacto;
