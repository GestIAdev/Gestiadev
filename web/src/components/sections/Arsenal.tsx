'use client'

import { TechCard } from '@/components/ui/TechCard'
import { motion } from 'framer-motion'

// Vamos a usar React Icons para los iconos por ahora
// Más tarde podemos cambiarlos por SVGs personalizados si quieres
const technologies = [
  {
    title: 'Motor Apollo Nuclear',
  description: 'El sistema nervioso central de nuestras aplicaciones. Una API centralizada y de alto rendimiento que ha demostrado ser más rápida y eficiente que las implementaciones estándar. Velocidad, seguridad y escalabilidad en un núcleo de 133KB.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Framework Digital Fortress',
  description: 'Seguridad de nivel empresarial como punto de partida, no como un extra. Con auditoría inmutable, RBAC granular y diseñado para cumplir con GDPR y la futura AI Act, construimos fortalezas digitales, no solo aplicaciones.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    title: 'Metodología IA-Punk',
  description: 'No usamos la IA como una herramienta. Colaboramos con ella como un compañero creativo. Liberamos su potencial para que improvise y descubra soluciones que la lógica humana lineal a menudo pasa por alto. Es nuestra ventaja injusta.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
]

export function Arsenal() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <section id="arsenal" className="min-h-screen flex items-center py-20 px-4">
      <div className="max-w-[1100px] w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">
            Nuestro Arsenal: Tecnología Forjada, no Ensamblada.
          </h2>
          <div className="w-24 h-1 bg-[#00F2A9] mx-auto mb-6" />
          <p className="text-[#888888] max-w-2xl mx-auto">
            No creemos en apilar herramientas de terceros. Creemos en construir desde los
            cimientos. Cada pieza de nuestra arquitectura está diseñada con un propósito:
            ser un orden de magnitud superior. Esto no es solo software, es ingeniería de élite.
          </p>
        </motion.div>

        {/* Tech Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {technologies.map((tech, index) => (
            <TechCard
              key={index}
              title={tech.title}
              description={tech.description}
              icon={tech.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
