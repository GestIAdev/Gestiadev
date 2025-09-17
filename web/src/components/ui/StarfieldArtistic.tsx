"use client"

import React, { useEffect, useRef } from 'react'

// Simple seeded PRNG para consistencia
function makeRng(seed = 987654321) {
  let x = seed >>> 0
  return function () {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return (x >>> 0) / 4294967295
  }
}

// Función para generar puntos en una curva sinusoidal
function generateSinusoidalPoints(rng: () => number, centerX: number, centerY: number, amplitude: number, frequency: number, points: number) {
  const curvePoints = []
  for (let i = 0; i < points; i++) {
    const t = (i / (points - 1)) * 4 * Math.PI // 2 ciclos completos
    const x = centerX + (i - points/2) * 8
    const y = centerY + Math.sin(t * frequency) * amplitude + rng() * 20 - 10
    curvePoints.push({ x, y })
  }
  return curvePoints
}

// Función para generar puntos en espiral
function generateSpiralPoints(rng: () => number, centerX: number, centerY: number, radius: number, turns: number, points: number) {
  const spiralPoints = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * turns * 2 * Math.PI
    const r = (i / points) * radius
    const x = centerX + Math.cos(t) * r + rng() * 15 - 7.5
    const y = centerY + Math.sin(t) * r + rng() * 15 - 7.5
    spiralPoints.push({ x, y })
  }
  return spiralPoints
}

// Función para generar puntos en forma de red neuronal
function generateNetworkPoints(rng: () => number, width: number, height: number, nodes: number) {
  const networkPoints = []
  const cols = Math.ceil(Math.sqrt(nodes))
  const rows = Math.ceil(nodes / cols)

  for (let i = 0; i < nodes; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = (col + 0.5) * (width / cols) + rng() * 50 - 25
    const y = (row + 0.5) * (height / rows) + rng() * 50 - 25
    networkPoints.push({ x, y })
  }
  return networkPoints
}

