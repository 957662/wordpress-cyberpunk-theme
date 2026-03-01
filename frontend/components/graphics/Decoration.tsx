/**
 * CyberPress Decoration Component
 *
 * 装饰元素组件
 *
 * @example
 * ```tsx
 * <Decoration type="corner-bracket" position="top-left" />
 * <Decoration type="divider" />
 * <Decoration type="loader" />
 * ```
 */

import React from 'react';
import Image from 'next/image';

export interface DecorationProps {
  /** 装饰类型 */
  type: 'corner-bracket' | 'divider' | 'loader';
  /** 位置 (用于 corner-bracket) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
}

export const Decoration: React.FC<DecorationProps> = ({
  type,
  position = 'top-left',
  className = '',
  width,
  height
}) => {
  const decorationMap = {
    'corner-bracket': '/decorations/corner-bracket.svg',
    'divider': '/decorations/divider-line.svg',
    'loader': '/decorations/loader-ring.svg'
  };

  const defaultSizes = {
    'corner-bracket': { width: 100, height: 100 },
    'divider': { width: 400, height: 20 },
    'loader': { width: 80, height: 80 }
  };

  const size = defaultSizes[type];

  const positionClasses: Record<string, string> = {
    'top-left': 'absolute top-0 left-0',
    'top-right': 'absolute top-0 right-0 rotate-90',
    'bottom-left': 'absolute bottom-0 left-0 -rotate-90',
    'bottom-right': 'absolute bottom-0 right-0 rotate-180'
  };

  const combinedClassName = type === 'corner-bracket'
    ? `${positionClasses[position]} ${className}`.trim()
    : className;

  if (type === 'loader') {
    return (
      <div className={`inline-block ${className}`}>
        <Image
          src={decorationMap[type]}
          alt="Loading..."
          width={width || size.width}
          height={height || size.height}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <Image
      src={decorationMap[type]}
      alt={type}
      width={width || size.width}
      height={height || size.height}
      className={combinedClassName}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default Decoration;
