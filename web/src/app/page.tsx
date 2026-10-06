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
            {/* Logo */}
            <img
              src="/luxsync/interpreted_vector_logo.png"
              alt="LuxSync Core"
              width={384}
              height={384}
              className="w-56 md:w-72 lg:w-80 mb-6 rounded-full shadow-[0_0_40px_rgba(0,242,169,0.15)] mx-auto object-contain"
            />

            <h1 className="text-3xl md:text-5xl font-plex-mono font-bold text-hueso mb-4">
              LuxSync — Photonic Control Ecosystem
            </h1>

            <p className="text-base md:text-lg text-gris-neutro max-w-2xl mx-auto mb-8 font-plex-sans">
              Fluid physics, Radix-2 synchronization and the first cognitive DMX engine. Enterprise-grade
              photonic control with zero external dependencies.
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
