'use client'

import React from 'react'

interface EyeIconProps {
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

export const EyeIcon: React.FC<EyeIconProps> = ({
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
        <filter id={`eyeGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id={`eyeGradient-${variant}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
        </radialGradient>
      </defs>

      {/* Eye outer shape */}
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#eyeGlow-${variant})`}
      />

      {/* Pupil */}
      <circle cx="12" cy="12" r="3" fill={color} filter={`url(#eyeGlow-${variant})`}>
        {animated && (
          <animate
            attributeName="r"
            values="3;3.5;3"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Iris detail */}
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>

      {/* Highlight */}
      <circle cx="13" cy="11" r="1" fill="white" opacity="0.8"/>

      {/* Tech accents */}
      <circle cx="4" cy="8" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="20" cy="8" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="4" cy="16" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="20" cy="16" r="0.5" fill={color} opacity="0.4"/>
    </svg>
  )
}

export default EyeIcon
