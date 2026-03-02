import React from 'react';

/**
 * CyberPattern - 赛博朋克背景图案组件
 * 提供各种可重复使用的背景图案
 */

export interface CyberPatternProps {
  type?: 'grid' | 'dots' | 'hexagons' | 'circuit' | 'matrix' | 'scanlines';
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  opacity?: number;
  size?: number;
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const CyberPattern: React.FC<CyberPatternProps> = ({
  type = 'grid',
  variant = 'cyan',
  opacity = 0.1,
  size = 20,
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];

  const renderGrid = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-grid-${variant}-${size}`}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-grid-${variant}-${size})`} />
    </svg>
  );

  const renderDots = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-dots-${variant}-${size}`}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={size / 2} cy={size / 2} r="1" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-dots-${variant}-${size})`} />
    </svg>
  );

  const renderHexagons = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-hex-${variant}-${size}`}
          x="0"
          y="0"
          width={size * 2}
          height={size * 1.732}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(30)"
        >
          <polygon
            points={`${size} 0, ${size * 1.5} ${size * 0.866}, ${size} ${size * 1.732}, ${size * 0.5} ${size * 0.866}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-hex-${variant}-${size})`} />
    </svg>
  );

  const renderCircuit = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-circuit-${variant}-${size}`}
          x="0"
          y="0"
          width={size * 3}
          height={size * 3}
          patternUnits="userSpaceOnUse"
        >
          {/* Circuit lines */}
          <path
            d={`M ${size} ${size} L ${size} 0 L ${size * 2} 0`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.8}
          />
          <path
            d={`M ${size} ${size} L 0 ${size} L 0 ${size * 2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.8}
          />
          <path
            d={`M ${size} ${size} L ${size * 3} ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.8}
          />
          <path
            d={`M ${size} ${size} L ${size} ${size * 3}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.8}
          />
          {/* Nodes */}
          <circle cx={size} cy={size} r="2" fill={color} opacity={opacity} />
          <circle cx={size * 2} cy={size} r="1.5" fill={color} opacity={opacity * 0.6} />
          <circle cx={size} cy={size * 2} r="1.5" fill={color} opacity={opacity * 0.6} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-circuit-${variant}-${size})`} />
    </svg>
  );

  const renderMatrix = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-matrix-${variant}-${size}`}
          x="0"
          y="0"
          width={size}
          height={size * 1.5}
          patternUnits="userSpaceOnUse"
        >
          {/* Matrix characters (simplified) */}
          <text
            x={size / 2}
            y={size * 1.2}
            fontSize={size * 0.8}
            fill={color}
            opacity={opacity}
            textAnchor="middle"
            fontFamily="monospace"
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-matrix-${variant}-${size})`} />
    </svg>
  );

  const renderScanlines = () => (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern
          id={`cyber-scanlines-${variant}-${size}`}
          x="0"
          y="0"
          width="100%"
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1={size / 2}
            x2="100%"
            y2={size / 2}
            stroke={color}
            strokeWidth="1"
            opacity={opacity * 0.5}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cyber-scanlines-${variant}-${size})`} />
    </svg>
  );

  switch (type) {
    case 'grid':
      return renderGrid();
    case 'dots':
      return renderDots();
    case 'hexagons':
      return renderHexagons();
    case 'circuit':
      return renderCircuit();
    case 'matrix':
      return renderMatrix();
    case 'scanlines':
      return renderScanlines();
    default:
      return renderGrid();
  }
};

export default CyberPattern;
