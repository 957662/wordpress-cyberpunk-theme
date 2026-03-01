interface ShareIconProps {
  size?: number;
  className?: string;
}

export const ShareIcon = ({ size = 24, className = '' }: ShareIconProps) => {
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
        <linearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="shareGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      <line x1="18" y1="5" x2="6" y2="12" stroke="url(#shareGradient)" strokeWidth="2" filter="url(#shareGlow)"/>
      <line x1="6" y1="12" x2="18" y2="19" stroke="url(#shareGradient)" strokeWidth="2" filter="url(#shareGlow)"/>

      {/* Top node */}
      <circle cx="18" cy="5" r="3" stroke="url(#shareGradient)" strokeWidth="2" fill="none" filter="url(#shareGlow)"/>
      <circle cx="18" cy="5" r="1" fill="url(#shareGradient)"/>

      {/* Middle node */}
      <circle cx="6" cy="12" r="3" stroke="url(#shareGradient)" strokeWidth="2" fill="none" filter="url(#shareGlow)"/>
      <circle cx="6" cy="12" r="1" fill="url(#shareGradient)"/>

      {/* Bottom node */}
      <circle cx="18" cy="19" r="3" stroke="url(#shareGradient)" strokeWidth="2" fill="none" filter="url(#shareGlow)"/>
      <circle cx="18" cy="19" r="1" fill="url(#shareGradient)"/>

      {/* Tech circuit points */}
      <circle cx="12" cy="8" r="0.5" fill="url(#shareGradient)" opacity="0.5"/>
      <circle cx="12" cy="16" r="0.5" fill="url(#shareGradient)" opacity="0.5"/>
    </svg>
  );
};
