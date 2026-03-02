/**
 * Rating - 评分组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  allowHalf?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  readOnly = false,
  size = 'md',
  color = '#fbbf24',
  showValue = false,
  allowHalf = false,
  onChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const displayValue = hoverValue || value;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayValue);
    const hasHalfStar = allowHalf && displayValue % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

    // 满星
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.button
          key={i}
          whileHover={{ scale: readOnly ? 1 : 1.2 }}
          whileTap={{ scale: readOnly ? 1 : 0.9 }}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => handleMouseEnter(i + 1)}
          className={cn(
            'transition-colors',
            !readOnly && 'cursor-pointer hover:opacity-80'
          )}
        >
          <Star
            className={sizeStyles[size]}
            fill={color}
            color={color}
          />
        </motion.button>
      );
    }

    // 半星
    if (hasHalfStar) {
      stars.push(
        <motion.button
          key="half"
          whileHover={{ scale: readOnly ? 1 : 1.2 }}
          whileTap={{ scale: readOnly ? 1 : 0.9 }}
          onClick={() => handleClick(fullStars + 0.5)}
          onMouseEnter={() => handleMouseEnter(fullStars + 0.5)}
          className={cn(
            'relative transition-colors',
            !readOnly && 'cursor-pointer hover:opacity-80'
          )}
        >
          <StarHalf
            className={sizeStyles[size]}
            fill={color}
            color={color}
          />
        </motion.button>
      );
    }

    // 空星
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <motion.button
          key={`empty-${i}`}
          whileHover={{ scale: readOnly ? 1 : 1.2 }}
          whileTap={{ scale: readOnly ? 1 : 0.9 }}
          onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
          onMouseEnter={() => handleMouseEnter(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
          className={cn(
            'transition-colors',
            !readOnly && 'cursor-pointer hover:opacity-80'
          )}
        >
          <Star
            className={sizeStyles[size]}
            fill="none"
            color={color}
            style={{ opacity: 0.3 }}
          />
        </motion.button>
      );
    }

    return stars;
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {renderStars()}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-300">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
