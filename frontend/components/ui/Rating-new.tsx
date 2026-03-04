'use client';

/**
 * Rating Component
 * Interactive star rating with hover and animation
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Rating({
  value,
  onChange,
  max = 5,
  readonly = false,
  size = 'md',
  color = '#fbbf24',
  showValue = false,
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  // Handle rating change
  const handleRatingChange = useCallback(
    (rating: number) => {
      if (!readonly && onChange) {
        onChange(rating);
      }
    },
    [readonly, onChange]
  );

  // Handle mouse enter
  const handleMouseEnter = useCallback((rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  }, [readonly]);

  // Handle mouse leave
  const HandleMouseLeave = useCallback(() => {
    if (!readonly) {
      setHoverValue(0);
    }
  }, [readonly]);

  // Calculate display value
  const displayValue = hoverValue > 0 ? hoverValue : value;

  // Render star
  const renderStar = useCallback(
    (index: number) => {
      const starValue = index + 1;
      const filled = starValue <= displayValue;
      const half = !filled && starValue - 0.5 <= displayValue;

      return (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleRatingChange(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform duration-200 ${
            !readonly && 'hover:scale-110'
          }`}
          whileHover={{ scale: readonly ? 1 : 1.1 }}
          whileTap={{ scale: readonly ? 1 : 0.9 }}
        >
          {filled ? (
            <Star
              className={`${SIZE_MAP[size]}`}
              style={{ color }}
              fill={color}
            />
          ) : half ? (
            <div className="relative">
              <StarHalf className={`${SIZE_MAP[size]}`} style={{ color }} fill={color} />
            </div>
          ) : (
            <Star
              className={`${SIZE_MAP[size]}`}
              style={{ color }}
              fill="none"
              strokeWidth={2}
            />
          )}
        </motion.button>
      );
    },
    [displayValue, handleRatingChange, handleMouseEnter, readonly, size, color]
  );

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      onMouseLeave={HandleMouseLeave}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className="text-white font-semibold ml-2">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
