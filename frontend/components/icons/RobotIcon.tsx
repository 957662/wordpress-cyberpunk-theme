import React from 'react';

interface RobotIconProps {
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

export const RobotIcon: React.FC<RobotIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-bounce' : '';

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
        <filter id={`robotGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#robotGlow-${variant})`}>
        {/* 天线 */}
        <line x1="12" y1="2" x2="12" y2="4" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="2" r="1.5" fill={color} opacity={animated ? '1' : '0.8'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 头部 */}
        <rect x="6" y="4" width="12" height="10" rx="2" stroke={color} strokeWidth="1.5" fill="none" />

        {/* 眼睛 */}
        <circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="9" cy="9" r="1" fill={color} opacity={animated ? '1' : '0.8'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        <circle cx="15" cy="9" r="2" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="15" cy="9" r="1" fill={color} opacity={animated ? '1' : '0.8'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2s"
              repeatCount="indefinite"
              begin="0.1s"
            />
          )}
        </circle>

        {/* 嘴巴 */}
        <rect x="9" y="12" width="6" height="1" fill={color} opacity="0.7" />

        {/* 身体 */}
        <rect x="7" y="15" width="10" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />

        {/* 身体细节 */}
        <circle cx="10" cy="18" r="1" fill={color} opacity="0.7" />
        <circle cx="12" cy="18" r="1" fill={color} opacity="0.7" />
        <circle cx="14" cy="18" r="1" fill={color} opacity="0.7" />

        {/* 手臂 */}
        <line x1="5" y1="17" x2="7" y2="17" stroke={color} strokeWidth="1.5" />
        <line x1="17" y1="17" x2="19" y2="17" stroke={color} strokeWidth="1.5" />

        {/* 手 -->
        <circle cx="4" cy="17" r="1.5" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="20" cy="17" r="1.5" stroke={color} strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
};

export default RobotIcon;
