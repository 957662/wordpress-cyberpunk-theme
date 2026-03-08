/**
 * AdaptiveIcon - 自适应图标
 * 根据容器大小自动调整的图标
 */

import React, { useRef, useEffect, useState } from 'react';
import { IconProps } from '../types';

export interface AdaptiveIconProps extends IconProps {
  /**
   * 最小尺寸
   * @default 16
   */
  minSize?: number;

  /**
   * 最大尺寸
   * @default 48
   */
  maxSize?: number;

  /**
   * 容器宽度比例
   * @default 0.8
   */
  containerRatio?: number;
}

export const AdaptiveIcon: React.FC<AdaptiveIconProps> = ({
  minSize = 16,
  maxSize = 48,
  containerRatio = 0.8,
  className = '',
  color,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iconSize, setIconSize] = useState(24);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newSize = Math.min(
          maxSize,
          Math.max(minSize, containerWidth * containerRatio)
        );
        setIconSize(newSize);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [minSize, maxSize, containerRatio]);

  return (
    <div ref={containerRef} className={className} {...props}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
      >
        {children}
      </svg>
    </div>
  );
};

export default AdaptiveIcon;
