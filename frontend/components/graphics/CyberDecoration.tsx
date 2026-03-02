import React from 'react';

/**
 * CyberDecoration - 赛博朋克装饰组件
 * 提供各种装饰性SVG元素
 */

export interface CyberDecorationProps {
  type?: 'corner' | 'divider' | 'frame' | 'grid' | 'circuit';
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
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

export const CyberDecoration: React.FC<CyberDecorationProps> = ({
  type = 'corner',
  variant = 'cyan',
  size = 100,
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  const renderCorner = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Outer corner */}
      <path d="M10 10 L90 10" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M10 10 L10 90" stroke={color} strokeWidth="2" opacity="0.8"/>

      {/* Inner corner */}
      <path d="M20 20 L70 20" stroke={color} strokeWidth="1" opacity="0.5"/>
      <path d="M20 20 L20 70" stroke={color} strokeWidth="1" opacity="0.5"/>

      {/* Corner dots */}
      <circle cx="10" cy="10" r="3" fill={color}/>
      <circle cx="20" cy="20" r="2" fill={color} opacity="0.6"/>

      {/* Decorative lines */}
      <path d="M30 10 L30 15" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M50 10 L50 15" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M70 10 L70 15" stroke={color} strokeWidth="1" opacity="0.4"/>

      <path d="M10 30 L15 30" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M10 50 L15 50" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M10 70 L15 70" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  );

  const renderDivider = () => (
    <svg
      width="100%"
      height="20"
      viewBox="0 0 400 20"
      fill="none"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Main line */}
      <line x1="0" y1="10" x2="400" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>

      {/* Center element */}
      <rect x="190" y="5" width="20" height="10" fill={color} opacity="0.8"/>
      <rect x="195" y="7" width="10" height="6" fill="#0a0a0f"/>

      {/* Side decorations */}
      <path d="M100 10 L120 5 L120 15 Z" fill={color} opacity="0.4"/>
      <path d="M300 10 L280 5 L280 15 Z" fill={color} opacity="0.4"/>

      {/* Dots */}
      <circle cx="50" cy="10" r="2" fill={color} opacity="0.6"/>
      <circle cx="350" cy="10" r="2" fill={color} opacity="0.6"/>
    </svg>
  );

  const renderFrame = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Outer frame */}
      <rect x="5" y="5" width="90" height="90" stroke={color} strokeWidth="2" fill="none" opacity="0.8"/>

      {/* Inner frame */}
      <rect x="15" y="15" width="70" height="70" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>

      {/* Corner accents */}
      <circle cx="5" cy="5" r="3" fill={color}/>
      <circle cx="95" cy="5" r="3" fill={color}/>
      <circle cx="95" cy="95" r="3" fill={color}/>
      <circle cx="5" cy="95" r="3" fill={color}/>

      {/* Center decoration */}
      <rect x="40" y="40" width="20" height="20" fill={color} opacity="0.3"/>
      <rect x="45" y="45" width="10" height="10" fill={color} opacity="0.6"/>
    </svg>
  );

  const renderGrid = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Vertical lines */}
      <line x1="20" y1="0" x2="20" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="40" y1="0" x2="40" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="60" y1="0" x2="60" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="80" y1="0" x2="80" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3"/>

      {/* Horizontal lines */}
      <line x1="0" y1="20" x2="100" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="0" y1="40" x2="100" y2="40" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="0" y1="60" x2="100" y2="60" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      <line x1="0" y1="80" x2="100" y2="80" stroke={color} strokeWidth="0.5" opacity="0.3"/>

      {/* Grid dots */}
      <circle cx="20" cy="20" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="40" cy="40" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="60" cy="60" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="80" cy="80" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  );

  const renderCircuit = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`${className} ${animationClass}`}
    >
      {/* Circuit paths */}
      <path d="M10 50 L30 50 L30 30 L50 30" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M90 50 L70 50 L70 70 L50 70" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M50 10 L50 25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M50 90 L50 75" stroke={color} strokeWidth="2" strokeLinecap="round"/>

      {/* Circuit nodes */}
      <circle cx="30" cy="50" r="4" fill={color}/>
      <circle cx="70" cy="50" r="4" fill={color}/>
      <circle cx="50" cy="30" r="4" fill={color}/>
      <circle cx="50" cy="70" r="4" fill={color}/>
      <circle cx="50" cy="50" r="6" fill={color} opacity="0.5"/>

      {/* Node details */}
      <circle cx="30" cy="50" r="2" fill="#0a0a0f"/>
      <circle cx="70" cy="50" r="2" fill="#0a0a0f"/>
      <circle cx="50" cy="30" r="2" fill="#0a0a0f"/>
      <circle cx="50" cy="70" r="2" fill="#0a0a0f"/>
    </svg>
  );

  switch (type) {
    case 'corner':
      return renderCorner();
    case 'divider':
      return renderDivider();
    case 'frame':
      return renderFrame();
    case 'grid':
      return renderGrid();
    case 'circuit':
      return renderCircuit();
    default:
      return renderCorner();
  }
};

export default CyberDecoration;
