import React from 'react';
/**
 * Network Icon - 赛博朋克风格
 *
 * Usage:
 * <NetworkIcon size={48} variant="cyan" />
 * <NetworkIcon size={64} variant="purple" animated={true} />
 */

interface NetworkIconProps {
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

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`network-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/*  Connection lines  */}
      <line x1="24" y1="10" x2="10" y2="24" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="24" y1="10" x2="38" y2="24" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="24" y1="10" x2="24" y2="38" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="10" y1="24" x2="38" y2="24" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="10" y1="24" x2="24" y2="38" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="38" y1="24" x2="24" y2="38" stroke={color} strokeWidth="1" opacity="0.4"/>

      {/*  Central hub  */}
      <circle cx="24" cy="24" r="8"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              filter={`url(#network-glow-${variant})`}/>
      <circle cx="24" cy="24" r="4"
              fill={color}
              opacity="0.6"/>
      <circle cx="24" cy="24" r="2"
              fill={color}
              filter={`url(#network-glow-${variant})`}/>

      {/*  Top node  */}
      <circle cx="24" cy="10" r="5"
              stroke={color}
              strokeWidth="1.5"
              fill="none"/>
      <circle cx="24" cy="10" r="2" fill={color} opacity="0.8"/>

      {/*  Left node  */}
      <circle cx="10" cy="24" r="5"
              stroke={color}
              strokeWidth="1.5"
              fill="none"/>
      <circle cx="10" cy="24" r="2" fill={color} opacity="0.8"/>

      {/*  Right node  */}
      <circle cx="38" cy="24" r="5"
              stroke={color}
              strokeWidth="1.5"
              fill="none"/>
      <circle cx="38" cy="24" r="2" fill={color} opacity="0.8"/>

      {/*  Bottom node  */}
      <circle cx="24" cy="38" r="5"
              stroke={color}
              strokeWidth="1.5"
              fill="none"/>
      <circle cx="24" cy="38" r="2" fill={color} opacity="0.8"/>

      {/*  Data particles  */}
      <circle cx="17" cy="17" r="1" fill={color} opacity="0.5"/>
      <circle cx="31" cy="17" r="1" fill={color} opacity="0.5"/>
      <circle cx="17" cy="31" r="1" fill={color} opacity="0.5"/>
      <circle cx="31" cy="31" r="1" fill={color} opacity="0.5"/>
    </svg>
  );
};

export default NetworkIcon;
