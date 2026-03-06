/**
 * Tooltip 提示组件
 * 鼠标悬停时显示提示信息
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string | React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
  children: React.ReactElement;
}

export function Tooltip({
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  arrow = true,
  className,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState<TooltipPosition>(position);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 检查是否超出视口，如果超出则调整位置
      let newPosition = position;

      switch (position) {
        case 'top':
          if (tooltipRect.top < 0) {
            newPosition = 'bottom';
          }
          break;
        case 'bottom':
          if (tooltipRect.bottom > viewportHeight) {
            newPosition = 'top';
          }
          break;
        case 'left':
          if (tooltipRect.left < 0) {
            newPosition = 'right';
          }
          break;
        case 'right':
          if (tooltipRect.right > viewportWidth) {
            newPosition = 'left';
          }
          break;
      }

      setCalculatedPosition(newPosition);
    }
  }, [isVisible, position]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm',
              'bg-gray-900 text-white',
              'border border-cyan-500/30',
              'rounded-lg shadow-lg',
              'pointer-events-none',
              'max-w-xs',
              positionClasses[calculatedPosition],
              className
            )}
            role="tooltip"
          >
            {typeof content === 'string' ? (
              <p className="whitespace-normal break-words">{content}</p>
            ) : (
              content
            )}

            {arrow && (
              <div
                className={cn(
                  'absolute w-0 h-0',
                  'border-4',
                  arrowClasses[calculatedPosition],
                  calculatedPosition === 'top' && 'border-t-gray-900',
                  calculatedPosition === 'bottom' && 'border-b-gray-900',
                  calculatedPosition === 'left' && 'border-l-gray-900',
                  calculatedPosition === 'right' && 'border-r-gray-900'
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 简化的 Tooltip 组件，用于快速使用
 */
export interface SimpleTooltipProps {
  title: string;
  children: React.ReactElement;
}

export function SimpleTooltip({ title, children }: SimpleTooltipProps) {
  return (
    <Tooltip content={title} position="top">
      {children}
    </Tooltip>
  );
}

/**
 * 带图标的 Tooltip
 */
export interface IconTooltipProps {
  icon: React.ReactNode;
  content: string | React.ReactNode;
  position?: TooltipPosition;
}

export function IconTooltip({ icon, content, position = 'top' }: IconTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <div className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors cursor-help">
        {icon}
      </div>
    </Tooltip>
  );
}
