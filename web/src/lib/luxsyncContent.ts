// ============================================================
// luxsyncContent.ts — Shared LuxSync content (Home + Whitepapers)
// Extracted from LuxSyncSection.tsx during the Corporate Wash pivot.
// ============================================================

export type DemoCategory = 'Shows & Workshop' | 'Presentations' | 'Demos & Shaders';

export const DEMO_CATEGORIES: DemoCategory[] = [
  'Shows & Workshop',
  'Presentations',
  'Demos & Shaders',
];

export interface DemoRecord {
  id: string;
  title: string;
  desc: string;
  category: DemoCategory;
  videoUrl: string;
  youtubeId: string;
}

// Supabase Storage public base — all videos live under videos1/Shows & workshop/
const SB_STORAGE =
  'https://frwoyrwvlxxjfuqvdsyw.supabase.co/storage/v1/object/public/videos1/Shows%20&%20workshop';
const vid = (file: string) => `${SB_STORAGE}/${file}`;

export interface AuditDoc {
  id: string;
  title: string;
  desc: string;
  waveTag: string;
  slug: string;
}

// ─── DEMO RECORDS — Showcase Player Playlist ───
// Live footage (Shows & Workshop) + OBS module walkthroughs (Presentations)
// + Theia/UI captures (Demos & Shaders). All .webm served from Supabase Storage.
export const DEMO_RECORDS: DemoRecord[] = [
  // ── Shows & Workshop — real venue & bench recordings ──
  {
    id: 'club1depo',
    title: 'CLUB DEPO — SET 01',
    desc: 'Live club recording — LuxSync driving the house rig in real time.',
    category: 'Shows & Workshop',
    videoUrl: vid('Club1depo.webm'),
    youtubeId: '',
  },
  {
    id: 'club2depo',
    title: 'CLUB DEPO — SET 02',
    desc: 'Club Depo session — second cut, full DMX automation.',
    category: 'Shows & Workshop',
    videoUrl: vid('Club2depo.webm'),
    youtubeId: '',
  },
  {
    id: 'club3depo',
    title: 'CLUB DEPO — SET 03',
    desc: 'Club Depo session — third cut, live fixture output.',
    category: 'Shows & Workshop',
    videoUrl: vid('Club3depo.webm'),
    youtubeId: '',
  },
  {
    id: 'club4depo',
    title: 'CLUB DEPO — SET 04',
    desc: 'Club Depo session — extended capture of the live rig.',
    category: 'Shows & Workshop',
    videoUrl: vid('Club4depo.webm'),
    youtubeId: '',
  },
  {
    id: 'insidecabin1',
    title: 'INSIDE THE CABIN',
    desc: 'Booth POV — live LuxSync console operation during a set.',
    category: 'Shows & Workshop',
    videoUrl: vid('Insidecabin1.webm'),
    youtubeId: '',
  },
  {
    id: 'latino1depo',
    title: 'LATINO NIGHT — DEPO',
    desc: 'Latin-session club capture — LuxSync running the full rig.',
    category: 'Shows & Workshop',
    videoUrl: vid('Latino1depo.webm'),
    youtubeId: '',
  },
  {
    id: 'operator1',
    title: 'OPERATOR POV 01',
    desc: 'Hands-on footage of the LuxSync controller in a live show.',
    category: 'Shows & Workshop',
    videoUrl: vid('Operator1.webm'),
    youtubeId: '',
  },
  {
    id: 'ravex1depo',
    title: 'RAVEX — DEPO 01',
    desc: 'RaveX event capture — strobe and energy cues under LuxSync.',
    category: 'Shows & Workshop',
    videoUrl: vid('Ravex1depo.webm'),
    youtubeId: '',
  },
  {
    id: 'ravex41',
    title: 'RAVEX 41 — CUT A',
    desc: 'RaveX warehouse session — live fixture output.',
    category: 'Shows & Workshop',
    videoUrl: vid('Ravex41.webm'),
    youtubeId: '',
  },
  {
    id: 'ravex41-2',
    title: 'RAVEX 41 — CUT B',
    desc: 'Second angle of the RaveX 41 set.',
    category: 'Shows & Workshop',
    videoUrl: vid('Ravex41%202.webm'),
    youtubeId: '',
  },
  {
    id: 'ravex71',
    title: 'RAVEX 71',
    desc: 'RaveX series — live show capture, full rig control.',
    category: 'Shows & Workshop',
    videoUrl: vid('Ravex71.webm'),
    youtubeId: '',
  },
  {
    id: 'ravexpoptoscana',
    title: 'RAVEX — POP TOSCANA',
    desc: 'RaveX event at Pop Toscana — LuxSync on the house rig.',
    category: 'Shows & Workshop',
    videoUrl: vid('Ravexpoptoscana.webm'),
    youtubeId: '',
  },
  // ── Presentations — OBS module & workflow walkthroughs ──
  {
    id: 'selenelatino1',
    title: 'SELENE — LATINO SET 01',
    desc: 'Selene cognitive layer driving a latin set — OBS capture.',
    category: 'Presentations',
    videoUrl: vid('Selenelatino1.webm'),
    youtubeId: '',
  },
  {
    id: 'selenelatino2',
    title: 'SELENE — LATINO SET 02',
    desc: 'Selene on a latin session — decision engine in real time.',
    category: 'Presentations',
    videoUrl: vid('Selenelatino2.webm'),
    youtubeId: '',
  },
  {
    id: 'selenelatino4',
    title: 'SELENE — LATINO SET 04',
    desc: 'Extended Selene capture — latin set, autonomous cues.',
    category: 'Presentations',
    videoUrl: vid('Selenelatino4.webm'),
    youtubeId: '',
  },
  {
    id: 'selenetranqui1',
    title: 'SELENE — CHILL SESSION',
    desc: 'Low-energy set — Selene smooth transitions, OBS capture.',
    category: 'Presentations',
    videoUrl: vid('Selenetranqui1.webm'),
    youtubeId: '',
  },
  {
    id: 'demo-selene',
    title: 'SELENE IA CORE',
    desc: 'Live AI for autonomous lighting decisions, sub-frame latency.',
    category: 'Presentations',
    videoUrl: '',
    youtubeId: '',
  },
  // ── Demos & Shaders — Theia 2.0 engine & UI simulations ──
  {
    id: 'wheelsmith',
    title: 'WHEELSMITH MODULE',
    desc: 'Wheelsmith parameter editor — UI walkthrough capture.',
    category: 'Demos & Shaders',
    videoUrl: vid('Wheelsmith.webm'),
    youtubeId: '',
  },
  {
    id: 'demo-omniliquid',
    title: 'OMNILIQUID ENGINE',
    desc: 'Theia 2.0 GLSL fluid engine — real-time spectral reactivity.',
    category: 'Demos & Shaders',
    videoUrl: '',
    youtubeId: '',
  },
  {
    id: 'demo-chronos',
    title: 'HYPERION 3D NEONBLOOM',
    desc: '3D stage visualizer — neon bloom render pipeline.',
    category: 'Demos & Shaders',
    videoUrl: '',
    youtubeId: '',
  },
  {
    id: 'demo-hephaestus',
    title: 'HEPHAESTUS FX',
    desc: 'DMX automation curve editor with high-precision vector rendering.',
    category: 'Demos & Shaders',
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
