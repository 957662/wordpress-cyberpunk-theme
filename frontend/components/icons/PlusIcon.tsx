import React from 'react';

interface PlusIconProps {
  size?: number;
  className?: string;
}

export const PlusIcon = ({ size = 24, className = '' }: PlusIconProps) => {
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
        <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88"/>
          <stop offset="100%" stopColor="#00f0ff"/>
        </linearGradient>
      </defs>

      {/* Plus sign */}
      <path
        d="M12 5V19M5 12H19"
        stroke="url(#plusGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Corner decorations */}
      <circle cx="5" cy="5" r="1" fill="#00f0ff" opacity="0.5"/>
      <circle cx="19" cy="5" r="1" fill="#00ff88" opacity="0.5"/>
      <circle cx="5" cy="19" r="1" fill="#00ff88" opacity="0.5"/>
      <circle cx="19" cy="19" r="1" fill="#00f0ff" opacity="0.5"/>
    </svg>
  );
};
