/**
 * CyberPress 图标展示页面
 *
 * 展示所有赛博朋克风格的图标和图形素材
 */

import React from 'react';
import { Metadata } from 'next';
import { Logo } from '@/components/graphics/Logo';
import CyberIconGallery from '@/components/graphics/CyberIconGallery';

export const metadata: Metadata = {
  title: '图标库 v3.0 | CyberPress',
  description: '赛博朋克风格图标库 - 82个精美图标，支持动画和发光效果',
};

export default function IconsShowcasePage() {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-gray-200">
      {/* 英雄区 */}
      <section className="relative overflow-hidden border-b border-cyber-cyan/20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <Logo variant="full" size={64} animated={true} />
            </div>

            {/* 标题 */}
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
              图标库 v3.0
            </h1>

            {/* 副标题 */}
            <p className="text-xl text-cyber-cyan/80 mb-8">
              赛博朋克风格图标系统
            </p>

            {/* 统计信息 */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyber-cyan">82</div>
                <div className="text-cyber-cyan/60">总图标数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyber-purple">13</div>
                <div className="text-cyber-cyan/60">赛博朋克</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyber-pink">5</div>
                <div className="text-cyber-cyan/60">配色方案</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 新增图标展示 */}
      <section className="py-16 border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-4">
              ✨ 新增图标
            </h2>
            <p className="text-cyber-cyan/60">
              2026-03-07 最新发布的 7 个赛博朋克风格图标
            </p>
          </div>

          <CyberIconGallery
            category="cyberpunk"
            columns={4}
            showDescription={true}
            className="mb-8"
          />
        </div>
      </section>

      {/* Logo 变体展示 */}
      <section className="py-16 border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-4">
              🎨 Logo 变体
            </h2>
            <p className="text-cyber-cyan/60">
              支持多种尺寸和样式的 Logo 组件
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 完整版 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-8 text-center hover:border-cyber-cyan/50 transition-colors">
              <div className="flex items-center justify-center mb-4">
                <Logo variant="full" size={48} />
              </div>
              <h3 className="text-cyber-cyan font-mono text-sm mb-2">Full Logo</h3>
              <p className="text-cyber-cyan/60 text-xs">完整版（图标+文字）</p>
              <code className="block mt-3 text-xs text-cyber-green bg-cyber-dark/50 p-2 rounded font-mono">
                {`<Logo variant="full" size={48} />`}
              </code>
            </div>

            {/* 仅图标 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-8 text-center hover:border-cyber-cyan/50 transition-colors">
              <div className="flex items-center justify-center mb-4">
                <Logo variant="icon" size={64} />
              </div>
              <h3 className="text-cyber-cyan font-mono text-sm mb-2">Icon Only</h3>
              <p className="text-cyber-cyan/60 text-xs">仅图标</p>
              <code className="block mt-3 text-xs text-cyber-green bg-cyber-dark/50 p-2 rounded font-mono">
                {`<Logo variant="icon" size={64} />`}
              </code>
            </div>

            {/* 仅文字 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-8 text-center hover:border-cyber-cyan/50 transition-colors">
              <div className="flex items-center justify-center mb-4">
                <Logo variant="text" size={48} />
              </div>
              <h3 className="text-cyber-cyan font-mono text-sm mb-2">Text Only</h3>
              <p className="text-cyber-cyan/60 text-xs">仅文字</p>
              <code className="block mt-3 text-xs text-cyber-green bg-cyber-dark/50 p-2 rounded font-mono">
                {`<Logo variant="text" size={48} />`}
              </code>
            </div>

            {/* 极简版 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-8 text-center hover:border-cyber-cyan/50 transition-colors">
              <div className="flex items-center justify-center mb-4">
                <Logo variant="minimal" size={48} />
              </div>
              <h3 className="text-cyber-cyan font-mono text-sm mb-2">Minimal</h3>
              <p className="text-cyber-cyan/60 text-xs">极简版</p>
              <code className="block mt-3 text-xs text-cyber-green bg-cyber-dark/50 p-2 rounded font-mono">
                {`<Logo variant="minimal" size={48} />`}
              </code>
            </div>
          </div>

          {/* 动画 Logo */}
          <div className="mt-8 bg-cyber-muted/30 border border-cyber-pink/20 rounded-lg p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo variant="full" size={80} animated={true} />
            </div>
            <h3 className="text-cyber-pink font-mono text-sm mb-2">Animated Logo</h3>
            <p className="text-cyber-cyan/60 text-xs mb-4">带脉冲动画效果</p>
            <code className="text-sm text-cyber-green bg-cyber-dark/50 px-4 py-2 rounded font-mono">
              {`<Logo variant="full" size={80} animated={true} />`}
            </code>
          </div>
        </div>
      </section>

      {/* 配色方案 */}
      <section className="py-16 border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-4">
              🎨 配色方案
            </h2>
            <p className="text-cyber-cyan/60">
              赛博朋克风格标准色系
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 霓虹青 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-6 hover:border-cyber-cyan/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg shadow-glow-cyan"
                  style={{ backgroundColor: '#00f0ff' }}
                />
                <div>
                  <h3 className="text-cyber-cyan font-bold">霓虹青</h3>
                  <p className="text-cyber-cyan/60 text-sm">Neon Cyan</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #00f0ff</div>
                <div className="text-cyber-gray-200">RGB: rgb(0, 240, 255)</div>
                <div className="text-cyber-gray-200">HSL: hsl(182, 100%, 50%)</div>
              </div>
            </div>

            {/* 赛博紫 */}
            <div className="bg-cyber-muted/30 border border-cyber-purple/20 rounded-lg p-6 hover:border-cyber-purple/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg shadow-glow-purple"
                  style={{ backgroundColor: '#9d00ff' }}
                />
                <div>
                  <h3 className="text-cyber-purple font-bold">赛博紫</h3>
                  <p className="text-cyber-purple/60 text-sm">Cyber Purple</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #9d00ff</div>
                <div className="text-cyber-gray-200">RGB: rgb(157, 0, 255)</div>
                <div className="text-cyber-gray-200">HSL: hsl(277, 100%, 50%)</div>
              </div>
            </div>

            {/* 激光粉 */}
            <div className="bg-cyber-muted/30 border border-cyber-pink/20 rounded-lg p-6 hover:border-cyber-pink/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg shadow-glow-pink"
                  style={{ backgroundColor: '#ff0080' }}
                />
                <div>
                  <h3 className="text-cyber-pink font-bold">激光粉</h3>
                  <p className="text-cyber-pink/60 text-sm">Laser Pink</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #ff0080</div>
                <div className="text-cyber-gray-200">RGB: rgb(255, 0, 128)</div>
                <div className="text-cyber-gray-200">HSL: hsl(330, 100%, 50%)</div>
              </div>
            </div>

            {/* 电压黄 */}
            <div className="bg-cyber-muted/30 border border-cyber-yellow/20 rounded-lg p-6 hover:border-cyber-yellow/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{
                    backgroundColor: '#f0ff00',
                    boxShadow: '0 0 20px rgba(240, 255, 0, 0.5)'
                  }}
                />
                <div>
                  <h3 className="text-cyber-yellow font-bold">电压黄</h3>
                  <p className="text-cyber-yellow/60 text-sm">Voltage Yellow</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #f0ff00</div>
                <div className="text-cyber-gray-200">RGB: rgb(240, 255, 0)</div>
                <div className="text-cyber-gray-200">HSL: hsl(64, 100%, 50%)</div>
              </div>
            </div>

            {/* 矩阵绿 */}
            <div className="bg-cyber-muted/30 border border-cyber-green/20 rounded-lg p-6 hover:border-cyber-green/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{
                    backgroundColor: '#00ff88',
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
                  }}
                />
                <div>
                  <h3 className="text-cyber-green font-bold">矩阵绿</h3>
                  <p className="text-cyber-green/60 text-sm">Matrix Green</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #00ff88</div>
                <div className="text-cyber-gray-200">RGB: rgb(0, 255, 136)</div>
                <div className="text-cyber-gray-200">HSL: hsl(152, 100%, 50%)</div>
              </div>
            </div>

            {/* 深色背景 */}
            <div className="bg-cyber-muted/30 border border-cyber-gray-200/20 rounded-lg p-6 hover:border-cyber-gray-200/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-lg border border-cyber-cyan/30"
                  style={{ backgroundColor: '#0a0a0f' }}
                />
                <div>
                  <h3 className="text-cyber-gray-200 font-bold">深色背景</h3>
                  <p className="text-cyber-gray-200/60 text-sm">Dark Background</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-gray-200">HEX: #0a0a0f</div>
                <div className="text-cyber-gray-200">RGB: rgb(10, 10, 15)</div>
                <div className="text-cyber-gray-200">HSL: hsl(250, 20%, 5%)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使用指南 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyber-cyan mb-4">
              📖 使用指南
            </h2>
            <p className="text-cyber-cyan/60">
              快速上手 CyberPress 图标系统
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 基础用法 */}
            <div className="bg-cyber-muted/30 border border-cyber-cyan/20 rounded-lg p-6">
              <h3 className="text-cyber-cyan font-bold mb-4">基础用法</h3>
              <pre className="bg-cyber-dark/50 rounded p-4 overflow-x-auto text-sm text-cyber-green font-mono">
{`import { Icon } from '@/components/graphics/Icon';

// 默认使用
<Icon name="tech-flux" size={24} />

// 带发光效果
<Icon name="neural-mesh" size={32} glow={true} />

// 带动画
<Icon name="crystal-data" size={48} animation="pulse" />`}
              </pre>
            </div>

            {/* Logo 用法 */}
            <div className="bg-cyber-muted/30 border border-cyber-purple/20 rounded-lg p-6">
              <h3 className="text-cyber-purple font-bold mb-4">Logo 用法</h3>
              <pre className="bg-cyber-dark/50 rounded p-4 overflow-x-auto text-sm text-cyber-green font-mono">
{`import { Logo } from '@/components/graphics/Logo';

// 完整 Logo
<Logo variant="full" size={48} />

// 仅图标
<Logo variant="icon" size={32} />

// 带动画
<Logo variant="full" size={64} animated={true} />`}
              </pre>
            </div>

            {/* 按钮示例 */}
            <div className="bg-cyber-muted/30 border border-cyber-pink/20 rounded-lg p-6">
              <h3 className="text-cyber-pink font-bold mb-4">按钮示例</h3>
              <pre className="bg-cyber-dark/50 rounded p-4 overflow-x-auto text-sm text-cyber-green font-mono">
{`<button className="btn-primary">
  <Icon name="crystal-data" size={20} />
  <span>数据存储</span>
</button>`}
              </pre>
            </div>

            {/* 卡片示例 */}
            <div className="bg-cyber-muted/30 border border-cyber-green/20 rounded-lg p-6">
              <h3 className="text-cyber-green font-bold mb-4">卡片示例</h3>
              <pre className="bg-cyber-dark/50 rounded p-4 overflow-x-auto text-sm text-cyber-green font-mono">
{`<div className="card">
  <Icon name="tech-flux" size={48} glow={true} />
  <h3>能量流</h3>
  <p>实时数据流动可视化</p>
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-cyber-cyan/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo variant="minimal" size={32} />
              <span className="text-sm text-cyber-cyan/60">
                CyberPress Platform v3.0
              </span>
            </div>
            <div className="text-sm text-cyber-cyan/60">
              © 2026 CyberPress AI Design Team
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
