/**
 * CyberTooltip - 赛博朋克风格工具提示组件
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CyberTooltipProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 提示内容 */
  content: React.ReactNode;
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** 延迟显示(ms) */
  delay?: number;
  /** 箭头 */
  arrow?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 变体 */
  variant?: 'default' | 'neon' | 'hologram';
  /** 是否禁用 */
  disabled?: boolean;
}

const placementClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-cyber-dark',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-cyber-dark',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-cyber-dark',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-cyber-dark',
};

const variantClasses = {
  default: 'bg-cyber-dark border border-cyber-cyan/50 text-cyber-cyan',
  neon: 'bg-cyber-dark border border-cyber-cyan text-cyber-cyan shadow-lg shadow-cyber-cyan/50',
  hologram: 'bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple backdrop-blur-sm',
};

/**
 * 赛博朋克风格工具提示
 *
 * @example
 * ```tsx
 * <CyberTooltip content="这是一个提示">
 *   <button>悬停我</button>
 * </CyberTooltip>
 *
 * <CyberTooltip
 *   content="自定义样式的提示"
 *   placement="right"
 *   variant="neon"
 *   arrow
 * >
 *   <button>悬停我</button>
 * </CyberTooltip>
 * ```
 */
export const CyberTooltip: React.FC<CyberTooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  arrow = true,
  className = '',
  variant = 'default',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2,
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltip = (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm rounded-lg ${variantClasses[variant]} ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="relative"
          >
            {content}
            {arrow && (
              <div
                className={`absolute w-0 h-0 border-4 ${arrowClasses[placement]}`}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltip, document.body)}
    </>
  );
};

/**
 * 简化版工具提示 - 只需要 content 属性
 */
export const Tooltip: React.FC<
  Omit<CyberTooltipProps, 'children'> & { children: React.ReactNode }
> = props => {
  return <CyberTooltip {...props} />;
};

export default CyberTooltip;
