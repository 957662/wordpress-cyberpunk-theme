import React from 'react';
interface PortfolioIconProps {
  size?: number;
  className?: string;
}

export const PortfolioIcon = ({ size = 24, className = '' }: PortfolioIconProps) => {
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
        <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9d00ff"/>
          <stop offset="100%" stopColor="#ff0080"/>
        </linearGradient>
        <filter id="portfolioGlow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Folder shape */}
      <path
        d="M 2 6 L 2 18 C 2 19.1 2.9 20 4 20 L 20 20 C 21.1 20 22 19.1 22 18 L 22 8 C 22 6.9 21.1 6 20 6 L 12 6 L 10 4 L 4 4 C 2.9 4 2 4.9 2 6 Z"
        stroke="url(#portfolioGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#portfolioGlow)"
      />

      {/* Internal items */}
      <rect x="6" y="10" width="4" height="4" rx="0.5" fill="url(#portfolioGradient)" opacity="0.8"/>
      <rect x="11" y="10" width="7" height="1" rx="0.5" fill="url(#portfolioGradient)" opacity="0.5"/>
      <rect x="11" y="12" width="7" height="1" rx="0.5" fill="url(#portfolioGradient)" opacity="0.5"/>
      <rect x="11" y="14" width="5" height="1" rx="0.5" fill="url(#portfolioGradient)" opacity="0.5"/>

      {/* Tech circuit */}
      <line x1="2" y1="18" x2="0" y2="20" stroke="#9d00ff" strokeWidth="1" opacity="0.3"/>
      <line x1="22" y1="18" x2="24" y2="20" stroke="#ff0080" strokeWidth="1" opacity="0.3"/>
      <circle cx="0" cy="20" r="1" fill="#9d00ff" opacity="0.5"/>
      <circle cx="24" cy="20" r="1" fill="#ff0080" opacity="0.5"/>
    </svg>
  );
};
