'use client'

import { useRef } from 'react'
import { useTextScramble } from '@/lib/useTextScramble'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { useSection } from '@/context/SectionContext'
import { useSettings } from '@/context/SettingsContext'

export function Hero() {
  const h1Ref = useRef<HTMLHeadingElement | null>(null)
  const { active } = useSection()
  const { scrambleMs } = useSettings()
  useTextScramble(h1Ref, 'Forjamos el Futuro del Software', active === 'hero', scrambleMs)

  return (
    <SectionWrapper id="hero">
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-[1100px] w-full mx-auto text-center">
          <h1 ref={h1Ref} className="hero-text font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-6" aria-live="polite">
            Forjamos el Futuro del Software
          </h1>

          <p className="text-[#888888] text-lg md:text-xl max-w-3xl mx-auto mb-12">
            Combinamos la colaboración radical con IA y una ingeniería de élite 
            para construir herramientas un orden de magnitud más eficientes, 
            seguras e inteligentes.
          </p>

          <button className="px-8 py-3 font-mono text-lg border-2 border-[#00F2A9] text-[#00F2A9] hover:bg-[#00F2A9] hover:text-[#0A0A1A] transition-all duration-300">
            Explorar Nuestra Tecnología
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
