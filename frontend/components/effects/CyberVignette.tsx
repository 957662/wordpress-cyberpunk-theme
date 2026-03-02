'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberVignetteProps {
  className?: string;
  color?: string;
  intensity?: number;
  size?: number;
}

export const CyberVignette: React.FC<CyberVignetteProps> = ({
  className,
  color = '#00f0ff',
  intensity = 0.5,
  size = 50,
}) => {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        background: `radial-gradient(
          circle at center,
          transparent 0%,
          transparent ${100 - size}%,
          ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')} ${100 - size + 20}%,
          ${color}${Math.floor(intensity * 255 * 1.5).toString(16).padStart(2, '0')} 100%
        )`,
      }}
    />
  );
};

export default CyberVignette;
