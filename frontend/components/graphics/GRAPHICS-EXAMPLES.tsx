'use client';

/**
 * CyberPress 图形素材使用示例
 *
 * 本文件展示了如何使用项目中创建的所有图形素材
 */

import React from 'react';
import Image from 'next/image';
import { CyberLogo } from './CyberLogo';
import { CyberIcon } from './CyberIcon';
import { SocialIcon } from './SocialIcon';

// ============================================
// Logo 使用示例
// ============================================

export function LogoExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-glow-cyan">Logo 示例</h2>

      {/* 使用 SVG 文件 */}
      <div className="space-y-4">
        <h3 className="text-lg">方法 1: 使用 SVG 文件</h3>
        <div className="flex gap-4 items-center bg-cyber-card p-4 rounded">
          <Image
            src="/graphics/logo-main.svg"
            alt="CyberPress Main Logo"
            width={400}
            height={120}
          />
          <Image
            src="/graphics/logo-icon.svg"
            alt="CyberPress Icon"
            width={100}
            height={100}
          />
          <Image
            src="/graphics/logo-square.svg"
            alt="CyberPress Square"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* 使用 React 组件 */}
      <div className="space-y-4">
        <h3 className="text-lg">方法 2: 使用 React 组件</h3>
        <div className="flex gap-4 items-center bg-cyber-card p-4 rounded">
          <CyberLogo size={200} variant="gradient" />
          <CyberLogo size={150} variant="cyan" />
          <CyberLogo size={100} variant="purple" animated />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 功能图标使用示例
// ============================================

export function IconExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-glow-cyan">功能图标示例</h2>

      {/* 导航图标 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">导航图标（带发光）</h3>
        <div className="flex gap-6">
          <CyberIcon name="home" size={32} glow />
          <CyberIcon name="search" size={32} glow />
          <CyberIcon name="settings" size={32} glow />
          <CyberIcon name="user" size={32} glow />
          <CyberIcon name="blog" size={32} glow />
        </div>
      </div>

      {/* 功能图标 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">功能图标（自定义颜色）</h3>
        <div className="flex gap-6">
          <CyberIcon name="portfolio" size={28} color="#9d00ff" />
          <CyberIcon name="code" size={28} color="#9d00ff" />
          <CyberIcon name="mail" size={28} color="#ff0080" />
          <CyberIcon name="heart" size={28} color="#ff0080" />
          <CyberIcon name="star" size={28} color="#f0ff00" />
        </div>
      </div>

      {/* 可点击图标 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">可点击图标</h3>
        <div className="flex gap-6">
          <CyberIcon
            name="heart"
            size={36}
            glow
            onClick={() => alert('已收藏！')}
          />
          <CyberIcon
            name="star"
            size={36}
            glow
            onClick={() => alert('已评分！')}
          />
          <CyberIcon
            name="mail"
            size={36}
            glow
            onClick={() => alert('打开邮件！')}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 社交媒体图标使用示例
// ============================================

export function SocialIconExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-glow-cyan">社交媒体图标示例</h2>

      {/* 基础用法 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">基础用法</h3>
        <div className="flex gap-6">
          <SocialIcon platform="github" size={32} />
          <SocialIcon platform="twitter" size={32} />
          <SocialIcon platform="linkedin" size={32} />
          <SocialIcon platform="youtube" size={32} />
          <SocialIcon platform="discord" size={32} />
        </div>
      </div>

      {/* 带链接的图标 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">带链接的图标</h3>
        <div className="flex gap-6">
          <SocialIcon platform="github" size={36} href="https://github.com" />
          <SocialIcon platform="twitter" size={36} href="https://twitter.com" />
          <SocialIcon platform="linkedin" size={36} href="https://linkedin.com" />
        </div>
      </div>

      {/* 发光效果 */}
      <div className="bg-cyber-card p-6 rounded">
        <h3 className="text-lg mb-4">发光效果</h3>
        <div className="flex gap-6">
          <SocialIcon platform="github" size={40} glow />
          <SocialIcon platform="discord" size={40} glow />
          <SocialIcon platform="youtube" size={40} glow color="#ff0080" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 装饰背景使用示例
// ============================================

export function DecorationExamples() {
  return (
    <div className="space-y-8">
      {/* 网格背景 */}
      <div className="relative h-64 bg-cyber-card rounded overflow-hidden">
        <Image
          src="/graphics/decorations/cyber-pattern.svg"
          alt="Cyber Pattern"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <h3 className="text-2xl font-bold text-glow-cyan">
            赛博朋克背景
          </h3>
          <p className="text-gray-300">
            使用 cyber-pattern.svg 作为背景装饰
          </p>
        </div>
      </div>

      {/* 扫描线效果 */}
      <div className="relative h-64 bg-cyber-card rounded overflow-hidden">
        <Image
          src="/graphics/decorations/scanlines.svg"
          alt="Scanlines"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 p-8">
          <h3 className="text-2xl font-bold text-glow-purple">
            扫描线效果
          </h3>
          <p className="text-gray-300">
            使用 scanlines.svg 创建 CRT 显示器效果
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 插画使用示例
// ============================================

export function IllustrationExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-glow-cyan">页面插画示例</h2>

      {/* Blog Hero */}
      <div className="space-y-4">
        <h3 className="text-lg">博客页面插画</h3>
        <div className="bg-cyber-card p-4 rounded">
          <Image
            src="/graphics/illustrations/blog-hero.svg"
            alt="Blog Hero"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Portfolio Hero */}
      <div className="space-y-4">
        <h3 className="text-lg">作品集页面插画</h3>
        <div className="bg-cyber-card p-4 rounded">
          <Image
            src="/graphics/illustrations/portfolio-hero.svg"
            alt="Portfolio Hero"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Contact Hero */}
      <div className="space-y-4">
        <h3 className="text-lg">联系页面插画</h3>
        <div className="bg-cyber-card p-4 rounded">
          <Image
            src="/graphics/illustrations/contact-hero.svg"
            alt="Contact Hero"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 综合使用示例
