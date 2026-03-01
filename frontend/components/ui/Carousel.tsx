/**
 * 轮播图组件
 * 图片/内容轮播展示
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface CarouselItem {
  /** 唯一标识 */
  id: string;
  /** 图片 */
  image?: string;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 链接 */
  link?: string;
  /** 自定义内容 */
  content?: React.ReactNode;
}

export interface CarouselProps {
  /** 轮播项目 */
  items: CarouselItem[];
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 自动播放间隔 (ms) */
  interval?: number;
  /** 是否显示导航点 */
  showDots?: boolean;
  /** 是否显示箭头 */
  showArrows?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function Carousel({
  items,
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex, items.length]);

  // 自动播放
  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, nextSlide]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className={cn('relative', className)}>
      {/* 轮播内容 */}
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence initial={false} custom={direction}>
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
            className="absolute inset-0"
          >
            {items[currentIndex].image ? (
              <img
                src={items[currentIndex].image}
                alt={items[currentIndex].title || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cyber-card flex items-center justify-center">
                {items[currentIndex].content}
              </div>
            )}

            {/* 文字覆盖 */}
            {(items[currentIndex].title || items[currentIndex].description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {items[currentIndex].title}
                </h3>
                {items[currentIndex].description && (
                  <p className="text-gray-300">
                    {items[currentIndex].description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 左右箭头 */}
      {showArrows && items.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
            aria-label="上一张"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
            aria-label="下一张"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* 导航点 */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex
                  ? 'bg-cyber-cyan w-6'
                  : 'bg-gray-500 hover:bg-gray-400'
              )}
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
