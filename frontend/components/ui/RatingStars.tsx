'use client';

import React, { useState } from 'react';

interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  count?: number;
  size?: number;
  color?: string;
  className?: string;
}

export function RatingStars({
  value = 0,
  onChange,
  readonly = false,
  count = 5,
  size = 24,
  color = '#f0ff00',
  className = '',
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;
        const isHalfFilled = !isFilled && starValue - 0.5 <= displayValue;

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverValue(starValue)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className="transition-transform hover:scale-110 disabled:hover:scale-100"
            style={{ width: size, height: size }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFilled ? color : isHalfFilled ? `url(#half-${index})` : 'none'}
              stroke={isFilled ? 'none' : color}
              strokeWidth="2"
            >
              {isHalfFilled && (
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor={color} />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
