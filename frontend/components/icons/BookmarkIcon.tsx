'use client'

import React from 'react'

interface BookmarkIconProps {
  className?: string
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green'
  animated?: boolean
  filled?: boolean
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  className = '',
  size = 24,
  variant = 'purple',
  animated = false,
  filled = false,
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
        <filter id={`bookmarkGlow-${variant}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`bookmarkGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.8"/>
        </linearGradient>
      </defs>

      {/* Bookmark body */}
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? `url(#bookmarkGradient-${variant})` : 'none'}
        filter={`url(#bookmarkGlow-${variant})`}
      />

      {/* Inner detail lines */}
      {!filled && (
        <>
          <line x1="9" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1" opacity="0.6"/>
          <line x1="9" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1" opacity="0.6"/>
        </>
      )}

      {/* Star accent */}
      {filled && (
        <path
          d="M12 6l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"
          fill={color}
          opacity="0.8"
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>
      )}

      {/* Tech accents */}
      <circle cx="6" cy="5" r="1" fill={color} opacity="0.4"/>
      <circle cx="18" cy="5" r="1" fill={color} opacity="0.4"/>
    </svg>
  )
}

export default BookmarkIcon
