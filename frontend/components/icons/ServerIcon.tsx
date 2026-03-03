import React from 'react';

interface ServerIconProps {
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

export const ServerIcon: React.FC<ServerIconProps> = ({
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
        <filter id={`serverGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#serverGlow-${variant})`}>
        {/* 服务器外框 */}
        <rect x="4" y="2" width="16" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
        <rect x="4" y="11" width="16" height="7" rx="1" stroke={color} strokeWidth="1.5" fill="none" />

        {/* 顶部服务器细节 */}
        <circle cx="7" cy="5.5" r="1" fill={color} opacity={animated ? '0.9' : '0.7'} />
        <circle cx="10" cy="5.5" r="1" fill={color} opacity="0.5" />
        <line x1="13" y1="5.5" x2="18" y2="5.5" stroke={color} strokeWidth="1" opacity="0.5" />

        {/* 底部服务器细节 */}
        <circle cx="7" cy="14.5" r="1" fill={color} opacity="0.7" />
        <circle cx="10" cy="14.5" r="1" fill={color} opacity="0.5" />
        <line x1="13" y1="14.5" x2="18" y2="14.5" stroke={color} strokeWidth="1" opacity="0.5" />

        {/* LED 指示灯 */}
        <circle cx="17" cy="4" r="0.5" fill="#00ff88" opacity={animated ? '1' : '0.8'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="17" cy="13" r="0.5" fill="#00ff88" opacity={animated ? '1' : '0.8'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          )}
        </circle>
      </g>
    </svg>
  );
};

export default ServerIcon;
