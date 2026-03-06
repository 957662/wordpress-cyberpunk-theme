'use client';

/**
 * CyberDecorations - 赛博朋克装饰元素集合
 * 包含各种装饰性 SVG 图案和元素
 */

import React from 'react';

interface CyberDecorationsProps {
  className?: string;
}

/**
 * CircuitPattern - 电路板图案装饰
 */
export const CircuitPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="circuitPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          {/* 电路路径 */}
          <path d="M0 25 H15 V10 H25" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" fill="none" />
          <path d="M25 0 V15 H40 V25" stroke="#9d00ff" strokeWidth="0.5" opacity="0.2" fill="none" />
          <path d="M50 25 H35 V40 H25" stroke="#ff0080" strokeWidth="0.5" opacity="0.2" fill="none" />
          <path d="M25 50 V35 H10 V25" stroke="#00f0ff" strokeWidth="0.5" opacity="0.2" fill="none" />

          {/* 电路节点 */}
          <circle cx="15" cy="10" r="1.5" fill="#00f0ff" opacity="0.3" />
          <circle cx="40" cy="25" r="1.5" fill="#9d00ff" opacity="0.3" />
          <circle cx="35" cy="40" r="1.5" fill="#ff0080" opacity="0.3" />
          <circle cx="10" cy="25" r="1.5" fill="#00f0ff" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuitPattern)" />
    </svg>
  );
};

/**
 * HexagonGrid - 六边形网格装饰
 */
export const HexagonGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <path
            d="M30 0 L56 15 L56 45 L30 60 L4 45 L4 15 Z"
            stroke="#00f0ff"
            strokeWidth="0.5"
            opacity="0.15"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  );
};

/**
 * Scanlines - 扫描线效果
 */
export const Scanlines: React.FC<{ className?: string; density?: 'light' | 'medium' | 'heavy' }> = ({
  className = '',
  density = 'medium'
}) => {
  const spacing = density === 'light' ? 4 : density === 'medium' ? 2 : 1;

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`scanlines-${spacing}`}
          x="0"
          y="0"
          width="100%"
          height={spacing * 2}
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y={spacing} width="100%" height={spacing} fill="rgba(0, 240, 255, 0.03)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#scanlines-${spacing})`} />
    </svg>
  );
};

/**
 * GridPattern - 网格图案
 */
export const GridPattern: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 20, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="gridPattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            stroke={color}
            strokeWidth="0.5"
            opacity="0.1"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" />
    </svg>
  );
};

/**
 * NeonFrame - 霓虹边框装饰
 */
export const NeonFrame: React.FC<{
  className?: string;
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
}> = ({ className = '', children, variant = 'cyan' }) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const color = colors[variant];

  return (
    <div className={`relative ${className}`}>
      {/* 边框装饰 */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 左上角 */}
        <path
          d="M0 20 V0 H20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* 右上角 */}
        <path
          d="M180 0 H200 V20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* 左下角 */}
        <path
          d="M0 180 V200 H20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* 右下角 */}
        <path
          d="M180 200 H200 V180"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * TechCorner - 科技角标装饰
 */
export const TechCorner: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
}> = ({ className = '', position = 'top-left', size = 40, color = '#00f0ff' }) => {
  const getPath = () => {
    switch (position) {
      case 'top-left':
        return `M0 ${size * 0.4} V0 H${size * 0.4}`;
      case 'top-right':
        return `M${size} ${size * 0.4} V0 H${size * 0.6}`;
      case 'bottom-left':
        return `M0 ${size * 0.6} V${size} H${size * 0.4}`;
      case 'bottom-right':
        return `M${size} ${size * 0.6} V${size} H${size * 0.6}`;
    }
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={getPath()}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* 内部小角标 */}
      <path
        d={getPath().replace(/0\.\d+/g, (match) => String(Number(match) * 0.6))}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  );
};

/**
 * DataFlowLines - 数据流动线
 */
export const DataFlowLines: React.FC<{
  className?: string;
  count?: number;
  color?: string;
}> = ({ className = '', count = 5, color = '#00f0ff' }) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: count }).map((_, i) => (
        <g key={i}>
          <line
            x1="0"
            y1={(200 / count) * i + 20}
            x2="200"
            y2={(200 / count) * i + 20}
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="100"
            cy={(200 / count) * i + 20}
            r="3"
            fill={color}
            opacity="0.6"
          >
            <animate
              attributeName="cx"
              values="0;200;0"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
};

export default CyberDecorations;
