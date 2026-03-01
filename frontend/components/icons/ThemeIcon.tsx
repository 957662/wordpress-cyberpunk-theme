interface ThemeIconProps {
  size?: number;
  className?: string;
  mode?: 'light' | 'dark';
}

export const ThemeIcon = ({ size = 24, className = '', mode = 'dark' }: ThemeIconProps) => {
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
        <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0ff00"/>
          <stop offset="100%" stopColor="#ff6600"/>
        </linearGradient>
        <filter id="themeGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {mode === 'dark' ? (
        // Moon
        <>
          <path
            d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 Z"
            stroke="url(#themeGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#themeGlow)"
          />
          {/* Stars */}
          <circle cx="9" cy="9" r="0.5" fill="url(#themeGradient)"/>
          <circle cx="18" cy="18" r="0.5" fill="url(#themeGradient)"/>
          <circle cx="6" cy="18" r="0.3" fill="url(#themeGradient)" opacity="0.5"/>
        </>
      ) : (
        // Sun
        <>
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke="url(#themeGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#themeGlow)"
          />
          {/* Rays */}
          <line x1="12" y1="1" x2="12" y2="3" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="url(#themeGradient)" strokeWidth="2" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
};
