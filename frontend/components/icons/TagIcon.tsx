interface TagIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export const TagIcon = ({ size = 24, className = '', variant = 'yellow' }: TagIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`tagGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Tag shape */}
      <path
        d="M 20.59 13.41 L 13.41 20.59 C 13.05 20.95 12.55 21.15 12.04 21.15 C 11.53 21.15 11.03 20.95 10.67 20.59 L 2 11.92 L 2 3.5 L 10.42 3.5 L 19.09 12.17 C 19.45 12.53 19.65 13.03 19.65 13.54 C 19.65 14.05 19.45 14.55 19.09 14.91 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={`url(#tagGlow-${variant})`}
      />

      {/* Hole */}
      <circle cx="7" cy="8" r="1.5" stroke={color} strokeWidth="1.5" fill="none"/>

      {/* Tech accent */}
      <circle cx="16" cy="16" r="1" fill={color} opacity="0.5"/>
      <line x1="18" y1="18" x2="22" y2="22" stroke={color} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
};
