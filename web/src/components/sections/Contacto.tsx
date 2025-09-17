'use client';

import { motion } from 'framer-motion';
import { Mail, Github, MessageCircle } from 'lucide-react';

const Contacto = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 text-center">
          <h1 className="text-2xl font-plex-mono font-bold text-fucsia-neon">
            ## CONTACTO CON EL CÓNCLAVE
          </h1>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 py-8">
        {/* La Filosofía */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-plex-mono font-bold mb-6 text-hueso">
            ### El Vector de Entrada
          </h2>
          <p className="text-xl text-gris-neutro max-w-4xl mx-auto leading-relaxed">
            No usamos formularios de 'ruido'. Habla directamente con el Alto Mando.
          </p>
        </motion.div>

        {/* Terminal de Contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-noche/90 backdrop-blur-sm border border-gris-trazado rounded-lg p-8 font-mono text-sm"
        >
          <div className="text-menta mb-4">
            $ cat ./CONCLAVE.CONTACT
          </div>

          <div className="space-y-6">
            {/* Vector Principal */}
            <div className="border-l-2 border-menta pl-4">
              <div className="text-hueso font-semibold mb-2">
                &gt; VECTOR_PRINCIPAL (Alianzas / Kickstarter):
              </div>
              <a
                href="mailto:conclave@gestiadev.com"
                className="flex items-center gap-2 text-fucsia-neon hover:text-hueso transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="group-hover:underline">[ Cargar Enlace Mailto: conclave@gestiadev.com ]</span>
              </a>
            </div>

            {/* Vector Secundario */}
            <div className="border-l-2 border-fucsia-neon pl-4">
              <div className="text-hueso font-semibold mb-2">
                &gt; VECTOR_SECUNDARIO (Inteligencia / Devs):
              </div>
              <a
                href="https://github.com/pinkyfloyder/GestIAdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-menta hover:text-hueso transition-colors group"
              >
                <Github className="w-4 h-4" />
                <span className="group-hover:underline">[ Cargar Repositorio: GitHub (Nuestra Vitrina) ]</span>
              </a>
            </div>

            {/* Vector Social */}
            <div className="border-l-2 border-hueso pl-4">
              <div className="text-hueso font-semibold mb-2">
                &gt; VECTOR_SOCIAL (Propaganda):
              </div>
              <div className="flex items-center gap-2 text-gris-neutro">
                <MessageCircle className="w-4 h-4" />
                <span>[ Canal: (Próximamente - Discord/Twitter/Etc) ]</span>
              </div>
            </div>
          </div>

          <div className="text-menta mt-6 border-t border-gris-trazado pt-4">
            $ █
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacto;
