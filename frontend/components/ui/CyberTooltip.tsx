'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  delay?: number;
  arrow?: boolean;
  className?: string;
}

export const CyberTooltip: React.FC<CyberTooltipProps> = ({
  content,
  children,
  placement = 'top',
  variant = 'default',
  delay = 200,
  arrow = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const variantStyles = {
    default: 'bg-cyan-500/90 border-cyan-400',
    glow: 'bg-fuchsia-500/90 border-fuchsia-400',
    neon: 'bg-pink-500/90 border-pink-400',
    hologram: 'bg-purple-500/90 border-purple-400',
  };

  const placementStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent',
  };

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

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white whitespace-nowrap',
            'border rounded-sm shadow-lg backdrop-blur-sm',
            'pointer-events-none transition-opacity duration-200',
            variantStyles[variant],
            placementStyles[placement],
            className
          )}
          style={{
            boxShadow: `0 0 20px ${variant === 'default' ? 'rgba(0, 240, 255, 0.3)' :
                        variant === 'glow' ? 'rgba(157, 0, 255, 0.3)' :
                        variant === 'neon' ? 'rgba(255, 0, 128, 0.3)' :
                        'rgba(157, 0, 255, 0.3)'}`,
          }}
        >
          {content}
          {arrow && (
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                variantStyles[variant].replace('bg-', 'border-').replace('/90', ''),
                arrowStyles[placement]
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CyberTooltip;
