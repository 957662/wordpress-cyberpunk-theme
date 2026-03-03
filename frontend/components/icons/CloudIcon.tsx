import React from 'react';

interface CloudIconProps {
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

export const CloudIcon: React.FC<CloudIconProps> = ({
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
        <filter id={`cloudGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 云朵外轮廓 */}
      <g filter={`url(#cloudGlow-${variant})`}>
        <path
          d="M6 19C3.23858 19 1 16.7614 1 14C1 11.5 2.8 9.4 5.2 9C5.8 6.2 8.2 4 11 4C14.2 4 16.8 6.2 17.5 9.2C17.7 9.2 17.8 9.2 18 9.2C20.8 9.2 23 11.4 23 14.2C23 16.8 20.8 19 18 19H6Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* 数据节点 */}
      <circle cx="8" cy="13" r="1.5" fill={color} opacity="0.8" />
      <circle cx="12" cy="11" r="1.5" fill={color} opacity="0.8" />
      <circle cx="16" cy="13" r="1.5" fill={color} opacity="0.8" />

      {/* 连接线 */}
      <path d="M8 13 L12 11 L16 13" stroke={color} strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
};

export default CloudIcon;
