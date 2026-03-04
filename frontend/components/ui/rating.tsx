'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';
import { Star, StarHalf } from 'lucide-react';
import { useState } from 'react';

export interface RatingProps extends Omit<HTMLMotionProps<'div'>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
  readonly?: boolean;
  showValue?: boolean;
  allowHalf?: boolean;
  className?: string;
}

export const Rating = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  max = 5,
  size = 'md',
  variant = 'default',
  glowColor = 'yellow',
  readonly = false,
  showValue = false,
  allowHalf = false,
  className,
  ...props
}: RatingProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const displayValue = hoverValue || value;

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variantStyles = {
    default: 'text-cyber-yellow',
    neon: `text-cyber-${glowColor} drop-shadow-[0_0_8px_var(--cyber-${glowColor})]`,
    cyber: 'text-transparent bg-clip-text bg-gradient-to-r from-cyber-yellow to-cyber-cyan',
  };

  const handleStarClick = (index: number) => {
    if (readonly) return;
    const newValue = index + 1;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleStarHover = (index: number) => {
    if (readonly) return;
    setHoverValue(index + 1);
  };

  const handleStarLeave = () => {
    setHoverValue(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < max; i++) {
      const starValue = i + 1;
      const filled = starValue <= displayValue;
      const half = allowHalf && starValue - 0.5 === displayValue;

      stars.push(
        <motion.button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          disabled={readonly}
          className={cn(
            'focus:outline-none transition-colors',
            readonly && 'cursor-default'
          )}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
        >
          {filled ? (
            <Star
              className={cn(
                'fill-current',
                sizeStyles[size],
                variantStyles[variant]
              )}
            />
          ) : half ? (
            <StarHalf
              className={cn(
                'fill-current',
                sizeStyles[size],
                variantStyles[variant]
              )}
            />
          ) : (
            <Star
              className={cn(
                sizeStyles[size],
                'text-gray-600',
                !readonly && 'hover:text-cyber-yellow'
              )}
            />
          )}
        </motion.button>
      );
    }
    return stars;
  };

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      onMouseLeave={handleStarLeave}
      {...props}
    >
      {renderStars()}
      {showValue && (
        <span className="ml-2 text-sm text-gray-400 font-mono">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export interface RatingDisplayProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'yellow' | 'cyan' | 'purple' | 'pink';
  showCount?: boolean;
  count?: number;
  className?: string;
}

export const RatingDisplay = ({
  value,
  max = 5,
  size = 'md',
  variant = 'default',
  glowColor = 'yellow',
  showCount = false,
  count = 0,
  className,
}: RatingDisplayProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variantStyles = {
    default: 'text-cyber-yellow',
    neon: `text-cyber-${glowColor} drop-shadow-[0_0_8px_var(--cyber-${glowColor})]`,
    cyber: 'text-transparent bg-clip-text bg-gradient-to-r from-cyber-yellow to-cyber-cyan',
  };

  const stars = Array.from({ length: max }, (_, i) => {
    const starValue = i + 1;
    const filled = starValue <= value;

    return (
      <Star
        key={i}
        className={cn(
          'fill-current transition-colors',
          sizeStyles[size],
          filled ? variantStyles[variant] : 'text-gray-600'
        )}
      />
    );
  });

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex">{stars}</div>
      {showCount && (
        <span className="text-sm text-gray-400">({count})</span>
      )}
    </div>
  );
};
