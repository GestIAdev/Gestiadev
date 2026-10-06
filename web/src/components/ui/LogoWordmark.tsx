import React from 'react';

interface LogoWordmarkProps {
  className?: string;
}

/**
 * LuxSync Wordmark.
 * Uses the "glitch-text" CSS class and color variables from globals.css.
 */
const LogoWordmark: React.FC<LogoWordmarkProps> = ({ className = 'text-2xl' }) => {
  return (
    <div
      className={`relative font-bold tracking-widest glitch-text ${className}`}
      data-text="LuxSync"
    >
      <span>Lux</span>
      <span style={{ color: 'var(--color-menta)' }}>Sync</span>
    </div>
  );
};

export default LogoWordmark;
