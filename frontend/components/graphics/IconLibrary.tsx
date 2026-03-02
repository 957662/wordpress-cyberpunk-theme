/**
 * CyberPress Icon Library
 *
 * 赛博朋克图标库展示组件
 *
 * @example
 * ```tsx
 * import { IconLibrary } from '@/components/graphics/IconLibrary';
 *
 * <IconLibrary category="navigation" />
 * ```
 */

import React from 'react';

// 图标分类
export type IconCategory =
  | 'navigation'
  | 'social'
  | 'functions'
  | 'status'
  | 'cyber'
  | 'media'
  | 'all';

// 图标接口
export interface IconInfo {
  name: string;
  category: IconCategory[];
  color: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  description: string;
}

// 图标数据
const ICONS: IconInfo[] = [
  // 导航图标
  { name: 'HomeIcon', category: ['navigation'], color: 'cyan', description: '首页' },
  { name: 'SearchIcon', category: ['navigation'], color: 'purple', description: '搜索' },
  { name: 'MenuIcon', category: ['navigation'], color: 'pink', description: '菜单' },
  { name: 'ArrowIcon', category: ['navigation'], color: 'yellow', description: '箭头' },
  { name: 'CloseIcon', category: ['navigation'], color: 'pink', description: '关闭' },

  // 社交图标
  { name: 'GitHubIcon', category: ['social'], color: 'cyan', description: 'GitHub' },
  { name: 'TwitterIcon', category: ['social'], color: 'cyan', description: 'Twitter/X' },
  { name: 'LinkedInIcon', category: ['social'], color: 'cyan', description: 'LinkedIn' },
  { name: 'EmailIcon', category: ['social'], color: 'yellow', description: '邮件' },
  { name: 'DiscordIcon', category: ['social'], color: 'purple', description: 'Discord' },
  { name: 'YouTubeIcon', category: ['social'], color: 'pink', description: 'YouTube' },
  { name: 'RSSIcon', category: ['social'], color: 'yellow', description: 'RSS订阅' },

  // 功能图标
  { name: 'CalendarIcon', category: ['functions'], color: 'cyan', description: '日历' },
  { name: 'TagIcon', category: ['functions'], color: 'purple', description: '标签' },
  { name: 'SettingsIcon', category: ['functions'], color: 'pink', description: '设置' },
  { name: 'CodeIcon', category: ['functions'], color: 'yellow', description: '代码' },
  { name: 'TerminalIcon', category: ['functions'], color: 'green', description: '终端' },
  { name: 'CheckIcon', category: ['functions'], color: 'green', description: '勾选' },
  { name: 'CopyIcon', category: ['functions'], color: 'cyan', description: '复制' },
  { name: 'DownloadIcon', category: ['functions'], color: 'cyan', description: '下载' },

  // 状态图标
  { name: 'OnlineIcon', category: ['status'], color: 'green', description: '在线' },
  { name: 'OfflineIcon', category: ['status'], color: 'pink', description: '离线' },
  { name: 'LoadingIcon', category: ['status'], color: 'purple', description: '加载中' },
  { name: 'WarningIcon', category: ['status'], color: 'yellow', description: '警告' },
  { name: 'ErrorIcon', category: ['status'], color: 'pink', description: '错误' },
  { name: 'InfoIcon', category: ['status'], color: 'cyan', description: '信息' },

  // 赛博科技
  { name: 'CyberIcon', category: ['cyber'], color: 'cyan', description: '赛博' },
  { name: 'CpuIcon', category: ['cyber'], color: 'cyan', description: 'CPU' },
  { name: 'ChipIcon', category: ['cyber'], color: 'purple', description: '芯片' },
  { name: 'DatabaseIcon', category: ['cyber'], color: 'pink', description: '数据库' },
  { name: 'NetworkIcon', category: ['cyber'], color: 'cyan', description: '网络' },
  { name: 'HologramIcon', category: ['cyber'], color: 'purple', description: '全息' },

  // 媒体图标
  { name: 'ImageIcon', category: ['media'], color: 'cyan', description: '图片' },
  { name: 'VideoIcon', category: ['media'], color: 'purple', description: '视频' },
  { name: 'MusicIcon', category: ['media'], color: 'pink', description: '音乐' },
  { name: 'CameraIcon', category: ['media'], color: 'yellow', description: '相机' },
];

// 颜色映射
const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

