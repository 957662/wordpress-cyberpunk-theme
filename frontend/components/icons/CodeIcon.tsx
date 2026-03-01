interface CodeIconProps {
  size?: number;
  className?: string;
}

export const CodeIcon = ({ size = 24, className = '' }: CodeIconProps) => {
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
        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#00ff88"/>
        </linearGradient>
        <filter id="codeGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Left bracket */}
      <path
        d="M 8 5 L 3 12 L 8 19"
        stroke="url(#codeGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#codeGlow)"
      />

      {/* Right bracket */}
      <path
        d="M 16 5 L 21 12 L 16 19"
        stroke="url(#codeGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#codeGlow)"
      />

      {/* Center lines */}
      <line x1="11" y1="8" x2="13" y2="8" stroke="url(#codeGradient)" strokeWidth="2" opacity="0.5"/>
      <line x1="10" y1="12" x2="14" y2="12" stroke="url(#codeGradient)" strokeWidth="2" opacity="0.7"/>
      <line x1="11" y1="16" x2="13" y2="16" stroke="url(#codeGradient)" strokeWidth="2" opacity="0.5"/>

      {/* Tech dots */}
      <circle cx="12" cy="12" r="1" fill="#00f0ff"/>
    </svg>
  );
};
