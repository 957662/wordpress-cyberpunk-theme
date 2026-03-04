'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RatingColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingIcon = 'star' | 'heart' | 'bolt' | 'fire';

export interface CyberRatingProps {
  value?: number;
  max?: number;
  color?: RatingColor;
  size?: RatingSize;
  icon?: RatingIcon;
  readonly?: boolean;
  disabled?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  precision?: number;
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;
  className?: string;
}

const colorClasses = {
  cyan: 'text-cyan-400 fill-cyan-400',
  purple: 'text-purple-400 fill-purple-400',
  pink: 'text-pink-400 fill-pink-400',
  green: 'text-green-400 fill-green-400',
  yellow: 'text-yellow-400 fill-yellow-400',
};

const emptyColorClasses = {
  cyan: 'text-cyan-400/30 fill-cyan-400/30',
  purple: 'text-purple-400/30 fill-purple-400/30',
  pink: 'text-pink-400/30 fill-pink-400/30',
  green: 'text-green-400/30 fill-green-400/30',
  yellow: 'text-yellow-400/30 fill-yellow-400/30',
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const glowClasses = {
  cyan: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  purple: 'shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  pink: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  green: 'shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  yellow: 'shadow-[0_0_10px_rgba(240,255,0,0.5)]',
};

const icons = {
  star: Star,
  heart: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  bolt: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  fire: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
};

export const CyberRating: React.FC<CyberRatingProps> = ({
  value = 0,
  max = 5,
  color = 'yellow',
  size = 'md',
  icon = 'star',
  readonly = false,
  disabled = false,
  allowHalf = false,
  showValue = false,
  precision = 0.1,
  onChange,
  onHover,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const [internalValue, setInternalValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const displayValue = hoverValue || internalValue;
  const IconComponent = icons[icon];
  const colorClass = colorClasses[color];
  const emptyColorClass = emptyColorClasses[color];
  const sizeClass = sizeClasses[size];

  const calculateRatingFromPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    let rating = percentage * max;

    if (allowHalf) {
      rating = Math.round(rating * 2) / 2;
    } else {
      rating = Math.round(rating);
    }

    return Math.max(0, Math.min(max, rating));
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || disabled) return;
    const rating = calculateRatingFromPosition(e);
    setHoverValue(rating);
    onHover?.(rating);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || disabled) return;
    const rating = calculateRatingFromPosition(e);
    setHoverValue(rating);
    onHover?.(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
    onHover?.(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || disabled) return;
    const rating = calculateRatingFromPosition(e);
    setInternalValue(rating);
    onChange?.(rating);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayValue);
    const hasHalfStar = allowHalf && displayValue % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

    // 完整星星
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.div
          key={`full-${i}`}
          className="relative"
          whileHover={{ scale: readonly || disabled ? 1 : 1.1 }}
          whileTap={{ scale: readonly || disabled ? 1 : 0.95 }}
        >
          <IconComponent className={cn(sizeClass, colorClass)} />
          {/* 光晕效果 */}
          {!readonly && !disabled && (
            <div className={cn('absolute inset-0 blur-sm opacity-50', glowClasses[color])} />
          )}
        </motion.div>
      );
    }

    // 半星
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <IconComponent className={cn(sizeClass, emptyColorClass)} />
          <div className="absolute inset-0 overflow-hidden">
            <IconComponent className={cn(sizeClass, colorClass)} />
          </div>
        </div>
      );
    }

    // 空星
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <motion.div
          key={`empty-${i}`}
          className="relative"
          whileHover={{ scale: readonly || disabled ? 1 : 1.1 }}
          whileTap={{ scale: readonly || disabled ? 1 : 0.95 }}
        >
          <IconComponent className={cn(sizeClass, emptyColorClass)} />
        </motion.div>
      );
    }

    return stars;
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {/* 评分星星 */}
      <div
        ref={containerRef}
        className={cn(
          'flex items-center gap-1',
          !readonly && !disabled && 'cursor-pointer'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {renderStars()}
      </div>

      {/* 显示数值 */}
      {showValue && (
        <motion.div
          className={cn(
            'ml-2 px-2 py-1 rounded-md',
            'bg-gradient-to-r',
            `from-${color}-500/20 to-${color}-600/20`,
            'border-2',
            `border-${color}-500/50`,
            'text-sm font-semibold',
            colorClass
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {displayValue.toFixed(precision === 0.1 ? 1 : precision === 0.01 ? 2 : 0)}
          /{max}
        </motion.div>
      )}
    </div>
  );
};

// 只读评分显示组件
export interface RatingDisplayProps {
  value: number;
  max?: number;
  color?: RatingColor;
  size?: RatingSize;
  icon?: RatingIcon;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  value,
  max = 5,
  color = 'yellow',
  size = 'md',
  icon = 'star',
  showValue = false,
  showCount = false,
  count,
  className,
}) => {
  const IconComponent = icons[icon];
  const colorClass = colorClasses[color];
  const emptyColorClass = emptyColorClasses[color];
  const sizeClass = sizeClasses[size];

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {/* 完整星星 */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <IconComponent key={`full-${i}`} className={cn(sizeClass, colorClass)} />
        ))}

        {/* 半星 */}
        {hasHalfStar && (
          <div className="relative">
            <IconComponent className={cn(sizeClass, emptyColorClass)} />
            <div className="absolute inset-0 overflow-hidden">
              <IconComponent className={cn(sizeClass, colorClass)} />
            </div>
          </div>
        )}

        {/* 空星 */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <IconComponent key={`empty-${i}`} className={cn(sizeClass, emptyColorClass)} />
        ))}
      </div>

      {/* 显示数值 */}
      {showValue && (
        <span className={cn('text-sm font-semibold', colorClass)}>
          {value.toFixed(1)}
        </span>
      )}

      {/* 显示评论数 */}
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-400">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default CyberRating;
