/**
 * Icon Gallery - 赛博朋克图标展示组件
 *
 * 用于展示所有可用的赛博朋克风格图标
 */

'use client';

import React, { useState } from 'react';
import {
  // 导航图标
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  SearchIcon,
  ArrowIcon,

  // 社交媒体
  GitHubIcon,
  TwitterIcon,
  DiscordIcon,
  YouTubeIcon,
  DribbbleIcon,

  // UI 元素
  CalendarIcon,
  TagIcon,
  StarIcon,
  UserIcon,
  SettingsIcon,
  CodeIcon,
  TerminalIcon,
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,

  // 操作图标
  MenuIcon,
  CloseIcon,
  LoadingIcon,
  ExternalLinkIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  CopyIcon,
  FilterIcon,
  SortIcon,

  // 文件系统
  FileIcon,
  ArchiveIcon,

  // 媒体
  MusicIcon,
  CameraIcon,

  // 状态
  OnlineIcon,
  OfflineIcon,
  SyncIcon,

  // 工具
  GlobeIcon,
  ZapIcon,

  // 赛博科技
  CpuIcon,
  DatabaseIcon,
  NetworkIcon,
  ShieldLockIcon,
  HologramIcon,
  ChipIcon,
} from '@/components/icons';

type ColorVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';

interface IconCategory {
  name: string;
  icons: {
    component: React.ComponentType<any>;
    name: string;
    description: string;
  }[];
}

const iconCategories: IconCategory[] = [
  {
    name: '导航图标 (Navigation)',
    icons: [
      { component: HomeIcon, name: 'HomeIcon', description: '首页导航' },
      { component: BlogIcon, name: 'BlogIcon', description: '博客页面' },
      { component: PortfolioIcon, name: 'PortfolioIcon', description: '作品集' },
      { component: SearchIcon, name: 'SearchIcon', description: '搜索功能' },
      { component: ArrowIcon, name: 'ArrowIcon', description: '方向指示' },
    ],
  },
  {
    name: '社交媒体 (Social)',
    icons: [
      { component: GitHubIcon, name: 'GitHubIcon', description: 'GitHub' },
      { component: TwitterIcon, name: 'TwitterIcon', description: 'Twitter/X' },
      { component: DiscordIcon, name: 'DiscordIcon', description: 'Discord' },
      { component: YouTubeIcon, name: 'YouTubeIcon', description: 'YouTube' },
      { component: DribbbleIcon, name: 'DribbbleIcon', description: 'Dribbble' },
    ],
  },
  {
    name: 'UI 元素 (UI Elements)',
    icons: [
      { component: CalendarIcon, name: 'CalendarIcon', description: '日期显示' },
      { component: TagIcon, name: 'TagIcon', description: '标签/分类' },
      { component: StarIcon, name: 'StarIcon', description: '收藏/评分' },
      { component: UserIcon, name: 'UserIcon', description: '用户头像' },
      { component: SettingsIcon, name: 'SettingsIcon', description: '设置' },
      { component: CodeIcon, name: 'CodeIcon', description: '代码块' },
      { component: TerminalIcon, name: 'TerminalIcon', description: '终端' },
      { component: CheckIcon, name: 'CheckIcon', description: '成功确认' },
      { component: WarningIcon, name: 'WarningIcon', description: '警告提示' },
      { component: ErrorIcon, name: 'ErrorIcon', description: '错误提示' },
      { component: InfoIcon, name: 'InfoIcon', description: '信息提示' },
    ],
  },
  {
    name: '操作图标 (Actions)',
    icons: [
      { component: MenuIcon, name: 'MenuIcon', description: '菜单按钮' },
      { component: CloseIcon, name: 'CloseIcon', description: '关闭/取消' },
      { component: LoadingIcon, name: 'LoadingIcon', description: '加载状态' },
      { component: ExternalLinkIcon, name: 'ExternalLinkIcon', description: '外部链接' },
      { component: HeartIcon, name: 'HeartIcon', description: '点赞/喜欢' },
      { component: CommentIcon, name: 'CommentIcon', description: '评论' },
      { component: ShareIcon, name: 'ShareIcon', description: '分享' },
      { component: CopyIcon, name: 'CopyIcon', description: '复制' },
      { component: FilterIcon, name: 'FilterIcon', description: '筛选/过滤' },
      { component: SortIcon, name: 'SortIcon', description: '排序' },
    ],
  },
  {
    name: '文件系统 (File System)',
    icons: [
      { component: FileIcon, name: 'FileIcon', description: '文件' },
      { component: ArchiveIcon, name: 'ArchiveIcon', description: '压缩包' },
    ],
  },
  {
    name: '媒体图标 (Media)',
    icons: [
      { component: MusicIcon, name: 'MusicIcon', description: '音乐' },
      { component: CameraIcon, name: 'CameraIcon', description: '相机' },
    ],
  },
  {
    name: '状态图标 (Status)',
    icons: [
      { component: OnlineIcon, name: 'OnlineIcon', description: '在线状态' },
      { component: OfflineIcon, name: 'OfflineIcon', description: '离线状态' },
      { component: SyncIcon, name: 'SyncIcon', description: '同步中' },
    ],
  },
  {
    name: '工具图标 (Utility)',
    icons: [
      { component: GlobeIcon, name: 'GlobeIcon', description: '全球/网站' },
      { component: ZapIcon, name: 'ZapIcon', description: '快速/能量' },
    ],
  },
  {
    name: '赛博科技 (Cyberpunk Tech)',
    icons: [
      { component: CpuIcon, name: 'CpuIcon', description: 'CPU/处理器' },
      { component: DatabaseIcon, name: 'DatabaseIcon', description: '数据库' },
      { component: NetworkIcon, name: 'NetworkIcon', description: '网络' },
      { component: ShieldLockIcon, name: 'ShieldLockIcon', description: '安全盾牌' },
      { component: HologramIcon, name: 'HologramIcon', description: '全息投影' },
      { component: ChipIcon, name: 'ChipIcon', description: '芯片' },
    ],
  },
];

