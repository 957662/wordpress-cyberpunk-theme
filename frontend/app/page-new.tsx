/**
 * CyberPress 首页
 * 赛博朋克风格展示页面
 */

import { CyberHero } from '@/components/home';
import { BlogCard } from '@/components/blog';
import { MatrixRain } from '@/components/effects';
import { usePosts } from '@/lib/hooks/useWordPress';
import Link from 'next/link';

export default function HomePage() {
  const { data: postsData, isLoading } = usePosts({ perPage: 3 });
  const posts = postsData?.data || [];

  return (
    <main className="relative min-h-screen bg-deep-black">
      {/* Matrix 雨效果背景 */}
      <MatrixRain density={0.03} />

      {/* Hero Section */}
      <CyberHero
        title="欢迎来到 CyberPress"
        subtitle="赛博朋克风格的下一代博客平台"
        ctaText="探索文章"
        ctaLink="/blog"
      />

      {/* 最新文章 */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-orbitron font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
          最新文章
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-transparent border-2 border-cyber-cyan text-cyber-cyan font-orbitron font-bold rounded-lg hover:bg-cyber-cyan hover:text-deep-black transition-all duration-300"
          >
            查看更多文章
          </Link>
        </div>
      </section>

      {/* 特性展示 */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-cyber-purple/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-pink">
            核心特性
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '⚡ 极速加载',
                description: '基于 Next.js 14 App Router，享受极致性能',
                color: 'border-cyber-cyan',
              },
              {
                title: '🎨 赛博朋克',
                description: '独特视觉风格，未来科技感十足',
                color: 'border-cyber-purple',
              },
              {
                title: '📱 完全响应式',
                description: '完美适配各种设备和屏幕尺寸',
                color: 'border-cyber-pink',
              },
              {
                title: '🔍 智能搜索',
                description: '快速找到你感兴趣的内容',
                color: 'border-cyber-yellow',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 ${feature.color} bg-deep-black/80 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              >
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
