'use client';

import { useState } from 'react';
import PunkCanvasPlayer from '@/components/ui/PunkCanvasPlayer';
import {
  DEMO_CATEGORIES,
  DEMO_RECORDS,
  LIVE_METRICS,
  type DemoCategory,
} from '@/lib/luxsyncContent';

export default function MediaGallery() {
  const [activeCategory, setActiveCategory] = useState<DemoCategory>('Technical Demos');
  const [activeDemoIndex, setActiveDemoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'canvas' | 'youtube'>('canvas');

  const visibleDemos = DEMO_RECORDS.filter((d) => d.category === activeCategory);
  const demo = visibleDemos[Math.min(activeDemoIndex, Math.max(0, visibleDemos.length - 1))];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-10">
      {/* ── HEADER ── */}
      <div className="mb-10 text-center">
        <p className="text-xs font-plex-mono text-menta/60 tracking-[0.3em] uppercase mb-3">
          // Media Gallery
        </p>
        <h1 className="text-3xl lg:text-4xl font-plex-mono font-bold text-hueso mb-4">
          Live <span className="text-menta">Demos</span>
        </h1>
        <p className="text-base font-plex-sans text-gris-neutro max-w-2xl mx-auto leading-relaxed">
          Real footage of the LuxSync photonic control ecosystem in operation — engines,
          visualizers and the cognitive layer, captured live from production builds.
        </p>
      </div>

      {/* ── PLAYER + METRICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Player + tabs + playlist */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="border border-menta/20 bg-noche rounded-xl overflow-hidden min-h-[420px] relative">
            {!isVideoPlaying ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[420px] group">
                <div className="absolute inset-0 bg-gradient-to-t from-noche to-transparent opacity-60 pointer-events-none" />
                <button
                  onClick={() => {
                    if (!demo) return;
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
                  {demo?.title ?? ''}
                </p>
                <p className="font-plex-sans text-menta/60 text-xs z-10 max-w-xs text-center mt-1">
                  {demo && (demo.videoUrl || demo.youtubeId)
                    ? demo.desc
                    : 'Coming soon — scenario in preparation'}
                </p>
              </div>
            ) : playerMode === 'canvas' && demo?.videoUrl ? (
              <div className="w-full h-[420px]">
                <PunkCanvasPlayer
                  src={demo.videoUrl}
                  title={demo.title}
                  onClose={() => setIsVideoPlaying(false)}
                />
              </div>
            ) : playerMode === 'youtube' && demo?.youtubeId ? (
              <div className="relative w-full h-[420px] bg-black">
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
                  src={`https://www.youtube.com/embed/${demo.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                  title={demo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>

          {/* Category tabs — filtran la playlist del reproductor */}
          <div className="flex gap-1 border border-gris-trazado/40 rounded-lg p-1 bg-noche/40">
            {DEMO_CATEGORIES.map((cat) => {
              const count = DEMO_RECORDS.filter((d) => d.category === cat).length;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveDemoIndex(0);
                    setIsVideoPlaying(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-md font-plex-mono text-[10px] uppercase tracking-widest transition-all duration-200 cursor-pointer
                    ${
                      active
                        ? 'bg-menta/15 text-menta border border-menta/40 shadow-[0_0_10px_rgba(0,242,169,0.15)]'
                        : 'text-gris-neutro border border-transparent hover:text-hueso hover:border-gris-trazado/50'
                    }`}
                >
                  {cat}
                  <span className={`ml-1.5 tabular-nums ${active ? 'text-menta/60' : 'text-gris-neutro/40'}`}>
                    [{count}]
                  </span>
                </button>
              );
            })}
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
              {visibleDemos.length === 0 && (
                <p className="font-plex-mono text-[10px] text-gris-neutro/50 tracking-[0.25em] uppercase px-4 py-3">
                  [ No demos in this category yet ]
                </p>
              )}
              {visibleDemos.map((demo, index) => (
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
    </div>
  );
}
