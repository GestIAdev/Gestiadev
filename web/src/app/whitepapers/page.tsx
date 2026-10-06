import Shell from '@/components/layout/Shell';
import Link from 'next/link';
import { WHITEPAPERS, WHITEPAPER_CATEGORIES, type WhitepaperCategory } from '@/lib/whitepapersManifest';

export const metadata = {
  title: 'Technical Due Diligence — LuxSync',
  description:
    '18 auditable engineering documents covering the LuxSync photonic control ecosystem. Cognition, physics, timecoder, editor, sensory and infrastructure subsystems.',
};

export default function WhitepapersIndexPage() {
  return (
    <Shell>
      <div className="w-full max-w-[1200px] mx-auto py-8 px-6">
        {/* ── HEADER ── */}
        <div className="mb-12">
          <p className="text-xs font-plex-mono text-menta/60 tracking-[0.3em] uppercase mb-3">
            // Technical Due Diligence
          </p>
          <h1 className="text-3xl lg:text-4xl font-plex-mono font-bold text-hueso mb-4">
            Architecture <span className="text-menta">Whitepapers</span>
          </h1>
          <p className="text-base font-plex-sans text-gris-neutro max-w-2xl leading-relaxed">
            {WHITEPAPERS.length} auditable engineering documents covering every subsystem of the LuxSync
            photonic control platform. Zero external dependencies, proprietary automation tooling, and
            full cryptographic audit trails. Provided for technical due diligence.
          </p>
        </div>

        {/* ── GROUPED GRID ── */}
        {WHITEPAPER_CATEGORIES.map((category: WhitepaperCategory) => {
          const papers = WHITEPAPERS.filter((p) => p.category === category);
          if (papers.length === 0) return null;
          return (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1.5 h-5 bg-menta"></span>
                <h2 className="text-lg font-plex-mono font-bold text-hueso">{category}</h2>
                <span className="text-[10px] font-plex-mono text-gris-neutro/50 tabular-nums">
                  [{papers.length}]
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {papers.map((paper) => (
                  <Link
                    key={paper.slug}
                    href={`/whitepapers/${paper.slug}`}
                    className="text-left border border-gris-trazado/50 rounded-lg overflow-hidden bg-noche/30 backdrop-blur-sm transition-all duration-300 hover:border-menta/50 hover:bg-noche/50 group focus:outline-none focus:ring-1 focus:ring-menta/40 p-5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-plex-mono text-menta/70 uppercase tracking-widest mb-1">
                          {paper.category} · {paper.date}
                        </p>
                        <p className="text-sm font-plex-mono text-hueso group-hover:text-menta transition-colors">
                          {paper.title}
                        </p>
                        <p className="text-xs font-plex-sans text-gris-neutro/60 mt-1 leading-relaxed">
                          {paper.summary}
                        </p>
                      </div>
                      <span className="text-menta/40 group-hover:text-menta transition-colors ml-4 text-lg flex-shrink-0">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── BACK ── */}
        <Link
          href="/"
          className="inline-block border border-gris-trazado text-gris-neutro px-5 py-2 font-plex-mono text-sm hover:border-menta hover:text-menta transition-colors duration-200"
        >
          ← Back to LuxSync
        </Link>
      </div>
    </Shell>
  );
}
