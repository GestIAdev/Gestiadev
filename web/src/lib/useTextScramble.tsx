"use client"

import { useEffect, useRef } from 'react'

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]";

// text: target string
// active: run the scramble only when active === true
// durationMs: total duration of the scramble animation (default 2200ms)
export function useTextScramble(targetRef: React.RefObject<HTMLElement | null>, text: string, active: boolean, durationMs = 2200) {
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const original = text
    const n = original.length

    // per-letter reveal times (ms) with slight randomness to make it organic
    const base = durationMs
    const revealTimings = Array.from({ length: n }).map((_, i) => {
      const stagger = (i / n) * base
      const jitter = (Math.random() - 0.5) * (base * 0.15)
      return Math.max(0, Math.round(stagger + jitter))
    })

    let start: number | null = null

    const update = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start

      let out = ''
      for (let i = 0; i < n; i++) {
        if (elapsed >= revealTimings[i]) out += original[i]
        else out += letters[Math.floor(Math.random() * letters.length)]
      }

      // small chance to insert a short pause near the end for drama
      if (elapsed > base * 0.9 && Math.random() < 0.08) {
        // do nothing (keep current scrambled state) to create a tiny hesitation
      }

      el.textContent = out

      const allRevealed = revealTimings.every((t) => elapsed >= t)
      if (!allRevealed) rafRef.current = requestAnimationFrame(update)
      else el.textContent = original
    }

    if (active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      start = null
      rafRef.current = requestAnimationFrame(update)
    } else {
      el.textContent = original
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [targetRef, text, active, durationMs])
}
