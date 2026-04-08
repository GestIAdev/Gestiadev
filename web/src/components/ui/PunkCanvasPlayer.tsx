'use client';

/**
 * PUNK-CANVAS PLAYER — WAVE 2527
 * Operación BYPASS: Hardware Overlay Evasion Protocol
 *
 * El problema: Chromium activa Direct Composition / Hardware Overlay
 * al poner un <video> en Fullscreen. En laptops NVIDIA Optimus MUXless
 * con pantalla a 120Hz conectada a la iGPU, esto crashea la pestaña.
 *
 * La solución: <video hidden> solo decodifica frames.
 * <canvas> los pinta via ctx.drawImage().
 * requestFullscreen() se llama sobre el <div> contenedor, NUNCA sobre el <video>.
 * → Chromium no activa el Hardware Overlay pipeline. Cero crashes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface PunkCanvasPlayerProps {
  /** URL directa al archivo de vídeo (.mp4, .webm) */
  src: string;
  /** Título del demo para la UI */
  title: string;
  /** Callback al cerrar el reproductor */
  onClose: () => void;
  /** FPS objetivo para el render loop (default: 30) */
  targetFps?: number;
}

// Formatea segundos a MM:SS
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PunkCanvasPlayer({
  src,
  title,
  onClose,
  targetFps = 30,
}: PunkCanvasPlayerProps) {
  // ─── REFS ────────────────────────────────────────────────────────────
  const videoRef      = useRef<HTMLVideoElement>(null);   // Decodificador oculto
  const canvasRef     = useRef<HTMLCanvasElement>(null);  // Superficie visible
  const containerRef  = useRef<HTMLDivElement>(null);     // Target para requestFullscreen()
  const rafId         = useRef<number>(0);                // ID del requestAnimationFrame
  const lastTimeRef   = useRef<number>(0);                // Throttle del setCurrentTime
  const isLoopActive  = useRef<boolean>(false);           // Guardia anti-doble-loop

  // ─── STATE ───────────────────────────────────────────────────────────
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [isMuted,      setIsMuted]      = useState(false);
  const [isBuffering,  setIsBuffering]  = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── RENDER LOOP ─────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (isLoopActive.current) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isLoopActive.current = true;
    const interval = 1000 / targetFps;
    let last = 0;

    const frame = (ts: number) => {
      // Frame skipping adaptativo: solo dibuja cuando toca
      if (ts - last >= interval) {
        last = ts;

        // Sync canvas size al contenedor real (sin DPR para evitar sobrecarga en iGPU)
        const r = canvas.getBoundingClientRect();
        if (canvas.width !== r.width || canvas.height !== r.height) {
          canvas.width  = r.width;
          canvas.height = r.height;
        }

        if (video.readyState >= 2 && video.videoWidth > 0) {
          // Letterboxing: mantener aspect ratio del vídeo
          const va = video.videoWidth / video.videoHeight;
          const ca = canvas.width / canvas.height;
          let dw: number, dh: number, ox: number, oy: number;

          if (ca > va) {
            // Canvas más ancho que el vídeo → pillar boxes (franjas laterales)
            dh = canvas.height;
            dw = dh * va;
            ox = (canvas.width - dw) / 2;
            oy = 0;
          } else {
            // Canvas más alto → letterbox (franjas arriba/abajo)
            dw = canvas.width;
            dh = dw / va;
            ox = 0;
            oy = (canvas.height - dh) / 2;
          }

          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, ox, oy, dw, dh);
        }

        // Throttle de setCurrentTime: solo cada 250ms para no reventar React
        if (ts - lastTimeRef.current > 250) {
          lastTimeRef.current = ts;
          setCurrentTime(video.currentTime);
        }
      }

      if (!video.paused && !video.ended) {
        rafId.current = requestAnimationFrame(frame);
      } else {
        isLoopActive.current = false;
      }
    };

    rafId.current = requestAnimationFrame(frame);
  }, [targetFps]);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    isLoopActive.current = false;
  }, []);

  // ─── LIFECYCLE: MONTAR VÍDEO ─────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.src          = src;
    v.crossOrigin  = 'anonymous'; // Requerido para drawImage desde CDN/Supabase
    v.playsInline  = true;
    v.preload      = 'auto';
    v.volume       = volume;
    v.muted        = isMuted;

    const onCanPlay = () => {
      setDuration(v.duration || 0);
      setIsBuffering(false);
      v.play().then(() => {
        setIsPlaying(true);
        startLoop();
      }).catch(() => {
        // Autoplay bloqueado (mobile policy): mostrar controles
        setIsPlaying(false);
      });
    };

    const onWaiting  = () => setIsBuffering(true);
    const onPlaying  = () => { setIsBuffering(false); startLoop(); };
    const onPause    = () => { stopLoop(); setIsPlaying(false); };
    const onEnded    = () => { stopLoop(); setIsPlaying(false); setCurrentTime(0); };
    const onError    = () => { setIsBuffering(false); };
    const onDuration = () => { if (isFinite(v.duration)) setDuration(v.duration); };

    v.addEventListener('canplay',          onCanPlay);
    v.addEventListener('waiting',          onWaiting);
    v.addEventListener('playing',          onPlaying);
    v.addEventListener('pause',            onPause);
    v.addEventListener('ended',            onEnded);
    v.addEventListener('error',            onError);
    v.addEventListener('durationchange',   onDuration);

    return () => {
      v.removeEventListener('canplay',        onCanPlay);
      v.removeEventListener('waiting',        onWaiting);
      v.removeEventListener('playing',        onPlaying);
      v.removeEventListener('pause',          onPause);
      v.removeEventListener('ended',          onEnded);
      v.removeEventListener('error',          onError);
      v.removeEventListener('durationchange', onDuration);
      stopLoop();
      v.pause();
      v.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ─── LIFECYCLE: SINCRONIZAR VOLUMEN ─────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ─── LIFECYCLE: FULLSCREEN CHANGE ──────────────────────────────────
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ─── LIFECYCLE: KEYBOARD ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'Escape':
          if (!document.fullscreenElement) onClose();
          break;
        case 'ArrowRight':
          e.preventDefault();
          v.currentTime = Math.min(v.currentTime + 5, v.duration);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          v.currentTime = Math.max(v.currentTime - 5, 0);
          break;
        case 'm':
        case 'M':
          setIsMuted(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── LIFECYCLE: VISIBILITYCHANGE ────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (!document.hidden && !v.paused) {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [startLoop]);

  // ─── AUTO-HIDE CONTROLS ─────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [resetHideTimer]);

  // ─── HANDLERS ────────────────────────────────────────────────────────
  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => { setIsPlaying(true); startLoop(); }).catch(() => {});
    } else {
      v.pause();
    }
    resetHideTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !isFinite(duration) || duration === 0) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
    setCurrentTime(v.currentTime);
    resetHideTimer();
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(ratio);
    setIsMuted(ratio === 0);
    resetHideTimer();
  };

  const handleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        // ⭐ CLAVE DEL BYPASS: requestFullscreen sobre el DIV, no sobre el <video>
        // Chromium NO activa Hardware Overlay para un div genérico.
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignorar: algunos contextos (iframes sin allow="fullscreen") bloquean esto
    }
    resetHideTimer();
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    resetHideTimer();
  };

  // ─── RENDER ──────────────────────────────────────────────────────────
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-black flex flex-col select-none"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >

      {/* ── VIDEO OCULTO: Solo decodifica, nunca se muestra al usuario ── */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ── CANVAS VISIBLE: Recibe los frames del decoder ── */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full block cursor-pointer"
        style={{ background: '#000000' }}
        onClick={handlePlayPause}
        aria-label={`Reproducir o pausar: ${title}`}
      />

      {/* ── TÍTULO (top-left) ── */}
      <div
        className={`absolute top-0 left-0 right-0 px-4 pt-4 pb-8
          bg-gradient-to-b from-black/70 to-transparent
          transition-opacity duration-300 pointer-events-none
          ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#00F2A9]/70">
          // LUXSYNC DEMO
        </span>
        <p className="font-mono text-sm text-[#EAEAEA] tracking-wider mt-0.5">{title}</p>
      </div>

      {/* ── BOTÓN CERRAR (top-right) ── */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 z-50
          font-mono text-xs border border-[#00F2A9]/30 hover:border-[#00F2A9]
          text-[#00F2A9]/70 hover:text-[#00F2A9]
          px-3 py-2 rounded bg-[#0A0A1A]/80 backdrop-blur-sm
          transition-all duration-200 cursor-pointer
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Cerrar reproductor"
      >
        [ X ] CERRAR
      </button>

      {/* ── SPINNER DE BUFFERING ── */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-[#00F2A9]/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00F2A9] animate-spin" />
          </div>
        </div>
      )}

      {/* ── BARRA DE CONTROLES (bottom) ── */}
      <div
        className={`absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/90 via-black/60 to-transparent
          pt-10 pb-3 px-4
          transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >

        {/* SEEKBAR */}
        <div
          className="relative w-full h-5 flex items-center cursor-pointer mb-2 group"
          onClick={handleSeek}
          role="slider"
          aria-label="Progreso del vídeo"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          {/* Track */}
          <div className="absolute w-full h-[3px] bg-[#333333] rounded" />
          {/* Progress */}
          <div
            className="absolute h-[3px] bg-[#00F2A9] rounded transition-none"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute w-3 h-3 rounded-full bg-[#00F2A9] shadow-[0_0_8px_rgba(0,242,169,0.8)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* FILA DE CONTROLES */}
        <div className="flex items-center gap-3">

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="text-[#EAEAEA] hover:text-[#00F2A9] transition-colors cursor-pointer w-8 h-8 flex items-center justify-center flex-shrink-0"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              /* Pause icon — dos barras */
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <rect x="2" y="2" width="4" height="12" rx="1" />
                <rect x="10" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              /* Play icon — triángulo */
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
              </svg>
            )}
          </button>

          {/* TIMESTAMP */}
          <span className="font-mono text-xs text-[#888888] flex-shrink-0 tabular-nums">
            {formatTime(currentTime)} <span className="opacity-40">/</span> {formatTime(duration)}
          </span>

          {/* SPACER */}
          <div className="flex-1" />

          {/* VOLUMEN */}
          <button
            onClick={toggleMute}
            className="text-[#888888] hover:text-[#00F2A9] transition-colors cursor-pointer w-7 h-7 flex items-center justify-center flex-shrink-0"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M6 3L2 6H0v4h2l4 3V3zm6.12 1.88l-1.41 1.41A3.98 3.98 0 0 1 12 8c0 1.03-.39 1.96-1.03 2.67l1.41 1.41A5.96 5.96 0 0 0 14 8c0-1.63-.65-3.1-1.71-4.18l.17.06zm-2.83 2.83l-1.41 1.41A1.99 1.99 0 0 1 10 8c0-.55-.22-1.05-.59-1.41l1.41-1.41c.73.73 1.18 1.73 1.18 2.82z" opacity=".3" />
                <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M6 3L2 6H0v4h2l4 3V3zm3.54 1.46A4.98 4.98 0 0 1 11 8a4.98 4.98 0 0 1-1.46 3.54l1.06 1.06A6.47 6.47 0 0 0 12.5 8a6.47 6.47 0 0 0-1.9-4.6l-1.06 1.06z"/>
              </svg>
            )}
          </button>

          {/* Barra de volumen */}
          <div
            className="hidden sm:flex items-center w-20 h-5 cursor-pointer group"
            onClick={handleVolumeChange}
            role="slider"
            aria-label="Volumen"
            aria-valuenow={isMuted ? 0 : volume}
            aria-valuemin={0}
            aria-valuemax={1}
          >
            <div className="relative w-full h-[3px] bg-[#333333] rounded">
              <div
                className="absolute h-[3px] bg-[#888888] group-hover:bg-[#00F2A9] rounded transition-colors"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>

          {/* FULLSCREEN — EL CORAZÓN DEL BYPASS */}
          <button
            onClick={handleFullscreen}
            className="text-[#888888] hover:text-[#00F2A9] transition-colors cursor-pointer w-7 h-7 flex items-center justify-center flex-shrink-0"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title="Pantalla completa (Bypass: container.requestFullscreen)"
          >
            {isFullscreen ? (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 1v4H1M11 1v4h4M5 15v-4H1M11 15v-4h4" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 5V1h4M15 5V1h-4M1 11v4h4M15 11v4h-4" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ── ATAJO DE TECLADO HINT (aparece solo al inicio) ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <p
          className={`font-mono text-[10px] text-[#888888]/60 tracking-widest transition-opacity duration-500
            ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          SPACE · F · ESC · ← →
        </p>
      </div>

    </div>
  );
}
