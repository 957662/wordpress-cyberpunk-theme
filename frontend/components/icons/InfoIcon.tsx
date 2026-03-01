interface InfoIconProps {
  size?: number;
  className?: string;
}

export const InfoIcon = ({ size = 24, className = '' }: InfoIconProps) => {
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
        <linearGradient id="infoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#00ff88"/>
        </linearGradient>
        <filter id="infoGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloralBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="url(#infoGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#infoGlow)"
      />

      {/* Dot */}
      <circle cx="12" cy="8" r="1.5" fill="url(#infoGradient)"/>

      {/* Line */}
      <rect x="11" y="11" width="2" height="7" rx="1" fill="url(#infoGradient)"/>

      {/* Tech accent */}
      <circle cx="12" cy="12" r="7" stroke="url(#infoGradient)" strokeWidth="0.5" fill="none" opacity="0.3"/>
    </svg>
  );
};
