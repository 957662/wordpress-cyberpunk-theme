import React from 'react';

interface AnalyticsIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const AnalyticsIcon: React.FC<AnalyticsIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
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
        <filter id={`analyticsGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={`barGrad-${variant}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <g filter={`url(#analyticsGlow-${variant})`}>
        {/* 坐标轴 */}
        <line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <line x1="3" y1="20" x2="3" y2="4" stroke={color} strokeWidth="1.5" opacity="0.5" />

        {/* 数据柱 */}
        <rect
          x="5"
          y="12"
          width="3"
          height="8"
          fill={color}
          opacity="0.7"
          className={animated ? 'animate-pulse' : ''}
        />
        <rect
          x="10"
          y="8"
          width="3"
          height="12"
          fill={color}
          opacity="0.85"
          className={animated ? 'animate-pulse' : ''}
          style={animated ? { animationDelay: '0.2s' } : undefined}
        />
        <rect
          x="15"
          y="5"
          width="3"
          height="15"
          fill={color}
          opacity="1"
          className={animated ? 'animate-pulse' : ''}
          style={animated ? { animationDelay: '0.4s' } : undefined}
        />

        {/* 趋势线 */}
        <path
          d="M3 17 L6.5 14 L10 16 L13.5 11 L17 13 L21 7"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.9"
        />

        {/* 数据点 */}
        <circle cx="6.5" cy="14" r="1.5" fill={color} />
        <circle cx="10" cy="16" r="1.5" fill={color} />
        <circle cx="13.5" cy="11" r="1.5" fill={color} />
        <circle cx="17" cy="13" r="1.5" fill={color} />
        <circle cx="21" cy="7" r="1.5" fill={color} />
      </g>
    </svg>
  );
};

export default AnalyticsIcon;
