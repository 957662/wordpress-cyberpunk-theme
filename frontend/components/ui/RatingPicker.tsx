'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

export interface RatingPickerProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  showValue?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    active: 'text-cyan-400',
    hover: 'hover:text-cyan-300',
    glow: 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]',
  },
  purple: {
    active: 'text-purple-400',
    hover: 'hover:text-purple-300',
    glow: 'drop-shadow-[0_0_8px_rgba(157,0,255,0.6)]',
  },
  pink: {
    active: 'text-pink-400',
    hover: 'hover:text-pink-300',
    glow: 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]',
  },
  yellow: {
    active: 'text-yellow-400',
    hover: 'hover:text-yellow-300',
    glow: 'drop-shadow-[0_0_8px_rgba(240,255,0,0.6)]',
  },
  green: {
    active: 'text-green-400',
    hover: 'hover:text-green-300',
    glow: 'drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]',
  },
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function RatingPicker({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = false,
  size = 'md',
  readonly = false,
  disabled = false,
  color = 'yellow',
  showValue = false,
  className,
}: RatingPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState(0);

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];
  const sizeClass = sizeClasses[size];

  const handleClick = (clickedValue: number) => {
    if (readonly || disabled) return;

    const newValue = clickedValue === value ? 0 : clickedValue;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleMouseEnter = (hoveredValue: number) => {
    if (readonly || disabled) return;
    setHoverValue(hoveredValue);
  };

  const handleMouseLeave = () => {
    if (readonly || disabled) return;
    setHoverValue(0);
  };

  const displayValue = hoverValue || value;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayValue);
    const hasHalfStar = allowHalf && displayValue % 1 >= 0.5;

    for (let i = 1; i <= max; i++) {
      const isActive = i <= fullStars;
      const isHalf = i === fullStars + 1 && hasHalfStar;

      if (isHalf && allowHalf) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i - 0.5)}
            onMouseEnter={() => handleMouseEnter(i - 0.5)}
            disabled={readonly || disabled}
            className={cn(
              'relative transition-all duration-200',
              colors.active,
              colors.glow,
              !readonly && !disabled && colors.hover,
              (readonly || disabled) && 'cursor-not-allowed opacity-70',
              sizeClass
            )}
            aria-label={`Rating ${i - 0.5} stars`}
          >
            <StarHalf className={cn('fill-current', sizeClass)} />
          </button>
        );
      } else {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            disabled={readonly || disabled}
            className={cn(
              'transition-all duration-200',
              isActive
                ? cn(colors.active, colors.glow)
                : 'text-gray-600',
              !readonly && !disabled && !isActive && colors.hover,
              !readonly && !disabled && 'hover:scale-110',
              (readonly || disabled) && 'cursor-not-allowed',
              sizeClass
            )}
            aria-label={`Rating ${i} stars`}
          >
            <Star
              className={cn(
                sizeClass,
                isActive && 'fill-current'
              )}
            />
          </button>
        );
      }
    }

    return stars;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-1">
        {renderStars()}
      </div>

      {showValue && (
        <span className={cn('font-mono font-semibold', colors.active)}>
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
