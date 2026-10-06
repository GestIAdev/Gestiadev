'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr_auto] text-hueso overflow-hidden">
      {/* Fila 1: Header */}
      <Header />

      {/* Fila 2: Main — LuxSync flagship (high-impact, minimal scroll) */}
      <main className="relative z-10 overflow-y-auto lienzo-principal">
        <div className="w-full min-h-full flex flex-col justify-center items-center px-6 py-8 gap-12">
          {/* ═══════════════════════════════════════════════════════
              HERO
          ═══════════════════════════════════════════════════════ */}
          <motion.section
            className="w-full max-w-[1100px] flex flex-col justify-center items-center text-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo — isotipo + wordmark CSS */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <img
                src="/luxsync/interpreted_vector_logo.png"
                alt="LuxSync"
                className="w-32 h-32 md:w-40 md:h-40 mix-blend-screen opacity-90"
              />
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-5xl md:text-7xl font-black text-[#1FE0D6] tracking-[0.2em] drop-shadow-[0_0_15px_rgba(31,224,214,0.5)] uppercase">
                  LuxSync
                </h1>
                <span className="text-sm md:text-base text-gray-400 tracking-[0.3em] uppercase mt-2">
                  Photonic Control Ecosystem
                </span>
              </div>
            </div>

            <p className="text-base md:text-lg text-gris-neutro max-w-2xl mx-auto mb-8 font-plex-sans">
              El primer ecosistema que fusiona renderizado de vídeo generativo (GLSL) y control DMX bajo
              un mismo cerebro neuronal. Latencia cero. Paridad fotón a fotón. Cero dependencias externas.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/whitepapers"
                className="font-plex-mono font-bold bg-menta text-noche px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:bg-[#00cce6]"
              >
                [ TECHNICAL DOCS ]
              </Link>
              <Link
                href="/media"
                className="font-plex-mono text-menta border border-menta/50 px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:border-menta hover:bg-menta/10"
              >
                [ LIVE DEMOS ]
              </Link>
              <Link
                href="/contact"
                className="font-plex-mono text-gris-neutro border border-gris-trazado px-6 py-3 text-sm md:text-base transition-colors duration-300 hover:border-hueso hover:text-hueso"
              >
                [ ENTERPRISE INQUIRIES ]
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Fila 3: Footer */}
      <Footer />
    </div>
  );
}
