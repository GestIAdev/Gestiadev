import BelascoCard from './armeria/BelascoCard';
import IAnarkalendarCard from './armeria/IAnarkalendarCard';
import BarChafyCard from './armeria/BarChafyCard';
import ScherzoCard from './armeria/ScherzoCard';
import MigracionCard from './armeria/MigracionCard';
import RedNomadaCard from './armeria/RedNomadaCard';
import { motion } from 'framer-motion';

interface ArmeriaProps {
  setActiveView: (view: string) => void;
}

const Armeria = ({ setActiveView }: ArmeriaProps) => {
  return (
    <section className="w-full max-w-[1200px] py-6">

      {/* CABECERA */}
      <div className="text-center mb-6">
        <p className="text-sm font-plex-mono text-gris-neutro tracking-[0.3em] uppercase mb-3">
          // Proyectos del Cónclave
        </p>
        <h2 className="text-4xl lg:text-5xl font-plex-mono font-bold text-hueso">
          La Armería
        </h2>
        <p className="mt-4 text-lg font-plex-sans text-gris-neutro max-w-2xl mx-auto">
          Desde demos de campo hasta las armas pesadas. Todo forjado con el mismo ADN soberano.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BLOQUE SUPERIOR: Las armas pesadas — LuxSync + DentIAgest
          Ocupan el ancho completo, en dos columnas simétricas
      ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* ── LUXSYNC ── */}
        <motion.div
          className="relative border border-gris-trazado/20 rounded-xl overflow-hidden bg-[#0D0D1F] backdrop-blur-sm group cursor-pointer"
          whileHover={{ borderColor: 'rgba(0,242,169,0.5)', boxShadow: '0 0 30px rgba(0,242,169,0.07) inset, 0 0 20px rgba(0,242,169,0.06)' }}
          transition={{ duration: 0.25 }}
          onClick={() => setActiveView('luxsync')}
        >
          {/* Badge de estado live */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-noche/80 border border-menta/40 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-menta"></span>
            </span>
            <span className="text-xs font-plex-mono text-menta">Beta cerrada</span>
          </div>

          <div className="p-8 pb-6">
            {/* Icono SVG — Onda de frecuencia */}
            <svg className="w-10 h-10 mb-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="2,20 8,20 11,8 14,32 17,14 20,26 23,4 26,36 29,16 32,24 35,20 38,20" stroke="#00F2A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            {/* Eyebrow */}
            <p className="text-xs font-plex-mono text-menta/60 tracking-widest uppercase mb-2">
              Control DMX · IA en tiempo real
            </p>
            <h3 className="text-3xl font-plex-mono font-bold text-hueso mb-3 group-hover:text-menta transition-colors duration-300">
              LuxSync
            </h3>
            <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-6 max-w-md">
              Software de control de iluminación escénica impulsado por <span className="text-hueso">Selene Lux IA</span>.
              Compite directamente con GrandMA3. Zero dependencias externas.
              Las auditorías técnicas lo demuestran.
            </p>

            {/* Stats en línea */}
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-plex-mono font-bold text-menta">0</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Deps externas</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-menta">DMX</p>
                <p className="text-xs text-gris-neutro font-plex-sans">512 canales</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-menta">IA</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Selene Lux</p>
              </div>
            </div>
          </div>

          {/* Línea inferior decorativa */}
          <div className="h-px bg-gradient-to-r from-transparent via-menta/40 to-transparent" />
          <div className="px-8 py-3 flex justify-between items-center">
            <span className="text-xs font-plex-mono text-gris-neutro">Electron · TypeScript · Zero-Dep</span>
            <span className="text-xs font-plex-mono text-menta group-hover:translate-x-1 transition-transform duration-200">
              [ ACCEDER_SISTEMA &gt; ]
            </span>
          </div>
        </motion.div>

        {/* ── DENTIAGEST ── */}
        <motion.div
          className="relative border border-gris-trazado/20 rounded-xl overflow-hidden bg-[#0D0D1F] backdrop-blur-sm group cursor-pointer"
          whileHover={{ borderColor: 'rgba(168,85,247,0.5)', boxShadow: '0 0 30px rgba(168,85,247,0.07) inset, 0 0 20px rgba(168,85,247,0.06)' }}
          transition={{ duration: 0.25 }}
          onClick={() => setActiveView('dentiagest')}
        >
          {/* Badge de estado */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-noche/80 border border-purple-500/30 rounded-full px-3 py-1">
            <span className="text-xs font-plex-mono text-purple-400">En desarrollo · 85%</span>
          </div>

          <div className="p-8 pb-6">
            {/* Icono SVG — Escudo hexagonal con nodo */}
            <svg className="w-10 h-10 mb-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3L35 11V22C35 29.5 28.5 35.5 20 38C11.5 35.5 5 29.5 5 22V11L20 3Z" stroke="#A855F7" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="4" fill="#A855F7" fillOpacity="0.3" stroke="#A855F7" strokeWidth="1.5"/>
              <line x1="20" y1="11" x2="20" y2="16" stroke="#A855F7" strokeWidth="1" strokeLinecap="round"/>
              <line x1="20" y1="24" x2="20" y2="29" stroke="#A855F7" strokeWidth="1" strokeLinecap="round"/>
              <line x1="11" y1="20" x2="16" y2="20" stroke="#A855F7" strokeWidth="1" strokeLinecap="round"/>
              <line x1="24" y1="20" x2="29" y2="20" stroke="#A855F7" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {/* Eyebrow */}
            <p className="text-xs font-plex-mono text-purple-400/60 tracking-widest uppercase mb-2">
              Gestión Dental · Web3 · IA Clínica
            </p>
            <h3 className="text-3xl font-plex-mono font-bold text-hueso mb-3 group-hover:text-purple-400 transition-colors duration-300">
              DentIAgest
            </h3>
            <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-6 max-w-md">
              Ecosistema soberano de gestión clínica. Multitenant, <span className="text-hueso">Web3 nativo</span> y automatización de flujo de caja con <span className="text-hueso">Selene Core</span>.
            </p>

            {/* Stats en línea */}
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-plex-mono font-bold text-purple-400">85%</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Completado</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-purple-400">Web3</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Ecosystem</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-purple-400">RGPD</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Art. 9 nativo</p>
              </div>
            </div>
          </div>

          {/* Línea inferior decorativa */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="px-8 py-3 flex justify-between items-center">
            <span className="text-xs font-plex-mono text-gris-neutro">Next.js · GraphQL · Selene Song Core</span>
            <span className="text-xs font-plex-mono text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
              [ EXPEDIENTE_CLASIFICADO &gt; ]
            </span>
          </div>
        </motion.div>

      </div>

      {/* ═══════════════════════════════════════════════════════
          SEPARADOR — La miniarmería
      ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-gris-trazado" />
        <p className="text-xs font-plex-mono text-gris-neutro tracking-[0.25em] uppercase">
          Demos de campo · Proyectos menores
        </p>
        <div className="flex-1 h-px bg-gris-trazado" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          BLOQUE INFERIOR: La miniarmería — grid de 3
      ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BelascoCard setActiveView={setActiveView} />
        <BarChafyCard setActiveView={setActiveView} />
        <IAnarkalendarCard setActiveView={setActiveView} />
        <ScherzoCard setActiveView={setActiveView} />
        <MigracionCard setActiveView={setActiveView} />
        <RedNomadaCard setActiveView={setActiveView} />
      </div>

    </section>
  );
};

export default Armeria;
