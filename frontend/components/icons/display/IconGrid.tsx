/**
 * IconGrid - 图标网格展示组件
 * 以网格形式展示图标集合
 */

import React from 'react';

export interface IconGridProps {
  /**
   * 图标数组
   */
  icons: React.ReactNode[];

  /**
   * 每行列数
   * @default 4
   */
  columns?: number;

  /**
   * 间距
   * @default 'medium'
   */
  gap?: 'small' | 'medium' | 'large';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否显示标签
   * @default false
   */
  showLabels?: boolean;

  /**
   * 标签数组
   */
  labels?: string[];
}

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  columns = 4,
  gap = 'medium',
  className = '',
  showLabels = false,
  labels = [],
}) => {
  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap];

  const gridClass = `grid grid-cols-${columns} ${gapClass} ${className}`.trim();

  return (
    <div className={gridClass}>
      {icons.map((icon, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-cyber-card/50 transition-colors group"
        >
          <div className="transform group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          {showLabels && labels[index] && (
            <span className="mt-2 text-xs text-cyber-gray-400 text-center">
              {labels[index]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default IconGrid;
