"use client"

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type VariantKey = 'default' | 'soft' | 'dramatic'

export function SectionWrapper({ children, id, variant = 'default' }: { children: React.ReactNode, id?: string, variant?: VariantKey }) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    // focus management: focus the region for screen readers
    if (ref.current) ref.current.focus()
  }, [])
  // Let TypeScript infer the variants shape; avoid explicit `any` to satisfy linter
  const variants = {
    default: { initial: { opacity: 0, y: 12, scale: 0.995 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -12, scale: 0.995 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    soft: { initial: { opacity: 0, y: 6, scale: 0.998 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -6, scale: 0.998 }, transition: { duration: 0.8, ease: [0.2, 0.9, 0.27, 1] } },
    dramatic: { initial: { opacity: 0, y: 20, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.98 }, transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 0.9] } },
  }

  const v = variants[variant || 'default']

  return (
    <motion.section
      id={id}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      tabIndex={-1}
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition={v.transition as any}
      className="py-12"
    >
      {children}
    </motion.section>
  )
}
