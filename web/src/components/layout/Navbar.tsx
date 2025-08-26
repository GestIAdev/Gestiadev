"use client"

import { useState } from 'react'
import { useSection } from '@/context/SectionContext'
import type { Section } from '@/context/SectionContext'

const navItems = [
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'armeria', label: 'Armería' },
  { id: 'alianzas', label: 'Alianzas' },
  { id: 'contacto', label: 'Contacto', isButton: true },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { active, setActive } = useSection()

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <div className="absolute inset-0 bg-[#0A0A1A]/95 backdrop-blur-sm border-b border-[#00F2A9]/20" />
      
      <nav className="relative max-w-[1100px] mx-auto px-4 h-20 flex items-center justify-between" role="navigation" aria-label="Main navigation">
  <button onClick={() => setActive('hero')} className="font-mono text-2xl font-bold tracking-tighter text-left" aria-label="Ir al inicio">
          <span className="text-[#EAEAEA]">GestIA</span>
          <span className="text-[#00F2A9]">dev</span>
        </button>

        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActive(item.id as Section)}
                aria-current={active === item.id ? 'page' : undefined}
                className={
                  (item.isButton
                    ? "px-4 py-2 font-mono border-2 border-[#00F2A9] transition-all duration-300"
                    : "font-mono transition-colors duration-200") +
                  ` ${active === item.id ? 'text-[#0A0A1A] bg-[#00F2A9]' : (item.isButton ? 'text-[#00F2A9]' : 'text-[#888888] hover:text-[#00F2A9]')}`
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 md:hidden p-2 text-[#00F2A9] hover:text-[#00F2A9]/80 transition-colors"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {!isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" id="mobile-menu" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#0A0A1A]/98 backdrop-blur-sm" />
          <nav className="relative h-full flex flex-col items-center justify-center space-y-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id as Section); setIsOpen(false) }}
                className={item.isButton 
                  ? "px-8 py-3 font-mono border-2 border-[#00F2A9] text-[#00F2A9] hover:bg-[#00F2A9] hover:text-[#0A0A1A] transition-all duration-300"
                  : "font-mono text-2xl text-[#888888] hover:text-[#00F2A9] transition-colors duration-200"
                }
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
