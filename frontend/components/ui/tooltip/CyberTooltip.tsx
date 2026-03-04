'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

export interface CyberTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  color?: TooltipColor;
  delay?: number;
  arrow?: boolean;
  glow?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: 'bg-cyan-500/90 text-white border-cyan-400',
  purple: 'bg-purple-500/90 text-white border-purple-400',
  pink: 'bg-pink-500/90 text-white border-pink-400',
  green: 'bg-green-500/90 text-white border-green-400',
  yellow: 'bg-yellow-500/90 text-black border-yellow-400',
};

const glowClasses = {
  cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
  purple: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
  pink: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
  green: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
  yellow: 'shadow-[0_0_20px_rgba(240,255,0,0.5)]',
};

const arrowPositions = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
};

export const CyberTooltip: React.FC<CyberTooltipProps> = ({
  content,
  children,
  position = 'top',
  color = 'cyan',
  delay = 200,
  arrow = true,
  glow = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      default:
        return {};
    }
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
            className={cn(
              'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg border-2',
              'backdrop-blur-md pointer-events-none whitespace-nowrap',
              colorClasses[color],
              glow && glowClasses[color],
              className
            )}
            style={getPositionStyles()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}

            {/* 箭头 */}
            {arrow && (
              <div
                className={cn(
                  'absolute w-0 h-0 border-8 border-transparent',
                  arrowPositions[position]
                )}
                style={{
                  borderBottomColor: position === 'top' ? undefined : 'transparent',
                  borderTopColor: position === 'bottom' ? undefined : 'transparent',
                  borderLeftColor: position === 'right' ? undefined : 'transparent',
                  borderRightColor: position === 'left' ? undefined : 'transparent',
                }}
              />
            )}

            {/* 装饰线 */}
            <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberTooltip;
