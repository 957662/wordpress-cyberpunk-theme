/**
 * CyberPress Icon Showcase Components
 *
 * 用于展示和组织图标的组件系统
 *
 * @example
 * ```tsx
 * <IconGallery category="navigation" columns={6} />
 * <IconGrid icons={['cpu', 'bot', 'chip']} />
 * <IconToolbar onIconSelect={(icon) => console.log(icon)} />
 * ```
 */

import React, { useState, useMemo } from 'react';
import { DynamicIcon } from './IconFactory';
import type { IconName } from './index';

// ==================== 类型定义 ====================

export interface IconData {
  name: string;
  category: string;
  tags: string[];
  description?: string;
}

export interface IconShowcaseProps {
  /** 图标列表 */
  icons: string[];
  /** 列数 */
  columns?: number;
  /** 图标尺寸 */
  iconSize?: number;
  /** 是否可选择 */
  selectable?: boolean;
  /** 选中回调 */
  onSelect?: (icon: string) => void;
  /** 已选中的图标 */
  selectedIcons?: string[];
  /** 额外的类名 */
  className?: string;
}

// ==================== 图标网格 ====================

/**
 * 图标网格组件
 * 以网格形式展示图标集合
 */
export const IconGrid: React.FC<IconShowcaseProps> = ({
  icons,
  columns = 6,
  iconSize = 32,
  selectable = false,
  onSelect,
  selectedIcons = [],
  className = ''
}) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem',
  };

  return (
    <div
      className={`w-full ${className}`.trim()}
      style={gridStyle}
    >
      {icons.map((iconName) => {
        const isSelected = selectedIcons.includes(iconName);
        const isHovered = hoveredIcon === iconName;

        return (
          <div
            key={iconName}
            className={`
              relative flex flex-col items-center justify-center
              p-4 rounded-lg transition-all duration-200
              ${selectable ? 'cursor-pointer' : ''}
              ${isSelected ? 'bg-cyber-cyan/20 border border-cyber-cyan' : 'bg-cyber-dark/50 border border-transparent'}
              ${isHovered && !isSelected ? 'bg-cyber-purple/10 border border-cyber-purple/30' : ''}
            `.trim()}
            style={{ minHeight: '100px' }}
            onClick={() => selectable && onSelect?.(iconName)}
            onMouseEnter={() => setHoveredIcon(iconName)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            {/* 图标 */}
            <div
              className={`
                transition-all duration-200
                ${isSelected ? 'text-cyber-cyan' : 'text-gray-400'}
                ${isHovered && !isSelected ? 'text-cyber-purple scale-110' : ''}
              `.trim()}
            >
              <DynamicIcon name={iconName} size={iconSize} />
            </div>

            {/* 图标名称 */}
            <div className="mt-2 text-xs text-center text-gray-500 font-mono truncate w-full">
              {iconName}
            </div>

            {/* 选中标记 */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-cyber-cyan rounded-full flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="text-cyber-black"
                >
                  <path
                    d="M2 5L4 7L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* 发光效果 */}
            {(isSelected || isHovered) && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  boxShadow: isSelected
                    ? '0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1)'
                    : '0 0 10px rgba(157, 0, 255, 0.2)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==================== 图标分类展示 ====================

export interface IconCategoryData {
  name: string;
  label: string;
  icons: string[];
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export interface IconGalleryProps {
  /** 分类数据 */
  categories: IconCategoryData[];
  /** 每个分类的列数 */
  columns?: number;
  /** 图标尺寸 */
  iconSize?: number;
  /** 默认展开的分类 */
  defaultExpanded?: string[];
  /** 额外的类名 */
  className?: string;
}

/**
 * 图标分类展示组件
 * 按分类展示图标，支持折叠/展开
 */
export const IconGallery: React.FC<IconGalleryProps> = ({
  categories,
  columns = 8,
  iconSize = 32,
  defaultExpanded = [],
  className = ''
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const colorMap = {
    cyan: 'text-cyber-cyan border-cyber-cyan',
    purple: 'text-cyber-purple border-cyber-purple',
    pink: 'text-cyber-pink border-cyber-pink',
    yellow: 'text-cyber-yellow border-cyber-yellow',
    green: 'text-cyber-green border-cyber-green',
  };

  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.name);
        const colorClass = category.color
          ? colorMap[category.color]
          : colorMap.cyan;

        return (
          <div
            key={category.name}
            className="border border-gray-800 rounded-lg overflow-hidden"
          >
            {/* 分类标题 */}
            <button
              className={`
                w-full flex items-center justify-between
                p-4 bg-cyber-dark/50
                hover:bg-cyber-dark/70
                transition-colors duration-200
                border-b border-gray-800
              `.trim()}
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center gap-3">
                <h3 className={`text-lg font-bold ${colorClass.split(' ')[0]}`}>
                  {category.label}
                </h3>
                <span className="text-sm text-gray-500">
                  ({category.icons.length} icons)
                </span>
              </div>

              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                className={`transition-transform duration-200 ${colorClass.split(' ')[0]} ${
                  isExpanded ? 'rotate-180' : ''
                }`.trim()}
              >
                <path
                  d="M5 8L10 13L15 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 图标网格 */}
            {isExpanded && (
              <div className="p-4 bg-cyber-black/30">
                <IconGrid
                  icons={category.icons}
                  columns={columns}
                  iconSize={iconSize}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==================== 图标工具栏 ====================

export interface IconToolbarProps {
  /** 可用的图标 */
  icons: string[];
  /** 图标尺寸 */
  iconSize?: number;
  /** 选择回调 */
  onSelect?: (icon: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 额外的类名 */
  className?: string;
}

/**
 * 图标工具栏组件
 * 带搜索功能的图标选择工具栏
 */
export const IconToolbar: React.FC<IconToolbarProps> = ({
  icons,
  iconSize = 24,
  onSelect,
  placeholder = 'Search icons...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return icons;
    return icons.filter((icon) =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  const handleSelect = (icon: string) => {
    setSelectedIcon(icon);
    onSelect?.(icon);
  };

  return (
    <div
      className={`
        w-full bg-cyber-dark/50
        border border-gray-800 rounded-lg
        overflow-hidden
        ${className}
      `.trim()}
    >
      {/* 搜索框 */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full px-4 py-2 pl-10
              bg-cyber-black/50 border border-gray-700 rounded
              text-gray-300 placeholder-gray-600
              focus:outline-none focus:border-cyber-cyan
              transition-colors duration-200
            `.trim()}
          />
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* 图标列表 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-8 gap-2">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                className={`
                  flex flex-col items-center justify-center
                  p-2 rounded transition-all duration-200
                  ${
                    selectedIcon === iconName
                      ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan'
                      : 'hover:bg-cyber-purple/10 border border-transparent text-gray-400'
                  }
                `.trim()}
                onClick={() => handleSelect(iconName)}
                title={iconName}
              >
                <DynamicIcon name={iconName} size={iconSize} />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No icons found
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      {selectedIcon && (
        <div className="px-4 py-2 bg-cyber-cyan/10 border-t border-cyber-cyan/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Selected:</span>
            <span className="text-cyber-cyan font-mono">{selectedIcon}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 图标对比组件 ====================

export interface IconComparisonProps {
  /** 图标对 */
  pairs: Array<{ left: string; right: string; label?: string }>;
  /** 图标尺寸 */
  iconSize?: number;
  /** 额外的类名 */
  className?: string;
}

/**
 * 图标对比组件
 * 并排对比两个图标
 */
export const IconComparison: React.FC<IconComparisonProps> = ({
  pairs,
  iconSize = 48,
  className = ''
}) => {
  return (
    <div className={`w-full space-y-4 ${className}`.trim()}>
      {pairs.map((pair, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-8 p-6 bg-cyber-dark/30 rounded-lg border border-gray-800"
        >
          {/* 左侧图标 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-cyan/30">
              <DynamicIcon name={pair.left} size={iconSize} />
            </div>
            <span className="mt-2 text-sm text-gray-500 font-mono">{pair.left}</span>
          </div>

          {/* 分隔符 */}
          <div className="flex items-center">
            {pair.label && (
              <span className="text-sm text-gray-600 mr-4">{pair.label}</span>
            )}
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="text-gray-700"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>

          {/* 右侧图标 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="p-4 bg-cyber-black/50 rounded-lg border border-cyber-purple/30">
              <DynamicIcon name={pair.right} size={iconSize} />
            </div>
            <span className="mt-2 text-sm text-gray-500 font-mono">{pair.right}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== 图标尺寸预览 ====================

export interface IconSizePreviewProps {
  /** 图标名称 */
  icon: string;
  /** 尺寸列表 */
  sizes?: number[];
  /** 标签 */
  showLabels?: boolean;
  /** 额外的类名 */
  className?: string;
}

/**
 * 图标尺寸预览组件
 * 展示同一图标在不同尺寸下的效果
 */
export const IconSizePreview: React.FC<IconSizePreviewProps> = ({
  icon,
  sizes = [16, 24, 32, 48, 64],
  showLabels = true,
  className = ''
}) => {
  return (
    <div className={`flex items-end gap-6 p-6 bg-cyber-dark/30 rounded-lg border border-gray-800 ${className}`.trim()}>
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <div className="p-4 bg-cyber-black/50 rounded border border-gray-700 flex items-center justify-center">
            <DynamicIcon name={icon} size={size} />
          </div>
          {showLabels && (
            <span className="text-xs text-gray-600 font-mono">{size}px</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ==================== 导出所有组件 ====================

export default {
  IconGrid,
  IconGallery,
  IconToolbar,
  IconComparison,
  IconSizePreview,
};
