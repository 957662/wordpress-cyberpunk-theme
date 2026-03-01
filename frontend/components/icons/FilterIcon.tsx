interface FilterIconProps {
  size?: number;
  className?: string;
}

export const FilterIcon = ({ size = 24, className = '' }: FilterIconProps) => {
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
        <linearGradient id="filterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
        <filter id="filterGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Funnel shape */}
      <path
        d="M 2 4 L 22 4 L 14 13 L 14 19 L 10 21 L 10 13 Z"
        stroke="url(#filterGradient)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
        filter="url(#filterGlow)"
      />

      {/* Tech circuit lines */}
      <line x1="2" y1="4" x2="0" y2="4" stroke="url(#filterGradient)" strokeWidth="1" opacity="0.3"/>
      <line x1="22" y1="4" x2="24" y2="4" stroke="url(#filterGradient)" strokeWidth="1" opacity="0.3"/>
      <circle cx="0" cy="4" r="0.5" fill="url(#filterGradient)" opacity="0.5"/>
      <circle cx="24" cy="4" r="0.5" fill="url(#filterGradient)" opacity="0.5"/>

      {/* Filter dots */}
      <circle cx="6" cy="4" r="0.5" fill="url(#filterGradient)" opacity="0.4"/>
      <circle cx="18" cy="4" r="0.5" fill="url(#filterGradient)" opacity="0.4"/>
    </svg>
  );
};
