import React from 'react';

interface GitMergeIconProps {
  size?: number;
  className?: string;
}

export const GitMergeIcon = ({ size = 24, className = '' }: GitMergeIconProps) => {
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
        <linearGradient id="gitMergeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff"/>
          <stop offset="100%" stopColor="#9d00ff"/>
        </linearGradient>
      </defs>

      {/* Merge lines */}
      <path
        d="M8 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-2-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        stroke="url(#gitMergeGradient)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="8" cy="5" r="2" stroke="url(#gitMergeGradient)" strokeWidth="2" fill="none"/>
      <path
        d="M8 5v14a4 4 0 0 0 4 4h2"
        stroke="url(#gitMergeGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
