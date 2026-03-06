'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  value: number;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  showValue?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const colorClasses = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  readonly = false,
  size = 'md',
  color = 'yellow',
  showValue = false,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayValue = hoverValue || value;

    for (let i = 1; i <= max; i++) {
      const starValue = i;
      const isFilled = starValue <= displayValue;
      const isHalf = !isFilled && starValue - 0.5 <= displayValue;
      const isEmpty = !isFilled && !isHalf;

      stars.push(
        <motion.button
          key={i}
          type="button"
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          className={cn(
            'relative transition-all duration-200',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            colorClasses[color]
          )}
          disabled={readonly}
        >
          {isFilled && (
            <Star className={cn('fill-current', sizeClasses[size])} />
          )}
          {isHalf && (
            <div className={cn('relative', sizeClasses[size])}>
              <StarHalf className="fill-current absolute top-0 left-0" />
              <Star className="fill-none" />
            </div>
          )}
          {isEmpty && (
            <Star className={cn('fill-none', sizeClasses[size])} />
          )}

          {/* Glow Effect */}
          {!readonly && hoverValue >= starValue && (
            <motion.div
              className="absolute inset-0 blur-lg opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              style={{ backgroundColor: colorClasses[color].replace('text-', '') }}
            />
          )}
        </motion.button>
      );
    }

    return stars;
  };

  return (
    <div
      className={cn(
        'flex items-center',
        gapClasses[size],
        onMouseLeave={handleMouseLeave,
        className
      )}
    >
      {/* Stars */}
      <div className="flex items-center">
        {renderStars()}
      </div>

      {/* Value Display */}
      {showValue && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'ml-2 font-semibold text-gray-400',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg'
          )}
        >
          {value.toFixed(1)}/{max}
        </motion.span>
      )}

      {/* Rating Bar */}
      <div className={cn('ml-2 h-2 w-24 bg-gray-700 rounded-full overflow-hidden')}>
        <motion.div
          className={cn('h-full bg-gradient-to-r from-cyan-500 to-purple-500')}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default Rating;
