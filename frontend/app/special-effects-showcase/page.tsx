/**
 * CyberPress Special Effects Showcase
 *
 * 特效图标和装饰元素展示页面
 */

'use client';

import React, { useState } from 'react';
import {
  HologramIcon,
  GlitchIcon,
  MatrixIcon,
  DataFlowIcon,
  NeuralNetworkIcon,
  EnergyCoreIcon
} from '@/components/icons/SpecialEffectsIcons';
import {
  CyberCorners,
  TechLines,
  NeonParticles,
  HexGrid,
  PulseRing,
  CodeRain,
  GlitchStripes
} from '@/components/graphics/DecorativeElements';

export default function SpecialEffectsShowcase() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const effectIcons = [
    { id: 'hologram', name: '全息投影', icon: HologramIcon, description: '扫描线动画效果' },
    { id: 'glitch', name: '故障效果', icon: GlitchIcon, description: 'RGB分离 + 抖动' },
    { id: 'matrix', name: '矩阵雨', icon: MatrixIcon, description: '代码下落效果' },
    { id: 'dataflow', name: '数据流动', icon: DataFlowIcon, description: '节点传输动画' },
    { id: 'neural', name: '神经网络', icon: NeuralNetworkIcon, description: 'AI连接效果' },
    { id: 'energy', name: '能量核心', icon: EnergyCoreIcon, description: '脉冲光环效果' }
  ];

  const decorativeElements = [
    { id: 'corners', name: '角落装饰', description: '四角科技感装饰' },
    { id: 'techlines', name: '科技线条', description: '电路线路背景' },
    { id: 'particles', name: '霓虹粒子', description: '漂浮光点效果' },
    { id: 'hexgrid', name: '六边形网格', description: '蜂窝状背景' },
    { id: 'pulsering', name: '脉冲光环', description: '扩散圆形波纹' },
    { id: 'coderain', name: '代码雨', description: 'Matrix风格下落' },
    { id: 'glitchstripes', name: '故障条纹', description: 'RGB分离条纹' }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* 页面头部 */}
      <header className="relative py-20 overflow-hidden border-b border-cyber-border">
        <div className="absolute inset-0">
          <TechLines density="medium" animated={true} />
        </div>
        <div className="absolute inset-0">
          <NeonParticles count={20} size={3} animated={true} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
            ⭐ 特效图标与装饰元素
          </h1>
          <p className="text-xl text-text-secondary">
            CyberPress Special Effects Gallery
          </p>
          <p className="mt-4 text-text-muted">
            6 个特效图标 + 7 个装饰元素 = 无限创意可能
          </p>
        </div>
      </header>

      {/* 特效图标展示 */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-cyber-cyan flex items-center gap-3">
          <span className="text-4xl">✨</span>
          特效图标
          <span className="text-sm font-normal text-text-secondary bg-cyber-card px-3 py-1 rounded-full">
            6 components
          </span>
        </h2>
        <p className="text-text-secondary mb-8">
          带有动画效果的赛博朋克风格图标，适用于加载状态、数据传输、系统提示等场景
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {effectIcons.map((effect) => {
            const IconComponent = effect.icon;
            return (
              <div
                key={effect.id}
                className="relative group bg-cyber-card border border-cyber-border rounded-xl p-8 overflow-hidden hover:border-cyber-cyan transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEffect(effect.id)}
              >
                {/* 背景装饰 */}
                <div className="absolute inset-0 opacity-10">
                  <HexGrid cellSize={20} color="#00f0ff" opacity={0.1} />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  {/* 图标 */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={64} animated={true} />
                  </div>

                  {/* 名称 */}
                  <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
                    {effect.name}
                  </h3>

                  {/* 描述 */}
                  <p className="text-sm text-text-secondary mb-4">
                    {effect.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    <span className="text-xs bg-cyber-dark px-2 py-1 rounded text-text-muted">
                      animated
                    </span>
                    <span className="text-xs bg-cyber-dark px-2 py-1 rounded text-text-muted">
                      SVG
                    </span>
                  </div>
                </div>

                {/* 悬浮发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 装饰元素展示 */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-cyber-purple flex items-center gap-3">
          <span className="text-4xl">🎨</span>
          装饰元素
          <span className="text-sm font-normal text-text-secondary bg-cyber-card px-3 py-1 rounded-full">
            7 components
          </span>
        </h2>
        <p className="text-text-secondary mb-8">
          用于页面美化和视觉增强的装饰性组件，可单独使用或组合叠加
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CyberCorners */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl p-8 h-64 overflow-hidden group">
            <CyberCorners size={80} color="#00f0ff" glow={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
                CyberCorners
              </h3>
              <p className="text-sm text-text-secondary">角落装饰</p>
              <p className="text-xs text-text-muted mt-2">四角科技感装饰</p>
            </div>
          </div>

          {/* TechLines */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl p-8 h-64 overflow-hidden group">
            <TechLines density="high" color="#9d00ff" animated={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-purple mb-2">
                TechLines
              </h3>
              <p className="text-sm text-text-secondary">科技线条</p>
              <p className="text-xs text-text-muted mt-2">电路线路背景</p>
            </div>
          </div>

          {/* NeonParticles */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl p-8 h-64 overflow-hidden group">
            <NeonParticles count={30} size={4} color="#ff0080" animated={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-pink mb-2">
                NeonParticles
              </h3>
              <p className="text-sm text-text-secondary">霓虹粒子</p>
              <p className="text-xs text-text-muted mt-2">漂浮光点效果</p>
            </div>
          </div>

          {/* HexGrid */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl p-8 h-64 overflow-hidden group">
            <HexGrid cellSize={25} color="#00f0ff" opacity={0.15} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
                HexGrid
              </h3>
              <p className="text-sm text-text-secondary">六边形网格</p>
              <p className="text-xs text-text-muted mt-2">蜂窝状背景</p>
            </div>
          </div>

          {/* PulseRing */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl p-8 h-64 overflow-hidden group flex items-center justify-center">
            <PulseRing size={150} color="#f0ff00" animated={true} />
            <div className="absolute">
              <h3 className="text-xl font-semibold text-cyber-yellow mb-2 text-center">
                PulseRing
              </h3>
              <p className="text-sm text-text-secondary text-center">脉冲光环</p>
            </div>
          </div>

          {/* CodeRain */}
          <div className="relative bg-cyber-darker border border-cyber-border rounded-xl overflow-hidden h-64 group">
            <CodeRain density={12} color="#00ff88" animated={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-green mb-2">
                CodeRain
              </h3>
              <p className="text-sm text-text-secondary">代码雨</p>
              <p className="text-xs text-text-muted mt-2">Matrix风格下落</p>
            </div>
          </div>

          {/* GlitchStripes */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl overflow-hidden h-64 group">
            <GlitchStripes count={5} colors={['#ff0080', '#00f0ff', '#00ff88']} animated={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full bg-cyber-dark/80">
              <h3 className="text-xl font-semibold text-cyber-pink mb-2">
                GlitchStripes
              </h3>
              <p className="text-sm text-text-secondary">故障条纹</p>
              <p className="text-xs text-text-muted mt-2">RGB分离条纹</p>
            </div>
          </div>

          {/* 组合效果 */}
          <div className="relative bg-cyber-card border border-cyber-border rounded-xl overflow-hidden h-64 group">
            <CyberCorners size={100} color="#ff0080" glow={true} />
            <TechLines density="medium" color="#ff0080" animated={true} />
            <NeonParticles count={20} size={3} color="#ff0080" animated={true} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-cyber-pink mb-2">
                组合效果
              </h3>
              <p className="text-sm text-text-secondary">多元素叠加</p>
              <p className="text-xs text-text-muted mt-2">复合装饰示例</p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用场景示例 */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyber-green flex items-center gap-3">
          <span className="text-4xl">💡</span>
          使用场景示例
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 加载状态 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-cyan">加载状态</h3>
            <div className="space-y-4">
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center">
                <HologramIcon size={48} animated={true} />
                <p className="mt-2 text-sm text-text-secondary">全息加载</p>
              </div>
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center">
                <PulseRing size={60} animated={true} />
                <p className="mt-2 text-sm text-text-secondary">脉冲加载</p>
              </div>
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center">
                <EnergyCoreIcon size={48} animated={true} />
                <p className="mt-2 text-sm text-text-secondary">能量加载</p>
              </div>
            </div>
          </div>

          {/* 状态指示 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-purple">状态指示</h3>
            <div className="space-y-4">
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center border border-cyber-green">
                <DataFlowIcon size={48} animated={true} />
                <p className="mt-2 text-sm text-cyber-green">数据同步中</p>
              </div>
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center border border-cyber-cyan">
                <NeuralNetworkIcon size={48} animated={true} />
                <p className="mt-2 text-sm text-cyber-cyan">AI处理中</p>
              </div>
              <div className="bg-cyber-dark rounded-lg p-4 flex flex-col items-center border border-cyber-pink">
                <GlitchIcon size={48} animated={true} />
                <p className="mt-2 text-sm text-cyber-pink">系统错误</p>
              </div>
            </div>
          </div>

          {/* 页面装饰 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-pink">页面装饰</h3>
            <div className="space-y-4">
              <div className="relative bg-cyber-dark rounded-lg overflow-hidden h-32">
                <TechLines density="low" color="#00f0ff" animated={true} />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <p className="text-sm text-cyber-cyan">科技线条</p>
                </div>
              </div>
              <div className="relative bg-cyber-dark rounded-lg overflow-hidden h-32">
                <NeonParticles count={15} size={3} color="#9d00ff" animated={true} />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <p className="text-sm text-cyber-purple">霓虹粒子</p>
                </div>
              </div>
              <div className="relative bg-cyber-dark rounded-lg overflow-hidden h-32">
                <HexGrid cellSize={20} color="#ff0080" opacity={0.2} />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <p className="text-sm text-cyber-pink">六边形网格</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyber-yellow flex items-center gap-3">
          <span className="text-4xl">🚀</span>
          快速开始
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 安装导入 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-cyan">1. 导入组件</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-cyber-green">{`// 特效图标
import {
  HologramIcon,
  GlitchIcon,
  MatrixIcon
} from '@/components/icons/SpecialEffectsIcons';

// 装饰元素
import {
  CyberCorners,
  TechLines,
  NeonParticles
} from '@/components/graphics/DecorativeElements';`}</code>
            </pre>
          </div>

          {/* 基础使用 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-purple">2. 基础使用</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-cyber-green">{`// 特效图标
<HologramIcon size={64} animated={true} />

// 装饰元素
<div className="relative">
  <CyberCorners size={100} />
  <div className="relative z-10">
    内容
  </div>
</div>`}</code>
            </pre>
          </div>

          {/* 自定义配置 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-pink">3. 自定义配置</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-cyber-green">{`// 自定义颜色
<HologramIcon
  size={64}
  color="#ff0080"
  animated={true}
/>

// 调整密度
<TechLines
  density="high"  // low | medium | high
  color="#9d00ff"
  animated={true}
/>`}</code>
            </pre>
          </div>

          {/* 组合使用 */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-yellow">4. 组合使用</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-cyber-green">{`// 多层装饰叠加
<div className="relative">
  <HexGrid opacity={0.1} />
  <TechLines density="medium" />
  <NeonParticles count={20} />
  <CyberCorners glow={true} />
  <div className="relative z-10">
    页面内容
  </div>
</div>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* API 文档 */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyber-green flex items-center gap-3">
          <span className="text-4xl">📖</span>
          API 文档
        </h2>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-cyber-cyan">EffectIconProps</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-border">
                  <th className="text-left py-3 px-4 text-cyber-cyan">属性</th>
                  <th className="text-left py-3 px-4 text-cyber-cyan">类型</th>
                  <th className="text-left py-3 px-4 text-cyber-cyan">默认值</th>
                  <th className="text-left py-3 px-4 text-cyber-cyan">描述</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-cyber-border/50">
                  <td className="py-3 px-4 font-mono text-cyber-yellow">size</td>
                  <td className="py-3 px-4">number</td>
                  <td className="py-3 px-4">48</td>
                  <td className="py-3 px-4">图标尺寸</td>
                </tr>
                <tr className="border-b border-cyber-border/50">
                  <td className="py-3 px-4 font-mono text-cyber-yellow">animated</td>
                  <td className="py-3 px-4">boolean</td>
                  <td className="py-3 px-4">true</td>
                  <td className="py-3 px-4">是否启用动画</td>
                </tr>
                <tr className="border-b border-cyber-border/50">
                  <td className="py-3 px-4 font-mono text-cyber-yellow">color</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">自定义颜色</td>
                </tr>
                <tr className="border-b border-cyber-border/50">
                  <td className="py-3 px-4 font-mono text-cyber-yellow">className</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">''</td>
                  <td className="py-3 px-4">自定义类名</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-cyber-yellow">onClick</td>
                  <td className="py-3 px-4">() => void</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">点击事件</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 页面脚部 */}
      <footer className="py-12 border-t border-cyber-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-text-secondary">
            ⭐ CyberPress Special Effects Gallery
          </p>
          <p className="mt-2 text-sm text-text-muted">
            6 个特效图标 + 7 个装饰元素 | © 2026 CyberPress Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
