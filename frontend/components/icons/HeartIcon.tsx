interface HeartIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
  variant?: 'pink' | 'cyan' | 'purple';
}

export const HeartIcon = ({ size = 24, className = '', filled = false, variant = 'pink' }: HeartIconProps) => {
  const colorMap = {
    pink: '#ff0080',
    cyan: '#00f0ff',
    purple: '#9d00ff',
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
        <linearGradient id={`heartGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={variant === 'pink' ? '#ff6600' : variant === 'cyan' ? '#00ff88' : '#ff0080'}/>
        </linearGradient>
        <filter id={`heartGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Heart shape */}
      <path
        d="M 12 21.35 L 10.55 20.03 C 5.4 15.36 2 12.27 2 8.5 C 2 5.41 4.42 3 7.5 3 C 9.24 3 10.91 3.81 12 5.08 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.41 22 8.5 C 22 12.27 18.6 15.36 13.45 20.03 L 12 21.35 Z"
        fill={filled ? `url(#heartGradient-${variant})` : 'none'}
        stroke={`url(#heartGradient-${variant})`}
        strokeWidth="2"
        filter={`url(#heartGlow-${variant})`}
      />

      {/* Tech circuit lines */}
      {!filled && (
        <>
          <line x1="6" y1="8" x2="4" y2="8" stroke={color} strokeWidth="1" opacity="0.3"/>
          <line x1="18" y1="8" x2="20" y2="8" stroke={color} strokeWidth="1" opacity="0.3"/>
          <circle cx="4" cy="8" r="0.5" fill={color} opacity="0.5"/>
          <circle cx="20" cy="8" r="0.5" fill={color} opacity="0.5"/>
        </>
      )}
    </svg>
  );
};
