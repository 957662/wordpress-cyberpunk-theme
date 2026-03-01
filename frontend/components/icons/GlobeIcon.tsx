/**
 * Globe Icon - 赛博朋克风格
 *
 * Usage:
 * <GlobeIcon size={24} variant="cyan" />
 * <GlobeIcon size={32} variant="purple" animated={true} />
 */

interface GlobeIconProps {
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

export const GlobeIcon: React.FC<GlobeIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-spin-slow' : '';

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
        <filter id={`globe-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#globe-glow-${variant}-${size})`}
      />

      {/* Vertical line */}
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Horizontal line */}
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Top ellipse */}
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Bottom ellipse */}
      <ellipse
        cx="12"
        cy="12"
        rx="4"
        ry="9"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Tech nodes */}
      <circle cx="12" cy="3" r="0.5" fill={color} opacity="0.8" />
      <circle cx="12" cy="21" r="0.5" fill={color} opacity="0.8" />
      <circle cx="3" cy="12" r="0.5" fill={color} opacity="0.8" />
      <circle cx="21" cy="12" r="0.5" fill={color} opacity="0.8" />
    </svg>
  );
};

export default GlobeIcon;
