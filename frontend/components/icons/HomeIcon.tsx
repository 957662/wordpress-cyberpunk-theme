'use client'

import React from 'react'

interface HomeIconProps {
  className?: string
  size?: number
}

export const HomeIcon: React.FC<HomeIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="#00f0ff" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline stroke="#9d00ff" points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export default HomeIcon
