import React from 'react';

interface MoreIconProps {
  size?: number;
  className?: string;
}

export const MoreIcon = ({ size = 24, className = '' }: MoreIconProps) => {
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
        <linearGradient id="moreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="50%" stopColor="#9d00ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
      </defs>

      {/* Three dots */}
      <circle cx="5" cy="12" r="2" fill="url(#moreGradient)"/>
      <circle cx="12" cy="12" r="2" fill="url(#moreGradient)"/>
      <circle cx="19" cy="12" r="2" fill="url(#moreGradient)"/>

      {/* Decorative lines */}
      <line x1="5" y1="6" x2="19" y2="6" stroke="#00f0ff" strokeWidth="1" opacity="0.3" strokeDasharray="2 2"/>
      <line x1="5" y1="18" x2="19" y2="18" stroke="#ff0080" strokeWidth="1" opacity="0.3" strokeDasharray="2 2"/>
    </svg>
  );
};
