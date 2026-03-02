import React from 'react';

/**
 * Download Icon - 下载图标
 * 赛博朋克风格
 *
 * Usage:
 * <DownloadIcon size={24} />
 * <DownloadIcon size={32} variant="cyan" />
 */

interface DownloadIconProps {
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

export const DownloadIcon: React.FC<DownloadIconProps> = ({
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
        <filter id={`download-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Arrow */}
      <path
        d="M12 4 L12 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#download-glow-${variant})`}
      />

      {/* Arrow Head */}
      <path
        d="M8 10 L12 14 L16 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#download-glow-${variant})`}
      />

      {/* Base Line */}
      <path
        d="M6 18 L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Corner accents */}
      <circle cx="6" cy="18" r="1" fill={color} opacity="0.8"/>
      <circle cx="18" cy="18" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default DownloadIcon;
