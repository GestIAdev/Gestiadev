'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import { supabase, fetchCategories, fetchThreads, insertThread, fetchReplies, insertReply, fetchProfile, updateProfile, updateThread, deleteThread, updateReply, deleteReply } from '@/lib/supabaseClient';
import type { DbCategory, DbThread, DbReply, DbProfile } from '@/lib/supabaseClient';
import type { View } from '@/app/page';

// ============================================================
// ICONOS SVG INLINE (Retro-Terminal, strokeWidth 1.5)
// ============================================================
const IconMegaphone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l16-8v18L3 13H1v-2h2z" />
    <path d="M7 13v5" />
  </svg>
);

const IconWrench = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconChip = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9 7V4M12 7V4M15 7V4M9 20v-3M12 20v-3M15 20v-3M4 9h3M4 12h3M4 15h3M20 9h-3M20 12h-3M20 15h-3" />
  </svg>
);

const IconMonitor = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const IconDisc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2z" />
  </svg>
);

// ============================================================
// TIPOS — aliases sobre los tipos de Supabase para la UI
// ============================================================
type Category = DbCategory;
type LiveThread = DbThread;
type LiveReply = DbReply;

// Mapa slug → icono SVG
type CategoryIcon = 'megaphone' | 'wrench' | 'chip' | 'monitor';
const SLUG_ICON_MAP: Record<string, CategoryIcon> = {
  'anuncios-oficiales': 'megaphone',
  'soporte-tecnico': 'wrench',
  'lfx-fixture-vault': 'chip',
  'showcases-setups': 'monitor',
};

// Helper: timestamp ISO → texto relativo legible
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Ahora mismo';
  if (m < 60) return `Hace ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

// ============================================================
// PARSER MULTIMEDIA — YouTube embed + texto plano
// ============================================================
const YT_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})(?:[^\s]*)?/g;

function parseTextWithMedia(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  // Clonar el regex para evitar estado global entre renders
  const re = new RegExp(YT_REGEX.source, 'g');

  while ((match = re.exec(content)) !== null) {
    // Texto previo al enlace
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`txt-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex, match.index)}
        </span>
      );
    }
    const videoId = match[1];
    nodes.push(
      <div key={`yt-${match.index}`} className="max-w-2xl w-full aspect-video my-4">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          className="w-full h-full border border-menta/40"
        />
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  // Texto restante
  if (lastIndex < content.length) {
    nodes.push(
      <span key={`txt-end`} className="whitespace-pre-wrap">
        {content.slice(lastIndex)}
      </span>
    );
  }

  return nodes.length > 0 ? nodes : [<span key="full" className="whitespace-pre-wrap">{content}</span>];
}

// ============================================================
// SUBVISTAS DEL CÓNCLAVE
// ============================================================
type ConclaveView = 'index' | 'category' | 'thread';

interface ConclaveIndexProps {
  setActiveView: (view: View) => void;
}

