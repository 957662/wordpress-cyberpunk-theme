'use client';

/**
 * Rating Component
 * 评分组件 - 用于显示和收集评分
 */

import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  /** 当前评分值 */
  value?: number;
  /** 总评分数 */
  total?: number;
  /** 是否只读 */
  readonly?: boolean;
  /** 评分变化回调 */
  onChange?: (rating: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否允许半星 */
  allowHalf?: boolean;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
  /** 显示评分数字 */
  showValue?: boolean;
}

export function Rating({
  value = 0,
  total = 5,
  readonly = false,
  onChange,
  className,
  size = 'md',
  allowHalf = false,
  variant = 'default',
  showValue = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const displayValue = isHovering ? hoverValue : value;
  const clampedValue = Math.max(0, Math.min(displayValue, total));

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setIsHovering(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(clampedValue);
    const hasHalfStar = allowHalf && clampedValue % 1 >= 0.5;

    for (let i = 1; i <= total; i++) {
      const isActive = i <= fullStars;
      const isHalf = i === fullStars + 1 && hasHalfStar;

      if (allowHalf && isHalf) {
        stars.push(
          <div
            key={i}
            className={cn(
              'relative cursor-pointer',
              !readonly && 'hover:scale-110 transition-transform'
            )}
            onClick={() => handleClick(i - 0.5)}
            onMouseEnter={() => handleMouseEnter(i - 0.5)}
            onMouseLeave={handleMouseLeave}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'text-gray-700 absolute top-0 left-0'
              )}
              fill="currentColor"
            />
            <StarHalf
              className={cn(
                sizeClasses[size],
                'text-yellow-500 relative z-10',
                variant === 'neon' && 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]'
              )}
              fill="currentColor"
            />
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              'cursor-pointer transition-all',
              !readonly && 'hover:scale-110',
              isActive
                ? cn(
                    'text-yellow-500',
                    variant === 'neon' && 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                  )
                : 'text-gray-700'
            )}
            fill={isActive ? 'currentColor' : 'none'}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={cn('rating flex items-center gap-1', className)}>
      <div className="flex items-center">{renderStars()}</div>
      {showValue && (
        <span className="ml-2 text-sm font-medium">
          {clampedValue.toFixed(1)}/{total}
        </span>
      )}
    </div>
  );
}
