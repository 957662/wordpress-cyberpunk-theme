'use client';

import React from 'react';

interface CyberGlowProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  children: React.ReactNode;
}

const glowMap = {
  low: {
    cyan: 'shadow-[0_0_10px_rgba(0,240,255,0.3)]',
    purple: 'shadow-[0_0_10px_rgba(157,0,255,0.3)]',
    pink: 'shadow-[0_0_10px_rgba(255,0,128,0.3)]',
    yellow: 'shadow-[0_0_10px_rgba(240,255,0,0.3)]',
  },
  medium: {
    cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
    purple: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
    pink: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
    yellow: 'shadow-[0_0_20px_rgba(240,255,0,0.5)]',
  },
  high: {
    cyan: 'shadow-[0_0_30px_rgba(0,240,255,0.8),0_0_60px_rgba(0,240,255,0.4)]',
    purple: 'shadow-[0_0_30px_rgba(157,0,255,0.8),0_0_60px_rgba(157,0,255,0.4)]',
    pink: 'shadow-[0_0_30px_rgba(255,0,128,0.8),0_0_60px_rgba(255,0,128,0.4)]',
    yellow: 'shadow-[0_0_30px_rgba(240,255,0,0.8),0_0_60px_rgba(240,255,0,0.4)]',
  },
};

export const CyberGlow: React.FC<CyberGlowProps> = ({
  color = 'cyan',
  intensity = 'medium',
  className = '',
  children,
}) => {
  return (
    <div className={`inline-block ${glowMap[intensity][color]} ${className}`}>
      {children}
    </div>
  );
};

export default CyberGlow;
