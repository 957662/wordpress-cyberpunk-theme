/**
 * Chip/Microcontroller Icon - 赛博朋克风格
 *
 * Usage:
 * <ChipIcon size={48} variant="pink" />
 * <ChipIcon size={64} variant="cyan" animated={true} />
 */

interface ChipIconProps {
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

export const ChipIcon: React.FC<ChipIconProps> = ({
  size = 48,
  variant = 'pink',
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
        <filter id={`chip-glow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`chip-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
        </linearGradient>
      </defs>

      {/* Chip body */}
      <rect x="12" y="12" width="24" height="24" rx="2"
            stroke={color}
            strokeWidth="1.5"
            fill={`url(#chip-gradient-${variant})`}
            filter={`url(#chip-glow-${variant})`}/>

      {/* Inner circuit pattern */}
      <rect x="16" y="16" width="8" height="8" rx="1"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"/>
      <rect x="24" y="24" width="8" height="8" rx="1"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"/>
      <rect x="24" y="16" width="8" height="8" rx="1"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"/>
      <rect x="16" y="24" width="8" height="8" rx="1"
            stroke={color}
            strokeWidth="1"
            fill="none"
            opacity="0.7"/>

      {/* Central core */}
      <circle cx="24" cy="24" r="3"
              fill={color}
              opacity="0.8"
              filter={`url(#chip-glow-${variant})`}/>

      {/* Top pins */}
      <line x1="16" y1="12" x2="16" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="20" y1="12" x2="20" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="24" y1="12" x2="24" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="28" y1="12" x2="28" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="32" y1="12" x2="32" y2="8" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/* Bottom pins */}
      <line x1="16" y1="36" x2="16" y2="40" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="20" y1="36" x2="20" y2="40" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="24" y1="36" x2="24" y2="40" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="28" y1="36" x2="28" y2="40" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="32" y1="36" x2="32" y2="40" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/* Left pins */}
      <line x1="12" y1="16" x2="8" y2="16" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="12" y1="20" x2="8" y2="20" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="12" y1="24" x2="8" y2="24" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="12" y1="28" x2="8" y2="28" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="12" y1="32" x2="8" y2="32" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/* Right pins */}
      <line x1="36" y1="16" x2="40" y2="16" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="20" x2="40" y2="20" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="24" x2="40" y2="24" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="28" x2="40" y2="28" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="32" x2="40" y2="32" stroke={color} strokeWidth="1" opacity="0.6"/>

      {/* Corner dots */}
      <circle cx="12" cy="12" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="12" r="1" fill={color} opacity="0.8"/>
      <circle cx="36" cy="36" r="1" fill={color} opacity="0.8"/>
      <circle cx="12" cy="36" r="1" fill={color} opacity="0.8"/>
    </svg>
  );
};

export default ChipIcon;