const ConclaveIndex = ({ setActiveView }: ConclaveIndexProps) => {
  const [conclaveView, setConclaveView] = useState<ConclaveView>('index');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedThread, setSelectedThread] = useState<LiveThread | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileUsername, setEditProfileUsername] = useState('');
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState<string | null>(null);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const authButtonRef = React.useRef<HTMLButtonElement>(null);
  const [authMenuPos, setAuthMenuPos] = React.useState({ top: 0, right: 0 });

  // ── DATOS REALES ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<LiveThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, thrs] = await Promise.all([fetchCategories(), fetchThreads()]);
      setCategories(cats);
      setThreads(thrs);
    } catch (err) {
      console.error('[Cónclave] Error cargando datos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── AUTH STATE + DREAM CATCHER (Atrapasueños) ──
  // El "Atrapasueños" engancha Supabase onAuthStateChange para capturar el token
  // cuando regresa del OAuth provider. Limpia automáticamente la URL porquería sin recargar.
  useEffect(() => {
    // 1. Obtener la sesión actual si ya existe (ej. tab refresco, SSR hydration)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.id) {
        fetchProfile(data.session.user.id).then((p) => {
          setProfile(p);
          if (p && !p.username) setShowOnboarding(true);
        });
      }
    });

    // 2. El "Atrapasueños": Escuchar cuando Supabase procesa el token de la URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      
      // 💎 Estética Cyberpunk: Limpiar el chorrón de parámetros de la URL sin recargar
      if (_event === 'SIGNED_IN') {
        window.history.replaceState({}, document.title, window.location.pathname);
        // Cargar perfil tras login exitoso
        if (newSession?.user?.id) {
          fetchProfile(newSession.user.id).then((p) => {
            setProfile(p);
            if (p && !p.username) setShowOnboarding(true);
          });
        }
      }
      // Limpiar perfil al cerrar sesión
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
        setShowOnboarding(false);
      }
    });

    // 3. Cargar datos del foro
    loadData();

    // 4. Limpieza: desuscribirse del listener al desmontar
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular posición del dropdown cuando se abre
  useEffect(() => {
    if (showAuthMenu && authButtonRef.current) {
      const rect = authButtonRef.current.getBoundingClientRect();
      setAuthMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showAuthMenu]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // ── MAP ICON → COMPONENTE ──
  const categoryIconMap: Record<CategoryIcon, React.ReactNode> = {
    megaphone: <IconMegaphone />,
    wrench: <IconWrench />,
    chip: <IconChip />,
    monitor: <IconMonitor />,
  };

  // ── SKELETON DE CARGA ──
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-sm font-plex-mono text-menta animate-pulse tracking-[0.2em]">
        [ CARGANDO DATOS DE LA RED NEURAL... ]
      </p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-menta/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );

  // ── RENDERIZADO CONDICIONAL DE SUBVISTAS ──
  const renderConclaveContent = () => {
    if (isLoading) return renderLoading();
    switch (conclaveView) {
      case 'category':
        return selectedCategory && (
          <ThreadList
            category={selectedCategory}
            threads={threads.filter(t => t.category?.slug === selectedCategory.slug)}
            onBack={() => setConclaveView('index')}
            onSelectThread={(thread) => { setSelectedThread(thread); setConclaveView('thread'); }}
            onCreateThread={() => setShowCreateModal(true)}
            session={session}
          />
        );
      case 'thread':
        return selectedThread && (
          <ThreadView
            thread={selectedThread}
            session={session}
            onBack={() => setConclaveView('category')}
          />
        );
      default:
        return renderIndex();
    }
  };

  // ── VISTA INDEX (principal) ──
  const renderIndex = () => (
    <>
      {/* CATEGORÍAS */}
      <h2 className="text-lg font-plex-mono font-bold text-hueso mb-4 flex items-center gap-3">
        <span className="w-1.5 h-5 bg-menta"></span> Secciones del Cónclave
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {categories.map((cat) => {
          const iconKey = SLUG_ICON_MAP[cat.slug] ?? 'monitor';
          const catThreadCount = threads.filter(t => t.category?.slug === cat.slug).length;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat); setConclaveView('category'); }}
              className="text-left border border-gris-trazado/30 p-6 bg-noche/90 backdrop-blur-md hover:border-menta/60 hover:shadow-[0_0_25px_rgba(0,242,169,0.12),inset_0_0_25px_rgba(0,242,169,0.03)] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Scan-line decorativa al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,242,169,0.015)_2px,rgba(0,242,169,0.015)_4px)] pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <span className="text-menta/50 group-hover:text-menta group-hover:drop-shadow-[0_0_6px_rgba(0,242,169,0.5)] transition-all duration-300 mt-0.5 flex-shrink-0">
                  {categoryIconMap[iconKey]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors">{cat.name}</p>
                    <span className="text-[10px] font-plex-mono text-gris-neutro/50 group-hover:text-menta/60 transition-colors tabular-nums">[{catThreadCount}]</span>
                  </div>
                  <p className="text-xs font-plex-sans text-gris-neutro/70 leading-relaxed">{cat.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* HILOS RECIENTES */}
      <h2 className="text-lg font-plex-mono font-bold text-hueso mb-4 flex items-center gap-3">
        <span className="w-1.5 h-5 bg-menta"></span> Hilos Recientes
      </h2>
      {threads.length === 0 ? (
        <div className="border border-gris-trazado/30 border-dashed p-12 text-center mb-10">
          <p className="text-sm font-plex-mono text-gris-neutro/50">Aún no hay hilos. ¡Sé el primero en publicar!</p>
        </div>
      ) : (
        <div className="flex flex-col mb-10 border border-gris-trazado/30 overflow-hidden bg-noche/80 backdrop-blur-md">
          {threads.map((thread, idx) => (
            <button
              key={thread.id}
              onClick={() => { setSelectedThread(thread); setConclaveView('thread'); }}
              className={`text-left w-full px-6 py-5 hover:bg-menta/[0.04] transition-all duration-200 group ${
                idx < threads.length - 1 ? 'border-b border-gris-trazado/20' : ''
              }`}
            >
              {/* Badges row — cuadrados, sin rounded-full */}
              {(thread.is_pinned || thread.category) && (
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {thread.is_pinned && (
                    <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 tracking-widest">▲ PINNED</span>
                  )}
                  {thread.category && (
                    <span className="text-[10px] font-plex-mono text-gris-neutro/60 border border-gris-trazado/30 px-2 py-0.5">{thread.category.name}</span>
                  )}
                </div>
              )}
              {/* Título — prominente */}
              <p className="text-[15px] font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors leading-snug mb-3">{thread.title}</p>
              {/* Metadatos — separados con borde */}
              <div className="flex items-center gap-4 pt-2 border-t border-gris-trazado/10">
                <div className="flex items-center gap-2">
                  {thread.author?.avatar_url ? (
                    <img src={thread.author.avatar_url} alt="" className="w-4 h-4 border border-gris-trazado/40 object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="w-4 h-4 border border-gris-trazado/40 bg-gris-trazado/20 flex items-center justify-center text-[8px] font-plex-mono text-gris-neutro">
                      {(thread.author?.username ?? '?')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="text-[11px] font-plex-mono text-menta/70">{thread.author?.username ?? 'anon'}</span>
                </div>
                <span className="text-[10px] font-plex-mono text-gris-neutro/40 tabular-nums">{thread.reply_count} resp.</span>
                <span className="text-[10px] font-plex-mono text-gris-neutro/30 tabular-nums">{relativeTime(thread.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );

  // ── RENDER PRINCIPAL ──
  return (
    <motion.section
      className="w-full max-w-[1200px] relative z-20"
      key="conclave-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* HERO HEADER */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-10 gap-4 p-6 rounded-xl bg-noche/40 backdrop-blur-sm border border-menta/10">
        <div>
          <p className="text-[10px] font-plex-mono text-menta/60 tracking-[0.3em] uppercase mb-2">
            // WAVE 2503 · Foro Nativo
          </p>
          <h1 className="text-3xl lg:text-4xl font-plex-mono font-bold text-hueso tracking-tight">
            EL <span className="text-menta">CÓNCLAVE</span>
          </h1>
          <p className="mt-2 text-sm font-plex-sans text-gris-neutro max-w-lg leading-relaxed">
            Foro de soporte, discusión comunitaria y librería pública de fixtures <span className="text-yellow-500">.lfx</span> para LuxSync Commander.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {session ? (
            <div className="flex items-center gap-3">
              {/* Badge de identidad */}
              {profile && (
                <button
                  type="button"
                  onClick={() => { setEditProfileUsername(profile.username ?? ''); setEditProfileError(null); setIsEditingProfile(true); }}
                  className="flex items-center gap-2.5 border border-menta/20 bg-noche/60 backdrop-blur-sm px-2.5 py-1.5 hover:ring-1 hover:ring-menta/50 transition-all cursor-pointer"
                  title="Editar perfil"
                >
                  {/* Avatar cuadrado — sin border-radius, estética terminal */}
                  <div
                    className="w-6 h-6 border border-menta/40 bg-noche overflow-hidden flex-shrink-0 relative"
                    style={{ imageRendering: 'pixelated' }}
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username ?? 'avatar'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-menta/60 text-[9px] font-plex-mono">
                        {(profile.username ?? '?')[0].toUpperCase()}
                      </span>
                    )}
                    {/* Dot online */}
                    <span className="absolute -bottom-px -right-px w-1.5 h-1.5 bg-menta border border-noche" />
                  </div>
                  <span className="text-[11px] font-plex-mono text-menta tracking-wide hidden sm:inline">
                    {profile.username ?? 'netrunner'}
                  </span>
                </button>
              )}

              {/* Nuevo Hilo */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-transparent border border-menta text-menta font-plex-mono text-xs px-4 py-2.5 rounded-md hover:bg-menta/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
              >
                + Nuevo Hilo
              </button>

              {/* Logout */}
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-[10px] font-plex-mono text-gris-neutro/40 hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                ↙ OUT
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Botón principal de login */}
              <button
                ref={authButtonRef}
                onClick={() => { setShowAuthMenu(v => !v); setShowEmailInput(false); setMagicLinkSent(false); }}
                className="flex items-center gap-2 bg-transparent border border-gris-neutro text-gris-neutro font-plex-mono text-xs px-4 py-2.5 rounded-md hover:border-menta hover:text-menta hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all"
              >
                ↗ Identificarse
              </button>

              {/* Menú desplegable retro-terminal — PORTALED */}
              {showAuthMenu && createPortal(
                <div 
                  className="fixed w-64 border border-menta/40 rounded-lg bg-noche/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,169,0.1)] z-[9999] overflow-hidden"
                  style={{ top: `${authMenuPos.top}px`, right: `${authMenuPos.right}px` }}
                >
                  {/* Header del menú */}
                  <div className="px-4 py-2.5 border-b border-gris-trazado/50 flex items-center justify-between">
                    <span className="text-[10px] font-plex-mono text-menta/60 tracking-[0.2em]">// AUTH GATEWAY</span>
                    <button onClick={() => setShowAuthMenu(false)} className="text-gris-neutro hover:text-hueso text-xs leading-none">✕</button>
                  </div>

                  {!showEmailInput ? (
                    <div className="p-2 flex flex-col gap-1">
                      {/* Google */}
                      <button
                        onClick={() => { supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } }); setShowAuthMenu(false); }}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded text-xs font-plex-mono text-hueso hover:bg-menta/10 hover:text-menta transition-colors group"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Entrar con Google</span>
                      </button>

                      {/* Discord */}
                      <button
                        onClick={() => { supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: `${window.location.origin}/` } }); setShowAuthMenu(false); }}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded text-xs font-plex-mono text-hueso hover:bg-menta/10 hover:text-menta transition-colors group"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        <span>Entrar con Discord</span>
                      </button>

                      {/* Separador */}
                      <div className="flex items-center gap-2 px-3 py-1">
                        <div className="flex-1 h-px bg-gris-trazado/40"></div>
                        <span className="text-[9px] font-plex-mono text-gris-neutro/50 tracking-widest">O</span>
                        <div className="flex-1 h-px bg-gris-trazado/40"></div>
                      </div>

                      {/* Magic Link */}
                      <button
                        onClick={() => setShowEmailInput(true)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded text-xs font-plex-mono text-hueso hover:bg-menta/10 hover:text-menta transition-colors group"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <span>Magic Link (Email)</span>
                      </button>
                    </div>
                  ) : magicLinkSent ? (
                    /* Confirmación de envío */
                    <div className="p-4 flex flex-col items-center gap-3 text-center">
                      <span className="text-menta text-lg">✓</span>
                      <p className="text-xs font-plex-mono text-menta leading-relaxed tracking-wide">
                        [ ENLACE DE ACCESO<br/>ENVIADO AL CORREO ]
                      </p>
                      <p className="text-[10px] font-plex-sans text-gris-neutro">{magicLinkEmail}</p>
                      <button
                        onClick={() => { setShowAuthMenu(false); setShowEmailInput(false); setMagicLinkSent(false); setMagicLinkEmail(''); }}
                        className="text-[10px] font-plex-mono text-gris-neutro hover:text-hueso transition-colors mt-1"
                      >
                        Cerrar
                      </button>
                    </div>
                  ) : (
                    /* Input de email para Magic Link */
                    <div className="p-3 flex flex-col gap-2">
                      <p className="text-[10px] font-plex-mono text-menta/60 tracking-widest px-1">// MAGIC LINK</p>
                      <input
                        type="email"
                        value={magicLinkEmail}
                        onChange={(e) => setMagicLinkEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (async () => {
                              if (!magicLinkEmail.trim()) return;
                              setMagicLinkLoading(true);
                              await supabase.auth.signInWithOtp({ email: magicLinkEmail.trim() });
                              setMagicLinkLoading(false);
                              setMagicLinkSent(true);
                            })();
                          }
                          if (e.key === 'Escape') { setShowEmailInput(false); }
                        }}
                        placeholder="tu@correo.com"
                        autoFocus
                        className="w-full bg-noche border border-gris-trazado/50 rounded px-3 py-2 text-xs font-plex-mono text-hueso placeholder:text-gris-neutro/40 focus:outline-none focus:border-menta/60 transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowEmailInput(false)}
                          className="flex-1 text-[10px] font-plex-mono text-gris-neutro border border-gris-trazado/40 px-2 py-1.5 rounded hover:border-hueso hover:text-hueso transition-colors"
                        >
                          ← Volver
                        </button>
                        <button
                          disabled={magicLinkLoading || !magicLinkEmail.trim()}
                          onClick={async () => {
                            if (!magicLinkEmail.trim()) return;
                            setMagicLinkLoading(true);
                            await supabase.auth.signInWithOtp({ email: magicLinkEmail.trim() });
                            setMagicLinkLoading(false);
                            setMagicLinkSent(true);
                          }}
                          className="flex-1 text-[10px] font-plex-mono text-noche bg-menta font-bold px-2 py-1.5 rounded hover:bg-menta/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {magicLinkLoading ? '...' : 'Enviar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>,
                document.body
              )}
            </div>
          )}
          <div className="flex items-center gap-2 border border-menta/30 rounded-full px-3 py-2 bg-noche/60 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-menta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-menta"></span>
            </span>
            <span className="text-[11px] font-plex-mono text-menta">6 online</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <AnimatePresence mode="wait">
        <motion.div
          key={conclaveView + (selectedCategory?.slug || '') + (selectedThread?.id || '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderConclaveContent()}
        </motion.div>
      </AnimatePresence>

      {/* MODAL CREAR HILO */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateThreadModal
            categories={categories}
            session={session}
            onClose={() => setShowCreateModal(false)}
            onPublished={() => { loadData(); setShowCreateModal(false); }}
          />
        )}
      </AnimatePresence>

      {/* ONBOARDING — Elegir alias en primer login */}
      <AnimatePresence>
        {showOnboarding && session?.user?.id && (
          <OnboardingModal
            userId={session.user.id}
            onComplete={(username) => {
              setProfile((prev) => prev ? { ...prev, username } : prev);
              setShowOnboarding(false);
            }}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </AnimatePresence>

      {/* EDITAR PERFIL — Modal inline */}
      <AnimatePresence>
        {isEditingProfile && session?.user?.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-noche/85 backdrop-blur-md p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsEditingProfile(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm border border-menta/30 bg-noche p-6 shadow-[0_0_40px_rgba(0,242,169,0.06)]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-plex-mono font-bold text-hueso flex items-center gap-2">
                  <span className="w-1 h-4 bg-menta inline-block" />
                  Editar Alias
                </h3>
                <button onClick={() => setIsEditingProfile(false)} className="text-gris-neutro hover:text-hueso transition-colors text-lg leading-none">✕</button>
              </div>
              {profile?.avatar_url && (
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gris-trazado/20">
                  <img src={profile.avatar_url} alt="" className="w-8 h-8 border border-gris-trazado/40 object-cover" referrerPolicy="no-referrer" />
                  <span className="text-[10px] font-plex-mono text-gris-neutro/50">Avatar sincronizado desde OAuth</span>
                </div>
              )}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const clean = editProfileUsername.trim();
                  if (clean.length < 3 || clean.length > 24) {
                    setEditProfileError('Entre 3 y 24 caracteres.');
                    return;
                  }
                  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
                    setEditProfileError('Solo letras, números, _ y -');
                    return;
                  }
                  setEditProfileLoading(true);
                  setEditProfileError(null);
                  try {
                    await updateProfile(session!.user.id, { username: clean });
                    setProfile((prev) => prev ? { ...prev, username: clean } : prev);
                    setIsEditingProfile(false);
                  } catch (err: any) {
                    setEditProfileError(err.message ?? 'Error al guardar.');
                  } finally {
                    setEditProfileLoading(false);
                  }
                }}
              >
                <label className="block text-[10px] font-plex-mono text-gris-neutro/60 uppercase tracking-wider mb-2">
                  Nuevo Alias
                </label>
                <input
                  value={editProfileUsername}
                  onChange={(e) => setEditProfileUsername(e.target.value)}
                  placeholder="netrunner_42"
                  maxLength={24}
                  className="w-full bg-noche border border-gris-trazado/40 px-4 py-3 text-sm font-plex-mono text-hueso placeholder:text-gris-neutro/30 focus:outline-none focus:border-menta/50 mb-4"
                />
                {editProfileError && (
                  <p className="text-xs text-red-400 font-plex-mono mb-3">{editProfileError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={editProfileLoading || !editProfileUsername.trim()}
                    className="flex-1 text-xs font-plex-mono text-noche bg-menta py-2 disabled:opacity-40 hover:bg-menta/90 transition-colors"
                  >
                    {editProfileLoading ? '...' : '[ GUARDAR ]'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs font-plex-mono text-gris-neutro border border-gris-trazado/30 px-4 py-2 hover:text-hueso transition-colors"
                  >
                    [ CANCELAR ]
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RETORNO */}
      <button
        onClick={() => setActiveView('hero')}
        className="border border-gris-trazado text-gris-neutro px-5 py-2 font-plex-mono text-sm hover:border-menta hover:text-menta transition-colors duration-200"
      >
        ← RETORNAR AL INICIO
      </button>
    </motion.section>
  );
};

// ============================================================
// THREADLIST — Vista de categoría con lista de hilos
// ============================================================
interface ThreadListProps {
  category: Category;
  threads: LiveThread[];
  onBack: () => void;
  onSelectThread: (thread: LiveThread) => void;
  onCreateThread: () => void;
  session?: Session | null;
}

const ThreadList = ({ category, threads, onBack, onSelectThread, onCreateThread, session }: ThreadListProps & { session: Session | null }) => {
  const categoryIconMap: Record<CategoryIcon, React.ReactNode> = {
    megaphone: <IconMegaphone />,
    wrench: <IconWrench />,
    chip: <IconChip />,
    monitor: <IconMonitor />,
  };
  const iconKey = SLUG_ICON_MAP[category.slug] ?? 'monitor';
  return (
  <div className="bg-noche/80 backdrop-blur-md border border-gris-trazado/30 p-6">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <button onClick={onBack} className="text-xs font-plex-mono text-menta/70 hover:text-menta transition-colors">
        El Cónclave
      </button>
      <span className="text-xs text-gris-neutro">/</span>
      <span className="text-xs font-plex-mono text-hueso">{category.name}</span>
    </div>

    {/* Category Header */}
    <div className="flex items-center gap-3 mb-6">
      <span className="text-menta/70">{categoryIconMap[iconKey]}</span>
      <div>
        <h2 className="text-xl font-plex-mono font-bold text-hueso">{category.name}</h2>
        <p className="text-xs font-plex-sans text-gris-neutro">{category.description}</p>
      </div>
    </div>

    {/* Thread List */}
    {threads.length === 0 ? (
      <div className="border border-gris-trazado/30 border-dashed p-12 text-center">
        <p className="text-sm font-plex-mono text-gris-neutro/60">No hay hilos en esta categoría todavía.</p>
        {session && (
          <button onClick={onCreateThread} className="mt-3 text-xs font-plex-mono text-menta hover:underline">
            Sé el primero en publicar →
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-col mb-8 border border-gris-trazado/30 overflow-hidden bg-noche/80 backdrop-blur-md">
        {threads.map((thread, idx) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            className={`text-left w-full px-6 py-5 hover:bg-menta/[0.04] transition-all duration-200 group ${
              idx < threads.length - 1 ? 'border-b border-gris-trazado/20' : ''
            }`}
          >
            {thread.is_pinned && (
              <div className="mb-2.5">
                <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 tracking-widest">▲ PINNED</span>
              </div>
            )}
            <p className="text-[15px] font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors leading-snug mb-3">{thread.title}</p>
            <div className="flex items-center gap-4 pt-2 border-t border-gris-trazado/10">
              <div className="flex items-center gap-2">
                {thread.author?.avatar_url ? (
                  <img src={thread.author.avatar_url} alt="" className="w-4 h-4 border border-gris-trazado/40 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="w-4 h-4 border border-gris-trazado/40 bg-gris-trazado/20 flex items-center justify-center text-[8px] font-plex-mono text-gris-neutro">
                    {(thread.author?.username ?? '?')[0].toUpperCase()}
                  </span>
                )}
                <span className="text-[11px] font-plex-mono text-menta/70">{thread.author?.username ?? 'anon'}</span>
              </div>
              <span className="text-[10px] font-plex-mono text-gris-neutro/40 tabular-nums">{thread.reply_count} resp.</span>
              <span className="text-[10px] font-plex-mono text-gris-neutro/30 tabular-nums">{relativeTime(thread.created_at)}</span>
            </div>
          </button>
        ))}
      </div>
    )}

    <button
      onClick={onBack}
      className="text-xs font-plex-mono text-gris-neutro hover:text-menta transition-colors"
    >
      ← Volver a secciones
    </button>
  </div>
  );
};

// ============================================================
// THREADVIEW — Vista de hilo con respuestas y datos reales (WAVE 2509)
// ============================================================
interface ThreadViewProps {
  thread: LiveThread;
  session: Session | null;
  onBack: () => void;
}

const ThreadView = ({ thread, session, onBack }: ThreadViewProps) => {
  const [replies, setReplies] = useState<LiveReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // ── Estado CRUD hilo ──
  const [editingThread, setEditingThread] = useState(false);
  const [editThreadTitle, setEditThreadTitle] = useState(thread.title);
  const [editThreadContent, setEditThreadContent] = useState(thread.content);
  const [threadActionLoading, setThreadActionLoading] = useState(false);
  const [threadActionError, setThreadActionError] = useState<string | null>(null);
  const [threadDeleted, setThreadDeleted] = useState(false);

  // ── Estado CRUD replies ──
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [replyActionLoading, setReplyActionLoading] = useState(false);
  const [replyActionError, setReplyActionError] = useState<string | null>(null);

  const isThreadAuthor = !!session?.user?.id && session.user.id === thread.author_id;

  useEffect(() => {
    setRepliesLoading(true);
    fetchReplies(thread.id)
      .then(setReplies)
      .catch(console.error)
      .finally(() => setRepliesLoading(false));
  }, [thread.id]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !replyContent.trim()) return;
    setReplySubmitting(true);
    setReplyError(null);
    try {
      await insertReply({
        thread_id: thread.id,
        author_id: session.user.id,
        content: replyContent.trim(),
      });
      setReplyContent('');
      const updated = await fetchReplies(thread.id);
      setReplies(updated);
    } catch (err: any) {
      setReplyError(err.message ?? 'Error al enviar respuesta.');
    } finally {
      setReplySubmitting(false);
    }
  };

  // ── Handlers CRUD hilo ──
  const handleThreadSave = async () => {
    if (!session?.user?.id) return;
    setThreadActionLoading(true);
    setThreadActionError(null);
    try {
      await updateThread(thread.id, session.user.id, {
        title: editThreadTitle.trim(),
        content: editThreadContent.trim(),
      });
      thread.title = editThreadTitle.trim();
      thread.content = editThreadContent.trim();
      setEditingThread(false);
    } catch (err: any) {
      setThreadActionError(err.message ?? 'Error al guardar.');
    } finally {
      setThreadActionLoading(false);
    }
  };

  const handleThreadDelete = async () => {
    if (!session?.user?.id) return;
    if (!window.confirm('¿Borrar este hilo permanentemente?')) return;
    setThreadActionLoading(true);
    setThreadActionError(null);
    try {
      await deleteThread(thread.id, session.user.id);
      setThreadDeleted(true);
      setTimeout(onBack, 800);
    } catch (err: any) {
      setThreadActionError(err.message ?? 'Error al borrar.');
      setThreadActionLoading(false);
    }
  };

  // ── Handlers CRUD reply ──
  const handleReplyEditStart = (reply: LiveReply) => {
    setEditingReplyId(reply.id);
    setEditReplyContent(reply.content);
    setReplyActionError(null);
  };

  const handleReplyEditSave = async (replyId: string) => {
    if (!session?.user?.id) return;
    setReplyActionLoading(true);
    setReplyActionError(null);
    try {
      await updateReply(replyId, session.user.id, editReplyContent.trim());
      setReplies(prev => prev.map(r => r.id === replyId ? { ...r, content: editReplyContent.trim() } : r));
      setEditingReplyId(null);
    } catch (err: any) {
      setReplyActionError(err.message ?? 'Error al guardar respuesta.');
    } finally {
      setReplyActionLoading(false);
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    if (!session?.user?.id) return;
    if (!window.confirm('¿Borrar esta respuesta?')) return;
    setReplyActionLoading(true);
    setReplyActionError(null);
    try {
      await deleteReply(replyId, session.user.id);
      setReplies(prev => prev.filter(r => r.id !== replyId));
    } catch (err: any) {
      setReplyActionError(err.message ?? 'Error al borrar respuesta.');
    } finally {
      setReplyActionLoading(false);
    }
  };

  if (threadDeleted) {
    return (
      <div className="text-center py-12">
        <p className="text-xs font-plex-mono text-menta/60">// Hilo eliminado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="text-xs font-plex-mono text-menta/70 hover:text-menta transition-colors">
          ← {thread.category?.name ?? 'Categoría'}
        </button>
      </div>

      {/* Thread Header */}
      <div className="bg-gradient-to-br from-noche/95 to-noche/80 backdrop-blur-md shadow-2xl border border-gris-trazado/30 border-l-4 border-l-menta/60 p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          {thread.is_pinned && (
            <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 tracking-widest">▲ PINNED</span>
          )}
          {/* Botones de propiedad — solo al autor */}
          {isThreadAuthor && !editingThread && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => { setEditingThread(true); setThreadActionError(null); }}
                className="text-[10px] font-plex-mono text-gris-neutro/50 border border-gris-trazado/30 px-2 py-0.5 hover:text-menta hover:border-menta/40 transition-colors"
              >
                [ EDITAR ]
              </button>
              <button
                onClick={handleThreadDelete}
                disabled={threadActionLoading}
                className="text-[10px] font-plex-mono text-gris-neutro/50 border border-gris-trazado/30 px-2 py-0.5 hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-30"
              >
                [ BORRAR ]
              </button>
            </div>
          )}
        </div>

        {editingThread ? (
          <>
            <input
              value={editThreadTitle}
              onChange={(e) => setEditThreadTitle(e.target.value)}
              className="w-full bg-noche/80 border border-gris-trazado/40 px-3 py-2 text-lg font-plex-mono font-bold text-hueso focus:outline-none focus:border-menta/50 mb-3"
            />
            <textarea
              value={editThreadContent}
              onChange={(e) => setEditThreadContent(e.target.value)}
              rows={6}
              className="w-full bg-noche/80 border border-gris-trazado/40 px-3 py-2 text-sm font-plex-sans text-hueso focus:outline-none focus:border-menta/50 resize-none mb-3"
            />
            {threadActionError && <p className="text-xs text-red-400 font-plex-mono mb-2">{threadActionError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleThreadSave}
                disabled={threadActionLoading || !editThreadTitle.trim() || !editThreadContent.trim()}
                className="text-[10px] font-plex-mono text-noche bg-menta px-4 py-1.5 disabled:opacity-40 hover:bg-menta/90 transition-colors"
              >
                {threadActionLoading ? '...' : '[ GUARDAR ]'}
              </button>
              <button
                onClick={() => { setEditingThread(false); setEditThreadTitle(thread.title); setEditThreadContent(thread.content); }}
                className="text-[10px] font-plex-mono text-gris-neutro border border-gris-trazado/40 px-4 py-1.5 hover:text-hueso transition-colors"
              >
                [ CANCELAR ]
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-plex-mono font-bold text-hueso mb-4 leading-tight">{thread.title}</h2>
            <div className="border-t border-gris-trazado/30 pt-4 mb-4">
              <div className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
                {parseTextWithMedia(thread.content)}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-gris-trazado/20">
          {thread.author?.avatar_url ? (
            <img src={thread.author.avatar_url} alt="" className="w-5 h-5 border border-gris-trazado/40 object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="w-5 h-5 border border-gris-trazado/40 bg-gris-trazado/20 flex items-center justify-center text-[9px] font-plex-mono text-gris-neutro">
              {(thread.author?.username ?? '?')[0].toUpperCase()}
            </span>
          )}
          <span className="text-xs font-plex-mono text-menta/70">{thread.author?.username ?? 'anon'}</span>
          <span className="text-xs font-plex-sans text-gris-neutro/40">{relativeTime(thread.created_at)}</span>
        </div>
      </div>

      {/* Replies Header */}
      <h3 className="text-sm font-plex-mono font-bold text-hueso mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-menta inline-block"></span>
        {replies.length} Respuestas
      </h3>

      {replyActionError && (
        <p className="text-xs text-red-400 font-plex-mono mb-3">{replyActionError}</p>
      )}

      {/* Replies List */}
      <div className="flex flex-col mb-8">
        {repliesLoading ? (
          <p className="text-xs font-plex-mono text-gris-neutro/40 text-center py-8">Cargando respuestas...</p>
        ) : replies.length === 0 ? (
          <div className="border border-gris-trazado/20 border-dashed p-10 text-center">
            <p className="text-xs font-plex-mono text-gris-neutro/40">No hay respuestas todavía.{session ? ' Sé el primero.' : ''}</p>
          </div>
        ) : (
          replies.map((reply) => {
            const isReplyAuthor = !!session?.user?.id && session.user.id === reply.author_id;
            const isEditing = editingReplyId === reply.id;
            return (
              <div key={reply.id} className="relative ml-4 pl-5 mb-3 last:mb-0 group/reply">
                {/* Línea vertical del árbol */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gris-trazado/30" />
                {/* Punto de conexión */}
                <div className="absolute left-[-2px] top-5 w-[5px] h-[5px] bg-gris-trazado/50" />
                <div className="bg-[#16161a] border border-gris-trazado/30 hover:border-gris-trazado/50 transition-colors duration-200 p-4">
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gris-trazado/10">
                    {reply.author?.avatar_url ? (
                      <img src={reply.author.avatar_url} alt="" className="w-5 h-5 border border-gris-trazado/40 object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="w-5 h-5 border border-gris-trazado/40 bg-gris-trazado/20 flex items-center justify-center text-[9px] font-plex-mono text-gris-neutro">
                        {(reply.author?.username ?? '?')[0].toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-plex-mono text-menta/70">{reply.author?.username ?? 'anon'}</span>
                    <span className="text-[10px] font-plex-mono text-gris-neutro/30 tabular-nums">{relativeTime(reply.created_at)}</span>
                    {/* Botones de propiedad reply — visibles al hover del autor */}
                    {isReplyAuthor && !isEditing && (
                      <div className="flex items-center gap-1.5 ml-auto opacity-0 group-hover/reply:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleReplyEditStart(reply)}
                          className="text-[9px] font-plex-mono text-gris-neutro/40 border border-gris-trazado/20 px-1.5 py-0.5 hover:text-menta hover:border-menta/30 transition-colors"
                        >
                          [ EDITAR ]
                        </button>
                        <button
                          onClick={() => handleReplyDelete(reply.id)}
                          disabled={replyActionLoading}
                          className="text-[9px] font-plex-mono text-gris-neutro/40 border border-gris-trazado/20 px-1.5 py-0.5 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-30"
                        >
                          [ BORRAR ]
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <>
                      <textarea
                        value={editReplyContent}
                        onChange={(e) => setEditReplyContent(e.target.value)}
                        rows={3}
                        className="w-full bg-noche/80 border border-gris-trazado/40 px-3 py-2 text-sm font-plex-sans text-hueso focus:outline-none focus:border-menta/50 resize-none mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReplyEditSave(reply.id)}
                          disabled={replyActionLoading || !editReplyContent.trim()}
                          className="text-[9px] font-plex-mono text-noche bg-menta px-3 py-1 disabled:opacity-40 hover:bg-menta/90 transition-colors"
                        >
                          {replyActionLoading ? '...' : '[ GUARDAR ]'}
                        </button>
                        <button
                          onClick={() => setEditingReplyId(null)}
                          className="text-[9px] font-plex-mono text-gris-neutro border border-gris-trazado/30 px-3 py-1 hover:text-hueso transition-colors"
                        >
                          [ CANCELAR ]
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-plex-sans text-gris-neutro leading-relaxed">
                      {parseTextWithMedia(reply.content)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply form */}
      {session ? (
        <form onSubmit={handleReplySubmit} className="border border-gris-trazado/30 p-5 bg-noche/60 backdrop-blur-sm mb-8">
          <p className="text-xs font-plex-mono text-menta/60 mb-3">// Responder en este hilo</p>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            placeholder="Escribe tu respuesta... (pega un link de YouTube para embed automático)"
            className="w-full bg-noche/80 border border-gris-trazado/30 px-4 py-3 text-sm font-plex-sans text-hueso placeholder:text-gris-neutro/30 focus:outline-none focus:border-menta/50 resize-none mb-3"
          />
          {/* Placeholder Hephaestus — WAVE 2532 */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gris-trazado/10">
            <button
              type="button"
              disabled
              title="Máx. 500KB · Formatos: .lfx · Disponible en WAVE 2532 (Módulo Hefesto)"
              className="flex items-center gap-2 text-[9px] font-plex-mono text-gris-neutro/25 border border-gris-trazado/15 px-3 py-1.5 cursor-not-allowed select-none"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
              Adjuntar .LFX
            </button>
            <span className="text-[9px] font-plex-mono text-gris-neutro/20">// WAVE 2532 — Módulo Hefesto · máx. 500KB</span>
          </div>
          {replyError && <p className="text-xs text-red-400 font-plex-mono mb-2">{replyError}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={replySubmitting || !replyContent.trim()}
              className="text-xs font-plex-mono text-noche bg-menta px-5 py-2 disabled:opacity-40 hover:bg-menta/90 transition-colors"
            >
              {replySubmitting ? 'Enviando...' : '[ ENVIAR ]'}
            </button>
          </div>
        </form>
      ) : (
        <div className="border border-gris-trazado/30 border-dashed p-5 bg-noche/40 mb-8 text-center">
          <p className="text-xs font-plex-mono text-gris-neutro/40">Inicia sesión para responder en este hilo.</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// CREATETHREADMODAL — Modal con INSERT real a Supabase
// ============================================================
interface CreateThreadModalProps {
  categories: Category[];
  session: Session | null;
  onClose: () => void;
  onPublished: () => void;
}

const CreateThreadModal = ({ categories, session, onClose, onPublished }: CreateThreadModalProps) => {
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    if (!categoryId || !title.trim() || !content.trim()) {
      setError('Rellena todos los campos obligatorios.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await insertThread({
        category_id: categoryId,
        author_id: session.user.id,
        title: title.trim(),
        content: content.trim(),
      });
      onPublished();
    } catch (err: any) {
      setError(err?.message ?? 'Error al publicar. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-noche/80 backdrop-blur-sm p-4"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl border border-menta/30 rounded-xl bg-noche p-6 shadow-[0_0_40px_rgba(0,229,255,0.08)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-plex-mono font-bold text-hueso flex items-center gap-2">
          <span className="w-1.5 h-5 bg-menta"></span> Nuevo Hilo
        </h2>
        <button onClick={onClose} className="text-gris-neutro hover:text-hueso transition-colors text-lg leading-none">✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-[10px] font-plex-mono text-gris-neutro uppercase tracking-wider mb-2">Sección *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full bg-noche border border-gris-trazado/50 rounded-lg px-4 py-3 text-sm font-plex-sans text-hueso focus:outline-none focus:border-menta/50 transition-colors"
          >
            <option value="" disabled>Seleccionar sección...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div className="mb-4">
          <label className="block text-[10px] font-plex-mono text-gris-neutro uppercase tracking-wider mb-2">Título del Hilo *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un título descriptivo..."
            maxLength={200}
            required
            className="w-full bg-noche border border-gris-trazado/50 rounded-lg px-4 py-3 text-sm font-plex-mono text-hueso placeholder:text-gris-neutro/40 focus:outline-none focus:border-menta/50 transition-colors"
          />
        </div>

        {/* Contenido */}
        <div className="mb-4">
          <label className="block text-[10px] font-plex-mono text-gris-neutro uppercase tracking-wider mb-2">Contenido *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe tu tema, problema o comparte tu setup..."
            rows={5}
            required
            className="w-full bg-noche border border-gris-trazado/50 rounded-lg px-4 py-3 text-sm font-plex-sans text-hueso placeholder:text-gris-neutro/40 focus:outline-none focus:border-menta/50 transition-colors resize-none"
          />
        </div>

        {/* Adjuntar LFX (pendiente WAVE 2507) */}
        <div className="mb-6 p-4 border border-yellow-500/20 border-dashed rounded-lg bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <span className="text-yellow-500/70"><IconChip /></span>
            <div>
              <p className="text-xs font-plex-mono text-yellow-500">Adjuntar archivo .lfx</p>
              <p className="text-[10px] font-plex-sans text-gris-neutro/60">Solo efectos Hephaestus (.lfx) · Máx 500KB · Disponible en WAVE 2507</p>
            </div>
            <button type="button" disabled className="ml-auto text-xs font-plex-mono text-yellow-500/40 border border-yellow-500/20 px-3 py-1.5 rounded cursor-not-allowed">
              Seleccionar
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs font-plex-mono text-red-400 mb-4">{error}</p>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-plex-mono text-gris-neutro border border-gris-trazado px-4 py-2.5 rounded hover:border-hueso hover:text-hueso transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !session}
            className="text-xs font-plex-mono text-noche bg-menta font-bold px-5 py-2.5 rounded hover:bg-menta/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Hilo'}
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
  );
};

// ============================================================
// ONBOARDING MODAL — Elegir alias cyberpunk (WAVE 2530)
// ============================================================
interface OnboardingModalProps {
  userId: string;
  onComplete: (username: string) => void;
  onClose: () => void;
}

const OnboardingModal = ({ userId, onComplete, onClose }: OnboardingModalProps) => {
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim();

    if (clean.length < 3 || clean.length > 24) {
      setError('El alias debe tener entre 3 y 24 caracteres.');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      setError('Solo letras, números, guiones y underscores.');
      return;
    }

    setChecking(true);
    setError(null);

    try {
      // Verificar disponibilidad
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', clean)
        .maybeSingle();

      if (existing) {
        setError('Ese alias ya está en uso. Elige otro.');
        setChecking(false);
        return;
      }

      await updateProfile(userId, { username: clean });
      onComplete(clean);
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-noche/90 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md border border-menta/30 bg-noche p-8 shadow-[0_0_60px_rgba(0,242,169,0.07)]"
      >
        <p className="text-[10px] font-plex-mono text-menta/60 tracking-[0.3em] mb-4">
          // PROTOCOLO DE IDENTIFICACIÓN
        </p>
        <h2 className="text-xl font-plex-mono font-bold text-hueso mb-2">
          Elige tu <span className="text-menta">alias</span>
        </h2>
        <p className="text-xs font-plex-sans text-gris-neutro mb-6 leading-relaxed">
          Este será tu identificador en El Cónclave. Podrás cambiarlo más adelante.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 border-b border-gris-trazado/50 mb-2 pb-1 focus-within:border-menta/60 transition-colors">
            <span className="text-menta font-plex-mono text-sm">$</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="netrunner_42"
              maxLength={24}
              autoFocus
              className="flex-1 bg-transparent px-2 py-2 text-sm font-plex-mono text-hueso placeholder:text-gris-neutro/30 focus:outline-none"
            />
          </div>

          <p className="text-[10px] font-plex-mono text-gris-neutro/30 mb-5">
            3-24 chars · a-z 0-9 _ -
          </p>

          {error && (
            <p className="text-xs font-plex-mono text-red-400 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={checking || !username.trim()}
            className="w-full text-xs font-plex-mono text-noche bg-menta font-bold py-3 hover:bg-menta/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? '[ VERIFICANDO... ]' : '[ CONFIRMAR ALIAS ]'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ConclaveIndex;
