'use client';

/**
 * Decoration Showcase Component
 * 展示项目中所有可用的装饰元素
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Decoration {
  id: string;
  name: string;
  path: string;
  category: 'corner' | 'divider' | 'frame' | 'loader' | 'effect';
  description: string;
}

const decorations: Decoration[] = [
  // Corners
  {
    id: 'corner-bracket',
    name: 'Corner Bracket',
    path: '/decorations/corner-bracket.svg',
    category: 'corner',
    description: '角落装饰括号'
  },
  {
    id: 'cyber-corners',
    name: 'Cyber Corners',
    path: '/decorations/cyber-corners.svg',
    category: 'corner',
    description: '赛博朋克风格四角装饰'
  },
  {
    id: 'tech-corner',
    name: 'Tech Corner',
    path: '/decorations/tech-corner.svg',
    category: 'corner',
    description: '科技感角落装饰'
  },
  {
    id: 'corner-accent',
    name: 'Corner Accent',
    path: '/decorations/corner-accent.svg',
    category: 'corner',
    description: '强调角装饰'
  },

  // Dividers
  {
    id: 'divider-line',
    name: 'Divider Line',
    path: '/decorations/divider-line.svg',
    category: 'divider',
    description: '基础分隔线'
  },
  {
    id: 'divider-tech',
    name: 'Tech Divider',
    path: '/decorations/divider-tech.svg',
    category: 'divider',
    description: '科技风格分隔线'
  },
  {
    id: 'divider-cyber',
    name: 'Cyber Divider',
    path: '/decorations/divider-cyber.svg',
    category: 'divider',
    description: '赛博朋克分隔线'
  },

  // Frames
  {
    id: 'tech-frame',
    name: 'Tech Frame',
    path: '/decorations/tech-frame.svg',
    category: 'frame',
    description: '科技边框'
  },
  {
    id: 'cyber-frame',
    name: 'Cyber Frame',
    path: '/decorations/cyber-frame.svg',
    category: 'frame',
    description: '赛博朋克框架'
  },
  {
    id: 'hexagon-frame',
    name: 'Hexagon Frame',
    path: '/decorations/hexagon-frame.svg',
    category: 'frame',
    description: '六边形框架'
  },

  // Loaders
  {
    id: 'loader-ring',
    name: 'Loader Ring',
    path: '/decorations/loader-ring.svg',
    category: 'loader',
    description: '环形加载动画'
  },
  {
    id: 'loader-ring-animated',
    name: 'Loader Ring Animated',
    path: '/decorations/loader-ring-animated.svg',
    category: 'loader',
    description: '动画环形加载器'
  },
  {
    id: 'cyber-loader',
    name: 'Cyber Loader',
    path: '/decorations/cyber-loader.svg',
    category: 'loader',
    description: '赛博朋克加载器'
  },

  // Effects
  {
    id: 'glow-line',
    name: 'Glow Line',
    path: '/decorations/glow-line.svg',
    category: 'effect',
    description: '发光线条'
  },
  {
    id: 'holo-line',
    name: 'Holo Line',
    path: '/decorations/holo-line.svg',
    category: 'effect',
    description: '全息线条'
  },
  {
    id: 'holographic-effect',
    name: 'Holographic Effect',
    path: '/decorations/holographic-effect.svg',
    category: 'effect',
    description: '全息效果'
  },
  {
    id: 'hologram-effect',
    name: 'Hologram Effect',
    path: '/decorations/hologram-effect.svg',
    category: 'effect',
    description: '全息投影效果'
  },
  {
    id: 'data-stream',
    name: 'Data Stream',
    path: '/decorations/data-stream.svg',
    category: 'effect',
    description: '数据流效果'
  },
  {
    id: 'tech-ring',
    name: 'Tech Ring',
    path: '/decorations/tech-ring.svg',
    category: 'effect',
    description: '科技光环'
  },
];

const categories = [
  { id: 'all', name: 'All', color: 'from-cyber-cyan to-cyber-purple' },
  { id: 'corner', name: 'Corners', color: 'from-cyber-pink to-cyber-purple' },
  { id: 'divider', name: 'Dividers', color: 'from-cyber-cyan to-cyber-green' },
  { id: 'frame', name: 'Frames', color: 'from-cyber-purple to-cyber-cyan' },
  { id: 'loader', name: 'Loaders', color: 'from-cyber-yellow to-cyber-pink' },
  { id: 'effect', name: 'Effects', color: 'from-cyber-green to-cyber-cyan' },
];

export function DecorationShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null);

  const filteredDecorations = selectedCategory === 'all'
    ? decorations
    : decorations.filter(dec => dec.category === selectedCategory);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-4">
          Decoration Gallery
        </h1>
        <p className="text-gray-400">
          Browse and use {decorations.length} cyberpunk-styled decorative elements
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-cyber-cyan/50`
                : 'bg-cyber-card border border-cyber-border text-gray-400 hover:border-cyber-cyan'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Decorations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecorations.map((decoration, index) => (
          <motion.div
            key={decoration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-cyber-card border border-cyber-border rounded-lg overflow-hidden hover:border-cyber-cyan transition-all"
          >
            {/* Preview */}
            <div className="aspect-video bg-cyber-darker p-6 flex items-center justify-center">
              <img
                src={decoration.path}
                alt={decoration.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-white font-medium mb-1">{decoration.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{decoration.description}</p>
              <p className="text-xs text-cyber-cyan mb-3 font-mono">{decoration.path}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setSelectedDecoration(decoration)}
                  className="flex-1 px-3 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-cyber-cyan text-sm hover:bg-cyber-cyan/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Preview
                </motion.button>
                <motion.button
                  onClick={() => copyPath(decoration.path)}
                  className="px-3 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded text-cyber-purple text-sm hover:bg-cyber-purple/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Copy
                </motion.button>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-cyber-dark/80 rounded text-xs text-gray-400 border border-cyber-border">
              {decoration.category}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedDecoration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedDecoration(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyber-card border border-cyber-cyan rounded-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-cyber-card/95 backdrop-blur border-b border-cyber-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedDecoration.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedDecoration.description}</p>
              </div>
              <button
                onClick={() => setSelectedDecoration(null)}
                className="p-2 hover:bg-cyber-border rounded transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="p-8 bg-cyber-darker">
              <div className="aspect-video bg-cyber-dark rounded-lg p-8 flex items-center justify-center">
                <img
                  src={selectedDecoration.path}
                  alt={selectedDecoration.name}
                  className="max-w-full max-h-full"
                />
              </div>
            </div>

            {/* Usage Code */}
            <div className="p-6 border-t border-cyber-border">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Usage Example</h3>
              <pre className="bg-cyber-darker p-4 rounded-lg text-sm text-cyber-cyan overflow-x-auto">
{`<img
  src="${selectedDecoration.path}"
  alt="${selectedDecoration.name}"
  className="w-full h-auto"
/>`}
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.slice(1).map((cat) => {
          const count = decorations.filter(d => d.category === cat.id).length;
          return (
            <motion.div
              key={cat.id}
              className="bg-cyber-card border border-cyber-border rounded-lg p-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-1">
                {count}
              </div>
              <div className="text-xs text-gray-400">{cat.name}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default DecorationShowcase;
