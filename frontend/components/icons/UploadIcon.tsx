import React from 'react';

/**
 * Upload Icon - 上传图标
 * 赛博朋克风格
 *
 * Usage:
 * <UploadIcon size={24} />
 * <UploadIcon size={32} variant="purple" />
 */

interface UploadIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const UploadIcon: React.FC<UploadIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
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
        <filter id={`upload-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Base Line */}
      <path
        d="M6 18 L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Arrow */}
      <path
        d="M12 14 L12 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#upload-glow-${variant})`}
      />

      {/* Arrow Head */}
      <path
        d="M8 8 L12 4 L16 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#upload-glow-${variant})`}
      />

      {/* Corner accents */}
      <circle cx="6" cy="18" r="1" fill={color} opacity="0.8"/>
      <circle cx="18" cy="18" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default UploadIcon;
