'use client';

/**
 * Icon Gallery Examples - 图标画廊示例页面
 */

import { IconGallery } from '@/components/icons';

export default function IconGalleryExamples() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            赛博朋克图标库
          </h1>
          <p className="text-xl text-gray-400">
            支持发光、动画等效果的图标组件
          </p>
        </div>

        {/* 图标画廊 */}
        <IconGallery />

        {/* 使用示例 */}
        <div className="cyber-card p-6 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">快速示例</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card p-4 text-center">
              <div className="text-cyber-cyan text-4xl mb-2">⚡</div>
              <p className="text-sm text-gray-400">基础图标</p>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-cyber-purple text-4xl mb-2 animate-pulse">✨</div>
              <p className="text-sm text-gray-400">脉冲动画</p>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-cyber-pink text-4xl mb-2 animate-spin">🔄</div>
              <p className="text-sm text-gray-400">旋转动画</p>
            </div>
            <div className="cyber-card p-4 text-center">
              <div className="text-cyber-yellow text-4xl mb-2 animate-bounce">⬆️</div>
              <p className="text-sm text-gray-400">弹跳动画</p>
            </div>
          </div>
        </div>

        {/* API 文档 */}
        <div className="cyber-card p-6 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">API 文档</h2>
          <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { CyberIcon } from '@/components/icons';
import { Star } from 'lucide-react';

interface CyberIconProps {
  icon: LucideIcon;        // Lucide 图标组件
  size?: number;           // 图标大小 (默认: 24)
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  customColor?: string;    // 自定义颜色
  glow?: boolean;          // 是否发光
  glowIntensity?: 'low' | 'medium' | 'high';
  spin?: boolean;          // 旋转动画
  pulse?: boolean;         // 脉冲动画
  bounce?: boolean;        // 弹跳动画
  className?: string;      // 自定义样式
}

// 示例
<CyberIcon icon={Star} size={32} color="cyan" glow />
<CyberIcon icon={Star} color="purple" spin />
<CyberIcon icon={Star} color="pink" pulse glowIntensity="high" />}
          </pre>
        </div>
      </div>
    </div>
  );
}
