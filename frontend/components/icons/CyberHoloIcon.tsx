import React from 'react';

interface CyberHoloIconProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * 赛博全息图标
 * 用于表示全息投影、虚拟现实或未来科技
 */
export const CyberHoloIcon: React.FC<CyberHoloIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff'
}) => {
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
        <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#9d00ff', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      {/* 基座椭圆 */}
      <ellipse
        cx="12"
        cy="20"
        rx="8"
        ry="2"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* 光束 */}
      <path
        d="M5 20 L8 10 L16 10 L19 20"
        stroke="url(#holoGradient)"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* 全息投影主体 */}
      <g>
        <!-- 六边形外框 -->
        <path
          d="M12 3 L18 6.5 L18 13.5 L12 17 L6 13.5 L6 6.5 Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />

        {/* 内部六边形 */}
        <path
          d="M12 6 L15.5 8 L15.5 12 L12 14 L8.5 12 L8.5 8 Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />

        {/* 中心圆 */}
        <circle cx="12" cy="10" r="2" fill={color} opacity="0.7" />

        {/* 扫描线效果 */}
        <line x1="6" y1="10" x2="18" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <line x1="7" y1="8.5" x2="17" y2="8.5" stroke={color} strokeWidth="0.5" opacity="0.2" />
        <line x1="7" y1="11.5" x2="17" y2="11.5" stroke={color} strokeWidth="0.5" opacity="0.2" />
      </g>

      {/* 粒子效果 */}
      <circle cx="4" cy="15" r="0.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="14" r="0.5" fill={color} opacity="0.6" />
      <circle cx="3" cy="8" r="0.5" fill="#9d00ff" opacity="0.4" />
      <circle cx="21" cy="7" r="0.5" fill="#9d00ff" opacity="0.4" />
    </svg>
  );
};

export default CyberHoloIcon;
