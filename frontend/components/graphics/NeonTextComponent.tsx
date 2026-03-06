'use client';

import React from 'react';

interface NeonTextProps {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  children: React.ReactNode;
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const intensityMap = {
  low: 'drop-shadow-[0_0_5px_currentColor]',
  medium: 'drop-shadow-[0_0_10px_currentColor]',
  high: 'drop-shadow-[0_0_20px_currentColor] drop-shadow-[0_0_40px_currentColor]',
};

const colorMap = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  pink: 'text-cyber-pink',
  yellow: 'text-cyber-yellow',
};

export const NeonText: React.FC<NeonTextProps> = ({
  variant = 'cyan',
  size = 'md',
  intensity = 'medium',
  className = '',
  children,
}) => {
  return (
    <span
      className={`
        ${sizeMap[size]}
        ${colorMap[variant]}
        ${intensityMap[intensity]}
        font-bold
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default NeonText;
