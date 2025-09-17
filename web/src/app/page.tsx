'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Arsenal from '@/components/sections/Arsenal';
import Armeria from '@/components/sections/Armeria';
import Fundador from '@/components/sections/Fundador';
import Contacto from '@/components/sections/Contacto';
import Alianzas from '@/components/sections/Alianzas';
import ArsenalApolloDetalle from '@/components/sections/arsenal/ArsenalApolloDetalle';
import ArsenalDigitalFortressDetalle from '@/components/sections/arsenal/ArsenalDigitalFortressDetalle';
import ArsenalIAPunkDetalle from '@/components/sections/arsenal/ArsenalIAPunkDetalle';
import ArsenalUXUIDetalle from '@/components/sections/arsenal/ArsenalUX-UIDetalle';
import ArsenalCustomToolsDetalle from '@/components/sections/arsenal/ArsenalCustomToolsDetalle';
import ArsenalModularDetalle from '@/components/sections/arsenal/ArsenalModularDetalle';
import ArmeriaBelascoDetalle from '@/components/sections/armeria/ArmeriaBelascoDetalle';
import ArmeriaIAnarkalendarDetalle from '@/components/sections/armeria/ArmeriaIAnarkalendarDetalle';
import ArmeriaBarchafyDetalle from '@/components/sections/armeria/ArmeriaBarchafyDetalle';
import ArmeriaScherzoDetalle from '@/components/sections/armeria/ArmeriaScherzoDetalle';
import ArmeriaMigracionDetalle from '@/components/sections/armeria/ArmeriaMigracionDetalle';
import ArmeriaRedNomadaDetalle from '@/components/sections/armeria/ArmeriaRedNomadaDetalle';
import DemoCyberpunkVet from '@/components/sections/armeria/DemoCyberpunkVet';
import HolopadLaReina from '@/components/sections/HolopadLaReina';
import StarfieldSwitcher from '@/components/ui/StarfieldSwitcher';

// Define view types for type safety
export type View =
  | 'hero'
  | 'arsenal'
  | 'armeria'
  | 'armeria-belasco'
  | 'armeria-ianarkalendar'
  | 'armeria-barchafy'
  | 'armeria-scherzo'
  | 'armeria-migracion'
  | 'armeria-rednomada'
  | 'demo-cyberpunkvet'
  | 'fundador'
  | 'contacto'
  | 'alianzas'
  | 'holopad-la-reina'
  | 'apolloDetalle'
  | 'digitalFortressDetalle'
  | 'iaPunkDetalle'
  | 'uxUiDetalle'
  | 'customToolsDetalle'
  | 'modularDetalle';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('hero');

  const handleSetActiveView = (view: string) => {
    setActiveView(view as View);
  };

  // RENDER SOBERANO - Determina si una vista es fullscreen
  const isFullscreenView = (view: View): boolean => {
    const fullscreenViews: View[] = [
      'armeria-belasco',
      'armeria-barchafy',
      'demo-cyberpunkvet'
    ];
    return fullscreenViews.includes(view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'hero':
        return <Hero setActiveView={setActiveView} />;
      case 'arsenal':
        return <Arsenal setActiveView={setActiveView} />;
      case 'armeria':
        return <Armeria setActiveView={handleSetActiveView} />;
      case 'armeria-belasco':
        return <ArmeriaBelascoDetalle setActiveView={handleSetActiveView} />;
      case 'armeria-ianarkalendar':
        return <ArmeriaIAnarkalendarDetalle setActiveView={handleSetActiveView} />;
      case 'armeria-barchafy':
        return <ArmeriaBarchafyDetalle setActiveView={handleSetActiveView} />;
      case 'armeria-scherzo':
        return <ArmeriaScherzoDetalle setActiveView={handleSetActiveView} />;
      case 'armeria-migracion':
        return <ArmeriaMigracionDetalle setActiveView={handleSetActiveView} />;
      case 'armeria-rednomada':
        return <ArmeriaRedNomadaDetalle setActiveView={handleSetActiveView} />;
      case 'demo-cyberpunkvet':
        return <DemoCyberpunkVet setActiveView={handleSetActiveView} />;
      case 'fundador':
        return <Fundador />;
      case 'contacto':
        return <Contacto />;
      case 'alianzas':
        return <Alianzas />;
      case 'holopad-la-reina':
        return <HolopadLaReina />;
      case 'apolloDetalle':
        return <ArsenalApolloDetalle setActiveView={setActiveView} />;
      case 'digitalFortressDetalle':
        return <ArsenalDigitalFortressDetalle setActiveView={setActiveView} />;
      case 'iaPunkDetalle':
        return <ArsenalIAPunkDetalle setActiveView={setActiveView} />;
      case 'uxUiDetalle':
        return <ArsenalUXUIDetalle setActiveView={setActiveView} />;
      case 'customToolsDetalle':
        return <ArsenalCustomToolsDetalle setActiveView={setActiveView} />;
      case 'modularDetalle':
        return <ArsenalModularDetalle setActiveView={setActiveView} />;
      default:
        return <Hero setActiveView={setActiveView} />;
    }
  };

  /* RENDER SOBERANO - Lógica condicional de renderizado
     Si la vista activa es fullscreen → Renderiza SOLO el componente
     Si la vista activa es normal → Renderiza el shell completo (Header + Main + Footer)
  */
  if (isFullscreenView(activeView)) {
    // RENDER SOBERANO - Vista fullscreen ocupa toda la pantalla
    return (
      <div className="relative h-screen text-hueso overflow-hidden">
        <StarfieldSwitcher /> {/* Fondo global permanece */}
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    );
  }

  /* SHELL ARQUITECTÓNICO REFORJADO - Para vistas normales
    1. purgamos 'flex flex-col' del contenedor raíz.
    2. Lo reemplazamos con 'grid' y 'grid-rows-[auto_1fr_auto]'.
    3. Esto crea 3 filas estrictas: Header (auto), Main (1fr/todo el resto), Footer (auto).
    4. Purgamos 'flex-grow' del tag <main> porque la grid (1fr) ahora maneja ese espacio.
    Esto mata el glitch de superposición permanentemente.
  */
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr_auto] text-hueso overflow-hidden">
      <StarfieldSwitcher /> {/* Sigue siendo el fondo global (z-[-10]) */}

      {/* Fila 1: Header (auto) */}
      <Header activeView={activeView} setActiveView={setActiveView} />

      {/* Fila 2: Main (1fr) - Este es el Lienzo que scrollea */}
      <main className="relative z-10 overflow-y-auto lienzo-principal">
        {/* Este wrapper (de Turno 64) sigue siendo correcto: empuja el contenido desde el borde (p-8) y empieza por arriba (justify-start) */}
        <div className="w-full min-h-full flex flex-col justify-start items-center p-8">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
      </main>

      {/* Fila 3: Footer (auto) */}
      <Footer />
    </div>
  );
}