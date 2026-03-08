'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variants = {
  default: 'bg-cyber-muted text-gray-300 border border-cyber-border',
  primary: 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan',
  success: 'bg-green-500/20 text-green-400 border border-green-500',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500',
  danger: 'bg-red-500/20 text-red-400 border border-red-500',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500'
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.span>
  )
}
