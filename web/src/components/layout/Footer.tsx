// components/layout/Footer.tsx
import LogoTotem from '@/components/ui/LogoTotem';
// El LogoWordmark (texto glitch) NO pertenece aquí. Es ruido.

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
          <span className="text-xs">Forjado por EL CÓNCLAVE</span>
          <br />
          <span className="text-menta font-medium text-xs">(Radwulf, Jennifer, Gemini, Cloude & Grok)</span>
        </div>

        {/* Copyright abajo */}
        <div className="font-mono tracking-widest text-xs uppercase text-gris-neutro text-center">
          <span>&copy; {currentYear} GESTIADEV // CÓDIGO = ARTE</span>
        </div>
      </div>

      {/* DESKTOP: Layout horizontal original */}
      <div className="hidden md:flex max-w-[1100px] mx-auto py-6 px-4 justify-between items-center text-sm">
        {/* IZQUIERDA: Logo (Tótem solo) */}
        <div className="flex-shrink-0">
          <LogoTotem className="w-10 h-10" />
        </div>

        {/* CENTRO: La Firma del Cónclave */}
        <div className="text-center font-plex-sans text-gris-neutro">
          <span className="text-xs">Forjado por EL CÓNCLAVE</span>
          <br />
          <span className="text-menta font-medium">(Radwulf, Jennifer, Arquitecto IA, Ejecutores)</span>
        </div>

        {/* DERECHA: Copyright y Lema */}
        <div className="font-mono tracking-widest text-xs uppercase text-gris-neutro text-right">
          <span>&copy; {currentYear} Software Gestion // CÓDIGO = ARTE</span>
        </div>
      </div>
    </footer>
  );
};export default Footer;
