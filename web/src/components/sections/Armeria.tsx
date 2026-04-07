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
          className="relative border border-menta/30 rounded-xl overflow-hidden bg-noche/60 backdrop-blur-sm group cursor-pointer"
          whileHover={{ borderColor: 'rgba(0,242,169,0.6)', boxShadow: '0 0 30px rgba(0,242,169,0.12)' }}
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
              Ver más →
            </span>
          </div>
        </motion.div>

        {/* ── DENTIAGEST ── */}
        <motion.div
          className="relative border border-fucsia-neon/20 rounded-xl overflow-hidden bg-noche/60 backdrop-blur-sm group cursor-pointer"
          whileHover={{ borderColor: 'rgba(232,0,232,0.45)', boxShadow: '0 0 30px rgba(232,0,232,0.08)' }}
          transition={{ duration: 0.25 }}
          onClick={() => setActiveView('dentiagest')}
        >
          {/* Badge de estado */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-noche/80 border border-fucsia-neon/30 rounded-full px-3 py-1">
            <span className="text-xs font-plex-mono text-fucsia-neon">En desarrollo · 85%</span>
          </div>

          <div className="p-8 pb-6">
            {/* Eyebrow */}
            <p className="text-xs font-plex-mono text-fucsia-neon/60 tracking-widest uppercase mb-2">
              Gestión Dental · Web3 · IA Clínica
            </p>
            <h3 className="text-3xl font-plex-mono font-bold text-hueso mb-3 group-hover:text-fucsia-neon transition-colors duration-300">
              DentIAgest
            </h3>
            <p className="text-gris-neutro font-plex-sans text-sm leading-relaxed mb-6 max-w-md">
              Plataforma de gestión dental de nueva generación con <span className="text-hueso">Selene Song Core</span> como reactor.
              Ecosystem Web3 integrado, IA clínica y cumplimiento RGPD Art. 9 de fábrica.
            </p>

            {/* Stats en línea */}
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-plex-mono font-bold text-fucsia-neon">85%</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Completado</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-fucsia-neon">Web3</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Ecosystem</p>
              </div>
              <div>
                <p className="text-2xl font-plex-mono font-bold text-fucsia-neon">RGPD</p>
                <p className="text-xs text-gris-neutro font-plex-sans">Art. 9 nativo</p>
              </div>
            </div>
          </div>

          {/* Línea inferior decorativa */}
          <div className="h-px bg-gradient-to-r from-transparent via-fucsia-neon/30 to-transparent" />
          <div className="px-8 py-3 flex justify-between items-center">
            <span className="text-xs font-plex-mono text-gris-neutro">Next.js · GraphQL · Selene Song Core</span>
            <span className="text-xs font-plex-mono text-fucsia-neon group-hover:translate-x-1 transition-transform duration-200">
              Ver más →
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
