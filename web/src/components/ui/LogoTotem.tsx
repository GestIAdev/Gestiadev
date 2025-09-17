
// components/ui/LogoTotem.tsx (Plano Definitivo V4)

import React from 'react';

interface LogoTotemProps {
  className?: string;
  onClick?: () => void; // Mantenemos el prop onClick (de tu archivo V2)
}

/**
 * El Tótem del Cónclave (V4 - Crop Quirúrgico).
 * Plano del Arquitecto (Turno 154) fusionado con Props (Turno 155).
 * Creado por Gemini (Arquitecto) y Jennifer (Reina).
 */
const LogoTotem: React.FC<LogoTotemProps> = ({ className, onClick, ...props }) => {
  return (
    <svg
      /* * EL FIX (Turno 154): El ViewBox ahora es un crop 30x35 (X:35-65, Y:10-45).
       * Esto elimina todos los "márgenes internos".
       */
      viewBox="32 7 36 41"
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`} // Mantenemos la lógica del cursor
      aria-hidden="true"
      onClick={onClick} // Mantenemos el handler
      {...props}
    >
      <g
        strokeWidth="6"
        stroke="var(--color-hueso)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        /* EL FIX (Turno 154): El transform="translate(0, 25)" ha sido PURGADO. */
      >
        {/* Geometría Original (sin translación) */}
        <rect x="35" y="20" width="30" height="25" rx="5" />
        <rect
          x="42"
          y="28"
          width="16"
          height="5"
          fill="var(--color-verde-fosforo)"
          stroke="none"
          className="cursor-ojo"
        />
        <path
          d="M 45 10 L 50 25 L 55 10 Z"
          fill="var(--color-fucsia-neon)"
          stroke="none"
        />
      </g>
    </svg>
  );
};

export default LogoTotem;
