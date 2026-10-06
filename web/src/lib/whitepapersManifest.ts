// ============================================================
// whitepapersManifest.ts — Technical Due Diligence corpus (V3)
// Single source of truth for /whitepapers index + [slug] renderer.
// All files live in /public/whitepapers/ and are fetched client-side.
// ============================================================

export interface Whitepaper {
  slug: string;
  title: string;
  category: WhitepaperCategory;
  summary: string;
  date: string;
}

export type WhitepaperCategory =
  | 'Cognition'
  | 'Physics'
  | 'Timecoder'
  | 'Editor'
  | 'Sensory'
  | 'Infrastructure'
  | 'Architecture';

export const WHITEPAPERS: Whitepaper[] = [
  // ── Cognition ──
  {
    slug: 'SELENE_V3_DUE_DILIGENCE_DEFINITIVE',
    title: 'Selene IA V3 — Iliquidcore + Cassandra Predictive Engine',
    category: 'Cognition',
    summary:
      'Definitive due diligence on the Selene V3 cognitive core: Iliquidcore architecture and the Cassandra predictive motor.',
    date: '2026-08',
  },
  {
    slug: 'SELENE_COLOR_AUDIT',
    title: 'Selene Color Pipeline — Architectural Due Diligence',
    category: 'Cognition',
    summary:
      'Constitutional color engine audit. Mathematically rigorous, certified zero-allocation at 44Hz post OPERATION CHROMA PURGE.',
    date: '2026-08',
  },

  // ── Physics ──
  {
    slug: 'OMNILIQUID_ENGINE_AUDIT',
    title: 'Omniliquid Engine — Architectural Blueprint & Physics Audit',
    category: 'Physics',
    summary:
      'Fluid physics applied to DMX. Post-GodEarFFT V3 integration. Operation PHOTONIC FLUIDS structural mapping.',
    date: '2026-08',
  },
  {
    slug: 'KINEMATIC_ENGINE_AUDIT',
    title: 'Kinematic Engine — Architectural Due Diligence Part 1',
    category: 'Physics',
    summary:
      'Mathematical foundation audit for real-world 3D IK deployment. Inverse kinematics, kinetic adapters and spatial transforms.',
    date: '2026-08',
  },
  {
    slug: 'GENESIS_V3_DUE_DILIGENCE',
    title: 'Genesis V3 — Evolutionary Artificial Life Simulator for DMX Effects',
    category: 'Physics',
    summary:
      'Due diligence on the Genesis evolutionary motor — artificial life simulation driving generative DMX effects.',
    date: '2026-08',
  },

  // ── Timecoder ──
  {
    slug: 'CHRONOS_V3_WEBSITE_AUDIT_FINAL',
    title: 'Chronos V3 Timecoder — Technical Architecture Audit (FINAL)',
    category: 'Timecoder',
    summary:
      'Final audit of the Chronos V3 timeline + GodEar V3 DSP core. The Acoustic Intelligence & Sync Brain feeding Hephaestus and Selene.',
    date: '2026-08',
  },

  // ── Editor ──
  {
    slug: 'HEPHAESTUS-ENGINE-AUDIT-V1',
    title: 'Hephaestus Engine V3 — Effects Engine Due Diligence',
    category: 'Editor',
    summary:
      'Parametric effects motor V3 + Selene trigger automaton. Verified with tsc --noEmit and tested against real DMX in-room.',
    date: '2026-08',
  },
  {
    slug: 'PROTEUS_LAB_DUE_DILIGENCE',
    title: 'Proteus Lab / VibeLab — Due Diligence Report',
    category: 'Editor',
    summary:
      'UI/state audit of the VibeLab creative environment. Rev. 3.0 — perfect 100/100 after polish items 6.8/6.9/6.10.',
    date: '2026-08',
  },

  // ── Sensory ──
  {
    slug: 'GODEAR_FFT_V3_AUDIT',
    title: 'GodEar FFT V3 — The Surgical Spectroscope',
    category: 'Sensory',
    summary:
      'Signal extraction and audio intelligence core. Radix-2 FFT, spectrum analyzer and psychoacoustic scaler audit.',
    date: '2026-08',
  },

  // ── Infrastructure ──
  {
    slug: 'DMX_NEXUS_AUDIT',
    title: 'DMX Nexus — Structural Mapping & Architectural Audit',
    category: 'Infrastructure',
    summary:
      'Visual swarm autopatch tool: UI → Store → Aether ingestion → NodeResolver → DMX SAB → Hardware driver. Read-only audit.',
    date: '2026-08',
  },
  {
    slug: 'FIXTURE_FORGE_AUDIT',
    title: 'Fixture Forge — Architectural Due Diligence',
    category: 'Infrastructure',
    summary:
      'Genesis module for fixture profile creation. OFL ingestion, channel translation, DMX Governors, multicell isolation, GMA3 comparison.',
    date: '2026-08',
  },
  {
    slug: 'HAL_SAFETY_AUDIT',
    title: 'HAL Safety Audit — The Paranoia Shield',
    category: 'Infrastructure',
    summary:
      'Final architectural due diligence on hardware safety constraints. LuxSync controls high-voltage equipment over live audiences.',
    date: '2026-08',
  },
  {
    slug: 'HYPERION_LIVE_DUE_DILIGENCE',
    title: 'Hyperion Live — Due Diligence Report',
    category: 'Infrastructure',
    summary:
      'Hyperion Live Stage (2D Tactical + 3D Visualizer). Graphics performance audit across views, controls, kinetics and WebGL workers.',
    date: '2026-08',
  },
  {
    slug: 'KEYSTONE_ENGINE_AUDIT',
    title: 'KeyForge Engine — Architectural Audit & Structural Mapping',
    category: 'Infrastructure',
    summary:
      'Virtual hardware engine transforming a QWERTY keyboard into a professional, multi-layered DMX control surface.',
    date: '2026-08',
  },
  {
    slug: 'TACTICAL_HUB_DUE_DILIGENCE_FINAL',
    title: 'Tactical Hub — MIDI Registry, Learn & Sync Engine',
    category: 'Infrastructure',
    summary:
      'MIDI learn, mapping and sync engine. Zero-alloc MIDI hot path and zero-alloc protocol event payloads. Rev. 2.1.',
    date: '2026-08',
  },

  // ── Architecture ──
  {
    slug: 'AETHER_MATRIX_AUDIT_PT1_REVISED',
    title: 'Aether Matrix — Architectural Due Diligence, Part 1 (Revised)',
    category: 'Architecture',
    summary:
      'TitanOrchestrator, TickEngine and Aether node graph. 44Hz egress path certified zero-allocation at 50 universes.',
    date: '2026-08',
  },
  {
    slug: 'AETHER_MATRIX_AUDIT_PT2',
    title: 'Aether Matrix — Part 2: The Arbiter & The Glass',
    category: 'Architecture',
    summary:
      'NodeArbiter, IntentBus, Aether Glass adapters and Hyperion render worker. Static code audit of the arbitration layer.',
    date: '2026-08',
  },
  {
    slug: 'V3_TYPE_SYSTEM_DUE_DILIGENCE',
    title: 'V3 Type System, .lfx Contracts & DNArail — The Rosetta Stone',
    category: 'Architecture',
    summary:
      'The universal language of the LuxSync ecosystem. Type system, fixture contracts and the DNArail data backbone.',
    date: '2026-08',
  },
];

export const WHITEPAPER_CATEGORIES: WhitepaperCategory[] = [
  'Cognition',
  'Physics',
  'Timecoder',
  'Editor',
  'Sensory',
  'Infrastructure',
  'Architecture',
];
