/**
 * Offline Status Icon - 赛博朋克风格
 *
 * Usage:
 * <OfflineIcon size={24} variant="pink" />
 * <OfflineIcon size={32} variant="yellow" animated={true} />
 */

interface OfflineIconProps {
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

export const OfflineIcon: React.FC<OfflineIconProps> = ({
  size = 24,
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
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`offline-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
        strokeDasharray="4 2"
      />

      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="2 2"
      />

      {/* Cross/X mark */}
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#offline-glow-${variant}-${size})`}
      />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#offline-glow-${variant}-${size})`}
      />

      {/* Tech accents */}
      <circle cx="12" cy="2" r="0.5" fill={color} opacity="0.5" />
      <circle cx="12" cy="22" r="0.5" fill={color} opacity="0.5" />
    </svg>
  );
};

export default OfflineIcon;
