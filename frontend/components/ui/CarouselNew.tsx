/**
 * 轮播图组件 - 增强版
 * 支持多种过渡效果和触摸手势
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Circle, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselProps {
  // 轮播项目
  items: React.ReactNode[];
  // 自动播放间隔（毫秒）
  autoplayInterval?: number;
  // 是否自动播放
  autoplay?: boolean;
  // 是否显示导航按钮
  showNav?: boolean;
  // 是否显示指示器
  showIndicators?: boolean;
  // 过渡效果
  transition?: 'slide' | 'fade' | 'scale' | 'cube';
  // 过渡时长（毫秒）
  transitionDuration?: number;
  // 是否循环播放
  loop?: boolean;
  // 自定义类名
  className?: string;
  // 指示器位置
  indicatorPosition?: 'bottom' | 'top' | 'left' | 'right';
  // 指示器样式
  indicatorStyle?: 'dots' | 'lines' | 'numbers';
  // 初始索引
  defaultIndex?: number;
  // 幻灯片变化回调
  onChange?: (index: number) => void;
}

export const CarouselNew: React.FC<CarouselProps> = ({
  items,
  autoplayInterval = 5000,
  autoplay = true,
  showNav = true,
  showIndicators = true,
  transition = 'slide',
  transitionDuration = 500,
  loop = true,
  className = '',
  indicatorPosition = 'bottom',
  indicatorStyle = 'dots',
  defaultIndex = 0,
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放
  useEffect(() => {
    if (autoplay && !isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoplayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isPaused, currentIndex]);

  // 幻灯片变化回调
  useEffect(() => {
    onChange?.(currentIndex);
  }, [currentIndex, onChange]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;

    if (loop) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
  }, [isTransitioning, loop, items.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;

    if (loop) {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [isTransitioning, loop, items.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index < 0 || index >= items.length) return;
    setCurrentIndex(index);
  }, [isTransitioning, items.length]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDistance = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50;

    if (touchDistance > minSwipeDistance) {
      nextSlide();
    } else if (touchDistance < -minSwipeDistance) {
      prevSlide();
    }

    setIsPaused(false);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // 过渡动画样式
  const getTransitionStyles = () => {
    const baseStyles = 'transition-all ease-in-out';

    switch (transition) {
      case 'fade':
        return `${baseStyles} opacity-${transitionDuration}ms`;
      case 'scale':
        return `${baseStyles} scale-${transitionDuration}ms`;
      case 'cube':
        return `${baseStyles} transform-${transitionDuration}ms preserve-3d`;
      case 'slide':
      default:
        return `${baseStyles} transform-${transitionDuration}ms`;
    }
  };

  const getSlideStyles = (index: number) => {
    const isActive = index === currentIndex;

    switch (transition) {
      case 'fade':
        return cn(
          'absolute inset-0 w-full h-full',
          isActive ? 'opacity-100' : 'opacity-0',
          getTransitionStyles()
        );
      case 'scale':
        return cn(
          'absolute inset-0 w-full h-full',
          isActive ? 'scale-100' : 'scale-95',
          getTransitionStyles()
        );
      case 'cube':
        return cn(
          'absolute inset-0 w-full h-full backface-hidden',
          isActive ? 'rotate-y-0' : 'rotate-y-180',
          getTransitionStyles()
        );
      case 'slide':
      default:
        return cn(
          'absolute inset-0 w-full h-full flex-shrink-0',
          getTransitionStyles()
        );
    }
  };

  // 获取容器样式
  const getContainerStyles = () => {
    if (transition === 'slide') {
      return {
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: `transform ${transitionDuration}ms ease-in-out`,
      };
    }
    return {};
  };

  // 渲染指示器
  const renderIndicators = () => {
    if (!showIndicators) return null;

    const positionClasses = {
      bottom: 'bottom-4 left-1/2 -translate-x-1/2',
      top: 'top-4 left-1/2 -translate-x-1/2',
      left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
      right: 'right-4 top-1/2 -translate-y-1/2 flex-col',
    };

    return (
      <div
        className={cn(
          'absolute z-20 flex gap-2',
          positionClasses[indicatorPosition]
        )}
      >
        {items.map((_, index) => {
          const isActive = index === currentIndex;

          if (indicatorStyle === 'dots') {
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isActive
                    ? 'w-8 h-2 bg-cyber-cyan'
                    : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          }

          if (indicatorStyle === 'lines') {
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-1 rounded transition-all duration-300',
                  isActive
                    ? 'w-8 bg-cyber-cyan'
                    : 'w-4 bg-gray-600 hover:bg-gray-500'
                )}
                style={indicatorPosition === 'left' || indicatorPosition === 'right' ? { width: isActive ? '32px' : '16px', height: '4px' } : {}}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          }

          if (indicatorStyle === 'numbers') {
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-cyber-cyan text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // 渲染导航按钮
  const renderNavButtons = () => {
    if (!showNav) return null;

    return (
      <>
        <button
          onClick={prevSlide}
          disabled={!loop && currentIndex === 0}
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan'
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={!loop && currentIndex === items.length - 1}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan'
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </>
    );
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden rounded-lg',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 幻灯片容器 */}
      <div
        className="flex h-full transition-transform"
        style={getContainerStyles()}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={getSlideStyles(index)}
            style={{ minWidth: '100%' }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 导航按钮 */}
      {renderNavButtons()}

      {/* 指示器 */}
      {renderIndicators()}
    </div>
  );
};

export default CarouselNew;
