/**
 * CyberPress Icon Showcase
 *
 * 展示所有赛博朋克风格图标组件
 */

'use client';

import React, { useState } from 'react';
import {
  CpuIcon,
  DatabaseIcon,
  NetworkIcon,
  ShieldLockIcon,
  HologramIcon,
  ChipIcon,
} from '@/components/icons';

type IconVariant = 'cyan' | 'purple' | 'pink' | 'yellow';

const iconVariants: IconVariant[] = ['cyan', 'purple', 'pink', 'yellow'];

const variantColors = {
  cyan: 'bg-cyber-cyan',
  purple: 'bg-cyber-purple',
  pink: 'bg-cyber-pink',
  yellow: 'bg-cyber-yellow',
};

export const CyberIconShowcase: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<IconVariant>('cyan');
  const [animated, setAnimated] = useState(false);

  const icons = [
    { name: 'CPU', component: CpuIcon, description: '处理器图标' },
    { name: 'Database', component: DatabaseIcon, description: '数据库图标' },
    { name: 'Network', component: NetworkIcon, description: '网络图标' },
    { name: 'Shield Lock', component: ShieldLockIcon, description: '安全锁图标' },
    { name: 'Hologram', component: HologramIcon, description: '全息图图标' },
    { name: 'Chip', component: ChipIcon, description: '芯片图标' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* 标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-4">
          CyberPress Icon Library
        </h1>
        <p className="text-cyber-gray-200 text-lg">
          赛博朋克风格图标组件展示
        </p>
      </div>

      {/* 控制面板 */}
      <div className="mb-8 p-6 bg-cyber-card border border-cyber-border rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 颜色选择器 */}
          <div className="flex items-center gap-4">
            <span className="text-cyber-gray-200 font-medium">颜色变体:</span>
            <div className="flex gap-2">
              {iconVariants.map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${selectedVariant === variant
                      ? `${variantColors[variant]} text-cyber-black shadow-neon-${variant === 'cyan' ? 'cyan' : variant === 'purple' ? 'purple' : variant === 'pink' ? 'pink' : 'yellow'}`
                      : 'bg-cyber-muted text-cyber-gray-200 hover:bg-cyber-border'
                    }
                  `}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* 动画开关 */}
          <div className="flex items-center gap-4">
            <span className="text-cyber-gray-200 font-medium">动画效果:</span>
            <button
              onClick={() => setAnimated(!animated)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${animated
                  ? 'bg-cyber-green text-cyber-black shadow-neon-cyan'
                  : 'bg-cyber-muted text-cyber-gray-200 hover:bg-cyber-border'
                }
              `}
            >
              {animated ? '开启' : '关闭'}
            </button>
          </div>
        </div>
      </div>

      {/* 图标网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {icons.map(({ name, component: IconComponent, description }) => (
          <div
            key={name}
            className="group relative p-6 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan transition-all duration-300"
          >
            {/* 图标展示区 */}
            <div className="flex items-center justify-center h-48 mb-4">
              <IconComponent
                size={96}
                variant={selectedVariant}
                animated={animated}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* 图标信息 */}
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-cyber-cyan mb-2">
                {name}
              </h3>
              <p className="text-sm text-cyber-gray-300 mb-4">
                {description}
              </p>

              {/* 使用代码 */}
              <div className="mt-4 p-3 bg-cyber-black rounded border border-cyber-border">
                <code className="text-xs text-cyber-gray-400 font-mono">
                  {`<${name}Icon size={96} variant="${selectedVariant}" ${animated ? 'animated={true}' : ''} />`}
                </code>
              </div>
            </div>

            {/* 悬浮发光效果 */}
            <div className={`
              absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
              shadow-${selectedVariant === 'cyan' ? 'neon-cyan' : selectedVariant === 'purple' ? 'neon-purple' : selectedVariant === 'pink' ? 'neon-pink' : 'neon-yellow'}
            `} />
          </div>
        ))}
      </div>

      {/* 使用说明 */}
      <div className="mt-12 p-6 bg-cyber-card border border-cyber-border rounded-lg">
        <h2 className="text-2xl font-display font-bold text-cyber-purple mb-4">
          使用说明
        </h2>
        <div className="space-y-4 text-cyber-gray-200">
          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">导入方式</h3>
            <div className="p-4 bg-cyber-black rounded border border-cyber-border">
              <code className="text-sm text-cyber-gray-400 font-mono">
                {`import { CpuIcon, DatabaseIcon, NetworkIcon } from '@/components/icons';`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">基础用法</h3>
            <div className="p-4 bg-cyber-black rounded border border-cyber-border">
              <code className="text-sm text-cyber-gray-400 font-mono">
                {`<CpuIcon size={48} variant="cyan" />
<DatabaseIcon size={64} variant="purple" animated={true} />
<NetworkIcon size={32} variant="pink" className="opacity-80" />`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cyber-cyan mb-2">可用属性</h3>
            <ul className="list-disc list-inside space-y-1 text-cyber-gray-300">
              <li><code className="text-cyber-pink">size</code>: 图标尺寸（默认 48）</li>
              <li><code className="text-cyber-pink">variant</code>: 颜色变体（cyan | purple | pink | yellow）</li>
              <li><code className="text-cyber-pink">className</code>: 自定义 Tailwind 类名</li>
              <li><code className="text-cyber-pink">animated</code>: 是否启用脉冲动画（默认 false）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberIconShowcase;
