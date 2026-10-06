import { WHITEPAPERS } from '@/lib/whitepapersManifest';
import Shell from '@/components/layout/Shell';
import WhitepaperDetailClient from './WhitepaperDetailClient';

// Pre-render all whitepaper pages at build time for static export.
export function generateStaticParams() {
  return WHITEPAPERS.map((paper) => ({
    slug: paper.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = WHITEPAPERS.find((p) => p.slug === slug);
  return {
    title: paper ? `${paper.title} — LuxSync Whitepapers` : 'LuxSync Whitepapers',
    description: paper?.summary ?? 'Technical due diligence document.',
  };
}

export default async function WhitepaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Shell>
      <WhitepaperDetailClient slug={slug} />
    </Shell>
  );
}
