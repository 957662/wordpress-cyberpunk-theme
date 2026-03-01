interface CalendarIconProps {
  size?: number;
  className?: string;
}

export const CalendarIcon = ({ size = 24, className = '' }: CalendarIconProps) => {
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
        <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
        <filter id="calendarGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Calendar body */}
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="url(#calendarGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#calendarGlow)"
      />

      {/* Header bar */}
      <rect x="3" y="5" width="18" height="4" fill="url(#calendarGradient)" opacity="0.2"/>

      {/* Rings */}
      <rect x="7" y="2" width="2" height="4" rx="1" fill="url(#calendarGradient)"/>
      <rect x="15" y="2" width="2" height="4" rx="1" fill="url(#calendarGradient)"/>

      {/* Date dots */}
      <circle cx="8" cy="13" r="1.5" fill="url(#calendarGradient)" opacity="0.8"/>
      <circle cx="12" cy="13" r="1.5" fill="url(#calendarGradient)" opacity="0.6"/>
      <circle cx="16" cy="13" r="1.5" fill="url(#calendarGradient)" opacity="0.4"/>
      <circle cx="8" cy="17" r="1.5" fill="url(#calendarGradient)" opacity="0.5"/>
      <circle cx="12" cy="17" r="1.5" fill="url(#calendarGradient)" opacity="0.7"/>
      <circle cx="16" cy="17" r="1.5" fill="url(#calendarGradient)" opacity="0.3"/>
    </svg>
  );
};
