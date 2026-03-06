'use client';

import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const sizeMap = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2 text-base',
  lg: 'px-8 py-3 text-lg',
};

const colorMap = {
  cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-neon-cyan-lg',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-neon-purple-lg',
  pink: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-neon-pink-lg',
  yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-neon-yellow-lg',
};

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'cyan',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`
        ${sizeMap[size]}
        ${colorMap[variant]}
        font-bold
        text-white
        rounded
        transition-all
        duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;
