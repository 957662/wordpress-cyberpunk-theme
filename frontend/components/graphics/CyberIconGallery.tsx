/**
 * CyberPress 图标展示组件
 *
 * 展示所有赛博朋克风格的图标
 *
 * @example
 * ```tsx
 * <CyberIconGallery category="all" />
 * <CyberIconGallery category="cyberpunk" />
 * ```
 */

import React, { useState } from 'react';
import Image from 'next/image';

export interface CyberIcon {
  name: string;
  category: string;
  description: string;
  colors: string[];
}

const cyberIcons: CyberIcon[] = [
  // 新增赛博朋克图标
  {
    name: 'tech-flux',
    category: 'cyberpunk',
    description: '能量流动核心',
    colors: ['#00f0ff', '#9d00ff', '#ff0080']
  },
  {
    name: 'neural-mesh',
    category: 'cyberpunk',
    description: '神经网络网格',
    colors: ['#00f0ff', '#9d00ff']
  },
  {
    name: 'crystal-data',
    category: 'cyberpunk',
    description: '水晶数据存储',
    colors: ['#00f0ff', '#ff0080']
  },
  {
    name: 'cyber-eye',
    category: 'cyberpunk',
    description: '赛博电子眼',
    colors: ['#00f0ff', '#ff0080']
  },
  {
    name: 'data-core',
    category: 'cyberpunk',
    description: '数据核心',
    colors: ['#00f0ff', '#9d00ff', '#ff0080']
  },
  {
    name: 'synapse',
    category: 'cyberpunk',
    description: '突触连接',
    colors: ['#00f0ff', '#9d00ff']
  },
  {
    name: 'quantum-bit',
    category: 'cyberpunk',
    description: '量子比特',
    colors: ['#00f0ff', '#9d00ff', '#ff0080']
  },
  // 现有赛博朋克图标
  {
    name: 'microchip',
    category: 'cyberpunk',
    description: '微芯片',
    colors: ['#00f0ff']
  },
  {
    name: 'circuit-board',
    category: 'cyberpunk',
    description: '电路板',
    colors: ['#00f0ff']
  },
  {
    name: 'neon-grid',
    category: 'cyberpunk',
    description: '霓虹网格',
    colors: ['#00f0ff', '#9d00ff']
  },
  {
    name: 'hologram-display',
    category: 'cyberpunk',
    description: '全息显示器',
    colors: ['#00f0ff']
  },
  {
    name: 'data-stream',
    category: 'cyberpunk',
    description: '数据流',
    colors: ['#00f0ff']
  },
  {
    name: 'robot-eye',
    category: 'cyberpunk',
    description: '机械眼',
    colors: ['#00f0ff', '#ff0080']
  },
  {
    name: 'quantum-core',
    category: 'cyberpunk',
    description: '量子核心',
    colors: ['#00f0ff', '#9d00ff']
  },
  {
    name: 'neural-network',
    category: 'cyberpunk',
    description: '神经网络',
    colors: ['#00f0ff']
  }
];

export interface CyberIconGalleryProps {
  /** 图标分类 */
  category?: 'all' | 'cyberpunk' | 'basic';
  /** 每行显示的图标数量 */
  columns?: number;
  /** 是否显示描述 */
  showDescription?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

export const CyberIconGallery: React.FC<CyberIconGalleryProps> = ({
  category = 'all',
  columns = 4,
  showDescription = true,
  className = ''
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  // 过滤图标
  const filteredIcons = cyberIcons.filter(icon => {
    if (category === 'all') return true;
    return icon.category === category;
  });

  // 复制图标代码
  const copyIconCode = (iconName: string) => {
    const code = `<Icon name="${iconName}" size={24} />`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className={`cyber-icon-gallery ${className}`}>
      {/* 图标网格 */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {filteredIcons.map((icon) => (
          <div
            key={icon.name}
            className="group relative bg-cyber-muted/50 border border-cyber-cyan/20 rounded-lg p-6 hover:border-cyber-cyan/50 transition-all duration-300 hover:shadow-glow-cyan cursor-pointer"
            onClick={() => setSelectedIcon(icon.name)}
            onDoubleClick={() => copyIconCode(icon.name)}
          >
            {/* 图标预览 */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src={`/icons/cyberpunk/${icon.name}.svg`}
                  alt={icon.description}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* 图标信息 */}
            <div className="text-center">
              <h3 className="text-cyber-cyan font-mono text-sm mb-2">
                {icon.name}
              </h3>
              {showDescription && (
                <p className="text-cyber-gray-200 text-xs mb-3">
                  {icon.description}
                </p>
              )}

              {/* 颜色指示器 */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {icon.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}80`
                    }}
                    title={color}
                  />
                ))}
              </div>

              {/* 操作提示 */}
              <div className="text-xs text-cyber-cyan/60">
                {copiedIcon === icon.name ? (
                  <span className="text-cyber-green">✓ 已复制</span>
                ) : (
                  <span>双击复制代码</span>
                )}
              </div>
            </div>

            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-cyber-cyan/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* 选中图标详情 */}
      {selectedIcon && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIcon(null)}
        >
          <div
            className="bg-cyber-muted border border-cyber-cyan/30 rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const icon = cyberIcons.find(i => i.name === selectedIcon);
              if (!icon) return null;

              return (
                <>
                  {/* 关闭按钮 */}
                  <button
                    className="absolute top-4 right-4 text-cyber-cyan hover:text-cyber-purple transition-colors"
                    onClick={() => setSelectedIcon(null)}
                  >
                    ✕
                  </button>

                  {/* 图标大图 */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <Image
                        src={`/icons/cyberpunk/${icon.name}.svg`}
                        alt={icon.description}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* 图标信息 */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-cyber-cyan mb-2 font-mono">
                        {icon.name}
                      </h2>
                      <p className="text-cyber-gray-200">
                        {icon.description}
                      </p>
                    </div>

                    {/* 使用代码 */}
                    <div className="bg-cyber-dark/50 rounded-lg p-4">
                      <p className="text-xs text-cyber-cyan/60 mb-2">使用代码：</p>
                      <code className="text-sm text-cyber-green font-mono">
                        {`<Icon name="${icon.name}" size={24} />`}
                      </code>
                    </div>

                    {/* 配色信息 */}
                    <div>
                      <p className="text-sm text-cyber-cyan/60 mb-2">配色方案：</p>
                      <div className="flex gap-3">
                        {icon.colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-white/20"
                              style={{
                                backgroundColor: color,
                                boxShadow: `0 0 12px ${color}80`
                              }}
                            />
                            <span className="text-xs font-mono text-cyber-gray-200">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3 pt-4">
                      <button
                        className="flex-1 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan text-cyber-cyan py-2 px-4 rounded transition-colors"
                        onClick={() => copyIconCode(icon.name)}
                      >
                        {copiedIcon === icon.name ? '✓ 已复制' : '复制代码'}
                      </button>
                      <button
                        className="flex-1 bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple text-cyber-purple py-2 px-4 rounded transition-colors"
                        onClick={() => setSelectedIcon(null)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberIconGallery;
