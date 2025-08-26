"use client"

import { useSettings } from '@/context/SettingsContext'

export function DemoPanel() {
  const { scrambleMs, setScrambleMs, animationVariant, setAnimationVariant, bgVariant, setBgVariant } = useSettings()

  return (
  <div className="fixed bottom-6 right-6 bg-[#0A0A1A]/90 border border-[#333333] p-4 rounded-md z-40">
      <h4 className="text-sm font-mono mb-2">Demo Panel</h4>

      <label className="block text-xs text-[#888888]">Scramble speed: {scrambleMs}ms</label>
      <input type="range" min={800} max={5000} value={scrambleMs} onChange={(e) => setScrambleMs(Number(e.target.value))} className="w-48" />

      <div className="mt-3 text-xs">
  <label className="block text-[#888888] mb-1">Animation</label>
  <select value={animationVariant} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAnimationVariant(e.target.value as 'default' | 'soft' | 'dramatic')} className="bg-transparent border border-[#333333] text-sm">
          <option value="default">Default</option>
          <option value="soft">Soft</option>
          <option value="dramatic">Dramatic</option>
        </select>
      </div>
      <div className="mt-3 text-xs">
        <label className="block text-[#888888] mb-1">Fondo</label>
  <select className="bg-transparent border border-[#333333] text-sm" value={bgVariant} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBgVariant(e.target.value as 'artistic' | 'noise' | 'dots')}>
          <option value="artistic">Artistic</option>
          <option value="noise">Noise (subtle)</option>
          <option value="dots">Dots (pattern)</option>
        </select>
      </div>
    </div>
  )
}
