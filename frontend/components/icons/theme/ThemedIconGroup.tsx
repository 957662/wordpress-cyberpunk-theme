/**
 * ThemedIconGroup - 主题图标组
 * 一组统一主题的图标
 */

import React from 'react';

export interface ThemedIconItem {
  icon: React.ReactNode;
  label?: string;
  href?: string;
}

export interface ThemedIconGroupProps {
  /**
   * 图标数组
   */
  icons: ThemedIconItem[];

  /**
   * 主题变体
   * @default 'cyan'
   */
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';

  /**
   * 间距
   * @default 'medium'
   */
  gap?: 'small' | 'medium' | 'large';

  /**
   * 方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * 自定义类名
   */
  className?: string;
}

export const ThemedIconGroup: React.FC<ThemedIconGroupProps> = ({
  icons,
  variant = 'cyan',
  gap = 'medium',
  orientation = 'horizontal',
  className = '',
}) => {
  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap];

  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  const variantColors = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    green: 'text-cyber-green',
  };

  return (
    <div
      className={`flex ${orientationClass} ${gapClass} ${variantColors[variant]} ${className}`.trim()}
    >
      {icons.map((item, index) => {
        const content = (
          <div
            key={index}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => item.href && window.open(item.href, '_blank')}
          >
            <div className="transform hover:scale-110 transition-transform">
              {item.icon}
            </div>
            {item.label && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>
        );

        return item.href ? (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="transform hover:scale-110 transition-transform">
              {item.icon}
            </div>
            {item.label && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </a>
        ) : (
          content
        );
      })}
    </div>
  );
};

export default ThemedIconGroup;