// ============================================

export function ComprehensiveExample() {
  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* 背景装饰 */}
      <Image
        src="/graphics/decorations/cyber-pattern.svg"
        alt=""
        fill
        className="object-cover opacity-20"
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="flex justify-between items-center mb-12">
          <CyberLogo size={150} variant="gradient" />
          <nav className="flex gap-4">
            <CyberIcon name="home" size={24} glow />
            <CyberIcon name="search" size={24} glow />
            <CyberIcon name="user" size={24} glow />
          </nav>
        </header>

        {/* Hero 区域 */}
        <section className="text-center mb-12">
          <div className="mb-8">
            <Image
              src="/graphics/illustrations/blog-hero.svg"
              alt="Blog"
              width={800}
              height={400}
              className="w-full max-w-4xl mx-auto"
            />
          </div>
        </section>

        {/* 功能卡片 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-cyber-card p-6 rounded cyber-card">
            <CyberIcon name="blog" size={48} glow />
            <h3 className="text-xl font-bold mt-4 mb-2">博客</h3>
            <p className="text-gray-400">探索最新文章和见解</p>
          </div>
          <div className="bg-cyber-card p-6 rounded cyber-card">
            <CyberIcon name="portfolio" size={48} glow />
            <h3 className="text-xl font-bold mt-4 mb-2">作品集</h3>
            <p className="text-gray-400">查看我们的项目</p>
          </div>
          <div className="bg-cyber-card p-6 rounded cyber-card">
            <CyberIcon name="mail" size={48} glow />
            <h3 className="text-xl font-bold mt-4 mb-2">联系</h3>
            <p className="text-gray-400">与我们取得联系</p>
          </div>
        </section>

        {/* 社交链接 */}
        <footer className="text-center">
          <div className="flex justify-center gap-6 mb-4">
            <SocialIcon platform="github" size={36} glow href="https://github.com" />
            <SocialIcon platform="twitter" size={36} glow href="https://twitter.com" />
            <SocialIcon platform="discord" size={36} glow href="https://discord.com" />
          </div>
          <p className="text-gray-500">© 2026 CyberPress Platform</p>
        </footer>
      </div>
    </div>
  );
}

// ============================================
// 图标集合展示
// ============================================

export function IconGallery() {
  const iconNames = [
    'home', 'search', 'settings', 'user', 'blog',
    'portfolio', 'code', 'mail', 'heart', 'star'
  ] as const;

  return (
    <div className="p-8 bg-cyber-card rounded">
      <h2 className="text-2xl font-bold text-glow-cyan mb-6">图标画廊</h2>
      <div className="grid grid-cols-5 gap-4">
        {iconNames.map((name) => (
          <div
            key={name}
            className="flex flex-col items-center p-4 bg-cyber-dark rounded hover:bg-cyber-muted transition-colors"
          >
            <CyberIcon name={name} size={32} glow />
            <span className="text-sm mt-2 capitalize text-gray-400">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 颜色方案展示
// ============================================

export function ColorPalette() {
  const colors = [
    { name: '霓虹青', value: '#00f0ff', description: '主要强调色' },
    { name: '赛博紫', value: '#9d00ff', description: '次要强调色' },
    { name: '激光粉', value: '#ff0080', description: '警告/强调' },
    { name: '赛博绿', value: '#00ff88', description: '成功状态' },
    { name: '赛博黄', value: '#f0ff00', description: '高亮颜色' },
    { name: '深色背景', value: '#0a0a0f', description: '主背景' },
    { name: '卡片背景', value: '#16162a', description: '卡片/面板' },
    { name: '边框颜色', value: '#2a2a4a', description: '默认边框' },
  ];

  return (
    <div className="p-8 bg-cyber-card rounded">
      <h2 className="text-2xl font-bold text-glow-cyan mb-6">配色方案</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div
            key={color.value}
            className="bg-cyber-dark p-4 rounded overflow-hidden"
          >
            <div
              className="w-full h-20 rounded mb-3"
              style={{ backgroundColor: color.value }}
            />
            <h4 className="font-bold">{color.name}</h4>
            <code className="text-sm text-gray-400">{color.value}</code>
            <p className="text-sm text-gray-500 mt-1">{color.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
