import React from 'react';
/**
 * Shield Lock Icon - 赛博朋克风格
 *
 * Usage:
 * <ShieldLockIcon size={48} variant="cyan" />
 * <ShieldLockIcon size={64} variant="purple" locked={true} />
 */

interface ShieldLockIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  locked?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const ShieldLockIcon: React.FC<ShieldLockIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  locked = true,
}) => {
  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`shield-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Shield outline  */}
      <path d="M24 4 L40 10 V22 C40 32 32 42 24 44 C16 42 8 32 8 22 V10 L24 4Z"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            filter={`url(#shield-glow-${variant})`}/>

      {/*  Shield inner glow  */}
      <path d="M24 8 L36 13 V22 C36 30 30 38 24 40 C18 38 12 30 12 22 V13 L24 8Z"
            fill={color}
            opacity="0.15"/>

      {/*  Lock body  */}
      <rect x="18" y="22" width="12" height="10" rx="1"
            stroke={color}
            strokeWidth="1.5"
            fill={locked ? color : 'none'}
            fillOpacity={locked ? 0.3 : 0}
            filter={`url(#shield-glow-${variant})`}/>

      {/*  Lock shackle  */}
      <path d="M20 22 V18 C20 15.2 22.2 13 25 13 C27.8 13 30 15.2 30 18 V22"
            stroke={color}
            strokeWidth="1.5"
            fill="none"/>

      {/*  Lock keyhole  */}
      {locked && (
        <>
          <circle cx="24" cy="27" r="2" fill={color} opacity="0.8"/>
          <line x1="24" y1="29" x2="24" y2="31" stroke={color} strokeWidth="1"/>
        </>
      )}

      {/*  Corner accents  */}
      <circle cx="24" cy="8" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="13" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="22" r="1" fill={color} opacity="0.8"/>
      <circle cx="12" cy="22" r="1" fill={color} opacity="0.8"/>
      <circle cx="12" cy="13" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default ShieldLockIcon;
