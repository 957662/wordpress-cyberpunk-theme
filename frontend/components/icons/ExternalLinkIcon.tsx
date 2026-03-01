interface ExternalLinkIconProps {
  size?: number;
  className?: string;
}

export const ExternalLinkIcon = ({ size = 24, className = '' }: ExternalLinkIconProps) => {
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
        <linearGradient id="externalLinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#00ff88"/>
        </linearGradient>
        <filter id="externalLinkGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Square */}
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke="url(#externalLinkGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#externalLinkGlow)"
      />

      {/* Arrow pointing out */}
      <path
        d="M 12 8 L 21 8 L 21 17"
        stroke="url(#externalLinkGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#externalLinkGlow)"
      />

      {/* Arrowhead */}
      <path
        d="M 15 5 L 21 8 L 18 14"
        stroke="url(#externalLinkGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#externalLinkGlow)"
      />

      {/* Tech dots */}
      <circle cx="3" cy="3" r="1" fill="url(#externalLinkGradient)" opacity="0.5"/>
      <circle cx="21" cy="21" r="1" fill="url(#externalLinkGradient)" opacity="0.5"/>
    </svg>
  );
};
