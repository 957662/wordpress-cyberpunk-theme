import React from 'react';
/**
 * Chevron Up Icon
 */

interface ChevronUpIconProps {
  size?: number;
  className?: string;
}

export const ChevronUpIcon = ({ size = 24, className = '' }: ChevronUpIconProps) => {
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
        d="M 6 15 L 12 9 L 18 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default ChevronUpIcon;
