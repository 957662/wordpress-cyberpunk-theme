'use client';

import React from 'react';

export interface BadgeProps {
  /**
   * Badge 内容
   */
  children: React.ReactNode;
  /**
   * Badge 变体
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neon' | 'cyber';
  /**
   * Badge 尺寸
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 是否为点状 Badge
   */
  dot?: boolean;
  /**
   * 点的偏移量
   */
  count?: number;
  /**
   * 最大显示数量
   */
  max?: number;
  /**
   * 是否显示零
   */
  showZero?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * Badge 组件
 * 用于显示状态、数量或标签
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  count,
  max = 99,
  showZero = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-cyber-cyan text-cyber-dark',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    neon: 'bg-cyber-pink text-white shadow-[0_0_10px_currentColor]',
    cyber: 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  if (dot) {
    return (
      <span className={`relative inline-flex items-center`}>
        {children}
        {count !== undefined && count > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex h-3 w-3 ${variantStyles[variant]} rounded-full animate-pulse`}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          </span>
        )}
      </span>
    );
  }

  if (count !== undefined) {
    if (!showZero && count === 0) {
      return <>{children}</>;
    }

    const displayCount = count > max ? `${max}+` : count;

    return (
      <span className="relative inline-flex items-center">
        {children}
        <span
          className={`absolute -top-2 -right-2 flex items-center justify-center
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            rounded-full font-bold shadow-lg
            transform transition-transform hover:scale-110
            ${className}`}
        >
          {displayCount}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        rounded-md font-semibold
        transition-all duration-200
        hover:shadow-lg hover:scale-105
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
