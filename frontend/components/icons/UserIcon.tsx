interface UserIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink';
}

export const UserIcon = ({ size = 24, className = '', variant = 'purple' }: UserIconProps) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
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
        <filter id={`userGlow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Head */}
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={`url(#userGlow-${variant})`}
      />

      {/* Body */}
      <path
        d="M 4 20 C 4 15.58 7.58 12 12 12 C 16.42 12 20 15.58 20 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#userGlow-${variant})`}
      />

      {/* Tech circuit points */}
      <circle cx="12" cy="8" r="1.5" fill={color} opacity="0.5"/>
      <circle cx="8" cy="18" r="1" fill={color} opacity="0.3"/>
      <circle cx="16" cy="18" r="1" fill={color} opacity="0.3"/>
    </svg>
  );
};
