"use client";

import type { View } from '@/app/page';
import LogoWordmark from '@/components/ui/LogoWordmark';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header = ({ activeView, setActiveView }: HeaderProps) => {
  // Nav principal — izquierda/centro
  const navLinks = [
    { view: "hero" as View, text: "Visión" },
    { view: "arsenal" as View, text: "Arsenal" },
    { view: "armeria" as View, text: "Armería" },
    { view: "conclave" as View, text: "Cónclave" },
    { view: "contacto" as View, text: "Contacto" },
  ];

  // Proyectos flagship — derecha, sin box verde estridente
  const flagshipProjects = [
    {
      view: "dentiagest" as View,
      name: "DentIAgest",
      status: "En desarrollo",
      statusColor: "text-fucsia-neon",
    },
    {
      view: "luxsync" as View,
      name: "LuxSync",
      status: "Beta cerrada",
      statusColor: "text-menta",
      pulse: true,
    },
  ];

  return (
    <header className="w-full border-b border-gris-trazado z-50 sticky top-0 bg-noche/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto py-3 px-6">

        {/* MÓVIL */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex justify-between items-center">
            <LogoWordmark className="text-base" />
            {/* Pill de LuxSync en móvil */}
            <button
              onClick={() => setActiveView('armeria')}
              className="flex items-center gap-1.5 text-xs font-plex-mono text-menta"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-menta"></span>
              </span>
              LuxSync Beta
            </button>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 font-plex-sans text-sm">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`bg-transparent border-none p-1 hover:text-menta transition-colors ${
                  activeView === link.view ? 'text-menta' : 'text-hueso'
                }`}
              >
                {link.text}
              </button>
            ))}
          </nav>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between items-center gap-8">

          {/* IZQUIERDA: Logo */}
          <button onClick={() => setActiveView('hero')} className="flex-shrink-0">
            <LogoWordmark className="text-lg" />
          </button>

          {/* CENTRO: Nav */}
          <nav className="flex gap-8 font-plex-sans text-sm">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`relative bg-transparent border-none p-0 transition-colors hover:text-menta group ${
                  activeView === link.view ? 'text-menta' : 'text-hueso'
                }`}
              >
                {link.text}
                {/* Línea activa bajo el item */}
                <span className={`absolute -bottom-3.5 left-0 right-0 h-px bg-menta transition-transform duration-300 origin-left ${
                  activeView === link.view ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </button>
            ))}
          </nav>

          {/* DERECHA: Proyectos flagship — discretos pero presentes */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="h-4 w-px bg-gris-trazado" /> {/* Separador */}
            {flagshipProjects.map((project) => (
              <button
                key={project.view + project.name}
                onClick={() => setActiveView(project.view)}
                className="flex flex-col items-end gap-0.5 group"
              >
                <span className="text-sm font-plex-mono text-hueso group-hover:text-menta transition-colors">
                  {project.name}
                </span>
                <span className={`flex items-center gap-1 text-xs font-plex-sans ${project.statusColor}`}>
                  {project.pulse && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-menta"></span>
                    </span>
                  )}
                  {project.status}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;