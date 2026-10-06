'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PunkCanvasPlayer from '@/components/ui/PunkCanvasPlayer';
import { DEMO_RECORDS, LIVE_METRICS } from '@/lib/luxsyncContent';

export default function Home() {
  const [activeDemoIndex, setActiveDemoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'canvas' | 'youtube'>('canvas');

  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr_auto] text-hueso overflow-hidden">
      {/* Fila 1: Header */}
      <Header />

      {/* Fila 2: Main — LuxSync flagship (high-impact, minimal scroll) */}
      <main className="relative z-10 overflow-y-auto lienzo-principal">
        <div className="w-full min-h-full flex flex-col justify-start items-center px-6 py-8 gap-12">
          {/* ═══════════════════════════════════════════════════════
              1. HERO
          ═══════════════════════════════════════════════════════ */}
          <motion.section
            className="w-full max-w-[1100px] flex flex-col justify-center items-center text-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <img
              src="/luxsync/interpreted_vector_logo.png"
              alt="LuxSync Core"
              width={384}
              height={384}
              className="w-56 md:w-72 lg:w-80 mb-6 rounded-full shadow-[0_0_40px_rgba(0,242,169,0.15)] mx-auto object-contain"
            />

            <h1 className="text-3xl md:text-5xl font-plex-mono font-bold text-hueso mb-4">
              LuxSync — Photonic Control Ecosystem
            </h1>

            <p className="text-base md:text-lg text-gris-neutro max-w-2xl mx-auto mb-8 font-plex-sans">
              Fluid physics, Radix-2 synchronization and the first cognitive DMX engine. Enterprise-grade
              photonic control with zero external dependencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/whitepapers"
                className="font-plex-mono font-bold bg-menta text-noche px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:bg-[#00cce6]"
              >
                [ TECHNICAL DOCS ]
              </Link>
              <Link
                href="/contact"
                className="font-plex-mono text-gris-neutro border border-gris-trazado px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:border-hueso hover:text-hueso"
              >
                [ ENTERPRISE INQUIRIES ]
              </Link>
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════
              2. SHOWCASE PLAYER + LIVE METRICS
          ═══════════════════════════════════════════════════════ */}
          <section className="w-full max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: Player + Playlist */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="border border-menta/20 bg-noche rounded-xl overflow-hidden min-h-[360px] relative">
                  {!isVideoPlaying ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[360px] group">
                      <div className="absolute inset-0 bg-gradient-to-t from-noche to-transparent opacity-60 pointer-events-none" />
                      <button
                        onClick={() => {
                          const demo = DEMO_RECORDS[activeDemoIndex];
                          if (demo.videoUrl) {
                            setPlayerMode('canvas');
                            setIsVideoPlaying(true);
                          } else if (demo.youtubeId) {
                            setPlayerMode('youtube');
                            setIsVideoPlaying(true);
                          }
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
                        {(DEMO_RECORDS[activeDemoIndex].videoUrl ||
                          DEMO_RECORDS[activeDemoIndex].youtubeId)
                          ? DEMO_RECORDS[activeDemoIndex].desc
                          : 'Coming soon — scenario in preparation'}
                      </p>
                    </div>
                  ) : playerMode === 'canvas' && DEMO_RECORDS[activeDemoIndex].videoUrl ? (
                    <div className="w-full h-[360px]">
                      <PunkCanvasPlayer
                        src={DEMO_RECORDS[activeDemoIndex].videoUrl}
                        title={DEMO_RECORDS[activeDemoIndex].title}
                        onClose={() => setIsVideoPlaying(false)}
                      />
                    </div>
                  ) : playerMode === 'youtube' && DEMO_RECORDS[activeDemoIndex].youtubeId ? (
                    <div className="relative w-full h-[360px] bg-black">
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="absolute top-3 right-3 z-20 font-plex-mono text-[10px] tracking-widest
                          border border-[#00F2A9]/30 hover:border-[#00F2A9]
                          text-[#00F2A9]/60 hover:text-[#00F2A9]
                          px-3 py-1.5 rounded bg-[#0A0A1A]/70 backdrop-blur-md
                          transition-all duration-200 cursor-pointer"
                      >
                        [ X ] CLOSE
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

                {/* Demo slider */}
                <div
                  className="overflow-x-auto pb-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`.demo-slider::-webkit-scrollbar{display:none}`}</style>
                  <div
                    className="demo-slider flex gap-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {DEMO_RECORDS.map((demo, index) => (
                      <button
                        key={demo.id}
                        onClick={() => {
                          setActiveDemoIndex(index);
                          setIsVideoPlaying(false);
                        }}
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
                        <p className="text-xs font-plex-mono font-bold leading-tight truncate">
                          {demo.title}
                        </p>
                        {(demo.videoUrl || demo.youtubeId) && (
                          <span className="inline-block mt-1 text-[8px] font-plex-mono text-menta/50 tracking-widest uppercase">
                            ● READY
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Live Metrics */}
              <div className="flex flex-col gap-4 justify-between">
                {LIVE_METRICS.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-gris-trazado rounded-lg p-4 bg-noche/40 backdrop-blur-sm hover:border-menta/40 transition-colors"
                  >
                    <p className="text-xs font-plex-mono text-gris-neutro mb-1 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-plex-mono font-bold text-hueso">{stat.value}</p>
                    <p className="text-xs font-plex-sans text-menta/60">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Fila 3: Footer */}
      <Footer />
    </div>
  );
}
