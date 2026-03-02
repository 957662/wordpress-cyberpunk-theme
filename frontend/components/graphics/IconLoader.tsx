'use client';

import React from 'react';

interface IconLoaderProps {
  name: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * 动态SVG图标加载器组件
 *
 * 从public/icons目录加载SVG图标
 *
 * @example
 * <IconLoader name="github" size={24} />
 * <IconLoader name="twitter" size={32} className="text-cyber-cyan" />
 */
export const IconLoader: React.FC<IconLoaderProps> = ({
  name,
  size = 24,
  className = '',
  ariaLabel,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const iconPath = `/icons/${name}.svg`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Icon not found');
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel || name}
    >
      {isLoading && (
        <div
          className="animate-pulse bg-cyber-cyan/20 rounded"
          style={{ width: size, height: size }}
        />
      )}
      {error && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {!error && (
        <img
          src={iconPath}
          alt={ariaLabel || name}
          width={size}
          height={size}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      )}
    </div>
  );
};

export default IconLoader;
