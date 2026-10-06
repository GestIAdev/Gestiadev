'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Github, MessageCircle, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6">
      {/* ═══════════════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="text-center mb-10">
          <p className="text-sm font-plex-mono text-gris-neutro tracking-[0.3em] uppercase mb-3">
            // Open a channel
          </p>
          <h2 className="text-4xl lg:text-5xl font-plex-mono font-bold text-hueso">Contact</h2>
          <p className="mt-4 text-lg font-plex-sans text-gris-neutro max-w-xl mx-auto">
            Direct line to the LuxSync engineering team. No support bots, no ticket queues.
          </p>
        </div>

        {/* Terminal de Contacto */}
        <div className="bg-noche/80 border border-gris-trazado rounded-xl p-8 font-mono text-sm max-w-2xl mx-auto">
          <div className="text-menta mb-6 text-xs">$ cat ./LUXSYNC.CONTACT</div>

          <div className="space-y-6">
            {/* Email */}
            <div className="border-l-2 border-menta pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Primary Email
              </div>
              <a
                href="mailto:contact@luxsync.dev"
                className="flex items-center gap-2 text-menta hover:text-hueso transition-colors group text-base"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="group-hover:underline">contact@luxsync.dev</span>
              </a>
            </div>

            {/* GitHub */}
            <div className="border-l-2 border-gris-trazado pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Repository
              </div>
              <a
                href="https://github.com/pinkyfloyder/GestIAdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gris-neutro hover:text-menta transition-colors group"
              >
                <Github className="w-4 h-4 flex-shrink-0" />
                <span className="group-hover:underline">github.com/LuxSync</span>
              </a>
            </div>

            {/* Social */}
            <div className="border-l-2 border-gris-trazado pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Community
              </div>
              <div className="flex items-center gap-2 text-gris-neutro">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <Link href="/community" className="hover:text-menta transition-colors">
                  Developer Hub — Support & .lfx Fixtures
                </Link>
              </div>
            </div>

            {/* Social / Showcase */}
            <div className="border-l-2 border-gris-trazado pl-4">
              <div className="text-hueso font-semibold mb-1.5 text-xs font-plex-mono uppercase tracking-wider">
                Showcase
              </div>
              <a
                href="https://instagram.com/gestiadev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gris-neutro hover:text-menta transition-colors group"
              >
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <span className="group-hover:underline">instagram.com/gestiadev</span>
              </a>
            </div>
          </div>

          <div className="text-menta mt-6 border-t border-gris-trazado pt-4 text-xs">$ █</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
