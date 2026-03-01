/**
 * Archive Icon - 赛博朋克风格
 *
 * Usage:
 * <ArchiveIcon size={24} variant="cyan" />
 * <ArchiveIcon size={32} variant="purple" animated={true} />
 */

interface ArchiveIconProps {
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

export const ArchiveIcon: React.FC<ArchiveIconProps> = ({
  size = 24,
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
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`archive-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Top section */}
      <path
        d="M3 5H21V8C21 8.53043 20.7893 9.03914 20.4142 9.41421C20.0391 9.78929 19.5304 10 19 10H5C4.46957 10 3.96086 9.78929 3.58579 9.41421C3.21071 9.03914 3 8.53043 3 8V5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#archive-glow-${variant}-${size})`}
      />

      {/* Body */}
      <path
        d="M5 10V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Handle */}
      <path
        d="M10 14H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tech accents */}
      <circle cx="7" cy="7" r="0.5" fill={color} opacity="0.8" />
      <circle cx="17" cy="7" r="0.5" fill={color} opacity="0.8" />
    </svg>
  );
};

export default ArchiveIcon;
