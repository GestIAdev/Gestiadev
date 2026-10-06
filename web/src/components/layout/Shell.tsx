"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ShellProps {
  children: React.ReactNode;
}

/**
 * Shared architectural shell for all routes.
 * Grid layout: Header (auto) | Main (1fr, scrollable) | Footer (auto).
 * The global StarfieldSwitcher background is mounted in layout.tsx.
 */
export default function Shell({ children }: ShellProps) {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr_auto] text-hueso overflow-hidden">
      <Header />
      <main className="relative z-10 overflow-y-auto lienzo-principal">
        <div className="w-full min-h-full flex flex-col justify-start items-center px-6 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
