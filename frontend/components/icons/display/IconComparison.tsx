/**
 * IconComparison - 图标对比组件
 * 并排对比两个或多个图标的组件
 */

import React from 'react';

export interface IconVariant {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export interface IconComparisonProps {
  /**
   * 图标变体
   */
  variants: IconVariant[];

  /**
   * 布局方向
   * @default 'horizontal'
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * 图标尺寸
   * @default 48
   */
  iconSize?: number;

  /**
   * 是否显示描述
   * @default true
   */
  showDescription?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

export const IconComparison: React.FC<IconComparisonProps> = ({
  variants,
  layout = 'horizontal',
  iconSize = 48,
  showDescription = true,
  className = '',
}) => {
  const layoutClass = layout === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${layoutClass} gap-6 ${className}`.trim()}>
      {variants.map((variant, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col items-center justify-center p-6 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan transition-colors group"
        >
          <div
            style={{ width: iconSize, height: iconSize }}
            className="transform group-hover:scale-110 transition-transform duration-200 mb-4"
          >
            {variant.icon}
          </div>

          <h3 className="text-lg font-semibold text-cyber-gray-200 mb-2">
            {variant.label}
          </h3>

          {showDescription && variant.description && (
            <p className="text-sm text-cyber-gray-400 text-center">
              {variant.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default IconComparison;
