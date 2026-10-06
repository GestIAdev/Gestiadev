import LogoTotem from '@/components/ui/LogoTotem';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-gris-trazado bg-noche/80">
      {/* MÓVIL: Layout vertical centrado */}
      <div className="md:hidden max-w-[1100px] mx-auto py-4 px-4 flex flex-col items-center gap-4 text-sm">
        {/* Logo arriba */}
        <div className="flex-shrink-0">
          <LogoTotem className="w-8 h-8" />
        </div>

        {/* Firma centrada */}
        <div className="text-center font-plex-sans text-gris-neutro">
          <span className="text-xs">LuxSync — Photonic Control Ecosystem</span>
        </div>

        {/* Copyright abajo */}
        <div className="font-mono tracking-widest text-xs uppercase text-gris-neutro text-center">
          <span>&copy; {currentYear} LUXSYNC // PRECISION PHOTONICS</span>
        </div>
      </div>

      {/* DESKTOP: Layout horizontal */}
      <div className="hidden md:flex max-w-[1100px] mx-auto py-6 px-4 justify-between items-center text-sm">
        {/* IZQUIERDA: Logo (Tótem) */}
        <div className="flex-shrink-0">
          <LogoTotem className="w-10 h-10" />
        </div>

        {/* CENTRO: Brand */}
        <div className="text-center font-plex-sans text-gris-neutro">
          <span className="text-xs">LuxSync — Photonic Control Ecosystem</span>
        </div>

        {/* DERECHA: Copyright */}
        <div className="font-mono tracking-widest text-xs uppercase text-gris-neutro text-right">
          <span>&copy; {currentYear} LUXSYNC // PRECISION PHOTONICS</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
