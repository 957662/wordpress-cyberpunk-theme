import React from 'react';
/**
 * Chevron Down Icon
 */

interface ChevronDownIconProps {
  size?: number;
  className?: string;
}

export const ChevronDownIcon = ({ size = 24, className = '' }: ChevronDownIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 6 9 L 12 15 L 18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default ChevronDownIcon;
