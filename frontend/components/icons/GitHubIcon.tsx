interface GitHubIconProps {
  size?: number;
  className?: string;
  filled?: boolean;
}

export const GitHubIcon = ({ size = 24, className = '', filled = false }: GitHubIconProps) => {
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
        <linearGradient id="githubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
        <filter id="githubGlow">
          <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* GitHub cat silhouette */}
      <path
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        fill={filled ? 'url(#githubGradient)' : 'none'}
        stroke={filled ? 'none' : 'url(#githubGradient)'}
        strokeWidth="1"
        filter="url(#githubGlow)"
      />

      {/* Tech circuit accents */}
      <circle cx="6" cy="18" r="1" fill="#00f0ff" opacity="0.5"/>
      <circle cx="18" cy="6" r="1" fill="#9d00ff" opacity="0.5"/>
      <line x1="6" y1="18" x2="4" y2="20" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3"/>
      <line x1="18" y1="6" x2="20" y2="4" stroke="#9d00ff" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
};
