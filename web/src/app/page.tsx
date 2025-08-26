"use client"

import { Hero } from '@/components/sections/Hero'
import { Arsenal } from '@/components/sections/Arsenal'
import { Armeria } from '@/components/sections/Armeria'
import { Founder } from '@/components/sections/Founder'
import { Contact } from '@/components/sections/Contact'
import { Alianzas } from '@/components/sections/Alianzas'
import { useSection } from '@/context/SectionContext'
import { AnimatePresence } from 'framer-motion'

export default function Home() {
  const { active } = useSection()

  return (
    <div className="relative">
      <main className="relative">
        <AnimatePresence mode="wait">
          {active === 'hero' && <Hero key="hero" />}
          {active === 'arsenal' && <Arsenal key="arsenal" />}
          {active === 'armeria' && <Armeria key="armeria" />}
          {active === 'alianzas' && <Alianzas key="alianzas" />}
          {active === 'fundador' && <Founder key="fundador" />}
          {active === 'contacto' && <Contact key="contacto" />}
        </AnimatePresence>
      </main>
    </div>
  )
}
