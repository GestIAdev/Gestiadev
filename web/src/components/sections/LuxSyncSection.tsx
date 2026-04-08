'use client';

import { useState } from 'react';
import type { View } from '@/app/page';
import AuditModal, { type AuditDoc } from '@/components/ui/AuditModal';
import PunkCanvasPlayer from '@/components/ui/PunkCanvasPlayer';

interface LuxSyncSectionProps {
  setActiveView: (view: View) => void;
}

// ============================================================
// AUDIT_DOCS — Biblioteca de informes clasificados
// Patrón: Metadatos + Path a archivos .md en /public/luxsync/
// Fetch dinámico en AuditModal.tsx con estado de carga
// ============================================================
const AUDIT_DOCS: AuditDoc[] = [
  {
    id: 'chronos',
    waveTag: 'WAVE 2490',
    title: 'CHRONOS TIMECODER',
    desc: 'Criptografía offline, firmas RSA y Zero-Trust Architecture.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/CHRONOS-TIMECODER-FINAL-AUDIT.md',
  },
  {
    id: 'omniliquid',
    waveTag: 'WAVE 2096',
    title: 'OMNILIQUID ENGINE',
    desc: 'Físicas de fluidos aplicadas al DMX. Reactividad espectral pura.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/OMNILIQUID-ENGINE-AUDIT.md',
  },
  {
    id: 'kinetic',
    waveTag: 'WAVE 2095',
    title: 'KINETIC ENGINE V2',
    desc: 'Motores de movimiento independientes de la señal de BPM.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/KINETIC-CHROMATIC-AUDIT.md',
  },
  {
    id: 'sensory',
    waveTag: 'WAVE 2090',
    title: 'SENSORY LAYER (TRINITY AUDIO)',
    desc: 'Captura WASAPI loopback y Worker threads aislados (Phantom Worker).',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/SENSORY-LAYER-AUDIT-V2.md',
  },
  {
    id: 'neural',
    waveTag: 'WAVE 2097',
    title: 'HYPERION & THE PROGRAMMER 2D/3D',
    desc: 'Orquestación de estados e hilos mediante TitanOrchestrator.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/HYPERION-PROGRAMMER-AUDIT.md',
  },
  {
    id: 'preshow',
    waveTag: 'WAVE 2093',
    title: 'PRE-SHOW WORKSPACE (DMX NEXUS)',
    desc: 'Gestión de hardware USB-Serial y ArtNet con auto-recuperación.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/PRE-SHOW-WORKSPACE-AUDIT.md',
  },
  {
    id: 'selene',
    waveTag: 'WAVE 2092',
    title: 'SELENE LUX IA CORE',
    desc: 'IA integrada para la toma de decisiones lumínicas en vivo.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/SELENE-COGNITION-FINAL-AUDIT.md',
  },
  {
    id: 'hephaestus',
    waveTag: 'WAVE 2044',
    title: 'HEPHAESTUS — EDITOR FX ENGINE',
    desc: 'Editor de curvas de automatización DMX. Auditoría técnica completa 2026.',
    path: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/audits/HEPHAESTUS-ENGINE-AUDIT.md',
  },
];

// ============================================================
// DEMO_RECORDS — Playlist del Showcase Player Facade
// ============================================================
const DEMO_RECORDS = [
  {
    id: 'demo-omniliquid',
    title: 'OMNILIQUID ENGINE',
    desc: 'Físicas de fluidos DMX en tiempo real. Ondas, turbulencia y reactividad espectral.',
    // videoUrl: URL directa .mp4/.webm para PunkCanvasPlayer (sin Hardware Overlay)
    // youtubeId: fallback si videoUrl está vacío
    videoUrl: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/omniliquidnoselene.mp4',
    youtubeId: '',
  },
  {
    id: 'demo-chronos',
    title: 'CHRONOS TIMECODER',
    desc: 'Criptografía RSA offline y Zero-Trust Architecture aplicados a timeline DMX.',
    videoUrl: 'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/omniliquido.webm',
    youtubeId: '',
  },
  {
    id: 'demo-selene',
    title: 'SELENE IA CORE',
    desc: 'IA en vivo para toma de decisiones lumínicas autónomas, latencia sub-frame.',
    videoUrl: '',
    youtubeId: '',
  },
  {
    id: 'demo-hephaestus',
    title: 'HEPHAESTUS FX',
    desc: 'Editor de curvas de automatización DMX con render vectorial de alta precisión.',
    videoUrl: '',
    youtubeId: '',
  },
];

