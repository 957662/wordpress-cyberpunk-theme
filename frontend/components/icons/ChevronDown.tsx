/**
 * Chevron Down Icon - 下拉箭头图标
 */

import React from 'react';

interface ChevronDownProps {
  className?: string;
}

export const ChevronDown: React.FC<ChevronDownProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export default ChevronDown;
