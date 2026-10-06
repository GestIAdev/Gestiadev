'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WHITEPAPERS } from '@/lib/whitepapersManifest';

interface WhitepaperDetailClientProps {
  slug: string;
}

export default function WhitepaperDetailClient({ slug }: WhitepaperDetailClientProps) {
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const paper = WHITEPAPERS.find((p) => p.slug === slug);

  useEffect(() => {
    if (!slug) return;
    const fetchMarkdown = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/whitepapers/${slug}.md`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load document';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarkdown();
  }, [slug]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-6">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/whitepapers"
          className="text-xs font-plex-mono text-menta/70 hover:text-menta transition-colors"
        >
          Whitepapers
        </Link>
        <span className="text-xs text-gris-neutro">/</span>
        <span className="text-xs font-plex-mono text-hueso">{paper?.title ?? slug}</span>
      </div>

      {/* ── HEADER ── */}
      {paper && (
        <div className="mb-8 pb-6 border-b border-gris-trazado/30">
          <p className="text-[10px] font-plex-mono text-menta/60 uppercase tracking-widest mb-2">
            {paper.category} · {paper.date}
          </p>
          <h1 className="text-2xl lg:text-3xl font-plex-mono font-bold text-hueso">{paper.title}</h1>
          <p className="text-sm font-plex-sans text-gris-neutro mt-2 max-w-2xl">{paper.summary}</p>
        </div>
      )}

      {/* ── CONTENT ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm font-plex-mono text-menta animate-pulse tracking-[0.2em]">
            [ LOADING DOCUMENT... ]
          </p>
        </div>
      ) : error ? (
        <div className="text-red-500 font-plex-mono text-sm">
          Error loading document: {error}
          <br />
          <span className="text-gris-neutro">Attempted: /whitepapers/{slug}.md</span>
        </div>
      ) : (
        <div
          className="prose prose-invert max-w-none
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
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      )}

      {/* ── BACK ── */}
      <div className="mt-12 pt-6 border-t border-gris-trazado/30">
        <Link
          href="/whitepapers"
          className="text-xs font-plex-mono text-gris-neutro hover:text-menta transition-colors"
        >
          ← Back to all whitepapers
        </Link>
      </div>
    </div>
  );
}
