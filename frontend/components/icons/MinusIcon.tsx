import React from 'react';

interface MinusIconProps {
  size?: number;
  className?: string;
}

export const MinusIcon = ({ size = 24, className = '' }: MinusIconProps) => {
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
        <linearGradient id="minusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0080"/>
          <stop offset="100%" stopColor="#ff6600"/>
        </linearGradient>
      </defs>

      {/* Minus sign */}
      <path
        d="M5 12H19"
        stroke="url(#minusGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
