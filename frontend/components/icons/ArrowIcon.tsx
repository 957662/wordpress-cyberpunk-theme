interface ArrowIconProps {
  size?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export const ArrowIcon = ({
  size = 24,
  className = '',
  direction = 'right',
  variant = 'cyan'
}: ArrowIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colorMap[variant];
  const rotations = {
    up: -90,
    right: 0,
    down: 90,
    left: 180,
  };

  const rotation = rotations[direction];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        <filter id={`arrowGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Arrow shape */}
      <path
        d="M 5 12 L 12 5 L 12 9 L 19 9 L 19 15 L 12 15 L 12 19 Z"
        fill={color}
        filter={`url(#arrowGlow-${variant})`}
      />

      {/* Tech accent */}
      <rect x="8" y="11" width="6" height="2" fill="#000" opacity="0.3"/>
    </svg>
  );
};
