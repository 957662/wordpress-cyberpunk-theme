import React from 'react';

/**
 * Bell Icon - 通知铃铛图标
 * 赛博朋克风格
 *
 * Usage:
 * <BellIcon size={24} />
 * <BellIcon size={32} variant="yellow" />
 */

interface BellIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
  hasNotification?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const BellIcon: React.FC<BellIconProps> = ({
  size = 24,
  className = '',
  variant = 'yellow',
  animated = false,
  hasNotification = false,
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
        <filter id={`bell-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Bell top */}
      <path
        d="M12 2 L12 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Bell body */}
      <path
        d="M6 8 Q6 18, 4 18 L20 18 Q18 18, 18 8 Q18 4, 12 4 Q6 4, 6 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#bell-glow-${variant})`}
      />

      {/* Bell bottom */}
      <path
        d="M8 18 Q8 22, 12 22 Q16 22, 16 18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Clapper */}
      <circle
        cx="12"
        cy="18"
        r="1.5"
        fill={color}
        opacity="0.6"
      />

      {/* Notification dot */}
      {hasNotification && (
        <circle
          cx="18"
          cy="6"
          r="4"
          fill={color}
          filter={`url(#bell-glow-${variant})`}
        />
      )}

      {/* Corner accents */}
      <circle cx="4" cy="8" r="0.75" fill={color} opacity="0.5"/>
      <circle cx="20" cy="8" r="0.75" fill={color} opacity="0.5"/>
    </svg>
  );
};

export default BellIcon;
