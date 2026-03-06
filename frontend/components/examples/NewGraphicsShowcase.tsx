/**
 * CyberPress New Graphics Showcase
 *
 * 新增图形组件展示
 *
 * 展示 v5.0.0 新增的所有插画、图案背景组件
 */

'use client';

import React, { useState } from 'react';
import {
  HeroIllustration,
  ErrorIllustration,
  LoadingIllustration,
  EmptyIllustration,
  SuccessIllustration,
  GridPattern,
  CircuitPattern,
  HexPattern,
  DotPattern,
  ScanlinePattern,
  NoisePattern,
  PerspectiveGrid,
} from '@/components/graphics';

export default function NewGraphicsShowcase() {
  const [selectedPattern, setSelectedPattern] = useState('grid');
  const [animated, setAnimated] = useState(true);
  const [opacity, setOpacity] = useState(0.1);

  const patterns = {
    grid: GridPattern,
    circuit: CircuitPattern,
    hex: HexPattern,
    dot: DotPattern,
    scanline: ScanlinePattern,
    noise: NoisePattern,
    perspective: PerspectiveGrid,
  };

  const PatternComponent = patterns[selectedPattern as keyof typeof patterns];

  return (
    <div className="relative min-h-screen bg-cyber-dark">
      {/* 背景图案 */}
      <div className="absolute inset-0 overflow-hidden">
        <PatternComponent animated={animated} opacity={opacity} />
      </div>

      {/* 内容 */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* 页头 */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4">
            🎨 新增图形组件展示
          </h1>
          <p className="text-cyber-purple">
            CyberPress Graphics v5.0.0 - 2026-03-06
          </p>
        </header>

        {/* 控制面板 */}
        <section className="mb-12 p-6 bg-cyber-card border border-cyber-border rounded-lg">
          <h2 className="text-xl font-bold text-cyber-cyan mb-4">
            背景图案控制
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 图案选择 */}
            <div>
              <label className="block text-sm font-medium text-cyber-muted mb-2">
                选择图案
              </label>
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-cyber-cyan focus:border-cyber-cyan focus:outline-none"
              >
                <option value="grid">赛博网格</option>
                <option value="circuit">电路板</option>
                <option value="hex">六边形</option>
                <option value="dot">点阵</option>
                <option value="scanline">扫描线</option>
                <option value="noise">噪声</option>
                <option value="perspective">透视网格</option>
              </select>
            </div>

            {/* 动画开关 */}
            <div>
              <label className="block text-sm font-medium text-cyber-muted mb-2">
                动画效果
              </label>
              <button
                onClick={() => setAnimated(!animated)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  animated
                    ? 'bg-cyber-cyan text-black'
                    : 'bg-cyber-muted text-cyber-cyan'
                }`}
              >
                {animated ? '已启用' : '已禁用'}
              </button>
            </div>

            {/* 透明度 */}
            <div>
              <label className="block text-sm font-medium text-cyber-muted mb-2">
                透明度: {opacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.3"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* 插画展示 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-6">
            插画组件
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hero Illustration */}
            <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
              <h3 className="text-lg font-medium text-cyber-purple mb-4 text-center">
                Hero Illustration
              </h3>
              <div className="flex justify-center mb-4">
                <HeroIllustration width={300} height={225} animated />
              </div>
              <p className="text-sm text-cyber-muted text-center">
                赛博城市景观 - 400x300px
              </p>
            </div>

            {/* Error Illustration */}
            <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
              <h3 className="text-lg font-medium text-cyber-purple mb-4 text-center">
                Error Illustration
              </h3>
              <div className="flex justify-center mb-4">
                <ErrorIllustration width={250} height={200} />
              </div>
              <p className="text-sm text-cyber-muted text-center">
                404 错误页面 - 300x250px
              </p>
            </div>

            {/* Loading Illustration */}
            <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
              <h3 className="text-lg font-medium text-cyber-purple mb-4 text-center">
                Loading Illustration
              </h3>
              <div className="flex justify-center mb-4">
                <LoadingIllustration width={180} height={135} animated />
              </div>
              <p className="text-sm text-cyber-muted text-center">
                加载动画 - 200x150px
              </p>
            </div>

            {/* Empty Illustration */}
            <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
              <h3 className="text-lg font-medium text-cyber-purple mb-4 text-center">
                Empty Illustration
              </h3>
              <div className="flex justify-center mb-4">
                <EmptyIllustration width={200} height={160} />
              </div>
              <p className="text-sm text-cyber-muted text-center">
                空状态 - 250x200px
              </p>
            </div>

            {/* Success Illustration */}
            <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
              <h3 className="text-lg font-medium text-cyber-purple mb-4 text-center">
                Success Illustration
              </h3>
              <div className="flex justify-center mb-4">
                <SuccessIllustration width={180} height={144} animated />
              </div>
              <p className="text-sm text-cyber-muted text-center">
                成功状态 - 200x160px
              </p>
            </div>
          </div>
        </section>

        {/* 使用说明 */}
        <section className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            使用说明
          </h2>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-medium text-cyber-purple mb-2">导入组件</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  HeroIllustration,
  ErrorIllustration,
  LoadingIllustration,
  EmptyIllustration,
  SuccessIllustration,
  GridPattern,
  CircuitPattern,
  HexPattern,
  DotPattern,
  ScanlinePattern,
  NoisePattern,
  PerspectiveGrid,
} from '@/components/graphics';`}</code>
            </pre>

            <h3 className="text-lg font-medium text-cyber-purple mb-2 mt-6">使用插画</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<HeroIllustration
  width={400}
  height={300}
  animated
  className="hero-illustration"
/>`}</code>
            </pre>

            <h3 className="text-lg font-medium text-cyber-purple mb-2 mt-6">使用图案背景</h3>
            <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<div className="relative">
  <GridPattern animated opacity={0.1} />
  {/* 页面内容 */}
</div>`}</code>
            </pre>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="mt-16 text-center">
          <p className="text-cyber-muted text-sm">
            CyberPress Graphics v5.0.0 | Created by CyberPress AI Design Team
          </p>
          <p className="text-cyber-purple text-xs mt-2">
            2026-03-06
          </p>
        </footer>
      </div>
    </div>
  );
}
