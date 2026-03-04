'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CarouselColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

export interface CyberCarouselProps {
  items: CarouselItem[];
  color?: CarouselColor;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  loop?: boolean;
  className?: string;
  itemClassName?: string;
}

const colorClasses = {
  cyan: {
    arrow: 'text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/50',
    dot: 'bg-cyan-400',
    dotActive: 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    progress: 'bg-cyan-400',
  },
  purple: {
    arrow: 'text-purple-400 hover:bg-purple-500/20 border-purple-500/50',
    dot: 'bg-purple-400',
    dotActive: 'bg-purple-400 shadow-[0_0_10px_rgba(157,0,255,0.5)]',
    progress: 'bg-purple-400',
  },
  pink: {
    arrow: 'text-pink-400 hover:bg-pink-500/20 border-pink-500/50',
    dot: 'bg-pink-400',
    dotActive: 'bg-pink-400 shadow-[0_0_10px_rgba(255,0,128,0.5)]',
    progress: 'bg-pink-400',
  },
  green: {
    arrow: 'text-green-400 hover:bg-green-500/20 border-green-500/50',
    dot: 'bg-green-400',
    dotActive: 'bg-green-400 shadow-[0_0_10px_rgba(0,255,136,0.5)]',
    progress: 'bg-green-400',
  },
  yellow: {
    arrow: 'text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/50',
    dot: 'bg-yellow-400',
    dotActive: 'bg-yellow-400 shadow-[0_0_10px_rgba(240,255,0,0.5)]',
    progress: 'bg-yellow-400',
  },
};

export const CyberCarousel: React.FC<CyberCarouselProps> = ({
  items,
  color = 'cyan',
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  showProgress = false,
  loop = true,
  className,
  itemClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const colorClass = colorClasses[color];
  const itemCount = items.length;

  // 自动播放
  useEffect(() => {
    if (autoPlay && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isPaused, currentIndex]);

  const previousSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      if (loop) {
        return prev === 0 ? itemCount - 1 : prev - 1;
      }
      return Math.max(0, prev - 1);
    });
  }, [itemCount, loop]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => {
      if (loop) {
        return prev === itemCount - 1 ? 0 : prev + 1;
      }
      return Math.min(itemCount - 1, prev + 1);
    });
  }, [itemCount, loop]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousSlide, nextSlide]);

  // 触摸支持
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    } else if (touchEnd - touchStart > 50) {
      previousSlide();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-xl',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 轮播内容 */}
      <div className="relative h-full">
        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={direction}
        >
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className={cn('absolute inset-0', itemClassName)}
          >
            {items[currentIndex]?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 左箭头 */}
      {showArrows && (
        <motion.button
          onClick={previousSlide}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center',
            'w-10 h-10 rounded-lg border-2',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            colorClass.arrow
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
      )}

      {/* 右箭头 */}
      {showArrows && (
        <motion.button
          onClick={nextSlide}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center',
            'w-10 h-10 rounded-lg border-2',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            colorClass.arrow
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      )}

      {/* 指示点 */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex ? colorClass.dotActive : 'bg-gray-600'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 进度条 */}
      {showProgress && autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className={cn('h-full', colorClass.progress)}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: autoPlayInterval / 1000,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {/* 装饰线 */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default CyberCarousel;
