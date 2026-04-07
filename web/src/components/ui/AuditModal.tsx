'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface AuditDoc {
  id: string;
  title: string;
  desc: string;
  waveTag: string;
  path: string; // Ruta al archivo .md en /public/luxsync/
}

interface AuditModalProps {
  audit: AuditDoc | null;
  onClose: () => void;
}

const AuditModal = ({ audit, onClose }: AuditModalProps) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de contenido Markdown
  useEffect(() => {
    if (!audit) {
      setMarkdownContent('');
      setIsLoading(true);
      setError(null);
      return;
    }

    const fetchMarkdown = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(audit.path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el informe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [audit?.path, audit?.id]);

  // Cerrar con Escape
  useEffect(() => {
    if (!audit) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [audit, onClose]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (audit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [audit]);

  return createPortal(
    <AnimatePresence>
      {audit && (
        <motion.div
          key="audit-overlay"
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-noche/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            key="audit-card"
            className="relative w-full max-w-4xl bg-noche/95 border border-gris-trazado/50 rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── HEADER TERMINAL ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gris-trazado/40 bg-noche/80">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-plex-mono text-menta/50 tracking-widest uppercase">
                  // INFORME CLASIFICADO · {audit.waveTag}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-plex-mono font-bold text-menta tracking-wide hidden sm:block">
                  {audit.title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-xs font-plex-mono text-gris-neutro hover:text-hueso border border-gris-trazado/40 hover:border-menta/40 px-3 py-1.5 rounded transition-colors"
                >
                  [ X ] Cerrar
                </button>
              </div>
            </div>

            {/* ── CONTENIDO SCROLLABLE ── */}
            <div className="overflow-y-auto max-h-[75vh] p-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="inline-block text-menta font-plex-mono text-lg animate-pulse mb-4">
                      [ DESENCRIPTANDO INFORME CLASIFICADO... ]
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-red-500 font-plex-mono text-sm">
                  Error: {error}
                </div>
              ) : (
                <div className="prose prose-invert max-w-none
                  prose-p:text-gris-neutro prose-p:font-plex-sans prose-p:leading-relaxed
                  prose-headings:font-plex-mono prose-headings:text-hueso prose-headings:font-bold
                  prose-h1:text-2xl prose-h1:text-menta prose-h1:mb-4
                  prose-h2:text-lg prose-h2:border-b prose-h2:border-gris-trazado/30 prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-base prose-h3:text-menta/80 prose-h3:mt-6 prose-h3:mb-2
                  prose-a:text-menta prose-a:no-underline hover:prose-a:underline
                  prose-code:text-menta/80 prose-code:bg-noche/60 prose-code:border prose-code:border-gris-trazado/30 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-plex-mono prose-code:text-xs
                  prose-pre:bg-noche/80 prose-pre:border prose-pre:border-gris-trazado/30 prose-pre:rounded-lg
                  prose-strong:text-hueso prose-strong:font-bold
                  prose-li:text-gris-neutro prose-li:font-plex-sans
                  prose-ul:my-3 prose-ol:my-3
                  prose-blockquote:border-l-menta prose-blockquote:text-gris-neutro/70 prose-blockquote:italic
                  prose-table:text-sm prose-thead:bg-noche/60
                  prose-th:text-menta prose-th:font-plex-mono prose-th:font-bold prose-th:px-3 prose-th:py-2
                  prose-td:text-gris-neutro prose-td:px-3 prose-td:py-2 prose-td:border-gris-trazado/20
                  prose-hr:border-gris-trazado/30
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* ── FOOTER ── */}
            <div className="px-6 py-3 border-t border-gris-trazado/30 bg-noche/60 flex items-center justify-between">
              <span className="text-[10px] font-plex-mono text-gris-neutro/40">
                GESTIADEV · PROTOCOLO DE TRANSPARENCIA · DOC {audit.id}/8
              </span>
              <button
                onClick={onClose}
                className="text-xs font-plex-mono text-gris-neutro hover:text-menta transition-colors"
              >
                ← Volver
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuditModal;
