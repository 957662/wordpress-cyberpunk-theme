import React from 'react';
/**
 * Chevron Left Icon
 */

interface ChevronLeftIconProps {
  size?: number;
  className?: string;
}

export const ChevronLeftIcon = ({ size = 24, className = '' }: ChevronLeftIconProps) => {
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
        d="M 15 18 L 9 12 L 15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default ChevronLeftIcon;
