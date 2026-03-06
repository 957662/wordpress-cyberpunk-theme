/**
 * CyberPress SVG 图形素材库
 * 展示所有可用的 SVG 图形素材
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GraphicAsset {
  name: string;
  path: string;
  category: string;
  description: string;
  dimensions: string;
}

const graphicAssets: GraphicAsset[] = [
  // Logo 系列
  {
    name: '主 Logo',
    path: '/logo.svg',
    category: 'Logo',
    description: '导航栏、页眉使用',
    dimensions: '200x60',
  },
  {
    name: 'Logo 图标',
    path: '/logo-icon.svg',
    category: 'Logo',
    description: '独立展示、应用图标',
    dimensions: '100x100',
  },
  {
    name: 'Logo 标志',
    path: '/logo-mark.svg',
    category: 'Logo',
    description: 'Favicon、小尺寸展示',
    dimensions: '50x50',
  },

  // 装饰图案
  {
    name: '网格图案',
    path: '/patterns/grid.svg',
    category: 'Pattern',
    description: '背景网格装饰',
    dimensions: '200x200',
  },
  {
    name: '电路图案',
    path: '/patterns/circuit.svg',
    category: 'Pattern',
    description: '科技感电路装饰',
    dimensions: '200x200',
  },
  {
    name: '扫描线',
    path: '/patterns/scanlines.svg',
    category: 'Pattern',
    description: '复古扫描线效果',
    dimensions: '200x200',
  },
  {
    name: '噪点图案',
    path: '/patterns/noise.svg',
    category: 'Pattern',
    description: '纹理噪点效果',
    dimensions: '200x200',
  },
  {
    name: '六边形图案',
    path: '/patterns/hexagon.svg',
    category: 'Pattern',
    description: '赛博朋克六边形',
    dimensions: '200x200',
  },

  // 赛博朋克图标
  {
    name: '故障艺术',
    path: '/icons/cyberpunk/glitch-art.svg',
    category: 'Cyberpunk',
    description: '故障效果图标',
    dimensions: '24x24',
  },
  {
    name: '矩阵代码',
    path: '/icons/cyberpunk/matrix-code.svg',
    category: 'Cyberpunk',
    description: '代码雨效果',
    dimensions: '24x24',
  },
  {
    name: '赛博盾牌',
    path: '/icons/cyberpunk/cyber-shield.svg',
    category: 'Cyberpunk',
    description: '安全防护图标',
    dimensions: '24x24',
  },
  {
    name: '全息图标',
    path: '/icons/cyberpunk/hologram-icon.svg',
    category: 'Cyberpunk',
    description: '全息投影效果',
    dimensions: '24x24',
  },
  {
    name: '数据脉冲',
    path: '/icons/cyberpunk/data-pulse.svg',
    category: 'Cyberpunk',
    description: '数据波形显示',
    dimensions: '24x24',
  },

  // 插画
  {
    name: '英雄区装饰',
    path: '/illustrations/hero-decoration.svg',
    category: 'Illustration',
    description: '首页装饰插画',
    dimensions: '400x400',
  },
  {
    name: '404 错误页',
    path: '/illustrations/error-404.svg',
    category: 'Illustration',
    description: '错误页插画',
    dimensions: '400x300',
  },
  {
    name: '加载动画',
    path: '/illustrations/loading-spinner.svg',
    category: 'Illustration',
    description: '加载旋转动画',
    dimensions: '100x100',
  },
];

const categories = Array.from(new Set(graphicAssets.map((asset) => asset.category)));

export default function SVGGraphicsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const filteredAssets =
    selectedCategory === 'All'
      ? graphicAssets
      : graphicAssets.filter((asset) => asset.category === selectedCategory);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
            SVG 图形素材库
          </h1>
          <p className="text-cyber-muted text-lg">
            赛博朋克风格矢量图形素材展示
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded border transition ${
              selectedCategory === 'All'
                ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded border transition ${
                selectedCategory === category
                  ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                  : 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Graphics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.path}
              className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden hover:border-cyber-cyan transition group"
            >
              {/* Preview */}
              <div className="bg-cyber-dark p-8 flex items-center justify-center min-h-[200px] relative">
                <div className="relative w-32 h-32 group-hover:shadow-neon-cyan transition">
                  <Image
                    src={asset.path}
                    alt={asset.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute top-2 right-2 text-xs bg-cyber-muted px-2 py-1 rounded">
                  {asset.dimensions}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
                  <span className="text-xs bg-cyber-purple/20 text-cyber-purple px-2 py-1 rounded">
                    {asset.category}
                  </span>
                </div>
                <p className="text-sm text-cyber-muted mb-4">{asset.description}</p>

                {/* Usage Code */}
                <div className="bg-cyber-dark rounded p-3 relative group/code">
                  <pre className="text-xs text-cyber-cyan overflow-x-auto">
                    <code>{`<Image src="${asset.path}" />`}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(asset.path)}
                    className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition bg-cyber-cyan text-cyber-dark px-2 py-1 rounded text-xs"
                  >
                    {copiedPath === asset.path ? '已复制!' : '复制'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">使用指南</h2>

          <div className="space-y-6">
            {/* Basic Usage */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">基础使用</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`import Image from 'next/image';

// 使用 SVG 图片
<Image
  src="/logo.svg"
  alt="Logo"
  width={200}
  height={60}
/>`}
                </code>
              </pre>
            </div>

            {/* Background Pattern */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">背景图案</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 在 Tailwind CSS 中使用
<div className="bg-cyber-dark">
  <div className="absolute inset-0 opacity-10">
    <Image
      src="/patterns/grid.svg"
      alt="Grid pattern"
      fill
      className="object-cover"
    />
  </div>
  {/* 内容 */}
</div>

// 或使用 CSS background
.pattern-bg {
  background-image: url('/patterns/circuit.svg');
  background-repeat: repeat;
  background-opacity: 0.1;
}`}
                </code>
              </pre>
            </div>

            {/* Inline SVG */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">内联 SVG</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`// 直接导入 SVG 文件
import CyberLogo from '/logo.svg';

// 使用作为组件
<CyberLogo className="w-48 h-16" />

// 或自定义样式
<CyberLogo
  style={{
    width: '200px',
    height: '60px',
    filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))'
  }}
/>`}
                </code>
              </pre>
            </div>

            {/* Responsive Images */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyber-purple">响应式图片</h3>
              <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
                <code className="text-sm">
{`<Image
  src="/illustrations/hero-decoration.svg"
  alt="Hero decoration"
  fill
  className="object-contain"
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div className="mt-8 bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-cyber-cyan">颜色自定义</h2>
          <p className="text-cyber-muted mb-4">
            SVG 图形支持通过 CSS 变量和滤镜来自定义颜色：
          </p>
          <pre className="bg-cyber-dark p-4 rounded border border-cyber-border overflow-x-auto">
            <code className="text-sm">
{`// 使用 CSS 滤镜改变颜色
.filter-cyan {
  filter: brightness(0) saturate(100%) invert(70%) sepia(100%) saturate(500%) hue-rotate(130deg);
}

.filter-purple {
  filter: brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(500%) hue-rotate(220deg);
}

// 使用 currentColor
<svg class="text-cyber-cyan" fill="currentColor">
  {/* SVG 内容 */}
</svg>

// 使用 CSS 变量
<svg style="--icon-color: #00f0ff; fill: var(--icon-color)">
  {/* SVG 内容 */}
</svg>`}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-cyber-muted">
          <p>
            点击复制按钮获取路径 • 更多素材见{' '}
            <a href="/docs/graphics" className="text-cyber-cyan hover:underline">
              图形素材文档
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
