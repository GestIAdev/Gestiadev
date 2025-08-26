'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-mono transition-all duration-300 overflow-hidden',
          // Variant styles
          variant === 'default' && 'bg-accent text-bg-dark hover:bg-accent/90',
          variant === 'outline' && 'border-2 border-accent text-accent hover:bg-accent hover:text-bg-dark',
          // Size styles
          size === 'default' && 'px-6 py-2 text-sm',
          size === 'lg' && 'px-8 py-3 text-lg',
          // Drawing animation container
          'group',
          className
        )}
        {...props}
      >
        <span className="relative z-10">
          {children}
        </span>
        <div className="absolute inset-0 transform translate-y-full bg-accent transition-transform duration-300 group-hover:translate-y-0" />
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
