'use client';

/**
 * 图标使用示例组件
 * 展示各种图标在实际项目中的使用方式
 */

import React, { useState } from 'react';
import {
  SearchIcon,
  GitHubIcon,
  TwitterIcon,
  HeartIcon,
  StarIcon,
  MenuIcon,
  ThemeIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  CommentIcon,
  ShareIcon,
  DownloadIcon,
  ExternalLink,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  CodeIcon,
  TerminalIcon,
  CpuIcon,
  CyberIcon,
  DatabaseIcon,
  NetworkIcon,
  LockIcon,
  UnlockIcon,
  EyeIcon,
  EyeOffIcon,
  BookmarkIcon,
  FilterIcon,
  SortIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  RefreshIcon,
  CopyIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from '@/components/icons';

// ============================================
// 示例 1: 基础图标
// ============================================

export function BasicIconsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">基础图标</h3>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg">
          <SearchIcon size={24} />
          <span className="text-sm text-cyber-gray-300">Search</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg">
          <SettingsIcon size={24} />
          <span className="text-sm text-cyber-gray-300">Settings</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg">
          <UserIcon size={24} />
          <span className="text-sm text-cyber-gray-300">User</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg">
          <BellIcon size={24} />
          <span className="text-sm text-cyber-gray-300">Bell</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例 2: 彩色图标
// ============================================

export function ColoredIconsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">彩色图标</h3>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg border border-cyber-cyan/30">
          <GitHubIcon size={32} className="text-cyber-cyan" />
          <span className="text-sm text-cyber-gray-300">Cyan</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg border border-cyber-purple/30">
          <TwitterIcon size={32} className="text-cyber-purple" />
          <span className="text-sm text-cyber-gray-300">Purple</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg border border-cyber-pink/30">
          <HeartIcon size={32} className="text-cyber-pink" />
          <span className="text-sm text-cyber-gray-300">Pink</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-cyber-dark rounded-lg border border-cyber-yellow/30">
          <StarIcon size={32} className="text-cyber-yellow" />
          <span className="text-sm text-cyber-gray-300">Yellow</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例 3: 按钮中的图标
// ============================================

export function IconButtonExamples() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">按钮图标</h3>

      <div className="flex flex-wrap gap-4">
        {/* 主要按钮 */}
        <button className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan text-cyber-black font-bold rounded-lg hover:shadow-neon-cyan transition-all">
          <DownloadIcon size={20} />
          <span>下载</span>
        </button>

        {/* 次要按钮 */}
        <button className="flex items-center gap-2 px-6 py-3 border-2 border-cyber-purple text-cyber-purple font-bold rounded-lg hover:bg-cyber-purple hover:text-cyber-black transition-all">
          <GitHubIcon size={20} />
          <span>GitHub</span>
        </button>

        {/* 图标按钮 */}
        <button className="p-3 text-cyber-cyan border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/10 transition-all">
          <ShareIcon size={24} />
        </button>

        {/* 胶囊按钮 */}
        <button className="flex items-center gap-2 px-4 py-2 bg-cyber-gradient text-cyber-black font-bold rounded-full hover:shadow-neon-cyan transition-all">
          <HeartIcon size={18} />
          <span>点赞</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// 示例 4: 导航图标
// ============================================

export function NavigationIconsExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">导航图标</h3>

      {/* 水平导航 */}
      <nav className="flex items-center gap-6 p-4 bg-cyber-dark rounded-lg border border-cyber-cyan/20">
        <a href="#" className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition-colors">
          <SearchIcon size={24} />
          <span>搜索</span>
        </a>

        <a href="#" className="flex items-center gap-2 text-cyber-gray-300 hover:text-cyber-cyan transition-colors">
          <CodeIcon size={24} />
          <span>代码</span>
        </a>

        <a href="#" className="flex items-center gap-2 text-cyber-gray-300 hover:text-cyber-cyan transition-colors">
          <TerminalIcon size={24} />
          <span>终端</span>
        </a>

        <button className="ml-auto p-2 text-cyber-cyan hover:text-cyber-purple transition-colors">
          <MenuIcon size={24} />
        </button>
      </nav>

      {/* 垂直导航 */}
      <nav className="flex flex-col gap-2 p-4 bg-cyber-dark rounded-lg border border-cyber-purple/20">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-cyber-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all">
          <UserIcon size={20} />
          <span>个人资料</span>
          <ChevronRight size={16} className="ml-auto" />
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 text-cyber-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all">
          <SettingsIcon size={20} />
          <span>设置</span>
          <ChevronRight size={16} className="ml-auto" />
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 text-cyber-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all">
          <BellIcon size={20} />
          <span>通知</span>
          <ChevronRight size={16} className="ml-auto" />
        </a>
      </nav>
    </div>
  );
}

// ============================================
// 示例 5: 状态图标
// ============================================

