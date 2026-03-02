/**
 * CyberPress Pattern Showcase
 *
 * 赛博朋克图案展示组件
 *
 * @example
 * ```tsx
 * import { PatternShowcase } from '@/components/graphics/PatternShowcase';
 *
 * <PatternShowcase />
 * ```
 */

import React, { useState } from 'react';

// 图案接口
export interface Pattern {
  id: string;
  name: string;
  category: 'geometric' | 'abstract' | 'tech' | 'texture';
  preview: string;
  css: string;
  description: string;
}

// 图案数据
const PATTERNS: Pattern[] = [
  {
    id: 'hexagon-grid',
    name: 'Hexagon Grid',
    category: 'geometric',
    preview: '/assets/patterns/cyberpunk-patterns.svg',
    css: `background-image: url('/assets/patterns/cyberpunk-patterns.svg'); background-repeat: repeat;`,
    description: '六边形网格图案，科技感十足',
  },
  {
    id: 'circuit-grid',
    name: 'Circuit Grid',
    category: 'tech',
    preview: '/assets/patterns/cyberpunk-patterns.svg',
    css: `background-image: url('/assets/patterns/cyberpunk-patterns.svg'); background-repeat: repeat;`,
    description: '电路板网格图案，适合科技主题',
  },
  {
    id: 'scanlines',
    name: 'Scanlines',
    category: 'texture',
    preview: '/assets/patterns/cyberpunk-patterns.svg',
    css: `background-image: url('/assets/patterns/cyberpunk-patterns.svg'); background-repeat: repeat;`,
    description: '扫描线效果，复古显示器风格',
  },
  {
    id: 'dot-matrix',
    name: 'Dot Matrix',
    category: 'geometric',
    preview: '/assets/patterns/cyberpunk-patterns.svg',
    css: `background-image: url('/assets/patterns/cyberpunk-patterns.svg'); background-repeat: repeat;`,
    description: '点阵图案，简约而经典',
  },
];

// 组件属性
export interface PatternShowcaseProps {
  /** 显示的分类 */
  category?: 'all' | Pattern['category'];
  /** 点击事件 */
  onPatternClick?: (pattern: Pattern) => void;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 单个图案卡片
 */
const PatternCard: React.FC<{
  pattern: Pattern;
  onClick?: () => void;
}> = ({ pattern, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-dark-gray rounded-lg overflow-hidden border border-medium-gray hover:border-cyber-cyan transition-all cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 预览区 */}
      <div
        className="h-40 relative"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            #0a0a0f,
            #0a0a0f 10px,
            #111 10px,
            #111 20px
          )`,
        }}
      >
        {/* 装饰性图案 */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, ${isHovered ? '#00f0ff' : '#9d00ff'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />
        </div>

        {/* 悬停效果 */}
        <div className={`absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* 分类标签 */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/70 rounded text-xs text-cyber-cyan uppercase">
            {pattern.category}
          </span>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
          {pattern.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {pattern.description}
        </p>

        {/* CSS 代码预览 */}
        <div className="bg-black/50 rounded p-2 overflow-hidden">
          <code className="text-xs text-cyber-purple truncate block">
            {pattern.css}
          </code>
        </div>
      </div>
    </div>
  );
};

/**
 * 图案展示主组件
 */
