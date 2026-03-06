import React from 'react';

interface GitIconProps {
  size?: number;
  className?: string;
}

export const GitIcon = ({ size = 24, className = '' }: GitIconProps) => {
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
        <linearGradient id="gitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
      </defs>

      {/* Git branch structure */}
      <circle cx="6" cy="6" r="2" stroke="url(#gitGradient)" strokeWidth="2" fill="none"/>
      <circle cx="6" cy="18" r="2" stroke="url(#gitGradient)" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="12" r="2" stroke="url(#gitGradient)" strokeWidth="2" fill="none"/>

      {/* Branch lines */}
      <path
        d="M6 8v8M6 6h12a2 2 0 0 1 2 2v2M6 18h12a2 2 0 0 0 2-2v-2"
        stroke="url(#gitGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Connection nodes */}
      <circle cx="6" cy="6" r="1" fill="#ff0080"/>
      <circle cx="6" cy="18" r="1" fill="#9d00ff"/>
      <circle cx="18" cy="12" r="1" fill="#00f0ff"/>
    </svg>
  );
};
