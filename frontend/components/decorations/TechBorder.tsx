/**
 * TechBorder - 科技边框组件
 * 带电路效果的边框装饰
 */

import React from 'react';
import { CornerAccent } from './CornerAccent';

export interface TechBorderProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  children?: React.ReactNode;
  glow?: boolean;
}

export const TechBorder: React.FC<TechBorderProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  variant = 'cyan',
  children,
  glow = true,
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        padding: '2px',
        background: glow
          ? `linear-gradient(45deg, ${color}40, ${color}20, ${color}40)`
          : 'transparent',
        boxShadow: glow
          ? `0 0 10px ${color}40, inset 0 0 10px ${color}20`
          : 'none',
      }}
    >
      {/* 上边框 */}
      <svg
        className="absolute top-0 left-0"
        width="100%"
        height="2"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="1" x2="100%" y2="1" stroke={color} strokeWidth="1" opacity="0.6" />
        <circle cx="10" cy="1" r="1" fill={color} opacity="0.8" />
        <circle cx="90%" cy="1" r="1" fill={color} opacity="0.8" />
      </svg>

      {/* 右边框 */}
      <svg
        className="absolute top-0 right-0"
        width="2"
        height="100%"
        preserveAspectRatio="none"
      >
        <line x1="1" y1="0" x2="1" y2="100%" stroke={color} strokeWidth="1" opacity="0.6" />
        <circle cx="1" cy="10" r="1" fill={color} opacity="0.8" />
        <circle cx="1" cy="90%" r="1" fill={color} opacity="0.8" />
      </svg>

      {/* 下边框 */}
      <svg
        className="absolute bottom-0 left-0"
        width="100%"
        height="2"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="1" x2="100%" y2="1" stroke={color} strokeWidth="1" opacity="0.6" />
        <circle cx="10" cy="1" r="1" fill={color} opacity="0.8" />
        <circle cx="90%" cy="1" r="1" fill={color} opacity="0.8" />
      </svg>

      {/* 左边框 */}
      <svg
        className="absolute top-0 left-0"
        width="2"
        height="100%"
        preserveAspectRatio="none"
      >
        <line x1="1" y1="0" x2="1" y2="100%" stroke={color} strokeWidth="1" opacity="0.6" />
        <circle cx="1" cy="10" r="1" fill={color} opacity="0.8" />
        <circle cx="1" cy="90%" r="1" fill={color} opacity="0.8" />
      </svg>

      {/* 内容区域 */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* 角落装饰 */}
      <CornerAccent position="top-left" size={8} variant={variant} />
      <CornerAccent position="top-right" size={8} variant={variant} />
      <CornerAccent position="bottom-left" size={8} variant={variant} />
      <CornerAccent position="bottom-right" size={8} variant={variant} />
    </div>
  );
};

export default TechBorder;
