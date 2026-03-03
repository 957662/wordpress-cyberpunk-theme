'use client'

import React from 'react'

interface LockIconProps {
  className?: string
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green'
  animated?: boolean
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
}

export const LockIcon: React.FC<LockIconProps> = ({
  className = '',
  size = 24,
  variant = 'cyan',
  animated = false,
}) => {
  const color = colorMap[variant]
  const animationClass = animated ? 'animate-pulse' : ''

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`lockGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Lock body */}
      <rect
        x="6"
        y="11"
        width="12"
        height="10"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#lockGlow-${variant})`}
      />

      {/* Shackle */}
      <path
        d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#lockGlow-${variant})`}
      />

      {/* Key hole */}
      <circle cx="12" cy="16" r="1.5" fill={color} opacity="0.8"/>
      <path
        d="M12 17.5V19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Tech accents */}
      <rect x="7" y="12" width="2" height="2" fill={color} opacity="0.3"/>
      <rect x="15" y="12" width="2" height="2" fill={color} opacity="0.3"/>
    </svg>
  )
}

export default LockIcon
