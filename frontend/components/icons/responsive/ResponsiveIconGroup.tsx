/**
 * ResponsiveIconGroup - 响应式图标组
 * 一组协同响应的图标
 */

import React from 'react';

export interface IconItem {
  icon: React.ReactNode;
  label?: string;
}

export interface ResponsiveIconGroupProps {
  /**
   * 图标数组
   */
  icons: IconItem[];

  /**
   * 间距
   * @default 'medium'
   */
  gap?: 'small' | 'medium' | 'large';

  /**
   * 对齐方式
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * 移动端列数
   * @default 2
   */
  colsMobile?: number;

  /**
   * 桌面端列数
   * @default 4
   */
  colsDesktop?: number;

  /**
   * 自定义类名
   */
  className?: string;
}

export const ResponsiveIconGroup: React.FC<ResponsiveIconGroupProps> = ({
  icons,
  gap = 'medium',
  align = 'center',
  colsMobile = 2,
  colsDesktop = 4,
  className = '',
}) => {
  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }[align];

  return (
    <div
      className={`grid grid-cols-${colsMobile} md:grid-cols-${colsDesktop} ${gapClass} ${alignClass} ${className}`.trim()}
    >
      {icons.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-cyber-card/50 transition-colors"
        >
          <div className="transform hover:scale-110 transition-transform">
            {item.icon}
          </div>
          {item.label && (
            <span className="text-xs text-cyber-gray-400">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveIconGroup;
