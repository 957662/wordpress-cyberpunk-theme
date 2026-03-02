/**
 * Tooltip - 提示框组件
 */

'use client';

import { useState, cloneElement, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'dark' | 'light' | 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  delay = 200,
  disabled = false,
  arrow = true,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantStyles = {
    dark: 'bg-gray-900 text-white border-gray-700',
    light: 'bg-white text-gray-900 border-gray-300',
    cyan: 'bg-cyber-cyan text-cyber-dark border-cyber-cyan',
    purple: 'bg-cyber-purple text-white border-cyber-purple',
    pink: 'bg-cyber-pink text-white border-cyber-pink',
  };

  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 max-w-xs',
              'rounded-lg border shadow-lg',
              'pointer-events-none',
              sizeStyles[size],
              variantStyles[variant],
              placement === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
              placement === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
              placement === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
              placement === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
              className
            )}
          >
            {content}

            {arrow && (
              <div
                className={cn(
                  'absolute w-2 h-2 border rotate-45',
                  variantStyles[variant],
                  arrowStyles[placement],
                  placement === 'top' && 'border-t-0 border-l-0',
                  placement === 'bottom' && 'border-b-0 border-r-0',
                  placement === 'left' && 'border-t-0 border-r-0',
                  placement === 'right' && 'border-b-0 border-l-0'
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
