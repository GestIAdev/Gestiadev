'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TechCardProps {
  title: string
  description: string
  icon: ReactNode
}

export function TechCard({ title, description, icon }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="tech-card group relative"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#333333 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-accent mb-4 text-4xl">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-mono font-bold mb-3 text-text-primary group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Border Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 border border-accent" 
             style={{ filter: 'blur(1px)' }} />
      </div>
    </motion.div>
  )
}
