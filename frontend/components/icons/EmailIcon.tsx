import React from 'react';

/**
 * Email Icon - 邮箱图标
 * 赛博朋克风格
 *
 * Usage:
 * <EmailIcon size={24} />
 * <EmailIcon size={32} variant="purple" />
 */

interface EmailIconProps {
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

export const EmailIcon: React.FC<EmailIconProps> = ({
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
        <filter id={`email-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Envelope body */}
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        filter={`url(#email-glow-${variant})`}
      />

      {/* Envelope flap lines */}
      <path
        d="M3 6 L12 13 L21 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Horizontal line */}
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Corner dots */}
      <circle cx="3" cy="5" r="1" fill={color} opacity="0.6"/>
      <circle cx="21" cy="5" r="1" fill={color} opacity="0.6"/>
      <circle cx="3" cy="19" r="1" fill={color} opacity="0.6"/>
      <circle cx="21" cy="19" r="1" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default EmailIcon;