export function StatusIconsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">状态图标</h3>

      <div className="flex flex-wrap gap-4">
        {/* 成功状态 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-cyber-green/10 border border-cyber-green/30 rounded-lg">
          <CheckIcon size={20} className="text-cyber-green" />
          <span className="text-cyber-green">操作成功</span>
        </div>

        {/* 警告状态 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-lg">
          <WarningIcon size={20} className="text-cyber-yellow" />
          <span className="text-cyber-yellow">请注意</span>
        </div>

        {/* 错误状态 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg">
          <ErrorIcon size={20} className="text-cyber-pink" />
          <span className="text-cyber-pink">发生错误</span>
        </div>

        {/* 信息状态 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
          <InfoIcon size={20} className="text-cyber-cyan" />
          <span className="text-cyber-cyan">提示信息</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例 6: 文章元数据图标
// ============================================

export function ArticleMetadataExample() {
  const article = {
    date: '2026-03-05',
    author: 'CyberPress Team',
    category: '设计系统',
    comments: 12,
    tags: ['UI', '图标', '赛博朋克'],
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">文章元数据</h3>

      <div className="flex flex-wrap gap-4 p-4 bg-cyber-dark rounded-lg border border-cyber-cyan/20">
        <div className="flex items-center gap-2 text-cyber-gray-300">
          <CalendarIcon size={16} />
          <span className="text-sm">{article.date}</span>
        </div>

        <div className="flex items-center gap-2 text-cyber-gray-300">
          <UserIcon size={16} />
          <span className="text-sm">{article.author}</span>
        </div>

        <div className="flex items-center gap-2 text-cyber-gray-300">
          <TagIcon size={16} />
          <span className="text-sm">{article.category}</span>
        </div>

        <div className="flex items-center gap-2 text-cyber-gray-300">
          <CommentIcon size={16} />
          <span className="text-sm">{article.comments} 评论</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例 7: 操作按钮组
// ============================================

export function ActionButtonsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">操作按钮</h3>

      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-2 px-3 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors">
          <EditIcon size={18} />
          <span>编辑</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors">
          <BookmarkIcon size={18} />
          <span>收藏</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors">
          <CopyIcon size={18} />
          <span>复制</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-cyber-yellow hover:bg-cyber-yellow/10 rounded-lg transition-colors">
          <LockIcon size={18} />
          <span>锁定</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-cyber-pink hover:bg-cyber-pink/10 rounded-lg transition-colors">
          <TrashIcon size={18} />
          <span>删除</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// 示例 8: 赛博科技图标
// ============================================

export function CyberTechIconsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">赛博科技图标</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2 p-6 bg-cyber-dark rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
          <CpuIcon size={48} className="text-cyber-cyan" />
          <span className="text-sm text-cyber-gray-300">CPU</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-6 bg-cyber-dark rounded-lg border border-cyber-purple/30 hover:border-cyber-purple hover:shadow-neon-purple transition-all">
          <DatabaseIcon size={48} className="text-cyber-purple" />
          <span className="text-sm text-cyber-gray-300">数据库</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-6 bg-cyber-dark rounded-lg border border-cyber-pink/30 hover:border-cyber-pink hover:shadow-neon-pink transition-all">
          <NetworkIcon size={48} className="text-cyber-pink" />
          <span className="text-sm text-cyber-gray-300">网络</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-6 bg-cyber-dark rounded-lg border border-cyber-yellow/30 hover:border-cyber-yellow hover:shadow-neon-yellow transition-all">
          <CyberIcon size={48} className="text-cyber-yellow" />
          <span className="text-sm text-cyber-gray-300">赛博</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 示例 9: 社交链接
// ============================================

export function SocialLinksExample() {
  const socials = [
    { icon: GitHubIcon, href: 'https://github.com', label: 'GitHub', color: 'text-cyber-cyan' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter', color: 'text-cyber-purple' },
    { icon: StarIcon, href: '#', label: 'Star', color: 'text-cyber-yellow' },
    { icon: ShareIcon, href: '#', label: 'Share', color: 'text-cyber-pink' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">社交链接</h3>

      <div className="flex gap-4">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className={`
              p-3 rounded-lg
              ${social.color}
              hover:bg-cyber-cyan/10
              hover:shadow-neon-cyan
              transition-all
            `}
          >
            <social.icon size={24} />
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 示例 10: 可折叠卡片
// ============================================

export function CollapsibleCardExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-cyan">可折叠卡片</h3>

      <div className="p-4 bg-cyber-dark rounded-lg border border-cyber-cyan/20">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-bold text-cyber-gray-100">点击展开/折叠</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-cyber-cyan/20">
            <p className="text-cyber-gray-300">
              这是折叠内容。点击上方的箭头图标可以展开或折叠此区域。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 主示例组件
// ============================================

export default function IconExamples() {
  return (
    <div className="space-y-8 p-6 bg-cyber-black min-h-screen">
      <h1 className="text-3xl font-bold text-cyber-cyan text-glow-cyan">
        图标使用示例
      </h1>

      <BasicIconsExample />
      <ColoredIconsExample />
      <IconButtonExamples />
      <NavigationIconsExample />
      <StatusIconsExample />
      <ArticleMetadataExample />
      <ActionButtonsExample />
      <CyberTechIconsExample />
      <SocialLinksExample />
      <CollapsibleCardExample />
    </div>
  );
}
