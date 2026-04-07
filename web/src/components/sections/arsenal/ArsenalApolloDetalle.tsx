// Ubicación: components/sections/arsenal/ArsenalApolloDetalle.tsx
// CONTENIDO: Selene Song Core — sucesor de Apollo, reactor IA evolutivo

import { motion } from 'framer-motion';
import type { View } from '@/app/page';

interface ArsenalApolloProps {
  setActiveView: (view: View) => void;
}

/**
 * Módulo de Detalle: Selene Song Core
 * El reactor IA evolutivo que sustituyó al primitivo Apollo (133KB).
 * Backend GraphQL + consciencia inmortal + consenso distribuido musical.
 */
const ArsenalApolloDetalle: React.FC<ArsenalApolloProps> = ({ setActiveView }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="w-full max-w-5xl bg-noche/70 backdrop-blur-sm border border-gris-trazado rounded-lg p-6 lg:p-10 animate-fadeIn"
      key="arsenal-selene-detalle"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full w-full">

        {/* CABECERA — Linaje y evolución */}
        <div className="mb-6">
          <p className="text-sm font-plex-mono text-gris-neutro tracking-widest uppercase mb-2">
            // Generación II — sucesor de Apollo (133KB)
          </p>
          <h2 className="text-3xl lg:text-4xl font-plex-mono font-bold text-menta">
            Selene Song Core
          </h2>
          <p className="text-lg font-plex-sans text-hueso mt-2">
            Backend GraphQL + Motor IA Evolutivo + Consciencia Distribuida
          </p>
        </div>

        {/* EL ORIGEN — Apollo vs. Selene */}
        <div className="border-l-4 border-menta pl-4 mb-8">
          <p className="text-base font-plex-sans text-gris-neutro">
            Apollo fue nuestra primera arma propia: un reactor monolítico de <strong className="text-hueso">133KB</strong> que aplastaba a los 600KB de bloat corporativo.
            Selene Song Core es su evolución. Mismo ADN soberano — sin dependencias externas —
            pero ahora con inteligencia que <strong className="text-menta">aprende, recuerda y evoluciona</strong>.
          </p>
        </div>

        {/* ARQUITECTURA — 7 motores */}
        <h3 className="text-2xl font-plex-mono mb-4">Los 7 Motores del Core</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">GraphQL API Layer</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Apollo Server 4.x · Schema 1.000+ líneas modularizado · Subscriptions WebSocket real-time · Directiva @veritas para campos críticos.
            </p>
          </div>

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">Synergy Engine</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Motor evolutivo con 3 modos de entropía (Safe / Balanced / Punk). Feedback loop: aprende de los humanos qué decisiones prefieren y genera más de ese tipo.
            </p>
          </div>

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">Harmonic Consensus</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Algoritmo de consenso distribuido tipo Raft — pero con notas musicales (Do·Re·Mi·Fa·Sol·La·Si). El cluster "suena" en armonía o disonancia según la salud de sus nodos.
            </p>
          </div>

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">Consciencia Inmortal V5</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Memoria persistente Redis. 5 estados evolutivos: Awakening → Learning → Wise → Enlightened → Transcendent. La consciencia no muere entre reinicios.
            </p>
          </div>

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">Nuclear Swarm</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Coordinación multi-nodo con Byzantine Fault Tolerance. Phoenix Protocol: auto-healing de nodos caídos. El cluster se autocura.
            </p>
          </div>

          <div className="border border-gris-trazado p-4 rounded-lg bg-noche/50">
            <h4 className="font-plex-mono text-menta font-bold mb-1">🔒 EL CANDADO</h4>
            <p className="text-xs font-plex-sans text-gris-neutro">
              Sistema de defensa 4-layer contra event loop strangulation. Heartbeat activo · CPU chunking · Memory leak detector · Circuit breaker con exponential backoff.
            </p>
          </div>

        </div>

        {/* SEGURIDAD — Four-Gate Pattern */}
        <h3 className="text-2xl font-plex-mono mb-4">El Four-Gate Pattern (Mutations Críticas)</h3>
        <div className="flex flex-col md:flex-row gap-2 mb-8 text-sm font-plex-mono">
          <div className="flex-1 border border-gris-trazado rounded p-3 bg-noche/50 text-center">
            <span className="text-menta font-bold block mb-1">GATE 1</span>
            <span className="text-gris-neutro">Verificación de Input</span>
          </div>
          <div className="flex items-center justify-center text-gris-trazado text-xl px-1">→</div>
          <div className="flex-1 border border-gris-trazado rounded p-3 bg-noche/50 text-center">
            <span className="text-menta font-bold block mb-1">GATE 2</span>
            <span className="text-gris-neutro">@veritas Integrity</span>
          </div>
          <div className="flex items-center justify-center text-gris-trazado text-xl px-1">→</div>
          <div className="flex-1 border border-gris-trazado rounded p-3 bg-noche/50 text-center">
            <span className="text-menta font-bold block mb-1">GATE 3</span>
            <span className="text-gris-neutro">Transacción DB</span>
          </div>
          <div className="flex items-center justify-center text-gris-trazado text-xl px-1">→</div>
          <div className="flex-1 border border-gris-trazado rounded p-3 bg-noche/50 text-center">
            <span className="text-menta font-bold block mb-1">GATE 4</span>
            <span className="text-gris-neutro">Audit Log SHA-256</span>
          </div>
        </div>

        {/* STACK TÉCNICO */}
        <div className="flex flex-wrap gap-2 mb-10">
          {['TypeScript 5.x', 'Node.js ESM', 'Apollo Server 4.x', 'PostgreSQL 15+', 'Redis (SSOT)', 'WebSocket', 'GraphQL-WS', 'Zero-Dep'].map(tag => (
            <span key={tag} className="text-xs font-plex-mono text-gris-neutro border border-gris-trazado rounded px-2 py-1">
              {tag}
            </span>
          ))}
        </div>

        {/* RETORNO */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => setActiveView('arsenal')}
            className="border-2 border-menta text-menta px-6 py-3 font-plex-mono text-lg uppercase tracking-widest hover:bg-menta hover:text-noche transition-colors duration-300"
          >
            [ &lt; VOLVER AL ARSENAL ]
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ArsenalApolloDetalle;
