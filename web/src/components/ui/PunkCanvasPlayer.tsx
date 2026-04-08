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
}: PunkCanvasPlayerProps) {
  // ─── REFS ────────────────────────────────────────────────────────────
  const videoRef      = useRef<HTMLVideoElement>(null);   // Decodificador oculto
  const canvasRef     = useRef<HTMLCanvasElement>(null);  // Superficie visible
  const containerRef  = useRef<HTMLDivElement>(null);     // Target para requestFullscreen()
  const rafId         = useRef<number>(0);                // ID del requestAnimationFrame
  const lastTimeRef   = useRef<number>(0);                // Throttle del setCurrentTime
  const isLoopActive  = useRef<boolean>(false);           // Guardia anti-doble-loop
  // Tamaño del canvas medido por ResizeObserver, NUNCA dentro del rAF
  // (getBoundingClientRect dentro de rAF causa forced reflow → fps drops en Chrome iGPU)
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

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

  // ─── RESIZE OBSERVER: mide el canvas UNA SOLA VEZ por cambio de tamaño ────
  // Jamás dentro del rAF. Forced reflow en cada frame = muerte en Chrome/iGPU.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      // Sincronizar dimensiones intrínsecas del canvas al tamaño CSS
      canvas.width  = Math.round(width);
      canvas.height = Math.round(height);
      // Guardar en ref para el render loop (sin triggear re-render de React)
      canvasSizeRef.current = { w: Math.round(width), h: Math.round(height) };
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // ─── RENDER LOOP — WAVE 2528.2 ─────────────────────────────────────
  // God Mode Context: alpha:false (menos memoria VRAM) + desynchronized:true
  // (saltarse la cola de composición del navegador → latencia mínima).
  // requestVideoFrameCallback: dispara SOLO cuando hay frame nuevo decodificado.
  // En una pantalla a 120Hz reproduciendo vídeo a 30fps, rAF ejecutaría 4 veces
  // por cada frame útil. rvFC ejecuta EXACTAMENTE 1 vez por frame. Cero ciclos
  // malgastados. Fallback a rAF para Safari/Firefox.
  const startLoop = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    // God Mode: alpha:false ahorra un buffer de canal alfa en VRAM.
    // desynchronized:true salta la sincronización con el compositor del navegador.
    const ctx = canvas?.getContext('2d', { alpha: false, desynchronized: true });
    if (!video || !canvas || !ctx) return;

    if (isLoopActive.current) return;
    isLoopActive.current = true;

    const draw = () => {
      // Leer tamaño desde ref — CERO accesos al DOM, cero reflow (WAVE 2528)
      const { w, h } = canvasSizeRef.current;
      if (video.readyState < 2 || video.videoWidth === 0 || w === 0 || h === 0) return;

      // Letterboxing con ENTEROS PUROS — sin decimales = sin sub-pixel blitting
      // Chrome fuerza antialiasing en la iGPU si recibe valores flotantes → destroza fps
      const va = video.videoWidth / video.videoHeight;
      const ca = w / h;
      let dw: number, dh: number, ox: number, oy: number;

      if (ca > va) {
        dh = h; dw = dh * va; ox = (w - dw) / 2; oy = 0;
      } else {
        dw = w; dh = dw / va; ox = 0; oy = (h - dh) / 2;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      // Math.floor en TODOS los parámetros: fuerza integer blitting en iGPU
      ctx.drawImage(video,
        Math.floor(ox), Math.floor(oy),
        Math.floor(dw), Math.floor(dh)
      );

      // Throttle de setCurrentTime: solo cada 250ms
      const now = performance.now();
      if (now - lastTimeRef.current > 250) {
        lastTimeRef.current = now;
        setCurrentTime(video.currentTime);
      }
    };

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      // Ruta Chromium: callback disparado SOLO al llegar un frame nuevo del decoder.
      // Esto elimina el problema de 120Hz vs 30fps: ejecuta exactamente 30/60 veces/s.
      const frameCallback = () => {
        draw();
        if (!video.paused && !video.ended) {
          rafId.current = video.requestVideoFrameCallback(frameCallback) as unknown as number;
        } else {
          isLoopActive.current = false;
        }
      };
      rafId.current = video.requestVideoFrameCallback(frameCallback) as unknown as number;
    } else {
      // Fallback Safari / Firefox: rAF clásico sin frame skipping
      // (en estos navegadores no hay el problema de 120Hz Optimus)
      const frame = () => {
        draw();
        if (!video.paused && !video.ended) {
          rafId.current = requestAnimationFrame(frame);
        } else {
          isLoopActive.current = false;
        }
      };
      rafId.current = requestAnimationFrame(frame);
    }
  }, []);

  const stopLoop = useCallback(() => {
    const video = videoRef.current;
    // Cancelar el mecanismo correcto según el que esté activo
    if (video && 'cancelVideoFrameCallback' in HTMLVideoElement.prototype) {
      video.cancelVideoFrameCallback(rafId.current);
    } else {
      cancelAnimationFrame(rafId.current);
    }
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
  // WAVE 2529: Player inline (NO fixed). El usuario controla el fullscreen con ⛶.
  // cursor-none cuando los controles están ocultos (modo cine inmersivo).
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black flex flex-col select-none overflow-hidden
        ${showControls ? 'cursor-default' : 'cursor-none'}`}
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

      {/* ── CANVAS VISIBLE: Recibe los frames del decoder ──
          will-change:transform → compositor layer propio antes del fullscreen (sin jank).
          imageRendering:pixelated → desactiva bilinear filtering → libera iGPU ~2%.
      */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full block cursor-pointer"
        style={{
          background: '#000000',
          willChange: 'transform',
          transform: 'translateZ(0)',
          imageRendering: 'pixelated',
        }}
        onClick={handlePlayPause}
        aria-label={`Reproducir o pausar: ${title}`}
      />

      {/* ── OVERLAY TOP: título + botón cerrar ── */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-start justify-between
          px-4 pt-3 pb-10
          bg-gradient-to-b from-black/80 to-transparent
          transition-all duration-300 pointer-events-none
          ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Título */}
        <div>
          <span className="font-plex-mono text-[10px] tracking-[0.3em] uppercase text-[#00F2A9]/60">
            // LUXSYNC DEMO
          </span>
          <p className="font-plex-mono text-sm text-[#EAEAEA] tracking-wider mt-0.5">{title}</p>
        </div>

        {/* Botón cerrar — pointer-events se restauran solo en él */}
        <button
          onClick={onClose}
          className="pointer-events-auto font-plex-mono text-[10px] tracking-widest
            border border-[#00F2A9]/30 hover:border-[#00F2A9]
            text-[#00F2A9]/60 hover:text-[#00F2A9]
            px-3 py-1.5 rounded
            bg-[#0A0A1A]/70 backdrop-blur-md
            transition-all duration-200 cursor-pointer
            hover:shadow-[0_0_12px_rgba(0,242,169,0.25)]"
          aria-label="Cerrar reproductor"
        >
          [ X ] CERRAR
        </button>
      </div>

      {/* ── SPINNER DE BUFFERING — Anillo ciberpunk ── */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-12 h-12">
            {/* Anillo base — muy sutil */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00F2A9]/10" />
            {/* Anillo giratorio con glow menta */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00F2A9]
              animate-spin shadow-[0_0_10px_rgba(0,242,169,0.4)]" />
          </div>
          <span className="absolute mt-20 font-plex-mono text-[9px] text-[#00F2A9]/40 tracking-[0.3em] uppercase">
            buffering
          </span>
        </div>
      )}

      {/* ── COCKPIT: BARRA DE CONTROLES (glassmorphism) ── */}
      <div
        className={`absolute bottom-0 left-0 right-0
          bg-[#0A0A1A]/60 backdrop-blur-md
          border-t border-[#00F2A9]/20
          pt-3 pb-3 px-4
          transition-all duration-300
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >

        {/* ── SEEKBAR DMX LASER GLOW ── */}
        <div
          className="relative w-full h-4 flex items-center cursor-pointer mb-2.5 group"
          onClick={handleSeek}
          role="slider"
          aria-label="Progreso del vídeo"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          {/* Track — riel base */}
          <div className="absolute w-full h-1.5 group-hover:h-2 bg-[#0A0A1A] border border-[#00F2A9]/20 rounded-full transition-all duration-200" />
          {/* Progress — láser menta con glow */}
          <div
            className="absolute h-1.5 group-hover:h-2 bg-[#00F2A9] rounded-full transition-all duration-200"
            style={{
              width: `${progressPercent}%`,
              boxShadow: '0 0 10px rgba(0,242,169,0.6), 0 0 20px rgba(0,242,169,0.2)',
            }}
          />
          {/* Thumb — aparece en hover */}
          <div
            className="absolute w-3 h-3 rounded-full bg-[#00F2A9] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{
              left: `${progressPercent}%`,
              boxShadow: '0 0 8px rgba(0,242,169,0.9)',
            }}
          />
        </div>

        {/* ── FILA DE CONTROLES ── */}
        <div className="flex items-center gap-3">

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="text-white/70 hover:text-[#00F2A9] hover:scale-110
              transition-all duration-150 cursor-pointer
              w-8 h-8 flex items-center justify-center flex-shrink-0"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <rect x="2" y="2" width="4" height="12" rx="1" />
                <rect x="10" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
              </svg>
            )}
          </button>

          {/* TIMESTAMP — fuente plex-mono, color menta atenuado */}
          <span className="font-plex-mono text-xs text-[#00F2A9]/80 flex-shrink-0 tabular-nums tracking-wider">
            {formatTime(currentTime)}<span className="opacity-30 mx-1">/</span>{formatTime(duration)}
          </span>

          {/* SPACER */}
          <div className="flex-1" />

          {/* HINT teclado — centrado sutil */}
          <span className="hidden md:inline font-plex-mono text-[9px] text-[#888888]/40 tracking-[0.2em] uppercase flex-shrink-0">
            SPACE · F · ← →
          </span>

          <div className="flex-1" />

          {/* MUTE */}
          <button
            onClick={toggleMute}
            className="text-white/70 hover:text-[#00F2A9] hover:scale-110
              transition-all duration-150 cursor-pointer
              w-7 h-7 flex items-center justify-center flex-shrink-0"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M6 3L2 6H0v4h2l4 3V3z" />
                <line x1="9" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="5" x2="9" y2="11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M6 3L2 6H0v4h2l4 3V3zm3.54 1.46A4.98 4.98 0 0 1 11 8a4.98 4.98 0 0 1-1.46 3.54l1.06 1.06A6.47 6.47 0 0 0 12.5 8a6.47 6.47 0 0 0-1.9-4.6l-1.06 1.06z"/>
              </svg>
            )}
          </button>

          {/* Barra de volumen */}
          <div
            className="hidden sm:flex items-center w-16 h-5 cursor-pointer group flex-shrink-0"
            onClick={handleVolumeChange}
            role="slider"
            aria-label="Volumen"
            aria-valuenow={isMuted ? 0 : volume}
            aria-valuemin={0}
            aria-valuemax={1}
          >
            <div className="relative w-full h-1 group-hover:h-1.5 rounded-full bg-[#333333] transition-all duration-200">
              <div
                className="absolute h-full bg-[#888888] group-hover:bg-[#00F2A9] rounded-full transition-colors duration-200"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>

          {/* FULLSCREEN — ⭐ EL CORAZÓN DEL BYPASS ── */}
          {/* requestFullscreen sobre el DIV, no el <video>. Chrome no activa Hardware Overlay. */}
          <button
            onClick={handleFullscreen}
            className="text-white/70 hover:text-[#00F2A9] hover:scale-110
              transition-all duration-150 cursor-pointer
              w-7 h-7 flex items-center justify-center flex-shrink-0"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title="F — Fullscreen bypass (div.requestFullscreen)"
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

    </div>
  );
}
