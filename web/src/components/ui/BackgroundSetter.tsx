"use client"

import { useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'

export default function BackgroundSetter() {
  const { bgVariant } = useSettings()

  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    const classes = ['bg-artistic', 'bg-noise', 'bg-dots']
    // remove any existing bg classes
    body.classList.remove(...classes)
    // add the selected one
    const cls = bgVariant === 'artistic' ? 'bg-artistic' : bgVariant === 'noise' ? 'bg-noise' : 'bg-dots'
    body.classList.add(cls)

    // ensure some baseline classes remain
    body.classList.add('relative', 'min-h-screen', 'w-full', 'text-white', 'antialiased')

    return () => {
      body.classList.remove(...classes)
    }
  }, [bgVariant])

  return null
}
