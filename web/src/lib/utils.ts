import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animación de texto scramble
export function scrambleText(text: string, duration: number = 2000): Promise<void> {
  return new Promise((resolve) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
    const finalText = text
    const element = document.querySelector('[data-scramble]')
    if (!element) return resolve()

    let iterations = 0
    const maxIterations = Math.floor(duration / 50)

    const interval = setInterval(() => {
      element.textContent = finalText
        .split('')
        .map((_, index) => {
          if (index < iterations) return finalText[index]
          return characters[Math.floor(Math.random() * characters.length)]
        })
        .join('')

      iterations += 1

      if (iterations >= Math.min(finalText.length, maxIterations)) {
        clearInterval(interval)
        element.textContent = finalText
        resolve()
      }
    }, 50)
  })
}
