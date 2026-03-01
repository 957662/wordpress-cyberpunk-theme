import React from 'react';
/**
 * Discord Icon - 赛博朋克风格
 *
 * Usage:
 * <DiscordIcon size={24} variant="purple" />
 * <DiscordIcon size={32} variant="cyan" animated={true} />
 */

interface DiscordIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const DiscordIcon: React.FC<DiscordIconProps> = ({
  size = 24,
  variant = 'purple',
  className = '',
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
        <filter id={`discord-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Left ear  */}
      <path
        d="M8 4C8 4 5.5 4 4 6C2.5 8 2 10 2 10C2 10 3 14 6 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#discord-glow-${variant}-${size})`}
      />

      {/*  Right ear  */}
      <path
        d="M16 4C16 4 18.5 4 20 6C21.5 8 22 10 22 10C22 10 21 14 18 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#discord-glow-${variant}-${size})`}
      />

      {/*  Face outline  */}
      <path
        d="M8 4V20C8 20 8 21 9 21H15C16 21 16 20 16 20V4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/*  Left eye  */}
      <circle cx="9" cy="12" r="1.5" fill={color} />
      <circle cx="9" cy="12" r="0.5" fill="#0a0a0f" />

      {/*  Right eye  */}
      <circle cx="15" cy="12" r="1.5" fill={color} />
      <circle cx="15" cy="12" r="0.5" fill="#0a0a0f" />

      {/*  Mouth  */}
      <path
        d="M9 16C9 16 10 17 12 17C14 17 15 16 15 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/*  Tech accents  */}
      <circle cx="6" cy="8" r="0.5" fill={color} opacity="0.6" />
      <circle cx="18" cy="8" r="0.5" fill={color} opacity="0.6" />
    </svg>
  );
};

export default DiscordIcon;
