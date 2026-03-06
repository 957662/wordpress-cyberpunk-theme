'use client';

import React from 'react';

interface NeonCardProps {
  variant?: 'cyan' | 'purple' | 'pink';
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const colorMap = {
  cyan: {
    border: 'border-cyber-cyan/30',
    glow: 'hover:border-cyber-cyan hover:shadow-neon-cyan',
    text: 'text-cyber-cyan',
  },
  purple: {
    border: 'border-cyber-purple/30',
    glow: 'hover:border-cyber-purple hover:shadow-neon-purple',
    text: 'text-cyber-purple',
  },
  pink: {
    border: 'border-cyber-pink/30',
    glow: 'hover:border-cyber-pink hover:shadow-neon-pink',
    text: 'text-cyber-pink',
  },
};

export const NeonCard: React.FC<NeonCardProps> = ({
  variant = 'cyan',
  glow = true,
  className = '',
  children,
  onClick,
}) => {
  const colors = colorMap[variant];

  return (
    <div
      className={`
        bg-cyber-dark
        border-2
        ${colors.border}
        ${glow ? colors.glow : ''}
        rounded-lg
        p-6
        transition-all
        duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default NeonCard;