const variants: ColorVariant[] = ['cyan', 'purple', 'pink', 'yellow', 'green'];

const variantColors: Record<ColorVariant, string> = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  pink: 'text-cyber-pink',
  yellow: 'text-cyber-yellow',
  green: 'text-cyber-green',
};

export const IconGallery: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>('cyan');
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-display font-bold text-cyber-cyan mb-2">
          CyberPress Icon Gallery
        </h1>
        <p className="text-cyber-gray-200">
          赛博朋克风格图标库 - 共 {iconCategories.reduce((acc, cat) => acc + cat.icons.length, 0)} 个图标
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-center bg-cyber-card p-4 rounded-lg border border-cyber-border">
        <div className="flex items-center gap-2">
          <label className="text-cyber-gray-200">颜色变体:</label>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value as ColorVariant)}
            className="bg-cyber-dark border border-cyber-border rounded px-3 py-1 text-cyber-gray-100"
          >
            {variants.map((variant) => (
              <option key={variant} value={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} ({variantColors[variant].split('-')[1]})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-cyber-gray-200">动画效果:</label>
          <button
            onClick={() => setShowAnimation(!showAnimation)}
            className={`px-4 py-1 rounded border transition-all ${
              showAnimation
                ? `bg-cyber-${selectedVariant}/20 border-cyber-${selectedVariant} text-cyber-${selectedVariant}`
                : 'bg-cyber-dark border-cyber-border text-cyber-gray-300'
            }`}
          >
            {showAnimation ? '开启' : '关闭'}
          </button>
        </div>
      </div>

      {/* Icon Grid */}
      <div className="space-y-12">
        {iconCategories.map((category) => (
          <div key={category.name} className="bg-cyber-card rounded-lg border border-cyber-border overflow-hidden">
            {/* Category Header */}
            <div className="bg-cyber-muted px-6 py-3 border-b border-cyber-border">
              <h2 className="text-xl font-display font-bold text-cyber-cyan">
                {category.name}
              </h2>
            </div>

            {/* Icon Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.icons.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <div
                    key={icon.name}
                    className="bg-cyber-dark rounded-lg p-4 border border-cyber-border hover:border-cyber-cyan transition-all hover:shadow-neon-cyan group"
                  >
                    {/* Icon Display */}
                    <div className="flex items-center justify-center h-24 mb-3">
                      <IconComponent
                        size={48}
                        variant={selectedVariant}
                        animated={showAnimation}
                        className={variantColors[selectedVariant]}
                      />
                    </div>

                    {/* Icon Info */}
                    <div className="text-center">
                      <h3 className="font-mono text-sm text-cyber-gray-100 mb-1 group-hover:text-cyber-cyan transition">
                        {icon.name}
                      </h3>
                      <p className="text-xs text-cyber-gray-300">
                        {icon.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-cyber-gray-300 text-sm">
        <p>CyberPress Platform - Icon Gallery v2.0</p>
        <p className="mt-1">Created by AI Design Team • 2026-03-02</p>
      </div>
    </div>
  );
};

export default IconGallery;
