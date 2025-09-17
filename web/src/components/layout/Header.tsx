"use client";

import type { View } from '@/app/page';
import LogoWordmark from '@/components/ui/LogoWordmark';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header = ({ activeView, setActiveView }: HeaderProps) => {
  // Comandos Internos del Templo (Centro)
  const templeCommands = [
    { view: "hero" as View, text: "Visión" },
    { view: "arsenal" as View, text: "Arsenal" },
    { view: "armeria" as View, text: "Armería" },
    { view: "fundador" as View, text: "Fundador" },
    { view: "alianzas" as View, text: "Alianzas" },
  ];

  // CTAs de Asedio (Derecha)
  const ctaCommands = [
    { view: "contacto" as View, text: "Contacto", style: "outline" },
    { view: "holopad-la-reina" as View, text: "Dentalsoft", style: "solid" },
  ];

  const handleNavClick = (view: View) => {
    setActiveView(view);
  };

  return (
    <>
      <header className="w-full border-b border-gris-trazado z-50 sticky top-0 bg-noche/80">
        <div className="max-w-[1100px] mx-auto py-3 px-4">
          {/* MÓVIL: Layout vertical apilado */}
          <div className="flex flex-col gap-4 md:hidden">
            {/* Logo centrado arriba */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <LogoWordmark className="text-base" />
              </div>
            </div>
            
            {/* Navegación centrada */}
            <nav className="flex flex-wrap justify-center gap-4 font-plex-sans text-sm">
              {templeCommands.map((cmd) => (
                <button 
                  key={cmd.view} 
                  onClick={() => handleNavClick(cmd.view)} 
                  className={`bg-transparent border-none p-2 hover:text-menta transition-colors ${
                    activeView === cmd.view ? 'text-menta' : 'text-hueso'
                  }`}
                >
                  {cmd.text}
                </button>
              ))}
            </nav>

            {/* CTAs centrados abajo */}
            <div className="flex justify-center gap-3">
              {ctaCommands.map((cmd) => (
                <button
                  key={cmd.view}
                  onClick={() => handleNavClick(cmd.view)}
                  className={`px-3 py-2 font-plex-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                    cmd.style === 'outline'
                      ? 'border border-menta text-menta hover:bg-menta/10'
                      : 'bg-menta text-noche hover:bg-hueso'
                  }`}
                >
                  {cmd.text}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP: Layout horizontal original */}
          <div className="hidden md:flex justify-between items-center">
            {/* IZQUIERDA: Logo Wordmark */}
            <div className="flex items-center gap-2">
              <LogoWordmark className="text-lg" />
            </div>
            
            {/* CENTRO: Comandos Internos del Templo */}
            <nav className="flex gap-8 font-plex-sans text-sm">
              {templeCommands.map((cmd) => (
                <button 
                  key={cmd.view} 
                  onClick={() => handleNavClick(cmd.view)} 
                  className={`bg-transparent border-none p-0 hover:text-menta transition-colors ${
                    activeView === cmd.view ? 'text-menta' : 'text-hueso'
                  }`}
                >
                  {cmd.text}
                </button>
              ))}
            </nav>

            {/* DERECHA: CTAs de Asedio */}
            <div className="flex gap-4">
              {ctaCommands.map((cmd) => (
                <button
                  key={cmd.view}
                  onClick={() => handleNavClick(cmd.view)}
                  className={`px-4 py-2 font-plex-mono text-sm uppercase tracking-widest transition-all duration-300 ${
                    cmd.style === 'outline'
                      ? 'border border-menta text-menta hover:bg-menta/10'
                      : 'bg-menta text-noche hover:bg-hueso'
                  }`}
                >
                  {cmd.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;