export default function StarfieldArtistic() {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return

    // Limpieza del contenido previo
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const ns = 'http://www.w3.org/2000/svg'
    const rng = makeRng(Date.now())

    // --- DEFINICIONES (DEFS) ---
    const defs = document.createElementNS(ns, 'defs')

    // Filtro de glow para elementos destacados
    const glowFilter = document.createElementNS(ns, 'filter')
    glowFilter.setAttribute('id', 'artistic-glow')
    const feGaussianBlur = document.createElementNS(ns, 'feGaussianBlur')
    feGaussianBlur.setAttribute('stdDeviation', '2')
    glowFilter.appendChild(feGaussianBlur)
    defs.appendChild(glowFilter)

    // Gradiente radial para nebulosas
    const radialGradient = document.createElementNS(ns, 'radialGradient')
    radialGradient.setAttribute('id', 'nebulosa-gradient')
    radialGradient.setAttribute('cx', '50%')
    radialGradient.setAttribute('cy', '50%')
    const stop1 = document.createElementNS(ns, 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', '#00F2A9')
    stop1.setAttribute('stop-opacity', '0.1')
    const stop2 = document.createElementNS(ns, 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', '#00F2A9')
    stop2.setAttribute('stop-opacity', '0')
    radialGradient.appendChild(stop1)
    radialGradient.appendChild(stop2)
    defs.appendChild(radialGradient)

    svg.appendChild(defs)

    // --- FONDO OSCURO ---
    const bg = document.createElementNS(ns, 'rect')
    bg.setAttribute('width', '100%')
    bg.setAttribute('height', '100%')
    bg.setAttribute('fill', '#0A0A1A')
    svg.appendChild(bg)

    // --- CAPA 1: NEBULOSAS DE FONDO ---
    const nebulosasContainer = document.createElementNS(ns, 'g')
    nebulosasContainer.setAttribute('id', 'nebulosas-container')

    for (let i = 0; i < 5; i++) {
      const nebulosa = document.createElementNS(ns, 'circle')
      nebulosa.setAttribute('cx', String(rng() * 1600))
      nebulosa.setAttribute('cy', String(rng() * 900))
      nebulosa.setAttribute('r', String(200 + rng() * 300))
      nebulosa.setAttribute('fill', 'url(#nebulosa-gradient)')
      nebulosa.setAttribute('opacity', String(0.3 + rng() * 0.4))
      nebulosasContainer.appendChild(nebulosa)
    }
    svg.appendChild(nebulosasContainer)

    // --- CAPA 2: PATRONES CURVOS (SINUSOIDALES) ---
    const curvesContainer = document.createElementNS(ns, 'g')
    curvesContainer.setAttribute('id', 'curves-container')

    for (let i = 0; i < 8; i++) {
      const curvePoints = generateSinusoidalPoints(
        rng,
        rng() * 1600,
        rng() * 900,
        80 + rng() * 120,
        0.5 + rng() * 1.5,
        25 + Math.floor(rng() * 15)
      )

      // Crear path curvo con los puntos
      let pathData = `M ${curvePoints[0].x} ${curvePoints[0].y}`
      for (let j = 1; j < curvePoints.length; j++) {
        const prev = curvePoints[j-1]
        const curr = curvePoints[j]
        const cp1x = prev.x + (curr.x - prev.x) * 0.5
        const cp1y = prev.y
        const cp2x = curr.x - (curr.x - prev.x) * 0.5
        const cp2y = curr.y
        pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`
      }

      const path = document.createElementNS(ns, 'path')
      path.setAttribute('d', pathData)
      path.setAttribute('stroke', rng() < 0.3 ? '#00F2A9' : '#EAEAEA')
      path.setAttribute('stroke-width', String(1 + rng() * 2))
      path.setAttribute('fill', 'none')
      path.setAttribute('opacity', String(0.4 + rng() * 0.4))
      if (rng() < 0.2) {
        path.setAttribute('filter', 'url(#artistic-glow)')
      }
      curvesContainer.appendChild(path)

      // Agregar puntos en la curva
      curvePoints.forEach((point, index) => {
        if (rng() < 0.6) { // Solo algunos puntos
          const dot = document.createElementNS(ns, 'circle')
          dot.setAttribute('cx', String(point.x))
          dot.setAttribute('cy', String(point.y))
          dot.setAttribute('r', String(1 + rng() * 2))
          dot.setAttribute('fill', rng() < 0.2 ? '#00F2A9' : '#EAEAEA')
          dot.setAttribute('opacity', String(0.6 + rng() * 0.4))
          curvesContainer.appendChild(dot)
        }
      })
    }
    svg.appendChild(curvesContainer)

    // --- CAPA 3: ESPIRALES ---
    const spiralsContainer = document.createElementNS(ns, 'g')
    spiralsContainer.setAttribute('id', 'spirals-container')

    for (let i = 0; i < 6; i++) {
      const spiralPoints = generateSpiralPoints(
        rng,
        rng() * 1600,
        rng() * 900,
        100 + rng() * 200,
        2 + rng() * 3,
        30 + Math.floor(rng() * 20)
      )

      // Conectar puntos con líneas curvas
      for (let j = 1; j < spiralPoints.length; j++) {
        const prev = spiralPoints[j-1]
        const curr = spiralPoints[j]

        const line = document.createElementNS(ns, 'line')
        line.setAttribute('x1', String(prev.x))
        line.setAttribute('y1', String(prev.y))
        line.setAttribute('x2', String(curr.x))
        line.setAttribute('y2', String(curr.y))
        line.setAttribute('stroke', rng() < 0.25 ? '#00F2A9' : '#EAEAEA')
        line.setAttribute('stroke-width', String(0.5 + rng() * 1.5))
        line.setAttribute('opacity', String(0.3 + rng() * 0.5))
        spiralsContainer.appendChild(line)

        // Puntos en espiral
        if (rng() < 0.4) {
          const dot = document.createElementNS(ns, 'circle')
          dot.setAttribute('cx', String(curr.x))
          dot.setAttribute('cy', String(curr.y))
          dot.setAttribute('r', String(0.8 + rng() * 1.5))
          dot.setAttribute('fill', rng() < 0.15 ? '#00F2A9' : '#EAEAEA')
          dot.setAttribute('opacity', String(0.5 + rng() * 0.4))
          spiralsContainer.appendChild(dot)
        }
      }
    }
    svg.appendChild(spiralsContainer)

    // --- CAPA 4: RED NEURONAL ---
    const networkContainer = document.createElementNS(ns, 'g')
    networkContainer.setAttribute('id', 'network-container')

    const networkPoints = generateNetworkPoints(rng, 1600, 900, 15)

    // Conectar nodos con líneas
    for (let i = 0; i < networkPoints.length; i++) {
      for (let j = i + 1; j < networkPoints.length; j++) {
        if (rng() < 0.15) { // Solo algunas conexiones
          const line = document.createElementNS(ns, 'line')
          line.setAttribute('x1', String(networkPoints[i].x))
          line.setAttribute('y1', String(networkPoints[i].y))
          line.setAttribute('x2', String(networkPoints[j].x))
          line.setAttribute('y2', String(networkPoints[j].y))
          line.setAttribute('stroke', '#EAEAEA')
          line.setAttribute('stroke-width', '0.5')
          line.setAttribute('opacity', String(0.2 + rng() * 0.3))
          networkContainer.appendChild(line)
        }
      }
    }

    // Agregar nodos
    networkPoints.forEach(point => {
      const node = document.createElementNS(ns, 'circle')
      node.setAttribute('cx', String(point.x))
      node.setAttribute('cy', String(point.y))
      node.setAttribute('r', String(2 + rng() * 3))
      node.setAttribute('fill', rng() < 0.2 ? '#00F2A9' : '#EAEAEA')
      node.setAttribute('opacity', String(0.6 + rng() * 0.3))
      if (rng() < 0.1) {
        node.setAttribute('filter', 'url(#artistic-glow)')
      }
      networkContainer.appendChild(node)
    })

    svg.appendChild(networkContainer)

    // --- CAPA 5: MICROPUNTOS DE PROFUNDIDAD ---
    const micropuntosContainer = document.createElementNS(ns, 'g')
    micropuntosContainer.setAttribute('id', 'micropuntos-container')

    for (let i = 0; i < 500; i++) {
      const micropunto = document.createElementNS(ns, 'circle')
      micropunto.setAttribute('cx', String(rng() * 1600))
      micropunto.setAttribute('cy', String(rng() * 900))
      micropunto.setAttribute('r', String(rng() * 0.8 + 0.1))
      micropunto.setAttribute('fill', '#EAEAEA')
      micropunto.setAttribute('opacity', String(rng() * 0.3 + 0.05))
      micropuntosContainer.appendChild(micropunto)
    }
    svg.appendChild(micropuntosContainer)

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