/**
 * Terminal Icon - 赛博朋克风格
 *
 * Usage:
 * <TerminalIcon size={24} variant="green" />
 * <TerminalIcon size={32} variant="cyan" animated={true} />
 */

interface TerminalIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

export const TerminalIcon: React.FC<TerminalIconProps> = ({
  size = 24,
  variant = 'green',
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
        <filter id={`terminal-glow-${variant}-${size}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Terminal window */}
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#terminal-glow-${variant}-${size})`}
      />

      {/* Title bar */}
      <line
        x1="2"
        y1="8"
        x2="22"
        y2="8"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Window controls */}
      <circle cx="5" cy="6" r="0.75" fill={color} opacity="0.8" />
      <circle cx="8" cy="6" r="0.75" fill={color} opacity="0.6" />
      <circle cx="11" cy="6" r="0.75" fill={color} opacity="0.4" />

      {/* Prompt symbol */}
      <path
        d="M6 13L9 16L6 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Cursor line */}
      <line
        x1="12"
        y1="19"
        x2="18"
        y2="19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Tech grid lines */}
      <line x1="14" y1="14" x2="18" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="16" x2="17" y2="16" stroke={color} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
};

export default TerminalIcon;
