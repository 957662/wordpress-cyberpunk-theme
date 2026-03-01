interface SettingsIconProps {
  size?: number;
  className?: string;
}

export const SettingsIcon = ({ size = 24, className = '' }: SettingsIconProps) => {
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
        <linearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="50%" stopColor="#9d00ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="settingsGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer gear ring */}
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="url(#settingsGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#settingsGlow)"
      />

      {/* Gear teeth */}
      <rect x="11" y="2" width="2" height="4" fill="url(#settingsGradient)"/>
      <rect x="11" y="18" width="2" height="4" fill="url(#settingsGradient)"/>
      <rect x="2" y="11" width="4" height="2" fill="url(#settingsGradient)"/>
      <rect x="18" y="11" width="4" height="2" fill="url(#settingsGradient)"/>
      <rect x="4.22" y="4.22" width="3" height="2" fill="url(#settingsGradient)" transform="rotate(45 5.72 5.22)"/>
      <rect x="16.78" y="4.22" width="3" height="2" fill="url(#settingsGradient)" transform="rotate(-45 18.28 5.22)"/>
      <rect x="4.22" y="17.78" width="3" height="2" fill="url(#settingsGradient)" transform="rotate(-45 5.72 18.78)"/>
      <rect x="16.78" y="17.78" width="3" height="2" fill="url(#settingsGradient)" transform="rotate(45 18.28 18.78)"/>

      {/* Center circle */}
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="url(#settingsGradient)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Tech dot */}
      <circle cx="12" cy="12" r="1" fill="url(#settingsGradient)"/>
    </svg>
  );
};
