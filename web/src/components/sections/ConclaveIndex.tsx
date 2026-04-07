'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import { supabase, fetchCategories, fetchThreads, insertThread } from '@/lib/supabaseClient';
import type { DbCategory, DbThread } from '@/lib/supabaseClient';
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

  // ── AUTH STATE + CARGA INICIAL ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    loadData();
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          />
        );
      case 'thread':
        return selectedThread && (
          <ThreadView
            thread={selectedThread}
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
              className="text-left border border-gris-trazado/50 rounded-lg p-6 bg-noche/90 backdrop-blur-md hover:border-menta/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-menta/70 group-hover:text-menta transition-colors mt-0.5 flex-shrink-0">
                  {categoryIconMap[iconKey]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors">{cat.name}</p>
                    <span className="text-[10px] font-plex-mono text-gris-neutro">{catThreadCount} hilos</span>
                  </div>
                  <p className="text-xs font-plex-sans text-gris-neutro leading-relaxed">{cat.description}</p>
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
        <div className="border border-gris-trazado/30 border-dashed rounded-lg p-12 text-center mb-10">
          <p className="text-sm font-plex-mono text-gris-neutro/50">Aún no hay hilos. ¡Sé el primero en publicar!</p>
        </div>
      ) : (
        <div className="flex flex-col mb-10 border border-gris-trazado/30 rounded-lg overflow-hidden bg-noche/80 backdrop-blur-md">
          {threads.map((thread, idx) => (
            <button
              key={thread.id}
              onClick={() => { setSelectedThread(thread); setConclaveView('thread'); }}
              className={`text-left w-full px-6 py-5 hover:bg-menta/5 transition-all duration-200 group ${
                idx < threads.length - 1 ? 'border-b border-gris-trazado/40' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {thread.is_pinned && (
                  <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 rounded-full tracking-widest">▲ PINNED</span>
                )}
                {thread.category && (
                  <span className="text-[10px] font-plex-mono text-gris-neutro/70 border border-gris-trazado/50 px-2 py-0.5 rounded-full">{thread.category.name}</span>
                )}
              </div>
              <p className="text-base font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors leading-snug">{thread.title}</p>
              <div className="flex items-center gap-5 mt-2">
                <span className="text-xs font-plex-sans text-gris-neutro">por <span className="text-menta/80 font-plex-mono">{thread.author?.username ?? 'anon'}</span></span>
                <span className="text-xs font-plex-sans text-gris-neutro/60">{thread.reply_count} respuestas</span>
                <span className="text-xs font-plex-sans text-gris-neutro/40">{relativeTime(thread.created_at)}</span>
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
      className="w-full max-w-[1200px] relative z-10"
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-transparent border border-menta text-menta font-plex-mono text-xs px-4 py-2.5 rounded-md hover:bg-menta/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
            >
              + Nuevo Hilo
            </button>
          ) : (
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'discord' })}
              className="flex items-center gap-2 bg-transparent border border-gris-neutro text-gris-neutro font-plex-mono text-xs px-4 py-2.5 rounded-md hover:border-menta hover:text-menta hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all"
            >
              ↗ Identificarse
            </button>
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
}

const ThreadList = ({ category, threads, onBack, onSelectThread, onCreateThread }: ThreadListProps) => {
  const categoryIconMap: Record<CategoryIcon, React.ReactNode> = {
    megaphone: <IconMegaphone />,
    wrench: <IconWrench />,
    chip: <IconChip />,
    monitor: <IconMonitor />,
  };
  const iconKey = SLUG_ICON_MAP[category.slug] ?? 'monitor';
  return (
  <div>
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <button onClick={onBack} className="text-xs font-plex-mono text-menta/70 hover:text-menta transition-colors">
        El Cónclave
      </button>
      <span className="text-xs text-gris-neutro">/</span>
      <span className="text-xs font-plex-mono text-hueso">{category.name}</span>
    </div>

    {/* Category Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="text-menta/70">{categoryIconMap[iconKey]}</span>
        <div>
          <h2 className="text-xl font-plex-mono font-bold text-hueso">{category.name}</h2>
          <p className="text-xs font-plex-sans text-gris-neutro">{category.description}</p>
        </div>
      </div>
      <button
        onClick={onCreateThread}
        className="flex items-center gap-2 bg-transparent border border-menta text-menta font-plex-mono text-xs px-4 py-2.5 rounded-md hover:bg-menta/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
      >
        + Nuevo Hilo
      </button>
    </div>

    {/* Thread List */}
    {threads.length === 0 ? (
      <div className="border border-gris-trazado/30 border-dashed rounded-lg p-12 text-center">
        <p className="text-sm font-plex-mono text-gris-neutro/60">No hay hilos en esta categoría todavía.</p>
        <button onClick={onCreateThread} className="mt-3 text-xs font-plex-mono text-menta hover:underline">
          Sé el primero en publicar →
        </button>
      </div>
    ) : (
      <div className="flex flex-col mb-8 border border-gris-trazado/30 rounded-lg overflow-hidden bg-noche/80 backdrop-blur-md">
        {threads.map((thread, idx) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            className={`text-left w-full px-6 py-5 hover:bg-menta/5 transition-all duration-200 group ${
              idx < threads.length - 1 ? 'border-b border-gris-trazado/40' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {thread.is_pinned && (
                <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 rounded-full tracking-widest">▲ PINNED</span>
              )}
            </div>
            <p className="text-base font-plex-mono font-bold text-hueso group-hover:text-menta transition-colors leading-snug">{thread.title}</p>
            <div className="flex items-center gap-5 mt-2">
              <span className="text-xs font-plex-sans text-gris-neutro">por <span className="text-menta/80 font-plex-mono">{thread.author?.username ?? 'anon'}</span></span>
              <span className="text-xs font-plex-sans text-gris-neutro/60">{thread.reply_count} respuestas</span>
              <span className="text-xs font-plex-sans text-gris-neutro/40">{relativeTime(thread.created_at)}</span>
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
// THREADVIEW — Vista de hilo con respuestas (contenido a hidratar en WAVE 2507)
// ============================================================
interface ThreadViewProps {
  thread: LiveThread;
  onBack: () => void;
}

const mockReplies = [
  { id: 'r1', author: 'selene_dev', content: 'Confirmado. Estamos revisando la capa de detección USB en el módulo DMX Nexus. El fix sale en el próximo hotfix (v0.9.4).', createdAt: 'Hace 50min' },
  { id: 'r2', author: 'lux_rookie_23', content: 'Gracias! ¿Hay un workaround temporal mientras tanto?', createdAt: 'Hace 40min' },
  { id: 'r3', author: 'selene_dev', content: 'Sí: desconecta el USB, cierra LuxSync, vuelve a conectar y abre LuxSync de nuevo. El handshake se re-negocia en el boot.', createdAt: 'Hace 35min' },
];

const ThreadView = ({ thread, onBack }: ThreadViewProps) => (
  <div>
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <button onClick={onBack} className="text-xs font-plex-mono text-menta/70 hover:text-menta transition-colors">
        ← {thread.category?.name ?? 'Categoría'}
      </button>
    </div>

    {/* Thread Header */}
    <div className="border border-gris-trazado/50 rounded-xl p-6 bg-noche/40 backdrop-blur-sm mb-6">
      <div className="flex items-center gap-3 mb-3">
        {thread.is_pinned && (
          <span className="text-[10px] font-plex-mono bg-menta/10 text-menta border border-menta/30 px-2 py-0.5 rounded-full">PINNED</span>
        )}
      </div>
      <h2 className="text-xl font-plex-mono font-bold text-hueso mb-3">{thread.title}</h2>
      <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed mb-4 italic opacity-50">
        [ Cuerpo del hilo — se hidratará con el campo <code className="not-italic">content</code> en WAVE 2507 ]
      </p>
      <div className="flex items-center gap-4 pt-3 border-t border-gris-trazado/30">
        <span className="text-[10px] font-plex-sans text-gris-neutro">
          Publicado por <span className="text-menta/70 font-plex-mono">{thread.author?.username ?? 'anon'}</span>
        </span>
        <span className="text-[10px] font-plex-sans text-gris-neutro/50">{relativeTime(thread.created_at)}</span>
      </div>
    </div>

    {/* Replies */}
    <h3 className="text-sm font-plex-mono font-bold text-hueso mb-4 flex items-center gap-2">
      <span className="w-1 h-4 bg-menta"></span> {thread.reply_count} Respuestas
    </h3>
    <div className="flex flex-col gap-3 mb-8">
      {mockReplies.map((reply) => (
        <div key={reply.id} className="border border-gris-trazado/30 rounded-lg p-5 bg-noche/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-plex-mono text-menta/70">{reply.author}</span>
            <span className="text-[10px] font-plex-sans text-gris-neutro/50">{reply.createdAt}</span>
          </div>
          <p className="text-sm font-plex-sans text-gris-neutro leading-relaxed">{reply.content}</p>
        </div>
      ))}
    </div>

    {/* Reply input mock */}
    <div className="border border-gris-trazado/50 rounded-xl p-5 bg-noche/40 mb-8">
      <p className="text-xs font-plex-mono text-gris-neutro/50 mb-3">Responder en este hilo</p>
      <div className="w-full h-24 bg-noche/60 border border-gris-trazado/30 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-xs font-plex-mono text-gris-neutro/30">[ Textarea — Requiere autenticación Supabase ]</span>
      </div>
      <div className="flex items-center justify-between">
          <button className="inline-flex items-center gap-1.5 text-[10px] font-plex-mono text-yellow-500/60 border border-yellow-500/20 px-3 py-1.5 rounded cursor-not-allowed">
            <IconDisc /> Adjuntar .lfx
          </button>
        <button className="text-xs font-plex-mono text-noche bg-menta/30 px-4 py-2 rounded cursor-not-allowed">
          Enviar Respuesta
        </button>
      </div>
    </div>
  </div>
);

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

export default ConclaveIndex;
