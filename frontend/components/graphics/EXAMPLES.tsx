/**
 * CyberPress 图形组件使用示例
 *
 * 本文件提供了所有图形组件的使用示例
 * 可以直接复制到项目中使用
 */

import React, { useState } from 'react';
import {
  // 图标
  HomeIcon,
  BlogIcon,
  SearchIcon,
  MenuIcon,
  GitHubIcon,
  TwitterIcon,
  UserIcon,
  SettingsIcon,
  CheckIcon,
  WarningIcon,
  MoonIcon,
  SunIcon,
  CodeIcon,
  TerminalIcon,
  StarIcon,
  HeartIcon,
  ArrowRightIcon,

  // Logo
  MainLogo,
  SquareLogo,
  FaviconLogo,
  AnimatedLogo,

  // 装饰元素
  CornerBracket,
  DividerLine,
  LoadingRing,
  PulseLoader,
  TechBorder,
  Scanlines,

  // 插画
  CyberCityIllustration,
  CodeScreenIllustration,
  NetworkIllustration,
} from '@/components/graphics';

// ==================== 示例 1: 导航栏 ====================

export const NavigationExample = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-cyber-dark border-b border-cyber-border">
      {/* Logo */}
      <MainLogo width={150} onClick={() => console.log('Logo clicked')} />

      {/* 导航链接 */}
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-2 text-cyber-cyan hover:glow">
          <HomeIcon size={20} />
          <span>首页</span>
        </a>
        <a href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan">
          <BlogIcon size={20} />
          <span>博客</span>
        </a>
        <a href="/about" className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan">
          <UserIcon size={20} />
          <span>关于</span>
        </a>
      </div>

      {/* 操作区 */}
      <div className="flex items-center gap-4">
        <SearchIcon size={20} className="text-gray-400 hover:text-cyber-cyan cursor-pointer" />
        <GitHubIcon size={20} className="text-gray-400 hover:text-cyber-cyan cursor-pointer" />
        <TwitterIcon size={20} className="text-gray-400 hover:text-cyber-cyan cursor-pointer" />
      </div>
    </nav>
  );
};

// ==================== 示例 2: 卡片组件 ====================

export const CardExample = () => {
  return (
    <div className="relative p-6 bg-cyber-card rounded-lg overflow-hidden">
      {/* 角标装饰 */}
      <CornerBracket position="top-left" size={60} />
      <CornerBracket position="bottom-right" size={60} />

      {/* 内容 */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <CodeIcon size={32} color="#00f0ff" />
          <h3 className="text-xl font-bold text-cyber-cyan">项目标题</h3>
        </div>

        <p className="text-gray-400 mb-4">
          这是一个赛博朋克风格的卡片组件示例，包含角标装饰和霓虹效果。
        </p>

        {/* 标签 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded">
            Next.js
          </span>
          <span className="px-2 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded">
            TypeScript
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-cyber-pink hover:glow">
            <HeartIcon size={18} />
            <span>喜欢</span>
          </button>
          <button className="flex items-center gap-2 text-cyber-cyan hover:glow">
            <StarIcon size={18} />
            <span>收藏</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 示例 3: 科技边框卡片 ====================

export const TechBorderCardExample = () => {
  return (
    <div className="relative w-full h-64">
      {/* SVG 边框 */}
      <TechBorder rounded glow className="absolute inset-0" />

      {/* 内容 */}
      <div className="absolute inset-2 p-6 flex flex-col items-center justify-center">
        <TerminalIcon size={48} className="text-cyber-cyan mb-4" />
        <h3 className="text-xl font-bold text-cyber-cyan mb-2">技术栈</h3>
        <p className="text-gray-400 text-center text-sm">
          Next.js 14 · TypeScript · Tailwind CSS
        </p>
      </div>
    </div>
  );
};

// ==================== 示例 4: 加载状态 ====================

export const LoadingExample = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-12">
      {/* 环形加载器 */}
      <div className="flex flex-col items-center gap-4">
        <LoadingRing size={64} />
        <p className="text-gray-400">加载中...</p>
      </div>

      {/* 脉冲加载器 */}
      <div className="flex flex-col items-center gap-4">
        <PulseLoader size={60} />
        <p className="text-gray-400">处理中...</p>
      </div>
    </div>
  );
};

// ==================== 示例 5: 页面头部 ====================

export const PageHeaderExample = () => {
  return (
    <div className="relative py-16 px-8 text-center">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <CyberCityIllustration width={800} animated />
      </div>

      {/* 内容 */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-4">
          欢迎来到 CyberPress
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          一个基于 WordPress + Next.js 的赛博朋克风格博客平台
        </p>

        {/* CTA 按钮 */}
        <button className="px-8 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-bold rounded-lg hover:glow transition-all">
          立即开始 <ArrowRightIcon size={20} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

// ==================== 示例 6: 状态指示器 ====================

export const StatusIndicatorsExample = () => {
  return (
    <div className="space-y-4">
      {/* 成功状态 */}
      <div className="flex items-center gap-3 p-3 bg-cyber-green/10 border border-cyber-green/30 rounded">
        <CheckIcon size={20} color="#00ff88" />
        <span className="text-cyber-green">操作成功</span>
      </div>

      {/* 警告状态 */}
      <div className="flex items-center gap-3 p-3 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded">
        <WarningIcon size={20} color="#f0ff00" />
        <span className="text-cyber-yellow">请注意</span>
      </div>

      {/* 信息状态 */}
      <div className="flex items-center gap-3 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded">
        <TerminalIcon size={20} color="#00f0ff" />
        <span className="text-cyber-cyan">系统信息</span>
      </div>
    </div>
  );
};

// ==================== 示例 7: 主题切换器 ====================

export const ThemeSwitcherExample = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-2 px-4 py-2 bg-cyber-card rounded hover:bg-cyber-muted transition-colors"
    >
      {isDark ? (
        <>
          <MoonIcon size={20} className="text-cyber-purple" />
          <span className="text-gray-300">暗色模式</span>
        </>
      ) : (
        <>
          <SunIcon size={20} className="text-cyber-yellow" />
          <span className="text-gray-300">亮色模式</span>
        </>
      )}
    </button>
  );
};

// ==================== 示例 8: 分割线 ====================

export const DividersExample = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-gray-300 mb-4">简单分割线</h3>
        <DividerLine variant="simple" />
      </div>

      <div>
        <h3 className="text-gray-300 mb-4">科技风格分割线</h3>
        <DividerLine variant="tech" />
      </div>

      <div>
        <h3 className="text-gray-300 mb-4">双线分割线</h3>
        <DividerLine variant="double" />
      </div>

      <div>
        <h3 className="text-gray-300 mb-4">虚线分割线</h3>
        <DividerLine variant="dashed" />
      </div>
    </div>
  );
};