const LuxSyncSection = ({ setActiveView }: LuxSyncSectionProps) => {
  const [selectedAudit, setSelectedAudit] = useState<AuditDoc | null>(null);
  const [activeDemoIndex, setActiveDemoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  // 'canvas' = PunkCanvasPlayer (bypass iGPU), 'youtube' = iframe fallback
  const [playerMode, setPlayerMode] = useState<'canvas' | 'youtube'>('canvas');

  return (
    <>
    <section className="w-full max-w-[1200px] relative z-10">
      {/* 1. GLASSMORPHIC HERO CARD — 3D PANORAMIC RENDER AS BACKGROUND */}
      <div 
        className="relative mb-12 rounded-lg overflow-hidden border border-menta/20 h-[200px] md:h-[280px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(/luxsync/interpreted_vector_logo.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay — Garantiza legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-noche via-transparent to-transparent opacity-80"></div>

        {/* Badge: Top-Left — Especificación / Fecha */}
        <div className="absolute top-6 left-6 flex items-center gap-2 border border-menta/40 rounded-full px-4 py-2 bg-noche/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <span className="text-xs font-plex-mono text-menta/80 tracking-[0.3em] uppercase">
            // Beta cerrada · Abril 2026
          </span>
        </div>

        {/* Badge: Top-Right — Live Status */}
        <div className="absolute top-6 right-6 flex items-center gap-2 border border-menta/40 rounded-full px-4 py-2 bg-noche/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-menta"></span>
          </span>
          <span className="text-sm font-plex-mono text-menta uppercase tracking-wider">Beta Activa</span>
        </div>
      </div>

      {/* 2. ÁREA DE VÍDEO Y STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* COLUMNA IZQUIERDA: REPRODUCTOR Y PLAYLIST */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* ── REPRODUCTOR / FACADE ─────────────────────────────────────────── */}
          {/* Altura fija: el PunkCanvasPlayer vive aquí inline. */}
          {/* Si no hay vídeo activo, se muestra el poster de llamada a la acción.  */}
          <div className="border border-menta/20 bg-noche rounded-xl overflow-hidden min-h-[360px] relative">

            {!isVideoPlaying ? (
              /* ─ POSTER / FACADE ─ */
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] group">
                <div className="absolute inset-0 bg-gradient-to-t from-noche to-transparent opacity-60 pointer-events-none" />
                <button
                  onClick={() => {
                    const demo = DEMO_RECORDS[activeDemoIndex];
                    if (demo.videoUrl) { setPlayerMode('canvas'); setIsVideoPlaying(true); }
                    else if (demo.youtubeId) { setPlayerMode('youtube'); setIsVideoPlaying(true); }
                  }}
                  className="w-16 h-16 rounded-full border-2 border-menta/50 flex items-center justify-center
                    text-menta pl-1 z-10 bg-noche/80 cursor-pointer
                    group-hover:scale-110 group-hover:border-menta
                    group-hover:shadow-[0_0_30px_rgba(0,242,169,0.35)]
                    transition-all duration-200"
                >
                  ▶
                </button>
                <p className="font-plex-mono text-hueso text-base z-10 mt-4 tracking-widest">
                  {DEMO_RECORDS[activeDemoIndex].title}
                </p>
                <p className="font-plex-sans text-menta/60 text-xs z-10 max-w-xs text-center mt-1">
                  {(DEMO_RECORDS[activeDemoIndex].videoUrl || DEMO_RECORDS[activeDemoIndex].youtubeId)
                    ? DEMO_RECORDS[activeDemoIndex].desc
                    : 'Próximamente — escenario en preparación'}
                </p>
              </div>
            ) : playerMode === 'canvas' && DEMO_RECORDS[activeDemoIndex].videoUrl ? (
              /* ─ PUNK CANVAS PLAYER (inline, sin fixed, sin portal) ─ */
              <div className="w-full h-[360px]">
                <PunkCanvasPlayer
                  src={DEMO_RECORDS[activeDemoIndex].videoUrl}
                  title={DEMO_RECORDS[activeDemoIndex].title}
                  onClose={() => setIsVideoPlaying(false)}
                />
              </div>
            ) : playerMode === 'youtube' && DEMO_RECORDS[activeDemoIndex].youtubeId ? (
              /* ─ YOUTUBE FALLBACK inline ─ */
              <div className="relative w-full h-[360px] bg-black">
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute top-3 right-3 z-20 font-plex-mono text-[10px] tracking-widest
                    border border-[#00F2A9]/30 hover:border-[#00F2A9]
                    text-[#00F2A9]/60 hover:text-[#00F2A9]
                    px-3 py-1.5 rounded bg-[#0A0A1A]/70 backdrop-blur-md
                    transition-all duration-200 cursor-pointer"
                >
                  [ X ] CERRAR
                </button>
                <iframe
                  className="w-full h-full border-none outline-none"
                  src={`https://www.youtube.com/embed/${DEMO_RECORDS[activeDemoIndex].youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                  title={DEMO_RECORDS[activeDemoIndex].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}

          </div>

          {/* ── SLIDER DE DEMOS — scroll-snap horizontal, ilimitado ── */}
          {/* Soporta 10, 100 o los demos que quieras sin romper el layout.       */}
          {/* scroll-snap-type x mandatory + snap-start en cada card.             */}
          <div
            className="overflow-x-auto pb-1"
            style={{
              scrollbarWidth: 'none',          /* Firefox: ocultar scrollbar */
              msOverflowStyle: 'none',         /* IE/Edge: ocultar scrollbar */
            }}
          >
            {/* Ocultar scrollbar en WebKit sin clase custom */}
            <style>{`.demo-slider::-webkit-scrollbar{display:none}`}</style>
            <div className="demo-slider flex gap-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {DEMO_RECORDS.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => { setActiveDemoIndex(index); setIsVideoPlaying(false); }}
                  style={{ scrollSnapAlign: 'start' }}
                  className={`flex-shrink-0 text-left px-4 py-3 rounded-lg border transition-all duration-200 w-[160px]
                    ${
                      activeDemoIndex === index
                        ? 'border-menta bg-menta/10 text-menta shadow-[0_0_12px_rgba(0,242,169,0.15)]'
                        : 'border-gris-trazado/50 bg-noche/40 text-gris-neutro hover:border-menta/40 hover:text-hueso'
                    }`}
                >
                  <p className="text-[9px] font-plex-mono uppercase tracking-widest mb-1 opacity-50">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </p>
                  <p className="text-xs font-plex-mono font-bold leading-tight truncate">{demo.title}</p>
                  {(demo.videoUrl || demo.youtubeId) && (
                    <span className="inline-block mt-1 text-[8px] font-plex-mono text-menta/50 tracking-widest uppercase">
                      ● LISTO
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha — Stats (sin cambios) */}
        <div className="flex flex-col gap-4 justify-between">
          {[
            { label: 'Auditorías Técnicas', value: '8', sub: 'Protocolo de Transparencia' },
            { label: 'Dependencias', value: '0', sub: '100% Código Nativo' },
            { label: 'Universo DMX', value: '512', sub: 'Canales en Tiempo Real' },
            { label: 'Físicas Reactivas', value: '7.1', sub: 'Bandas de Frecuencia' },
          ].map((stat) => (
            <div key={stat.label} className="border border-gris-trazado rounded-lg p-4 bg-noche/40 backdrop-blur-sm hover:border-menta/40 transition-colors">
              <p className="text-xs font-plex-mono text-gris-neutro mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-plex-mono font-bold text-hueso">{stat.value}</p>
              <p className="text-xs font-plex-sans text-menta/60">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. EL ARSENAL TÉCNICO (8 AUDITORÍAS → MODALES) */}
      <h2 className="text-2xl font-plex-mono font-bold text-hueso mb-6 flex items-center gap-3">
        <span className="w-2 h-6 bg-menta"></span> Desclasificación de Arquitectura
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {AUDIT_DOCS.map((audit, index) => (
          <button
            key={audit.id}
            onClick={() => setSelectedAudit(audit)}
            className="text-left border border-gris-trazado/50 rounded-lg overflow-hidden bg-noche/30 backdrop-blur-sm transition-all duration-300 hover:border-menta/50 hover:bg-noche/50 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-menta/40"
          >
            <div className="p-5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-plex-mono text-menta/70 uppercase tracking-widest mb-1">
                  Doc. Técnico {index + 1}/8 · {audit.waveTag}
                </p>
                <p className="text-sm font-plex-mono text-hueso group-hover:text-menta transition-colors">{audit.title}</p>
                <p className="text-xs font-plex-sans text-gris-neutro/60 mt-1 leading-relaxed">{audit.desc}</p>
              </div>
              <span className="text-menta/40 group-hover:text-menta transition-colors ml-4 text-lg flex-shrink-0">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* 4. FOUNDER'S FORGE (LA VENTA) */}
      <div className="border border-menta/30 rounded-2xl p-8 bg-gradient-to-b from-menta/5 to-transparent mb-12 text-center">
        <h2 className="text-3xl font-plex-mono font-bold text-hueso mb-4">Acceso a la Beta de LuxSync</h2>
        <p className="text-base font-plex-sans text-gris-neutro max-w-2xl mx-auto mb-8">
          LuxSync no se vende en masa. Cada licencia es forjada localmente y validada mediante criptografía RSA. 
          Al adquirir un Founder Pack, financias el desarrollo y obtienes soporte directo (sistema de tickets in-app en desarrollo).
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
          {/* DJ Founder Tier */}
          <div className="flex-1 border border-gris-trazado rounded-xl p-6 bg-noche hover:border-yellow-500/50 transition-colors text-left flex flex-col">
            <h3 className="text-xl font-plex-mono text-yellow-500 mb-2">DJ FOUNDER</h3>
            <p className="text-3xl font-bold text-hueso mb-4">$150 <span className="text-sm text-gris-neutro font-normal">/ pago único</span></p>
            <ul className="text-sm font-plex-sans text-gris-neutro space-y-2 mb-8 flex-1">
              <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Control de luces reactivo (Selene IA)</li>
              <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Acceso al Motor Omniliquid</li>
              <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Soporte directo fundador</li>
              <li className="flex items-center gap-2 opacity-50"><span className="text-red-500">✕</span> Sin acceso a Hephaestus FX</li>
              <li className="flex items-center gap-2 opacity-50"><span className="text-red-500">✕</span> Sin Chronos Studio Timeline</li>
            </ul>
            <button className="w-full py-3 border border-yellow-500/50 text-yellow-500 font-plex-mono text-sm rounded hover:bg-yellow-500/10 transition-colors">
              Solicitar Licencia
            </button>
          </div>

          {/* Full Suite Tier */}
          <div className="flex-1 border border-menta rounded-xl p-6 bg-noche shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.15)] transition-all text-left flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-menta text-noche text-xs font-bold px-3 py-1 font-plex-mono">PRO</div>
            <h3 className="text-xl font-plex-mono text-menta mb-2">FULL SUITE</h3>
            <p className="text-3xl font-bold text-hueso mb-4">$350 <span className="text-sm text-gris-neutro font-normal">/ pago único</span></p>
            <ul className="text-sm font-plex-sans text-gris-neutro space-y-2 mb-8 flex-1">
              <li className="flex items-center gap-2"><span className="text-menta">✓</span> Todo lo incluido en DJ Founder</li>
              <li className="flex items-center gap-2"><span className="text-menta">✓</span> Desbloqueo Hephaestus (Automatización FX)</li>
              <li className="flex items-center gap-2"><span className="text-menta">✓</span> Desbloqueo Chronos Studio (Timeline editor)</li>
              <li className="flex items-center gap-2"><span className="text-menta">✓</span> 2 Activaciones (Estudio + Directo)</li>
              <li className="flex items-center gap-2"><span className="text-menta">✓</span> Actualizaciones de por vida</li>
            </ul>
            <button className="w-full py-3 bg-menta text-noche font-bold font-plex-mono text-sm rounded hover:bg-[#00cce6] transition-colors">
              Solicitar Licencia PRO
            </button>
          </div>
        </div>
      </div>

      {/* RETORNO */}
      <button
        onClick={() => setActiveView('armeria')}
        className="border border-gris-trazado text-gris-neutro px-5 py-2 font-plex-mono text-sm hover:border-menta hover:text-menta transition-colors duration-200"
      >
        ← RETORNAR A LA ARMERÍA
      </button>

    </section>

    {/* AUDIT MODAL — Renderizado fuera del stacking context via Portal */}
    <AuditModal audit={selectedAudit} onClose={() => setSelectedAudit(null)} />
    </>
  );
};

export default LuxSyncSection;