export const PatternShowcase: React.FC<PatternShowcaseProps> = ({
  category = 'all',
  onPatternClick,
  className = '',
}) => {
  // 过滤图案
  const filteredPatterns = category === 'all'
    ? PATTERNS
    : PATTERNS.filter(pattern => pattern.category === category);

  return (
    <div className={className}>
      {/* 统计信息 */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          显示 <span className="text-cyber-cyan font-semibold">{filteredPatterns.length}</span> 个图案
          {category !== 'all' && ` - 分类: ${category}`}
        </p>
      </div>

      {/* 图案列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPatterns.map(pattern => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            onClick={() => onPatternClick?.(pattern)}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">没有找到相关图案</p>
        </div>
      )}
    </div>
  );
};

/**
 * 图案预览器
 */
export const PatternPreviewer: React.FC<{
  pattern?: Pattern;
  className?: string;
}> = ({ pattern, className = '' }) => {
  if (!pattern) {
    return (
      <div className={`bg-dark-gray rounded-lg border border-dashed border-medium-gray p-8 ${className}`}>
        <p className="text-center text-gray-400">选择一个图案查看预览</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 全尺寸预览 */}
      <div className="bg-dark-gray rounded-lg overflow-hidden border border-cyber-cyan">
        <div className="p-4 border-b border-medium-gray flex items-center justify-between">
          <h3 className="font-semibold text-cyber-cyan">{pattern.name}</h3>
          <span className="text-xs text-gray-400">{pattern.category}</span>
        </div>

        {/* 预览区 */}
        <div
          className="h-64 relative"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              #0a0a0f,
              #0a0a0f 10px,
              #111 10px,
              #111 20px
            )`,
          }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, #00f0ff 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
          </div>

          {/* 中心标签 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-cyber-cyan mb-2">{pattern.name}</p>
              <p className="text-sm text-gray-400">图案预览</p>
            </div>
          </div>
        </div>

        {/* 使用代码 */}
        <div className="p-4">
          <p className="text-sm text-gray-400 mb-2">CSS 代码:</p>
          <div className="bg-black/50 rounded p-3">
            <pre className="text-sm text-cyber-purple overflow-x-auto">
              {pattern.css}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 图案选择器
 */
export const PatternSelector: React.FC<{
  value?: Pattern;
  onChange: (pattern: Pattern) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {PATTERNS.map(pattern => (
        <button
          key={pattern.id}
          className={`p-4 rounded-lg border-2 transition-all ${
            value?.id === pattern.id
              ? 'border-cyber-cyan bg-cyber-cyan/10'
              : 'border-medium-gray hover:border-cyber-purple'
          }`}
          onClick={() => onChange(pattern)}
        >
          <div
            className="h-20 rounded mb-2"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #0a0a0f,
                #0a0a0f 5px,
                #111 5px,
                #111 10px
              )`,
            }}
          />
          <p className="text-sm text-center text-gray-300">{pattern.name}</p>
        </button>
      ))}
    </div>
  );
};

/**
 * 图案筛选器
 */
export const PatternFilter: React.FC<{
  value: 'all' | Pattern['category'];
  onChange: (category: 'all' | Pattern['category']) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  const filters = [
    { value: 'all', label: '全部' },
    { value: 'geometric', label: '几何' },
    { value: 'abstract', label: '抽象' },
    { value: 'tech', label: '科技' },
    { value: 'texture', label: '纹理' },
  ] as const;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`px-4 py-2 rounded-lg transition-all ${
            value === filter.value
              ? 'bg-cyber-cyan text-black font-semibold'
              : 'bg-dark-gray text-gray-400 hover:text-white border border-medium-gray'
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

/**
 * 图案统计卡片
 */
export const PatternStats: React.FC<{ className?: string }> = ({ className = '' }) => {
  const stats = {
    total: PATTERNS.length,
    byCategory: {
      geometric: PATTERNS.filter(p => p.category === 'geometric').length,
      abstract: PATTERNS.filter(p => p.category === 'abstract').length,
      tech: PATTERNS.filter(p => p.category === 'tech').length,
      texture: PATTERNS.filter(p => p.category === 'texture').length,
    },
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* 总数 */}
      <div className="bg-dark-gray rounded-lg p-6 border border-medium-gray">
        <p className="text-sm text-gray-400 mb-2">总图案数</p>
        <p className="text-4xl font-bold text-cyber-cyan">{stats.total}</p>
      </div>

      {/* 按分类 */}
      <div className="bg-dark-gray rounded-lg p-6 border border-medium-gray">
        <p className="text-sm text-gray-400 mb-4">按分类</p>
        <div className="space-y-2">
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <div key={cat} className="flex justify-between items-center">
              <span className="text-sm capitalize text-gray-300">{cat}</span>
              <span className="text-sm font-semibold text-cyber-purple">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternShowcase;
