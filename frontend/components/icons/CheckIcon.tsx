interface CheckIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'green' | 'yellow';
}

export const CheckIcon = ({ size = 24, className = '', variant = 'cyan' }: CheckIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    green: '#00ff88',
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
        <filter id={`checkGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Checkmark */}
      <path
        d="M 5 12 L 9 16 L 19 6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#checkGlow-${variant})`}
      />

      {/* Tech circle accent */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Corner dots */}
      <circle cx="5" cy="12" r="0.5" fill={color} opacity="0.6"/>
      <circle cx="19" cy="6" r="0.5" fill={color} opacity="0.6"/>
    </svg>
  );
};
