/**
 * IconGallery - 分类图标展示组件
 * 按分类展示图标集合
 */

import React, { useState } from 'react';

export interface IconCategory {
  name: string;
  icons: React.ReactNode[];
}

export interface IconGalleryProps {
  /**
   * 图标分类
   */
  categories: IconCategory[];

  /**
   * 默认选中的分类
   * @default 0
   */
  defaultCategory?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 图标尺寸
   * @default 24
   */
  iconSize?: number;
}

export const IconGallery: React.FC<IconGalleryProps> = ({
  categories,
  defaultCategory = 0,
  className = '',
  iconSize = 24,
}) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  return (
    <div className={`icon-gallery ${className}`.trim()}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCategory === index
                ? 'bg-cyber-cyan text-cyber-dark shadow-neon-cyan'
                : 'bg-cyber-card text-cyber-gray-400 hover:bg-cyber-card/80'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {categories[activeCategory].icons.map((icon, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-cyber-card/50 transition-all group cursor-pointer"
          >
            <div
              style={{ width: iconSize, height: iconSize }}
              className="transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-200"
            >
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Category Info */}
      <div className="mt-6 text-center text-sm text-cyber-gray-400">
        {categories[activeCategory].icons.length} icons in{' '}
        {categories[activeCategory].name}
      </div>
    </div>
  );
};

export default IconGallery;
