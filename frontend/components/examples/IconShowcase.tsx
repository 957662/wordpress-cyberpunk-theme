'use client';

import { useState } from 'react';
import {
  SearchIcon,
  MenuIcon,
  ArrowIcon,
  LoadingIcon,
  GitHubIcon,
  TwitterIcon,
  BlogIcon,
  PortfolioIcon,
  CalendarIcon,
  TagIcon,
  CodeIcon,
  ThemeIcon,
  UserIcon,
  SettingsIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  StarIcon,
  FilterIcon,
  SortIcon,
} from '@/components/icons';

/**
 * 图标展示组件
 * 演示所有可用图标及其变体
 */
export const IconShowcase = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDark ? 'bg-cyber-dark' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-4xl font-display font-bold ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple' : 'text-gray-900'}`}>
            CyberPress Icon Library
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-cyber-cyan hover:shadow-neon-cyan transition-all"
          >
            <ThemeIcon mode={isDark ? 'dark' : 'light'} size={20} />
            <span className="text-cyber-cyan">Toggle Theme</span>
          </button>
        </div>

        <p className={isDark ? 'text-cyber-muted' : 'text-gray-600'}>
          完整的赛博朋克风格图标库，包含 28 个图标和 5 种颜色变体
        </p>
      </div>

      {/* Navigation Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          导航图标 (Navigation)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="MenuIcon" icon={<MenuIcon size={32} />} isDark={isDark} />
          <IconCard name="ArrowIcon" icon={<ArrowIcon size={32} direction="up" />} isDark={isDark} />
          <IconCard name="ArrowIcon right" icon={<ArrowIcon size={32} direction="right" variant="purple" />} isDark={isDark} />
          <IconCard name="SearchIcon" icon={<SearchIcon size={32} />} isDark={isDark} />
          <IconCard name="ExternalLinkIcon" icon={<ShareIcon size={32} />} isDark={isDark} />
          <IconCard name="LoadingIcon" icon={<LoadingIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Content Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          内容图标 (Content)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="BlogIcon" icon={<BlogIcon size={32} />} isDark={isDark} />
          <IconCard name="PortfolioIcon" icon={<PortfolioIcon size={32} />} isDark={isDark} />
          <IconCard name="CalendarIcon" icon={<CalendarIcon size={32} />} isDark={isDark} />
          <IconCard name="TagIcon" icon={<TagIcon size={32} />} isDark={isDark} />
          <IconCard name="TagIcon purple" icon={<TagIcon size={32} variant="purple" />} isDark={isDark} />
          <IconCard name="CodeIcon" icon={<CodeIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Action Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          操作图标 (Actions)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="ShareIcon" icon={<ShareIcon size={32} />} isDark={isDark} />
          <IconCard name="CopyIcon" icon={<CopyIcon size={32} />} isDark={isDark} />
          <IconCard name="CheckIcon" icon={<CheckIcon size={32} />} isDark={isDark} />
          <IconCard name="CloseIcon" icon={<CloseIcon size={32} />} isDark={isDark} />
          <IconCard name="FilterIcon" icon={<FilterIcon size={32} />} isDark={isDark} />
          <IconCard name="SortIcon" icon={<SortIcon size={32} direction="asc" />} isDark={isDark} />
        </div>
      </section>

      {/* User Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          用户图标 (User)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="UserIcon" icon={<UserIcon size={32} />} isDark={isDark} />
          <IconCard name="SettingsIcon" icon={<SettingsIcon size={32} />} isDark={isDark} />
          <IconCard name="ThemeIcon dark" icon={<ThemeIcon size={32} mode="dark" />} isDark={isDark} />
          <IconCard name="ThemeIcon light" icon={<ThemeIcon size={32} mode="light" />} isDark={isDark} />
        </div>
      </section>

      {/* Social Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          社交图标 (Social)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="GitHubIcon" icon={<GitHubIcon size={32} />} isDark={isDark} />
          <IconCard name="GitHubIcon filled" icon={<GitHubIcon size={32} filled />} isDark={isDark} />
          <IconCard name="TwitterIcon" icon={<TwitterIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Interactive Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          交互图标 (Interactive)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="HeartIcon" icon={<HeartIcon size={32} />} isDark={isDark} />
          <IconCard name="HeartIcon filled" icon={<HeartIcon size={32} filled />} isDark={isDark} />
          <IconCard name="HeartIcon pink" icon={<HeartIcon size={32} filled variant="pink" />} isDark={isDark} />
          <IconCard name="StarIcon" icon={<StarIcon size={32} />} isDark={isDark} />
          <IconCard name="StarIcon filled" icon={<StarIcon size={32} filled />} isDark={isDark} />
          <IconCard name="CommentIcon" icon={<CommentIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Status Icons */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          状态图标 (Status)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <IconCard name="InfoIcon" icon={<InfoIcon size={32} />} isDark={isDark} />
          <IconCard name="WarningIcon" icon={<WarningIcon size={32} />} isDark={isDark} />
          <IconCard name="ErrorIcon" icon={<ErrorIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Size Variants */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          尺寸变体 (Size Variants)
        </h2>
        <div className={`flex flex-wrap items-center gap-8 p-6 rounded-lg ${isDark ? 'bg-cyber-card border border-cyber-border' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={16} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={20} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>20px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={24} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>24px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={32} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>32px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={40} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>40px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SearchIcon size={48} />
            <span className={isDark ? 'text-cyber-muted text-sm' : 'text-gray-600 text-sm'}>48px</span>
          </div>
        </div>
      </section>

      {/* Color Variants */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          颜色变体 (Color Variants)
        </h2>
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-6 p-6 rounded-lg ${isDark ? 'bg-cyber-card border border-cyber-border' : 'bg-white border border-gray-200'}`}>
          <ColorVariantCard color="Cyan" hex="#00f0ff" icon={<HeartIcon size={40} variant="cyan" />} isDark={isDark} />
          <ColorVariantCard color="Purple" hex="#9d00ff" icon={<HeartIcon size={40} variant="purple" />} isDark={isDark} />
          <ColorVariantCard color="Pink" hex="#ff0080" icon={<HeartIcon size={40} variant="pink" />} isDark={isDark} />
          <ColorVariantCard color="Yellow" hex="#f0ff00" icon={<StarIcon size={40} variant="yellow" />} isDark={isDark} />
          <ColorVariantCard color="Green" hex="#00ff88" icon={<CheckIcon size={40} variant="green" />} isDark={isDark} />
        </div>
      </section>
    </div>
  );
};

interface IconCardProps {
  name: string;
  icon: React.ReactNode;
  isDark: boolean;
}

const IconCard = ({ name, icon, isDark }: IconCardProps) => {
  return (
    <div className={`p-4 rounded-lg flex flex-col items-center gap-3 transition-all hover:scale-105 ${isDark ? 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan' : 'bg-white border border-gray-200 hover:border-blue-500'}`}>
      <div className="flex items-center justify-center w-16 h-16">
        {icon}
      </div>
      <span className={`text-xs font-mono text-center ${isDark ? 'text-cyber-muted' : 'text-gray-600'}`}>{name}</span>
    </div>
  );
};

interface ColorVariantCardProps {
  color: string;
  hex: string;
  icon: React.ReactNode;
  isDark: boolean;
}

const ColorVariantCard = ({ color, hex, icon, isDark }: ColorVariantCardProps) => {
  return (
    <div className={`p-6 rounded-lg flex flex-col items-center gap-4 ${isDark ? 'bg-cyber-card border border-cyber-border' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-center w-20 h-20">
        {icon}
      </div>
      <div className="text-center">
        <div className={`font-display font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{color}</div>
        <div className="font-mono text-sm" style={{ color: hex }}>{hex}</div>
      </div>
    </div>
  );
};
