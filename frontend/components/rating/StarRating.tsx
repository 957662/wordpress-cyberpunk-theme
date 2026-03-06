'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: number;
  color?: string;
  showValue?: boolean;
  allowHalf?: boolean;
  className?: string;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  readonly = false,
  size = 24,
  color = '#fbbf24',
  showValue = false,
  allowHalf = false,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value;

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < max; i++) {
      const starValue = i + 1;
      const isFilled = starValue <= displayValue;
      const isHalf = allowHalf && !isFilled && starValue - 0.5 <= displayValue && displayValue < starValue;

      stars.push(
        <motion.button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          className="relative focus:outline-none disabled:cursor-default"
          style={{ width: size, height: size }}
          aria-label={`Rate ${starValue} stars`}
        >
          <motion.div
            whileHover={!readonly ? { scale: 1.2 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isHalf ? (
              <div className="relative">
                <Star
                  className="absolute inset-0"
                  size={size}
                  fill="#d1d5db"
                  color="#d1d5db"
                />
                <StarHalf
                  className="relative z-10"
                  size={size}
                  fill={color}
                  color={color}
                />
              </div>
            ) : (
              <Star
                size={size}
                fill={isFilled ? color : '#d1d5db'}
                color={isFilled ? color : '#d1d5db'}
                className={cn(
                  'transition-colors duration-200',
                  !readonly && 'hover:drop-shadow-lg'
                )}
              />
            )}
          </motion.div>
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
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayValue.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
}

interface RatingCardProps {
  title: string;
  rating: number;
  totalRatings?: number;
  distribution?: { rating: number; count: number }[];
  onRate?: (value: number) => void;
  className?: string;
}

export function RatingCard({
  title,
  rating,
  totalRatings = 0,
  distribution,
  onRate,
  className,
}: RatingCardProps) {
  const defaultDistribution = [
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ];

  const dist = distribution || defaultDistribution;
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="flex items-start gap-8 mb-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {rating.toFixed(1)}
          </div>
          <StarRating value={rating} readonly size={20} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalRatings.toLocaleString()} 个评分
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const item = dist.find((d) => d.rating === star);
            const count = item?.count || 0;
            const percentage = (count / maxCount) * 100;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {star} 星
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rate This */}
      {onRate && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            点击星星评分
          </p>
          <StarRating value={0} onChange={onRate} size={28} />
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date?: string;
  className?: string;
}

export function ReviewCard({
  author,
  avatar,
  rating,
  title,
  content,
  date,
  className,
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {author}
            </h4>
            {date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
            )}
          </div>
        </div>
        <StarRating value={rating} readonly size={16} />
      </div>

      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h5>

      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}
