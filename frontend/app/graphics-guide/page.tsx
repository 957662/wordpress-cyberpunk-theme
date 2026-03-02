/**
 * CyberPress 图形资源展示页面
 *
 * 展示所有可用的图形素材及其使用方法
 */

import React from 'react';
import { MainLogo, SquareLogo, FaviconLogo, AnimatedLogo } from '@/components/graphics/Logos';
import {
  NeuralIcon,
  QuantumIcon,
  PlasmaIcon,
  DataFlowIcon,
  ChipIcon,
} from '@/components/graphics/CyberIcons';
import {
  CornerBracket,
  DividerLine,
  LoadingRing,
  PulseLoader,
  HexLoader,
  PatternBackground,
} from '@/components/graphics/Decorations';
import {
  CyberCityIllustration,
  CodeScreenIllustration,
  NetworkIllustration,
  ServerRackIllustration,
  CircuitBoardIllustration,
  WorkspaceIllustration,
} from '@/components/graphics/Illustrations';
import {
  SearchIcon,
  GitHubIcon,
  TwitterIcon,
  SettingsIcon,
  UserIcon,
  LockIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  PlusIcon,
} from '@/components/graphics/SVGIcons';

export default function GraphicsGuidePage() {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      {/* 背景图案 */}
      <div className="fixed inset-0 pointer-events-none">
        <PatternBackground variant="grid" opacity={0.05} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-glow-cyan">
            图形资源展示
          </h1>
          <p className="text-xl text-cyber-secondary">
            CyberPress 完整的图形素材库
          </p>
          <DividerLine variant="tech" className="mt-8" />
        </div>

        {/* Logo展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-purple">
            🏷️ Logo 组件
          </h2>
          <div className="cyber-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Logo */}
              <div className="text-center">
                <h3 className="mb-4 text-cyber-cyan">MainLogo</h3>
                <div className="flex justify-center items-center h-32 bg-cyber-darker rounded-lg p-4">
                  <MainLogo width={200} animated />
                </div>
                <p className="mt-2 text-sm text-cyber-secondary">主Logo (带文字)</p>
              </div>

              {/* Square Logo */}
              <div className="text-center">
                <h3 className="mb-4 text-cyber-purple">SquareLogo</h3>
                <div className="flex justify-center items-center h-32 bg-cyber-darker rounded-lg p-4">
                  <SquareLogo size={80} />
                </div>
                <p className="mt-2 text-sm text-cyber-secondary">方形Logo (仅图标)</p>
              </div>

              {/* Favicon Logo */}
              <div className="text-center">
                <h3 className="mb-4 text-cyber-pink">FaviconLogo</h3>
                <div className="flex justify-center items-center h-32 bg-cyber-darker rounded-lg p-4">
                  <FaviconLogo size={48} />
                </div>
                <p className="mt-2 text-sm text-cyber-secondary">网站图标 (32px)</p>
              </div>

              {/* Animated Logo */}
              <div className="text-center">
                <h3 className="mb-4 text-cyber-green">AnimatedLogo</h3>
                <div className="flex justify-center items-center h-32 bg-cyber-darker rounded-lg p-4">
                  <AnimatedLogo size={80} />
                </div>
                <p className="mt-2 text-sm text-cyber-secondary">动画Logo (脉冲)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 赛博朋克图标展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-cyan">
            🤖 赛博朋克图标
          </h2>
          <div className="cyber-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                { Icon: NeuralIcon, name: 'NeuralIcon', color: 'text-cyber-cyan' },
                { Icon: QuantumIcon, name: 'QuantumIcon', color: 'text-cyber-purple' },
                { Icon: PlasmaIcon, name: 'PlasmaIcon', color: 'text-cyber-pink' },
                { Icon: DataFlowIcon, name: 'DataFlowIcon', color: 'text-cyber-green' },
                { Icon: ChipIcon, name: 'ChipIcon', color: 'text-cyber-cyan' },
              ].map(({ Icon, name, color }) => (
                <div key={name} className="text-center">
                  <div className="flex justify-center items-center h-24 bg-cyber-darker rounded-lg p-2">
                    <Icon size={64} glow />
                  </div>
                  <p className={`mt-2 text-sm ${color}`}>{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 基础图标展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-purple">
            ⭐ 基础图标
          </h2>
          <div className="cyber-card p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6">
              {[
                { Icon: SearchIcon, name: 'Search' },
                { Icon: SettingsIcon, name: 'Settings' },
                { Icon: UserIcon, name: 'User' },
                { Icon: LockIcon, name: 'Lock' },
                { Icon: HeartIcon, name: 'Heart' },
                { Icon: StarIcon, name: 'Star' },
                { Icon: CheckIcon, name: 'Check' },
                { Icon: PlusIcon, name: 'Plus' },
                { Icon: GitHubIcon, name: 'GitHub' },
                { Icon: TwitterIcon, name: 'Twitter' },
              ].map(({ Icon, name }) => (
                <div key={name} className="text-center">
                  <div className="flex justify-center items-center h-16 bg-cyber-darker rounded-lg p-2">
                    <Icon size={24} className="text-cyber-cyan" />
                  </div>
                  <p className="mt-2 text-xs text-cyber-secondary">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 装饰元素展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-pink">
            ✨ 装饰元素
          </h2>
          <div className="cyber-card p-8 relative overflow-hidden">
            {/* 角标装饰示例 */}
            <CornerBracket position="top-left" size={100} />
            <CornerBracket position="top-right" size={100} />
            <CornerBracket position="bottom-left" size={100} />
            <CornerBracket position="bottom-right" size={100} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {/* 加载器 */}
              <div className="text-center">
                <h3 className="mb-4 text-cyber-cyan">LoadingRing</h3>
                <div className="flex justify-center items-center h-24 bg-cyber-darker rounded-lg">
                  <LoadingRing size={60} />
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-4 text-cyber-purple">PulseLoader</h3>
                <div className="flex justify-center items-center h-24 bg-cyber-darker rounded-lg">
                  <PulseLoader size={60} />
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-4 text-cyber-pink">HexLoader</h3>
                <div className="flex justify-center items-center h-24 bg-cyber-darker rounded-lg">
                  <HexLoader size={60} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 插画展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-cyan">
            🎭 插画组件
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 赛博城市 */}
            <div className="cyber-card p-6">
              <h3 className="mb-4 text-cyber-cyan">CyberCityIllustration</h3>
              <div className="bg-cyber-darker rounded-lg p-4 flex justify-center">
                <CyberCityIllustration width={300} animated />
              </div>
              <p className="mt-4 text-sm text-cyber-secondary">
                赛博城市场景 - 适合首页Hero区域
              </p>
            </div>

            {/* 代码屏幕 */}
            <div className="cyber-card p-6">
              <h3 className="mb-4 text-cyber-purple">CodeScreenIllustration</h3>
              <div className="bg-cyber-darker rounded-lg p-4 flex justify-center">
                <CodeScreenIllustration width={300} />
              </div>
              <p className="mt-4 text-sm text-cyber-secondary">
                代码屏幕场景 - 适合技术展示
              </p>
            </div>

            {/* 网络节点 */}
            <div className="cyber-card p-6">
              <h3 className="mb-4 text-cyber-pink">NetworkIllustration</h3>
              <div className="bg-cyber-darker rounded-lg p-4 flex justify-center">
                <NetworkIllustration width={300} animated />
              </div>
              <p className="mt-4 text-sm text-cyber-secondary">
                网络节点场景 - 适合连接可视化
              </p>
            </div>

            {/* 工作空间 */}
            <div className="cyber-card p-6">
              <h3 className="mb-4 text-cyber-green">WorkspaceIllustration</h3>
              <div className="bg-cyber-darker rounded-lg p-4 flex justify-center">
                <WorkspaceIllustration width={300} />
              </div>
              <p className="mt-4 text-sm text-cyber-secondary">
                工作空间场景 - 适合开发环境展示
              </p>
            </div>
          </div>
        </section>

        {/* 配色方案展示区 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-purple">
            🎨 配色方案
          </h2>
          <div className="cyber-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Cyber Dark', color: '#0a0a0f', text: 'text-white' },
                { name: 'Neon Cyan', color: '#00f0ff', text: 'text-black' },
                { name: 'Cyber Purple', color: '#9d00ff', text: 'text-white' },
                { name: 'Laser Pink', color: '#ff0080', text: 'text-white' },
                { name: 'Neon Green', color: '#00ff88', text: 'text-black' },
                { name: 'Voltage Yellow', color: '#f0ff00', text: 'text-black' },
              ].map(({ name, color, text }) => (
                <div key={name} className="text-center">
                  <div
                    className="h-24 rounded-lg shadow-lg mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <p className={`text-sm font-bold ${text}`}>{name}</p>
                  <p className="text-xs text-cyber-secondary">{color}</p>
                </div>
              ))}
            </div>

            {/* 渐变示例 */}
            <div className="mt-8">
              <h3 className="mb-4 text-xl text-cyber-cyan">渐变色</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
                  }}
                >
                  <p className="text-center leading-16 text-black font-bold">
                    主渐变
                  </p>
                </div>
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
                  }}
                >
                  <p className="text-center leading-16 text-black font-bold">
                    三色渐变
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使用代码示例 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-cyan">
            💻 使用示例
          </h2>
          <div className="cyber-card p-8">
            <div className="space-y-6">
              {/* Logo示例 */}
              <div>
                <h3 className="mb-2 text-lg text-cyber-cyan">Logo组件</h3>
                <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-cyber-green">
{`import { MainLogo, SquareLogo } from '@/components/graphics/Logos';

<MainLogo width={200} animated />
<SquareLogo size={64} glow />`}
                  </code>
                </pre>
              </div>

              {/* 图标示例 */}
              <div>
                <h3 className="mb-2 text-lg text-cyber-purple">基础图标</h3>
                <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-cyber-green">
{`import { SearchIcon, GitHubIcon } from '@/components/graphics/SVGIcons';

<SearchIcon size={24} className="text-cyber-cyan" />
<GitHubIcon size={32} glow />`}
                  </code>
                </pre>
              </div>

              {/* 装饰示例 */}
              <div>
                <h3 className="mb-2 text-lg text-cyber-pink">装饰元素</h3>
                <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-cyber-green">
{`import { CornerBracket, DividerLine } from '@/components/graphics/Decorations';

<CornerBracket position="top-left" size={100} />
<DividerLine variant="tech" width="full" />`}
                  </code>
                </pre>
              </div>

              {/* 插画示例 */}
              <div>
                <h3 className="mb-2 text-lg text-cyber-green">插画组件</h3>
                <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-cyber-green">
{`import { CyberCityIllustration } from '@/components/graphics/Illustrations';

<CyberCityIllustration width={400} animated />`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 快速链接 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-glow-purple">
            📚 相关文档
          </h2>
          <div className="cyber-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/docs/graphics/ICON_INDEX.md"
                className="block p-6 bg-cyber-darker rounded-lg hover:border-glow-cyan border border-cyber-border transition-all"
              >
                <h3 className="mb-2 text-xl text-cyber-cyan">图标索引</h3>
                <p className="text-sm text-cyber-secondary">
                  所有图标的完整列表和用途说明
                </p>
              </a>

              <a
                href="/docs/graphics/COLOR_REFERENCE.md"
                className="block p-6 bg-cyber-darker rounded-lg hover:border-glow-purple border border-cyber-border transition-all"
              >
                <h3 className="mb-2 text-xl text-cyber-purple">配色参考</h3>
                <p className="text-sm text-cyber-secondary">
                  详细的配色方案和使用指南
                </p>
              </a>

              <a
                href="/docs/graphics/GRAPHICS_MANIFEST.md"
                className="block p-6 bg-cyber-darker rounded-lg hover:border-glow-pink border border-cyber-border transition-all"
              >
                <h3 className="mb-2 text-xl text-cyber-pink">资源清单</h3>
                <p className="text-sm text-cyber-secondary">
                  所有图形素材的完整索引
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="text-center text-cyber-secondary">
          <DividerLine variant="tech" className="mb-8" />
          <p>CyberPress Graphics Library v1.0.0</p>
          <p className="text-sm mt-2">最后更新: 2026-03-03</p>
        </footer>
      </div>
    </div>
  );
}
