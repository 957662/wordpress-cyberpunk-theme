'use client';

/**
 * CircuitIcon - 电路板装饰图标
 * 赛博朋克风格的电路图案，用于装饰背景
 */

interface CircuitIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export const CircuitIcon = ({
  size = 24,
  className = '',
  variant = 'cyan'
}: CircuitIconProps) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 电路路径 */}
      <path
        d="M20 50 H40 V30 H60 V50 H80"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="30" r="3" fill={color} />
      <circle cx="60" cy="50" r="3" fill={color} />
      <circle cx="20" cy="50" r="2" fill={color} />
      <circle cx="80" cy="50" r="2" fill={color} />

      {/* 电路节点 */}
      <circle cx="40" cy="50" r="4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="60" cy="30" r="4" fill="none" stroke={color} strokeWidth="2" />

      {/* 发光效果 */}
      <circle cx="40" cy="30" r="6" fill={color} opacity="0.2" />
      <circle cx="60" cy="50" r="6" fill={color} opacity="0.2" />
    </svg>
  );
};

export default CircuitIcon;
