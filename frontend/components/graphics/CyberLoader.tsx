import React from 'react';

/**
 * CyberLoader - 赛博朋克加载器组件
 * 提供各种风格的加载动画
 */

export interface CyberLoaderProps {
  type?: 'spinner' | 'pulse' | 'dots' | 'bars' | 'hexagon' | 'circuit';
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: number;
  className?: string;
  text?: string;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const CyberLoader: React.FC<CyberLoaderProps> = ({
  type = 'spinner',
  variant = 'cyan',
  size = 48,
  className = '',
  text,
}) => {
  const color = colorMap[variant];

  const renderSpinner = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} animate-spin`}
      style={{ animationDuration: '1s' }}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M24 4 A20 20 0 0 1 44 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="44" cy="24" r="2" fill={color} />
    </svg>
  );

  const renderPulse = () => (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className="animate-pulse"
      >
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.3" />
        <circle cx="24" cy="24" r="10" fill={color} opacity="0.6" />
        <circle cx="24" cy="24" r="4" fill={color} />
      </svg>
    </div>
  );

  const renderDots = () => (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width={size / 4}
          height={size / 4}
          viewBox="0 0 12 12"
          className="animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <circle cx="6" cy="6" r="4" fill={color} />
        </svg>
      ))}
    </div>
  );

  const renderBars = () => (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            width: size / 10,
            height: size,
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderHexagon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} animate-spin`}
      style={{ animationDuration: '2s' }}
    >
      <polygon
        points="24,4 44,14 44,34 24,44 4,34 4,14"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.3"
      />
      <polygon
        points="24,10 38,18 38,30 24,38 10,30 10,18"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.6"
      />
      <polygon
        points="24,16 32,21 32,27 24,32 16,27 16,21"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );

  const renderCircuit = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
    >
      {/* Circuit paths with animation */}
      <circle cx="24" cy="24" r="4" fill={color} className="animate-pulse" />
      <path
        d="M24 20 L24 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
        style={{ animationDelay: '0s' }}
      />
      <path
        d="M24 28 L24 40"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <path
        d="M20 24 L8 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
        style={{ animationDelay: '0.25s' }}
      />
      <path
        d="M28 24 L40 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
        style={{ animationDelay: '0.75s' }}
      />
      {/* Corner nodes */}
      <circle cx="24" cy="8" r="2" fill={color} opacity="0.6" className="animate-pulse" />
      <circle cx="24" cy="40" r="2" fill={color} opacity="0.6" className="animate-pulse" />
      <circle cx="8" cy="24" r="2" fill={color} opacity="0.6" className="animate-pulse" />
      <circle cx="40" cy="24" r="2" fill={color} opacity="0.6" className="animate-pulse" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {(() => {
        switch (type) {
          case 'spinner':
            return renderSpinner();
          case 'pulse':
            return renderPulse();
          case 'dots':
            return renderDots();
          case 'bars':
            return renderBars();
          case 'hexagon':
            return renderHexagon();
          case 'circuit':
            return renderCircuit();
          default:
            return renderSpinner();
        }
      })()}
      {text && (
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default CyberLoader;
