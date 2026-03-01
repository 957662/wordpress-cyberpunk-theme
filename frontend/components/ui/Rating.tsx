/**
 * 评分组件
 * 星级评分展示和交互
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface RatingProps {
  /** 当前评分 */
  value: number;
  /** 最大评分 */
  max?: number;
  /** 是否可交互 */
  interactive?: boolean;
  /** 评分变化回调 */
  onChange?: (value: number) => void;
  /** 是否显示数值 */
  showValue?: boolean;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 只读模式 */
  readonly?: boolean;
  /** 自定义类名 */
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Rating({
  value,
  max = 5,
  interactive = false,
  onChange,
  showValue = true,
  size = 'md',
  readonly = false,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  const handleClick = (rating: number) => {
    if (interactive && !readonly) {
      onChange?.(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (interactive && !readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive && !readonly) {
      setHoverValue(0);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }).map((_, index) => {
          const rating = index + 1;
          const filled = rating <= displayValue;
          const partial = rating === Math.ceil(displayValue) && displayValue % 1 !== 0;

          return (
            <motion.button
              key={rating}
              whileHover={{ scale: interactive && !readonly ? 1.2 : 1 }}
              whileTap={{ scale: interactive && !readonly ? 0.9 : 1 }}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              disabled={readonly || !interactive}
              className={cn(
                'relative transition-colors',
                !readonly && interactive && 'cursor-pointer',
                readonly && 'cursor-default'
              )}
              aria-label={`评分 ${rating} / ${max}`}
            >
              <StarIcon
                className={cn(
                  sizeStyles[size],
                  filled ? 'text-cyber-yellow fill-current' : 'text-gray-600',
                  partial && 'text-cyber-yellow'
                )}
              />
              {partial && (
                <div
                  className={cn(
                    'absolute top-0 left-0 overflow-hidden',
                    sizeStyles[size]
                  )}
                  style={{ width: `${(displayValue % 1) * 100}%` }}
                >
                  <StarIcon className="w-full h-full text-cyber-yellow fill-current" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm text-gray-400 font-mono">
          {displayValue.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
}
