'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface InputProps extends HTMLMotionProps<'input'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <motion.input
          whileFocus={{ scale: 1.01 }}
          className={cn(
            'w-full px-4 py-2.5 bg-cyber-muted border border-cyber-border rounded-lg',
            'text-gray-100 placeholder-gray-500',
            'focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
            'transition-all duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={cn('mt-1 text-sm', error ? 'text-red-400' : 'text-gray-400')}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
