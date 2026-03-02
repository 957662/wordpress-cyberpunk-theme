'use client';

import { useState } from 'react';

interface IllustrationGalleryProps {
  className?: string;
}

/**
 * 插画画廊组件
 * 展示项目中所有可用的赛博朋克风格插画
 */
export const IllustrationGallery = ({ className = '' }: IllustrationGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const illustrations = [
    {
      id: 'cyber-city',
      name: 'Cyber City',
      src: '/illustrations/cyber-city.svg',
      description: '赛博朋克城市景观，霓虹灯与未来建筑',
      category: '场景'
    },
    {
      id: 'developer-workspace',
      name: 'Developer Workspace',
      src: '/illustrations/developer-workspace.svg',
      description: '开发者工作区，代码与咖啡',
      category: '工作'
    },
    {
      id: 'ai-neural-network',
      name: 'AI Neural Network',
      src: '/illustrations/ai-neural-network.svg',
      description: 'AI 神经网络可视化，数据流动',
      category: '技术'
    },
    {
      id: 'cyber-portal',
      name: 'Cyber Portal',
      src: '/illustrations/cyber-portal.svg',
      description: '赛博传送门，维度穿越',
      category: '科幻'
    },
    {
      id: 'cyberpunk-hacker',
      name: 'Cyberpunk Hacker',
      src: '/illustrations/cyberpunk-hacker.svg',
      description: '赛博朋克黑客，数字入侵',
      category: '角色'
    },
    {
      id: 'server-rack',
      name: 'Server Rack',
      src: '/illustrations/server-rack.svg',
      description: '服务器机架，数据中心',
      category: '硬件'
    },
    {
      id: 'circuit-board',
      name: 'Circuit Board',
      src: '/illustrations/circuit-board.svg',
      description: '电路板图案，科技纹理',
      category: '纹理'
    },
    {
      id: 'network-globe',
      name: 'Network Globe',
      src: '/illustrations/network-globe.svg',
      description: '网络地球，全球连接',
      category: '网络'
    },
    {
      id: 'code-screen',
      name: 'Code Screen',
      src: '/illustrations/code-screen.svg',
      description: '代码屏幕，编程界面',
      category: '界面'
    },
    {
      id: 'network-nodes',
      name: 'Network Nodes',
      src: '/illustrations/network-nodes.svg',
      description: '网络节点，分布式系统',
      category: '网络'
    }
  ];

  const categories = Array.from(new Set(illustrations.map(img => img.category)));

  return (
    <div className={`illustration-gallery ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
          Illustration Gallery
        </h2>
        <p className="text-cyber-muted">
          赛博朋克风格插画库，包含场景、角色、技术等多种主题
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedImage(null)}
          className="px-4 py-2 rounded-lg border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark transition-all"
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedImage(null)}
            className="px-4 py-2 rounded-lg border border-cyber-border text-cyber-muted hover:border-cyber-purple hover:text-cyber-purple transition-all"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {illustrations.map((illustration) => (
          <div
            key={illustration.id}
            className="group relative bg-cyber-card border border-cyber-border rounded-lg overflow-hidden hover:border-cyber-cyan transition-all cursor-pointer"
            onClick={() => setSelectedImage(illustration.src)}
          >
            {/* Image Preview */}
            <div className="aspect-video bg-cyber-dark relative overflow-hidden">
              <img
                src={illustration.src}
                alt={illustration.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>

              {/* View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-semibold hover:bg-cyber-purple transition-colors">
                  查看详情
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-cyber-cyan">{illustration.name}</h3>
                <span className="text-xs px-2 py-1 bg-cyber-muted text-cyber-cyan rounded">
                  {illustration.category}
                </span>
              </div>
              <p className="text-sm text-cyber-muted">{illustration.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Full View */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-cyber-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute -top-10 right-0 text-cyber-cyan hover:text-cyber-purple transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full h-auto rounded-lg border border-cyber-cyan"
            />
          </div>
        </div>
      )}
    </div>
  );
};
