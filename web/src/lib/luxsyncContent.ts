// ============================================================
// luxsyncContent.ts — Shared LuxSync content (Home + Whitepapers)
// Extracted from LuxSyncSection.tsx during the Corporate Wash pivot.
// ============================================================

export interface DemoRecord {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  youtubeId: string;
}

export interface AuditDoc {
  id: string;
  title: string;
  desc: string;
  waveTag: string;
  slug: string;
}

// ─── DEMO RECORDS — Showcase Player Playlist ───
export const DEMO_RECORDS: DemoRecord[] = [
  {
    id: 'demo-omniliquid',
    title: 'OMNILIQUID ENGINE',
    desc: 'Fluid physics DMX in real time. Waves, turbulence and spectral reactivity.',
    videoUrl:
      'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/omniliquidnoselene.mp4',
    youtubeId: '',
  },
  {
    id: 'demo-chronos',
    title: 'HYPERION 3D NEONBLOOM',
    desc: 'Offline RSA cryptography and Zero-Trust Architecture applied to DMX timeline.',
    videoUrl:
      'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/Liquid3d.webm',
    youtubeId: '',
  },
  {
    id: 'demo-selene',
    title: 'SELENE IA CORE',
    desc: 'Live AI for autonomous lighting decisions, sub-frame latency.',
    videoUrl: '',
    youtubeId: '',
  },
  {
    id: 'demo-hephaestus',
    title: 'HEPHAESTUS FX',
    desc: 'DMX automation curve editor with high-precision vector rendering.',
    videoUrl: '',
    youtubeId: '',
  },
];

// ─── AUDIT DOCS — Technical Due Diligence (Home teaser) ───
// These 8 cards appear on the Home page and link to /whitepapers/[slug]
export const AUDIT_DOCS: AuditDoc[] = [
  {
    id: 'chronos',
    waveTag: 'WAVE 2490',
    title: 'CHRONOS TIMECODER',
    desc: 'Offline cryptography, RSA signatures and Zero-Trust Architecture.',
    slug: 'CHRONOS-TIMECODER-FINAL-AUDIT',
  },
  {
    id: 'omniliquid',
    waveTag: 'WAVE 2096',
    title: 'OMNILIQUID ENGINE',
    desc: 'Fluid physics applied to DMX. Pure spectral reactivity.',
    slug: 'OMNILIQUID-ENGINE-AUDIT',
  },
  {
    id: 'kinetic',
    waveTag: 'WAVE 2095',
    title: 'KINETIC ENGINE V2',
    desc: 'Independent motion engines decoupled from BPM signal.',
    slug: 'KINETIC-CHROMATIC-AUDIT',
  },
  {
    id: 'sensory',
    waveTag: 'WAVE 2090',
    title: 'SENSORY LAYER (TRINITY AUDIO)',
    desc: 'WASAPI loopback capture and isolated Worker threads (Phantom Worker).',
    slug: 'SENSORY-LAYER-AUDIT-V2',
  },
  {
    id: 'neural',
    waveTag: 'WAVE 2097',
    title: 'HYPERION & THE PROGRAMMER 2D/3D',
    desc: 'State and thread orchestration via TitanOrchestrator.',
    slug: 'HYPERION-PROGRAMMER-AUDIT',
  },
  {
    id: 'preshow',
    waveTag: 'WAVE 2093',
    title: 'PRE-SHOW WORKSPACE (DMX NEXUS)',
    desc: 'USB-Serial and ArtNet hardware management with auto-recovery.',
    slug: 'PRE-SHOW-WORKSPACE-AUDIT',
  },
  {
    id: 'selene',
    waveTag: 'WAVE 2092',
    title: 'SELENE LUX IA CORE',
    desc: 'Integrated AI for real-time lighting decision-making.',
    slug: 'SELENE-COGNITION-FINAL-AUDIT',
  },
  {
    id: 'hephaestus',
    waveTag: 'WAVE 2044',
    title: 'HEPHAESTUS — EDITOR FX ENGINE',
    desc: 'DMX automation curve editor. Complete technical audit 2026.',
    slug: 'HEPHAESTUS-TECHNICAL-AUDIT-2026-REVIEW',
  },
];

// ─── LIVE METRICS — Home stat widgets ───
export const LIVE_METRICS = [
  { label: 'Technical Audits', value: '18', sub: 'Transparency Protocol' },
  { label: 'Dependencies', value: '0', sub: '100% Native Code' },
  { label: 'DMX Universe', value: '512', sub: 'Real-Time Channels' },
  { label: 'Reactive Physics', value: '7.1', sub: 'Frequency Bands' },
];
