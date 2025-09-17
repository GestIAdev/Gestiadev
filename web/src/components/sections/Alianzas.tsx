'use client';

import { motion } from 'framer-motion';

const Alianzas = () => {
  const recompensas = [
    {
      nivel: "NIVEL ALIADO",
      recompensa: "40% de descuento en Demos Web (Tipo Belasco)",
      doctrina: "Financia la rebelión y armamos tu proyecto personal con una 'Capilla Sixtina' a precio de coste.",
      color: "border-menta text-menta",
      hoverColor: "hover:border-menta hover:bg-menta/10"
    },
    {
      nivel: "NIVEL REBELDE",
      recompensa: "1 Año de Suscripción (SaaS Futuros)",
      doctrina: "Acceso completo Nivel 1 a Dentalsoft (o equivalentes) cuando se lance. Asegura tu arsenal antes que nadie.",
      color: "border-fucsia-neon text-fucsia-neon",
      hoverColor: "hover:border-fucsia-neon hover:bg-fucsia-neon/10"
    },
    {
      nivel: "NIVEL CÓNCLAVE",
      recompensa: "Suscripción Vitalicia (SaaS)",
      doctrina: "El Pacto de Sangre. Libertad total en nuestro ecosistema. Para siempre. (Plazas limitadas).",
      color: "border-hueso text-hueso",
      hoverColor: "hover:border-hueso hover:bg-hueso/10"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header del Holopad */}
      <div className="bg-noche/95 backdrop-blur-sm border border-gris-trazado rounded-lg mb-8">
        <div className="px-4 py-4 text-center">
          <h1 className="text-2xl font-plex-mono font-bold text-menta">
            ## LA LLAMADA A LA REBELIÓN (ALIANZAS FUNDADORES)
          </h1>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 py-8">
        {/* El Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-plex-mono font-bold mb-6 text-hueso">
            ### El 'establishment' del software es lento, caro y construye prisiones de datos
          </h2>
          <p className="text-xl text-gris-neutro max-w-4xl mx-auto leading-relaxed">
            Nosotros forjamos armas soberanas (Motor de Orquestación, Dentalsoft) para democratizar el código.
            Esta campaña (Kickstarter) es la financiación para el asalto final.
          </p>
        </motion.div>

        {/* Grid de Recompensas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {recompensas.map((item, index) => (
            <motion.div
              key={item.nivel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-noche/70 backdrop-blur-sm border ${item.color} rounded-lg p-6 hover:bg-noche/80 transition-all duration-300 ${item.hoverColor} group`}
            >
              <div className="text-center">
                <h3 className={`text-lg font-plex-mono font-bold mb-4 ${item.color.split(' ')[1]}`}>
                  [{item.nivel}]
                </h3>
                <h4 className="text-sm font-plex-sans font-semibold mb-4 text-hueso">
                  {item.recompensa}
                </h4>
                <p className="text-sm text-gris-neutro leading-relaxed">
                  {item.doctrina}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comando de Retorno */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="text-gris-neutro font-plex-mono text-sm">
            [ Usa el Navbar para navegar ]
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Alianzas;