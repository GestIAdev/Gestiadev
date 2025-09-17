"use client"

import React, { useRef, useEffect } from 'react'

interface HalftoneGridProps {
  className?: string
}

export default function HalftoneGrid({ className = '' }: HalftoneGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Parámetros optimizados para rendimiento
    const spacing = 40 // Más espaciado = menos puntos
    const baseRadius = 1.5 // Reducido de 2 para menos prominencia
    const time = { value: 0 }
    const particleTime = { value: 0 }

    // Reducir número de partículas para mejor rendimiento
    const particles: Array<{x: number, y: number, vx: number, vy: number, life: number, maxLife: number}> = []

    // Inicializar menos partículas
    const initParticles = () => {
      for (let i = 0; i < 25; i++) { // Reducido de 50 a 25
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Más lento
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 400,
          maxLife: 400
        })
      }
    }
    initParticles()

    // Función de distorsión con ondas más curvadas
    const distort = (x: number, y: number, time: number) => {
      // Ondas principales más pronunciadas
      const wave1 = Math.sin((x * 0.008) + time * 0.001) * 25 // Aumentado de 15 a 25
      const wave2 = Math.cos((y * 0.006) + time * 0.0012) * 20 // Aumentado de 12 a 20

      // Una sola onda secundaria más intensa
      const wave3 = Math.sin((x + y) * 0.004 + time * 0.002) * 15 // Aumentado de 8 a 15

      // Ruido más pronunciado
      const noise1 = Math.sin((x * 0.02) + time * 0.003) * 8 // Aumentado de 4 a 8
      const noise2 = Math.cos((y * 0.015) + time * 0.0025) * 6 // Aumentado de 3 a 6

      // Perspectiva más dramática
      const perspective = Math.sin((x * 0.003) + (y * 0.002) + time * 0.0008) * 8 // Aumentado de 5 a 8

      return {
        x: x + wave1 + wave2 + wave3 + noise1 + noise2,
        y: y + wave2 + wave3 + noise1 + noise2 + perspective,
        depth: perspective,
        intensity: Math.abs(wave1 + wave2) / 30
      }
    }

    // Función para calcular el radio variable simplificada
    const getPointRadius = (x: number, y: number, time: number, depth: number) => {
      const baseVariation = Math.sin((x + y) * 0.008 + time * 0.004) * 0.4 // Simplificado
      const depthVariation = Math.abs(depth) * 0.2 // Reducido
      return Math.max(0.8, baseRadius + baseVariation + depthVariation)
    }

    // Función para actualizar partículas
    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--

        // Respawn cuando muere
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.vx = (Math.random() - 0.5) * 0.5
          particle.vy = (Math.random() - 0.5) * 0.5
          particle.life = particle.maxLife
        }

        // Mantener dentro de bounds
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })
    }

    // Función para dibujar partículas optimizada con colores cyberpunk
    const drawParticles = (accentColor: string, fucsiaColor: string) => {
      ctx.save()
      ctx.fillStyle = accentColor

      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife
        // Color sutil para partículas (más oportunidades para menta)
        const particleColor = Math.sin(particle.x * 0.008 + particle.y * 0.008 + time.value * 0.003) > 0.3 ?
          accentColor : '#888888' // Aún más oportunidades para el color menta
        ctx.fillStyle = particleColor
        ctx.globalAlpha = alpha * 0.2 // Equilibrio sutil

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 0.8 + alpha * 0.4, 0, Math.PI * 2) // Más pequeñas
      })

      ctx.restore()
    }

    // Función de glitch aleatorio ELIMINADA para optimización

    // Cache de colores para mejor rendimiento
    let cachedColors = {
      bgColor: '',
      pointColor: '',
      accentColor: '',
      fucsiaColor: '',
      lastUpdate: 0
    }

    // Función para obtener colores cacheados
    const getCachedColors = () => {
      const now = Date.now()
      if (now - cachedColors.lastUpdate > 1000) { // Actualizar cada segundo
        const root = document.documentElement
        cachedColors = {
          bgColor: getComputedStyle(root).getPropertyValue('--color-noche').trim(),
          pointColor: getComputedStyle(root).getPropertyValue('--color-gris-trazado').trim(),
          accentColor: getComputedStyle(root).getPropertyValue('--color-menta').trim(),
          fucsiaColor: getComputedStyle(root).getPropertyValue('--color-fucsia-neon').trim(),
          lastUpdate: now
        }
      }
      return cachedColors
    }

    // Función para obtener color sutil con presencia cyberpunk reducida
    const getSubtleColor = (x: number, y: number, time: number, depth: number, colors: any) => {
      // Variación más sutil y menos frecuente
      const depthFactor = Math.abs(depth) * 0.05 // Reducido de 0.08
      const positionFactor = Math.sin((x + y) * 0.005 + time * 0.002) * 0.2 // Reducido frecuencia

      // Combinar factores con umbrales más altos
      const totalFactor = depthFactor + Math.abs(positionFactor)

      // Equilibrio favoreciendo menta sobre fucsia
      if (totalFactor > 0.3) { // Umbral más bajo para más menta
        return colors.accentColor
      } else if (totalFactor > 0.2) { // Umbral más alto para menos fucsia
        return colors.fucsiaColor
      } else if (totalFactor > 0.12) { // Umbral más bajo para más variedad
        // Gris con toque sutil de menta
        return Math.sin((x * 0.008) + time * 0.003) > 0.4 ? colors.accentColor : colors.pointColor
      } else {
        // Predominantemente gris
        return colors.pointColor
      }
    }

    // Función de animación optimizada
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Obtener colores cacheados
      const colors = getCachedColors()

      // Fondo simple sin gradiente para mejor rendimiento
      ctx.fillStyle = colors.bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar puntos distorsionados con UNA sola capa (optimizado)
      for (let x = -spacing; x < canvas.width + spacing * 2; x += spacing) {
        for (let y = -spacing; y < canvas.height + spacing * 2; y += spacing) {
          const distorted = distort(x, y, time.value)
          const radius = getPointRadius(x, y, time.value, distorted.depth)

          // Solo dibujar si está dentro del canvas
          if (distorted.x >= -radius && distorted.x <= canvas.width + radius &&
              distorted.y >= -radius && distorted.y <= canvas.height + radius) {

            // Usar colores sutiles
            const subtleColor = getSubtleColor(x, y, time.value, distorted.depth, colors)
            ctx.fillStyle = subtleColor
            ctx.beginPath()
            ctx.arc(distorted.x, distorted.y, radius, 0, Math.PI * 2)
            ctx.fill()

            // Glow sutil para resaltar colores cyberpunk
            if (Math.abs(distorted.depth) > 6) { // Umbral más accesible
              ctx.save()
              ctx.shadowColor = subtleColor
              ctx.shadowBlur = subtleColor !== colors.pointColor ? 1 : 0.3 // Glow moderado
              ctx.beginPath()
              ctx.arc(distorted.x, distorted.y, radius * 0.12, 0, Math.PI * 2) // Tamaño moderado
              ctx.fill()
              ctx.restore()
            }
          }
        }
      }

      // Efecto de scanlines más sutil y optimizado
      ctx.save()
      ctx.globalAlpha = 0.01 // Mucho más sutil
      ctx.fillStyle = colors.pointColor
      for (let y = 0; y < canvas.height; y += 6) {
        ctx.fillRect(0, y, canvas.width, 1)
      }
      ctx.restore()

      // Actualizar y dibujar partículas optimizadas
      updateParticles()
      drawParticles(colors.accentColor, colors.fucsiaColor)

      // Actualizar tiempos optimizados
      time.value += 1.2
      particleTime.value += 0.03

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{
        background: 'transparent',
        opacity: 0.4 // Equilibrio entre sutileza y visibilidad
      }}
    />
  )
}