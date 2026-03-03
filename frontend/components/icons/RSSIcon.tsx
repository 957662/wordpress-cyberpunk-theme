'use client'

import React from 'react'

interface RSSIconProps {
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

export const RSSIcon: React.FC<RSSIconProps> = ({
  className = '',
  size = 24,
  variant = 'yellow',
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
        <filter id={`rssGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* RSS circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* RSS waves */}
      <path
        d="M6 18c0-3.31 2.69-6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#rssGlow-${variant})`}
      >
        {animated && (
          <animate
            attributeName="stroke-dasharray"
            values="0,20;10,10;0,20"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>

      <path
        d="M6 14c0-5.52 4.48-10 10-10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#rssGlow-${variant})`}
      >
        {animated && (
          <animate
            attributeName="stroke-dasharray"
            values="0,30;15,15;0,30"
            dur="2.5s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Dot */}
      <circle cx="6" cy="18" r="2" fill={color} filter={`url(#rssGlow-${variant})`}/>

      {/* Signal indicators */}
      <circle cx="20" cy="4" r="1" fill={color} opacity="0.6">
        {animated && (
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="4" cy="4" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="20" cy="20" r="0.5" fill={color} opacity="0.4"/>
    </svg>
  )
}

export default RSSIcon
