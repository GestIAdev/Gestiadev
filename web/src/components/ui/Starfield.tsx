"use client"

import React, { useEffect, useRef } from 'react'

type Sphere = { cx: number; cy: number; r: number; density: number }

// Simple seeded PRNG (xorshift32) para resultados consistentes
function makeRng(seed = 123456789) {
  let x = seed >>> 0
  return function () {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return (x >>> 0) / 4294967295
  }
}

export default function Starfield() {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return

    // Limpieza del contenido previo
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const ns = 'http://www.w3.org/2000/svg'
    const rng = makeRng(Date.now()) // Semilla dinámica para un universo nuevo en cada carga

    // --- DEFINICIONES (DEFS) ---
    const defs = document.createElementNS(ns, 'defs')
    const filter = document.createElementNS(ns, 'filter')
    filter.setAttribute('id', 'glow')
    const fe = document.createElementNS(ns, 'feGaussianBlur')
    fe.setAttribute('stdDeviation', '1.5')
    filter.appendChild(fe)
    defs.appendChild(filter)
    svg.appendChild(defs)

    // --- FONDO OSCURO ---
    const bg = document.createElementNS(ns, 'rect')
    bg.setAttribute('width', '100%')
    bg.setAttribute('height', '100%')
    bg.setAttribute('fill', '#0A0A1A')
    svg.appendChild(bg)
    
    // --- AJUSTE: CAPA DE MICROPUNTOS DE FONDO MEJORADA ---
    const dustContainer = document.createElementNS(ns, 'g')
    dustContainer.setAttribute('id', 'dust-container')
    const dustFrag = document.createDocumentFragment()
    for (let i = 0; i < 700; i++) { // Aumentamos a 700 puntos
        const dust = document.createElementNS(ns, 'circle');
        dust.setAttribute('cx', String(rng() * 1600));
        dust.setAttribute('cy', String(rng() * 900));
        dust.setAttribute('r', String(rng() * 0.6 + 0.2)); // Ligeramente más grandes
        dust.setAttribute('fill', '#EAEAEA'); // Usamos el color de texto para más contraste
        // Aumentamos el rango de opacidad: entre 0.1 y 0.35
        dust.setAttribute('fill-opacity', String(rng() * 0.25 + 0.1));
        // 5% de probabilidad de puntos ligeramente más grandes para sensación de profundidad
        if (rng() < 0.05) {
          dust.setAttribute('r', String(rng() * 1 + 0.5));
        }
        dustFrag.appendChild(dust);
    }
    dustContainer.appendChild(dustFrag)
    svg.appendChild(dustContainer)

    // --- CONTENEDOR DE ESFERAS ---
    const g = document.createElementNS(ns, 'g')
    g.setAttribute('id', 'point-container')
    svg.appendChild(g)

    // Función de distribución Gaussiana (Box-Muller)
    function gaussianRandom() {
      let u = 0, v = 0
      while (u === 0) u = rng()
      while (v === 0) v = rng()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    }

    const GAUSSIAN_SPREAD_FACTOR = 0.35

    const sphereBases = [
      { r: 350, density: 600 },
      { r: 200, density: 350 },
      { r: 150, density: 200 },
      { r: 250, density: 300 },
    ];

    const spheres: Sphere[] = sphereBases.map(base => ({
      cx: rng() * 1600,
      cy: rng() * 900,
      r: base.r,
      density: base.density,
    }));

    const frag = document.createDocumentFragment()
    spheres.forEach(s => {
      for (let i = 0; i < s.density; i++) {
        const angle = rng() * 2 * Math.PI
        const dist = Math.abs(gaussianRandom() * GAUSSIAN_SPREAD_FACTOR) * s.r
        if (dist > s.r) continue
        
        const x = s.cx + dist * Math.cos(angle)
        const y = s.cy + dist * Math.sin(angle)
        
        const falloff = 1 - (dist / s.r)
        const opacity = Math.pow(falloff, 2) * 0.9 + 0.1
        const radius = Math.pow(falloff, 2) * 1.5 + 0.5
        
        const color = rng() < 0.2 ? '#00F2A9' : '#EAEAEA'

        const c = document.createElementNS(ns, 'circle')
        c.setAttribute('cx', String(x))
        c.setAttribute('cy', String(y))
        c.setAttribute('r', String(radius))
        c.setAttribute('fill', color)
        c.setAttribute('fill-opacity', String(opacity))
        if (color === '#00F2A9' && radius > 1.2) {
          c.setAttribute('filter', 'url(#glow)')
        }
        frag.appendChild(c)
      }
    })

    g.appendChild(frag)

    return () => {
      while (svg.firstChild) svg.removeChild(svg.firstChild)
    }
  }, [])

  return (
    <svg
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 900"
      aria-hidden
    />
  )
}
