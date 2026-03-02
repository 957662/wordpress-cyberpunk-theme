import React from 'react';

interface CyberMatrixIconProps {
  size?: number;
  className?: string;
  color?: string;
  animated?: boolean;
}

/**
 * 赛博矩阵图标
 * 模拟数据流和代码雨效果
 */
export const CyberMatrixIcon: React.FC<CyberMatrixIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  animated = false
}) => {
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
      {/* 背景框 */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* 数据列 */}
      <g opacity="0.8">
        {/* 第一列 */}
        <rect x="5" y="4" width="1.5" height="2" fill={color} opacity="0.9" />
        <rect x="5" y="7" width="1.5" height="1" fill={color} opacity="0.6" />
        <rect x="5" y="9" width="1.5" height="3" fill={color} opacity="0.8" />
        <rect x="5" y="13" width="1.5" height="1" fill={color} opacity="0.5" />
        <rect x="5" y="15" width="1.5" height="2" fill={color} opacity="0.7" />
        <rect x="5" y="18" width="1.5" height="1" fill={color} opacity="0.4" />

        {/* 第二列 */}
        <rect x="8" y="5" width="1.5" height="1" fill="#9d00ff" opacity="0.7" />
        <rect x="8" y="7" width="1.5" height="2" fill="#9d00ff" opacity="0.9" />
        <rect x="8" y="10" width="1.5" height="1" fill="#9d00ff" opacity="0.5" />
        <rect x="8" y="12" width="1.5" height="3" fill="#9d00ff" opacity="0.8" />
        <rect x="8" y="16" width="1.5" height="2" fill="#9d00ff" opacity="0.6" />

        {/* 第三列 */}
        <rect x="11" y="4" width="1.5" height="3" fill={color} opacity="0.8" />
        <rect x="11" y="8" width="1.5" height="1" fill={color} opacity="0.5" />
        <rect x="11" y="10" width="1.5" height="2" fill={color} opacity="0.7" />
        <rect x="11" y="13" width="1.5" height="1" fill={color} opacity="0.4" />
        <rect x="11" y="15" width="1.5" height="3" fill={color} opacity="0.9" />

        {/* 第四列 */}
        <rect x="14" y="6" width="1.5" height="2" fill="#ff0080" opacity="0.7" />
        <rect x="14" y="9" width="1.5" height="1" fill="#ff0080" opacity="0.5" />
        <rect x="14" y="11" width="1.5" height="3" fill="#ff0080" opacity="0.8" />
        <rect x="14" y="15" width="1.5" height="1" fill="#ff0080" opacity="0.6" />
        <rect x="14" y="17" width="1.5" height="2" fill="#ff0080" opacity="0.9" />

        {/* 第五列 */}
        <rect x="17" y="4" width="1.5" height="1" fill={color} opacity="0.6" />
        <rect x="17" y="6" width="1.5" height="2" fill={color} opacity="0.8" />
        <rect x="17" y="9" width="1.5" height="1" fill={color} opacity="0.5" />
        <rect x="17" y="11" width="1.5" height="4" fill={color} opacity="0.9" />
        <rect x="17" y="16" width="1.5" height="2" fill={color} opacity="0.7" />
      </g>

      {/* 装饰点 */}
      <circle cx="6" cy="18" r="0.5" fill="#f0ff00" opacity="0.8" />
      <circle cx="12" cy="4" r="0.5" fill="#f0ff00" opacity="0.8" />
      <circle cx="18" cy="12" r="0.5" fill="#f0ff00" opacity="0.8" />
    </svg>
  );
};

export default CyberMatrixIcon;
