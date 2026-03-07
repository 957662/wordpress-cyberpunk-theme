'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface CarouselItem {
  id: string;
  content: ReactNode;
}

export interface CarouselNewProps {
  /**
   * 轮播项目
   */
  items: CarouselItem[];
  /**
   * 是否自动播放
   */
  autoplay?: boolean;
  /**
   * 自动播放间隔（毫秒）
   */
  autoplayInterval?: number;
  /**
   * 是否显示导航按钮
   */
  showNavigation?: boolean;
  /**
   * 是否显示指示器
   */
  showIndicators?: boolean;
  /**
   * 是否循环
   */
  loop?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * CarouselNew 组件
 * 新版轮播图组件，支持触摸滑动
 */
export const CarouselNew: React.FC<CarouselNewProps> = ({
  items,
  autoplay = true,
  autoplayInterval = 5000,
  showNavigation = true,
  showIndicators = true,
  loop = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  // 自动播放
  useEffect(() => {
    if (autoplay && !isDragging) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (loop) {
            return (prev + 1) % items.length;
          } else {
            return prev < items.length - 1 ? prev + 1 : prev;
          }
        });
      }, autoplayInterval);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isDragging, loop, items.length]);

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setTranslateX(0);
  };

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  // 触摸结束
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // 滑动阈值
    if (translateX > threshold) {
      // 右滑，上一个
      setCurrentIndex(prev => {
        if (loop) {
          return prev === 0 ? items.length - 1 : prev - 1;
        } else {
          return prev > 0 ? prev - 1 : prev;
        }
      });
    } else if (translateX < -threshold) {
      // 左滑，下一个
      setCurrentIndex(prev => {
        if (loop) {
          return (prev + 1) % items.length;
        } else {
          return prev < items.length - 1 ? prev + 1 : prev;
        }
      });
    }

    setTranslateX(0);
  };

  // 上一张
  const previous = () => {
    setCurrentIndex(prev => {
      if (loop) {
        return prev === 0 ? items.length - 1 : prev - 1;
      } else {
        return prev > 0 ? prev - 1 : prev;
      }
    });
  };

  // 下一张
  const next = () => {
    setCurrentIndex(prev => {
      if (loop) {
        return (prev + 1) % items.length;
      } else {
        return prev < items.length - 1 ? prev + 1 : prev;
      }
    });
  };

  // 跳转到指定项
  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* 轮播内容 */}
      <div
        ref={containerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map(item => (
          <div
            key={item.id}
            className="w-full flex-shrink-0"
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* 导航按钮 */}
      {showNavigation && (
        <>
          <button
            onClick={previous}
            disabled={!loop && currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 
              bg-black/50 hover:bg-black/70 text-white p-2 rounded-full
              transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            disabled={!loop && currentIndex === items.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2
              bg-black/50 hover:bg-black/70 text-white p-2 rounded-full
              transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-cyber-cyan w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselNew;
