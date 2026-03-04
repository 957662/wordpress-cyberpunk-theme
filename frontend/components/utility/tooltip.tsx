'use client';

/**
 * Tooltip Component
 * 工具提示组件 - 用于显示额外的提示信息
 */

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  /** 触发元素 */
  children: React.ReactElement;
  /** 提示内容 */
  content: string | React.ReactNode;
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'focus';
  /** 显示位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** 延迟显示 (ms) */
  delay?: number;
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
  /** 箭头 */
  arrow?: boolean;
}

export function Tooltip({
  children,
  content,
  trigger = 'hover',
  placement = 'top',
  delay = 200,
  className,
  variant = 'default',
  arrow = true,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    const tooltipWidth = 200; // 估计宽度
    const tooltipHeight = 50; // 估计高度
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top + scrollY - tooltipHeight - gap;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + gap;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollX - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + scrollX + gap;
        break;
    }

    setPosition({ top, left });
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  const variants = {
    default: 'bg-gray-900 text-white border border-gray-700',
    neon: 'bg-gray-950 text-cyan-100 border border-cyan-500/50 shadow-lg shadow-cyan-500/20',
    cyber: 'bg-black text-green-400 border border-green-500/50',
  };

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)', borderBottom: 'none', borderTop: '6px solid currentColor' },
    bottom: { top: '-6px', left: '50%', transform: 'translateX(-50%)', borderTop: 'none', borderBottom: '6px solid currentColor' },
    left: { right: '-6px', top: '50%', transform: 'translateY(-50%)', borderRight: 'none', borderLeft: '6px solid currentColor' },
    right: { left: '-6px', top: '50%', transform: 'translateY(-50%)', borderLeft: 'none', borderRight: '6px solid currentColor' },
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={cn(
            'tooltip absolute z-50 px-3 py-2 rounded-lg text-sm max-w-xs pointer-events-none',
            variants[variant],
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          {arrow && (
            <div
              className="absolute w-3 h-3 border-solid"
              style={arrowStyles[placement]}
            />
          )}
        </div>
      )}
    </>
  );
}
