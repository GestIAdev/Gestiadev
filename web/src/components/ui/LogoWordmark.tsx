import React from 'react';

interface LogoWordmarkProps {
  className?: string; // Para controlar tamaño (ej: 'text-2xl', 'text-lg')
}

/**
 * El Wordmark de GestIAdev (SPEC V2.0).
 * Requiere las clases de animación "glitch-text" y las variables
 * de color de globals.css.
 */
const LogoWordmark: React.FC<LogoWordmarkProps> = ({ className = 'text-2xl' }) => {
  return (
    <div 
      className={`relative font-bold tracking-widest glitch-text ${className}`}
      data-text="GestIAdev" // Esencial para que el CSS glitch funcione
    >
      <span>Punk</span>
      {/* El color de la "IA" se define inline usando la variable global */}
      <span style={{ color: 'var(--color-verde-fosforo)' }}>IA</span>
      <span>gest</span>
    </div>
  );
};

export default LogoWordmark;
