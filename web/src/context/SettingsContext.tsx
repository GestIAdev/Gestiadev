"use client"

import React, { createContext, useContext, useState } from 'react'

type Settings = {
  scrambleMs: number
  animationVariant: 'default' | 'soft' | 'dramatic'
  bgVariant: 'artistic' | 'noise' | 'dots'
  setScrambleMs: (n: number) => void
  setAnimationVariant: (v: 'default' | 'soft' | 'dramatic') => void
  setBgVariant: (v: 'artistic' | 'noise' | 'dots') => void
}

const SettingsContext = createContext<Settings | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [scrambleMs, setScrambleMs] = useState(3000)
  const [animationVariant, setAnimationVariant] = useState<'default' | 'soft' | 'dramatic'>('default')
  const [bgVariant, setBgVariant] = useState<'artistic' | 'noise' | 'dots'>('artistic')

  return (
    <SettingsContext.Provider value={{ scrambleMs, animationVariant, bgVariant, setScrambleMs, setAnimationVariant, setBgVariant }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
