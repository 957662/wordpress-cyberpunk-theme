interface CopyIconProps {
  size?: number;
  className?: string;
}

export const CopyIcon = ({ size = 24, className = '' }: CopyIconProps) => {
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
        <linearGradient id="copyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
        <filter id="copyGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Back document */}
      <rect
        x="2"
        y="2"
        width="14"
        height="20"
        rx="2"
        stroke="url(#copyGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        filter="url(#copyGlow)"
      />

      {/* Front document */}
      <rect
        x="6"
        y="6"
        width="14"
        height="16"
        rx="2"
        stroke="url(#copyGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#copyGlow)"
      />

      {/* Content lines */}
      <rect x="9" y="10" width="8" height="1.5" rx="0.5" fill="url(#copyGradient)" opacity="0.6"/>
      <rect x="9" y="13" width="8" height="1.5" rx="0.5" fill="url(#copyGradient)" opacity="0.6"/>
      <rect x="9" y="16" width="5" height="1.5" rx="0.5" fill="url(#copyGradient)" opacity="0.4"/>

      {/* Tech accent */}
      <circle cx="18" cy="8" r="1" fill="url(#copyGradient)"/>
    </svg>
  );
};
