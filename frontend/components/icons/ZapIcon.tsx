/**
 * Zap/Lightning Icon - 赛博朋克风格
 *
 * Usage:
 * <ZapIcon size={24} variant="yellow" />
 * <ZapIcon size={32} variant="cyan" animated={true} />
 */

interface ZapIconProps {
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

export const ZapIcon: React.FC<ZapIconProps> = ({
  size = 24,
  variant = 'yellow',
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
        <filter id={`zap-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Lightning bolt */}
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#zap-glow-${variant}-${size})`}
      />

      {/* Inner bolt */}
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill={color}
        opacity="0.2"
      />

      {/* Tech accents */}
      <circle cx="12" cy="8" r="0.5" fill={color} opacity="0.8" />
      <circle cx="14" cy="14" r="0.5" fill={color} opacity="0.8" />
      <circle cx="10" cy="18" r="0.5" fill={color} opacity="0.8" />

      {/* Energy sparks */}
      <line x1="17" y1="4" x2="18" y2="5" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="19" y1="2" x2="19" y2="4" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="5" y1="16" x2="4" y2="17" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
};

export default ZapIcon;
