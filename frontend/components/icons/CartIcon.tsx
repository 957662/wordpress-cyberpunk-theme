'use client';

import React from 'react';

export interface CartIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
  filled?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const CartIcon: React.FC<CartIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
  filled = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id="cart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 购物车主体 */}
      <path
        d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18C16 17.4477 16.4477 17 17 17ZM9 17C9.55228 17 10 17.4477 10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? '0.2' : '0'}
        filter="url(#cart-glow)"
      />

      {/* 装饰性电路点 */}
      {filled && (
        <>
          <circle cx="21" cy="3" r="1.5" fill={color} filter="url(#cart-glow)" />
          <circle cx="3" cy="3" r="1" fill={color} opacity="0.6" />
        </>
      )}
    </svg>
  );
};

export default CartIcon;
