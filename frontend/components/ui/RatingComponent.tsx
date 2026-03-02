'use client';

/**
 * 评分组件
 * 支持星级、数字、表情符号多种样式
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf, ThumbsUp, Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RatingType = 'star' | 'number' | 'emoji' | 'thumbs';

export interface RatingProps {
  value: number;
  maxValue?: number;
  type?: RatingType;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function RatingComponent({
  value,
  maxValue = 5,
  type = 'star',
  readonly = true,
  size = 'md',
  showValue = false,
  onChange,
  className,
}: RatingProps) {
  const sizeMap = {
    sm: { star: 'w-4 h-4', emoji: 'w-5 h-5', number: 'text-sm' },
    md: { star: 'w-6 h-6', emoji: 'w-7 h-7', number: 'text-base' },
    lg: { star: 'w-8 h-8', emoji: 'w-10 h-10', number: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  const getStarIcon = (index: number) => {
    const filled = index < Math.floor(value);
    const half = !filled && index < value && value - index >= 0.5;

    if (half) {
      return <StarHalf className={cn('fill-current', currentSize.star)} />;
    }

    return (
      <Star
        className={cn(
          currentSize.star,
          filled ? 'fill-cyber-yellow text-cyber-yellow' : 'text-gray-600'
        )}
      />
    );
  };

  const getEmoji = (rating: number) => {
    const percentage = (rating / maxValue) * 100;

    if (percentage >= 80) {
      return <Smile className={cn(currentSize.emoji, 'text-cyber-green')} />;
    }
    if (percentage >= 60) {
      return <ThumbsUp className={cn(currentSize.emoji, 'text-cyber-cyan')} />;
    }
    if (percentage >= 40) {
      return <Meh className={cn(currentSize.emoji, 'text-cyber-yellow')} />;
    }
    return <Frown className={cn(currentSize.emoji, 'text-cyber-pink')} />;
  };

  const renderStars = () => (
    <div className="flex items-center gap-1">
      {[...Array(maxValue)].map((_, index) => (
        <motion.button
          key={index}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => !readonly && onChange?.(index + 1)}
          disabled={readonly}
          className={cn(
            'transition-colors',
            !readonly && 'hover:text-cyber-yellow cursor-pointer'
          )}
        >
          {getStarIcon(index)}
        </motion.button>
      ))}
    </div>
  );

  const renderNumber = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(maxValue)].map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              index < value ? 'bg-cyber-yellow' : 'bg-gray-700'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-white', currentSize.number)}>
          {value}/{maxValue}
        </span>
      )}
    </div>
  );

  const renderEmoji = () => (
    <div className="flex items-center gap-2">
      {getEmoji(value)}
      {showValue && (
        <span className={cn('font-semibold text-white', currentSize.number)}>
          {Math.round((value / maxValue) * 100)}%
        </span>
      )}
    </div>
  );

  const renderThumbs = () => (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={!readonly ? { scale: 1.1 } : {}}
        whileTap={!readonly ? { scale: 0.9 } : {}}
        onClick={() => !readonly && onChange?.(value > 0 ? 0 : maxValue)}
        disabled={readonly}
        className={cn(
          'transition-colors',
          value > 0 ? 'text-cyber-cyan' : 'text-gray-600',
          !readonly && 'hover:text-cyber-cyan cursor-pointer'
        )}
      >
        <ThumbsUp className={cn('fill-current', currentSize.emoji)} />
      </motion.button>
      {showValue && value > 0 && (
        <span className={cn('font-semibold text-white', currentSize.number)}>
          推荐
        </span>
      )}
    </div>
  );

  return (
    <div className={cn('flex items-center', className)}>
      {type === 'star' && renderStars()}
      {type === 'number' && renderNumber()}
      {type === 'emoji' && renderEmoji()}
      {type === 'thumbs' && renderThumbs()}
    </div>
  );
}

export default RatingComponent;
