/**
 * ImageCompare Component - 图片对比组件
 * 用于对比两张图片的差异
 */

'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ImageCompareProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  height?: number | string;
  sliderPosition?: number; // 0-100
  orientation?: 'horizontal' | 'vertical';
}

export function ImageCompare({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  height = 400,
  sliderPosition = 50,
  orientation = 'horizontal',
}: ImageCompareProps) {
  const [position, setPosition] = useState(sliderPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理滑块移动
  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newPos: number;

    if (orientation === 'horizontal') {
      newPos = ((clientX - rect.left) / rect.width) * 100;
    } else {
      newPos = ((clientY - rect.top) / rect.height) * 100;
    }

    newPos = Math.max(0, Math.min(100, newPos));
    setPosition(newPos);
  };

  // 鼠标事件
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 触摸事件
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg border border-cyber-border bg-cyber-card select-none",
        className
      )}
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After 图片（底层） */}
      <img
        src={after}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before 图片（顶层，裁剪） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          [isHorizontal ? 'width' : 'height']: `${position}%`,
        }}
      >
        <img
          src={before}
          alt="Before"
          className={cn(
            "absolute object-cover",
            isHorizontal
              ? "h-full top-0 left-0"
              : "w-full left-0 top-0"
          )}
          style={{
            [isHorizontal ? 'width' : 'height']: isHorizontal
              ? `${(100 / position) * 100}%`
              : `${(100 / position) * 100}%`,
          }}
          draggable={false}
        />
      </div>

      {/* 滑块 */}
      <motion.div
        className={cn(
          "absolute top-0 bottom-0 w-1 bg-cyber-cyan shadow-neon-cyan cursor-col-resize z-10",
          !isHorizontal && "w-full h-1 cursor-row-resize"
        )}
        style={{
          left: isHorizontal ? `${position}%` : 0,
          top: isHorizontal ? 0 : `${position}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        whileHover={{ scale: 1.5 }}
      >
        {/* 滑块按钮 */}
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-cyber-cyan rounded-full shadow-lg flex items-center justify-center",
          !isHorizontal && "left-1/2 -translate-x-1/2"
        )}>
          {isHorizontal ? (
            <>
              <ChevronLeft className="w-4 h-4 text-cyber-dark" />
              <ChevronRight className="w-4 h-4 text-cyber-dark -ml-2" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-cyber-dark -rotate-90" />
              <ChevronRight className="w-4 h-4 text-cyber-dark rotate-90 -mt-1" />
            </>
          )}
        </div>
      </motion.div>

      {/* 标签 */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded text-white text-sm font-medium">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded text-white text-sm font-medium">
        {afterLabel}
      </div>

      {/* 提示文字 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded text-white text-sm">
        拖动滑块对比图片
      </div>
    </div>
  );
}

/**
 * ImageCompareSlider Component - 带滑块控制的图片对比
 */
export interface ImageCompareSliderProps extends Omit<ImageCompareProps, 'sliderPosition'> {
  showSliderControl?: boolean;
}

export function ImageCompareSlider({
  showSliderControl = true,
  ...props
}: ImageCompareSliderProps) {
  return (
    <div className="space-y-4">
      <ImageCompare {...props} />

      {showSliderControl && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-cyber-text-secondary">Before</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={50}
            onChange={(e) => {
              // 可以添加回调来更新位置
              console.log('Slider position:', e.target.value);
            }}
            className="flex-1 h-2 bg-cyber-muted rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />
          <span className="text-sm text-cyber-text-secondary">After</span>
        </div>
      )}
    </div>
  );
}

/**
 * ImageCompareMultiple Component - 多图对比
 */
export interface ImageCompareMultipleProps {
  images: Array<{
    src: string;
    label: string;
  }>;
  className?: string;
  height?: number | string;
}

export function ImageCompareMultiple({
  images,
  className,
  height = 400,
}: ImageCompareMultipleProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length < 2) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 图片显示区域 */}
      <div className="relative rounded-lg border border-cyber-border overflow-hidden" style={{ height }}>
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].label}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded text-white text-sm font-medium">
          {images[selectedIndex].label}
        </div>
      </div>

      {/* 选择器 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all",
              selectedIndex === index
                ? "border-cyber-cyan shadow-neon-cyan"
                : "border-cyber-border"
            )}
          >
            <img
              src={image.src}
              alt={image.label}
              className="w-full h-full object-cover"
            />
            {selectedIndex === index && (
              <div className="absolute inset-0 bg-cyber-cyan/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyber-cyan shadow-neon-cyan" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
