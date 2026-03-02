'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberScanlinesProps {
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
  speed?: number;
  animated?: boolean;
}

export const CyberScanlines: React.FC<CyberScanlinesProps> = ({
  className,
  color = '#00f0ff',
  opacity = 0.1,
  size = 4,
  speed = 1,
  animated = false,
}) => {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0px,
            ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px,
            transparent 1px,
            transparent ${size}px
          )
        `,
        animation: animated ? `scanline ${speed}s linear infinite` : undefined,
      }}
    >
      <style jsx>{`
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(${size}px);
          }
        }
      `}</style>
    </div>
  );
};

export default CyberScanlines;
