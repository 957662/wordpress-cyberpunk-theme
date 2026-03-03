'use client'

import React from 'react'

/**
 * CyberPress Decorative Icons
 * 赛博朋克风格装饰图标组件
 */

// ============================================
// 装饰性边框图标
// ============================================

interface CornerBracketProps {
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const CornerBracket: React.FC<CornerBracketProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  position = 'top-left'
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  const rotations = {
    'top-left': '0',
    'top-right': '90',
    'bottom-right': '180',
    'bottom-left': '270',
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      <defs>
        <filter id={`cornerGlow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main bracket */}
      <path
        d="M4 4V20C4 22.2091 5.79086 24 8 24H24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#cornerGlow-${variant})`}
      />

      {/* Tech accents */}
      <rect x="2" y="2" width="4" height="4" fill={color} opacity="0.8"/>
      <circle cx="26" cy="26" r="1.5" fill={color} opacity="0.6"/>
      <rect x="8" y="28" width="2" height="2" fill={color} opacity="0.4"/>
    </svg>
  )
}

// ============================================
// 分割线图标
// ============================================

interface DividerLineProps {
  width?: number
  height?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  style?: 'solid' | 'dashed' | 'gradient'
}

export const DividerLine: React.FC<DividerLineProps> = ({
  width = 200,
  height = 2,
  variant = 'cyan',
  className = '',
  style = 'gradient'
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  const strokeDasharray = style === 'dashed' ? '8 4' : 'none'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        {style === 'gradient' && (
          <linearGradient id={`dividerGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0"/>
            <stop offset="50%" stopColor={color} stopOpacity="1"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        )}
      </defs>

      <line
        x1="0"
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke={style === 'gradient' ? `url(#dividerGradient-${variant})` : color}
        strokeWidth="2"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />

      {/* Tech dots */}
      {style !== 'dashed' && (
        <>
          <circle cx="width / 2" cy={height / 2} r="3" fill={color} opacity="0.8"/>
          <circle cx="10" cy={height / 2} r="1.5" fill={color} opacity="0.4"/>
          <circle cx={width - 10} cy={height / 2} r="1.5" fill={color} opacity="0.4"/>
        </>
      )}
    </svg>
  )
}

// ============================================
// 加载环图标
// ============================================

interface LoaderRingProps {
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  spinning?: boolean
}

export const LoaderRing: React.FC<LoaderRingProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  spinning = true
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`loaderGlow-${variant}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background ring */}
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.2"
      />

      {/* Animated ring */}
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="85 20"
        filter={`url(#loaderGlow-${variant})`}
        style={{
          transformOrigin: 'center',
          animation: spinning ? 'spin 1s linear infinite' : 'none',
        }}
      />

      {/* Center dot */}
      <circle cx="24" cy="24" r="3" fill={color} opacity="0.8">
        {spinning && (
          <animate
            attributeName="opacity"
            values="0.8;0.4;0.8"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  )
}

// ============================================
// 芯片装饰图标
// ============================================

interface ChipDecorProps {
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  animated?: boolean
}

export const ChipDecor: React.FC<ChipDecorProps> = ({
  size = 64,
  variant = 'cyan',
  className = '',
  animated = false
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`chipGlow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer square */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={`url(#chipGlow-${variant})`}
      />

      {/* Inner square */}
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />

      {/* Center chip */}
      <rect
        x="24"
        y="24"
        width="16"
        height="16"
        fill={color}
        opacity="0.3"
      >
        {animated && (
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      {/* Circuit lines */}
      <line x1="12" y1="20" x2="20" y2="20" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="12" y1="32" x2="20" y2="32" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="12" y1="44" x2="20" y2="44" stroke={color} strokeWidth="1" opacity="0.4"/>

      <line x1="44" y1="20" x2="52" y2="20" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="44" y1="32" x2="52" y2="32" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="44" y1="44" x2="52" y2="44" stroke={color} strokeWidth="1" opacity="0.4"/>

      <line x1="20" y1="12" x2="20" y2="16" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="32" y1="12" x2="32" y2="16" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="44" y1="12" x2="44" y2="16" stroke={color} strokeWidth="1" opacity="0.4"/>

      <line x1="20" y1="48" x2="20" y2="52" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="32" y1="48" x2="32" y2="52" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="44" y1="48" x2="44" y2="52" stroke={color} strokeWidth="1" opacity="0.4"/>

      {/* Corner dots */}
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="52" cy="12" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="12" cy="52" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="52" cy="52" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  )
}

// ============================================
// 数据流装饰图标
// ============================================

interface DataFlowProps {
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  animated?: boolean
}

export const DataFlow: React.FC<DataFlowProps> = ({
  size = 80,
  variant = 'cyan',
  className = '',
  animated = true
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`dataFlowGlow-${variant}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`dataFlowGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0"/>
          <stop offset="50%" stopColor={color} stopOpacity="1"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Flow lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path
            d={`M0 ${15 + i * 12} L80 ${15 + i * 12}`}
            stroke={`url(#dataFlowGradient-${variant})`}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
            filter={`url(#dataFlowGlow-${variant})`}
          >
            {animated && (
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur={`${1 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Data packets */}
          <circle
            cx="40"
            cy={15 + i * 12}
            r="2"
            fill={color}
            opacity="0.8"
          >
            {animated && (
              <animate
                attributeName="cx"
                values="0;40;80"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      ))}

      {/* Side nodes */}
      <circle cx="5" cy="15" r="3" fill={color} opacity="0.4"/>
      <circle cx="5" cy="39" r="3" fill={color} opacity="0.4"/>
      <circle cx="5" cy="63" r="3" fill={color} opacity="0.4"/>

      <circle cx="75" cy="27" r="3" fill={color} opacity="0.4"/>
      <circle cx="75" cy="51" r="3" fill={color} opacity="0.4"/>
    </svg>
  )
}

// ============================================
// 网格装饰图标
// ============================================

interface GridDecorProps {
  size?: number
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow'
  className?: string
  perspective?: boolean
}

export const GridDecor: React.FC<GridDecorProps> = ({
  size = 100,
  variant = 'cyan',
  className = '',
  perspective = false
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
  const color = colorMap[variant]

  const gridSize = 10
  const cellSize = size / gridSize

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`gridPattern-${variant}`}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={cellSize}
            height={cellSize}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.2"
          />
        </pattern>
      </defs>

      {/* Grid background */}
      <rect
        width={size}
        height={size}
        fill={`url(#gridPattern-${variant})`}
      />

      {/* Highlight intersections */}
      {Array.from({ length: gridSize + 1 }).map((_, i) =>
        Array.from({ length: gridSize + 1 }).map((_, j) => {
          const x = i * cellSize
          const y = j * cellSize
          const shouldHighlight = (i + j) % 3 === 0

          return shouldHighlight ? (
            <circle
              key={`${i}-${j}`}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              opacity="0.4"
            />
          ) : null
        })
      )}

      {/* Corner accents */}
      <rect x="0" y="0" width={cellSize * 2} height={cellSize * 2} fill={color} opacity="0.1"/>
      <rect
        x={size - cellSize * 2}
        y={size - cellSize * 2}
        width={cellSize * 2}
        height={cellSize * 2}
        fill={color}
        opacity="0.1"
      />
    </svg>
  )
}

// Export all decorative icons
export default {
  CornerBracket,
  DividerLine,
  LoaderRing,
  ChipDecor,
  DataFlow,
  GridDecor,
}
