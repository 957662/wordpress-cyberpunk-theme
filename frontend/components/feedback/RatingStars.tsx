'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  count?: number
  allowHalf?: boolean
  className?: string
  showValue?: boolean
}

export function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 'md',
  count = 5,
  allowHalf = false,
  className,
  showValue = false,
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const handleClick = (index: number) => {
    if (readonly || !onChange) return
    onChange(index + 1)
  }

  const handleMouseEnter = (index: number) => {
    if (readonly) return
    setHoverValue(index + 1)
  }

  const handleMouseLeave = () => {
    setHoverValue(0)
  }

  const getFillPercentage = (index: number) => {
    const currentValue = hoverValue || value
    const diff = currentValue - index

    if (diff >= 1) return 100
    if (diff > 0) return diff * 100
    return 0
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: count }).map((_, index) => {
          const fillPercentage = getFillPercentage(index)

          return (
            <motion.button
              key={index}
              whileHover={{ scale: readonly ? 1 : 1.1 }}
              whileTap={{ scale: readonly ? 1 : 0.9 }}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className="relative focus:outline-none"
              aria-label={`Rate ${index + 1} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  fillPercentage > 0 ? 'text-cyber-yellow' : 'text-gray-600'
                )}
              />
              {allowHalf && fillPercentage > 0 && fillPercentage < 100 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={cn(sizeClasses[size], 'text-cyber-yellow')}
                    fill="currentColor"
                  />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {showValue && (
        <span className="ml-2 text-sm text-gray-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export interface RatingDistributionProps {
  ratings: number[]
  totalRatings: number
  className?: string
}

export function RatingDistribution({
  ratings,
  totalRatings,
  className,
}: RatingDistributionProps) {
  const percentage = (count: number) => {
    if (totalRatings === 0) return 0
    return (count / totalRatings) * 100
  }

  return (
    <div className={cn('space-y-2', className)}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratings[star - 1] || 0
        const percent = percentage(count)

        return (
          <div key={star} className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-8">{star} 星</span>
            <div className="flex-1 h-2 bg-cyber-dark/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              />
            </div>
            <span className="text-sm text-gray-400 w-12 text-right">
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