// ==================== 示例 9: 社交链接 ====================

export const SocialLinksExample = () => {
  const socialLinks = [
    { icon: GitHubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: UserIcon, href: '/about', label: 'About' },
  ];

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="p-3 bg-cyber-card rounded hover:bg-cyber-muted transition-colors group"
          aria-label={link.label}
        >
          <link.icon
            size={24}
            className="text-gray-400 group-hover:text-cyber-cyan transition-colors"
          />
        </a>
      ))}
    </div>
  );
};

// ==================== 示例 10: 文章卡片 ====================

export const ArticleCardExample = () => {
  return (
    <article className="relative overflow-hidden bg-cyber-card rounded-lg">
      {/* 装饰角标 */}
      <CornerBracket position="top-left" size={40} />

      {/* 内容 */}
      <div className="p-6">
        {/* 分类标签 */}
        <div className="flex items-center gap-2 mb-3">
          <CodeIcon size={16} className="text-cyber-cyan" />
          <span className="text-sm text-cyber-cyan">开发</span>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-white mb-3 hover:text-cyber-cyan transition-colors">
          Next.js 14 App Router 完全指南
        </h3>

        {/* 摘要 */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          深入了解 Next.js 14 的新特性，包括 Server Components、Suspense 和更多...
        </p>

        {/* 元信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>2024-03-02</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <HeartIcon size={14} />
              128
            </span>
            <span className="flex items-center gap-1">
              <StarIcon size={14} />
              64
            </span>
          </div>
        </div>
      </div>

      {/* 底部分割线 */}
      <DividerLine variant="tech" />
    </article>
  );
};

// ==================== 示例 11: 404 页面 ====================

export const NotFoundExample = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* 背景 */}
      <div className="absolute inset-0 opacity-5">
        <NetworkIllustration width={1200} animated />
      </div>

      {/* 内容 */}
      <div className="relative z-10 text-center">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          页面未找到
        </h2>
        <p className="text-gray-400 mb-8 max-w-md">
          您访问的页面可能已被移除或暂时不可用。请检查 URL 或返回首页。
        </p>

        {/* 操作按钮 */}
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 bg-cyber-cyan text-black font-bold rounded hover:glow transition-all">
            返回首页
          </button>
          <button className="px-6 py-3 bg-cyber-card text-white font-bold rounded hover:bg-cyber-muted transition-colors">
            返回上页
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 示例 12: 登录表单 ====================

export const LoginFormExample = () => {
  return (
    <div className="relative max-w-md mx-auto p-8">
      {/* 边框 */}
      <TechBorder rounded glow />

      {/* 内容 */}
      <div className="relative z-10 p-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <SquareLogo size={64} />
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          登录到 CyberPress
        </h2>

        {/* 表单 */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">用户名</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded text-white focus:border-cyber-cyan focus:outline-none transition-colors"
              placeholder="输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">密码</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded text-white focus:border-cyber-cyan focus:outline-none transition-colors"
              placeholder="输入密码"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-bold rounded hover:glow transition-all"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

// ==================== 主示例组件 ====================

export const GraphicsShowcase = () => {
  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      {/* 扫描线效果 */}
      <Scanlines className="fixed inset-0 pointer-events-none" />

      {/* 内容 */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* 标题 */}
        <div className="text-center py-12">
          <AnimatedLogo size={120} />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mt-8">
            CyberPress 图形组件展示
          </h1>
          <p className="text-gray-400 mt-4">
            完整的赛博朋克风格图形组件库
          </p>
        </div>

        {/* 导航示例 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">导航栏示例</h2>
          <NavigationExample />
        </section>

        {/* 卡片示例 */}
        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">卡片示例</h2>
            <CardExample />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">科技边框卡片</h2>
            <TechBorderCardExample />
          </div>
        </section>

        {/* 分割线示例 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">分割线示例</h2>
          <DividersExample />
        </section>

        {/* 加载示例 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">加载状态示例</h2>
          <LoadingExample />
        </section>

        {/* 状态指示器 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">状态指示器</h2>
          <StatusIndicatorsExample />
        </section>

        {/* 主题切换 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">主题切换器</h2>
          <ThemeSwitcherExample />
        </section>

        {/* 社交链接 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">社交链接</h2>
          <SocialLinksExample />
        </section>

        {/* 文章卡片 */}
        <section>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">文章卡片</h2>
          <div className="max-w-md">
            <ArticleCardExample />
          </div>
        </section>

        {/* 页脚 */}
        <footer className="text-center py-12 border-t border-cyber-border">
          <WatermarkLogo width={200} />
          <p className="text-gray-500 mt-4">
            © 2024 CyberPress. Built with Next.js & Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default GraphicsShowcase;
