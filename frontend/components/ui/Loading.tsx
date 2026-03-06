'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'white'
  text?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const colorClasses = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  pink: 'text-cyber-pink',
  yellow: 'text-cyber-yellow',
  white: 'text-white',
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  color = 'cyan',
  text,
  className,
}: LoadingProps) {
  const baseClasses = cn(sizeClasses[size], colorClasses[color], className)

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center gap-3">
        <Loader2 className={cn(baseClasses, 'animate-spin')} />
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-current', sizeClasses[size].replace('w-', 'w-').replace(' h-', ' h-'))}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              width: parseInt(sizeClasses[size].split('-')[1]) / 2,
              height: parseInt(sizeClasses[size].split('-')[1]) / 2,
            }}
          />
        ))}
        {text && <p className="text-sm text-gray-400 ml-2">{text}</p>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className="flex items-center justify-center gap-3">
        <motion.div
          className={cn('rounded-full bg-current blur-sm', baseClasses)}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    )
  }

  return null
}

export interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'
  width?: string | number
  height?: string | number
}

export function LoadingSkeleton({
  className,
  variant = 'rect',
  width,
  height,
}: LoadingSkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  }

  return (
    <motion.div
      className={cn(
        'bg-cyber-border/30',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export interface PageLoadingProps {
  text?: string
  subtext?: string
  variant?: 'default' | 'minimal' | 'creative'
}

export function PageLoading({ text, subtext, variant = 'default' }: PageLoadingProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text={text} />
      </div>
    )
  }

  if (variant === 'creative') {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-4">
        {['cyan', 'purple', 'pink'].map((color, i) => (
          <motion.div
            key={color}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: `var(--cyber-${color})`,
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <motion.div
          className="w-20 h-20 border-4 border-cyber-border/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyber-cyan rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {text && (
        <motion.p
          className="text-lg font-medium text-gray-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}

      {subtext && (
        <p className="text-sm text-gray-500">{subtext}</p>
      )}
    </div>
  )
}
