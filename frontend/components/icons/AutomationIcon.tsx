import React from 'react';

interface AutomationIconProps {
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

export const AutomationIcon: React.FC<AutomationIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-spin' : '';
  const animationStyle = animated ? { animationDuration: '3s' } : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
      style={animationStyle}
    >
      <defs>
        <filter id={`autoGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#autoGlow-${variant})`}>
        {/* 中心齿轮 */}
        <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="2" fill={color} opacity="0.8" />

        {/* 齿轮齿 */}
        <g stroke={color} strokeWidth="1.5" fill="none">
          <line x1="12" y1="4" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="20" />
          <line x1="4" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="20" y2="12" />

          {/* 对角线齿 */}
          <line x1="6.34" y1="6.34" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="17.66" y2="17.66" />
          <line x1="6.34" y1="17.66" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="17.66" y2="6.34" />
        </g>

        {/* 外部数据环 */}
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="2 2">
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="10s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 数据节点 */}
        <circle cx="12" cy="4" r="1.5" fill={color} opacity="0.9" />
        <circle cx="20" cy="12" r="1.5" fill={color} opacity="0.9" />
        <circle cx="12" cy="20" r="1.5" fill={color} opacity="0.9" />
        <circle cx="4" cy="12" r="1.5" fill={color} opacity="0.9" />

        {/* 连接弧线 */}
        <path
          d="M12 4 Q 16 6 20 12"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M20 12 Q 18 16 12 20"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M12 20 Q 8 18 4 12"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M4 12 Q 6 8 12 4"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </g>
    </svg>
  );
};

export default AutomationIcon;
