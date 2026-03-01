import React from 'react';
/**
 * Chevron Right Icon
 */

interface ChevronRightIconProps {
  size?: number;
  className?: string;
}

export const ChevronRightIcon = ({ size = 24, className = '' }: ChevronRightIconProps) => {
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
        d="M 9 18 L 15 12 L 9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default ChevronRightIcon;
