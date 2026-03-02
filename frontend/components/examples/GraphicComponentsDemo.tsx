'use client';

import React from 'react';
import {
  IconLoader,
  DecorativeCorner,
  CyberDivider,
  HexagonFrame,
  BackgroundPattern,
} from '@/components/graphics';

/**
 * 图形组件展示
 *
 * 展示所有新增的图形组件
 */
export default function GraphicComponentsDemo() {
  return (
    <div className="min-h-screen bg-cyber-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-2">
            CyberPress Graphics Components
          </h1>
          <p className="text-cyber-gray-200">
            赛博朋克风格图形组件库演示
          </p>
        </div>

        {/* IconLoader 演示 */}
        <section className="bg-cyber-dark/50 rounded-lg p-6 border border-cyber-cyan/20">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            IconLoader - 动态图标加载器
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <IconLoader name="github" size={24} />
            <IconLoader name="twitter" size={32} />
            <IconLoader name="linkedin" size={40} />
            <IconLoader name="discord" size={48} />
            <IconLoader name="youtube" size={32} />
          </div>
          <pre className="mt-4 p-4 bg-cyber-black/50 rounded text-cyber-green text-sm overflow-x-auto">
{`<IconLoader name="github" size={24} />
<IconLoader name="twitter" size={32} />
<IconLoader name="linkedin" size={40} />`}
          </pre>
        </section>

        {/* DecorativeCorner 演示 */}
        <section className="bg-cyber-dark/50 rounded-lg p-8 border border-cyber-cyan/20 relative">
          <DecorativeCorner position="top-left" variant="glow" />
          <DecorativeCorner position="top-right" variant="glow" />
          <DecorativeCorner position="bottom-left" variant="glow" />
          <DecorativeCorner position="bottom-right" variant="glow" />

          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            DecorativeCorner - 装饰性角标
          </h2>
          <p className="text-cyber-gray-200 mb-4">
            四角装饰效果，支持发光变体
          </p>
          <pre className="p-4 bg-cyber-black/50 rounded text-cyber-green text-sm overflow-x-auto">
{`<DecorativeCorner position="top-left" variant="glow" />
<DecorativeCorner position="top-right" variant="glow" />
<DecorativeCorner position="bottom-left" variant="glow" />
<DecorativeCorner position="bottom-right" variant="glow" />`}
          </pre>
        </section>

        {/* CyberDivider 演示 */}
        <section className="bg-cyber-dark/50 rounded-lg p-6 border border-cyber-cyan/20">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-6">
            CyberDivider - 赛博分割线
          </h2>

          <div className="space-y-6">
            {/* Gradient */}
            <div>
              <p className="text-cyber-gray-200 mb-2">Gradient (Default)</p>
              <CyberDivider />
            </div>

            {/* Glow */}
            <div>
              <p className="text-cyber-gray-200 mb-2">Glow + Animated</p>
              <CyberDivider variant="glow" color="cyan" animated />
            </div>

            {/* Dashed */}
            <div>
              <p className="text-cyber-gray-200 mb-2">Dashed</p>
              <CyberDivider variant="dashed" color="purple" />
            </div>

            {/* Dotted */}
            <div>
              <p className="text-cyber-gray-200 mb-2">Dotted</p>
              <CyberDivider variant="dotted" color="pink" />
            </div>
          </div>

          <pre className="mt-4 p-4 bg-cyber-black/50 rounded text-cyber-green text-sm overflow-x-auto">
{`<CyberDivider />
<CyberDivider variant="glow" color="cyan" animated />
<CyberDivider variant="dashed" color="purple" />
<CyberDivider variant="dotted" color="pink" />`}
          </pre>
        </section>

        {/* HexagonFrame 演示 */}
        <section className="bg-cyber-dark/50 rounded-lg p-6 border border-cyber-cyan/20">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-6">
            HexagonFrame - 六边形框架
          </h2>

          <div className="flex flex-wrap gap-8 items-center justify-center">
            {/* Default */}
            <HexagonFrame size={150}>
              <div className="text-center">
                <p className="text-cyber-cyan font-bold">CYBER</p>
              </div>
            </HexagonFrame>

            {/* Filled */}
            <HexagonFrame size={150} variant="filled" color="purple">
              <div className="text-center">
                <p className="text-white font-bold">PUNK</p>
              </div>
            </HexagonFrame>

            {/* Glow */}
            <HexagonFrame size={150} variant="glow" color="pink" animated>
              <div className="text-center">
                <p className="text-cyber-pink font-bold">NEON</p>
              </div>
            </HexagonFrame>
          </div>

          <pre className="mt-4 p-4 bg-cyber-black/50 rounded text-cyber-green text-sm overflow-x-auto">
{`<HexagonFrame size={150}>
  <span className="text-cyber-cyan">CYBER</span>
</HexagonFrame>

<HexagonFrame size={150} variant="filled" color="purple">
  <span className="text-white">PUNK</span>
</HexagonFrame>

<HexagonFrame size={150} variant="glow" color="pink" animated>
  <span className="text-cyber-pink">NEON</span>
</HexagonFrame>`}
          </pre>
        </section>

        {/* BackgroundPattern 演示 */}
        <section className="border border-cyber-cyan/20 rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-cyber-cyan p-6 pb-4">
            BackgroundPattern - 背景图案
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {/* Grid */}
            <BackgroundPattern pattern="grid" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-cyan/30 rounded">
                <span className="text-cyber-cyan font-bold">Grid</span>
              </div>
            </BackgroundPattern>

            {/* Circuit */}
            <BackgroundPattern pattern="circuit" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-purple/30 rounded">
                <span className="text-cyber-purple font-bold">Circuit</span>
              </div>
            </BackgroundPattern>

            {/* Data Stream */}
            <BackgroundPattern pattern="data-stream" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-pink/30 rounded">
                <span className="text-cyber-pink font-bold">Data Stream</span>
              </div>
            </BackgroundPattern>

            {/* Holographic Grid */}
            <BackgroundPattern pattern="holographic-grid" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-cyan/30 rounded">
                <span className="text-cyber-cyan font-bold">Holographic</span>
              </div>
            </BackgroundPattern>

            {/* Cyber Mesh */}
            <BackgroundPattern pattern="cyber-mesh" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-purple/30 rounded">
                <span className="text-cyber-purple font-bold">Cyber Mesh</span>
              </div>
            </BackgroundPattern>

            {/* Scanlines */}
            <BackgroundPattern pattern="scanlines" opacity={0.3}>
              <div className="h-32 flex items-center justify-center border border-cyber-pink/30 rounded">
                <span className="text-cyber-pink font-bold">Scanlines</span>
              </div>
            </BackgroundPattern>
          </div>

          <div className="px-6 pb-6">
            <pre className="p-4 bg-cyber-black/50 rounded text-cyber-green text-sm overflow-x-auto">
{`<BackgroundPattern pattern="grid" opacity={0.3}>
  <div>Content with grid background</div>
</BackgroundPattern>

<BackgroundPattern pattern="holographic-grid" opacity={0.3}>
  <div>Holographic effect</div>
</BackgroundPattern>

<BackgroundPattern pattern="cyber-mesh" opacity={0.3}>
  <div>Cyber mesh pattern</div>
</BackgroundPattern>`}
            </pre>
          </div>
        </section>

        {/* 组合使用演示 */}
        <section className="relative bg-cyber-dark/50 rounded-lg p-8 border border-cyber-cyan/20 overflow-hidden">
          <BackgroundPattern pattern="cyber-mesh" opacity={0.15} className="absolute inset-0" />

          <DecorativeCorner position="top-left" variant="glow" />
          <DecorativeCorner position="top-right" variant="glow" />
          <DecorativeCorner position="bottom-left" variant="glow" />
          <DecorativeCorner position="bottom-right" variant="glow" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
              组合使用示例
            </h2>
            <p className="text-cyber-gray-200 mb-6">
              所有组件可以自由组合使用，创建丰富的视觉效果
            </p>

            <CyberDivider variant="gradient" animated className="mb-6" />

            <div className="flex justify-center">
              <HexagonFrame size={200} variant="glow" color="multi" animated>
                <div className="text-center">
                  <IconLoader name="terminal" size={48} className="mx-auto mb-2" />
                  <p className="text-cyber-cyan font-bold">CYBERPRESS</p>
                  <p className="text-cyber-purple text-sm">Graphics System</p>
                </div>
              </HexagonFrame>
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="text-center text-cyber-gray-300 text-sm">
          <p>CyberPress Graphics Components v3.0.0</p>
          <p className="text-cyber-cyan">创建时间: 2026-03-03</p>
        </footer>
      </div>
    </div>
  );
}
