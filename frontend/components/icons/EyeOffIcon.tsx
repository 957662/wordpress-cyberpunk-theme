'use client'

import React from 'react'

interface EyeOffIconProps {
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

export const EyeOffIcon: React.FC<EyeOffIconProps> = ({
  className = '',
  size = 24,
  variant = 'pink',
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
        <filter id={`eyeOffGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Eye outer shape (dimmed) */}
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        filter={`url(#eyeOffGlow-${variant})`}
      />

      {/* Pupil (dimmed) */}
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.5"/>

      {/* Slash line */}
      <line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#eyeOffGlow-${variant})`}
      />

      {/* X marks for hidden */}
      <path
        d="M8 8L10 10M10 8L8 10"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 14L16 16M16 14L14 16"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tech accents */}
      <rect x="5" y="11" width="2" height="2" fill={color} opacity="0.3"/>
      <rect x="17" y="11" width="2" height="2" fill={color} opacity="0.3"/>
    </svg>
  )
}

export default EyeOffIcon
