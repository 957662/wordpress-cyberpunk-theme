import React from 'react';

interface VirtualRealityIconProps {
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

export const VirtualRealityIcon: React.FC<VirtualRealityIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`vrGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={`vrGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#9d00ff', stopOpacity: 0.6 }} />
        </linearGradient>
      </defs>

      <g filter={`url(#vrGlow-${variant})`}>
        {/* VR 头显外框 */}
        <rect x="2" y="8" width="20" height="10" rx="3" stroke={color} strokeWidth="1.5" fill="none" />

        {/* 镜片分割线 */}
        <line x1="12" y1="9" x2="12" y2="17" stroke={color} strokeWidth="1" opacity="0.5" />

        {/* 左镜片 */}
        <rect x="4" y="10" width="7" height="6" rx="1" stroke={color} strokeWidth="1" fill="rgba(0,240,255,0.1)" />
        {/* 右镜片 */}
        <rect x="13" y="10" width="7" height="6" rx="1" stroke={color} strokeWidth="1" fill="rgba(157,0,255,0.1)" />

        {/* 镜片内部细节 */}
        <g opacity="0.6">
          {/* 左镜片网格 */}
          <line x1="5.5" y1="10" x2="5.5" y2="16" stroke={color} strokeWidth="0.5" />
          <line x1="7" y1="10" x2="7" y2="16" stroke={color} strokeWidth="0.5" />
          <line x1="8.5" y1="10" x2="8.5" y2="16" stroke={color} strokeWidth="0.5" />

          {/* 右镜片网格 */}
          <line x1="14.5" y1="10" x2="14.5" y2="16" stroke={color} strokeWidth="0.5" />
          <line x1="16" y1="10" x2="16" y2="16" stroke={color} strokeWidth="0.5" />
          <line x1="17.5" y1="10" x2="17.5" y2="16" stroke={color} strokeWidth="0.5" />
        </g>

        {/* 头带 */}
        <path d="M2 11 Q 1 11 1 13 L 1 15 Q 1 17 2 17" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M22 11 Q 23 11 23 13 L 23 15 Q 23 17 22 17" stroke={color} strokeWidth="1.5" fill="none" />

        {/* 发光效果 */}
        {animated && (
          <>
            <circle cx="7.5" cy="13" r="0.5" fill={color}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="16.5" cy="13" r="0.5" fill={color}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.75s"
              />
            </circle>
          </>
        )}

        {/* 顶部传感器 */}
        <circle cx="12" cy="7" r="1.5" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="12" cy="7" r="0.5" fill={color} opacity={animated ? '1' : '0.7'}>
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>
    </svg>
  );
};

export default VirtualRealityIcon;
