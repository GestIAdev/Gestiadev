"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Section = 'hero' | 'arsenal' | 'armeria' | 'alianzas' | 'contacto' | 'fundador'

type SectionContextType = {
  active: Section
  setActive: (s: Section, push?: boolean) => void
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

function isValidSection(s: unknown): s is Section {
  return typeof s === 'string' && ['hero', 'arsenal', 'armeria', 'alianzas', 'contacto', 'fundador'].includes(s)
}

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActiveState] = useState<Section>('hero')

  // Set active and optionally push to history
  const setActive = useCallback((s: Section, push = true) => {
    setActiveState(s)
    try {
      const url = new URL(window.location.href)
      if (push) {
        url.searchParams.set('s', s)
        window.history.pushState({ section: s }, '', url.toString())
      } else {
        url.searchParams.set('s', s)
        window.history.replaceState({ section: s }, '', url.toString())
      }
    } catch {
      // ignore (server-side or invalid URL)
    }
  }, [])

  // Initialize from URL param or history state
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const s = url.searchParams.get('s')
      if (s && isValidSection(s)) {
        setActiveState(s)
        // replace state so popstate works predictably
        window.history.replaceState({ section: s }, '', url.toString())
        return
      }
    } catch {
      // ignore
    }
    // if nothing in URL, ensure state exists
    window.history.replaceState({ section: 'hero' }, '', window.location.href)
  }, [])

  // Listen to back/forward
  useEffect(() => {
    const onPop = (ev: PopStateEvent) => {
      const section = (ev.state && ev.state.section) || null
      if (section && isValidSection(section)) {
        setActiveState(section)
        return
      }
      try {
        const url = new URL(window.location.href)
        const s = url.searchParams.get('s')
        if (s && isValidSection(s)) setActiveState(s)
      } catch {
        // ignore
      }
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <SectionContext.Provider value={{ active, setActive }}>
      {children}
    </SectionContext.Provider>
  )
}

export function useSection() {
  const ctx = useContext(SectionContext)
  if (!ctx) throw new Error('useSection must be used within SectionProvider')
  return ctx
}

export type { Section }
