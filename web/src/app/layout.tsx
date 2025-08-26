import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Mono } from 'next/font/google'
import "./globals.css";
import { Navbar, Footer } from '@/components/layout'
import { SectionProvider } from '@/context/SectionContext'
import { SettingsProvider } from '@/context/SettingsContext'
// DemoPanel removed per request
import BackgroundSetter from '@/components/ui/BackgroundSetter'
import Starfield from '@/components/ui/Starfield'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-mono',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-sans',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: "GestIAdev - Forjamos el Futuro del Software",
  description: "Combinamos la colaboración radical con IA y una ingeniería de élite para construir herramientas un orden de magnitud más eficientes, seguras e inteligentes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="es" 
      className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} ${spaceMono.variable} scroll-smooth`}
    >
    <body className="relative min-h-screen w-full text-white antialiased bg-starfield-svg">
        {/* Overlay de multiplicación sutil para dar contraste sin ocultar SVG */}
        <div className="pointer-events-none fixed inset-0 mix-blend-multiply opacity-10 bg-gradient-to-b from-transparent via-black/5 to-black/30" />

        <SettingsProvider>
          {/* BackgroundSetter is a client component that will add the appropriate bg-* class to document.body */}
          <BackgroundSetter />
          {/* Dynamic SVG starfield background (client) */}
          <Starfield />
          <SectionProvider>
            <Navbar />

            {/* Contenido principal */}
            <main className="relative pt-20">
              {children}
            </main>

            {/* Footer global */}
            <Footer />

            {/* DemoPanel removed */}
          </SectionProvider>
        </SettingsProvider>

        {/* Overlay de gradiente sutil en la parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A1A] to-transparent pointer-events-none" />
      </body>
    </html>
  )
}
