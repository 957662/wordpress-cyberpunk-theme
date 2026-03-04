'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'neon' | 'glow';
  delay?: number;
  arrow?: boolean;
  className?: string;
}

export const CyberTooltip: React.FC<CyberTooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  delay = 200,
  arrow = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
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

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const variantStyles = {
    default: 'bg-black/90 border border-white/20',
    neon: 'bg-black/90 border border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    glow: 'bg-black/90 border border-cyber-purple/50 shadow-[0_0_20px_rgba(157,0,255,0.3)]',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-black/90',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-black/90',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-black/90',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-black/90',
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 rounded-lg',
              'whitespace-nowrap',
              'backdrop-blur-sm',
              positionStyles[position],
              variantStyles[variant],
              className
            )}
            style={{
              borderWidth: variant === 'neon' ? '2px' : '1px',
            }}
          >
            <div className="text-sm text-white/90">{content}</div>

            {arrow && (
              <div
                className={cn(
                  'absolute w-0 h-0 border-4',
                  arrowStyles[position]
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