// 组件属性
export interface IconLibraryProps {
  /** 显示的分类 */
  category?: IconCategory;
  /** 网格布局列数 */
  columns?: number;
  /** 图标大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 点击事件 */
  onIconClick?: (iconName: string) => void;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 单个图标卡片
 */
const IconCard: React.FC<{
  icon: IconInfo;
  size: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}> = ({ icon, size, onClick }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSize = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg p-4 cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 bg-dark-gray border border-medium-gray hover:border-cyber-cyan`}
      onClick={onClick}
    >
      {/* 图标占位符 */}
      <div
        className="rounded transition-all hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
        style={{
          width: `${iconSize[size]}px`,
          height: `${iconSize[size]}px`,
          backgroundColor: colorMap[icon.color],
          maskImage: 'radial-gradient(circle, black 40%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 50%)',
        }}
      />

      {/* 图标名称 */}
      <p className="text-xs text-gray-400 text-center truncate w-full">{icon.name}</p>
    </div>
  );
};

/**
 * 图标库主组件
 */
export const IconLibrary: React.FC<IconLibraryProps> = ({
  category = 'all',
  columns = 4,
  size = 'md',
  onIconClick,
  className = '',
}) => {
  // 过滤图标
  const filteredIcons = category === 'all'
    ? ICONS
    : ICONS.filter(icon => icon.category.includes(category));

  // 按分类分组
  const groupedIcons = category === 'all'
    ? {
        navigation: ICONS.filter(i => i.category.includes('navigation')),
        social: ICONS.filter(i => i.category.includes('social')),
        functions: ICONS.filter(i => i.category.includes('functions')),
        status: ICONS.filter(i => i.category.includes('status')),
        cyber: ICONS.filter(i => i.category.includes('cyber')),
        media: ICONS.filter(i => i.category.includes('media')),
      }
    : null;

  return (
    <div className={className}>
      {groupedIcons ? (
        // 显示所有分类
        <div className="space-y-8">
          {Object.entries(groupedIcons).map(([cat, icons]) => (
            icons.length > 0 && (
              <div key={cat}>
                <h3 className="text-lg font-semibold text-cyber-cyan mb-4 capitalize">
                  {cat}
                </h3>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
                  {icons.map(icon => (
                    <IconCard
                      key={icon.name}
                      icon={icon}
                      size={size}
                      onClick={() => onIconClick?.(icon.name)}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        // 显示单个分类
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {filteredIcons.map(icon => (
            <IconCard
              key={icon.name}
              icon={icon}
              size={size}
              onClick={() => onIconClick?.(icon.name)}
            />
          ))}
        </div>
      )}

      {/* 统计信息 */}
      <div className="mt-8 pt-6 border-t border-medium-gray">
        <p className="text-sm text-gray-400">
          显示 <span className="text-cyber-cyan">{filteredIcons.length}</span> 个图标
          {category !== 'all' && ` - 分类: ${category}`}
        </p>
      </div>
    </div>
  );
};

/**
 * 图标选择器
 */
export const IconPicker: React.FC<{
  value?: string;
  onChange?: (iconName: string) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  return (
    <div className={className}>
      <IconLibrary
        category="all"
        columns={6}
        size="sm"
        onIconClick={onChange}
      />
    </div>
  );
};

/**
 * 图标搜索框
 */
export const IconSearch: React.FC<{
  onSearch: (query: string) => void;
  className?: string;
}> = ({ onSearch, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="搜索图标..."
        className="w-full px-4 py-2 pl-10 bg-dark-gray border border-medium-gray rounded-lg focus:border-cyber-cyan focus:outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
    </div>
  );
};

/**
 * 图标统计卡片
 */
export const IconStats: React.FC<{ className?: string }> = ({ className = '' }) => {
  const stats = {
    total: ICONS.length,
    byCategory: {
      navigation: ICONS.filter(i => i.category.includes('navigation')).length,
      social: ICONS.filter(i => i.category.includes('social')).length,
      functions: ICONS.filter(i => i.category.includes('functions')).length,
      status: ICONS.filter(i => i.category.includes('status')).length,
      cyber: ICONS.filter(i => i.category.includes('cyber')).length,
      media: ICONS.filter(i => i.category.includes('media')).length,
    },
    byColor: {
      cyan: ICONS.filter(i => i.color === 'cyan').length,
      purple: ICONS.filter(i => i.color === 'purple').length,
      pink: ICONS.filter(i => i.color === 'pink').length,
      yellow: ICONS.filter(i => i.color === 'yellow').length,
      green: ICONS.filter(i => i.color === 'green').length,
    },
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* 总数 */}
      <div className="bg-dark-gray rounded-lg p-6 border border-medium-gray">
        <p className="text-sm text-gray-400 mb-2">总图标数</p>
        <p className="text-4xl font-bold text-cyber-cyan">{stats.total}</p>
      </div>

      {/* 按分类 */}
      <div className="bg-dark-gray rounded-lg p-6 border border-medium-gray">
        <p className="text-sm text-gray-400 mb-4">按分类</p>
        <div className="space-y-2">
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <div key={cat} className="flex justify-between items-center">
              <span className="text-sm capitalize text-gray-300">{cat}</span>
              <span className="text-sm font-semibold text-cyber-purple">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 按颜色 */}
      <div className="bg-dark-gray rounded-lg p-6 border border-medium-gray">
        <p className="text-sm text-gray-400 mb-4">按颜色</p>
        <div className="space-y-2">
          {Object.entries(stats.byColor).map(([color, count]) => (
            <div key={color} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorMap[color as keyof typeof colorMap] }}
                />
                <span className="text-sm capitalize text-gray-300">{color}</span>
              </div>
              <span className="text-sm font-semibold text-cyber-pink">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconLibrary;
