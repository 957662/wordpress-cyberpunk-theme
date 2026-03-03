import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface GlowTextProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  animated?: boolean
}

const GlowText = forwardRef<HTMLHeadingElement, GlowTextProps>(
  ({ className, variant = 'cyan', size = 'md', animated = false, children, ...props }, ref) => {
    const variantStyles = {
      cyan: 'text-neon-cyan shadow-neon-cyan',
      purple: 'text-neon-purple shadow-neon-purple',
      pink: 'text-neon-pink shadow-neon-pink',
      yellow: 'text-neon-yellow shadow-neon-yellow',
    }

    const sizeStyles = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
      '2xl': 'text-4xl',
      '3xl': 'text-5xl',
    }

    return (
      <h1
        ref={ref}
        className={cn(
          'font-bold',
          variantStyles[variant],
          sizeStyles[size],
          animated && 'animate-neon-flicker',
          className
        )}
        style={{
          textShadow: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor`,
        }}
        {...props}
      >
        {children}
      </h1>
    )
  }
)

GlowText.displayName = 'GlowText'

export default GlowText
