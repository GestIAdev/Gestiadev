// ============================================================
// luxsyncContent.ts — Shared LuxSync content (Home + Whitepapers)
// Extracted from LuxSyncSection.tsx during the Corporate Wash pivot.
// ============================================================

export type DemoCategory = 'Presentations' | 'Live Shows' | 'Technical Demos';

export const DEMO_CATEGORIES: DemoCategory[] = [
  'Presentations',
  'Live Shows',
  'Technical Demos',
];

export interface DemoRecord {
  id: string;
  title: string;
  desc: string;
  category: DemoCategory;
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
    id: 'demo-selene',
    title: 'SELENE IA CORE',
    desc: 'Live AI for autonomous lighting decisions, sub-frame latency.',
    category: 'Presentations',
    videoUrl: '',
    youtubeId: '',
  },
  {
    id: 'demo-omniliquid',
    title: 'OMNILIQUID ENGINE',
    desc: 'Fluid physics DMX in real time. Waves, turbulence and spectral reactivity.',
    category: 'Technical Demos',
    videoUrl:
      'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/omniliquidnoselene.mp4',
    youtubeId: '',
  },
  {
    id: 'demo-chronos',
    title: 'HYPERION 3D NEONBLOOM',
    desc: 'Offline RSA cryptography and Zero-Trust Architecture applied to DMX timeline.',
    category: 'Technical Demos',
    videoUrl:
      'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/Liquid3d.webm',
    youtubeId: '',
  },
  {
    id: 'demo-hephaestus',
    title: 'HEPHAESTUS FX',
    desc: 'DMX automation curve editor with high-precision vector rendering.',
    category: 'Technical Demos',
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
    slug: 'CHRONOS_V3_WEBSITE_AUDIT_FINAL',
  },
  {
    id: 'omniliquid',
    waveTag: 'WAVE 2096',
    title: 'OMNILIQUID ENGINE',
    desc: 'Fluid physics applied to DMX. Pure spectral reactivity.',
    slug: 'OMNILIQUID_ENGINE_AUDIT',
  },
  {
    id: 'kinetic',
    waveTag: 'WAVE 2095',
    title: 'KINETIC ENGINE V2',
    desc: 'Independent motion engines decoupled from BPM signal.',
    slug: 'KINEMATIC_ENGINE_AUDIT',
  },
  {
    id: 'sensory',
    waveTag: 'WAVE 2090',
    title: 'SENSORY LAYER (TRINITY AUDIO)',
    desc: 'WASAPI loopback capture and isolated Worker threads (Phantom Worker).',
    slug: 'GODEAR_FFT_V3_AUDIT',
  },
  {
    id: 'neural',
    waveTag: 'WAVE 2097',
    title: 'HYPERION & THE PROGRAMMER 2D/3D',
    desc: 'State and thread orchestration via TitanOrchestrator.',
    slug: 'HYPERION_LIVE_DUE_DILIGENCE',
  },
  {
    id: 'preshow',
    waveTag: 'WAVE 2093',
    title: 'PRE-SHOW WORKSPACE (DMX NEXUS)',
    desc: 'USB-Serial and ArtNet hardware management with auto-recovery.',
    slug: 'DMX_NEXUS_AUDIT',
  },
  {
    id: 'selene',
    waveTag: 'WAVE 2092',
    title: 'SELENE LUX IA CORE',
    desc: 'Integrated AI for real-time lighting decision-making.',
    slug: 'SELENE_V3_DUE_DILIGENCE_DEFINITIVE',
  },
  {
    id: 'hephaestus',
    waveTag: 'WAVE 2044',
    title: 'HEPHAESTUS — EDITOR FX ENGINE',
    desc: 'DMX automation curve editor. Complete technical audit 2026.',
    slug: 'HEPHAESTUS-ENGINE-AUDIT-V1',
  },
];

// ─── LIVE METRICS — Home stat widgets ───
export const LIVE_METRICS = [
  { label: 'Technical Audits', value: '20', sub: 'Transparency Protocol' },
  { label: 'Dependencies', value: '0', sub: '100% Native Code' },
  { label: 'DMX Universe', value: '512', sub: 'Real-Time Channels' },
  { label: 'Reactive Physics', value: '7.1', sub: 'Frequency Bands' },
];
