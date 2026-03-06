/**
 * CyberPress Graphics Showcase
 *
 * 图形素材展示组件 - 用于展示所有可用的图形素材
 *
 * @example
 * ```tsx
 * import { GraphicsShowcase } from '@/components/graphics/GraphicsShowcaseComponent';
 *
 * <GraphicsShowcase category="all" />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DataStream,
  NetworkFlow,
  QuantumData,
  DataMatrix,
  CyberWave,
  WaveDivider,
  AudioWaveform,
  PulseWave
} from '@/components/graphics';

type Category = 'all' | 'data-flow' | 'waves' | 'patterns' | 'illustrations';

interface GraphicItem {
  id: string;
  name: string;
  category: Category;
  component: React.ComponentType<any>;
  description: string;
}

const graphics: GraphicItem[] = [
  // 数据流系列
  {
    id: 'data-stream',
    name: 'Data Stream',
    category: 'data-flow',
    component: DataStream,
    description: '数据流动画，展示赛博朋克风格的数据传输'
  },
  {
    id: 'network-flow',
    name: 'Network Flow',
    category: 'data-flow',
    component: NetworkFlow,
    description: '网络流动画，节点连接可视化'
  },
  {
    id: 'quantum-data',
    name: 'Quantum Data',
    category: 'data-flow',
    component: QuantumData,
    description: '量子数据可视化，抽象数据表示'
  },
  {
    id: 'data-matrix',
    name: 'Data Matrix',
    category: 'data-flow',
    component: DataMatrix,
    description: '数据矩阵，数字雨效果'
  },
  // 波浪系列
  {
    id: 'cyber-wave',
    name: 'Cyber Wave',
    category: 'waves',
    component: CyberWave,
    description: '赛博波浪装饰，支持顶部/底部'
  },
  {
    id: 'wave-divider',
    name: 'Wave Divider',
    category: 'waves',
    component: WaveDivider,
    description: '波浪分割线，多种风格'
  },
  {
    id: 'audio-waveform',
    name: 'Audio Waveform',
    category: 'waves',
    component: AudioWaveform,
    description: '音频波形可视化'
  },
  {
    id: 'pulse-wave',
    name: 'Pulse Wave',
    category: 'waves',
    component: PulseWave,
    description: '脉冲波浪效果'
  }
];

interface GraphicsShowcaseProps {
  category?: Category;
  className?: string;
}

export const GraphicsShowcase: React.FC<GraphicsShowcaseProps> = ({
  category = 'all',
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(category);
  const [selectedGraphic, setSelectedGraphic] = useState<GraphicItem | null>(null);

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'data-flow', label: '数据流' },
    { value: 'waves', label: '波浪' },
    { value: 'patterns', label: '图案' },
    { value: 'illustrations', label: '插画' }
  ];

  const filteredGraphics = selectedCategory === 'all'
    ? graphics
    : graphics.filter(g => g.category === selectedCategory);

  const colors = ['cyan', 'purple', 'pink'] as const;

  return (
    <div className={cn('w-full p-6', className)}>
      {/* 标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-2">
          CyberPress 图形素材库
        </h1>
        <p className="text-cyber-gray-200">
          赛博朋克风格的图形组件展示
        </p>
      </div>

      {/* 分类选择器 */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              'border-2',
              selectedCategory === cat.value
                ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                : 'border-cyber-border text-cyber-gray-200 hover:border-cyber-cyan/50'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 图形网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGraphics.map(graphic => {
          const Component = graphic.component;
          return (
            <div
              key={graphic.id}
              className={cn(
                'group relative',
                'bg-cyber-card border border-cyber-border rounded-lg',
                'overflow-hidden',
                'hover:border-cyber-cyan transition-all duration-300',
                'hover:shadow-neon-cyan cursor-pointer'
              )}
              onClick={() => setSelectedGraphic(graphic)}
            >
              {/* 预览区域 */}
              <div className="aspect-video bg-cyber-dark flex items-center justify-center p-4">
                <Component width={200} height={120} animated={true} />
              </div>

              {/* 信息区域 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-cyber-cyan mb-1">
                  {graphic.name}
                </h3>
                <p className="text-sm text-cyber-gray-200 line-clamp-2">
                  {graphic.description}
                </p>
              </div>

              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* 详细预览模态框 */}
      {selectedGraphic && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGraphic(null)}
        >
          <div
            className="bg-cyber-card border border-cyber-cyan rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-cyber-card border-b border-cyber-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cyber-cyan">
                {selectedGraphic.name}
              </h2>
              <button
                onClick={() => setSelectedGraphic(null)}
                className="text-cyber-gray-200 hover:text-cyber-cyan transition-colors"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6">
              {/* 描述 */}
              <p className="text-cyber-gray-200 mb-6">
                {selectedGraphic.description}
              </p>

              {/* 预览 */}
              <div className="bg-cyber-dark rounded-lg p-8 mb-6">
                <selectedGraphic.component
                  width={600}
                  height={400}
                  animated={true}
                />
              </div>

              {/* 代码示例 */}
              <div className="bg-cyber-darker rounded-lg p-4 border border-cyber-border">
                <h3 className="text-sm font-semibold text-cyber-cyan mb-2">
                  使用示例：
                </h3>
                <pre className="text-xs text-cyber-gray-200 overflow-x-auto">
                  <code>{`import { ${selectedGraphic.name.replace(/\s/g, '')} } from '@/components/graphics';

<${selectedGraphic.name.replace(/\s/g, '')} width={600} height={400} animated={true} />`}</code>
                </pre>
              </div>

              {/* 变体 */}
              {selectedGraphic.category === 'waves' && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-cyber-cyan mb-4">
                    颜色变体：
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {colors.map(color => (
                      <div
                        key={color}
                        className="bg-cyber-dark rounded-lg p-4 border border-cyber-border"
                      >
                        <selectedGraphic.component
                          color={color}
                          animated={true}
                        />
                        <p className="text-center text-xs text-cyber-gray-200 mt-2 capitalize">
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="mt-12 text-center">
        <div className="inline-block bg-cyber-card border border-cyber-border rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-cyber-cyan">
                {graphics.length}
              </div>
              <div className="text-sm text-cyber-gray-200">组件总数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyber-purple">
                {categories.length - 1}
              </div>
              <div className="text-sm text-cyber-gray-200">分类</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyber-pink">
                {colors.length}
              </div>
              <div className="text-sm text-cyber-gray-200">颜色变体</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyber-yellow">
                100%
              </div>
              <div className="text-sm text-cyber-gray-200">动画支持</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 快速预览组件
 */
export const GraphicPreview: React.FC<{
  graphic: GraphicItem;
  className?: string;
}> = ({ graphic, className = '' }) => {
  const Component = graphic.component;

  return (
    <div className={cn('bg-cyber-card rounded-lg overflow-hidden', className)}>
      <div className="aspect-video bg-cyber-dark flex items-center justify-center">
        <Component width={300} height={180} animated={true} />
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-cyber-cyan">{graphic.name}</h4>
        <p className="text-xs text-cyber-gray-300 line-clamp-1">{graphic.description}</p>
      </div>
    </div>
  );
};

export default GraphicsShowcase;
