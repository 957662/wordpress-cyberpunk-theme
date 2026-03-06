/**
 * SplitPane - 分割面板组件
 * 支持水平和垂直分割,可调整大小
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

export interface SplitPaneProps {
  /**
   * 第一个面板内容
   */
  first: React.ReactNode;
  /**
   * 第二个面板内容
   */
  second: React.ReactNode;
  /**
   * 分割方向
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 初始分割比例 (0-1)
   */
  defaultRatio?: number;
  /**
   * 最小尺寸 (px)
   */
  minSize?: number;
  /**
   * 最大尺寸 (px)
   */
  maxSize?: number;
  /**
   * 分隔条宽度
   */
  separatorWidth?: number;
  /**
   * 是否允许调整大小
   */
  resizable?: boolean;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 尺寸变化回调
   */
  onRatioChange?: (ratio: number) => void;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  first,
  second,
  direction = 'horizontal',
  defaultRatio = 0.5,
  minSize = 100,
  maxSize,
  separatorWidth = 8,
  resizable = true,
  className,
  onRatioChange,
}) => {
  const [ratio, setRatio] = useState(defaultRatio);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  // 计算实际尺寸
  const calculateRatio = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return ratio;

      const rect = containerRef.current.getBoundingClientRect();
      let newRatio: number;

      if (direction === 'horizontal') {
        const containerWidth = rect.width;
        const separatorX = clientX - rect.left;
        newRatio = separatorX / containerWidth;
      } else {
        const containerHeight = rect.height;
        const separatorY = clientY - rect.top;
        newRatio = separatorY / containerHeight;
      }

      // 限制范围
      newRatio = Math.max(0, Math.min(1, newRatio));

      // 应用最小尺寸限制
      const containerSize = direction === 'horizontal' ? rect.width : rect.height;
      const minRatio = minSize / containerSize;
      const maxRatio = maxSize ? maxSize / containerSize : 1 - minRatio;

      newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));

      return newRatio;
    },
    [direction, minSize, maxSize, ratio]
  );

  // 处理拖动开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    setIsDragging(true);
  }, [resizable]);

  // 处理拖动
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newRatio = calculateRatio(e.clientX, e.clientY);
      setRatio(newRatio);
      onRatioChange?.(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, calculateRatio, onRatioChange]);

  // 处理触摸拖动
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newRatio = calculateRatio(touch.clientX, touch.clientY);
      setRatio(newRatio);
      onRatioChange?.(newRatio);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, calculateRatio, onRatioChange]);

  // 计算面板尺寸
  const firstStyle = {
    flex: direction === 'horizontal' ? `0 0 ${ratio * 100}%` : `0 0 ${ratio * 100}%`,
  };

  const secondStyle = {
    flex: direction === 'horizontal' ? '1' : '1',
  };

  const separatorStyle = {
    width: direction === 'horizontal' ? separatorWidth : '100%',
    height: direction === 'vertical' ? separatorWidth : '100%',
    cursor: resizable ? (direction === 'horizontal' ? 'col-resize' : 'row-resize') : 'default',
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full h-full overflow-hidden',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* 第一个面板 */}
      <div style={firstStyle} className="overflow-hidden">
        {first}
      </div>

      {/* 分隔条 */}
      <motion.div
        ref={separatorRef}
        style={separatorStyle}
        className={cn(
          'flex-shrink-0 relative flex items-center justify-center',
          'bg-dark-bg/50 hover:bg-cyber-cyan/10',
          'transition-colors duration-200',
          isDragging && 'bg-cyber-cyan/20'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        whileHover={{ scale: resizable ? 1.02 : 1 }}
      >
        {resizable && (
          <div className={cn(
            'flex items-center justify-center',
            direction === 'horizontal' ? 'w-full' : 'h-full'
          )}>
            <GripVertical className={cn(
              'text-gray-400',
              direction === 'horizontal' ? 'h-8 w-3' : 'w-8 h-3'
            )} />
          </div>
        )}
      </motion.div>

      {/* 第二个面板 */}
      <div style={secondStyle} className="overflow-hidden">
        {second}
      </div>
    </div>
  );
};

/**
 * 三栏分割面板
 */
export interface ThreePaneProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftRatio?: number;
  rightRatio?: number;
  className?: string;
}

export const ThreePane: React.FC<ThreePaneProps> = ({
  left,
  center,
  right,
  leftRatio = 0.25,
  rightRatio = 0.25,
  className,
}) => {
  const [leftSize, setLeftSize] = useState(leftRatio);
  const [rightSize, setRightSize] = useState(rightRatio);

  const centerSize = 1 - leftSize - rightSize;

  return (
    <div className={cn('flex w-full h-full', className)}>
      {/* 左侧面板 */}
      <div style={{ flex: `0 0 ${leftSize * 100}%` }} className="overflow-hidden border-r border-dark-border">
        {left}
      </div>

      {/* 中间面板 */}
      <div style={{ flex: '1' }} className="overflow-hidden">
        {center}
      </div>

      {/* 右侧面板 */}
      <div style={{ flex: `0 0 ${rightSize * 100}%` }} className="overflow-hidden border-l border-dark-border">
        {right}
      </div>
    </div>
  );
};

export default SplitPane;
