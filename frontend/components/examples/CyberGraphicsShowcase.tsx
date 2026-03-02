/**
 * CyberPress Graphics Showcase
 *
 * 赛博朋克风格图形素材使用示例
 *
 * @example
 * ```tsx
 * import { CyberGraphicsShowcase } from '@/components/examples/CyberGraphicsShowcase';
 *
 * <CyberGraphicsShowcase />
 * ```
 */

'use client';

import React, { useState } from 'react';
import {
  NeuralNetworkIcon,
  QuantumCoreIcon,
  DataStreamDecoration,
  CornerBracket,
  DividerLine,
  LoadingRing,
  PatternBackground,
  TechBorder,
} from '@/components/graphics';

export const CyberGraphicsShowcase: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<'neural' | 'quantum' | 'stream'>('neural');

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-gray-100 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-4">
          赛博朋克图形素材展示
        </h1>
        <p className="text-cyber-gray-200">
          Cyberpunk Graphics Components Showcase
        </p>
        <DividerLine variant="tech" className="mt-6" />
      </div>

      {/* Icon Selector */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setSelectedIcon('neural')}
            className={`px-6 py-2 rounded border transition-all ${
              selectedIcon === 'neural'
                ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                : 'border-cyber-gray-400 text-cyber-gray-200 hover:border-cyber-cyan'
            }`}
          >
            神经网络
          </button>
          <button
            onClick={() => setSelectedIcon('quantum')}
            className={`px-6 py-2 rounded border transition-all ${
              selectedIcon === 'quantum'
                ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple'
                : 'border-cyber-gray-400 text-cyber-gray-200 hover:border-cyber-purple'
            }`}
          >
            量子核心
          </button>
          <button
            onClick={() => setSelectedIcon('stream')}
            className={`px-6 py-2 rounded border transition-all ${
              selectedIcon === 'stream'
                ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
                : 'border-cyber-gray-400 text-cyber-gray-200 hover:border-cyber-pink'
            }`}
          >
            数据流
          </button>
        </div>
      </div>

      {/* Main Showcase */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Icon Display */}
        <div className="relative bg-cyber-dark rounded-lg p-8 border border-cyber-cyan/20">
          <CornerBracket position="top-left" size={80} />

          <div className="flex items-center justify-center h-80">
            {selectedIcon === 'neural' && (
              <NeuralNetworkIcon size={200} glow={true} />
            )}
            {selectedIcon === 'quantum' && (
              <QuantumCoreIcon size={200} glow={true} />
            )}
            {selectedIcon === 'stream' && (
              <DataStreamDecoration size={300} glow={true} />
            )}
          </div>

          <CornerBracket position="bottom-right" size={80} />
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-6">
          {/* Icon Info */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-purple/20">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
              {selectedIcon === 'neural' && '神经网络图标'}
              {selectedIcon === 'quantum' && '量子核心图标'}
              {selectedIcon === 'stream' && '数据流装饰'}
            </h2>
            <p className="text-cyber-gray-200 mb-4">
              {selectedIcon === 'neural' &&
                'AI 神经网络可视化，展示多层节点连接和数据流动。适合用于 AI、机器学习相关页面。'}
              {selectedIcon === 'quantum' &&
                '量子计算核心，展示轨道粒子和能量场效果。适合用于科技、计算相关页面。'}
              {selectedIcon === 'stream' &&
                '动态数据流动画，展示数据包在网络中的传输。适合用于数据传输、网络相关页面。'}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan">尺寸:</span>
                <span className="text-cyber-gray-200">可自定义 (默认 100px)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan">动画:</span>
                <span className="text-cyber-gray-200">内置 SVG 动画</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan">发光:</span>
                <span className="text-cyber-gray-200">可选霓虹发光效果</span>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-pink/20">
            <h3 className="text-lg font-bold text-cyber-purple mb-4">使用示例</h3>
            <pre className="bg-cyber-black p-4 rounded text-xs overflow-x-auto">
              <code className="text-cyber-cyan">
{`import { ${
  selectedIcon === 'neural' ? 'NeuralNetworkIcon' :
  selectedIcon === 'quantum' ? 'QuantumCoreIcon' :
  'DataStreamDecoration'
} } from '@/components/graphics';

<${
  selectedIcon === 'neural' ? 'NeuralNetworkIcon' :
  selectedIcon === 'quantum' ? 'QuantumCoreIcon' :
  'DataStreamDecoration'
}
  size={200}
  glow={true}
  className="text-cyber-cyan"
/>`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Decorations Showcase */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-cyber-cyan mb-8">装饰元素展示</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Corner Brackets */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400 relative overflow-hidden">
            <CornerBracket position="top-left" size={60} />
            <CornerBracket position="top-right" size={60} />
            <CornerBracket position="bottom-left" size={60} />
            <CornerBracket position="bottom-right" size={60} />
            <div className="flex items-center justify-center h-32">
              <span className="text-cyber-gray-200">角标装饰</span>
            </div>
          </div>

          {/* Loading Ring */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400">
            <div className="flex items-center justify-center h-32">
              <LoadingRing size={80} />
            </div>
            <p className="text-center text-cyber-gray-200 mt-4">加载环</p>
          </div>

          {/* Pattern Background */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <PatternBackground variant="grid" />
            </div>
            <div className="relative flex items-center justify-center h-32">
              <span className="text-cyber-cyan">网格背景</span>
            </div>
          </div>

          {/* Tech Border */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400">
            <div className="relative h-32">
              <TechBorder rounded={true} glow={true} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyber-cyan">科技边框</span>
              </div>
            </div>
          </div>

          {/* Divider Lines */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400 space-y-6">
            <div>
              <DividerLine variant="simple" />
              <p className="text-center text-cyber-gray-200 text-sm mt-2">简单分割线</p>
            </div>
            <div>
              <DividerLine variant="tech" />
              <p className="text-center text-cyber-gray-200 text-sm mt-2">科技分割线</p>
            </div>
          </div>

          {/* Color Variants */}
          <div className="bg-cyber-dark rounded-lg p-6 border border-cyber-gray-400">
            <p className="text-cyber-gray-200 text-center mb-4">配色方案</p>
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyber-cyan shadow-neon-cyan" />
              <div className="w-12 h-12 rounded-full bg-cyber-purple shadow-neon-purple" />
              <div className="w-12 h-12 rounded-full bg-cyber-pink shadow-neon-pink" />
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <span className="text-cyber-cyan">霓虹青</span>
              <span className="text-cyber-purple">赛博紫</span>
              <span className="text-cyber-pink">激光粉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-cyber-cyan mb-8">技术规格</h2>

        <div className="bg-cyber-dark rounded-lg p-8 border border-cyber-cyan/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-cyber-purple mb-4">格式</h3>
              <ul className="space-y-2 text-cyber-gray-200">
                <li>• SVG 矢量图形</li>
                <li>• 可缩放不失真</li>
                <li>• 支持动画</li>
                <li>• 内联组件</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-cyber-purple mb-4">性能</h3>
              <ul className="space-y-2 text-cyber-gray-200">
                <li>• 文件体积小</li>
                <li>• 无外部依赖</li>
                <li>• CSS 动画</li>
                <li>• 优化的渲染</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-cyber-purple mb-4">可定制</h3>
              <ul className="space-y-2 text-cyber-gray-200">
                <li>• 自定义尺寸</li>
                <li>• 动态颜色</li>
                <li>• 发光效果</li>
                <li>• 速度控制</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-cyber-purple mb-4">兼容</h3>
              <ul className="space-y-2 text-cyber-gray-200">
                <li>• TypeScript</li>
                <li>• React 18+</li>
                <li>• Next.js 14</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <DividerLine variant="tech" className="mb-8" />
        <p className="text-cyber-gray-300">
          CyberPress Platform - 赛博朋克图形素材库
        </p>
        <p className="text-cyber-gray-400 text-sm mt-2">
          创建日期: 2026-03-03 | 设计师: AI 图形设计师
        </p>
      </div>
    </div>
  );
};

export default CyberGraphicsShowcase;
