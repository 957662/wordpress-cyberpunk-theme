/**
 * CornerAccent - 角落装饰组件
 * 用于卡片、区块四角的赛博朋克风格装饰
 */

import React from 'react';

export interface CornerAccentProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all';
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  style?: React.CSSProperties;
}

export const CornerAccent: React.FC<CornerAccentProps> = ({
  position = 'all',
  size = 20,
  className = '',
  variant = 'cyan',
  style = {},
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  const renderCorner = (pos: string) => {
    const transforms = {
      'top-left': '',
      'top-right': 'scale(-1, 1)',
      'bottom-left': 'scale(1, -1)',
      'bottom-right': 'scale(-1, -1)',
    };

    const transformsOrigin = {
      'top-left': '0 0',
      'top-right': '100% 0',
      'bottom-left': '0 100%',
      'bottom-right': '100% 100%',
    };

    return (
      <svg
        key={pos}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          transformOrigin: transformsOrigin[pos as keyof typeof transformsOrigin],
          transform: transforms[pos as keyof typeof transforms],
          ...style,
        }}
        className={className}
      >
        {/* 外角 */}
        <path
          d="M0 2 L0 18 L2 18 L2 2 L18 2 L18 0 L2 0 L0 0"
          fill={color}
          opacity="0.6"
        />

        {/* 内角 */}
        <path
          d="M4 4 L4 8 L8 8 L8 4 L4 4"
          fill={color}
          opacity="0.8"
        />

        {/* 装饰线 */}
        <line x1="10" y1="0" x2="18" y2="0" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="10" x2="0" y2="18" stroke={color} strokeWidth="1" opacity="0.4" />

        {/* 节点 */}
        <circle cx="0" cy="0" r="1.5" fill={color} opacity="0.9" />
      </svg>
    );
  };

  if (position === 'all') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {renderCorner('top-left')}
        {renderCorner('top-right')}
        {renderCorner('bottom-left')}
        {renderCorner('bottom-right')}
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`corner-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 主角标 */}
      <path
        d="M0 2 L0 15 L2 18 L18 18 L18 2 L15 0 L0 0 Z"
        fill={`url(#corner-grad-${variant})`}
        opacity="0.2"
      />

      {/* 边框线 */}
      <path
        d="M0 2 L0 15 L2 18 L18 18"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* 内角 */}
      <path
        d="M4 4 L4 8 L8 8 L8 4 L4 4"
        fill={color}
        opacity="0.6"
      />

      {/* 装饰点 */}
      <circle cx="0" cy="0" r="2" fill={color} opacity="0.9" />
      <circle cx="6" cy="6" r="1" fill={color} opacity="0.5" />
    </svg>
  );
};

export default CornerAccent;
