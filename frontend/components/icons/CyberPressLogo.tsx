'use client'

import React from 'react'

/**
 * CyberPress 内联 SVG Logo 组件
 * 可以直接在 React 中使用，无需外部 SVG 文件
 */

interface CyberPressLogoProps {
  width?: number
  height?: number
  variant?: 'full' | 'icon' | 'compact'
  className?: string
  animated?: boolean
}

export const CyberPressLogo: React.FC<CyberPressLogoProps> = ({
  width = 400,
  height = 120,
  variant = 'full',
  className = '',
  animated = false
}) => {
  // 图标单独部分
  const iconOnly = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="50%" stop-color="#9d00ff"/>
          <stop offset="100%" stop-color="#ff0080"/>
        </linearGradient>
      </defs>

      {/* 外圈六边形 */}
      <polygon
        points="50,5 92,27 92,73 50,95 8,73 8,27"
        fill="none"
        stroke="url(#mainGradient)"
        strokeWidth="3"
        filter="url(#cyanGlow)"
        opacity="0.9"
      />

      {/* 内圈六边形 */}
      <polygon
        points="50,20 78,34 78,66 50,80 22,66 22,34"
        fill="none"
        stroke="#9d00ff"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* 中心芯片 */}
      <rect
        x="35"
        y="35"
        width="30"
        height="30"
        rx="4"
        fill="url(#mainGradient)"
        filter="url(#cyanGlow)"
      >
        {animated && (
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      {/* 芯片电路 */}
      <line x1="50" y1="20" x2="50" y2="35" stroke="#00f0ff" strokeWidth="2"/>
      <line x1="50" y1="65" x2="50" y2="80" stroke="#00f0ff" strokeWidth="2"/>
      <line x1="22" y1="50" x2="35" y2="50" stroke="#00f0ff" strokeWidth="2"/>
      <line x1="65" y1="50" x2="78" y2="50" stroke="#00f0ff" strokeWidth="2"/>

      {/* 科技点 */}
      <circle cx="8" cy="27" r="2.5" fill="#00f0ff" opacity="0.7"/>
      <circle cx="92" cy="27" r="2.5" fill="#ff0080" opacity="0.7"/>
      <circle cx="8" cy="73" r="2.5" fill="#ff0080" opacity="0.7"/>
      <circle cx="92" cy="73" r="2.5" fill="#00f0ff" opacity="0.7"/>

      {/* 中心文字 C */}
      <text
        x="50"
        y="60"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="#0a0a0f"
        textAnchor="middle"
      >
        C
      </text>
    </svg>
  )

  // 完整 Logo
  const fullLogo = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="50%" stop-color="#9d00ff"/>
          <stop offset="100%" stop-color="#ff0080"/>
        </linearGradient>

        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="50%" stop-color="#9d00ff"/>
          <stop offset="100%" stop-color="#00f0ff"/>
        </linearGradient>
      </defs>

      {/* 左侧图标 */}
      <g transform="translate(20, 20)">
        <polygon
          points="40,0 77,20 77,60 40,80 3,60 3,20"
          fill="none"
          stroke="url(#mainGradient)"
          strokeWidth="3"
          filter="url(#cyanGlow)"
          opacity="0.8"
        />

        <polygon
          points="40,15 67,30 67,50 40,65 13,50 13,30"
          fill="none"
          stroke="#9d00ff"
          strokeWidth="2"
          opacity="0.5"
        />

        <rect
          x="28"
          y="28"
          width="24"
          height="24"
          rx="3"
          fill="url(#mainGradient)"
          filter="url(#cyanGlow)"
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.7;1"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </rect>

        <line x1="40" y1="15" x2="40" y2="28" stroke="#00f0ff" strokeWidth="2"/>
        <line x1="40" y1="52" x2="40" y2="65" stroke="#00f0ff" strokeWidth="2"/>
        <line x1="13" y1="40" x2="28" y2="40" stroke="#00f0ff" strokeWidth="2"/>
        <line x1="52" y1="40" x2="67" y2="40" stroke="#00f0ff" strokeWidth="2"/>

        <circle cx="3" cy="20" r="2" fill="#00f0ff" opacity="0.6"/>
        <circle cx="77" cy="20" r="2" fill="#ff0080" opacity="0.6"/>
        <circle cx="3" cy="60" r="2" fill="#ff0080" opacity="0.6"/>
        <circle cx="77" cy="60" r="2" fill="#00f0ff" opacity="0.6"/>
      </g>

      {/* 右侧文字 */}
      <g transform="translate(120, 0)">
        <text
          x="0"
          y="60"
          fontFamily="'Orbitron', 'Arial Black', sans-serif"
          fontSize="42"
          fontWeight="900"
          fill="url(#textGradient)"
          filter="url(#cyanGlow)"
          letterSpacing="4"
        >
          CYBERPRESS
        </text>

        <text
          x="2"
          y="88"
          fontFamily="'Orbitron', Arial, sans-serif"
          fontSize="16"
          fontWeight="600"
          fill="#9d00ff"
          letterSpacing="8"
          opacity="0.8"
        >
          PLATFORM
        </text>

        <line
          x1="0"
          y1="100"
          x2="270"
          y2="100"
          stroke="url(#mainGradient)"
          strokeWidth="2"
          opacity="0.6"
        />

        <circle cx="0" cy="100" r="2" fill="#00f0ff"/>
        <circle cx="135" cy="100" r="2" fill="#9d00ff"/>
        <circle cx="270" cy="100" r="2" fill="#ff0080"/>
      </g>
    </svg>
  )

  // 紧凑版本
  const compactLogo = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#9d00ff"/>
        </linearGradient>
      </defs>

      {/* 小图标 */}
      <g transform="translate(5, 5)">
        <polygon
          points="25,0 46,12 46,38 25,50 4,38 4,12"
          fill="none"
          stroke="url(#mainGradient)"
          strokeWidth="2"
          filter="url(#cyanGlow)"
        />

        <rect
          x="17"
          y="17"
          width="16"
          height="16"
          rx="2"
          fill="url(#mainGradient)"
        />

        <line x1="25" y1="12" x2="25" y2="17" stroke="#00f0ff" strokeWidth="1.5"/>
        <line x1="25" y1="33" x2="25" y2="38" stroke="#00f0ff" strokeWidth="1.5"/>
      </g>

      {/* 文字 */}
      <text
        x="65"
        y="38"
        fontFamily="'Orbitron', Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="url(#mainGradient)"
        filter="url(#cyanGlow)"
        letterSpacing="2"
      >
        CyberPress
      </text>
    </svg>
  )

  // 根据变体返回不同的 Logo
  if (variant === 'icon') {
    return iconOnly
  }

  if (variant === 'compact') {
    return compactLogo
  }

  return fullLogo
}

export default CyberPressLogo
